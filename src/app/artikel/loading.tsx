import React from 'react';

export default function ArtikelLoading() {
  return (
    <div className="bg-[#FAF8F5] min-h-screen text-neutral-800 antialiased" style={{ paddingTop: '72px' }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-10 lg:px-28 py-10 space-y-10 animate-pulse">
        {/* Hero Section Skeleton */}
        <div className="text-center space-y-3 max-w-2xl mx-auto pt-4">
          <div className="w-28 h-5 bg-stone-200 rounded-full mx-auto" />
          <div className="w-72 sm:w-96 h-10 bg-stone-300 rounded-2xl mx-auto" />
          <div className="w-64 sm:w-80 h-4 bg-stone-200 rounded mx-auto" />
        </div>

        {/* Top Spotlight Skeleton */}
        <div className="w-full rounded-3xl bg-white border border-[#E5D5C2]/60 p-6 sm:p-8 grid grid-cols-1 lg:grid-cols-12 gap-6 shadow-sm">
          <div className="lg:col-span-7 h-64 sm:h-80 bg-stone-200 rounded-2xl" />
          <div className="lg:col-span-5 flex flex-col justify-center space-y-4">
            <div className="w-24 h-4 bg-stone-200 rounded-md" />
            <div className="w-full h-8 bg-stone-300 rounded-xl" />
            <div className="w-full h-16 bg-stone-100 rounded-lg" />
            <div className="w-40 h-4 bg-stone-200 rounded" />
          </div>
        </div>

        {/* Filter Categories Skeleton */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="w-24 h-9 bg-white border border-[#E5D5C2]/60 rounded-xl shrink-0" />
          ))}
        </div>

        {/* Articles Grid Skeleton */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="bg-white rounded-3xl border border-[#E5D5C2]/60 overflow-hidden shadow-xs space-y-4 p-4">
              <div className="w-full h-48 bg-stone-200 rounded-2xl" />
              <div className="space-y-2">
                <div className="w-20 h-3 bg-stone-200 rounded" />
                <div className="w-full h-5 bg-stone-300 rounded" />
                <div className="w-3/4 h-3 bg-stone-100 rounded" />
              </div>
              <div className="pt-2 border-t border-stone-100 flex justify-between">
                <div className="w-24 h-3 bg-stone-200 rounded" />
                <div className="w-16 h-3 bg-stone-200 rounded" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
