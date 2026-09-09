'use client';

import { useEffect, useRef, useState } from 'react';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import EskulMusic from '@/components/EskulMusic';
import Image from 'next/image';
import {
  BookOpen,
  HeartHandshake,
  UsersRound,
  Sparkles,
  MoonStar,
  Star,
  HandHeart,
  ScrollText,
} from 'lucide-react';

/* ══════════════════════════════════════════
   DATA
══════════════════════════════════════════ */

const STATS = [
  { angka: '2010', label: 'Tahun Berdiri' },
  { angka: '40+', label: 'Anggota Aktif' },
  { angka: '15', label: 'Kegiatan' },
  { angka: '100', label: 'Dedikasi', suffix: '%' },
];

const TUJUAN = [
  {
    icon: BookOpen,
    judul: 'Pendalaman Islam',
    deskripsi:
      'Meningkatkan pemahaman siswa terhadap ajaran Islam melalui kajian, pembelajaran Al-Qur’an, dan kegiatan keislaman yang positif.',
  },
  {
    icon: HeartHandshake,
    judul: 'Akhlak Mulia',
    deskripsi:
      'Membentuk pribadi yang santun, bertanggung jawab, peduli, dan mampu menerapkan nilai-nilai Islam dalam kehidupan sehari-hari.',
  },
  {
    icon: UsersRound,
    judul: 'Ukhuwah Islamiyah',
    deskripsi:
      'Membangun persaudaraan antar siswa melalui kebersamaan, kerja sama, dan kegiatan positif dalam lingkungan sekolah.',
  },
];

const KEGIATAN = [
  {
    no: '01',
    icon: BookOpen,
    nama: 'Kajian Keislaman',
    detail: 'Membahas ilmu agama dan nilai-nilai kehidupan dalam Islam.',
  },
  {
    no: '02',
    icon: ScrollText,
    nama: 'Tadarus Al-Qur’an',
    detail: 'Membiasakan membaca dan memahami Al-Qur’an bersama.',
  },
  {
    no: '03',
    icon: MoonStar,
    nama: 'Kegiatan Ramadhan',
    detail: 'Mengisi bulan Ramadhan dengan kegiatan keagamaan yang bermanfaat.',
  },
  {
    no: '04',
    icon: HandHeart,
    nama: 'Kegiatan Sosial',
    detail: 'Menumbuhkan kepedulian melalui aksi sosial dan berbagi.',
  },
  {
    no: '05',
    icon: Sparkles,
    nama: 'Peringatan Hari Besar Islam',
    detail: 'Mengadakan kegiatan untuk memperingati momen penting dalam Islam.',
  },
  {
    no: '06',
    icon: UsersRound,
    nama: 'Kebersamaan Anggota',
    detail: 'Membangun solidaritas dan ukhuwah antar anggota IRMA.',
  },
];

/* ══════════════════════════════════════════
   HOOK INTERSECTION
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
   REVEAL
══════════════════════════════════════════ */

function Reveal({
  children,
  delay = 0,
  className = '',
  as: Tag = 'div',
}: {
  children: React.ReactNode;
  delay?: number;
  className?: string;
  as?: keyof JSX.IntrinsicElements;
}) {
  const [ref, inView] = useInView<HTMLDivElement>();
  const Component = Tag as any;

  return (
    <Component
      ref={ref}
      className={`irma-reveal ${inView ? 'irma-reveal-in' : ''} ${className}`}
      style={{ transitionDelay: `${delay}ms` }}
    >
      {children}
    </Component>
  );
}

/* ══════════════════════════════════════════
   COUNT UP
══════════════════════════════════════════ */

function CountUp({
  value,
  suffix = '',
}: {
  value: string;
  suffix?: string;
}) {
  const target = parseInt(value.replace(/\D/g, ''), 10) || 0;

  const [ref, inView] = useInView<HTMLDivElement>(0.4);
  const [display, setDisplay] = useState(0);

  useEffect(() => {
    if (!inView) return;

    let raf = 0;

    const duration = 1200;
    const start = performance.now();

    const step = (now: number) => {
      const progress = Math.min((now - start) / duration, 1);

      const eased = 1 - Math.pow(1 - progress, 3);

      setDisplay(Math.round(target * eased));

      if (progress < 1) {
        raf = requestAnimationFrame(step);
      }
    };

    raf = requestAnimationFrame(step);

    return () => cancelAnimationFrame(raf);
  }, [inView, target]);

  return (
    <div ref={ref} className="irma-stat-number">
      {display}
      {suffix}
    </div>
  );
}

