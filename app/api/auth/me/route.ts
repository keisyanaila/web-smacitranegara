import { isAuthed } from '@/lib/auth';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function GET() {
  const authed = await isAuthed();
  return Response.json({ user: authed ? { role: 'admin', namaLengkap: 'Admin' } : null });
}
