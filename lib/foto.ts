import { createHash } from 'crypto';

// Foto upload admin disimpan sebagai data URL base64 di database. Kalau dikirim apa
// adanya ke halaman publik, setiap foto (ratusan KB) ikut tertanam di HTML — beranda
// sempat jadi ±4 MB. Untuk halaman publik, data URL diganti URL pendek yang disajikan
// app/api/foto/[kind]/[id]/route.ts dan bisa di-cache browser.
//
// JANGAN dipakai untuk data admin: form admin butuh nilai foto asli supaya tidak
// tertimpa URL ini saat disimpan ulang.

export type FotoKind = 'berita' | 'prestasi' | 'staf';

export function publicFotoUrl(kind: FotoKind, id: number, foto: string): string {
  if (!foto.startsWith('data:')) return foto;
  // Versi berdasarkan isi foto: ganti foto → URL berubah → cache lama tidak terpakai.
  const v = createHash('sha1').update(foto).digest('hex').slice(0, 10);
  return `/api/foto/${kind}/${id}?v=${v}`;
}

export function withPublicFoto<T extends { id: number; foto: string }>(kind: FotoKind, item: T): T {
  return { ...item, foto: publicFotoUrl(kind, item.id, item.foto) };
}

/** Pecah data URL → { mime, bytes }. null kalau bukan data URL gambar base64. */
export function decodeDataUrl(foto: string): { mime: string; bytes: Buffer } | null {
  const m = /^data:(image\/[a-z0-9.+-]+);base64,([\s\S]*)$/i.exec(foto);
  if (!m) return null;
  return { mime: m[1].toLowerCase(), bytes: Buffer.from(m[2], 'base64') };
}
