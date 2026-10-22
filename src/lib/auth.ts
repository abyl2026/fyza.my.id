import { cache } from 'react';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { cookies } from 'next/headers';
import prisma from './prisma';

const JWT_SECRET = process.env.JWT_SECRET || 'cakrawala_bapema_umj_jwt_secret_key_2026';
const COOKIE_NAME = 'cakrawala_auth_token';

export interface UserSession {
  id: number;
  name: string;
  email: string;
  role: 'master_admin' | 'admin';
}

/**
 * Hash plain text password menggunakan Bcrypt
 */
export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 10);
}

/**
 * Membandingkan plain text password dengan hash
 */
export async function comparePassword(password: string, hash: string): Promise<boolean> {
  return bcrypt.compare(password, hash);
}

/**
 * Sign JWT token untuk session admin
 */
export function signToken(payload: UserSession): string {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: '7d' });
}

/**
 * Verifikasi JWT token
 */
export function verifyToken(token: string): UserSession | null {
  try {
    return jwt.verify(token, JWT_SECRET) as UserSession;
  } catch {
    return null;
  }
}

/**
 * Mengambil sesi user aktif dari cookies (untuk Server Components & API)
 * Dimemoize dengan React cache() untuk mencegah redundant database query dalam 1 request cycle
 */
export const getSession = cache(async (): Promise<UserSession | null> => {
  try {
    const cookieStore = cookies();
    const token = cookieStore.get(COOKIE_NAME)?.value;
    if (!token) return null;

    const decoded = verifyToken(token);
    if (!decoded) return null;

    // Verifikasi user masih terdaftar di database
    const user = await prisma.user.findUnique({
      where: { id: decoded.id },
      select: { id: true, name: true, email: true, role: true },
    });

    if (!user) return null;

    return {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role as 'master_admin' | 'admin',
    };
  } catch (error) {
    console.error('Error fetching session:', error);
    return null;
  }
});

export const AUTH_COOKIE_NAME = COOKIE_NAME;
