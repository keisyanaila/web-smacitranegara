import { sql } from './db';
import { ensureSchema } from './db-migrate';
import { authConfigured } from './auth';

// Pemeriksaan kesiapan sistem untuk dashboard admin: env, koneksi DB, tabel & kolom.

export type Cek = { label: string; ok: boolean; hint?: string };

// Tabel + kolom yang wajib ada. Kolom yang ditambahkan belakangan dicek juga,
// supaya ketahuan kalau db/schema.sql belum dijalankan ulang.
const WAJIB: Record<string, string[]> = {
  berita: ['id', 'slug', 'judul', 'penulis', 'published'],
  prestasi: ['id', 'nama', 'siswa', 'published'],
  pengaturan: ['kunci', 'nilai', 'updated_at'],
};

const JALANKAN_SCHEMA = 'Jalankan ulang db/schema.sql di Neon SQL Editor.';

export async function cekSistem(): Promise<{ siap: boolean; ringkasan: string; detail: Cek[] }> {
  const detail: Cek[] = [
    { label: 'ADMIN_PASSWORD di-set', ok: authConfigured() },
    {
      label: 'DATABASE_URL di-set',
      ok: !!sql,
      hint: 'Isi DATABASE_URL di .env.local (atau Environment Variables di Vercel), lalu restart server.',
    },
  ];

  if (!sql) {
    return {
      siap: false,
      ringkasan: 'Database belum dihubungkan — situs memakai data contoh dan perubahan tidak bisa disimpan.',
      detail,
    };
  }

  await ensureSchema(); // tambal tabel/kolom yang kurang sebelum dicek

  let kolom: { table_name: string; column_name: string }[];
  try {
    kolom = (await sql`
      SELECT table_name, column_name FROM information_schema.columns
      WHERE table_schema = current_schema() AND table_name = ANY(${Object.keys(WAJIB)})`) as typeof kolom;
    detail.push({ label: 'Koneksi database', ok: true });
  } catch (e) {
    detail.push({
      label: 'Koneksi database',
      ok: false,
      hint: `Gagal terhubung: ${e instanceof Error ? e.message : String(e)}. Cek DATABASE_URL.`,
    });
    return { siap: false, ringkasan: 'Tidak bisa terhubung ke database.', detail };
  }

  for (const [tabel, wajib] of Object.entries(WAJIB)) {
    const ada = new Set(kolom.filter((k) => k.table_name === tabel).map((k) => k.column_name));
    if (ada.size === 0) {
      detail.push({ label: `Tabel ${tabel}`, ok: false, hint: `Tabel belum dibuat. ${JALANKAN_SCHEMA}` });
      continue;
    }
    const kurang = wajib.filter((c) => !ada.has(c));
    detail.push({
      label: `Tabel ${tabel}`,
      ok: kurang.length === 0,
      hint: kurang.length ? `Kolom belum ada: ${kurang.join(', ')}. ${JALANKAN_SCHEMA}` : undefined,
    });
  }

  const siap = detail.every((c) => c.ok);
  return {
    siap,
    ringkasan: siap
      ? 'Sistem siap — database terhubung dan semua tabel lengkap.'
      : 'Ada yang perlu dibereskan sebelum admin bisa menyimpan dengan normal.',
    detail,
  };
}
