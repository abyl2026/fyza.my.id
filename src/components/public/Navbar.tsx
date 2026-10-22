'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { Menu, X, ArrowRight } from 'lucide-react';

export default function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const pathname = usePathname();

  const isHome = pathname === '/';
  const isAbout = pathname === '/tentang-kami';
  const isAcara = pathname === '/acara';
  const isArtikel = pathname.startsWith('/artikel');

  // Kunci scroll body saat mobile menu terbuka agar tidak tembus scroll
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [mobileMenuOpen]);

  // Tutup menu saat berpindah halaman
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [pathname]);

  return (
    <>
      <header
        className="w-full fixed top-0 left-0 z-50 flex items-center justify-between shadow-xs px-4 sm:px-6 lg:px-12 bg-white/95 backdrop-blur-md border-b border-brand-sand/60 select-none"
        style={{
          height: '72px',
          minHeight: '72px',
          maxHeight: '72px',
          boxSizing: 'border-box',
        }}
      >
        {/* Logo & Nama Organisasi (Touch target nyaman min 44px) */}
        <Link
          href="/"
          className="flex items-center gap-2.5 sm:gap-3 group h-[72px] min-h-[44px] active:scale-[0.98] transition-transform"
        >
          <div className="relative w-9 h-9 sm:w-10 sm:h-10 flex items-center justify-center shrink-0">
            <Image
              src="/image/logo.png"
              alt="Logo Cakrawala FEB UMJ"
              width={42}
              height={42}
              className="w-auto h-9 sm:h-[42px] max-h-[42px] object-contain transition-transform duration-300 group-hover:scale-105"
              priority
            />
          </div>
          <div className="flex flex-col justify-center">
            <span className="font-extrabold text-[0.95rem] sm:text-[1.05rem] lg:text-[1.15rem] leading-none text-brand-dark tracking-tight">
              CAKRAWALA
            </span>
            <span className="font-semibold text-[0.65rem] sm:text-[0.7rem] lg:text-[0.75rem] text-brand-walnut tracking-wider uppercase mt-1">
              FEB UMJ
            </span>
          </div>
        </Link>

        {/* Desktop Navigation Links (Layar Lebar) */}
        <nav className="hidden lg:flex items-center gap-8 h-full">
          {/* Beranda */}
          <Link
            href="/"
            className="flex flex-col justify-center cursor-pointer group h-[72px] relative"
          >
            <span
              className={`text-[0.95rem] transition-colors ${
                isHome ? 'font-bold text-brand-dark' : 'font-semibold text-neutral-600 group-hover:text-brand-dark'
              }`}
            >
              Beranda
            </span>
            {isHome ? (
              <div className="absolute bottom-3 left-0 right-0 h-[3px] rounded-full bg-gradient-to-r from-brand-dark via-brand-chocolate to-brand-caramel" />
            ) : (
              <div className="absolute bottom-3 left-0 right-0 h-[3px] rounded-full scale-x-0 group-hover:scale-x-100 transition-all duration-300 origin-left bg-brand-chocolate" />
            )}
          </Link>

          {/* Tentang Kami */}
          <Link
            href="/tentang-kami"
            className="flex flex-col justify-center cursor-pointer group h-[72px] relative"
          >
            <span
              className={`text-[0.95rem] transition-colors ${
                isAbout ? 'font-bold text-brand-dark' : 'font-semibold text-neutral-600 group-hover:text-brand-dark'
              }`}
            >
              Tentang Kami
            </span>
            {isAbout ? (
              <div className="absolute bottom-3 left-0 right-0 h-[3px] rounded-full bg-gradient-to-r from-brand-dark via-brand-chocolate to-brand-caramel" />
            ) : (
              <div className="absolute bottom-3 left-0 right-0 h-[3px] rounded-full scale-x-0 group-hover:scale-x-100 transition-all duration-300 origin-left bg-brand-chocolate" />
            )}
          </Link>

          {/* Acara */}
          <Link
            href="/acara"
            className="flex flex-col justify-center cursor-pointer group h-[72px] relative"
          >
            <span
              className={`text-[0.95rem] transition-colors ${
                isAcara ? 'font-bold text-brand-dark' : 'font-semibold text-neutral-600 group-hover:text-brand-dark'
              }`}
            >
              Acara
            </span>
            {isAcara ? (
              <div className="absolute bottom-3 left-0 right-0 h-[3px] rounded-full bg-gradient-to-r from-brand-dark via-brand-chocolate to-brand-caramel" />
            ) : (
              <div className="absolute bottom-3 left-0 right-0 h-[3px] rounded-full scale-x-0 group-hover:scale-x-100 transition-all duration-300 origin-left bg-brand-chocolate" />
            )}
          </Link>

          {/* Artikel */}
          <Link
            href="/artikel"
            className="flex flex-col justify-center cursor-pointer group h-[72px] relative"
          >
            <span
              className={`text-[0.95rem] transition-colors ${
                isArtikel ? 'font-bold text-brand-dark' : 'font-semibold text-neutral-600 group-hover:text-brand-dark'
              }`}
            >
              Artikel
            </span>
            {isArtikel ? (
              <div className="absolute bottom-3 left-0 right-0 h-[3px] rounded-full bg-gradient-to-r from-brand-dark via-brand-chocolate to-brand-caramel" />
            ) : (
              <div className="absolute bottom-3 left-0 right-0 h-[3px] rounded-full scale-x-0 group-hover:scale-x-100 transition-all duration-300 origin-left bg-brand-chocolate" />
            )}
          </Link>

          

          {/* Tombol Aspirasi */}
          <Link
            href="/aspirasi"
            className="flex items-center justify-center transition-all duration-200 border-2 border-brand-chocolate text-brand-chocolate hover:bg-brand-chocolate hover:text-white active:scale-95 px-5 rounded-lg font-bold text-sm tracking-wide shadow-xs hover:shadow-sm h-[40px]"
            style={{ boxSizing: 'border-box' }}
          >
            Aspirasi
          </Link>
        </nav>

        {/* Mobile Hamburger Toggle (Touch target 44x44px ramah jari) */}
        <div className="flex lg:hidden items-center h-full">
          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label={mobileMenuOpen ? 'Tutup Menu Navigasi' : 'Buka Menu Navigasi'}
            className="w-11 h-11 flex items-center justify-center rounded-xl text-brand-dark hover:text-brand-chocolate hover:bg-brand-sand/50 active:bg-brand-sand active:scale-90 transition-all focus:outline-none"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </header>

      {/* Backdrop Gelap Mobile Overlay (Bisa diklik untuk menutup) */}
      {mobileMenuOpen && (
        <div
          onClick={() => setMobileMenuOpen(false)}
          aria-hidden="true"
          className="fixed inset-0 bg-black/40 backdrop-blur-xs z-40 lg:hidden transition-opacity duration-300 animate-in fade-in"
          style={{ top: '72px' }}
        />
      )}

      {/* Mobile Drawer Dropdown Menu (Touch-Friendly 44px+ Per Item) */}
      <div
        className={`fixed left-0 w-full bg-white/98 backdrop-blur-md shadow-2xl border-b border-brand-sand z-40 lg:hidden px-4 py-5 transition-all duration-300 ease-out max-h-[calc(100svh-72px)] overflow-y-auto ${
          mobileMenuOpen
            ? 'top-[72px] opacity-100 translate-y-0 pointer-events-auto'
            : '-top-full opacity-0 -translate-y-4 pointer-events-none'
        }`}
      >
        <div className="flex flex-col gap-1.5 font-medium text-neutral-700">
          {/* Beranda */}
          <Link
            href="/"
            onClick={() => setMobileMenuOpen(false)}
            className={`min-h-[48px] px-3.5 py-3 rounded-xl flex items-center justify-between text-sm transition-all active:scale-[0.98] ${
              isHome
                ? 'bg-brand-sand/60 text-brand-dark font-extrabold border-l-4 border-brand-chocolate'
                : 'text-neutral-700 hover:bg-brand-sand/30 hover:text-brand-dark active:bg-brand-sand/50'
            }`}
          >
            <span>Beranda</span>
            <ArrowRight className={`w-4 h-4 transition-transform ${isHome ? 'text-brand-chocolate' : 'opacity-40'}`} />
          </Link>

          {/* Tentang Kami */}
          <Link
            href="/tentang-kami"
            onClick={() => setMobileMenuOpen(false)}
            className={`min-h-[48px] px-3.5 py-3 rounded-xl flex items-center justify-between text-sm transition-all active:scale-[0.98] ${
              isAbout
                ? 'bg-brand-sand/60 text-brand-dark font-extrabold border-l-4 border-brand-chocolate'
                : 'text-neutral-700 hover:bg-brand-sand/30 hover:text-brand-dark active:bg-brand-sand/50'
            }`}
          >
            <span>Tentang Kami</span>
            <ArrowRight className={`w-4 h-4 transition-transform ${isAbout ? 'text-brand-chocolate' : 'opacity-40'}`} />
          </Link>

          {/* Acara */}
          <Link
            href="/acara"
            onClick={() => setMobileMenuOpen(false)}
            className={`min-h-[48px] px-3.5 py-3 rounded-xl flex items-center justify-between text-sm transition-all active:scale-[0.98] ${
              isAcara
                ? 'bg-brand-sand/60 text-brand-dark font-extrabold border-l-4 border-brand-chocolate'
                : 'text-neutral-700 hover:bg-brand-sand/30 hover:text-brand-dark active:bg-brand-sand/50'
            }`}
          >
            <span>Acara & Liputan</span>
            <ArrowRight className={`w-4 h-4 transition-transform ${isAcara ? 'text-brand-chocolate' : 'opacity-40'}`} />
          </Link>

          {/* Artikel */}
          <Link
            href="/artikel"
            onClick={() => setMobileMenuOpen(false)}
            className={`min-h-[48px] px-3.5 py-3 rounded-xl flex items-center justify-between text-sm transition-all active:scale-[0.98] ${
              isArtikel
                ? 'bg-brand-sand/60 text-brand-dark font-extrabold border-l-4 border-brand-chocolate'
                : 'text-neutral-700 hover:bg-brand-sand/30 hover:text-brand-dark active:bg-brand-sand/50'
            }`}
          >
            <span>Artikel & Warta</span>
            <ArrowRight className={`w-4 h-4 transition-transform ${isArtikel ? 'text-brand-chocolate' : 'opacity-40'}`} />
          </Link>


          {/* Tombol Aspirasi Mobile Prominen */}
          <div className="pt-2">
            <Link
              href="/aspirasi"
              onClick={() => setMobileMenuOpen(false)}
              className="min-h-[48px] w-full flex items-center justify-center gap-2 text-center bg-gradient-to-r from-brand-chocolate to-brand-walnut active:from-brand-dark active:to-brand-chocolate text-white py-3 px-4 rounded-xl font-bold text-sm shadow-md active:scale-[0.98] transition-all"
            >
              <span>Salurkan Aspirasi</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}
