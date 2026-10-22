'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight, BookOpen } from 'lucide-react';

interface ArticleItem {
  id: number;
  title: string;
  slug?: string;
  excerpt?: string | null;
  coverImageUrl?: string | null;
  category?: string;
  publishedAt?: Date | string | null;
}

interface LatestArticlesSectionProps {
  articles: ArticleItem[];
}

export default function LatestArticlesSection({ articles }: LatestArticlesSectionProps) {
  const fallbackArticles: ArticleItem[] = [
    {
      id: 1,
      title: 'Meneropong Dinamika Ekonomi Kreatif di Lingkungan Kampus',
      excerpt:
        'Eksplorasi peran mahasiswa dalam menggairahkan sektor UMKM digital masa kini di lingkungan kampus.',
      coverImageUrl: '/image/artikel_image.jpg',
      category: 'Opini Mahasiswa',
      publishedAt: '2026-09-27',
    },
    {
      id: 2,
      title: 'Sorotan Kuliah Perdana & Semangat Baru Mahasiswa FEB UMJ',
      excerpt:
        'Suasana antusiasme mahasiswa baru dalam menyambut tahun ajaran anyar di lingkungan kampus Cirendeu.',
      coverImageUrl: '/image/artikel_image.jpg',
      category: 'Warta Kampus',
      publishedAt: '2026-09-20',
    },
    {
      id: 3,
      title: 'Etika Jurnalistik dan Kebebasan Berpendapat Mahasiswa',
      excerpt:
        'Menjaga komitmen verifikasi dan ketajaman pena di era arus informasi serba cepat serta digitalisasi pers.',
      coverImageUrl: '/image/artikel_image.jpg',
      category: 'Kajian Pers',
      publishedAt: '2026-09-15',
    },
  ];

  const displayArticles = articles && articles.length > 0 ? articles : fallbackArticles;

  const formatDate = (dateVal?: Date | string | null) => {
    if (!dateVal) return 'Terbaru';
    try {
      const d = new Date(dateVal);
      return d.toLocaleDateString('id-ID', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
      });
    } catch {
      return 'Terbaru';
    }
  };

  return (
    <section
      id="section-artikel"
      className="py-14 sm:py-20 lg:py-28 bg-gradient-to-br from-brand-sand/60 via-white to-brand-sand/40 px-4 sm:px-10 lg:px-28 border-t border-brand-sand"
    >
      <div className="max-w-7xl mx-auto flex flex-col items-center">
        <div className="text-center mb-10 sm:mb-12">
          <div className="inline-block px-3 py-1 rounded bg-brand-chocolate/10 text-brand-chocolate text-[11px] sm:text-xs font-bold tracking-widest uppercase mb-2">
            Publikasi & Liputan
          </div>
          <h2 className="text-2xl sm:text-4xl font-extrabold text-brand-dark tracking-tight">
            Artikel Terbaru
          </h2>
          <p className="text-neutral-600 text-xs sm:text-base mt-2 max-w-xl px-2">
            Sajian warta, opini, dan telaah isu aktual seputar ekonomi dan kehidupan kampus karya jurnalis Cakrawala.
          </p>
        </div>

        {/* Grid 3 Card Artikel */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8 w-full mb-10 sm:mb-12">
          {displayArticles.map((art) => (
            <Link
              key={art.id}
              href={art.slug ? `/artikel/${art.slug}` : `/artikel`}
              className="bg-white rounded-3xl overflow-hidden shadow-sm hover:shadow-lg border border-brand-sand hover:-translate-y-1 transition-all duration-300 flex flex-col group cursor-pointer active:scale-[0.98]"
            >
              <div className="h-44 sm:h-52 relative overflow-hidden">
                <Image
                  src={art.coverImageUrl || '/image/artikel_image.jpg'}
                  alt={art.title}
                  fill
                  sizes="(max-width: 768px) 100vw, 33vw"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <span className="absolute top-3 left-3 bg-brand-dark/80 backdrop-blur-md text-white text-[11px] font-bold px-3 py-1 rounded-full">
                  {art.category || 'Berita Kampus'}
                </span>
              </div>
              <div className="p-5 sm:p-6 flex flex-col justify-between flex-1 gap-4">
                <div>
                  <span className="text-[11px] sm:text-xs text-brand-caramel font-semibold">
                    {formatDate(art.publishedAt)}
                  </span>
                  <h3 className="text-base sm:text-lg font-extrabold text-brand-dark group-hover:text-brand-chocolate transition-colors mt-1 line-clamp-2">
                    {art.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-neutral-600 mt-2 line-clamp-3 leading-relaxed">
                    {art.excerpt || 'Klik untuk membaca liputan mendalam dari redaksi Cakrawala FEB UMJ.'}
                  </p>
                </div>
                <div className="pt-3 border-t border-brand-sand flex items-center justify-between text-xs text-brand-walnut font-bold min-h-[36px]">
                  <span>Oleh Redaksi</span>
                  <span className="flex items-center gap-1 text-brand-chocolate group-hover:translate-x-1 transition-transform">
                    Baca Selengkapnya <ArrowRight className="w-3.5 h-3.5" />
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* Link ke Halaman Artikel Lengkap */}
        <div className="flex flex-col items-center gap-3 w-full">
          <p className="text-xs sm:text-sm text-neutral-500 font-medium text-center">
            Tertarik membaca kumpulan artikel, esai, dan liputan lainnya?
          </p>
          <Link
            href="/artikel"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-3 min-h-[48px] px-8 py-3.5 rounded-2xl bg-gradient-to-r from-brand-chocolate to-brand-walnut hover:from-brand-dark hover:to-brand-chocolate text-white font-bold text-sm lg:text-base shadow-lg hover:shadow-xl transition-all duration-300 group active:scale-95"
          >
            <BookOpen className="w-5 h-5 text-brand-caramel shrink-0" />
            <span>Jelajahi Seluruh Artikel</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1.5 transition-transform shrink-0" />
          </Link>
        </div>
      </div>
    </section>
  );
}
