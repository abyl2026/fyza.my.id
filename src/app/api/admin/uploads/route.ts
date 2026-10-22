import { NextRequest, NextResponse } from 'next/server';
import { mkdir, writeFile } from 'fs/promises';
import path from 'path';
import { randomUUID } from 'crypto';
import { getSession } from '@/lib/auth';

export const runtime = 'nodejs';

const allowedTypes: Record<string, string> = {
  'image/jpeg': 'jpg',
  'image/png': 'png',
  'image/webp': 'webp',
  'image/gif': 'gif',
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

    const extension = allowedTypes[file.type];
    if (!extension) {
      return NextResponse.json({ message: 'Format gambar harus JPG, PNG, WebP, atau GIF.' }, { status: 400 });
    }

    // Limit 10MB
    if (file.size > 10 * 1024 * 1024) {
      return NextResponse.json({ message: 'Ukuran gambar maksimal 10 MB.' }, { status: 400 });
    }

    // Sanitize folder name
    const safeFolder = folder.replace(/[^a-zA-Z0-9_-]/g, '') || 'general';
    const uploadDirectory = path.join(process.cwd(), 'public', 'uploads', safeFolder);
    await mkdir(uploadDirectory, { recursive: true });

    const fileName = `${Date.now()}-${randomUUID().slice(0, 8)}.${extension}`;
    const filePath = path.join(uploadDirectory, fileName);
    await writeFile(filePath, Buffer.from(await file.arrayBuffer()));

    const publicUrl = `/uploads/${safeFolder}/${fileName}`;
    return NextResponse.json({ url: publicUrl, fileName }, { status: 201 });
  } catch (error) {
    console.error('Upload image error:', error);
    return NextResponse.json({ message: 'Gagal mengunggah file gambar.' }, { status: 500 });
  }
}