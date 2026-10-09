import { guardWrite, readJson, bad } from '@/lib/api';
import { parseSpmbBody } from '@/lib/spmb';
import { getSpmbSettingWithMeta, saveSpmbSetting } from '@/lib/spmb-db';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

// GET /api/spmb  -> tahun ajaran + jadwal gelombang (publik)
export async function GET() {
  return Response.json(await getSpmbSettingWithMeta());
}

// PUT /api/spmb  -> simpan pengaturan SPMB (admin)
export async function PUT(request: Request) {
  const denied = await guardWrite();
  if (denied) return denied;

  const parsed = parseSpmbBody(await readJson(request));
  if (!parsed.ok) return bad(parsed.error);

  try {
    const updatedAt = await saveSpmbSetting(parsed.data);
    return Response.json({ setting: parsed.data, updatedAt });
  } catch (e) {
    console.error('[spmb] gagal menyimpan:', e);
    return bad('Gagal menyimpan. Pastikan tabel `pengaturan` sudah dibuat (jalankan db/schema.sql).', 500);
  }
}
