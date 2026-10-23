import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

const MIME_TYPES: Record<string, string> = {
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.png': 'image/png',
  '.webp': 'image/webp',
  '.gif': 'image/gif',
  '.svg': 'image/svg+xml',
};

/**
 * Route handler untuk melayani file upload dinamis di lingkungan production VPS
 * Mengatasi masalah Next.js yang me-return 404 untuk file statis baru yang di-upload saat runtime
 */
export async function GET(
  req: NextRequest,
  { params }: { params: { path: string[] } | Promise<{ path: string[] }> }
) {
  try {
    const resolvedParams = await Promise.resolve(params);
    const rawSegments = resolvedParams?.path;
    const segments = Array.isArray(rawSegments)
      ? rawSegments
      : typeof rawSegments === 'string'
      ? [rawSegments]
      : [];

    if (!segments || segments.length === 0) {
      return new NextResponse('File tidak ditemukan', { status: 404 });
    }

    // Hindari directory traversal attack
    const safeSegments = segments.map((s) => s.replace(/[^a-zA-Z0-9._-]/g, ''));
    const relativePath = path.join(...safeSegments);

    // Hitung projectRoot dengan akurat (baik standalone mode maupun root biasa)
    const cwd = process.cwd();
    const isInsideStandalone = cwd.includes(path.join('.next', 'standalone')) || cwd.endsWith('standalone');
    const projectRoot = isInsideStandalone ? path.resolve(cwd, '..', '..') : cwd;

    // Cari file di beberapa lokasi potensial (standar root & standalone VPS)
    const candidatePaths = [
      path.join(projectRoot, 'public', 'uploads', relativePath),
      path.join(projectRoot, '.next', 'standalone', 'public', 'uploads', relativePath),
      path.join(cwd, 'public', 'uploads', relativePath),
    ];

    let foundPath: string | null = null;
    for (const p of candidatePaths) {
      if (fs.existsSync(p)) {
        foundPath = p;
        break;
      }
    }

    if (!foundPath) {
      return new NextResponse('File gambar tidak ditemukan di server.', {
        status: 404,
        headers: {
          'Cache-Control': 'no-store, no-cache, must-revalidate',
        },
      });
    }

    const fileBuffer = await fs.promises.readFile(foundPath);
    const ext = path.extname(foundPath).toLowerCase();
    const contentType = MIME_TYPES[ext] || 'application/octet-stream';

    return new NextResponse(fileBuffer, {
      status: 200,
      headers: {
        'Content-Type': contentType,
        'Cache-Control': 'public, max-age=86400, stale-while-revalidate=3600',
      },
    });
  } catch (error) {
    console.error('Error serving uploaded file:', error);
    return new NextResponse('Terjadi kesalahan saat memuat gambar.', { status: 500 });
  }
}
