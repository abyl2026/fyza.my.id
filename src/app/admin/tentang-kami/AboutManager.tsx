'use client';

import React, { FormEvent, useEffect, useState } from 'react';
import {
  AlertCircle,
  CheckCircle2,
  Clock3,
  ImagePlus,
  Pencil,
  Plus,
  Save,
  Trash2,
  UserRound,
  UsersRound,
  X,
} from 'lucide-react';

type Message = { type: 'success' | 'error'; text: string };
type Resource = 'division' | 'member' | 'program' | 'timeline';
type Data = Record<string, string | number>;
type Editor = { resource: Resource; id?: number; data: Data };
interface Member { id: number; name: string; position: string; photoUrl?: string | null; sortOrder: number }
interface Program { id: number; name: string; description: string; targetOutput?: string | null }
interface Division { id: number; name: string; description?: string | null; sortOrder: number; members: Member[]; programs: Program[] }
interface TimelineItem { id: number; year: string; title: string; description: string; sortOrder: number }

const inputClass = 'w-full rounded-xl border border-stone-300 px-3.5 py-2.5 text-sm text-stone-800 outline-none focus:border-[#6A3822] focus:ring-2 focus:ring-[#6A3822]/15 bg-white';
const labelClass = 'mb-1.5 block text-xs font-bold uppercase tracking-wider text-[#442013]';
const buttonClass = 'inline-flex items-center gap-1.5 rounded-xl border border-stone-300 px-3 py-1.5 text-xs font-semibold text-stone-700 hover:bg-stone-50';

