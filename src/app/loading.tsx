import React from 'react';

export default function GlobalLoading() {
  return (
    <div className="min-h-screen bg-[#FAF8F5] flex flex-col antialiased">
      {/* Top Navbar Placeholder (72px) */}
      <div className="h-[72px] w-full bg-white/90 border-b border-[#E5D5C2]/60 px-6 sm:px-12 flex items-center justify-between">
        <div className="flex items-center gap-3 animate-pulse">
          <div className="w-10 h-10 rounded-full bg-stone-200" />
          <div className="space-y-1.5">
            <div className="w-24 h-4 bg-stone-200 rounded" />
            <div className="w-16 h-2.5 bg-stone-100 rounded" />
          </div>
        </div>
        <div className="hidden lg:flex items-center gap-6 animate-pulse">
          <div className="w-16 h-4 bg-stone-200 rounded" />
          <div className="w-20 h-4 bg-stone-200 rounded" />
          <div className="w-16 h-4 bg-stone-200 rounded" />
          <div className="w-16 h-4 bg-stone-200 rounded" />
          <div className="w-24 h-9 bg-stone-200 rounded-lg" />
        </div>
      </div>

      {/* Main Skeleton Placeholder */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-8 py-10 space-y-8 animate-pulse">
        {/* Banner/Hero skeleton */}
        <div className="w-full h-56 sm:h-72 rounded-3xl bg-stone-200/70 relative overflow-hidden" />

        {/* Content Skeleton Lines */}
        <div className="space-y-4 max-w-2xl">
          <div className="w-32 h-4 bg-stone-200 rounded-full" />
          <div className="w-3/4 h-8 bg-stone-200 rounded-xl" />
          <div className="w-full h-4 bg-stone-100 rounded" />
          <div className="w-5/6 h-4 bg-stone-100 rounded" />
        </div>

        {/* Grid Cards skeleton */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-4">
          {[1, 2, 3].map((n) => (
            <div key={n} className="rounded-2xl bg-white border border-[#E5D5C2]/50 p-4 space-y-3 shadow-xs">
              <div className="w-full h-40 bg-stone-200/80 rounded-xl" />
              <div className="w-20 h-3 bg-stone-200 rounded" />
              <div className="w-full h-5 bg-stone-200 rounded" />
              <div className="w-4/5 h-3 bg-stone-100 rounded" />
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
