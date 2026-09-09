'use client';
import { useEffect, useRef, useState } from 'react';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import Image from 'next/image';

const STATS = [
  { angka: '2024', label: 'Tahun Berdiri' },
  { angka: '30+',  label: 'Anggota Aktif' },
  { angka: '15',   label: 'Prestasi Diraih' },
  { angka: '100%', label: 'Dedikasi' },
];

const TUJUAN = [
  {
    icon: '🎮',
    judul: 'Strategi & Taktik',
    deskripsi:
      'Esports melatih kemampuan pengambilan keputusan yang cepat dan tepat di bawah tekanan, serta kemampuan memecahkan masalah secara kritis.',
  },
  {
    icon: '🤝',
    judul: 'Kerjasama Tim',
    deskripsi:
      'Seperti olahraga beregu lainnya, Esports mengajarkan pentingnya komunikasi efektif, pembagian peran, dan kepercayaan antar anggota tim.',
  },
  {
    icon: '🏆',
    judul: 'Sportivitas Digital',
    deskripsi:
      'Siswa belajar etika digital, fair play, menghormati lawan, dan bersikap bijak dalam menghadapi kemenangan maupun kekalahan.',
  },
];

const KEGIATAN = [
  { no: '01', nama: 'Latihan Mekanik Dasar', detail: 'Akurasi, pergerakan, dan penguasaan alat kontrol.', kategori: 'mekanik' },
  { no: '02', nama: 'Analisis Pertandingan', detail: 'Review rekaman untuk evaluasi dan perbaikan strategi.', kategori: 'analisis' },
  { no: '03', nama: 'Simulasi Pertandingan', detail: 'Scrimmage melawan tim internal maupun eksternal.', kategori: 'kompetisi' },
  { no: '04', nama: 'Partisipasi Turnamen', detail: 'Kompetisi Esports regional hingga nasional.', kategori: 'kompetisi' },
  { no: '05', nama: 'Pengembangan Mentalitas', detail: 'Mental tangguh, manajemen emosi, dan fokus kritis.', kategori: 'mental' },
  { no: '06', nama: 'Penyusunan Strategi', detail: 'Drafting, rotasi peta, dan manajemen sumber daya tim.', kategori: 'analisis' },
];

const FILTERS = [
  { key: 'semua', label: 'Semua' },
  { key: 'mekanik', label: 'Mekanik' },
  { key: 'analisis', label: 'Analisis' },
  { key: 'kompetisi', label: 'Kompetisi' },
  { key: 'mental', label: 'Mental' },
];

/* ── reusable crosshair glyph, the page's recurring motif ── */
function Crosshair({ size = 56, className = '' }) {
  return (
    <svg viewBox="0 0 100 100" width={size} height={size} className={className} aria-hidden="true">
      <circle cx="50" cy="50" r="30" fill="none" stroke="#7C6AFA" strokeWidth="3" />
      <circle cx="50" cy="50" r="6" fill="#14C8E0" />
      <line x1="50" y1="2" x2="50" y2="24" stroke="#7C6AFA" strokeWidth="3" />
      <line x1="50" y1="76" x2="50" y2="98" stroke="#7C6AFA" strokeWidth="3" />
      <line x1="2" y1="50" x2="24" y2="50" stroke="#7C6AFA" strokeWidth="3" />
      <line x1="76" y1="50" x2="98" y2="50" stroke="#7C6AFA" strokeWidth="3" />
    </svg>
  );
}

/* ── generic "reveal on scroll" hook ── */
function useInView(threshold = 0.25) {
  const ref = useRef(null);
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
  return [ref, inView];
}

/* ── parses "30+" / "100%" / "2022" into an animatable number + suffix ── */
function parseStat(value) {
  const match = value.match(/^(\d+)(.*)$/);
  if (!match) return { num: 0, suffix: value };
  return { num: parseInt(match[1], 10), suffix: match[2] };
}