export default function AboutManager() {
  const [loading, setLoading] = useState(true);
  const [savingProfile, setSavingProfile] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [savingEditor, setSavingEditor] = useState(false);
  const [message, setMessage] = useState<Message | null>(null);
  const [editor, setEditor] = useState<Editor | null>(null);

  const [vision, setVision] = useState('');
  const [mission, setMission] = useState('');
  const [motto, setMotto] = useState('');
  const [leaderName, setLeaderName] = useState('');
  const [leaderPosition, setLeaderPosition] = useState('Ketua Umum');
  const [leaderPeriod, setLeaderPeriod] = useState('');
  const [leaderQuote, setLeaderQuote] = useState('');
  const [leaderPhoto, setLeaderPhoto] = useState('');
  const [leaderInstagram, setLeaderInstagram] = useState('');
  const [leaderLinkedin, setLeaderLinkedin] = useState('');
  const [divisions, setDivisions] = useState<Division[]>([]);
  const [timeline, setTimeline] = useState<TimelineItem[]>([]);

  const loadData = async () => {
    try {
      const res = await fetch('/api/admin/about');
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Gagal memuat data');
      const p = data.profile || {};
      setVision(p.vision || '');
      setMission(p.mission || '');
      setMotto(p.motto || '');
      setLeaderName(p.leaderName || '');
      setLeaderPosition(p.leaderPosition || 'Ketua Umum');
      setLeaderPeriod(p.leaderPeriod || '');
      setLeaderQuote(p.leaderQuote || '');
      setLeaderPhoto(p.leaderPhotoUrl || '');
      setLeaderInstagram(p.leaderInstagram || '');
      setLeaderLinkedin(p.leaderLinkedin || '');
      setDivisions(data.divisions || []);
      setTimeline(data.timeline || []);
    } catch (e: any) {
      setMessage({ type: 'error', text: e.message });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleFileUpload = async (file: File, onDone: (url: string) => void) => {
    setUploading(true);
    try {
      const body = new FormData();
      body.append('file', file);
      body.append('folder', 'about');
      const res = await fetch('/api/admin/uploads', { method: 'POST', body });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Gagal upload file');
      onDone(data.url);
      setMessage({ type: 'success', text: 'Foto berhasil diunggah' });
    } catch (e: any) {
      setMessage({ type: 'error', text: e.message });
    } finally {
      setUploading(false);
    }
  };

  const handleSaveProfile = async (e: FormEvent) => {
    e.preventDefault();
    setSavingProfile(true);
    setMessage(null);
    try {
      const res = await fetch('/api/admin/about', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'profile',
          vision,
          mission,
          motto,
          leaderName,
          leaderPosition,
          leaderPeriod,
          leaderQuote,
          leaderPhotoUrl: leaderPhoto,
          leaderInstagram,
          leaderLinkedin,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Gagal menyimpan profil');
      setMessage({ type: 'success', text: 'Profil organisasi berhasil diperbarui' });
    } catch (e: any) {
      setMessage({ type: 'error', text: e.message });
    } finally {
      setSavingProfile(false);
    }
  };

  const handleSaveEditor = async (e: FormEvent) => {
    e.preventDefault();
    if (!editor) return;
    setSavingEditor(true);
    try {
      const isEdit = Boolean(editor.id);
      const res = await fetch('/api/admin/about', {
        method: isEdit ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: editor.resource,
          id: editor.id,
          ...editor.data,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Gagal menyimpan data');
      setMessage({ type: 'success', text: 'Perubahan berhasil disimpan' });
      setEditor(null);
      loadData();
    } catch (e: any) {
      setMessage({ type: 'error', text: e.message });
    } finally {
      setSavingEditor(false);
    }
  };

  const handleDelete = async (resource: Resource, id: number) => {
    if (!confirm('Yakin ingin menghapus item ini? Tindakan tidak dapat dibatalkan.')) return;
    try {
      const res = await fetch(`/api/admin/about?action=${resource}&id=${id}`, { method: 'DELETE' });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Gagal menghapus');
      setMessage({ type: 'success', text: 'Item berhasil dihapus' });
      loadData();
    } catch (e: any) {
      setMessage({ type: 'error', text: e.message });
    }
  };

  if (loading) return <div className="py-12 text-center text-stone-500 font-medium">Memuat data Tentang Kami...</div>;

  return (
    <div className="space-y-8">
      {message && (
        <div className={`p-4 rounded-xl flex items-center gap-3 text-sm font-medium ${message.type === 'success' ? 'bg-emerald-50 text-emerald-800 border border-emerald-200' : 'bg-rose-50 text-rose-800 border border-rose-200'}`}>
          {message.type === 'success' ? <CheckCircle2 className="w-5 h-5 flex-shrink-0" /> : <AlertCircle className="w-5 h-5 flex-shrink-0" />}
          <span>{message.text}</span>
          <button onClick={() => setMessage(null)} className="ml-auto text-xs underline">Tutup</button>
        </div>
      )}

      {/* Profil Pokok & Ketua Umum */}
      <form onSubmit={handleSaveProfile} className="bg-white rounded-2xl p-6 sm:p-8 border border-[#E5D5C2]/40 shadow-sm space-y-6">
        <div>
          <h2 className="text-xl font-serif font-bold text-[#442013]">Visi, Misi, Motto & Profil Ketua Umum</h2>
          <p className="text-xs text-stone-500">Kelola identitas utama organisasi yang ditampilkan di halaman Tentang Kami.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <label className={labelClass}>Motto Organisasi</label>
            <input value={motto} onChange={(e) => setMotto(e.target.value)} className={inputClass} placeholder="Contoh: Suara Cakrawala, Suara Mahasiswa!" />
          </div>
          <div className="md:col-span-2">
            <label className={labelClass}>Visi</label>
            <textarea value={vision} onChange={(e) => setVision(e.target.value)} rows={2} className={inputClass} placeholder="Visi organisasi..." />
          </div>
        </div>

        <div>
          <label className={labelClass}>Misi (pisahkan dengan baris baru per poin)</label>
          <textarea value={mission} onChange={(e) => setMission(e.target.value)} rows={4} className={inputClass} placeholder="1. Poin misi pertama&#10;2. Poin misi kedua..." />
        </div>

        <div className="pt-6 border-t border-stone-200">
          <h3 className="text-sm font-bold uppercase tracking-wider text-[#442013] mb-4">Profil & Foto Ketua Umum</h3>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="space-y-3">
              <div className="w-full aspect-[4/5] rounded-xl bg-stone-100 border border-stone-200 overflow-hidden flex items-center justify-center relative group">
                {leaderPhoto ? (
                  <img src={leaderPhoto} alt="Ketua Umum" className="w-full h-full object-cover" />
                ) : (
                  <UserRound className="w-12 h-12 text-stone-300" />
                )}
                <label className="absolute inset-0 bg-black/40 text-white flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition cursor-pointer">
                  <ImagePlus className="w-6 h-6 mb-1" />
                  <span className="text-[11px] font-semibold">Ganti Foto</span>
                  <input type="file" accept="image/*" className="hidden" onChange={(e) => e.target.files?.[0] && handleFileUpload(e.target.files[0], setLeaderPhoto)} />
                </label>
              </div>
              <p className="text-[11px] text-stone-500 text-center leading-relaxed">
                Rasio foto <span className="font-semibold text-stone-700">4:5</span> (disarankan 800×1000px, format JPG/PNG/WebP, max 5MB).
              </p>
              {leaderPhoto && (
                <button
                  type="button"
                  onClick={() => setLeaderPhoto('')}
                  className="w-full py-1 text-xs text-rose-600 hover:text-rose-700 hover:underline flex items-center justify-center gap-1"
                >
                  <Trash2 className="w-3.5 h-3.5" /> Hapus Foto Ketua
                </button>
              )}
            </div>

            <div className="md:col-span-3 space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className={labelClass}>Nama Ketua</label>
                  <input value={leaderName} onChange={(e) => setLeaderName(e.target.value)} className={inputClass} placeholder="Nama Lengkap" />
                </div>
                <div>
                  <label className={labelClass}>Jabatan</label>
                  <input value={leaderPosition} onChange={(e) => setLeaderPosition(e.target.value)} className={inputClass} placeholder="Ketua Umum" />
                </div>
                <div>
                  <label className={labelClass}>Periode</label>
                  <input value={leaderPeriod} onChange={(e) => setLeaderPeriod(e.target.value)} className={inputClass} placeholder="2025/2026" />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className={labelClass}>Link Instagram</label>
                  <input value={leaderInstagram} onChange={(e) => setLeaderInstagram(e.target.value)} className={inputClass} placeholder="https://instagram.com/..." />
                </div>
                <div>
                  <label className={labelClass}>Link LinkedIn</label>
                  <input value={leaderLinkedin} onChange={(e) => setLeaderLinkedin(e.target.value)} className={inputClass} placeholder="https://linkedin.com/in/..." />
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="flex justify-end pt-4 border-t border-stone-200">
          <button type="submit" disabled={savingProfile || uploading} className="inline-flex items-center gap-2 rounded-xl bg-[#442013] text-[#F4E7D3] px-5 py-2.5 text-xs font-bold uppercase tracking-wider hover:bg-[#6A3822] transition disabled:opacity-50">
            <Save className="w-4 h-4" />
            {savingProfile ? 'Menyimpan...' : 'Simpan Profil Pokok'}
          </button>
        </div>
      </form>

      {/* Struktur Divisi & Program Kerja */}
      <div className="bg-white rounded-2xl p-6 sm:p-8 border border-[#E5D5C2]/40 shadow-sm space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-serif font-bold text-[#442013]">Struktur Divisi, Anggota & Program Kerja</h2>
            <p className="text-xs text-stone-500">Kelola divisi, susunan pengurus, dan program kerja masing-masing divisi.</p>
          </div>
          <button onClick={() => setEditor({ resource: 'division', data: { name: '', description: '', sortOrder: divisions.length + 1 } })} className={buttonClass}>
            <Plus className="w-4 h-4" /> Tambah Divisi
          </button>
        </div>

        <div className="space-y-6">
          {divisions.map((div) => (
            <div key={div.id} className="rounded-2xl border border-stone-200 p-5 bg-[#FAF6F0]/40 space-y-4">
              <div className="flex items-center justify-between border-b border-stone-200 pb-3">
                <div>
                  <h3 className="font-bold text-[#442013] text-base">{div.name}</h3>
                  <p className="text-xs text-stone-600">{div.description || 'Tanpa deskripsi'}</p>
                </div>
                <div className="flex items-center gap-2">
                  <button onClick={() => setEditor({ resource: 'division', id: div.id, data: { name: div.name, description: div.description || '', sortOrder: div.sortOrder } })} className="p-1.5 text-stone-600 hover:text-[#442013]">
                    <Pencil className="w-4 h-4" />
                  </button>
                  <button onClick={() => handleDelete('division', div.id)} className="p-1.5 text-rose-600 hover:text-rose-700">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Anggota Divisi */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-stone-600 uppercase tracking-wider">Anggota ({div.members.length})</span>
                  <button onClick={() => setEditor({ resource: 'member', data: { divisionId: div.id, name: '', position: '', photoUrl: '', sortOrder: div.members.length + 1 } })} className="text-xs text-[#6A3822] hover:underline font-semibold flex items-center gap-1">
                    <Plus className="w-3.5 h-3.5" /> Tambah Anggota
                  </button>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                  {div.members.map((m) => (
                    <div key={m.id} className="flex items-center gap-3 p-2.5 rounded-xl bg-white border border-stone-200 shadow-sm">
                      <div className="w-10 h-10 rounded-full bg-stone-100 overflow-hidden flex-shrink-0 flex items-center justify-center">
                        {m.photoUrl ? <img src={m.photoUrl} alt={m.name} className="w-full h-full object-cover" /> : <UserRound className="w-5 h-5 text-stone-400" />}
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="text-xs font-bold text-stone-800 truncate">{m.name}</div>
                        <div className="text-[11px] text-stone-500 truncate">{m.position}</div>
                      </div>
                      <div className="flex items-center gap-1">
                        <button onClick={() => setEditor({ resource: 'member', id: m.id, data: { divisionId: div.id, name: m.name, position: m.position, photoUrl: m.photoUrl || '', sortOrder: m.sortOrder } })} className="text-stone-400 hover:text-stone-700 p-1">
                          <Pencil className="w-3.5 h-3.5" />
                        </button>
                        <button onClick={() => handleDelete('member', m.id)} className="text-stone-400 hover:text-rose-600 p-1">
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Proker Divisi */}
              <div className="space-y-2 pt-2 border-t border-stone-200">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-stone-600 uppercase tracking-wider">Program Kerja ({div.programs.length})</span>
                  <button onClick={() => setEditor({ resource: 'program', data: { divisionId: div.id, name: '', description: '', targetOutput: '' } })} className="text-xs text-[#6A3822] hover:underline font-semibold flex items-center gap-1">
                    <Plus className="w-3.5 h-3.5" /> Tambah Proker
                  </button>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {div.programs.map((p) => (
                    <div key={p.id} className="p-3 rounded-xl bg-white border border-stone-200 text-xs space-y-1">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-stone-800">{p.name}</span>
                        <div className="flex items-center gap-1">
                          <button onClick={() => setEditor({ resource: 'program', id: p.id, data: { divisionId: div.id, name: p.name, description: p.description, targetOutput: p.targetOutput || '' } })} className="text-stone-400 hover:text-stone-700 p-1">
                            <Pencil className="w-3.5 h-3.5" />
                          </button>
                          <button onClick={() => handleDelete('program', p.id)} className="text-stone-400 hover:text-rose-600 p-1">
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                      <p className="text-stone-600">{p.description}</p>
                      {p.targetOutput && <div className="text-[11px] text-[#6A3822] font-semibold">Output: {p.targetOutput}</div>}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Timeline Perjalanan */}
      <div className="bg-white rounded-2xl p-6 sm:p-8 border border-[#E5D5C2]/40 shadow-sm space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-serif font-bold text-[#442013]">Timeline Perjalanan Organisasi</h2>
            <p className="text-xs text-stone-500">Kelola riwayat tonggak sejarah BAPEMA Cakrawala UMJ.</p>
          </div>
          <button onClick={() => setEditor({ resource: 'timeline', data: { year: '', title: '', description: '', sortOrder: timeline.length + 1 } })} className={buttonClass}>
            <Plus className="w-4 h-4" /> Tambah Milestone
          </button>
        </div>

        <div className="space-y-3">
          {timeline.map((item) => (
            <div key={item.id} className="p-4 rounded-xl border border-stone-200 bg-[#FAF6F0]/40 flex items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <span className="px-3 py-1 rounded-lg bg-[#442013] text-[#F4E7D3] font-bold text-xs">{item.year}</span>
                <div>
                  <h4 className="font-bold text-stone-800 text-sm">{item.title}</h4>
                  <p className="text-xs text-stone-600">{item.description}</p>
                </div>
              </div>
              <div className="flex items-center gap-1">
                <button onClick={() => setEditor({ resource: 'timeline', id: item.id, data: { year: item.year, title: item.title, description: item.description, sortOrder: item.sortOrder } })} className="p-1.5 text-stone-600 hover:text-[#442013]">
                  <Pencil className="w-4 h-4" />
                </button>
                <button onClick={() => handleDelete('timeline', item.id)} className="p-1.5 text-rose-600 hover:text-rose-700">
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Modal Editor Form */}
      {editor && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-xl border border-stone-200 space-y-4">
            <div className="flex items-center justify-between border-b pb-3">
              <h3 className="font-bold text-[#442013] capitalize">{editor.id ? 'Edit' : 'Tambah'} {editor.resource}</h3>
              <button onClick={() => setEditor(null)} className="text-stone-400 hover:text-stone-600"><X className="w-5 h-5" /></button>
            </div>
            <form onSubmit={handleSaveEditor} className="space-y-4">
              {editor.resource === 'division' && (
                <>
                  <div>
                    <label className={labelClass}>Nama Divisi</label>
                    <input required value={editor.data.name || ''} onChange={(e) => setEditor({ ...editor, data: { ...editor.data, name: e.target.value } })} className={inputClass} placeholder="Contoh: Redaksi & Peliputan" />
                  </div>
                  <div>
                    <label className={labelClass}>Deskripsi Divisi</label>
                    <textarea value={editor.data.description || ''} onChange={(e) => setEditor({ ...editor, data: { ...editor.data, description: e.target.value } })} rows={3} className={inputClass} />
                  </div>
                </>
              )}

              {editor.resource === 'member' && (
                <>
                  <div>
                    <label className={labelClass}>Nama Anggota</label>
                    <input required value={editor.data.name || ''} onChange={(e) => setEditor({ ...editor, data: { ...editor.data, name: e.target.value } })} className={inputClass} />
                  </div>
                  <div>
                    <label className={labelClass}>Jabatan</label>
                    <input required value={editor.data.position || ''} onChange={(e) => setEditor({ ...editor, data: { ...editor.data, position: e.target.value } })} className={inputClass} placeholder="Kepala Divisi / Staf" />
                  </div>
                  <div>
                    <label className={labelClass}>Foto Anggota</label>
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-xl bg-stone-100 border border-stone-200 overflow-hidden flex items-center justify-center relative">
                        {editor.data.photoUrl ? (
                          <img
                            src={String(editor.data.photoUrl)}
                            alt="Preview"
                            onError={(e) => {
                              (e.target as HTMLImageElement).src = '/image/anggota.jpg';
                            }}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <UserRound className="w-6 h-6 text-stone-300" />
                        )}
                      </div>
                      <div className="flex-1 space-y-1">
                        <label className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-stone-300 text-xs font-semibold text-stone-700 hover:bg-stone-50 cursor-pointer">
                          <ImagePlus className="w-3.5 h-3.5" /> {uploading ? 'Mengunggah...' : 'Unggah File'}
                          <input
                            type="file"
                            accept="image/*"
                            disabled={uploading}
                            className="hidden"
                            onChange={(e) =>
                              e.target.files?.[0] &&
                              handleFileUpload(e.target.files[0], (url) =>
                                setEditor((prev: any) =>
                                  prev ? { ...prev, data: { ...prev.data, photoUrl: url } } : null
                                )
                              )
                            }
                          />
                        </label>
                        {editor.data.photoUrl && (
                          <button
                            type="button"
                            onClick={() =>
                              setEditor((prev: any) =>
                                prev ? { ...prev, data: { ...prev.data, photoUrl: '' } } : null
                              )
                            }
                            className="text-[11px] text-rose-600 hover:underline block"
                          >
                            Hapus Foto
                          </button>
                        )}
                      </div>
                    </div>
                    <p className="text-[11px] text-stone-500 mt-2 leading-relaxed">
                      Format pasfoto rasio <span className="font-semibold text-stone-700">1:1 (persegi)</span> atau <span className="font-semibold text-stone-700">4:5</span> (disarankan 600×600px atau 800×1000px, max 5MB).
                    </p>
                  </div>
                </>
              )}

              {editor.resource === 'program' && (
                <>
                  <div>
                    <label className={labelClass}>Nama Program</label>
                    <input required value={editor.data.name || ''} onChange={(e) => setEditor({ ...editor, data: { ...editor.data, name: e.target.value } })} className={inputClass} />
                  </div>
                  <div>
                    <label className={labelClass}>Deskripsi Program</label>
                    <textarea required value={editor.data.description || ''} onChange={(e) => setEditor({ ...editor, data: { ...editor.data, description: e.target.value } })} rows={3} className={inputClass} />
                  </div>
                  <div>
                    <label className={labelClass}>Target Output</label>
                    <input value={editor.data.targetOutput || ''} onChange={(e) => setEditor({ ...editor, data: { ...editor.data, targetOutput: e.target.value } })} className={inputClass} placeholder="Contoh: 12 Majalah Cetak & Digital" />
                  </div>
                </>
              )}

              {editor.resource === 'timeline' && (
                <>
                  <div>
                    <label className={labelClass}>Tahun</label>
                    <input required value={editor.data.year || ''} onChange={(e) => setEditor({ ...editor, data: { ...editor.data, year: e.target.value } })} className={inputClass} placeholder="Contoh: 2021" />
                  </div>
                  <div>
                    <label className={labelClass}>Judul Milestone</label>
                    <input required value={editor.data.title || ''} onChange={(e) => setEditor({ ...editor, data: { ...editor.data, title: e.target.value } })} className={inputClass} />
                  </div>
                  <div>
                    <label className={labelClass}>Deskripsi</label>
                    <textarea required value={editor.data.description || ''} onChange={(e) => setEditor({ ...editor, data: { ...editor.data, description: e.target.value } })} rows={3} className={inputClass} />
                  </div>
                </>
              )}

              <div className="flex justify-end gap-2 pt-2 border-t">
                <button type="button" onClick={() => setEditor(null)} className="px-4 py-2 rounded-xl text-xs font-semibold border border-stone-200 text-stone-600 hover:bg-stone-50">Batal</button>
                <button type="submit" disabled={savingEditor || uploading} className="px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider bg-[#442013] text-[#F4E7D3] hover:bg-[#6A3822] disabled:opacity-50">
                  {savingEditor ? 'Menyimpan...' : uploading ? 'Mengunggah Foto...' : editor.id ? 'Perbarui' : 'Simpan'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
