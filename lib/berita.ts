import { sql } from './db';

// ── Tipe yang dipakai UI ────────────────────────────────────────────────────
export type BeritaItem = {
  id: number;
  href: string;          // /berita/<slug>
  slug: string;
  tanggal: string;       // ISO (YYYY-MM-DD) — buat sorting
  tanggalLabel: string;  // "18 Agustus 2026" — buat tampilan
  kategori: string;
  judul: string;
  ringkasan: string;
  foto: string;
  konten: string[];      // tiap elemen = 1 paragraf
  published: boolean;
};

export const KATEGORI_COLOR: Record<string, string> = {
  Prestasi: '#C8973A',
  Kegiatan: '#16A34A',
  Pengumuman: '#1E3A5F',
};

export const BERITA_KATEGORI = ['Prestasi', 'Kegiatan', 'Pengumuman'] as const;

// ── Helper ─────────────────────────────────────────────────────────────────
function toISODate(v: unknown): string {
  if (v instanceof Date) return v.toISOString().slice(0, 10);
  return String(v).slice(0, 10);
}

function labelTanggal(iso: string): string {
  const d = new Date(iso + 'T00:00:00');
  if (Number.isNaN(d.getTime())) return iso;
  return new Intl.DateTimeFormat('id-ID', { day: 'numeric', month: 'long', year: 'numeric' }).format(d);
}

function splitParagraf(konten: string): string[] {
  return konten
    .split(/\n\s*\n/)
    .map((p) => p.trim())
    .filter(Boolean);
}

/* eslint-disable @typescript-eslint/no-explicit-any */
export function rowToBerita(r: any): BeritaItem {
  const iso = toISODate(r.tanggal);
  return {
    id: Number(r.id),
    slug: r.slug,
    href: `/berita/${r.slug}`,
    tanggal: iso,
    tanggalLabel: labelTanggal(iso),
    kategori: r.kategori ?? 'Kegiatan',
    judul: r.judul ?? '',
    ringkasan: r.ringkasan ?? '',
    foto: r.foto ?? '',
    konten: splitParagraf(r.konten ?? ''),
    published: r.published !== false,
  };
}
/* eslint-enable @typescript-eslint/no-explicit-any */

