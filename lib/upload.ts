// Gambar disimpan sebagai data URL base64 di kolom DB.
// Admin boleh memilih file sampai 4 MB; sebelum dikirim, browser mengecilkannya
// (lihat components/admin/ImageInput.tsx) jadi yang tersimpan biasanya < 500 KB.
export const MAX_UPLOAD_BYTES = 4 * 1024 * 1024;

// Batas data URL yang diterima server (setelah kompresi). Longgar, tapi tetap
// di bawah batas body request Vercel (4.5 MB).
const MAX_STORED_BYTES = 3 * 1024 * 1024;
const MAX_DATAURL_CHARS = Math.ceil((MAX_STORED_BYTES * 4) / 3) + 100;

/** Validasi nilai `foto`: boleh kosong, path/URL biasa, atau data URL gambar. */
export function checkFoto(foto: unknown): { ok: true; value: string } | { ok: false; error: string } {
  if (foto == null || foto === '') return { ok: true, value: '' };
  if (typeof foto !== 'string') return { ok: false, error: 'foto harus berupa string' };

  const v = foto.trim();
  if (v.startsWith('data:')) {
    if (!/^data:image\/(png|jpe?g|webp|gif|avif);base64,/i.test(v)) {
      return { ok: false, error: 'Format gambar tidak didukung (pakai PNG/JPG/WEBP).' };
    }
    if (v.length > MAX_DATAURL_CHARS) {
      return { ok: false, error: 'Ukuran gambar terlalu besar.' };
    }
    return { ok: true, value: v };
  }
  // path atau URL biasa
  if (v.length > 2000) return { ok: false, error: 'URL gambar terlalu panjang.' };
  return { ok: true, value: v };
}
