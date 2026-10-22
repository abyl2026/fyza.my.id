import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getSession } from '@/lib/auth';

export const dynamic = 'force-dynamic';

export async function GET() {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ message: 'Akses ditolak.' }, { status: 401 });
  }

  try {
    const [
      aspirationsCount,
      adminsCount,
      publishedEventsCount,
      publishedArticlesCount,
      recentAspirations,
      recentArticles,
      recentEvents,
    ] = await Promise.all([
      prisma.aspiration.count(),
      prisma.user.count(),
      prisma.event.count({ where: { status: 'published' } }),
      prisma.article.count({ where: { status: 'published' } }),
      prisma.aspiration.findMany({
        take: 5,
        orderBy: { createdAt: 'desc' },
      }),
      prisma.article.findMany({
        take: 3,
        orderBy: { createdAt: 'desc' },
        select: {
          id: true,
          title: true,
          category: true,
          status: true,
          isTop: true,
          viewsCount: true,
          createdAt: true,
        },
      }),
      prisma.event.findMany({
        take: 3,
        orderBy: { eventDate: 'asc' },
        select: {
          id: true,
          title: true,
          eventDate: true,
          location: true,
          status: true,
        },
      }),
    ]);

    return NextResponse.json({
      stats: {
        aspirationsCount,
        adminsCount,
        publishedEventsCount,
        publishedArticlesCount,
      },
      recentAspirations,
      recentArticles,
      recentEvents,
    });
  } catch (error) {
    console.error('Stats error:', error);
    return NextResponse.json(
      { message: 'Gagal memuat statistik.' },
      { status: 500 }
    );
  }
}
