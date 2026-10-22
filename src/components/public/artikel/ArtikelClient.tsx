'use client';

import React, { useState, useMemo, useRef } from 'react';
import { FileQuestion, RotateCcw } from 'lucide-react';
import ArtikelHero from './ArtikelHero';
import ArtikelTopSpotlight from './ArtikelTopSpotlight';
import ArtikelCard, { ArticleData } from './ArtikelCard';
import ArtikelPagination from './ArtikelPagination';

interface ArtikelClientProps {
  initialArticles: ArticleData[];
  topArticle: ArticleData | null;
}

export default function ArtikelClient({
  initialArticles,
  topArticle,
}: ArtikelClientProps) {
  // State Filter & Pencarian
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 9; // 9 artikel per halaman (grid 3x3 responsif)

  const gridTopRef = useRef<HTMLElement>(null);

  // Kumpulkan semua kategori unik dari database & gabungkan dengan kategori utama
  const availableCategories = useMemo(() => {
    const defaultCats = ['Opini', 'Warta Kampus', 'Berita Kampus', 'Kajian Pers', 'Liputan Khusus', 'Wawancara'];
    const dbCats = initialArticles
      .map((a) => a.category)
      .filter((cat): cat is string => Boolean(cat && cat.trim()));

    const uniqueSet = new Set<string>();
    // Tambahkan kategori dari DB terlebih dahulu
    dbCats.forEach((c) => uniqueSet.add(c.trim()));
    // Tambahkan default jika belum ada
    defaultCats.forEach((c) => {
      if (dbCats.some((dbCat) => dbCat.toLowerCase() === c.toLowerCase())) return;
    });

    return Array.from(uniqueSet);
  }, [initialArticles]);

  // Logika Filter Artikel
  const filteredArticles = useMemo(() => {
    return initialArticles.filter((article) => {
      // 1. Filter Kategori
      if (selectedCategory !== 'all') {
        const catMatch =
          article.category?.toLowerCase() === selectedCategory.toLowerCase() ||
          (selectedCategory === 'Warta Kampus' && article.category?.toLowerCase() === 'berita kampus') ||
          (selectedCategory === 'Berita Kampus' && article.category?.toLowerCase() === 'warta kampus') ||
          (selectedCategory === 'Kajian Pers' && article.category?.toLowerCase() === 'liputan khusus') ||
          (selectedCategory === 'Liputan Khusus' && article.category?.toLowerCase() === 'kajian pers');
        if (!catMatch) return false;
      }

      // 2. Filter Pencarian Teks
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase().trim();
        const matchTitle = article.title.toLowerCase().includes(query);
        const matchExcerpt = (article.excerpt || '').toLowerCase().includes(query);
        const matchContent = (article.content || '').toLowerCase().includes(query);
        const matchAuthor = (article.authorName || '').toLowerCase().includes(query);
        const matchCat = (article.category || '').toLowerCase().includes(query);

        if (!matchTitle && !matchExcerpt && !matchContent && !matchAuthor && !matchCat) {
          return false;
        }
      }

      return true;
    });
  }, [initialArticles, selectedCategory, searchQuery]);

  // Pagination Slice
  const totalItems = filteredArticles.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const currentArticles = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return filteredArticles.slice(startIndex, startIndex + itemsPerPage);
  }, [filteredArticles, currentPage, itemsPerPage]);

  const handleCategoryChange = (cat: string) => {
    setSelectedCategory(cat);
    setCurrentPage(1);
  };

  const handleSearchChange = (query: string) => {
    setSearchQuery(query);
    setCurrentPage(1);
  };

  const resetFilter = () => {
    setSelectedCategory('all');
    setSearchQuery('');
    setCurrentPage(1);
  };

  const handlePageChange = (newPage: number) => {
    setCurrentPage(newPage);
    if (gridTopRef.current) {
      gridTopRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  // Apakah sedang dalam mode pencarian/filter
  const isFiltering = selectedCategory !== 'all' || searchQuery.trim() !== '';

  return (
    <>
      {/* 1. Header Banner & Live Search Bar */}
      <ArtikelHero
        searchQuery={searchQuery}
        onSearchChange={handleSearchChange}
      />

      {/* 2. Top Artikel / Sorotan Utama (Muncul jika ada artikel unggulan dan tidak sedang memfilter spesifik) */}
      {topArticle && !isFiltering && (
        <ArtikelTopSpotlight article={topArticle} />
      )}

      {/* 3. Baris Filter Kategori */}
      <section className="px-4 sm:px-10 lg:px-28 pt-6 sm:pt-8 pb-2">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-3 sm:gap-4 flex-wrap border-b border-brand-sand pb-4">
          {/* Tombol Kategori Horizontal (Touch pan scroll) */}
          <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-1 w-full sm:w-auto touch-pan-x">
            <button
              type="button"
              onClick={() => handleCategoryChange('all')}
              className={`min-h-[40px] px-3.5 sm:px-4 py-2 rounded-xl text-xs font-bold transition-all shrink-0 cursor-pointer active:scale-95 ${
                selectedCategory === 'all'
                  ? 'bg-brand-dark text-white shadow-xs'
                  : 'bg-white text-neutral-600 hover:text-brand-dark border border-brand-sand shadow-xs hover:bg-brand-sand/40'
              }`}
            >
              Semua Artikel
            </button>

            {availableCategories.map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => handleCategoryChange(cat)}
                className={`min-h-[40px] px-3.5 sm:px-4 py-2 rounded-xl text-xs font-bold transition-all shrink-0 cursor-pointer active:scale-95 ${
                  selectedCategory.toLowerCase() === cat.toLowerCase()
                    ? 'bg-brand-dark text-white shadow-xs'
                    : 'bg-white text-neutral-600 hover:text-brand-dark border border-brand-sand shadow-xs hover:bg-brand-sand/40'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Label Jumlah Hasil */}
          <div className="flex items-center justify-between w-full sm:w-auto gap-2 text-xs text-neutral-500 font-medium pt-1 sm:pt-0">
            <span>Menampilkan <strong>{totalItems}</strong> artikel</span>
            {isFiltering && (
              <button
                onClick={resetFilter}
                className="text-brand-chocolate font-bold hover:underline cursor-pointer ml-1"
              >
                Reset Filter
              </button>
            )}
          </div>
        </div>
      </section>

      {/* 4. Grid Artikel (Masing-masing mengarah ke halaman /artikel/[slug]) */}
      <section ref={gridTopRef} className="py-6 sm:py-12 lg:py-16 px-4 sm:px-10 lg:px-28">
        <div className="max-w-7xl mx-auto">
          {currentArticles.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
              {currentArticles.map((article) => (
                <ArtikelCard key={article.id} article={article} />
              ))}
            </div>
          ) : (
            /* Empty State */
            <div className="flex flex-col items-center justify-center py-16 sm:py-20 text-center gap-4 bg-white rounded-3xl border border-dashed border-brand-sand p-6 sm:p-8 shadow-xs">
              <div className="w-16 h-16 rounded-full bg-brand-sand/60 flex items-center justify-center text-brand-chocolate">
                <FileQuestion className="w-8 h-8" />
              </div>
              <h3 className="text-lg sm:text-xl font-bold text-brand-dark">Artikel Tidak Ditemukan</h3>
              <p className="text-neutral-500 text-xs sm:text-sm max-w-md px-2">
                Tidak ada artikel yang cocok dengan kata kunci atau kategori yang Anda pilih. Silakan sesuaikan kata kunci atau tampilkan semua artikel.
              </p>
              <button
                onClick={resetFilter}
                className="mt-2 min-h-[44px] px-6 py-2.5 rounded-xl bg-brand-chocolate text-white text-xs font-bold shadow hover:bg-brand-dark transition-all flex items-center gap-2 active:scale-95"
              >
                <RotateCcw className="w-4 h-4" />
                <span>Tampilkan Semua Artikel</span>
              </button>
            </div>
          )}

          {/* 5. Pagination Otomatis */}
          <ArtikelPagination
            currentPage={currentPage}
            totalPages={totalPages}
            totalItems={totalItems}
            itemsPerPage={itemsPerPage}
            onPageChange={handlePageChange}
          />
        </div>
      </section>
    </>
  );
}
