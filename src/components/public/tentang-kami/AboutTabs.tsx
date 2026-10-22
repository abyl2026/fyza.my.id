'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { Eye, Target, Flame, CheckCircle2 } from 'lucide-react';

interface AboutTabsProps {
  vision: string;
  mission: string[];
  motto: string;
  mottoDescription: string;
}

export default function AboutTabs({
  vision,
  mission,
  motto,
  mottoDescription,
}: AboutTabsProps) {
  const [activeTab, setActiveTab] = useState<'visi' | 'misi' | 'motto'>('visi');

  return (
    <section className="bg-gradient-to-br from-brand-sand/80 via-brand-cream to-brand-sand/50 py-10 sm:py-16 lg:py-20 px-4 sm:px-10 lg:px-28 flex flex-col items-center justify-center">
      <div className="max-w-5xl w-full flex flex-col items-center gap-6 sm:gap-8">
        {/* Logo & Header Title */}
        <div className="flex flex-col items-center text-center gap-2.5 sm:gap-3">
          <div className="relative h-16 sm:h-24 w-20 sm:w-28 flex items-center justify-center">
            <Image
              src="/image/logo.png"
              alt="Logo Cakrawala"
              width={96}
              height={96}
              className="h-16 sm:h-24 w-auto object-contain drop-shadow-md hover:scale-105 transition-transform duration-300"
              priority
            />
          </div>
          <div className="inline-block px-3 py-1 rounded-full bg-brand-chocolate/10 border border-brand-chocolate/20 text-brand-chocolate text-[11px] sm:text-xs font-bold tracking-widest uppercase">
            Badan Pers Mahasiswa FEB UMJ
          </div>
          <h1 className="text-2xl sm:text-4xl lg:text-5xl font-extrabold text-brand-dark tracking-tight">
            Tentang Cakrawala FEB UMJ
          </h1>
          <p className="text-neutral-600 max-w-2xl text-xs sm:text-base leading-relaxed px-2">
            Mengenal lebih dalam komitmen, landasan idealisme, dan arah gerak BPM Cakrawala dalam mengawal dinamika intelektual civitas akademika FEB UMJ.
          </p>
        </div>

        {/* Tab Selector: Visi | Misi | Motto (Touch-friendly 48px) */}
        <div className="w-full max-w-xl flex flex-row gap-1.5 sm:gap-2 bg-white/90 p-1 sm:p-1.5 rounded-2xl shadow-sm border border-brand-sand">
          {/* Tab Visi */}
          <button
            type="button"
            onClick={() => setActiveTab('visi')}
            className={`flex-1 min-h-[48px] py-2.5 px-3 rounded-xl flex items-center justify-center gap-1.5 sm:gap-2 font-bold text-xs sm:text-base transition-all duration-300 active:scale-95 cursor-pointer ${
              activeTab === 'visi'
                ? 'bg-gradient-to-r from-brand-dark to-brand-chocolate text-white shadow-md'
                : 'text-neutral-600 hover:text-brand-dark hover:bg-brand-sand/50'
            }`}
            aria-label="Pilih Tab Visi"
          >
            <Eye className="w-4 h-4 shrink-0" />
            <span>Visi</span>
          </button>

          {/* Tab Misi */}
          <button
            type="button"
            onClick={() => setActiveTab('misi')}
            className={`flex-1 min-h-[48px] py-2.5 px-3 rounded-xl flex items-center justify-center gap-1.5 sm:gap-2 font-bold text-xs sm:text-base transition-all duration-300 active:scale-95 cursor-pointer ${
              activeTab === 'misi'
                ? 'bg-gradient-to-r from-brand-dark to-brand-chocolate text-white shadow-md'
                : 'text-neutral-600 hover:text-brand-dark hover:bg-brand-sand/50'
            }`}
            aria-label="Pilih Tab Misi"
          >
            <Target className="w-4 h-4 shrink-0" />
            <span>Misi</span>
          </button>

          {/* Tab Motto */}
          <button
            type="button"
            onClick={() => setActiveTab('motto')}
            className={`flex-1 min-h-[48px] py-2.5 px-3 rounded-xl flex items-center justify-center gap-1.5 sm:gap-2 font-bold text-xs sm:text-base transition-all duration-300 active:scale-95 cursor-pointer ${
              activeTab === 'motto'
                ? 'bg-gradient-to-r from-brand-dark to-brand-chocolate text-white shadow-md'
                : 'text-neutral-600 hover:text-brand-dark hover:bg-brand-sand/50'
            }`}
            aria-label="Pilih Tab Motto"
          >
            <Flame className="w-4 h-4 shrink-0" />
            <span>Motto</span>
          </button>
        </div>

        {/* Content Card Dinamis */}
        <div className="w-full bg-white rounded-3xl p-5 sm:p-10 lg:p-12 shadow-xl border border-brand-sand/70 transition-all duration-500 min-h-[220px] flex items-center">
          {/* Content Visi */}
          {activeTab === 'visi' && (
            <div className="w-full flex flex-col sm:flex-row items-center sm:items-start lg:items-center gap-5 sm:gap-8 animate-fadeIn text-center sm:text-left">
              <div className="w-14 h-14 sm:w-20 sm:h-20 rounded-2xl bg-brand-chocolate/10 flex items-center justify-center text-brand-chocolate shrink-0">
                <Eye className="w-7 h-7 sm:w-10 sm:h-10" />
              </div>
              <div className="flex flex-col gap-2 sm:gap-3">
                <h2 className="text-xl sm:text-2xl font-extrabold text-brand-dark">Visi BPM Cakrawala FEB UMJ</h2>
                <p className="text-neutral-700 leading-relaxed text-xs sm:text-base lg:text-lg text-justify sm:text-left">
                  &ldquo;{vision || 'Menjadikan BPM Cakrawala FEB UMJ sebagai lembaga pers mahasiswa yang independen, profesional, berintegritas tinggi, dan responsif terhadap dinamika intelektual serta aspirasi civitas akademika.'}&rdquo;
                </p>
              </div>
            </div>
          )}

          {/* Content Misi */}
          {activeTab === 'misi' && (
            <div className="w-full flex flex-col sm:flex-row items-center sm:items-start lg:items-center gap-5 sm:gap-8 animate-fadeIn text-left">
              <div className="w-14 h-14 sm:w-20 sm:h-20 rounded-2xl bg-brand-walnut/10 flex items-center justify-center text-brand-walnut shrink-0 self-center sm:self-start lg:self-center">
                <Target className="w-7 h-7 sm:w-10 sm:h-10" />
              </div>
              <div className="flex flex-col gap-3 w-full">
                <h2 className="text-xl sm:text-2xl font-extrabold text-brand-dark text-center sm:text-left">Misi Utama</h2>
                <ul className="space-y-2 sm:space-y-2.5 text-neutral-700 text-xs sm:text-base">
                  {mission && mission.length > 0 ? (
                    mission.map((item, index) => (
                      <li key={index} className="flex items-start gap-2.5 p-2 rounded-xl bg-brand-cream/40 sm:bg-transparent">
                        <CheckCircle2 className="w-4 h-4 sm:w-5 sm:h-5 text-brand-caramel shrink-0 mt-0.5" />
                        <span className="leading-relaxed">{item}</span>
                      </li>
                    ))
                  ) : (
                    <>
                      <li className="flex items-start gap-2.5 p-2 rounded-xl bg-brand-cream/40 sm:bg-transparent">
                        <CheckCircle2 className="w-4 h-4 sm:w-5 sm:h-5 text-brand-caramel shrink-0 mt-0.5" />
                        <span className="leading-relaxed">Menyelenggarakan kegiatan jurnalistik yang kritis, objektif, dan berimbang.</span>
                      </li>
                      <li className="flex items-start gap-2.5 p-2 rounded-xl bg-brand-cream/40 sm:bg-transparent">
                        <CheckCircle2 className="w-4 h-4 sm:w-5 sm:h-5 text-brand-caramel shrink-0 mt-0.5" />
                        <span className="leading-relaxed">Mengembangkan kapasitas literasi dan keterampilan investigatif mahasiswa.</span>
                      </li>
                      <li className="flex items-start gap-2.5 p-2 rounded-xl bg-brand-cream/40 sm:bg-transparent">
                        <CheckCircle2 className="w-4 h-4 sm:w-5 sm:h-5 text-brand-caramel shrink-0 mt-0.5" />
                        <span className="leading-relaxed">Menjadi jembatan aspirasi yang konstruktif antara mahasiswa dan pihak kampus.</span>
                      </li>
                    </>
                  )}
                </ul>
              </div>
            </div>
          )}

          {/* Content Motto */}
          {activeTab === 'motto' && (
            <div className="w-full flex flex-col sm:flex-row items-center sm:items-start lg:items-center gap-5 sm:gap-8 animate-fadeIn text-center sm:text-left">
              <div className="w-14 h-14 sm:w-20 sm:h-20 rounded-2xl bg-brand-caramel/20 flex items-center justify-center text-brand-dark shrink-0">
                <Flame className="w-7 h-7 sm:w-10 sm:h-10" />
              </div>
              <div className="flex flex-col gap-2 sm:gap-3">
                <span className="text-[10px] sm:text-xs font-bold uppercase tracking-widest text-brand-caramel">
                  Motto Resmi Organisasi
                </span>
                <h2 className="text-xl sm:text-3xl lg:text-4xl font-extrabold text-brand-dark italic">
                  &ldquo;{motto || 'Suara Cakrawala, Suara Mahasiswa!'}&rdquo;
                </h2>
                <p className="text-neutral-600 text-xs sm:text-base leading-relaxed">
                  {mottoDescription ||
                    'Motto ini menjadi kompas integritas dalam memberitakan kebenaran dan menjadi garda terdepan aspirasi mahasiswa FEB UMJ.'}
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
