-- ==============================================================================
-- DATABASE SCHEMA: BAPEMA CAKRAWALA UMJ (SQLite Standard)
-- Kompatibel penuh dengan Node.js native node:sqlite, Better-SQLite3, Prisma
-- ==============================================================================

PRAGMA foreign_keys = ON;

-- 1. TABEL: users
CREATE TABLE IF NOT EXISTS users (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  email TEXT NOT NULL UNIQUE,
  password_hash TEXT NOT NULL,
  role TEXT NOT NULL CHECK(role IN ('master_admin', 'admin')) DEFAULT 'admin',
  avatar_url TEXT,
  created_at TEXT NOT NULL DEFAULT (datetime('now', 'localtime')),
  updated_at TEXT NOT NULL DEFAULT (datetime('now', 'localtime'))
);

CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_users_role ON users(role);

-- 2. TABEL: organization_profile
CREATE TABLE IF NOT EXISTS organization_profile (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  org_name TEXT NOT NULL DEFAULT 'BAPEMA Cakrawala Universitas Muhammadiyah Jakarta',
  short_name TEXT NOT NULL DEFAULT 'BAPEMA Cakrawala UMJ',
  tagline TEXT NOT NULL DEFAULT 'Suara Cakrawala, Suara Mahasiswa!',
  motto TEXT NOT NULL DEFAULT 'Suara Cakrawala, Suara Mahasiswa!',
  motto_description TEXT NOT NULL,
  vision TEXT NOT NULL,
  mission TEXT NOT NULL, -- JSON array of strings
  about_text TEXT NOT NULL,
  logo_url TEXT,
  email TEXT DEFAULT 'kontak@bapemacakrawala.org',
  phone TEXT,
  address TEXT,
  instagram_url TEXT,
  linkedin_url TEXT,
  youtube_url TEXT,
  twitter_url TEXT,
  updated_at TEXT NOT NULL DEFAULT (datetime('now', 'localtime'))
);

-- 3. TABEL: leader_profile
CREATE TABLE IF NOT EXISTS leader_profile (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  position TEXT NOT NULL DEFAULT 'Ketua Umum',
  period TEXT NOT NULL,
  quote TEXT NOT NULL,
  photo_url TEXT,
  instagram_url TEXT,
  linkedin_url TEXT,
  is_active INTEGER NOT NULL DEFAULT 1,
  updated_at TEXT NOT NULL DEFAULT (datetime('now', 'localtime'))
);

CREATE INDEX IF NOT EXISTS idx_leader_active ON leader_profile(is_active);

-- 4. TABEL: divisions
CREATE TABLE IF NOT EXISTS divisions (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  description TEXT,
  sort_order INTEGER NOT NULL DEFAULT 0,
  created_at TEXT NOT NULL DEFAULT (datetime('now', 'localtime')),
  updated_at TEXT NOT NULL DEFAULT (datetime('now', 'localtime'))
);

CREATE INDEX IF NOT EXISTS idx_divisions_order ON divisions(sort_order);

-- 5. TABEL: members
CREATE TABLE IF NOT EXISTS members (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  division_id INTEGER NOT NULL,
  name TEXT NOT NULL,
  position TEXT NOT NULL,
  photo_url TEXT,
  instagram_url TEXT,
  linkedin_url TEXT,
  sort_order INTEGER NOT NULL DEFAULT 0,
  is_active INTEGER NOT NULL DEFAULT 1,
  created_at TEXT NOT NULL DEFAULT (datetime('now', 'localtime')),
  updated_at TEXT NOT NULL DEFAULT (datetime('now', 'localtime')),
  FOREIGN KEY (division_id) REFERENCES divisions(id) ON DELETE CASCADE
);

CREATE INDEX IF NOT EXISTS idx_members_division ON members(division_id);
CREATE INDEX IF NOT EXISTS idx_members_order ON members(sort_order);

