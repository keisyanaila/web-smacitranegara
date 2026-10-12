import { sql } from './db';
import { DEFAULT_SPMB } from './spmb';
import { STAF_SEED } from './staf-data';

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

      await db`CREATE TABLE IF NOT EXISTS guru_staf (
                 id         SERIAL PRIMARY KEY,
                 nama       TEXT NOT NULL,
                 jabatan    TEXT NOT NULL DEFAULT '',
                 kategori   TEXT NOT NULL DEFAULT 'Guru',
                 foto       TEXT NOT NULL DEFAULT '',
                 published  BOOLEAN NOT NULL DEFAULT TRUE,
                 created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
                 updated_at TIMESTAMPTZ NOT NULL DEFAULT now())`;
      // Data awal diisi SEKALI saja (ditandai di tabel pengaturan), jadi kalau admin
      // menghapus semua guru/staf, datanya tidak muncul lagi sendiri.
      const seeded = await db`INSERT INTO pengaturan (kunci, nilai)
                              VALUES ('seed_guru_staf', 'true'::jsonb)
                              ON CONFLICT (kunci) DO NOTHING
                              RETURNING kunci`;
      if (seeded.length) {
        await db`INSERT INTO guru_staf (nama, jabatan, kategori, foto)
                 SELECT nama, jabatan, kategori, foto
                 FROM jsonb_to_recordset(${JSON.stringify(STAF_SEED)}::jsonb)
                   AS x(nama TEXT, jabatan TEXT, kategori TEXT, foto TEXT)`;
      }
    })().catch((e) => {
      pending = null; // coba lagi di request berikutnya
      console.error('[db] migrasi otomatis gagal:', e);
    });
  }
  return pending;
}
