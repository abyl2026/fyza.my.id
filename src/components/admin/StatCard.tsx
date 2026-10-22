import React from 'react';
import { LucideIcon } from 'lucide-react';
import Link from 'next/link';

interface StatCardProps {
  title: string;
  value: number | string;
  description: string;
  icon: LucideIcon;
  colorClass?: string;
  colorScheme?: 'brown' | 'gold' | 'cream' | 'ivory' | string;
  badge?: string;
  href?: string;
}

export default function StatCard({
  title,
  value,
  description,
  icon: Icon,
  colorClass,
  colorScheme = 'brown',
  badge,
  href,
}: StatCardProps) {
  const schemeClasses: Record<string, string> = {
    brown: 'bg-[#442013] text-[#F4E7D3]',
    gold: 'bg-[#6A3822] text-[#F4E7D3]',
    cream: 'bg-[#8C4A2F] text-white',
    ivory: 'bg-[#A05738] text-white',
  };

  const bgIcon = colorClass || schemeClasses[colorScheme] || 'bg-[#442013] text-[#F4E7D3]';

  const cardContent = (
    <div className="bg-white rounded-xl p-5 border border-[#E5D5C2] shadow-sm hover:shadow-md transition-shadow relative overflow-hidden flex flex-col justify-between h-full">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs font-semibold text-stone-500 uppercase tracking-wider mb-1">
            {title}
          </p>
          <h3 className="text-3xl font-extrabold text-[#442013] tracking-tight">{value}</h3>
        </div>
        <div className={`w-12 h-12 rounded-xl flex items-center justify-center shadow-sm ${bgIcon}`}>
          <Icon className="w-6 h-6" />
        </div>
      </div>
      <p className="mt-4 text-xs text-stone-500 leading-relaxed">{description}</p>
      {badge && (
        <span className="mt-2 inline-block px-2 py-0.5 rounded text-[10px] font-bold bg-[#FAF6F0] text-[#6A3822] border border-[#E5D5C2]/60 w-fit">
          {badge}
        </span>
      )}
    </div>
  );

  if (href && href !== '#') {
    return (
      <Link href={href} className="block group">
        {cardContent}
      </Link>
    );
  }

  return cardContent;
}
