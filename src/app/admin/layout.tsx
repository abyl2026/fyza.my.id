'use client';

import React, { useEffect, useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import AdminSidebar from '@/components/admin/AdminSidebar';
import AdminNavbar from '@/components/admin/AdminNavbar';

interface UserData {
  id: number;
  name: string;
  email: string;
  role: 'master_admin' | 'admin';
}

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const isLoginPage = pathname === '/admin/login';

  const [user, setUser] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(!isLoginPage);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    if (isLoginPage) return;

    let isMounted = true;

    // Load cached user session immediately after hydration
    try {
      const cached = localStorage.getItem('cakrawala_user');
      if (cached) {
        setUser(JSON.parse(cached));
        setLoading(false);
      }
    } catch {}

    // Verify session
    fetch('/api/auth/me')
      .then((res) => {
        if (!res.ok) throw new Error('Not authenticated');
        return res.json();
      })
      .then((data) => {
        if (!isMounted) return;
        if (data.authenticated && data.user) {
          setUser(data.user);
          try {
            localStorage.setItem('cakrawala_user', JSON.stringify(data.user));
          } catch {}
        } else {
          try {
            localStorage.removeItem('cakrawala_user');
          } catch {}
          router.replace('/admin/login');
        }
      })
      .catch(() => {
        if (!isMounted) return;
        try {
          localStorage.removeItem('cakrawala_user');
        } catch {}
        router.replace('/admin/login');
      })
      .finally(() => {
        if (isMounted) setLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, [isLoginPage, router]);

  // Lock outer window scroll in admin area to prevent blank white space at bottom
  useEffect(() => {
    if (isLoginPage) return;
    const prevHtmlOverflow = document.documentElement.style.overflow;
    const prevBodyOverflow = document.body.style.overflow;
    document.documentElement.style.overflow = 'hidden';
    document.body.style.overflow = 'hidden';

    return () => {
      document.documentElement.style.overflow = prevHtmlOverflow;
      document.body.style.overflow = prevBodyOverflow;
    };
  }, [isLoginPage]);

  if (isLoginPage) {
    return <>{children}</>;
  }

  if (!mounted || loading) {
    return (
      <div className="fixed inset-0 w-full h-full bg-[#FAF6F0] flex items-center justify-center">
        <div className="text-center p-6 bg-white rounded-2xl border border-[#E5D5C2] shadow-sm max-w-xs mx-4">
          <div className="w-10 h-10 border-4 border-[#6A3822] border-t-transparent rounded-full animate-spin mx-auto mb-3" />
          <p className="text-xs font-semibold text-[#442013] tracking-wide">
            Memuat Panel Admin Cakrawala...
          </p>
          <a
            href="/admin/login"
            className="mt-3 inline-block text-[11px] text-[#6A3822] underline font-medium hover:text-[#442013]"
          >
            Klik di sini jika belum login
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 w-full h-full flex bg-[#FAF6F0] overflow-hidden">
      {/* Sidebar Nav: Permanently fixed on the left, full height, never sinks or scrolls out */}
      <AdminSidebar userRole={user?.role || 'admin'} userName={user?.name || 'Admin'} />

      {/* Main Content Area: Navbar fixed at top, page content scrolls independently */}
      <div className="flex-1 flex flex-col min-w-0 h-full overflow-hidden">
        <AdminNavbar userName={user?.name || 'Admin'} userRole={user?.role || 'admin'} />
        <main className="flex-1 min-h-0 p-6 md:p-8 overflow-y-auto bg-[#FAF6F0]">{children}</main>
      </div>
    </div>
  );
}
