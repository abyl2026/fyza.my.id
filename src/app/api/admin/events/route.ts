import { NextRequest, NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';
import prisma from '@/lib/prisma';
import { getSession } from '@/lib/auth';

function generateSlug(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/--+/g, '-')
    .trim();
}

export async function GET() {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ message: 'Akses ditolak.' }, { status: 401 });
  }

  try {
    const events = await prisma.event.findMany({
      orderBy: { eventDate: 'desc' },
      include: {
        creator: {
          select: { id: true, name: true, email: true },
        },
      },
    });
    return NextResponse.json({ events });
  } catch (error) {
    console.error('Fetch events error:', error);
    return NextResponse.json({ message: 'Gagal memuat daftar acara.' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ message: 'Akses ditolak.' }, { status: 401 });
  }

  try {
    const body = await req.json();
    const {
      title,
      slug: customSlug,
      shortSummary,
      description,
      eventDate,
      location,
      imageUrl,
      importantLink,
      status,
      isFeatured,
    } = body;

    if (!title || !description || !eventDate) {
      return NextResponse.json(
        { message: 'Judul, deskripsi, dan tanggal acara wajib diisi.' },
        { status: 400 }
      );
    }

    const slug = (customSlug ? generateSlug(customSlug) : generateSlug(title)) + '-' + Date.now().toString().slice(-4);

    const event = await prisma.event.create({
      data: {
        title,
        slug,
        shortSummary: shortSummary || '',
        description,
        eventDate: new Date(eventDate),
        location: location || '',
        imageUrl: imageUrl || '',
        importantLink: importantLink || '',
        status: status || 'draft',
        isFeatured: isFeatured ? 1 : 0,
        createdBy: session.id,
      },
    });

    try {
      revalidatePath('/');
      revalidatePath('/acara');
    } catch {}

    return NextResponse.json({ message: 'Acara berhasil ditambahkan.', event }, { status: 201 });
  } catch (error) {
    console.error('Create event error:', error);
    return NextResponse.json({ message: 'Gagal menambahkan acara.' }, { status: 500 });
  }
}
