import { cookies } from 'next/headers';
import { createHash, timingSafeEqual } from 'crypto';

// Auth admin sederhana: satu password bersama dari env ADMIN_PASSWORD.
// Sesi = cookie httpOnly berisi hash password (bukan password mentah),
// jadi kalau cookie bocor pun password aslinya tidak ikut terbawa.

const COOKIE = 'smacn_admin';
const MAX_AGE = 60 * 60 * 24 * 7; // 7 hari

function sessionToken(): string | null {
  const pw = process.env.ADMIN_PASSWORD;
  if (!pw) return null;
  return createHash('sha256').update(`smacn::${pw}`).digest('hex');
}

function safeEqual(a: string, b: string): boolean {
  const ab = Buffer.from(a);
  const bb = Buffer.from(b);
  if (ab.length !== bb.length) return false;
  return timingSafeEqual(ab, bb);
}

export const authConfigured = () => !!process.env.ADMIN_PASSWORD;

/** true kalau request punya cookie sesi admin yang valid. */
export async function isAuthed(): Promise<boolean> {
  const token = sessionToken();
  if (!token) return false;
  const jar = await cookies();
  const current = jar.get(COOKIE)?.value;
  return !!current && safeEqual(current, token);
}

/** Set cookie sesi kalau password benar. Return false kalau salah / belum dikonfigurasi. */
export async function signIn(password: string): Promise<boolean> {
  const token = sessionToken();
  if (!token) return false;
  if (!safeEqual(password, process.env.ADMIN_PASSWORD as string)) return false;

  const jar = await cookies();
  jar.set(COOKIE, token, {
    httpOnly: true,
    sameSite: 'lax',
    path: '/',
    maxAge: MAX_AGE,
    secure: process.env.NODE_ENV === 'production',
  });
  return true;
}

export async function signOut(): Promise<void> {
  const jar = await cookies();
  jar.set(COOKIE, '', { httpOnly: true, path: '/', maxAge: 0 });
}
