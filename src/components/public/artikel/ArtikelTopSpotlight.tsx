'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Flame, Clock, Calendar, ArrowRight } from 'lucide-react';
import { ArticleData } from './ArtikelCard';

interface ArtikelTopSpotlightProps {
  article: ArticleData;
}

export default function ArtikelTopSpotlight({ article }: ArtikelTopSpotlightProps) {
  // Format Tanggal
  const rawDate = article.publishedAt || article.createdAt;
  const dateObj = new Date(rawDate);
  const displayDate = !isNaN(dateObj.getTime())
    ? dateObj.toLocaleDateString('id-ID', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
      })
    : '27 September 2026';

  // Estimasi waktu baca
  const plainText = (article.content || '').replace(/<[^>]*>/g, '');
  const wordCount = plainText.trim() ? plainText.trim().split(/\s+/).length : 0;
  const readMinutes = Math.max(1, Math.ceil(wordCount / 200));

  // Author initial
  const authorName = article.authorName || 'Redaksi Cakrawala';
  const authorInitials = authorName
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0].toUpperCase())
    .join('') || 'RC';

  // Fallback image
  const displayImage = article.coverImageUrl && article.coverImageUrl.trim() !== ''
    ? article.coverImageUrl
    : '/image/artikel_image.jpg';

  return (
    <section className="py-6 sm:py-10 px-4 sm:px-10 lg:px-28">
      <div className="max-w-7xl mx-auto">
        {/* Label Header Sorotan */}
        <div className="flex items-center gap-2 mb-3 sm:mb-4">
          <span className="flex h-2.5 w-2.5 rounded-full bg-red-600 animate-ping" />
          <span className="text-[11px] sm:text-xs font-extrabold uppercase tracking-widest text-brand-chocolate">
            TOP ARTIKEL / SOROTAN UTAMA
          </span>
        </div>

        {/* Spotlight Card Top Artikel */}
        <Link
          href={`/artikel/${article.slug}`}
          className="block group active:scale-[0.99] transition-transform"
        >
          <div className="bg-white rounded-3xl overflow-hidden shadow-xl border-2 border-brand-caramel/40 hover:border-brand-caramel transition-all duration-300 flex flex-col lg:flex-row cursor-pointer select-none">
            {/* Image Top Artikel (Kiri) */}
            <div className="w-full lg:w-3/5 h-60 sm:h-80 lg:h-auto relative overflow-hidden shrink-0 min-h-[240px] sm:min-h-[320px]">
              <Image
                src={displayImage}
                alt={article.title}
                fill
                sizes="(max-width: 1024px) 100vw, 60vw"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                priority
              />
              <div className="absolute inset-0 bg-gradient-to-t from-brand-dark/80 via-transparent to-transparent" />

              {/* Badges di atas gambar */}
              <div className="absolute top-3 left-3 sm:top-4 sm:left-4 flex gap-1.5 sm:gap-2 flex-wrap">
                <span className="px-3 py-1 sm:px-3.5 sm:py-1.5 rounded-full bg-brand-dark text-white font-extrabold text-[10px] sm:text-xs tracking-wider uppercase shadow-md backdrop-blur-sm border border-brand-caramel/50 flex items-center gap-1.5">
                  <Flame className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
                  <span>TOP OF THE WEEK</span>
                </span>
                <span className="px-2.5 py-1 sm:px-3 sm:py-1.5 rounded-full bg-white/90 text-brand-chocolate font-bold text-[10px] sm:text-xs shadow-md">
                  {article.category || 'Kajian Berita'}
                </span>
              </div>

              {/* Info Waktu & Tanggal di bawah gambar */}
              <div className="absolute bottom-3 left-3 right-3 sm:bottom-4 sm:left-4 sm:right-4 text-white text-[11px] sm:text-xs flex items-center gap-3">
                <span className="flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5 text-brand-caramel" />
                  <span>{readMinutes} Menit Baca</span>
                </span>
                <span className="flex items-center gap-1">
                  <Calendar className="w-3.5 h-3.5 text-brand-caramel" />
                  <span className="truncate">{displayDate}</span>
                </span>
              </div>
            </div>

            {/* Body Top Artikel (Kanan) */}
            <div className="w-full lg:w-2/5 p-5 sm:p-8 lg:p-10 flex flex-col justify-between gap-5 sm:gap-6 bg-gradient-to-br from-white via-brand-cream to-brand-sand/40">
              <div className="flex flex-col gap-2.5 sm:gap-3">
                <span className="text-[10px] sm:text-xs font-bold text-brand-caramel uppercase tracking-wider">
                  Investigasi & Analisis Eksklusif
                </span>
                <h2 className="text-xl sm:text-2xl lg:text-3xl font-extrabold text-brand-dark leading-snug group-hover:text-brand-chocolate transition-colors line-clamp-3">
                  {article.title}
                </h2>
                <p className="text-neutral-600 text-xs sm:text-sm lg:text-base leading-relaxed text-left line-clamp-4">
                  {article.excerpt || plainText.slice(0, 220) || 'Ulasan mendalam dan tajam mengenai dinamika terkini yang disajikan oleh tim jurnalis kampus.'}
                </p>
              </div>

              <div className="pt-3.5 border-t border-brand-sand flex items-center justify-between">
                <div className="flex items-center gap-2 sm:gap-2.5 min-w-0">
                  <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-brand-chocolate/10 flex items-center justify-center text-brand-chocolate font-bold text-xs shrink-0">
                    {authorInitials}
                  </div>
                  <div className="flex flex-col min-w-0">
                    <span className="text-xs font-bold text-brand-dark truncate">
                      {authorName}
                    </span>
                    <span className="text-[10px] text-neutral-400 truncate">
                      Tim Riset & Opini
                    </span>
                  </div>
                </div>

                {/* Tombol Baca Lengkap */}
                <span className="inline-flex items-center gap-1.5 sm:gap-2 min-h-[40px] px-4 sm:px-5 py-2 rounded-xl bg-gradient-to-r from-brand-chocolate to-brand-walnut group-hover:from-brand-dark group-hover:to-brand-chocolate text-white text-xs sm:text-sm font-bold shadow-md hover:shadow-lg transition-all shrink-0">
                  <span>Baca Lengkap</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1.5 transition-transform" />
                </span>
              </div>
            </div>
          </div>
        </Link>
      </div>
    </section>
  );
}
