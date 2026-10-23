'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { LogOut, User as UserIcon, PanelLeft, PanelLeftClose } from 'lucide-react';
import { useSidebar } from './SidebarContext';

interface NavbarProps {
  userName?: string;
  userRole?: string;
}

export default function AdminNavbar({ userName = 'Admin', userRole = 'admin' }: NavbarProps) {
  const router = useRouter();
  const { collapsed, toggleSidebar } = useSidebar();

  const handleLogout = async () => {
    if (confirm('Apakah Anda yakin ingin keluar dari panel admin?')) {
      try {
        try {
          localStorage.removeItem('cakrawala_user');
        } catch {}
        await fetch('/api/auth/logout', { method: 'POST' });
        router.push('/admin/login');
        router.refresh();
      } catch (err) {
        console.error('Logout error:', err);
      }
    }
  };

  return (
    <header className="h-16 shrink-0 bg-white border-b border-[#E5D5C2] px-4 sm:px-8 flex items-center justify-between shadow-sm z-30 gap-4">
      <div className="flex items-center gap-3">
        {/* Toggle drawer button in navbar */}
        <button
          type="button"
          onClick={toggleSidebar}
          className="p-2 rounded-xl text-stone-600 hover:text-[#442013] hover:bg-stone-100 border border-stone-200 transition"
          title={collapsed ? 'Tampilkan Sidebar Penuh (Buka Laci)' : 'Sembunyikan Sidebar ke Samping (Perlebar Ruang Kerja)'}
          aria-label="Toggle Sidebar Laci"
        >
          {collapsed ? <PanelLeft className="w-5 h-5 text-[#6A3822]" /> : <PanelLeftClose className="w-5 h-5 text-stone-500" />}
        </button>

        <div>
          <h2 className="text-xs sm:text-sm font-semibold text-[#442013] line-clamp-1">
            Sistem Informasi & Manajemen Konten Organisasi
          </h2>
          <p className="text-[11px] sm:text-xs text-stone-500 hidden md:block">
            Lembaga Pers Mahasiswa BAPEMA Cakrawala Universitas Muhammadiyah Jakarta
          </p>
        </div>
      </div>

      <div className="flex items-center gap-3 sm:gap-4">
        {/* User Card */}
        <div className="flex items-center gap-2.5 sm:gap-3 pl-3 sm:pl-4 border-l border-stone-200">
          <div className="w-8 h-8 rounded-full bg-[#FAF6F0] border border-[#6A3822]/30 flex items-center justify-center text-[#442013] font-bold text-xs shadow-sm">
            <UserIcon className="w-4 h-4 text-[#6A3822]" />
          </div>
          <div className="text-left hidden sm:block">
            <p className="text-xs font-bold text-[#442013] leading-none">{userName}</p>
            <p className="text-[10px] text-stone-500 capitalize">{userRole.replace('_', ' ')}</p>
          </div>
        </div>

        {/* Logout Button */}
        <button
          onClick={handleLogout}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-rose-50 text-rose-700 hover:bg-rose-100 border border-rose-200 transition"
          title="Keluar dari Panel Admin"
        >
          <LogOut className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">Keluar</span>
        </button>
      </div>
    </header>
  );
}
