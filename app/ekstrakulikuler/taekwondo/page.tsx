'use client';

import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import EskulMusic from '@/components/EskulMusic';
import Image from 'next/image';

const STATS = [
  { angka: '2025', label: 'Tahun Berdiri' },
  { angka: '35+', label: 'Anggota Aktif' },
  { angka: '18', label: 'Prestasi Diraih' },
  { angka: '100%', label: 'Dedikasi' },
];

const TUJUAN = [
  {
    icon: '🥋',
    judul: 'Kedisiplinan',
    deskripsi:
      'Taekwondo mengajarkan disiplin tinggi melalui latihan terstruktur dan aturan yang membentuk karakter kuat.',
  },
  {
    icon: '💪',
    judul: 'Kebugaran & Bela Diri',
    deskripsi:
      'Latihan meningkatkan kekuatan, kelincahan, keseimbangan, dan kemampuan bela diri.',
  },
  {
    icon: '🏅',
    judul: 'Karakter Positif',
    deskripsi:
      'Menanamkan kepercayaan diri, rasa hormat, keberanian, dan sportivitas.',
  },
];

const KEGIATAN = [
  { no: '01', nama: 'Latihan Teknik Dasar', detail: 'Tendangan, pukulan, blok, dan teknik dasar.' },
  { no: '02', nama: 'Poomsae', detail: 'Rangkaian gerakan teknik secara terstruktur.' },
  { no: '03', nama: 'Sparring', detail: 'Latihan pertarungan dengan teknik yang aman.' },
  { no: '04', nama: 'Latihan Fisik', detail: 'Latihan kekuatan, stamina, kelincahan, dan keseimbangan.' },
  { no: '05', nama: 'Kenaikan Tingkat', detail: 'Ujian sabuk sebagai evaluasi kemampuan.' },
  { no: '06', nama: 'Kejuaraan', detail: 'Mengikuti kompetisi tingkat lokal hingga regional.' },
];

