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
    const article = await prisma.article.findUnique({
      where: { id },
      include: { creator: { select: { id: true, name: true, email: true } } },
    });

    if (!article) {
      return NextResponse.json({ message: 'Artikel tidak ditemukan.' }, { status: 404 });
    }

    return NextResponse.json({ article });
  } catch (error) {
    console.error('Fetch article error:', error);
    return NextResponse.json({ message: 'Gagal memuat artikel.' }, { status: 500 });
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
      excerpt,
      content,
      coverImageUrl,
      category,
      authorName,
      importantLink,
      status,
      isTop,
    } = body;

    const existing = await prisma.article.findUnique({ where: { id } });
    if (!existing) {
      return NextResponse.json({ message: 'Artikel tidak ditemukan.' }, { status: 404 });
    }

    if (isTop) {
      // Unset previous top articles
      await prisma.article.updateMany({
        where: { isTop: 1, NOT: { id } },
        data: { isTop: 0 },
      });
    }

    const updated = await prisma.article.update({
      where: { id },
      data: {
        title: title ?? existing.title,
        excerpt: excerpt ?? existing.excerpt,
        content: content ?? existing.content,
        coverImageUrl: coverImageUrl ?? existing.coverImageUrl,
        category: category ?? existing.category,
        authorName: authorName ?? existing.authorName,
        importantLink: importantLink ?? existing.importantLink,
        status: status ?? existing.status,
        isTop: isTop !== undefined ? (isTop ? 1 : 0) : existing.isTop,
        publishedAt:
          status === 'published' && !existing.publishedAt
            ? new Date()
            : existing.publishedAt,
      },
    });

    return NextResponse.json({ message: 'Artikel berhasil diperbarui.', article: updated });
  } catch (error) {
    console.error('Update article error:', error);
    return NextResponse.json({ message: 'Gagal memperbarui artikel.' }, { status: 500 });
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
    const existing = await prisma.article.findUnique({ where: { id } });
    if (!existing) {
      return NextResponse.json({ message: 'Artikel tidak ditemukan.' }, { status: 404 });
    }

    await prisma.article.delete({ where: { id } });
    return NextResponse.json({ message: 'Artikel berhasil dihapus.' });
  } catch (error) {
    console.error('Delete article error:', error);
    return NextResponse.json({ message: 'Gagal menghapus artikel.' }, { status: 500 });
  }
}
