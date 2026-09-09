'use client';
import { useEffect, useRef, useState } from 'react';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import EskulMusic from '@/components/EskulMusic';
import Image from 'next/image';

const STATS = [
  { angka: '2025', label: 'Tahun Berdiri' },
  { angka: '30+',  label: 'Anggota Aktif' },
  { angka: '8',    label: 'Prestasi Diraih' },
  { angka: '100%', label: 'Semangat' },
];

const TUJUAN = [
  {
    icon: '🏀',
    judul: 'Kebugaran Fisik',
    deskripsi:
      'Melalui latihan dan pertandingan rutin, basket membantu meningkatkan kebugaran, kekuatan otot, dan ketahanan fisik siswa secara menyeluruh.',
  },
  {
    icon: '🤝',
    judul: 'Kerjasama Tim',
    deskripsi:
      'Basket adalah olahraga tim yang mengajarkan pentingnya komunikasi, koordinasi, dan strategi bersama untuk meraih kemenangan.',
  },
  {
    icon: '🏆',
    judul: 'Sportivitas',
    deskripsi:
      'Siswa belajar tentang fair play, cara menghadapi kemenangan maupun kekalahan dengan sikap positif dan mental yang tangguh.',
  },
];

const KEGIATAN = [
  { no: '01', nama: 'Latihan Teknik Dasar', detail: 'Dribbling, passing, shooting, dan lay-up.', kategori: 'fundamental' },
  { no: '02', nama: 'Latihan Fisik', detail: 'Lari, jumping, dan strength training.', kategori: 'fundamental' },
  { no: '03', nama: 'Simulasi Pertandingan', detail: 'Strategi dan taktik permainan tim.', kategori: 'strategi' },
  { no: '04', nama: 'Turnamen Internal', detail: 'Kompetisi antar kelas di dalam sekolah.', kategori: 'kompetisi' },
  { no: '05', nama: 'Turnamen Eksternal', detail: 'Mewakili sekolah di luar lingkungan sekolah.', kategori: 'kompetisi' },
  { no: '06', nama: 'Pengembangan Mentalitas', detail: 'Mental pemenang dan kerja keras tanpa henti.', kategori: 'strategi' },
  { no: '07', nama: 'Offensive & Defensive Plays', detail: 'Strategi menyerang dan bertahan terstruktur.', kategori: 'strategi' },
];

const FILTERS = [
  { key: 'semua', label: 'Semua' },
  { key: 'fundamental', label: 'Fundamental' },
  { key: 'strategi', label: 'Strategi' },
  { key: 'kompetisi', label: 'Kompetisi' },
];

/* ── reusable basketball glyph, used as the page's recurring motif ── */
function Basketball({ size = 56, className = '' }) {
  return (
    <svg viewBox="0 0 100 100" width={size} height={size} className={className} aria-hidden="true">
      <circle cx="50" cy="50" r="47" fill="#FF6A2B" stroke="#3A1602" strokeWidth="2.5" />
      <path d="M3,50 H97" stroke="#3A1602" strokeWidth="2.5" fill="none" />
      <path d="M50,3 V97" stroke="#3A1602" strokeWidth="2.5" fill="none" />
      <path d="M50,3 C21,26 21,74 50,97" stroke="#3A1602" strokeWidth="2.5" fill="none" />
      <path d="M50,3 C79,26 79,74 50,97" stroke="#3A1602" strokeWidth="2.5" fill="none" />
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

/* ── parses "30+" / "100%" / "2010" into an animatable number + suffix ── */
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
    <div className="psk-stat">
      <div className="psk-stat-num">
        {display}
        {suffix}
      </div>
      <div className="psk-stat-label">{label}</div>
    </div>
  );
}

