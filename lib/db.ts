import { neon, type NeonQueryFunction } from '@neondatabase/serverless';

// Satu koneksi Neon dipakai bersama seluruh route handler.
// Kalau DATABASE_URL belum di-set, `sql` = null dan halaman/API jalan
// dengan data seed statis (situs tetap hidup, admin belum bisa menyimpan).

const url = process.env.DATABASE_URL;

export const hasDb = !!url;

export const sql: NeonQueryFunction<false, false> | null = url ? neon(url) : null;

/** Lempar error yang jelas kalau sebuah route butuh DB tapi belum dikonfigurasi. */
export function requireDb(): NeonQueryFunction<false, false> {
  if (!sql) {
    throw new Error(
      'DATABASE_URL belum di-set. Isi .env.local lalu jalankan db/schema.sql di Neon.'
    );
  }
  return sql;
}
