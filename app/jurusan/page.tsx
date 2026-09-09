'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import {
  ArrowRight,
  ArrowUpRight,
  Check,
  FlaskConical,
  Globe2,
  GraduationCap,
  Layers,
  CalendarDays,
} from 'lucide-react';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';

const NAVY = '#0A1628';
const GOLD = '#C8973A';
const GRAY = '#6B7280';

const DEFAULT_FALLBACK =
  'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=800&q=80';

type Jurusan = {
  kode: 'IPA' | 'IPS';
  nama: string;
  img: string;
  href: string;
  icon: typeof FlaskConical;
  tagline: string;
  desc: string;
  kuota: number;
  mapel: string[];
  karier: string[];
  alasan: string;
};

const JURUSAN: Jurusan[] = [
  {
    kode: 'IPA',
    nama: 'Ilmu Pengetahuan Alam',
    img: '/images/ipa.jpg',
    href: '/jurusan/ipa',
    icon: FlaskConical,
    tagline: 'Untuk kamu yang senang meneliti, mengamati, dan memecahkan masalah.',
    desc: 'Mempelajari fenomena alam melalui pendekatan ilmiah — bagaimana makhluk hidup, materi, energi, dan alam semesta bekerja berdasarkan teori dan praktik yang terstruktur.',
    kuota: 72,
    mapel: [
      'Biologi',
      'Fisika',
      'Kimia',
      'Matematika Peminatan',
      'Praktikum Laboratorium',
      'Penelitian Ilmiah',
    ],
    karier: [
      'Dokter',
      'Apoteker',
      'Insinyur',
      'Peneliti',
      'Ahli Data',
      'Guru Sains',
    ],
    alasan: 'Melatih berpikir logis, banyak praktikum, dan membuka peluang kuliah di bidang sains, kesehatan, teknik, serta teknologi.',
  },
  {
    kode: 'IPS',
    nama: 'Ilmu Pengetahuan Sosial',
    img: '/images/ips.jpg',
    href: '/jurusan/ips',
    icon: Globe2,
    tagline: 'Untuk kamu yang tertarik pada manusia, masyarakat, dan dinamikanya.',
    desc: 'Mempelajari kehidupan masyarakat melalui Ekonomi, Geografi, Sejarah, dan Sosiologi untuk memahami fenomena sosial serta cara pengambilan keputusan di dunia nyata.',
    kuota: 72,
    mapel: [
      'Ekonomi',
      'Geografi',
      'Sejarah',
      'Sosiologi',
      'Antropologi',
      'Kajian Isu Sosial',
    ],
    karier: [
      'Ekonom',
      'Diplomat',
      'Jurnalis',
      'Pengacara',
      'HRD',
      'Analis Kebijakan',
    ],
    alasan: 'Mengasah kemampuan komunikasi, memahami isu sosial, dan membuka peluang karier yang luas di pemerintahan, bisnis, hukum, dan media.',
  },
];

const STATS = [
  { icon: Layers, to: 2, suffix: '', label: 'Peminatan' },
  { icon: GraduationCap, to: 12, suffix: '+', label: 'Mata Pelajaran' },
  { icon: FlaskConical, to: 144, suffix: '', label: 'Kuota / Tahun' },
  { icon: CalendarDays, to: 2024, suffix: '', label: 'Tahun Berdiri' },
];

/* ══════════════════════════════════════════ HOOKS ══════════════════════════════════════════ */

function useInViewOnce<T extends HTMLElement>(threshold = 0.15) {
  const ref = useRef<T | null>(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (typeof IntersectionObserver === 'undefined') {
      setInView(true);
      return;
    }
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
          obs.disconnect();
        }
      },
      { threshold },
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [threshold]);

  return [ref, inView] as const;
}

