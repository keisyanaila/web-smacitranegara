import { sql } from './db';
import { ensureSchema } from './db-migrate';
import { STAF_SEED, urutkanStaf, type StafItem } from './staf-data';

export * from './staf-data';

/* eslint-disable @typescript-eslint/no-explicit-any */
export function rowToStaf(r: any): StafItem {
  return {
    id: Number(r.id),
    nama: r.nama ?? '',
    jabatan: r.jabatan ?? '',
    kategori: r.kategori ?? '',
    foto: r.foto ?? '',
    published: r.published !== false,
  };
}
/* eslint-enable @typescript-eslint/no-explicit-any */

// Cadangan kalau DATABASE_URL belum di-set.
const SEED: StafItem[] = urutkanStaf(STAF_SEED.map((s, i) => ({ ...s, id: i + 1, published: true })));

// ── Query ──────────────────────────────────────────────────────────────────
export async function getStafList(opts: { includeUnpublished?: boolean } = {}): Promise<StafItem[]> {
  if (!sql) return SEED;
  await ensureSchema(); // tabel guru_staf dibuat + diisi data awal kalau belum ada
  try {
    const rows = opts.includeUnpublished
      ? await sql`SELECT * FROM guru_staf ORDER BY id ASC`
      : await sql`SELECT * FROM guru_staf WHERE published = TRUE ORDER BY id ASC`;
    return urutkanStaf(rows.map(rowToStaf));
  } catch (e) {
    console.error('[staf] gagal membaca guru_staf:', e);
    return opts.includeUnpublished ? [] : SEED;
  }
}

export async function getStafById(id: number): Promise<StafItem | null> {
  if (!sql) return SEED.find((s) => s.id === id) ?? null;
  const rows = await sql`SELECT * FROM guru_staf WHERE id = ${id} LIMIT 1`;
  return rows[0] ? rowToStaf(rows[0]) : null;
}
