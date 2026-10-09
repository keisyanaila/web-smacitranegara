import { useSyncExternalStore } from 'react';

// Switch bahasa ID/EN. Situs ditulis dalam Bahasa Indonesia; versi Inggris dibuat
// otomatis oleh Google Translate (lihat components/GoogleTranslate.tsx).
// Pilihan disimpan di cookie `googtrans` — format yang dibaca langsung oleh Google:
//   "/id/en" → terjemahkan ke Inggris, tidak ada cookie → Bahasa Indonesia.

export type Lang = 'id' | 'en';

const COOKIE = 'googtrans';

export function readLang(): Lang {
  if (typeof document === 'undefined') return 'id';
  const m = document.cookie.match(/(?:^|;\s*)googtrans=([^;]*)/);
  return m && decodeURIComponent(m[1]).endsWith('/en') ? 'en' : 'id';
}

/** Domain tempat cookie mungkin pernah ditulis (oleh kita atau oleh Google). */
function cookieDomains(): (string | null)[] {
  const host = location.hostname;
  const parts = host.split('.');
  const list: (string | null)[] = [null, host, `.${host}`];
  if (parts.length > 2) list.push(`.${parts.slice(-2).join('.')}`);
  return list;
}

export function setLang(lang: Lang) {
  const expired = 'expires=Thu, 01 Jan 1970 00:00:00 GMT';
  for (const d of cookieDomains()) {
    const domain = d ? `; domain=${d}` : '';
    document.cookie = `${COOKIE}=; path=/${domain}; ${expired}`;
  }
  if (lang === 'en') {
    document.cookie = `${COOKIE}=/id/en; path=/; max-age=${60 * 60 * 24 * 365}`;
  }
  // Muat ulang supaya Google menerjemahkan (atau berhenti menerjemahkan) dari awal.
  location.reload();
}

const noopSubscribe = () => () => {};

/**
 * Bahasa aktif untuk komponen client. Server & render pertama selalu 'id'
 * (tanpa hydration mismatch), lalu langsung diperbarui dari cookie.
 * Teks yang dirender manual per bahasa harus diberi class "notranslate"
 * supaya tidak diterjemahkan dua kali oleh Google.
 */
export function useLang(): Lang {
  return useSyncExternalStore(noopSubscribe, readLang, () => 'id' as Lang);
}
