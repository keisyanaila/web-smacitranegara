import { sql } from '@/lib/db';
import { isAuthed } from '@/lib/auth';
import { guardWrite, readJson, bad } from '@/lib/api';
import { getStafById, rowToStaf } from '@/lib/staf';
import { parseStafBody } from '@/lib/staf-input';

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
  const item = await getStafById(id);
  if (!item) return bad('Data guru/staf tidak ditemukan.', 404);
  return Response.json({ item });
}

export async function PUT(request: Request, ctx: Ctx) {
  const denied = await guardWrite();
  if (denied) return denied;
  const db = sql!;

  const id = await idFrom(ctx);
  if (!id) return bad('ID tidak valid.');

  const parsed = parseStafBody(await readJson(request));
  if (!parsed.ok) return bad(parsed.error);
  const d = parsed.data;

  const rows = await db`
    UPDATE guru_staf SET
      nama = ${d.nama}, jabatan = ${d.jabatan}, kategori = ${d.kategori}, foto = ${d.foto},
      published = ${d.published}, updated_at = now()
    WHERE id = ${id}
    RETURNING *`;

  if (!rows[0]) return bad('Data guru/staf tidak ditemukan.', 404);
  return Response.json({ item: rowToStaf(rows[0]) });
}

export async function DELETE(_req: Request, ctx: Ctx) {
  const denied = await guardWrite();
  if (denied) return denied;
  const db = sql!;

  const id = await idFrom(ctx);
  if (!id) return bad('ID tidak valid.');

  const rows = await db`DELETE FROM guru_staf WHERE id = ${id} RETURNING id`;
  if (!rows[0]) return bad('Data guru/staf tidak ditemukan.', 404);
  return Response.json({ ok: true });
}
