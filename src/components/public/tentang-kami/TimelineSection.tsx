'use client';

import React, { useState } from 'react';
import { History, Calendar, Sparkles } from 'lucide-react';

interface TimelineEvent {
  id: number;
  year: string;
  title: string;
  description: string;
  imageUrl?: string | null;
  sortOrder: number;
}

interface TimelineSectionProps {
  timeline: TimelineEvent[];
}

export default function TimelineSection({ timeline }: TimelineSectionProps) {
  const [activeId, setActiveId] = useState<number | null>(null);

  if (!timeline || timeline.length === 0) {
    return null;
  }

  return (
    <section className="py-14 sm:py-20 lg:py-28 px-4 sm:px-10 lg:px-28 bg-brand-cream relative overflow-hidden">
      {/* Background Ambient Glow */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[320px] sm:w-[600px] h-[300px] bg-brand-caramel/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-5xl mx-auto relative z-10">
        {/* Section Header */}
        <div className="text-center mb-12 sm:mb-16">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-brand-chocolate/10 text-brand-chocolate text-[11px] sm:text-xs font-bold tracking-widest uppercase mb-2.5 sm:mb-3 border border-brand-chocolate/20">
            <History className="w-3.5 h-3.5 text-brand-chocolate" />
            <span>Rekam Jejak & Sejarah</span>
          </div>
          <h2 className="text-2xl sm:text-4xl lg:text-5xl font-extrabold text-brand-dark tracking-tight">
            Perjalanan Kami
          </h2>
          <p className="text-neutral-600 text-xs sm:text-base mt-2 sm:mt-3 max-w-xl mx-auto leading-relaxed px-2">
            Menelusuri sejarah, fase perkembangan, dan transformasi BAPEMA Cakrawala dari masa ke masa.
          </p>
        </div>

        {/* ============================================================== */}
        {/* TIMELINE DINAMIS & RESPONSIF (BERDASARKAN DATA ADMIN)          */}
        {/* ============================================================== */}
        <div className="relative">
          {/* Garis Vertikal (Mobile: Kiri 20px, Desktop: Tengah 50%) */}
          <div className="absolute left-5 md:left-1/2 top-4 bottom-4 w-1 bg-gradient-to-b from-brand-dark via-brand-chocolate to-brand-caramel -translate-x-1/2 rounded-full z-0 shadow-xs" />

          {/* List Milestone Dinamis */}
          <div className="space-y-8 sm:space-y-12 relative z-10">
            {timeline.map((item, index) => {
              const isEven = index % 2 === 0;
              const isActive = activeId === item.id;

              return (
                <div
                  key={item.id}
                  onClick={() => setActiveId(isActive ? null : item.id)}
                  onMouseEnter={() => setActiveId(item.id)}
                  onMouseLeave={() => setActiveId(null)}
                  className={`relative flex flex-col md:flex-row items-start md:items-center group cursor-pointer ${
                    isEven ? 'md:flex-row-reverse' : ''
                  }`}
                >
                  {/* Sisi Kosong (Untuk penyeimbang layout alternating di layar desktop) */}
                  <div className="hidden md:block md:w-1/2" />

                  {/* Node Lingkaran Milestone di Garis */}
                  <div className="absolute left-5 md:left-1/2 -translate-x-1/2 flex items-center justify-center z-20 top-5 md:top-auto">
                    <div
                      className={`w-10 h-10 sm:w-12 sm:h-12 rounded-full border-3 sm:border-4 border-white shadow-lg flex items-center justify-center font-black text-xs sm:text-sm transition-all duration-300 ${
                        isActive
                          ? 'bg-gradient-to-br from-brand-dark to-brand-chocolate text-white scale-110 sm:scale-125 ring-4 ring-brand-caramel/50 shadow-xl'
                          : 'bg-white text-brand-chocolate border-brand-sand group-hover:bg-brand-chocolate group-hover:text-white'
                      }`}
                    >
                      <span>{index + 1}</span>
                    </div>
                  </div>

                  {/* Card Konten Milestone */}
                  <div
                    className={`w-full pl-12 sm:pl-14 md:pl-0 md:w-1/2 ${
                      isEven ? 'md:pr-12' : 'md:pl-12'
                    }`}
                  >
                    <div
                      className={`bg-white rounded-2xl sm:rounded-3xl p-5 sm:p-7 border transition-all duration-300 relative select-none ${
                        isActive
                          ? 'shadow-xl -translate-y-1 border-brand-chocolate bg-amber-50/40'
                          : 'shadow-sm border-brand-sand hover:shadow-md hover:border-brand-caramel/60'
                      }`}
                    >
                      {/* Badge Tahun & Fase */}
                      <div className="flex items-center justify-between gap-2 mb-2.5">
                        <span
                          className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-xl text-xs font-extrabold transition-colors ${
                            isActive
                              ? 'bg-brand-chocolate text-white shadow-xs'
                              : 'bg-brand-sand/70 text-brand-dark group-hover:bg-brand-chocolate group-hover:text-white'
                          }`}
                        >
                          <Calendar className="w-3.5 h-3.5" />
                          <span>Tahun {item.year}</span>
                        </span>

                        <span className="text-[10px] sm:text-[11px] font-bold text-neutral-400 group-hover:text-brand-caramel transition-colors">
                          Fase #{index + 1}
                        </span>
                      </div>

                      {/* Judul Milestone */}
                      <h3 className="text-base sm:text-xl font-extrabold text-brand-dark group-hover:text-brand-chocolate transition-colors leading-snug">
                        {item.title}
                      </h3>

                      {/* Isi Teks / Deskripsi Milestone */}
                      <p className="text-neutral-600 text-xs sm:text-sm leading-relaxed mt-2 text-left whitespace-pre-line">
                        {item.description}
                      </p>

                      {/* Indikator Halus di Bawah Card */}
                      <div className="mt-3.5 pt-2.5 border-t border-brand-sand/60 flex items-center justify-between text-[10px] sm:text-[11px] text-neutral-400">
                        <span className="flex items-center gap-1 text-brand-caramel font-semibold">
                          <Sparkles className="w-3 h-3" />
                          <span>Arsip Perjalanan</span>
                        </span>
                        <span className="font-medium text-neutral-400">
                          BAPEMA Cakrawala
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
