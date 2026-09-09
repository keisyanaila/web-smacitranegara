'use client';
import { useEffect, useRef, useState } from 'react';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import EskulMusic from '@/components/EskulMusic';
import Image from 'next/image';

const STATS = [
  { angka: '2012', label: 'Tahun Berdiri' },
  { angka: '30+',  label: 'Anggota Aktif' },
  { angka: '14',   label: 'Prestasi Diraih' },
  { angka: '100%', label: 'Dedikasi' },
];

const TUJUAN = [
  {
    icon: '🏐',
    judul: 'Kebugaran Fisik',
    deskripsi:
      'Latihan dan pertandingan voli membantu meningkatkan kekuatan, kelincahan, dan daya tahan tubuh secara menyeluruh.',
  },
  {
    icon: '🤝',
    judul: 'Kerjasama Tim',
    deskripsi:
      'Voli adalah olahraga tim yang mengajarkan pentingnya kerja sama, komunikasi efektif, dan strategi bersama di lapangan.',
  },
  {
    icon: '🏆',
    judul: 'Sportivitas',
    deskripsi:
      'Siswa belajar tentang sportivitas, fair play, dan cara menghadapi kemenangan maupun kekalahan dengan sikap positif.',
  },
];

const KEGIATAN = [
  { no: '01', nama: 'Latihan Teknik Dasar',          detail: 'Servis, passing, setting, dan smashing.' },
  { no: '02', nama: 'Latihan Fisik',                  detail: 'Lari, jumping, dan strength training.' },
  { no: '03', nama: 'Simulasi Pertandingan',          detail: 'Praktik strategi dan taktik tim di lapangan.' },
  { no: '04', nama: 'Turnamen Internal & Eksternal',  detail: 'Kompetisi di dalam dan luar sekolah.' },
  { no: '05', nama: 'Pengembangan Mentalitas',        detail: 'Mental pemenang, fokus di bawah tekanan.' },
  { no: '06', nama: 'Strategi & Taktik',              detail: 'Formasi serangan dan pertahanan tim.' },
];

/* ── glyph bola voli, motif berulang di halaman ini ── */
function VolleyBall({ size = 56, className = '' }: { size?: number; className?: string }) {
  return (
    <svg viewBox="0 0 100 100" width={size} height={size} className={className} aria-hidden="true">
      <circle cx="50" cy="50" r="47" fill="#FFF7EF" stroke="#241009" strokeWidth="2.5" />
      <path d="M50,3 C65,25 65,75 50,97" stroke="#E85A3A" strokeWidth="2.5" fill="none" />
      <path d="M50,3 C35,25 35,75 50,97" stroke="#E85A3A" strokeWidth="2.5" fill="none" />
      <path d="M6,35 C35,45 65,45 94,35" stroke="#E85A3A" strokeWidth="2.5" fill="none" />
      <path d="M6,65 C35,55 65,55 94,65" stroke="#E85A3A" strokeWidth="2.5" fill="none" />
    </svg>
  );
}

/* ── deteksi elemen masuk viewport, buat reveal & count-up ── */
function useInView<T extends HTMLElement>(threshold = 0.2) {
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
      if (elapsed < 0) { raf = requestAnimationFrame(tick); return; }
      const t = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - t, 3);
      setDisplay(Math.round(eased * num));
      if (t < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [inView, num, delay]);

  return (
    <div className="vli-stat">
      <div className="vli-stat-num">{display}{suffix}</div>
      <div className="vli-stat-label">{label}</div>
    </div>
  );
}

/* ── bungkus reveal-on-scroll generik dengan delay bertahap ── */
function Reveal({
  children, delay = 0, className = '',
}: { children: React.ReactNode; delay?: number; className?: string }) {
  const [ref, inView] = useInView<HTMLDivElement>();
  return (
    <div
      ref={ref}
      className={`vli-reveal ${inView ? 'vli-reveal-in' : ''} ${className}`}
      style={{ transitionDelay: `${delay}ms` }}
    >
      {children}
    </div>
  );
}

