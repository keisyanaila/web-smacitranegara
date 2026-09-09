import { signIn, authConfigured } from '@/lib/auth';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function POST(request: Request) {
  if (!authConfigured()) {
    return Response.json(
      { error: 'ADMIN_PASSWORD belum di-set di .env.local.' },
      { status: 503 }
    );
  }

  let password = '';
  try {
    const body = await request.json();
    password = typeof body?.password === 'string' ? body.password : '';
  } catch {
    return Response.json({ error: 'Body tidak valid.' }, { status: 400 });
  }

  const ok = await signIn(password);
  if (!ok) return Response.json({ error: 'Password salah.' }, { status: 401 });

  return Response.json({ ok: true });
}
