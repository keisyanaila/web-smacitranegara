import { sql } from '@/lib/db';
import { isAuthed } from '@/lib/auth';
import { guardWrite, readJson } from '@/lib/api';
import { getStafList, rowToStaf } from '@/lib/staf';
import { parseStafBody } from '@/lib/staf-input';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
  const wantAll = new URL(request.url).searchParams.get('all') === '1';
  const includeUnpublished = wantAll && (await isAuthed());
  const list = await getStafList({ includeUnpublished });
  return Response.json({ items: list });
}

export async function POST(request: Request) {
  const denied = await guardWrite();
  if (denied) return denied;
  const db = sql!;

  const parsed = parseStafBody(await readJson(request));
  if (!parsed.ok) return Response.json({ error: parsed.error }, { status: 400 });
  const d = parsed.data;

  const rows = await db`
    INSERT INTO guru_staf (nama, jabatan, kategori, foto, published)
    VALUES (${d.nama}, ${d.jabatan}, ${d.kategori}, ${d.foto}, ${d.published})
    RETURNING *`;

  return Response.json({ item: rowToStaf(rows[0]) }, { status: 201 });
}
