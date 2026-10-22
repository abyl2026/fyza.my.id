import React from 'react';
import Navbar from '@/components/public/Navbar';
import Footer from '@/components/public/Footer';
import ArtikelClient from '@/components/public/artikel/ArtikelClient';
import { ArticleData } from '@/components/public/artikel/ArtikelCard';
import prisma from '@/lib/prisma';

export const dynamic = 'force-dynamic';

export const metadata = {
  title: 'Artikel & Publikasi - BPM Cakrawala FEB UMJ',
  description:
    'Kumpulan artikel, esai opini, warta kampus, dan kajian isu ekonomi karya jurnalis Badan Pers Mahasiswa Cakrawala FEB UMJ.',
};

export default async function ArtikelPage() {
  let articles: ArticleData[] = [];
  let topArticle: ArticleData | null = null;

  try {
    // Ambil artikel yang berstatus 'published' dari database Prisma
    const rawArticles = await prisma.article.findMany({
      where: {
        status: 'published',
      },
      orderBy: [
        { isTop: 'desc' },
        { publishedAt: 'desc' },
        { createdAt: 'desc' },
      ],
      select: {
        id: true,
        title: true,
        slug: true,
        excerpt: true,
        content: true,
        coverImageUrl: true,
        category: true,
        authorName: true,
        importantLink: true,
        status: true,
        isTop: true,
        viewsCount: true,
        publishedAt: true,
        createdAt: true,
      },
    });

    articles = rawArticles.map((a) => ({
      ...a,
      // Pangkas payload konten panjang di katalog agar transfer RSC ringan dan navigasi instan
      content: a.content ? a.content.slice(0, 500) : '',
      publishedAt: a.publishedAt ? a.publishedAt.toISOString() : null,
      createdAt: a.createdAt.toISOString(),
    }));

    // Tentukan Top Article (prioritaskan yang memiliki isTop === 1)
    const featured = articles.find((a) => a.isTop === 1);
    topArticle = featured || (articles.length > 0 ? articles[0] : null);
  } catch (error) {
    console.error('Error fetching articles from database:', error);
  }

  return (
    <div className="bg-brand-cream text-neutral-800 antialiased selection:bg-brand-caramel selection:text-white min-h-screen">
      {/* 1. Header / Navbar Resmi (72px) */}
      <Navbar />

      {/* 2. Main Content dengan offset 72px */}
      <main className="min-h-screen" style={{ paddingTop: '72px' }}>
        <ArtikelClient
          initialArticles={articles}
          topArticle={topArticle}
        />
      </main>

      {/* 3. Footer Resmi */}
      <Footer />
    </div>
  );
}
