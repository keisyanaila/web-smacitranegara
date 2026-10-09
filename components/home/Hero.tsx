'use client';

import { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight, Calendar, ChevronDown, Clock, Sparkles, Wifi, Award, FlaskConical } from 'lucide-react';
import { useLang } from '@/lib/lang';
import { labelRentang, tahunMulai, SPMB_URL, type Gelombang, type SpmbSetting } from '@/lib/spmb';
import { Counter, RotatingWord, useFancyPointer, useMagnetic } from './fx';

const STATS = [
  { value: '1.200+', label: 'Siswa Aktif' },
  { value: '98%', label: 'Tingkat Kelulusan' },
  { value: '85%', label: 'Keterima PTN Top' },
  { value: '3+', label: 'Tahun Berdiri' },
];

type Status = 'upcoming' | 'buka' | 'selesai';

function statusOf(g: Gelombang, now: Date): Status {
  if (now > new Date(g.selesai + 'T23:59:59')) return 'selesai';
  if (now >= new Date(g.mulai + 'T00:00:00')) return 'buka';
  return 'upcoming';
}

/** Gelombang yang sedang berjalan (atau berikutnya). Semua lewat → terakhir. */
function activeIndex(list: Gelombang[], now: Date) {
  const i = list.findIndex((g) => now <= new Date(g.selesai + 'T23:59:59'));
  return i === -1 ? list.length - 1 : i;
}

const DAY = 86_400_000;

/** Judul dipecah per kata supaya muncul satu-satu. */
function Words({ items, start = 0 }: { items: React.ReactNode[]; start?: number }) {
  return (
    <>
      {items.map((w, i) => (
        <span key={i}>
          <span className="h-w" style={{ '--i': start + i } as React.CSSProperties}>
            {w}
          </span>{' '}
        </span>
      ))}
    </>
  );
}

/**
 * Video latar hanya diputar di layar lebar dengan koneksi normal. Di HP / mode hemat
 * data cukup foto (dengan efek zoom pelan) — video 26 MB tidak pernah diunduh.
 */
function HeroMedia() {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [playing, setPlaying] = useState(false);

  useEffect(() => {
    const v = videoRef.current;
    if (!v) return;
    const conn = (navigator as Navigator & { connection?: { saveData?: boolean; effectiveType?: string } }).connection;
    const lite =
      window.matchMedia('(max-width: 900px), (prefers-reduced-motion: reduce)').matches ||
      conn?.saveData ||
      /(^|-)2g$|3g/.test(conn?.effectiveType ?? '');
    if (lite) return;

    let started = false;
    const start = () => {
      started = true;
      v.src = '/videos/sma.mp4';
      v.play().catch(() => {});
    };
    // Mulai unduh video setelah halaman tenang, supaya tidak berebut dengan konten utama.
    const w = window as Window & {
      requestIdleCallback?: (cb: () => void, o?: { timeout: number }) => number;
      cancelIdleCallback?: (id: number) => void;
    };
    let cancelStart: () => void;
    if (w.requestIdleCallback) {
      const id = w.requestIdleCallback(start, { timeout: 2500 });
      cancelStart = () => w.cancelIdleCallback?.(id);
    } else {
      const id = window.setTimeout(start, 1200);
      cancelStart = () => clearTimeout(id);
    }

    // Hemat baterai: jeda video saat hero tidak terlihat.
    const io = new IntersectionObserver(([e]) => {
      if (!started) return;
      if (e.isIntersecting) v.play().catch(() => {});
      else v.pause();
    });
    io.observe(v);
    return () => {
      io.disconnect();
      cancelStart();
    };
  }, []);

  return (
    <div className="h-hero-media" aria-hidden="true">
      <Image
        src="/images/ipa.jpg"
        alt=""
        fill
        sizes="100vw"
        loading="eager"
        fetchPriority="high"
        className="h-hero-poster"
      />
      <video
        ref={videoRef}
        className={`h-hero-video${playing ? ' is-on' : ''}`}
        muted
        loop
        playsInline
        preload="none"
        onPlaying={() => setPlaying(true)}
      />
      <div className="h-hero-tint" />
    </div>
  );
}

