'use client';

import React, { useEffect, useState, useCallback } from 'react';
import {
  FileText,
  Plus,
  Edit,
  Trash2,
  ExternalLink,
  Flame,
  Eye,
  Clock,
  X,
  CheckCircle2,
  AlertCircle,
  Tag,
  ArrowLeft,
  Save,
  LayoutGrid,
  List,
  User,
  BookOpen,
  Sparkles,
  ImagePlus,
  Loader2,
} from 'lucide-react';
import FileUpload from '@/components/admin/FileUpload';

interface ArticleItem {
  id: number;
  title: string;
  slug: string;
  excerpt?: string;
  content: string;
  coverImageUrl?: string;
  category: string;
  authorName: string;
  importantLink?: string;
  status: 'draft' | 'published';
  isTop: number;
  viewsCount: number;
  createdAt: string;
  publishedAt?: string;
}

const CATEGORIES = [
  'Berita Kampus',
  'Liputan Khusus',
  'Opini',
  'Rilis Pers',
  'Sastra & Literasi',
  'Investigasi',
];

export default function AdminArticlesPage() {
  const [articles, setArticles] = useState<ArticleItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [viewMode, setViewMode] = useState<'grid' | 'table'>('grid');

  // Form states
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState(CATEGORIES[0]);
  const [authorName, setAuthorName] = useState('');
  const [coverImageUrl, setCoverImageUrl] = useState('');
  const [excerpt, setExcerpt] = useState('');
  const [content, setContent] = useState('');
  const [importantLink, setImportantLink] = useState('');
  const [status, setStatus] = useState<'draft' | 'published'>('published');
  const [isTop, setIsTop] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [uploadingBodyImage, setUploadingBodyImage] = useState(false);
  const contentTextareaRef = React.useRef<HTMLTextAreaElement>(null);

  const handleUploadBodyImage = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingBodyImage(true);
    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('folder', 'articles');

      const res = await fetch('/api/admin/upload', {
        method: 'POST',
        body: formData,
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.message || 'Gagal mengunggah foto');
      }

      // Sisipkan tag gambar ke textarea posisi kursor
      const imgTag = `\n\n![Dokumentasi Liputan](${data.url})\n\n`;
      const textarea = contentTextareaRef.current;
      if (textarea) {
        const start = textarea.selectionStart;
        const end = textarea.selectionEnd;
        const newContent = content.substring(0, start) + imgTag + content.substring(end);
        setContent(newContent);
        setTimeout(() => {
          textarea.focus();
          textarea.setSelectionRange(start + imgTag.length, start + imgTag.length);
        }, 50);
      } else {
        setContent((prev) => prev + imgTag);
      }
    } catch (err: any) {
      alert(err.message || 'Gagal mengunggah gambar');
    } finally {
      setUploadingBodyImage(false);
      e.target.value = '';
    }
  };

  // Esc key to close modal
  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    if (e.key === 'Escape' && showModal) {
      if (confirm('Tutup form editor artikel? Perubahan yang belum disimpan akan hilang.')) {
        setShowModal(false);
      }
    }
  }, [showModal]);

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);

  const fetchArticles = async () => {
    try {
      const res = await fetch('/api/admin/articles');
      const data = await res.json();
      if (data.articles) {
        setArticles(data.articles);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchArticles();
  }, []);

  const resetForm = () => {
    setTitle('');
    setCategory(CATEGORIES[0]);
    setAuthorName('');
    setCoverImageUrl('');
    setExcerpt('');
    setContent('');
    setImportantLink('');
    setStatus('published');
    setIsTop(false);
    setEditingId(null);
  };

  const handleOpenAdd = () => {
    resetForm();
    setShowModal(true);
  };

  const handleOpenEdit = (art: ArticleItem) => {
    setEditingId(art.id);
    setTitle(art.title);
    setCategory(art.category);
    setAuthorName(art.authorName);
    setCoverImageUrl(art.coverImageUrl || '');
    setExcerpt(art.excerpt || '');
    setContent(art.content);
    setImportantLink(art.importantLink || '');
    setStatus(art.status);
    setIsTop(art.isTop === 1);
    setShowModal(true);
  };

  const handleSubmit = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!title.trim()) {
      setMessage({ type: 'error', text: 'Judul artikel wajib diisi' });
      return;
    }
    if (!content.trim()) {
      setMessage({ type: 'error', text: 'Isi artikel wajib diisi' });
      return;
    }

    setSubmitting(true);
    setMessage(null);

    const payload = {
      title,
      category,
      authorName: authorName.trim() || 'Redaksi Cakrawala',
      coverImageUrl,
      excerpt,
      content,
      importantLink,
      status,
      isTop,
    };

    try {
      let res;
      if (editingId) {
        res = await fetch(`/api/admin/articles/${editingId}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });
      } else {
        res = await fetch('/api/admin/articles', {
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
        fetchArticles();
      } else {
        setMessage({ type: 'error', text: data.error || 'Gagal menyimpan artikel' });
      }
    } catch (err: any) {
      setMessage({ type: 'error', text: err.message || 'Terjadi kesalahan sistem' });
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Apakah Anda yakin ingin menghapus artikel ini? Tindakan tidak dapat dibatalkan.')) return;

    try {
      const res = await fetch(`/api/admin/articles/${id}`, {
        method: 'DELETE',
      });
      const data = await res.json();
      if (res.ok) {
        setMessage({ type: 'success', text: data.message });
        fetchArticles();
      } else {
        setMessage({ type: 'error', text: data.error || 'Gagal menghapus artikel' });
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
          <h1 className="text-2xl font-serif font-bold text-[#442013]">Kelola Artikel & Publikasi</h1>
          <p className="text-sm text-stone-500 mt-1">
            Tulis rilis pers, berita investigasi kampus, opini mahasiswa, dan pilih TOP Artikel utama.
          </p>
        </div>
        <div className="flex items-center gap-3">
          {/* View Mode Toggle */}
          <div className="flex items-center bg-stone-100 p-1 rounded-xl border border-stone-200">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-1.5 rounded-lg text-xs font-semibold transition flex items-center gap-1.5 ${
                viewMode === 'grid'
                  ? 'bg-white text-[#442013] shadow-sm'
                  : 'text-stone-500 hover:text-stone-700'
              }`}
              title="Tampilan Grid Card"
            >
              <LayoutGrid className="w-4 h-4" />
              <span className="hidden sm:inline">Grid Card</span>
            </button>
            <button
              onClick={() => setViewMode('table')}
              className={`p-1.5 rounded-lg text-xs font-semibold transition flex items-center gap-1.5 ${
                viewMode === 'table'
                  ? 'bg-white text-[#442013] shadow-sm'
                  : 'text-stone-500 hover:text-stone-700'
              }`}
              title="Tampilan Tabel"
            >
              <List className="w-4 h-4" />
              <span className="hidden sm:inline">Tabel</span>
            </button>
          </div>

          <button
            onClick={handleOpenAdd}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#442013] text-[#F4E7D3] font-semibold text-sm hover:bg-[#6A3822] transition shadow-sm active:scale-95"
          >
            <Plus className="w-4 h-4" />
            <span>Tulis Artikel Baru</span>
          </button>
        </div>
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

      {/* Content Rendering: Grid vs Table */}
      {loading ? (
        <div className="bg-white rounded-2xl p-12 text-center text-stone-400 text-sm border border-[#E5D5C2]/40">
          Memuat daftar artikel...
        </div>
      ) : articles.length === 0 ? (
        <div className="bg-white rounded-2xl p-12 text-center text-stone-400 text-sm border border-[#E5D5C2]/40">
          Belum ada artikel yang ditambahkan. Klik tombol &quot;Tulis Artikel Baru&quot; di atas untuk membuka editor.
        </div>
      ) : viewMode === 'grid' ? (
        /* GRID CARD VIEW */
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {articles.map((art) => (
            <div
              key={art.id}
              className={`bg-white rounded-2xl overflow-hidden border shadow-sm transition hover:shadow-md flex flex-col ${
                art.isTop === 1 ? 'border-amber-400 ring-2 ring-amber-400/20' : 'border-[#E5D5C2]/50'
              }`}
            >
              {/* Cover Image & Badges */}
              <div className="relative aspect-video w-full bg-stone-100 overflow-hidden group">
                {art.coverImageUrl ? (
                  <img
                    src={art.coverImageUrl}
                    alt={art.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                  />
                ) : (
                  <div className="w-full h-full flex flex-col items-center justify-center text-stone-400 text-xs">
                    <BookOpen className="w-8 h-8 mb-1 stroke-1" />
                    <span>Tidak ada cover</span>
                  </div>
                )}
                {/* Overlay Badges */}
                <div className="absolute top-3 left-3 flex flex-wrap gap-1.5">
                  <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-[#442013]/90 text-[#F4E7D3] backdrop-blur-sm shadow">
                    {art.category}
                  </span>
                  {art.isTop === 1 && (
                    <span className="flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-500 text-white shadow">
                      <Flame className="w-3 h-3 fill-white" />
                      TOP
                    </span>
                  )}
                </div>
                <div className="absolute top-3 right-3">
                  <span
                    className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase backdrop-blur-md shadow ${
                      art.status === 'published'
                        ? 'bg-emerald-600/90 text-white'
                        : 'bg-stone-800/80 text-stone-200'
                    }`}
                  >
                    {art.status === 'published' ? 'Terbit' : 'Draf'}
                  </span>
                </div>
              </div>

              {/* Card Body */}
              <div className="p-5 flex-1 flex flex-col justify-between space-y-3">
                <div>
                  <div className="flex items-center gap-2 text-xs text-stone-400 mb-1.5">
                    <Clock className="w-3.5 h-3.5" />
                    <span>{new Date(art.createdAt).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
                    <span>•</span>
                    <span className="truncate max-w-[120px]">{art.authorName}</span>
                  </div>
                  <h3 className="font-serif font-bold text-base text-[#442013] line-clamp-2 leading-snug hover:text-[#6A3822] transition">
                    {art.title}
                  </h3>
                  {art.excerpt && (
                    <p className="text-xs text-stone-500 line-clamp-2 mt-2 leading-relaxed">
                      {art.excerpt}
                    </p>
                  )}
                </div>

                {/* Footer Metrics & Actions */}
                <div className="pt-3 border-t border-stone-100 flex items-center justify-between">
                  <div className="flex items-center gap-3 text-xs text-stone-400">
                    <span className="flex items-center gap-1">
                      <Eye className="w-3.5 h-3.5" />
                      {art.viewsCount}
                    </span>
                    {art.importantLink && (
                      <a
                        href={art.importantLink}
                        target="_blank"
                        rel="noreferrer"
                        className="text-[#6A3822] hover:underline flex items-center gap-0.5"
                        title="Link Eksternal"
                      >
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    )}
                  </div>
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => handleOpenEdit(art)}
                      className="px-3 py-1.5 rounded-lg text-xs font-semibold text-[#442013] bg-[#FAF6F0] hover:bg-[#E5D5C2]/40 border border-[#E5D5C2]/60 transition flex items-center gap-1.5"
                      title="Edit Artikel di Fullscreen Editor"
                    >
                      <Edit className="w-3.5 h-3.5" />
                      <span>Edit Fullscreen</span>
                    </button>
                    <button
                      onClick={() => handleDelete(art.id)}
                      className="p-1.5 rounded-lg text-stone-400 hover:text-rose-600 hover:bg-rose-50 transition"
                      title="Hapus Artikel"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        /* TABLE VIEW */
        <div className="bg-white rounded-2xl shadow-sm border border-[#E5D5C2]/40 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-stone-600">
              <thead className="bg-[#FAF6F0] text-[#442013] font-serif text-xs uppercase tracking-wider border-b border-[#E5D5C2]/40">
                <tr>
                  <th className="px-6 py-4">Cover</th>
                  <th className="px-6 py-4">Judul & Kategori</th>
                  <th className="px-6 py-4">Penulis & Tanggal</th>
                  <th className="px-6 py-4">Status & TOP</th>
                  <th className="px-6 py-4">Views</th>
                  <th className="px-6 py-4 text-right">Tindakan</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E5D5C2]/20">
                {articles.map((art) => (
                  <tr key={art.id} className="hover:bg-stone-50/60 transition-colors">
                    <td className="px-6 py-4">
                      {art.coverImageUrl ? (
                        <img
                          src={art.coverImageUrl}
                          alt={art.title}
                          className="w-16 h-12 object-cover rounded-lg border border-stone-200"
                        />
                      ) : (
                        <div className="w-16 h-12 rounded-lg bg-stone-100 flex items-center justify-center text-stone-400 text-[10px]">
                          No Cover
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <div className="font-semibold text-[#442013] line-clamp-1 max-w-sm">{art.title}</div>
                      <span className="inline-block px-2 py-0.5 rounded text-[10px] font-bold bg-[#FAF6F0] text-[#6A3822] border border-[#E5D5C2]/60 mt-1">
                        {art.category}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-xs font-medium text-stone-700">{art.authorName}</div>
                      <div className="text-[11px] text-stone-400 mt-0.5">
                        {new Date(art.createdAt).toLocaleDateString('id-ID', {
                          day: 'numeric',
                          month: 'short',
                          year: 'numeric',
                        })}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-2">
                        <span
                          className={`px-2.5 py-0.5 rounded-full text-xs font-semibold ${
                            art.status === 'published'
                              ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                              : 'bg-stone-100 text-stone-600 border border-stone-200'
                          }`}
                        >
                          {art.status === 'published' ? 'Terbit' : 'Draf'}
                        </span>
                        {art.isTop === 1 && (
                          <span className="flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-50 text-amber-700 border border-amber-200">
                            <Flame className="w-2.5 h-2.5 fill-amber-500 text-amber-500" />
                            TOP
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-xs text-stone-500">
                      <div className="flex items-center gap-1">
                        <Eye className="w-3.5 h-3.5 text-stone-400" />
                        <span>{art.viewsCount}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-right whitespace-nowrap">
                      <div className="inline-flex items-center gap-2">
                        <button
                          onClick={() => handleOpenEdit(art)}
                          className="p-1.5 text-stone-500 hover:text-[#6A3822] hover:bg-stone-100 rounded-lg transition"
                          title="Edit Artikel"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(art.id)}
                          className="p-1.5 text-stone-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition"
                          title="Hapus Artikel"
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
        </div>
      )}

      {/* FULL-SCREEN MODAL EDITOR */}
      {showModal && (
        <div className="fixed inset-0 z-50 bg-[#FAF6F0] flex flex-col overflow-hidden animate-in fade-in duration-150">
          {/* Top Bar Navigation */}
          <header className="bg-white border-b border-[#E5D5C2]/60 px-6 py-3.5 flex items-center justify-between flex-shrink-0 shadow-sm">
            <div className="flex items-center gap-4">
              <button
                type="button"
                onClick={() => {
                  if (confirm('Tutup form editor artikel? Perubahan yang belum disimpan akan hilang.')) {
                    setShowModal(false);
                  }
                }}
                className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl border border-stone-200 text-stone-600 text-xs font-semibold hover:bg-stone-100 hover:text-[#442013] transition"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Kembali</span>
              </button>
              <div className="h-5 w-px bg-stone-200" />
              <div className="flex items-center gap-2">
                <FileText className="w-5 h-5 text-[#6A3822]" />
                <h2 className="font-serif font-bold text-base text-[#442013]">
                  {editingId ? 'Edit Artikel Redaksi (Full Screen)' : 'Editor Artikel Baru (Full Screen)'}
                </h2>
                <span className="text-[11px] px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 font-semibold hidden md:inline">
                  Mode Layar Penuh
                </span>
              </div>
            </div>

            {/* Quick Actions at Top Bar */}
            <div className="flex items-center gap-3">
              <div className="text-xs text-stone-400 hidden lg:inline">
                Tekan <kbd className="px-1.5 py-0.5 bg-stone-100 border rounded text-[10px] font-mono">ESC</kbd> untuk tutup
              </div>
              <button
                type="button"
                onClick={() => setShowModal(false)}
                className="px-4 py-2 rounded-xl border border-stone-300 text-stone-600 text-xs font-bold hover:bg-stone-50 transition"
              >
                Batal
              </button>
              <button
                type="button"
                disabled={submitting}
                onClick={() => handleSubmit()}
                className="inline-flex items-center gap-2 px-5 py-2 rounded-xl bg-[#442013] text-[#F4E7D3] text-xs font-bold uppercase tracking-wider hover:bg-[#6A3822] transition shadow-md disabled:opacity-50"
              >
                <Save className="w-4 h-4" />
                <span>{submitting ? 'Menyimpan...' : editingId ? 'Simpan Perubahan' : 'Terbitkan Artikel'}</span>
              </button>
            </div>
          </header>

          {/* Full Screen Editor Canvas (2 Kolom: Kiri Konten Utama, Kanan Pengaturan & Meta) */}
          <div className="flex-1 overflow-y-auto">
            <div className="max-w-7xl mx-auto p-6 md:p-8">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Kolom Kiri: Penulisan Konten Jurnalistik (Lebar 2/3) */}
                <div className="lg:col-span-2 space-y-6">
                  {/* Judul Artikel Besar */}
                  <div className="bg-white rounded-2xl p-6 md:p-8 border border-[#E5D5C2]/40 shadow-sm space-y-4">
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-[#442013] mb-2">
                        Judul Utama Artikel *
                      </label>
                      <input
                        type="text"
                        required
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        placeholder="Ketikkan judul artikel jurnalistik yang menarik & berbobot..."
                        className="w-full font-serif font-bold text-xl md:text-2xl text-[#442013] px-4 py-3 rounded-xl border border-stone-300 focus:outline-none focus:border-[#6A3822] focus:ring-2 focus:ring-[#6A3822]/20 transition placeholder:font-sans placeholder:text-base placeholder:font-normal"
                      />
                    </div>

                    {/* Ringkasan Singkat / Lead Paragraph */}
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-[#442013] mb-2">
                        Lead / Ringkasan Pembuka (Excerpt)
                      </label>
                      <textarea
                        rows={3}
                        value={excerpt}
                        onChange={(e) => setExcerpt(e.target.value)}
                        placeholder="Tuliskan 1-2 kalimat pengantar atau paragraf pembuka artikel untuk menarik pembaca..."
                        className="w-full text-sm text-stone-700 px-4 py-3 rounded-xl border border-stone-300 focus:outline-none focus:border-[#6A3822] focus:ring-2 focus:ring-[#6A3822]/20 transition"
                      />
                      <p className="text-[11px] text-stone-400 mt-1">
                        Ringkasan ini akan ditampilkan di kartu preview beranda dan meta preview media sosial.
                      </p>
                    </div>
                  </div>

                  {/* Body Artikel Lengkap (WordPress Style Canvas) */}
                  <div className="bg-white rounded-2xl p-6 md:p-8 border border-[#E5D5C2]/40 shadow-sm space-y-3">
                    <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-stone-100">
                      <div>
                        <label className="block text-xs font-bold uppercase tracking-wider text-[#442013]">
                          Isi Naskah Artikel (Body Content) *
                        </label>
                        <p className="text-xs text-stone-400">
                          Format mendukung penulisan teks, paragraf, dan penyisipan foto liputan di dalam naskah.
                        </p>
                      </div>

                      <div className="flex items-center gap-3">
                        <label className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-[#6A3822]/40 bg-[#FAF6F0] hover:bg-[#E5D5C2]/40 text-[#442013] text-xs font-bold cursor-pointer transition shadow-xs active:scale-95">
                          {uploadingBodyImage ? (
                            <>
                              <Loader2 className="w-3.5 h-3.5 animate-spin text-[#6A3822]" />
                              <span>Mengunggah...</span>
                            </>
                          ) : (
                            <>
                              <ImagePlus className="w-3.5 h-3.5 text-[#6A3822]" />
                              <span>+ Sisipkan Gambar ke Naskah</span>
                            </>
                          )}
                          <input
                            type="file"
                            accept="image/*"
                            disabled={uploadingBodyImage}
                            onChange={handleUploadBodyImage}
                            className="hidden"
                          />
                        </label>

                        <div className="text-xs font-mono text-stone-400">
                          {content.length} karakter
                        </div>
                      </div>
                    </div>

                    <textarea
                      ref={contentTextareaRef}
                      required
                      rows={18}
                      value={content}
                      onChange={(e) => setContent(e.target.value)}
                      placeholder="Mulai menuliskan naskah berita, opini, atau liputan investigasi di sini...&#10;&#10;Gunakan tombol '+ Sisipkan Gambar ke Naskah' di atas untuk menyisipkan foto liputan ke dalam naskah.&#10;&#10;Gunakan paragraf baru untuk memisahkan ide pokok naskah."
                      className="w-full text-sm text-stone-800 leading-relaxed font-sans px-4 py-4 rounded-xl border border-stone-300 focus:outline-none focus:border-[#6A3822] focus:ring-2 focus:ring-[#6A3822]/20 transition font-normal"
                    />

                    <p className="text-[11px] text-stone-400">
                      💡 <strong>Tips:</strong> Anda dapat meletakkan kursor di bagian paragraf tertentu lalu klik <strong>&quot;+ Sisipkan Gambar ke Naskah&quot;</strong>. Gambar akan langsung disisipkan di posisi tersebut dan otomatis tampil di halaman baca artikel.
                    </p>
                  </div>
                </div>

                {/* Kolom Kanan: Pengaturan Penerbitan, Gambar Cover, & Meta (Lebar 1/3) */}
                <div className="space-y-6">
                  {/* Status & Publikasi Card */}
                  <div className="bg-white rounded-2xl p-6 border border-[#E5D5C2]/40 shadow-sm space-y-4">
                    <h3 className="font-serif font-bold text-sm text-[#442013] uppercase tracking-wider pb-3 border-b border-stone-100">
                      Pengaturan Publikasi
                    </h3>

                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-[#442013] mb-1.5">
                        Status Artikel
                      </label>
                      <select
                        value={status}
                        onChange={(e: any) => setStatus(e.target.value)}
                        className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 text-sm focus:outline-none focus:border-[#6A3822] bg-white font-medium"
                      >
                        <option value="published">Terbitkan Langsung (Publik)</option>
                        <option value="draft">Simpan Sebagai Draf (Redaksi)</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-[#442013] mb-1.5">
                        Kategori Artikel *
                      </label>
                      <select
                        value={category}
                        onChange={(e) => setCategory(e.target.value)}
                        className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 text-sm focus:outline-none focus:border-[#6A3822] bg-white font-medium"
                      >
                        {CATEGORIES.map((cat) => (
                          <option key={cat} value={cat}>
                            {cat}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-[#442013] mb-1.5">
                        Nama Penulis / Redaksi *
                      </label>
                      <div className="relative">
                        <input
                          type="text"
                          value={authorName}
                          onChange={(e) => setAuthorName(e.target.value)}
                          placeholder="Redaksi Cakrawala / Nama Jurnalis"
                          className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-stone-300 text-sm focus:outline-none focus:border-[#6A3822] focus:ring-2 focus:ring-[#6A3822]/20"
                        />
                        <User className="w-4 h-4 text-stone-400 absolute left-3 top-3" />
                      </div>
                    </div>

                    {/* Checkbox TOP Artikel */}
                    <div className="p-3.5 rounded-xl bg-amber-50/70 border border-amber-200/80">
                      <label className="flex items-start gap-3 cursor-pointer select-none">
                        <input
                          type="checkbox"
                          checked={isTop}
                          onChange={(e) => setIsTop(e.target.checked)}
                          className="mt-0.5 w-4 h-4 text-amber-600 rounded border-stone-300 focus:ring-amber-500"
                        />
                        <div>
                          <span className="text-xs font-bold text-amber-900 flex items-center gap-1">
                            <Flame className="w-3.5 h-3.5 fill-amber-600 text-amber-600" />
                            Jadikan TOP Artikel Utama
                          </span>
                          <p className="text-[11px] text-amber-800/80 mt-0.5 leading-relaxed">
                            Artikel akan dijadikan titik pusat (headline utama) di halaman publikasi Cakrawala.
                          </p>
                        </div>
                      </label>
                    </div>
                  </div>

                  {/* Upload Foto Cover Card */}
                  <div className="bg-white rounded-2xl p-6 border border-[#E5D5C2]/40 shadow-sm space-y-4">
                    <h3 className="font-serif font-bold text-sm text-[#442013] uppercase tracking-wider pb-3 border-b border-stone-100">
                      Foto Sampul (Cover Image)
                    </h3>
                    <FileUpload
                      label="Unggah Berkas Gambar Cover"
                      value={coverImageUrl}
                      onChange={setCoverImageUrl}
                      helperText="Rasio ideal 16:9 (disarankan 1200×675px, max 5MB). Format JPG, PNG, atau WebP."
                    />
                  </div>

                  {/* Tautan Penting Eksternal */}
                  <div className="bg-white rounded-2xl p-6 border border-[#E5D5C2]/40 shadow-sm space-y-4">
                    <h3 className="font-serif font-bold text-sm text-[#442013] uppercase tracking-wider pb-3 border-b border-stone-100">
                      Tautan Pendukung
                    </h3>
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-[#442013] mb-1.5">
                        Link Penting (Dokumen PDF / Google Drive / Sumber)
                      </label>
                      <input
                        type="url"
                        value={importantLink}
                        onChange={(e) => setImportantLink(e.target.value)}
                        placeholder="https://drive.google.com/..."
                        className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 text-sm focus:outline-none focus:border-[#6A3822]"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
