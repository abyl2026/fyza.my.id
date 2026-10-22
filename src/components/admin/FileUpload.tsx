'use client';

import React, { useRef, useState } from 'react';
import { UploadCloud, Image as ImageIcon, X, Loader2, CheckCircle2, AlertCircle } from 'lucide-react';

interface FileUploadProps {
  label: string;
  value: string;
  onChange: (url: string) => void;
  folder?: string;
  helperText?: string;
}

export default function FileUpload({
  label,
  value,
  onChange,
  folder = 'general',
  helperText = 'Format: JPG, PNG, WebP, GIF (Maks. 10 MB)',
}: FileUploadProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showUrlFallback, setShowUrlFallback] = useState(false);

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setError(null);
    setUploading(true);

    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('folder', folder);

      const res = await fetch('/api/admin/uploads', {
        method: 'POST',
        body: formData,
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.message || 'Gagal mengunggah foto.');
      }

      onChange(data.url);
    } catch (err: any) {
      console.error(err);
      setError(err.message || 'Terjadi kesalahan saat mengunggah file.');
    } finally {
      setUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const handleRemove = () => {
    onChange('');
    setError(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <label className="block text-xs font-bold text-[#442013] uppercase tracking-wider">
          {label}
        </label>
        <button
          type="button"
          onClick={() => setShowUrlFallback(!showUrlFallback)}
          className="text-[11px] text-stone-500 hover:text-[#6A3822] underline"
        >
          {showUrlFallback ? 'Tutup Input Link' : 'Punya link gambar?'}
        </button>
      </div>

      {error && (
        <div className="p-2.5 rounded-lg bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2">
          <AlertCircle className="w-4 h-4 flex-shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Jika sudah ada foto terpilih */}
      {value ? (
        <div className="relative rounded-xl border-2 border-dashed border-[#6A3822]/40 bg-[#FAF8F5] p-3 flex items-center gap-4">
          <div className="w-20 h-20 rounded-lg overflow-hidden bg-stone-200 border border-stone-300 flex-shrink-0 relative">
            <img
              src={value}
              alt="Preview"
              className="w-full h-full object-cover"
              onError={(e) => {
                (e.target as HTMLImageElement).src =
                  'https://images.unsplash.com/photo-1544531586-fde5298cdd40?w=200';
              }}
            />
          </div>

          <div className="flex-1 min-w-0">
            <p className="text-xs font-semibold text-[#442013] truncate">Foto Terpasang</p>
            <p className="text-[11px] text-stone-500 truncate font-mono mt-0.5">{value}</p>
            <div className="flex items-center gap-2 mt-2">
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                disabled={uploading}
                className="px-2.5 py-1 rounded-md text-[11px] font-semibold bg-[#442013] text-white hover:bg-[#572b1b] transition disabled:opacity-50"
              >
                Ganti File
              </button>
              <button
                type="button"
                onClick={handleRemove}
                disabled={uploading}
                className="px-2.5 py-1 rounded-md text-[11px] font-semibold bg-rose-50 text-rose-700 hover:bg-rose-100 border border-rose-200 transition"
              >
                Hapus
              </button>
            </div>
          </div>
        </div>
      ) : (
        /* Box Upload File */
        <div
          onClick={() => fileInputRef.current?.click()}
          className={`border-2 border-dashed rounded-xl p-5 text-center cursor-pointer transition flex flex-col items-center justify-center gap-2 bg-[#FAF8F5] hover:bg-white hover:border-[#6A3822] ${
            uploading ? 'opacity-60 pointer-events-none' : 'border-stone-300'
          }`}
        >
          {uploading ? (
            <div className="flex flex-col items-center gap-2 py-2">
              <Loader2 className="w-8 h-8 text-[#6A3822] animate-spin" />
              <p className="text-xs font-semibold text-[#442013]">Mengunggah foto ke server...</p>
            </div>
          ) : (
            <>
              <div className="w-12 h-12 rounded-xl bg-white border border-[#E5D5C2] flex items-center justify-center text-[#6A3822] shadow-sm">
                <UploadCloud className="w-6 h-6" />
              </div>
              <div>
                <p className="text-xs font-bold text-[#442013]">
                  Klik untuk pilih file atau seret foto ke sini
                </p>
                <p className="text-[11px] text-stone-500 mt-0.5">{helperText}</p>
              </div>
            </>
          )}
        </div>
      )}

      {/* Hidden File Input */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp,image/gif"
        onChange={handleFileSelect}
        className="hidden"
      />

      {/* Fallback URL Input */}
      {showUrlFallback && (
        <div className="pt-2">
          <input
            type="url"
            placeholder="Atau tempel URL gambar eksternal (https://...)"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            className="w-full px-3 py-1.5 rounded-lg border border-stone-300 text-xs focus:outline-none focus:ring-2 focus:ring-[#6A3822]"
          />
        </div>
      )}
    </div>
  );
}
