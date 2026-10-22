import React from 'react';

export default function TentangKamiLoading() {
  return (
    <div className="bg-[#FAF8F5] min-h-screen text-neutral-800 antialiased" style={{ paddingTop: '72px' }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-10 lg:px-28 py-12 space-y-12 animate-pulse">
        {/* Tab Selector Skeleton */}
        <div className="flex justify-center gap-3">
          <div className="w-28 h-10 bg-stone-300 rounded-xl" />
          <div className="w-28 h-10 bg-stone-200 rounded-xl" />
          <div className="w-28 h-10 bg-stone-200 rounded-xl" />
        </div>

        {/* Tab Content Box Skeleton */}
        <div className="bg-white rounded-3xl border border-[#E5D5C2]/60 p-8 sm:p-12 space-y-4 max-w-4xl mx-auto shadow-sm">
          <div className="w-32 h-6 bg-stone-300 rounded-lg" />
          <div className="w-full h-4 bg-stone-200 rounded" />
          <div className="w-5/6 h-4 bg-stone-200 rounded" />
          <div className="w-4/6 h-4 bg-stone-200 rounded" />
        </div>

        {/* Sambutan Ketua Umum Skeleton */}
        <div className="bg-white rounded-3xl border border-[#E5D5C2]/60 p-6 sm:p-10 grid grid-cols-1 md:grid-cols-12 gap-8 shadow-sm">
          <div className="md:col-span-4 h-72 bg-stone-200 rounded-2xl" />
          <div className="md:col-span-8 flex flex-col justify-center space-y-4">
            <div className="w-24 h-4 bg-stone-200 rounded-md" />
            <div className="w-64 h-8 bg-stone-300 rounded-xl" />
            <div className="w-40 h-4 bg-stone-200 rounded" />
            <div className="w-full h-20 bg-stone-100 rounded-xl" />
          </div>
        </div>

        {/* Divisi & Fungsionaris Skeleton */}
        <div className="space-y-6">
          <div className="w-48 h-7 bg-stone-300 rounded-xl" />
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="bg-white rounded-2xl border border-[#E5D5C2]/60 p-4 space-y-3">
                <div className="w-16 h-16 rounded-full bg-stone-200 mx-auto" />
                <div className="w-28 h-4 bg-stone-300 rounded mx-auto" />
                <div className="w-20 h-3 bg-stone-200 rounded mx-auto" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
