import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      fullName,
      email,
      senderType,
      faculty,
      major,
      aspirationContent,
    } = body;

    // Validasi input wajib
    if (!fullName || typeof fullName !== 'string' || !fullName.trim()) {
      return NextResponse.json(
        { message: 'Nama lengkap wajib diisi.' },
        { status: 400 }
      );
    }

    if (!email || typeof email !== 'string' || !email.trim()) {
      return NextResponse.json(
        { message: 'Alamat email aktif wajib diisi.' },
        { status: 400 }
      );
    }

    // Validasi format email sederhana
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email.trim())) {
      return NextResponse.json(
        { message: 'Format email tidak valid.' },
        { status: 400 }
      );
    }

    if (!aspirationContent || typeof aspirationContent !== 'string' || !aspirationContent.trim()) {
      return NextResponse.json(
        { message: 'Isi aspirasi tidak boleh kosong.' },
        { status: 400 }
      );
    }

    // Tentukan kategori pengirim
    const isMahasiswa = senderType === 'mahasiswa_umj' || senderType === 'Mahasiswa UMJ';
    const normalizedSenderType = isMahasiswa ? 'mahasiswa_umj' : 'umum';

    // Deteksi IP Address & User Agent
    const forwardedFor = req.headers.get('x-forwarded-for');
    const ipAddress = forwardedFor
      ? forwardedFor.split(',')[0].trim()
      : '127.0.0.1';
    const userAgent = req.headers.get('user-agent') || 'Browser';

    // Simpan ke database Prisma (terkoneksi langsung dengan Control Panel Admin Aspirasi)
    const aspiration = await prisma.aspiration.create({
      data: {
        fullName: fullName.trim(),
        email: email.trim(),
        senderType: normalizedSenderType,
        faculty: isMahasiswa ? (faculty?.trim() || null) : null,
        major: isMahasiswa ? (major?.trim() || null) : null,
        aspirationContent: aspirationContent.trim(),
        status: 'new', // Status awal: baru
        ipAddress,
        userAgent,
      },
    });

    return NextResponse.json(
      {
        message: 'Aspirasi Anda berhasil dikirimkan ke meja redaksi BAPEMA Cakrawala.',
        aspiration: {
          id: aspiration.id,
          fullName: aspiration.fullName,
          status: aspiration.status,
          createdAt: aspiration.createdAt,
        },
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('API Aspirasi Error:', error);
    return NextResponse.json(
      { message: 'Terjadi kesalahan sistem saat menyimpan aspirasi Anda.' },
      { status: 500 }
    );
  }
}
