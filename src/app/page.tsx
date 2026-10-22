import React from 'react';
import Navbar from '@/components/public/Navbar';
import HeroSection from '@/components/public/HeroSection';
import AboutSection from '@/components/public/AboutSection';
import EventCarouselSection from '@/components/public/EventCarouselSection';
import AspirationSection from '@/components/public/AspirationSection';
import Footer from '@/components/public/Footer';

export const metadata = {
  title: 'BPM Cakrawala FEB UMJ - Suara Cakrawala, Suara Mahasiswa',
  description:
    'Website Resmi Badan Pers Mahasiswa (BPM) Cakrawala Fakultas Ekonomi dan Bisnis Universitas Muhammadiyah Jakarta.',
};

export default function HomePage() {
  return (
    <div className="bg-brand-cream text-neutral-800 antialiased selection:bg-brand-caramel selection:text-white min-h-screen">
      {/* 1. Sticky Navbar (72px) */}
      <Navbar />

      {/* 2. Main Content dengan offset 72px */}
      <main className="min-h-screen" style={{ paddingTop: '72px' }}>
        {/* Section 1: Hero - Tentang FEB UMJ */}
        <HeroSection />

        {/* Section 2: Tentang BPM Cakrawala FEB UMJ */}
        <AboutSection />

        {/* Section 3: Acara Kami - Fullscreen Carousel */}
        <EventCarouselSection />

        {/* Section 4: Feedback & Aspirasi */}
        <AspirationSection />
      </main>

      {/* 3. Footer */}
      <Footer />
    </div>
  );
}
