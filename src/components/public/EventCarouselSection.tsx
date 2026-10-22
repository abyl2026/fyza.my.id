'use client';

import React, { useState, useEffect, useCallback, useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ChevronLeft, ChevronRight, Calendar } from 'lucide-react';

const slides = [
  { src: '/image/03.jpg', alt: 'Acara Cakrawala 1', title: 'Liputan Pelatihan Jurnalistik' },
  { src: '/image/04.jpg', alt: 'Acara Cakrawala 2', title: 'Diskusi Publik & Bedah Buku' },
  { src: '/image/05.jpg', alt: 'Acara Cakrawala 3', title: 'Festival Literasi Mahasiswa' },
  { src: '/image/06.jpg', alt: 'Acara Cakrawala 4', title: 'Pemberdayaan Pers Kampus' },
];

export default function EventCarouselSection() {
  const [currentSlide, setCurrentSlide] = useState(0);

  // Touch Swipe Gesture State untuk Pengalaman Native Mobile
  const touchStartX = useRef<number | null>(null);
  const touchEndX = useRef<number | null>(null);

  const nextSlide = useCallback(() => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  }, []);

  const prevSlide = useCallback(() => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
  }, []);

  // Handle Touch Gesture (Swipe kiri / kanan)
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
    touchEndX.current = null;
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    touchEndX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = () => {
    if (!touchStartX.current || !touchEndX.current) return;
    const distance = touchStartX.current - touchEndX.current;
    const minSwipeDistance = 50; // Jarak minimal usapan jari 50px

    if (distance > minSwipeDistance) {
      // Usap ke kiri -> slide berikutnya
      nextSlide();
    } else if (distance < -minSwipeDistance) {
      // Usap ke kanan -> slide sebelumnya
      prevSlide();
    }

    touchStartX.current = null;
    touchEndX.current = null;
  };

  useEffect(() => {
    const timer = setInterval(() => {
      nextSlide();
    }, 5500);
    return () => clearInterval(timer);
  }, [nextSlide]);

  return (
    <section
      id="acara-kami"
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      className="h-[480px] sm:h-[540px] lg:h-[calc(100vh-76px)] lg:min-h-[500px] bg-neutral-950 relative overflow-hidden flex items-center justify-center select-none"
    >
      {/* Tombol Navigasi Kiri (Touch Target 44x44px) */}
      <button
        type="button"
        onClick={prevSlide}
        aria-label="Acara Sebelumnya"
        className="z-20 absolute left-2 sm:left-4 lg:left-8 top-1/2 -translate-y-1/2 text-white/90 hover:text-white w-11 h-11 sm:w-12 sm:h-12 flex items-center justify-center rounded-full bg-black/40 hover:bg-brand-chocolate/80 active:bg-brand-chocolate active:scale-90 backdrop-blur-md border border-white/20 transition-all shadow-md focus:outline-none"
      >
        <ChevronLeft className="w-5 h-5 sm:w-6 sm:h-6" />
      </button>

      {/* Carousel Slides Container */}
      <div className="relative w-full h-full overflow-hidden">
        {slides.map((slide, index) => {
          const isActive = index === currentSlide;
          return (
            <div
              key={slide.src}
              className={`absolute inset-0 w-full h-full transition-opacity duration-700 ease-in-out ${
                isActive ? 'opacity-100 z-10' : 'opacity-0 z-0 pointer-events-none'
              }`}
            >
              <Image
                src={slide.src}
                alt={slide.alt}
                fill
                priority={index === 0}
                sizes="100vw"
                className="w-full h-full object-cover opacity-60 transition-transform duration-1000 scale-102"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-neutral-950 via-neutral-950/45 to-neutral-950/60" />
            </div>
          );
        })}
      </div>

      {/* Center Overlay Title & Button (Bebas Overflow di Layar 320px+) */}
      <div className="absolute z-20 left-1/2 -translate-x-1/2 top-1/2 -translate-y-1/2 md:top-auto md:bottom-12 md:translate-y-0 flex flex-col gap-3.5 sm:gap-4 items-center w-[calc(100%-4rem)] max-w-sm sm:max-w-md pointer-events-auto text-center px-2">
        {/* Sub-badge */}
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-brand-caramel text-xs font-semibold">
          <Calendar className="w-3.5 h-3.5" />
          <span>Agenda & Dokumentasi</span>
        </div>

        <h2 className="text-2xl sm:text-4xl md:text-5xl font-extrabold text-white tracking-tight drop-shadow-md leading-tight">
          Acara Kami
        </h2>

        <p className="text-neutral-300 text-xs sm:text-sm line-clamp-2 max-w-xs sm:max-w-sm drop-shadow">
          Telusuri seluruh rekam jejak kegiatan, forum jurnalistik, dan agenda pers mahasiswa.
        </p>

        {/* Action Button (Min 44px Touch Target) */}
        <Link
          href="/acara"
          className="min-h-[44px] w-full sm:w-auto inline-flex items-center justify-center transition-all duration-200 bg-white/15 hover:bg-white text-white hover:text-brand-dark active:bg-white active:text-brand-dark active:scale-95 border-2 border-white/80 hover:border-white px-7 py-2.5 rounded-xl text-xs sm:text-sm md:text-base font-bold backdrop-blur-md shadow-lg"
        >
          Lihat seluruh agenda
        </Link>

        {/* Dots Indicator dengan Area Tap Ramah Sentuhan (Min 36x36px) */}
        <div className="flex items-center gap-1 mt-1">
          {slides.map((_, index) => (
            <button
              key={index}
              type="button"
              onClick={() => setCurrentSlide(index)}
              aria-label={`Pilih slide ke-${index + 1}`}
              className="w-8 h-8 flex items-center justify-center focus:outline-none"
            >
              <span
                className={`block rounded-full transition-all duration-300 ${
                  index === currentSlide
                    ? 'w-6 h-2 bg-brand-caramel shadow-xs'
                    : 'w-2 h-2 bg-white/40 hover:bg-white/70'
                }`}
              />
            </button>
          ))}
        </div>
      </div>

      {/* Tombol Navigasi Kanan (Touch Target 44x44px) */}
      <button
        type="button"
        onClick={nextSlide}
        aria-label="Acara Berikutnya"
        className="z-20 absolute right-2 sm:right-4 lg:right-8 top-1/2 -translate-y-1/2 text-white/90 hover:text-white w-11 h-11 sm:w-12 sm:h-12 flex items-center justify-center rounded-full bg-black/40 hover:bg-brand-chocolate/80 active:bg-brand-chocolate active:scale-90 backdrop-blur-md border border-white/20 transition-all shadow-md focus:outline-none"
      >
        <ChevronRight className="w-5 h-5 sm:w-6 sm:h-6" />
      </button>
    </section>
  );
}
