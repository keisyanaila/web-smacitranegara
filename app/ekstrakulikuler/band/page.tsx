'use client';
import { useEffect, useRef, useState } from 'react';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import EskulMusic from '@/components/EskulMusic';
import Image from 'next/image';

const STATS = [
  { angka: '2023', label: 'Tahun Berdiri' },
  { angka: '20+',  label: 'Anggota Aktif' },
  { angka: '6',    label: 'Prestasi Diraih' },
  { angka: '100%', label: 'Passion' },
];

const TUJUAN = [
  {
    icon: '🎸',
    judul: 'Keterampilan Musik',
    deskripsi:
      'Meningkatkan kemampuan siswa dalam memainkan berbagai alat musik dan memahami teori musik secara lebih mendalam.',
  },
  {
    icon: '🎨',
    judul: 'Kreativitas & Ekspresi',
    deskripsi:
      'Mendorong siswa mengekspresikan diri melalui musik dan menginspirasi mereka untuk menciptakan karya original.',
  },
  {
    icon: '💪',
    judul: 'Disiplin & Kepercayaan Diri',
    deskripsi:
      'Membangun disiplin latihan, komitmen terhadap grup, dan keberanian tampil di depan umum dengan penuh percaya diri.',
  },
];

const KEGIATAN = [
  { no: '01', nama: 'Latihan Rutin Mingguan',    detail: 'Teknik bermain dan harmoni seluruh anggota band.', kategori: 'latihan' },
  { no: '02', nama: 'Workshop & Masterclass',    detail: 'Musisi profesional berbagi teknik dan pengalaman.', kategori: 'latihan' },
  { no: '03', nama: 'Konser & Penampilan',        detail: 'Pentas seni, festival, dan kompetisi antar sekolah.', kategori: 'penampilan' },
  { no: '04', nama: 'Rekaman Musik',              detail: 'Proses produksi dan teknik rekaman di studio.', kategori: 'produksi' },
  { no: '05', nama: 'Pembuatan Lagu & Aransemen', detail: 'Kolaborasi menciptakan karya-karya original.', kategori: 'produksi' },
  { no: '06', nama: 'Jam Session',                detail: 'Improvisasi dadakan untuk melatih kreativitas.', kategori: 'latihan' },
];

const FILTERS = [
  { key: 'semua', label: 'Semua' },
  { key: 'latihan', label: 'Latihan' },
  { key: 'produksi', label: 'Produksi' },
  { key: 'penampilan', label: 'Penampilan' },
];

const AUDIO_SRC = '/audio/musikband.mp3';

/* ── reusable vinyl-record glyph, jadi motif berulang khas halaman ini ── */
function Vinyl({ size = 56, className = '' }: { size?: number; className?: string }) {
  return (
    <svg viewBox="0 0 100 100" width={size} height={size} className={className} aria-hidden="true">
      <circle cx="50" cy="50" r="47" fill="#14201A" stroke="#123D26" strokeWidth="2.5" />
      <circle cx="50" cy="50" r="36" fill="none" stroke="#2C3D33" strokeWidth="1.5" />
      <circle cx="50" cy="50" r="26" fill="none" stroke="#2C3D33" strokeWidth="1.5" />
      <circle cx="50" cy="50" r="16" fill="#C9F24B" stroke="#123D26" strokeWidth="2.5" />
      <circle cx="50" cy="50" r="4" fill="#123D26" />
    </svg>
  );
}

/* ── generic "reveal on scroll" hook ── */
function useInView<T extends HTMLElement>(threshold = 0.25) {
  const ref = useRef<T | null>(null);
  const [inView, setInView] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
          obs.unobserve(el);
        }
      },
      { threshold }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [threshold]);
  return [ref, inView] as const;
}

/* ── parses "20+" / "100%" / "2015" jadi angka yang bisa dihitung naik + sisa teksnya ── */
function parseStat(value: string) {
  const match = value.match(/^(\d+)(.*)$/);
  if (!match) return { num: 0, suffix: value };
  return { num: parseInt(match[1], 10), suffix: match[2] };
}

