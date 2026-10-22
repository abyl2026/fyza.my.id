'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { CheckCircle2, ArrowRight } from 'lucide-react';

interface AspirasiSuccessModalProps {
  isOpen: boolean;
  onClose?: () => void;
}

export default function AspirasiSuccessModal({
  isOpen,
  onClose,
}: AspirasiSuccessModalProps) {
  const router = useRouter();
  const [countdown, setCountdown] = useState(4);

  useEffect(() => {
    if (!isOpen) return;

    setCountdown(4);
    const interval = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          router.push('/');
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [isOpen, router]);

  if (!isOpen) return null;

  const handleReturnHome = () => {
    router.push('/');
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-md flex items-center justify-center p-3 sm:p-4 animate-in fade-in duration-300"
    >
      <div className="bg-white rounded-3xl max-w-md w-full p-6 sm:p-9 shadow-2xl border border-brand-sand text-center flex flex-col items-center gap-4 sm:gap-5 transform animate-in zoom-in-95 duration-300 my-auto">
        {/* Animated Success Icon */}
        <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center shadow-inner relative">
          <span className="absolute inset-0 rounded-full bg-emerald-400/20 animate-ping pointer-events-none" />
          <CheckCircle2 className="w-9 h-9 sm:w-12 sm:h-12 relative z-10" />
        </div>

        {/* Text Header & Ucapan Terimakasih */}
        <div className="flex flex-col gap-2">
          <h3 className="text-xl sm:text-3xl font-extrabold text-brand-dark tracking-tight">
            Aspirasi Terkirim!
          </h3>
          <p className="text-xs sm:text-sm text-neutral-600 leading-relaxed px-1">
            Terima kasih banyak atas partisipasi dan aspirasi yang Anda sampaikan. Pesan Anda telah berhasil tercatat langsung di sistem redaksi <strong className="text-brand-dark">BPM Cakrawala FEB UMJ</strong> dan akan ditindaklanjuti secara bertanggung jawab.
          </p>
        </div>

        {/* Countdown Box */}
        <div className="w-full py-2.5 sm:py-3 px-4 rounded-2xl bg-brand-sand/50 border border-brand-sand text-xs text-neutral-600 flex items-center justify-center gap-1.5 font-medium">
          <span>Otomatis kembali ke beranda dalam</span>
          <span className="font-extrabold text-brand-chocolate text-xs sm:text-sm bg-white px-2 py-0.5 rounded-lg border border-brand-sand shadow-xs">
            {countdown}
          </span>
          <span>detik...</span>
        </div>

        {/* Action Button: Kembali ke Beranda Segera (Touch min 48px) */}
        <button
          onClick={handleReturnHome}
          className="w-full min-h-[48px] py-3.5 rounded-xl bg-gradient-to-r from-brand-chocolate to-brand-walnut hover:from-brand-dark hover:to-brand-chocolate text-white font-bold text-xs sm:text-sm transition-all shadow-md hover:shadow-lg flex items-center justify-center gap-2 group cursor-pointer active:scale-95"
        >
          <span>Kembali ke Beranda Sekarang</span>
          <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
        </button>
      </div>
    </div>
  );
}
