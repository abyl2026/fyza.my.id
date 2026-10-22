import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight, BookOpen } from 'lucide-react';

export default function AboutSection() {
  return (
    <section
      id="tentang-kami"
      className="py-14 sm:py-20 lg:py-32 bg-gradient-to-br from-brand-sand/70 via-white to-brand-sand/40 px-4 sm:px-10 lg:px-28 flex flex-col justify-center"
    >
      <div className="max-w-7xl mx-auto w-full flex flex-col-reverse md:flex-row items-stretch gap-6 sm:gap-8 lg:gap-12">
        {/* Sisi Kiri: Card Penjelasan Organisasi */}
        <div className="flex flex-col justify-between bg-gradient-to-r from-brand-dark via-brand-chocolate to-brand-walnut md:w-1/2 p-6 sm:p-10 lg:p-12 text-white rounded-3xl shadow-xl sm:shadow-2xl relative overflow-hidden">
          <div className="absolute -right-12 -bottom-12 w-48 h-48 rounded-full bg-brand-caramel/10 blur-2xl pointer-events-none" />

          <div className="flex flex-col gap-4 sm:gap-5 z-10">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-brand-caramel/20 border border-brand-caramel/30 text-brand-caramel text-xs font-bold tracking-widest uppercase w-max">
              <BookOpen className="w-3.5 h-3.5" />
              <span>Pers Mahasiswa</span>
            </div>

            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold leading-snug tracking-tight">
              Tentang BPM Cakrawala FEB UMJ
            </h2>

            <p className="text-neutral-200 text-sm sm:text-base lg:text-[1.05rem] leading-relaxed text-left">
              Badan Pers Mahasiswa (BPM) Cakrawala FEB UMJ merupakan lembaga pers mahasiswa independen yang mengemban amanah sebagai corong informasi, wadah literasi kritis, dan penyambung aspirasi segenap civitas akademika di lingkungan Fakultas Ekonomi dan Bisnis Universitas Muhammadiyah Jakarta.
            </p>

            {/* Motto Box */}
            <div className="p-4 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-sm">
              <p className="text-[11px] sm:text-xs uppercase tracking-wider text-brand-caramel font-bold mb-1">
                Motto Utama
              </p>
              <p className="text-base sm:text-lg font-extrabold italic text-white leading-snug">
                &ldquo;Suara Cakrawala, Suara Mahasiswa!&rdquo;
              </p>
            </div>
          </div>

          {/* Link / CTA Touch-Friendly Button (Min 44px) */}
          <div className="pt-6 z-10">
            <Link
              href="/tentang-kami"
              className="min-h-[44px] w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-white/10 hover:bg-white text-white hover:text-brand-dark active:scale-[0.98] border border-white/20 font-bold text-xs sm:text-sm tracking-wide transition-all shadow-sm group/link"
            >
              <span>Pelajari Profil & Kepengurusan Lengkap</span>
              <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover/link:translate-x-1" />
            </Link>
          </div>
        </div>

        {/* Sisi Kanan: Foto Dokumentasi Organisasi */}
        <div className="relative w-full md:w-1/2 min-h-[260px] sm:min-h-[340px] lg:min-h-[420px] rounded-3xl overflow-hidden shadow-xl sm:shadow-2xl group border-2 sm:border-4 border-white">
          <Image
            src="/image/02.jpg"
            alt="Pengurus Cakrawala FEB UMJ"
            fill
            sizes="(max-width: 768px) 100vw, 50vw"
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-brand-dark/75 via-transparent to-transparent" />

          <div className="absolute bottom-5 left-5 right-5 text-white z-10">
            <span className="text-[11px] sm:text-xs font-semibold uppercase tracking-wider bg-brand-chocolate/80 backdrop-blur-md px-2.5 py-1 rounded-md text-white inline-block mb-1.5 shadow-xs">
              Dokumentasi
            </span>
            <p className="font-bold text-sm sm:text-base lg:text-lg leading-snug">
              Kiprah & Kebersamaan BPM Cakrawala FEB UMJ
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
