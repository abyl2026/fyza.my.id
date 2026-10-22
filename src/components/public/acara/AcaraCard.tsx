'use client';

import React from 'react';
import Image from 'next/image';
import { Calendar, Clock, MapPin, ArrowRight, Star } from 'lucide-react';

export interface EventData {
  id: number;
  title: string;
  slug: string;
  shortSummary?: string | null;
  description: string;
  eventDate: string | Date;
  location?: string | null;
  imageUrl?: string | null;
  importantLink?: string | null;
  status: string; // 'draft' | 'published' | 'completed'
  isFeatured: number;
}

interface AcaraCardProps {
  event: EventData;
  onOpenModal: (event: EventData) => void;
}

export default function AcaraCard({ event, onOpenModal }: AcaraCardProps) {
  // Format tanggal & waktu dalam Bahasa Indonesia
  const eventDateObj = new Date(event.eventDate);
  const now = new Date();

  // Tanggal
  const displayDate = !isNaN(eventDateObj.getTime())
    ? eventDateObj.toLocaleDateString('id-ID', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
      })
    : 'Segera';

  // Waktu / Jam
  const hours = eventDateObj.getHours();
  const minutes = eventDateObj.getMinutes();
  const hasSpecificTime = !(hours === 0 && minutes === 0);
  const displayTime = hasSpecificTime
    ? `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')} WIB`
    : 'Waktu Menyusul';

  // Status perhitungan waktu
  const isPast = event.status === 'completed' || eventDateObj < now;
  const isToday =
    eventDateObj.getFullYear() === now.getFullYear() &&
    eventDateObj.getMonth() === now.getMonth() &&
    eventDateObj.getDate() === now.getDate();

  let statusLabel = 'Mendatang';
  let statusBadgeClass = 'bg-emerald-700 text-white';

  if (isPast) {
    statusLabel = 'Selesai';
    statusBadgeClass = 'bg-brand-dark/80 text-neutral-200';
  } else if (isToday) {
    statusLabel = 'Hari Ini';
    statusBadgeClass = 'bg-amber-600 text-white';
  }

  const categoryLabel = isPast ? 'Kegiatan Terlaksana' : 'Agenda Mendatang';
  const displayImage = event.imageUrl || '/image/03.jpg';

  return (
    <article
      onClick={() => onOpenModal(event)}
      className="bg-white rounded-3xl overflow-hidden shadow-md hover:shadow-xl border border-brand-sand hover:-translate-y-1 hover:border-brand-caramel/50 transition-all duration-300 flex flex-col group cursor-pointer select-none active:scale-[0.98]"
    >
      {/* Foto Kegiatan */}
      <div className="h-48 sm:h-52 relative overflow-hidden bg-brand-sand/30">
        <Image
          src={displayImage}
          alt={event.title}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-brand-dark/70 via-transparent to-transparent" />

        {/* Badges di bagian atas */}
        <div className="absolute top-3 left-3 right-3 flex items-center justify-between gap-2">
          <div className="flex items-center gap-1.5">
            <span className={`text-[10px] sm:text-[11px] font-bold px-2.5 py-1 rounded-full backdrop-blur-md shadow-xs ${statusBadgeClass}`}>
              {statusLabel}
            </span>
            <span className="text-[10px] sm:text-[11px] font-semibold px-2.5 py-1 rounded-full bg-white/90 text-brand-dark backdrop-blur-md shadow-xs">
              {categoryLabel}
            </span>
          </div>

          {event.isFeatured === 1 && (
            <span className="p-1.5 rounded-full bg-amber-400 text-brand-dark shadow-md" title="Acara Unggulan">
              <Star className="w-3.5 h-3.5 fill-brand-dark" />
            </span>
          )}
        </div>

        {/* Info Waktu & Tanggal di bagian bawah foto */}
        <div className="absolute bottom-2.5 left-3 right-3 text-white text-xs font-semibold flex items-center justify-between">
          <div className="flex items-center gap-1.5 drop-shadow">
            <Calendar className="w-3.5 h-3.5 text-brand-caramel shrink-0" />
            <span className="truncate">{displayDate}</span>
          </div>
          <div className="flex items-center gap-1 text-[11px] text-brand-sand drop-shadow shrink-0">
            <Clock className="w-3 h-3 text-brand-caramel shrink-0" />
            <span>{displayTime}</span>
          </div>
        </div>
      </div>

      {/* Body Card */}
      <div className="p-5 sm:p-6 flex flex-col justify-between flex-1 gap-4">
        <div>
          <h3 className="font-extrabold text-base sm:text-lg text-brand-dark group-hover:text-brand-chocolate transition-colors leading-snug line-clamp-2">
            {event.title}
          </h3>
          <p className="text-xs sm:text-sm text-neutral-600 mt-2 line-clamp-3 leading-relaxed">
            {event.shortSummary || event.description}
          </p>
        </div>

        {/* Footer Card: Lokasi & Tombol Detail */}
        <div className="pt-3.5 border-t border-brand-sand flex items-center justify-between">
          <span className="text-[11px] sm:text-xs text-neutral-500 flex items-center gap-1 min-w-0">
            <MapPin className="w-3.5 h-3.5 text-brand-chocolate shrink-0" />
            <span className="truncate max-w-[130px]">
              {event.location || 'FEB UMJ'}
            </span>
          </span>

          <span
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-brand-sand/70 group-hover:bg-brand-chocolate group-hover:text-white text-brand-chocolate font-bold text-xs transition-all shadow-xs shrink-0"
          >
            <span>Detail Kegiatan</span>
            <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
          </span>
        </div>
      </div>
    </article>
  );
}
