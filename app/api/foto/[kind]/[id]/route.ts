import { sql } from '@/lib/db';
import { bad } from '@/lib/api';
import { decodeDataUrl } from '@/lib/foto';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

type Ctx = { params: Promise<{ kind: string; id: string }> };

// GET /api/foto/berita/12?v=abc  -> gambar berita/prestasi yang tersimpan sebagai data URL.
// Hanya untuk item yang sudah tayang (draft tidak bisa diintip lewat sini).
export async function GET(_req: Request, ctx: Ctx) {
  const { kind, id: rawId } = await ctx.params;
  const id = Number(rawId);
  if (!Number.isInteger(id) || id <= 0) return bad('ID tidak valid.');
  if (!sql) return bad('Database belum dikonfigurasi.', 404);

  let rows;
  if (kind === 'berita') {
    rows = await sql`SELECT foto FROM berita WHERE id = ${id} AND published = TRUE LIMIT 1`;
  } else if (kind === 'prestasi') {
    rows = await sql`SELECT foto FROM prestasi WHERE id = ${id} AND published = TRUE LIMIT 1`;
  } else if (kind === 'staf') {
    rows = await sql`SELECT foto FROM guru_staf WHERE id = ${id} AND published = TRUE LIMIT 1`;
  } else {
    return bad('Jenis tidak dikenal.', 404);
  }

  const foto = String(rows[0]?.foto ?? '');
  const data = decodeDataUrl(foto);
  if (!data) {
    // Foto berupa path/URL biasa → arahkan ke sana; kosong → 404.
    if (foto && !foto.startsWith('data:')) return Response.redirect(new URL(foto, _req.url), 302);
    return bad('Foto tidak ditemukan.', 404);
  }

  return new Response(new Uint8Array(data.bytes), {
    headers: {
      'Content-Type': data.mime,
      'Content-Length': String(data.bytes.length),
      // URL mengandung ?v=<hash isi>, jadi aman di-cache lama.
      'Cache-Control': 'public, max-age=31536000, immutable',
    },
  });
}
