import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getSession } from '@/lib/auth';
import * as XLSX from 'xlsx';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ message: 'Akses ditolak.' }, { status: 401 });
  }

  const { searchParams } = new URL(req.url);
  const filter = searchParams.get('filter');

  const whereClause: any = {};
  if (filter === '7days') {
    const d = new Date();
    d.setDate(d.getDate() - 7);
    whereClause.createdAt = { gte: d };
  } else if (filter === '30days') {
    const d = new Date();
    d.setDate(d.getDate() - 30);
    whereClause.createdAt = { gte: d };
  }

  try {
    const aspirations = await prisma.aspiration.findMany({
      where: whereClause,
      orderBy: { createdAt: 'desc' },
    });

    const rows = aspirations.map((item, index) => ({
      No: index + 1,
      'Tanggal Masuk': new Date(item.createdAt).toLocaleString('id-ID'),
      'Nama Pengirim': item.fullName,
      Email: item.email || '-',
      'Kategori Pengirim': item.senderType === 'mahasiswa_umj' ? 'Mahasiswa UMJ' : 'Umum',
      'Asal Fakultas': item.faculty || '-',
      'Program Studi / Jurusan': item.major || '-',
      'Isi Aspirasi': item.aspirationContent,
      Status: item.status === 'new' ? 'Baru' : item.status === 'reviewed' ? 'Ditinjau' : 'Arsip',
    }));

    const worksheet = XLSX.utils.json_to_sheet(rows);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Aspirasi Masuk');

    const buffer = XLSX.write(workbook, { type: 'buffer', bookType: 'xlsx' });

    return new NextResponse(buffer, {
      status: 200,
      headers: {
        'Content-Type': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        'Content-Disposition': `attachment; filename="Aspirasi_BAPEMA_Cakrawala_${Date.now()}.xlsx"`,
      },
    });
  } catch (error) {
    console.error('Export Excel error:', error);
    return NextResponse.json({ message: 'Gagal mengekspor data ke Excel.' }, { status: 500 });
  }
}