export default function VoliPage() {
  const [statsRef, statsInView] = useInView<HTMLDivElement>(0.4);
  const [smashHit, setSmashHit] = useState(false);

  const handleSmash = () => {
    setSmashHit(true);
    setTimeout(() => setSmashHit(false), 650);
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Barlow:wght@400;500;600;700&family=Barlow+Condensed:wght@600;700;800&family=Space+Mono:wght@400;700&display=swap');

        .vli-root {
          --vli-paper: #FFF7EF;
          --vli-paper-2: #FFFFFF;
          --vli-ink: #241009;
          --vli-accent: #E85A3A;
          --vli-accent-deep: #241009;
          --vli-gold: #FFC53D;
          --vli-muted: rgba(36,16,9,0.6);

          font-family: 'Barlow', sans-serif;
          background: var(--vli-paper);
          color: var(--vli-ink);
          min-height: 100vh;
          overflow-x: hidden;
        }
        .vli-root * { box-sizing: border-box; }

        @media (prefers-reduced-motion: reduce) {
          .vli-root *, .vli-root *::before, .vli-root *::after {
            animation-duration: 0.001ms !important;
            animation-iteration-count: 1 !important;
            transition-duration: 0.001ms !important;
          }
        }

        /* ══ hero ══ */
        .vli-hero { position: relative; overflow: hidden; background: var(--vli-paper); }
        .vli-hero-img { position: relative; width: 100%; height: min(70vh, 600px); }
        .vli-hero-img img {
          object-fit: cover;
          object-position: center top;
          filter: saturate(1.05) contrast(1.05);
        }
        .vli-hero-overlay {
          position: absolute; inset: 0;
          background:
            radial-gradient(55% 45% at 78% 15%, rgba(232,90,58,0.2), transparent 60%),
            linear-gradient(to bottom, rgba(36,16,9,0.15) 0%, rgba(36,16,9,0.5) 65%, var(--vli-paper) 100%);
        }
        .vli-hero-content {
          position: absolute; bottom: 0; left: 0; right: 0;
          padding: 0 clamp(24px, 6vw, 80px) clamp(40px, 6vw, 72px);
          display: flex; align-items: flex-end; justify-content: space-between; gap: 24px;
        }
        .vli-eyebrow {
          display: inline-flex; align-items: center; gap: 10px;
          font-family: 'Space Mono', monospace;
          font-size: 12px; font-weight: 700; letter-spacing: 4px;
          text-transform: uppercase; color: #fff; margin-bottom: 18px;
        }
        .vli-eyebrow::before { content: ''; display: block; width: 28px; height: 2px; background: var(--vli-gold); }

        .vli-title {
          font-family: 'Bebas Neue', sans-serif;
          font-size: clamp(72px, 12vw, 160px);
          line-height: 0.9; color: #fff; letter-spacing: 2px; margin: 0 0 20px;
          text-shadow: 0 4px 24px rgba(0,0,0,0.3);
        }
        /* huruf judul "dibumping" satu-satu, meniru gerak passing bola voli */
        .vli-letter {
          display: inline-block; opacity: 0;
          animation: vliBumpIn 0.6s cubic-bezier(.2,.8,.2,1) forwards;
        }
        .vli-letter-accent { color: var(--vli-accent); }
        @keyframes vliBumpIn {
          0%   { opacity: 0; transform: translateY(30px) scale(0.7); }
          55%  { opacity: 1; transform: translateY(-10px) scale(1.05); }
          100% { opacity: 1; transform: translateY(0) scale(1); }
        }
        .vli-subtitle {
          max-width: 560px; font-size: clamp(15px, 1.8vw, 18px);
          color: rgba(255,255,255,0.85); line-height: 1.7;
        }
        .vli-hero-text { max-width: 640px; }

        /* motif bola voli melayang, mantul seperti diumpan (bump) */
        .vli-hero-motif-zone { position: relative; width: 140px; height: 220px; flex-shrink: 0; display: none; }
        @media (min-width: 900px) { .vli-hero-motif-zone { display: block; } }
        .vli-motif-bounce {
          position: absolute; bottom: 46px; left: 30px;
          animation: vliBounce 1.6s cubic-bezier(.4,0,.2,1) infinite;
        }
        .vli-motif-bounce svg { animation: vliSpin 1.6s linear infinite; display: block; }
        @keyframes vliBounce {
          0%   { transform: translateY(0); }
          40%  { transform: translateY(-140px); }
          60%  { transform: translateY(-140px); }
          100% { transform: translateY(0); }
        }
        @keyframes vliSpin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        .vli-motif-shadow {
          position: absolute; bottom: 30px; left: 30px;
          width: 56px; height: 14px; border-radius: 50%;
          background: rgba(0,0,0,0.35); filter: blur(2px);
          animation: vliShadow 1.6s cubic-bezier(.4,0,.2,1) infinite;
        }
        @keyframes vliShadow {
          0%   { transform: scale(1); opacity: 0.4; }
          40%  { transform: scale(0.4); opacity: 0.1; }
          60%  { transform: scale(0.4); opacity: 0.1; }
          100% { transform: scale(1); opacity: 0.4; }
        }

        /* ══ reveal-on-scroll dasar ══ */
        .vli-reveal { opacity: 0; transform: translateY(26px); transition: opacity 0.6s ease, transform 0.6s ease; }
        .vli-reveal-in { opacity: 1; transform: translateY(0); }

        /* ══ stats (scoreboard gelap, kontras dengan halaman terang) ══ */
        .vli-scoreboard { background: var(--vli-accent-deep); }
        .vli-stats { max-width: 1100px; margin: 0 auto; display: grid; grid-template-columns: repeat(4, 1fr); }
        @media (max-width: 640px) { .vli-stats { grid-template-columns: repeat(2, 1fr); } }
        .vli-stat {
          padding: clamp(26px, 4vw, 40px) 20px; text-align: center;
          border-right: 1px solid rgba(232,90,58,0.25);
        }
        .vli-stat:last-child { border-right: none; }
        .vli-stat-num {
          font-family: 'Bebas Neue', sans-serif;
          font-size: clamp(36px, 5vw, 50px); color: var(--vli-accent);
          line-height: 1; margin-bottom: 6px;
          text-shadow: 0 0 18px rgba(232,90,58,0.4);
          font-variant-numeric: tabular-nums;
        }
        .vli-stat-label {
          font-size: 11px; font-weight: 600; letter-spacing: 2px;
          text-transform: uppercase; color: rgba(255,247,239,0.55);
        }

        /* ══ section base ══ */
        .vli-section { max-width: 1100px; margin: 0 auto; padding: clamp(56px, 8vw, 96px) clamp(24px, 6vw, 80px); }
        .vli-section-label {
          font-family: 'Space Mono', monospace;
          font-size: 11px; font-weight: 700; letter-spacing: 3px;
          text-transform: uppercase; color: var(--vli-accent); margin-bottom: 12px;
        }
        .vli-section-heading {
          font-family: 'Bebas Neue', sans-serif;
          font-size: clamp(40px, 5vw, 64px); color: var(--vli-ink); line-height: 1; margin-bottom: 48px;
        }

        /* ══ tujuan cards ══ */
        .vli-tujuan-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 18px; }
        @media (max-width: 768px) { .vli-tujuan-grid { grid-template-columns: 1fr; } }
        .vli-tujuan-card {
          background: var(--vli-paper-2); padding: 36px 28px;
          border: 1px solid rgba(232,90,58,0.14); border-radius: 16px;
          box-shadow: 0 4px 16px rgba(36,16,9,0.05);
          transition: transform 0.25s ease, box-shadow 0.25s ease, border-color 0.25s ease;
          position: relative; overflow: hidden;
        }
        .vli-tujuan-card::after {
          content: ''; position: absolute; bottom: 0; left: 0; right: 0; height: 3px;
          background: linear-gradient(90deg, var(--vli-accent), var(--vli-gold));
          transform: scaleX(0); transform-origin: left; transition: transform 0.35s ease;
        }
        .vli-tujuan-card:hover {
          transform: translateY(-6px);
          box-shadow: 0 16px 30px rgba(36,16,9,0.12);
          border-color: rgba(232,90,58,0.3);
        }
        .vli-tujuan-card:hover::after { transform: scaleX(1); }
        .vli-tujuan-icon { font-size: 34px; margin-bottom: 20px; display: inline-block; }
        .vli-tujuan-card:hover .vli-tujuan-icon { animation: vliIconBounce 0.6s cubic-bezier(.36,.02,.4,1.4); }
        @keyframes vliIconBounce {
          0%   { transform: translateY(0) scale(1); }
          35%  { transform: translateY(-10px) scale(1.1); }
          60%  { transform: translateY(0) scale(0.95); }
          100% { transform: translateY(0) scale(1); }
        }
        .vli-tujuan-title {
          font-family: 'Barlow Condensed', sans-serif;
          font-size: 22px; font-weight: 800; color: var(--vli-ink);
          text-transform: uppercase; letter-spacing: 1px; margin-bottom: 12px;
        }
        .vli-tujuan-desc { font-size: 14px; color: var(--vli-muted); line-height: 1.75; }

        /* ══ pembatas berbentuk jaring net — motif khas voli ══ */
        .vli-net-divider { max-width: 1100px; margin: 0 auto; padding: 0 clamp(24px, 6vw, 80px); opacity: 0.5; }
        .vli-net-divider svg { width: 100%; height: 30px; display: block; }

        /* ══ kegiatan list ══ */
        .vli-kegiatan-grid {
          display: grid; grid-template-columns: repeat(2, 1fr); gap: 1px;
          background: rgba(232,90,58,0.14); border: 1px solid rgba(232,90,58,0.14); border-radius: 16px; overflow: hidden;
        }
        @media (max-width: 640px) { .vli-kegiatan-grid { grid-template-columns: 1fr; } }
        .vli-kegiatan-item {
          background: var(--vli-paper-2); padding: 26px 28px;
          display: flex; align-items: flex-start; gap: 20px;
          transition: background 0.2s ease; position: relative;
        }
        .vli-kegiatan-item::before {
          content: ''; position: absolute; left: 0; top: 0; bottom: 0; width: 3px;
          background: var(--vli-accent); transform: scaleY(0); transform-origin: bottom; transition: transform 0.3s ease;
        }
        .vli-kegiatan-item:hover { background: var(--vli-paper); }
        .vli-kegiatan-item:hover::before { transform: scaleY(1); }
        .vli-kegiatan-no {
          font-family: 'Bebas Neue', sans-serif;
          font-size: 32px; color: rgba(232,90,58,0.35); line-height: 1; flex-shrink: 0; width: 40px;
          transition: color 0.2s ease;
        }
        /* efek "smash" — nomor mengecil-membesar cepat kayak pukulan spike saat di-hover */
        .vli-kegiatan-item:hover .vli-kegiatan-no { color: var(--vli-accent); animation: vliSmash 0.35s ease; }
        @keyframes vliSmash {
          0%   { transform: scale(1) rotate(0deg); }
          40%  { transform: scale(1.35) rotate(-8deg); }
          100% { transform: scale(1) rotate(0deg); }
        }
        .vli-kegiatan-nama {
          font-family: 'Barlow Condensed', sans-serif;
          font-size: 18px; font-weight: 700; color: var(--vli-ink);
          text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 4px;
        }
        .vli-kegiatan-detail { font-size: 13px; color: var(--vli-muted); }

        /* ══ join / cta — ketuk bola buat "smash" ══ */
        .vli-join {
          text-align: center; padding: clamp(64px, 9vw, 100px) clamp(24px, 6vw, 80px);
          background: radial-gradient(60% 80% at 50% 0%, rgba(232,90,58,0.1), transparent 70%);
        }
        .vli-join-heading {
          font-family: 'Bebas Neue', sans-serif;
          font-size: clamp(34px, 6vw, 56px); color: var(--vli-ink);
          text-transform: uppercase; line-height: 1.05; margin-bottom: 16px;
        }
        .vli-join-heading span { color: var(--vli-accent); }
        .vli-join-copy {
          max-width: 460px; margin: 0 auto 30px;
          font-size: 15px; color: var(--vli-muted); line-height: 1.75;
        }
        .vli-join-motif {
          display: inline-flex; flex-direction: column; align-items: center; gap: 10px;
          cursor: pointer; background: none; border: none; padding: 0;
        }
        .vli-join-motif svg { transition: transform 0.15s ease; }
        .vli-join-motif:hover svg { transform: scale(1.06) rotate(-6deg); }
        .vli-join-motif.hit svg { animation: vliSmashHit 0.55s ease; }
        @keyframes vliSmashHit {
          0%   { transform: scale(1) rotate(0); }
          25%  { transform: scale(0.85) translateY(10px) rotate(15deg); }
          55%  { transform: scale(1.15) translateY(-30px) rotate(-25deg); }
          100% { transform: scale(1) translateY(0) rotate(0); }
        }
        .vli-join-hint {
          font-family: 'Space Mono', monospace;
          font-size: 11px; letter-spacing: 2px; text-transform: uppercase; color: rgba(36,16,9,0.45);
        }
        .vli-join-ripple { position: relative; }
        .vli-join-ripple::after {
          content: ''; position: absolute; inset: -14px; border-radius: 50%;
          border: 2px solid var(--vli-accent); opacity: 0;
        }
        .vli-join-motif.hit .vli-join-ripple::after { animation: vliRipple 0.6s ease-out; }
        @keyframes vliRipple {
          0%   { opacity: 0.8; transform: scale(0.6); }
          100% { opacity: 0; transform: scale(1.9); }
        }
      `}</style>

      <div className="vli-root">
        <Navbar />

        <main>
          {/* ── Hero ── */}
          <section className="vli-hero">
            <div className="vli-hero-img">
              <Image src="/images/eskul/eskulvoli.png" alt="Voli SMK Citra Negara" fill priority sizes="100vw" />
              <div className="vli-hero-overlay" />
            </div>
            <div className="vli-hero-content">
              <div className="vli-hero-text">
                <div className="vli-eyebrow">Ekstrakurikuler SMK Citra Negara</div>
                <h1 className="vli-title">
                  {'VOLI'.split('').map((ch, i) => (
                    <span
                      key={i}
                      className={`vli-letter ${i >= 2 ? 'vli-letter-accent' : ''}`}
                      style={{ animationDelay: `${i * 90}ms` }}
                    >
                      {ch}
                    </span>
                  ))}
                </h1>
                <p className="vli-subtitle">
                  Voli adalah olahraga yang digemari banyak pelajar. Tidak hanya melatih fisik,
                  voli membangun kerjasama tim, kedisiplinan, dan mentalitas juara yang tangguh
                  di setiap sesi latihan.
                </p>
              </div>

              <div className="vli-hero-motif-zone" aria-hidden="true">
                <div className="vli-motif-shadow" />
                <div className="vli-motif-bounce">
                  <VolleyBall size={70} />
                </div>
              </div>
            </div>
          </section>

          {/* ── Stats ── */}
          <div className="vli-scoreboard">
            <div className="vli-stats" ref={statsRef}>
              {STATS.map((s, i) => (
                <StatCounter key={s.label} angka={s.angka} label={s.label} inView={statsInView} delay={i * 110} />
              ))}
            </div>
          </div>

          {/* ── Tujuan ── */}
          <section className="vli-section">
            <Reveal><div className="vli-section-label">Mengapa Voli</div></Reveal>
            <Reveal delay={60}><h2 className="vli-section-heading">TUJUAN KAMI</h2></Reveal>
            <div className="vli-tujuan-grid">
              {TUJUAN.map((t, i) => (
                <Reveal key={t.judul} delay={i * 120} className="vli-tujuan-card">
                  <span className="vli-tujuan-icon" aria-hidden="true">{t.icon}</span>
                  <div className="vli-tujuan-title">{t.judul}</div>
                  <p className="vli-tujuan-desc">{t.deskripsi}</p>
                </Reveal>
              ))}
            </div>
          </section>

          {/* pembatas jaring net */}
          <div className="vli-net-divider" aria-hidden="true">
            <svg viewBox="0 0 1000 30" preserveAspectRatio="none">
              {Array.from({ length: 25 }).map((_, i) => (
                <line key={`v${i}`} x1={i * 42} y1="0" x2={i * 42} y2="30" stroke="#241009" strokeWidth="1" />
              ))}
              <line x1="0" y1="0" x2="1000" y2="0" stroke="#241009" strokeWidth="1.5" />
              <line x1="0" y1="15" x2="1000" y2="15" stroke="#241009" strokeWidth="1" />
              <line x1="0" y1="30" x2="1000" y2="30" stroke="#241009" strokeWidth="1.5" />
            </svg>
          </div>

          {/* ── Kegiatan ── */}
          <section className="vli-section" style={{ paddingTop: 'clamp(40px, 5vw, 64px)' }}>
            <Reveal><div className="vli-section-label">Program Latihan</div></Reveal>
            <Reveal delay={60}><h2 className="vli-section-heading">KEGIATAN RUTIN</h2></Reveal>
            <div className="vli-kegiatan-grid">
              {KEGIATAN.map((k, i) => (
                <Reveal key={k.no} delay={i * 80} className="vli-kegiatan-item">
                  <div className="vli-kegiatan-no">{k.no}</div>
                  <div>
                    <div className="vli-kegiatan-nama">{k.nama}</div>
                    <div className="vli-kegiatan-detail">{k.detail}</div>
                  </div>
                </Reveal>
              ))}
            </div>
          </section>

          {/* ── Join / CTA interaktif ── */}
          <section className="vli-join">
            <div className="vli-section-label" style={{ display: 'inline-block' }}>Gabung Yuk</div>
            <h2 className="vli-join-heading">
              SIAP <span>SMASH</span> BARENG KAMI?
            </h2>
            <p className="vli-join-copy">
              Voli bukan cuma soal poin akhir — ini soal kekompakan tim dan kerja keras di setiap latihan. Hubungi pembina ekstrakurikuler di sekolah untuk info pendaftaran.
            </p>
            <button
              type="button"
              className={`vli-join-motif${smashHit ? ' hit' : ''}`}
              onClick={handleSmash}
              aria-label="Coba smash bolanya"
            >
              <span className="vli-join-ripple">
                <VolleyBall size={76} />
              </span>
              <span className="vli-join-hint">coba ketuk buat smash</span>
            </button>
          </section>
        </main>

        <EskulMusic src="/audio/voli.mp3" />
        <Footer />
      </div>
    </>
  );
}