// ── Data statis cadangan (dipakai kalau DATABASE_URL belum di-set) ──────────
// Ringkas saja; sumber lengkap ada di db/schema.sql.
const SEED: BeritaItem[] = [
  {
    slug: 'futsal-juara-1-sejabodetabek', tanggal: '2026-08-18', kategori: 'Prestasi',
    judul: 'Tim Futsal SMK Citra Negara Raih Juara 1 Se-Jabodetabek',
    ringkasan: 'Tim futsal putra sekolah menutup turnamen Ultimate Futsal Championship dengan kemenangan di partai final dan membawa pulang trofi juara pertama.',
    foto: '/images/futsalcn1.jpg',
    konten:
      'Tim futsal putra SMK Citra Negara berhasil menjadi yang terbaik pada turnamen Ultimate Futsal Championship tingkat Jabodetabek. Di partai final yang berlangsung sengit, tim sekolah tampil dominan dan memastikan gelar juara pertama.\n\nPerjalanan tim menuju gelar juara tidak mudah. Sejak babak penyisihan, tim harus menghadapi lawan-lawan tangguh dari berbagai sekolah, termasuk juara bertahan turnamen musim sebelumnya yang berhasil disingkirkan di babak semifinal.\n\nKeberhasilan ini merupakan hasil dari latihan rutin, kekompakan tim, serta dukungan penuh sekolah berupa fasilitas lapangan dan pendampingan pelatih.',
  },
  {
    slug: 'paskibra-upacara-hut-ri', tanggal: '2026-08-17', kategori: 'Kegiatan',
    judul: 'Paskibra Sekolah Bertugas pada Upacara HUT Kemerdekaan RI',
    ringkasan: 'Anggota Paskibra SMK Citra Negara dipercaya menjadi petugas pengibar bendera pada upacara peringatan HUT ke-81 Republik Indonesia di lingkungan sekolah.',
    foto: '/images/paskibra.jpg',
    konten:
      'Peringatan Hari Ulang Tahun ke-81 Kemerdekaan Republik Indonesia di SMK Citra Negara berlangsung khidmat. Upacara bendera diikuti oleh seluruh siswa, guru, dan staf.\n\nPara petugas telah menjalani latihan intensif selama beberapa pekan sebelum hari pelaksanaan, meliputi baris-berbaris, formasi, dan tata cara pengibaran bendera sesuai standar.\n\nKepala Sekolah dalam amanatnya mengajak seluruh warga sekolah untuk memaknai kemerdekaan dengan terus belajar, berkarya, dan menjaga persatuan.',
  },
  {
    slug: 'spmb-2027-2028-dibuka', tanggal: '2026-08-12', kategori: 'Pengumuman',
    judul: 'SPMB Tahun Ajaran 2027/2028 Resmi Dibuka',
    ringkasan: 'Sistem Penerimaan Peserta Didik Baru untuk tahun ajaran 2027/2028 dibuka dalam tiga gelombang. Kuota tiap jurusan terbatas.',
    foto: '/images/logosma.png',
    konten:
      'SMK Citra Negara mengumumkan dibukanya Sistem Penerimaan Peserta Didik Baru (SPMB) untuk tahun ajaran 2027/2028. Pendaftaran dibagi ke dalam tiga gelombang.\n\nSeluruh proses pendaftaran dilakukan secara online melalui halaman SPMB di website resmi sekolah.\n\nPanitia mengingatkan bahwa kuota tiap jurusan bersifat terbatas dan pendaftaran masing-masing gelombang akan ditutup begitu jadwalnya berakhir.',
  },
  {
    slug: 'dance-juara-battle-in-style', tanggal: '2026-06-30', kategori: 'Prestasi',
    judul: 'Ekskul Dance Sabet Juara 1 Battle in Style Dance Competition',
    ringkasan: 'Tim dance sekolah tampil memukau di panggung Garena Youth Championship dan keluar sebagai juara pertama kategori pelajar.',
    foto: '/images/juaranusabeast.jpg',
    konten:
      'Tim dance SMK Citra Negara kembali mengharumkan nama sekolah setelah meraih Juara 1 pada ajang Battle in Style Dance Competition.\n\nDengan koreografi yang enerjik dan kekompakan gerakan, tim berhasil memikat dewan juri dan penonton.\n\nPrestasi ini menjadi bukti bahwa kegiatan ekstrakurikuler seni di sekolah mampu bersaing di tingkat kompetisi.',
  },
  {
    slug: 'workshop-praktisi-industri-pplg-tjkt', tanggal: '2026-06-10', kategori: 'Kegiatan',
    judul: 'Workshop Bersama Praktisi Industri untuk Siswa PPLG dan TJKT',
    ringkasan: 'Praktisi dari perusahaan teknologi berbagi pengalaman kerja nyata dan tren terbaru kepada siswa jurusan PPLG dan TJKT.',
    foto: '/images/gakuen.jpg',
    konten:
      'SMK Citra Negara menghadirkan praktisi dari industri teknologi dalam sebuah workshop khusus bagi siswa jurusan PPLG serta TJKT.\n\nNarasumber memaparkan gambaran nyata dunia kerja di bidang teknologi.\n\nMelalui kegiatan ini, sekolah berupaya menjembatani materi pembelajaran di kelas dengan kebutuhan industri.',
  },
  {
    slug: 'olimpiade-bahasa-indonesia-medali-perak', tanggal: '2026-05-20', kategori: 'Pengumuman',
    judul: 'Siswa Raih Predikat A dan Medali Perak Olimpiade Bahasa Indonesia',
    ringkasan: 'Siswa SMK Citra Negara meraih predikat A sekaligus medali perak pada Olimpiade Bahasa Indonesia tingkat nasional.',
    foto: '/images/olimsma.jpg',
    konten:
      'Kabar membanggakan datang dari bidang akademik. Siswa SMK Citra Negara berhasil meraih predikat A sekaligus medali perak pada Olimpiade Bahasa Indonesia tingkat nasional.\n\nPersiapan dilakukan melalui pembinaan rutin bersama guru pendamping.\n\nSekolah berharap capaian ini memotivasi lebih banyak siswa untuk aktif mengikuti kompetisi akademik.',
  },
].map((s, i) => ({
  ...s,
  id: i + 1,
  href: `/berita/${s.slug}`,
  tanggalLabel: labelTanggal(s.tanggal),
  konten: splitParagraf(s.konten as unknown as string),
  published: true,
}));

// ── Query ──────────────────────────────────────────────────────────────────
export async function getBeritaList(opts: { includeUnpublished?: boolean } = {}): Promise<BeritaItem[]> {
  if (!sql) return SEED;
  const rows = opts.includeUnpublished
    ? await sql`SELECT * FROM berita ORDER BY tanggal DESC, id DESC`
    : await sql`SELECT * FROM berita WHERE published = TRUE ORDER BY tanggal DESC, id DESC`;
  return rows.map(rowToBerita);
}

export async function getBeritaBySlug(slug: string): Promise<BeritaItem | null> {
  if (!sql) return SEED.find((b) => b.slug === slug) ?? null;
  const rows = await sql`SELECT * FROM berita WHERE slug = ${slug} LIMIT 1`;
  return rows[0] ? rowToBerita(rows[0]) : null;
}

export async function getBeritaById(id: number): Promise<BeritaItem | null> {
  if (!sql) return SEED.find((b) => b.id === id) ?? null;
  const rows = await sql`SELECT * FROM berita WHERE id = ${id} LIMIT 1`;
  return rows[0] ? rowToBerita(rows[0]) : null;
}

// ── Util slug ──────────────────────────────────────────────────────────────
export function slugify(input: string): string {
  return input
    .toLowerCase()
    .normalize('NFKD')
    .replace(/[̀-ͯ]/g, '') // buang tanda diakritik
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 80);
}
