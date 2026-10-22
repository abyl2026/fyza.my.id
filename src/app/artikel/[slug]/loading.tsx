import React from 'react';

export default function ArtikelDetailLoading() {
  return (
    <div className="bg-[#FAF8F5] min-h-screen text-neutral-800 antialiased" style={{ paddingTop: '72px' }}>
      {/* Breadcrumb Skeleton */}
      <div className="bg-white border-b border-[#E5D5C2]/80 px-4 sm:px-10 lg:px-28 py-3">
        <div className="max-w-7xl mx-auto flex items-center gap-2 animate-pulse">
          <div className="w-14 h-3 bg-stone-200 rounded" />
          <div className="w-3 h-3 bg-stone-200 rounded" />
          <div className="w-16 h-3 bg-stone-200 rounded" />
          <div className="w-3 h-3 bg-stone-200 rounded" />
          <div className="w-32 h-3 bg-stone-200 rounded" />
        </div>
      </div>

      <div className="bg-white py-8 sm:py-12 lg:py-16 px-4 sm:px-10 lg:px-28 border-b border-[#E5D5C2]/60">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 animate-pulse">
            {/* Main Article Body (8 Cols) */}
            <div className="lg:col-span-8 space-y-6">
              <div className="w-28 h-5 bg-stone-200 rounded-full" />
              <div className="w-full h-12 bg-stone-300 rounded-xl" />
              <div className="w-3/4 h-6 bg-stone-200 rounded-lg" />
              <div className="flex items-center gap-4 py-3 border-y border-stone-100">
                <div className="w-10 h-10 rounded-full bg-stone-200 shrink-0" />
                <div className="space-y-1.5 flex-1">
                  <div className="w-32 h-3.5 bg-stone-200 rounded" />
                  <div className="w-48 h-2.5 bg-stone-100 rounded" />
                </div>
              </div>
              <div className="w-full h-72 sm:h-96 bg-stone-200 rounded-3xl" />
              <div className="space-y-3 pt-4">
                <div className="w-full h-4 bg-stone-200 rounded" />
                <div className="w-full h-4 bg-stone-200 rounded" />
                <div className="w-5/6 h-4 bg-stone-200 rounded" />
                <div className="w-3/4 h-4 bg-stone-200 rounded" />
              </div>
            </div>

            {/* Aside / Sidebar (4 Cols) */}
            <div className="lg:col-span-4 space-y-6">
              <div className="w-full h-48 bg-stone-200 rounded-3xl" />
              <div className="w-full h-64 bg-stone-200 rounded-3xl" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
