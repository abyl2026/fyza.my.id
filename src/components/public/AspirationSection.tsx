import React from 'react';
import Link from 'next/link';
import { Megaphone, ArrowRight } from 'lucide-react';

export default function AspirationSection() {
  return (
    <section className="bg-gradient-to-r from-brand-sand/60 via-white to-brand-sand/40 px-4 sm:px-10 lg:px-28 py-12 sm:py-16 lg:py-24 flex flex-col md:flex-row items-center justify-center gap-8 sm:gap-10 lg:gap-16 border-t border-brand-sand/70">
      {/* Box Aksen Grafis Kiri */}
      <div className="w-full md:w-1/3 flex flex-col bg-gradient-to-br from-brand-dark via-brand-chocolate to-brand-walnut p-6 sm:p-8 lg:p-10 text-white rounded-3xl shadow-xl justify-between min-h-[200px] sm:min-h-[220px]">
        <div className="flex items-center gap-3">
          <div className="p-2.5 sm:p-3 bg-white/10 rounded-2xl backdrop-blur-md">
            <Megaphone className="w-6 h-6 sm:w-7 sm:h-7 text-brand-caramel" />
          </div>
          <div>
            <h3 className="font-bold text-base sm:text-lg text-white">Kanal Aspirasi</h3>
            <p className="text-xs text-brand-caramel">BPM Cakrawala FEB UMJ</p>
          </div>
        </div>
        <p className="text-xs sm:text-sm text-neutral-200 mt-4 leading-relaxed text-left">
          Wadah terbuka untuk menyampaikan opini, keresahan, liputan kegiatan, atau saran konstruktif demi kemajuan bersama civitas akademika.
        </p>
      </div>

      {/* Teks & Tombol Call to Action Kanan */}
      <div className="w-full md:w-1/2 flex flex-col gap-4 sm:gap-5 items-start">
        <h2 className="text-2xl sm:text-4xl lg:text-5xl font-extrabold text-brand-dark tracking-tight leading-tight">
          Sampaikan aspirasi Anda
        </h2>

        <p className="text-neutral-700 text-xs sm:text-base lg:text-lg leading-relaxed text-left">
          BPM Cakrawala FEB UMJ menjunjung tinggi keterbukaan informasi dan kebebasan berekspresi seluruh mahasiswa FEB UMJ. Sampaikan aspirasi, berita kampus, atau feedback Anda agar bersama-sama kita dapat ciptakan perubahan yang lebih baik!
        </p>

        {/* CTA Button Touch-Friendly (Min 48px, Full-width di mobile) */}
        <Link
          href="/aspirasi"
          className="min-h-[48px] w-full sm:w-auto inline-flex items-center justify-center transition-all duration-300 bg-gradient-to-r from-brand-chocolate to-brand-walnut hover:from-brand-dark hover:to-brand-chocolate active:from-brand-dark active:to-brand-dark active:scale-[0.98] text-white px-7 py-3 rounded-xl font-bold text-sm lg:text-base group shadow-md hover:shadow-xl"
        >
          <span>Berikan aspirasi sekarang</span>
          <ArrowRight className="w-4 h-4 ml-2 transition-transform duration-300 group-hover:translate-x-1" />
        </Link>
      </div>
    </section>
  );
}
