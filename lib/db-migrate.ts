import { sql } from './db';
import { DEFAULT_SPMB } from './spmb';

// Migrasi kecil yang dijalankan otomatis (sekali per proses server) sebelum admin
// menulis data, supaya database lama tidak perlu menjalankan ulang db/schema.sql
// secara manual. Semua perintah aman diulang (IF NOT EXISTS / ON CONFLICT).

let pending: Promise<void> | null = null;

export function ensureSchema(): Promise<void> {
  if (!sql) return Promise.resolve();
  if (!pending) {
    const db = sql;
    pending = (async () => {
      await db`ALTER TABLE IF EXISTS berita
                 ADD COLUMN IF NOT EXISTS penulis TEXT NOT NULL DEFAULT 'Humas SMA Citra Negara'`;
      await db`CREATE TABLE IF NOT EXISTS pengaturan (
                 kunci      TEXT PRIMARY KEY,
                 nilai      JSONB NOT NULL,
                 updated_at TIMESTAMPTZ NOT NULL DEFAULT now())`;
      await db`INSERT INTO pengaturan (kunci, nilai)
               VALUES ('spmb', ${JSON.stringify(DEFAULT_SPMB)}::jsonb)
               ON CONFLICT (kunci) DO NOTHING`;
    })().catch((e) => {
      pending = null; // coba lagi di request berikutnya
      console.error('[db] migrasi otomatis gagal:', e);
    });
  }
  return pending;
}
