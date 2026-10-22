'use client';

import React from 'react';
import { Calendar } from 'lucide-react';

export default function AcaraHero() {
  return (
    <section className="bg-gradient-to-r from-brand-dark via-brand-chocolate to-brand-walnut text-white py-12 sm:py-16 lg:py-24 px-4 sm:px-10 lg:px-28 relative overflow-hidden">
      {/* Glow ambient background circles */}
      <div className="absolute -top-24 -right-24 w-72 sm:w-96 h-72 sm:h-96 rounded-full bg-brand-caramel/15 blur-3xl pointer-events-none" />
      <div className="absolute -bottom-24 -left-24 w-72 sm:w-96 h-72 sm:h-96 rounded-full bg-brand-dark/40 blur-3xl pointer-events-none" />

      <div className="max-w-5xl mx-auto flex flex-col items-center text-center gap-3 sm:gap-4 relative z-10">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-brand-caramel text-[11px] sm:text-xs font-bold tracking-widest uppercase">
          <Calendar className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
          <span>Agenda & Dokumentasi</span>
        </div>

        <h1 className="text-2xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight">
          Acara & Kegiatan Cakrawala
        </h1>

        <p className="text-neutral-200 max-w-2xl text-xs sm:text-base lg:text-lg leading-relaxed px-2">
          Eksplorasi seluruh rangkaian agenda jurnalistik, pelatihan, forum diskusi, dan peliputan event yang diselenggarakan oleh BPM Cakrawala FEB UMJ.
        </p>
      </div>
    </section>
  );
}
