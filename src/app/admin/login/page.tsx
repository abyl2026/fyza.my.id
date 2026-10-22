'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Feather, Lock, Mail, ArrowRight, ShieldCheck, AlertCircle } from 'lucide-react';

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    setLoading(true);

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        setErrorMessage(data.message || 'Login gagal. Periksa kembali email dan password.');
        setLoading(false);
        return;
      }

      if (data.user) {
        try {
          localStorage.setItem('cakrawala_user', JSON.stringify(data.user));
        } catch {}
      }

      // Berhasil login, arahkan ke dashboard
      router.push('/admin/dashboard');
      router.refresh();
    } catch (err) {
      console.error(err);
      setErrorMessage('Terjadi kendala jaringan saat menghubungi server.');
      setLoading(false);
    }
  };

  const fillMasterAdmin = () => {
    setEmail('habil@bapemacakrawala.org');
    setPassword('AdminCakrawala2026!');
    setErrorMessage('');
  };

  const fillStaffAdmin = () => {
    setEmail('redaksi@bapemacakrawala.org');
    setPassword('Redaksi2026!');
    setErrorMessage('');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#442013] via-[#592c1a] to-[#2b140b] flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background Decorative Rings */}
      <div className="absolute -top-32 -left-32 w-96 h-96 rounded-full bg-[#6A3822]/30 blur-3xl pointer-events-none" />
      <div className="absolute -bottom-32 -right-32 w-96 h-96 rounded-full bg-[#442013]/60 blur-3xl pointer-events-none" />

      <div className="w-full max-w-md bg-white rounded-2xl shadow-2xl overflow-hidden border border-[#E5D5C2]/40 relative z-10">
        {/* Top Header Card */}
        <div className="bg-[#442013] p-8 text-center text-[#F4E7D3] border-b border-[#6A3822] relative">
          <div className="w-16 h-16 mx-auto mb-3 rounded-2xl bg-[#6A3822] flex items-center justify-center border-2 border-[#F4E7D3]/40 shadow-inner">
            <Feather className="w-8 h-8 text-[#F4E7D3]" />
          </div>
          <h1 className="text-xl font-bold tracking-wide font-serif text-white">
            PORTAL ADMIN
          </h1>
          <p className="text-xs text-[#E5D5C2] mt-1 font-medium tracking-wider uppercase">
            BAPEMA CAKRAWALA UMJ
          </p>
          <div className="mt-2 inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] bg-black/20 text-[#F4E7D3]/90 border border-white/10">
            <ShieldCheck className="w-3.5 h-3.5 text-amber-400" />
            Sistem Manajemen Terproteksi
          </div>
        </div>

        {/* Form Body */}
        <div className="p-8">
          {errorMessage && (
            <div className="mb-5 p-3.5 rounded-lg bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              <span>{errorMessage}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-[#442013] uppercase tracking-wider mb-1.5">
                Alamat Email Admin
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-stone-400 absolute left-3.5 top-3.5" />
                <input
                  type="email"
                  required
                  placeholder="admin@bapemacakrawala.org"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-stone-300 text-sm focus:outline-none focus:ring-2 focus:ring-[#6A3822] focus:border-transparent transition"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-[#442013] uppercase tracking-wider mb-1.5">
                Kata Sandi
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-stone-400 absolute left-3.5 top-3.5" />
                <input
                  type="password"
                  required
                  placeholder="••••••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-stone-300 text-sm focus:outline-none focus:ring-2 focus:ring-[#6A3822] focus:border-transparent transition"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full mt-2 py-3 px-4 rounded-xl bg-[#442013] hover:bg-[#592c1a] text-white font-semibold text-sm shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {loading ? (
                <span>Memproses Verifikasi...</span>
              ) : (
                <>
                  <span>Masuk ke Dashboard</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          {/* Quick Demo Test Buttons */}
          <div className="mt-6 pt-5 border-t border-stone-200">
            <p className="text-[11px] font-semibold text-stone-500 uppercase tracking-wider text-center mb-2.5">
              Uji Coba Cepat (Akun Seed):
            </p>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={fillMasterAdmin}
                className="py-1.5 px-2 rounded-lg border border-amber-300 bg-amber-50 hover:bg-amber-100 text-amber-900 text-[11px] font-semibold transition text-center"
              >
                👑 Master Admin (Habil)
              </button>
              <button
                type="button"
                onClick={fillStaffAdmin}
                className="py-1.5 px-2 rounded-lg border border-stone-300 bg-stone-50 hover:bg-stone-100 text-stone-700 text-[11px] font-semibold transition text-center"
              >
                ✍️ Staf Redaksi
              </button>
            </div>
            <p className="text-[10px] text-stone-400 text-center mt-2">
              Password default: <code className="bg-stone-100 px-1 py-0.5 rounded">AdminCakrawala2026!</code>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
