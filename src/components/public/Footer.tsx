import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Instagram, Youtube, MapPin } from 'lucide-react';

export default function Footer() {
  return (
    <footer
      id="tautan-penting"
      className="bg-gradient-to-r from-[#240A05] via-brand-dark to-[#240A05] text-neutral-300 border-t-2 border-brand-chocolate/40 overflow-hidden"
    >
      <div className="px-5 sm:px-10 lg:px-20 py-12 lg:py-16">
        <div className="flex flex-col lg:flex-row gap-8 sm:gap-10 lg:gap-16 justify-between items-start">
          {/* Brand & Attribution Section */}
          <div className="flex flex-col gap-3.5 max-w-sm">
            <div className="flex items-center gap-3">
              <div className="relative w-11 h-11 sm:w-14 sm:h-14 flex items-center justify-center shrink-0">
                <Image
                  src="/image/logo.png"
                  alt="Logo Cakrawala FEB UMJ"
                  width={56}
                  height={56}
                  className="w-full h-full object-contain"
                />
              </div>
              <div className="flex flex-col">
                <span className="font-extrabold text-white text-base md:text-lg leading-snug">
                  BPM Cakrawala
                </span>
                <span className="text-xs md:text-sm text-brand-caramel font-medium">
                  FEB Universitas Muhammadiyah Jakarta
                </span>
              </div>
            </div>

            <p className="text-xs sm:text-sm text-neutral-400 italic">
              &ldquo;Suara Cakrawala, Suara Mahasiswa!&rdquo;
            </p>

            <p className="text-xs sm:text-sm text-neutral-400">
              💻 with ❤️ by{' '}
              <span className="font-bold text-brand-caramel">
                Tim Media & IT BPM Cakrawala FEB UMJ
              </span>
            </p>
          </div>

          {/* Links Navigation Group (Touch-Friendly Links) */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-6 sm:gap-8 w-full lg:w-auto">
            {/* Kolom Menu */}
            <div className="flex flex-col gap-2.5">
              <p className="text-white font-bold text-xs sm:text-sm tracking-wide uppercase border-b border-brand-caramel/30 pb-1.5">
                Navigasi
              </p>
              <Link
                href="/"
                className="text-xs md:text-sm hover:text-brand-caramel active:text-brand-caramel py-1 min-h-[36px] flex items-center transition-colors"
              >
                Beranda
              </Link>
              <Link
                href="/tentang-kami"
                className="text-xs md:text-sm hover:text-brand-caramel active:text-brand-caramel py-1 min-h-[36px] flex items-center transition-colors"
              >
                Tentang Kami
              </Link>
              <Link
                href="/acara"
                className="text-xs md:text-sm hover:text-brand-caramel active:text-brand-caramel py-1 min-h-[36px] flex items-center transition-colors"
              >
                Acara & Liputan
              </Link>
              <a
                href="#tautan-penting"
                className="text-xs md:text-sm hover:text-brand-caramel active:text-brand-caramel py-1 min-h-[36px] flex items-center transition-colors"
              >
                Tautan Penting
              </a>
            </div>

            {/* Kolom Publikasi */}
            <div className="flex flex-col gap-2.5">
              <p className="text-white font-bold text-xs sm:text-sm tracking-wide uppercase border-b border-brand-caramel/30 pb-1.5">
                Publikasi
              </p>
              <Link
                href="/artikel"
                className="text-xs md:text-sm hover:text-brand-caramel active:text-brand-caramel py-1 min-h-[36px] flex items-center transition-colors"
              >
                Cakrawala News
              </Link>
              <Link
                href="/artikel"
                className="text-xs md:text-sm hover:text-brand-caramel active:text-brand-caramel py-1 min-h-[36px] flex items-center transition-colors"
              >
                E-Magazine FEB
              </Link>
              <Link
                href="/artikel"
                className="text-xs md:text-sm hover:text-brand-caramel active:text-brand-caramel py-1 min-h-[36px] flex items-center transition-colors"
              >
                Majalah Dinding
              </Link>
              <a
                href="https://feb.umj.ac.id"
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs md:text-sm hover:text-brand-caramel active:text-brand-caramel py-1 min-h-[36px] flex items-center transition-colors"
              >
                Portal FEB UMJ
              </a>
            </div>

            {/* Kolom Media Sosial (Touch Target Card di Mobile) */}
            <div className="flex flex-col gap-2.5 col-span-2 sm:col-span-1 pt-2 sm:pt-0">
              <p className="text-white font-bold text-xs sm:text-sm tracking-wide uppercase border-b border-brand-caramel/30 pb-1.5">
                Media Sosial
              </p>

              <div className="flex flex-col gap-2">
                <a
                  href="https://www.instagram.com/cakrawalafebumj/#"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2.5 px-3 py-2 rounded-xl bg-white/5 hover:bg-white/10 active:bg-white/15 active:scale-[0.98] border border-white/10 text-xs md:text-sm hover:text-brand-caramel transition-all min-h-[44px]"
                >
                  <Instagram className="w-4 h-4 text-brand-caramel shrink-0" />
                  <span>@cakrawalafebumj</span>
                </a>

                <a
                  href="https://www.youtube.com/@umjcampus"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2.5 px-3 py-2 rounded-xl bg-white/5 hover:bg-white/10 active:bg-white/15 active:scale-[0.98] border border-white/10 text-xs md:text-sm hover:text-brand-caramel transition-all min-h-[44px]"
                >
                  <Youtube className="w-4 h-4 text-brand-caramel shrink-0" />
                  <span>Cakrawala FEB UMJ</span>
                </a>

                <a
                  href="https://maps.google.com/?q=Fakultas+Ekonomi+dan+Bisnis+Universitas+Muhammadiyah Jakarta"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2.5 px-3 py-2 rounded-xl bg-white/5 hover:bg-white/10 active:bg-white/15 active:scale-[0.98] border border-white/10 text-xs md:text-sm hover:text-brand-caramel transition-all min-h-[44px]"
                >
                  <MapPin className="w-4 h-4 text-brand-caramel shrink-0" />
                  <span>FEB UMJ, Ciputat</span>
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Copyright Bar */}
        <div className="mt-10 sm:mt-12 pt-6 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between text-[11px] sm:text-xs text-neutral-400 gap-3 text-center sm:text-left">
          <p>
            &copy; 2026 Badan Pers Mahasiswa Cakrawala FEB UMJ. All rights reserved.{' '}
            <Link
              href="/admin/login"
              className="opacity-40 hover:opacity-100 hover:text-brand-caramel transition-opacity ml-1.5 inline-block py-1"
            >
              Panel Admin
            </Link>
          </p>
          <p>Jl. K.H. Ahmad Dahlan, Cirendeu, Ciputat Timur, Tangerang Selatan 15419</p>
        </div>
      </div>
    </footer>
  );
}
