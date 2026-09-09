'use client';
import { useEffect, useRef, useState } from 'react';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import EskulMusic from '@/components/EskulMusic';
import Image from 'next/image';

const STATS = [
  { angka: '2025', label: 'Tahun Berdiri' },
  { angka: '40+',  label: 'Anggota Aktif' },
  { angka: '10',   label: 'Prestasi Diraih' },
  { angka: '100%', label: 'Dedikasi' },
];

const TUJUAN = [
  {
    icon: '⛺',
    judul: 'Kedisiplinan',
    deskripsi:
      'Pramuka mengajarkan pentingnya kedisiplinan melalui berbagai kegiatan terstruktur dan aturan yang membentuk karakter kuat.',
  },
  {
    icon: '🌿',
    judul: 'Cinta Alam',
    deskripsi:
      'Melalui kegiatan di alam terbuka, Pramuka menumbuhkan kesadaran untuk menjaga dan menghargai lingkungan sekitar.',
  },
  {
    icon: '👑',
    judul: 'Karakter & Kepemimpinan',
    deskripsi:
      'Menanamkan nilai kepemimpinan, tanggung jawab, kerjasama, dan kepedulian terhadap sesama dalam setiap kegiatan.',
  },
];

const KEGIATAN = [
  { no: '01', nama: 'Latihan Rutin',              detail: 'Tali-temali, mendirikan tenda, dan api unggun.' },
  { no: '02', nama: 'Kegiatan Kemah',             detail: 'Hiking, penjelajahan, dan permainan menantang.' },
  { no: '03', nama: 'Lomba & Kompetisi',          detail: 'Tingkat sekolah, daerah, hingga nasional.' },
  { no: '04', nama: 'Pengabdian Masyarakat',      detail: 'Bakti sosial, penanaman pohon, dan lingkungan.' },
  { no: '05', nama: 'Kegiatan Kepemimpinan',      detail: 'Ketua regu, pemimpin upacara, dan peran aktif.' },
  { no: '06', nama: 'Pelatihan & Kursus',         detail: 'Pertolongan pertama, navigasi, dan survival.' },
];

/* ── glyph kompas, motif berulang di halaman ini ── */
function Compass({ size = 56, className = '' }: { size?: number; className?: string }) {
  return (
    <svg viewBox="0 0 100 100" width={size} height={size} className={className} aria-hidden="true">
      <circle cx="50" cy="50" r="47" fill="#FAF3E3" stroke="#3D2B12" strokeWidth="2.5" />
      <circle cx="50" cy="50" r="37" fill="none" stroke="#C8973A" strokeWidth="1.5" />
      {Array.from({ length: 12 }).map((_, i) => {
        const angle = (i * 30 * Math.PI) / 180;
        const x1 = 50 + Math.sin(angle) * 37;
        const y1 = 50 - Math.cos(angle) * 37;
        const x2 = 50 + Math.sin(angle) * 31;
        const y2 = 50 - Math.cos(angle) * 31;
        return <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} stroke="#C8973A" strokeWidth="1.5" />;
      })}
      <polygon points="50,16 57,50 50,45" fill="#C0392B" />
      <polygon points="50,84 43,50 50,55" fill="#3D2B12" />
      <circle cx="50" cy="50" r="4" fill="#3D2B12" />
    </svg>
  );
}

/* ── deteksi elemen masuk viewport ── */
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
    <div className="psk-stat">
      <div className="psk-stat-num">{display}{suffix}</div>
      <div className="psk-stat-label">{label}</div>
    </div>
  );
}

function Reveal({
  children, delay = 0, className = '',
}: { children: React.ReactNode; delay?: number; className?: string }) {
  const [ref, inView] = useInView<HTMLDivElement>();
  return (
    <div
      ref={ref}
      className={`psk-reveal ${inView ? 'psk-reveal-in' : ''} ${className}`}
      style={{ transitionDelay: `${delay}ms` }}
    >
      {children}
    </div>
  );
}

