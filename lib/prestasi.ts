import { sql } from './db';

export type Siswa = { nama: string; kelas: string };

export type PrestasiItem = {
  id: number;
  nama: string;
  siswa: Siswa[];
  tahun: number;
  kategori: string;
  tingkat: string;
  foto: string;
  deskripsi: string;
  published: boolean;
};

export const PRESTASI_KATEGORI = ['Akademik', 'Olahraga', 'Seni', 'Organisasi', 'Lainnya'] as const;

export const KATEGORI_COLOR: Record<string, string> = {
  Olahraga: '#1E3A5F',
  Seni: '#DC2626',
  Akademik: '#024d20',
  Organisasi: '#92681A',
  Lainnya: '#6B7280',
};

/* eslint-disable @typescript-eslint/no-explicit-any */
function parseSiswa(v: any): Siswa[] {
  let arr: any = v;
  if (typeof v === 'string') {
    try { arr = JSON.parse(v); } catch { arr = []; }
  }
  if (!Array.isArray(arr)) return [];
  return arr
    .map((s) => ({ nama: String(s?.nama ?? '').trim(), kelas: String(s?.kelas ?? '').trim() }))
    .filter((s) => s.nama || s.kelas);
}

export function rowToPrestasi(r: any): PrestasiItem {
  return {
    id: Number(r.id),
    nama: r.nama ?? '',
    siswa: parseSiswa(r.siswa),
    tahun: Number(r.tahun) || new Date().getFullYear(),
    kategori: r.kategori ?? 'Lainnya',
    tingkat: r.tingkat ?? '',
    foto: r.foto ?? '',
    deskripsi: r.deskripsi ?? '',
    published: r.published !== false,
  };
}
/* eslint-enable @typescript-eslint/no-explicit-any */

// ── Data statis cadangan (kalau DATABASE_URL belum di-set) ──────────────────
const SEED: PrestasiItem[] = [
  { nama: 'Juara 2 Pencak Silat Nation Series Jawa Barat', siswa: [{ nama: 'Rafi Maulana Syahputra', kelas: '11 Sains 1' }], tahun: 2026, kategori: 'Olahraga', tingkat: 'Provinsi', foto: '/images/silatsma1.jpg', deskripsi: 'Diraih dalam ajang Nation Series Jawa Barat 2026 yang diikuti ratusan atlet se-Jawa Barat.' },
  { nama: 'Juara 1 Taekwondo Tingkat Nasional Junior Putra', siswa: [], tahun: 2025, kategori: 'Olahraga', tingkat: 'Nasional', foto: '/images/tekonsma1.jpg', deskripsi: 'Prestasi tingkat nasional kategori junior putra cabang taekwondo.' },
  { nama: 'Juara 1 Battle In Style Dance Competition | Garena Youth Championship', siswa: [], tahun: 2026, kategori: 'Seni', tingkat: 'Jabodetabek', foto: '/images/juaranusabeast.jpg', deskripsi: 'Tim dance sekolah keluar sebagai juara pertama kategori pelajar.' },
  { nama: 'Juara Olimpiade Bahasa Indonesia Predikat A Medali Silver', siswa: [], tahun: 2025, kategori: 'Akademik', tingkat: 'Nasional', foto: '/images/olimsma.jpg', deskripsi: 'Predikat A sekaligus medali perak pada Olimpiade Bahasa Indonesia tingkat nasional.' },
  { nama: 'Juara Favorit Kolakarya Tingkat Jabodetabek', siswa: [], tahun: 2025, kategori: 'Seni', tingkat: 'Jabodetabek', foto: '/images/citter.jpg', deskripsi: 'Meraih predikat Juara Favorit pada ajang Kolakarya tingkat Jabodetabek.' },
  { nama: 'Juara 2 Karate Kemenpora Open International Championship', siswa: [], tahun: 2026, kategori: 'Olahraga', tingkat: 'Internasional', foto: '/images/karatesma2.jpg', deskripsi: 'Meraih Juara 2 pada Kemenpora Open International Championship cabang karate.' },
  { nama: 'Juara 3 Karate International Championship', siswa: [], tahun: 2026, kategori: 'Olahraga', tingkat: 'Internasional', foto: '/images/karatesma3.jpg', deskripsi: 'Meraih Juara 3 pada International Championship cabang karate.' },
  { nama: 'Juara 2 Tingkat Nasional Kejuaraan ISCC3', siswa: [], tahun: 2025, kategori: 'Olahraga', tingkat: 'Nasional', foto: '/images/tekonsma2.jpg', deskripsi: 'Meraih Juara 2 tingkat nasional pada kejuaraan ISCC3.' },
  { nama: 'Juara 2 Tingkat Nasional Kejuaraan ISCC3', siswa: [], tahun: 2025, kategori: 'Olahraga', tingkat: 'Nasional', foto: '/images/tekonsma3.jpg', deskripsi: 'Meraih Juara 2 tingkat nasional pada kejuaraan ISCC3.' },
].map((s, i) => ({ ...s, id: i + 1, published: true }));

// ── Query ──────────────────────────────────────────────────────────────────
export async function getPrestasiList(opts: { includeUnpublished?: boolean } = {}): Promise<PrestasiItem[]> {
  if (!sql) return SEED;
  const rows = opts.includeUnpublished
    ? await sql`SELECT * FROM prestasi ORDER BY tahun DESC, id DESC`
    : await sql`SELECT * FROM prestasi WHERE published = TRUE ORDER BY tahun DESC, id DESC`;
  return rows.map(rowToPrestasi);
}

export async function getPrestasiById(id: number): Promise<PrestasiItem | null> {
  if (!sql) return SEED.find((p) => p.id === id) ?? null;
  const rows = await sql`SELECT * FROM prestasi WHERE id = ${id} LIMIT 1`;
  return rows[0] ? rowToPrestasi(rows[0]) : null;
}
