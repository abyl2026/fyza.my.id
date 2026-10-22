import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getSession } from '@/lib/auth';

export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ message: 'Akses ditolak.' }, { status: 401 });
  }

  const id = parseInt(params.id, 10);
  if (isNaN(id)) {
    return NextResponse.json({ message: 'ID aspirasi tidak valid.' }, { status: 400 });
  }

  try {
    const body = await req.json();
    const { status } = body;

    if (!status) {
      return NextResponse.json({ message: 'Status wajib ditentukan.' }, { status: 400 });
    }

    const updated = await prisma.aspiration.update({
      where: { id },
      data: { status },
    });

    return NextResponse.json({
      message: 'Status aspirasi berhasil diperbarui.',
      aspiration: updated,
    });
  } catch (error) {
    console.error('Update aspiration status error:', error);
    return NextResponse.json(
      { message: 'Gagal memperbarui status aspirasi.' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ message: 'Akses ditolak.' }, { status: 401 });
  }

  const id = parseInt(params.id, 10);
  if (isNaN(id)) {
    return NextResponse.json({ message: 'ID aspirasi tidak valid.' }, { status: 400 });
  }

  try {
    await prisma.aspiration.delete({
      where: { id },
    });

    return NextResponse.json({ message: 'Aspirasi berhasil dihapus.' });
  } catch (error) {
    console.error('Delete aspiration error:', error);
    return NextResponse.json(
      { message: 'Gagal menghapus aspirasi.' },
      { status: 500 }
    );
  }
}
