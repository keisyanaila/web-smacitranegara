'use client';

import { useEffect, useRef, useState } from 'react';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import EskulMusic from '@/components/EskulMusic';
import Image from 'next/image';

const STATS = [
  { angka: '2015', label: 'Tahun Berdiri' },
  { angka: '25+', label: 'Anggota Aktif' },
  { angka: '12', label: 'Prestasi Diraih' },
  { angka: '100%', label: 'Dedikasi' },
];

const TUJUAN = [
  {
    icon: '⚡',
    judul: 'Kebugaran Fisik',
    deskripsi:
      'Futsal membantu meningkatkan kebugaran fisik siswa melalui latihan yang intens dan pertandingan yang dinamis dan penuh semangat.',
  },
  {
    icon: '⚽',
    judul: 'Keterampilan Teknis',
    deskripsi:
      'Futsal merupakan versi mini sepak bola yang membantu siswa mengasah keterampilan dribbling, passing, dan shooting secara optimal.',
  },
  {
    icon: '🤝',
    judul: 'Kerjasama Tim',
    deskripsi:
      'Dalam futsal, kerjasama tim adalah kunci. Siswa belajar berkomunikasi, membangun kepercayaan, dan merancang strategi bersama.',
  },
];

const KEGIATAN = [
  {
    no: '01',
    nama: 'Latihan Teknik Dasar',
    detail: 'Dribbling, passing, shooting, dan penguasaan bola.',
    kategori: 'teknik',
  },
  {
    no: '02',
    nama: 'Latihan Fisik',
    detail: 'Jogging, sprint, dan latihan kekuatan tubuh.',
    kategori: 'fisik',
  },
  {
    no: '03',
    nama: 'Strategi & Taktik',
    detail: 'Formasi, pergerakan tanpa bola, pola serangan.',
    kategori: 'strategi',
  },
  {
    no: '04',
    nama: 'Pertandingan Internal',
    detail: 'Scrimmage antar anggota untuk uji kemampuan.',
    kategori: 'kompetisi',
  },
  {
    no: '05',
    nama: 'Partisipasi Turnamen',
    detail: 'Kompetisi futsal regional hingga nasional.',
    kategori: 'kompetisi',
  },
  {
    no: '06',
    nama: 'Pengembangan Mentalitas',
    detail: 'Sportivitas, fair play, dan mental pemenang.',
    kategori: 'mental',
  },
];

const FILTERS = [
  { key: 'semua', label: 'Semua' },
  { key: 'teknik', label: 'Teknik' },
  { key: 'fisik', label: 'Fisik' },
  { key: 'strategi', label: 'Strategi' },
  { key: 'kompetisi', label: 'Kompetisi' },
  { key: 'mental', label: 'Mental' },
];

function useInView(threshold = 0.25) {
  const ref = useRef<HTMLDivElement | null>(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
          observer.unobserve(el);
        }
      },
      { threshold }
    );

    observer.observe(el);

    return () => observer.disconnect();
  }, [threshold]);

  return [ref, inView] as const;
}

function parseStat(value: string) {
  const match = value.match(/^(\d+)(.*)$/);

  if (!match) {
    return {
      num: 0,
      suffix: value,
    };
  }

  return {
    num: parseInt(match[1], 10),
    suffix: match[2],
  };
}

function StatCounter({
  angka,
  label,
  inView,
  delay,
}: {
  angka: string;
  label: string;
  inView: boolean;
  delay: number;
}) {
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

      if (t < 1) {
        raf = requestAnimationFrame(tick);
      }
    };

    raf = requestAnimationFrame(tick);

    return () => cancelAnimationFrame(raf);
  }, [inView, num, delay]);

  return (
    <div className="fts-stat">
      <div className="fts-stat-num">
        {display}
        {suffix}
      </div>

      <div className="fts-stat-label">{label}</div>
    </div>
  );
}

function SoccerBall({
  size = 70,
  className = '',
}: {
  size?: number;
  className?: string;
}) {
  return (
    <div
      className={`fts-ball ${className}`}
      style={{
        width: size,
        height: size,
      }}
      aria-hidden="true"
    >
      ⚽
    </div>
  );
}

