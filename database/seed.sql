-- ==============================================================================
-- DATABASE SEED DATA: BAPEMA CAKRAWALA UMJ
-- Data Awal Realistis Sesuai Kebutuhan PRD & Profil Organisasi
-- ==============================================================================

-- 1. SEED USERS (Admin & Master Admin)
-- Password default: 'AdminCakrawala2026!' (bcrypt hash placeholder atau dev token)
INSERT INTO users (id, name, email, password_hash, role, avatar_url, created_at, updated_at)
VALUES 
(1, 'Habil', 'habil@bapemacakrawala.org', '$2b$10$wKxL7YkI1tM3v6Fk5f9XzeX4lM7J1yY5U8wT6Q1xP9L3K8V4nO2eW', 'master_admin', '/assets/avatars/habil.jpg', '2026-10-01 08:00:00', '2026-10-01 08:00:00'),
(2, 'Staf Redaksi BAPEMA', 'redaksi@bapemacakrawala.org', '$2b$10$wKxL7YkI1tM3v6Fk5f9XzeX4lM7J1yY5U8wT6Q1xP9L3K8V4nO2eW', 'admin', '/assets/avatars/redaksi.jpg', '2026-10-01 08:30:00', '2026-10-01 08:30:00');

-- 2. SEED ORGANIZATION PROFILE
INSERT INTO organization_profile (
  id, org_name, short_name, tagline, motto, motto_description, vision, mission, about_text,
  logo_url, email, phone, address, instagram_url, linkedin_url, youtube_url, twitter_url, updated_at
) VALUES (
  1,
  'BAPEMA Cakrawala Universitas Muhammadiyah Jakarta',
  'BAPEMA Cakrawala UMJ',
  'Suara Cakrawala, Suara Mahasiswa!',
  'Suara Cakrawala, Suara Mahasiswa!',
  'Motto ini menjadi kompas integritas dalam memberitakan kebenaran dan menjadi garda terdepan aspirasi BAPEMA Cakrawala UMJ.',
  'Menjadi Lembaga Pers Mahasiswa yang independen, kritis, berintegritas, dan inovatif dalam memajukan literasi serta mengawal dinamika sosial kemahasiswaan di lingkungan Universitas Muhammadiyah Jakarta.',
  '["Melaksanakan peliputan berita yang faktual, berimbang, objektif, dan berpegang teguh pada kode etik jurnalistik.", "Menjadi wadah representatif penyalur aspirasi seluruh sivitas akademika mahasiswa UMJ secara konsisten.", "Memproduksi konten edukasi, jurnalisme warga, dan karya literasi berkualitas tinggi baik dalam format digital maupun cetak.", "Membangun budaya literasi kampus yang kritis, inklusif, dan adaptif terhadap perkembangan teknologi informasi."]',
  'BAPEMA Cakrawala UMJ adalah Lembaga Pers Mahasiswa (LPM) yang bergerak di bidang jurnalistik, media informasi, penerbitan, dan literasi di lingkungan Universitas Muhammadiyah Jakarta. Organisasi ini berfokus pada peliputan berita kampus dan isu sosial, penyaluran aspirasi mahasiswa, serta produksi konten edukasi dan karya literasi berbasis digital maupun cetak.',
  '/assets/branding/logo_cakrawala.png',
  'kontak@bapemacakrawala.org',
  '+62 812-3456-7890',
  'Gedung Student Center Lt. 2, Kampus Universitas Muhammadiyah Jakarta, Jl. K.H. Ahmad Dahlan, Cireundeu, Ciputat Timur, Tangerang Selatan',
  'https://instagram.com/bapemacakrawalaumj',
  'https://linkedin.com/company/bapema-cakrawala-umj',
  'https://youtube.com/@bapemacakrawalaumj',
  'https://x.com/bapemacakrawala',
  '2026-10-01 09:00:00'
);

-- 3. SEED LEADER PROFILE (Ketua Umum)
INSERT INTO leader_profile (
  id, name, position, period, quote, photo_url, instagram_url, linkedin_url, is_active, updated_at
) VALUES (
  1,
  'Ahmad Rayhan Al-Fatih',
  'Ketua Umum',
  'Periode 2026/2027',
  'Pers mahasiswa adalah mata dan telinga nurani kampus. Di tengah derasnya arus disinformasi, BAPEMA Cakrawala berkomitmen menjaga marwah jurnalisme yang berpihak pada kebenaran faktual dan martabat mahasiswa.',
  '/assets/images/ketua_umum.jpg',
  'https://instagram.com/rayhanalfatih',
  'https://linkedin.com/in/rayhanalfatih',
  1,
  '2026-10-01 09:00:00'
);

