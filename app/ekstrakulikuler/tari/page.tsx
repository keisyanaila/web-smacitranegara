'use client';

import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import EskulMusic from '@/components/EskulMusic';
import Image from 'next/image';
import { useState } from 'react';

const STATS = [
  { angka: '2013', label: 'Tahun Berdiri' },
  { angka: '28+', label: 'Anggota Aktif' },
  { angka: '16', label: 'Prestasi Diraih' },
  { angka: '100%', label: 'Dedikasi' },
];

const TUJUAN = [
  {
    icon: '✿',
    judul: 'Kreativitas & Ekspresi',
    deskripsi:
      'Mengembangkan kreativitas siswa melalui gerakan, ekspresi, irama, dan koreografi yang penuh makna.',
  },
  {
    icon: '❋',
    judul: 'Melestarikan Budaya',
    deskripsi:
      'Mengenalkan berbagai tari tradisional Nusantara sekaligus menumbuhkan rasa bangga terhadap budaya Indonesia.',
  },
  {
    icon: '✦',
    judul: 'Karakter & Kekompakan',
    deskripsi:
      'Melatih kedisiplinan, kepercayaan diri, tanggung jawab, dan kekompakan melalui latihan bersama.',
  },
];

const TARI = [
  {
    nama: 'Jaipong',
    daerah: 'Jawa Barat',
    deskripsi:
      'Tari khas Jawa Barat dengan karakter gerakan yang dinamis, enerjik, dan ekspresif.',
  },
  {
    nama: 'Saman',
    daerah: 'Aceh',
    deskripsi:
      'Tarian yang mengutamakan kekompakan, ketepatan ritme, dan koordinasi gerakan para penarinya.',
  },
  {
    nama: 'Piring',
    daerah: 'Sumatera Barat',
    deskripsi:
      'Tarian Minangkabau yang menggunakan piring sebagai properti dan ditampilkan dengan gerakan yang atraktif.',
  },
  {
    nama: 'Gambyong',
    daerah: 'Jawa Tengah',
    deskripsi:
      'Tari Jawa yang dikenal dengan gerakan lembut, anggun, dan penuh keindahan ekspresi.',
  },
];

const KEGIATAN = [
  {
    no: '01',
    nama: 'Latihan Teknik Dasar',
    detail: 'Mempelajari gerakan dasar, posisi tubuh, ritme, dan ekspresi.',
  },
  {
    no: '02',
    nama: 'Latihan Koreografi',
    detail: 'Menyusun gerakan, pola lantai, dan kekompakan kelompok.',
  },
  {
    no: '03',
    nama: 'Pertunjukan & Penampilan',
    detail: 'Menampilkan karya tari dalam berbagai acara sekolah.',
  },
  {
    no: '04',
    nama: 'Eksplorasi Budaya',
    detail: 'Mengenal sejarah, makna, busana, musik, dan properti tari.',
  },
  {
    no: '05',
    nama: 'Workshop Seni',
    detail: 'Mendapatkan pengalaman dan wawasan dari pembina maupun praktisi.',
  },
  {
    no: '06',
    nama: 'Festival & Kompetisi',
    detail: 'Mengembangkan pengalaman dan prestasi melalui kompetisi seni.',
  },
];

