'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Newspaper, Calendar, ArrowRight } from 'lucide-react';
import { KATEGORI_COLOR, type BeritaItem } from '@/lib/berita';

export default function BeritaBrowser({ items }: { items: BeritaItem[] }) {
  const ALL_KATEGORI = ['Semua', ...Array.from(new Set(items.map((b) => b.kategori)))];
  const [aktif, setAktif] = useState('Semua');

  const filtered = aktif === 'Semua' ? items : items.filter((b) => b.kategori === aktif);
  const [utama, ...lainnya] = filtered;

  return (
    <main>
      {/* Hero — diagonal split */}
      <section className="berita-hero">
        <div className="berita-hero-inner">
          <span className="berita-hero-pill">
            <Newspaper size={14} />
            KABAR SEKOLAH
          </span>
          <h1 className="font-display berita-hero-title">Berita &amp; Kegiatan</h1>
          <p className="berita-hero-sub">
            Informasi terbaru seputar prestasi, pengumuman, dan kegiatan SMK Citra Negara.
          </p>
        </div>
      </section>

      {/* Filter + daftar */}
      <section className="berita-body">
        <div className="berita-wrap">
          <div className="berita-tabs">
            {ALL_KATEGORI.map((k) => (
              <button
                key={k}
                onClick={() => setAktif(k)}
                className={`berita-tab ${aktif === k ? 'berita-tab-on' : ''}`}
              >
                {k}
              </button>
            ))}
          </div>

          {filtered.length === 0 ? (
            <div className="berita-empty">
              <Newspaper size={28} />
              <div>Belum ada berita di kategori ini.</div>
            </div>
          ) : (
            <>
              {utama && (
                <Link href={utama.href} className="berita-featured">
                  <div className="berita-featured-img">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={utama.foto} alt={utama.judul} />
                    <span
                      className="berita-tag"
                      style={{ background: KATEGORI_COLOR[utama.kategori] ?? '#0A1628' }}
                    >
                      {utama.kategori}
                    </span>
                  </div>
                  <div className="berita-featured-body">
                    <div className="berita-date">
                      <Calendar size={14} /> {utama.tanggalLabel}
                    </div>
                    <h2 className="font-display">{utama.judul}</h2>
                    <p>{utama.ringkasan}</p>
                    <span className="berita-cta">
                      Baca selengkapnya <ArrowRight size={15} />
                    </span>
                  </div>
                </Link>
              )}

              {lainnya.length > 0 && (
                <div className="berita-grid">
                  {lainnya.map((b) => (
                    <Link key={b.href} href={b.href} className="berita-card">
                      <div className="berita-card-img">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src={b.foto} alt={b.judul} />
                        <span
                          className="berita-tag"
                          style={{ background: KATEGORI_COLOR[b.kategori] ?? 'rgba(10,22,40,0.75)' }}
                        >
                          {b.kategori}
                        </span>
                      </div>
                      <div className="berita-card-body">
                        <div className="berita-date">
                          <Calendar size={12} /> {b.tanggalLabel}
                        </div>
                        <h3 className="font-display">{b.judul}</h3>
                        <p>{b.ringkasan}</p>
                        <span className="berita-cta">
                          Baca selengkapnya <ArrowRight size={14} />
                        </span>
                      </div>
                    </Link>
                  ))}
                </div>
              )}
            </>
          )}
        </div>
      </section>

      <style jsx>{`
        .berita-hero {
          position: relative;
          padding: 96px 24px 104px;
          border-top: 3px solid #c8973a;
          border-bottom: 3px solid #c8973a;
          background: linear-gradient(116deg, #04331a 0%, #04331a 40%, #1f9d4e 40%, #14833f 100%);
          overflow: hidden;
        }
        .berita-hero::after {
          content: '';
          position: absolute;
          inset: 0;
          background: radial-gradient(120% 80% at 50% 0%, rgba(0, 0, 0, 0) 45%, rgba(0, 0, 0, 0.28) 100%);
          pointer-events: none;
        }
        .berita-hero-inner {
          position: relative;
          z-index: 1;
          max-width: 760px;
          margin: 0 auto;
          text-align: center;
        }
        .berita-hero-pill {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          padding: 7px 16px;
          border-radius: 999px;
          background: rgba(4, 20, 11, 0.45);
          border: 1px solid rgba(200, 151, 58, 0.55);
          color: #e8b84b;
          font-size: 12px;
          font-weight: 800;
          letter-spacing: 1.5px;
          margin-bottom: 22px;
        }
        .berita-hero-title {
          font-size: 52px;
          color: #ffffff;
          line-height: 1.15;
          margin-bottom: 16px;
        }
        .berita-hero-sub {
          color: rgba(255, 255, 255, 0.82);
          font-size: 16px;
          line-height: 1.7;
          max-width: 520px;
          margin: 0 auto;
        }

        .berita-body {
          background: #faf7f0;
          padding: 40px 24px 80px;
        }
        .berita-wrap {
          max-width: 1100px;
          margin: 0 auto;
        }

        .berita-tabs {
          display: flex;
          gap: 10px;
          flex-wrap: wrap;
          margin-bottom: 32px;
        }
        .berita-tab {
          padding: 9px 22px;
          border-radius: 999px;
          font-size: 13px;
          font-weight: 700;
          cursor: pointer;
          border: 1.5px solid #e2d9c8;
          background: #fff;
          color: #6b7280;
          transition: all 0.18s ease;
        }
        .berita-tab:hover {
          border-color: #c8973a;
          color: #0a1628;
        }
        .berita-tab-on {
          background: #c8973a;
          border-color: #c8973a;
          color: #0a1628;
          box-shadow: 0 6px 16px rgba(200, 151, 58, 0.28);
        }

        .berita-tag {
          position: absolute;
          top: 14px;
          left: 14px;
          color: #fff;
          font-size: 10px;
          font-weight: 800;
          letter-spacing: 0.5px;
          padding: 5px 12px;
          border-radius: 999px;
        }
        .berita-date {
          display: flex;
          align-items: center;
          gap: 6px;
          color: #9ca3af;
          font-size: 12px;
          margin-bottom: 8px;
        }
        .berita-cta {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          color: #c8973a;
          font-weight: 800;
          font-size: 13px;
          margin-top: auto;
        }

        .berita-featured {
          display: grid;
          grid-template-columns: 1.15fr 1fr;
          background: #fff;
          border-radius: 22px;
          overflow: hidden;
          border: 1px solid #f0ebe0;
          box-shadow: 0 10px 34px rgba(10, 22, 40, 0.08);
          text-decoration: none;
          margin-bottom: 32px;
          transition: transform 0.25s ease, box-shadow 0.25s ease;
        }
        .berita-featured:hover {
          transform: translateY(-4px);
          box-shadow: 0 20px 46px rgba(200, 151, 58, 0.2);
        }
        .berita-featured-img {
          position: relative;
          min-height: 300px;
          background: #eaf2ea;
        }
        .berita-featured-img img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          display: block;
        }
        .berita-featured-body {
          padding: 36px;
          display: flex;
          flex-direction: column;
        }
        .berita-featured-body .berita-date {
          font-size: 13px;
          margin-bottom: 12px;
        }
        .berita-featured-body h2 {
          font-size: 28px;
          color: #0a1628;
          line-height: 1.3;
          margin-bottom: 14px;
        }
        .berita-featured-body p {
          color: #6b7280;
          font-size: 14.5px;
          line-height: 1.75;
          margin-bottom: 22px;
        }
        .berita-featured-body .berita-cta {
          font-size: 14px;
        }

        .berita-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
          gap: 24px;
        }
        .berita-card {
          display: flex;
          flex-direction: column;
          background: #fff;
          border-radius: 18px;
          overflow: hidden;
          border: 1px solid #f0ebe0;
          box-shadow: 0 3px 14px rgba(10, 22, 40, 0.06);
          text-decoration: none;
          transition: transform 0.25s ease, box-shadow 0.25s ease, border-color 0.25s ease;
        }
        .berita-card:hover {
          transform: translateY(-5px);
          border-color: #c8973a;
          box-shadow: 0 14px 32px rgba(200, 151, 58, 0.18);
        }
        .berita-card-img {
          position: relative;
          width: 100%;
          height: 190px;
          background: #eaf2ea;
        }
        .berita-card-img img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          display: block;
        }
        .berita-card-body {
          padding: 18px 20px 20px;
          flex: 1;
          display: flex;
          flex-direction: column;
        }
        .berita-card-body h3 {
          font-size: 17px;
          color: #0a1628;
          line-height: 1.4;
          margin-bottom: 8px;
        }
        .berita-card-body p {
          color: #6b7280;
          font-size: 13px;
          line-height: 1.65;
          margin-bottom: 14px;
        }

        .berita-empty {
          text-align: center;
          padding: 70px 0;
          color: #9ca3af;
          font-size: 15px;
        }
        .berita-empty svg {
          margin-bottom: 10px;
          opacity: 0.5;
        }

        @media (max-width: 820px) {
          .berita-hero {
            padding: 72px 20px 80px;
          }
          .berita-hero-title {
            font-size: 38px;
          }
          .berita-featured {
            grid-template-columns: 1fr;
          }
          .berita-featured-img {
            min-height: 220px;
          }
          .berita-featured-body {
            padding: 26px;
          }
          .berita-featured-body h2 {
            font-size: 23px;
          }
        }
      `}</style>
    </main>
  );
}
