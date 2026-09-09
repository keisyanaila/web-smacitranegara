import { sql } from '@/lib/db';
import { isAuthed } from '@/lib/auth';
import { guardWrite, readJson, bad } from '@/lib/api';
import { checkFoto } from '@/lib/upload';
import { getBeritaList, rowToBerita, slugify, BERITA_KATEGORI } from '@/lib/berita';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

// GET /api/berita          -> berita published
// GET /api/berita?all=1    -> semua (butuh login admin)
export async function GET(request: Request) {
  const wantAll = new URL(request.url).searchParams.get('all') === '1';
  const includeUnpublished = wantAll && (await isAuthed());
  const list = await getBeritaList({ includeUnpublished });
  return Response.json({ items: list });
}

// POST /api/berita  -> buat berita baru (admin)
export async function POST(request: Request) {
  const denied = await guardWrite();
  if (denied) return denied;
  const db = sql!;

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

  // slug unik
  const base = slugify(String(body.slug ?? '') || judul) || 'berita';
  let slug = base;
  for (let n = 2; ; n++) {
    const clash = await db`SELECT 1 FROM berita WHERE slug = ${slug} LIMIT 1`;
    if (clash.length === 0) break;
    slug = `${base}-${n}`;
  }

  const rows = await db`
    INSERT INTO berita (slug, judul, tanggal, kategori, ringkasan, konten, foto, published)
    VALUES (${slug}, ${judul}, ${tanggal}, ${kategori}, ${ringkasan}, ${konten}, ${foto.value}, ${published})
    RETURNING *`;

  return Response.json({ item: rowToBerita(rows[0]) }, { status: 201 });
}