function StatCounter({ angka, label, inView, delay }) {
  const { num, suffix } = parseStat(angka);
  const [display, setDisplay] = useState(0);

  useEffect(() => {
    if (!inView) return;
    let raf;
    const start = performance.now() + delay;
    const duration = 1100;
    const tick = (now) => {
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
    <div className="esp-stat">
      <div className="esp-stat-num">
        {display}
        {suffix}
      </div>
      <div className="esp-stat-label">{label}</div>
    </div>
  );
}

export default function EsportPage() {
  const [filter, setFilter] = useState('semua');
  const [locked, setLocked] = useState(false);
  const [statsRef, statsInView] = useInView(0.4);
  const [tujuanRef, tujuanInView] = useInView(0.15);
  const [kegiatanRef, kegiatanInView] = useInView(0.1);

  const filtered = filter === 'semua' ? KEGIATAN : KEGIATAN.filter((k) => k.kategori === filter);

  const handleLockOn = () => {
    setLocked(true);
    setTimeout(() => setLocked(false), 650);
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Orbitron:wght@500;700;900&family=Rajdhani:wght@500;600;700&family=Inter:wght@400;500;600;700;800&display=swap');

        .esp-root {
          font-family: 'Inter', sans-serif;
          background: #F7F6FE;
          color: #15112B;
          min-height: 100vh;
          overflow-x: hidden;
        }
        .esp-root * { box-sizing: border-box; }

        @media (prefers-reduced-motion: reduce) {
          .esp-root *, .esp-root *::before, .esp-root *::after {
            animation-duration: 0.001ms !important;
            animation-iteration-count: 1 !important;
            transition-duration: 0.001ms !important;
          }
        }

        /* ══ hero ══ */
        .esp-hero {
          position: relative;
          overflow: hidden;
          background: #F7F6FE;
        }
        .esp-hero-img {
          position: relative;
          width: 100%;
          height: min(72vh, 600px);
        }
        .esp-hero-img img {
          object-fit: cover;
          object-position: center 20%;
          filter: saturate(1.1) contrast(1.05);
        }
        .esp-hero-overlay {
          position: absolute;
          inset: 0;
          background:
            radial-gradient(55% 45% at 78% 15%, rgba(20,200,224,0.22), transparent 60%),
            linear-gradient(to bottom, rgba(10,8,25,0.12) 0%, rgba(10,8,25,0.5) 72%, #F7F6FE 100%);
        }
        .esp-scanline {
          position: absolute;
          left: 0; right: 0;
          height: 2px;
          background: linear-gradient(90deg, transparent, rgba(20,200,224,0.9), transparent);
          animation: scanMove 4.5s linear infinite;
          pointer-events: none;
        }
        @keyframes scanMove {
          0% { top: 0%; opacity: 0; }
          10% { opacity: 0.8; }
          90% { opacity: 0.8; }
          100% { top: 100%; opacity: 0; }
        }
        .esp-hud-grid {
          position: absolute;
          inset: 0;
          opacity: 0.14;
          pointer-events: none;
        }
        .esp-hero-content {
          position: absolute;
          bottom: 0; left: 0; right: 0;
          padding: 0 clamp(24px, 6vw, 80px) clamp(40px, 5vw, 64px);
          display: flex;
          align-items: flex-end;
          justify-content: space-between;
          gap: 24px;
        }
        .esp-eyebrow {
          display: inline-flex;
          align-items: center;
          gap: 10px;
          font-family: 'Rajdhani', sans-serif;
          font-size: 13px;
          font-weight: 700;
          letter-spacing: 4px;
          text-transform: uppercase;
          color: #fff;
          margin-bottom: 18px;
        }
        .esp-eyebrow::before {
          content: '';
          display: block;
          width: 28px; height: 2px;
          background: #14C8E0;
        }
        .esp-title {
          position: relative;
          font-family: 'Orbitron', sans-serif;
          font-weight: 900;
          font-size: clamp(60px, 10vw, 128px);
          line-height: 0.92;
          color: #fff;
          letter-spacing: 1px;
          margin: 0 0 18px;
          text-transform: uppercase;
        }
        .esp-title span { color: #14C8E0; }
        .esp-title:hover .esp-glitch-a,
        .esp-title:hover .esp-glitch-b { opacity: 1; }
        .esp-glitch-a, .esp-glitch-b {
          position: absolute; inset: 0;
          opacity: 0;
          pointer-events: none;
        }
        .esp-glitch-a { color: #FF4D9D; animation: glitchA 0.5s steps(2) infinite; }
        .esp-glitch-b { color: #14C8E0; animation: glitchB 0.5s steps(2) infinite; }
        @keyframes glitchA { 0% { transform: translate(2px,0); } 50% { transform: translate(-2px,1px); } 100% { transform: translate(2px,0); } }
        @keyframes glitchB { 0% { transform: translate(-2px,0); } 50% { transform: translate(2px,-1px); } 100% { transform: translate(-2px,0); } }
        .esp-subtitle {
          max-width: 500px;
          font-size: clamp(15px, 1.7vw, 17px);
          color: rgba(255,255,255,0.85);
          line-height: 1.7;
        }
        .esp-hero-text { max-width: 640px; }

        /* floating crosshair, the page's signature motif */
        .esp-hero-cross-zone {
          position: relative;
          width: 140px;
          height: 140px;
          flex-shrink: 0;
          display: none;
        }
        @media (min-width: 900px) { .esp-hero-cross-zone { display: block; } }
        .esp-cross-float {
          position: absolute;
          inset: 0;
          display: flex;
          align-items: center;
          justify-content: center;
          animation: crossPulse 2.4s ease-in-out infinite;
        }
        .esp-cross-float svg { animation: crossSpin 8s linear infinite; }
        @keyframes crossPulse {
          0%, 100% { transform: scale(1); filter: drop-shadow(0 0 6px rgba(124,106,250,0.5)); }
          50% { transform: scale(1.12); filter: drop-shadow(0 0 16px rgba(20,200,224,0.7)); }
        }
        @keyframes crossSpin {
          from { transform: rotate(0deg); }
          to   { transform: rotate(360deg); }
        }

        .esp-scroll-cue {
          position: absolute;
          right: clamp(20px, 5vw, 64px);
          top: 24px;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 8px;
          font-family: 'Rajdhani', sans-serif;
          font-size: 12px;
          font-weight: 600;
          letter-spacing: 3px;
          color: rgba(255,255,255,0.7);
        }
        .esp-scroll-line {
          width: 1px; height: 46px;
          background: linear-gradient(to bottom, rgba(20,200,224,0.9), transparent);
          position: relative;
          overflow: hidden;
        }
        .esp-scroll-line::after {
          content: '';
          position: absolute;
          top: -20px; left: -2px;
          width: 5px; height: 5px;
          border-radius: 50%;
          background: #14C8E0;
          animation: scrollDot 1.8s ease-in-out infinite;
        }
        @keyframes scrollDot {
          0% { top: -6px; opacity: 0; }
          20% { opacity: 1; }
          80% { opacity: 1; }
          100% { top: 46px; opacity: 0; }
        }

        /* ══ marquee ticker ══ */
        .esp-ticker {
          border-top: 1px solid rgba(124,106,250,0.2);
          border-bottom: 1px solid rgba(124,106,250,0.2);
          background: #EFEBFC;
          overflow: hidden;
          white-space: nowrap;
          padding: 12px 0;
        }
        .esp-ticker-track {
          display: inline-flex;
          animation: tickerScroll 22s linear infinite;
        }
        .esp-ticker-track span {
          font-family: 'Rajdhani', sans-serif;
          font-size: 14px;
          font-weight: 700;
          letter-spacing: 2px;
          text-transform: uppercase;
          color: rgba(21,17,43,0.55);
          padding: 0 28px;
          display: inline-flex;
          align-items: center;
          gap: 10px;
        }
        .esp-ticker-track span b { color: #7C6AFA; }
        @keyframes tickerScroll {
          from { transform: translateX(0); }
          to   { transform: translateX(-50%); }
        }

        /* ══ HUD stats panel (intentionally dark, like an in-game overlay) ══ */
        .esp-scoreboard {
          background: #120E2B;
          position: relative;
          overflow: hidden;
        }
        .esp-scoreboard::before {
          content: '';
          position: absolute;
          inset: 0;
          background: linear-gradient(90deg, rgba(124,106,250,0.08) 1px, transparent 1px) 0 0 / 40px 100%;
          pointer-events: none;
        }
        .esp-stats {
          max-width: 1100px;
          margin: 0 auto;
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          position: relative;
        }
        @media (max-width: 640px) {
          .esp-stats { grid-template-columns: repeat(2, 1fr); }
        }
        .esp-stat {
          padding: clamp(28px, 4vw, 44px) 20px;
          text-align: center;
          border-right: 1px solid rgba(124,106,250,0.18);
        }
        .esp-stat:last-child { border-right: none; }
        .esp-stat-num {
          font-family: 'Rajdhani', sans-serif;
          font-weight: 700;
          font-size: clamp(38px, 5vw, 54px);
          color: #14C8E0;
          line-height: 1;
          margin-bottom: 8px;
          text-shadow: 0 0 18px rgba(20,200,224,0.45);
          font-variant-numeric: tabular-nums;
        }
        .esp-stat-label {
          font-size: 11px;
          font-weight: 600;
          letter-spacing: 2px;
          text-transform: uppercase;
          color: rgba(255,255,255,0.55);
        }

        /* ══ section base ══ */
        .esp-section {
          max-width: 1100px;
          margin: 0 auto;
          padding: clamp(56px, 8vw, 100px) clamp(24px, 6vw, 80px);
        }
        .esp-section-label {
          font-family: 'Rajdhani', sans-serif;
          font-size: 12px;
          font-weight: 700;
          letter-spacing: 3px;
          text-transform: uppercase;
          color: #7C6AFA;
          margin-bottom: 12px;
        }
        .esp-section-heading {
          font-family: 'Orbitron', sans-serif;
          font-weight: 700;
          font-size: clamp(34px, 4.4vw, 54px);
          color: #15112B;
          line-height: 1.05;
          margin-bottom: 44px;
          text-transform: uppercase;
        }

        /* ══ tujuan cards ══ */
        .esp-tujuan-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 18px;
        }
        @media (max-width: 768px) {
          .esp-tujuan-grid { grid-template-columns: 1fr; }
        }
        .esp-tujuan-card {
          background: #fff;
          padding: 36px 28px;
          border: 1px solid rgba(124,106,250,0.16);
          border-radius: 16px;
          transition: box-shadow 0.25s, border-color 0.25s, transform 0.25s;
          position: relative;
          overflow: hidden;
          opacity: 0;
          transform: translateY(24px);
        }
        .esp-tujuan-card.in-view {
          opacity: 1;
          transform: translateY(0);
          transition: box-shadow 0.25s, border-color 0.25s, transform 0.6s cubic-bezier(.2,.7,.2,1), opacity 0.6s;
        }
        .esp-tujuan-card::after {
          content: '';
          position: absolute;
          bottom: 0; left: 0; right: 0;
          height: 3px;
          background: linear-gradient(90deg, #7C6AFA, #14C8E0);
          transform: scaleX(0);
          transform-origin: left;
          transition: transform 0.35s ease;
        }
        .esp-tujuan-card:hover {
          box-shadow: 0 16px 32px rgba(21,17,43,0.1), 0 0 0 1px rgba(124,106,250,0.15);
          border-color: rgba(124,106,250,0.35);
          transform: translateY(-4px);
        }
        .esp-tujuan-card:hover::after { transform: scaleX(1); }
        .esp-tujuan-icon {
          font-size: 34px;
          margin-bottom: 20px;
          display: inline-block;
          transition: transform 0.3s cubic-bezier(.36,.02,.66,1.4);
        }
        .esp-tujuan-card:hover .esp-tujuan-icon {
          animation: iconBounce 0.6s cubic-bezier(.36,.02,.4,1.4);
        }
        @keyframes iconBounce {
          0%   { transform: translateY(0) scale(1); }
          35%  { transform: translateY(-10px) scale(1.08); }
          60%  { transform: translateY(0) scale(0.96); }
          100% { transform: translateY(0) scale(1); }
        }
        .esp-tujuan-title {
          font-family: 'Rajdhani', sans-serif;
          font-size: 21px;
          font-weight: 700;
          color: #15112B;
          text-transform: uppercase;
          letter-spacing: 0.5px;
          margin-bottom: 12px;
        }
        .esp-tujuan-desc {
          font-size: 14px;
          color: rgba(21,17,43,0.62);
          line-height: 1.75;
        }

        /* ══ divider ══ */
        .esp-divider {
          max-width: 1100px;
          margin: 0 auto;
          padding: 0 clamp(24px, 6vw, 80px);
        }
        .esp-divider svg { width: 100%; height: 24px; opacity: 0.5; display: block; }

        /* ══ kegiatan ══ */
        .esp-filters {
          display: flex;
          flex-wrap: wrap;
          gap: 10px;
          margin-bottom: 36px;
        }
        .esp-chip {
          font-family: 'Rajdhani', sans-serif;
          font-size: 13px;
          font-weight: 700;
          letter-spacing: 1.5px;
          text-transform: uppercase;
          padding: 10px 18px;
          border-radius: 999px;
          border: 1px solid rgba(124,106,250,0.3);
          background: #fff;
          color: rgba(21,17,43,0.65);
          cursor: pointer;
          transition: all 0.2s ease;
        }
        .esp-chip:hover { border-color: #7C6AFA; color: #15112B; }
        .esp-chip.active {
          background: linear-gradient(90deg, #7C6AFA, #14C8E0);
          border-color: transparent;
          color: #fff;
        }

        .esp-kegiatan-list {
          position: relative;
          border-left: 1px solid rgba(124,106,250,0.3);
          padding-left: clamp(24px, 4vw, 40px);
        }
        .esp-kegiatan-item {
          position: relative;
          padding: 20px 0;
          display: flex;
          align-items: flex-start;
          gap: 20px;
          border-bottom: 1px solid rgba(124,106,250,0.14);
          opacity: 0;
          transform: translateX(-16px);
          animation: itemIn 0.5s ease forwards;
        }
        .esp-kegiatan-item:last-child { border-bottom: none; }
        @keyframes itemIn {
          to { opacity: 1; transform: translateX(0); }
        }
        .esp-kegiatan-item::before {
          content: '';
          position: absolute;
          left: calc(-1 * clamp(24px, 4vw, 40px) - 5px);
          top: 28px;
          width: 9px; height: 9px;
          border-radius: 50%;
          background: #F7F6FE;
          border: 2px solid #7C6AFA;
          transition: background 0.2s, border-color 0.2s;
        }
        .esp-kegiatan-item:hover::before { background: #14C8E0; border-color: #14C8E0; }
        .esp-kegiatan-no {
          font-family: 'Rajdhani', sans-serif;
          font-size: 28px;
          font-weight: 700;
          color: rgba(124,106,250,0.4);
          line-height: 1;
          flex-shrink: 0;
          width: 38px;
          transition: color 0.2s;
        }
        .esp-kegiatan-item:hover .esp-kegiatan-no { color: #14C8E0; }
        .esp-kegiatan-nama {
          font-family: 'Rajdhani', sans-serif;
          font-size: 17px;
          font-weight: 700;
          color: #15112B;
          text-transform: uppercase;
          letter-spacing: 0.5px;
          margin-bottom: 4px;
        }
        .esp-kegiatan-detail {
          font-size: 13px;
          color: rgba(21,17,43,0.55);
        }

        /* ══ join / cta ══ */
        .esp-join {
          text-align: center;
          padding: clamp(64px, 9vw, 110px) clamp(24px, 6vw, 80px);
          background: radial-gradient(60% 80% at 50% 0%, rgba(124,106,250,0.12), transparent 70%);
        }
        .esp-join-heading {
          font-family: 'Orbitron', sans-serif;
          font-weight: 700;
          font-size: clamp(30px, 5vw, 48px);
          color: #15112B;
          text-transform: uppercase;
          line-height: 1.15;
          margin-bottom: 18px;
        }
        .esp-join-heading span { color: #7C6AFA; }
        .esp-join-copy {
          max-width: 480px;
          margin: 0 auto 32px;
          font-size: 15px;
          color: rgba(21,17,43,0.62);
          line-height: 1.75;
        }
        .esp-join-btn {
          display: inline-flex;
          flex-direction: column;
          align-items: center;
          gap: 10px;
          cursor: pointer;
          background: none;
          border: none;
          padding: 0;
        }
        .esp-join-btn svg {
          transition: transform 0.15s ease, filter 0.15s ease;
        }
        .esp-join-btn:hover svg { transform: scale(1.08); filter: drop-shadow(0 0 12px rgba(20,200,224,0.6)); }
        .esp-join-btn.hit svg { animation: lockOn 0.6s ease; }
        @keyframes lockOn {
          0%   { transform: scale(1) rotate(0); }
          30%  { transform: scale(0.85) rotate(-25deg); }
          60%  { transform: scale(1.25) rotate(15deg); filter: drop-shadow(0 0 20px rgba(255,77,157,0.8)); }
          100% { transform: scale(1) rotate(0); }
        }
        .esp-join-hint {
          font-family: 'Rajdhani', sans-serif;
          font-size: 12px;
          font-weight: 600;
          letter-spacing: 2px;
          text-transform: uppercase;
          color: rgba(21,17,43,0.45);
        }
        .esp-join-ripple { position: relative; }
        .esp-join-ripple::after {
          content: '';
          position: absolute;
          inset: -14px;
          border-radius: 50%;
          border: 2px solid #FF4D9D;
          opacity: 0;
        }
        .esp-join-btn.hit .esp-join-ripple::after {
          animation: ripple 0.65s ease-out;
        }
        @keyframes ripple {
          0%   { opacity: 0.8; transform: scale(0.6); }
          100% { opacity: 0; transform: scale(1.9); }
        }
      `}</style>

      <div className="esp-root">
        <Navbar />

        <main>
          {/* ══ Hero ══ */}
          <section className="esp-hero">
            <div className="esp-hero-img">
              <Image src="/images/eskul/eskulesport.jpg" alt="Esport SMK Citra Negara" fill priority />
              <div className="esp-hero-overlay" />
              <div className="esp-scanline" />
              <svg className="esp-hud-grid" viewBox="0 0 800 400" preserveAspectRatio="none">
                <circle cx="700" cy="80" r="90" fill="none" stroke="#fff" strokeWidth="1.5" />
                <line x1="600" y1="0" x2="600" y2="400" stroke="#fff" strokeWidth="1.5" />
              </svg>
            </div>

            <div className="esp-scroll-cue">
              <span>SCROLL</span>
              <div className="esp-scroll-line" />
            </div>

            <div className="esp-hero-content">
              <div className="esp-hero-text">
                <div className="esp-eyebrow">Ekstrakurikuler SMK Citra Negara</div>
                <h1 className="esp-title">
                  E<span>SPORT</span>
                  <span className="esp-glitch-a" aria-hidden="true">E<span>SPORT</span></span>
                  <span className="esp-glitch-b" aria-hidden="true">E<span>SPORT</span></span>
                </h1>
                <p className="esp-subtitle">
                  Esports (Electronic Sports) adalah salah satu cabang aktivitas yang sangat berkembang di era digital. Ekstrakurikuler Esports tidak hanya menawarkan sarana penyaluran hobi, tetapi juga mengajarkan manajemen strategi, kerjasama tim, dan pengendalian diri.
                </p>
              </div>

              <div className="esp-hero-cross-zone" aria-hidden="true">
                <div className="esp-cross-float">
                  <Crosshair size={90} />
                </div>
              </div>
            </div>
          </section>

          {/* ══ Ticker ══ */}
          <div className="esp-ticker">
            <div className="esp-ticker-track">
              {[0, 1].map((rep) => (
                <span key={rep} style={{ display: 'inline-flex' }}>
                  {STATS.map((s) => (
                    <span key={s.label + rep}>
                      🎮 <b>{s.angka}</b> {s.label}
                    </span>
                  ))}
                </span>
              ))}
            </div>
          </div>

          {/* ══ HUD stats ══ */}
          <div className="esp-scoreboard">
            <div className="esp-stats" ref={statsRef}>
              {STATS.map((s, i) => (
                <StatCounter key={s.label} angka={s.angka} label={s.label} inView={statsInView} delay={i * 120} />
              ))}
            </div>
          </div>

          {/* ══ Tujuan ══ */}
          <section className="esp-section">
            <div className="esp-section-label">Mengapa Esport</div>
            <h2 className="esp-section-heading">TUJUAN KAMI</h2>
            <div className="esp-tujuan-grid" ref={tujuanRef}>
              {TUJUAN.map((t) => (
                <div key={t.judul} className={`esp-tujuan-card${tujuanInView ? ' in-view' : ''}`}>
                  <span className="esp-tujuan-icon">{t.icon}</span>
                  <div className="esp-tujuan-title">{t.judul}</div>
                  <p className="esp-tujuan-desc">{t.deskripsi}</p>
                </div>
              ))}
            </div>
          </section>

          <div className="esp-divider">
            <svg viewBox="0 0 1000 24" preserveAspectRatio="none">
              <path d="M0,12 L100,12 L112,2 L124,22 L136,12 L1000,12" fill="none" stroke="#7C6AFA" strokeWidth="1.5" />
            </svg>
          </div>

          {/* ══ Kegiatan ══ */}
          <section className="esp-section" style={{ paddingTop: 'clamp(40px, 5vw, 64px)' }} ref={kegiatanRef}>
            <div className="esp-section-label">Program Latihan</div>
            <h2 className="esp-section-heading">KEGIATAN RUTIN</h2>

            <div className="esp-filters" role="group" aria-label="Filter kegiatan">
              {FILTERS.map((f) => (
                <button
                  key={f.key}
                  className={`esp-chip${filter === f.key ? ' active' : ''}`}
                  onClick={() => setFilter(f.key)}
                >
                  {f.label}
                </button>
              ))}
            </div>

            <div className="esp-kegiatan-list">
              {filtered.map((k, i) => (
                <div key={k.no} className="esp-kegiatan-item" style={{ animationDelay: `${i * 0.06}s` }}>
                  <div className="esp-kegiatan-no">{k.no}</div>
                  <div>
                    <div className="esp-kegiatan-nama">{k.nama}</div>
                    <div className="esp-kegiatan-detail">{k.detail}</div>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* ══ Join ══ */}
          <section className="esp-join">
            <div className="esp-section-label" style={{ display: 'inline-block' }}>Gabung Yuk</div>
            <h2 className="esp-join-heading">
              SIAP <span>LOCK IN</span> SKUAD?
            </h2>
            <p className="esp-join-copy">
              Esports bukan cuma soal jam terbang — ini soal proses jadi versi terbaik diri kamu bareng tim. Hubungi pembina ekstrakurikuler di sekolah untuk info pendaftaran.
            </p>
            <button className={`esp-join-btn${locked ? ' hit' : ''}`} onClick={handleLockOn} aria-label="Lock on">
              <span className="esp-join-ripple">
                <Crosshair size={76} />
              </span>
              <span className="esp-join-hint">coba klik target-nya</span>
            </button>
          </section>
        </main>

        <Footer />
      </div>
    </>
  );
}