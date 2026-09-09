-- ─────────────────────────────────────────────────────────────────────────────
-- Skema database SMA Citra Negara (Neon / PostgreSQL)
--
-- Cara pakai:
--   1. Buat project di https://neon.tech, salin connection string.
--   2. Taruh di .env.local  ->  DATABASE_URL="postgresql://...".
--   3. Jalankan isi file ini di Neon SQL Editor (atau: psql "$DATABASE_URL" -f db/schema.sql).
--   4. Restart `npm run dev`.
--
-- Aman dijalankan berulang: pakai IF NOT EXISTS + ON CONFLICT DO NOTHING.
-- ─────────────────────────────────────────────────────────────────────────────

-- ── Berita ──────────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS berita (
  id          SERIAL PRIMARY KEY,
  slug        TEXT UNIQUE NOT NULL,
  judul       TEXT NOT NULL,
  tanggal     DATE NOT NULL DEFAULT CURRENT_DATE,
  kategori    TEXT NOT NULL DEFAULT 'Kegiatan',
  ringkasan   TEXT NOT NULL DEFAULT '',
  konten      TEXT NOT NULL DEFAULT '',   -- antar paragraf dipisah satu baris kosong
  foto        TEXT NOT NULL DEFAULT '',   -- data URL (base64) atau path/URL gambar
  published   BOOLEAN NOT NULL DEFAULT TRUE,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at  TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS berita_tanggal_idx ON berita (tanggal DESC);

-- ── Prestasi ────────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS prestasi (
  id          SERIAL PRIMARY KEY,
  nama        TEXT NOT NULL,
  siswa       JSONB NOT NULL DEFAULT '[]'::jsonb,  -- [{ "nama": "...", "kelas": "..." }]
  tahun       INTEGER NOT NULL DEFAULT EXTRACT(YEAR FROM CURRENT_DATE),
  kategori    TEXT NOT NULL DEFAULT 'Akademik',
  tingkat     TEXT NOT NULL DEFAULT '',
  foto        TEXT NOT NULL DEFAULT '',
  deskripsi   TEXT NOT NULL DEFAULT '',
  published   BOOLEAN NOT NULL DEFAULT TRUE,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at  TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS prestasi_tahun_idx ON prestasi (tahun DESC);

-- ── Seed berita (dari data lama app/berita/data.ts) ─────────────────────────
INSERT INTO berita (slug, judul, tanggal, kategori, ringkasan, konten, foto) VALUES
(
  'futsal-juara-1-sejabodetabek',
  'Tim Futsal SMK Citra Negara Raih Juara 1 Se-Jabodetabek',
  '2026-08-18', 'Prestasi',
  'Tim futsal putra sekolah menutup turnamen Ultimate Futsal Championship dengan kemenangan di partai final dan membawa pulang trofi juara pertama.',
  E'Tim futsal putra SMK Citra Negara berhasil menjadi yang terbaik pada turnamen Ultimate Futsal Championship tingkat Jabodetabek. Di partai final yang berlangsung sengit, tim sekolah tampil dominan dan memastikan gelar juara pertama.\n\nPerjalanan tim menuju gelar juara tidak mudah. Sejak babak penyisihan, tim harus menghadapi lawan-lawan tangguh dari berbagai sekolah, termasuk juara bertahan turnamen musim sebelumnya yang berhasil disingkirkan di babak semifinal.\n\nKeberhasilan ini merupakan hasil dari latihan rutin, kekompakan tim, serta dukungan penuh sekolah berupa fasilitas lapangan dan pendampingan pelatih. Piala juara pertama pun menambah deretan prestasi olahraga SMK Citra Negara di tahun ini.',
  '/images/futsalcn1.jpg'
),
(
  'paskibra-upacara-hut-ri',
  'Paskibra Sekolah Bertugas pada Upacara HUT Kemerdekaan RI',
  '2026-08-17', 'Kegiatan',
  'Anggota Paskibra SMK Citra Negara dipercaya menjadi petugas pengibar bendera pada upacara peringatan HUT ke-81 Republik Indonesia di lingkungan sekolah.',
  E'Peringatan Hari Ulang Tahun ke-81 Kemerdekaan Republik Indonesia di SMK Citra Negara berlangsung khidmat. Upacara bendera diikuti oleh seluruh siswa, guru, dan staf, dengan bertindak sebagai petugas pengibar bendera adalah anggota ekstrakurikuler Pasukan Pengibar Bendera (Paskibra) sekolah.\n\nPara petugas telah menjalani latihan intensif selama beberapa pekan sebelum hari pelaksanaan, meliputi baris-berbaris, formasi, dan tata cara pengibaran bendera sesuai standar. Hasilnya, prosesi pengibaran bendera berjalan lancar dan rapi.\n\nKepala Sekolah dalam amanatnya mengajak seluruh warga sekolah untuk memaknai kemerdekaan dengan terus belajar, berkarya, dan menjaga persatuan. Kegiatan dilanjutkan dengan berbagai lomba antar-kelas yang meriah.',
  '/images/paskibra.jpg'
),
(
  'spmb-2027-2028-dibuka',
  'SPMB Tahun Ajaran 2027/2028 Resmi Dibuka',
  '2026-08-12', 'Pengumuman',
  'Sistem Penerimaan Peserta Didik Baru untuk tahun ajaran 2027/2028 dibuka dalam tiga gelombang. Kuota tiap jurusan terbatas.',
  E'SMK Citra Negara mengumumkan dibukanya Sistem Penerimaan Peserta Didik Baru (SPMB) untuk tahun ajaran 2027/2028. Pendaftaran dibagi ke dalam tiga gelombang agar calon siswa memiliki keleluasaan waktu tanpa mengurangi kesempatan untuk lolos seleksi.\n\nSeluruh proses pendaftaran dilakukan secara online melalui halaman SPMB di website resmi sekolah. Calon peserta didik cukup membuat akun, mengisi formulir data diri dan orang tua, memilih jurusan, lalu mengunggah berkas persyaratan dalam bentuk digital.\n\nPanitia mengingatkan bahwa kuota tiap jurusan bersifat terbatas dan pendaftaran masing-masing gelombang akan ditutup begitu jadwalnya berakhir. Informasi lengkap mengenai jadwal, biaya pendidikan, dan persyaratan dapat dilihat pada halaman SPMB.',
  '/images/logosma.png'
),
(
  'dance-juara-battle-in-style',
  'Ekskul Dance Sabet Juara 1 Battle in Style Dance Competition',
  '2026-06-30', 'Prestasi',
  'Tim dance sekolah tampil memukau di panggung Garena Youth Championship dan keluar sebagai juara pertama kategori pelajar.',
  E'Tim dance SMK Citra Negara kembali mengharumkan nama sekolah setelah meraih Juara 1 pada ajang Battle in Style Dance Competition yang menjadi bagian dari rangkaian Garena Youth Championship. Kompetisi ini diikuti oleh puluhan tim dari berbagai sekolah.\n\nDengan koreografi yang enerjik dan kekompakan gerakan, tim berhasil memikat dewan juri dan penonton. Penampilan mereka dinilai unggul dari sisi teknik, formasi, serta ekspresi panggung.\n\nPrestasi ini menjadi bukti bahwa kegiatan ekstrakurikuler seni di sekolah mampu bersaing di tingkat kompetisi dan menjadi wadah penyaluran bakat siswa secara positif.',
  '/images/juaranusabeast.jpg'
),
(
  'workshop-praktisi-industri-pplg-tjkt',
  'Workshop Bersama Praktisi Industri untuk Siswa PPLG dan TJKT',
  '2026-06-10', 'Kegiatan',
  'Praktisi dari perusahaan teknologi berbagi pengalaman kerja nyata dan tren terbaru kepada siswa jurusan PPLG dan TJKT.',
  E'SMK Citra Negara menghadirkan praktisi dari industri teknologi dalam sebuah workshop khusus bagi siswa jurusan Pengembangan Perangkat Lunak dan Gim (PPLG) serta Teknik Jaringan Komputer dan Telekomunikasi (TJKT).\n\nDalam sesi tersebut, narasumber memaparkan gambaran nyata dunia kerja di bidang teknologi, mulai dari alur pengembangan produk, standar kerja tim, hingga keterampilan yang paling dibutuhkan perusahaan saat ini.\n\nMelalui kegiatan ini, sekolah berupaya menjembatani materi pembelajaran di kelas dengan kebutuhan industri, sehingga lulusan lebih siap terjun ke dunia kerja maupun melanjutkan pendidikan.',
  '/images/gakuen.jpg'
),
(
  'olimpiade-bahasa-indonesia-medali-perak',
  'Siswa Raih Predikat A dan Medali Perak Olimpiade Bahasa Indonesia',
  '2026-05-20', 'Pengumuman',
  'Siswa SMK Citra Negara meraih predikat A sekaligus medali perak pada Olimpiade Bahasa Indonesia tingkat nasional.',
  E'Kabar membanggakan datang dari bidang akademik. Siswa SMK Citra Negara berhasil meraih predikat A sekaligus medali perak pada Olimpiade Bahasa Indonesia yang diselenggarakan tingkat nasional.\n\nPersiapan menuju olimpiade dilakukan melalui pembinaan rutin bersama guru pendamping, meliputi penguatan materi kebahasaan, latihan soal, serta pembahasan naskah dan teks kompleks.\n\nSekolah berharap capaian ini memotivasi lebih banyak siswa untuk aktif mengikuti kompetisi akademik, sekaligus menumbuhkan minat baca dan kemampuan literasi di kalangan pelajar.',
  '/images/olimsma.jpg'
)
ON CONFLICT (slug) DO NOTHING;

-- ── Seed prestasi (dari data lama app/prestasi/page.tsx) ────────────────────
INSERT INTO prestasi (nama, siswa, tahun, kategori, tingkat, foto, deskripsi) VALUES
('Juara 2 Pencak Silat Nation Series Jawa Barat',
 '[{"nama":"Rafi Maulana Syahputra","kelas":"11 Sains 1"}]'::jsonb,
 2026, 'Olahraga', 'Provinsi', '/images/silatsma1.jpg',
 'Diraih dalam ajang Nation Series Jawa Barat 2026 yang diikuti ratusan atlet dari berbagai sekolah dan perguruan pencak silat se-Jawa Barat. Lewat latihan disiplin dan semangat pantang menyerah, siswa berhasil meraih Juara 2 dan membawa nama baik sekolah.'),
('Juara 1 Taekwondo Tingkat Nasional Junior Putra',
 '[]'::jsonb, 2025, 'Olahraga', 'Nasional', '/images/tekonsma1.jpg',
 'Prestasi tingkat nasional kategori junior putra pada cabang olahraga taekwondo.'),
('Juara 1 Battle In Style Dance Competition | Garena Youth Championship',
 '[]'::jsonb, 2026, 'Seni', 'Jabodetabek', '/images/juaranusabeast.jpg',
 'Tim dance sekolah keluar sebagai juara pertama kategori pelajar pada rangkaian Garena Youth Championship.'),
('Juara Olimpiade Bahasa Indonesia Predikat A Medali Silver',
 '[]'::jsonb, 2025, 'Akademik', 'Nasional', '/images/olimsma.jpg',
 'Meraih predikat A sekaligus medali perak pada Olimpiade Bahasa Indonesia tingkat nasional.'),
('Juara Favorit Kolakarya Tingkat Jabodetabek',
 '[]'::jsonb, 2025, 'Seni', 'Jabodetabek', '/images/citter.jpg',
 'Meraih predikat Juara Favorit pada ajang Kolakarya tingkat Jabodetabek.'),
('Juara 2 Karate Kemenpora Open International Championship',
 '[]'::jsonb, 2026, 'Olahraga', 'Internasional', '/images/karatesma2.jpg',
 'Meraih Juara 2 pada Kemenpora Open International Championship cabang karate.'),
('Juara 3 Karate International Championship',
 '[]'::jsonb, 2026, 'Olahraga', 'Internasional', '/images/karatesma3.jpg',
 'Meraih Juara 3 pada International Championship cabang karate.'),
('Juara 2 Tingkat Nasional Kejuaraan ISCC3',
 '[]'::jsonb, 2025, 'Olahraga', 'Nasional', '/images/tekonsma2.jpg',
 'Meraih Juara 2 tingkat nasional pada kejuaraan ISCC3.'),
('Juara 2 Tingkat Nasional Kejuaraan ISCC3',
 '[]'::jsonb, 2025, 'Olahraga', 'Nasional', '/images/tekonsma3.jpg',
 'Meraih Juara 2 tingkat nasional pada kejuaraan ISCC3.')
ON CONFLICT DO NOTHING;