export default function TariPage() {
  const [activeTari, setActiveTari] = useState(0);

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Barlow:wght@400;500;600;700&family=Barlow+Condensed:wght@600;700;800&family=Playfair+Display:wght@600;700;800&display=swap');

        * {
          box-sizing: border-box;
        }

        .tari-root {
          --cream: #fff9eb;
          --cream-dark: #f3e5c9;
          --paper: #fffdf7;
          --brown: #633a27;
          --brown-dark: #432519;
          --terracotta: #ae5534;
          --gold: #c99a3c;
          --gold-light: #e6ca8a;
          --green: #66754b;
          --text: #4a382e;
          --muted: #806e61;

          min-height: 100vh;
          overflow: hidden;
          background: var(--cream);
          color: var(--text);
          font-family: 'Barlow', sans-serif;
        }

        /* =========================================
           FLOATING TARI ELEMENTS
        ========================================= */

        .tari-floating {
          position: fixed;
          z-index: 20;
          pointer-events: none;
          user-select: none;
        }

        .tari-petal {
          position: fixed;
          top: -30px;
          z-index: 50;
          pointer-events: none;
          color: var(--terracotta);
          font-size: 14px;
          opacity: .65;
          animation: petalFall linear infinite;
        }

        .petal-1 {
          left: 8%;
          animation-duration: 9s;
          animation-delay: -2s;
        }

        .petal-2 {
          left: 24%;
          animation-duration: 12s;
          animation-delay: -7s;
          font-size: 10px;
        }

        .petal-3 {
          left: 47%;
          animation-duration: 10s;
          animation-delay: -4s;
          font-size: 17px;
        }

        .petal-4 {
          left: 72%;
          animation-duration: 13s;
          animation-delay: -9s;
          font-size: 11px;
        }

        .petal-5 {
          left: 91%;
          animation-duration: 11s;
          animation-delay: -5s;
          font-size: 15px;
        }

        @keyframes petalFall {
          0% {
            transform:
              translate3d(0, -20px, 0)
              rotate(0deg);
            opacity: 0;
          }

          10% {
            opacity: .65;
          }

          25% {
            transform:
              translate3d(35px, 25vh, 0)
              rotate(90deg);
          }

          50% {
            transform:
              translate3d(-30px, 50vh, 0)
              rotate(180deg);
          }

          75% {
            transform:
              translate3d(40px, 75vh, 0)
              rotate(270deg);
          }

          100% {
            transform:
              translate3d(-20px, 110vh, 0)
              rotate(360deg);
            opacity: 0;
          }
        }

        /* =========================================
           HERO — LAYOUT TETAP SEPERTI AWAL
        ========================================= */

        .tri-hero {
          position: relative;
          overflow: hidden;
          background: var(--cream);
        }

        .tri-hero-img {
          position: relative;
          width: 100%;
          height: min(70vh, 600px);
        }

        .tri-hero-img img {
          object-fit: cover;
          object-position: center top;
          filter:
            brightness(.72)
            contrast(1.04)
            saturate(.92);
          transition:
            transform 1.2s cubic-bezier(.2,.8,.2,1),
            filter .8s ease;
        }

        .tri-hero:hover .tri-hero-img img {
          transform: scale(1.035);
          filter:
            brightness(.78)
            contrast(1.04)
            saturate(1);
        }

        .tri-hero-overlay {
          position: absolute;
          inset: 0;

          background:
            linear-gradient(
              to bottom,
              rgba(255,249,235,.02) 10%,
              rgba(75,40,25,.08) 38%,
              rgba(63,31,21,.35) 68%,
              rgba(67,37,25,.82) 100%
            );
        }

        /* Ornamen pada hero */

        .hero-motif {
          position: absolute;
          z-index: 3;
          pointer-events: none;
          opacity: .72;
        }

        .hero-motif-left {
          width: 120px;
          height: 120px;
          left: 25px;
          top: 30px;
          border: 1px solid rgba(255,232,177,.55);
          border-radius: 50%;
          animation: motifSpin 18s linear infinite;
        }

        .hero-motif-left::before,
        .hero-motif-left::after {
          content: '';
          position: absolute;
          inset: 17px;
          border: 1px solid rgba(255,232,177,.4);
          border-radius: 45% 55%;
        }

        .hero-motif-right {
          width: 150px;
          height: 150px;
          right: 35px;
          top: 40px;
          border: 1px solid rgba(255,232,177,.4);
          transform: rotate(45deg);
          animation: motifFloat 5s ease-in-out infinite;
        }

        @keyframes motifSpin {
          from {
            transform: rotate(0deg);
          }
          to {
            transform: rotate(360deg);
          }
        }

        @keyframes motifFloat {
          0%, 100% {
            transform:
              rotate(45deg)
              translateY(0);
          }

          50% {
            transform:
              rotate(52deg)
              translateY(-12px);
          }
        }

        /* =========================================
           SELENDANG / KAIN
        ========================================= */

        .selendang {
          position: absolute;
          z-index: 4;
          pointer-events: none;
          width: 180px;
          height: 25px;
          right: -30px;
          bottom: 145px;
          border-radius: 50%;
          background:
            linear-gradient(
              90deg,
              transparent,
              rgba(230,202,138,.8),
              rgba(174,85,52,.7),
              transparent
            );
          filter: blur(.2px);
          opacity: .65;
          transform: rotate(-15deg);
          animation: selendangDance 4s ease-in-out infinite;
        }

        .selendang::after {
          content: '';
          position: absolute;
          width: 130px;
          height: 12px;
          left: 10px;
          top: 16px;
          border-radius: 50%;
          background: rgba(255,235,186,.55);
          transform: rotate(12deg);
        }

        @keyframes selendangDance {
          0%, 100% {
            transform:
              translate3d(0,0,0)
              rotate(-15deg)
              scaleX(1);
          }

          25% {
            transform:
              translate3d(-30px,-10px,0)
              rotate(-7deg)
              scaleX(1.1);
          }

          50% {
            transform:
              translate3d(-65px,4px,0)
              rotate(-20deg)
              scaleX(.9);
          }

          75% {
            transform:
              translate3d(-30px,12px,0)
              rotate(-10deg)
              scaleX(1.08);
          }
        }

        .tri-hero-content {
          position: absolute;
          z-index: 5;
          bottom: 0;
          left: 0;
          right: 0;
          padding:
            0
            clamp(24px, 6vw, 80px)
            clamp(40px, 6vw, 72px);
        }

        .tri-eyebrow {
          display: inline-flex;
          align-items: center;
          gap: 10px;

          margin-bottom: 16px;

          color: #f3cf83;
          font-family: 'Barlow Condensed', sans-serif;
          font-size: 13px;
          font-weight: 700;
          letter-spacing: 3px;
          text-transform: uppercase;

          animation: heroText .8s ease both;
        }

        .tri-eyebrow::before {
          content: '';
          width: 35px;
          height: 2px;
          background: #e4bc69;
        }

        .tri-title {
          margin: 0 0 20px;

          color: #fffdf5;
          font-family: 'Bebas Neue', sans-serif;
          font-size: clamp(72px, 12vw, 160px);
          line-height: .82;
          letter-spacing: 2px;

          animation: heroTitle 1s cubic-bezier(.2,.8,.2,1) both;
        }

        .tri-title span {
          color: #efbd67;
          text-shadow:
            0 4px 20px rgba(0,0,0,.18);
        }

        .tri-subtitle {
          max-width: 620px;
          margin: 0;

          color: rgba(255,250,238,.86);
          font-size: clamp(15px, 1.8vw, 18px);
          line-height: 1.7;

          animation: heroText 1s .2s ease both;
        }

        @keyframes heroTitle {
          from {
            opacity: 0;
            transform:
              translateY(35px)
              scale(.97);
          }

          to {
            opacity: 1;
            transform:
              translateY(0)
              scale(1);
          }
        }

        @keyframes heroText {
          from {
            opacity: 0;
            transform: translateY(15px);
          }

          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        /* =========================================
           STATS
        ========================================= */

        .tri-stats {
          position: relative;
          z-index: 8;

          display: grid;
          grid-template-columns: repeat(4, 1fr);

          background: #fffdf7;

          border-top: 1px solid rgba(174,85,52,.18);
          border-bottom: 1px solid rgba(174,85,52,.18);
        }

        .tri-stat {
          position: relative;
          padding: 30px 20px;
          text-align: center;

          border-right: 1px solid rgba(174,85,52,.12);

          transition:
            background .3s ease,
            transform .3s ease;
        }

        .tri-stat:last-child {
          border-right: none;
        }

        .tri-stat:hover {
          background: #fff6df;
          transform: translateY(-5px);
        }

        .tri-stat::before {
          content: '✦';

          position: absolute;
          top: 9px;
          left: 50%;

          color: var(--gold);
          font-size: 10px;

          transform: translateX(-50%);
          animation: starPulse 2s ease-in-out infinite;
        }

        .tri-stat-num {
          color: var(--terracotta);
          font-family: 'Bebas Neue', sans-serif;
          font-size: 44px;
          line-height: 1;
        }

        .tri-stat-label {
          margin-top: 7px;

          color: var(--muted);
          font-size: 10px;
          font-weight: 700;
          letter-spacing: 2px;
          text-transform: uppercase;
        }

        @keyframes starPulse {
          0%, 100% {
            opacity: .45;
            transform:
              translateX(-50%)
              scale(1);
          }

          50% {
            opacity: 1;
            transform:
              translateX(-50%)
              scale(1.35)
              rotate(20deg);
          }
        }

        /* =========================================
           GENERAL SECTION
        ========================================= */

        .tri-section {
          position: relative;

          max-width: 1150px;
          margin: 0 auto;

          padding:
            clamp(65px, 8vw, 100px)
            clamp(24px, 6vw, 80px);
        }

        .tri-section-label {
          color: var(--terracotta);
          font-family: 'Barlow Condensed', sans-serif;
          font-size: 12px;
          font-weight: 800;
          letter-spacing: 3px;
          text-transform: uppercase;
        }

        .tri-section-heading {
          position: relative;

          margin: 8px 0 45px;

          color: var(--brown-dark);
          font-family: 'Playfair Display', serif;
          font-size: clamp(42px, 6vw, 72px);
          line-height: .95;
        }

        .tri-section-heading::after {
          content: '✿';

          position: absolute;
          margin-left: 15px;

          color: rgba(174,85,52,.3);
          font-size: 25px;

          animation: flowerFloat 3s ease-in-out infinite;
        }

        @keyframes flowerFloat {
          0%, 100% {
            transform: translateY(0) rotate(0deg);
          }

          50% {
            transform: translateY(-7px) rotate(12deg);
          }
        }

        /* =========================================
           TUJUAN CARDS
        ========================================= */

        .tri-tujuan-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 18px;
        }

        .tri-tujuan-card {
          position: relative;
          overflow: hidden;

          min-height: 300px;
          padding: 34px 28px;

          background:
            linear-gradient(
              145deg,
              #fffdf7,
              #fff8e9
            );

          border: 1px solid rgba(91,48,34,.1);

          box-shadow:
            0 8px 25px rgba(91,48,34,.045);

          transition:
            transform .45s cubic-bezier(.2,.8,.2,1),
            box-shadow .45s ease,
            border-color .3s ease;
        }

        .tri-tujuan-card::before {
          content: '';

          position: absolute;
          left: -70px;
          top: -70px;

          width: 140px;
          height: 140px;

          border: 1px solid rgba(201,154,60,.3);
          border-radius: 50%;

          transition: transform .7s ease;
        }

        .tri-tujuan-card::after {
          content: '❋';

          position: absolute;
          right: 18px;
          bottom: 8px;

          color: rgba(174,85,52,.08);
          font-size: 90px;

          transition:
            transform .7s ease,
            color .4s ease;
        }

        .tri-tujuan-card:hover {
          transform:
            translateY(-12px)
            rotate(-.5deg);

          border-color: rgba(174,85,52,.3);

          box-shadow:
            0 22px 45px rgba(91,48,34,.12);
        }

        .tri-tujuan-card:hover::before {
          transform: scale(1.6);
        }

        .tri-tujuan-card:hover::after {
          color: rgba(174,85,52,.16);
          transform:
            rotate(25deg)
            scale(1.08);
        }

        .tri-tujuan-icon {
          display: grid;
          place-items: center;

          width: 54px;
          height: 54px;

          background: var(--cream-dark);
          border-radius: 50%;

          color: var(--terracotta);
          font-size: 24px;

          transition:
            transform .5s ease,
            background .3s ease;
        }

        .tri-tujuan-card:hover .tri-tujuan-icon {
          background: #f0d89d;
          transform:
            rotate(12deg)
            scale(1.12);
        }

        .tri-tujuan-title {
          position: relative;
          z-index: 2;

          margin-top: 40px;

          color: var(--brown-dark);
          font-family: 'Cinzel', serif;
          font-size: 18px;
          font-weight: 700;
        }

        .tri-tujuan-desc {
          position: relative;
          z-index: 2;

          margin-top: 12px;

          color: var(--muted);
          font-size: 14px;
          line-height: 1.75;
        }

        /* =========================================
           BATIK DIVIDER
        ========================================= */

        .tri-divider {
          display: flex;
          align-items: center;
          gap: 18px;

          max-width: 1100px;
          margin: 0 auto;
          padding: 0 25px;

          opacity: .75;
        }

        .tri-divider::before,
        .tri-divider::after {
          content: '';
          flex: 1;
          height: 1px;

          background:
            repeating-linear-gradient(
              90deg,
              var(--gold) 0 7px,
              transparent 7px 14px
            );
        }

        .tri-divider-icon {
          color: var(--terracotta);
          font-size: 18px;

          animation: dividerDance 2s ease-in-out infinite;
        }

        @keyframes dividerDance {
          0%, 100% {
            transform: rotate(0);
          }

          50% {
            transform: rotate(180deg);
          }
        }

        /* =========================================
           TARI NUSANTARA
        ========================================= */

        .tari-budaya {
          position: relative;

          background:
            radial-gradient(
              circle at 90% 15%,
              rgba(201,154,60,.14),
              transparent 22%
            ),
            #f5e8cf;

          border-top: 1px solid rgba(91,48,34,.08);
          border-bottom: 1px solid rgba(91,48,34,.08);
        }

        .tari-budaya-inner {
          max-width: 1150px;
          margin: auto;

          padding:
            clamp(65px, 8vw, 100px)
            clamp(24px, 6vw, 80px);
        }

        .tari-budaya-grid {
          display: grid;
          grid-template-columns: 250px 1fr;
          gap: 35px;
        }

        .tari-menu {
          display: flex;
          flex-direction: column;
          gap: 7px;
        }

        .tari-menu-btn {
          position: relative;

          padding: 18px 20px;

          border: 1px solid transparent;
          background: transparent;

          color: var(--muted);

          font-family: 'Cinzel', serif;
          font-size: 13px;
          font-weight: 700;

          text-align: left;

          cursor: pointer;

          transition: all .3s ease;
        }

        .tari-menu-btn::before {
          content: '';

          position: absolute;
          left: 0;
          top: 50%;

          width: 0;
          height: 2px;

          background: var(--terracotta);

          transform: translateY(-50%);

          transition: width .3s ease;
        }

        .tari-menu-btn:hover {
          padding-left: 27px;
          color: var(--brown);
          background: rgba(255,253,247,.45);
        }

        .tari-menu-btn.active {
          padding-left: 32px;

          color: var(--terracotta);
          background: var(--paper);

          border-color: rgba(174,85,52,.18);

          box-shadow:
            0 10px 25px rgba(91,48,34,.07);
        }

        .tari-menu-btn.active::before {
          width: 18px;
        }

        .tari-info {
          position: relative;
          overflow: hidden;

          min-height: 340px;
          padding: 45px;

          background: var(--paper);

          border: 1px solid rgba(91,48,34,.1);

          box-shadow:
            0 20px 45px rgba(91,48,34,.08);

          animation: infoAppear .5s ease;
        }

        @keyframes infoAppear {
          from {
            opacity: .4;
            transform: translateY(8px);
          }

          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .tari-info::before {
          content: '✿';

          position: absolute;
          right: 30px;
          top: 10px;

          color: rgba(174,85,52,.09);
          font-size: 120px;

          animation: flowerFloat 4s ease-in-out infinite;
        }

        .tari-info-symbol {
          position: relative;
          z-index: 2;

          color: var(--gold);
          font-size: 30px;
        }

        .tari-info h3 {
          position: relative;
          z-index: 2;

          margin: 18px 0 4px;

          color: var(--brown-dark);
          font-family: 'Playfair Display', serif;
          font-size: clamp(35px, 4vw, 52px);
        }

        .tari-info-region {
          position: relative;
          z-index: 2;

          color: var(--terracotta);
          font-size: 11px;
          font-weight: 800;
          letter-spacing: 3px;
          text-transform: uppercase;
        }

        .tari-info p {
          position: relative;
          z-index: 2;

          max-width: 650px;
          margin: 25px 0 0;

          color: var(--muted);
          line-height: 1.85;
        }

        .tari-info-tag {
          position: relative;
          z-index: 2;

          display: inline-block;

          margin-top: 25px;
          padding: 9px 14px;

          background: var(--cream-dark);

          color: var(--brown);

          font-size: 10px;
          font-weight: 800;
          letter-spacing: 1.5px;
          text-transform: uppercase;
        }

        /* =========================================
           KEGIATAN
        ========================================= */

        .tri-kegiatan-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 12px;
        }

        .tri-kegiatan-item {
          position: relative;
          overflow: hidden;

          display: flex;
          gap: 20px;

          padding: 27px 30px;

          background: var(--paper);

          border: 1px solid rgba(91,48,34,.08);

          transition:
            transform .35s ease,
            box-shadow .35s ease,
            background .35s ease;
        }

        .tri-kegiatan-item::before {
          content: '';

          position: absolute;
          left: 0;
          bottom: 0;

          width: 0;
          height: 3px;

          background:
            linear-gradient(
              90deg,
              var(--terracotta),
              var(--gold)
            );

          transition: width .4s ease;
        }

        .tri-kegiatan-item:hover {
          transform: translateX(8px);
          background: #fffaf0;

          box-shadow:
            0 12px 30px rgba(91,48,34,.08);
        }

        .tri-kegiatan-item:hover::before {
          width: 100%;
        }

        .tri-kegiatan-no {
          flex-shrink: 0;

          color: rgba(174,85,52,.35);

          font-family: 'Bebas Neue', sans-serif;
          font-size: 32px;
          line-height: 1;
        }

        .tri-kegiatan-nama {
          color: var(--brown-dark);

          font-family: 'Barlow Condensed', sans-serif;
          font-size: 19px;
          font-weight: 800;
          letter-spacing: .5px;
          text-transform: uppercase;
        }

        .tri-kegiatan-detail {
          margin-top: 5px;

          color: var(--muted);

          font-size: 13px;
          line-height: 1.65;
        }

        /* =========================================
           QUOTE
        ========================================= */

        .tari-quote {
          position: relative;
          overflow: hidden;

          padding: 100px 25px;

          background: var(--brown-dark);

          color: var(--cream);

          text-align: center;
        }

        .tari-quote::before,
        .tari-quote::after {
          position: absolute;

          color: rgba(230,202,138,.12);

          font-size: 150px;
        }

        .tari-quote::before {
          content: '❋';
          left: 3%;
          top: 10%;

          animation: slowDance 8s linear infinite;
        }

        .tari-quote::after {
          content: '✿';
          right: 3%;
          bottom: 0;

          animation: slowDanceReverse 9s linear infinite;
        }

        @keyframes slowDance {
          from {
            transform: rotate(0);
          }

          to {
            transform: rotate(360deg);
          }
        }

        @keyframes slowDanceReverse {
          from {
            transform: rotate(360deg);
          }

          to {
            transform: rotate(0);
          }
        }

        .tari-quote-symbol {
          position: relative;

          color: var(--gold-light);
          font-size: 23px;

          animation: starPulse 2s ease-in-out infinite;
        }

        .tari-quote-text {
          position: relative;

          max-width: 800px;
          margin: 25px auto 0;

          font-family: 'Playfair Display', serif;
          font-size: clamp(27px, 4vw, 46px);
          line-height: 1.4;
        }

        .tari-quote-small {
          position: relative;

          margin-top: 22px;

          color: rgba(255,249,235,.55);

          font-size: 10px;
          font-weight: 700;
          letter-spacing: 3px;
          text-transform: uppercase;
        }

        /* =========================================
           RESPONSIVE
        ========================================= */

        @media (max-width: 768px) {
          .tri-stats {
            grid-template-columns: repeat(2, 1fr);
          }

          .tri-stat:nth-child(2) {
            border-right: none;
          }

          .tri-stat:nth-child(-n+2) {
            border-bottom: 1px solid rgba(174,85,52,.12);
          }

          .tri-tujuan-grid {
            grid-template-columns: 1fr;
          }

          .tari-budaya-grid {
            grid-template-columns: 1fr;
          }

          .tari-menu {
            display: grid;
            grid-template-columns: repeat(2, 1fr);
          }

          .tri-kegiatan-grid {
            grid-template-columns: 1fr;
          }

          .selendang {
            display: none;
          }
        }

        @media (max-width: 500px) {
          .tri-title {
            font-size: 70px;
          }

          .tri-subtitle {
            font-size: 14px;
          }

          .tri-stats {
            grid-template-columns: repeat(2, 1fr);
          }

          .tri-stat {
            padding: 25px 10px;
          }

          .tri-stat-num {
            font-size: 36px;
          }

          .tri-section-heading {
            font-size: 42px;
          }

          .tari-menu {
            grid-template-columns: 1fr 1fr;
          }

          .tari-info {
            padding: 30px;
          }

          .tari-info h3 {
            font-size: 34px;
          }
        }

        @media (prefers-reduced-motion: reduce) {
          *,
          *::before,
          *::after {
            animation-duration: .01ms !important;
            animation-iteration-count: 1 !important;
            scroll-behavior: auto !important;
            transition-duration: .01ms !important;
          }
        }
      `}</style>

      {/* Bunga / kelopak yang jatuh */}
      <div className="tari-petal petal-1">✿</div>
      <div className="tari-petal petal-2">❋</div>
      <div className="tari-petal petal-3">✦</div>
      <div className="tari-petal petal-4">✿</div>
      <div className="tari-petal petal-5">❋</div>

      <div className="tri-root">
        <Navbar />

        <main>
          {/* =====================================
              HERO
              Layout gambar SAMA seperti kode awal
          ====================================== */}

          <section className="tri-hero">
            <div className="tri-hero-img">
              <Image
                src="/images/tari.jpg"
                alt="Tari SMK Citra Negara"
                fill
                priority
              />

              <div className="tri-hero-overlay" />

              <div className="hero-motif hero-motif-left" />
              <div className="hero-motif hero-motif-right" />

              <div className="selendang" />
            </div>

            <div className="tri-hero-content">
              <div className="tri-eyebrow">
                Ekstrakurikuler SMK Citra Negara
              </div>

              <h1 className="tri-title">
                SENI <span>TARI</span>
              </h1>

              <p className="tri-subtitle">
                Menghidupkan gerak, menjaga tradisi, dan merayakan
                kekayaan budaya Nusantara melalui seni tari.
              </p>
            </div>
          </section>

          {/* =====================================
              STATS
          ====================================== */}

          <div className="tri-stats">
            {STATS.map((stat) => (
              <div className="tri-stat" key={stat.label}>
                <div className="tri-stat-num">{stat.angka}</div>
                <div className="tri-stat-label">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>

          {/* =====================================
              TUJUAN
          ====================================== */}

          <section className="tri-section">
            <div className="tri-section-label">
              Mengapa Seni Tari?
            </div>

            <h2 className="tri-section-heading">
              GERAK YANG BERMAKNA
            </h2>

            <div className="tri-tujuan-grid">
              {TUJUAN.map((item) => (
                <article
                  className="tri-tujuan-card"
                  key={item.judul}
                >
                  <div className="tri-tujuan-icon">
                    {item.icon}
                  </div>

                  <div className="tri-tujuan-title">
                    {item.judul}
                  </div>

                  <p className="tri-tujuan-desc">
                    {item.deskripsi}
                  </p>
                </article>
              ))}
            </div>
          </section>

          {/* DIVIDER */}

          <div className="tri-divider">
            <span />
            <span className="tri-divider-icon">✿</span>
            <span />
          </div>

          {/* =====================================
              TARI NUSANTARA
          ====================================== */}

          <section className="tari-budaya">
            <div className="tari-budaya-inner">
              <div className="tri-section-label">
                Kekayaan Budaya Indonesia
              </div>

              <h2 className="tri-section-heading">
                TARI NUSANTARA
              </h2>

              <div className="tari-budaya-grid">
                <div className="tari-menu">
                  {TARI.map((tari, index) => (
                    <button
                      key={tari.nama}
                      type="button"
                      className={`tari-menu-btn ${
                        activeTari === index ? 'active' : ''
                      }`}
                      onClick={() => setActiveTari(index)}
                    >
                      {tari.nama}
                    </button>
                  ))}
                </div>

                <div className="tari-info" key={activeTari}>
                  <div className="tari-info-symbol">
                    {activeTari === 0 && '❋'}
                    {activeTari === 1 && '✦'}
                    {activeTari === 2 && '❈'}
                    {activeTari === 3 && '✿'}
                  </div>

                  <h3>{TARI[activeTari].nama}</h3>

                  <div className="tari-info-region">
                    {TARI[activeTari].daerah}
                  </div>

                  <p>
                    {TARI[activeTari].deskripsi}
                  </p>

                  <span className="tari-info-tag">
                    Warisan Budaya Nusantara
                  </span>
                </div>
              </div>
            </div>
          </section>

          {/* =====================================
              KEGIATAN
          ====================================== */}

          <section className="tri-section">
            <div className="tri-section-label">
              Program Latihan
            </div>

            <h2 className="tri-section-heading">
              KEGIATAN RUTIN
            </h2>

            <div className="tri-kegiatan-grid">
              {KEGIATAN.map((item) => (
                <article
                  className="tri-kegiatan-item"
                  key={item.no}
                >
                  <div className="tri-kegiatan-no">
                    {item.no}
                  </div>

                  <div>
                    <div className="tri-kegiatan-nama">
                      {item.nama}
                    </div>

                    <div className="tri-kegiatan-detail">
                      {item.detail}
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </section>

          {/* =====================================
              QUOTE
          ====================================== */}

          <section className="tari-quote">
            <div className="tari-quote-symbol">✦</div>

            <div className="tari-quote-text">
              “Setiap gerakan memiliki cerita,
              setiap tarian membawa warisan.”
            </div>

            <div className="tari-quote-small">
              Seni Tari · SMK Citra Negara
            </div>
          </section>
        </main>

        <EskulMusic src="/audio/tarimodern.mp3" />
        <Footer />
      </div>
    </>
  );
}