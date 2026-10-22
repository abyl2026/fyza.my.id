'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { LogOut, User as UserIcon } from 'lucide-react';

interface NavbarProps {
  userName?: string;
  userRole?: string;
}

export default function AdminNavbar({ userName = 'Admin', userRole = 'admin' }: NavbarProps) {
  const router = useRouter();

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
    <header className="h-16 shrink-0 bg-white border-b border-[#E5D5C2] px-8 flex items-center justify-between shadow-sm z-30">
      <div>
        <h2 className="text-sm font-semibold text-[#442013]">
          Sistem Informasi & Manajemen Konten Organisasi
        </h2>
        <p className="text-xs text-stone-500">
          Lembaga Pers Mahasiswa BAPEMA Cakrawala Universitas Muhammadiyah Jakarta
        </p>
      </div>

      <div className="flex items-center gap-4">
        {/* User Card */}
        <div className="flex items-center gap-3 pl-4 border-l border-stone-200">
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
          <span>Keluar</span>
        </button>
      </div>
    </header>
  );
}
