import React, { cache } from 'react';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import {
  Calendar,
  Clock,
  Eye,
  ArrowLeft,
  ChevronRight,
  TrendingUp,
  MessageSquare,
  Sparkles,
  BookOpen,
} from 'lucide-react';
import Navbar from '@/components/public/Navbar';
import Footer from '@/components/public/Footer';
import ArtikelReadingProgress from '@/components/public/artikel/ArtikelReadingProgress';
import ArtikelShareButtons from '@/components/public/artikel/ArtikelShareButtons';
import ArtikelContentWithToc from '@/components/public/artikel/ArtikelContentWithToc';
import ArtikelDesktopToc from '@/components/public/artikel/ArtikelDesktopToc';
import prisma from '@/lib/prisma';

export const dynamic = 'force-dynamic';

interface PageProps {
  params: {
    slug: string;
  };
}

// Memoized helper untuk mencegah double fetch antara generateMetadata dan ArtikelDetailPage
const getArticleBySlug = cache(async (slug: string) => {
  const isNumeric = !isNaN(Number(slug));
  return prisma.article.findFirst({
    where: {
      status: 'published',
      OR: [
        { slug: slug },
        ...(isNumeric ? [{ id: Number(slug) }] : []),
      ],
    },
  });
});

export async function generateMetadata({ params }: PageProps) {
  const article = await getArticleBySlug(params.slug);

  if (!article) {
    return {
      title: 'Artikel Tidak Ditemukan - BPM Cakrawala FEB UMJ',
    };
  }

  return {
    title: `${article.title} - BPM Cakrawala FEB UMJ`,
    description: article.excerpt || `Baca artikel lengkap di BPM Cakrawala FEB UMJ.`,
  };
}

