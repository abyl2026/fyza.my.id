import React from 'react';

export default function AdminLoading() {
  return (
    <div className="space-y-8 animate-pulse">
      {/* Banner Skeleton */}
      <div className="rounded-2xl p-6 sm:p-8 bg-[#442013]/20 border border-[#E5D5C2]/40 h-40 flex flex-col justify-center space-y-3">
        <div className="w-32 h-4 bg-[#6A3822]/30 rounded-full" />
        <div className="w-64 h-7 bg-[#6A3822]/40 rounded-xl" />
        <div className="w-96 h-4 bg-[#6A3822]/20 rounded" />
      </div>

      {/* 4 Stat Cards Skeleton */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="bg-white rounded-2xl p-5 border border-[#E5D5C2]/40 space-y-3 shadow-xs">
            <div className="w-24 h-4 bg-stone-200 rounded" />
            <div className="w-16 h-8 bg-stone-300 rounded" />
            <div className="w-36 h-3 bg-stone-100 rounded" />
          </div>
        ))}
      </div>

      {/* 2 Column Skeleton */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8">
        <div className="bg-white rounded-2xl p-6 border border-[#E5D5C2]/40 space-y-4">
          <div className="w-36 h-6 bg-stone-300 rounded" />
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="p-3.5 rounded-xl bg-stone-50 border border-stone-200/60 space-y-2">
                <div className="w-32 h-4 bg-stone-200 rounded" />
                <div className="w-full h-3 bg-stone-100 rounded" />
              </div>
            ))}
          </div>
        </div>
        <div className="bg-white rounded-2xl p-6 border border-[#E5D5C2]/40 space-y-4">
          <div className="w-40 h-6 bg-stone-300 rounded" />
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="p-3.5 rounded-xl bg-stone-50 border border-stone-200/60 space-y-2">
                <div className="w-28 h-4 bg-stone-200 rounded" />
                <div className="w-full h-3 bg-stone-100 rounded" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
