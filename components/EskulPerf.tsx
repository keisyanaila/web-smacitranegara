'use client';

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';

/**
 * Hemat performa halaman ekstrakurikuler (terutama di HP).
 * Setiap section di dalam <main> yang sedang tidak terlihat diberi atribut
 * `data-eskul-off`, lalu CSS (eskul-perf.css) menjeda semua animasinya.
 * Begitu section masuk layar lagi, animasi lanjut seperti biasa.
 */
export default function EskulPerf() {
  const pathname = usePathname();

  useEffect(() => {
    const sections = Array.from(document.querySelectorAll<HTMLElement>('main > *'));
    if (!sections.length || typeof IntersectionObserver === 'undefined') return;

    const obs = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          const el = entry.target as HTMLElement;
          if (entry.isIntersecting) el.removeAttribute('data-eskul-off');
          else el.setAttribute('data-eskul-off', '');
        }
      },
      { rootMargin: '150px 0px' }
    );
    sections.forEach((el) => obs.observe(el));

    return () => {
      obs.disconnect();
      sections.forEach((el) => el.removeAttribute('data-eskul-off'));
    };
  }, [pathname]);

  return null;
}
