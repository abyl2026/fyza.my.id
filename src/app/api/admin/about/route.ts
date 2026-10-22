import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getSession } from '@/lib/auth';

export const dynamic = 'force-dynamic';

function slugify(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');
}

/**
 * GET /api/admin/about
 * Mengambil data profil organisasi, pimpinan, struktur divisi, dan timeline untuk AboutManager
 */
export async function GET() {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ message: 'Akses ditolak.' }, { status: 401 });
  }

  try {
    const [org, leader, divisions, timeline] = await Promise.all([
      prisma.organizationProfile.findFirst(),
      prisma.leaderProfile.findFirst({ where: { isActive: 1 } }),
      prisma.division.findMany({
        orderBy: { sortOrder: 'asc' },
        include: {
          members: { where: { isActive: 1 }, orderBy: { sortOrder: 'asc' } },
          programs: { orderBy: { createdAt: 'asc' } },
        },
      }),
      prisma.timelineEvent.findMany({
        orderBy: [{ sortOrder: 'asc' }, { year: 'asc' }],
      }),
    ]);

    // Format data profil sesuai ekspektasi AboutManager
    let parsedMission = '';
    if (org?.mission) {
      try {
        const arr = JSON.parse(org.mission);
        if (Array.isArray(arr)) {
          parsedMission = arr.join('\n');
        } else {
          parsedMission = String(org.mission);
        }
      } catch {
        parsedMission = org.mission;
      }
    }

    const profile = {
      vision: org?.vision || '',
      mission: parsedMission,
      motto: org?.motto || '',
      mottoDescription: org?.mottoDescription || '',
      leaderName: leader?.name || '',
      leaderPosition: leader?.position || 'Ketua Umum',
      leaderPeriod: leader?.period || '',
      leaderQuote: leader?.quote || '',
      leaderPhotoUrl: leader?.photoUrl || '',
      leaderInstagram: leader?.instagramUrl || '',
      leaderLinkedin: leader?.linkedinUrl || '',
    };

    return NextResponse.json({
      profile,
      divisions,
      timeline,
    });
  } catch (error) {
    console.error('Error fetching admin about data:', error);
    return NextResponse.json(
      { message: 'Gagal memuat data profil Tentang Kami.' },
      { status: 500 }
    );
  }
}

/**
 * POST /api/admin/about
 * Menambahkan division, member, program, atau timeline
 */
export async function POST(req: NextRequest) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ message: 'Akses ditolak.' }, { status: 401 });
  }

  try {
    const body = await req.json();
    const { action } = body;

    if (action === 'division') {
      const name = body.name?.trim();
      if (!name) {
        return NextResponse.json({ message: 'Nama divisi wajib diisi.' }, { status: 400 });
      }
      const division = await prisma.division.create({
        data: {
          name,
          slug: `${slugify(name)}-${Date.now().toString().slice(-5)}`,
          description: body.description?.trim() || null,
          sortOrder: Number(body.sortOrder) || 0,
        },
      });
      return NextResponse.json({ message: 'Divisi berhasil ditambahkan.', item: division }, { status: 201 });
    }

    if (action === 'member') {
      const name = body.name?.trim();
      const position = body.position?.trim();
      const divisionId = Number(body.divisionId);
      if (!name || !position || !divisionId) {
        return NextResponse.json({ message: 'Nama, jabatan, dan divisi anggota wajib diisi.' }, { status: 400 });
      }
      const member = await prisma.member.create({
        data: {
          divisionId,
          name,
          position,
          photoUrl: body.photoUrl?.trim() || null,
          sortOrder: Number(body.sortOrder) || 0,
          isActive: 1,
        },
      });
      return NextResponse.json({ message: 'Anggota berhasil ditambahkan.', item: member }, { status: 201 });
    }

    if (action === 'program') {
      const name = body.name?.trim();
      const divisionId = Number(body.divisionId);
      if (!name || !divisionId) {
        return NextResponse.json({ message: 'Nama proker dan divisi wajib diisi.' }, { status: 400 });
      }
      const program = await prisma.divisionProgram.create({
        data: {
          divisionId,
          name,
          description: body.description?.trim() || '',
          targetOutput: body.targetOutput?.trim() || null,
        },
      });
      return NextResponse.json({ message: 'Proker berhasil ditambahkan.', item: program }, { status: 201 });
    }

    if (action === 'timeline') {
      const year = body.year?.trim();
      const title = body.title?.trim();
      if (!year || !title) {
        return NextResponse.json({ message: 'Tahun dan judul perjalanan wajib diisi.' }, { status: 400 });
      }
      const event = await prisma.timelineEvent.create({
        data: {
          year,
          title,
          description: body.description?.trim() || '',
          sortOrder: Number(body.sortOrder) || 0,
        },
      });
      return NextResponse.json({ message: 'Milestone timeline berhasil ditambahkan.', item: event }, { status: 201 });
    }

    return NextResponse.json({ message: 'Aksi tidak dikenali.' }, { status: 400 });
  } catch (error) {
    console.error('Error creating about resource:', error);
    return NextResponse.json({ message: 'Gagal menambahkan data.' }, { status: 500 });
  }
}