function StatCounter({
  angka, label, inView, delay,
}: { angka: string; label: string; inView: boolean; delay: number }) {
  const { num, suffix } = parseStat(angka);
  const [display, setDisplay] = useState(0);

  useEffect(() => {
    if (!inView) return;
    let raf = 0;
    const start = performance.now() + delay;
    const duration = 1100;
    const tick = (now: number) => {
      const elapsed = now - start;
      if (elapsed < 0) {
        raf = requestAnimationFrame(tick);
        return;
      }
      const t = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - t, 3);
      setDisplay(Math.round(eased * num));
      if (t < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [inView, num, delay]);

  return (
    <div className="psk-stat">
      <div className="psk-stat-num">
        {display}
        {suffix}
      </div>
      <div className="psk-stat-label">{label}</div>
    </div>
  );
}

export default function BandPage() {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [filter, setFilter] = useState('semua');
  const [vinylHit, setVinylHit] = useState(false);
  const [statsRef, statsInView] = useInView<HTMLDivElement>(0.4);
  const [tujuanRef, tujuanInView] = useInView<HTMLDivElement>(0.15);

  const filtered = filter === 'semua' ? KEGIATAN : KEGIATAN.filter((k) => k.kategori === filter);

  // ── audio: coba autoplay senyap (biasanya diblokir), fallback nyala di interaksi pertama ──
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    audio.volume = 0.4;

    const tryPlay = async () => {
      try {
        await audio.play();
        setIsPlaying(true);
      } catch {
        // sengaja diabaikan — menunggu interaksi pertama user
      }
    };
    tryPlay();

    const startOnInteract = () => {
      audio.play().then(() => setIsPlaying(true)).catch(() => {});
      window.removeEventListener('pointerdown', startOnInteract);
      window.removeEventListener('keydown', startOnInteract);
    };
    window.addEventListener('pointerdown', startOnInteract, { once: true });
    window.addEventListener('keydown', startOnInteract, { once: true });

    return () => {
      window.removeEventListener('pointerdown', startOnInteract);
      window.removeEventListener('keydown', startOnInteract);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const toggleAudio = () => {
    const audio = audioRef.current;
    if (!audio) return;
    if (isPlaying) {
      audio.pause();
      setIsPlaying(false);
    } else {
      audio.play().then(() => setIsPlaying(true)).catch(() => {});
    }
  };

  // tap vinyl di section "Join" -> mainkan animasi + toggle musik sekalian (bukan cuma dekorasi)
  const handleVinylTap = () => {
    setVinylHit(true);
    setTimeout(() => setVinylHit(false), 650);
    toggleAudio();
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Barlow:wght@400;500;600;700&family=Barlow+Condensed:wght@600;700;800;900&family=Space+Mono:wght@400;700&display=swap');

        .psk-root {
          --paper: #F5F1E0;
          --paper-2: #FFFFFF;
          --ink: #14201A;
          --forest: #1F5D3A;
          --forest-deep: #123D26;
          --lime: #C9F24B;
          --gold: #FFC53D;

          font-family: 'Barlow', sans-serif;
          background: var(--paper);
          color: var(--ink);
          min-height: 100vh;
          overflow-x: hidden;
        }
        .psk-root * { box-sizing: border-box; }

        @media (prefers-reduced-motion: reduce) {
          .psk-root *, .psk-root *::before, .psk-root *::after {
            animation-duration: 0.001ms !important;
            animation-iteration-count: 1 !important;
            transition-duration: 0.001ms !important;
          }
        }

        /* ══ hero ══ */
        .psk-hero {
          position: relative;
          overflow: hidden;
          background: var(--paper);
        }
        .psk-hero-img {
          position: relative;
          width: 100%;
          height: min(72vh, 600px);
        }
        .psk-hero-img img {
          object-fit: cover;
          object-position: center 20%;
          filter: saturate(1.05) contrast(1.05);
        }
        .psk-hero-overlay {
          position: absolute;
          inset: 0;
          background:
            radial-gradient(55% 45% at 78% 15%, rgba(201,242,75,0.18), transparent 60%),
            linear-gradient(to bottom, rgba(18,32,26,0.15) 0%, rgba(18,32,26,0.5) 70%, var(--paper) 100%);
        }
        .psk-hero-lines {
          position: absolute;
          inset: 0;
          opacity: 0.16;
          pointer-events: none;
        }
        .psk-hero-content {
          position: absolute;
          bottom: 0; left: 0; right: 0;
          padding: 0 clamp(24px, 6vw, 80px) clamp(40px, 5vw, 64px);
          display: flex;
          align-items: flex-end;
          justify-content: space-between;
          gap: 24px;
        }
        .psk-eyebrow {
          display: inline-flex;
          align-items: center;
          gap: 10px;
          font-family: 'Space Mono', monospace;
          font-size: 12px;
          font-weight: 700;
          letter-spacing: 4px;
          text-transform: uppercase;
          color: #fff;
          margin-bottom: 18px;
        }
        .psk-eyebrow::before {
          content: '';
          display: block;
          width: 28px; height: 2px;
          background: var(--lime);
        }
        .psk-title {
          font-family: 'Bebas Neue', sans-serif;
          font-size: clamp(76px, 13vw, 168px);
          line-height: 0.86;
          color: #fff;
          letter-spacing: 1px;
          margin: 0 0 18px;
          text-transform: uppercase;
        }
        .psk-title span {
          color: transparent;
          -webkit-text-stroke: 2.5px var(--lime);
        }
        .psk-subtitle {
          max-width: 480px;
          font-size: clamp(15px, 1.7vw, 17px);
          color: rgba(255,255,255,0.85);
          line-height: 1.7;
        }
        .psk-hero-text { max-width: 640px; }

        /* motif vinyl melayang & mantul — ciri khas halaman ini */
        .psk-hero-motif-zone {
          position: relative;
          width: 140px;
          height: 220px;
          flex-shrink: 0;
          display: none;
        }
        @media (min-width: 900px) { .psk-hero-motif-zone { display: block; } }
        .psk-motif-bounce {
          position: absolute;
          bottom: 46px;
          left: 30px;
          animation: pskBounce 1.7s cubic-bezier(.36,.02,.66,1) infinite;
        }
        .psk-motif-bounce svg { animation: pskSpin 1.7s linear infinite; display: block; }
        @keyframes pskBounce {
          0%   { transform: translateY(0); }
          45%  { transform: translateY(-150px); }
          55%  { transform: translateY(-150px); }
          100% { transform: translateY(0); }
        }
        @keyframes pskSpin {
          from { transform: rotate(0deg); }
          to   { transform: rotate(360deg); }
        }
        .psk-motif-shadow {
          position: absolute;
          bottom: 30px;
          left: 30px;
          width: 56px; height: 14px;
          border-radius: 50%;
          background: rgba(0,0,0,0.35);
          filter: blur(2px);
          animation: pskShadowPulse 1.7s cubic-bezier(.36,.02,.66,1) infinite;
        }
        @keyframes pskShadowPulse {
          0%   { transform: scale(1); opacity: 0.45; }
          45%  { transform: scale(0.4); opacity: 0.12; }
          55%  { transform: scale(0.4); opacity: 0.12; }
          100% { transform: scale(1); opacity: 0.45; }
        }

        .psk-scroll-cue {
          position: absolute;
          right: clamp(20px, 5vw, 64px);
          top: 24px;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 8px;
          font-family: 'Space Mono', monospace;
          font-size: 11px;
          letter-spacing: 3px;
          color: rgba(255,255,255,0.7);
        }
        .psk-scroll-line {
          width: 1px; height: 46px;
          background: linear-gradient(to bottom, rgba(201,242,75,0.9), transparent);
          position: relative;
          overflow: hidden;
        }
        .psk-scroll-line::after {
          content: '';
          position: absolute;
          top: -20px; left: -2px;
          width: 5px; height: 5px;
          border-radius: 50%;
          background: var(--lime);
          animation: pskScrollDot 1.8s ease-in-out infinite;
        }
        @keyframes pskScrollDot {
          0% { top: -6px; opacity: 0; }
          20% { opacity: 1; }
          80% { opacity: 1; }
          100% { top: 46px; opacity: 0; }
        }

        /* ══ marquee ticker ══ */
        .psk-ticker {
          border-top: 1px solid rgba(31,93,58,0.18);
          border-bottom: 1px solid rgba(31,93,58,0.18);
          background: #EDEADA;
          overflow: hidden;
          white-space: nowrap;
          padding: 12px 0;
        }
        .psk-ticker-track {
          display: inline-flex;
          animation: pskTickerScroll 22s linear infinite;
        }
        .psk-ticker-track span {
          font-family: 'Space Mono', monospace;
          font-size: 13px;
          font-weight: 700;
          letter-spacing: 2px;
          text-transform: uppercase;
          color: rgba(20,32,26,0.55);
          padding: 0 28px;
          display: inline-flex;
          align-items: center;
          gap: 10px;
        }
        .psk-ticker-track span b { color: var(--forest); }
        @keyframes pskTickerScroll {
          from { transform: translateX(0); }
          to   { transform: translateX(-50%); }
        }

        /* ══ scoreboard stats (sengaja gelap, kayak papan skor konser) ══ */
        .psk-scoreboard { background: var(--forest-deep); }
        .psk-stats {
          max-width: 1100px;
          margin: 0 auto;
          display: grid;
          grid-template-columns: repeat(4, 1fr);
        }
        @media (max-width: 640px) { .psk-stats { grid-template-columns: repeat(2, 1fr); } }
        .psk-stat {
          padding: clamp(28px, 4vw, 44px) 20px;
          text-align: center;
          border-right: 1px solid rgba(201,242,75,0.14);
        }
        .psk-stat:last-child { border-right: none; }
        .psk-stat-num {
          font-family: 'Bebas Neue', sans-serif;
          font-size: clamp(38px, 5vw, 54px);
          color: var(--lime);
          line-height: 1;
          margin-bottom: 8px;
          text-shadow: 0 0 18px rgba(201,242,75,0.35);
          font-variant-numeric: tabular-nums;
        }
        .psk-stat-label {
          font-family: 'Space Mono', monospace;
          font-size: 11px;
          font-weight: 700;
          letter-spacing: 2px;
          text-transform: uppercase;
          color: rgba(255,255,255,0.55);
        }

        /* ══ section base ══ */
        .psk-section {
          max-width: 1100px;
          margin: 0 auto;
          padding: clamp(56px, 8vw, 100px) clamp(24px, 6vw, 80px);
        }
        .psk-section-label {
          font-family: 'Space Mono', monospace;
          font-size: 11px;
          font-weight: 700;
          letter-spacing: 3px;
          text-transform: uppercase;
          color: var(--forest);
          margin-bottom: 12px;
        }
        .psk-section-heading {
          font-family: 'Bebas Neue', sans-serif;
          font-size: clamp(40px, 5vw, 66px);
          color: var(--ink);
          line-height: 1;
          margin-bottom: 44px;
          text-transform: uppercase;
        }

        /* ══ tujuan cards ══ */
        .psk-tujuan-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 18px;
        }
        @media (max-width: 768px) { .psk-tujuan-grid { grid-template-columns: 1fr; } }
        .psk-tujuan-card {
          background: var(--paper-2);
          padding: 36px 28px;
          border: 1px solid rgba(31,93,58,0.14);
          border-radius: 16px;
          transition: box-shadow 0.25s, border-color 0.25s, transform 0.25s;
          position: relative;
          overflow: hidden;
          opacity: 0;
          transform: translateY(24px);
        }
        .psk-tujuan-card.in-view {
          opacity: 1;
          transform: translateY(0);
          transition: box-shadow 0.25s, border-color 0.25s, transform 0.6s cubic-bezier(.2,.7,.2,1), opacity 0.6s;
        }
        .psk-tujuan-card::after {
          content: '';
          position: absolute;
          bottom: 0; left: 0; right: 0;
          height: 3px;
          background: linear-gradient(90deg, var(--forest), var(--gold));
          transform: scaleX(0);
          transform-origin: left;
          transition: transform 0.35s ease;
        }
        .psk-tujuan-card:hover {
          box-shadow: 0 16px 32px rgba(18,32,26,0.1);
          border-color: rgba(31,93,58,0.3);
          transform: translateY(-4px);
        }
        .psk-tujuan-card:hover::after { transform: scaleX(1); }
        .psk-tujuan-icon {
          font-size: 34px;
          margin-bottom: 20px;
          display: inline-block;
          transition: transform 0.3s cubic-bezier(.36,.02,.66,1.4);
        }
        .psk-tujuan-card:hover .psk-tujuan-icon {
          animation: pskIconBounce 0.6s cubic-bezier(.36,.02,.4,1.4);
        }
        @keyframes pskIconBounce {
          0%   { transform: translateY(0) scale(1); }
          35%  { transform: translateY(-10px) scale(1.08); }
          60%  { transform: translateY(0) scale(0.96); }
          100% { transform: translateY(0) scale(1); }
        }
        .psk-tujuan-title {
          font-family: 'Barlow Condensed', sans-serif;
          font-size: 20px;
          font-weight: 800;
          color: var(--ink);
          text-transform: uppercase;
          letter-spacing: 0.5px;
          margin-bottom: 12px;
        }
        .psk-tujuan-desc {
          font-size: 14px;
          color: rgba(20,32,26,0.62);
          line-height: 1.75;
        }

        /* ══ divider ══ */
        .psk-divider {
          max-width: 1100px;
          margin: 0 auto;
          padding: 0 clamp(24px, 6vw, 80px);
        }
        .psk-divider svg { width: 100%; height: 28px; opacity: 0.45; display: block; }

        /* ══ kegiatan ══ */
        .psk-filters {
          display: flex;
          flex-wrap: wrap;
          gap: 10px;
          margin-bottom: 36px;
        }
        .psk-chip {
          font-family: 'Space Mono', monospace;
          font-size: 12px;
          font-weight: 700;
          letter-spacing: 1.5px;
          text-transform: uppercase;
          padding: 10px 18px;
          border-radius: 999px;
          border: 1px solid rgba(31,93,58,0.3);
          background: var(--paper-2);
          color: rgba(20,32,26,0.65);
          cursor: pointer;
          transition: all 0.2s ease;
        }
        .psk-chip:hover { border-color: var(--forest); color: var(--ink); }
        .psk-chip.active {
          background: var(--forest);
          border-color: var(--forest);
          color: #fff;
        }

        .psk-kegiatan-list {
          position: relative;
          border-left: 1px solid rgba(31,93,58,0.25);
          padding-left: clamp(24px, 4vw, 40px);
        }
        .psk-kegiatan-item {
          position: relative;
          padding: 20px 0;
          display: flex;
          align-items: flex-start;
          gap: 20px;
          border-bottom: 1px solid rgba(31,93,58,0.12);
          opacity: 0;
          transform: translateX(-16px);
          animation: pskItemIn 0.5s ease forwards;
        }
        .psk-kegiatan-item:last-child { border-bottom: none; }
        @keyframes pskItemIn {
          to { opacity: 1; transform: translateX(0); }
        }
        .psk-kegiatan-item::before {
          content: '';
          position: absolute;
          left: calc(-1 * clamp(24px, 4vw, 40px) - 5px);
          top: 28px;
          width: 9px; height: 9px;
          border-radius: 50%;
          background: var(--paper);
          border: 2px solid var(--forest);
          transition: background 0.2s, border-color 0.2s;
        }
        .psk-kegiatan-item:hover::before { background: var(--gold); border-color: var(--gold); }
        .psk-kegiatan-no {
          font-family: 'Bebas Neue', sans-serif;
          font-size: 28px;
          color: rgba(31,93,58,0.35);
          line-height: 1;
          flex-shrink: 0;
          width: 38px;
          transition: color 0.2s;
        }
        .psk-kegiatan-item:hover .psk-kegiatan-no { color: var(--gold); }
        .psk-kegiatan-nama {
          font-family: 'Barlow Condensed', sans-serif;
          font-size: 17px;
          font-weight: 700;
          color: var(--ink);
          text-transform: uppercase;
          letter-spacing: 0.5px;
          margin-bottom: 4px;
        }
        .psk-kegiatan-detail { font-size: 13px; color: rgba(20,32,26,0.55); }

        /* ══ join / cta ══ */
        .psk-join {
          text-align: center;
          padding: clamp(64px, 9vw, 110px) clamp(24px, 6vw, 80px);
          background: radial-gradient(60% 80% at 50% 0%, rgba(31,93,58,0.1), transparent 70%);
        }
        .psk-join-heading {
          font-family: 'Bebas Neue', sans-serif;
          font-size: clamp(36px, 6vw, 60px);
          color: var(--ink);
          text-transform: uppercase;
          line-height: 1.05;
          margin-bottom: 18px;
        }
        .psk-join-heading span { color: var(--forest); }
        .psk-join-copy {
          max-width: 480px;
          margin: 0 auto 32px;
          font-size: 15px;
          color: rgba(20,32,26,0.62);
          line-height: 1.75;
        }
        .psk-join-motif {
          display: inline-flex;
          flex-direction: column;
          align-items: center;
          gap: 10px;
          cursor: pointer;
          background: none;
          border: none;
          padding: 0;
        }
        .psk-join-motif svg { transition: transform 0.15s ease; }
        .psk-join-motif:hover svg { transform: scale(1.06) rotate(-6deg); }
        .psk-join-motif.hit svg { animation: pskSwish 0.6s ease; }
        @keyframes pskSwish {
          0%   { transform: scale(1) rotate(0); }
          30%  { transform: scale(0.85) translateY(6px) rotate(20deg); }
          60%  { transform: scale(1.12) translateY(-10px) rotate(-15deg); }
          100% { transform: scale(1) rotate(0); }
        }
        .psk-join-hint {
          font-family: 'Space Mono', monospace;
          font-size: 11px;
          letter-spacing: 2px;
          text-transform: uppercase;
          color: rgba(20,32,26,0.45);
        }
        .psk-join-ripple { position: relative; }
        .psk-join-ripple::after {
          content: '';
          position: absolute;
          inset: -14px;
          border-radius: 50%;
          border: 2px solid var(--forest);
          opacity: 0;
        }
        .psk-join-motif.hit .psk-join-ripple::after {
          animation: pskRipple 0.65s ease-out;
        }
        @keyframes pskRipple {
          0%   { opacity: 0.8; transform: scale(0.6); }
          100% { opacity: 0; transform: scale(1.8); }
        }

        /* ══ audio fab (kontrol musik persisten) ══ */
        .psk-audio-fab {
          position: fixed;
          right: 20px; bottom: 20px;
          z-index: 50;
          display: flex;
          align-items: center;
          gap: 10px;
          background: var(--forest-deep);
          border: 2px solid var(--forest-deep);
          border-radius: 999px;
          padding: 9px 16px 9px 10px;
          cursor: pointer;
          box-shadow: 4px 4px 0 var(--lime);
          transition: transform 0.15s ease, box-shadow 0.15s ease;
        }
        .psk-audio-fab:hover { transform: translate(-2px,-2px); box-shadow: 6px 6px 0 var(--lime); }
        .psk-audio-fab:active { transform: translate(0,0); box-shadow: 2px 2px 0 var(--lime); }
        .psk-audio-fab-icon {
          width: 32px; height: 32px;
          border-radius: 50%;
          background: var(--lime);
          display: flex; align-items: center; justify-content: center;
          font-size: 14px; flex-shrink: 0;
        }
        .psk-audio-fab-label {
          font-family: 'Space Mono', monospace;
          font-size: 11px;
          font-weight: 700;
          letter-spacing: 1px;
          text-transform: uppercase;
          color: var(--paper);
        }
        .psk-audio-fab-eq { display: flex; align-items: flex-end; gap: 3px; height: 16px; }
        .psk-audio-fab-eq span {
          width: 3px; border-radius: 2px; background: var(--lime);
          animation: pskEqBounce 0.9s ease-in-out infinite;
        }
        .psk-audio-fab-eq.paused span { animation-play-state: paused; transform: scaleY(0.25); }
        .psk-audio-fab-eq span:nth-child(1){height:40%;animation-delay:-0.6s}
        .psk-audio-fab-eq span:nth-child(2){height:100%;animation-delay:-0.2s}
        .psk-audio-fab-eq span:nth-child(3){height:65%;animation-delay:-0.8s}
        @keyframes pskEqBounce { 0%,100%{transform:scaleY(0.35);} 50%{transform:scaleY(1);} }
      `}</style>

      <div className="psk-root">
        <audio ref={audioRef} src={AUDIO_SRC} loop preload="auto" />

        <Navbar />

        <main>
          {/* ══ Hero ══ */}
          <section className="psk-hero">
            <div className="psk-hero-img">
              <Image
                src="/images/eskul/eskulband.jpeg"
                alt="Band SMK Citra Negara"
                fill
                priority
                sizes="100vw"
              />
              <div className="psk-hero-overlay" />
              <svg className="psk-hero-lines" viewBox="0 0 800 400" preserveAspectRatio="none" aria-hidden="true">
                <circle cx="700" cy="80" r="90" fill="none" stroke="#fff" strokeWidth="1.5" />
                <line x1="600" y1="0" x2="600" y2="400" stroke="#fff" strokeWidth="1.5" />
              </svg>
            </div>

            <div className="psk-scroll-cue">
              <span>GULIR</span>
              <div className="psk-scroll-line" />
            </div>

            <div className="psk-hero-content">
              <div className="psk-hero-text">
                <div className="psk-eyebrow">Ekstrakurikuler SMK Citra Negara</div>
                <h1 className="psk-title">
                  BA<span>ND</span>
                </h1>
                <p className="psk-subtitle">
                  Lebih dari sekadar bermusik — ruang berekspresi, berkolaborasi, dan mencetak musisi berbakat dari SMK Citra Negara.
                </p>
              </div>

              <div className="psk-hero-motif-zone" aria-hidden="true">
                <div className="psk-motif-shadow" />
                <div className="psk-motif-bounce">
                  <Vinyl size={70} />
                </div>
              </div>
            </div>
          </section>

          {/* ══ Ticker (dekoratif) ══ */}
          <div className="psk-ticker" aria-hidden="true">
            <div className="psk-ticker-track">
              {[0, 1].map((rep) => (
                <span key={rep} style={{ display: 'inline-flex' }}>
                  {STATS.map((s) => (
                    <span key={s.label + rep}>
                      🎵 <b>{s.angka}</b> {s.label}
                    </span>
                  ))}
                </span>
              ))}
            </div>
          </div>

          {/* ══ Scoreboard stats ══ */}
          <div className="psk-scoreboard">
            <div className="psk-stats" ref={statsRef}>
              {STATS.map((s, i) => (
                <StatCounter key={s.label} angka={s.angka} label={s.label} inView={statsInView} delay={i * 120} />
              ))}
            </div>
          </div>

          {/* ══ Tujuan ══ */}
          <section className="psk-section">
            <div className="psk-section-label">Mengapa Band</div>
            <h2 className="psk-section-heading">TUJUAN KAMI</h2>
            <div className="psk-tujuan-grid" ref={tujuanRef}>
              {TUJUAN.map((t) => (
                <div key={t.judul} className={`psk-tujuan-card${tujuanInView ? ' in-view' : ''}`}>
                  <span className="psk-tujuan-icon" aria-hidden="true">{t.icon}</span>
                  <div className="psk-tujuan-title">{t.judul}</div>
                  <p className="psk-tujuan-desc">{t.deskripsi}</p>
                </div>
              ))}
            </div>
          </section>

          <div className="psk-divider">
            <svg viewBox="0 0 1000 28" preserveAspectRatio="none">
              <path d="M0,14 C250,-10 350,38 500,14 C650,-10 750,38 1000,14" fill="none" stroke="#1F5D3A" strokeWidth="1.5" />
            </svg>
          </div>

          {/* ══ Kegiatan ══ */}
          <section className="psk-section" style={{ paddingTop: 'clamp(40px, 5vw, 64px)' }}>
            <div className="psk-section-label">Program Latihan</div>
            <h2 className="psk-section-heading">KEGIATAN RUTIN</h2>

            <div className="psk-filters" role="group" aria-label="Filter kegiatan">
              {FILTERS.map((f) => (
                <button
                  key={f.key}
                  type="button"
                  className={`psk-chip${filter === f.key ? ' active' : ''}`}
                  onClick={() => setFilter(f.key)}
                >
                  {f.label}
                </button>
              ))}
            </div>

            <div className="psk-kegiatan-list">
              {filtered.map((k, i) => (
                <div key={k.no} className="psk-kegiatan-item" style={{ animationDelay: `${i * 0.06}s` }}>
                  <div className="psk-kegiatan-no">{k.no}</div>
                  <div>
                    <div className="psk-kegiatan-nama">{k.nama}</div>
                    <div className="psk-kegiatan-detail">{k.detail}</div>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* ══ Join ══ */}
          <section className="psk-join">
            <div className="psk-section-label" style={{ display: 'inline-block' }}>Gabung Yuk</div>
            <h2 className="psk-join-heading">
              SIAP <span>NGE-BAND</span> BARENG KAMI?
            </h2>
            <p className="psk-join-copy">
              Band bukan cuma soal panggung — ini soal proses berkarya bareng tim. Hubungi pembina ekstrakurikuler di sekolah untuk info pendaftaran.
            </p>
            <button
              type="button"
              className={`psk-join-motif${vinylHit ? ' hit' : ''}`}
              onClick={handleVinylTap}
              aria-label={isPlaying ? 'Matikan musik' : 'Ketuk untuk dengar musik'}
            >
              <span className="psk-join-ripple">
                <Vinyl size={76} />
              </span>
              <span className="psk-join-hint">{isPlaying ? 'lagi puter musik ~' : 'coba ketuk buat dengerin musik'}</span>
            </button>
          </section>
        </main>

        <EskulMusic src="/audio/musikband.mp3" />
        <Footer />

        <button
          type="button"
          className="psk-audio-fab"
          onClick={toggleAudio}
          aria-label={isPlaying ? 'Matikan musik' : 'Nyalakan musik'}
        >
          <span className="psk-audio-fab-icon" aria-hidden="true">{isPlaying ? '🔊' : '🔇'}</span>
          <span className="psk-audio-fab-label">{isPlaying ? 'Playing' : 'Tap play'}</span>
          <div className={`psk-audio-fab-eq ${isPlaying ? '' : 'paused'}`} aria-hidden="true">
            <span></span><span></span><span></span>
          </div>
        </button>
      </div>
    </>
  );
}