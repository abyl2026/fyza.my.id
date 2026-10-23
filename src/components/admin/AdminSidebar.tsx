'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
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
  PanelLeftClose,
  PanelLeft,
} from 'lucide-react';
import { useSidebar } from './SidebarContext';

interface SidebarProps {
  userRole?: string;
  userName?: string;
}

export default function AdminSidebar({ userRole = 'admin', userName = 'Admin' }: SidebarProps) {
  const pathname = usePathname();
  const { collapsed, toggleSidebar } = useSidebar();

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
    <aside
      className={`bg-[#442013] text-[#F4E7D3] flex flex-col h-full border-r border-[#6A3822]/60 select-none shadow-xl flex-shrink-0 z-40 transition-all duration-300 ease-in-out relative ${
        collapsed ? 'w-20' : 'w-64'
      }`}
    >
      {/* Branding Header with Official Logo */}
      <div className={`border-b border-[#6A3822]/60 flex items-center flex-shrink-0 transition-all ${
        collapsed ? 'p-3 justify-center' : 'p-5 justify-between gap-3'
      }`}>
        <div className="flex items-center gap-3 min-w-0">
          <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center border border-[#F4E7D3]/30 shadow-inner overflow-hidden shrink-0 relative p-1">
            <Image
              src="/image/logo-cakrawala.jpg"
              alt="Logo BAPEMA Cakrawala"
              width={40}
              height={40}
              className="w-full h-full object-contain"
              priority
            />
          </div>
          {!collapsed && (
            <div className="min-w-0">
              <h1 className="font-bold text-base tracking-wide text-white leading-tight font-serif truncate">
                BAPEMA
              </h1>
              <p className="text-[11px] text-[#E5D5C2]/80 uppercase tracking-widest font-semibold truncate">
                Cakrawala UMJ
              </p>
            </div>
          )}
        </div>

        {/* Toggle Drawer Button */}
        <button
          type="button"
          onClick={toggleSidebar}
          className={`p-1.5 rounded-lg text-[#E5D5C2]/80 hover:text-white hover:bg-[#6A3822] transition ${
            collapsed ? 'mt-2' : ''
          }`}
          title={collapsed ? 'Buka Navbar Samping (Perlebar)' : 'Sembunyikan Navbar ke Samping (Perluas Layar)'}
          aria-label="Toggle Sidebar"
        >
          {collapsed ? <PanelLeft className="w-4 h-4" /> : <PanelLeftClose className="w-4 h-4" />}
        </button>
      </div>

      {/* Role Pill */}
      {!collapsed ? (
        <div className="px-5 py-3 bg-[#381a10] border-b border-[#6A3822]/40 flex items-center justify-between text-xs flex-shrink-0">
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
      ) : (
        <div className="py-2.5 bg-[#381a10] border-b border-[#6A3822]/40 flex items-center justify-center flex-shrink-0" title={`Otoritas: ${userRole}`}>
          <ShieldCheck className={`w-4 h-4 ${userRole === 'master_admin' ? 'text-amber-400' : 'text-[#E5D5C2]'}`} />
        </div>
      )}

      {/* Navigation Links */}
      <nav className="flex-1 px-3 py-4 space-y-1.5 overflow-y-auto">
        {!collapsed && (
          <div className="px-3 mb-2 text-[10px] font-bold uppercase tracking-wider text-[#E5D5C2]/50">
            Menu Utama Panel
          </div>
        )}
        {navigation.map((item) => {
          const isActive = pathname === item.href;
          const Icon = item.icon;

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold transition-all group ${
                isActive
                  ? 'bg-gradient-to-r from-[#6A3822] to-[#8C4A2F] text-white shadow-md border-l-4 border-[#F4E7D3]'
                  : 'text-[#E5D5C2]/80 hover:bg-[#6A3822]/50 hover:text-white'
              } ${collapsed ? 'justify-center px-0' : ''}`}
              title={collapsed ? item.name : undefined}
            >
              <Icon
                className={`w-5 h-5 flex-shrink-0 transition-colors ${
                  isActive ? 'text-white' : 'text-[#E5D5C2]/70 group-hover:text-white'
                }`}
              />
              {!collapsed && <span className="truncate">{item.name}</span>}
            </Link>
          );
        })}
      </nav>

      {/* Footer Info & View Live Site */}
      <div className="p-3 border-t border-[#6A3822]/60 flex flex-col gap-2 flex-shrink-0 bg-[#381a10]/50">
        <a
          href="/"
          target="_blank"
          rel="noreferrer"
          className={`flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-semibold text-[#E5D5C2]/80 hover:text-white hover:bg-[#6A3822]/60 transition ${
            collapsed ? 'justify-center px-0' : 'justify-between'
          }`}
          title="Buka Web Publik"
        >
          <div className="flex items-center gap-2 truncate">
            <ExternalLink className="w-4 h-4 shrink-0" />
            {!collapsed && <span className="truncate">Buka Web Publik</span>}
          </div>
          {!collapsed && (
            <span className="text-[10px] bg-emerald-500/20 text-emerald-300 px-1.5 py-0.5 rounded border border-emerald-500/30 font-mono">
              Live
            </span>
          )}
        </a>
        {!collapsed && (
          <p className="text-[10px] text-[#E5D5C2]/50 text-center tracking-wider pt-1">
            LPM BAPEMA Cakrawala © 2026
          </p>
        )}
      </div>
    </aside>
  );
}