-- 4. SEED DIVISIONS
INSERT INTO divisions (id, name, slug, description, sort_order, created_at, updated_at)
VALUES 
(1, 'Redaksi & Peliputan Berita', 'redaksi-peliputan', 'Bertanggung jawab atas riset, investigasi, wawancara, penulisan berita kampus, dan penyuntingan rilis pers resmi.', 1, '2026-10-01 09:10:00', '2026-10-01 09:10:00'),
(2, 'Media Kreatif & Multimedia', 'media-kreatif', 'Mengelola visual branding, desain grafis majalah/buletin, infografis berita, produksi audio visual, dan fotografi jurnalistik.', 2, '2026-10-01 09:10:00', '2026-10-01 09:10:00'),
(3, 'Hubungan Masyarakat & Kemitraan', 'humas-kemitraan', 'Menjalin relasi strategis dengan organisasi eksternal, media partner, alumni, sponsorship, serta pengelolaan kanal media sosial resmi.', 3, '2026-10-01 09:10:00', '2026-10-01 09:10:00'),
(4, 'Penelitian & Pengembangan (Litbang)', 'litbang-kaderisasi', 'Melakukan polling survei mahasiswa, riset data isu kampus, pelatihan internal jurnalistik, serta kaderisasi calon anggota baru.', 4, '2026-10-01 09:10:00', '2026-10-01 09:10:00');

-- 5. SEED MEMBERS (Pengurus per Divisi)
INSERT INTO members (id, division_id, name, position, photo_url, instagram_url, linkedin_url, sort_order, is_active, created_at, updated_at)
VALUES 
(1, 1, 'Fatimah Az-Zahra', 'Pemimpin Redaksi', '/assets/team/fatimah.jpg', 'https://instagram.com/fatimah', 'https://linkedin.com/in/fatimah', 1, 1, '2026-10-01 09:20:00', '2026-10-01 09:20:00'),
(2, 1, 'Dimas Prasetyo', 'Redaktur Pelaksana', '/assets/team/dimas.jpg', 'https://instagram.com/dimas', 'https://linkedin.com/in/dimas', 2, 1, '2026-10-01 09:20:00', '2026-10-01 09:20:00'),
(3, 2, 'Nabila Choirunnisa', 'Kepala Divisi Media Kreatif', '/assets/team/nabila.jpg', 'https://instagram.com/nabila', 'https://linkedin.com/in/nabila', 1, 1, '2026-10-01 09:20:00', '2026-10-01 09:20:00'),
(4, 2, 'Rizky Ramadhan', 'Fotografer & Desainer Grafis', '/assets/team/rizky.jpg', 'https://instagram.com/rizky', 'https://linkedin.com/in/rizky', 2, 1, '2026-10-01 09:20:00', '2026-10-01 09:20:00'),
(5, 3, 'Syifa Maulida', 'Kepala Divisi Hubungan Masyarakat', '/assets/team/syifa.jpg', 'https://instagram.com/syifa', 'https://linkedin.com/in/syifa', 1, 1, '2026-10-01 09:20:00', '2026-10-01 09:20:00'),
(6, 4, 'Bagas Dwi Santoso', 'Kepala Divisi Litbang', '/assets/team/bagas.jpg', 'https://instagram.com/bagas', 'https://linkedin.com/in/bagas', 1, 1, '2026-10-01 09:20:00', '2026-10-01 09:20:00');

