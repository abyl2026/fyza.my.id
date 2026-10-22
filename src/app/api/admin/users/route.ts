import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getSession, hashPassword } from '@/lib/auth';

export const dynamic = 'force-dynamic';

export async function GET() {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ message: 'Akses ditolak.' }, { status: 401 });
  }

  // Master Admin only check
  if (session.role !== 'master_admin') {
    return NextResponse.json(
      { message: 'Akses terbatas hanya untuk Master Admin.' },
      { status: 403 }
    );
  }

  try {
    const users = await prisma.user.findMany({
      orderBy: { createdAt: 'asc' },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        avatarUrl: true,
        createdAt: true,
      },
    });

    return NextResponse.json({ users });
  } catch (error) {
    console.error('Fetch users error:', error);
    return NextResponse.json({ message: 'Gagal memuat pengguna.' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ message: 'Akses ditolak.' }, { status: 401 });
  }

  // Strict RBAC: Only Master Admin can create new users
  if (session.role !== 'master_admin') {
    return NextResponse.json(
      { message: 'Hanya Master Admin yang berhak menambahkan admin baru.' },
      { status: 403 }
    );
  }

  try {
    const body = await req.json();
    const { name, email, password, role } = body;

    if (!name || !email || !password) {
      return NextResponse.json(
        { message: 'Nama, email, dan kata sandi wajib diisi.' },
        { status: 400 }
      );
    }

    const cleanEmail = email.toLowerCase().trim();

    // Check duplicate email
    const existing = await prisma.user.findUnique({
      where: { email: cleanEmail },
    });

    if (existing) {
      return NextResponse.json(
        { message: 'Alamat email sudah terdaftar.' },
        { status: 400 }
      );
    }

    const passwordHash = await hashPassword(password);

    const newUser = await prisma.user.create({
      data: {
        name,
        email: cleanEmail,
        passwordHash,
        role: role === 'master_admin' ? 'master_admin' : 'admin',
        avatarUrl: '/assets/avatars/default.jpg',
      },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        createdAt: true,
      },
    });

    return NextResponse.json(
      { message: 'Admin baru berhasil didaftarkan.', user: newUser },
      { status: 201 }
    );
  } catch (error) {
    console.error('Create user error:', error);
    return NextResponse.json({ message: 'Gagal menambahkan admin.' }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ message: 'Akses ditolak.' }, { status: 401 });
  }

  // Strict RBAC: Only Master Admin can delete users
  if (session.role !== 'master_admin') {
    return NextResponse.json(
      { message: 'Hanya Master Admin yang berhak menghapus akun admin.' },
      { status: 403 }
    );
  }

  try {
    const { searchParams } = new URL(req.url);
    const id = Number(searchParams.get('id'));

    if (!id || isNaN(id)) {
      return NextResponse.json({ message: 'ID admin tidak valid.' }, { status: 400 });
    }

    // Safety: Master Admin cannot delete own active account
    if (id === session.id) {
      return NextResponse.json(
        { message: 'Anda tidak dapat menghapus akun Anda sendiri yang sedang aktif.' },
        { status: 400 }
      );
    }

    const existing = await prisma.user.findUnique({ where: { id } });
    if (!existing) {
      return NextResponse.json({ message: 'Akun admin tidak ditemukan.' }, { status: 404 });
    }

    await prisma.user.delete({ where: { id } });

    return NextResponse.json({ message: `Akun admin "${existing.name}" berhasil dihapus.` });
  } catch (error) {
    console.error('Delete user error:', error);
    return NextResponse.json({ message: 'Gagal menghapus akun admin.' }, { status: 500 });
  }
}
