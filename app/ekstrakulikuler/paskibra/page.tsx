'use client';
import { useEffect, useRef, useState } from 'react';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import EskulMusic from '@/components/EskulMusic';
import Image from 'next/image';
import { Flag, ShieldCheck, UsersRound } from 'lucide-react';

const STATS = [
  { angka: '2025', label: 'Tahun Berdiri' },
  { angka: '45+',  label: 'Anggota Aktif' },
  { angka: '12',   label: 'Prestasi Diraih' },
  { angka: '100',  label: 'Dedikasi', suffix: '%' },
];

const TUJUAN = [
  {
    icon: Flag,
    judul: 'Nasionalisme',
    deskripsi:
      'Melalui kegiatan Paskibra, siswa diajarkan mencintai tanah air dan menghormati simbol-simbol negara, khususnya bendera Merah Putih.',
  },
  {
    icon: ShieldCheck,
    judul: 'Karakter Unggul',
    deskripsi:
      'Kedisiplinan, tanggung jawab, dan kerjasama adalah nilai-nilai utama yang ditanamkan dalam setiap sesi latihan dan penugasan.',
  },
  {
    icon: UsersRound,
    judul: 'Jiwa Kepemimpinan',
    deskripsi:
      'Anggota Paskibra dilatih memiliki jiwa kepemimpinan dan keberanian dalam menghadapi berbagai tantangan nyata.',
  },
];

const KEGIATAN = [
  { no: '01', nama: 'Latihan Baris-Berbaris (PBB)', detail: 'Formasi, kerapian, dan ketepatan gerakan.' },
  { no: '02', nama: 'Pengibaran Bendera Protokoler', detail: 'Prosedur resmi sesuai standar nasional.' },
  { no: '03', nama: 'Ketahanan Fisik & Mental', detail: 'Drill intensif membangun kepercayaan diri.' },
  { no: '04', nama: 'Upacara Kenegaraan', detail: 'Berperan aktif di hari besar nasional.' },
  { no: '05', nama: 'Pelatihan Kedisiplinan', detail: 'Etika, sikap, dan tanggung jawab.' },
  { no: '06', nama: 'Kompetisi Antar Sekolah', detail: 'Representasi sekolah di tingkat daerah.' },
];

/* ══════════════════════════════════════════
   HOOK: deteksi elemen masuk viewport (untuk reveal & count-up)
══════════════════════════════════════════ */
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
          obs.disconnect();
        }
      },
      { threshold }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [threshold]);

  return [ref, inView] as const;
}

/* ══════════════════════════════════════════
   REVEAL: bungkus elemen supaya fade+slide saat discroll,
   bisa diberi delay bertahap (efek "jatuh ke barisan")
══════════════════════════════════════════ */
function Reveal({
  children, delay = 0, className = '', as: Tag = 'div',
}: {
  children: React.ReactNode; delay?: number; className?: string; as?: keyof JSX.IntrinsicElements;
}) {
  const [ref, inView] = useInView<HTMLDivElement>();
  const Component = Tag as any;
  return (
    <Component
      ref={ref}
      className={`psk-reveal ${inView ? 'psk-reveal-in' : ''} ${className}`}
      style={{ transitionDelay: `${delay}ms` }}
    >
      {children}
    </Component>
  );
}

/* ══════════════════════════════════════════
   COUNT-UP: angka statistik menghitung naik saat terlihat
══════════════════════════════════════════ */
function CountUp({ value, suffix = '' }: { value: string; suffix?: string }) {
  const target = parseInt(value.replace(/\D/g, ''), 10) || 0;
  const [ref, inView] = useInView<HTMLDivElement>(0.4);
  const [display, setDisplay] = useState(0);

  useEffect(() => {
    if (!inView) return;
    let raf = 0;
    const duration = 1100;
    const start = performance.now();
    const step = (now: number) => {
      const progress = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setDisplay(Math.round(target * eased));
      if (progress < 1) raf = requestAnimationFrame(step);
    };
    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
  }, [inView, target]);

  return (
    <div ref={ref} className="psk-stat-num">
      {display}
      {suffix}
    </div>
  );
}

