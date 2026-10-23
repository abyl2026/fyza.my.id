-- ==============================================================================
-- DATABASE SCHEMA: BAPEMA CAKRAWALA UMJ (PostgreSQL Production)
-- Sistem Profil Organisasi & Portal Informasi Lembaga Pers Mahasiswa
-- Universitas Muhammadiyah Jakarta
-- ==============================================================================

-- 1. ENUM TYPES
DO $$ BEGIN
    CREATE TYPE user_role_type AS ENUM ('master_admin', 'admin');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE event_status_type AS ENUM ('draft', 'published', 'completed');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE article_status_type AS ENUM ('draft', 'published');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE sender_type_enum AS ENUM ('mahasiswa_umj', 'umum');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE aspiration_status_type AS ENUM ('new', 'reviewed', 'archived');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- 2. TABEL: users
CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(150) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    role user_role_type NOT NULL DEFAULT 'admin',
    avatar_url VARCHAR(255),
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_users_role ON users(role);

-- 3. TABEL: organization_profile
CREATE TABLE IF NOT EXISTS organization_profile (
    id SERIAL PRIMARY KEY,
    org_name VARCHAR(200) NOT NULL DEFAULT 'BAPEMA Cakrawala Universitas Muhammadiyah Jakarta',
    short_name VARCHAR(50) NOT NULL DEFAULT 'BAPEMA Cakrawala UMJ',
    tagline VARCHAR(255) NOT NULL DEFAULT 'Suara Cakrawala, Suara Mahasiswa!',
    motto VARCHAR(255) NOT NULL DEFAULT 'Suara Cakrawala, Suara Mahasiswa!',
    motto_description TEXT NOT NULL,
    vision TEXT NOT NULL,
    mission JSONB NOT NULL,
    about_text TEXT NOT NULL,
    logo_url VARCHAR(255),
    email VARCHAR(120) DEFAULT 'kontak@bapemacakrawala.org',
    phone VARCHAR(50),
    address TEXT,
    instagram_url VARCHAR(255),
    linkedin_url VARCHAR(255),
    youtube_url VARCHAR(255),
    twitter_url VARCHAR(255),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- 4. TABEL: leader_profile
CREATE TABLE IF NOT EXISTS leader_profile (
    id SERIAL PRIMARY KEY,
    name VARCHAR(150) NOT NULL,
    position VARCHAR(150) NOT NULL DEFAULT 'Ketua Umum',
    period VARCHAR(50) NOT NULL,
    quote TEXT NOT NULL,
    photo_url VARCHAR(255),
    instagram_url VARCHAR(255),
    linkedin_url VARCHAR(255),
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_leader_active ON leader_profile(is_active);

-- 5. TABEL: divisions
CREATE TABLE IF NOT EXISTS divisions (
    id SERIAL PRIMARY KEY,
    name VARCHAR(120) NOT NULL,
    slug VARCHAR(120) NOT NULL UNIQUE,
    description TEXT,
    sort_order INT NOT NULL DEFAULT 0,
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_divisions_order ON divisions(sort_order);

-- 6. TABEL: members
CREATE TABLE IF NOT EXISTS members (
    id SERIAL PRIMARY KEY,
    division_id INT NOT NULL REFERENCES divisions(id) ON DELETE CASCADE,
    name VARCHAR(150) NOT NULL,
    position VARCHAR(120) NOT NULL,
    photo_url VARCHAR(255),
    instagram_url VARCHAR(255),
    linkedin_url VARCHAR(255),
    sort_order INT NOT NULL DEFAULT 0,
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_members_division ON members(division_id);
CREATE INDEX IF NOT EXISTS idx_members_order ON members(sort_order);

-- 7. TABEL: division_programs
CREATE TABLE IF NOT EXISTS division_programs (
    id SERIAL PRIMARY KEY,
    division_id INT NOT NULL REFERENCES divisions(id) ON DELETE CASCADE,
    name VARCHAR(200) NOT NULL,
    description TEXT NOT NULL,
    target_output TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_div_prog_division ON division_programs(division_id);

-- 8. TABEL: timeline_events
CREATE TABLE IF NOT EXISTS timeline_events (
    id SERIAL PRIMARY KEY,
    year VARCHAR(20) NOT NULL,
    title VARCHAR(200) NOT NULL,
    description TEXT NOT NULL,
    image_url VARCHAR(255),
    sort_order INT NOT NULL DEFAULT 0,
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_timeline_order ON timeline_events(sort_order, year);

-- 9. TABEL: events
CREATE TABLE IF NOT EXISTS events (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    slug VARCHAR(255) NOT NULL UNIQUE,
    short_summary VARCHAR(500),
    description TEXT NOT NULL,
    event_date TIMESTAMPTZ NOT NULL,
    location VARCHAR(200),
    image_url VARCHAR(255),
    important_link VARCHAR(255),
    status event_status_type NOT NULL DEFAULT 'draft',
    is_featured BOOLEAN NOT NULL DEFAULT FALSE,
    created_by INT REFERENCES users(id) ON DELETE SET NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_events_status_date ON events(status, event_date);
CREATE INDEX IF NOT EXISTS idx_events_slug ON events(slug);
CREATE INDEX IF NOT EXISTS idx_events_featured ON events(is_featured);

-- 10. TABEL: articles
CREATE TABLE IF NOT EXISTS articles (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    slug VARCHAR(255) NOT NULL UNIQUE,
    excerpt VARCHAR(500),
    content TEXT NOT NULL,
    cover_image_url VARCHAR(255),
    category VARCHAR(100) NOT NULL DEFAULT 'Berita Kampus',
    author_name VARCHAR(120) NOT NULL,
    important_link VARCHAR(255),
    status article_status_type NOT NULL DEFAULT 'draft',
    is_top BOOLEAN NOT NULL DEFAULT FALSE,
    views_count INT NOT NULL DEFAULT 0,
    created_by INT REFERENCES users(id) ON DELETE SET NULL,
    published_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_articles_status_published ON articles(status, published_at);
CREATE INDEX IF NOT EXISTS idx_articles_category ON articles(category);
CREATE INDEX IF NOT EXISTS idx_articles_is_top ON articles(is_top);
CREATE INDEX IF NOT EXISTS idx_articles_slug ON articles(slug);

-- 11. TABEL: aspirations
CREATE TABLE IF NOT EXISTS aspirations (
    id SERIAL PRIMARY KEY,
    full_name VARCHAR(150) NOT NULL,
    sender_type sender_type_enum NOT NULL,
    faculty VARCHAR(150),
    major VARCHAR(150),
    aspiration_content TEXT NOT NULL,
    status aspiration_status_type NOT NULL DEFAULT 'new',
    ip_address VARCHAR(45),
    user_agent TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_aspirations_created_at ON aspirations(created_at);
CREATE INDEX IF NOT EXISTS idx_aspirations_status ON aspirations(status);
CREATE INDEX IF NOT EXISTS idx_aspirations_sender_type ON aspirations(sender_type);
