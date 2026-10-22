import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getSession } from '@/lib/auth';

function slugify(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');
}

export async function GET() {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ message: 'Akses ditolak.' }, { status: 401 });
  }

  try {
    const [divisions, timeline, articles] = await Promise.all([
      prisma.division.findMany({
        orderBy: { sortOrder: 'asc' },
        include: {
          members: { where: { isActive: 1 }, orderBy: { sortOrder: 'asc' } },
          programs: { orderBy: { createdAt: 'asc' } },
        },
      }),
      prisma.timelineEvent.findMany({ orderBy: [{ sortOrder: 'asc' }, { year: 'asc' }] }),
      prisma.article.findMany({
        where: { status: 'published' },
        orderBy: [{ publishedAt: 'desc' }, { createdAt: 'desc' }],
        take: 3,
        select: { id: true, title: true, excerpt: true, coverImageUrl: true, publishedAt: true },
      }),
    ]);

    return NextResponse.json({ divisions, timeline, articles });
  } catch (error) {
    console.error('Fetch about content error:', error);
    return NextResponse.json({ message: 'Gagal memuat konten Tentang Kami.' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ message: 'Akses ditolak.' }, { status: 401 });
  }

  try {
    const { resource, data } = await req.json();

    if (resource === 'division') {
      if (!data?.name?.trim()) {
        return NextResponse.json({ message: 'Nama divisi wajib diisi.' }, { status: 400 });
      }
      const name = data.name.trim();
      const division = await prisma.division.create({
        data: {
          name,
          slug: `${slugify(name)}-${Date.now().toString().slice(-5)}`,
          description: data.description?.trim() || null,
          sortOrder: Number(data.sortOrder) || 0,
        },
      });
      return NextResponse.json({ message: 'Divisi berhasil ditambahkan.', item: division }, { status: 201 });
    }

    if (resource === 'member') {
      if (!data?.name?.trim() || !data?.position?.trim() || !Number(data.divisionId)) {
        return NextResponse.json({ message: 'Nama, jabatan, dan divisi anggota wajib diisi.' }, { status: 400 });
      }
      const member = await prisma.member.create({
        data: {
          divisionId: Number(data.divisionId),
          name: data.name.trim(),
          position: data.position.trim(),
          photoUrl: data.photoUrl || null,
          sortOrder: Number(data.sortOrder) || 0,
        },
      });
      return NextResponse.json({ message: 'Anggota berhasil ditambahkan.', item: member }, { status: 201 });
    }

    if (resource === 'program') {
      if (!Number(data?.divisionId) || !data?.name?.trim()) {
        return NextResponse.json({ message: 'Nama proker dan divisi wajib diisi.' }, { status: 400 });
      }
      const program = await prisma.divisionProgram.create({
        data: {
          divisionId: Number(data.divisionId),
          name: data.name.trim(),
          description: data.description?.trim() || '',
          targetOutput: data.targetOutput?.trim() || null,
        },
      });
      return NextResponse.json({ message: 'Proker berhasil ditambahkan.', item: program }, { status: 201 });
    }

    if (resource === 'timeline') {
      if (!data?.year?.trim() || !data?.title?.trim()) {
        return NextResponse.json({ message: 'Tahun dan judul perjalanan wajib diisi.' }, { status: 400 });
      }
      const event = await prisma.timelineEvent.create({
        data: {
          year: data.year.trim(),
          title: data.title.trim(),
          description: data.description?.trim() || '',
          sortOrder: Number(data.sortOrder) || 0,
        },
      });
      return NextResponse.json({ message: 'Timeline berhasil ditambahkan.', item: event }, { status: 201 });
    }

    return NextResponse.json({ message: 'Jenis data tidak dikenali.' }, { status: 400 });
  } catch (error) {
    console.error('Create about content error:', error);
    return NextResponse.json({ message: 'Gagal menambahkan data.' }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ message: 'Akses ditolak.' }, { status: 401 });
  }

  try {
    const { resource, id, data } = await req.json();
    const itemId = Number(id);
    if (!itemId) {
      return NextResponse.json({ message: 'ID data tidak valid.' }, { status: 400 });
    }

    if (resource === 'division') {
      const item = await prisma.division.update({
        where: { id: itemId },
        data: {
          name: data.name?.trim(),
          description: data.description?.trim() || null,
          sortOrder: Number(data.sortOrder) || 0,
        },
      });
      return NextResponse.json({ message: 'Divisi berhasil diperbarui.', item });
    }

    if (resource === 'member') {
      const item = await prisma.member.update({
        where: { id: itemId },
        data: {
          divisionId: Number(data.divisionId),
          name: data.name?.trim(),
          position: data.position?.trim(),
          photoUrl: data.photoUrl || null,
          sortOrder: Number(data.sortOrder) || 0,
        },
      });
      return NextResponse.json({ message: 'Profil anggota berhasil diperbarui.', item });
    }

    if (resource === 'program') {
      const item = await prisma.divisionProgram.update({
        where: { id: itemId },
        data: {
          divisionId: Number(data.divisionId),
          name: data.name?.trim(),
          description: data.description?.trim() || '',
          targetOutput: data.targetOutput?.trim() || null,
        },
      });
      return NextResponse.json({ message: 'Proker berhasil diperbarui.', item });
    }

    if (resource === 'timeline') {
      const item = await prisma.timelineEvent.update({
        where: { id: itemId },
        data: {
          year: data.year?.trim(),
          title: data.title?.trim(),
          description: data.description?.trim() || '',
          sortOrder: Number(data.sortOrder) || 0,
        },
      });
      return NextResponse.json({ message: 'Timeline berhasil diperbarui.', item });
    }

    return NextResponse.json({ message: 'Jenis data tidak dikenali.' }, { status: 400 });
  } catch (error) {
    console.error('Update about content error:', error);
    return NextResponse.json({ message: 'Gagal memperbarui data.' }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ message: 'Akses ditolak.' }, { status: 401 });
  }

  try {
    const resource = req.nextUrl.searchParams.get('resource');
    const id = Number(req.nextUrl.searchParams.get('id'));
    if (!id) {
      return NextResponse.json({ message: 'ID data tidak valid.' }, { status: 400 });
    }

    if (resource === 'division') await prisma.division.delete({ where: { id } });
    else if (resource === 'member') await prisma.member.update({ where: { id }, data: { isActive: 0 } });
    else if (resource === 'program') await prisma.divisionProgram.delete({ where: { id } });
    else if (resource === 'timeline') await prisma.timelineEvent.delete({ where: { id } });
    else return NextResponse.json({ message: 'Jenis data tidak dikenali.' }, { status: 400 });

    return NextResponse.json({ message: 'Data berhasil dihapus.' });
  } catch (error) {
    console.error('Delete about content error:', error);
    return NextResponse.json({ message: 'Gagal menghapus data.' }, { status: 500 });
  }
}