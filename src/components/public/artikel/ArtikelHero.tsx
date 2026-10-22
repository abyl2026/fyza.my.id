'use client';

import React from 'react';
import { Newspaper, Search } from 'lucide-react';

interface ArtikelHeroProps {
  searchQuery: string;
  onSearchChange: (value: string) => void;
}

export default function ArtikelHero({
  searchQuery,
  onSearchChange,
}: ArtikelHeroProps) {
  return (
    <section className="bg-gradient-to-r from-brand-dark via-brand-chocolate to-brand-walnut text-white py-10 sm:py-16 lg:py-20 px-4 sm:px-10 lg:px-28 relative overflow-hidden">
      {/* Background Glow Accents */}
      <div className="absolute top-0 right-0 w-72 sm:w-96 h-72 sm:h-96 bg-brand-caramel/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-60 sm:w-72 h-60 sm:h-72 bg-brand-dark/40 rounded-full blur-2xl pointer-events-none" />

      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6 relative z-10">
        <div className="flex flex-col gap-2 text-center md:text-left">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/10 backdrop-blur-md text-brand-caramel text-[11px] sm:text-xs font-bold uppercase tracking-wider w-max mx-auto md:mx-0 border border-white/10">
            <Newspaper className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            <span>Warta & Gagasan Intelektual</span>
          </div>
          <h1 className="text-2xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-white drop-shadow-sm">
            Artikel & Publikasi
          </h1>
          <p className="text-neutral-300 text-xs sm:text-base max-w-xl leading-relaxed px-2 md:px-0">
            Kumpulan warta jurnalistik, ulasan kritis, dan artikel opini mahasiswa Fakultas Ekonomi dan Bisnis Universitas Muhammadiyah Jakarta.
          </p>
        </div>

        {/* Search Bar Real-Time (Min touch 48px) */}
        <div className="w-full md:w-80">
          <div className="relative flex items-center min-h-[48px]">
            <Search className="w-4 h-4 absolute left-3.5 text-neutral-300 pointer-events-none z-10" />
            <input
              type="text"
              placeholder="Cari judul artikel..."
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              className="w-full pl-10 pr-4 py-3 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 text-white placeholder-neutral-300 text-xs sm:text-sm focus:outline-none focus:bg-white focus:text-brand-dark focus:placeholder-neutral-400 transition-all shadow-inner min-h-[48px]"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