export default async function ArtikelDetailPage({ params }: PageProps) {
  const { slug } = params;

  // Ambil artikel utama (deduped via React cache)
  const article = await getArticleBySlug(slug);

  if (!article) {
    notFound();
  }

  // Tambahkan view count secara asinkron tanpa memblokir rendering halaman (non-blocking)
  void prisma.article
    .update({
      where: { id: article.id },
      data: { viewsCount: { increment: 1 } },
    })
    .catch((err) => {
      console.warn('Gagal menambah views count:', err);
    });

  // Ambil artikel terpopuler untuk sidebar & artikel terkait untuk footer
  // OPTIMASI: Tidak mengambil payload 'content' penuh untuk 7 artikel tambahan agar transfer data instan
  let popularArticles: Array<{
    id: number;
    title: string;
    slug: string;
    category: string;
    coverImageUrl?: string | null;
    publishedAt?: Date | null;
    createdAt: Date;
    readMinutes: number;
  }> = [];

  let relatedArticles: Array<{
    id: number;
    title: string;
    slug: string;
    category: string;
    excerpt?: string | null;
    coverImageUrl?: string | null;
    publishedAt?: Date | null;
    createdAt: Date;
    readMinutes: number;
  }> = [];

  try {
    const [popularData, relatedData] = await Promise.all([
      prisma.article.findMany({
        where: {
          status: 'published',
          id: { not: article.id },
        },
        orderBy: [{ viewsCount: 'desc' }, { createdAt: 'desc' }],
        take: 4,
        select: {
          id: true,
          title: true,
          slug: true,
          category: true,
          coverImageUrl: true,
          excerpt: true,
          publishedAt: true,
          createdAt: true,
        },
      }),
      prisma.article.findMany({
        where: {
          status: 'published',
          id: { not: article.id },
        },
        orderBy: [{ createdAt: 'desc' }],
        take: 3,
        select: {
          id: true,
          title: true,
          slug: true,
          category: true,
          excerpt: true,
          coverImageUrl: true,
          publishedAt: true,
          createdAt: true,
        },
      }),
    ]);

    popularArticles = popularData.map((p) => ({
      ...p,
      readMinutes: Math.max(1, Math.ceil(((p.excerpt || '').trim().split(/\s+/).length * 4) / 200) || 2),
    }));

    relatedArticles = relatedData.map((r) => ({
      ...r,
      readMinutes: Math.max(1, Math.ceil(((r.excerpt || '').trim().split(/\s+/).length * 4) / 200) || 2),
    }));
  } catch (err) {
    console.error('Error fetching additional articles:', err);
  }

  // Format Tanggal
  const rawDate = article.publishedAt || article.createdAt;
  const dateObj = new Date(rawDate);
  const displayDate = !isNaN(dateObj.getTime())
    ? dateObj.toLocaleDateString('id-ID', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
      })
    : 'Terbaru';

  // Estimasi waktu baca
  const plainText = (article.content || '').replace(/<[^>]*>/g, '');
  const wordCount = plainText.trim() ? plainText.trim().split(/\s+/).length : 0;
  const readMinutes = Math.max(1, Math.ceil(wordCount / 200));

  // Inisial & Nama Penulis
  const authorName = article.authorName || 'Redaksi BPM Cakrawala FEB UMJ';
  const authorInitials = authorName
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0].toUpperCase())
    .join('') || 'RC';

  // Fallback gambar utama
  const displayImage =
    article.coverImageUrl && article.coverImageUrl.trim() !== ''
      ? article.coverImageUrl
      : '/image/artikel_image.jpg';

  // Menentukan apakah konten berupa HTML terformat atau plain text
  const isHtml = /<[a-z][\s\S]*>/i.test(article.content);

  // Artikel untuk blok "Baca Juga" (ambil artikel pertama dari popularArticles jika ada)
  const readAlsoArticle = popularArticles.length > 0 ? popularArticles[0] : null;

  return (
    <div className="bg-[#FAF8F5] text-neutral-800 antialiased selection:bg-brand-caramel selection:text-white min-h-screen">
      {/* 1. Header / Navbar Resmi (72px) */}
      <Navbar />

      {/* 2. Reading Progress Bar Sticky di bawah Header (Ref DewaBiz) */}
      <ArtikelReadingProgress />

      {/* 3. Main Content Container */}
      <main className="min-h-screen" style={{ paddingTop: '72px' }}>
        {/* Breadcrumb Navigation Bar (Ref DewaBiz) */}
        <nav
          aria-label="Breadcrumb"
          className="bg-white border-b border-brand-sand/80 px-4 sm:px-10 lg:px-28 py-3"
        >
          <div className="max-w-7xl mx-auto flex items-center justify-between gap-4 text-xs">
            <ol className="flex items-center gap-1.5 sm:gap-2 text-neutral-400 overflow-x-auto no-scrollbar py-0.5">
              <li className="flex items-center gap-1.5 shrink-0">
                <Link
                  href="/"
                  className="text-neutral-500 hover:text-brand-chocolate transition-colors font-medium"
                >
                  Beranda
                </Link>
                <ChevronRight className="w-3.5 h-3.5 text-neutral-300" />
              </li>
              <li className="flex items-center gap-1.5 shrink-0">
                <Link
                  href="/artikel"
                  className="text-neutral-500 hover:text-brand-chocolate transition-colors font-medium"
                >
                  Artikel
                </Link>
                <ChevronRight className="w-3.5 h-3.5 text-neutral-300" />
              </li>
              <li className="flex items-center gap-1.5 shrink-0">
                <span className="px-2 py-0.5 rounded-md bg-brand-sand/60 text-brand-chocolate font-bold text-[11px]">
                  {article.category || 'Berita Kampus'}
                </span>
                <ChevronRight className="w-3.5 h-3.5 text-neutral-300 hidden sm:inline" />
              </li>
              <li
                className="text-brand-dark font-semibold truncate max-w-[200px] sm:max-w-md hidden sm:inline"
                aria-current="page"
              >
                {article.title}
              </li>
            </ol>

            <Link
              href="/artikel"
              className="inline-flex items-center gap-1.5 text-brand-chocolate font-bold hover:underline shrink-0 active:scale-95 transition-transform"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Semua Artikel</span>
            </Link>
          </div>
        </nav>

        {/* ══════════════════════════════════════════════════════════════ */}
        {/* ARTIKEL DETAIL SECTION (LAYOUT 2 KOLOM: KONTEN + SIDEBAR)       */}
        {/* ══════════════════════════════════════════════════════════════ */}
        <section className="bg-white py-8 sm:py-12 lg:py-16 px-4 sm:px-10 lg:px-28 border-b border-brand-sand/60">
          <div className="max-w-7xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
              {/* ════════════════════════════════════════════════════════ */}
              {/* KOLOM KONTEN UTAMA ARTIKEL (8 KOLOM DESKTOP)             */}
              {/* ════════════════════════════════════════════════════════ */}
              <article className="lg:col-span-8 min-w-0">
                {/* 1. Article Header (Ref DewaBiz) */}
                <header className="mb-6 sm:mb-8">
                  {/* Category Pill */}
                  <div className="flex flex-wrap gap-2 mb-3.5">
                    <span className="inline-flex items-center px-3.5 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-brand-sand/70 text-brand-chocolate border border-brand-sand">
                      {article.category || 'Berita Kampus'}
                    </span>
                  </div>

                  {/* Main Headline Title */}
                  <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-brand-dark leading-tight tracking-tight mb-4 sm:mb-5">
                    {article.title}
                  </h1>

                  {/* Subtitle / Lead Excerpt (Pengantar Berbobot Ref DewaBiz) */}
                  {article.excerpt && (
                    <p className="text-sm sm:text-base lg:text-lg text-neutral-600 leading-relaxed font-normal mb-5 text-left">
                      {article.excerpt}
                    </p>
                  )}

                  {/* Meta Bar: Penulis, Tanggal, Waktu Baca, Views & Tombol Share Cepat */}
                  <div className="flex flex-wrap items-center justify-between gap-4 py-3.5 border-y border-brand-sand/70">
                    {/* Info Penulis & Waktu */}
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-brand-chocolate/10 border border-brand-chocolate/20 text-brand-chocolate font-bold text-xs sm:text-sm flex items-center justify-center shrink-0">
                        {authorInitials}
                      </div>
                      <div className="leading-tight min-w-0">
                        <div className="text-xs sm:text-sm font-bold text-brand-dark truncate max-w-[200px] sm:max-w-xs">
                          {authorName}
                        </div>
                        <div className="flex flex-wrap items-center gap-2.5 sm:gap-3 text-[11px] text-neutral-500 mt-1">
                          <span className="inline-flex items-center gap-1 font-medium">
                            <Calendar className="w-3.5 h-3.5 text-brand-caramel shrink-0" />
                            <span>{displayDate}</span>
                          </span>
                          <span className="text-neutral-300">•</span>
                          <span className="inline-flex items-center gap-1 font-medium">
                            <Clock className="w-3.5 h-3.5 text-brand-caramel shrink-0" />
                            <span>{readMinutes} menit baca</span>
                          </span>
                          <span className="text-neutral-300">•</span>
                          <span className="inline-flex items-center gap-1 font-medium">
                            <Eye className="w-3.5 h-3.5 text-brand-caramel shrink-0" />
                            <span>{article.viewsCount}x dilihat</span>
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Tombol Bagikan Kompak di Header (WhatsApp, X, Facebook, Telegram, Salin) */}
                    <div className="w-full sm:w-auto pt-2 sm:pt-0 border-t sm:border-t-0 border-brand-sand/50">
                      <ArtikelShareButtons title={article.title} variant="compact" />
                    </div>
                  </div>
                </header>

                {/* 2. Featured Image (Foto Cover Utama) */}
                <figure className="mb-8 sm:mb-10">
                  <div className="relative w-full h-64 sm:h-96 md:h-[420px] rounded-2xl sm:rounded-3xl overflow-hidden shadow-md border border-brand-sand bg-brand-sand/40">
                    <Image
                      src={displayImage}
                      alt={article.title}
                      fill
                      sizes="(max-width: 1024px) 100vw, 800px"
                      className="w-full h-full object-cover"
                      priority
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent pointer-events-none" />
                  </div>
                  <figcaption className="text-center text-[11px] sm:text-xs text-neutral-400 mt-2.5 font-medium italic">
                    Dokumentasi Resmi Redaksi Badan Pers Mahasiswa Cakrawala FEB UMJ
                  </figcaption>
                </figure>

                {/* 3. Isi Artikel Lengkap dengan Akordion TOC Mobile & Callout Baca Juga */}
                <ArtikelContentWithToc
                  content={article.content}
                  isHtml={isHtml}
                  readAlsoArticle={readAlsoArticle}
                  importantLink={article.importantLink}
                />

                {/* 4. Tags & Share Bawah (Ref DewaBiz) */}
                <div className="mt-10 pt-6 border-t border-brand-sand flex flex-col sm:flex-row items-start sm:items-center justify-between gap-5">
                  <div className="flex items-center gap-1.5 flex-wrap">
                    <span className="text-xs font-bold text-neutral-500 mr-1">Tags:</span>
                    <span className="text-xs bg-brand-sand/70 px-2.5 py-1 rounded-lg text-brand-dark font-medium border border-brand-sand">
                      #FEBUMJ
                    </span>
                    <span className="text-xs bg-brand-sand/70 px-2.5 py-1 rounded-lg text-brand-dark font-medium border border-brand-sand">
                      #CakrawalaNews
                    </span>
                    <span className="text-xs bg-brand-sand/70 px-2.5 py-1 rounded-lg text-brand-dark font-medium border border-brand-sand">
                      #PersMahasiswa
                    </span>
                    <span className="text-xs bg-brand-sand/70 px-2.5 py-1 rounded-lg text-brand-dark font-medium border border-brand-sand">
                      #{article.category.replace(/\s+/g, '')}
                    </span>
                  </div>

                  <ArtikelShareButtons title={article.title} variant="expanded" />
                </div>

                {/* 5. Author Box / Kotak Profil Redaksi Penulis (Ref DewaBiz) */}
                <div className="mt-8 p-5 sm:p-7 rounded-3xl bg-brand-sand/30 border border-brand-sand/80 flex items-start gap-4 sm:gap-5 shadow-xs">
                  <div className="w-12 h-12 sm:w-16 sm:h-16 rounded-2xl bg-brand-chocolate text-white font-extrabold text-base sm:text-xl flex items-center justify-center shrink-0 shadow-md">
                    {authorInitials}
                  </div>
                  <div className="min-w-0">
                    <div className="text-[10px] sm:text-[11px] font-extrabold uppercase tracking-wider text-brand-chocolate mb-1">
                      Ditulis Oleh
                    </div>
                    <h3 className="text-base sm:text-lg font-extrabold text-brand-dark mb-1">
                      {authorName}
                    </h3>
                    <p className="text-xs sm:text-sm text-neutral-600 leading-relaxed text-left">
                      Karya jurnalistik ini diproduksi dan diverifikasi oleh tim redaksi Badan Pers Mahasiswa Cakrawala Fakultas Ekonomi dan Bisnis Universitas Muhammadiyah Jakarta sebagai wujud komitmen independensi pers mahasiswa.
                    </p>
                    <Link
                      href="/aspirasi"
                      className="inline-flex items-center gap-1.5 mt-3 text-xs sm:text-sm font-bold text-brand-chocolate hover:text-brand-dark transition-colors"
                    >
                      <span>Kirimkan tanggapan atau opini Anda</span>
                      <ChevronRight className="w-4 h-4" />
                    </Link>
                  </div>
                </div>
              </article>

              {/* ════════════════════════════════════════════════════════ */}
              {/* SIDEBAR ARTIKEL LAINNYA (4 KOLOM DESKTOP - STICKY)      */}
              {/* ════════════════════════════════════════════════════════ */}
              <aside className="lg:col-span-4 w-full">
                <div className="lg:sticky lg:top-24 space-y-6">
                  {/* 1. Desktop Table of Contents (Daftar Isi Sticky) */}
                  <ArtikelDesktopToc />

                  {/* 2. Kartu Salurkan Aspirasi / Kotak Ide Redaksi */}
                  <div className="bg-gradient-to-br from-brand-dark via-brand-chocolate to-brand-walnut rounded-3xl p-6 text-white shadow-xl flex flex-col gap-3 relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-brand-caramel/15 rounded-full blur-2xl pointer-events-none" />
                    <div className="inline-flex items-center gap-1.5 text-xs text-brand-caramel font-bold uppercase tracking-wider relative z-10">
                      <Sparkles className="w-3.5 h-3.5" />
                      <span>Kanal Redaksi</span>
                    </div>
                    <div className="w-10 h-10 rounded-xl bg-white/10 backdrop-blur-md flex items-center justify-center text-brand-caramel mb-1 relative z-10 border border-white/10">
                      <MessageSquare className="w-5 h-5" />
                    </div>
                    <h4 className="font-extrabold text-base sm:text-lg leading-snug text-white relative z-10">
                      Punya Gagasan atau Tanggapan?
                    </h4>
                    <p className="text-xs text-neutral-200 leading-relaxed relative z-10">
                      Suarakan kritik, opini, esai, maupun liputan investigasi Anda melalui formulir aspirasi online kami.
                    </p>
                    <Link
                      href="/aspirasi"
                      className="mt-2 text-center py-3 rounded-xl bg-white text-brand-dark font-extrabold text-xs sm:text-sm hover:bg-brand-caramel hover:text-white transition-all shadow-md active:scale-95 relative z-10 cursor-pointer"
                    >
                      Buka Form Aspirasi Mahasiswa
                    </Link>
                  </div>

                  {/* 3. Artikel Terpopuler / Pilihan Redaksi (Ref DewaBiz) */}
                  {popularArticles.length > 0 && (
                    <div className="bg-white rounded-3xl p-5 sm:p-6 shadow-sm border border-brand-sand flex flex-col gap-4">
                      <div className="flex items-center justify-between border-b border-brand-sand/70 pb-3">
                        <h4 className="font-extrabold text-xs sm:text-sm text-brand-dark uppercase tracking-wider flex items-center gap-2">
                          <TrendingUp className="w-4 h-4 text-brand-chocolate" />
                          <span>Artikel Terpopuler</span>
                        </h4>
                      </div>

                      <div className="space-y-3.5">
                        {popularArticles.map((pop) => {
                          const popDate = pop.publishedAt || pop.createdAt;
                          const popDisplayDate = !isNaN(new Date(popDate).getTime())
                            ? new Date(popDate).toLocaleDateString('id-ID', {
                                day: 'numeric',
                                month: 'short',
                                year: 'numeric',
                              })
                            : 'Terbaru';

                          const popImg =
                            pop.coverImageUrl && pop.coverImageUrl.trim() !== ''
                              ? pop.coverImageUrl
                              : '/image/artikel_image.jpg';

                          const popReadTime = pop.readMinutes;

                          return (
                            <Link
                              key={pop.id}
                              href={`/artikel/${pop.slug}`}
                              className="flex items-start gap-3 group p-2 rounded-2xl hover:bg-brand-sand/30 transition-all active:scale-[0.98]"
                            >
                              <div className="w-16 h-16 rounded-xl overflow-hidden relative shrink-0 bg-brand-sand/40 border border-brand-sand/60">
                                <Image
                                  src={popImg}
                                  alt={pop.title}
                                  fill
                                  sizes="64px"
                                  className="object-cover group-hover:scale-105 transition-transform duration-300"
                                />
                              </div>
                              <div className="min-w-0 flex flex-col gap-1">
                                <span className="text-[10px] font-bold text-brand-chocolate uppercase tracking-wider">
                                  {pop.category}
                                </span>
                                <h5 className="font-bold text-xs text-brand-dark leading-snug line-clamp-2 group-hover:text-brand-chocolate transition-colors">
                                  {pop.title}
                                </h5>
                                <div className="flex items-center gap-2 text-[10px] text-neutral-400 mt-0.5">
                                  <span>{popDisplayDate}</span>
                                  <span>•</span>
                                  <span className="flex items-center gap-1">
                                    <Clock className="w-3 h-3 text-brand-caramel" />
                                    <span>{popReadTime} mnt</span>
                                  </span>
                                </div>
                              </div>
                            </Link>
                          );
                        })}
                      </div>
                    </div>
                  )}
                </div>
              </aside>
            </div>
          </div>
        </section>

        {/* ══════════════════════════════════════════════════════════════ */}
        {/* SECTION REKOMENDASI ARTIKEL TERKAIT LAINNYA (REF DEWABIZ)       */}
        {/* ══════════════════════════════════════════════════════════════ */}
        {relatedArticles.length > 0 && (
          <section className="py-12 sm:py-16 px-4 sm:px-10 lg:px-28 bg-[#FAF8F5]">
            <div className="max-w-7xl mx-auto flex flex-col gap-8">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-brand-sand/70 pb-4">
                <div>
                  <span className="text-xs font-bold text-brand-chocolate uppercase tracking-wider block mb-1">
                    Eksplorasi Bacaan
                  </span>
                  <h3 className="text-xl sm:text-2xl font-extrabold text-brand-dark tracking-tight">
                    Artikel Terkait Lainnya
                  </h3>
                </div>
                <Link
                  href="/artikel"
                  className="inline-flex items-center gap-2 text-xs sm:text-sm font-bold text-brand-chocolate hover:text-brand-dark transition-colors self-start sm:self-auto"
                >
                  <BookOpen className="w-4 h-4 text-brand-caramel" />
                  <span>Jelajahi Arsip Artikel Lengkap</span>
                  <ChevronRight className="w-4 h-4" />
                </Link>
              </div>

              {/* Grid 3 Kartu Artikel Terkait */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
                {relatedArticles.map((rel) => {
                  const relDate = rel.publishedAt || rel.createdAt;
                  const relDisplayDate = !isNaN(new Date(relDate).getTime())
                    ? new Date(relDate).toLocaleDateString('id-ID', {
                        day: 'numeric',
                        month: 'short',
                        year: 'numeric',
                      })
                    : 'Terbaru';

                  const relImg =
                    rel.coverImageUrl && rel.coverImageUrl.trim() !== ''
                      ? rel.coverImageUrl
                      : '/image/artikel_image.jpg';

                  const relReadTime = rel.readMinutes;

                  return (
                    <Link
                      key={rel.id}
                      href={`/artikel/${rel.slug}`}
                      className="group bg-white rounded-3xl overflow-hidden shadow-sm hover:shadow-xl border border-brand-sand hover:-translate-y-1.5 transition-all duration-300 flex flex-col select-none active:scale-[0.98]"
                    >
                      <div className="h-44 sm:h-48 relative overflow-hidden bg-brand-sand/30">
                        <Image
                          src={relImg}
                          alt={rel.title}
                          fill
                          sizes="(max-width: 768px) 100vw, 33vw"
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                        <span className="absolute top-3 left-3 bg-brand-dark/80 backdrop-blur-md text-white text-[10px] font-bold px-2.5 py-1 rounded-full">
                          {rel.category}
                        </span>
                      </div>
                      <div className="p-5 flex flex-col justify-between flex-1 gap-3">
                        <div>
                          <div className="flex items-center gap-2 text-[11px] text-neutral-400 mb-1.5">
                            <span>{relDisplayDate}</span>
                            <span>•</span>
                            <span className="flex items-center gap-1 text-brand-caramel font-semibold">
                              <Clock className="w-3 h-3" />
                              <span>{relReadTime} mnt baca</span>
                            </span>
                          </div>
                          <h4 className="font-extrabold text-sm sm:text-base text-brand-dark group-hover:text-brand-chocolate transition-colors line-clamp-2 leading-snug">
                            {rel.title}
                          </h4>
                          <p className="text-xs text-neutral-600 mt-2 line-clamp-2 leading-relaxed">
                            {rel.excerpt || 'Baca selengkapnya mengenai liputan ini.'}
                          </p>
                        </div>
                        <div className="pt-3 border-t border-brand-sand/60 flex items-center justify-between text-xs font-bold text-brand-chocolate">
                          <span>Baca Selengkapnya</span>
                          <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                        </div>
                      </div>
                    </Link>
                  );
                })}
              </div>
            </div>
          </section>
        )}
      </main>

      {/* 4. Footer Resmi Organisasi */}
      <Footer />
    </div>
  );
}
