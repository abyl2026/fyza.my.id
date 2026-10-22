'use client';

import React, { useState } from 'react';
import {
  User,
  Mail,
  GraduationCap,
  Users,
  Send,
  Loader2,
  AlertCircle,
  Building,
  BookOpen,
  ChevronDown,
} from 'lucide-react';
import AspirasiSuccessModal from './AspirasiSuccessModal';

const FAKULTAS_OPTIONS = [
  'Fakultas Ekonomi dan Bisnis (FEB)',
  'Fakultas Ilmu Sosial dan Ilmu Politik (FISIP)',
  'Fakultas Hukum (FH)',
  'Fakultas Teknik (FT)',
  'Fakultas Agama Islam (FAI)',
  'Fakultas Kedokteran dan Kesehatan (FKK)',
  'Fakultas Ilmu Pendidikan (FIP)',
  'Fakultas Pertanian (FTAN)',
  'Lainnya di Lingkungan UMJ',
];

export default function AspirasiForm() {
  // Form States
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [senderType, setSenderType] = useState<'mahasiswa_umj' | 'umum'>('mahasiswa_umj');
  const [faculty, setFaculty] = useState('Fakultas Ekonomi dan Bisnis (FEB)');
  const [major, setMajor] = useState('');
  const [aspirationContent, setAspirationContent] = useState('');

  // UI States
  const [submitting, setSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    // Validasi dasar
    if (!fullName.trim()) {
      setErrorMessage('Mohon isi nama lengkap Anda.');
      return;
    }
    if (!email.trim()) {
      setErrorMessage('Mohon isi alamat email aktif Anda.');
      return;
    }
    if (!aspirationContent.trim()) {
      setErrorMessage('Isi aspirasi tidak boleh kosong.');
      return;
    }

    if (senderType === 'mahasiswa_umj' && !faculty.trim()) {
      setErrorMessage('Mohon pilih asal fakultas Anda.');
      return;
    }

    setSubmitting(true);

    try {
      const payload = {
        fullName: fullName.trim(),
        email: email.trim(),
        senderType,
        faculty: senderType === 'mahasiswa_umj' ? faculty.trim() : null,
        major: senderType === 'mahasiswa_umj' ? major.trim() : null,
        aspirationContent: aspirationContent.trim(),
      };

      const res = await fetch('/api/aspirasi', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || 'Gagal mengirim aspirasi.');
      }

      // Berhasil: Buka pop up sukses (akan otomatis hitung mundur kembali ke beranda)
      setIsSuccessModalOpen(true);

      // Reset form
      setFullName('');
      setEmail('');
      setMajor('');
      setAspirationContent('');
    } catch (err: any) {
      console.error('Submit error:', err);
      setErrorMessage(err.message || 'Terjadi gangguan jaringan. Silakan coba kembali.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      <section className="py-8 sm:py-12 lg:py-16 px-4 sm:px-10 lg:px-28 relative z-20">
        <div className="max-w-3xl mx-auto bg-white rounded-3xl p-5 sm:p-10 lg:p-12 shadow-xl border border-brand-sand">
          {/* Header Form */}
          <div className="mb-6 sm:mb-8 border-b border-brand-sand/70 pb-4 sm:pb-5">
            <h2 className="text-xl sm:text-2xl font-extrabold text-brand-dark tracking-tight">
              Formulir Penyampaian Aspirasi
            </h2>
            <p className="text-xs sm:text-sm text-neutral-500 mt-1 leading-relaxed">
              Silakan lengkapi formulir di bawah ini dengan data yang valid. Seluruh data aspirasi akan diteruskan ke meja redaksi.
            </p>
          </div>

          {/* Alert Error */}
          {errorMessage && (
            <div className="mb-5 sm:mb-6 p-3.5 sm:p-4 rounded-2xl bg-red-50 border border-red-200 text-red-800 text-xs sm:text-sm flex items-start gap-2.5 sm:gap-3 animate-in fade-in">
              <AlertCircle className="w-4 h-4 sm:w-5 sm:h-5 text-red-600 shrink-0 mt-0.5" />
              <span className="leading-relaxed">{errorMessage}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5 sm:space-y-6">
            {/* 1. Nama Lengkap */}
            <div>
              <label
                htmlFor="fullName"
                className="block text-[11px] sm:text-xs font-bold uppercase tracking-wider text-brand-dark mb-1.5 sm:mb-2"
              >
                Nama Lengkap <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <input
                  type="text"
                  id="fullName"
                  required
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="Masukkan nama lengkap Anda..."
                  className="w-full pl-4 pr-11 py-3 rounded-xl border border-brand-sand bg-brand-sand/20 text-xs sm:text-sm focus:outline-none focus:border-brand-chocolate focus:bg-white text-brand-dark placeholder-neutral-400 transition-all font-medium min-h-[48px]"
                />
                <User className="w-4 h-4 text-neutral-400 absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none" />
              </div>
            </div>

            {/* 2. Email Aktif */}
            <div>
              <label
                htmlFor="email"
                className="block text-[11px] sm:text-xs font-bold uppercase tracking-wider text-brand-dark mb-1.5 sm:mb-2"
              >
                Alamat Email Aktif <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <input
                  type="email"
                  id="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="contoh: nama@umj.ac.id atau email@gmail.com"
                  className="w-full pl-4 pr-11 py-3 rounded-xl border border-brand-sand bg-brand-sand/20 text-xs sm:text-sm focus:outline-none focus:border-brand-chocolate focus:bg-white text-brand-dark placeholder-neutral-400 transition-all font-medium min-h-[48px]"
                />
                <Mail className="w-4 h-4 text-neutral-400 absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none" />
              </div>
              <span className="text-[10px] sm:text-[11px] text-neutral-500 mt-1 block">
                Alamat email Anda dijaga kerahasiaannya dan tidak dipublikasikan ke umum.
              </span>
            </div>

            {/* 3. Pilihan Ganda: Mahasiswa UMJ / Umum */}
            <div>
              <label className="block text-[11px] sm:text-xs font-bold uppercase tracking-wider text-brand-dark mb-1.5 sm:mb-2">
                Kategori Pengirim <span className="text-red-500">*</span>
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 sm:gap-3.5">
                {/* Opsi Mahasiswa UMJ */}
                <label
                  onClick={() => setSenderType('mahasiswa_umj')}
                  className={`flex items-center gap-3 p-3.5 sm:p-4 rounded-2xl border cursor-pointer transition-all active:scale-[0.98] min-h-[56px] ${
                    senderType === 'mahasiswa_umj'
                      ? 'bg-amber-50/70 border-brand-chocolate text-brand-dark shadow-xs'
                      : 'bg-brand-sand/20 border-brand-sand text-neutral-600 hover:bg-brand-sand/40'
                  }`}
                >
                  <input
                    type="radio"
                    name="senderType"
                    value="mahasiswa_umj"
                    checked={senderType === 'mahasiswa_umj'}
                    onChange={() => setSenderType('mahasiswa_umj')}
                    className="accent-brand-chocolate w-4 h-4 shrink-0"
                  />
                  <div className="flex items-center gap-2 min-w-0">
                    <GraduationCap className="w-4 h-4 text-brand-chocolate shrink-0" />
                    <div className="min-w-0">
                      <span className="text-xs sm:text-sm font-bold block truncate">Mahasiswa UMJ</span>
                      <span className="text-[10px] sm:text-[11px] text-neutral-500 truncate block">Civitas Akademika Kampus</span>
                    </div>
                  </div>
                </label>

                {/* Opsi Umum / Alumni */}
                <label
                  onClick={() => setSenderType('umum')}
                  className={`flex items-center gap-3 p-3.5 sm:p-4 rounded-2xl border cursor-pointer transition-all active:scale-[0.98] min-h-[56px] ${
                    senderType === 'umum'
                      ? 'bg-amber-50/70 border-brand-chocolate text-brand-dark shadow-xs'
                      : 'bg-brand-sand/20 border-brand-sand text-neutral-600 hover:bg-brand-sand/40'
                  }`}
                >
                  <input
                    type="radio"
                    name="senderType"
                    value="umum"
                    checked={senderType === 'umum'}
                    onChange={() => setSenderType('umum')}
                    className="accent-brand-chocolate w-4 h-4 shrink-0"
                  />
                  <div className="flex items-center gap-2 min-w-0">
                    <Users className="w-4 h-4 text-brand-chocolate shrink-0" />
                    <div className="min-w-0">
                      <span className="text-xs sm:text-sm font-bold block truncate">Umum / Alumni</span>
                      <span className="text-[10px] sm:text-[11px] text-neutral-500 truncate block">Masyarakat atau Pemerhati</span>
                    </div>
                  </div>
                </label>
              </div>
            </div>

            {/* ============================================================== */}
            {/* LACI INTERAKTIF: FAKULTAS & JURUSAN                            */}
            {/* Hanya terbuka saat user memilih 'Mahasiswa UMJ'                */}
            {/* ============================================================== */}
            <div
              className={`transition-all duration-500 ease-in-out overflow-hidden ${
                senderType === 'mahasiswa_umj'
                  ? 'max-h-[500px] opacity-100 mt-2 sm:mt-4'
                  : 'max-h-0 opacity-0 -mt-2 pointer-events-none'
              }`}
            >
              <div className="p-4 sm:p-5 rounded-2xl bg-amber-50/50 border border-amber-200/80 space-y-3.5 sm:space-y-4 shadow-inner">
                <div className="flex items-center gap-2 text-xs font-bold text-brand-chocolate border-b border-amber-200/60 pb-2">
                  <Building className="w-4 h-4 shrink-0" />
                  <span>Informasi Kemahasiswaan UMJ</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 sm:gap-4">
                  {/* 4a. Asal Fakultas */}
                  <div>
                    <label
                      htmlFor="faculty"
                      className="block text-[11px] sm:text-xs font-bold uppercase tracking-wider text-brand-dark mb-1.5"
                    >
                      Asal Fakultas <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <select
                        id="faculty"
                        value={faculty}
                        onChange={(e) => setFaculty(e.target.value)}
                        className="w-full pl-3.5 pr-10 py-2.5 rounded-xl border border-brand-sand bg-white text-xs sm:text-sm font-semibold text-brand-dark focus:outline-none focus:border-brand-chocolate transition-all shadow-xs cursor-pointer min-h-[48px] appearance-none"
                      >
                        {FAKULTAS_OPTIONS.map((fak) => (
                          <option key={fak} value={fak}>
                            {fak}
                          </option>
                        ))}
                      </select>
                      <ChevronDown className="w-4 h-4 text-neutral-400 absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                    </div>
                  </div>

                  {/* 4b. Asal Jurusan / Program Studi */}
                  <div>
                    <label
                      htmlFor="major"
                      className="block text-[11px] sm:text-xs font-bold uppercase tracking-wider text-brand-dark mb-1.5"
                    >
                      Asal Jurusan / Prodi
                    </label>
                    <div className="relative">
                      <input
                        type="text"
                        id="major"
                        value={major}
                        onChange={(e) => setMajor(e.target.value)}
                        placeholder="contoh: S1 Manajemen, S1 Akuntansi"
                        className="w-full pl-3.5 pr-9 py-2.5 rounded-xl border border-brand-sand bg-white text-xs sm:text-sm font-medium text-brand-dark placeholder-neutral-400 focus:outline-none focus:border-brand-chocolate transition-all shadow-xs min-h-[48px]"
                      />
                      <BookOpen className="w-3.5 h-3.5 text-neutral-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* 5. Isi Aspirasi / Pesan */}
            <div>
              <div className="flex items-center justify-between mb-1.5 sm:mb-2">
                <label
                  htmlFor="aspirationContent"
                  className="block text-[11px] sm:text-xs font-bold uppercase tracking-wider text-brand-dark"
                >
                  Isi Aspirasi / Pesan <span className="text-red-500">*</span>
                </label>
                <span className="text-[10px] sm:text-[11px] text-neutral-400">
                  {aspirationContent.length} karakter
                </span>
              </div>
              <textarea
                id="aspirationContent"
                rows={5}
                required
                value={aspirationContent}
                onChange={(e) => setAspirationContent(e.target.value)}
                placeholder="Tuliskan aspirasi, kritik membangun, masukan, laporan fasilitas, atau usulan isu liputan yang ingin Anda sampaikan secara jelas..."
                className="w-full px-3.5 sm:px-4 py-3 rounded-xl border border-brand-sand bg-brand-sand/20 text-xs sm:text-sm focus:outline-none focus:border-brand-chocolate focus:bg-white text-brand-dark placeholder-neutral-400 transition-all leading-relaxed font-medium min-h-[130px]"
              />
            </div>

            {/* 6. Tombol Kirim Aspirasi (Min-h 52px, active feedback) */}
            <div className="pt-2">
              <button
                type="submit"
                disabled={submitting}
                className="w-full min-h-[52px] py-3.5 sm:py-4 rounded-xl bg-gradient-to-r from-brand-chocolate via-brand-walnut to-brand-chocolate hover:from-brand-dark hover:to-brand-chocolate text-white font-extrabold text-sm sm:text-base tracking-wide shadow-md hover:shadow-xl transition-all duration-300 flex items-center justify-center gap-2.5 disabled:opacity-50 cursor-pointer active:scale-95"
              >
                {submitting ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin text-brand-caramel shrink-0" />
                    <span>Mengirimkan Aspirasi...</span>
                  </>
                ) : (
                  <>
                    <Send className="w-4 h-4 text-brand-caramel shrink-0" />
                    <span>Kirimkan Aspirasi Saya</span>
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </section>

      {/* Pop Up Modal Sukses dengan Countdown ke Home */}
      <AspirasiSuccessModal
        isOpen={isSuccessModalOpen}
        onClose={() => setIsSuccessModalOpen(false)}
      />
    </>
  );
}
