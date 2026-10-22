'use client';

import React from 'react';
import Image from 'next/image';
import { Crown, Instagram, Linkedin } from 'lucide-react';

interface LeaderSectionProps {
  name: string;
  position?: string;
  period?: string;
  quote?: string;
  photoUrl?: string | null;
  instagramUrl?: string | null;
  linkedinUrl?: string | null;
}

export default function LeaderSection({
  name,
  position = 'Ketua Umum',
  period = 'BPM Cakrawala',
  quote,
  photoUrl,
  instagramUrl,
  linkedinUrl,
}: LeaderSectionProps) {
  const displayPhoto = photoUrl || '/image/ketua.jpg';

  return (
    <section className="py-14 sm:py-20 lg:py-28 bg-gradient-to-r from-brand-dark via-brand-chocolate to-brand-walnut text-white px-4 sm:px-10 lg:px-28 relative overflow-hidden">
      {/* Ambient Glow */}
      <div className="absolute -top-32 -left-32 w-72 sm:w-96 h-72 sm:h-96 rounded-full bg-brand-caramel/10 blur-3xl pointer-events-none" />
      <div className="absolute -bottom-32 -right-32 w-72 sm:w-96 h-72 sm:h-96 rounded-full bg-brand-chocolate/20 blur-3xl pointer-events-none" />

      <div className="max-w-6xl mx-auto flex flex-col items-center gap-8 sm:gap-10 relative z-10">
        {/* Header Section Pill Title */}
        <div className="flex flex-col items-center text-center gap-2.5 sm:gap-3">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-brand-caramel text-[11px] sm:text-xs font-bold tracking-widest uppercase">
            <Crown className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            <span>Pucuk Pimpinan Organisasi</span>
          </div>
          <h2 className="text-2xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight">
            {position || 'Ketua Umum'}
          </h2>
          <p className="text-neutral-300 max-w-xl text-xs sm:text-base leading-relaxed px-2">
            Nahkoda kepemimpinan Badan Pers Mahasiswa Cakrawala FEB UMJ periode berjalan.
          </p>
        </div>

        {/* 1 Card Spesial: Ketua Umum Terpusat */}
        <div className="w-full max-w-md mx-auto">
          <div className="bg-white/10 backdrop-blur-md rounded-3xl p-6 sm:p-9 border border-white/20 flex flex-col items-center text-center group hover:bg-white/15 transition-all duration-300 shadow-2xl relative">
            <div className="relative w-40 h-40 sm:w-56 sm:h-56 mb-5 sm:mb-6 rounded-2xl overflow-hidden shadow-xl border-4 border-white/30 group-hover:border-brand-caramel transition-colors duration-300">
              <Image
                src={displayPhoto}
                alt={name || 'Ketua Umum'}
                fill
                sizes="(max-width: 640px) 160px, 224px"
                className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-brand-dark/70 via-transparent to-transparent" />
              <span className="absolute bottom-2 left-2 right-2 text-[10px] sm:text-[11px] font-semibold bg-brand-chocolate/90 py-1 rounded text-white text-center">
                {period || 'BPM Cakrawala'}
              </span>
            </div>

            <span className="inline-block px-3 py-1 rounded-full bg-brand-caramel/30 text-brand-caramel text-[11px] sm:text-xs font-bold uppercase tracking-wider mb-1.5">
              {position || 'Ketua Umum'}
            </span>
            <h3 className="text-xl sm:text-3xl font-extrabold text-white tracking-tight">
              {name || 'M. Rizky Ramadhan'}
            </h3>
            <p className="text-neutral-200 text-xs sm:text-sm mt-2 max-w-xs leading-relaxed italic">
              &ldquo;{quote || 'Memimpin dengan integritas demi tegaknya independensi pers mahasiswa, menyuarakan kebenaran dengan data dan etika.'}&rdquo;
            </p>

            {/* Badge Sosial Media Khusus (Touch target min 44px) */}
            <div className="mt-5 sm:mt-6 flex items-center justify-center gap-2.5 sm:gap-3 w-full pt-4 border-t border-white/15">
              <a
                href={instagramUrl || 'https://www.instagram.com/cakrawalafebumj/#'}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-2 min-h-[44px] px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white text-white hover:text-brand-dark border border-white/20 text-xs font-bold backdrop-blur-sm transition-all duration-200 group/soc shadow-sm active:scale-95"
                aria-label="Instagram Ketua Umum"
              >
                <Instagram className="w-4 h-4 text-brand-caramel group-hover/soc:text-brand-dark transition-colors shrink-0" />
                <span>Instagram</span>
              </a>

              <a
                href={linkedinUrl || 'https://www.linkedin.com'}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-2 min-h-[44px] px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white text-white hover:text-brand-dark border border-white/20 text-xs font-bold backdrop-blur-sm transition-all duration-200 group/soc shadow-sm active:scale-95"
                aria-label="LinkedIn Ketua Umum"
              >
                <Linkedin className="w-4 h-4 text-brand-caramel group-hover/soc:text-brand-dark transition-colors shrink-0" />
                <span>LinkedIn</span>
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
