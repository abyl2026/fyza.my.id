import { NextRequest, NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';
import { mkdir, writeFile } from 'fs/promises';
import path from 'path';
import { randomUUID } from 'crypto';
import { getSession } from '@/lib/auth';

export const runtime = 'nodejs';

const allowedTypes: Record<string, string> = {
  'image/jpeg': 'jpg',
  'image/jpg': 'jpg',
  'image/pjpeg': 'jpg',
  'image/png': 'png',
  'image/x-png': 'png',
  'image/webp': 'webp',
  'image/gif': 'gif',
  'image/svg+xml': 'svg',
};

export async function POST(req: NextRequest) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ message: 'Akses ditolak.' }, { status: 401 });
  }

  try {
    const formData = await req.formData();
    const file = formData.get('file');
    const folder = (formData.get('folder') as string) || 'general';

    if (!(file instanceof File)) {
      return NextResponse.json({ message: 'Pilih file gambar terlebih dahulu.' }, { status: 400 });
    }

    // Deteksi ekstensi file dari MIME type atau nama file
    let extension = allowedTypes[file.type?.toLowerCase() || ''];
    if (!extension && file.name) {
      const extFromName = path.extname(file.name).toLowerCase().replace('.', '');
      if (['jpg', 'jpeg', 'png', 'webp', 'gif', 'svg'].includes(extFromName)) {
        extension = extFromName === 'jpeg' ? 'jpg' : extFromName;
      }
    }

    if (!extension) {
      return NextResponse.json({ message: 'Format gambar harus JPG, JPEG, PNG, WebP, GIF, atau SVG.' }, { status: 400 });
    }

    // Limit 10MB
    if (file.size > 10 * 1024 * 1024) {
      return NextResponse.json({ message: 'Ukuran gambar maksimal 10 MB.' }, { status: 400 });
    }

    // Sanitize folder name
    const safeFolder = folder.replace(/[^a-zA-Z0-9_-]/g, '') || 'general';
    const fileName = `${Date.now()}-${randomUUID().slice(0, 8)}.${extension}`;
    const buffer = Buffer.from(await file.arrayBuffer());

    // Hitung projectRoot dengan akurat (baik standalone mode maupun root biasa)
    const cwd = process.cwd();
    const isInsideStandalone = cwd.includes(path.join('.next', 'standalone')) || cwd.endsWith('standalone');
    const projectRoot = isInsideStandalone ? path.resolve(cwd, '..', '..') : cwd;

    // Daftar target lokasi penyimpanan agar gambar tersedia di dev, standalone, maupun root VPS
    const targetDirs = [
      path.join(projectRoot, 'public', 'uploads', safeFolder),
      path.join(projectRoot, '.next', 'standalone', 'public', 'uploads', safeFolder),
      path.join(cwd, 'public', 'uploads', safeFolder),
    ];

    let written = false;
    for (const dir of targetDirs) {
      try {
        await mkdir(dir, { recursive: true });
        await writeFile(path.join(dir, fileName), buffer);
        written = true;
      } catch {}
    }

    if (!written) {
      const fallbackDir = path.join(process.cwd(), 'public', 'uploads', safeFolder);
      await mkdir(fallbackDir, { recursive: true });
      await writeFile(path.join(fallbackDir, fileName), buffer);
    }

    try {
      revalidatePath('/tentang-kami');
      revalidatePath('/');
    } catch {}

    const publicUrl = `/uploads/${safeFolder}/${fileName}`;
    return NextResponse.json({ url: publicUrl, fileName }, { status: 201 });
  } catch (error) {
    console.error('Upload image error:', error);
    return NextResponse.json({ message: 'Gagal mengunggah file gambar.' }, { status: 500 });
  }
}