// Tipe, konstanta & data awal guru/staf — TANPA akses database, jadi aman dipakai
// di komponen client (form admin) dan di lib/db-migrate.ts tanpa import melingkar.

export type StafItem = {
  id: number;
  nama: string;
  jabatan: string;
  kategori: string;
  foto: string;
  published: boolean;
};

/** Pilihan kategori di form admin. Urutan ini juga urutan tampil di halaman publik. */
export const STAF_KATEGORI = ['Pimpinan', 'Kurikulum', 'Kepala Program', 'Humas', 'Kesiswaan', 'Keuangan', 'Tata Usaha', 'Guru', 'IT'] as const;

export const WARNA_KATEGORI: Record<string, string> = {
  Pimpinan: '#0A1628',
  Kurikulum: '#C8973A',
  Kesiswaan: '#17713b',
  'Kepala Program': '#17713b',
  Humas: '#0A1628',
  Keuangan: '#C8973A',
  'Tata Usaha': '#8a5a2b',
  Guru: '#0A1628',
  IT: '#17713b',
};

// ── Data awal: struktur organisasi TA. 2026/2027 ───────────────────────────
// Dipakai sebagai cadangan kalau DATABASE_URL belum di-set, dan sekali saja
// diisikan ke tabel guru_staf saat tabel dibuat (lihat lib/db-migrate.ts).
export const STAF_SEED: { nama: string; jabatan: string; kategori: string; foto: string }[] = [
  { nama: 'Ahmad Taufik, S.Kom', jabatan: 'Kepala Sekolah', kategori: 'Pimpinan', foto: '/images/kepseksma.jpg' },
  { nama: 'Dedi Suandi, M.Pd.', jabatan: 'WAKA. Kurikulum', kategori: 'Kurikulum', foto: '/images/dedi.jpg' },
  { nama: 'Balqis Ananda Safitri, S.Pd.', jabatan: 'BK/BP', kategori: 'Kurikulum', foto: '' },
  { nama: 'Febia Maulina, S.Pd.', jabatan: 'Kepala Lab. IPA', kategori: 'Kurikulum', foto: '/images/febia.jpg' },
  { nama: 'Muhammad Aditya, S.Ti.', jabatan: 'Kepala Lab. Komputer', kategori: 'Kurikulum', foto: '' },
  { nama: 'Abdul Hakim, S.Pd.', jabatan: 'WAKA. Kesiswaan/Humas', kategori: 'Kesiswaan', foto: '' },
  { nama: 'Sylviana, M.Pd.', jabatan: 'Pembina OSIS', kategori: 'Kesiswaan', foto: '' },
  { nama: 'Samsul Bahri, S.Pd.I.', jabatan: 'Pembina IRMA', kategori: 'Kesiswaan', foto: '/images/samsul.jpg' },
  { nama: 'Nindi Tiarawati, S.Pd.', jabatan: 'KA. TU. Administrasi', kategori: 'Tata Usaha', foto: '' },
  { nama: 'Syafangatul Karim, S.Pd.', jabatan: 'Bendahara BOS/Dapodik dan Takola', kategori: 'Tata Usaha', foto: '' },
  { nama: 'Narfa Eka Syabila', jabatan: 'Tata Usaha Administrasi', kategori: 'Tata Usaha', foto: '' },
];

/** Urutan tampil: per kategori (sesuai STAF_KATEGORI), lalu abjad nama. */
export function urutkanStaf<T extends { nama: string; kategori: string }>(list: T[]): T[] {
  const idx = (k: string) => {
    const i = (STAF_KATEGORI as readonly string[]).indexOf(k);
    return i === -1 ? STAF_KATEGORI.length : i;
  };
  return [...list].sort(
    (a, b) => idx(a.kategori) - idx(b.kategori) || a.nama.localeCompare(b.nama, 'id', { sensitivity: 'base' })
  );
}