export default function FutsalPage() {
  const [filter, setFilter] = useState('semua');
  const [kicked, setKicked] = useState(false);

  const [statsRef, statsInView] = useInView(0.4);
  const [tujuanRef, tujuanInView] = useInView(0.15);

  const filtered =
    filter === 'semua'
      ? KEGIATAN
      : KEGIATAN.filter((k) => k.kategori === filter);

  const handleKick = () => {
    setKicked(true);

    setTimeout(() => {
      setKicked(false);
    }, 700);
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Barlow:wght@400;500;600;700;800&family=Barlow+Condensed:wght@600;700;800&family=Oswald:wght@500;600;700&display=swap');

        /* ═════════════════════════════════════
           ROOT
        ═════════════════════════════════════ */

        .fts-root {
          font-family: 'Barlow', sans-serif;
          background: #fff7ed;
          color: #431407;
          min-height: 100vh;
          overflow-x: hidden;
        }

        .fts-root *,
        .fts-root *::before,
        .fts-root *::after {
          box-sizing: border-box;
        }

        @media (prefers-reduced-motion: reduce) {
          .fts-root *,
          .fts-root *::before,
          .fts-root *::after {
            animation-duration: 0.001ms !important;
            animation-iteration-count: 1 !important;
            transition-duration: 0.001ms !important;
          }
        }


        /* ═════════════════════════════════════
           HERO
        ═════════════════════════════════════ */

        .fts-hero {
          position: relative;
          overflow: hidden;
          background: #fff7ed;
        }

        .fts-hero-img {
          position: relative;
          width: 100%;
          height: min(74vh, 640px);
        }

        .fts-hero-img img {
          object-fit: cover;
          object-position: center 35%;
          filter:
            saturate(1.08)
            contrast(1.08)
            brightness(0.76);
          transform: scale(1.02);
        }

        .fts-hero-overlay {
          position: absolute;
          inset: 0;

          background:
            radial-gradient(
              50% 60% at 75% 25%,
              rgba(249, 115, 22, 0.24),
              transparent 65%
            ),
            linear-gradient(
              to bottom,
              rgba(18, 11, 6, 0.05) 0%,
              rgba(18, 11, 6, 0.18) 35%,
              rgba(18, 11, 6, 0.7) 72%,
              #1c0d04 100%
            );
        }


        /* ═════════ SCANLINE ═════════ */

        .fts-scanline {
          position: absolute;
          left: 0;
          right: 0;
          height: 2px;

          background:
            linear-gradient(
              90deg,
              transparent,
              rgba(251, 146, 60, 0.9),
              transparent
            );

          animation: ftsScan 5s linear infinite;
          pointer-events: none;
        }

        @keyframes ftsScan {
          0% {
            top: 0%;
            opacity: 0;
          }

          10% {
            opacity: 0.8;
          }

          90% {
            opacity: 0.8;
          }

          100% {
            top: 100%;
            opacity: 0;
          }
        }


        /* ═════════ FIELD LINES ═════════ */

        .fts-field-lines {
          position: absolute;
          inset: 0;
          opacity: 0.14;
          pointer-events: none;
        }

        .fts-field-lines::before {
          content: '';

          position: absolute;

          width: 250px;
          height: 250px;

          border:
            1px solid rgba(255,255,255,0.7);

          border-radius: 50%;

          right: 8%;
          top: 10%;
        }

        .fts-field-lines::after {
          content: '';

          position: absolute;

          width: 1px;
          height: 100%;

          background:
            rgba(255,255,255,0.5);

          right: 20%;
          top: 0;
        }


        /* ═════════ HERO CONTENT ═════════ */

        .fts-hero-content {
          position: absolute;

          bottom: 0;
          left: 0;
          right: 0;

          padding:
            0
            clamp(24px, 6vw, 80px)
            clamp(42px, 5vw, 68px);

          display: flex;

          align-items: flex-end;
          justify-content: space-between;

          gap: 30px;
        }

        .fts-hero-text {
          max-width: 680px;
        }

        .fts-eyebrow {
          display: inline-flex;

          align-items: center;

          gap: 10px;

          font-family:
            'Barlow Condensed',
            sans-serif;

          font-size: 13px;
          font-weight: 700;

          letter-spacing: 4px;

          text-transform: uppercase;

          color: #fff;

          margin-bottom: 18px;
        }

        .fts-eyebrow::before {
          content: '';

          display: block;

          width: 30px;
          height: 2px;

          background: #f97316;
        }


        /* ═════════ TITLE ═════════ */

        .fts-title {
          position: relative;

          font-family:
            'Oswald',
            sans-serif;

          font-size:
            clamp(68px, 11vw, 145px);

          font-weight: 700;

          line-height: 0.88;

          color: #fff;

          letter-spacing: -2px;

          margin: 0 0 20px;

          text-transform: uppercase;

          transition:
            transform 0.25s ease;
        }

        .fts-title:hover {
          transform:
            skewX(-3deg);
        }

        .fts-title span {
          color: #f97316;

          text-shadow:
            0 0 24px
            rgba(249, 115, 22, 0.45);
        }

        .fts-subtitle {
          max-width: 560px;

          font-size:
            clamp(15px, 1.7vw, 18px);

          line-height: 1.7;

          color:
            rgba(255,255,255,0.86);
        }


        /* ═════════ FLOATING BALL ═════════ */

        .fts-ball-zone {
          width: 150px;
          height: 150px;

          display: none;

          align-items: center;
          justify-content: center;

          flex-shrink: 0;
        }

        @media (min-width: 900px) {
          .fts-ball-zone {
            display: flex;
          }
        }

        .fts-ball {
          display: flex;

          align-items: center;
          justify-content: center;

          font-size: 64px;

          filter:
            drop-shadow(
              0 0 10px
              rgba(249, 115, 22, 0.45)
            );

          animation:
            ftsBallFloat
            2.8s
            ease-in-out
            infinite,

            ftsBallSpin
            9s
            linear
            infinite;

          user-select: none;
        }

        @keyframes ftsBallFloat {
          0%, 100% {
            transform:
              translateY(0)
              scale(1);
          }

          50% {
            transform:
              translateY(-13px)
              scale(1.08);
          }
        }

        @keyframes ftsBallSpin {
          from {
            rotate: 0deg;
          }

          to {
            rotate: 360deg;
          }
        }


        /* ═════════ SCROLL CUE ═════════ */

        .fts-scroll-cue {
          position: absolute;

          right:
            clamp(20px, 5vw, 64px);

          top: 24px;

          display: flex;

          flex-direction: column;

          align-items: center;

          gap: 8px;

          font-family:
            'Barlow Condensed',
            sans-serif;

          font-size: 12px;

          font-weight: 700;

          letter-spacing: 3px;

          color:
            rgba(255,255,255,0.72);
        }

        .fts-scroll-line {
          width: 1px;
          height: 46px;

          background:
            linear-gradient(
              to bottom,
              #f97316,
              transparent
            );

          position: relative;

          overflow: hidden;
        }

        .fts-scroll-line::after {
          content: '';

          position: absolute;

          top: -8px;
          left: -2px;

          width: 5px;
          height: 5px;

          border-radius: 50%;

          background: #fb923c;

          animation:
            ftsScrollDot
            1.8s
            ease-in-out
            infinite;
        }

        @keyframes ftsScrollDot {
          0% {
            top: -6px;
            opacity: 0;
          }

          20% {
            opacity: 1;
          }

          80% {
            opacity: 1;
          }

          100% {
            top: 46px;
            opacity: 0;
          }
        }


        /* ═════════════════════════════════════
           TICKER
        ═════════════════════════════════════ */

        .fts-ticker {
          border-top:
            1px solid
            rgba(251,146,60,0.25);

          border-bottom:
            1px solid
            rgba(251,146,60,0.25);

          background: #c2410c;

          overflow: hidden;

          white-space: nowrap;

          padding: 13px 0;
        }

        .fts-ticker-track {
          display: inline-flex;

          animation:
            ftsTicker
            24s
            linear
            infinite;
        }

        .fts-ticker-track > span {
          display: inline-flex;
        }

        .fts-ticker-item {
          display: inline-flex;

          align-items: center;

          gap: 10px;

          padding: 0 28px;

          font-family:
            'Barlow Condensed',
            sans-serif;

          font-size: 14px;

          font-weight: 700;

          letter-spacing: 2px;

          text-transform: uppercase;

          color:
            rgba(255,255,255,0.75);
        }

        .fts-ticker-item b {
          color: #fed7aa;
        }

        @keyframes ftsTicker {
          from {
            transform:
              translateX(0);
          }

          to {
            transform:
              translateX(-50%);
          }
        }


        /* ═════════════════════════════════════
           SCOREBOARD
        ═════════════════════════════════════ */

        .fts-scoreboard {
          background: #1c0d04;

          position: relative;

          overflow: hidden;
        }

        .fts-scoreboard::before {
          content: '';

          position: absolute;

          inset: 0;

          background:
            linear-gradient(
              90deg,
              rgba(249,115,22,0.08) 1px,
              transparent 1px
            )
            0 0 / 42px 100%;

          pointer-events: none;
        }

        .fts-stats {
          max-width: 1100px;

          margin: 0 auto;

          display: grid;

          grid-template-columns:
            repeat(4, 1fr);

          position: relative;
        }

        @media (max-width: 640px) {
          .fts-stats {
            grid-template-columns:
              repeat(2, 1fr);
          }
        }

        .fts-stat {
          padding:
            clamp(30px, 4vw, 46px)
            20px;

          text-align: center;

          border-right:
            1px solid
            rgba(249,115,22,0.18);
        }

        .fts-stat:last-child {
          border-right: none;
        }

        .fts-stat-num {
          font-family:
            'Barlow Condensed',
            sans-serif;

          font-size:
            clamp(40px, 5vw, 56px);

          font-weight: 700;

          color: #fb923c;

          line-height: 1;

          margin-bottom: 8px;

          text-shadow:
            0 0 18px
            rgba(249,115,22,0.45);

          font-variant-numeric:
            tabular-nums;
        }

        .fts-stat-label {
          font-size: 11px;

          font-weight: 600;

          letter-spacing: 2px;

          text-transform: uppercase;

          color:
            rgba(255,255,255,0.5);
        }


        /* ═════════════════════════════════════
           SECTION
        ═════════════════════════════════════ */

        .fts-section {
          max-width: 1100px;

          margin: 0 auto;

          padding:
            clamp(58px, 8vw, 100px)
            clamp(24px, 6vw, 80px);
        }

        .fts-section-label {
          font-family:
            'Barlow Condensed',
            sans-serif;

          font-size: 12px;

          font-weight: 700;

          letter-spacing: 3px;

          text-transform: uppercase;

          color: #ea580c;

          margin-bottom: 12px;
        }

        .fts-section-heading {
          font-family:
            'Oswald',
            sans-serif;

          font-size:
            clamp(38px, 4.8vw, 58px);

          font-weight: 700;

          color: #7c2d12;

          line-height: 1;

          margin:
            0 0 44px;

          text-transform: uppercase;
        }


        /* ═════════════════════════════════════
           TUJUAN
        ═════════════════════════════════════ */

        .fts-tujuan-grid {
          display: grid;

          grid-template-columns:
            repeat(3, 1fr);

          gap: 18px;
        }

        @media (max-width: 768px) {
          .fts-tujuan-grid {
            grid-template-columns: 1fr;
          }
        }

        .fts-tujuan-card {
          background: #fffaf5;

          padding: 36px 28px;

          border:
            1px solid
            rgba(234,88,12,0.16);

          border-radius: 16px;

          position: relative;

          overflow: hidden;

          opacity: 0;

          transform:
            translateY(24px);

          transition:
            box-shadow 0.25s,
            border-color 0.25s,
            transform 0.6s
              cubic-bezier(.2,.7,.2,1),
            opacity 0.6s;
        }

        .fts-tujuan-card.in-view {
          opacity: 1;

          transform:
            translateY(0);
        }

        .fts-tujuan-card::before {
          content: '';

          position: absolute;

          top: 0;
          left: 0;
          right: 0;

          height: 3px;

          background:
            linear-gradient(
              90deg,
              #ea580c,
              #fb923c
            );

          transform:
            scaleX(0);

          transform-origin: left;

          transition:
            transform 0.35s ease;
        }

        .fts-tujuan-card:hover {
          border-color:
            rgba(234,88,12,0.4);

          box-shadow:
            0 18px 38px
            rgba(124,45,18,0.12),

            0 0 0 1px
            rgba(249,115,22,0.08);

          transform:
            translateY(-6px);
        }

        .fts-tujuan-card:hover::before {
          transform:
            scaleX(1);
        }

        .fts-tujuan-icon {
          display: inline-block;

          font-size: 35px;

          margin-bottom: 20px;

          transition:
            transform 0.3s
            cubic-bezier(.36,.02,.66,1.4);
        }

        .fts-tujuan-card:hover
        .fts-tujuan-icon {
          animation:
            ftsIconBounce
            0.6s
            cubic-bezier(.36,.02,.4,1.4);
        }

        @keyframes ftsIconBounce {
          0% {
            transform:
              translateY(0)
              scale(1);
          }

          35% {
            transform:
              translateY(-10px)
              scale(1.08);
          }

          60% {
            transform:
              translateY(0)
              scale(0.96);
          }

          100% {
            transform:
              translateY(0)
              scale(1);
          }
        }

        .fts-tujuan-title {
          font-family:
            'Barlow Condensed',
            sans-serif;

          font-size: 22px;

          font-weight: 800;

          color: #7c2d12;

          text-transform: uppercase;

          letter-spacing: 0.7px;

          margin-bottom: 12px;
        }

        .fts-tujuan-desc {
          font-size: 14px;

          color: #9a6b4f;

          line-height: 1.75;
        }


        /* ═════════════════════════════════════
           DIVIDER
        ═════════════════════════════════════ */

        .fts-divider {
          max-width: 1100px;

          margin: 0 auto;

          padding:
            0
            clamp(24px, 6vw, 80px);
        }

        .fts-divider-line {
          width: 100%;

          height: 1px;

          position: relative;

          background:
            linear-gradient(
              90deg,
              transparent,
              rgba(234,88,12,0.45),
              transparent
            );
        }

        .fts-divider-ball {
          position: absolute;

          left: 50%;
          top: 50%;

          transform:
            translate(-50%, -50%);

          padding: 8px;

          background: #fff7ed;

          font-size: 15px;
        }


        /* ═════════════════════════════════════
           FILTER
        ═════════════════════════════════════ */

        .fts-filters {
          display: flex;

          flex-wrap: wrap;

          gap: 10px;

          margin-bottom: 36px;
        }

        .fts-chip {
          font-family:
            'Barlow Condensed',
            sans-serif;

          font-size: 13px;

          font-weight: 700;

          letter-spacing: 1.5px;

          text-transform: uppercase;

          padding:
            10px 18px;

          border-radius: 999px;

          border:
            1px solid
            rgba(234,88,12,0.25);

          background: #fffaf5;

          color: #9a6b4f;

          cursor: pointer;

          transition:
            all 0.2s ease;
        }

        .fts-chip:hover {
          border-color: #f97316;

          color: #c2410c;

          transform:
            translateY(-2px);
        }

        .fts-chip.active {
          background:
            linear-gradient(
              90deg,
              #ea580c,
              #fb923c
            );

          border-color: transparent;

          color: #fff;

          box-shadow:
            0 7px 18px
            rgba(234,88,12,0.22);
        }


        /* ═════════════════════════════════════
           KEGIATAN TIMELINE
        ═════════════════════════════════════ */

        .fts-kegiatan-list {
          position: relative;

          border-left:
            1px solid
            rgba(234,88,12,0.35);

          padding-left:
            clamp(24px, 4vw, 40px);
        }

        .fts-kegiatan-item {
          position: relative;

          padding:
            26px 0;

          display: flex;

          align-items: flex-start;

          gap: 20px;

          border-bottom:
            1px solid
            rgba(234,88,12,0.15);

          opacity: 0;

          transform:
            translateX(-16px);

          animation:
            ftsItemIn
            0.5s
            ease
            forwards;

          transition:
            transform 0.2s ease,
            padding-left 0.2s ease;
        }

        .fts-kegiatan-item:last-child {
          border-bottom: none;
        }

        .fts-kegiatan-item:hover {
          transform:
            translateX(6px);
        }

        @keyframes ftsItemIn {
          to {
            opacity: 1;

            transform:
              translateX(0);
          }
        }


        /* TIMELINE DOT */

        .fts-kegiatan-item::before {
          content: '';

          position: absolute;

          left:
            calc(
              -1 *
              clamp(24px, 4vw, 40px)
              - 5px
            );

          top: 34px;

          width: 10px;
          height: 10px;

          border-radius: 50%;

          background: #fff7ed;

          border:
            2px solid
            #f97316;

          transition:
            background 0.2s,
            border-color 0.2s,
            box-shadow 0.2s;
        }

        .fts-kegiatan-item:hover::before {
          background: #f97316;

          border-color: #f97316;

          box-shadow:
            0 0 14px
            rgba(249,115,22,0.55);
        }


        /* NUMBER */

        .fts-kegiatan-no {
          font-family:
            'Barlow Condensed',
            sans-serif;

          font-size: 32px;

          font-weight: 800;

          color: #fdba74;

          line-height: 1;

          flex-shrink: 0;

          width: 52px;

          transition:
            color 0.2s,
            transform 0.2s;
        }

        .fts-kegiatan-item:hover
        .fts-kegiatan-no {
          color: #ea580c;

          transform:
            translateX(3px);
        }


        /* TITLE */

        .fts-kegiatan-nama {
          font-family:
            'Barlow Condensed',
            sans-serif;

          font-size: 20px;

          font-weight: 800;

          color: #7c2d12;

          text-transform: uppercase;

          letter-spacing: 0.7px;

          margin-bottom: 6px;

          transition:
            color 0.2s;
        }

        .fts-kegiatan-item:hover
        .fts-kegiatan-nama {
          color: #ea580c;
        }


        /* DETAIL */

        .fts-kegiatan-detail {
          font-size: 14px;

          color: #9a6b4f;

          line-height: 1.6;
        }


        /* ═════════════════════════════════════
           CTA
        ═════════════════════════════════════ */

        .fts-join {
          text-align: center;

          padding:
            clamp(70px, 9vw, 115px)
            clamp(24px, 6vw, 80px);

          background:
            linear-gradient(
              180deg,
              #fff7ed 0%,
              #ffedd5 100%
            );

          border-top:
            1px solid
            rgba(234,88,12,0.12);
        }

        .fts-join-heading {
          font-family:
            'Oswald',
            sans-serif;

          font-size:
            clamp(34px, 5vw, 52px);

          font-weight: 700;

          color: #7c2d12;

          text-transform: uppercase;

          line-height: 1.1;

          margin-bottom: 18px;
        }

        .fts-join-heading span {
          color: #ea580c;

          text-shadow:
            0 0 20px
            rgba(249,115,22,0.3);
        }

        .fts-join-copy {
          max-width: 500px;

          margin:
            0 auto 32px;

          font-size: 15px;

          color: #9a6b4f;

          line-height: 1.75;
        }


        /* ═════════ KICK BUTTON ═════════ */

        .fts-kick-btn {
          display: inline-flex;

          flex-direction: column;

          align-items: center;

          gap: 10px;

          cursor: pointer;

          background: none;

          border: none;

          padding: 0;
        }

        .fts-kick-ball {
          display: flex;

          align-items: center;
          justify-content: center;

          width: 82px;
          height: 82px;

          font-size: 58px;

          transition:
            transform 0.15s ease,
            filter 0.15s ease;
        }

        .fts-kick-btn:hover
        .fts-kick-ball {
          transform:
            scale(1.1);

          filter:
            drop-shadow(
              0 0 14px
              rgba(249,115,22,0.7)
            );
        }

        .fts-kick-btn.hit
        .fts-kick-ball {
          animation:
            ftsKick
            0.7s
            ease;
        }

        @keyframes ftsKick {
          0% {
            transform:
              scale(1)
              translate(0,0)
              rotate(0);
          }

          25% {
            transform:
              scale(0.82)
              translate(0,5px)
              rotate(-15deg);
          }

          60% {
            transform:
              scale(1.25)
              translate(55px,-20px)
              rotate(100deg);
          }

          100% {
            transform:
              scale(1)
              translate(0,0)
              rotate(360deg);
          }
        }


        /* ═════════ KICK HINT ═════════ */

        .fts-kick-hint {
          font-family:
            'Barlow Condensed',
            sans-serif;

          font-size: 12px;

          font-weight: 700;

          letter-spacing: 2px;

          text-transform: uppercase;

          color: #b45309;
        }


        /* ═════════ RIPPLE ═════════ */

        .fts-ripple {
          position: relative;
        }

        .fts-ripple::after {
          content: '';

          position: absolute;

          inset: -14px;

          border-radius: 50%;

          border:
            2px solid
            #fb923c;

          opacity: 0;
        }

        .fts-kick-btn.hit
        .fts-ripple::after {
          animation:
            ftsRipple
            0.7s
            ease-out;
        }

        @keyframes ftsRipple {
          0% {
            opacity: 0.8;

            transform:
              scale(0.6);
          }

          100% {
            opacity: 0;

            transform:
              scale(1.9);
          }
        }


        /* ═════════════════════════════════════
           MOBILE
        ═════════════════════════════════════ */

        @media (max-width: 640px) {

          .fts-title {
            letter-spacing: -1px;
          }

          .fts-hero-img {
            height: 600px;
          }

          .fts-scroll-cue {
            display: none;
          }

          .fts-kegiatan-item {
            gap: 13px;
          }

          .fts-kegiatan-no {
            width: 38px;

            font-size: 27px;
          }

          .fts-kegiatan-nama {
            font-size: 18px;
          }

          .fts-kegiatan-detail {
            font-size: 13px;
          }

          .fts-section-heading {
            margin-bottom: 32px;
          }

          .fts-filters {
            gap: 8px;
          }

          .fts-chip {
            padding:
              9px 14px;

            font-size: 12px;
          }
        }
      `}</style>

      <div className="fts-root">

        <Navbar />

        <main>

          {/* ═════════════════════════════════════
              HERO
          ═════════════════════════════════════ */}

          <section className="fts-hero">

            <div className="fts-hero-img">

              <Image
                src="/images/eskul/futsal.jpg"
                alt="Futsal SMK Citra Negara"
                fill
                priority
              />

              <div className="fts-hero-overlay" />

              <div className="fts-field-lines" />

              <div className="fts-scanline" />

            </div>


            <div className="fts-scroll-cue">

              <span>SCROLL</span>

              <div className="fts-scroll-line" />

            </div>


            <div className="fts-hero-content">

              <div className="fts-hero-text">

                <div className="fts-eyebrow">
                  Ekstrakurikuler SMK Citra Negara
                </div>

                <h1 className="fts-title">
                  FUT<span>SAL</span>
                </h1>

                <p className="fts-subtitle">
                  Futsal adalah salah satu ekstrakurikuler yang sangat
                  diminati di kalangan pelajar. Tidak hanya melatih fisik,
                  futsal juga membangun strategi, kerjasama tim, dan
                  mentalitas juara yang tangguh.
                </p>

              </div>


              <div className="fts-ball-zone">

                <SoccerBall size={90} />

              </div>

            </div>

          </section>


          {/* ═════════════════════════════════════
              TICKER
          ═════════════════════════════════════ */}

          <div className="fts-ticker">

            <div className="fts-ticker-track">

              {[0, 1].map((rep) => (

                <span key={rep}>

                  {STATS.map((s) => (

                    <span
                      className="fts-ticker-item"
                      key={s.label + rep}
                    >
                      ⚽ <b>{s.angka}</b> {s.label}
                    </span>

                  ))}

                </span>

              ))}

            </div>

          </div>


          {/* ═════════════════════════════════════
              STATS
          ═════════════════════════════════════ */}

          <div className="fts-scoreboard">

            <div
              className="fts-stats"
              ref={statsRef}
            >

              {STATS.map((s, i) => (

                <StatCounter
                  key={s.label}
                  angka={s.angka}
                  label={s.label}
                  inView={statsInView}
                  delay={i * 120}
                />

              ))}

            </div>

          </div>


          {/* ═════════════════════════════════════
              TUJUAN
          ═════════════════════════════════════ */}

          <section className="fts-section">

            <div className="fts-section-label">
              Mengapa Futsal
            </div>

            <h2 className="fts-section-heading">
              TUJUAN KAMI
            </h2>


            <div
              className="fts-tujuan-grid"
              ref={tujuanRef}
            >

              {TUJUAN.map((t, i) => (

                <div
                  key={t.judul}

                  className={
                    `fts-tujuan-card${
                      tujuanInView
                        ? ' in-view'
                        : ''
                    }`
                  }

                  style={{
                    transitionDelay:
                      tujuanInView
                        ? `${i * 120}ms`
                        : '0ms',
                  }}
                >

                  <span className="fts-tujuan-icon">
                    {t.icon}
                  </span>

                  <div className="fts-tujuan-title">
                    {t.judul}
                  </div>

                  <p className="fts-tujuan-desc">
                    {t.deskripsi}
                  </p>

                </div>

              ))}

            </div>

          </section>


          {/* ═════════════════════════════════════
              DIVIDER
          ═════════════════════════════════════ */}

          <div className="fts-divider">

            <div className="fts-divider-line">

              <span className="fts-divider-ball">
                ⚽
              </span>

            </div>

          </div>


          {/* ═════════════════════════════════════
              KEGIATAN
          ═════════════════════════════════════ */}

          <section
            className="fts-section"
            style={{
              paddingTop:
                'clamp(40px, 5vw, 64px)',
            }}
          >

            <div className="fts-section-label">
              Program Latihan
            </div>

            <h2 className="fts-section-heading">
              KEGIATAN RUTIN
            </h2>


            {/* FILTER */}

            <div
              className="fts-filters"
              role="group"
              aria-label="Filter kegiatan"
            >

              {FILTERS.map((f) => (

                <button
                  key={f.key}

                  type="button"

                  className={
                    `fts-chip${
                      filter === f.key
                        ? ' active'
                        : ''
                    }`
                  }

                  onClick={() =>
                    setFilter(f.key)
                  }
                >
                  {f.label}
                </button>

              ))}

            </div>


            {/* TIMELINE */}

            <div className="fts-kegiatan-list">

              {filtered.map((k, i) => (

                <div
                  key={k.no}

                  className="fts-kegiatan-item"

                  style={{
                    animationDelay:
                      `${i * 0.07}s`,
                  }}
                >

                  <div className="fts-kegiatan-no">
                    {k.no}
                  </div>

                  <div>

                    <div className="fts-kegiatan-nama">
                      {k.nama}
                    </div>

                    <div className="fts-kegiatan-detail">
                      {k.detail}
                    </div>

                  </div>

                </div>

              ))}

            </div>

          </section>


          {/* ═════════════════════════════════════
              CTA
          ═════════════════════════════════════ */}

          <section className="fts-join">

            <div
              className="fts-section-label"
              style={{
                display: 'inline-block',
              }}
            >
              Gabung Yuk
            </div>


            <h2 className="fts-join-heading">
              SIAP MAIN <span>BARANG?</span>
            </h2>


            <p className="fts-join-copy">
              Futsal bukan cuma tentang mencetak gol.
              Ini tentang latihan, kerja sama, sportivitas,
              dan berkembang bersama sebagai sebuah tim.
            </p>


            <button
              type="button"

              className={
                `fts-kick-btn${
                  kicked
                    ? ' hit'
                    : ''
                }`
              }

              onClick={handleKick}

              aria-label="Tendang bola"
            >

              <span className="fts-ripple">

                <span className="fts-kick-ball">
                  ⚽
                </span>

              </span>

              <span className="fts-kick-hint">
                coba tendang bolanya
              </span>

            </button>

          </section>

        </main>


        <EskulMusic src="/audio/futsal.mp3" />
        <Footer />

      </div>
    </>
  );
}