export default function PramukaPage() {
  const [statsRef, statsInView] = useInView<HTMLDivElement>(0.4);
  const [compassSpun, setCompassSpun] = useState(false);

  const handleCompassTap = () => {
    setCompassSpun(true);
    setTimeout(() => setCompassSpun(false), 900);
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Barlow:wght@400;500;600;700&family=Barlow+Condensed:wght@600;700;800&family=Space+Mono:wght@400;700&display=swap');

        .psk-root {
          --psk-paper: #FAF3E3;
          --psk-paper-2: #FFFFFF;
          --psk-ink: #2B2013;
          --psk-forest: #33562F;
          --psk-forest-deep: #1E3A1B;
          --psk-gold: #C8973A;
          --psk-ember: #E0672D;
          --psk-muted: rgba(43,32,19,0.62);

          font-family: 'Barlow', sans-serif;
          background: var(--psk-paper);
          color: var(--psk-ink);
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
        .psk-hero { position: relative; overflow: hidden; background: var(--psk-paper); }
        .psk-hero-img { position: relative; width: 100%; height: min(70vh, 600px); }
        .psk-hero-img img {
          object-fit: cover;
          object-position: center top;
          filter: saturate(1.05) contrast(1.05);
        }
        .psk-hero-overlay {
          position: absolute; inset: 0;
          background:
            radial-gradient(55% 45% at 78% 15%, rgba(200,151,58,0.2), transparent 60%),
            linear-gradient(to bottom, rgba(30,58,27,0.2) 0%, rgba(30,58,27,0.55) 65%, var(--psk-paper) 100%);
        }
        .psk-hero-content {
          position: absolute; bottom: 0; left: 0; right: 0;
          padding: 0 clamp(24px, 6vw, 80px) clamp(40px, 6vw, 72px);
          display: flex; align-items: flex-end; justify-content: space-between; gap: 24px;
        }
        .psk-eyebrow {
          display: inline-flex; align-items: center; gap: 10px;
          font-family: 'Space Mono', monospace;
          font-size: 12px; font-weight: 700; letter-spacing: 4px;
          text-transform: uppercase; color: #fff; margin-bottom: 18px;
        }
        .psk-eyebrow::before { content: ''; display: block; width: 28px; height: 2px; background: var(--psk-gold); }

        .psk-title {
          font-family: 'Bebas Neue', sans-serif;
          font-size: clamp(64px, 11vw, 150px);
          line-height: 0.9; color: #fff; letter-spacing: 2px; margin: 0 0 20px;
          text-shadow: 0 4px 24px rgba(0,0,0,0.35);
        }
        /* huruf judul muncul kayak dicap stempel lencana, satu-satu */
        .psk-letter { display: inline-block; opacity: 0; animation: pskStamp 0.5s ease-out forwards; }
        .psk-letter-accent { color: var(--psk-gold); }
        @keyframes pskStamp {
          0%   { opacity: 0; transform: scale(2.2) rotate(-8deg); }
          60%  { opacity: 1; transform: scale(0.92) rotate(2deg); }
          100% { opacity: 1; transform: scale(1) rotate(0deg); }
        }
        .psk-subtitle {
          max-width: 560px; font-size: clamp(15px, 1.8vw, 18px);
          color: rgba(255,255,255,0.85); line-height: 1.7;
        }
        .psk-hero-text { max-width: 640px; }

        /* kompas melayang, jarum berputar mencari utara — motif khas halaman ini */
        .psk-hero-motif-zone { position: relative; width: 140px; height: 160px; flex-shrink: 0; display: none; }
        @media (min-width: 900px) { .psk-hero-motif-zone { display: flex; align-items: center; justify-content: center; } }
        .psk-motif-float { animation: pskFloat 3.2s ease-in-out infinite; }
        .psk-motif-float svg { animation: pskNeedle 5s ease-in-out infinite; display: block; transform-origin: 50% 50%; }
        @keyframes pskFloat {
          0%, 100% { transform: translateY(0); }
          50%      { transform: translateY(-14px); }
        }
        @keyframes pskNeedle {
          0%, 100% { transform: rotate(-8deg); }
          50%      { transform: rotate(10deg); }
        }

        /* ══ reveal-on-scroll dasar ══ */
        .psk-reveal { opacity: 0; transform: translateY(26px); transition: opacity 0.6s ease, transform 0.6s ease; }
        .psk-reveal-in { opacity: 1; transform: translateY(0); }

        /* ══ stats — nuansa api unggun, kedip halus ══ */
        .psk-scoreboard {
          background: var(--psk-forest-deep);
          position: relative;
        }
        .psk-scoreboard::before {
          content: '';
          position: absolute; inset: 0;
          background: radial-gradient(40% 120% at 50% 100%, rgba(224,103,45,0.25), transparent 70%);
          animation: pskEmber 3s ease-in-out infinite;
          pointer-events: none;
        }
        @keyframes pskEmber {
          0%, 100% { opacity: 0.6; }
          50%      { opacity: 1; }
        }
        .psk-stats { max-width: 1100px; margin: 0 auto; display: grid; grid-template-columns: repeat(4, 1fr); position: relative; }
        @media (max-width: 640px) { .psk-stats { grid-template-columns: repeat(2, 1fr); } }
        .psk-stat {
          padding: clamp(26px, 4vw, 40px) 20px; text-align: center;
          border-right: 1px solid rgba(200,151,58,0.2);
        }
        .psk-stat:last-child { border-right: none; }
        .psk-stat-num {
          font-family: 'Bebas Neue', sans-serif;
          font-size: clamp(36px, 5vw, 50px); color: var(--psk-gold);
          line-height: 1; margin-bottom: 6px;
          text-shadow: 0 0 18px rgba(200,151,58,0.4);
          font-variant-numeric: tabular-nums;
        }
        .psk-stat-label {
          font-size: 11px; font-weight: 600; letter-spacing: 2px;
          text-transform: uppercase; color: rgba(250,243,227,0.55);
        }

        /* ══ section base ══ */
        .psk-section { max-width: 1100px; margin: 0 auto; padding: clamp(56px, 8vw, 96px) clamp(24px, 6vw, 80px); }
        .psk-section-label {
          font-family: 'Space Mono', monospace;
          font-size: 11px; font-weight: 700; letter-spacing: 3px;
          text-transform: uppercase; color: var(--psk-forest); margin-bottom: 12px;
        }
        .psk-section-heading {
          font-family: 'Bebas Neue', sans-serif;
          font-size: clamp(40px, 5vw, 64px); color: var(--psk-ink); line-height: 1; margin-bottom: 48px;
        }

        /* ══ tujuan cards ══ */
        .psk-tujuan-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 18px; }
        @media (max-width: 768px) { .psk-tujuan-grid { grid-template-columns: 1fr; } }
        .psk-tujuan-card {
          background: var(--psk-paper-2); padding: 36px 28px;
          border: 1px solid rgba(51,86,47,0.14); border-radius: 16px;
          box-shadow: 0 4px 16px rgba(43,32,19,0.05);
          transition: transform 0.25s ease, box-shadow 0.25s ease, border-color 0.25s ease;
          position: relative; overflow: hidden;
        }
        .psk-tujuan-card::after {
          content: ''; position: absolute; bottom: 0; left: 0; right: 0; height: 3px;
          background: linear-gradient(90deg, var(--psk-forest), var(--psk-gold));
          transform: scaleX(0); transform-origin: left; transition: transform 0.35s ease;
        }
        .psk-tujuan-card:hover {
          transform: translateY(-6px);
          box-shadow: 0 16px 30px rgba(43,32,19,0.12);
          border-color: rgba(51,86,47,0.3);
        }
        .psk-tujuan-card:hover::after { transform: scaleX(1); }
        .psk-tujuan-icon { font-size: 34px; margin-bottom: 20px; display: inline-block; }
        .psk-tujuan-card:hover .psk-tujuan-icon { animation: pskLeafSway 0.7s ease; }
        @keyframes pskLeafSway {
          0%   { transform: rotate(0deg) scale(1); }
          25%  { transform: rotate(-12deg) scale(1.08); }
          55%  { transform: rotate(10deg) scale(1.08); }
          80%  { transform: rotate(-4deg) scale(1.02); }
          100% { transform: rotate(0deg) scale(1); }
        }
        .psk-tujuan-title {
          font-family: 'Barlow Condensed', sans-serif;
          font-size: 22px; font-weight: 800; color: var(--psk-ink);
          text-transform: uppercase; letter-spacing: 1px; margin-bottom: 12px;
        }
        .psk-tujuan-desc { font-size: 14px; color: var(--psk-muted); line-height: 1.75; }

        /* ══ pembatas tali simpul — motif khas tali-temali ══ */
        .psk-rope-divider { max-width: 1100px; margin: 0 auto; padding: 0 clamp(24px, 6vw, 80px); opacity: 0.7; }
        .psk-rope-divider svg { width: 100%; height: 30px; display: block; }

        /* ══ kegiatan list ══ */
        .psk-kegiatan-grid {
          display: grid; grid-template-columns: repeat(2, 1fr); gap: 1px;
          background: rgba(51,86,47,0.14); border: 1px solid rgba(51,86,47,0.14); border-radius: 16px; overflow: hidden;
        }
        @media (max-width: 640px) { .psk-kegiatan-grid { grid-template-columns: 1fr; } }
        .psk-kegiatan-item {
          background: var(--psk-paper-2); padding: 26px 28px;
          display: flex; align-items: flex-start; gap: 20px;
          transition: background 0.2s ease; position: relative;
        }
        .psk-kegiatan-item::before {
          content: ''; position: absolute; left: 0; top: 0; bottom: 0; width: 3px;
          background: var(--psk-ember); transform: scaleY(0); transform-origin: bottom; transition: transform 0.3s ease;
        }
        .psk-kegiatan-item:hover { background: var(--psk-paper); }
        .psk-kegiatan-item:hover::before { transform: scaleY(1); }
        .psk-kegiatan-no {
          font-family: 'Bebas Neue', sans-serif;
          font-size: 32px; color: rgba(51,86,47,0.35); line-height: 1; flex-shrink: 0; width: 40px;
          transition: color 0.2s ease, transform 0.2s ease;
        }
        /* efek "api berkobar" — nomor sedikit naik & memendar saat hover */
        .psk-kegiatan-item:hover .psk-kegiatan-no { color: var(--psk-ember); animation: pskFlame 0.5s ease; }
        @keyframes pskFlame {
          0%   { transform: translateY(0) scale(1); }
          40%  { transform: translateY(-5px) scale(1.12) skewX(-3deg); }
          100% { transform: translateY(0) scale(1) skewX(0); }
        }
        .psk-kegiatan-nama {
          font-family: 'Barlow Condensed', sans-serif;
          font-size: 18px; font-weight: 700; color: var(--psk-ink);
          text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 4px;
        }
        .psk-kegiatan-detail { font-size: 13px; color: var(--psk-muted); }

        /* ══ join / cta — ketuk kompas ══ */
        .psk-join {
          text-align: center; padding: clamp(64px, 9vw, 100px) clamp(24px, 6vw, 80px);
          background: radial-gradient(60% 80% at 50% 0%, rgba(51,86,47,0.12), transparent 70%);
        }
        .psk-join-heading {
          font-family: 'Bebas Neue', sans-serif;
          font-size: clamp(32px, 6vw, 54px); color: var(--psk-ink);
          text-transform: uppercase; line-height: 1.08; margin-bottom: 16px;
        }
        .psk-join-heading span { color: var(--psk-forest); }
        .psk-join-copy {
          max-width: 460px; margin: 0 auto 30px;
          font-size: 15px; color: var(--psk-muted); line-height: 1.75;
        }
        .psk-join-motif {
          display: inline-flex; flex-direction: column; align-items: center; gap: 10px;
          cursor: pointer; background: none; border: none; padding: 0;
        }
        .psk-join-motif svg { transition: transform 0.15s ease; transform-origin: 50% 50%; }
        .psk-join-motif:hover svg { transform: scale(1.06); }
        .psk-join-motif.spun svg { animation: pskCompassSpin 0.9s cubic-bezier(.2,.7,.2,1); }
        @keyframes pskCompassSpin {
          0%   { transform: rotate(0deg) scale(1); }
          70%  { transform: rotate(380deg) scale(1.05); }
          100% { transform: rotate(360deg) scale(1); }
        }
        .psk-join-hint {
          font-family: 'Space Mono', monospace;
          font-size: 11px; letter-spacing: 2px; text-transform: uppercase; color: rgba(43,32,19,0.45);
        }
      `}</style>

      <div className="psk-root">
        <Navbar />

        <main>
          {/* ── Hero ── */}
          <section className="psk-hero">
            <div className="psk-hero-img">
              <Image src="/images/eskul/eskulpramuka.jpg" alt="Pramuka SMK Citra Negara" fill priority sizes="100vw" />
              <div className="psk-hero-overlay" />
            </div>
            <div className="psk-hero-content">
              <div className="psk-hero-text">
                <div className="psk-eyebrow">Ekstrakurikuler SMK Citra Negara</div>
                <h1 className="psk-title">
                  {'PRAMUKA'.split('').map((ch, i) => (
                    <span
                      key={i}
                      className={`psk-letter ${i >= 3 ? 'psk-letter-accent' : ''}`}
                      style={{ animationDelay: `${i * 70}ms` }}
                    >
                      {ch}
                    </span>
                  ))}
                </h1>
                <p className="psk-subtitle">
                  Lebih dari sekadar kegiatan alam — Pramuka adalah tempat menempa karakter, kedisiplinan, dan jiwa pengabdian sejati untuk bangsa dan lingkungan.
                </p>
              </div>

              <div className="psk-hero-motif-zone" aria-hidden="true">
                <div className="psk-motif-float">
                  <Compass size={92} />
                </div>
              </div>
            </div>
          </section>

          {/* ── Stats ── */}
          <div className="psk-scoreboard">
            <div className="psk-stats" ref={statsRef}>
              {STATS.map((s, i) => (
                <StatCounter key={s.label} angka={s.angka} label={s.label} inView={statsInView} delay={i * 110} />
              ))}
            </div>
          </div>

          {/* ── Tujuan ── */}
          <section className="psk-section">
            <Reveal><div className="psk-section-label">Mengapa Pramuka</div></Reveal>
            <Reveal delay={60}><h2 className="psk-section-heading">TUJUAN KAMI</h2></Reveal>
            <div className="psk-tujuan-grid">
              {TUJUAN.map((t, i) => (
                <Reveal key={t.judul} delay={i * 120} className="psk-tujuan-card">
                  <span className="psk-tujuan-icon" aria-hidden="true">{t.icon}</span>
                  <div className="psk-tujuan-title">{t.judul}</div>
                  <p className="psk-tujuan-desc">{t.deskripsi}</p>
                </Reveal>
              ))}
            </div>
          </section>

          {/* pembatas tali simpul */}
          <div className="psk-rope-divider" aria-hidden="true">
            <svg viewBox="0 0 1000 30" preserveAspectRatio="none">
              <path
                d="M0,15 Q25,0 50,15 T100,15 T150,15 T200,15 T250,15 T300,15 T350,15 T400,15 T450,15 T500,15 T550,15 T600,15 T650,15 T700,15 T750,15 T800,15 T850,15 T900,15 T950,15 T1000,15"
                fill="none" stroke="#33562F" strokeWidth="2"
              />
              <path
                d="M0,15 Q25,30 50,15 T100,15 T150,15 T200,15 T250,15 T300,15 T350,15 T400,15 T450,15 T500,15 T550,15 T600,15 T650,15 T700,15 T750,15 T800,15 T850,15 T900,15 T950,15 T1000,15"
                fill="none" stroke="#C8973A" strokeWidth="2"
              />
            </svg>
          </div>

          {/* ── Kegiatan ── */}
          <section className="psk-section" style={{ paddingTop: 'clamp(40px, 5vw, 64px)' }}>
            <Reveal><div className="psk-section-label">Program Latihan</div></Reveal>
            <Reveal delay={60}><h2 className="psk-section-heading">KEGIATAN RUTIN</h2></Reveal>
            <div className="psk-kegiatan-grid">
              {KEGIATAN.map((k, i) => (
                <Reveal key={k.no} delay={i * 80} className="psk-kegiatan-item">
                  <div className="psk-kegiatan-no">{k.no}</div>
                  <div>
                    <div className="psk-kegiatan-nama">{k.nama}</div>
                    <div className="psk-kegiatan-detail">{k.detail}</div>
                  </div>
                </Reveal>
              ))}
            </div>
          </section>

          {/* ── Join / CTA interaktif ── */}
          <section className="psk-join">
            <div className="psk-section-label" style={{ display: 'inline-block' }}>Gabung Yuk</div>
            <h2 className="psk-join-heading">
              SIAP <span>MENJELAJAH</span> BARENG KAMI?
            </h2>
            <p className="psk-join-copy">
              Pramuka bukan cuma soal kemah dan tali-temali — ini soal karakter yang dibawa seumur hidup. Hubungi pembina ekstrakurikuler di sekolah untuk info pendaftaran.
            </p>
            <button
              type="button"
              className={`psk-join-motif${compassSpun ? ' spun' : ''}`}
              onClick={handleCompassTap}
              aria-label="Putar kompas"
            >
              <Compass size={76} />
              <span className="psk-join-hint">coba ketuk kompasnya</span>
            </button>
          </section>
        </main>

        <EskulMusic src="/audio/pramuka.mp3" />
        <Footer />
      </div>
    </>
  );
}