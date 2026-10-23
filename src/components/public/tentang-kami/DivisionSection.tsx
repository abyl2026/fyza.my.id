'use client';

import React, { useState, useRef } from 'react';
import Image from 'next/image';
import {
  Briefcase,
  Users,
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  Layers,
  Award,
  FileText,
  Newspaper,
  UserCheck,
  Globe2,
  FolderOpen,
  Folder,
} from 'lucide-react';

interface Member {
  id: number;
  name: string;
  position: string;
  photoUrl?: string | null;
  sortOrder: number;
}

interface Program {
  id: number;
  name: string;
  description: string;
  targetOutput?: string | null;
}

interface Division {
  id: number;
  name: string;
  description?: string | null;
  sortOrder: number;
  members: Member[];
  programs: Program[];
}

interface DivisionSectionProps {
  divisions: Division[];
}

export default function DivisionSection({ divisions }: DivisionSectionProps) {
  // Desktop active tab
  const [selectedIdx, setSelectedIdx] = useState(0);
  // Mobile accordion drawer ("Laci") index - default open division pertama
  const [openDrawerIdx, setOpenDrawerIdx] = useState<number | null>(0);

  const prokerTrackRef = useRef<HTMLDivElement>(null);
  const anggotaTrackRef = useRef<HTMLDivElement>(null);

  if (!divisions || divisions.length === 0) {
    return null;
  }

  const activeDivision = divisions[selectedIdx] || divisions[0];

  const toggleDrawer = (idx: number) => {
    setOpenDrawerIdx((prev) => (prev === idx ? null : idx));
  };

  const scrollProker = (direction: 'left' | 'right') => {
    if (prokerTrackRef.current) {
      const offset = direction === 'left' ? -320 : 320;
      prokerTrackRef.current.scrollBy({ left: offset, behavior: 'smooth' });
    }
  };


  // Helper icons for division
  const getDivisionIcon = (index: number) => {
    switch (index % 4) {
      case 0:
        return <Newspaper className="w-5 h-5 sm:w-6 sm:h-6" />;
      case 1:
        return <UserCheck className="w-5 h-5 sm:w-6 sm:h-6" />;
      case 2:
        return <Globe2 className="w-5 h-5 sm:w-6 sm:h-6" />;
      default:
        return <Layers className="w-5 h-5 sm:w-6 sm:h-6" />;
    }
  };

  const members = activeDivision.members || [];
  const programs = activeDivision.programs || [];

  return (
    <section id="fungsionaris" className="py-14 sm:py-20 lg:py-28 px-4 sm:px-10 lg:px-28 bg-brand-cream flex flex-col items-center">
      <div className="max-w-7xl w-full flex flex-col gap-8 sm:gap-10">
        {/* Header Banner Pill */}
        <div className="bg-gradient-to-r from-brand-dark via-brand-chocolate to-brand-walnut p-5 sm:p-7 rounded-3xl text-white shadow-xl flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left">
          <div>
            <div className="inline-block px-3 py-1 rounded bg-brand-caramel/30 text-brand-caramel text-[11px] sm:text-xs font-bold uppercase tracking-wider mb-1">
              Departemen & Kepengurusan
            </div>
            <h2 className="text-xl sm:text-3xl font-extrabold tracking-tight">
              Fungsionaris Cakrawala FEB UMJ
            </h2>
            <p className="text-xs sm:text-sm text-neutral-200 mt-1">
              Kenali peran divisi, program kerja unggulan, dan jajaran pengurus.
            </p>
          </div>
          <span className="px-4 py-2 rounded-2xl bg-white/10 text-white text-xs font-semibold backdrop-blur-md border border-white/20 shrink-0">
            {divisions.length} Divisi Aktif
          </span>
        </div>

        {/* ============================================================== */}
        {/* 1. TAMPILAN MOBILE: ACCORDION LACI (DRAWER) - HEMAT RUANG       */}
        {/* ============================================================== */}
        <div className="block md:hidden w-full space-y-3">
          <div className="flex items-center justify-between px-1 text-xs text-neutral-500 font-medium">
            <span>Daftar Divisi (Ketuk untuk buka laci)</span>
            <span className="text-brand-chocolate font-bold">{divisions.length} Departemen</span>
          </div>

          {divisions.map((div, idx) => {
            const isOpen = openDrawerIdx === idx;
            const divMembers = div.members || [];
            const divPrograms = div.programs || [];

            return (
              <div
                key={div.id}
                className={`rounded-2xl border transition-all duration-300 overflow-hidden ${
                  isOpen
                    ? 'bg-white border-brand-chocolate/40 shadow-lg ring-1 ring-brand-chocolate/10'
                    : 'bg-white/80 border-brand-sand hover:bg-white shadow-xs'
                }`}
              >
                {/* Header Laci (Tombol Buka / Tutup Laci) */}
                <button
                  type="button"
                  onClick={() => toggleDrawer(idx)}
                  className={`w-full min-h-[56px] p-4 flex items-center justify-between gap-3 text-left transition-colors active:bg-brand-sand/40 ${
                    isOpen ? 'bg-gradient-to-r from-brand-sand/50 to-white' : ''
                  }`}
                  aria-expanded={isOpen}
                  aria-label={`Buka laci divisi ${div.name}`}
                >
                  <div className="flex items-center gap-3 min-w-0">
                    {/* Badge Nomor & Ikon */}
                    <div
                      className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 transition-colors ${
                        isOpen
                          ? 'bg-brand-chocolate text-white shadow-xs'
                          : 'bg-brand-sand text-brand-chocolate'
                      }`}
                    >
                      {isOpen ? <FolderOpen className="w-5 h-5 text-brand-caramel" /> : <Folder className="w-5 h-5" />}
                    </div>

                    {/* Nama & Info Singkat */}
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] font-black px-1.5 py-0.5 rounded bg-brand-sand text-brand-chocolate">
                          {String(idx + 1).padStart(2, '0')}
                        </span>
                        <h3 className="font-extrabold text-sm text-brand-dark truncate">
                          {div.name}
                        </h3>
                      </div>
                      <p className="text-[11px] text-neutral-500 mt-0.5 truncate">
                        {divPrograms.length} Proker &bull; {divMembers.length} Pengurus
                      </p>
                    </div>
                  </div>

                  {/* Indikator Laci (Panah Chevron Berputar) */}
                  <div
                    className={`p-2 rounded-xl shrink-0 transition-transform duration-300 ${
                      isOpen
                        ? 'bg-brand-chocolate/10 text-brand-chocolate rotate-180'
                        : 'bg-brand-sand/60 text-neutral-500'
                    }`}
                  >
                    <ChevronDown className="w-4 h-4" />
                  </div>
                </button>

                {/* Konten Di Dalam Laci (Slide Expand) */}
                {isOpen && (
                  <div className="px-4 pb-5 pt-2 border-t border-brand-sand/60 flex flex-col gap-5 animate-fadeIn">
                    {/* 1. Deskripsi Divisi */}
                    <div className="bg-brand-cream/60 p-3.5 rounded-xl border border-brand-sand/60">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-brand-chocolate block mb-1">
                        Peran & Fokus Utama
                      </span>
                      <p className="text-xs text-neutral-700 leading-relaxed text-justify">
                        {div.description ||
                          'Divisi ini bertanggung jawab mengawal operasional, riset program, serta mendukung aktivitas jurnalistik civitas akademika.'}
                      </p>
                    </div>

                    {/* 2. Program Kerja Divisi (Horizontal Touch Scroll) */}
                    <div>
                      <div className="flex items-center justify-between mb-2.5">
                        <h4 className="text-xs font-bold text-brand-dark flex items-center gap-1.5">
                          <Briefcase className="w-3.5 h-3.5 text-brand-chocolate" />
                          <span>Program Kerja ({divPrograms.length})</span>
                        </h4>
                        <span className="text-[10px] text-neutral-400">Geser ke samping &rarr;</span>
                      </div>

                      {divPrograms.length > 0 ? (
                        <div className="flex gap-3 overflow-x-auto no-scrollbar scroll-smooth pb-1 touch-pan-x">
                          {divPrograms.map((proker, pIdx) => (
                            <div
                              key={proker.id}
                              className="min-w-[240px] max-w-[240px] shrink-0 p-3.5 rounded-xl bg-white border border-brand-sand shadow-xs flex flex-col justify-between"
                            >
                              <div>
                                <span className="inline-block px-2 py-0.5 rounded-full bg-brand-chocolate/10 text-brand-chocolate text-[10px] font-bold mb-1.5">
                                  Proker #{pIdx + 1}
                                </span>
                                <h5 className="font-bold text-xs text-brand-dark mb-1 line-clamp-1">
                                  {proker.name}
                                </h5>
                                <p className="text-[11px] text-neutral-600 line-clamp-3 leading-relaxed">
                                  {proker.description}
                                </p>
                              </div>
                              <div className="pt-2 mt-2 border-t border-brand-sand/60 flex items-center justify-between text-[10px]">
                                <span className="text-neutral-500 truncate max-w-[120px]">
                                  {proker.targetOutput || 'Berkala'}
                                </span>
                                <span className="text-brand-caramel font-bold shrink-0">Terjadwal</span>
                              </div>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="p-4 text-center text-xs text-neutral-500 bg-brand-sand/30 rounded-xl">
                          Belum ada program kerja untuk divisi ini.
                        </div>
                      )}
                    </div>

                    {/* 3. Pengurus & Anggota Divisi (Horizontal Touch Scroll) */}
                    <div>
                      <div className="flex items-center justify-between mb-2.5">
                        <h4 className="text-xs font-bold text-brand-dark flex items-center gap-1.5">
                          <Users className="w-3.5 h-3.5 text-brand-chocolate" />
                          <span>Pengurus ({divMembers.length})</span>
                        </h4>
                        <span className="text-[10px] text-neutral-400">Geser &rarr;</span>
                      </div>

                      {divMembers.length > 0 ? (
                        <div className="flex gap-3 overflow-x-auto no-scrollbar scroll-smooth pb-1 touch-pan-x">
                          {divMembers.map((m, mIdx) => (
                            <div
                              key={m.id}
                              className="min-w-[150px] max-w-[150px] shrink-0 p-3 rounded-xl bg-white border border-brand-sand shadow-xs flex flex-col items-center text-center"
                            >
                              <div className="relative mb-2 w-14 h-14">
                                <Image
                                  src={m.photoUrl || '/image/anggota.jpg'}
                                  alt={m.name}
                                  width={56}
                                  height={56}
                                  unoptimized
                                  onError={(e) => {
                                    const target = e.currentTarget;
                                    if (!target.src.endsWith('/image/anggota.jpg')) {
                                      target.src = '/image/anggota.jpg';
                                    }
                                  }}
                                  className="w-14 h-14 rounded-full object-cover shadow-sm border-2 border-brand-caramel p-0.5 bg-white"
                                />
                                <span className="absolute -bottom-1 -right-1 p-0.5 bg-brand-chocolate text-white rounded-full">
                                  {mIdx === 0 ? <Award className="w-3 h-3" /> : <FileText className="w-3 h-3" />}
                                </span>
                              </div>
                              <h6 className="font-extrabold text-xs text-brand-dark line-clamp-1">
                                {m.name}
                              </h6>
                              <span className="text-[11px] text-brand-chocolate font-medium mt-0.5 line-clamp-1">
                                {m.position}
                              </span>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="p-4 text-center text-xs text-neutral-500 bg-brand-sand/30 rounded-xl">
                          Belum ada profil anggota untuk divisi ini.
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* ============================================================== */}
        {/* 2. TAMPILAN DESKTOP: GRID TAB + PANEL DETAIL (MD KE ATAS)       */}
        {/* ============================================================== */}
        <div className="hidden md:flex flex-col gap-10 w-full">
          {/* Layout Daftar Divisi: Responsif Grid */}
          <div className="w-full">
            <div
              className={`grid gap-4 ${
                divisions.length === 1
                  ? 'grid-cols-1 max-w-sm mx-auto'
                  : divisions.length === 2
                  ? 'grid-cols-2'
                  : 'grid-cols-3'
              }`}
            >
              {divisions.map((div, idx) => {
                const isActive = idx === selectedIdx;
                return (
                  <button
                    key={div.id}
                    onClick={() => setSelectedIdx(idx)}
                    className={`group relative p-5 rounded-2xl transition-all duration-300 flex flex-col items-center text-center gap-2 border cursor-pointer ${
                      isActive
                        ? 'bg-gradient-to-r from-brand-dark to-brand-chocolate text-white border-brand-caramel/40 shadow-md scale-[1.02]'
                        : 'bg-white text-neutral-700 hover:bg-brand-sand border-brand-sand shadow-sm hover:scale-[1.01]'
                    }`}
                  >
                    <span
                      className={`text-[10px] font-extrabold px-2.5 py-0.5 rounded-full ${
                        isActive
                          ? 'bg-brand-caramel/30 text-brand-caramel'
                          : 'bg-brand-sand text-brand-chocolate'
                      }`}
                    >
                      {String(idx + 1).padStart(2, '0')}
                    </span>
                    <div
                      className={`p-2.5 rounded-xl transition-transform group-hover:scale-110 ${
                        isActive
                          ? 'bg-white/10 text-brand-caramel'
                          : 'bg-brand-sand text-brand-chocolate'
                      }`}
                    >
                      {getDivisionIcon(idx)}
                    </div>
                    <span className="font-extrabold text-base tracking-tight">{div.name}</span>
                    <span className="text-xs opacity-90 line-clamp-1">
                      {div.description || `Divisi ${idx + 1}`}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Panel Detail Divisi Terpilih (Desktop) */}
          <div className="w-full flex flex-col gap-8 bg-white p-8 lg:p-10 rounded-3xl shadow-xl border border-brand-sand/70">
            {/* Deskripsi & Peran Divisi */}
            <div className="flex flex-col gap-3 border-b border-brand-sand pb-6">
              <div className="flex items-center gap-3">
                <div className="p-3 rounded-2xl bg-brand-chocolate/10 text-brand-chocolate">
                  <Layers className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-2xl sm:text-3xl font-extrabold text-brand-dark">
                    {activeDivision.name}
                  </h3>
                  <span className="text-xs text-brand-caramel font-semibold uppercase tracking-wider">
                    Peran & Fokus Utama
                  </span>
                </div>
              </div>
              <p className="text-neutral-700 leading-relaxed text-sm sm:text-base mt-2">
                {activeDivision.description ||
                  'Divisi ini bertanggung jawab dalam mengorganisir operasional jurnalistik, riset konten, serta distribusi pemberitaan kepada mahasiswa FEB UMJ.'}
              </p>
            </div>

            {/* Program Kerja Slider Horizontal */}
            <div className="flex flex-col gap-4">
              <div className="flex items-center justify-between">
                <h4 className="text-lg font-bold text-brand-dark flex items-center gap-2">
                  <Briefcase className="w-5 h-5 text-brand-chocolate" />
                  <span>Program Kerja Divisi</span>
                </h4>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => scrollProker('left')}
                    aria-label="Proker Sebelumnya"
                    className="p-2 rounded-xl bg-brand-sand/60 hover:bg-brand-sand text-brand-dark transition-colors cursor-pointer"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => scrollProker('right')}
                    aria-label="Proker Selanjutnya"
                    className="p-2 rounded-xl bg-brand-sand/60 hover:bg-brand-sand text-brand-dark transition-colors cursor-pointer"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Container Proker */}
              <div
                ref={prokerTrackRef}
                className="flex gap-4 overflow-x-auto no-scrollbar scroll-smooth py-2"
              >
                {programs.length > 0 ? (
                  programs.map((proker, pIdx) => (
                    <div
                      key={proker.id}
                      className="min-w-[280px] sm:min-w-[320px] max-w-[320px] shrink-0 p-5 rounded-2xl bg-gradient-to-br from-brand-sand/50 via-white to-brand-sand/30 border border-brand-sand flex flex-col justify-between shadow-xs hover:shadow-md transition-all"
                    >
                      <div>
                        <span className="inline-block px-2.5 py-0.5 rounded-full bg-brand-chocolate/10 text-brand-chocolate text-[11px] font-bold mb-2">
                          Program Unggulan {pIdx + 1}
                        </span>
                        <h5 className="font-bold text-base text-brand-dark mb-2">{proker.name}</h5>
                        <p className="text-xs sm:text-sm text-neutral-600 leading-relaxed">
                          {proker.description}
                        </p>
                      </div>
                      <div className="pt-3 mt-3 border-t border-brand-sand flex items-center justify-between text-xs text-brand-walnut font-medium">
                        <span>Target: {proker.targetOutput || 'Berkala'}</span>
                        <span className="text-brand-caramel font-bold">Terjadwal</span>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="w-full p-8 text-center text-sm text-neutral-500 bg-brand-sand/30 rounded-2xl">
                    Belum ada program kerja yang ditambahkan untuk divisi ini.
                  </div>
                )}
              </div>
            </div>

            {/* Anggota Divisi Melayang & Berputar Terus Menerus */}
            <div className="flex flex-col gap-4 pt-6 border-t border-brand-sand">
              <div>
                <h4 className="text-lg font-bold text-brand-dark flex items-center gap-2">
                  <Users className="w-5 h-5 text-brand-chocolate" />
                  <span>Pengurus & Anggota Divisi</span>
                </h4>
                <p className="text-xs text-neutral-500 mt-0.5">
                  Arahkan kursor / sentuh kartu untuk menjeda putaran otomatis.
                </p>
              </div>

              {/* Outer Marquee Masked Container */}
              <div
                ref={anggotaTrackRef}
                className="relative w-full overflow-hidden py-4 rounded-3xl bg-brand-sand/20 border border-brand-sand/60"
              >
                <div className="pointer-events-none absolute inset-y-0 left-0 w-12 sm:w-16 bg-gradient-to-r from-brand-sand/50 to-transparent z-10" />
                <div className="pointer-events-none absolute inset-y-0 right-0 w-12 sm:w-16 bg-gradient-to-l from-brand-sand/50 to-transparent z-10" />

                {members.length > 0 ? (
                  <div className="animate-marquee-infinite flex gap-5 px-4">
                    {/* Set 1 */}
                    {members.map((m, mIdx) => (
                      <div
                        key={`m1-${m.id}`}
                        className={`${
                          mIdx % 2 === 0 ? 'floating-card' : 'floating-card-delayed'
                        } min-w-[200px] sm:min-w-[220px] max-w-[220px] shrink-0 p-5 rounded-3xl bg-white shadow-lg hover:shadow-2xl border border-brand-sand/80 flex flex-col items-center text-center transition-all duration-300`}
                      >
                        <div className="relative mb-3 w-20 h-20">
                          <Image
                            src={m.photoUrl || '/image/anggota.jpg'}
                            alt={m.name}
                            width={80}
                            height={80}
                            unoptimized
                            onError={(e) => {
                              const target = e.currentTarget;
                              if (!target.src.endsWith('/image/anggota.jpg')) {
                                target.src = '/image/anggota.jpg';
                              }
                            }}
                            className="w-20 h-20 rounded-full object-cover shadow-md border-3 border-brand-caramel p-0.5 bg-white"
                          />
                          <span className="absolute -bottom-1 -right-1 p-1 bg-brand-chocolate text-white rounded-full">
                            {mIdx === 0 ? <Award className="w-3.5 h-3.5" /> : <FileText className="w-3.5 h-3.5" />}
                          </span>
                        </div>
                        <h6 className="font-extrabold text-sm text-brand-dark line-clamp-1">{m.name}</h6>
                        <span className="text-xs text-brand-chocolate font-bold mt-0.5 line-clamp-1">
                          {m.position}
                        </span>
                        <span className="text-[10px] text-neutral-400 mt-2 bg-brand-sand px-2 py-0.5 rounded-full">
                          BPM Cakrawala
                        </span>
                      </div>
                    ))}

                    {/* Set 2 (Clone for infinite loop) */}
                    {members.map((m, mIdx) => (
                      <div
                        key={`m2-${m.id}`}
                        aria-hidden="true"
                        className={`${
                          mIdx % 2 === 0 ? 'floating-card' : 'floating-card-delayed'
                        } min-w-[200px] sm:min-w-[220px] max-w-[220px] shrink-0 p-5 rounded-3xl bg-white shadow-lg hover:shadow-2xl border border-brand-sand/80 flex flex-col items-center text-center transition-all duration-300`}
                      >
                        <div className="relative mb-3 w-20 h-20">
                          <Image
                            src={m.photoUrl || '/image/anggota.jpg'}
                            alt={m.name}
                            width={80}
                            height={80}
                            unoptimized
                            onError={(e) => {
                              const target = e.currentTarget;
                              if (!target.src.endsWith('/image/anggota.jpg')) {
                                target.src = '/image/anggota.jpg';
                              }
                            }}
                            className="w-20 h-20 rounded-full object-cover shadow-md border-3 border-brand-caramel p-0.5 bg-white"
                          />
                          <span className="absolute -bottom-1 -right-1 p-1 bg-brand-chocolate text-white rounded-full">
                            {mIdx === 0 ? <Award className="w-3.5 h-3.5" /> : <FileText className="w-3.5 h-3.5" />}
                          </span>
                        </div>
                        <h6 className="font-extrabold text-sm text-brand-dark line-clamp-1">{m.name}</h6>
                        <span className="text-xs text-brand-chocolate font-bold mt-0.5 line-clamp-1">
                          {m.position}
                        </span>
                        <span className="text-[10px] text-neutral-400 mt-2 bg-brand-sand px-2 py-0.5 rounded-full">
                          BPM Cakrawala
                        </span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="w-full p-8 text-center text-sm text-neutral-500">
                    Belum ada profil anggota yang ditambahkan untuk divisi ini.
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
