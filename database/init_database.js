/**
 * Script Inisialisasi Database BAPEMA Cakrawala UMJ
 * Menggunakan Node.js native SQLite engine (node:sqlite)
 * Menghasilkan file database lokal 'bapema.db' secara otomatis
 */

const { DatabaseSync } = require('node:sqlite');
const fs = require('node:fs');
const path = require('node:path');

const dbPath = path.join(__dirname, 'bapema.db');
const schemaPath = path.join(__dirname, 'schema_sqlite.sql');
const seedPath = path.join(__dirname, 'seed.sql');

console.log('------------------------------------------------------------');
console.log('🚀 Menginisialisasi Database BAPEMA Cakrawala UMJ...');
console.log('Lokasi Database:', dbPath);
console.log('------------------------------------------------------------');

// Jika file database lama sudah ada, kita bisa refresh
if (fs.existsSync(dbPath)) {
  console.log('ℹ️  Menemukan database lama, memperbarui struktur data...');
  fs.unlinkSync(dbPath);
}

const db = new DatabaseSync(dbPath);

try {
  // 1. Eksekusi Schema
  console.log('⏳ Membuat tabel-tabel relational...');
  const schemaSql = fs.readFileSync(schemaPath, 'utf-8');
  db.exec(schemaSql);
  console.log('✅ 10 Tabel berhasil dibuat:');
  console.log('   - users');
  console.log('   - organization_profile');
  console.log('   - leader_profile');
  console.log('   - divisions');
  console.log('   - members');
  console.log('   - division_programs');
  console.log('   - timeline_events');
  console.log('   - events');
  console.log('   - articles');
  console.log('   - aspirations');

  // 2. Eksekusi Seed Data
  console.log('\n⏳ Mengisi data awal (seed data) realistis...');
  const seedSql = fs.readFileSync(seedPath, 'utf-8');
  db.exec(seedSql);
  console.log('✅ Data seed berhasil dimasukkan ke dalam database.');

  // 3. Verifikasi jumlah data
  console.log('\n📊 Ringkasan Data Awal:');
  const countUsers = db.prepare('SELECT COUNT(*) as count FROM users').get().count;
  const countOrg = db.prepare('SELECT COUNT(*) as count FROM organization_profile').get().count;
  const countLeader = db.prepare('SELECT COUNT(*) as count FROM leader_profile').get().count;
  const countDivisions = db.prepare('SELECT COUNT(*) as count FROM divisions').get().count;
  const countMembers = db.prepare('SELECT COUNT(*) as count FROM members').get().count;
  const countPrograms = db.prepare('SELECT COUNT(*) as count FROM division_programs').get().count;
  const countTimeline = db.prepare('SELECT COUNT(*) as count FROM timeline_events').get().count;
  const countEvents = db.prepare('SELECT COUNT(*) as count FROM events').get().count;
  const countArticles = db.prepare('SELECT COUNT(*) as count FROM articles').get().count;
  const countAspirations = db.prepare('SELECT COUNT(*) as count FROM aspirations').get().count;

  console.log(`   - Users / Admin: ${countUsers} akun`);
  console.log(`   - Profil Organisasi: ${countOrg} record`);
  console.log(`   - Profil Ketua Umum: ${countLeader} record`);
  console.log(`   - Divisi: ${countDivisions} divisi`);
  console.log(`   - Pengurus: ${countMembers} orang`);
  console.log(`   - Program Kerja Divisi: ${countPrograms} proker`);
  console.log(`   - Milestone Timeline: ${countTimeline} peristiwa`);
  console.log(`   - Acara / Agenda: ${countEvents} kegiatan`);
  console.log(`   - Artikel & Rilis Pers: ${countArticles} artikel`);
  console.log(`   - Aspirasi Masuk: ${countAspirations} aspirasi`);

  console.log('\n✨ Database siap digunakan untuk development maupun production!');
  console.log('------------------------------------------------------------');
} catch (error) {
  console.error('❌ Gagal menginisialisasi database:', error);
  process.exit(1);
} finally {
  db.close();
}
