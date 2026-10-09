// Pengaturan SPMB (tahun ajaran + jadwal gelombang) yang bisa diubah dari /admin/spmb.
// Disimpan sebagai JSONB di tabel `pengaturan` (kunci 'spmb'); query-nya di lib/spmb-db.ts.
// File ini tanpa akses DB supaya aman di-import dari komponen client.

export type Gelombang = {
  nama: string;
  mulai: string;   // YYYY-MM-DD
  selesai: string; // YYYY-MM-DD
};

export type SpmbSetting = {
  tahunAjaran: string; // "2027/2028"
  gelombang: Gelombang[];
};

// Situs pendaftaran SPMB online (terpisah dari web ini). Semua tombol "Daftar" mengarah ke sini.
export const SPMB_URL = 'https://spmb.citranegara.online';

export const MAX_GELOMBANG = 6;

// Dipakai kalau DATABASE_URL belum di-set / tabel belum dibuat / belum pernah disimpan.
export const DEFAULT_SPMB: SpmbSetting = {
  tahunAjaran: '2027/2028',
  gelombang: [
    { nama: 'Gelombang 1', mulai: '2026-09-01', selesai: '2026-11-30' },
    { nama: 'Gelombang 2', mulai: '2026-12-01', selesai: '2027-02-28' },
    { nama: 'Gelombang 3', mulai: '2027-03-01', selesai: '2027-06-30' },
  ],
};

// ── Label tanggal ──────────────────────────────────────────────────────────
// Diformat manual (bukan Intl + Date) supaya hasil server & browser selalu sama,
// tidak terpengaruh zona waktu.
const BULAN = ['Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni', 'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'];
const BULAN_PENDEK = ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Agu', 'Sep', 'Okt', 'Nov', 'Des'];

function parts(iso: string) {
  const [y, m, d] = iso.split('-').map(Number);
  return { y, m, d };
}

/** "1 September – 30 November 2026" atau, dengan `pendek`, "1 Sep – 30 Nov 2026". */
export function labelRentang(mulai: string, selesai: string, pendek = false): string {
  const names = pendek ? BULAN_PENDEK : BULAN;
  const a = parts(mulai);
  const b = parts(selesai);
  const kiri = `${a.d} ${names[a.m - 1]}${a.y !== b.y ? ` ${a.y}` : ''}`;
  return `${kiri} – ${b.d} ${names[b.m - 1]} ${b.y}`;
}

/** Tahun pertama dari "2027/2028" → "2027". */
export const tahunMulai = (tahunAjaran: string) => tahunAjaran.split('/')[0];

// ── Validasi ───────────────────────────────────────────────────────────────
function isISODate(v: string): boolean {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(v)) return false;
  const { y, m, d } = parts(v);
  const dt = new Date(Date.UTC(y, m - 1, d));
  return dt.getUTCFullYear() === y && dt.getUTCMonth() === m - 1 && dt.getUTCDate() === d;
}

/** Normalisasi + validasi body pengaturan SPMB. Gelombang diurutkan berdasarkan tanggal mulai. */
export function parseSpmbBody(
  body: Record<string, unknown> | null
): { ok: true; data: SpmbSetting } | { ok: false; error: string } {
  if (!body) return { ok: false, error: 'Body tidak valid.' };

  const tahunAjaran = String(body.tahunAjaran ?? '').replace(/\s+/g, '');
  const m = /^(\d{4})\/(\d{4})$/.exec(tahunAjaran);
  if (!m) return { ok: false, error: 'Tahun ajaran harus berformat 2027/2028.' };
  if (Number(m[2]) !== Number(m[1]) + 1) {
    return { ok: false, error: 'Tahun kedua pada tahun ajaran harus tahun pertama + 1.' };
  }

  const raw = Array.isArray(body.gelombang) ? body.gelombang : [];
  if (raw.length === 0) return { ok: false, error: 'Minimal harus ada 1 gelombang.' };
  if (raw.length > MAX_GELOMBANG) return { ok: false, error: `Maksimal ${MAX_GELOMBANG} gelombang.` };

  const gelombang: Gelombang[] = [];
  for (let i = 0; i < raw.length; i++) {
    const g = raw[i] as Record<string, unknown>;
    const nama = String(g?.nama ?? '').trim().slice(0, 60) || `Gelombang ${i + 1}`;
    const mulai = String(g?.mulai ?? '');
    const selesai = String(g?.selesai ?? '');
    if (!isISODate(mulai) || !isISODate(selesai)) {
      return { ok: false, error: `${nama}: tanggal mulai & selesai wajib diisi.` };
    }
    if (mulai > selesai) {
      return { ok: false, error: `${nama}: tanggal selesai tidak boleh sebelum tanggal mulai.` };
    }
    gelombang.push({ nama, mulai, selesai });
  }

  // Boleh bersambung di hari yang sama (selesai G1 = mulai G2), tapi tidak boleh tumpang tindih.
  gelombang.sort((a, b) => a.mulai.localeCompare(b.mulai));
  for (let i = 1; i < gelombang.length; i++) {
    if (gelombang[i].mulai < gelombang[i - 1].selesai) {
      return {
        ok: false,
        error: `${gelombang[i - 1].nama} dan ${gelombang[i].nama} jadwalnya tumpang tindih.`,
      };
    }
  }

  return { ok: true, data: { tahunAjaran, gelombang } };
}

// ── Status ─────────────────────────────────────────────────────────────────
export type StatusGelombang = 'selesai' | 'berjalan' | 'akan';

export const STATUS_GELOMBANG_LABEL: Record<StatusGelombang, string> = {
  selesai: 'Selesai',
  berjalan: 'Sedang Berlangsung',
  akan: 'Akan Datang',
};

/** Status gelombang terhadap waktu `now` (zona waktu lokal). Tanggal kosong/invalid → null. */
export function statusGelombang(g: Pick<Gelombang, 'mulai' | 'selesai'>, now: Date): StatusGelombang | null {
  if (!isISODate(g.mulai) || !isISODate(g.selesai)) return null;
  if (now > new Date(g.selesai + 'T23:59:59')) return 'selesai';
  if (now >= new Date(g.mulai + 'T00:00:00')) return 'berjalan';
  return 'akan';
}

/** Ringkasan untuk dashboard: "Gelombang 1 berjalan" / "Gelombang 2 akan datang" / "Semua gelombang selesai". */
export function ringkasanGelombang(list: Gelombang[], now: Date): string {
  const berjalan = list.find((g) => statusGelombang(g, now) === 'berjalan');
  if (berjalan) return `${berjalan.nama} berjalan`;
  const akan = list.find((g) => statusGelombang(g, now) === 'akan');
  if (akan) return `${akan.nama} akan datang`;
  return 'Semua gelombang selesai';
}
