// ─────────────────────────────────────────────────────────────────────────────
// Data halaman detail Bidang Studi (IPA / IPS).
// Dipakai oleh app/jurusan/ipa/page.tsx & app/jurusan/ips/page.tsx lewat
// komponen <JurusanDetail />.
// ─────────────────────────────────────────────────────────────────────────────

export type JurusanSlug = 'ipa' | 'ips';

export type JurusanDetailData = {
  slug: JurusanSlug;
  kode: 'IPA' | 'IPS';
  nama: string;
  heroImg: string;
  heroFallback: string;
  /** Kalimat pembuka singkat di hero. */
  kicker: string;
  /** Paragraf "Apa itu ...?" (boleh beberapa paragraf, pisah dengan \n\n). */
  intro: string;
  stats: { angka: string; label: string }[];
  mapel: { label: string; desc: string }[];
  alasan: { label: string; desc: string }[];
  profesi: string[];
};

export const JURUSAN_DETAIL: Record<JurusanSlug, JurusanDetailData> = {
  ipa: {
    slug: 'ipa',
    kode: 'IPA',
    nama: 'Ilmu Pengetahuan Alam',
    heroImg: '/images/ipa.jpg',
    heroFallback:
      'https://images.unsplash.com/photo-1532094349884-543bc11b234d?w=1200&q=80',
    kicker: 'Untuk kamu yang senang meneliti, mengamati, dan memecahkan masalah.',
    intro: `Ilmu Pengetahuan Alam (IPA) adalah peminatan yang mempelajari berbagai fenomena alam melalui pendekatan ilmiah. Di sini kamu akan memahami bagaimana makhluk hidup, materi, energi, dan alam semesta bekerja — berdasarkan teori sekaligus praktik yang terstruktur.

Pembelajaran menekankan kegiatan laboratorium, pengamatan langsung, dan penelitian sederhana, sehingga kamu terbiasa berpikir sistematis dan mengambil kesimpulan dari data.`,
    stats: [
      { angka: '6', label: 'Mata Pelajaran Inti' },
      { angka: '3', label: 'Praktikum / Minggu' },
      { angka: '72', label: 'Kuota / Tahun' },
    ],
    mapel: [
      {
        label: 'Biologi',
        desc: 'Mempelajari makhluk hidup, sistem organ, genetika, ekologi, dan bioteknologi.',
      },
      {
        label: 'Fisika',
        desc: 'Mempelajari gaya, gerak, energi, listrik, gelombang, dan hukum-hukum alam.',
      },
      {
        label: 'Kimia',
        desc: 'Mempelajari unsur, senyawa, reaksi kimia, dan proses yang terjadi pada materi.',
      },
      {
        label: 'Matematika Peminatan',
        desc: 'Kalkulus, trigonometri lanjut, dan statistika sebagai alat bantu analisis sains.',
      },
      {
        label: 'Praktikum Laboratorium',
        desc: 'Melakukan eksperimen untuk membuktikan konsep ilmiah secara langsung dan aman.',
      },
      {
        label: 'Penelitian Ilmiah',
        desc: 'Melatih kemampuan mengamati, menyusun hipotesis, menganalisis data, dan membuat laporan.',
      },
    ],
    alasan: [
      {
        label: 'Melatih berpikir logis',
        desc: 'Kamu terbiasa memahami masalah secara sistematis dan berdasarkan fakta, bukan asumsi.',
      },
      {
        label: 'Banyak kegiatan praktikum',
        desc: 'Belajar tidak hanya teori — kamu langsung mencoba di laboratorium.',
      },
      {
        label: 'Peluang kuliah luas',
        desc: 'Terbuka ke jurusan kedokteran, farmasi, teknik, MIPA, pertanian, dan teknologi.',
      },
      {
        label: 'Kemampuan analisis kuat',
        desc: 'Cocok untuk kamu yang senang meneliti, mengukur, dan memecahkan persoalan.',
      },
    ],
    profesi: [
      'Dokter',
      'Apoteker',
      'Perawat',
      'Insinyur',
      'Ahli Biologi',
      'Ahli Kimia',
      'Peneliti',
      'Data Scientist',
      'Ahli Gizi',
      'Guru Sains',
    ],
  },

  ips: {
    slug: 'ips',
    kode: 'IPS',
    nama: 'Ilmu Pengetahuan Sosial',
    heroImg: '/images/ips.jpg',
    heroFallback:
      'https://images.unsplash.com/photo-1521737604893-d14cc237f11d?w=1200&q=80',
    kicker: 'Untuk kamu yang tertarik pada manusia, masyarakat, dan dinamikanya.',
    intro: `Ilmu Pengetahuan Sosial (IPS) adalah peminatan untuk kamu yang ingin menggali lebih dalam kehidupan sosial, ekonomi, dan budaya. Kamu akan mempelajari bagaimana masyarakat terbentuk, bagaimana keputusan ekonomi diambil, dan bagaimana peristiwa masa lalu membentuk keadaan hari ini.

Pembelajaran banyak menggunakan diskusi, studi kasus, dan analisis isu nyata, sehingga kemampuan komunikasi dan berpikir kritismu ikut terasah.`,
    stats: [
      { angka: '5', label: 'Mata Pelajaran Inti' },
      { angka: '4', label: 'Studi Kasus / Bulan' },
      { angka: '72', label: 'Kuota / Tahun' },
    ],
    mapel: [
      {
        label: 'Ekonomi',
        desc: 'Bagaimana manusia memenuhi kebutuhan lewat produksi, distribusi, dan konsumsi — termasuk akuntansi dasar.',
      },
      {
        label: 'Geografi',
        desc: 'Bumi, manusia, dan interaksinya: persebaran penduduk, sumber daya alam, dan mitigasi bencana.',
      },
      {
        label: 'Sejarah',
        desc: 'Menelusuri jejak peradaban manusia dan belajar dari keberhasilan serta kesalahan masa lampau.',
      },
      {
        label: 'Sosiologi',
        desc: 'Mengkaji perilaku sosial manusia dalam kelompok, masyarakat, dan institusi.',
      },
      {
        label: 'Antropologi & Kajian Isu',
        desc: 'Memahami keragaman budaya serta menganalisis isu sosial yang sedang berkembang.',
      },
    ],
    alasan: [
      {
        label: 'Peka terhadap isu sosial',
        desc: 'Kamu lebih memahami masalah di sekitarmu dan terlatih menawarkan solusi.',
      },
      {
        label: 'Kemampuan komunikasi terasah',
        desc: 'Banyak diskusi dan presentasi melatihmu menyampaikan ide dan bernegosiasi.',
      },
      {
        label: 'Peluang karier yang luas',
        desc: 'Dari pemerintahan, bisnis, hukum, hingga media dan hubungan internasional.',
      },
      {
        label: 'Berpikir kritis & kontekstual',
        desc: 'Kamu belajar melihat sebuah masalah dari sisi ekonomi, sosial, dan sejarah sekaligus.',
      },
    ],
    profesi: [
      'Ekonom',
      'Diplomat',
      'Pengacara',
      'Jurnalis',
      'Akuntan',
      'HRD',
      'Analis Kebijakan',
      'Sosiolog',
      'Marketing',
      'Content Creator',
    ],
  },
};
