import { PrismaClient } from '@prisma/client';
import path from 'path';
import fs from 'fs';

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

function getDatabaseUrl(): string {
  // Jika DATABASE_URL sudah diset dan merupakan PostgreSQL atau MySQL, gunakan langsung
  const envUrl = process.env.DATABASE_URL;
  if (envUrl && (envUrl.startsWith('postgresql://') || envUrl.startsWith('mysql://'))) {
    return envUrl;
  }

  // Cari lokasi file database SQLite bapema.db secara absolut
  const cwd = process.cwd();
  const isInsideStandalone =
    cwd.includes(path.join('.next', 'standalone')) || cwd.endsWith('standalone');
  const projectRoot = isInsideStandalone ? path.resolve(cwd, '..', '..') : cwd;

  const candidatePaths = [
    path.join(projectRoot, 'database', 'bapema.db'),
    path.join(cwd, 'database', 'bapema.db'),
    path.join(cwd, '.next', 'standalone', 'database', 'bapema.db'),
    path.resolve(cwd, '..', '..', 'database', 'bapema.db'),
    path.resolve(cwd, '..', 'database', 'bapema.db'),
  ];

  for (const p of candidatePaths) {
    if (fs.existsSync(p)) {
      return `file:${path.resolve(p)}`;
    }
  }

  // Fallback standar ke database/bapema.db
  return `file:${path.resolve(projectRoot, 'database', 'bapema.db')}`;
}

const dbUrl = getDatabaseUrl();

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    datasources: {
      db: {
        url: dbUrl,
      },
    },
    log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
  });

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;

export default prisma;
