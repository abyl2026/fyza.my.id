import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-[#FAF8F5] flex flex-col items-center justify-center p-6 text-center">
      <h1 className="text-6xl font-black font-serif text-[#442013] mb-2">404</h1>
      <h2 className="text-xl font-bold text-[#6A3822] mb-3">Halaman Tidak Ditemukan</h2>
      <p className="text-stone-600 max-w-md text-sm mb-6">
        Halaman yang Anda cari tidak tersedia atau alamat URL salah.
      </p>
      <Link
        href="/"
        className="px-5 py-2.5 bg-[#442013] hover:bg-[#572b1b] text-[#F4E7D3] rounded-xl font-semibold text-xs transition shadow-md"
      >
        Kembali ke Beranda
      </Link>
    </div>
  );
}
