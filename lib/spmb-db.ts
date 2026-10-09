import { sql } from './db';
import { DEFAULT_SPMB, parseSpmbBody, type SpmbSetting } from './spmb';

// Baca/simpan pengaturan SPMB di tabel `pengaturan` (kunci 'spmb'). Server-only.

export async function getSpmbSettingWithMeta(): Promise<{ setting: SpmbSetting; updatedAt: string | null }> {
  if (!sql) return { setting: DEFAULT_SPMB, updatedAt: null };
  try {
    const rows = await sql`SELECT nilai, updated_at FROM pengaturan WHERE kunci = 'spmb' LIMIT 1`;
    if (!rows[0]) return { setting: DEFAULT_SPMB, updatedAt: null };
    const parsed = parseSpmbBody(rows[0].nilai as Record<string, unknown>);
    return {
      setting: parsed.ok ? parsed.data : DEFAULT_SPMB,
      updatedAt: rows[0].updated_at ? new Date(rows[0].updated_at as string).toISOString() : null,
    };
  } catch (e) {
    // Biasanya karena tabel `pengaturan` belum dibuat — jalankan ulang db/schema.sql.
    console.error('[spmb] gagal membaca pengaturan, pakai default:', e);
    return { setting: DEFAULT_SPMB, updatedAt: null };
  }
}

export async function getSpmbSetting(): Promise<SpmbSetting> {
  return (await getSpmbSettingWithMeta()).setting;
}

/** Simpan pengaturan; return waktu simpan (ISO). */
export async function saveSpmbSetting(data: SpmbSetting): Promise<string> {
  if (!sql) throw new Error('DATABASE_URL belum di-set.');
  const rows = await sql`
    INSERT INTO pengaturan (kunci, nilai, updated_at)
    VALUES ('spmb', ${JSON.stringify(data)}::jsonb, now())
    ON CONFLICT (kunci) DO UPDATE SET nilai = EXCLUDED.nilai, updated_at = now()
    RETURNING updated_at`;
  return new Date(rows[0].updated_at as string).toISOString();
}
