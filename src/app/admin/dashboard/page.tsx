'use client';

import React, { useEffect, useState } from 'react';
import {
  MessageSquare,
  Users,
  Calendar,
  FileText,
  Clock,
  Sparkles,
  ArrowUpRight,
  TrendingUp,
} from 'lucide-react';
import StatCard from '@/components/admin/StatCard';
import Link from 'next/link';

interface StatsData {
  aspirationsCount: number;
  adminsCount: number;
  publishedEventsCount: number;
  publishedArticlesCount: number;
}

interface RecentAspiration {
  id: number;
  fullName: string;
  senderType: string;
  aspirationContent: string;
  status: string;
  createdAt: string;
}

interface RecentArticle {
  id: number;
  title: string;
  category: string;
  status: string;
  isTop: number;
  viewsCount: number;
  createdAt: string;
}

export default function AdminDashboardPage() {
  const [userName, setUserName] = useState('Admin');
  const [userRole, setUserRole] = useState('admin');
  const [stats, setStats] = useState<StatsData>({
    aspirationsCount: 0,
    adminsCount: 0,
    publishedEventsCount: 0,
    publishedArticlesCount: 0,
  });
  const [recentAspirations, setRecentAspirations] = useState<RecentAspiration[]>([]);
  const [recentArticles, setRecentArticles] = useState<RecentArticle[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // 1. Ambil data user dari cache lokal agar instan tanpa hit ulang API
    try {
      const cached = localStorage.getItem('cakrawala_user');
      if (cached) {
        const u = JSON.parse(cached);
        if (u.name) setUserName(u.name);
        if (u.role) setUserRole(u.role);
      } else {
        fetch('/api/auth/me')
          .then((res) => res.json())
          .then((data) => {
            if (data.authenticated && data.user) {
              setUserName(data.user.name);
              setUserRole(data.user.role || 'admin');
            }
          })
          .catch(() => {});
      }
    } catch {}

    // 2. Fetch stats
    fetch('/api/admin/stats')
      .then((res) => res.json())
      .then((data) => {
        if (data.stats) {
          setStats(data.stats);
        }
        if (data.recentAspirations) {
          setRecentAspirations(data.recentAspirations);
        }
        if (data.recentArticles) {
          setRecentArticles(data.recentArticles);
        }
      })
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="space-y-8">
      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-[#442013] via-[#6A3822] to-[#442013] rounded-2xl p-6 sm:p-8 text-[#F4E7D3] shadow-lg border border-[#E5D5C2]/20 relative overflow-hidden">
        <div className="absolute top-0 right-0 -mr-16 -mt-16 w-64 h-64 bg-[#E5D5C2]/5 rounded-full blur-2xl pointer-events-none" />
        <div className="relative z-10 max-w-2xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#E5D5C2]/15 text-[#E5D5C2] text-xs font-semibold uppercase tracking-wider mb-3">
            <Sparkles className="w-3.5 h-3.5" />
            Portal Redaksi & Administrasi
          </div>
          <h1 className="text-2xl sm:text-3xl font-serif font-bold text-[#FFFFFF]">
            Selamat Datang, {userName}!
          </h1>
          <p className="mt-2 text-[#E5D5C2]/80 text-sm leading-relaxed">
            Kelola seluruh kanal publikasi jurnalistik, agenda kegiatan, pengurus organisasi, serta pantau aspirasi mahasiswa BAPEMA Cakrawala UMJ dalam satu kendali.
          </p>
        </div>
      </div>

      {/* 4 Summary Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        <StatCard
          title="Aspirasi Masuk"
          value={stats.aspirationsCount}
          description="Aspirasi dari mahasiswa & umum"
          icon={MessageSquare}
          href="/admin/aspirasi"
          colorScheme="brown"
        />
        <StatCard
          title="Anggota Admin"
          value={stats.adminsCount}
          description="Total akun redaksi & master"
          icon={Users}
          href={userRole === 'master_admin' ? '/admin/users' : '#'}
          colorScheme="gold"
        />
        <StatCard
          title="Acara Terbit"
          value={stats.publishedEventsCount}
          description="Agenda kegiatan aktif dipublikasi"
          icon={Calendar}
          href="/admin/acara"
          colorScheme="cream"
        />
        <StatCard
          title="Artikel Terbit"
          value={stats.publishedArticlesCount}
          description="Berita, opini, & rilis pers terbit"
          icon={FileText}
          href="/admin/artikel"
          colorScheme="ivory"
        />
      </div>

      {/* Grid: 2 Kolom Ringkasan Terkini */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8">
        {/* Kolom 1: Aspirasi Terbaru Masuk */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-[#E5D5C2]/40">
          <div className="flex items-center justify-between pb-4 border-b border-[#E5D5C2]/30 mb-4">
            <div className="flex items-center gap-2">
              <MessageSquare className="w-5 h-5 text-[#6A3822]" />
              <h2 className="font-serif font-bold text-[#442013] text-lg">Aspirasi Terbaru</h2>
            </div>
            <Link
              href="/admin/aspirasi"
              className="text-xs font-semibold text-[#6A3822] hover:text-[#442013] inline-flex items-center gap-1 hover:underline"
            >
              Lihat Semua <ArrowUpRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {recentAspirations.length === 0 ? (
            <div className="py-12 text-center text-stone-400 text-sm">
              Belum ada data aspirasi masuk.
            </div>
          ) : (
            <div className="space-y-3">
              {recentAspirations.map((item) => (
                <div
                  key={item.id}
                  className="p-3.5 rounded-xl bg-stone-50 border border-stone-200/70 hover:border-[#6A3822]/40 transition-colors"
                >
                  <div className="flex items-center justify-between text-xs mb-1.5">
                    <span className="font-semibold text-[#442013]">{item.fullName}</span>
                    <span
                      className={`px-2 py-0.5 rounded-full text-[10px] font-semibold ${
                        item.status === 'read'
                          ? 'bg-blue-50 text-blue-700 border border-blue-200'
                          : item.status === 'processed'
                          ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                          : 'bg-amber-50 text-amber-700 border border-amber-200'
                      }`}
                    >
                      {item.status.toUpperCase()}
                    </span>
                  </div>
                  <p className="text-xs text-stone-600 line-clamp-2 leading-relaxed">
                    &quot;{item.aspirationContent}&quot;
                  </p>
                  <div className="flex items-center gap-1.5 mt-2 text-[11px] text-stone-400">
                    <Clock className="w-3 h-3" />
                    <span>{new Date(item.createdAt).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
                    <span>•</span>
                    <span className="capitalize">{item.senderType}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Kolom 2: Artikel Terbaru */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-[#E5D5C2]/40">
          <div className="flex items-center justify-between pb-4 border-b border-[#E5D5C2]/30 mb-4">
            <div className="flex items-center gap-2">
              <FileText className="w-5 h-5 text-[#6A3822]" />
              <h2 className="font-serif font-bold text-[#442013] text-lg">Publikasi Artikel Terbaru</h2>
            </div>
            <Link
              href="/admin/artikel"
              className="text-xs font-semibold text-[#6A3822] hover:text-[#442013] inline-flex items-center gap-1 hover:underline"
            >
              Kelola Artikel <ArrowUpRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {recentArticles.length === 0 ? (
            <div className="py-12 text-center text-stone-400 text-sm">
              Belum ada artikel yang dipublikasi.
            </div>
          ) : (
            <div className="space-y-3">
              {recentArticles.map((art) => (
                <div
                  key={art.id}
                  className="p-3.5 rounded-xl bg-stone-50 border border-stone-200/70 hover:border-[#6A3822]/40 transition-colors"
                >
                  <div className="flex items-center justify-between text-xs mb-1">
                    <span className="px-2 py-0.5 rounded-md bg-[#FAF6F0] text-[#6A3822] text-[10px] font-bold border border-[#E5D5C2]/60">
                      {art.category}
                    </span>
                    <div className="flex items-center gap-1.5">
                      {art.isTop === 1 && (
                        <span className="px-1.5 py-0.5 rounded bg-amber-500 text-white text-[9px] font-bold">
                          TOP
                        </span>
                      )}
                      <span
                        className={`px-2 py-0.5 rounded-full text-[10px] font-semibold ${
                          art.status === 'published'
                            ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                            : 'bg-stone-200 text-stone-600'
                        }`}
                      >
                        {art.status}
                      </span>
                    </div>
                  </div>
                  <h3 className="text-xs font-semibold text-[#442013] line-clamp-1 mt-1">
                    {art.title}
                  </h3>
                  <div className="flex items-center justify-between mt-2 text-[11px] text-stone-400">
                    <div className="flex items-center gap-1.5">
                      <Clock className="w-3 h-3" />
                      <span>{new Date(art.createdAt).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
                    </div>
                    <div className="flex items-center gap-1 text-stone-500 font-medium">
                      <TrendingUp className="w-3 h-3 text-[#6A3822]" />
                      <span>{art.viewsCount} dibaca</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
