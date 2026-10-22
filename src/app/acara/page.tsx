import React from 'react';
import Navbar from '@/components/public/Navbar';
import Footer from '@/components/public/Footer';
import AcaraHero from '@/components/public/acara/AcaraHero';
import AcaraClient from '@/components/public/acara/AcaraClient';
import prisma from '@/lib/prisma';
import { EventData } from '@/components/public/acara/AcaraCard';

export const dynamic = 'force-dynamic';

export const metadata = {
  title: 'Acara & Agenda - BPM Cakrawala FEB UMJ',
  description:
    'Agenda, Liputan Acara, dan Rekam Jejak Kegiatan Badan Pers Mahasiswa Cakrawala Fakultas Ekonomi dan Bisnis Universitas Muhammadiyah Jakarta.',
};

export default async function AcaraPage() {
  // Query data acara langsung dari database Prisma (terkoneksi real-time dengan CRUD Panel Admin)
  let events: EventData[] = [];

  try {
    const rawEvents = await prisma.event.findMany({
      where: {
        status: { in: ['published', 'completed'] },
      },
      orderBy: [
        { eventDate: 'desc' },
        { createdAt: 'desc' },
      ],
      select: {
        id: true,
        title: true,
        slug: true,
        shortSummary: true,
        description: true,
        eventDate: true,
        location: true,
        imageUrl: true,
        importantLink: true,
        status: true,
        isFeatured: true,
      },
    });

    events = rawEvents.map((e) => ({
      ...e,
      eventDate: e.eventDate.toISOString(),
    }));
  } catch (error) {
    console.error('Error fetching events from database:', error);
  }

  return (
    <div className="bg-brand-cream text-neutral-800 antialiased selection:bg-brand-caramel selection:text-white min-h-screen">
      {/* 1. Header / Navbar (72px) */}
      <Navbar />

      {/* 2. Main Content dengan offset 72px */}
      <main className="min-h-screen" style={{ paddingTop: '72px' }}>
        {/* Hero Header */}
        <AcaraHero />

        {/* Filter Bar, Events Grid, Pagination Otomatis, & Modal Detail */}
        <AcaraClient initialEvents={events} />
      </main>

      {/* 3. Footer Resmi */}
      <Footer />
    </div>
  );
}
