import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getSession } from '@/lib/auth';

export async function GET(req: NextRequest) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ message: 'Akses ditolak.' }, { status: 401 });
  }

  const { searchParams } = new URL(req.url);
  const filter = searchParams.get('filter'); // '7days', '30days', 'all'
  const status = searchParams.get('status');

  const whereClause: any = {};

  if (status && status !== 'all') {
    whereClause.status = status;
  }

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
    return NextResponse.json({ aspirations });
  } catch (error) {
    console.error('Fetch aspirations error:', error);
    return NextResponse.json({ message: 'Gagal memuat daftar aspirasi.' }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ message: 'Akses ditolak.' }, { status: 401 });
  }

  try {
    const body = await req.json();
    const { id, status } = body;

    if (!id || !status) {
      return NextResponse.json({ message: 'ID dan status wajib diisi.' }, { status: 400 });
    }

    const updated = await prisma.aspiration.update({
      where: { id: Number(id) },
      data: { status },
    });

    return NextResponse.json({ message: 'Status aspirasi diperbarui.', aspiration: updated });
  } catch (error) {
    console.error('Update aspiration error:', error);
    return NextResponse.json({ message: 'Gagal memperbarui status.' }, { status: 500 });
  }
}