-- 6. SEED DIVISION PROGRAMS (Program Kerja per Divisi)
INSERT INTO division_programs (id, division_id, name, description, target_output, created_at, updated_at)
VALUES 
(1, 1, 'Liputan Investigasi Isu Kampus', 'Program peliputan mendalam mengenai isu fasilitas akademik, transparansi anggaran kemahasiswaan, dan kebijakan birokrasi kampus.', 'Laporan investigasi komprehensif dua bulanan di portal web.', '2026-10-01 09:30:00', '2026-10-01 09:30:00'),
(2, 1, 'Penerbitan Buletin Cakrawala Edisi Khusus', 'Penerbitan karya jurnalistik dalam bentuk buletin cetak dan e-magazine interaktif.', 'E-Magazine cetak & format PDF interaktif per semester.', '2026-10-01 09:30:00', '2026-10-01 09:30:00'),
(3, 2, 'Cakrawala Podcast & Video Essay', 'Produksi konten siaran audio visual membahas opini literasi, bedah buku, dan obrolan bersama tokoh inspiratif UMJ.', '1 episode podcast YouTube & Spotify setiap bulan.', '2026-10-01 09:30:00', '2026-10-01 09:30:00'),
(4, 3, 'Cakrawala Media Partner & Roadshow', 'Kolaborasi publikasi bersama organisasi internal UMJ serta media pers mahasiswa se-Jabodetabek.', 'Jejaring publikasi minimal 20 kegiatan mitra per tahun.', '2026-10-01 09:30:00', '2026-10-01 09:30:00'),
(5, 4, 'Pelatihan Jurnalistik Tingkat Dasar (PJTD)', 'Lokakarya pembekalan teknik wawancara, etika jurnalistik pers mahasiswa, serta teknik penulisan feature bagi calon anggota.', 'Sertifikasi dan regenerasi 30+ jurnalis muda mahasiswa.', '2026-10-01 09:30:00', '2026-10-01 09:30:00');

-- 7. SEED TIMELINE EVENTS (Perjalanan Organisasi)
INSERT INTO timeline_events (id, year, title, description, image_url, sort_order, created_at, updated_at)
VALUES 
(1, '2001', 'Deklarasi Pendirian BAPEMA Cakrawala', 'Didirikan oleh sekelompok mahasiswa kritis Universitas Muhammadiyah Jakarta sebagai wadah independen pers mahasiswa.', '/assets/timeline/2001_pendirian.jpg', 1, '2026-10-01 09:40:00', '2026-10-01 09:40:00'),
(2, '2010', 'Peluncuran Buletin Cetak Perdana', 'Menerbitkan edisi cetak fisik perdana yang didistribusikan ke seluruh fakultas di lingkungan UMJ.', '/assets/timeline/2010_buletin.jpg', 2, '2026-10-01 09:40:00', '2026-10-01 09:40:00'),
(3, '2018', 'Transformasi Menuju Media Digital', 'Menginisiasi publikasi berbasis media sosial dan portal web guna memperluas jangkauan pembaca generasi milenial.', '/assets/timeline/2018_digital.jpg', 3, '2026-10-01 09:40:00', '2026-10-01 09:40:00'),
(4, '2026', 'Peluncuran Portal Terpadu & Kotak Aspirasi Modern', 'Pembaruan menyeluruh ekosistem digital BAPEMA Cakrawala dengan integrasi CMS modern dan saluran advokasi aspirasi mahasiswa.', '/assets/timeline/2026_portal.jpg', 4, '2026-10-01 09:40:00', '2026-10-01 09:40:00');

