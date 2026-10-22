import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getSession } from '@/lib/auth';

export const dynamic = 'force-dynamic';

export async function GET() {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ message: 'Akses ditolak.' }, { status: 401 });
  }

  try {
    const [org, leader] = await Promise.all([
      prisma.organizationProfile.findFirst(),
      prisma.leaderProfile.findFirst({ where: { isActive: 1 } }),
    ]);

    return NextResponse.json({ org, leader });
  } catch (error) {
    console.error('Fetch profile error:', error);
    return NextResponse.json({ message: 'Gagal memuat profil organisasi.' }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ message: 'Akses ditolak.' }, { status: 401 });
  }

  try {
    const body = await req.json();
    const {
      vision,
      mission,
      motto,
      mottoDescription,
      aboutText,
      email,
      phone,
      address,
      leaderName,
      leaderPeriod,
      leaderQuote,
      leaderPhotoUrl,
      leaderInstagram,
      leaderLinkedin,
    } = body;

    let formattedMission: string | undefined = undefined;
    if (mission !== undefined) {
      if (typeof mission === 'string') {
        const trimmed = mission.trim();
        if (trimmed.startsWith('[') && trimmed.endsWith(']')) {
          try {
            JSON.parse(trimmed);
            formattedMission = trimmed;
          } catch {
            const items = trimmed.split('\n').map((s: string) => s.trim()).filter(Boolean);
            formattedMission = JSON.stringify(items);
          }
        } else {
          const items = trimmed.split('\n').map((s: string) => s.trim()).filter(Boolean);
          formattedMission = items.length > 0 ? JSON.stringify(items) : trimmed;
        }
      } else if (Array.isArray(mission)) {
        formattedMission = JSON.stringify(mission);
      }
    }

    const org = await prisma.organizationProfile.findFirst();
    if (org) {
      await prisma.organizationProfile.update({
        where: { id: org.id },
        data: {
          vision: vision !== undefined ? vision : org.vision,
          mission: formattedMission !== undefined ? formattedMission : org.mission,
          motto: motto !== undefined ? motto : org.motto,
          mottoDescription: mottoDescription !== undefined ? mottoDescription : org.mottoDescription,
          aboutText: aboutText !== undefined ? aboutText : org.aboutText,
          email: email !== undefined ? email : org.email,
          phone: phone !== undefined ? phone : org.phone,
          address: address !== undefined ? address : org.address,
        },
      });
    } else {
      await prisma.organizationProfile.create({
        data: {
          orgName: 'BAPEMA Cakrawala Universitas Muhammadiyah Jakarta',
          shortName: 'BAPEMA Cakrawala UMJ',
          tagline: 'Suara Cakrawala, Suara Mahasiswa!',
          motto: motto || 'Suara Cakrawala, Suara Mahasiswa!',
          mottoDescription: mottoDescription || 'Motto ini menjadi kompas integritas dalam memberitakan kebenaran.',
          vision: vision || '',
          mission: formattedMission || JSON.stringify([]),
          aboutText: aboutText || '',
          email: email || 'kontak@bapemacakrawala.org',
          phone: phone || null,
          address: address || null,
        },
      });
    }

    const leader = await prisma.leaderProfile.findFirst({ where: { isActive: 1 } });
    if (leader) {
      await prisma.leaderProfile.update({
        where: { id: leader.id },
        data: {
          name: leaderName !== undefined ? leaderName : leader.name,
          period: leaderPeriod !== undefined ? leaderPeriod : leader.period,
          quote: leaderQuote !== undefined ? leaderQuote : leader.quote,
          photoUrl: leaderPhotoUrl !== undefined ? (leaderPhotoUrl || null) : leader.photoUrl,
          instagramUrl: leaderInstagram !== undefined ? (leaderInstagram || null) : leader.instagramUrl,
          linkedinUrl: leaderLinkedin !== undefined ? (leaderLinkedin || null) : leader.linkedinUrl,
        },
      });
    } else {
      await prisma.leaderProfile.create({
        data: {
          name: leaderName || 'Ketua Umum',
          period: leaderPeriod || 'Periode Saat Ini',
          quote: leaderQuote || 'Maju Bersama BAPEMA Cakrawala UMJ',
          photoUrl: leaderPhotoUrl || null,
          instagramUrl: leaderInstagram || null,
          linkedinUrl: leaderLinkedin || null,
          isActive: 1,
        },
      });
    }

    return NextResponse.json({ message: 'Informasi Tentang Kami berhasil diperbarui.' });
  } catch (error) {
    console.error('Update profile error:', error);
    return NextResponse.json({ message: 'Gagal memperbarui profil.' }, { status: 500 });
  }
}
