import { isAuthed } from './auth';
import { sql } from './db';

/** Return Response 401/503 kalau tidak boleh menulis; null kalau lolos. */
export async function guardWrite(): Promise<Response | null> {
  if (!(await isAuthed())) {
    return Response.json({ error: 'Tidak diizinkan. Silakan login admin.' }, { status: 401 });
  }
  if (!sql) {
    return Response.json(
      { error: 'DATABASE_URL belum di-set — perubahan tidak bisa disimpan.' },
      { status: 503 }
    );
  }
  return null;
}

export async function readJson<T = Record<string, unknown>>(request: Request): Promise<T | null> {
  try {
    return (await request.json()) as T;
  } catch {
    return null;
  }
}

export function bad(error: string, status = 400) {
  return Response.json({ error }, { status });
}