-- 8. SEED EVENTS (Agenda Unggulan & Program Kerja)
INSERT INTO events (
  id, title, slug, short_summary, description, event_date, location, image_url, important_link, status, is_featured, created_by, created_at, updated_at
) VALUES 
(
  1,
  'Pelatihan Jurnalistik Tingkat Dasar (PJTD) 2026',
  'pjtd-2026',
  'Pelatihan dasar investigasi jurnalistik dan etika pers mahasiswa bersama praktisi media nasional.',
  'Pelatihan Jurnalistik Tingkat Dasar (PJTD) adalah agenda tahunan unggulan BAPEMA Cakrawala UMJ untuk membina generasi jurnalis muda berintegritas. Menghadirkan narasumber jurnalis investigasi nasional, materi mencakup teknik reportase lapangan, fact-checking, dan penulisan narasi feature berbobot.',
  '2026-11-15 08:30:00',
  'Auditorium Kasman Singodimedjo, FISIP UMJ',
  '/assets/events/pjtd2026.jpg',
  'https://bit.ly/DaftarPJTD2026',
  'published',
  1,
  1,
  '2026-10-01 10:00:00',
  '2026-10-01 10:00:00'
),
(
  2,
  'Festival Literasi & Pameran Karya Foto Jurnalistik Kampus',
  'festival-literasi-kampus-2026',
  'Pameran foto jurnalistik dinamika mahasiswa, bedah buku sastra, dan diskusi publik.',
  'Pameran akbar yang mempertemukan pegiat pers mahasiswa se-Jabodetabek. Menampilkan dokumentasi foto-foto bersejarah dinamika mahasiswa UMJ, stan karya sastra, serta sesi bedah buku bersama penulis terkemuka.',
  '2026-12-05 09:00:00',
  'Plaza Utama Kampus UMJ Cireundeu',
  '/assets/events/festival_literasi.jpg',
  'https://bapemacakrawala.org/festival-literasi',
  'published',
  1,
  1,
  '2026-10-01 10:00:00',
  '2026-10-01 10:00:00'
),
(
  3,
  'Diskusi Publik: Kebebasan Berekspresi & Masa Depan Pers Mahasiswa',
  'diskusi-publik-kebebasan-pers-2026',
  'Webinar nasional mengupas tantangan perlindungan hukum jurnalis kampus di era digital.',
  'Diskusi interaktif menghadirkan perwakilan Lembaga Bantuan Hukum (LBH) Pers dan akademisi hukum tata negara guna menelaah posisi pers mahasiswa dalam mengawal kebijakan publik serta perlindungan privasi data.',
  '2026-12-20 13:30:00',
  'Zoom Webinar & Live Streaming YouTube Cakrawala',
  '/assets/events/diskusi_kebebasan_pers.jpg',
  'https://zoom.us/j/bapema-webinar-2026',
  'published',
  1,
  1,
  '2026-10-01 10:00:00',
  '2026-10-01 10:00:00'
),
(
  4,
  'Workshop Penulisan Opini & Esai Populer Media Massa',
  'workshop-esai-populer-2027',
  'Tips menembus meja redaksi koran nasional dan menyusun argumen akademis yang memikat.',
  'Sesi lokakarya intensif 1 hari yang mengasah ketajaman pena mahasiswa dalam mengemas gagasan akademik menjadi tulisan opini yang renyah dan persuasif untuk surat kabar harian.',
  '2027-01-18 09:00:00',
  'Ruang Multimedia Perpustakaan UMJ',
  '/assets/events/workshop_esai.jpg',
  'https://bit.ly/WorkshopEsaiCakrawala',
  'published',
  1,
  1,
  '2026-10-01 10:00:00',
  '2026-10-01 10:00:00'
);