export default function Hero({ spmb }: { spmb: SpmbSetting }) {
  const lang = useLang();
  const fancy = useFancyPointer();
  const heroRef = useRef<HTMLElement | null>(null);
  const ctaRef = useMagnetic<HTMLAnchorElement>();
  const cardCtaRef = useMagnetic<HTMLAnchorElement>(0.15);

  const TA = spmb.tahunAjaran;
  const list = spmb.gelombang;
  const now = new Date();
  const active = activeIndex(list, now);
  const activeStatus = statusOf(list[active], now);

  const [daysLeft, setDaysLeft] = useState<number | null>(null);
  useEffect(() => {
    const update = () =>
      setDaysLeft(Math.max(0, Math.ceil((new Date(list[active].selesai + 'T23:59:59').getTime() - Date.now()) / DAY)));
    const first = requestAnimationFrame(update);
    const id = setInterval(update, 60 * 60 * 1000);
    return () => {
      cancelAnimationFrame(first);
      clearInterval(id);
    };
  }, [list, active]);
  const dibuka = activeStatus === 'buka' && daysLeft !== null && daysLeft > 0;

  // Parallax + sorotan kursor: hanya di perangkat ber-mouse, diperbarui per frame.
  useEffect(() => {
    const el = heroRef.current;
    if (!el || !fancy) return;
    let frame = 0;
    let x = 0;
    let y = 0;
    const move = (e: PointerEvent) => {
      const r = el.getBoundingClientRect();
      x = e.clientX - r.left;
      y = e.clientY - r.top;
      if (frame) return;
      frame = requestAnimationFrame(() => {
        frame = 0;
        el.style.setProperty('--sx', `${x}px`);
        el.style.setProperty('--sy', `${y}px`);
        el.style.setProperty('--px', ((x / r.width) * 2 - 1).toFixed(3));
        el.style.setProperty('--py', ((y / r.height) * 2 - 1).toFixed(3));
      });
    };
    const leave = () => {
      el.style.setProperty('--px', '0');
      el.style.setProperty('--py', '0');
    };
    el.addEventListener('pointermove', move);
    el.addEventListener('pointerleave', leave);
    return () => {
      el.removeEventListener('pointermove', move);
      el.removeEventListener('pointerleave', leave);
      cancelAnimationFrame(frame);
    };
  }, [fancy]);

  const statusLabel = (s: Status) => (s === 'buka' ? 'DIBUKA' : s === 'selesai' ? 'DITUTUP' : 'AKAN DATANG');

  return (
    <section ref={heroRef} className="h-hero" id="beranda">
      <HeroMedia />
      <div className="h-aurora" aria-hidden="true">
        <span />
        <span />
      </div>
      <div className="h-gridlines" aria-hidden="true" />
      <div className="h-spot" aria-hidden="true" />

      <div className="h-hero-inner">
        <div className="h-hero-copy">
          <div className="h-badge h-in" style={{ '--i': 0 } as React.CSSProperties}>
            <span className="h-badge-dot" />
            PENERIMAAN PESERTA DIDIK BARU {TA}
          </div>

          <h1 className="h-title font-display">
            {lang === 'en' ? (
              <span className="notranslate" translate="no">
                <Words items={['Achieve', 'a', <RotatingWord key="r" />, 'Future', 'with', 'SMA', 'Citra', 'Negara']} start={1} />
              </span>
            ) : (
              <Words items={['Raih', 'Masa', 'Depan', <RotatingWord key="r" />, 'Bersama', 'SMA', 'Citra', 'Negara']} start={1} />
            )}
          </h1>

          <p className="h-desc h-in" style={{ '--i': 9 } as React.CSSProperties}>
            Bergabunglah dengan ribuan alumni sukses. Pendidikan berkualitas tinggi dengan kurikulum terkini,
            fasilitas modern, dan lingkungan yang mendukung kamu tumbuh.
          </p>

          <div className="h-actions h-in" style={{ '--i': 10 } as React.CSSProperties} id="h-hero-cta">
            <a ref={ctaRef} href={SPMB_URL} target="_blank" rel="noopener noreferrer" className="h-btn h-btn-gold">
              <span>Daftar SPMB Sekarang</span>
              <ArrowRight size={18} />
            </a>
            <Link href="/tentang" className="h-btn h-btn-ghost">
              Pelajari Lebih Lanjut
            </Link>
          </div>

          {dibuka && (
            <div className="h-countdown">
              <Clock size={14} />
              <span>
                <strong className="notranslate" translate="no">{daysLeft}</strong> hari lagi menuju penutupan{' '}
                {list[active].nama}
              </span>
            </div>
          )}

          <dl className="h-stats h-in" style={{ '--i': 11 } as React.CSSProperties}>
            {STATS.map((s) => (
              <div key={s.label} className="h-stat">
                <dt className="font-display">
                  <Counter value={s.value} />
                </dt>
                <dd>{s.label}</dd>
              </div>
            ))}
          </dl>
        </div>

        {/* Kartu jadwal SPMB */}
        <div className="h-hero-side h-in" style={{ '--i': 6 } as React.CSSProperties}>
          <div className="h-chip h-chip-1"><Award size={15} /> Akreditasi A</div>
          <div className="h-chip h-chip-2"><Wifi size={15} /> Starlink 1 Gbps</div>
          <div className="h-chip h-chip-3"><FlaskConical size={15} /> 50+ Fasilitas Lab</div>

          <div className="h-tl-card">
            <div className="h-tl-head">
              <div className="h-tl-icon"><Calendar size={20} /></div>
              <div>
                <h2 className="font-display">Jadwal SPMB {tahunMulai(TA)}</h2>
                <p>Tahun Ajaran {TA}</p>
              </div>
            </div>

            <ol className="h-tl-list">
              {list.map((g, i) => {
                const s = statusOf(g, now);
                const isActive = i === active;
                return (
                  <li
                    key={i}
                    className={`h-tl-item${isActive ? ' is-active' : ''}${s === 'selesai' ? ' is-done' : ''}`}
                  >
                    <span className="h-tl-dot">{s === 'selesai' ? '✓' : i + 1}</span>
                    <div className="h-tl-body">
                      <div className="h-tl-row">
                        <span className="h-tl-name">{g.nama}</span>
                        <span className="h-tl-badge">{statusLabel(s)}</span>
                      </div>
                      <div className="h-tl-date">{labelRentang(g.mulai, g.selesai, true)}</div>
                    </div>
                  </li>
                );
              })}
            </ol>

            <a ref={cardCtaRef} href={SPMB_URL} target="_blank" rel="noopener noreferrer" className="h-btn h-btn-gold h-btn-block">
              <Sparkles size={16} /> Mulai Pendaftaran
            </a>
          </div>
        </div>
      </div>

      <a href="#keunggulan" className="h-scroll-cue" aria-label="Gulir ke bawah">
        <span>Gulir</span>
        <ChevronDown size={18} />
      </a>
    </section>
  );
}
