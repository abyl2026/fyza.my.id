const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding database via Prisma...');

  const passwordHabil = bcrypt.hashSync('AdminCakrawala2026!', 10);
  const passwordRedaksi = bcrypt.hashSync('Redaksi2026!', 10);

  // 1. Users
  const user1 = await prisma.user.upsert({
    where: { email: 'habil@bapemacakrawala.org' },
    update: {
      passwordHash: passwordHabil,
      role: 'master_admin',
    },
    create: {
      name: 'Habil',
      email: 'habil@bapemacakrawala.org',
      passwordHash: passwordHabil,
      role: 'master_admin',
      avatarUrl: '/assets/avatars/habil.jpg',
    },
  });

  const user2 = await prisma.user.upsert({
    where: { email: 'redaksi@bapemacakrawala.org' },
    update: {
      passwordHash: passwordRedaksi,
      role: 'admin',
    },
    create: {
      name: 'Staf Redaksi BAPEMA',
      email: 'redaksi@bapemacakrawala.org',
      passwordHash: passwordRedaksi,
      role: 'admin',
      avatarUrl: '/assets/avatars/redaksi.jpg',
    },
  });

  console.log('✅ Users seeded:');
  console.log('   - Master Admin: habil@bapemacakrawala.org');
  console.log('   - Admin: redaksi@bapemacakrawala.org');

  // 2. Organization Profile
  const orgCount = await prisma.organizationProfile.count();
  if (orgCount === 0) {
    await prisma.organizationProfile.create({
      data: {
        orgName: 'BAPEMA Cakrawala Universitas Muhammadiyah Jakarta',
        shortName: 'BAPEMA Cakrawala UMJ',
        tagline: 'Suara Cakrawala, Suara Mahasiswa!',
        motto: 'Suara Cakrawala, Suara Mahasiswa!',
        mottoDescription:
          'Motto ini menjadi kompas integritas dalam memberitakan kebenaran dan menjadi garda terdepan aspirasi BAPEMA Cakrawala UMJ.',
        vision:
          'Menjadi Lembaga Pers Mahasiswa yang independen, kritis, berintegritas, dan inovatif dalam memajukan literasi serta mengawal dinamika sosial kemahasiswaan di lingkungan Universitas Muhammadiyah Jakarta.',
        mission: JSON.stringify([
          'Melaksanakan peliputan berita yang faktual, berimbang, objektif, dan berpegang teguh pada kode etik jurnalistik.',
          'Menjadi wadah representatif penyalur aspirasi seluruh sivitas akademika mahasiswa UMJ secara konsisten.',
          'Memproduksi konten edukasi, jurnalisme warga, dan karya literasi berkualitas tinggi baik dalam format digital maupun cetak.',
          'Membangun budaya literasi kampus yang kritis, inklusif, dan adaptif terhadap perkembangan teknologi informasi.',
        ]),
        aboutText:
          'BAPEMA Cakrawala UMJ adalah Lembaga Pers Mahasiswa (LPM) yang bergerak di bidang jurnalistik, media informasi, penerbitan, dan literasi di lingkungan Universitas Muhammadiyah Jakarta. Organisasi ini berfokus pada peliputan berita kampus dan isu sosial, penyaluran aspirasi mahasiswa, serta produksi konten edukasi dan karya literasi berbasis digital maupun cetak.',
        logoUrl: '/assets/branding/logo_cakrawala.png',
        email: 'kontak@bapemacakrawala.org',
        phone: '+62 812-3456-7890',
        address:
          'Gedung Student Center Lt. 2, Kampus Universitas Muhammadiyah Jakarta, Jl. K.H. Ahmad Dahlan, Cireundeu, Ciputat Timur, Tangerang Selatan',
        instagramUrl: 'https://instagram.com/bapemacakrawalaumj',
        linkedinUrl: 'https://linkedin.com/company/bapema-cakrawala-umj',
        youtubeUrl: 'https://youtube.com/@bapemacakrawalaumj',
        twitterUrl: 'https://x.com/bapemacakrawala',
      },
    });
    console.log('✅ Profil Organisasi seeded.');
  }

  // 3. Leader Profile
  const leaderCount = await prisma.leaderProfile.count();
  if (leaderCount === 0) {
    await prisma.leaderProfile.create({
      data: {
        name: 'Ahmad Rayhan Al-Fatih',
        period: 'Periode 2026/2027',
        quote:
          'Pers mahasiswa adalah mata dan telinga nurani kampus. Di tengah derasnya arus disinformasi, BAPEMA Cakrawala berkomitmen menjaga marwah jurnalisme yang berpihak pada kebenaran faktual dan martabat mahasiswa.',
        photoUrl: '/assets/images/ketua_umum.jpg',
        instagramUrl: 'https://instagram.com/rayhanalfatih',
        linkedinUrl: 'https://linkedin.com/in/rayhanalfatih',
        isActive: 1,
      },
    });
    console.log('✅ Profil Ketua Umum seeded.');
  }

  // 4. Divisions & Members & Programs
  const divCount = await prisma.division.count();
  if (divCount === 0) {
    const div1 = await prisma.division.create({
      data: {
        name: 'Redaksi & Peliputan Berita',
        slug: 'redaksi-peliputan',
        description: 'Bertanggung jawab atas riset, investigasi, wawancara, dan penulisan berita.',
        sortOrder: 1,
        members: {
          create: [
            {
              name: 'Fatimah Az-Zahra',
              position: 'Pemimpin Redaksi',
              photoUrl: '/assets/team/fatimah.jpg',
              instagramUrl: 'https://instagram.com/fatimah',
              linkedinUrl: 'https://linkedin.com/in/fatimah',
              sortOrder: 1,
            },
            {
              name: 'Dimas Prasetyo',
              position: 'Redaktur Pelaksana',
              photoUrl: '/assets/team/dimas.jpg',
              instagramUrl: 'https://instagram.com/dimas',
              linkedinUrl: 'https://linkedin.com/in/dimas',
              sortOrder: 2,
            },
          ],
        },
        programs: {
          create: [
            {
              name: 'Liputan Investigasi Isu Kampus',
              description: 'Peliputan mendalam mengenai fasilitas dan dinamika akademik UMJ.',
              targetOutput: 'Laporan investigasi komprehensif dua bulanan.',
            },
            {
              name: 'Penerbitan Buletin Cakrawala Edisi Khusus',
              description: 'Penerbitan karya jurnalistik dalam bentuk buletin cetak dan digital.',
              targetOutput: 'E-Magazine per semester.',
            },
          ],
        },
      },
    });

    const div2 = await prisma.division.create({
      data: {
        name: 'Media Kreatif & Multimedia',
        slug: 'media-kreatif',
        description: 'Mengelola visual branding, desain grafis, dan konten multimedia.',
        sortOrder: 2,
        members: {
          create: [
            {
              name: 'Nabila Choirunnisa',
              position: 'Kepala Divisi Media Kreatif',
              photoUrl: '/assets/team/nabila.jpg',
              sortOrder: 1,
            },
          ],
        },
        programs: {
          create: [
            {
              name: 'Cakrawala Podcast & Video Essay',
              description: 'Produksi konten siaran audio visual membahas opini dan bedah buku.',
              targetOutput: '1 episode per bulan di YouTube.',
            },
          ],
        },
      },
    });

    console.log('✅ Divisi, Pengurus & Proker seeded.');
  }

  // 5. Timeline Events
  const timelineCount = await prisma.timelineEvent.count();
  if (timelineCount === 0) {
    await prisma.timelineEvent.createMany({
      data: [
        {
          year: '2001',
          title: 'Deklarasi Pendirian BAPEMA Cakrawala',
          description: 'Didirikan oleh sekelompok mahasiswa kritis Universitas Muhammadiyah Jakarta.',
          sortOrder: 1,
        },
        {
          year: '2010',
          title: 'Peluncuran Buletin Cetak Perdana',
          description: 'Menerbitkan edisi cetak fisik perdana ke seluruh fakultas UMJ.',
          sortOrder: 2,
        },
        {
          year: '2026',
          title: 'Peluncuran Portal Terpadu & Kotak Aspirasi Modern',
          description: 'Pembaruan menyeluruh ekosistem digital BAPEMA Cakrawala dengan integrasi CMS.',
          sortOrder: 3,
        },
      ],
    });
    console.log('✅ Timeline Events seeded.');
  }

  // 6. Events
  const eventsCount = await prisma.event.count();
  if (eventsCount === 0) {
    await prisma.event.createMany({
      data: [
        {
          title: 'Pelatihan Jurnalistik Tingkat Dasar (PJTD) 2026',
          slug: 'pjtd-2026',
          shortSummary: 'Pelatihan dasar investigasi jurnalistik dan etika pers mahasiswa bersama praktisi media nasional.',
          description: 'Pelatihan Jurnalistik Tingkat Dasar (PJTD) adalah agenda tahunan unggulan BAPEMA Cakrawala UMJ untuk membina generasi jurnalis muda berintegritas.',
          eventDate: new Date('2026-11-15T08:30:00Z'),
          location: 'Auditorium Kasman Singodimedjo, FISIP UMJ',
          imageUrl: 'https://images.unsplash.com/photo-1544531586-fde5298cdd40?w=800&auto=format&fit=crop&q=80',
          importantLink: 'https://bit.ly/DaftarPJTD2026',
          status: 'published',
          isFeatured: 1,
          createdBy: user1.id,
        },
        {
          title: 'Festival Literasi & Pameran Karya Foto Jurnalistik Kampus',
          slug: 'festival-literasi-kampus-2026',
          shortSummary: 'Pameran foto jurnalistik dinamika mahasiswa, bedah buku sastra, dan diskusi publik.',
          description: 'Pameran akbar yang mempertemukan pegiat pers mahasiswa se-Jabodetabek.',
          eventDate: new Date('2026-12-05T09:00:00Z'),
          location: 'Plaza Utama Kampus UMJ Cireundeu',
          imageUrl: 'https://images.unsplash.com/photo-1511578314322-379afb476865?w=800&auto=format&fit=crop&q=80',
          importantLink: 'https://bapemacakrawala.org/festival-literasi',
          status: 'published',
          isFeatured: 1,
          createdBy: user1.id,
        },
      ],
    });
    console.log('✅ Events seeded.');
  }

  // 7. Articles
  const articlesCount = await prisma.article.count();
  if (articlesCount === 0) {
    await prisma.article.createMany({
      data: [
        {
          title: 'Meneguhkan Independensi: Menatap Peran Pers Mahasiswa di Tengah Polarisasi Kampus',
          slug: 'meneguhkan-independensi-pers-mahasiswa',
          excerpt: 'Sorotan utama mengenai urgensi independensi editorial Lembaga Pers Mahasiswa dalam mengawal kebijakan kampus tanpa intervensi.',
          content: '<p>Kebebasan berpendapat dan independensi jurnalisme kampus merupakan barometer utama sehatnya iklim demokrasi di perguruan tinggi. Sebagai Lembaga Pers Mahasiswa (LPM), <strong>BAPEMA Cakrawala UMJ</strong> senantiasa menjunjung tinggi prinsip keberimbangan, akurasi, dan keberpihakan pada suara nurani mahasiswa.</p><p>Dalam setiap lembar liputan yang diterbitkan, kami percaya bahwa kebenaran harus disuarakan dengan santun, teruji, dan berlandaskan fakta yang dapat dipertanggungjawabkan.</p>',
          coverImageUrl: 'https://images.unsplash.com/photo-1504711434969-e33886168f5c?w=800&auto=format&fit=crop&q=80',
          category: 'Liputan Khusus',
          authorName: 'Fatimah Az-Zahra',
          status: 'published',
          isTop: 1,
          viewsCount: 450,
          createdBy: user1.id,
          publishedAt: new Date('2026-10-01T11:00:00Z'),
        },
        {
          title: 'Mengawal Transparansi Fasilitas Kampus: Catatan Kritis Mahasiswa UMJ',
          slug: 'mengawal-transparansi-fasilitas-kampus',
          excerpt: 'Investigasi lapangan tim Cakrawala terhadap pemerataan sarana prasarana laboratorium dan ruang kuliah.',
          content: '<p>Aspirasi mahasiswa mengenai peremajaan fasilitas ruang kuliah dan kecepatan akses internet di area kampus dijawab dengan riset lapangan oleh tim redaksi BAPEMA Cakrawala.</p>',
          coverImageUrl: 'https://images.unsplash.com/photo-1497633762265-9d179a990aa6?w=800&auto=format&fit=crop&q=80',
          category: 'Berita Kampus',
          authorName: 'Dimas Prasetyo',
          status: 'published',
          isTop: 0,
          viewsCount: 215,
          createdBy: user1.id,
          publishedAt: new Date('2026-10-02T08:30:00Z'),
        },
      ],
    });
    console.log('✅ Articles seeded.');
  }

  // 8. Aspirations
  const aspCount = await prisma.aspiration.count();
  if (aspCount === 0) {
    await prisma.aspiration.createMany({
      data: [
        {
          fullName: 'Muhammad Ihsan',
          senderType: 'mahasiswa_umj',
          faculty: 'Fakultas Ilmu Sosial dan Ilmu Politik (FISIP)',
          major: 'Ilmu Komunikasi',
          aspirationContent: 'Mohon agar jam operasional perpustakaan pusat dapat diperpanjang hingga pukul 20.00 WIB menjelang masa UAS.',
          status: 'new',
        },
        {
          fullName: 'Budi Santoso',
          senderType: 'umum',
          aspirationContent: 'Keren sekali BAPEMA Cakrawala sudah punya portal website yang sangat profesional. Semoga terus istiqomah menyuarakan nilai-nilai kemanusiaan.',
          status: 'reviewed',
        },
      ],
    });
    console.log('✅ Aspirations seeded.');
  }

  console.log('🎉 Seeding complete!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