-- 9. SEED ARTICLES (Artikel Berita & Rilis Pers)
INSERT INTO articles (
  id, title, slug, excerpt, content, cover_image_url, category, author_name, important_link, status, is_top, views_count, created_by, published_at, created_at, updated_at
) VALUES 
(
  1,
  'Meneguhkan Independensi: Menatap Peran Pers Mahasiswa di Tengah Polarisasi Kampus',
  'meneguhkan-independensi-pers-mahasiswa',
  'Sorotan utama mengenai urgensi independensi editorial Lembaga Pers Mahasiswa dalam mengawal kebijakan kampus tanpa intervensi.',
  '<p>Kebebasan berpendapat dan independensi jurnalisme kampus merupakan barometer utama sehatnya iklim demokrasi di perguruan tinggi. Sebagai Lembaga Pers Mahasiswa (LPM), <strong>BAPEMA Cakrawala UMJ</strong> senantiasa menjunjung tinggi prinsip keberimbangan, akurasi, dan keberpihakan pada suara nurani mahasiswa.</p><p>Dalam setiap lembar liputan yang diterbitkan, kami percaya bahwa kebenaran harus disuarakan dengan santun, teruji, dan berlandaskan fakta yang dapat dipertanggungjawabkan. Polarisasi opini di ruang digital tidak boleh menggoyahkan integritas pers mahasiswa sebagai kompas penjaga transparansi kampus.</p>',
  '/assets/articles/headline_independensi.jpg',
  'Liputan Khusus',
  'Fatimah Az-Zahra',
  'https://bapemacakrawala.org/artikel/meneguhkan-independensi-pers-mahasiswa',
  'published',
  1,
  450,
  1,
  '2026-10-01 11:00:00',
  '2026-10-01 11:00:00',
  '2026-10-01 11:00:00'
),
(
  2,
  'Mengawal Transparansi Fasilitas Kampus: Catatan Kritis Mahasiswa UMJ',
  'mengawal-transparansi-fasilitas-kampus',
  'Investigasi lapangan tim Cakrawala terhadap pemerataan sarana prasarana laboratorium dan ruang kuliah.',
  '<p>Aspirasi mahasiswa mengenai peremajaan fasilitas ruang kuliah dan kecepatan akses internet di area kampus dijawab dengan riset lapangan oleh tim redaksi BAPEMA Cakrawala. Tulisan ini merangkum data kuesioner mahasiswa dan tanggapan dari pihak sarana prasarana universitas.</p>',
  '/assets/articles/fasilitas_kampus.jpg',
  'Berita Kampus',
  'Dimas Prasetyo',
  NULL,
  'published',
  0,
  215,
  1,
  '2026-10-02 08:30:00',
  '2026-10-02 08:30:00',
  '2026-10-02 08:30:00'
),
(
  3,
  'Literasi Digital di Kalangan Mahasiswa: Antara Produktivitas dan Jebakan Doomscrolling',
  'literasi-digital-doomscrolling-mahasiswa',
  'Opini mendalam mengenai perubahan pola konsumsi informasi generasi muda di era media sosial instan.',
  '<p>Banjir informasi di media sosial kerap membuat mahasiswa kesulitan membedakan antara pengetahuan bermakna dan disinformasi cepat. Artikel ini mengupas pentingnya critical thinking dalam menyaring wacana di linimasa digital.</p>',
  '/assets/articles/literasi_digital.jpg',
  'Opini',
  'Ahmad Rayhan Al-Fatih',
  NULL,
  'published',
  0,
  180,
  1,
  '2026-10-02 09:15:00',
  '2026-10-02 09:15:00',
  '2026-10-02 09:15:00'
),
(
  4,
  'Rilis Pers: BAPEMA Cakrawala Resmikan Kanal Advokasi Aspirasi Terpadu',
  'rilis-pers-kanal-advokasi-aspirasi',
  'Pemberitahuan resmi peluncuran formulir aspirasi online yang langsung terhubung ke dashboard tim advokasi redaksi.',
  '<p>Universitas Muhammadiyah Jakarta — Menyikapi kebutuhan sivitas akademika akan wadah aspirasi yang cepat, aman, dan terverifikasi, BAPEMA Cakrawala UMJ resmi merilis fitur Aspirasi Kampus pada portal web resminya.</p>',
  '/assets/articles/rilis_pers_aspirasi.jpg',
  'Rilis Pers',
  'Tim Humas Cakrawala',
  NULL,
  'published',
  0,
  320,
  1,
  '2026-10-02 10:00:00',
  '2026-10-02 10:00:00',
  '2026-10-02 10:00:00'
);

-- 10. SEED ASPIRATIONS (Contoh Aspirasi Mahasiswa UMJ & Umum)
INSERT INTO aspirations (
  id, full_name, sender_type, faculty, major, aspiration_content, status, ip_address, user_agent, created_at
) VALUES 
(
  1,
  'Muhammad Ihsan',
  'mahasiswa_umj',
  'Fakultas Ilmu Sosial dan Ilmu Politik (FISIP)',
  'Ilmu Komunikasi',
  'Mohon agar jam operasional perpustakaan pusat dapat diperpanjang hingga pukul 20.00 WIB menjelang masa Ujian Akhir Semester (UAS). Banyak mahasiswa yang membutuhkan tempat tenang untuk belajar kelompok.',
  'new',
  '127.0.0.1',
  'Mozilla/5.0 (Windows NT 10.0; Win64; x64)',
  '2026-10-02 14:00:00'
),
(
  2,
  'Anisa Putri',
  'mahasiswa_umj',
  'Fakultas Teknik',
  'Teknik Informatika',
  'Apresiasi tinggi untuk liputan mendalam BAPEMA mengenai beasiswa mahasiswa berprestasi. Kalau bisa, mohon ditambahkan rubrik liputan proyek riset teknologi karya anak bangsa di UMJ.',
  'reviewed',
  '127.0.0.1',
  'Mozilla/5.0 (Windows NT 10.0; Win64; x64)',
  '2026-10-02 15:30:00'
),
(
  3,
  'Budi Santoso',
  'umum',
  NULL,
  NULL,
  'Keren sekali BAPEMA Cakrawala sudah punya portal website yang sangat profesional. Semoga terus istiqomah menyuarakan nilai-nilai kemanusiaan dan kemajuan pendidikan bangsa.',
  'reviewed',
  '127.0.0.1',
  'Mozilla/5.0 (Windows NT 10.0; Win64; x64)',
  '2026-10-02 16:45:00'
);
