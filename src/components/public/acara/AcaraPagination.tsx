'use client';

import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface AcaraPaginationProps {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  itemsPerPage: number;
  onPageChange: (page: number) => void;
}

export default function AcaraPagination({
  currentPage,
  totalPages,
  totalItems,
  itemsPerPage,
  onPageChange,
}: AcaraPaginationProps) {
  if (totalPages <= 1) return null;

  // Generate page numbers
  const pages: (number | string)[] = [];
  const maxDisplayedPages = 5;

  if (totalPages <= maxDisplayedPages) {
    for (let i = 1; i <= totalPages; i++) {
      pages.push(i);
    }
  } else {
    pages.push(1);
    if (currentPage > 3) {
      pages.push('...');
    }

    const start = Math.max(2, currentPage - 1);
    const end = Math.min(totalPages - 1, currentPage + 1);

    for (let i = start; i <= end; i++) {
      pages.push(i);
    }

    if (currentPage < totalPages - 2) {
      pages.push('...');
    }
    pages.push(totalPages);
  }

  const startItem = (currentPage - 1) * itemsPerPage + 1;
  const endItem = Math.min(currentPage * itemsPerPage, totalItems);

  return (
    <div className="mt-10 sm:mt-12 pt-6 sm:pt-8 border-t border-brand-sand flex flex-col sm:flex-row items-center justify-between gap-4">
      {/* Info Jumlah Item & Halaman */}
      <span className="text-xs sm:text-sm text-neutral-500 font-medium text-center sm:text-left">
        Menampilkan <strong className="text-brand-dark">{startItem}</strong> -{' '}
        <strong className="text-brand-dark">{endItem}</strong> dari{' '}
        <strong className="text-brand-dark">{totalItems}</strong> agenda kegiatan
      </span>

      {/* Navigasi Tombol Pagination */}
      <div className="flex items-center gap-1.5 sm:gap-2 flex-wrap justify-center">
        {/* Tombol Sebelumnya (Touch target min 40px) */}
        <button
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
          aria-label="Halaman Sebelumnya"
          className={`flex items-center justify-center gap-1 min-h-[42px] px-3.5 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all shadow-xs active:scale-95 cursor-pointer ${
            currentPage === 1
              ? 'bg-neutral-100 text-neutral-400 cursor-not-allowed border border-neutral-200'
              : 'bg-white text-brand-dark hover:bg-brand-sand/70 border border-brand-sand hover:text-brand-chocolate'
          }`}
        >
          <ChevronLeft className="w-4 h-4" />
          <span className="hidden sm:inline">Sebelumnya</span>
        </button>

        {/* Nomor-nomor Halaman */}
        {pages.map((p, idx) => {
          if (p === '...') {
            return (
              <span
                key={`ellipsis-${idx}`}
                className="w-9 h-9 sm:w-10 sm:h-10 flex items-center justify-center text-xs font-bold text-neutral-400"
              >
                ...
              </span>
            );
          }

          const pageNum = p as number;
          const isActive = pageNum === currentPage;

          return (
            <button
              key={`page-${pageNum}`}
              onClick={() => onPageChange(pageNum)}
              aria-label={`Halaman ${pageNum}`}
              className={`w-9 h-9 sm:w-10 sm:h-10 min-h-[38px] rounded-xl text-xs sm:text-sm font-bold flex items-center justify-center transition-all active:scale-95 cursor-pointer ${
                isActive
                  ? 'bg-gradient-to-r from-brand-dark to-brand-chocolate text-white shadow-md scale-105'
                  : 'bg-white text-neutral-700 hover:bg-brand-sand/60 border border-brand-sand hover:text-brand-dark'
              }`}
            >
              {pageNum}
            </button>
          );
        })}

        {/* Tombol Selanjutnya (Touch target min 40px) */}
        <button
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          aria-label="Halaman Selanjutnya"
          className={`flex items-center justify-center gap-1 min-h-[42px] px-3.5 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all shadow-xs active:scale-95 cursor-pointer ${
            currentPage === totalPages
              ? 'bg-neutral-100 text-neutral-400 cursor-not-allowed border border-neutral-200'
              : 'bg-white text-brand-dark hover:bg-brand-sand/70 border border-brand-sand hover:text-brand-chocolate'
          }`}
        >
          <span className="hidden sm:inline">Selanjutnya</span>
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
