// Kompatibilitas: sumber data berita kini ada di lib/berita.ts (database Neon,
// dengan fallback statis). File ini hanya re-export supaya import lama tetap jalan.
export type { BeritaItem } from '@/lib/berita';
export { KATEGORI_COLOR } from '@/lib/berita';