export default function PaskibraPage() {
  const title = 'PASKIBRA';

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Barlow:wght@400;500;600;700&family=Barlow+Condensed:wght@600;700;800&display=swap');

        :root {
          --psk-red: #C81E1E;
          --psk-red-dark: #8F1414;
          --psk-navy: #0A1628;
          --psk-gold: #C8973A;
          --psk-cream: #FAF7F0;
          --psk-white: #FFFFFF;
          --psk-muted: #6B7280;
          --psk-border: #E8DCC8;
        }

        .psk-root {
          font-family: 'Barlow', sans-serif;
          background: var(--psk-cream);
          color: var(--psk-navy);
          min-height: 100vh;
        }

        /* ── hero ── */
        .psk-hero {
          position: relative;
          overflow: hidden;
          background: var(--psk-cream);
        }
        .psk-hero-img {
          position: relative;
          width: 100%;
          height: min(70vh, 600px);
        }
        .psk-hero-img img {
          object-fit: cover;
          object-position: center top;
          filter: brightness(0.6) contrast(1.05) saturate(1.05);
        }
        .psk-hero-overlay {
          position: absolute;
          inset: 0;
          background: linear-gradient(
            to bottom,
            rgba(10,22,40,0.15) 10%,
            rgba(10,22,40,0.45) 55%,
            var(--psk-cream) 100%
          );
        }
        /* strip bendera merah-putih kecil di tepi atas hero, ciri khas paskibra */
        .psk-flag-strip {
          position: absolute;
          top: 0; left: 0; right: 0;
          height: 6px;
          background: linear-gradient(90deg, var(--psk-red) 0 50%, var(--psk-white) 50% 100%);
          background-size: 40px 100%;
          z-index: 2;
        }
        .psk-hero-content {
          position: absolute;
          bottom: 0; left: 0; right: 0;
          padding: 0 clamp(24px, 6vw, 80px) clamp(40px, 6vw, 72px);
        }
        .psk-eyebrow {
          display: inline-flex;
          align-items: center;
          gap: 10px;
          font-family: 'Barlow Condensed', sans-serif;
          font-size: 13px;
          font-weight: 700;
          letter-spacing: 3px;
          text-transform: uppercase;
          color: #F4D9A8;
          margin-bottom: 16px;
        }
        .psk-flag-icon {
          display: inline-block;
          transform-origin: left center;
          animation: pskWave 2.4s ease-in-out infinite;
        }
        @keyframes pskWave {
          0%, 100% { transform: skewY(0deg) rotate(0deg); }
          25% { transform: skewY(6deg) rotate(2deg); }
          50% { transform: skewY(0deg) rotate(0deg); }
          75% { transform: skewY(-6deg) rotate(-2deg); }
        }
        .psk-eyebrow::after {
          content: '';
          display: block;
          width: 32px; height: 2px;
          background: var(--psk-gold);
        }
        .psk-title {
          font-family: 'Bebas Neue', sans-serif;
          font-size: clamp(72px, 12vw, 160px);
          line-height: 0.9;
          color: #fff;
          letter-spacing: 2px;
          margin: 0 0 20px;
          text-shadow: 0 4px 24px rgba(0,0,0,0.35);
        }
        .psk-title span.psk-letter-accent { color: var(--psk-red); }
        /* huruf judul "jatuh berbaris" satu per satu seperti formasi PBB */
        .psk-letter {
          display: inline-block;
          opacity: 0;
          animation: pskMarchIn 0.55s cubic-bezier(.2,.8,.2,1) forwards;
        }
        @keyframes pskMarchIn {
          0%   { opacity: 0; transform: translateY(-22px) scaleY(1.35); }
          60%  { opacity: 1; transform: translateY(3px) scaleY(0.94); }
          100% { opacity: 1; transform: translateY(0) scaleY(1); }
        }
        .psk-subtitle {
          max-width: 560px;
          font-size: clamp(15px, 1.8vw, 18px);
          color: rgba(255,255,255,0.85);
          line-height: 1.7;
        }

        /* ── stats bar ── */
        .psk-stats {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          background: var(--psk-white);
          border-top: 1px solid var(--psk-border);
          border-bottom: 1px solid var(--psk-border);
        }
        @media (max-width: 640px) {
          .psk-stats { grid-template-columns: repeat(2, 1fr); }
        }
        .psk-stat {
          padding: 28px 20px;
          text-align: center;
          border-right: 1px solid var(--psk-border);
        }
        .psk-stat:last-child { border-right: none; }
        .psk-stat-num {
          font-family: 'Bebas Neue', sans-serif;
          font-size: 42px;
          color: var(--psk-red);
          line-height: 1;
          margin-bottom: 6px;
        }
        .psk-stat-label {
          font-size: 11px;
          font-weight: 600;
          letter-spacing: 2px;
          text-transform: uppercase;
          color: var(--psk-muted);
        }

        /* ── reveal-on-scroll dasar ── */
        .psk-reveal {
          opacity: 0;
          transform: translateY(26px);
          transition: opacity 0.6s ease, transform 0.6s ease;
        }
        .psk-reveal-in {
          opacity: 1;
          transform: translateY(0);
        }

        /* ── section base ── */
        .psk-section {
          max-width: 1100px;
          margin: 0 auto;
          padding: clamp(56px, 8vw, 96px) clamp(24px, 6vw, 80px);
        }
        .psk-section-label {
          font-family: 'Barlow Condensed', sans-serif;
          font-size: 11px;
          font-weight: 700;
          letter-spacing: 3px;
          text-transform: uppercase;
          color: var(--psk-red);
          margin-bottom: 12px;
        }
        .psk-section-heading {
          font-family: 'Bebas Neue', sans-serif;
          font-size: clamp(40px, 5vw, 64px);
          color: var(--psk-navy);
          line-height: 1;
          margin-bottom: 48px;
        }

        /* ── tujuan cards ── */
        .psk-section--tujuan { background: var(--psk-cream); max-width: 100%; padding-left: 0; padding-right: 0; }
        .psk-section--tujuan .psk-section-inner { max-width: 1100px; margin: 0 auto; padding: 0 clamp(24px, 6vw, 80px); }
        .psk-tujuan-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 20px;
        }
        @media (max-width: 768px) {
          .psk-tujuan-grid { grid-template-columns: 1fr; }
        }
        .psk-tujuan-card {
          background: var(--psk-white);
          padding: 36px 28px;
          border: 1px solid var(--psk-border);
          border-radius: 16px;
          box-shadow: 0 4px 16px rgba(10,22,40,0.05);
          transition: transform 0.25s ease, box-shadow 0.25s ease, border-color 0.25s ease;
          position: relative;
          overflow: hidden;
        }
        .psk-tujuan-card::after {
          content: '';
          position: absolute;
          bottom: 0; left: 0; right: 0;
          height: 3px;
          background: var(--psk-red);
          transform: scaleX(0);
          transform-origin: left;
          transition: transform 0.35s ease;
        }
        .psk-tujuan-card:hover {
          transform: translateY(-6px);
          box-shadow: 0 14px 28px rgba(10,22,40,0.12);
          border-color: rgba(200,30,30,0.25);
        }
        .psk-tujuan-card:hover::after { transform: scaleX(1); }
        .psk-tujuan-icon {
          width: 56px; height: 56px;
          border-radius: 14px;
          background: rgba(200,30,30,0.08);
          color: var(--psk-red);
          display: flex; align-items: center; justify-content: center;
          margin-bottom: 20px;
          transition: transform 0.25s ease;
        }
        .psk-tujuan-card:hover .psk-tujuan-icon {
          transform: rotate(-6deg) scale(1.08);
        }
        .psk-tujuan-title {
          font-family: 'Barlow Condensed', sans-serif;
          font-size: 22px;
          font-weight: 800;
          color: var(--psk-navy);
          text-transform: uppercase;
          letter-spacing: 1px;
          margin-bottom: 12px;
        }
        .psk-tujuan-desc {
          font-size: 14px;
          color: var(--psk-muted);
          line-height: 1.75;
        }

        /* ── kegiatan list ── */
        .psk-kegiatan-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 1px;
          background: var(--psk-border);
          border: 1px solid var(--psk-border);
          border-radius: 16px;
          overflow: hidden;
        }
        @media (max-width: 640px) {
          .psk-kegiatan-grid { grid-template-columns: 1fr; }
        }
        .psk-kegiatan-item {
          background: var(--psk-white);
          padding: 26px 28px;
          display: flex;
          align-items: flex-start;
          gap: 20px;
          transition: background 0.2s ease;
          position: relative;
        }
        .psk-kegiatan-item::before {
          content: '';
          position: absolute;
          left: 0; top: 0; bottom: 0;
          width: 3px;
          background: var(--psk-red);
          transform: scaleY(0);
          transform-origin: bottom;
          transition: transform 0.3s ease;
        }
        .psk-kegiatan-item:hover { background: var(--psk-cream); }
        .psk-kegiatan-item:hover::before { transform: scaleY(1); }
        .psk-kegiatan-no {
          font-family: 'Bebas Neue', sans-serif;
          font-size: 32px;
          color: rgba(200,30,30,0.35);
          line-height: 1;
          flex-shrink: 0;
          width: 40px;
          transition: color 0.2s ease, transform 0.2s ease;
        }
        .psk-kegiatan-item:hover .psk-kegiatan-no {
          color: var(--psk-red);
          animation: pskStep 0.4s ease;
        }
        /* efek "hentak" langkah tegap saat hover, ciri khas baris-berbaris */
        @keyframes pskStep {
          0%   { transform: translateY(0); }
          35%  { transform: translateY(-4px); }
          60%  { transform: translateY(1px); }
          100% { transform: translateY(0); }
        }
        .psk-kegiatan-nama {
          font-family: 'Barlow Condensed', sans-serif;
          font-size: 18px;
          font-weight: 700;
          color: var(--psk-navy);
          text-transform: uppercase;
          letter-spacing: 0.5px;
          margin-bottom: 4px;
        }
        .psk-kegiatan-detail {
          font-size: 13px;
          color: var(--psk-muted);
        }

        /* ── divider ── */
        .psk-divider {
          display: flex;
          align-items: center;
          gap: 16px;
          max-width: 1100px;
          margin: 0 auto;
          padding: 0 clamp(24px, 6vw, 80px);
          opacity: 0.6;
        }
        .psk-divider::before,
        .psk-divider::after {
          content: '';
          flex: 1;
          height: 1px;
          background: var(--psk-gold);
        }
        .psk-divider-icon { font-size: 14px; color: var(--psk-red); }

        @media (prefers-reduced-motion: reduce) {
          .psk-letter, .psk-reveal, .psk-flag-icon, .psk-tujuan-card, .psk-kegiatan-item, .psk-kegiatan-no {
            animation: none !important;
            transition: none !important;
            opacity: 1 !important;
            transform: none !important;
          }
        }
      `}</style>

      <div className="psk-root">
        <Navbar />

        <main>
          {/* ── Hero ── */}
          <section className="psk-hero">
            <div className="psk-flag-strip" />
            <div className="psk-hero-img">
              <Image
                src="/images/eskul/eskulpaskibra.jpg"
                alt="Paskibra SMK Citra Negara"
                fill
                priority
              />
              <div className="psk-hero-overlay" />
            </div>
            <div className="psk-hero-content">
              <div className="psk-eyebrow">
                <Flag size={16} className="psk-flag-icon" />
                Ekstrakurikuler SMK Citra Negara
              </div>
              <h1 className="psk-title">
                {title.split('').map((ch, i) => (
                  <span
                    key={i}
                    className={`psk-letter ${i >= 5 ? 'psk-letter-accent' : ''}`}
                    style={{ animationDelay: `${i * 60}ms` }}
                  >
                    {ch}
                  </span>
                ))}
              </h1>
              <p className="psk-subtitle">
                Pasukan Pengibar Bendera — garda terdepan kehormatan bangsa. Kami bukan sekadar berseragam, kami adalah simbol disiplin, kebanggaan, dan dedikasi tanpa kompromi.
              </p>
            </div>
          </section>

          {/* ── Stats ── */}
          <div className="psk-stats">
            {STATS.map((s, i) => (
              <Reveal key={s.label} delay={i * 90} className="psk-stat">
                <CountUp value={s.angka} suffix={s.suffix} />
                <div className="psk-stat-label">{s.label}</div>
              </Reveal>
            ))}
          </div>

          {/* ── Tujuan ── */}
          <section className="psk-section psk-section--tujuan">
            <div className="psk-section-inner">
              <Reveal><div className="psk-section-label">Mengapa Paskibra</div></Reveal>
              <Reveal delay={60}><h2 className="psk-section-heading">TUJUAN KAMI</h2></Reveal>
              <div className="psk-tujuan-grid">
                {TUJUAN.map((t, i) => (
                  <Reveal key={t.judul} delay={i * 120} className="psk-tujuan-card">
                    <div className="psk-tujuan-icon">
                      <t.icon size={26} />
                    </div>
                    <div className="psk-tujuan-title">{t.judul}</div>
                    <p className="psk-tujuan-desc">{t.deskripsi}</p>
                  </Reveal>
                ))}
              </div>
            </div>
          </section>

          <div className="psk-divider"><span className="psk-divider-icon">✦</span></div>

          {/* ── Kegiatan ── */}
          <section className="psk-section" style={{ paddingTop: 'clamp(40px, 5vw, 64px)' }}>
            <Reveal><div className="psk-section-label">Program Latihan</div></Reveal>
            <Reveal delay={60}><h2 className="psk-section-heading">KEGIATAN RUTIN</h2></Reveal>
            <div className="psk-kegiatan-grid">
              {KEGIATAN.map((k, i) => (
                <Reveal key={k.no} delay={i * 80} className="psk-kegiatan-item" as="div">
                  <div className="psk-kegiatan-no">{k.no}</div>
                  <div>
                    <div className="psk-kegiatan-nama">{k.nama}</div>
                    <div className="psk-kegiatan-detail">{k.detail}</div>
                  </div>
                </Reveal>
              ))}
            </div>
          </section>

        </main>

        <EskulMusic src="/audio/paskibra.mp3" />
        <Footer />
      </div>
    </>
  );
}