/**
 * PUT /api/admin/about
 * Mengupdate profil pokok organisasi atau data entitas (division, member, program, timeline)
 */
export async function PUT(req: NextRequest) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ message: 'Akses ditolak.' }, { status: 401 });
  }

  try {
    const body = await req.json();
    const { action } = body;

    // 1. Simpan Profil Pokok Organisasi & Pimpinan
    if (action === 'profile') {
      const {
        vision,
        mission,
        motto,
        leaderName,
        leaderPosition,
        leaderPeriod,
        leaderQuote,
        leaderPhotoUrl,
        leaderInstagram,
        leaderLinkedin,
      } = body;

      // Format misi menjadi JSON array
      let formattedMission = '[]';
      if (mission) {
        const items = String(mission)
          .split('\n')
          .map((s) => s.trim())
          .filter(Boolean);
        formattedMission = JSON.stringify(items);
      }

      const existingOrg = await prisma.organizationProfile.findFirst();
      if (existingOrg) {
        await prisma.organizationProfile.update({
          where: { id: existingOrg.id },
          data: {
            vision: vision !== undefined ? vision : existingOrg.vision,
            mission: formattedMission,
            motto: motto !== undefined ? motto : existingOrg.motto,
          },
        });
      } else {
        await prisma.organizationProfile.create({
          data: {
            orgName: 'BAPEMA Cakrawala Universitas Muhammadiyah Jakarta',
            shortName: 'BAPEMA Cakrawala UMJ',
            tagline: 'Suara Cakrawala, Suara Mahasiswa!',
            motto: motto || 'Suara Cakrawala, Suara Mahasiswa!',
            mottoDescription: 'Motto ini menjadi kompas integritas dalam memberitakan kebenaran.',
            vision: vision || '',
            mission: formattedMission,
            aboutText: '',
          },
        });
      }

      const existingLeader = await prisma.leaderProfile.findFirst({ where: { isActive: 1 } });
      if (existingLeader) {
        await prisma.leaderProfile.update({
          where: { id: existingLeader.id },
          data: {
            name: leaderName !== undefined ? leaderName : existingLeader.name,
            position: leaderPosition !== undefined ? leaderPosition : existingLeader.position,
            period: leaderPeriod !== undefined ? leaderPeriod : existingLeader.period,
            quote: leaderQuote !== undefined ? leaderQuote : existingLeader.quote,
            photoUrl: leaderPhotoUrl !== undefined ? (leaderPhotoUrl || null) : existingLeader.photoUrl,
            instagramUrl: leaderInstagram !== undefined ? (leaderInstagram || null) : existingLeader.instagramUrl,
            linkedinUrl: leaderLinkedin !== undefined ? (leaderLinkedin || null) : existingLeader.linkedinUrl,
          },
        });
      } else {
        await prisma.leaderProfile.create({
          data: {
            name: leaderName || 'Ketua Umum',
            position: leaderPosition || 'Ketua Umum',
            period: leaderPeriod || 'Periode 2026/2027',
            quote: leaderQuote || 'Maju Bersama BAPEMA Cakrawala UMJ',
            photoUrl: leaderPhotoUrl || null,
            instagramUrl: leaderInstagram || null,
            linkedinUrl: leaderLinkedin || null,
            isActive: 1,
          },
        });
      }

      return NextResponse.json({ message: 'Profil organisasi berhasil diperbarui.' });
    }

    // 2. Update resource terpisah (division, member, program, timeline)
    const itemId = Number(body.id);
    if (!itemId) {
      return NextResponse.json({ message: 'ID data tidak valid.' }, { status: 400 });
    }

    if (action === 'division') {
      const item = await prisma.division.update({
        where: { id: itemId },
        data: {
          name: body.name?.trim(),
          description: body.description?.trim() || null,
          sortOrder: Number(body.sortOrder) || 0,
        },
      });
      return NextResponse.json({ message: 'Divisi berhasil diperbarui.', item });
    }

    if (action === 'member') {
      const item = await prisma.member.update({
        where: { id: itemId },
        data: {
          divisionId: Number(body.divisionId),
          name: body.name?.trim(),
          position: body.position?.trim(),
          photoUrl: body.photoUrl?.trim() || null,
          sortOrder: Number(body.sortOrder) || 0,
        },
      });
      return NextResponse.json({ message: 'Profil anggota berhasil diperbarui.', item });
    }

    if (action === 'program') {
      const item = await prisma.divisionProgram.update({
        where: { id: itemId },
        data: {
          divisionId: Number(body.divisionId),
          name: body.name?.trim(),
          description: body.description?.trim() || '',
          targetOutput: body.targetOutput?.trim() || null,
        },
      });
      return NextResponse.json({ message: 'Program kerja berhasil diperbarui.', item });
    }

    if (action === 'timeline') {
      const item = await prisma.timelineEvent.update({
        where: { id: itemId },
        data: {
          year: body.year?.trim(),
          title: body.title?.trim(),
          description: body.description?.trim() || '',
          sortOrder: Number(body.sortOrder) || 0,
        },
      });
      return NextResponse.json({ message: 'Milestone timeline berhasil diperbarui.', item });
    }

    return NextResponse.json({ message: 'Aksi tidak dikenali.' }, { status: 400 });
  } catch (error) {
    console.error('Error updating about resource:', error);
    return NextResponse.json({ message: 'Gagal memperbarui data.' }, { status: 500 });
  }
}

