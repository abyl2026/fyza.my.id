'use client';

import React, { useState } from 'react';
import { Share2, Check, MessageCircle, Send, Link as LinkIcon } from 'lucide-react';

interface ArtikelShareButtonsProps {
  title: string;
  variant?: 'compact' | 'expanded';
}

export default function ArtikelShareButtons({
  title,
  variant = 'compact',
}: ArtikelShareButtonsProps) {
  const [copied, setCopied] = useState(false);

  const getCurrentUrl = () => {
    if (typeof window !== 'undefined') {
      return window.location.href;
    }
    return '';
  };

  const handleCopyLink = () => {
    if (typeof window !== 'undefined') {
      navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  };

  const handleShareWhatsApp = () => {
    const url = getCurrentUrl();
    const text = encodeURIComponent(`Baca artikel menarik di Cakrawala FEB UMJ:\n"${title}"\n${url}`);
    window.open(`https://wa.me/?text=${text}`, '_blank', 'noopener,noreferrer');
  };

  const handleShareX = () => {
    const url = encodeURIComponent(getCurrentUrl());
    const text = encodeURIComponent(title);
    window.open(`https://x.com/intent/tweet?url=${url}&text=${text}`, '_blank', 'noopener,noreferrer');
  };

  const handleShareFacebook = () => {
    const url = encodeURIComponent(getCurrentUrl());
    window.open(`https://www.facebook.com/sharer/sharer.php?u=${url}`, '_blank', 'noopener,noreferrer');
  };

  const handleShareTelegram = () => {
    const url = encodeURIComponent(getCurrentUrl());
    const text = encodeURIComponent(title);
    window.open(`https://t.me/share/url?url=${url}&text=${text}`, '_blank', 'noopener,noreferrer');
  };

  if (variant === 'compact') {
    return (
      <div className="flex items-center gap-1.5 flex-wrap">
        <span className="hidden sm:inline text-xs font-semibold text-neutral-500 mr-1">
          Bagikan:
        </span>

        {/* WhatsApp */}
        <button
          type="button"
          onClick={handleShareWhatsApp}
          title="Bagikan ke WhatsApp"
          aria-label="Bagikan ke WhatsApp"
          className="w-8 h-8 sm:w-9 sm:h-9 rounded-lg bg-emerald-50 hover:bg-[#25D366] text-emerald-700 hover:text-white flex items-center justify-center transition-all border border-emerald-200/60 shadow-xs cursor-pointer active:scale-95"
        >
          <MessageCircle className="w-4 h-4" />
        </button>

        {/* X / Twitter */}
        <button
          type="button"
          onClick={handleShareX}
          title="Bagikan ke X (Twitter)"
          aria-label="Bagikan ke X (Twitter)"
          className="w-8 h-8 sm:w-9 sm:h-9 rounded-lg bg-neutral-100 hover:bg-black text-neutral-700 hover:text-white flex items-center justify-center transition-all border border-neutral-200 shadow-xs cursor-pointer active:scale-95"
        >
          <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24" aria-hidden="true">
            <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
          </svg>
        </button>

        {/* Facebook */}
        <button
          type="button"
          onClick={handleShareFacebook}
          title="Bagikan ke Facebook"
          aria-label="Bagikan ke Facebook"
          className="w-8 h-8 sm:w-9 sm:h-9 rounded-lg bg-blue-50 hover:bg-[#1877F2] text-blue-700 hover:text-white flex items-center justify-center transition-all border border-blue-200/60 shadow-xs cursor-pointer active:scale-95"
        >
          <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24" aria-hidden="true">
            <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
          </svg>
        </button>

        {/* Telegram */}
        <button
          type="button"
          onClick={handleShareTelegram}
          title="Bagikan ke Telegram"
          aria-label="Bagikan ke Telegram"
          className="w-8 h-8 sm:w-9 sm:h-9 rounded-lg bg-sky-50 hover:bg-[#0088CC] text-sky-700 hover:text-white flex items-center justify-center transition-all border border-sky-200/60 shadow-xs cursor-pointer active:scale-95"
        >
          <Send className="w-3.5 h-3.5" />
        </button>

        {/* Salin Tautan */}
        <button
          type="button"
          onClick={handleCopyLink}
          title="Salin Tautan Artikel"
          aria-label="Salin Tautan Artikel"
          className={`w-8 h-8 sm:w-9 sm:h-9 rounded-lg flex items-center justify-center transition-all border shadow-xs cursor-pointer active:scale-95 ${
            copied
              ? 'bg-emerald-600 text-white border-emerald-600'
              : 'bg-brand-sand/70 hover:bg-brand-chocolate text-brand-dark hover:text-white border-brand-sand'
          }`}
        >
          {copied ? <Check className="w-3.5 h-3.5" /> : <LinkIcon className="w-3.5 h-3.5" />}
        </button>
      </div>
    );
  }

  // Expanded variant (Footer style)
  return (
    <div className="flex items-center gap-2 flex-wrap w-full sm:w-auto">
      <span className="text-xs font-bold text-neutral-500 mr-1">Bagikan Artikel:</span>

      {/* WhatsApp */}
      <button
        type="button"
        onClick={handleShareWhatsApp}
        className="px-3 py-2 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 bg-emerald-50 hover:bg-[#25D366] text-emerald-800 hover:text-white border border-emerald-200 shadow-xs active:scale-95 cursor-pointer"
        aria-label="Bagikan ke WhatsApp"
      >
        <MessageCircle className="w-3.5 h-3.5" />
        <span>WhatsApp</span>
      </button>

      {/* X / Twitter */}
      <button
        type="button"
        onClick={handleShareX}
        className="px-3 py-2 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 bg-neutral-100 hover:bg-black text-neutral-800 hover:text-white border border-neutral-300 shadow-xs active:scale-95 cursor-pointer"
        aria-label="Bagikan ke X"
      >
        <svg className="w-3 h-3 fill-current" viewBox="0 0 24 24" aria-hidden="true">
          <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
        </svg>
        <span>X (Twitter)</span>
      </button>

      {/* Salin Tautan */}
      <button
        type="button"
        onClick={handleCopyLink}
        className={`px-3 py-2 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 border shadow-xs active:scale-95 cursor-pointer ${
          copied
            ? 'bg-emerald-600 text-white border-emerald-600'
            : 'bg-brand-sand/80 hover:bg-brand-chocolate hover:text-white border-brand-sand text-brand-dark'
        }`}
        aria-label="Salin Tautan Artikel"
      >
        {copied ? (
          <>
            <Check className="w-3.5 h-3.5 text-white" />
            <span>Tersalin!</span>
          </>
        ) : (
          <>
            <Share2 className="w-3.5 h-3.5" />
            <span>Salin Link</span>
          </>
        )}
      </button>
    </div>
  );
}