export default function BasketPage() {
  const [filter, setFilter] = useState('semua');
  const [ballHit, setBallHit] = useState(false);
  const [statsRef, statsInView] = useInView(0.4);
  const [tujuanRef, tujuanInView] = useInView(0.15);
  const [kegiatanRef, kegiatanInView] = useInView(0.1);

  const filtered = filter === 'semua' ? KEGIATAN : KEGIATAN.filter((k) => k.kategori === filter);

  const handleBallClick = () => {
    setBallHit(true);
    setTimeout(() => setBallHit(false), 650);
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Anton&family=Chakra+Petch:wght@400;500;600;700&family=Inter:wght@400;500;600;700;800&display=swap');

        .psk-root {
          font-family: 'Inter', sans-serif;
          background: #F6FBEE;
          color: #12210F;
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
          background: #F6FBEE;
        }
        .psk-hero-img {
          position: relative;
          width: 100%;
          height: min(72vh, 600px);
        }
        .psk-hero-img img {
          object-fit: cover;
          object-position: center 20%;
          filter: saturate(1.1) contrast(1.05);
        }
        .psk-hero-overlay {
          position: absolute;
          inset: 0;
          background:
            radial-gradient(55% 45% at 78% 15%, rgba(126,217,87,0.22), transparent 60%),
            linear-gradient(to bottom, rgba(10,24,8,0.1) 0%, rgba(10,24,8,0.45) 70%, #F6FBEE 100%);
        }
        .psk-court-lines {
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
          font-family: 'Chakra Petch', sans-serif;
          font-size: 12px;
          font-weight: 600;
          letter-spacing: 4px;
          text-transform: uppercase;
          color: #fff;
          margin-bottom: 18px;
        }
        .psk-eyebrow::before {
          content: '';
          display: block;
          width: 28px; height: 2px;
          background: #7ED957;
        }
        .psk-title {
          font-family: 'Anton', sans-serif;
          font-weight: 400;
          font-size: clamp(76px, 13vw, 168px);
          line-height: 0.86;
          color: #fff;
          letter-spacing: 1px;
          margin: 0 0 18px;
          text-transform: uppercase;
        }
        .psk-title span {
          color: transparent;
          -webkit-text-stroke: 2.5px #B6FF6B;
        }
        .psk-subtitle {
          max-width: 480px;
          font-size: clamp(15px, 1.7vw, 17px);
          color: rgba(255,255,255,0.85);
          line-height: 1.7;
        }
        .psk-hero-text { max-width: 640px; }

        /* floating bouncing ball, the page's signature motif */
        .psk-hero-ball-zone {
          position: relative;
          width: 140px;
          height: 220px;
          flex-shrink: 0;
          display: none;
        }
        @media (min-width: 900px) { .psk-hero-ball-zone { display: block; } }
        .psk-ball-bounce {
          position: absolute;
          bottom: 46px;
          left: 30px;
          animation: ballBounce 1.7s cubic-bezier(.36,.02,.66,1) infinite;
        }
        .psk-ball-bounce svg { animation: ballSpin 1.7s linear infinite; display: block; }
        @keyframes ballBounce {
          0%   { transform: translateY(0); }
          45%  { transform: translateY(-150px); }
          55%  { transform: translateY(-150px); }
          100% { transform: translateY(0); }
        }
        @keyframes ballSpin {
          from { transform: rotate(0deg); }
          to   { transform: rotate(360deg); }
        }
        .psk-ball-shadow {
          position: absolute;
          bottom: 30px;
          left: 30px;
          width: 56px; height: 14px;
          border-radius: 50%;
          background: rgba(0,0,0,0.35);
          filter: blur(2px);
          animation: shadowPulse 1.7s cubic-bezier(.36,.02,.66,1) infinite;
        }
        @keyframes shadowPulse {
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
          font-family: 'Chakra Petch', sans-serif;
          font-size: 11px;
          letter-spacing: 3px;
          color: rgba(255,255,255,0.7);
        }
        .psk-scroll-line {
          width: 1px; height: 46px;
          background: linear-gradient(to bottom, rgba(182,255,107,0.9), transparent);
          position: relative;
          overflow: hidden;
        }
        .psk-scroll-line::after {
          content: '';
          position: absolute;
          top: -20px; left: -2px;
          width: 5px; height: 5px;
          border-radius: 50%;
          background: #B6FF6B;
          animation: scrollDot 1.8s ease-in-out infinite;
        }
        @keyframes scrollDot {
          0% { top: -6px; opacity: 0; }
          20% { opacity: 1; }
          80% { opacity: 1; }
          100% { top: 46px; opacity: 0; }
        }

        /* ══ marquee ticker ══ */
        .psk-ticker {
          border-top: 1px solid rgba(47,160,35,0.18);
          border-bottom: 1px solid rgba(47,160,35,0.18);
          background: #EAF7DD;
          overflow: hidden;
          white-space: nowrap;
          padding: 12px 0;
        }
        .psk-ticker-track {
          display: inline-flex;
          animation: tickerScroll 22s linear infinite;
        }
        .psk-ticker-track span {
          font-family: 'Chakra Petch', sans-serif;
          font-size: 13px;
          font-weight: 600;
          letter-spacing: 2px;
          text-transform: uppercase;
          color: rgba(18,33,15,0.55);
          padding: 0 28px;
          display: inline-flex;
          align-items: center;
          gap: 10px;
        }
        .psk-ticker-track span b { color: #2FA023; }
        @keyframes tickerScroll {
          from { transform: translateX(0); }
          to   { transform: translateX(-50%); }
        }

        /* ══ scoreboard stats (intentionally dark, like a real scoreboard) ══ */
        .psk-scoreboard {
          background: #0F3A0C;
        }
        .psk-stats {
          max-width: 1100px;
          margin: 0 auto;
          display: grid;
          grid-template-columns: repeat(4, 1fr);
        }
        @media (max-width: 640px) {
          .psk-stats { grid-template-columns: repeat(2, 1fr); }
        }
        .psk-stat {
          padding: clamp(28px, 4vw, 44px) 20px;
          text-align: center;
          border-right: 1px solid rgba(182,255,107,0.14);
        }
        .psk-stat:last-child { border-right: none; }
        .psk-stat-num {
          font-family: 'Chakra Petch', sans-serif;
          font-weight: 700;
          font-size: clamp(38px, 5vw, 54px);
          color: #B6FF6B;
          line-height: 1;
          margin-bottom: 8px;
          text-shadow: 0 0 18px rgba(182,255,107,0.35);
          font-variant-numeric: tabular-nums;
        }
        .psk-stat-label {
          font-size: 11px;
          font-weight: 600;
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
          font-family: 'Chakra Petch', sans-serif;
          font-size: 11px;
          font-weight: 600;
          letter-spacing: 3px;
          text-transform: uppercase;
          color: #2FA023;
          margin-bottom: 12px;
        }
        .psk-section-heading {
          font-family: 'Anton', sans-serif;
          font-weight: 400;
          font-size: clamp(40px, 5vw, 66px);
          color: #12210F;
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
        @media (max-width: 768px) {
          .psk-tujuan-grid { grid-template-columns: 1fr; }
        }
        .psk-tujuan-card {
          background: #fff;
          padding: 36px 28px;
          border: 1px solid rgba(47,160,35,0.14);
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
          background: linear-gradient(90deg, #2FA023, #FF6A2B);
          transform: scaleX(0);
          transform-origin: left;
          transition: transform 0.35s ease;
        }
        .psk-tujuan-card:hover {
          box-shadow: 0 16px 32px rgba(18,33,15,0.1);
          border-color: rgba(47,160,35,0.3);
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
          animation: iconBounce 0.6s cubic-bezier(.36,.02,.4,1.4);
        }
        @keyframes iconBounce {
          0%   { transform: translateY(0) scale(1); }
          35%  { transform: translateY(-10px) scale(1.08); }
          60%  { transform: translateY(0) scale(0.96); }
          100% { transform: translateY(0) scale(1); }
        }
        .psk-tujuan-title {
          font-family: 'Chakra Petch', sans-serif;
          font-size: 20px;
          font-weight: 700;
          color: #12210F;
          text-transform: uppercase;
          letter-spacing: 0.5px;
          margin-bottom: 12px;
        }
        .psk-tujuan-desc {
          font-size: 14px;
          color: rgba(18,33,15,0.62);
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
          font-family: 'Chakra Petch', sans-serif;
          font-size: 12px;
          font-weight: 600;
          letter-spacing: 1.5px;
          text-transform: uppercase;
          padding: 10px 18px;
          border-radius: 999px;
          border: 1px solid rgba(47,160,35,0.3);
          background: #fff;
          color: rgba(18,33,15,0.65);
          cursor: pointer;
          transition: all 0.2s ease;
        }
        .psk-chip:hover { border-color: #2FA023; color: #12210F; }
        .psk-chip.active {
          background: #2FA023;
          border-color: #2FA023;
          color: #fff;
        }

        .psk-kegiatan-list {
          position: relative;
          border-left: 1px solid rgba(47,160,35,0.25);
          padding-left: clamp(24px, 4vw, 40px);
        }
        .psk-kegiatan-item {
          position: relative;
          padding: 20px 0;
          display: flex;
          align-items: flex-start;
          gap: 20px;
          border-bottom: 1px solid rgba(47,160,35,0.12);
          opacity: 0;
          transform: translateX(-16px);
          animation: itemIn 0.5s ease forwards;
        }
        .psk-kegiatan-item:last-child { border-bottom: none; }
        @keyframes itemIn {
          to { opacity: 1; transform: translateX(0); }
        }
        .psk-kegiatan-item::before {
          content: '';
          position: absolute;
          left: calc(-1 * clamp(24px, 4vw, 40px) - 5px);
          top: 28px;
          width: 9px; height: 9px;
          border-radius: 50%;
          background: #F6FBEE;
          border: 2px solid #2FA023;
          transition: background 0.2s;
        }
        .psk-kegiatan-item:hover::before { background: #FF6A2B; border-color: #FF6A2B; }
        .psk-kegiatan-no {
          font-family: 'Chakra Petch', sans-serif;
          font-size: 28px;
          font-weight: 700;
          color: rgba(47,160,35,0.35);
          line-height: 1;
          flex-shrink: 0;
          width: 38px;
          transition: color 0.2s;
        }
        .psk-kegiatan-item:hover .psk-kegiatan-no { color: #FF6A2B; }
        .psk-kegiatan-nama {
          font-family: 'Chakra Petch', sans-serif;
          font-size: 17px;
          font-weight: 700;
          color: #12210F;
          text-transform: uppercase;
          letter-spacing: 0.5px;
          margin-bottom: 4px;
        }
        .psk-kegiatan-detail {
          font-size: 13px;
          color: rgba(18,33,15,0.55);
        }

        /* ══ join / cta ══ */
        .psk-join {
          text-align: center;
          padding: clamp(64px, 9vw, 110px) clamp(24px, 6vw, 80px);
          background: radial-gradient(60% 80% at 50% 0%, rgba(47,160,35,0.1), transparent 70%);
        }
        .psk-join-heading {
          font-family: 'Anton', sans-serif;
          font-weight: 400;
          font-size: clamp(36px, 6vw, 60px);
          color: #12210F;
          text-transform: uppercase;
          line-height: 1.05;
          margin-bottom: 18px;
        }
        .psk-join-heading span { color: #2FA023; }
        .psk-join-copy {
          max-width: 480px;
          margin: 0 auto 32px;
          font-size: 15px;
          color: rgba(18,33,15,0.62);
          line-height: 1.75;
        }
        .psk-join-ball {
          display: inline-flex;
          flex-direction: column;
          align-items: center;
          gap: 10px;
          cursor: pointer;
          background: none;
          border: none;
          padding: 0;
        }
        .psk-join-ball svg {
          transition: transform 0.15s ease;
        }
        .psk-join-ball:hover svg { transform: scale(1.06) rotate(-6deg); }
        .psk-join-ball.hit svg { animation: ballSwish 0.6s ease; }
        @keyframes ballSwish {
          0%   { transform: scale(1) rotate(0); }
          30%  { transform: scale(0.85) translateY(6px) rotate(20deg); }
          60%  { transform: scale(1.12) translateY(-10px) rotate(-15deg); }
          100% { transform: scale(1) rotate(0); }
        }
        .psk-join-hint {
          font-family: 'Chakra Petch', sans-serif;
          font-size: 11px;
          letter-spacing: 2px;
          text-transform: uppercase;
          color: rgba(18,33,15,0.45);
        }
        .psk-join-ripple {
          position: relative;
        }
        .psk-join-ripple::after {
          content: '';
          position: absolute;
          inset: -14px;
          border-radius: 50%;
          border: 2px solid #2FA023;
          opacity: 0;
        }
        .psk-join-ball.hit .psk-join-ripple::after {
          animation: ripple 0.65s ease-out;
        }
        @keyframes ripple {
          0%   { opacity: 0.8; transform: scale(0.6); }
          100% { opacity: 0; transform: scale(1.8); }
        }
      `}</style>

      <div className="psk-root">
        <Navbar />

        <main>
          {/* ══ Hero ══ */}
          <section className="psk-hero">
            <div className="psk-hero-img">
              <Image
                src="/images/eskul/eskulbasket.png"
                alt="Basket SMK Citra Negara"
                fill
                priority
              />
              <div className="psk-hero-overlay" />
              <svg className="psk-court-lines" viewBox="0 0 800 400" preserveAspectRatio="none">
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
                  BAS<span>KET</span>
                </h1>
                <p className="psk-subtitle">
                  Lebih dari sekadar olahraga — basket adalah ruang membangun karakter, melatih kerja sama, dan mencetak atlet berprestasi dari SMK Citra Negara.
                </p>
              </div>

              <div className="psk-hero-ball-zone" aria-hidden="true">
                <div className="psk-ball-shadow" />
                <div className="psk-ball-bounce">
                  <Basketball size={70} />
                </div>
              </div>
            </div>
          </section>

          {/* ══ Ticker ══ */}
          <div className="psk-ticker">
            <div className="psk-ticker-track">
              {[0, 1].map((rep) => (
                <span key={rep} style={{ display: 'inline-flex' }}>
                  {STATS.map((s) => (
                    <span key={s.label + rep}>
                      🏀 <b>{s.angka}</b> {s.label}
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
            <div className="psk-section-label">Mengapa Basket</div>
            <h2 className="psk-section-heading">TUJUAN KAMI</h2>
            <div className="psk-tujuan-grid" ref={tujuanRef}>
              {TUJUAN.map((t) => (
                <div key={t.judul} className={`psk-tujuan-card${tujuanInView ? ' in-view' : ''}`}>
                  <span className="psk-tujuan-icon">{t.icon}</span>
                  <div className="psk-tujuan-title">{t.judul}</div>
                  <p className="psk-tujuan-desc">{t.deskripsi}</p>
                </div>
              ))}
            </div>
          </section>

          <div className="psk-divider">
            <svg viewBox="0 0 1000 28" preserveAspectRatio="none">
              <path d="M0,14 C250,-10 350,38 500,14 C650,-10 750,38 1000,14" fill="none" stroke="#2FA023" strokeWidth="1.5" />
            </svg>
          </div>

          {/* ══ Kegiatan ══ */}
          <section className="psk-section" style={{ paddingTop: 'clamp(40px, 5vw, 64px)' }} ref={kegiatanRef}>
            <div className="psk-section-label">Program Latihan</div>
            <h2 className="psk-section-heading">KEGIATAN RUTIN</h2>

            <div className="psk-filters" role="group" aria-label="Filter kegiatan">
              {FILTERS.map((f) => (
                <button
                  key={f.key}
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
              SIAP <span>NGGABUNG</span> SKUAD?
            </h2>
            <p className="psk-join-copy">
              Basket bukan cuma soal skor akhir — ini soal proses jadi versi terbaik diri kamu bareng tim. Hubungi pembina ekstrakurikuler di sekolah untuk info pendaftaran.
            </p>
            <button className={`psk-join-ball${ballHit ? ' hit' : ''}`} onClick={handleBallClick} aria-label="Ketuk bola">
              <span className="psk-join-ripple">
                <Basketball size={76} />
              </span>
              <span className="psk-join-hint">coba ketuk bolanya</span>
            </button>
          </section>
        </main>

        <EskulMusic src="/audio/basket.mp3" />
        <Footer />
      </div>
    </>
  );
}