export default function TaekwondoPage() {
  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Barlow:wght@400;500;600;700;800&family=Barlow+Condensed:wght@600;700;800&display=swap');

        * {
          box-sizing: border-box;
        }

        .tkw-root {
          font-family: 'Barlow', sans-serif;
          background: #f6f9fc;
          color: #17202a;
          min-height: 100vh;
          overflow: hidden;
        }

        /* =========================
           HERO
        ========================= */

        .tkw-hero {
          position: relative;
          overflow: hidden;
          background: #eef5fa;
        }

        .tkw-hero-img {
          position: relative;
          width: 100%;
          height: min(70vh, 600px);
        }

        .tkw-hero-img img {
          object-fit: cover;
          object-position: center top;
          filter: brightness(0.78) contrast(1.05);
          animation: heroZoom 8s ease-in-out infinite alternate;
        }

        @keyframes heroZoom {
          from {
            transform: scale(1);
          }
          to {
            transform: scale(1.055);
          }
        }

        .tkw-hero-overlay {
          position: absolute;
          inset: 0;
          background:
            linear-gradient(
              to bottom,
              rgba(255,255,255,0.02) 15%,
              rgba(245,249,252,0.08) 45%,
              rgba(246,249,252,0.78) 82%,
              #f6f9fc 100%
            );
        }

        .tkw-hero-content {
          position: absolute;
          bottom: 0;
          left: 0;
          right: 0;
          padding:
            0
            clamp(24px, 6vw, 80px)
            clamp(40px, 6vw, 72px);
          animation: heroContent 0.9s ease-out both;
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

        .tkw-eyebrow {
          display: inline-flex;
          align-items: center;
          gap: 10px;
          font-family: 'Barlow Condensed', sans-serif;
          font-size: 13px;
          font-weight: 800;
          letter-spacing: 3px;
          text-transform: uppercase;
          color: #1676b8;
          margin-bottom: 16px;
        }

        .tkw-eyebrow::before {
          content: '';
          width: 34px;
          height: 3px;
          background: #1676b8;
          display: block;
          animation: lineMove 1s ease-out both;
        }

        @keyframes lineMove {
          from {
            width: 0;
          }
          to {
            width: 34px;
          }
        }

        .tkw-title {
          font-family: 'Bebas Neue', sans-serif;
          font-size: clamp(72px, 12vw, 160px);
          line-height: 0.88;
          color: #101820;
          letter-spacing: 2px;
          margin: 0 0 20px;
          text-shadow: 0 8px 25px rgba(0,0,0,0.08);
        }

        .tkw-title span {
          color: #1676b8;
        }

        .tkw-subtitle {
          max-width: 560px;
          font-size: clamp(15px, 1.8vw, 18px);
          color: #46535e;
          line-height: 1.7;
        }

        /* =========================
           KICK DECORATION
        ========================= */

        .tkw-kick {
          position: absolute;
          right: 5%;
          top: 15%;
          width: 180px;
          height: 180px;
          border: 1px solid rgba(22,118,184,0.12);
          border-radius: 50%;
          animation: kickSpin 12s linear infinite;
          pointer-events: none;
        }

        .tkw-kick::before,
        .tkw-kick::after {
          content: '';
          position: absolute;
          inset: 18px;
          border: 1px dashed rgba(22,118,184,0.15);
          border-radius: 50%;
        }

        .tkw-kick::after {
          inset: 50%;
          width: 8px;
          height: 8px;
          background: #1676b8;
          border: none;
          transform: translate(-50%, -50%);
          box-shadow: 0 0 20px rgba(22,118,184,0.35);
        }

        @keyframes kickSpin {
          from {
            transform: rotate(0deg);
          }
          to {
            transform: rotate(360deg);
          }
        }

        /* =========================
           STATS
        ========================= */

        .tkw-stats {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          background: #ffffff;
          border-top: 1px solid #dce7ef;
          border-bottom: 1px solid #dce7ef;
          position: relative;
          z-index: 2;
        }

        @media (max-width: 640px) {
          .tkw-stats {
            grid-template-columns: repeat(2, 1fr);
          }
        }

        .tkw-stat {
          padding: 28px 20px;
          text-align: center;
          border-right: 1px solid #dce7ef;
          transition: all 0.3s ease;
        }

        .tkw-stat:last-child {
          border-right: none;
        }

        .tkw-stat:hover {
          background: #f0f7fc;
          transform: translateY(-4px);
        }

        .tkw-stat-num {
          font-family: 'Bebas Neue', sans-serif;
          font-size: 46px;
          color: #1676b8;
          line-height: 1;
          margin-bottom: 6px;
        }

        .tkw-stat-label {
          font-size: 11px;
          font-weight: 700;
          letter-spacing: 2px;
          text-transform: uppercase;
          color: #7b8790;
        }

        /* =========================
           SECTION
        ========================= */

        .tkw-section {
          max-width: 1100px;
          margin: 0 auto;
          padding:
            clamp(56px, 8vw, 96px)
            clamp(24px, 6vw, 80px);
        }

        .tkw-section-label {
          font-family: 'Barlow Condensed', sans-serif;
          font-size: 11px;
          font-weight: 800;
          letter-spacing: 3px;
          text-transform: uppercase;
          color: #1676b8;
          margin-bottom: 12px;
        }

        .tkw-section-heading {
          font-family: 'Bebas Neue', sans-serif;
          font-size: clamp(40px, 5vw, 64px);
          color: #101820;
          line-height: 1;
          margin-bottom: 48px;
          position: relative;
          display: inline-block;
        }

        .tkw-section-heading::after {
          content: '';
          position: absolute;
          bottom: -10px;
          left: 0;
          width: 55px;
          height: 4px;
          background: #1676b8;
          transition: width 0.4s ease;
        }

        .tkw-section-heading:hover::after {
          width: 100%;
        }

        /* =========================
           TUJUAN
        ========================= */

        .tkw-tujuan-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 18px;
        }

        @media (max-width: 768px) {
          .tkw-tujuan-grid {
            grid-template-columns: 1fr;
          }
        }

        .tkw-tujuan-card {
          background: #ffffff;
          padding: 36px 28px;
          border: 1px solid #dce7ef;
          border-radius: 4px;
          transition:
            transform 0.35s ease,
            box-shadow 0.35s ease,
            border-color 0.35s ease;
          position: relative;
          overflow: hidden;
        }

        .tkw-tujuan-card::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 4px;
          background: #1676b8;
          transform: scaleX(0);
          transform-origin: left;
          transition: transform 0.35s ease;
        }

        .tkw-tujuan-card:hover {
          transform: translateY(-9px);
          border-color: #9fc9e3;
          box-shadow: 0 18px 40px rgba(20,80,120,0.12);
        }

        .tkw-tujuan-card:hover::before {
          transform: scaleX(1);
        }

        .tkw-tujuan-icon {
          font-size: 38px;
          margin-bottom: 20px;
          display: block;
          transition: transform 0.35s ease;
        }

        .tkw-tujuan-card:hover .tkw-tujuan-icon {
          transform: translateY(-5px) rotate(-6deg);
        }

        .tkw-tujuan-title {
          font-family: 'Barlow Condensed', sans-serif;
          font-size: 22px;
          font-weight: 800;
          color: #17202a;
          text-transform: uppercase;
          letter-spacing: 1px;
          margin-bottom: 12px;
        }

        .tkw-tujuan-desc {
          font-size: 14px;
          color: #66737d;
          line-height: 1.75;
          margin: 0;
        }

        /* =========================
           DIVIDER
        ========================= */

        .tkw-divider {
          display: flex;
          align-items: center;
          gap: 16px;
          max-width: 1100px;
          margin: 0 auto;
          padding: 0 clamp(24px, 6vw, 80px);
        }

        .tkw-divider::before,
        .tkw-divider::after {
          content: '';
          flex: 1;
          height: 1px;
          background: #bdd5e4;
        }

        .tkw-divider-icon {
          color: #1676b8;
          font-size: 18px;
          animation: beltPulse 1.8s ease-in-out infinite;
        }

        @keyframes beltPulse {
          0%, 100% {
            transform: scale(1) rotate(0deg);
            opacity: 0.6;
          }
          50% {
            transform: scale(1.3) rotate(180deg);
            opacity: 1;
          }
        }

        /* =========================
           KEGIATAN
        ========================= */

        .tkw-kegiatan-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 14px;
        }

        @media (max-width: 640px) {
          .tkw-kegiatan-grid {
            grid-template-columns: 1fr;
          }
        }

        .tkw-kegiatan-item {
          background: #ffffff;
          padding: 28px 32px;
          display: flex;
          align-items: flex-start;
          gap: 20px;
          border: 1px solid #dce7ef;
          position: relative;
          overflow: hidden;
          transition:
            transform 0.3s ease,
            box-shadow 0.3s ease,
            border-color 0.3s ease;
        }

        .tkw-kegiatan-item::before {
          content: '';
          position: absolute;
          left: 0;
          top: 0;
          bottom: 0;
          width: 4px;
          background: #1676b8;
          transform: scaleY(0);
          transform-origin: bottom;
          transition: transform 0.3s ease;
        }

        .tkw-kegiatan-item:hover {
          transform: translateX(6px);
          border-color: #9fc9e3;
          box-shadow: 0 12px 30px rgba(20,80,120,0.09);
        }

        .tkw-kegiatan-item:hover::before {
          transform: scaleY(1);
        }

        .tkw-kegiatan-no {
          font-family: 'Bebas Neue', sans-serif;
          font-size: 34px;
          color: rgba(22,118,184,0.25);
          line-height: 1;
          flex-shrink: 0;
          width: 40px;
          transition: color 0.3s ease;
        }

        .tkw-kegiatan-item:hover .tkw-kegiatan-no {
          color: #1676b8;
        }

        .tkw-kegiatan-nama {
          font-family: 'Barlow Condensed', sans-serif;
          font-size: 18px;
          font-weight: 800;
          color: #17202a;
          text-transform: uppercase;
          letter-spacing: 0.5px;
          margin-bottom: 4px;
        }

        .tkw-kegiatan-detail {
          font-size: 13px;
          color: #74818b;
        }

        /* =========================
           RESPONSIVE
        ========================= */

        @media (max-width: 640px) {
          .tkw-kick {
            width: 110px;
            height: 110px;
            right: -20px;
            top: 18%;
          }

          .tkw-hero-img {
            height: 58vh;
          }

          .tkw-hero-content {
            padding-bottom: 35px;
          }
        }

        @media (prefers-reduced-motion: reduce) {
          *,
          *::before,
          *::after {
            animation-duration: 0.01ms !important;
            animation-iteration-count: 1 !important;
            transition-duration: 0.01ms !important;
          }
        }
      `}</style>

      <div className="tkw-root">
        <Navbar />

        <main>
          {/* HERO */}
          <section className="tkw-hero">
            <div className="tkw-hero-img">
              <Image
                src="/images/eskul/eskultaekwondo.jpg"
                alt="Taekwondo SMK Citra Negara"
                fill
                priority
              />

              <div className="tkw-hero-overlay" />

              <div className="tkw-kick" />
            </div>

            <div className="tkw-hero-content">
              <div className="tkw-eyebrow">
                Ekstrakurikuler SMK Citra Negara
              </div>

              <h1 className="tkw-title">
                TAEK<span>WONDO</span>
              </h1>

              <p className="tkw-subtitle">
                Taekwondo menawarkan lebih dari sekadar keterampilan bela diri.
                Kami membentuk siswa yang disiplin, tangguh, dan berkarakter.
              </p>
            </div>
          </section>

          {/* STATS */}
          <div className="tkw-stats">
            {STATS.map((s) => (
              <div key={s.label} className="tkw-stat">
                <div className="tkw-stat-num">{s.angka}</div>
                <div className="tkw-stat-label">{s.label}</div>
              </div>
            ))}
          </div>

          {/* TUJUAN */}
          <section className="tkw-section">
            <div className="tkw-section-label">
              Mengapa Taekwondo
            </div>

            <h2 className="tkw-section-heading">
              TUJUAN KAMI
            </h2>

            <div className="tkw-tujuan-grid">
              {TUJUAN.map((t) => (
                <div
                  key={t.judul}
                  className="tkw-tujuan-card"
                >
                  <span className="tkw-tujuan-icon">
                    {t.icon}
                  </span>

                  <div className="tkw-tujuan-title">
                    {t.judul}
                  </div>

                  <p className="tkw-tujuan-desc">
                    {t.deskripsi}
                  </p>
                </div>
              ))}
            </div>
          </section>

          <div className="tkw-divider">
            <span className="tkw-divider-icon">✦</span>
          </div>

          {/* KEGIATAN */}
          <section
            className="tkw-section"
            style={{
              paddingTop: 'clamp(40px, 5vw, 64px)',
            }}
          >
            <div className="tkw-section-label">
              Program Latihan
            </div>

            <h2 className="tkw-section-heading">
              KEGIATAN RUTIN
            </h2>

            <div className="tkw-kegiatan-grid">
              {KEGIATAN.map((k) => (
                <div
                  key={k.no}
                  className="tkw-kegiatan-item"
                >
                  <div className="tkw-kegiatan-no">
                    {k.no}
                  </div>

                  <div>
                    <div className="tkw-kegiatan-nama">
                      {k.nama}
                    </div>

                    <div className="tkw-kegiatan-detail">
                      {k.detail}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>
        </main>

        <EskulMusic src="/audio/taekwondo.mp3" />
        <Footer />
      </div>
    </>
  );
}