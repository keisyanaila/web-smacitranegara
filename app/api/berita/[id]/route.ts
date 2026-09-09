import { sql } from '@/lib/db';
import { isAuthed } from '@/lib/auth';
import { guardWrite, readJson, bad } from '@/lib/api';
import { checkFoto } from '@/lib/upload';
import { getBeritaById, rowToBerita, slugify, BERITA_KATEGORI } from '@/lib/berita';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

type Ctx = { params: Promise<{ id: string }> };

async function idFrom(ctx: Ctx) {
  const { id } = await ctx.params;
  const n = Number(id);
  return Number.isInteger(n) && n > 0 ? n : null;
}

// GET /api/berita/:id  -> satu berita (admin, buat form edit)
export async function GET(_req: Request, ctx: Ctx) {
  if (!(await isAuthed())) return bad('Tidak diizinkan.', 401);
  const id = await idFrom(ctx);
  if (!id) return bad('ID tidak valid.');
  const item = await getBeritaById(id);
  if (!item) return bad('Berita tidak ditemukan.', 404);
  return Response.json({ item });
}

// PUT /api/berita/:id  -> ubah berita (admin)
export async function PUT(request: Request, ctx: Ctx) {
  const denied = await guardWrite();
  if (denied) return denied;
  const db = sql!;

  const id = await idFrom(ctx);
  if (!id) return bad('ID tidak valid.');

  const body = await readJson<Record<string, unknown>>(request);
  if (!body) return bad('Body tidak valid.');

  const judul = String(body.judul ?? '').trim();
  if (!judul) return bad('Judul wajib diisi.');

  const kategori = BERITA_KATEGORI.includes(body.kategori as never)
    ? (body.kategori as string)
    : 'Kegiatan';
  const tanggal = /^\d{4}-\d{2}-\d{2}$/.test(String(body.tanggal ?? ''))
    ? String(body.tanggal)
    : new Date().toISOString().slice(0, 10);
  const ringkasan = String(body.ringkasan ?? '').trim();
  const konten = String(body.konten ?? '').trim();
  const published = body.published !== false;

  const foto = checkFoto(body.foto);
  if (!foto.ok) return bad(foto.error);

  // slug: pakai yang dikirim (di-slugify) kalau ada, jaga tetap unik terhadap baris lain
  const base = slugify(String(body.slug ?? '') || judul) || 'berita';
  let slug = base;
  for (let n = 2; ; n++) {
    const clash = await db`SELECT 1 FROM berita WHERE slug = ${slug} AND id <> ${id} LIMIT 1`;
    if (clash.length === 0) break;
    slug = `${base}-${n}`;
  }

  const rows = await db`
    UPDATE berita SET
      slug = ${slug}, judul = ${judul}, tanggal = ${tanggal}, kategori = ${kategori},
      ringkasan = ${ringkasan}, konten = ${konten}, foto = ${foto.value},
      published = ${published}, updated_at = now()
    WHERE id = ${id}
    RETURNING *`;

  if (!rows[0]) return bad('Berita tidak ditemukan.', 404);
  return Response.json({ item: rowToBerita(rows[0]) });
}

// DELETE /api/berita/:id  (admin)
export async function DELETE(_req: Request, ctx: Ctx) {
  const denied = await guardWrite();
  if (denied) return denied;
  const db = sql!;

  const id = await idFrom(ctx);
  if (!id) return bad('ID tidak valid.');

  const rows = await db`DELETE FROM berita WHERE id = ${id} RETURNING id`;
  if (!rows[0]) return bad('Berita tidak ditemukan.', 404);
  return Response.json({ ok: true });
}
