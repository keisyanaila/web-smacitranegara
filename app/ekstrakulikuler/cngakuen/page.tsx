'use client';

import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import EskulMusic from '@/components/EskulMusic';
import { useState } from 'react';

const STATS = [
  { angka: '🇯🇵', label: 'Bahasa Jepang' },
  { angka: '5S', label: 'Etos Kerja Jepang' },
  { angka: '∞', label: 'Peluang Global' },
  { angka: 'CN', label: 'Gakuen' },
];

const TUJUAN = [
  {
    icon: 'あ',
    kanji: '日本語',
    judul: 'Penguasaan Bahasa Jepang',
    deskripsi:
      'Mengembangkan kemampuan mendengar, berbicara, membaca, dan menulis Bahasa Jepang, mulai dari Hiragana, Katakana, hingga Kanji.',
  },
  {
    icon: '和',
    kanji: '文化',
    judul: 'Pemahaman Lintas Budaya',
    deskripsi:
      'Mengenal budaya, tradisi, kebiasaan, dan kehidupan masyarakat Jepang untuk membangun wawasan global dan toleransi antarbudaya.',
  },
  {
    icon: '道',
    kanji: '未来',
    judul: 'Persiapan Karier Global',
    deskripsi:
      'Mempersiapkan siswa yang ingin melanjutkan studi atau membangun karier di Jepang melalui bekal bahasa, budaya, dan etos kerja.',
  },
  {
    icon: '五',
    kanji: '5S',
    judul: 'Disiplin & Etos Kerja',
    deskripsi:
      'Menerapkan nilai Seiri, Seiton, Seiso, Seiketsu, dan Shitsuke serta semangat Kaizen dalam kehidupan sehari-hari.',
  },
  {
    icon: '創',
    kanji: '創造',
    judul: 'Kreativitas',
    deskripsi:
      'Mengeksplorasi sisi kreatif budaya Jepang melalui seni tradisional, budaya pop, literatur, film, anime, dan berbagai kegiatan budaya.',
  },
  {
    icon: '🌸',
    kanji: '交流',
    judul: 'Persahabatan Internasional',
    deskripsi:
      'Membangun keberanian berkomunikasi dan membuka wawasan siswa terhadap lingkungan pendidikan serta profesional di Jepang.',
  },
];

const KEGIATAN = [
  {
    no: '01',
    icon: 'あ',
    nama: 'Kelas Bahasa Jepang',
    jp: '日本語教室',
    detail:
      'Mempelajari Bunpou, Kaiwa, Hiragana, Katakana, Kanji, serta latihan komunikasi sehari-hari yang dapat menjadi bekal menghadapi JLPT atau NAT-TEST.',
  },
  {
    no: '02',
    icon: '折',
    nama: 'Workshop Budaya Jepang',
    jp: '日本文化',
    detail:
      'Mengenal Origami, Shodo, Yukata, Reigi Sahou, tradisi, makanan, hingga berbagai kebiasaan masyarakat Jepang.',
  },
  {
    no: '03',
    icon: '礼',
    nama: 'Simulasi Etika Kerja',
    jp: '仕事のマナー',
    detail:
      'Berlatih Aisatsu, etika berkomunikasi, ketepatan waktu, pertukaran kartu nama, hingga simulasi wawancara kerja.',
  },
  {
    no: '04',
    icon: '🎬',
    nama: 'Anime, Film & Literatur',
    jp: 'アニメ・映画・文学',
    detail:
      'Membedah anime, manga, film, dan literatur Jepang untuk memahami bahasa, nilai moral, serta konteks sosial masyarakat Jepang.',
  },
  {
    no: '05',
    icon: '祭',
    nama: 'Bunkasai',
    jp: '文化祭',
    detail:
      'Merancang festival budaya Jepang di sekolah sebagai wadah kreativitas, kerja sama, kepemimpinan, dan manajemen acara.',
  },
  {
    no: '06',
    icon: '夢',
    nama: 'Sharing Session',
    jp: '交流会',
    detail:
      'Mendapatkan informasi mengenai beasiswa, program magang, Tokutei Ginou, Ginou Jisshu, pendidikan, pekerjaan, dan kehidupan di Jepang.',
  },
];

const BUDAYA = [
  {
    kanji: '折',
    nama: 'Origami',
    jp: 'おりがみ',
    deskripsi:
      'Mengenal seni melipat kertas Jepang yang sederhana tetapi membutuhkan ketelitian, kreativitas, dan kesabaran.',
  },
  {
    kanji: '書',
    nama: 'Shodo',
    jp: '書道',
    deskripsi:
      'Mengenal seni kaligrafi Jepang sekaligus belajar mengenai ketelitian, keseimbangan, dan filosofi di balik setiap karakter.',
  },
  {
    kanji: '浴',
    nama: 'Yukata',
    jp: 'ゆかた',
    deskripsi:
      'Mengenal pakaian tradisional Jepang yang sering digunakan dalam festival musim panas serta mempelajari tata cara penggunaannya.',
  },
  {
    kanji: '礼',
    nama: 'Reigi Sahou',
    jp: '礼儀作法',
    deskripsi:
      'Mempelajari tata krama dan etika Jepang seperti membungkuk, memberi salam, sopan santun, dan menghargai orang lain.',
  },
];

