'use client';

import React, { useEffect, useState } from 'react';
import {
  Calendar,
  Plus,
  Edit,
  Trash2,
  ExternalLink,
  MapPin,
  Clock,
  Star,
  X,
  CheckCircle2,
  AlertCircle,
} from 'lucide-react';
import FileUpload from '@/components/admin/FileUpload';

interface EventItem {
  id: number;
  title: string;
  slug: string;
  shortSummary?: string;
  description: string;
  eventDate: string;
  location?: string;
  imageUrl?: string;
  importantLink?: string;
  status: 'draft' | 'published' | 'completed';
  isFeatured: number;
}

export default function AdminEventsPage() {
  const [events, setEvents] = useState<EventItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  // Form states
  const [title, setTitle] = useState('');
  const [eventDate, setEventDate] = useState('');
  const [location, setLocation] = useState('');
  const [shortSummary, setShortSummary] = useState('');
  const [description, setDescription] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [importantLink, setImportantLink] = useState('');
  const [status, setStatus] = useState<'draft' | 'published' | 'completed'>('published');
  const [isFeatured, setIsFeatured] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const fetchEvents = async () => {
    try {
      const res = await fetch('/api/admin/events');
      const data = await res.json();
      if (data.events) {
        setEvents(data.events);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  const resetForm = () => {
    setTitle('');
    setEventDate('');
    setLocation('');
    setShortSummary('');
    setDescription('');
    setImageUrl('');
    setImportantLink('');
    setStatus('published');
    setIsFeatured(false);
    setEditingId(null);
  };

  const handleOpenAdd = () => {
    resetForm();
    setShowModal(true);
  };

  const handleOpenEdit = (item: EventItem) => {
    setEditingId(item.id);
    setTitle(item.title);
    setEventDate(item.eventDate ? item.eventDate.substring(0, 10) : '');
    setLocation(item.location || '');
    setShortSummary(item.shortSummary || '');
    setDescription(item.description);
    setImageUrl(item.imageUrl || '');
    setImportantLink(item.importantLink || '');
    setStatus(item.status);
    setIsFeatured(item.isFeatured === 1);
    setShowModal(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setMessage(null);

    const payload = {
      title,
      eventDate,
      location,
      shortSummary,
      description,
      imageUrl,
      importantLink,
      status,
      isFeatured,
    };

    try {
      let res;
      if (editingId) {
        res = await fetch(`/api/admin/events/${editingId}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });
      } else {
        res = await fetch('/api/admin/events', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });
      }

      const data = await res.json();
      if (res.ok) {
        setMessage({ type: 'success', text: data.message });
        setShowModal(false);
        resetForm();
        fetchEvents();
      } else {
        setMessage({ type: 'error', text: data.error || 'Gagal menyimpan acara' });
      }
    } catch (err: any) {
      setMessage({ type: 'error', text: err.message || 'Terjadi kesalahan' });
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Apakah Anda yakin ingin menghapus agenda kegiatan ini?')) return;

    try {
      const res = await fetch(`/api/admin/events/${id}`, {
        method: 'DELETE',
      });
      const data = await res.json();
      if (res.ok) {
        setMessage({ type: 'success', text: data.message });
        fetchEvents();
      } else {
        setMessage({ type: 'error', text: data.error || 'Gagal menghapus' });
      }
    } catch (err: any) {
      setMessage({ type: 'error', text: err.message });
    }
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-serif font-bold text-[#442013]">Kelola Acara & Agenda</h1>
          <p className="text-sm text-stone-500 mt-1">
            Publikasikan program kerja rutin, workshop jurnalistik, serta liputan agenda mahasiswa Cakrawala.
          </p>
        </div>
        <button
          onClick={handleOpenAdd}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#442013] text-[#F4E7D3] font-semibold text-sm hover:bg-[#6A3822] transition shadow-sm active:scale-95"
        >
          <Plus className="w-4 h-4" />
          <span>Tambah Acara Baru</span>
        </button>
      </div>

      {/* Alerts */}
      {message && (
        <div
          className={`p-4 rounded-xl flex items-center gap-3 text-sm font-medium ${
            message.type === 'success'
              ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
              : 'bg-rose-50 text-rose-800 border border-rose-200'
          }`}
        >
          {message.type === 'success' ? (
            <CheckCircle2 className="w-5 h-5 flex-shrink-0" />
          ) : (
            <AlertCircle className="w-5 h-5 flex-shrink-0" />
          )}
          <span>{message.text}</span>
          <button onClick={() => setMessage(null)} className="ml-auto text-xs underline">
            Tutup
          </button>
        </div>
      )}

      {/* Events Table */}
      <div className="bg-white rounded-2xl shadow-sm border border-[#E5D5C2]/40 overflow-hidden">
        {loading ? (
          <div className="p-12 text-center text-stone-400 text-sm">Memuat daftar acara...</div>
        ) : events.length === 0 ? (
          <div className="p-12 text-center text-stone-400 text-sm">
            Belum ada acara yang ditambahkan. Klik tombol &quot;Tambah Acara Baru&quot; di atas untuk memulai.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-stone-600">
              <thead className="bg-[#FAF6F0] text-[#442013] font-serif text-xs uppercase tracking-wider border-b border-[#E5D5C2]/40">
                <tr>
                  <th className="px-6 py-4">Foto / Banner</th>
                  <th className="px-6 py-4">Judul & Lokasi</th>
                  <th className="px-6 py-4">Tanggal Pelaksanaan</th>
                  <th className="px-6 py-4">Status & Sorotan</th>
                  <th className="px-6 py-4">Link Penting</th>
                  <th className="px-6 py-4 text-right">Tindakan</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E5D5C2]/20">
                {events.map((ev) => (
                  <tr key={ev.id} className="hover:bg-stone-50/60 transition-colors">
                    <td className="px-6 py-4">
                      {ev.imageUrl ? (
                        <img
                          src={ev.imageUrl}
                          alt={ev.title}
                          className="w-16 h-12 object-cover rounded-lg border border-stone-200"
                        />
                      ) : (
                        <div className="w-16 h-12 rounded-lg bg-stone-100 flex items-center justify-center text-stone-400 text-[10px]">
                          No Photo
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <div className="font-semibold text-[#442013] line-clamp-1 max-w-xs">{ev.title}</div>
                      {ev.location && (
                        <div className="flex items-center gap-1 text-xs text-stone-400 mt-0.5">
                          <MapPin className="w-3 h-3 text-[#6A3822]" />
                          <span>{ev.location}</span>
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-1.5 text-xs text-stone-600">
                        <Clock className="w-3.5 h-3.5 text-stone-400" />
                        <span>
                          {new Date(ev.eventDate).toLocaleDateString('id-ID', {
                            day: 'numeric',
                            month: 'long',
                            year: 'numeric',
                          })}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-2">
                        <span
                          className={`px-2.5 py-0.5 rounded-full text-xs font-semibold ${
                            ev.status === 'published'
                              ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                              : ev.status === 'completed'
                              ? 'bg-blue-50 text-blue-700 border border-blue-200'
                              : 'bg-stone-100 text-stone-600 border border-stone-200'
                          }`}
                        >
                          {ev.status === 'published' ? 'Terbit' : ev.status === 'completed' ? 'Selesai' : 'Draf'}
                        </span>
                        {ev.isFeatured === 1 && (
                          <span className="flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-50 text-amber-700 border border-amber-200">
                            <Star className="w-2.5 h-2.5 fill-amber-500 text-amber-500" />
                            Sorotan
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      {ev.importantLink ? (
                        <a
                          href={ev.importantLink}
                          target="_blank"
                          rel="noreferrer"
                          className="inline-flex items-center gap-1 text-xs text-[#6A3822] hover:text-[#442013] hover:underline"
                        >
                          Tautan Acara <ExternalLink className="w-3 h-3" />
                        </a>
                      ) : (
                        <span className="text-xs text-stone-300">-</span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-right whitespace-nowrap">
                      <div className="inline-flex items-center gap-2">
                        <button
                          onClick={() => handleOpenEdit(ev)}
                          className="p-1.5 text-stone-500 hover:text-[#6A3822] hover:bg-stone-100 rounded-lg transition"
                          title="Edit Acara"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(ev.id)}
                          className="p-1.5 text-stone-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition"
                          title="Hapus Acara"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Modal Add / Edit Event */}
      {showModal && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl border border-stone-200 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-4 border-b border-stone-200">
              <div className="flex items-center gap-2">
                <Calendar className="w-5 h-5 text-[#6A3822]" />
                <h3 className="font-serif font-bold text-lg text-[#442013]">
                  {editingId ? 'Edit Agenda / Acara' : 'Tambah Agenda Baru'}
                </h3>
              </div>
              <button
                onClick={() => setShowModal(false)}
                className="text-stone-400 hover:text-stone-600 p-1 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="mt-6 space-y-5">
              {/* Judul Acara */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[#442013] mb-1.5">
                  Judul Acara *
                </label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Contoh: Pelatihan Jurnalistik Mahasiswa 2026"
                  className="w-full px-4 py-2.5 rounded-xl border border-stone-300 text-sm focus:outline-none focus:border-[#6A3822] focus:ring-2 focus:ring-[#6A3822]/20"
                />
              </div>

              {/* Tanggal & Lokasi */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-[#442013] mb-1.5">
                    Tanggal Pelaksanaan *
                  </label>
                  <input
                    type="date"
                    required
                    value={eventDate}
                    onChange={(e) => setEventDate(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl border border-stone-300 text-sm focus:outline-none focus:border-[#6A3822] focus:ring-2 focus:ring-[#6A3822]/20"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-[#442013] mb-1.5">
                    Lokasi / Tempat Acara
                  </label>
                  <input
                    type="text"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    placeholder="Contoh: Auditorium Kasman Singodimedjo UMJ / Zoom"
                    className="w-full px-4 py-2.5 rounded-xl border border-stone-300 text-sm focus:outline-none focus:border-[#6A3822] focus:ring-2 focus:ring-[#6A3822]/20"
                  />
                </div>
              </div>

              {/* Upload Foto Acara */}
              <FileUpload
                label="Foto / Banner Acara"
                value={imageUrl}
                onChange={setImageUrl}
                helperText="Unggah poster atau dokumentasi acara langsung dari perangkat (JPG, PNG, WebP max 5MB)."
              />

              {/* Ringkasan Singkat */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[#442013] mb-1.5">
                  Ringkasan Singkat (Lead / Teaser)
                </label>
                <input
                  type="text"
                  value={shortSummary}
                  onChange={(e) => setShortSummary(e.target.value)}
                  placeholder="Deskripsi satu kalimat untuk preview card..."
                  className="w-full px-4 py-2.5 rounded-xl border border-stone-300 text-sm focus:outline-none focus:border-[#6A3822] focus:ring-2 focus:ring-[#6A3822]/20"
                />
              </div>

              {/* Deskripsi Lengkap */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[#442013] mb-1.5">
                  Deskripsi Lengkap Acara *
                </label>
                <textarea
                  required
                  rows={5}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Tuliskan detail jadwal, pembicara, syarat pendaftaran, atau dokumentasi hasil acara..."
                  className="w-full px-4 py-2.5 rounded-xl border border-stone-300 text-sm focus:outline-none focus:border-[#6A3822] focus:ring-2 focus:ring-[#6A3822]/20"
                />
              </div>

              {/* Link Penting */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[#442013] mb-1.5">
                  Link Penting Acara (Pendaftaran / Drive / Livestream)
                </label>
                <input
                  type="url"
                  value={importantLink}
                  onChange={(e) => setImportantLink(e.target.value)}
                  placeholder="https://bit.ly/PendaftaranAcaraCakrawala"
                  className="w-full px-4 py-2.5 rounded-xl border border-stone-300 text-sm focus:outline-none focus:border-[#6A3822] focus:ring-2 focus:ring-[#6A3822]/20"
                />
              </div>

              {/* Status & Sorotan */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-[#442013] mb-1.5">
                    Status Publikasi
                  </label>
                  <select
                    value={status}
                    onChange={(e: any) => setStatus(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl border border-stone-300 text-sm focus:outline-none focus:border-[#6A3822] bg-white"
                  >
                    <option value="draft">Draf (Disimpan Sementara)</option>
                    <option value="published">Terbit (Ditampilkan di Website)</option>
                    <option value="completed">Selesai (Arsip Dokumentasi)</option>
                  </select>
                </div>

                <div className="flex items-center gap-3 pt-6">
                  <input
                    type="checkbox"
                    id="isFeatured"
                    checked={isFeatured}
                    onChange={(e) => setIsFeatured(e.target.checked)}
                    className="w-4 h-4 text-[#6A3822] rounded border-stone-300 focus:ring-[#6A3822]"
                  />
                  <label htmlFor="isFeatured" className="text-sm font-semibold text-[#442013] select-none cursor-pointer">
                    Jadikan Sorotan (Highlight di Beranda)
                  </label>
                </div>
              </div>

              {/* Actions Buttons */}
              <div className="flex items-center justify-end gap-3 pt-4 border-t border-stone-200">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2.5 rounded-xl border border-stone-300 text-stone-600 text-sm font-semibold hover:bg-stone-50 transition"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-6 py-2.5 rounded-xl bg-[#442013] text-[#F4E7D3] text-sm font-bold hover:bg-[#6A3822] transition disabled:opacity-50"
                >
                  {submitting ? 'Menyimpan...' : editingId ? 'Simpan Perubahan' : 'Terbitkan Acara'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
