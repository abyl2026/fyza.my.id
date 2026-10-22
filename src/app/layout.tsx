import type { Metadata } from 'next';
import { Plus_Jakarta_Sans, Montserrat, Inter } from 'next/font/google';
import './globals.css';

const plusJakartaSans = Plus_Jakarta_Sans({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700', '800'],
  variable: '--font-plus-jakarta-sans',
  display: 'swap',
});

const montserrat = Montserrat({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700', '800'],
  variable: '--font-montserrat',
  display: 'swap',
});

const inter = Inter({
  subsets: ['latin'],
  weight: ['400', '500', '600'],
  variable: '--font-inter',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'BAPEMA Cakrawala UMJ | Lembaga Pers Mahasiswa',
  description: 'Portal Resmi & Profil Lembaga Pers Mahasiswa (LPM) BAPEMA Cakrawala Universitas Muhammadiyah Jakarta. Suara Cakrawala, Suara Mahasiswa!',
  keywords: ['BAPEMA', 'Cakrawala', 'UMJ', 'Pers Mahasiswa', 'Jurnalistik', 'Jakarta'],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="id" className={`${plusJakartaSans.variable} ${montserrat.variable} ${inter.variable}`}>
      <body className={`${plusJakartaSans.className} min-h-screen bg-[#FAF8F5] antialiased`}>
        {children}
      </body>
    </html>
  );
}
