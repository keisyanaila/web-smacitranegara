import { checkFoto } from './upload';
import { STAF_KATEGORI } from './staf-data';

export type StafInput = {
  nama: string;
  jabatan: string;
  kategori: string;
  foto: string;
  published: boolean;
};

/** Normalisasi + validasi body guru/staf. */
export function parseStafBody(
  body: Record<string, unknown> | null
): { ok: true; data: StafInput } | { ok: false; error: string } {
  if (!body) return { ok: false, error: 'Body tidak valid.' };

  const nama = String(body.nama ?? '').trim().slice(0, 150);
  if (!nama) return { ok: false, error: 'Nama wajib diisi.' };

  const jabatan = String(body.jabatan ?? '').trim().slice(0, 150);

  const kategori = STAF_KATEGORI.includes(body.kategori as never) ? (body.kategori as string) : 'Guru';

  const published = body.published !== false;

  const foto = checkFoto(body.foto);
  if (!foto.ok) return { ok: false, error: foto.error };

  return { ok: true, data: { nama, jabatan, kategori, foto: foto.value, published } };
}
