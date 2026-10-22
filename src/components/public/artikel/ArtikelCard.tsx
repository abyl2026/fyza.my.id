'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Calendar, Clock, User, ArrowRight } from 'lucide-react';

export interface ArticleData {
  id: number;
  title: string;
  slug: string;
  excerpt?: string | null;
  content: string;
  coverImageUrl?: string | null;
  category: string;
  authorName: string;
  importantLink?: string | null;
  status: string;
  isTop: number;
  viewsCount: number;
  publishedAt?: string | null;
  createdAt: string;
}

interface ArtikelCardProps {
  article: ArticleData;
}

export default function ArtikelCard({ article }: ArtikelCardProps) {
  // Format Tanggal Publikasi (Bahasa Indonesia)
  const rawDate = article.publishedAt || article.createdAt;
  const dateObj = new Date(rawDate);
  const displayDate = !isNaN(dateObj.getTime())
    ? dateObj.toLocaleDateString('id-ID', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
      })
    : 'Terbaru';

  // Estimasi waktu baca (rata-rata 200 kata per menit)
  const plainText = (article.content || '').replace(/<[^>]*>/g, '');
  const wordCount = plainText.trim() ? plainText.trim().split(/\s+/).length : 0;
  const readMinutes = Math.max(1, Math.ceil(wordCount / 200));

  // Fallback cover image
  const displayImage = article.coverImageUrl && article.coverImageUrl.trim() !== ''
    ? article.coverImageUrl
    : '/image/artikel_image.jpg';

  return (
    <Link
      href={`/artikel/${article.slug}`}
      className="block group active:scale-[0.98] transition-transform"
    >
      <article className="bg-white rounded-3xl overflow-hidden shadow-md hover:shadow-xl border border-brand-sand hover:-translate-y-1 hover:border-brand-caramel/50 transition-all duration-300 flex flex-col h-full cursor-pointer select-none">
        {/* Cover Thumbnail */}
        <div className="h-48 sm:h-52 relative overflow-hidden bg-brand-sand/30">
          <Image
            src={displayImage}
            alt={article.title}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-brand-dark/70 via-transparent to-transparent" />

          {/* Badges di atas cover */}
          <div className="absolute top-3 left-3 right-3 flex items-center justify-between gap-2">
            <span className="text-[10px] sm:text-[11px] font-bold px-2.5 py-1 rounded-full bg-brand-chocolate text-white backdrop-blur-md shadow-xs">
              {article.category || 'Berita Kampus'}
            </span>
            <span className="text-[10px] sm:text-[11px] font-semibold px-2.5 py-1 rounded-full bg-white/90 text-brand-dark backdrop-blur-md shadow-xs">
              {readMinutes} Menit Baca
            </span>
          </div>

          {/* Info Tanggal di bagian bawah cover */}
          <div className="absolute bottom-2.5 left-3 right-3 text-white text-xs font-semibold flex items-center gap-1.5 drop-shadow">
            <Calendar className="w-3.5 h-3.5 text-brand-caramel shrink-0" />
            <span className="truncate">{displayDate}</span>
          </div>
        </div>

        {/* Body Card */}
        <div className="p-5 sm:p-6 flex flex-col justify-between flex-1 gap-4">
          <div>
            <h3 className="font-extrabold text-base sm:text-lg text-brand-dark group-hover:text-brand-chocolate transition-colors leading-snug line-clamp-2">
              {article.title}
            </h3>
            <p className="text-xs sm:text-sm text-neutral-600 mt-2 line-clamp-3 leading-relaxed">
              {article.excerpt || plainText.slice(0, 150) || 'Baca ulasan selengkapnya mengenai liputan dan gagasan kritis mahasiswa...'}
            </p>
          </div>

          {/* Footer Card: Penulis & Tombol Baca */}
          <div className="pt-3.5 border-t border-brand-sand flex items-center justify-between">
            <span className="text-[11px] sm:text-xs text-neutral-500 flex items-center gap-1.5 min-w-0">
              <User className="w-3.5 h-3.5 text-brand-chocolate shrink-0" />
              <span className="truncate max-w-[130px] font-medium">
                {article.authorName || 'Redaksi Cakrawala'}
              </span>
            </span>

            <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-brand-sand/70 group-hover:bg-brand-chocolate group-hover:text-white text-brand-chocolate font-bold text-xs transition-all shadow-xs shrink-0">
              <span>Baca Selengkapnya</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
            </span>
          </div>
        </div>
      </article>
    </Link>
  );
}
