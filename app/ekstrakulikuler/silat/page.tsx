'use client';

import { useEffect, useRef, useState } from 'react';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import EskulMusic from '@/components/EskulMusic';
import Image from 'next/image';
import {
  Shield,
  Dumbbell,
  Swords,
  Trophy,
  Target,
  Wind,
  ChevronRight,
  ArrowUpRight,
} from 'lucide-react';

const STATS = [
  { angka: '2025', label: 'Tahun Berdiri' },
  { angka: '40+', label: 'Anggota Aktif' },
  { angka: '22', label: 'Prestasi Diraih' },
  { angka: '100%', label: 'Dedikasi' },
];

const TUJUAN = [
  {
    icon: Dumbbell,
    nomor: '01',
    judul: 'Bela Diri & Kebugaran',
    deskripsi:
      'Gerakan silat yang dinamis melatih kekuatan, kelenturan, kecepatan, dan daya tahan sekaligus membekali kemampuan bela diri.',
  },
  {
    icon: Shield,
    nomor: '02',
    judul: 'Pelestarian Budaya',
    deskripsi:
      'Menumbuhkan rasa cinta dan bangga terhadap seni bela diri asli Indonesia di tengah perkembangan zaman.',
  },
  {
    icon: Swords,
    nomor: '03',
    judul: 'Karakter Pendekar',
    deskripsi:
      'Menanamkan keberanian, kedisiplinan, kejujuran, kerendahan hati, dan pengendalian diri sebagai karakter siswa.',
  },
];

const KEGIATAN = [
  {
    no: '01',
    nama: 'Latihan Teknik Dasar',
    detail:
      'Sikap pasang, kuda-kuda, pukulan, tendangan, dan teknik dasar lainnya.',
  },
  {
    no: '02',
    nama: 'Kategori Tanding',
    detail:
      'Strategi serangan, pertahanan, dan penerapan aturan pertandingan.',
  },
  {
    no: '03',
    nama: 'Kategori Seni',
    detail:
      'Jurus Tunggal, Ganda, dan Regu dengan teknik serta ekspresi gerak.',
  },
  {
    no: '04',
    nama: 'Latihan Fisik & Napas',
    detail:
      'Meningkatkan stamina, keseimbangan, konsentrasi, dan olah napas.',
  },
  {
    no: '05',
    nama: 'Uji Tanding',
    detail:
      'Simulasi pertandingan internal dan latihan tanding secara terarah.',
  },
  {
    no: '06',
    nama: 'Kejuaraan',
    detail:
      'Mempersiapkan anggota untuk mengikuti berbagai kompetisi pelajar.',
  },
];

