import React from 'react';
import Navbar from '@/components/public/Navbar';
import Footer from '@/components/public/Footer';
import AboutTabs from '@/components/public/tentang-kami/AboutTabs';
import LeaderSection from '@/components/public/tentang-kami/LeaderSection';
import DivisionSection from '@/components/public/tentang-kami/DivisionSection';
import TimelineSection from '@/components/public/tentang-kami/TimelineSection';
import LatestArticlesSection from '@/components/public/tentang-kami/LatestArticlesSection';
import prisma from '@/lib/prisma';

export const dynamic = 'force-dynamic';

export const metadata = {
  title: 'Tentang Kami - BPM Cakrawala FEB UMJ',
  description:
    'Profil, Visi & Misi, Pimpinan, Struktur Fungsionaris, Kepanitiaan, dan Timeline Perjalanan Badan Pers Mahasiswa Cakrawala FEB UMJ.',
};

export default async function TentangKamiPage() {
  // Query data langsung dari database Prisma (terhubung 100% dengan CRUD Admin Panel)
  let org = null;
  let leader = null;
  let divisions: any[] = [];
  let timeline: any[] = [];
  let articles: any[] = [];

  try {
    const [orgData, leaderData, divisionData, timelineData, articleData] = await Promise.all([
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
      prisma.article.findMany({
        where: { status: 'published' },
        orderBy: [{ publishedAt: 'desc' }, { createdAt: 'desc' }],
        take: 3,
        select: {
          id: true,
          title: true,
          slug: true,
          excerpt: true,
          coverImageUrl: true,
          category: true,
          publishedAt: true,
        },
      }),
    ]);

    org = orgData;
    leader = leaderData;
    divisions = divisionData;
    timeline = timelineData;
    articles = articleData;
  } catch (error) {
    console.error('Error fetching about data:', error);
  }

  // Parse butir misi dari JSON string atau format baris teks
  let missionList: string[] = [];
  if (org?.mission) {
    try {
      const parsed = JSON.parse(org.mission);
      if (Array.isArray(parsed)) {
        missionList = parsed;
      } else if (typeof parsed === 'string') {
        missionList = parsed.split('\n').filter(Boolean);
      }
    } catch {
      missionList = org.mission.split('\n').filter(Boolean);
    }
  }

  return (
    <div className="bg-brand-cream text-neutral-800 antialiased selection:bg-brand-caramel selection:text-white min-h-screen">
      {/* 1. Header / Navbar (72px) */}
      <Navbar />

      {/* 2. Main Content dengan offset 72px */}
      <main className="min-h-screen" style={{ paddingTop: '72px' }}>
        {/* Section 1: Visi, Misi, & Motto (Tab Selector) */}
        <AboutTabs
          vision={org?.vision || ''}
          mission={missionList}
          motto={org?.motto || ''}
          mottoDescription={org?.mottoDescription || ''}
        />

        {/* Section 2: Ketua Umum */}
        <LeaderSection
          name={leader?.name || 'M. Rizky Ramadhan'}
          position={leader?.position || 'Ketua Umum'}
          period={leader?.period || 'BPM Cakrawala'}
          quote={leader?.quote || ''}
          photoUrl={leader?.photoUrl}
          instagramUrl={leader?.instagramUrl}
          linkedinUrl={leader?.linkedinUrl}
        />

        {/* Section 3: Fungsionaris (Departemen, Proker Horizontal Slider, Anggota Marquee) */}
        <DivisionSection divisions={divisions} />

        {/* Section 4: Perjalanan Kami (Timeline Roadmap Interaktif) */}
        <TimelineSection timeline={timeline} />

        {/* Section 5: Artikel Terbaru (3 Card Terkini) */}
        <LatestArticlesSection articles={articles} />
      </main>

      {/* 3. Footer Resmi */}
      <Footer />
    </div>
  );
}
