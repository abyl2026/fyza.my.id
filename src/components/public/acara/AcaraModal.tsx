'use client';

import React, { useEffect } from 'react';
import Image from 'next/image';
import { X, Calendar, Clock, MapPin, Tag } from 'lucide-react';
import { EventData } from './AcaraCard';

interface AcaraModalProps {
  event: EventData | null;
  onClose: () => void;
}

export default function AcaraModal({ event, onClose }: AcaraModalProps) {
  // Close on Escape key press & prevent background scroll
  useEffect(() => {
    if (!event) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };

    window.addEventListener('keydown', handleKeyDown);
    document.body.style.overflow = 'hidden';

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'unset';
    };
  }, [event, onClose]);

  if (!event) return null;

  const eventDateObj = new Date(event.eventDate);
  const now = new Date();

  const displayDate = !isNaN(eventDateObj.getTime())
    ? eventDateObj.toLocaleDateString('id-ID', {
        weekday: 'long',
        day: 'numeric',
        month: 'long',
        year: 'numeric',
      })
    : 'Segera';

  const hours = eventDateObj.getHours();
  const minutes = eventDateObj.getMinutes();
  const hasSpecificTime = !(hours === 0 && minutes === 0);
  const displayTime = hasSpecificTime
    ? `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')} WIB`
    : 'Waktu Menyusul';

  const isPast = event.status === 'completed' || eventDateObj < now;
  const statusLabel = isPast ? 'Kegiatan Selesai' : 'Agenda Mendatang';
  const displayImage = event.imageUrl || '/image/03.jpg';

  return (
    <div
      onClick={onClose}
      className="fixed inset-0 z-50 overflow-y-auto bg-black/70 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4 animate-fadeIn"
      role="dialog"
      aria-modal="true"
      aria-label={`Detail Acara: ${event.title}`}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="bg-white rounded-3xl max-w-2xl w-full max-h-[92vh] flex flex-col overflow-hidden shadow-2xl border border-brand-sand transform transition-all duration-300 relative my-auto animate-scaleUp"
      >
        {/* Tombol Tutup Mengambang (Touch target min 44x44px) */}
        <button
          onClick={onClose}
          aria-label="Tutup Detail Acara"
          className="absolute top-3 right-3 sm:top-4 sm:right-4 z-20 w-11 h-11 rounded-full bg-black/60 hover:bg-black/80 text-white backdrop-blur-md flex items-center justify-center transition-all shadow-lg active:scale-90 cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header Image (Fixed Aspect) */}
        <div className="h-48 sm:h-64 md:h-72 relative bg-brand-sand/40 shrink-0">
          <Image
            src={displayImage}
            alt={event.title}
            fill
            sizes="(max-width: 768px) 100vw, 672px"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-transparent" />

          {/* Badges & Judul pada Header Foto */}
          <div className="absolute bottom-3 left-4 right-4 sm:bottom-4 sm:left-6 sm:right-6 text-white">
            <span className="inline-block px-3 py-1 rounded-full bg-brand-chocolate text-white text-[11px] sm:text-xs font-bold mb-1.5 backdrop-blur-md shadow">
              {statusLabel}
            </span>
            <h3 className="text-lg sm:text-2xl font-extrabold leading-tight text-white drop-shadow-sm line-clamp-2">
              {event.title}
            </h3>
          </div>
        </div>

        {/* Modal Body Content (Scrollable Area) */}
        <div className="p-4 sm:p-7 flex flex-col gap-5 overflow-y-auto no-scrollbar">
          {/* Metadata Bar (Tanggal, Waktu, Lokasi, Status) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 sm:gap-3 text-xs sm:text-sm text-neutral-600 pb-4 border-b border-brand-sand">
            <div className="flex items-center gap-2 text-brand-dark font-semibold bg-brand-sand/30 p-2 sm:p-2.5 rounded-xl">
              <Calendar className="w-4 h-4 text-brand-chocolate shrink-0" />
              <span className="truncate">{displayDate}</span>
            </div>

            <div className="flex items-center gap-2 text-brand-dark font-semibold bg-brand-sand/30 p-2 sm:p-2.5 rounded-xl">
              <Clock className="w-4 h-4 text-brand-chocolate shrink-0" />
              <span>{displayTime}</span>
            </div>

            <div className="flex items-center gap-2 text-neutral-700 bg-brand-sand/30 p-2 sm:p-2.5 rounded-xl">
              <MapPin className="w-4 h-4 text-brand-chocolate shrink-0" />
              <span className="truncate">{event.location || 'FEB Universitas Muhammadiyah Jakarta'}</span>
            </div>

            <div className="flex items-center gap-2 text-neutral-700 bg-brand-sand/30 p-2 sm:p-2.5 rounded-xl">
              <Tag className="w-4 h-4 text-brand-chocolate shrink-0" />
              <span className="capitalize">{event.status === 'published' ? 'Terpublikasi' : event.status}</span>
            </div>
          </div>

          {/* Deskripsi Lengkap */}
          <div>
            <h4 className="font-bold text-[11px] sm:text-xs uppercase tracking-wider text-brand-chocolate mb-2 flex items-center gap-1.5">
              <span>Deskripsi Lengkap Kegiatan</span>
            </h4>
            <p className="text-neutral-700 leading-relaxed text-xs sm:text-sm whitespace-pre-line text-left">
              {event.description}
            </p>
          </div>

          {/* Modal Footer */}
          <div className="pt-3 border-t border-brand-sand flex items-center justify-between gap-3">
            <span className="text-[11px] sm:text-xs text-neutral-400">
              Penyelenggara: <strong className="text-neutral-600">BPM Cakrawala FEB UMJ</strong>
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