-- 6. TABEL: division_programs
CREATE TABLE IF NOT EXISTS division_programs (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  division_id INTEGER NOT NULL,
  name TEXT NOT NULL,
  description TEXT NOT NULL,
  target_output TEXT,
  created_at TEXT NOT NULL DEFAULT (datetime('now', 'localtime')),
  updated_at TEXT NOT NULL DEFAULT (datetime('now', 'localtime')),
  FOREIGN KEY (division_id) REFERENCES divisions(id) ON DELETE CASCADE
);

CREATE INDEX IF NOT EXISTS idx_div_prog_division ON division_programs(division_id);

-- 7. TABEL: timeline_events
CREATE TABLE IF NOT EXISTS timeline_events (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  year TEXT NOT NULL,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  image_url TEXT,
  sort_order INTEGER NOT NULL DEFAULT 0,
  created_at TEXT NOT NULL DEFAULT (datetime('now', 'localtime')),
  updated_at TEXT NOT NULL DEFAULT (datetime('now', 'localtime'))
);

CREATE INDEX IF NOT EXISTS idx_timeline_order ON timeline_events(sort_order, year);

-- 8. TABEL: events
CREATE TABLE IF NOT EXISTS events (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  title TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  short_summary TEXT,
  description TEXT NOT NULL,
  event_date TEXT NOT NULL,
  location TEXT,
  image_url TEXT,
  important_link TEXT,
  status TEXT NOT NULL CHECK(status IN ('draft', 'published', 'completed')) DEFAULT 'draft',
  is_featured INTEGER NOT NULL DEFAULT 0,
  created_by INTEGER,
  created_at TEXT NOT NULL DEFAULT (datetime('now', 'localtime')),
  updated_at TEXT NOT NULL DEFAULT (datetime('now', 'localtime')),
  FOREIGN KEY (created_by) REFERENCES users(id) ON DELETE SET NULL
);

CREATE INDEX IF NOT EXISTS idx_events_status_date ON events(status, event_date);
CREATE INDEX IF NOT EXISTS idx_events_slug ON events(slug);
CREATE INDEX IF NOT EXISTS idx_events_featured ON events(is_featured);

-- 9. TABEL: articles
CREATE TABLE IF NOT EXISTS articles (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  title TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  excerpt TEXT,
  content TEXT NOT NULL,
  cover_image_url TEXT,
  category TEXT NOT NULL DEFAULT 'Berita Kampus',
  author_name TEXT NOT NULL,
  important_link TEXT,
  status TEXT NOT NULL CHECK(status IN ('draft', 'published')) DEFAULT 'draft',
  is_top INTEGER NOT NULL DEFAULT 0,
  views_count INTEGER NOT NULL DEFAULT 0,
  created_by INTEGER,
  published_at TEXT,
  created_at TEXT NOT NULL DEFAULT (datetime('now', 'localtime')),
  updated_at TEXT NOT NULL DEFAULT (datetime('now', 'localtime')),
  FOREIGN KEY (created_by) REFERENCES users(id) ON DELETE SET NULL
);

CREATE INDEX IF NOT EXISTS idx_articles_status_published ON articles(status, published_at);
CREATE INDEX IF NOT EXISTS idx_articles_category ON articles(category);
CREATE INDEX IF NOT EXISTS idx_articles_is_top ON articles(is_top);
CREATE INDEX IF NOT EXISTS idx_articles_slug ON articles(slug);

-- 10. TABEL: aspirations
CREATE TABLE IF NOT EXISTS aspirations (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  full_name TEXT NOT NULL,
  sender_type TEXT NOT NULL CHECK(sender_type IN ('mahasiswa_umj', 'umum')),
  faculty TEXT,
  major TEXT,
  aspiration_content TEXT NOT NULL,
  status TEXT NOT NULL CHECK(status IN ('new', 'reviewed', 'archived')) DEFAULT 'new',
  ip_address TEXT,
  user_agent TEXT,
  created_at TEXT NOT NULL DEFAULT (datetime('now', 'localtime'))
);

CREATE INDEX IF NOT EXISTS idx_aspirations_created_at ON aspirations(created_at);
CREATE INDEX IF NOT EXISTS idx_aspirations_status ON aspirations(status);
CREATE INDEX IF NOT EXISTS idx_aspirations_sender_type ON aspirations(sender_type);
