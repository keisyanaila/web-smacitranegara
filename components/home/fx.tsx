'use client';

import { useEffect, useRef, useState, useSyncExternalStore } from 'react';
import { useLang } from '@/lib/lang';

// Efek-efek kecil untuk beranda. Prinsipnya supaya tetap ringan di HP:
// - animasi hanya transform/opacity (dikerjakan GPU),
// - efek yang mengikuti kursor hanya aktif di perangkat ber-mouse,
// - semua mati otomatis kalau pengguna memilih "kurangi gerakan".

const noop = () => () => {};

/** true kalau perangkat punya mouse & pengguna tidak minta kurangi gerakan. */
export function useFancyPointer() {
  return useSyncExternalStore(
    noop,
    () =>
      window.matchMedia('(pointer: fine)').matches &&
      !window.matchMedia('(prefers-reduced-motion: reduce)').matches,
    () => false
  );
}

// ── Reveal saat masuk layar (satu IntersectionObserver untuk semua elemen) ──
let sharedObserver: IntersectionObserver | null = null;
const callbacks = new WeakMap<Element, () => void>();

function observe(el: Element, cb: () => void) {
  if (!sharedObserver) {
    sharedObserver = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (!e.isIntersecting) continue;
          callbacks.get(e.target)?.();
          callbacks.delete(e.target);
          sharedObserver?.unobserve(e.target);
        }
      },
      { threshold: 0.15, rootMargin: '0px 0px -8% 0px' }
    );
  }
  callbacks.set(el, cb);
  sharedObserver.observe(el);
  return () => {
    callbacks.delete(el);
    sharedObserver?.unobserve(el);
  };
}

export function useInView<T extends Element>() {
  const ref = useRef<T | null>(null);
  const [inView, setInView] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    return observe(el, () => setInView(true));
  }, []);
  return { ref, inView };
}

/** Bungkus konten supaya muncul halus saat di-scroll. `variant` mengatur arah gerak. */
export function Reveal({
  children,
  delay = 0,
  variant = 'up',
  className = '',
}: {
  children: React.ReactNode;
  delay?: number;
  variant?: 'up' | 'left' | 'right' | 'zoom';
  className?: string;
}) {
  const { ref, inView } = useInView<HTMLDivElement>();
  return (
    <div
      ref={ref}
      className={`h-reveal h-reveal-${variant}${inView ? ' is-in' : ''} ${className}`}
      style={{ '--d': `${delay}ms` } as React.CSSProperties}
    >
      {children}
    </div>
  );
}

// ── Angka berjalan ──────────────────────────────────────────────────────────
function parseStat(value: string) {
  const m = value.match(/^([\d.]+)(.*)$/);
  if (!m) return { target: 0, suffix: value };
  return { target: parseInt(m[1].replace(/\./g, ''), 10), suffix: m[2] };
}

/** "1.200+" → hitung dari 0 sampai 1.200 saat terlihat. notranslate: lihat lib/lang.ts. */
export function Counter({ value, duration = 1400 }: { value: string; duration?: number }) {
  const { target, suffix } = parseStat(value);
  const { ref, inView } = useInView<HTMLSpanElement>();
  const [n, setN] = useState(0);
  const lang = useLang();

  useEffect(() => {
    if (!inView) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      const id = requestAnimationFrame(() => setN(target));
      return () => cancelAnimationFrame(id);
    }
    let frame = 0;
    const start = performance.now();
    const tick = (now: number) => {
      const p = Math.min((now - start) / duration, 1);
      setN(Math.round((1 - Math.pow(1 - p, 3)) * target));
      if (p < 1) frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [inView, target, duration]);

  return (
    <span ref={ref} className="notranslate" translate="no">
      {n.toLocaleString(lang === 'en' ? 'en-US' : 'id-ID')}
      {suffix}
    </span>
  );
}

// ── Kata yang berganti di judul hero ────────────────────────────────────────
const ROTATING_WORDS = {
  id: ['Cerah', 'Gemilang', 'Kompetitif', 'Mendunia'],
  en: ['Bright', 'Brilliant', 'Competitive', 'Global'],
};

export function RotatingWord() {
  const [index, setIndex] = useState(0);
  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const id = setInterval(() => setIndex((i) => (i + 1) % ROTATING_WORDS.id.length), 2400);
    return () => clearInterval(id);
  }, []);
  const words = ROTATING_WORDS[useLang()];
  // Pembungkus notranslate tetap; isi di-remount (key) supaya animasinya terulang.
  return (
    <span className="h-rotator notranslate" translate="no">
      <span key={index} className="h-rotator-word">
        {words[index]}
      </span>
    </span>
  );
}

// ── Tombol "magnet" (desktop) ───────────────────────────────────────────────
export function useMagnetic<T extends HTMLElement>(strength = 0.25) {
  const ref = useRef<T | null>(null);
  const fancy = useFancyPointer();
  useEffect(() => {
    const el = ref.current;
    if (!el || !fancy) return;
    const move = (e: PointerEvent) => {
      const r = el.getBoundingClientRect();
      el.style.transform = `translate(${(e.clientX - r.left - r.width / 2) * strength}px, ${(e.clientY - r.top - r.height / 2) * strength}px)`;
    };
    const leave = () => (el.style.transform = '');
    el.addEventListener('pointermove', move);
    el.addEventListener('pointerleave', leave);
    return () => {
      el.removeEventListener('pointermove', move);
      el.removeEventListener('pointerleave', leave);
    };
  }, [fancy, strength]);
  return ref;
}

/**
 * Sorotan cahaya yang mengikuti kursor di dalam kartu: set --mx/--my (px) pada
 * elemen yang di-hover. Dipasang sekali di kontainer (event delegation).
 */
export function useSpotlight<T extends HTMLElement>(selector: string) {
  const ref = useRef<T | null>(null);
  const fancy = useFancyPointer();
  useEffect(() => {
    const root = ref.current;
    if (!root || !fancy) return;
    const move = (e: PointerEvent) => {
      const card = (e.target as HTMLElement).closest<HTMLElement>(selector);
      if (!card || !root.contains(card)) return;
      const r = card.getBoundingClientRect();
      card.style.setProperty('--mx', `${e.clientX - r.left}px`);
      card.style.setProperty('--my', `${e.clientY - r.top}px`);
    };
    root.addEventListener('pointermove', move);
    return () => root.removeEventListener('pointermove', move);
  }, [fancy, selector]);
  return ref;
}