export default function CNGakuenPage() {
  const [activeBudaya, setActiveBudaya] = useState(0);

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Noto+Sans+JP:wght@400;500;600;700;800;900&family=Noto+Serif+JP:wght@600;700;800;900&family=Bebas+Neue&family=Barlow+Condensed:wght@600;700;800&display=swap');

        * {
          box-sizing: border-box;
        }

        :root {
          --sakura: #e99aa7;
          --sakura-light: #f8dce1;
          --sakura-dark: #c96779;

          --vermilion: #c93b32;
          --vermilion-dark: #8f211e;

          --indigo: #172b4d;
          --indigo-light: #29466f;
          --navy: #0d1b2e;

          --cream: #fffaf1;
          --washi: #fffdf8;
          --paper: #f8f0df;

          --gold: #c79b45;
          --gold-light: #e8cc8b;

          --text: #302a28;
          --muted: #746963;
        }

        .gakuen-root {
          min-height: 100vh;
          overflow: hidden;
          background: var(--cream);
          color: var(--text);
          font-family: 'Noto Sans JP', sans-serif;
        }

        /* =========================================
           SAKURA FALL
        ========================================= */

        .sakura {
          position: fixed;
          z-index: 50;
          top: -40px;
          pointer-events: none;
          user-select: none;
          color: var(--sakura);
          font-size: 17px;
          opacity: .75;
          animation: sakuraFall linear infinite;
        }

        .sakura-1 {
          left: 5%;
          animation-duration: 11s;
          animation-delay: -3s;
        }

        .sakura-2 {
          left: 18%;
          font-size: 11px;
          animation-duration: 14s;
          animation-delay: -8s;
        }

        .sakura-3 {
          left: 34%;
          font-size: 20px;
          animation-duration: 12s;
          animation-delay: -5s;
        }

        .sakura-4 {
          left: 57%;
          font-size: 13px;
          animation-duration: 15s;
          animation-delay: -10s;
        }

        .sakura-5 {
          left: 76%;
          font-size: 19px;
          animation-duration: 10s;
          animation-delay: -4s;
        }

        .sakura-6 {
          left: 93%;
          font-size: 12px;
          animation-duration: 13s;
          animation-delay: -7s;
        }

        @keyframes sakuraFall {
          0% {
            transform:
              translate3d(0, -30px, 0)
              rotate(0deg);
            opacity: 0;
          }

          10% {
            opacity: .8;
          }

          30% {
            transform:
              translate3d(45px, 30vh, 0)
              rotate(100deg);
          }

          55% {
            transform:
              translate3d(-35px, 55vh, 0)
              rotate(220deg);
          }

          80% {
            transform:
              translate3d(50px, 80vh, 0)
              rotate(300deg);
          }

          100% {
            transform:
              translate3d(-20px, 110vh, 0)
              rotate(420deg);
            opacity: 0;
          }
        }

        /* =========================================
           HERO
        ========================================= */

        .gk-hero {
          position: relative;
          min-height: min(78vh, 720px);
          overflow: hidden;

          background:
            linear-gradient(
              120deg,
              rgba(8,20,38,.95),
              rgba(23,43,77,.7),
              rgba(201,59,50,.3)
            ),
            url('/images/eskul/eskulgakuen.png');

          background-size: cover;
          background-position: center;
        }

        .gk-hero::before {
          content: '';

          position: absolute;
          inset: 0;

          background:
            repeating-linear-gradient(
              0deg,
              rgba(255,255,255,.025) 0,
              rgba(255,255,255,.025) 1px,
              transparent 1px,
              transparent 5px
            );

          opacity: .45;
          pointer-events: none;
        }

        /* Japanese wave pattern */

        .seigaiha {
          position: absolute;
          inset: 0;

          opacity: .13;
          pointer-events: none;

          background-image:
            radial-gradient(
              circle at 50% 100%,
              transparent 0 17px,
              rgba(255,255,255,.7) 18px 19px,
              transparent 20px 27px,
              rgba(255,255,255,.7) 28px 29px,
              transparent 30px
            );

          background-size: 56px 28px;
          background-position: 0 0;
          mask-image: linear-gradient(
            to top,
            black,
            transparent 75%
          );
        }

        .hero-torii {
          position: absolute;
          right: 7%;
          top: 9%;

          width: 170px;
          height: 190px;

          opacity: .18;
          transform: scale(.9);
        }

        .hero-torii::before {
          content: '';

          position: absolute;
          left: 20px;
          right: 20px;
          top: 25px;

          height: 14px;

          background: var(--sakura-light);
          box-shadow:
            0 -14px 0 -2px var(--sakura-light),
            0 145px 0 -3px var(--sakura-light);
        }

        .hero-torii::after {
          content: '';

          position: absolute;
          left: 42px;
          top: 35px;

          width: 20px;
          height: 145px;

          background: var(--sakura-light);

          box-shadow:
            66px 0 0 var(--sakura-light);
        }

        .hero-kanji {
          position: absolute;
          right: 12%;
          bottom: 13%;

          color: rgba(255,255,255,.09);

          font-family: 'Noto Serif JP', serif;
          font-size: clamp(130px, 18vw, 260px);
          font-weight: 900;

          line-height: 1;
          writing-mode: vertical-rl;
        }

        .gk-hero-overlay {
          position: absolute;
          inset: 0;

          background:
            linear-gradient(
              to right,
              rgba(8,20,38,.95) 0%,
              rgba(8,20,38,.72) 42%,
              rgba(8,20,38,.18) 100%
            );
        }

        .gk-hero-content {
          position: relative;
          z-index: 5;

          display: flex;
          flex-direction: column;
          justify-content: flex-end;

          min-height: min(78vh, 720px);

          max-width: 1200px;
          margin: auto;

          padding:
            90px
            clamp(25px, 7vw, 90px)
            clamp(60px, 9vw, 105px);
        }

        .gk-japanese {
          display: flex;
          align-items: center;
          gap: 15px;

          margin-bottom: 16px;

          color: var(--gold-light);

          font-family: 'Noto Serif JP', serif;
          font-size: 18px;
          font-weight: 700;
          letter-spacing: 5px;

          animation: heroIn .8s ease both;
        }

        .gk-japanese::before {
          content: '';

          width: 48px;
          height: 2px;

          background: var(--vermilion);
        }

        .gk-eyebrow {
          color: var(--sakura-light);

          font-family: 'Barlow Condensed', sans-serif;
          font-size: 13px;
          font-weight: 800;
          letter-spacing: 4px;

          text-transform: uppercase;

          animation: heroIn .9s .1s ease both;
        }

        .gk-title {
          margin: 12px 0 10px;

          color: white;

          font-family: 'Noto Serif JP', serif;
          font-size: clamp(50px, 8vw, 100px);
          font-weight: 900;

          line-height: 1;
          letter-spacing: -2px;

          animation: heroTitle 1s cubic-bezier(.2,.8,.2,1) both;
        }

        .gk-title span {
          color: var(--sakura-light);
        }

        .gk-title-en {
          margin-bottom: 25px;

          color: var(--vermilion);

          font-family: 'Bebas Neue', sans-serif;
          font-size: clamp(52px, 8vw, 92px);

          letter-spacing: 6px;
          line-height: .8;

          text-shadow:
            0 5px 25px rgba(0,0,0,.3);

          animation: heroTitle 1s .12s cubic-bezier(.2,.8,.2,1) both;
        }

        .gk-subtitle {
          max-width: 690px;

          margin: 0;

          color: rgba(255,255,255,.78);

          font-size: clamp(14px, 1.7vw, 17px);
          line-height: 1.9;

          animation: heroIn 1s .25s ease both;
        }

        .gk-hero-badge {
          position: absolute;
          right: clamp(25px, 7vw, 90px);
          bottom: 75px;

          z-index: 5;

          display: grid;
          place-items: center;

          width: 110px;
          height: 110px;

          border: 1px solid rgba(255,255,255,.3);
          border-radius: 50%;

          color: white;

          font-family: 'Noto Serif JP', serif;
          font-size: 12px;
          font-weight: 700;

          text-align: center;

          backdrop-filter: blur(4px);

          animation:
            badgeFloat 4s ease-in-out infinite;
        }

        .gk-hero-badge strong {
          display: block;

          color: var(--gold-light);

          font-size: 28px;
        }

        @keyframes heroIn {
          from {
            opacity: 0;
            transform: translateY(20px);
          }

          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes heroTitle {
          from {
            opacity: 0;
            transform:
              translateY(40px)
              scale(.96);
          }

          to {
            opacity: 1;
            transform:
              translateY(0)
              scale(1);
          }
        }

        @keyframes badgeFloat {
          0%, 100% {
            transform: translateY(0) rotate(0);
          }

          50% {
            transform: translateY(-10px) rotate(3deg);
          }
        }

        /* =========================================
           STATS
        ========================================= */

        .gk-stats {
          position: relative;
          z-index: 10;

          display: grid;
          grid-template-columns: repeat(4, 1fr);

          background: var(--washi);

          border-top: 4px solid var(--vermilion);
          border-bottom: 1px solid rgba(23,43,77,.15);
        }

        .gk-stat {
          position: relative;

          padding: 28px 20px;

          text-align: center;

          border-right: 1px solid rgba(23,43,77,.12);

          transition:
            transform .35s ease,
            background .35s ease;
        }

        .gk-stat:last-child {
          border-right: none;
        }

        .gk-stat:hover {
          background: var(--sakura-light);
          transform: translateY(-5px);
        }

        .gk-stat::before {
          content: '桜';

          position: absolute;
          top: 7px;
          left: 50%;

          color: rgba(201,59,50,.22);

          font-family: 'Noto Serif JP', serif;
          font-size: 10px;

          transform: translateX(-50%);
        }

        .gk-stat-number {
          color: var(--vermilion);

          font-family: 'Bebas Neue', sans-serif;
          font-size: 46px;
          line-height: 1;
        }

        .gk-stat-label {
          margin-top: 8px;

          color: var(--indigo);

          font-size: 10px;
          font-weight: 800;
          letter-spacing: 2px;
          text-transform: uppercase;
        }

        /* =========================================
           SECTION
        ========================================= */

        .gk-section {
          position: relative;

          max-width: 1200px;
          margin: auto;

          padding:
            clamp(70px, 9vw, 110px)
            clamp(25px, 7vw, 90px);
        }

        .gk-section-label {
          display: flex;
          align-items: center;
          gap: 12px;

          color: var(--vermilion);

          font-family: 'Barlow Condensed', sans-serif;
          font-size: 12px;
          font-weight: 800;
          letter-spacing: 4px;

          text-transform: uppercase;
        }

        .gk-section-label::before {
          content: '鳥居';

          color: var(--indigo);

          font-family: 'Noto Serif JP', serif;
          font-size: 12px;
        }

        .gk-heading {
          margin: 10px 0 45px;

          color: var(--indigo);

          font-family: 'Noto Serif JP', serif;
          font-size: clamp(36px, 5.5vw, 68px);
          font-weight: 900;

          line-height: 1.2;
          letter-spacing: -1px;
        }

        .gk-heading span {
          display: block;

          margin-top: 4px;

          color: var(--sakura);

          font-family: 'Bebas Neue', sans-serif;
          font-size: .48em;
          letter-spacing: 5px;
        }

        /* =========================================
           INTRO
        ========================================= */

        .gk-intro {
          display: grid;
          grid-template-columns: 1fr 1.15fr;
          gap: 70px;

          align-items: center;
        }

        .gk-intro-symbol {
          position: relative;

          display: grid;
          place-items: center;

          min-height: 420px;

          background:
            linear-gradient(
              135deg,
              var(--indigo),
              var(--navy)
            );

          overflow: hidden;
        }

        .gk-intro-symbol::before {
          content: '日本';

          position: absolute;

          color: rgba(255,255,255,.035);

          font-family: 'Noto Serif JP', serif;
          font-size: 190px;
          font-weight: 900;

          writing-mode: vertical-rl;
        }

        .gk-circle {
          position: relative;
          z-index: 2;

          display: grid;
          place-items: center;

          width: 210px;
          height: 210px;

          border: 1px solid var(--gold);
          border-radius: 50%;
        }

        .gk-circle::before {
          content: '';

          position: absolute;

          width: 165px;
          height: 165px;

          border: 1px solid rgba(232,204,139,.45);
          border-radius: 50%;
        }

        .gk-circle-text {
          color: white;

          font-family: 'Noto Serif JP', serif;
          font-size: 54px;
          font-weight: 900;
        }

        .gk-circle-small {
          position: absolute;
          bottom: 48px;

          color: var(--gold-light);

          font-size: 9px;
          font-weight: 800;
          letter-spacing: 4px;
        }

        .gk-intro-copy h3 {
          margin: 0 0 20px;

          color: var(--indigo);

          font-family: 'Noto Serif JP', serif;
          font-size: clamp(26px, 3vw, 40px);
          font-weight: 800;
          line-height: 1.45;
        }

        .gk-intro-copy h3 span {
          color: var(--vermilion);
        }

        .gk-intro-copy p {
          margin: 0 0 18px;

          color: var(--muted);

          font-size: 15px;
          line-height: 2;
        }

        .gk-jp-quote {
          margin-top: 25px;
          padding: 18px 20px;

          border-left: 4px solid var(--vermilion);

          background: var(--paper);

          color: var(--indigo);

          font-family: 'Noto Serif JP', serif;
          font-size: 15px;
          font-weight: 700;
        }

        /* =========================================
           TUJUAN
        ========================================= */

        .gk-tujuan-section {
          position: relative;

          background:
            linear-gradient(
              90deg,
              rgba(23,43,77,.03) 1px,
              transparent 1px
            ),
            linear-gradient(
              rgba(23,43,77,.03) 1px,
              transparent 1px
            ),
            var(--paper);

          background-size: 35px 35px;
        }

        .gk-tujuan-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 18px;
        }

        .gk-card {
          position: relative;
          overflow: hidden;

          min-height: 330px;
          padding: 30px;

          background: rgba(255,253,248,.92);

          border:
            1px solid rgba(23,43,77,.13);

          transition:
            transform .45s cubic-bezier(.2,.8,.2,1),
            box-shadow .45s ease,
            border-color .35s ease;
        }

        .gk-card::before {
          content: '';

          position: absolute;
          left: 0;
          top: 0;

          width: 5px;
          height: 0;

          background: var(--vermilion);

          transition: height .5s ease;
        }

        .gk-card::after {
          content: attr(data-kanji);

          position: absolute;
          right: -15px;
          bottom: -30px;

          color: rgba(23,43,77,.035);

          font-family: 'Noto Serif JP', serif;
          font-size: 130px;
          font-weight: 900;

          transition:
            transform .6s ease,
            color .4s ease;
        }

        .gk-card:hover {
          transform: translateY(-10px);

          border-color: rgba(201,59,50,.3);

          box-shadow:
            0 25px 50px rgba(13,27,46,.12);
        }

        .gk-card:hover::before {
          height: 100%;
        }

        .gk-card:hover::after {
          transform: rotate(-8deg) scale(1.08);
          color: rgba(201,59,50,.06);
        }

        .gk-card-icon {
          position: relative;
          z-index: 2;

          display: grid;
          place-items: center;

          width: 58px;
          height: 58px;

          background: var(--indigo);

          color: var(--gold-light);

          font-family: 'Noto Serif JP', serif;
          font-size: 23px;

          border-radius: 50%;

          transition:
            transform .4s ease,
            background .3s ease;
        }

        .gk-card:hover .gk-card-icon {
          background: var(--vermilion);
          transform: rotate(8deg) scale(1.1);
        }

        .gk-card-kanji {
          position: relative;
          z-index: 2;

          margin-top: 25px;

          color: var(--sakura);

          font-family: 'Noto Serif JP', serif;
          font-size: 12px;
          font-weight: 800;
          letter-spacing: 4px;
        }

        .gk-card-title {
          position: relative;
          z-index: 2;

          margin-top: 6px;

          color: var(--indigo);

          font-family: 'Noto Serif JP', serif;
          font-size: 18px;
          font-weight: 800;
        }

        .gk-card-desc {
          position: relative;
          z-index: 2;

          margin-top: 13px;

          color: var(--muted);

          font-size: 13px;
          line-height: 1.85;
        }

        /* =========================================
           RED SUN / DIVIDER
        ========================================= */

        .gk-divider {
          display: flex;
          align-items: center;
          gap: 20px;

          max-width: 1100px;
          margin: 0 auto;
          padding: 0 25px;
        }

        .gk-divider-line {
          flex: 1;
          height: 1px;

          background:
            repeating-linear-gradient(
              90deg,
              var(--vermilion) 0 7px,
              transparent 7px 13px
            );
        }

        .gk-divider-sun {
          display: grid;
          place-items: center;

          width: 32px;
          height: 32px;

          background: var(--vermilion);

          border-radius: 50%;

          color: white;

          font-family: 'Noto Serif JP', serif;
          font-size: 13px;

          animation: sunSpin 7s linear infinite;
        }

        @keyframes sunSpin {
          from {
            transform: rotate(0);
          }

          to {
            transform: rotate(360deg);
          }
        }

        /* =========================================
           BUDAYA
        ========================================= */

        .gk-budaya-section {
          background:
            radial-gradient(
              circle at 85% 20%,
              rgba(233,154,167,.22),
              transparent 22%
            ),
            var(--cream);
        }

        .gk-budaya-grid {
          display: grid;
          grid-template-columns: 280px 1fr;
          gap: 35px;
        }

        .gk-budaya-menu {
          display: flex;
          flex-direction: column;
          gap: 7px;
        }

        .gk-budaya-btn {
          position: relative;

          padding: 19px 20px;

          border: 1px solid transparent;

          background: transparent;

          color: var(--muted);

          font-family: 'Noto Serif JP', serif;
          font-size: 14px;
          font-weight: 700;

          text-align: left;

          cursor: pointer;

          transition: all .3s ease;
        }

        .gk-budaya-btn::before {
          content: '';

          position: absolute;
          left: 0;
          top: 50%;

          width: 0;
          height: 3px;

          background: var(--vermilion);

          transform: translateY(-50%);

          transition: width .3s ease;
        }

        .gk-budaya-btn:hover {
          padding-left: 28px;

          background: rgba(233,154,167,.12);

          color: var(--indigo);
        }

        .gk-budaya-btn.active {
          padding-left: 35px;

          background: var(--washi);

          border-color: rgba(201,59,50,.18);

          color: var(--vermilion);

          box-shadow:
            0 12px 30px rgba(13,27,46,.08);
        }

        .gk-budaya-btn.active::before {
          width: 20px;
        }

        .gk-budaya-info {
          position: relative;
          overflow: hidden;

          min-height: 380px;
          padding: 50px;

          background: var(--indigo);

          color: white;

          box-shadow:
            0 25px 55px rgba(13,27,46,.16);

          animation: infoIn .45s ease;
        }

        @keyframes infoIn {
          from {
            opacity: 0;
            transform: translateY(10px);
          }

          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .gk-budaya-info::before {
          content: '和';

          position: absolute;
          right: -20px;
          top: -65px;

          color: rgba(255,255,255,.035);

          font-family: 'Noto Serif JP', serif;
          font-size: 260px;
          font-weight: 900;
        }

        .gk-info-kanji {
          position: relative;
          z-index: 2;

          color: var(--gold-light);

          font-family: 'Noto Serif JP', serif;
          font-size: 50px;
          font-weight: 900;
        }

        .gk-info-jp {
          position: relative;
          z-index: 2;

          margin-top: 5px;

          color: var(--sakura-light);

          font-size: 13px;
          letter-spacing: 3px;
        }

        .gk-info-title {
          position: relative;
          z-index: 2;

          margin: 18px 0 4px;

          color: white;

          font-family: 'Noto Serif JP', serif;
          font-size: clamp(35px, 4vw, 55px);
          font-weight: 900;
        }

        .gk-info-desc {
          position: relative;
          z-index: 2;

          max-width: 650px;

          margin-top: 22px;

          color: rgba(255,255,255,.7);

          font-size: 14px;
          line-height: 1.9;
        }

        .gk-info-tag {
          position: relative;
          z-index: 2;

          display: inline-block;

          margin-top: 25px;
          padding: 9px 15px;

          background: var(--vermilion);

          color: white;

          font-size: 9px;
          font-weight: 800;
          letter-spacing: 2px;
          text-transform: uppercase;
        }

        /* =========================================
           KEGIATAN
        ========================================= */

        .gk-kegiatan-section {
          background: var(--paper);
        }

        .gk-kegiatan-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 12px;
        }

        .gk-kegiatan {
          position: relative;
          overflow: hidden;

          display: flex;
          gap: 20px;

          padding: 28px;

          background: var(--washi);

          border:
            1px solid rgba(23,43,77,.1);

          transition:
            transform .35s ease,
            box-shadow .35s ease,
            border-color .35s ease;
        }

        .gk-kegiatan::before {
          content: '';

          position: absolute;
          left: 0;
          bottom: 0;

          width: 0;
          height: 4px;

          background:
            linear-gradient(
              90deg,
              var(--vermilion),
              var(--sakura),
              var(--gold)
            );

          transition: width .45s ease;
        }

        .gk-kegiatan:hover {
          transform: translateX(8px);

          border-color: rgba(201,59,50,.2);

          box-shadow:
            0 15px 35px rgba(13,27,46,.08);
        }

        .gk-kegiatan:hover::before {
          width: 100%;
        }

        .gk-kegiatan-icon {
          flex-shrink: 0;

          display: grid;
          place-items: center;

          width: 48px;
          height: 48px;

          background: var(--sakura-light);

          color: var(--vermilion);

          font-family: 'Noto Serif JP', serif;
          font-size: 20px;

          border-radius: 50%;
        }

        .gk-kegiatan-no {
          color: rgba(23,43,77,.35);

          font-family: 'Bebas Neue', sans-serif;
          font-size: 28px;
        }

        .gk-kegiatan-name {
          color: var(--indigo);

          font-family: 'Noto Serif JP', serif;
          font-size: 17px;
          font-weight: 800;
        }

        .gk-kegiatan-jp {
          margin-top: 3px;

          color: var(--vermilion);

          font-size: 10px;
          font-weight: 800;
          letter-spacing: 2px;
        }

        .gk-kegiatan-detail {
          margin-top: 8px;

          color: var(--muted);

          font-size: 13px;
          line-height: 1.75;
        }

        /* =========================================
           5S / KAIZEN
        ========================================= */

        .gk-values {
          position: relative;
          overflow: hidden;

          background: var(--vermilion);

          color: white;
        }

        .gk-values::before {
          content: '改善';

          position: absolute;
          right: 4%;
          bottom: -70px;

          color: rgba(255,255,255,.07);

          font-family: 'Noto Serif JP', serif;
          font-size: 260px;
          font-weight: 900;
        }

        .gk-values-inner {
          position: relative;
          z-index: 2;

          max-width: 1200px;
          margin: auto;

          padding:
            90px
            clamp(25px, 7vw, 90px);
        }

        .gk-values-label {
          color: var(--gold-light);

          font-family: 'Barlow Condensed', sans-serif;
          font-size: 12px;
          font-weight: 800;
          letter-spacing: 4px;
          text-transform: uppercase;
        }

        .gk-values-title {
          max-width: 700px;

          margin: 10px 0 40px;

          font-family: 'Noto Serif JP', serif;
          font-size: clamp(35px, 5vw, 62px);
          font-weight: 900;

          line-height: 1.35;
        }

        .gk-values-title span {
          color: var(--gold-light);
        }

        .gk-values-grid {
          display: grid;
          grid-template-columns: repeat(6, 1fr);
          gap: 10px;
        }

        .gk-value {
          padding: 22px 15px;

          background: rgba(255,255,255,.1);

          border:
            1px solid rgba(255,255,255,.15);

          text-align: center;

          transition:
            background .3s ease,
            transform .3s ease;
        }

        .gk-value:hover {
          background: rgba(255,255,255,.18);
          transform: translateY(-7px);
        }

        .gk-value-kanji {
          color: var(--gold-light);

          font-family: 'Noto Serif JP', serif;
          font-size: 28px;
          font-weight: 900;
        }

        .gk-value-name {
          margin-top: 8px;

          font-size: 10px;
          font-weight: 800;
          letter-spacing: 1px;
        }

        /* =========================================
           QUOTE
        ========================================= */

        .gk-quote {
          position: relative;
          overflow: hidden;

          padding: 110px 25px;

          background:
            linear-gradient(
              rgba(13,27,46,.94),
              rgba(13,27,46,.97)
            );

          color: white;

          text-align: center;
        }

        .gk-quote::before {
          content: '桜';

          position: absolute;
          left: 4%;
          top: -30px;

          color: rgba(233,154,167,.07);

          font-family: 'Noto Serif JP', serif;
          font-size: 250px;
          font-weight: 900;
        }

        .gk-quote::after {
          content: '日本';

          position: absolute;
          right: 3%;
          bottom: -80px;

          color: rgba(255,255,255,.035);

          font-family: 'Noto Serif JP', serif;
          font-size: 250px;
          font-weight: 900;
        }

        .gk-quote-symbol {
          position: relative;

          color: var(--gold-light);

          font-family: 'Noto Serif JP', serif;
          font-size: 25px;
        }

        .gk-quote-jp {
          position: relative;

          margin-top: 20px;

          color: var(--sakura-light);

          font-family: 'Noto Serif JP', serif;
          font-size: clamp(20px, 3vw, 30px);
          font-weight: 700;

          letter-spacing: 3px;
        }

        .gk-quote-text {
          position: relative;

          max-width: 850px;

          margin: 15px auto 0;

          font-family: 'Noto Serif JP', serif;
          font-size: clamp(25px, 4vw, 44px);
          font-weight: 800;

          line-height: 1.55;
        }

        .gk-quote-small {
          position: relative;

          margin-top: 25px;

          color: rgba(255,255,255,.45);

          font-size: 10px;
          font-weight: 700;
          letter-spacing: 4px;
          text-transform: uppercase;
        }

        /* =========================================
           RESPONSIVE
        ========================================= */

        @media (max-width: 900px) {
          .gk-intro {
            grid-template-columns: 1fr;
            gap: 35px;
          }

          .gk-intro-symbol {
            min-height: 330px;
          }

          .gk-tujuan-grid {
            grid-template-columns: repeat(2, 1fr);
          }

          .gk-values-grid {
            grid-template-columns: repeat(3, 1fr);
          }
        }

        @media (max-width: 768px) {
          .gk-stats {
            grid-template-columns: repeat(2, 1fr);
          }

          .gk-stat:nth-child(2) {
            border-right: none;
          }

          .gk-stat:nth-child(-n+2) {
            border-bottom: 1px solid rgba(23,43,77,.12);
          }

          .gk-budaya-grid {
            grid-template-columns: 1fr;
          }

          .gk-budaya-menu {
            display: grid;
            grid-template-columns: repeat(2, 1fr);
          }

          .gk-kegiatan-grid {
            grid-template-columns: 1fr;
          }

          .gk-hero-badge {
            display: none;
          }

          .hero-torii {
            right: -40px;
            opacity: .12;
          }
        }

        @media (max-width: 560px) {
          .gk-tujuan-grid {
            grid-template-columns: 1fr;
          }

          .gk-values-grid {
            grid-template-columns: repeat(2, 1fr);
          }

          .gk-budaya-menu {
            grid-template-columns: 1fr 1fr;
          }

          .gk-budaya-info {
            padding: 32px;
          }

          .gk-intro-symbol {
            min-height: 290px;
          }

          .gk-circle {
            width: 175px;
            height: 175px;
          }

          .gk-circle::before {
            width: 140px;
            height: 140px;
          }

          .gk-circle-text {
            font-size: 44px;
          }

          .gk-title {
            font-size: 48px;
          }

          .gk-title-en {
            font-size: 55px;
            letter-spacing: 4px;
          }

          .gk-subtitle {
            font-size: 13px;
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

      {/* SAKURA JATUH */}
      <div className="sakura sakura-1">🌸</div>
      <div className="sakura sakura-2">✿</div>
      <div className="sakura sakura-3">🌸</div>
      <div className="sakura sakura-4">✿</div>
      <div className="sakura sakura-5">🌸</div>
      <div className="sakura sakura-6">✿</div>

      <div className="gakuen-root">
        <Navbar />

        <main>
          {/* =====================================
              HERO
          ====================================== */}

          <section className="gk-hero">
            <div className="seigaiha" />
            <div className="gk-hero-overlay" />

            <div className="hero-torii" />

            <div className="hero-kanji">
              学
            </div>

            <div className="gk-hero-content">
              <div className="gk-japanese">
                日本文化交流
              </div>

              <div className="gk-eyebrow">
                Ekstrakurikuler SMK Citra Negara
              </div>

              <h1 className="gk-title">
                CN <span>学園</span>
              </h1>

              <div className="gk-title-en">
                CN GAKUEN
              </div>

              <p className="gk-subtitle">
                Wadah bagi siswa yang ingin mengenal Jepang lebih
                dalam melalui bahasa, budaya, kreativitas, serta
                persiapan menuju peluang pendidikan dan karier
                internasional.
              </p>
            </div>

            <div className="gk-hero-badge">
              <div>
                <strong>和</strong>
                HARMONY
                <br />
                CULTURE
              </div>
            </div>
          </section>

          {/* =====================================
              STATS
          ====================================== */}

          <div className="gk-stats">
            {STATS.map((stat) => (
              <div className="gk-stat" key={stat.label}>
                <div className="gk-stat-number">
                  {stat.angka}
                </div>

                <div className="gk-stat-label">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>

          {/* =====================================
              INTRO
          ====================================== */}

          <section className="gk-section">
            <div className="gk-section-label">
              CN Gakuen
            </div>

            <h2 className="gk-heading">
              日本を知る
              <span>Mengenal Jepang, Membuka Dunia</span>
            </h2>

            <div className="gk-intro">
              <div className="gk-intro-symbol">
                <div className="gk-circle">
                  <div className="gk-circle-text">
                    日
                  </div>
                </div>

                <div className="gk-circle-small">
                  CN CITRA NEGARA · GAKUEN
                </div>
              </div>

              <div className="gk-intro-copy">
                <h3>
                  Bukan hanya tentang
                  <span> Jepang.</span>
                </h3>

                <p>
                  CN Gakuen merupakan wadah bagi siswa yang
                  memiliki ketertarikan terhadap Jepang, baik
                  dari segi bahasa, budaya, maupun peluang
                  pendidikan dan karier.
                </p>

                <p>
                  Melalui berbagai kegiatan, siswa tidak hanya
                  mengenal budaya populer Jepang, tetapi juga
                  membangun kemampuan komunikasi, kedisiplinan,
                  kreativitas, dan etos kerja yang dapat menjadi
                  bekal menghadapi dunia profesional.
                </p>

                <div className="gk-jp-quote">
                  学ぶことは、未来への一歩。
                  <br />
                  <small>
                    Belajar adalah satu langkah menuju masa depan.
                  </small>
                </div>
              </div>
            </div>
          </section>

          {/* =====================================
              TUJUAN
          ====================================== */}

          <section className="gk-tujuan-section">
            <div className="gk-section">
              <div className="gk-section-label">
                Tujuan Ekstrakurikuler
              </div>

              <h2 className="gk-heading">
                6 PILAR CN GAKUEN
                <span>Belajar · Berkembang · Berkarya</span>
              </h2>

              <div className="gk-tujuan-grid">
                {TUJUAN.map((item) => (
                  <article
                    className="gk-card"
                    data-kanji={item.kanji}
                    key={item.judul}
                  >
                    <div className="gk-card-icon">
                      {item.icon}
                    </div>

                    <div className="gk-card-kanji">
                      {item.kanji}
                    </div>

                    <div className="gk-card-title">
                      {item.judul}
                    </div>

                    <p className="gk-card-desc">
                      {item.deskripsi}
                    </p>
                  </article>
                ))}
              </div>
            </div>
          </section>

          {/* =====================================
              DIVIDER
          ====================================== */}

          <div className="gk-divider">
            <div className="gk-divider-line" />
            <div className="gk-divider-sun">
              日
            </div>
            <div className="gk-divider-line" />
          </div>

          {/* =====================================
              BUDAYA JEPANG
          ====================================== */}

          <section className="gk-budaya-section">
            <div className="gk-section">
              <div className="gk-section-label">
                Japanese Culture
              </div>

              <h2 className="gk-heading">
                日本文化
                <span>Eksplorasi Budaya Jepang</span>
              </h2>

              <div className="gk-budaya-grid">
                <div className="gk-budaya-menu">
                  {BUDAYA.map((item, index) => (
                    <button
                      key={item.nama}
                      type="button"
                      className={`gk-budaya-btn ${
                        activeBudaya === index
                          ? 'active'
                          : ''
                      }`}
                      onClick={() =>
                        setActiveBudaya(index)
                      }
                    >
                      {item.nama}
                    </button>
                  ))}
                </div>

                <div
                  className="gk-budaya-info"
                  key={activeBudaya}
                >
                  <div className="gk-info-kanji">
                    {BUDAYA[activeBudaya].kanji}
                  </div>

                  <div className="gk-info-jp">
                    {BUDAYA[activeBudaya].jp}
                  </div>

                  <h3 className="gk-info-title">
                    {BUDAYA[activeBudaya].nama}
                  </h3>

                  <p className="gk-info-desc">
                    {BUDAYA[activeBudaya].deskripsi}
                  </p>

                  <span className="gk-info-tag">
                    Japanese Culture · CN Gakuen
                  </span>
                </div>
              </div>
            </div>
          </section>

          {/* =====================================
              KEGIATAN
          ====================================== */}

          <section className="gk-kegiatan-section">
            <div className="gk-section">
              <div className="gk-section-label">
                Program Kegiatan
              </div>

              <h2 className="gk-heading">
                活動
                <span>Kegiatan CN Gakuen</span>
              </h2>

              <div className="gk-kegiatan-grid">
                {KEGIATAN.map((item) => (
                  <article
                    className="gk-kegiatan"
                    key={item.no}
                  >
                    <div>
                      <div className="gk-kegiatan-icon">
                        {item.icon}
                      </div>

                      <div className="gk-kegiatan-no">
                        {item.no}
                      </div>
                    </div>

                    <div>
                      <div className="gk-kegiatan-name">
                        {item.nama}
                      </div>

                      <div className="gk-kegiatan-jp">
                        {item.jp}
                      </div>

                      <div className="gk-kegiatan-detail">
                        {item.detail}
                      </div>
                    </div>
                  </article>
                ))}
              </div>
            </div>
          </section>

          {/* =====================================
              5S & KAIZEN
          ====================================== */}

          <section className="gk-values">
            <div className="gk-values-inner">
              <div className="gk-values-label">
                Japanese Work Culture
              </div>

              <h2 className="gk-values-title">
                Belajar dari budaya kerja Jepang.
                <br />
                <span>小さな改善、大きな未来。</span>
              </h2>

              <div className="gk-values-grid">
                <div className="gk-value">
                  <div className="gk-value-kanji">
                    整
                  </div>

                  <div className="gk-value-name">
                    SEIRI
                  </div>
                </div>

                <div className="gk-value">
                  <div className="gk-value-kanji">
                    整
                  </div>

                  <div className="gk-value-name">
                    SEITON
                  </div>
                </div>

                <div className="gk-value">
                  <div className="gk-value-kanji">
                    清
                  </div>

                  <div className="gk-value-name">
                    SEISO
                  </div>
                </div>

                <div className="gk-value">
                  <div className="gk-value-kanji">
                    清
                  </div>

                  <div className="gk-value-name">
                    SEIKETSU
                  </div>
                </div>

                <div className="gk-value">
                  <div className="gk-value-kanji">
                    躾
                  </div>

                  <div className="gk-value-name">
                    SHITSUKE
                  </div>
                </div>

                <div className="gk-value">
                  <div className="gk-value-kanji">
                    改
                  </div>

                  <div className="gk-value-name">
                    KAIZEN
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* =====================================
              QUOTE
          ====================================== */}

          <section className="gk-quote">
            <div className="gk-quote-symbol">
              ✦
            </div>

            <div className="gk-quote-jp">
              夢に向かって、一歩ずつ。
            </div>

            <div className="gk-quote-text">
              “Melangkah sedikit demi sedikit
              menuju impianmu.”
            </div>

            <div className="gk-quote-small">
              CN Gakuen · SMK Citra Negara
            </div>
          </section>
        </main>

        <EskulMusic src="/audio/cngakuen.mp3" />
        <Footer />
      </div>
    </>
  );
}