export default function SilatPage() {
  const [activeCard, setActiveCard] = useState<number | null>(null);
  const [visible, setVisible] = useState(false);
  const statsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.2 }
    );

    if (statsRef.current) {
      observer.observe(statsRef.current);
    }

    return () => observer.disconnect();
  }, []);

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Barlow:wght@400;500;600;700;800&family=Barlow+Condensed:wght@500;600;700;800&family=Bebas+Neue&display=swap');

        * {
          box-sizing: border-box;
        }

        .slt-root {
          --orange: #d88924;
          --orange-dark: #b96d15;
          --orange-light: #f3ab4d;
          --cream: #fffaf3;
          --cream-2: #f8f3ea;
          --white: #ffffff;
          --text: #211c17;
          --muted: #756e66;
          --line: #e9dfd1;

          font-family: 'Barlow', sans-serif;
          background: var(--cream);
          color: var(--text);
          min-height: 100vh;
          overflow: hidden;
        }

        /* =========================================================
           HERO
        ========================================================= */

        .slt-hero {
          position: relative;
          overflow: hidden;
          background: #17120d;
        }

        .slt-hero-img {
          position: relative;
          width: 100%;
          height: min(70vh, 600px);
        }

        .slt-hero-img img {
          object-fit: cover;
          object-position: center top;
          filter: brightness(0.62) contrast(1.08) saturate(0.9);
          animation: heroZoom 9s ease-out forwards;
        }

        @keyframes heroZoom {
          from {
            transform: scale(1.07);
          }

          to {
            transform: scale(1);
          }
        }

        .slt-hero-overlay {
          position: absolute;
          inset: 0;
          background:
            linear-gradient(
              to bottom,
              rgba(10, 7, 4, 0.04) 10%,
              rgba(10, 7, 4, 0.12) 40%,
              rgba(10, 7, 4, 0.62) 76%,
              #17120d 100%
            );
        }

        /* =========================================================
           PENDEKAR SILUET
        ========================================================= */

        .slt-fighter {
          position: absolute;

          right: clamp(5%, 10vw, 15%);
          top: 50%;

          width: 190px;
          height: 270px;

          transform: translateY(-50%);

          z-index: 4;

          pointer-events: none;

          animation:
            fighterAppear 1.2s ease-out both,
            fighterMove 5.5s ease-in-out 1.2s infinite;
        }

        @keyframes fighterAppear {
          from {
            opacity: 0;
            transform:
              translateY(-50%)
              translateX(100px)
              scale(0.8);
          }

          to {
            opacity: 1;
            transform:
              translateY(-50%)
              translateX(0)
              scale(1);
          }
        }

        @keyframes fighterMove {
          0%,
          100% {
            transform:
              translateY(-50%)
              translateX(0)
              rotate(0deg);
          }

          20% {
            transform:
              translateY(-50%)
              translateX(-8px)
              rotate(-2deg);
          }

          35% {
            transform:
              translateY(-52%)
              translateX(-22px)
              rotate(-5deg);
          }

          45% {
            transform:
              translateY(-50%)
              translateX(-5px)
              rotate(2deg);
          }

          62% {
            transform:
              translateY(-53%)
              translateX(-18px)
              rotate(-4deg);
          }

          75% {
            transform:
              translateY(-50%)
              translateX(5px)
              rotate(2deg);
          }
        }

        /* kepala */

        .fighter-head {
          position: absolute;

          width: 38px;
          height: 38px;

          border-radius: 50%;

          background:
            radial-gradient(
              circle at 35% 30%,
              rgba(255,255,255,0.35),
              rgba(216,137,36,0.85) 55%,
              #a75d0d 100%
            );

          left: 77px;
          top: 7px;

          box-shadow:
            0 0 25px rgba(216,137,36,0.35);

          z-index: 5;
        }

        /* badan */

        .fighter-body {
          position: absolute;

          left: 66px;
          top: 45px;

          width: 58px;
          height: 100px;

          background:
            linear-gradient(
              90deg,
              #9d590e,
              #e09a36 45%,
              #a85f0e
            );

          clip-path: polygon(
            25% 0,
            75% 0,
            100% 35%,
            77% 100%,
            23% 100%,
            0 35%
          );

          filter:
            drop-shadow(0 0 18px rgba(216,137,36,0.35));

          z-index: 3;

          animation: bodyPulse 5.5s ease-in-out infinite;
        }

        @keyframes bodyPulse {
          0%,
          100% {
            transform: rotate(0deg);
          }

          30% {
            transform: rotate(-5deg);
          }

          45% {
            transform: rotate(5deg);
          }

          65% {
            transform: rotate(-3deg);
          }
        }

        /* sabuk */

        .fighter-belt {
          position: absolute;

          left: 61px;
          top: 106px;

          width: 68px;
          height: 8px;

          background: #fff0d1;

          z-index: 5;

          transform: rotate(-2deg);
        }

        /* tangan kiri */

        .fighter-arm-left {
          position: absolute;

          width: 72px;
          height: 17px;

          background:
            linear-gradient(
              90deg,
              #b86c15,
              #e09a36
            );

          border-radius: 20px;

          left: 10px;
          top: 63px;

          transform-origin: right center;

          animation: armLeft 5.5s ease-in-out infinite;

          z-index: 2;
        }

        @keyframes armLeft {
          0%,
          100% {
            transform: rotate(35deg);
          }

          28% {
            transform: rotate(8deg);
          }

          38% {
            transform: rotate(-12deg);
          }

          50% {
            transform: rotate(25deg);
          }

          67% {
            transform: rotate(8deg);
          }
        }

        /* tangan kanan - pukulan */

        .fighter-arm-right {
          position: absolute;

          width: 105px;
          height: 18px;

          background:
            linear-gradient(
              90deg,
              #b86c15,
              #f0aa4a
            );

          border-radius: 20px;

          left: 105px;
          top: 59px;

          transform-origin: left center;

          animation: punch 5.5s cubic-bezier(.6,0,.3,1) infinite;

          z-index: 2;
        }

        @keyframes punch {
          0%,
          18% {
            transform:
              rotate(25deg)
              scaleX(0.72);
          }

          27% {
            transform:
              rotate(-5deg)
              scaleX(1.05);
          }

          34% {
            transform:
              rotate(-12deg)
              translateX(28px)
              scaleX(1.22);
          }

          39% {
            transform:
              rotate(-12deg)
              translateX(28px)
              scaleX(1.22);
          }

          46% {
            transform:
              rotate(20deg)
              scaleX(0.7);
          }

          100% {
            transform:
              rotate(25deg)
              scaleX(0.72);
          }
        }

        /* kepalan */

        .fighter-fist {
          position: absolute;

          right: -12px;
          top: -5px;

          width: 26px;
          height: 26px;

          border-radius: 50%;

          background: #f2ad4f;

          box-shadow:
            0 0 14px rgba(243,171,77,0.55);
        }

        /* kaki belakang */

        .fighter-leg-back {
          position: absolute;

          left: 75px;
          top: 130px;

          width: 24px;
          height: 115px;

          background:
            linear-gradient(
              90deg,
              #9e5b11,
              #d98a28
            );

          border-radius: 18px;

          transform-origin: top center;

          animation: legBack 5.5s ease-in-out infinite;

          z-index: 1;
        }

        @keyframes legBack {
          0%,
          100% {
            transform: rotate(25deg);
          }

          30% {
            transform: rotate(12deg);
          }

          55% {
            transform: rotate(32deg);
          }

          70% {
            transform: rotate(20deg);
          }
        }

        /* kaki depan - tendangan */

        .fighter-leg-front {
          position: absolute;

          left: 106px;
          top: 130px;

          width: 25px;
          height: 118px;

          background:
            linear-gradient(
              90deg,
              #a35d10,
              #efa344
            );

          border-radius: 18px;

          transform-origin: top center;

          animation: kick 5.5s cubic-bezier(.5,0,.4,1) infinite;

          z-index: 2;
        }

        @keyframes kick {
          0%,
          48% {
            transform: rotate(-8deg);
          }

          57% {
            transform:
              rotate(-65deg)
              translateX(15px);
          }

          64% {
            transform:
              rotate(-80deg)
              translateX(32px);
          }

          70% {
            transform:
              rotate(-48deg)
              translateX(12px);
          }

          80%,
          100% {
            transform: rotate(-8deg);
          }
        }

        /* kaki */

        .fighter-foot {
          position: absolute;

          width: 48px;
          height: 17px;

          background: #a55e10;

          border-radius: 20px;

          right: -27px;
          bottom: -4px;
        }

        /* =========================================================
           MOTION TRAIL
        ========================================================= */

        .slt-trail {
          position: absolute;

          width: 150px;
          height: 70px;

          border-top:
            3px solid rgba(240,170,74,0.6);

          border-radius: 50%;

          right: 1%;
          top: 38%;

          transform: rotate(-12deg);

          opacity: 0;

          animation:
            trailPunch 5.5s ease-out infinite;
        }

        .slt-trail.two {
          width: 180px;
          height: 100px;

          right: -1%;
          top: 53%;

          border-top-width: 2px;

          animation:
            trailKick 5.5s ease-out infinite;
        }

        @keyframes trailPunch {
          0%,
          24% {
            opacity: 0;
            transform:
              translateX(40px)
              rotate(-12deg)
              scaleX(0.5);
          }

          31% {
            opacity: 0.75;
            transform:
              translateX(0)
              rotate(-12deg)
              scaleX(1);
          }

          40% {
            opacity: 0;
            transform:
              translateX(-25px)
              rotate(-12deg)
              scaleX(1.15);
          }

          100% {
            opacity: 0;
          }
        }

        @keyframes trailKick {
          0%,
          55% {
            opacity: 0;
            transform:
              translateX(30px)
              rotate(-28deg)
              scale(0.6);
          }

          63% {
            opacity: 0.7;
            transform:
              translateX(0)
              rotate(-28deg)
              scale(1);
          }

          72% {
            opacity: 0;
            transform:
              translateX(-30px)
              rotate(-28deg)
              scale(1.2);
          }

          100% {
            opacity: 0;
          }
        }

        /* =========================================================
           IMPACT
        ========================================================= */

        .slt-impact {
          position: absolute;

          right: 4%;
          top: 31%;

          width: 65px;
          height: 65px;

          border:
            2px solid rgba(246,180,91,0.75);

          border-radius: 50%;

          opacity: 0;

          animation:
            impactPunch 5.5s ease-out infinite;

          z-index: 3;
        }

        .slt-impact::before,
        .slt-impact::after {
          content: '';

          position: absolute;

          inset: 10px;

          border:
            1px solid rgba(255,220,170,0.55);

          border-radius: 50%;
        }

        .slt-impact::after {
          inset: -10px;
        }

        @keyframes impactPunch {
          0%,
          30% {
            opacity: 0;
            transform: scale(0.3);
          }

          34% {
            opacity: 0.9;
            transform: scale(1);
          }

          42% {
            opacity: 0;
            transform: scale(1.65);
          }

          100% {
            opacity: 0;
          }
        }

        /* =========================================================
           HERO CONTENT
        ========================================================= */

        .slt-hero-content {
          position: absolute;

          bottom: 0;
          left: 0;
          right: 0;

          padding:
            0
            clamp(24px, 6vw, 80px)
            clamp(40px, 6vw, 72px);

          z-index: 8;

          animation:
            heroContent 1s ease-out both;
        }

        @keyframes heroContent {
          from {
            opacity: 0;
            transform: translateY(35px);
          }

          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .slt-eyebrow {
          display: inline-flex;
          align-items: center;
          gap: 10px;

          font-family: 'Barlow Condensed', sans-serif;
          font-size: 13px;
          font-weight: 700;

          letter-spacing: 3px;
          text-transform: uppercase;

          color: #f0ae4d;

          margin-bottom: 16px;
        }

        .slt-eyebrow::before {
          content: '';

          display: block;

          width: 32px;
          height: 2px;

          background: #f0ae4d;
        }

        .slt-title {
          font-family: 'Bebas Neue', sans-serif;

          font-size: clamp(72px, 12vw, 160px);

          line-height: 0.9;

          color: #fff;

          letter-spacing: 2px;

          margin: 0 0 20px;
        }

        .slt-title span {
          color: #e39a35;
        }

        .slt-subtitle {
          max-width: 560px;

          font-size: clamp(15px, 1.8vw, 18px);

          color: rgba(255,255,255,0.78);

          line-height: 1.7;

          margin: 0;
        }

        /* =========================================================
           STATS
        ========================================================= */

        .slt-stats {
          display: grid;

          grid-template-columns:
            repeat(4, 1fr);

          background: #fff;

          border-top:
            1px solid var(--line);

          border-bottom:
            1px solid var(--line);

          position: relative;

          z-index: 10;
        }

        @media (max-width: 640px) {
          .slt-stats {
            grid-template-columns:
              repeat(2, 1fr);
          }
        }

        .slt-stat {
          padding: 30px 20px;

          text-align: center;

          border-right:
            1px solid var(--line);

          position: relative;

          overflow: hidden;

          transition:
            background 0.3s ease,
            transform 0.3s ease;
        }

        .slt-stat:last-child {
          border-right: none;
        }

        .slt-stat::after {
          content: '';

          position: absolute;

          bottom: 0;
          left: 50%;

          width: 0;
          height: 3px;

          background: var(--orange);

          transform:
            translateX(-50%);

          transition:
            width 0.35s ease;
        }

        .slt-stat:hover {
          background: #fffaf2;
          transform: translateY(-4px);
        }

        .slt-stat:hover::after {
          width: 50px;
        }

        .slt-stat-num {
          font-family: 'Bebas Neue', sans-serif;

          font-size: 46px;

          color: var(--orange);

          line-height: 1;

          margin-bottom: 7px;

          transition:
            transform 0.3s ease;
        }

        .slt-stat:hover .slt-stat-num {
          transform: scale(1.08);
        }

        .slt-stat-label {
          font-size: 11px;

          font-weight: 700;

          letter-spacing: 2px;

          text-transform: uppercase;

          color: #8c847b;
        }

        /* =========================================================
           SECTION
        ========================================================= */

        .slt-section {
          max-width: 1100px;

          margin: 0 auto;

          padding:
            clamp(56px, 8vw, 96px)
            clamp(24px, 6vw, 80px);
        }

        .slt-section-label {
          display: flex;

          align-items: center;

          gap: 10px;

          font-family: 'Barlow Condensed', sans-serif;

          font-size: 12px;

          font-weight: 800;

          letter-spacing: 3px;

          text-transform: uppercase;

          color: var(--orange);

          margin-bottom: 12px;
        }

        .slt-section-label::before {
          content: '';

          width: 24px;
          height: 2px;

          background: var(--orange);
        }

        .slt-section-heading {
          font-family: 'Bebas Neue', sans-serif;

          font-size:
            clamp(44px, 5vw, 68px);

          color: #211c17;

          line-height: 1;

          margin:
            0 0 48px;

          letter-spacing: 1px;
        }

        /* =========================================================
           TUJUAN
        ========================================================= */

        .slt-tujuan-grid {
          display: grid;

          grid-template-columns:
            repeat(3, 1fr);

          gap: 18px;
        }

        @media (max-width: 768px) {
          .slt-tujuan-grid {
            grid-template-columns: 1fr;
          }
        }

        .slt-tujuan-card {
          position: relative;

          overflow: hidden;

          background: #fff;

          border:
            1px solid var(--line);

          padding: 36px 28px;

          min-height: 300px;

          cursor: pointer;

          transition:
            transform 0.4s cubic-bezier(.2,.8,.2,1),
            box-shadow 0.4s ease,
            border-color 0.3s ease;
        }

        .slt-tujuan-card::before {
          content: '';

          position: absolute;

          width: 150px;
          height: 150px;

          right: -75px;
          top: -75px;

          border:
            1px solid rgba(216,137,36,0.15);

          border-radius: 50%;

          transition:
            transform 0.5s ease;
        }

        .slt-tujuan-card::after {
          content: '';

          position: absolute;

          bottom: 0;
          left: 0;

          width: 0;
          height: 4px;

          background:
            linear-gradient(
              90deg,
              var(--orange),
              var(--orange-light)
            );

          transition:
            width 0.4s ease;
        }

        .slt-tujuan-card:hover,
        .slt-tujuan-card.active {
          transform:
            translateY(-9px);

          border-color:
            rgba(216,137,36,0.35);

          box-shadow:
            0 18px 40px
            rgba(87,58,25,0.12);
        }

        .slt-tujuan-card:hover::before,
        .slt-tujuan-card.active::before {
          transform:
            scale(2.2);
        }

        .slt-tujuan-card:hover::after,
        .slt-tujuan-card.active::after {
          width: 100%;
        }

        .slt-tujuan-number {
          position: absolute;

          top: 18px;
          right: 22px;

          font-family:
            'Bebas Neue',
            sans-serif;

          font-size: 42px;

          color:
            rgba(216,137,36,0.09);

          line-height: 1;
        }

        .slt-tujuan-icon-wrap {
          width: 58px;
          height: 58px;

          display: flex;

          align-items: center;
          justify-content: center;

          background: #fff5e7;

          border:
            1px solid #f1dfc5;

          color: var(--orange);

          margin-bottom: 24px;

          transition:
            transform 0.4s ease,
            background 0.3s ease;
        }

        .slt-tujuan-card:hover
        .slt-tujuan-icon-wrap,
        .slt-tujuan-card.active
        .slt-tujuan-icon-wrap {
          transform:
            rotate(-8deg)
            scale(1.08);

          background:
            var(--orange);

          color: white;
        }

        .slt-tujuan-title {
          font-family:
            'Barlow Condensed',
            sans-serif;

          font-size: 23px;

          font-weight: 800;

          color: #28211a;

          text-transform:
            uppercase;

          letter-spacing: 1px;

          margin-bottom: 12px;
        }

        .slt-tujuan-desc {
          font-size: 14px;

          color: #777067;

          line-height: 1.75;

          margin: 0;
        }

        /* =========================================================
           DIVIDER
        ========================================================= */

        .slt-divider {
          display: flex;

          align-items: center;

          gap: 16px;

          max-width: 1100px;

          margin: 0 auto;

          padding:
            0 clamp(24px, 6vw, 80px);
        }

        .slt-divider::before,
        .slt-divider::after {
          content: '';

          flex: 1;

          height: 1px;

          background:
            var(--line);
        }

        .slt-divider-icon {
          width: 36px;
          height: 36px;

          display: flex;

          align-items: center;
          justify-content: center;

          border:
            1px solid #e9d6bb;

          border-radius: 50%;

          color: var(--orange);

          animation:
            spinSlow 7s linear infinite;
        }

        @keyframes spinSlow {
          from {
            transform: rotate(0);
          }

          to {
            transform: rotate(360deg);
          }
        }

        /* =========================================================
           KEGIATAN
        ========================================================= */

        .slt-kegiatan-grid {
          display: grid;

          grid-template-columns:
            repeat(2, 1fr);

          gap: 14px;
        }

        @media (max-width: 640px) {
          .slt-kegiatan-grid {
            grid-template-columns: 1fr;
          }
        }

        .slt-kegiatan-item {
          position: relative;

          background: #fff;

          border:
            1px solid var(--line);

          padding: 26px 28px;

          display: flex;

          align-items: flex-start;

          gap: 20px;

          overflow: hidden;

          transition:
            transform 0.35s ease,
            box-shadow 0.35s ease,
            border-color 0.35s ease;
        }

        .slt-kegiatan-item::before {
          content: '';

          position: absolute;

          left: 0;
          top: 0;
          bottom: 0;

          width: 3px;

          background:
            var(--orange);

          transform:
            scaleY(0);

          transform-origin:
            bottom;

          transition:
            transform 0.35s ease;
        }

        .slt-kegiatan-item:hover {
          transform:
            translateX(6px);

          border-color:
            #e3c9a6;

          box-shadow:
            0 12px 30px
            rgba(80,55,25,0.09);
        }

        .slt-kegiatan-item:hover::before {
          transform:
            scaleY(1);
        }

        .slt-kegiatan-no {
          font-family:
            'Bebas Neue',
            sans-serif;

          font-size: 34px;

          color:
            rgba(216,137,36,0.28);

          line-height: 1;

          flex-shrink: 0;

          width: 42px;

          transition:
            color 0.3s ease,
            transform 0.3s ease;
        }

        .slt-kegiatan-item:hover
        .slt-kegiatan-no {
          color:
            var(--orange);

          transform:
            translateX(4px);
        }

        .slt-kegiatan-content {
          flex: 1;
        }

        .slt-kegiatan-nama {
          display: flex;

          align-items: center;

          gap: 8px;

          font-family:
            'Barlow Condensed',
            sans-serif;

          font-size: 19px;

          font-weight: 800;

          color: #29221b;

          text-transform:
            uppercase;

          letter-spacing:
            0.5px;

          margin-bottom: 6px;
        }

        .slt-kegiatan-detail {
          font-size: 13px;

          color: #847c73;

          line-height: 1.6;
        }

        .slt-arrow {
          color:
            #cfc2b2;

          transition:
            transform 0.3s ease,
            color 0.3s ease;
        }

        .slt-kegiatan-item:hover
        .slt-arrow {
          color:
            var(--orange);

          transform:
            translateX(5px)
            translateY(-5px);
        }

        /* =========================================================
           CTA
        ========================================================= */

        .slt-cta {
          max-width: 1100px;

          margin: 0 auto;

          padding:
            0
            clamp(24px, 6vw, 80px)
            clamp(70px, 8vw, 100px);
        }

        .slt-cta-inner {
          position: relative;

          overflow: hidden;

          background:
            linear-gradient(
              120deg,
              #e08c29,
              #c87517
            );

          padding:
            48px
            clamp(28px, 6vw, 65px);

          color: white;

          box-shadow:
            0 18px 40px
            rgba(166,102,26,0.18);
        }

        .slt-cta-inner::before {
          content:
            'SILAT';

          position: absolute;

          right: -15px;
          bottom: -38px;

          font-family:
            'Bebas Neue',
            sans-serif;

          font-size: 150px;

          color:
            rgba(255,255,255,0.08);

          line-height: 1;

          pointer-events:
            none;
        }

        .slt-cta-top {
          display: flex;

          align-items: center;

          gap: 10px;

          font-family:
            'Barlow Condensed',
            sans-serif;

          font-size: 12px;

          font-weight: 800;

          letter-spacing: 3px;

          text-transform:
            uppercase;

          margin-bottom: 12px;
        }

        .slt-cta-title {
          position: relative;

          z-index: 2;

          font-family:
            'Bebas Neue',
            sans-serif;

          font-size:
            clamp(38px, 5vw, 62px);

          line-height:
            0.95;

          margin:
            0 0 12px;
        }

        .slt-cta-text {
          position: relative;

          z-index: 2;

          max-width: 600px;

          font-size: 15px;

          line-height: 1.7;

          color:
            rgba(255,255,255,0.82);

          margin: 0;
        }

        /* =========================================================
           MOBILE
        ========================================================= */

        @media (max-width: 768px) {
          .slt-fighter {
            right: 1%;
            top: 43%;

            transform:
              translateY(-50%)
              scale(0.68);

            transform-origin:
              center;
          }

          .slt-trail {
            right: -5%;
          }

          .slt-impact {
            right: 2%;
          }
        }

        @media (max-width: 640px) {
          .slt-hero-img {
            height: 560px;
          }

          .slt-fighter {
            right: -35px;
            top: 38%;

            transform:
              translateY(-50%)
              scale(0.52);
          }

          .slt-title {
            font-size: 78px;
          }

          .slt-subtitle {
            font-size: 14px;

            max-width: 470px;
          }

          .slt-stat {
            padding: 24px 12px;
          }

          .slt-stat-num {
            font-size: 38px;
          }

          .slt-tujuan-card {
            min-height: auto;
          }

          .slt-kegiatan-item {
            padding:
              24px 20px;
          }

          .slt-cta-inner::before {
            font-size: 100px;
          }
        }

        @media (prefers-reduced-motion: reduce) {
          *,
          *::before,
          *::after {
            animation-duration:
              0.01ms !important;

            animation-iteration-count:
              1 !important;

            transition-duration:
              0.01ms !important;
          }
        }
      `}</style>

      <div className="slt-root">

        <Navbar />

        <main>

          {/* =====================================================
              HERO
              LAYOUT GAMBAR TETAP SEPERTI KODE AWAL
          ===================================================== */}

          <section className="slt-hero">

            <div className="slt-hero-img">

              <Image
                src="/images/eskul/silat.jpg"
                alt="Pencak Silat SMK Citra Negara"
                fill
                priority
              />

              <div className="slt-hero-overlay" />

              {/* =================================================
                  PENDEKAR SILAT ANIMASI
              ================================================= */}

              <div className="slt-fighter">

                <div className="fighter-head" />

                <div className="fighter-body" />

                <div className="fighter-belt" />

                <div className="fighter-arm-left" />

                <div className="fighter-arm-right">
                  <div className="fighter-fist" />
                </div>

                <div className="fighter-leg-back">
                  <div className="fighter-foot" />
                </div>

                <div className="fighter-leg-front">
                  <div className="fighter-foot" />
                </div>

              </div>

              {/* Gerakan pukulan */}

              <div className="slt-trail" />

              {/* Gerakan tendangan */}

              <div className="slt-trail two" />

              {/* Efek impact */}

              <div className="slt-impact" />

            </div>

            {/* =================================================
                TEKS TETAP DI BAWAH GAMBAR
            ================================================= */}

            <div className="slt-hero-content">

              <div className="slt-eyebrow">
                Ekstrakurikuler SMK Citra Negara
              </div>

              <h1 className="slt-title">
                PENCAK<span> SILAT</span>
              </h1>

              <p className="slt-subtitle">
                Pencak Silat adalah seni bela diri asli Indonesia
                yang menjadi bagian dari warisan budaya bangsa.
                Melalui latihan, kedisiplinan, dan kebersamaan,
                kami membentuk siswa yang tangguh, berani,
                dan berkarakter.
              </p>

            </div>

          </section>

          {/* =====================================================
              STATS
          ===================================================== */}

          <div
            className="slt-stats"
            ref={statsRef}
          >

            {STATS.map((s, index) => (

              <div
                key={s.label}
                className="slt-stat"
                style={{
                  opacity: visible ? 1 : 0,
                  transform: visible
                    ? 'translateY(0)'
                    : 'translateY(20px)',
                  transition:
                    `all .5s ease ${index * 0.1}s`,
                }}
              >

                <div className="slt-stat-num">
                  {s.angka}
                </div>

                <div className="slt-stat-label">
                  {s.label}
                </div>

              </div>

            ))}

          </div>

          {/* =====================================================
              TUJUAN
          ===================================================== */}

          <section className="slt-section">

            <div className="slt-section-label">
              Mengapa Pencak Silat
            </div>

            <h2 className="slt-section-heading">
              TUJUAN KAMI
            </h2>

            <div className="slt-tujuan-grid">

              {TUJUAN.map((t, index) => {

                const Icon = t.icon;

                return (

                  <div
                    key={t.judul}
                    className={`slt-tujuan-card ${
                      activeCard === index
                        ? 'active'
                        : ''
                    }`}
                    onMouseEnter={() =>
                      setActiveCard(index)
                    }
                    onMouseLeave={() =>
                      setActiveCard(null)
                    }
                    onClick={() =>
                      setActiveCard(
                        activeCard === index
                          ? null
                          : index
                      )
                    }
                  >

                    <div className="slt-tujuan-number">
                      {t.nomor}
                    </div>

                    <div className="slt-tujuan-icon-wrap">
                      <Icon
                        size={27}
                        strokeWidth={1.8}
                      />
                    </div>

                    <div className="slt-tujuan-title">
                      {t.judul}
                    </div>

                    <p className="slt-tujuan-desc">
                      {t.deskripsi}
                    </p>

                  </div>

                );
              })}

            </div>

          </section>

          {/* =====================================================
              DIVIDER
          ===================================================== */}

          <div className="slt-divider">

            <span className="slt-divider-icon">
              ✦
            </span>

          </div>

          {/* =====================================================
              KEGIATAN
          ===================================================== */}

          <section
            className="slt-section"
            style={{
              paddingTop:
                'clamp(40px, 5vw, 64px)',
            }}
          >

            <div className="slt-section-label">
              Program Latihan
            </div>

            <h2 className="slt-section-heading">
              KEGIATAN RUTIN
            </h2>

            <div className="slt-kegiatan-grid">

              {KEGIATAN.map((k) => (

                <div
                  key={k.no}
                  className="slt-kegiatan-item"
                >

                  <div className="slt-kegiatan-no">
                    {k.no}
                  </div>

                  <div className="slt-kegiatan-content">

                    <div className="slt-kegiatan-nama">

                      {k.nama}

                      <ChevronRight
                        className="slt-arrow"
                        size={17}
                      />

                    </div>

                    <div className="slt-kegiatan-detail">
                      {k.detail}
                    </div>

                  </div>

                  <ArrowUpRight
                    className="slt-arrow"
                    size={18}
                  />

                </div>

              ))}

            </div>

          </section>

          {/* =====================================================
              CTA
          ===================================================== */}

          <section className="slt-cta">

            <div className="slt-cta-inner">

              <div className="slt-cta-top">
                <Target size={15} />
                Semangat Pendekar
              </div>

              <h2 className="slt-cta-title">
                DISIPLIN. BERANI.
                <br />
                BERKARAKTER.
              </h2>

              <p className="slt-cta-text">
                Bukan hanya tentang memenangkan pertandingan.
                Pencak silat mengajarkan bagaimana mengendalikan
                diri, menghargai lawan, dan terus berkembang
                menjadi pribadi yang lebih baik.
              </p>

            </div>

          </section>

        </main>

        <EskulMusic src="/audio/silat.mp3" />
        <Footer />

      </div>
    </>
  );
}