'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  Info,
  Calendar,
  FileText,
  MessageSquare,
  Users,
  ExternalLink,
  ShieldCheck,
  Feather,
} from 'lucide-react';

interface SidebarProps {
  userRole?: string;
  userName?: string;
}

export default function AdminSidebar({ userRole = 'admin', userName = 'Admin' }: SidebarProps) {
  const pathname = usePathname();

  const navigation = [
    { name: 'Beranda', href: '/admin/dashboard', icon: LayoutDashboard },
    { name: 'Tentang Kami', href: '/admin/tentang-kami', icon: Info },
    { name: 'Acara & Agenda', href: '/admin/acara', icon: Calendar },
    { name: 'Artikel & Berita', href: '/admin/artikel', icon: FileText },
    { name: 'Kotak Aspirasi', href: '/admin/aspirasi', icon: MessageSquare },
  ];

  // Khusus Master Admin
  if (userRole === 'master_admin') {
    navigation.push({ name: 'Kelola Pengguna', href: '/admin/users', icon: Users });
  }

  return (
    <aside className="w-64 bg-[#442013] text-[#F4E7D3] flex flex-col h-full border-r border-[#6A3822]/60 select-none shadow-xl flex-shrink-0 z-40 overflow-hidden">
      {/* Branding Header */}
      <div className="p-6 border-b border-[#6A3822]/60 flex items-center gap-3 flex-shrink-0">
        <div className="w-10 h-10 rounded-lg bg-[#6A3822] flex items-center justify-center border border-[#F4E7D3]/40 shadow-inner">
          <Feather className="w-5 h-5 text-[#F4E7D3]" />
        </div>
        <div>
          <h1 className="font-bold text-base tracking-wide text-white leading-tight font-serif">
            BAPEMA
          </h1>
          <p className="text-xs text-[#E5D5C2]/80 uppercase tracking-widest font-semibold">
            Cakrawala UMJ
          </p>
        </div>
      </div>

      {/* Role Pill */}
      <div className="px-6 py-3 bg-[#381a10] border-b border-[#6A3822]/40 flex items-center justify-between text-xs flex-shrink-0">
        <span className="text-[#E5D5C2]/70">Otoritas Sesi:</span>
        <span
          className={`px-2 py-0.5 rounded font-semibold text-[11px] flex items-center gap-1 ${
            userRole === 'master_admin'
              ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
              : 'bg-[#6A3822] text-[#F4E7D3]'
          }`}
        >
          <ShieldCheck className="w-3 h-3" />
          {userRole === 'master_admin' ? 'Master Admin' : 'Admin'}
        </span>
      </div>

      {/* Menu Navigasi */}
      <nav className="flex-1 p-4 space-y-1.5 overflow-y-auto">
        <p className="px-3 pb-2 text-[10px] font-bold text-[#E5D5C2]/50 uppercase tracking-wider">
          Menu Utama Panel
        </p>
        {navigation.map((item) => {
          const isActive = pathname === item.href || pathname.startsWith(item.href + '/');
          const Icon = item.icon;
          return (
            <Link
              key={item.name}
              href={item.href}
              className={`flex items-center gap-3 px-3.5 py-2.5 rounded-lg text-sm font-medium transition-all ${
                isActive
                  ? 'bg-[#6A3822] text-white shadow-md border-l-4 border-[#F4E7D3] font-semibold'
                  : 'text-[#E5D5C2]/80 hover:bg-[#572b1b] hover:text-white'
              }`}
            >
              <Icon className={`w-4 h-4 ${isActive ? 'text-[#F4E7D3]' : 'text-[#E5D5C2]/70'}`} />
              <span>{item.name}</span>
            </Link>
          );
        })}
      </nav>

      {/* Footer Nav */}
      <div className="p-4 border-t border-[#6A3822]/60 space-y-2 flex-shrink-0 mt-auto bg-[#381a10]/50">
        <Link
          href="/"
          target="_blank"
          className="flex items-center justify-between px-3 py-2 rounded text-xs text-[#E5D5C2]/80 hover:text-white hover:bg-[#572b1b] transition"
        >
          <span className="flex items-center gap-2">
            <ExternalLink className="w-3.5 h-3.5" />
            Buka Web Publik
          </span>
          <span className="text-[10px] bg-[#6A3822] px-1.5 py-0.5 rounded text-white">Live</span>
        </Link>
        <p className="text-[10px] text-center text-[#E5D5C2]/40 pt-2 border-t border-[#6A3822]/30">
          LPM BAPEMA Cakrawala &copy; 2026
        </p>
      </div>
    </aside>
  );
}
