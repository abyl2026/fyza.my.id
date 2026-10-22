'use client';

import React, { useEffect, useState } from 'react';
import {
  Users,
  UserPlus,
  ShieldAlert,
  ShieldCheck,
  Mail,
  Lock,
  User,
  CheckCircle2,
  AlertCircle,
  X,
  Trash2,
} from 'lucide-react';

interface UserItem {
  id: number;
  name: string;
  email: string;
  role: 'master_admin' | 'admin';
  createdAt: string;
}

export default function AdminUsersPage() {
  const [users, setUsers] = useState<UserItem[]>([]);
  const [currentRole, setCurrentRole] = useState<string>('admin');
  const [currentUserId, setCurrentUserId] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  // Form states
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState<'admin' | 'master_admin'>('admin');
  const [submitting, setSubmitting] = useState(false);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      let role = currentRole;
      try {
        const cached = localStorage.getItem('cakrawala_user');
        if (cached) {
          const u = JSON.parse(cached);
          if (u.role) {
            role = u.role;
            setCurrentRole(u.role);
          }
          if (u.id) setCurrentUserId(u.id);
        }
      } catch {}

      if (role !== 'master_admin') {
        const meRes = await fetch('/api/auth/me');
        const meData = await meRes.json();
        if (meData.authenticated && meData.user) {
          setCurrentRole(meData.user.role);
          setCurrentUserId(meData.user.id);
          if (meData.user.role !== 'master_admin') {
            setLoading(false);
            return;
          }
        } else {
          setLoading(false);
          return;
        }
      }

      const res = await fetch('/api/admin/users');
      const data = await res.json();
      if (data.users) {
        setUsers(data.users);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleCreateUser = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setMessage(null);

    try {
      const res = await fetch('/api/admin/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password, role }),
      });
      const data = await res.json();

      if (res.ok) {
        setMessage({ type: 'success', text: data.message });
        setShowModal(false);
        setName('');
        setEmail('');
        setPassword('');
        setRole('admin');
        fetchUsers();
      } else {
        setMessage({ type: 'error', text: data.error || 'Gagal menambahkan user' });
      }
    } catch (err: any) {
      setMessage({ type: 'error', text: err.message });
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteUser = async (userId: number, userName: string) => {
    if (!confirm(`Apakah Anda yakin ingin menghapus akun "${userName}"? Akun ini tidak akan dapat mengakses panel admin lagi.`)) {
      return;
    }

    try {
      const res = await fetch(`/api/admin/users/${userId}`, {
        method: 'DELETE',
      });
      const data = await res.json();

      if (res.ok) {
        setMessage({ type: 'success', text: data.message });
        fetchUsers();
      } else {
        setMessage({ type: 'error', text: data.error || 'Gagal menghapus user' });
      }
    } catch (err: any) {
      setMessage({ type: 'error', text: err.message || 'Terjadi kesalahan sistem' });
    }
  };

  if (!loading && currentRole !== 'master_admin') {
    return (
      <div className="bg-rose-50 border border-rose-200 rounded-2xl p-8 text-center max-w-lg mx-auto my-12">
        <ShieldAlert className="w-12 h-12 text-rose-600 mx-auto mb-3" />
        <h2 className="font-serif font-bold text-lg text-rose-950">Akses Ditolak (Restricted)</h2>
        <p className="text-sm text-rose-800 mt-2">
          Halaman Pengelolaan Akun Pengguna hanya dapat diakses oleh akun dengan wewenang <strong>Master Admin</strong>.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-serif font-bold text-[#442013]">Manajemen Akun Admin</h1>
          <p className="text-sm text-stone-500 mt-1">
            Kelola daftar akun redaksi dan master admin yang berwenang mengakses panel kendali BAPEMA.
          </p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#442013] text-[#F4E7D3] font-semibold text-sm hover:bg-[#6A3822] transition shadow-sm active:scale-95"
        >
          <UserPlus className="w-4 h-4" />
          <span>Tambah Admin Baru</span>
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

      {/* Users Table */}
      <div className="bg-white rounded-2xl shadow-sm border border-[#E5D5C2]/40 overflow-hidden">
        {loading ? (
          <div className="p-12 text-center text-stone-400 text-sm">Memuat data user...</div>
        ) : users.length === 0 ? (
          <div className="p-12 text-center text-stone-400 text-sm">Tidak ada data pengguna terdaftar.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-stone-600">
              <thead className="bg-[#FAF6F0] text-[#442013] font-serif text-xs uppercase tracking-wider border-b border-[#E5D5C2]/40">
                <tr>
                  <th className="px-6 py-4">Nama Lengkap</th>
                  <th className="px-6 py-4">Email Login</th>
                  <th className="px-6 py-4">Peran (Role)</th>
                  <th className="px-6 py-4">Tanggal Didaftarkan</th>
                  <th className="px-6 py-4 text-right">Tindakan</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E5D5C2]/20">
                {users.map((u) => {
                  const isSelf = u.id === currentUserId;
                  return (
                    <tr key={u.id} className="hover:bg-stone-50/60 transition-colors">
                      <td className="px-6 py-4">
                        <div className="font-semibold text-[#442013] flex items-center gap-2">
                          <User className="w-4 h-4 text-stone-400" />
                          <span>{u.name}</span>
                          {isSelf && (
                            <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-stone-200 text-stone-700">
                              Anda
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4 font-mono text-xs text-stone-600">{u.email}</td>
                      <td className="px-6 py-4">
                        {u.role === 'master_admin' ? (
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-[#442013] text-[#F4E7D3]">
                            <ShieldCheck className="w-3 h-3 text-[#E5D5C2]" />
                            Master Admin
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-[#E5D5C2]/40 text-[#442013]">
                            Admin Redaksi
                          </span>
                        )}
                      </td>
                      <td className="px-6 py-4 text-xs text-stone-400 whitespace-nowrap">
                        {new Date(u.createdAt).toLocaleDateString('id-ID', {
                          day: 'numeric',
                          month: 'long',
                          year: 'numeric',
                        })}
                      </td>
                      <td className="px-6 py-4 text-right whitespace-nowrap">
                        {isSelf ? (
                          <span className="text-xs text-stone-400 italic">Sedang login</span>
                        ) : (
                          <button
                            onClick={() => handleDeleteUser(u.id, u.name)}
                            className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-semibold text-rose-600 hover:text-rose-700 hover:bg-rose-50 border border-transparent hover:border-rose-200 transition"
                            title="Hapus Akun Pengguna"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                            <span>Hapus</span>
                          </button>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Modal Add User */}
      {showModal && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 sm:p-8 shadow-2xl border border-stone-200">
            <div className="flex items-center justify-between pb-4 border-b border-stone-200">
              <div className="flex items-center gap-2">
                <UserPlus className="w-5 h-5 text-[#6A3822]" />
                <h3 className="font-serif font-bold text-lg text-[#442013]">Tambah Akun Admin</h3>
              </div>
              <button
                onClick={() => setShowModal(false)}
                className="text-stone-400 hover:text-stone-600 p-1 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateUser} className="mt-6 space-y-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[#442013] mb-1.5">
                  Nama Lengkap *
                </label>
                <div className="relative">
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Contoh: Fikri Ramadhan"
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-stone-300 text-sm focus:outline-none focus:border-[#6A3822] focus:ring-2 focus:ring-[#6A3822]/20"
                  />
                  <User className="w-4 h-4 text-stone-400 absolute left-3.5 top-3" />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[#442013] mb-1.5">
                  Email Login *
                </label>
                <div className="relative">
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="admin@cakrawala-umj.ac.id"
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-stone-300 text-sm focus:outline-none focus:border-[#6A3822] focus:ring-2 focus:ring-[#6A3822]/20"
                  />
                  <Mail className="w-4 h-4 text-stone-400 absolute left-3.5 top-3" />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[#442013] mb-1.5">
                  Password Akun *
                </label>
                <div className="relative">
                  <input
                    type="password"
                    required
                    minLength={6}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Minimal 6 karakter"
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-stone-300 text-sm focus:outline-none focus:border-[#6A3822] focus:ring-2 focus:ring-[#6A3822]/20"
                  />
                  <Lock className="w-4 h-4 text-stone-400 absolute left-3.5 top-3" />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[#442013] mb-1.5">
                  Tingkat Akses (Role)
                </label>
                <select
                  value={role}
                  onChange={(e: any) => setRole(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-stone-300 text-sm focus:outline-none focus:border-[#6A3822] bg-white"
                >
                  <option value="admin">Admin Redaksi (Konten & Acara)</option>
                  <option value="master_admin">Master Admin (Akses Penuh & User)</option>
                </select>
              </div>

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
                  {submitting ? 'Menyimpan...' : 'Daftarkan Admin'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