function useCountUp(target: number, trigger: boolean, duration = 1100) {
  const [value, setValue] = useState(0);

  useEffect(() => {
    if (!trigger) return;
    let raf = 0;
    let start: number | null = null;
    const step = (ts: number) => {
      if (start === null) start = ts;
      const progress = Math.min((ts - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setValue(Math.floor(eased * target));
      if (progress < 1) raf = requestAnimationFrame(step);
      else setValue(target);
    };
    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
  }, [trigger, target, duration]);

  return value;
}

/* ══════════════════════════════════════════ STAT TILE ══════════════════════════════════════════ */

function StatTile({
  stat,
  index,
  inView,
}: {
  stat: (typeof STATS)[number];
  index: number;
  inView: boolean;
}) {
  const count = useCountUp(stat.to, inView, 900 + index * 160);
  return (
    <div className="jur-stat" style={{ transitionDelay: `${index * 70}ms` }}>
      <span className="jur-stat-ico">
        <stat.icon size={18} color={NAVY} />
      </span>
      <span className="jur-stat-num">
        {count}
        {stat.suffix}
      </span>
      <span className="jur-stat-lbl">{stat.label}</span>
    </div>
  );
}

/* ══════════════════════════════════════════ KARTU PILIH ══════════════════════════════════════════ */

function PickCard({
  j,
  index,
  selected,
  onSelect,
}: {
  j: Jurusan;
  index: number;
  selected: boolean;
  onSelect: () => void;
}) {
  const cardRef = useRef<HTMLButtonElement>(null);
  const [imgError, setImgError] = useState(false);

  const handleMouseMove = (e: React.MouseEvent<HTMLButtonElement>) => {
    const el = cardRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const ry = ((e.clientX - rect.left) / rect.width - 0.5) * 6;
    const rx = (0.5 - (e.clientY - rect.top) / rect.height) * 6;
    el.style.setProperty('--rx', `${rx}deg`);
    el.style.setProperty('--ry', `${ry}deg`);
  };

  const handleMouseLeave = () => {
    const el = cardRef.current;
    if (!el) return;
    el.style.setProperty('--rx', '0deg');
    el.style.setProperty('--ry', '0deg');
  };

  return (
    <button
      ref={cardRef}
      type="button"
      onClick={onSelect}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      aria-pressed={selected}
      className={`jur-card ${selected ? 'is-selected' : ''}`}
      style={{ animationDelay: `${index * 120}ms` }}
    >
      <span className="jur-card-check" aria-hidden={!selected}>
        <Check size={15} strokeWidth={3} />
      </span>

      <span className="jur-card-media">
        <img
          src={imgError ? DEFAULT_FALLBACK : j.img}
          alt={j.nama}
          onError={() => setImgError(true)}
          className="jur-card-img"
        />
        <span className="jur-card-scrim" aria-hidden="true" />
        <span className="jur-card-kode">
          <j.icon size={14} /> {j.kode}
        </span>
      </span>

      <span className="jur-card-body">
        <span className="font-display jur-card-title">{j.nama}</span>
        <span className="jur-card-desc">{j.tagline}</span>

        <span className="jur-card-meter">
          <span className="jur-card-meter-track">
            <span
              className="jur-card-meter-fill"
              style={{ width: selected ? '100%' : '38%' }}
            />
          </span>
          <span className="jur-card-meter-lbl">{j.kuota} kuota / tahun</span>
        </span>

        <span className="jur-card-cta">
          {selected ? 'Peminatan dipilih' : 'Pilih & lihat detail'}
          <ArrowRight size={16} />
        </span>
      </span>
    </button>
  );
}

/* ══════════════════════════════════════════ PANEL DETAIL ══════════════════════════════════════════ */

function DetailPanel({ j }: { j: Jurusan }) {
  const [meter, setMeter] = useState(0);
  const pct = Math.round((j.kuota / 144) * 100);

  useEffect(() => {
    setMeter(0);
    const t = setTimeout(() => setMeter(pct), 80);
    return () => clearTimeout(t);
  }, [j.kode, pct]);

  return (
    <div key={j.kode} className="jur-detail-inner">
      <div className="jur-detail-main">
        <span className="jur-detail-kode">
          <j.icon size={15} /> Peminatan {j.kode}
        </span>
        <h3 className="font-display jur-detail-title">{j.nama}</h3>
        <p className="jur-detail-tag">{j.tagline}</p>
        <p className="jur-detail-desc">{j.desc}</p>

        <div className="jur-meter">
          <div className="jur-meter-row">
            <span>Daya tampung</span>
            <strong>
              {j.kuota} <span>/ 144 siswa</span>
            </strong>
          </div>
          <div className="jur-meter-track">
            <div className="jur-meter-fill" style={{ width: `${meter}%` }} />
          </div>
        </div>

        <div className="jur-detail-actions">
          <Link href={j.href} className="jur-btn jur-btn-gold">
            Detail lengkap {j.kode} <ArrowUpRight size={16} />
          </Link>
          <Link href="/spmb" className="jur-btn jur-btn-ghost">
            Daftar Sekarang
          </Link>
        </div>
      </div>

      <div className="jur-detail-side">
        <div className="jur-side-block">
          <h4 className="jur-side-title">Yang kamu pelajari</h4>
          <ul className="jur-mapel">
            {j.mapel.map((m) => (
              <li key={m}>
                <span className="jur-mapel-dot" />
                {m}
              </li>
            ))}
          </ul>
        </div>

        <div className="jur-side-block">
          <h4 className="jur-side-title">Prospek karier</h4>
          <div className="jur-karier">
            {j.karier.map((k) => (
              <span key={k} className="jur-chip">
                {k}
              </span>
            ))}
          </div>
        </div>

        <p className="jur-side-note">{j.alasan}</p>
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════ HALAMAN ══════════════════════════════════════════ */

export default function JurusanPage() {
  const [selected, setSelected] = useState<'IPA' | 'IPS'>('IPA');
  const [statRef, statInView] = useInViewOnce<HTMLDivElement>(0.3);
  const [gridRef, gridInView] = useInViewOnce<HTMLDivElement>(0.15);

  const current = JURUSAN.find((j) => j.kode === selected)!;

  return (
    <>
      <Navbar />

      <main>
        {/* HERO */}
        <section className="hero-gradient jur-hero">
          <div className="jur-hero-inner">
            <div className="gold-line" style={{ margin: '0 auto 18px' }} />
            <span className="jur-eyebrow">Program Studi</span>
            <h1 className="font-display jur-hero-title">Bidang Studi</h1>
            <p className="jur-hero-sub">
              Dua peminatan, satu tujuan: membekali kamu untuk melangkah ke jenjang
              berikutnya. Pilih yang paling sesuai dengan minat dan bakatmu.
            </p>
          </div>
        </section>

        {/* STATS */}
        <div ref={statRef} className={`jur-stats ${statInView ? 'is-visible' : ''}`}>
          {STATS.map((s, i) => (
            <StatTile key={s.label} stat={s} index={i} inView={statInView} />
          ))}
        </div>

        {/* PICKER */}
        <section className="jur-pick">
          <div className="jur-pick-head">
            <span className="jur-eyebrow jur-eyebrow-dark">Pilih Peminatan</span>
            <h2 className="font-display jur-pick-title">
              Ketuk kartu untuk melihat detailnya
            </h2>
          </div>

          <div
            ref={gridRef}
            className={`jur-cards ${gridInView ? 'is-visible' : ''}`}
            data-selected={selected}
          >
            {JURUSAN.map((j, i) => (
              <PickCard
                key={j.kode}
                j={j}
                index={i}
                selected={selected === j.kode}
                onSelect={() => setSelected(j.kode)}
              />
            ))}
          </div>

          {/* DETAIL */}
          <div className="jur-detail">
            <DetailPanel j={current} />
          </div>
        </section>
      </main>

      <Footer />

      <style jsx global>{`
        .jur-hero {
          padding: 96px 24px 132px;
          text-align: center;
        }
        .jur-hero-inner {
          max-width: 640px;
          margin: 0 auto;
          position: relative;
          z-index: 1;
          animation: jurFadeUp 0.7s cubic-bezier(0.16, 0.8, 0.3, 1) both;
        }
        .jur-eyebrow {
          display: block;
          font-size: 12px;
          font-weight: 700;
          letter-spacing: 3px;
          text-transform: uppercase;
          color: #E8B84B;
          margin-bottom: 10px;
        }
        .jur-eyebrow-dark {
          color: #C8973A;
        }
        .jur-hero-title {
          font-size: 46px;
          color: #fff;
          margin-bottom: 14px;
        }
        .jur-hero-sub {
          color: rgba(255, 255, 255, 0.8);
          font-size: 16px;
          line-height: 1.75;
        }

        /* STATS */
        .jur-stats {
          max-width: 960px;
          margin: -84px auto 0;
          padding: 0 24px;
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 16px;
          position: relative;
          z-index: 3;
        }
        .jur-stat {
          background: #fff;
          border: 1px solid #ECE3D2;
          border-radius: 16px;
          padding: 22px 14px 18px;
          text-align: center;
          box-shadow: 0 16px 38px rgba(10, 22, 40, 0.1);
          opacity: 0;
          transform: translateY(18px);
          transition: opacity 0.6s ease, transform 0.6s ease;
        }
        .jur-stats.is-visible .jur-stat {
          opacity: 1;
          transform: none;
        }
        .jur-stat-ico {
          width: 40px;
          height: 40px;
          border-radius: 12px;
          margin: 0 auto 10px;
          display: flex;
          align-items: center;
          justify-content: center;
          background: linear-gradient(135deg, #C8973A, #E8B84B);
        }
        .jur-stat-num {
          display: block;
          font-family: 'Playfair Display', serif;
          font-size: 28px;
          font-weight: 700;
          color: #0a1628;
          line-height: 1;
          font-variant-numeric: tabular-nums;
        }
        .jur-stat-lbl {
          display: block;
          font-size: 12px;
          font-weight: 600;
          color: #6b7280;
          margin-top: 6px;
          letter-spacing: 0.3px;
        }

        /* PICKER */
        .jur-pick {
          max-width: 1080px;
          margin: 0 auto;
          padding: 72px 24px 100px;
        }
        .jur-pick-head {
          text-align: center;
          margin-bottom: 36px;
        }
        .jur-pick-title {
          font-size: 30px;
          color: #0a1628;
        }

        .jur-cards {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 24px;
          perspective: 1400px;
        }
        .jur-cards.is-visible .jur-card {
          animation: jurCardIn 0.7s cubic-bezier(0.16, 0.8, 0.3, 1) both;
        }
        /* dim the non-hovered sibling for focus */
        .jur-cards:hover .jur-card:not(:hover) {
          opacity: 0.62;
        }

        .jur-card {
          --rx: 0deg;
          --ry: 0deg;
          position: relative;
          display: flex;
          flex-direction: column;
          text-align: left;
          background: #fff;
          border: 1.5px solid #efe7d6;
          border-radius: 22px;
          overflow: hidden;
          cursor: pointer;
          font: inherit;
          color: inherit;
          padding: 0;
          opacity: 1;
          transform: perspective(1400px) rotateX(var(--rx)) rotateY(var(--ry));
          transition: transform 0.2s ease, box-shadow 0.35s ease,
            border-color 0.35s ease, opacity 0.35s ease;
        }
        .jur-card:hover {
          border-color: #d9b978;
          box-shadow: 0 26px 60px rgba(10, 22, 40, 0.16);
        }
        .jur-card:focus-visible {
          outline: 3px solid #c8973a;
          outline-offset: 3px;
        }
        .jur-card.is-selected {
          border-color: #c8973a;
          box-shadow: 0 0 0 3px rgba(200, 151, 58, 0.25),
            0 26px 60px rgba(10, 22, 40, 0.18);
        }

        .jur-card-check {
          position: absolute;
          top: 14px;
          right: 14px;
          z-index: 3;
          width: 26px;
          height: 26px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          background: #c8973a;
          color: #fff;
          transform: scale(0);
          transition: transform 0.25s cubic-bezier(0.34, 1.56, 0.64, 1);
        }
        .jur-card.is-selected .jur-card-check {
          transform: scale(1);
        }

        .jur-card-media {
          position: relative;
          display: block;
          height: 190px;
          background: #fbf4e4;
          overflow: hidden;
        }
        .jur-card-img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          display: block;
          transition: transform 0.5s ease;
        }
        .jur-card:hover .jur-card-img {
          transform: scale(1.07);
        }
        .jur-card-scrim {
          position: absolute;
          inset: 0;
          background: linear-gradient(
            180deg,
            rgba(10, 22, 40, 0) 45%,
            rgba(10, 22, 40, 0.68) 100%
          );
        }
        .jur-card-kode {
          position: absolute;
          left: 16px;
          bottom: 14px;
          display: inline-flex;
          align-items: center;
          gap: 6px;
          color: #fff;
          font-size: 12px;
          font-weight: 800;
          letter-spacing: 2px;
          padding: 6px 12px;
          border-radius: 999px;
          border: 1px solid rgba(255, 255, 255, 0.45);
          background: rgba(255, 255, 255, 0.1);
          backdrop-filter: blur(6px);
        }
        .jur-card.is-selected .jur-card-kode {
          background: rgba(200, 151, 58, 0.9);
          border-color: transparent;
        }

        .jur-card-body {
          display: flex;
          flex-direction: column;
          gap: 10px;
          padding: 22px 22px 24px;
        }
        .jur-card-title {
          font-size: 20px;
          color: #0a1628;
        }
        .jur-card-desc {
          font-size: 14px;
          color: #6b7280;
          line-height: 1.6;
        }
        .jur-card-meter {
          display: block;
          margin-top: 4px;
        }
        .jur-card-meter-track {
          display: block;
          height: 6px;
          border-radius: 999px;
          background: #f0ebe0;
          overflow: hidden;
        }
        .jur-card-meter-fill {
          display: block;
          height: 100%;
          border-radius: 999px;
          background: linear-gradient(90deg, #c8973a, #e8b84b);
          transition: width 0.6s cubic-bezier(0.16, 0.8, 0.3, 1);
        }
        .jur-card-meter-lbl {
          display: block;
          font-size: 12px;
          color: #9ca3af;
          margin-top: 7px;
          font-weight: 600;
        }
        .jur-card-cta {
          display: inline-flex;
          align-items: center;
          gap: 7px;
          margin-top: 6px;
          font-size: 13.5px;
          font-weight: 700;
          color: #0a1628;
        }
        .jur-card.is-selected .jur-card-cta {
          color: #c8973a;
        }
        .jur-card-cta svg {
          transition: transform 0.25s ease;
        }
        .jur-card:hover .jur-card-cta svg {
          transform: translateX(4px);
        }

        /* DETAIL */
        .jur-detail {
          margin-top: 28px;
          background: #fff;
          border: 1.5px solid #efe7d6;
          border-radius: 24px;
          box-shadow: 0 22px 55px rgba(10, 22, 40, 0.09);
          overflow: hidden;
        }
        .jur-detail-inner {
          display: grid;
          grid-template-columns: 1.15fr 1fr;
          animation: jurSwap 0.45s ease both;
        }
        .jur-detail-main {
          padding: 40px 38px;
          border-right: 1px solid #f0ebe0;
        }
        .jur-detail-kode {
          display: inline-flex;
          align-items: center;
          gap: 7px;
          font-size: 12px;
          font-weight: 800;
          letter-spacing: 1.5px;
          text-transform: uppercase;
          color: #c8973a;
          background: #fbf4e4;
          border: 1px solid #f0ebe0;
          padding: 6px 13px;
          border-radius: 999px;
          margin-bottom: 16px;
        }
        .jur-detail-title {
          font-size: 28px;
          color: #0a1628;
          margin-bottom: 8px;
        }
        .jur-detail-tag {
          color: #c8973a;
          font-weight: 600;
          font-size: 14.5px;
          margin-bottom: 14px;
        }
        .jur-detail-desc {
          color: #6b7280;
          line-height: 1.85;
          font-size: 14.5px;
        }

        .jur-meter {
          margin: 26px 0;
        }
        .jur-meter-row {
          display: flex;
          justify-content: space-between;
          align-items: baseline;
          font-size: 13px;
          color: #6b7280;
          margin-bottom: 8px;
        }
        .jur-meter-row strong {
          color: #0a1628;
          font-size: 16px;
          font-family: 'Playfair Display', serif;
        }
        .jur-meter-row strong span {
          color: #9ca3af;
          font-size: 12px;
          font-weight: 400;
          font-family: 'Plus Jakarta Sans', sans-serif;
        }
        .jur-meter-track {
          height: 9px;
          border-radius: 999px;
          background: #f0ebe0;
          overflow: hidden;
        }
        .jur-meter-fill {
          height: 100%;
          border-radius: 999px;
          background: linear-gradient(90deg, #c8973a, #e8b84b);
          transition: width 1s cubic-bezier(0.16, 0.8, 0.3, 1);
        }

        .jur-detail-actions {
          display: flex;
          flex-wrap: wrap;
          gap: 12px;
          margin-top: 8px;
        }
        .jur-btn {
          display: inline-flex;
          align-items: center;
          gap: 7px;
          padding: 12px 22px;
          border-radius: 10px;
          font-weight: 700;
          font-size: 14px;
          text-decoration: none;
          transition: transform 0.18s ease, box-shadow 0.18s ease,
            background 0.18s ease;
        }
        .jur-btn-gold {
          background: linear-gradient(135deg, #c8973a, #e8b84b);
          color: #0a1628;
        }
        .jur-btn-gold:hover {
          transform: translateY(-2px);
          box-shadow: 0 12px 26px rgba(200, 151, 58, 0.42);
        }
        .jur-btn-ghost {
          background: #fff;
          color: #0a1628;
          border: 1.5px solid #e2d9c8;
        }
        .jur-btn-ghost:hover {
          border-color: #c8973a;
          color: #c8973a;
        }

        .jur-detail-side {
          padding: 40px 34px;
          background: #fdfbf6;
          display: flex;
          flex-direction: column;
          gap: 24px;
        }
        .jur-side-title {
          font-size: 12px;
          font-weight: 800;
          letter-spacing: 1.5px;
          text-transform: uppercase;
          color: #0a1628;
          margin-bottom: 14px;
        }
        .jur-mapel {
          list-style: none;
          display: grid;
          gap: 10px;
        }
        .jur-mapel li {
          display: flex;
          align-items: center;
          gap: 10px;
          font-size: 14px;
          color: #374151;
        }
        .jur-mapel-dot {
          width: 7px;
          height: 7px;
          border-radius: 50%;
          background: #c8973a;
          flex-shrink: 0;
        }
        .jur-karier {
          display: flex;
          flex-wrap: wrap;
          gap: 8px;
        }
        .jur-chip {
          font-size: 12.5px;
          font-weight: 600;
          color: #0a1628;
          background: #fff;
          border: 1px solid #ece3d2;
          padding: 7px 13px;
          border-radius: 999px;
          transition: background 0.18s ease, color 0.18s ease,
            border-color 0.18s ease;
        }
        .jur-chip:hover {
          background: #c8973a;
          border-color: #c8973a;
          color: #fff;
        }
        .jur-side-note {
          font-size: 13px;
          line-height: 1.75;
          color: #6b7280;
          border-top: 1px dashed #e2d9c8;
          padding-top: 18px;
        }

        /* KEYFRAMES */
        @keyframes jurFadeUp {
          from {
            opacity: 0;
            transform: translateY(16px);
          }
          to {
            opacity: 1;
            transform: none;
          }
        }
        @keyframes jurCardIn {
          from {
            opacity: 0;
            transform: translateY(26px) scale(0.97);
          }
          to {
            opacity: 1;
            transform: none;
          }
        }
        @keyframes jurSwap {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: none;
          }
        }

        /* RESPONSIVE */
        @media (max-width: 900px) {
          .jur-stats {
            grid-template-columns: 1fr 1fr;
          }
        }
        @media (max-width: 780px) {
          .jur-hero {
            padding: 68px 20px 118px;
          }
          .jur-hero-title {
            font-size: 32px;
          }
          .jur-cards {
            grid-template-columns: 1fr;
          }
          .jur-detail-inner {
            grid-template-columns: 1fr;
          }
          .jur-detail-main {
            border-right: none;
            border-bottom: 1px solid #f0ebe0;
            padding: 32px 24px;
          }
          .jur-detail-side {
            padding: 32px 24px;
          }
          .jur-pick {
            padding: 56px 20px 80px;
          }
          .jur-pick-title {
            font-size: 24px;
          }
        }
        @media (prefers-reduced-motion: reduce) {
          .jur-hero-inner,
          .jur-cards.is-visible .jur-card,
          .jur-detail-inner {
            animation: none !important;
          }
          .jur-stat,
          .jur-card,
          .jur-card-img,
          .jur-card-meter-fill,
          .jur-meter-fill {
            transition: none !important;
          }
          .jur-stat {
            opacity: 1 !important;
            transform: none !important;
          }
        }
      `}</style>
    </>
  );
}
