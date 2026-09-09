import { sql } from '@/lib/db';
import { isAuthed } from '@/lib/auth';
import { guardWrite, readJson, bad } from '@/lib/api';
import { getPrestasiById, rowToPrestasi } from '@/lib/prestasi';
import { parsePrestasiBody } from '@/lib/prestasi-input';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

type Ctx = { params: Promise<{ id: string }> };

async function idFrom(ctx: Ctx) {
  const { id } = await ctx.params;
  const n = Number(id);
  return Number.isInteger(n) && n > 0 ? n : null;
}

export async function GET(_req: Request, ctx: Ctx) {
  if (!(await isAuthed())) return bad('Tidak diizinkan.', 401);
  const id = await idFrom(ctx);
  if (!id) return bad('ID tidak valid.');
  const item = await getPrestasiById(id);
  if (!item) return bad('Prestasi tidak ditemukan.', 404);
  return Response.json({ item });
}

export async function PUT(request: Request, ctx: Ctx) {
  const denied = await guardWrite();
  if (denied) return denied;
  const db = sql!;

  const id = await idFrom(ctx);
  if (!id) return bad('ID tidak valid.');

  const parsed = parsePrestasiBody(await readJson(request));
  if (!parsed.ok) return bad(parsed.error);
  const d = parsed.data;

  const rows = await db`
    UPDATE prestasi SET
      nama = ${d.nama}, siswa = ${JSON.stringify(d.siswa)}::jsonb, tahun = ${d.tahun},
      kategori = ${d.kategori}, tingkat = ${d.tingkat}, foto = ${d.foto},
      deskripsi = ${d.deskripsi}, published = ${d.published}, updated_at = now()
    WHERE id = ${id}
    RETURNING *`;

  if (!rows[0]) return bad('Prestasi tidak ditemukan.', 404);
  return Response.json({ item: rowToPrestasi(rows[0]) });
}

export async function DELETE(_req: Request, ctx: Ctx) {
  const denied = await guardWrite();
  if (denied) return denied;
  const db = sql!;

  const id = await idFrom(ctx);
  if (!id) return bad('ID tidak valid.');

  const rows = await db`DELETE FROM prestasi WHERE id = ${id} RETURNING id`;
  if (!rows[0]) return bad('Prestasi tidak ditemukan.', 404);
  return Response.json({ ok: true });
}