/* ══════════════════════════════════════════
   PAGE
══════════════════════════════════════════ */

export default function IrmaPage() {
  const title = 'IRMA';

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Amiri:wght@400;700&family=Barlow:wght@400;500;600;700;800&family=Barlow+Condensed:wght@600;700;800&display=swap');

        :root {
          --irma-green: #2F7D5B;
          --irma-green-dark: #1F6044;
          --irma-green-soft: #EAF5EE;
          --irma-sage: #DCEBDD;
          --irma-gold: #C59A45;
          --irma-gold-light: #E8CF94;
          --irma-cream: #FBFAF5;
          --irma-white: #FFFFFF;
          --irma-text: #18352A;
          --irma-muted: #708078;
          --irma-border: #DCE7DF;
        }

        * {
          box-sizing: border-box;
        }

        .irma-root {
          min-height: 100vh;
          background: var(--irma-cream);
          color: var(--irma-text);
          font-family: 'Barlow', sans-serif;
          overflow: hidden;
        }

        /* ══════════════════════════════════════
           HERO
        ══════════════════════════════════════ */

        .irma-hero {
          position: relative;
          min-height: min(690px, 82vh);
          overflow: hidden;
          background:
            radial-gradient(
              circle at 80% 20%,
              rgba(197,154,69,0.14),
              transparent 27%
            ),
            linear-gradient(
              135deg,
              #F8FBF7 0%,
              #EFF7F0 48%,
              #E6F1E8 100%
            );
        }

        .irma-hero-image {
          position: absolute;
          right: 0;
          top: 0;
          width: 54%;
          height: 100%;
          overflow: hidden;
          opacity: 0;
          animation: irmaImageIn 1s ease forwards;
        }

        .irma-hero-image::before {
          content: '';
          position: absolute;
          inset: 0;
          z-index: 2;
          background:
            linear-gradient(
              90deg,
              #F8FBF7 0%,
              rgba(248,251,247,0.75) 10%,
              rgba(248,251,247,0.05) 45%,
              rgba(248,251,247,0) 100%
            ),
            linear-gradient(
              180deg,
              rgba(255,255,255,0.1),
              rgba(31,96,68,0.12)
            );
        }

        .irma-hero-image img {
          object-fit: cover;
          object-position: center;
          filter: saturate(0.9) brightness(1.02);
        }

        @keyframes irmaImageIn {
          from {
            opacity: 0;
            transform: scale(1.08);
          }

          to {
            opacity: 1;
            transform: scale(1);
          }
        }

        .irma-hero-content {
          position: relative;
          z-index: 5;
          max-width: 1200px;
          min-height: min(690px, 82vh);
          margin: auto;
          padding:
            clamp(90px, 11vw, 130px)
            clamp(24px, 7vw, 90px)
            70px;
          display: flex;
          flex-direction: column;
          justify-content: center;
        }

        .irma-kicker {
          display: inline-flex;
          align-items: center;
          gap: 9px;
          width: fit-content;
          color: var(--irma-green);
          font-family: 'Barlow Condensed', sans-serif;
          font-size: 13px;
          font-weight: 700;
          letter-spacing: 2.5px;
          text-transform: uppercase;
          margin-bottom: 18px;
          opacity: 0;
          animation: irmaUp 0.7s 0.15s ease forwards;
        }

        .irma-kicker-line {
          width: 28px;
          height: 2px;
          border-radius: 10px;
          background: var(--irma-gold);
        }

        .irma-title {
          position: relative;
          margin: 0 0 15px;
          font-family: 'Barlow Condensed', sans-serif;
          font-size: clamp(90px, 14vw, 180px);
          font-weight: 800;
          line-height: 0.78;
          letter-spacing: -3px;
          color: var(--irma-green-dark);
        }

        .irma-title-letter {
          display: inline-block;
          opacity: 0;
          transform: translateY(35px);
          animation: irmaLetter 0.65s cubic-bezier(.2,.8,.2,1) forwards;
        }

        .irma-title-letter:nth-child(2) {
          color: var(--irma-gold);
        }

        @keyframes irmaLetter {
          0% {
            opacity: 0;
            transform: translateY(35px) rotate(3deg);
          }

          70% {
            opacity: 1;
            transform: translateY(-4px) rotate(-1deg);
          }

          100% {
            opacity: 1;
            transform: translateY(0) rotate(0);
          }
        }

        .irma-arabic {
          font-family: 'Amiri', serif;
          color: var(--irma-green);
          font-size: clamp(24px, 3vw, 36px);
          margin-bottom: 17px;
          opacity: 0;
          animation: irmaUp 0.7s 0.55s ease forwards;
        }

        .irma-description {
          max-width: 570px;
          color: #607168;
          font-size: clamp(15px, 1.5vw, 18px);
          line-height: 1.75;
          margin: 0;
          opacity: 0;
          animation: irmaUp 0.7s 0.7s ease forwards;
        }

        @keyframes irmaUp {
          from {
            opacity: 0;
            transform: translateY(22px);
          }

          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        /* ══════════════════════════════════════
           ORNAMEN
        ══════════════════════════════════════ */

        .irma-orbit {
          position: absolute;
          z-index: 4;
          width: 230px;
          height: 230px;
          right: 12%;
          top: 12%;
          border: 1px solid rgba(197,154,69,0.35);
          border-radius: 50%;
          animation: irmaRotate 22s linear infinite;
        }

        .irma-orbit::before,
        .irma-orbit::after {
          content: '✦';
          position: absolute;
          color: var(--irma-gold);
          font-size: 18px;
        }

        .irma-orbit::before {
          top: -10px;
          left: 50%;
        }

        .irma-orbit::after {
          right: -8px;
          top: 50%;
        }

        @keyframes irmaRotate {
          to {
            transform: rotate(360deg);
          }
        }

        .irma-moon {
          position: absolute;
          z-index: 5;
          right: 20%;
          top: 19%;
          width: 55px;
          height: 55px;
          color: var(--irma-gold);
          animation: irmaFloat 4s ease-in-out infinite;
        }

        @keyframes irmaFloat {
          0%, 100% {
            transform: translateY(0);
          }

          50% {
            transform: translateY(-12px);
          }
        }

        .irma-star {
          position: absolute;
          z-index: 5;
          color: var(--irma-gold-light);
          animation: irmaTwinkle 2.5s ease-in-out infinite;
        }

        .irma-star.one {
          right: 35%;
          top: 25%;
        }

        .irma-star.two {
          right: 8%;
          top: 48%;
          animation-delay: 0.7s;
        }

        .irma-star.three {
          right: 25%;
          bottom: 18%;
          animation-delay: 1.2s;
        }

        @keyframes irmaTwinkle {
          0%, 100% {
            opacity: 0.35;
            transform: scale(0.8);
          }

          50% {
            opacity: 1;
            transform: scale(1.15);
          }
        }

        /* ══════════════════════════════════════
           GOLD DECORATION
        ══════════════════════════════════════ */

        .irma-pattern {
          position: absolute;
          z-index: 3;
          right: -60px;
          bottom: -90px;
          width: 320px;
          height: 320px;
          border: 1px solid rgba(47,125,91,0.12);
          transform: rotate(45deg);
          background:
            repeating-linear-gradient(
              45deg,
              transparent 0 18px,
              rgba(47,125,91,0.06) 19px 20px
            );
        }

        .irma-gold-line {
          position: absolute;
          z-index: 6;
          left: 0;
          right: 0;
          bottom: 0;
          height: 5px;
          background:
            linear-gradient(
              90deg,
              var(--irma-green) 0%,
              var(--irma-green) 42%,
              var(--irma-gold) 42%,
              var(--irma-gold) 58%,
              var(--irma-green) 58%,
              var(--irma-green) 100%
            );
        }

        /* ══════════════════════════════════════
           STATS
        ══════════════════════════════════════ */

        .irma-stats {
          position: relative;
          z-index: 10;
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          background: var(--irma-white);
          border-bottom: 1px solid var(--irma-border);
        }

        .irma-stat {
          position: relative;
          padding: 30px 20px;
          text-align: center;
          border-right: 1px solid var(--irma-border);
          transition:
            background 0.25s ease,
            transform 0.25s ease;
        }

        .irma-stat:last-child {
          border-right: none;
        }

        .irma-stat:hover {
          background: var(--irma-green-soft);
          transform: translateY(-3px);
        }

        .irma-stat-number {
          font-family: 'Barlow Condensed', sans-serif;
          font-size: 48px;
          font-weight: 800;
          color: var(--irma-green);
          line-height: 1;
          margin-bottom: 7px;
        }

        .irma-stat-label {
          color: var(--irma-muted);
          font-size: 11px;
          font-weight: 700;
          letter-spacing: 2px;
          text-transform: uppercase;
        }

        /* ══════════════════════════════════════
           REVEAL
        ══════════════════════════════════════ */

        .irma-reveal {
          opacity: 0;
          transform: translateY(28px);
          transition:
            opacity 0.7s ease,
            transform 0.7s cubic-bezier(.2,.8,.2,1);
        }

        .irma-reveal-in {
          opacity: 1;
          transform: translateY(0);
        }

        /* ══════════════════════════════════════
           SECTION
        ══════════════════════════════════════ */

        .irma-section {
          max-width: 1120px;
          margin: auto;
          padding:
            clamp(65px, 8vw, 100px)
            clamp(24px, 6vw, 70px);
        }

        .irma-section-label {
          display: flex;
          align-items: center;
          gap: 9px;
          color: var(--irma-green);
          font-family: 'Barlow Condensed', sans-serif;
          font-size: 12px;
          font-weight: 800;
          letter-spacing: 3px;
          text-transform: uppercase;
          margin-bottom: 10px;
        }

        .irma-section-label::before {
          content: '';
          width: 24px;
          height: 2px;
          background: var(--irma-gold);
        }

        .irma-section-heading {
          margin: 0 0 45px;
          font-family: 'Barlow Condensed', sans-serif;
          font-size: clamp(46px, 6vw, 72px);
          font-weight: 800;
          letter-spacing: -1px;
          line-height: 0.95;
          color: var(--irma-text);
        }

        .irma-section-heading span {
          color: var(--irma-green);
        }

        /* ══════════════════════════════════════
           TUJUAN
        ══════════════════════════════════════ */

        .irma-tujuan-section {
          background:
            radial-gradient(
              circle at 10% 20%,
              rgba(47,125,91,0.07),
              transparent 25%
            ),
            var(--irma-cream);
        }

        .irma-tujuan-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 22px;
        }

        .irma-tujuan-card {
          position: relative;
          overflow: hidden;
          padding: 35px 29px 32px;
          background: rgba(255,255,255,0.9);
          border: 1px solid var(--irma-border);
          border-radius: 22px;
          box-shadow: 0 8px 30px rgba(31,96,68,0.06);
          transition:
            transform 0.35s cubic-bezier(.2,.8,.2,1),
            box-shadow 0.35s ease,
            border-color 0.35s ease;
        }

        .irma-tujuan-card::before {
          content: '';
          position: absolute;
          width: 120px;
          height: 120px;
          right: -50px;
          top: -50px;
          border-radius: 50%;
          background: var(--irma-green-soft);
          transition: transform 0.35s ease;
        }

        .irma-tujuan-card::after {
          content: '';
          position: absolute;
          left: 0;
          right: 0;
          bottom: 0;
          height: 4px;
          background: linear-gradient(
            90deg,
            var(--irma-green),
            var(--irma-gold)
          );
          transform: scaleX(0);
          transform-origin: left;
          transition: transform 0.35s ease;
        }

        .irma-tujuan-card:hover {
          transform: translateY(-9px);
          border-color: rgba(47,125,91,0.3);
          box-shadow: 0 18px 38px rgba(31,96,68,0.13);
        }

        .irma-tujuan-card:hover::before {
          transform: scale(1.8);
        }

        .irma-tujuan-card:hover::after {
          transform: scaleX(1);
        }

        .irma-icon {
          position: relative;
          z-index: 2;
          display: flex;
          align-items: center;
          justify-content: center;
          width: 58px;
          height: 58px;
          margin-bottom: 22px;
          border-radius: 17px;
          background: var(--irma-green-soft);
          color: var(--irma-green);
          transition:
            transform 0.3s ease,
            background 0.3s ease;
        }

        .irma-tujuan-card:hover .irma-icon {
          transform: rotate(-5deg) scale(1.08);
          background: var(--irma-green);
          color: white;
        }

        .irma-card-title {
          position: relative;
          z-index: 2;
          margin-bottom: 12px;
          color: var(--irma-text);
          font-family: 'Barlow Condensed', sans-serif;
          font-size: 24px;
          font-weight: 800;
          letter-spacing: 0.5px;
          text-transform: uppercase;
        }

        .irma-card-desc {
          position: relative;
          z-index: 2;
          margin: 0;
          color: var(--irma-muted);
          font-size: 14px;
          line-height: 1.8;
        }

        /* ══════════════════════════════════════
           DIVIDER
        ══════════════════════════════════════ */

        .irma-divider {
          display: flex;
          align-items: center;
          gap: 16px;
          max-width: 1050px;
          margin: auto;
          padding: 0 30px;
        }

        .irma-divider::before,
        .irma-divider::after {
          content: '';
          flex: 1;
          height: 1px;
          background: var(--irma-border);
        }

        .irma-divider-icon {
          color: var(--irma-gold);
          animation: irmaSpin 5s linear infinite;
        }

        @keyframes irmaSpin {
          to {
            transform: rotate(360deg);
          }
        }

        /* ══════════════════════════════════════
           KEGIATAN
        ══════════════════════════════════════ */

        .irma-kegiatan-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 15px;
        }

        .irma-kegiatan {
          position: relative;
          display: flex;
          align-items: center;
          gap: 20px;
          padding: 23px 24px;
          background: white;
          border: 1px solid var(--irma-border);
          border-radius: 16px;
          overflow: hidden;
          cursor: default;
          transition:
            transform 0.3s ease,
            box-shadow 0.3s ease,
            border-color 0.3s ease;
        }

        .irma-kegiatan::before {
          content: '';
          position: absolute;
          left: 0;
          top: 0;
          bottom: 0;
          width: 4px;
          background: var(--irma-green);
          transform: scaleY(0);
          transform-origin: bottom;
          transition: transform 0.3s ease;
        }

        .irma-kegiatan:hover {
          transform: translateX(6px);
          border-color: rgba(47,125,91,0.25);
          box-shadow: 0 10px 28px rgba(31,96,68,0.09);
        }

        .irma-kegiatan:hover::before {
          transform: scaleY(1);
        }

        .irma-kegiatan-number {
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
          width: 48px;
          height: 48px;
          border-radius: 14px;
          background: var(--irma-green-soft);
          color: var(--irma-green);
          font-family: 'Barlow Condensed', sans-serif;
          font-size: 21px;
          font-weight: 800;
          transition:
            background 0.25s ease,
            color 0.25s ease,
            transform 0.25s ease;
        }

        .irma-kegiatan:hover .irma-kegiatan-number {
          background: var(--irma-green);
          color: white;
          transform: rotate(-4deg);
        }

        .irma-kegiatan-icon {
          color: var(--irma-gold);
          margin-bottom: 4px;
        }

        .irma-kegiatan-name {
          color: var(--irma-text);
          font-family: 'Barlow Condensed', sans-serif;
          font-size: 19px;
          font-weight: 800;
          text-transform: uppercase;
          letter-spacing: 0.5px;
          margin-bottom: 3px;
        }

        .irma-kegiatan-detail {
          color: var(--irma-muted);
          font-size: 13px;
          line-height: 1.5;
        }

        /* ══════════════════════════════════════
           QUOTE / CTA
        ══════════════════════════════════════ */

        .irma-quote {
          position: relative;
          max-width: 1120px;
          margin: 0 auto;
          padding:
            30px
            clamp(24px, 6vw, 70px)
            90px;
        }

        .irma-quote-box {
          position: relative;
          overflow: hidden;
          padding: 55px 35px;
          text-align: center;
          border-radius: 25px;
          background:
            radial-gradient(
              circle at 15% 20%,
              rgba(255,255,255,0.28),
              transparent 25%
            ),
            linear-gradient(
              135deg,
              #EAF5EE,
              #F7F4E9
            );
          border: 1px solid var(--irma-border);
        }

        .irma-quote-box::before {
          content: '✦';
          position: absolute;
          top: 18px;
          left: 25px;
          color: var(--irma-gold);
          font-size: 22px;
        }

        .irma-quote-box::after {
          content: '✦';
          position: absolute;
          bottom: 18px;
          right: 25px;
          color: var(--irma-gold);
          font-size: 22px;
        }

        .irma-quote-icon {
          color: var(--irma-green);
          margin-bottom: 15px;
        }

        .irma-quote-text {
          max-width: 700px;
          margin: auto;
          color: var(--irma-text);
          font-family: 'Amiri', serif;
          font-size: clamp(24px, 3vw, 34px);
          line-height: 1.4;
        }

        .irma-quote-small {
          margin-top: 12px;
          color: var(--irma-muted);
          font-size: 13px;
          letter-spacing: 1px;
        }

        /* ══════════════════════════════════════
           MOBILE
        ══════════════════════════════════════ */

        @media (max-width: 900px) {
          .irma-hero-image {
            width: 100%;
            opacity: 0.28;
          }

          .irma-hero-image::before {
            background:
              linear-gradient(
                90deg,
                #F8FBF7 0%,
                rgba(248,251,247,0.88) 40%,
                rgba(248,251,247,0.35) 100%
              );
          }

          .irma-orbit {
            right: 5%;
            top: 12%;
            width: 170px;
            height: 170px;
          }

          .irma-moon {
            right: 12%;
            top: 17%;
          }

          .irma-title {
            font-size: clamp(82px, 22vw, 145px);
          }

          .irma-tujuan-grid {
            grid-template-columns: 1fr;
          }

          .irma-tujuan-card {
            padding: 30px 25px;
          }
        }

        @media (max-width: 640px) {
          .irma-hero {
            min-height: 680px;
          }

          .irma-hero-content {
            min-height: 680px;
            padding-top: 120px;
            justify-content: center;
          }

          .irma-hero-image {
            height: 100%;
          }

          .irma-orbit {
            right: -35px;
            top: 12%;
          }

          .irma-moon {
            right: 10%;
            top: 16%;
            width: 42px;
            height: 42px;
          }

          .irma-description {
            max-width: 100%;
          }

          .irma-stats {
            grid-template-columns: repeat(2, 1fr);
          }

          .irma-stat {
            padding: 24px 12px;
          }

          .irma-stat:nth-child(2) {
            border-right: none;
          }

          .irma-stat:nth-child(-n+2) {
            border-bottom: 1px solid var(--irma-border);
          }

          .irma-stat-number {
            font-size: 40px;
          }

          .irma-section {
            padding-left: 20px;
            padding-right: 20px;
          }

          .irma-kegiatan-grid {
            grid-template-columns: 1fr;
          }

          .irma-kegiatan {
            padding: 20px 18px;
          }

          .irma-kegiatan-number {
            width: 42px;
            height: 42px;
            font-size: 18px;
          }

          .irma-quote {
            padding-left: 20px;
            padding-right: 20px;
          }

          .irma-quote-box {
            padding: 45px 22px;
          }
        }

        @media (prefers-reduced-motion: reduce) {
          *,
          *::before,
          *::after {
            animation: none !important;
            transition: none !important;
          }

          .irma-reveal {
            opacity: 1 !important;
            transform: none !important;
          }
        }
      `}</style>

      <div className="irma-root">
        <Navbar />

        <main>

          {/* ══════════════════════════════════════
              HERO
          ══════════════════════════════════════ */}

          <section className="irma-hero">

            <div className="irma-hero-image">
              <Image
                src="/images/eskul/eskulirma.jpg"
                alt="IRMA SMK Citra Negara"
                fill
                priority
              />
            </div>

            <div className="irma-orbit" />

            <MoonStar className="irma-moon" />

            <Star className="irma-star one" size={17} />
            <Star className="irma-star two" size={12} />
            <Star className="irma-star three" size={15} />

            <div className="irma-pattern" />

            <div className="irma-hero-content">

              <div className="irma-kicker">
                <span className="irma-kicker-line" />
                Ekstrakurikuler SMK Citra Negara
                <Sparkles size={15} />
              </div>

              <h1 className="irma-title">
                {title.split('').map((char, index) => (
                  <span
                    key={index}
                    className="irma-title-letter"
                    style={{
                      animationDelay: `${index * 120}ms`,
                    }}
                  >
                    {char}
                  </span>
                ))}
              </h1>

              <div className="irma-arabic">
                Ikatan Remaja Masjid
              </div>

              <p className="irma-description">
                Wadah bagi siswa untuk belajar, berbagi, dan bertumbuh
                bersama dalam lingkungan yang islami. Membentuk generasi
                muda yang berilmu, berakhlak, dan aktif dalam kebaikan.
              </p>

            </div>

            <div className="irma-gold-line" />

          </section>


          {/* ══════════════════════════════════════
              STATS
          ══════════════════════════════════════ */}

          <div className="irma-stats">
            {STATS.map((stat, index) => (
              <Reveal
                key={stat.label}
                delay={index * 90}
                className="irma-stat"
              >
                <CountUp
                  value={stat.angka}
                  suffix={stat.suffix}
                />

                <div className="irma-stat-label">
                  {stat.label}
                </div>
              </Reveal>
            ))}
          </div>


          {/* ══════════════════════════════════════
              TUJUAN
          ══════════════════════════════════════ */}

          <section className="irma-tujuan-section">
            <div className="irma-section">

              <Reveal>
                <div className="irma-section-label">
                  Tentang IRMA
                </div>
              </Reveal>

              <Reveal delay={70}>
                <h2 className="irma-section-heading">
                  TUMBUH DALAM <span>KEBAIKAN</span>
                </h2>
              </Reveal>

              <div className="irma-tujuan-grid">

                {TUJUAN.map((item, index) => {
                  const Icon = item.icon;

                  return (
                    <Reveal
                      key={item.judul}
                      delay={index * 130}
                      className="irma-tujuan-card"
                    >

                      <div className="irma-icon">
                        <Icon size={27} />
                      </div>

                      <div className="irma-card-title">
                        {item.judul}
                      </div>

                      <p className="irma-card-desc">
                        {item.deskripsi}
                      </p>

                    </Reveal>
                  );
                })}

              </div>

            </div>
          </section>


          {/* ══════════════════════════════════════
              DIVIDER
          ══════════════════════════════════════ */}

          <div className="irma-divider">
            <span className="irma-divider-icon">
              ✦
            </span>
          </div>


          {/* ══════════════════════════════════════
              KEGIATAN
          ══════════════════════════════════════ */}

          <section className="irma-section">

            <Reveal>
              <div className="irma-section-label">
                Aktivitas IRMA
              </div>
            </Reveal>

            <Reveal delay={70}>
              <h2 className="irma-section-heading">
                KEGIATAN <span>KAMI</span>
              </h2>
            </Reveal>

            <div className="irma-kegiatan-grid">

              {KEGIATAN.map((item, index) => {
                const Icon = item.icon;

                return (
                  <Reveal
                    key={item.no}
                    delay={index * 90}
                    className="irma-kegiatan"
                  >

                    <div className="irma-kegiatan-number">
                      {item.no}
                    </div>

                    <div>
                      <Icon
                        size={17}
                        className="irma-kegiatan-icon"
                      />

                      <div className="irma-kegiatan-name">
                        {item.nama}
                      </div>

                      <div className="irma-kegiatan-detail">
                        {item.detail}
                      </div>
                    </div>

                  </Reveal>
                );
              })}

            </div>

          </section>


          {/* ══════════════════════════════════════
              QUOTE
          ══════════════════════════════════════ */}

          <Reveal>

            <section className="irma-quote">

              <div className="irma-quote-box">

                <MoonStar
                  className="irma-quote-icon"
                  size={30}
                />

                <div className="irma-quote-text">
                  Menjadi generasi muda yang berilmu,
                  berakhlak, dan bermanfaat bagi sesama.
                </div>

                <div className="irma-quote-small">
                  IRMA · SMK CITRA NEGARA
                </div>

              </div>

            </section>

          </Reveal>

        </main>

        <EskulMusic src="/audio/irma.mp3" />
        <Footer />
      </div>
    </>
  );
}