'use client';

import React from 'react';
import { Megaphone, ShieldCheck, HeartHandshake } from 'lucide-react';

export default function AspirasiHero() {
  return (
    <section className="bg-gradient-to-r from-brand-dark via-brand-chocolate to-brand-walnut text-white py-10 sm:py-14 lg:py-20 px-4 sm:px-10 lg:px-28 relative overflow-hidden">
      {/* Background Glow Accents */}
      <div className="absolute -top-24 -right-24 w-72 sm:w-96 h-72 sm:h-96 rounded-full bg-brand-caramel/15 blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-60 sm:w-80 h-60 sm:h-80 rounded-full bg-brand-dark/40 blur-2xl pointer-events-none" />

      <div className="max-w-4xl mx-auto flex flex-col items-center text-center gap-3 sm:gap-4 relative z-10">
        {/* Badge Megaphone */}
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-brand-caramel text-[11px] sm:text-xs font-bold tracking-widest uppercase">
          <Megaphone className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-brand-caramel" />
          <span>Suara Mahasiswa</span>
        </div>

        {/* Title */}
        <h1 className="text-2xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-white drop-shadow-sm">
          Kanal Aspirasi Mahasiswa
        </h1>

        {/* Subtitle */}
        <p className="text-neutral-200 text-xs sm:text-base max-w-2xl leading-relaxed px-2">
          Sampaikan kritik, saran, keresahan, maupun usulan liputan Anda. BPM Cakrawala siap menjadi wadah aspirasi yang aman, independen, dan terpercaya bagi civitas akademika Universitas Muhammadiyah Jakarta.
        </p>

        {/* Trust Badges */}
        <div className="flex flex-wrap items-center justify-center gap-4 sm:gap-6 pt-1 sm:pt-2 text-[11px] sm:text-xs text-neutral-300">
          <div className="flex items-center gap-1.5 bg-white/5 px-3 py-1.5 rounded-full border border-white/10">
            <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>Kerahasiaan Terjaga</span>
          </div>
          <div className="flex items-center gap-1.5 bg-white/5 px-3 py-1.5 rounded-full border border-white/10">
            <HeartHandshake className="w-4 h-4 text-amber-400 shrink-0" />
            <span>Respon & Advokasi Redaksi</span>
          </div>
        </div>
      </div>
    </section>
  );
}
