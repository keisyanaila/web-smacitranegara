// Batas ukuran gambar yang disimpan sebagai data URL base64 di kolom DB.
// 2 MB biner ≈ 2.79 MB base64. Kita pakai batas karakter yang sedikit longgar.
export const MAX_IMAGE_BYTES = 2 * 1024 * 1024;
const MAX_DATAURL_CHARS = Math.ceil((MAX_IMAGE_BYTES * 4) / 3) + 100;

/** Validasi nilai `foto`: boleh kosong, path/URL biasa, atau data URL gambar <= 2 MB. */
export function checkFoto(foto: unknown): { ok: true; value: string } | { ok: false; error: string } {
  if (foto == null || foto === '') return { ok: true, value: '' };
  if (typeof foto !== 'string') return { ok: false, error: 'foto harus berupa string' };

  const v = foto.trim();
  if (v.startsWith('data:')) {
    if (!/^data:image\/(png|jpe?g|webp|gif|avif);base64,/i.test(v)) {
      return { ok: false, error: 'Format gambar tidak didukung (pakai PNG/JPG/WEBP).' };
    }
    if (v.length > MAX_DATAURL_CHARS) {
      return { ok: false, error: 'Ukuran gambar melebihi 2 MB.' };
    }
    return { ok: true, value: v };
  }
  // path atau URL biasa
  if (v.length > 2000) return { ok: false, error: 'URL gambar terlalu panjang.' };
  return { ok: true, value: v };
}
