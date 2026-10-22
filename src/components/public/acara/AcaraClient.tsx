'use client';

import React, { useState, useMemo, useRef } from 'react';
import {
  CalendarDays,
  CalendarCheck,
  CalendarX,
  RotateCcw,
  Search,
} from 'lucide-react';
import AcaraCard, { EventData } from './AcaraCard';
import AcaraModal from './AcaraModal';
import AcaraPagination from './AcaraPagination';

interface AcaraClientProps {
  initialEvents: EventData[];
}

export default function AcaraClient({ initialEvents }: AcaraClientProps) {
  // States
  const [quickFilter, setQuickFilter] = useState<'all' | 'upcoming' | 'past'>('all');
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedEvent, setSelectedEvent] = useState<EventData | null>(null);

  const gridTopRef = useRef<HTMLDivElement>(null);
  const itemsPerPage = 9; // Konsep pagination per 9 card acara

  // Filter Engine
  const filteredEvents = useMemo(() => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    return initialEvents.filter((evt) => {
      const evtDate = new Date(evt.eventDate);

      // 1. Quick Presets (Semua, Mendatang, Selesai)
      if (quickFilter === 'upcoming') {
        const isUpcoming = evt.status !== 'completed' && evtDate >= today;
        if (!isUpcoming) return false;
      } else if (quickFilter === 'past') {
        const isPast = evt.status === 'completed' || evtDate < today;
        if (!isPast) return false;
      }

      // 2. Filter Rentang Tanggal
      if (dateFrom) {
        const fromDate = new Date(dateFrom);
        fromDate.setHours(0, 0, 0, 0);
        if (evtDate < fromDate) return false;
      }

      if (dateTo) {
        const toDate = new Date(dateTo);
        toDate.setHours(23, 59, 59, 999);
        if (evtDate > toDate) return false;
      }

      // 3. Search Keyword
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchTitle = evt.title.toLowerCase().includes(q);
        const matchLoc = (evt.location || '').toLowerCase().includes(q);
        const matchDesc = (evt.description || '').toLowerCase().includes(q);
        if (!matchTitle && !matchLoc && !matchDesc) return false;
      }

      return true;
    });
  }, [initialEvents, quickFilter, dateFrom, dateTo, searchQuery]);

  // Pagination calculation
  const totalItems = filteredEvents.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage) || 1;

  // Active slice for current page
  const currentEvents = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filteredEvents.slice(start, start + itemsPerPage);
  }, [filteredEvents, currentPage, itemsPerPage]);

  // Handlers
  const handlePageChange = (newPage: number) => {
    setCurrentPage(newPage);
    if (gridTopRef.current) {
      gridTopRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const resetFilters = () => {
    setQuickFilter('all');
    setDateFrom('');
    setDateTo('');
    setSearchQuery('');
    setCurrentPage(1);
  };

  const handleQuickFilterChange = (type: 'all' | 'upcoming' | 'past') => {
    setQuickFilter(type);
    setCurrentPage(1);
  };

  return (
    <>
      {/* ============================================================== */}
      {/* FILTER BAR: PENGATURAN TANGGAL & PENCARIAN ACARA               */}
      {/* ============================================================== */}
      <section className="pt-8 sm:pt-10 pb-2 px-4 sm:px-10 lg:px-28 relative z-20">
        <div className="max-w-7xl mx-auto bg-white rounded-3xl p-4 sm:p-7 shadow-xl border border-brand-sand">
          {/* Baris 1: Form Input (Dari Tanggal, Sampai Tanggal, Pencarian) */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {/* Dari Tanggal */}
            <div className="flex items-center gap-2.5 bg-brand-sand/40 px-3.5 py-2 sm:py-2.5 rounded-2xl border border-brand-sand min-h-[48px]">
              <CalendarDays className="w-4 h-4 text-brand-chocolate shrink-0" />
              <div className="flex flex-col flex-1 min-w-0">
                <label htmlFor="filter-date-from" className="text-[10px] uppercase font-bold text-neutral-500">
                  Dari Tanggal
                </label>
                <input
                  type="date"
                  id="filter-date-from"
                  value={dateFrom}
                  onChange={(e) => {
                    setDateFrom(e.target.value);
                    setCurrentPage(1);
                  }}
                  className="bg-transparent text-xs sm:text-sm font-semibold text-brand-dark focus:outline-none w-full"
                />
              </div>
            </div>

            {/* Sampai Tanggal */}
            <div className="flex items-center gap-2.5 bg-brand-sand/40 px-3.5 py-2 sm:py-2.5 rounded-2xl border border-brand-sand min-h-[48px]">
              <CalendarCheck className="w-4 h-4 text-brand-chocolate shrink-0" />
              <div className="flex flex-col flex-1 min-w-0">
                <label htmlFor="filter-date-to" className="text-[10px] uppercase font-bold text-neutral-500">
                  Sampai Tanggal
                </label>
                <input
                  type="date"
                  id="filter-date-to"
                  value={dateTo}
                  onChange={(e) => {
                    setDateTo(e.target.value);
                    setCurrentPage(1);
                  }}
                  className="bg-transparent text-xs sm:text-sm font-semibold text-brand-dark focus:outline-none w-full"
                />
              </div>
            </div>

            {/* Search Bar Input */}
            <div className="relative md:col-span-2 lg:col-span-1 flex items-center bg-brand-sand/30 rounded-2xl border border-brand-sand px-3.5 py-2 sm:py-2.5 focus-within:border-brand-chocolate transition-colors min-h-[48px]">
              <Search className="w-4 h-4 text-neutral-400 shrink-0 mr-2" />
              <input
                type="text"
                placeholder="Cari acara / lokasi..."
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setCurrentPage(1);
                }}
                className="w-full bg-transparent text-xs sm:text-sm text-brand-dark placeholder-neutral-400 focus:outline-none"
              />
            </div>
          </div>

          {/* Baris 2: Quick Filter Presets + Reset + Info Hasil */}
          <div className="mt-3.5 pt-3.5 border-t border-brand-sand/70 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 flex-wrap">
            {/* Info Hasil Filter */}
            <div className="flex items-center gap-2 text-xs text-neutral-500 flex-wrap">
              <span>
                Menampilkan <strong className="text-brand-dark">{totalItems}</strong> agenda
              </span>
              {(quickFilter !== 'all' || dateFrom || dateTo || searchQuery) && (
                <>
                  <span className="text-neutral-300">•</span>
                  <button
                    onClick={resetFilters}
                    className="text-brand-chocolate font-bold hover:underline cursor-pointer"
                  >
                    Tampilkan Seluruh Agenda
                  </button>
                </>
              )}
            </div>

            {/* Tombol Preset & Reset */}
            <div className="flex items-center gap-2 w-full sm:w-auto justify-between sm:justify-end flex-wrap">
              {/* Quick Preset Buttons (Semua | Mendatang | Selesai) */}
              <div className="inline-flex items-center gap-1 bg-brand-sand/50 p-1 rounded-2xl border border-brand-sand text-xs font-bold">
                <button
                  type="button"
                  onClick={() => handleQuickFilterChange('all')}
                  className={`min-h-[38px] px-3.5 py-1.5 rounded-xl transition-all cursor-pointer active:scale-95 ${
                    quickFilter === 'all'
                      ? 'bg-brand-dark text-white shadow-xs'
                      : 'text-neutral-600 hover:text-brand-dark'
                  }`}
                >
                  Semua
                </button>
                <button
                  type="button"
                  onClick={() => handleQuickFilterChange('upcoming')}
                  className={`min-h-[38px] px-3.5 py-1.5 rounded-xl transition-all cursor-pointer active:scale-95 ${
                    quickFilter === 'upcoming'
                      ? 'bg-brand-dark text-white shadow-xs'
                      : 'text-neutral-600 hover:text-brand-dark'
                  }`}
                >
                  Mendatang
                </button>
                <button
                  type="button"
                  onClick={() => handleQuickFilterChange('past')}
                  className={`min-h-[38px] px-3.5 py-1.5 rounded-xl transition-all cursor-pointer active:scale-95 ${
                    quickFilter === 'past'
                      ? 'bg-brand-dark text-white shadow-xs'
                      : 'text-neutral-600 hover:text-brand-dark'
                  }`}
                >
                  Selesai
                </button>
              </div>

              {/* Tombol Reset Filter */}
              <button
                type="button"
                onClick={resetFilters}
                title="Reset Semua Filter"
                className="min-h-[38px] px-3.5 py-2 rounded-2xl border border-brand-sand hover:bg-brand-sand text-xs font-bold text-neutral-600 hover:text-brand-dark transition-colors flex items-center justify-center gap-1.5 shrink-0 cursor-pointer active:scale-95"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Reset</span>
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* ============================================================== */}
      {/* EVENTS GRID: MENAMPUNG KARTU ACARA + PAGINATION                 */}
      {/* ============================================================== */}
      <section ref={gridTopRef} className="py-8 sm:py-12 lg:py-16 px-4 sm:px-10 lg:px-28">
        <div className="max-w-7xl mx-auto">
          {/* Grid Kartu Acara */}
          {currentEvents.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
              {currentEvents.map((evt) => (
                <AcaraCard
                  key={evt.id}
                  event={evt}
                  onOpenModal={(eventItem) => setSelectedEvent(eventItem)}
                />
              ))}
            </div>
          ) : (
            /* Empty State */
            <div className="flex flex-col items-center justify-center py-16 sm:py-20 text-center gap-4 bg-white rounded-3xl border border-dashed border-brand-sand p-6 sm:p-8 shadow-xs">
              <div className="w-16 h-16 rounded-full bg-brand-sand/60 flex items-center justify-center text-brand-chocolate">
                <CalendarX className="w-8 h-8" />
              </div>
              <h3 className="text-lg sm:text-xl font-bold text-brand-dark">Tidak Ada Acara Ditemukan</h3>
              <p className="text-neutral-500 text-xs sm:text-sm max-w-md px-2">
                Tidak ditemukan agenda acara pada rentang waktu atau kata kunci yang Anda tentukan. Coba sesuaikan filter atau reset tanggal.
              </p>
              <button
                onClick={resetFilters}
                className="mt-2 min-h-[44px] px-6 py-2.5 rounded-xl bg-brand-chocolate text-white text-xs font-bold shadow hover:bg-brand-dark transition-all active:scale-95"
              >
                Lihat Semua Acara
              </button>
            </div>
          )}

          {/* Komponen Pagination Otomatis (Muncul saat kartu lebih dari 9) */}
          <AcaraPagination
            currentPage={currentPage}
            totalPages={totalPages}
            totalItems={totalItems}
            itemsPerPage={itemsPerPage}
            onPageChange={handlePageChange}
          />
        </div>
      </section>

      {/* ============================================================== */}
      {/* MODAL DETAIL KEGIATAN INTERAKTIF                               */}
      {/* ============================================================== */}
      <AcaraModal
        event={selectedEvent}
        onClose={() => setSelectedEvent(null)}
      />
    </>
  );
}
