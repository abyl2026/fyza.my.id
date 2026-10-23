-- ==============================================================================
-- DATABASE SCHEMA: BAPEMA CAKRAWALA UMJ (MySQL / MariaDB Production)
-- Sistem Profil Organisasi & Portal Informasi Lembaga Pers Mahasiswa
-- Universitas Muhammadiyah Jakarta
-- ==============================================================================

CREATE DATABASE IF NOT EXISTS `bapema_cakrawala` 
  CHARACTER SET utf8mb4 
  COLLATE utf8mb4_unicode_ci;

USE `bapema_cakrawala`;

-- ------------------------------------------------------------------------------
-- 1. TABEL: users (Manajemen Akses Admin & RBAC)
-- Role: 'master_admin' (dapat membuat admin lain) & 'admin' (pengelola konten)
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS `users` (
  `id` INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  `name` VARCHAR(100) NOT NULL,
  `email` VARCHAR(150) NOT NULL UNIQUE,
  `password_hash` VARCHAR(255) NOT NULL,
  `role` ENUM('master_admin', 'admin') NOT NULL DEFAULT 'admin',
  `avatar_url` VARCHAR(255) NULL,
  `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX `idx_users_email` (`email`),
  INDEX `idx_users_role` (`role`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ------------------------------------------------------------------------------
-- 2. TABEL: organization_profile (Visi, Misi, Motto, Kontak & Info Resmi)
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS `organization_profile` (
  `id` INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  `org_name` VARCHAR(200) NOT NULL DEFAULT 'BAPEMA Cakrawala Universitas Muhammadiyah Jakarta',
  `short_name` VARCHAR(50) NOT NULL DEFAULT 'BAPEMA Cakrawala UMJ',
  `tagline` VARCHAR(255) NOT NULL DEFAULT 'Suara Cakrawala, Suara Mahasiswa!',
  `motto` VARCHAR(255) NOT NULL DEFAULT 'Suara Cakrawala, Suara Mahasiswa!',
  `motto_description` TEXT NOT NULL,
  `vision` TEXT NOT NULL,
  `mission` JSON NOT NULL COMMENT 'Daftar poin-poin misi organisasi dalam format JSON array',
  `about_text` LONGTEXT NOT NULL COMMENT 'Deskripsi ulasan lengkap tentang BAPEMA Cakrawala UMJ',
  `logo_url` VARCHAR(255) NULL,
  `email` VARCHAR(120) NULL DEFAULT 'kontak@bapemacakrawala.org',
  `phone` VARCHAR(50) NULL,
  `address` TEXT NULL COMMENT 'Alamat lengkap sekretariat BAPEMA Cakrawala UMJ',
  `instagram_url` VARCHAR(255) NULL,
  `linkedin_url` VARCHAR(255) NULL,
  `youtube_url` VARCHAR(255) NULL,
  `twitter_url` VARCHAR(255) NULL,
  `updated_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ------------------------------------------------------------------------------
-- 3. TABEL: leader_profile (Profil & Foto Sambutan Ketua Umum)
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS `leader_profile` (
  `id` INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  `name` VARCHAR(150) NOT NULL,
  `position` VARCHAR(150) NOT NULL DEFAULT 'Ketua Umum',
  `period` VARCHAR(50) NOT NULL COMMENT 'Contoh: Periode 2026/2027',
  `quote` TEXT NOT NULL COMMENT 'Kutipan sambutan Ketua Umum',
  `photo_url` VARCHAR(255) NULL,
  `instagram_url` VARCHAR(255) NULL,
  `linkedin_url` VARCHAR(255) NULL,
  `is_active` TINYINT(1) NOT NULL DEFAULT 1,
  `updated_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX `idx_leader_active` (`is_active`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ------------------------------------------------------------------------------
-- 4. TABEL: divisions (Divisi Struktural Organisasi)
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS `divisions` (
  `id` INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  `name` VARCHAR(120) NOT NULL,
  `slug` VARCHAR(120) NOT NULL UNIQUE,
  `description` TEXT NULL,
  `sort_order` INT NOT NULL DEFAULT 0,
  `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX `idx_divisions_order` (`sort_order`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ------------------------------------------------------------------------------
-- 5. TABEL: members (Struktur Anggota Pengurus per Divisi)
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS `members` (
  `id` INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  `division_id` INT UNSIGNED NOT NULL,
  `name` VARCHAR(150) NOT NULL,
  `position` VARCHAR(120) NOT NULL,
  `photo_url` VARCHAR(255) NULL,
  `instagram_url` VARCHAR(255) NULL,
  `linkedin_url` VARCHAR(255) NULL,
  `sort_order` INT NOT NULL DEFAULT 0,
  `is_active` TINYINT(1) NOT NULL DEFAULT 1,
  `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  CONSTRAINT `fk_members_division` 
    FOREIGN KEY (`division_id`) REFERENCES `divisions` (`id`) 
    ON DELETE CASCADE ON UPDATE CASCADE,
  INDEX `idx_members_division` (`division_id`),
  INDEX `idx_members_order` (`sort_order`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ------------------------------------------------------------------------------
-- 6. TABEL: division_programs (Program Kerja per Divisi)
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS `division_programs` (
  `id` INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  `division_id` INT UNSIGNED NOT NULL,
  `name` VARCHAR(200) NOT NULL,
  `description` TEXT NOT NULL,
  `target_output` TEXT NULL,
  `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  CONSTRAINT `fk_division_programs_div` 
    FOREIGN KEY (`division_id`) REFERENCES `divisions` (`id`) 
    ON DELETE CASCADE ON UPDATE CASCADE,
  INDEX `idx_div_prog_division` (`division_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ------------------------------------------------------------------------------
-- 7. TABEL: timeline_events (Tonggak Sejarah & Perjalanan BAPEMA)
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS `timeline_events` (
  `id` INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  `year` VARCHAR(20) NOT NULL,
  `title` VARCHAR(200) NOT NULL,
  `description` TEXT NOT NULL,
  `image_url` VARCHAR(255) NULL,
  `sort_order` INT NOT NULL DEFAULT 0,
  `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX `idx_timeline_order` (`sort_order`, `year`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ------------------------------------------------------------------------------
-- 8. TABEL: events (Acara, Agenda & Kegiatan Mendatang / Lampau)
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS `events` (
  `id` INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  `title` VARCHAR(255) NOT NULL,
  `slug` VARCHAR(255) NOT NULL UNIQUE,
  `short_summary` VARCHAR(500) NULL,
  `description` LONGTEXT NOT NULL,
  `event_date` DATETIME NOT NULL,
  `location` VARCHAR(200) NULL,
  `image_url` VARCHAR(255) NULL,
  `important_link` VARCHAR(255) NULL COMMENT 'Tautan pendaftaran, buku panduan, atau link virtual meet',
  `status` ENUM('draft', 'published', 'completed') NOT NULL DEFAULT 'draft',
  `is_featured` TINYINT(1) NOT NULL DEFAULT 0 COMMENT 'Ditampilkan di carousel unggulan beranda',
  `created_by` INT UNSIGNED NULL,
  `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  CONSTRAINT `fk_events_created_by` 
    FOREIGN KEY (`created_by`) REFERENCES `users` (`id`) 
    ON DELETE SET NULL ON UPDATE CASCADE,
  INDEX `idx_events_status_date` (`status`, `event_date`),
  INDEX `idx_events_slug` (`slug`),
  INDEX `idx_events_featured` (`is_featured`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ------------------------------------------------------------------------------
-- 9. TABEL: articles (Artikel, Berita Kampus, Opini, Rilis Pers)
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS `articles` (
  `id` INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  `title` VARCHAR(255) NOT NULL,
  `slug` VARCHAR(255) NOT NULL UNIQUE,
  `excerpt` VARCHAR(500) NULL,
  `content` LONGTEXT NOT NULL,
  `cover_image_url` VARCHAR(255) NULL,
  `category` VARCHAR(100) NOT NULL DEFAULT 'Berita Kampus',
  `author_name` VARCHAR(120) NOT NULL,
  `important_link` VARCHAR(255) NULL,
  `status` ENUM('draft', 'published') NOT NULL DEFAULT 'draft',
  `is_top` TINYINT(1) NOT NULL DEFAULT 0 COMMENT 'TOP Article headline spotlight di halaman artikel',
  `views_count` INT UNSIGNED NOT NULL DEFAULT 0,
  `created_by` INT UNSIGNED NULL,
  `published_at` DATETIME NULL,
  `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  CONSTRAINT `fk_articles_created_by` 
    FOREIGN KEY (`created_by`) REFERENCES `users` (`id`) 
    ON DELETE SET NULL ON UPDATE CASCADE,
  INDEX `idx_articles_status_published` (`status`, `published_at`),
  INDEX `idx_articles_category` (`category`),
  INDEX `idx_articles_is_top` (`is_top`),
  INDEX `idx_articles_slug` (`slug`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ------------------------------------------------------------------------------
-- 10. TABEL: aspirations (Kotak Aspirasi & Feedback Mahasiswa/Umum)
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS `aspirations` (
  `id` INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  `full_name` VARCHAR(150) NOT NULL,
  `sender_type` ENUM('mahasiswa_umj', 'umum') NOT NULL,
  `faculty` VARCHAR(150) NULL COMMENT 'Wajib terisi jika sender_type = mahasiswa_umj',
  `major` VARCHAR(150) NULL COMMENT 'Wajib terisi jika sender_type = mahasiswa_umj',
  `aspiration_content` TEXT NOT NULL,
  `status` ENUM('new', 'reviewed', 'archived') NOT NULL DEFAULT 'new',
  `ip_address` VARCHAR(45) NULL,
  `user_agent` TEXT NULL,
  `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  INDEX `idx_aspirations_created_at` (`created_at`),
  INDEX `idx_aspirations_status` (`status`),
  INDEX `idx_aspirations_sender_type` (`sender_type`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
