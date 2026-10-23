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
    const articles = await prisma.article.findMany({
      orderBy: { createdAt: 'desc' },
      include: {
        creator: { select: { id: true, name: true, email: true } },
      },
    });
    return NextResponse.json({ articles });
  } catch (error) {
    console.error('Fetch articles error:', error);
    return NextResponse.json({ message: 'Gagal memuat artikel.' }, { status: 500 });
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
      excerpt,
      content,
      coverImageUrl,
      category,
      authorName,
      importantLink,
      status,
      isTop,
    } = body;

    if (!title || !content) {
      return NextResponse.json(
        { message: 'Judul dan isi artikel wajib diisi.' },
        { status: 400 }
      );
    }

    const slug = (customSlug ? generateSlug(customSlug) : generateSlug(title)) + '-' + Date.now().toString().slice(-4);

    // Jika artikel ini dijadikan TOP Article, reset top article sebelumnya (opsional namun baik)
    if (isTop) {
      await prisma.article.updateMany({
        where: { isTop: 1 },
        data: { isTop: 0 },
      });
    }

    const article = await prisma.article.create({
      data: {
        title,
        slug,
        excerpt: excerpt || '',
        content,
        coverImageUrl: coverImageUrl || '',
        category: category || 'Berita Kampus',
        authorName: authorName || session.name,
        importantLink: importantLink || '',
        status: status || 'draft',
        isTop: isTop ? 1 : 0,
        publishedAt: status === 'published' ? new Date() : null,
        createdBy: session.id,
      },
    });

    try {
      revalidatePath('/');
      revalidatePath('/artikel');
      revalidatePath('/tentang-kami');
    } catch {}

    return NextResponse.json({ message: 'Artikel berhasil disimpan.', article }, { status: 201 });
  } catch (error) {
    console.error('Create article error:', error);
    return NextResponse.json({ message: 'Gagal membuat artikel.' }, { status: 500 });
  }
}
