import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Sparkles, Compass, ArrowDown } from 'lucide-react';

export default function HeroSection() {
  return (
    <section className="min-h-[calc(100svh-72px)] sm:min-h-screen px-5 sm:px-10 lg:px-28 flex items-center relative overflow-hidden bg-gradient-to-r from-brand-dark via-brand-chocolate to-brand-walnut">
      {/* Background Foto 01 dengan Gradient Overlay */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <Image
          src="/image/01.jpg"
          alt="Suasana FEB UMJ"
          fill
          priority
          sizes="100vw"
          className="w-full h-full object-cover object-center opacity-30 mix-blend-overlay scale-105 transition-transform duration-1000"
        />
        <div className="absolute inset-0 bg-gradient-to-b sm:bg-gradient-to-r from-brand-dark/95 via-brand-dark/85 to-brand-chocolate/75" />
      </div>

      {/* Konten Utama Hero Section */}
      <article className="flex flex-col items-start gap-4 sm:gap-5 w-full lg:w-4/6 text-white z-10 py-12 sm:py-20 lg:py-24">
        {/* Pill Badge */}
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-brand-caramel text-xs sm:text-sm font-semibold tracking-wide">
          <Sparkles className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-brand-caramel shrink-0" />
          <span>Fakultas Ekonomi dan Bisnis UMJ</span>
        </div>

        {/* Headline */}
        <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-[3.25rem] font-extrabold leading-tight tracking-tight text-white drop-shadow-sm">
          Tentang FEB UMJ
        </h1>

        {/* Paragraph (Left-aligned di mobile untuk mencegah whitespace aneh akibat justified) */}
        <p className="text-sm sm:text-base md:text-lg lg:text-xl font-light leading-relaxed text-neutral-100 text-left">
          &ldquo;Fakultas Ekonomi dan Bisnis Universitas Muhammadiyah Jakarta (FEB UMJ) adalah kawah candradimuka bagi generasi pembelajar yang berintegritas, kritis, dan berjiwa wirausaha islami.
          <br /><br className="hidden sm:inline" />
          Sebagai salah satu fakultas unggulan di lingkungan Muhammadiyah, FEB UMJ memadukan keilmuan ekonomi, manajemen, dan akuntansi modern dengan penanaman nilai-nilai keislaman dan kemuhammadiyahan untuk mencetak pemimpin masa depan yang berdaya saing global.&rdquo;
        </p>

        {/* Aksen Nilai & Quick Action Button untuk Mobile */}
        <div className="pt-2 w-full flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-2 text-brand-caramel text-xs sm:text-sm font-semibold">
            <Compass className="w-4 h-4 text-brand-caramel shrink-0" />
            <span>Integritas, Literasi Kritis, & Semangat Keislaman</span>
          </div>

          <a
            href="#tentang-kami"
            className="inline-flex sm:hidden items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-white/10 border border-white/20 text-xs font-bold text-white active:bg-white/20 active:scale-95 transition-all min-h-[44px]"
          >
            <span>Kenali BPM Cakrawala</span>
            <ArrowDown className="w-3.5 h-3.5 text-brand-caramel" />
          </a>
        </div>
      </article>
    </section>
  );
}
