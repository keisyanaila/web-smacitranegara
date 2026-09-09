import { checkFoto } from './upload';
import { PRESTASI_KATEGORI, type Siswa } from './prestasi';

export type PrestasiInput = {
  nama: string;
  siswa: Siswa[];
  tahun: number;
  kategori: string;
  tingkat: string;
  foto: string;
  deskripsi: string;
  published: boolean;
};

/** Normalisasi + validasi body prestasi. */
export function parsePrestasiBody(
  body: Record<string, unknown> | null
): { ok: true; data: PrestasiInput } | { ok: false; error: string } {
  if (!body) return { ok: false, error: 'Body tidak valid.' };

  const nama = String(body.nama ?? '').trim();
  if (!nama) return { ok: false, error: 'Nama prestasi wajib diisi.' };

  const rawSiswa = Array.isArray(body.siswa) ? body.siswa : [];
  const siswa: Siswa[] = rawSiswa
    .map((s) => ({
      nama: String((s as Siswa)?.nama ?? '').trim(),
      kelas: String((s as Siswa)?.kelas ?? '').trim(),
    }))
    .filter((s) => s.nama || s.kelas)
    .slice(0, 50);

  const now = new Date().getFullYear();
  let tahun = Math.trunc(Number(body.tahun));
  if (!Number.isFinite(tahun) || tahun < 1980 || tahun > now + 1) tahun = now;

  const kategori = PRESTASI_KATEGORI.includes(body.kategori as never)
    ? (body.kategori as string)
    : 'Lainnya';

  const tingkat = String(body.tingkat ?? '').trim().slice(0, 60);
  const deskripsi = String(body.deskripsi ?? '').trim();
  const published = body.published !== false;

  const foto = checkFoto(body.foto);
  if (!foto.ok) return { ok: false, error: foto.error };

  return { ok: true, data: { nama, siswa, tahun, kategori, tingkat, foto: foto.value, deskripsi, published } };
}
