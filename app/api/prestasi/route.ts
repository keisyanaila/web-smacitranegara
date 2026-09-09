import { sql } from '@/lib/db';
import { isAuthed } from '@/lib/auth';
import { guardWrite, readJson } from '@/lib/api';
import { getPrestasiList, rowToPrestasi } from '@/lib/prestasi';
import { parsePrestasiBody } from '@/lib/prestasi-input';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
  const wantAll = new URL(request.url).searchParams.get('all') === '1';
  const includeUnpublished = wantAll && (await isAuthed());
  const list = await getPrestasiList({ includeUnpublished });
  return Response.json({ items: list });
}

export async function POST(request: Request) {
  const denied = await guardWrite();
  if (denied) return denied;
  const db = sql!;

  const parsed = parsePrestasiBody(await readJson(request));
  if (!parsed.ok) return Response.json({ error: parsed.error }, { status: 400 });
  const d = parsed.data;

  const rows = await db`
    INSERT INTO prestasi (nama, siswa, tahun, kategori, tingkat, foto, deskripsi, published)
    VALUES (${d.nama}, ${JSON.stringify(d.siswa)}::jsonb, ${d.tahun}, ${d.kategori},
            ${d.tingkat}, ${d.foto}, ${d.deskripsi}, ${d.published})
    RETURNING *`;

  return Response.json({ item: rowToPrestasi(rows[0]) }, { status: 201 });
}
