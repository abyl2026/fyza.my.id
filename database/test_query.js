/**
 * Test Query Database BAPEMA Cakrawala UMJ
 * Memeriksa relasi dan menampilkan cuplikan data
 */

const { DatabaseSync } = require('node:sqlite');
const path = require('node:path');

const dbPath = path.join(__dirname, 'bapema.db');
const db = new DatabaseSync(dbPath);

console.log('================================================================');
console.log('🔍 TEST QUERY & INTEGRITAS DATA BAPEMA CAKRAWALA UMJ');
console.log('================================================================\n');

// 1. Profil & Motto Organisasi
console.log('📌 PROFIL & MOTTO ORGANISASI:');
const org = db.prepare('SELECT org_name, tagline, motto, motto_description, email FROM organization_profile LIMIT 1').get();
console.log(org);

// 2. Ketua Umum
console.log('\n📌 PROFIL KETUA UMUM:');
const leader = db.prepare('SELECT name, period, quote, instagram_url FROM leader_profile WHERE is_active = 1 LIMIT 1').get();
console.log(leader);

// 3. Divisi & Anggota (Relational Join)
console.log('\n📌 DIVISI & STRUKTUR ANGGOTA (JOIN):');
const members = db.prepare(`
  SELECT d.name as divisi, m.name as nama_anggota, m.position as jabatan
  FROM members m
  JOIN divisions d ON m.division_id = d.id
  ORDER BY d.sort_order, m.sort_order
`).all();
console.table(members);

// 4. Acara Unggulan
console.log('\n📌 ACARA & AGENDA UNGGULAN:');
const events = db.prepare(`
  SELECT title, event_date, location, status, is_featured
  FROM events
  ORDER BY event_date ASC
`).all();
console.table(events);

// 5. Artikel Terbit & Top Spotlight
console.log('\n📌 ARTIKEL & TOP SPOTLIGHT:');
const articles = db.prepare(`
  SELECT title, category, author_name, is_top, views_count, status
  FROM articles
  ORDER BY is_top DESC, published_at DESC
`).all();
console.table(articles);

// 6. Aspirasi Masuk
console.log('\n📌 ASPIRASI MASUK (KOTAK ASPIRASI):');
const aspirations = db.prepare(`
  SELECT full_name, sender_type, faculty, major, substr(aspiration_content, 1, 40) || '...' as cuplikan, status
  FROM aspirations
`).all();
console.table(aspirations);

// 7. Pengguna Admin (RBAC)
console.log('\n📌 DAFTAR ADMIN (RBAC):');
const admins = db.prepare('SELECT id, name, email, role, created_at FROM users').all();
console.table(admins);

db.close();
console.log('\n✅ Semua relasi dan query berhasil dieksekusi tanpa kendala!');