/**
 * DELETE /api/admin/about?action={resource}&id={id}
 * Menghapus division, member, program, atau timeline
 */
export async function DELETE(req: NextRequest) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ message: 'Akses ditolak.' }, { status: 401 });
  }

  try {
    const action = req.nextUrl.searchParams.get('action');
    const id = Number(req.nextUrl.searchParams.get('id'));

    if (!id || !action) {
      return NextResponse.json({ message: 'Parameter action dan ID wajib diisi.' }, { status: 400 });
    }

    if (action === 'division') {
      await prisma.division.delete({ where: { id } });
    } else if (action === 'member') {
      // Soft-delete member dengan isActive = 0 atau delete fisik jika cascade
      await prisma.member.update({ where: { id }, data: { isActive: 0 } });
    } else if (action === 'program') {
      await prisma.divisionProgram.delete({ where: { id } });
    } else if (action === 'timeline') {
      await prisma.timelineEvent.delete({ where: { id } });
    } else {
      return NextResponse.json({ message: 'Jenis data tidak dikenali.' }, { status: 400 });
    }

    return NextResponse.json({ message: 'Data berhasil dihapus.' });
  } catch (error) {
    console.error('Error deleting about resource:', error);
    return NextResponse.json({ message: 'Gagal menghapus data.' }, { status: 500 });
  }
}
