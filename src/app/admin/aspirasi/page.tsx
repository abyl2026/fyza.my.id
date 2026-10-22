'use client';

import React, { useEffect, useState } from 'react';
import {
  MessageSquare,
  FileSpreadsheet,
  Filter,
  CheckCircle,
  Archive,
  RefreshCw,
  Clock,
  User,
  GraduationCap,
} from 'lucide-react';

interface AspirationItem {
  id: number;
  fullName: string;
  email?: string;
  senderType: 'mahasiswa_umj' | 'umum';
  faculty?: string;
  major?: string;
  aspirationContent: string;
  status: 'new' | 'reviewed' | 'archived';
  createdAt: string;
}

export default function AdminAspirationsPage() {
  const [aspirations, setAspirations] = useState<AspirationItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [dateFilter, setDateFilter] = useState('all'); // 'all', '7days', '30days'
  const [statusFilter, setStatusFilter] = useState('all');
  const [exporting, setExporting] = useState(false);

  const fetchAspirations = async () => {
    setLoading(true);
    try {
      const url = `/api/admin/aspirations?filter=${dateFilter}&status=${statusFilter}`;
      const res = await fetch(url);
      const data = await res.json();
      if (data.aspirations) {
        setAspirations(data.aspirations);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAspirations();
  }, [dateFilter, statusFilter]);

  const handleUpdateStatus = async (id: number, status: 'new' | 'reviewed' | 'archived') => {
    try {
      const res = await fetch(`/api/admin/aspirations/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status }),
      });
      if (res.ok) {
        fetchAspirations();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleExportExcel = () => {
    setExporting(true);
    const exportUrl = `/api/admin/aspirations/export?filter=${dateFilter}&status=${statusFilter}`;
    window.open(exportUrl, '_blank');
    setTimeout(() => setExporting(false), 1000);
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-serif font-bold text-[#442013]">Kotak Aspirasi Mahasiswa</h1>
          <p className="text-sm text-stone-500 mt-1">
            Pantau dan tindak lanjuti kritik, saran, serta suara aspirasi mahasiswa UMJ dan umum.
          </p>
        </div>
        <button
          onClick={handleExportExcel}
          disabled={exporting || aspirations.length === 0}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-700 text-white font-semibold text-sm hover:bg-emerald-800 transition shadow-sm active:scale-95 disabled:opacity-50"
        >
          <FileSpreadsheet className="w-4 h-4" />
          <span>{exporting ? 'Mengunduh...' : 'Tarik Data (Excel)'}</span>
        </button>
      </div>

      {/* Filter Bar */}
      <div className="bg-white p-4 rounded-2xl border border-[#E5D5C2]/40 shadow-sm flex flex-wrap items-center justify-between gap-4">
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-2 text-stone-500 text-xs font-bold uppercase tracking-wider">
            <Filter className="w-3.5 h-3.5" />
            <span>Filter:</span>
          </div>

          {/* Filter Waktu */}
          <select
            value={dateFilter}
            onChange={(e) => setDateFilter(e.target.value)}
            className="px-3 py-1.5 rounded-xl border border-stone-300 text-xs font-semibold text-stone-700 focus:outline-none focus:border-[#6A3822] bg-stone-50/50"
          >
            <option value="all">Semua Waktu</option>
            <option value="7days">7 Hari Terakhir</option>
            <option value="30days">30 Hari Terakhir</option>
            <option value="this_month">Bulan Ini</option>
          </select>

          {/* Filter Status */}
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-1.5 rounded-xl border border-stone-300 text-xs font-semibold text-stone-700 focus:outline-none focus:border-[#6A3822] bg-stone-50/50"
          >
            <option value="all">Semua Status</option>
            <option value="new">Belum Ditinjau (Baru)</option>
            <option value="reviewed">Telah Ditinjau</option>
            <option value="archived">Diarsipkan</option>
          </select>
        </div>

        <button
          onClick={() => fetchAspirations()}
          className="inline-flex items-center gap-1.5 text-xs text-[#6A3822] font-semibold hover:underline"
        >
          <RefreshCw className="w-3.5 h-3.5" /> Muat Ulang
        </button>
      </div>

      {/* Aspirations Table - Kolom Isi Aspirasi Diperlebar & Metadata Dipadatkan */}
      <div className="bg-white rounded-2xl shadow-sm border border-[#E5D5C2]/40 overflow-hidden">
        {loading ? (
          <div className="p-12 text-center text-stone-400 text-sm">Memuat data aspirasi...</div>
        ) : aspirations.length === 0 ? (
          <div className="p-12 text-center text-stone-400 text-sm">
            Tidak ada data aspirasi yang sesuai dengan filter yang dipilih.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-stone-600">
              <thead className="bg-[#FAF6F0] text-[#442013] font-serif text-xs uppercase tracking-wider border-b border-[#E5D5C2]/40">
                <tr>
                  <th className="px-6 py-4 w-72">Pengirim & Info</th>
                  <th className="px-6 py-4">Isi Aspirasi</th>
                  <th className="px-6 py-4 text-right w-40">Tindakan</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E5D5C2]/20">
                {aspirations.map((item) => (
                  <tr key={item.id} className="hover:bg-stone-50/60 transition-colors align-top">
                    {/* Kolom 1: Pengirim, Status, Tanggal, dan Kategori terpadu */}
                    <td className="px-6 py-4">
                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          <span
                            className={`px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider ${
                              item.status === 'new'
                                ? 'bg-amber-100 text-amber-800 border border-amber-200'
                                : item.status === 'reviewed'
                                ? 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                                : 'bg-stone-200 text-stone-700'
                            }`}
                          >
                            {item.status === 'new'
                              ? 'Baru'
                              : item.status === 'reviewed'
                              ? 'Ditinjau'
                              : 'Arsip'}
                          </span>
                          <span className="text-[11px] text-stone-400 flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            {new Date(item.createdAt).toLocaleDateString('id-ID', {
                              day: 'numeric',
                              month: 'short',
                              year: 'numeric',
                            })}
                          </span>
                        </div>

                        <div>
                          <div className="font-bold text-[#442013] text-sm flex items-center gap-1.5">
                            <User className="w-3.5 h-3.5 text-[#6A3822]" />
                            {item.fullName}
                          </div>
                          {item.email && (
                            <div className="text-xs text-stone-400 mt-0.5">
                              {item.email}
                            </div>
                          )}
                        </div>

                        <div>
                          <span
                            className={`inline-block px-2 py-0.5 rounded text-[10px] font-semibold ${
                              item.senderType === 'mahasiswa_umj'
                                ? 'bg-blue-50 text-blue-700 border border-blue-200'
                                : 'bg-stone-100 text-stone-600 border border-stone-200'
                            }`}
                          >
                            {item.senderType === 'mahasiswa_umj' ? 'Mahasiswa UMJ' : 'Masyarakat Umum'}
                          </span>

                          {item.senderType === 'mahasiswa_umj' && item.faculty && (
                            <div className="text-[11px] text-stone-500 mt-1 flex items-start gap-1">
                              <GraduationCap className="w-3.5 h-3.5 text-[#6A3822] flex-shrink-0 mt-0.5" />
                              <span>{item.faculty} {item.major ? `• ${item.major}` : ''}</span>
                            </div>
                          )}
                        </div>
                      </div>
                    </td>

                    {/* Kolom 2: Isi Aspirasi (Sangat Luas & Nyaman Dibaca) */}
                    <td className="px-6 py-4">
                      <div className="bg-[#FAF6F0]/60 p-4 rounded-xl border border-[#E5D5C2]/40 text-stone-800 leading-relaxed text-sm whitespace-pre-wrap">
                        {item.aspirationContent}
                      </div>
                    </td>

                    {/* Kolom 3: Tindakan Status */}
                    <td className="px-6 py-4 text-right whitespace-nowrap">
                      <div className="inline-flex flex-col gap-1.5 items-end">
                        {item.status !== 'reviewed' && (
                          <button
                            onClick={() => handleUpdateStatus(item.id, 'reviewed')}
                            className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-semibold text-emerald-700 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 transition"
                            title="Tandai Ditinjau"
                          >
                            <CheckCircle className="w-3.5 h-3.5" />
                            <span>Tandai Ditinjau</span>
                          </button>
                        )}
                        {item.status !== 'archived' && (
                          <button
                            onClick={() => handleUpdateStatus(item.id, 'archived')}
                            className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-semibold text-stone-600 bg-stone-100 hover:bg-stone-200 transition"
                            title="Arsipkan"
                          >
                            <Archive className="w-3.5 h-3.5" />
                            <span>Arsipkan</span>
                          </button>
                        )}
                        {item.status === 'archived' && (
                          <button
                            onClick={() => handleUpdateStatus(item.id, 'new')}
                            className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-semibold text-amber-700 bg-amber-50 hover:bg-amber-100 border border-amber-200 transition"
                            title="Pulihkan ke Baru"
                          >
                            <RefreshCw className="w-3.5 h-3.5" />
                            <span>Kembalikan</span>
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
