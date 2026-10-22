import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getSession } from '@/lib/auth';

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ message: 'Akses ditolak.' }, { status: 401 });
  }

  const id = parseInt(params.id, 10);
  if (isNaN(id)) {
    return NextResponse.json({ message: 'ID tidak valid.' }, { status: 400 });
  }

  try {
    const event = await prisma.event.findUnique({
      where: { id },
      include: { creator: { select: { id: true, name: true, email: true } } },
    });

    if (!event) {
      return NextResponse.json({ message: 'Acara tidak ditemukan.' }, { status: 404 });
    }

    return NextResponse.json({ event });
  } catch (error) {
    console.error('Fetch event detail error:', error);
    return NextResponse.json({ message: 'Gagal mengambil detail acara.' }, { status: 500 });
  }
}

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
    return NextResponse.json({ message: 'ID tidak valid.' }, { status: 400 });
  }

  try {
    const body = await req.json();
    const {
      title,
      shortSummary,
      description,
      eventDate,
      location,
      imageUrl,
      importantLink,
      status,
      isFeatured,
    } = body;

    const existing = await prisma.event.findUnique({ where: { id } });
    if (!existing) {
      return NextResponse.json({ message: 'Acara tidak ditemukan.' }, { status: 404 });
    }

    const updated = await prisma.event.update({
      where: { id },
      data: {
        title: title ?? existing.title,
        shortSummary: shortSummary ?? existing.shortSummary,
        description: description ?? existing.description,
        eventDate: eventDate ? new Date(eventDate) : existing.eventDate,
        location: location ?? existing.location,
        imageUrl: imageUrl ?? existing.imageUrl,
        importantLink: importantLink ?? existing.importantLink,
        status: status ?? existing.status,
        isFeatured: isFeatured !== undefined ? (isFeatured ? 1 : 0) : existing.isFeatured,
      },
    });

    return NextResponse.json({ message: 'Acara berhasil diperbarui.', event: updated });
  } catch (error) {
    console.error('Update event error:', error);
    return NextResponse.json({ message: 'Gagal memperbarui acara.' }, { status: 500 });
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
    return NextResponse.json({ message: 'ID tidak valid.' }, { status: 400 });
  }

  try {
    const existing = await prisma.event.findUnique({ where: { id } });
    if (!existing) {
      return NextResponse.json({ message: 'Acara tidak ditemukan.' }, { status: 404 });
    }

    await prisma.event.delete({ where: { id } });
    return NextResponse.json({ message: 'Acara berhasil dihapus.' });
  } catch (error) {
    console.error('Delete event error:', error);
    return NextResponse.json({ message: 'Gagal menghapus acara.' }, { status: 500 });
  }
}
