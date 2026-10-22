import React from 'react';
import Navbar from '@/components/public/Navbar';
import Footer from '@/components/public/Footer';
import AspirasiHero from '@/components/public/aspirasi/AspirasiHero';
import AspirasiForm from '@/components/public/aspirasi/AspirasiForm';

export const metadata = {
  title: 'Kanal Aspirasi - BPM Cakrawala FEB UMJ',
  description:
    'Salurkan aspirasi, kritik, saran, dan opini Anda untuk kemajuan civitas akademika FEB Universitas Muhammadiyah Jakarta.',
};

export default function AspirasiPage() {
  return (
    <div className="bg-brand-cream text-neutral-800 antialiased selection:bg-brand-caramel selection:text-white min-h-screen">
      {/* 1. Header / Navbar Resmi (72px) */}
      <Navbar />

      {/* 2. Main Content dengan offset 72px */}
      <main className="min-h-screen" style={{ paddingTop: '72px' }}>
        {/* Hero Section */}
        <AspirasiHero />

        {/* Form Aspirasi Interaktif Terhubung ke Database */}
        <AspirasiForm />
      </main>

      {/* 3. Footer Resmi */}
      <Footer />
    </div>
  );
}
