'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import {
  ArrowLeft,
  ArrowUpRight,
  Briefcase,
  ChevronDown,
  Check,
} from 'lucide-react';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import type { JurusanDetailData } from '@/app/jurusan/data';

const SECTIONS = [
  { id: 'tentang', label: 'Tentang' },
  { id: 'mapel', label: 'Mata Pelajaran' },
  { id: 'alasan', label: 'Alasan' },
  { id: 'karier', label: 'Karier' },
];

export default function JurusanDetail({ data }: { data: JurusanDetailData }) {
  const [imgError, setImgError] = useState(false);
  const [openMapel, setOpenMapel] = useState(0);
  const [openAlasan, setOpenAlasan] = useState<number[]>([]);
  const [activeSection, setActiveSection] = useState('tentang');
  const heroImgRef = useRef<HTMLImageElement>(null);

  const toggleAlasan = (i: number) =>
    setOpenAlasan((prev) =>
      prev.includes(i) ? prev.filter((x) => x !== i) : [...prev, i],
    );

  /* Parallax hero + scrollspy (satu rAF loop) */
  useEffect(() => {
    if (
      typeof window !== 'undefined' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches
    ) {
      return;
    }
    let raf = 0;
    const ids = SECTIONS.map((s) => s.id);
    const onScroll = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        const y = window.scrollY;
        if (heroImgRef.current) {
          heroImgRef.current.style.transform = `translate3d(0, ${y * 0.18}px, 0) scale(1.1)`;
        }
        const mid = y + window.innerHeight * 0.32;
        let current = ids[0];
        for (const id of ids) {
          const el = document.getElementById(id);
          if (el && el.offsetTop <= mid) current = id;
        }
        setActiveSection(current);
      });
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', onScroll);
      cancelAnimationFrame(raf);
    };
  }, []);

  const goTo = useCallback((id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }, []);

  const paragraf = data.intro.split(/\n\s*\n/).map((p) => p.trim()).filter(Boolean);

  return (
    <>
      <Navbar />

      <main className="jd-main">
        {/* ── HERO ── */}
        <header className="jd-hero">
          <img
            ref={heroImgRef}
            className="jd-hero-img"
            src={imgError ? data.heroFallback : data.heroImg}
            alt={data.nama}
            onError={() => setImgError(true)}
          />
          <div className="jd-hero-scrim" aria-hidden="true" />

          <div className="jd-hero-inner">
            <Link href="/jurusan" className="jd-back">
              <ArrowLeft size={16} /> Kembali ke Bidang Studi
            </Link>

            <span className="jd-kode">{data.kode}</span>
            <h1 className="font-display jd-title">{data.nama}</h1>
            <p className="jd-kicker">{data.kicker}</p>

            <div className="jd-hero-stats">
              {data.stats.map((s) => (
                <div key={s.label} className="jd-hero-stat">
                  <span className="jd-hero-stat-num">{s.angka}</span>
                  <span className="jd-hero-stat-lbl">{s.label}</span>
                </div>
              ))}
            </div>
          </div>
        </header>

        {/* ── STICKY SECTION NAV ── */}
        <nav className="jd-nav" aria-label="Bagian halaman">
          <div className="jd-nav-inner">
            {SECTIONS.map((s) => (
              <button
                key={s.id}
                type="button"
                className={`jd-nav-link ${activeSection === s.id ? 'is-active' : ''}`}
                aria-current={activeSection === s.id ? 'true' : undefined}
                onClick={() => goTo(s.id)}
              >
                {s.label}
              </button>
            ))}
          </div>
        </nav>

        <div className="jd-body">
          {/* ── TENTANG ── */}
          <section id="tentang" className="jd-section jd-reveal">
            <span className="jd-eyebrow">Pengenalan</span>
            <h2 className="font-display jd-h2">Apa itu {data.kode}?</h2>
            {paragraf.map((p, i) => (
              <p key={i} className="jd-p">
                {p}
              </p>
            ))}
          </section>

          {/* ── MATA PELAJARAN (accordion) ── */}
          <section id="mapel" className="jd-section jd-reveal">
            <span className="jd-eyebrow">Kurikulum</span>
            <h2 className="font-display jd-h2">Apa yang akan kamu pelajari?</h2>
            <p className="jd-sub">Ketuk tiap mata pelajaran untuk melihat detailnya.</p>

            <div className="jd-acc">
              {data.mapel.map((m, i) => {
                const open = openMapel === i;
                return (
                  <div key={m.label} className={`jd-acc-item ${open ? 'is-open' : ''}`}>
                    <button
                      type="button"
                      className="jd-acc-head"
                      aria-expanded={open}
                      onClick={() => setOpenMapel(open ? -1 : i)}
                    >
                      <span className="jd-acc-num">
                        {String(i + 1).padStart(2, '0')}
                      </span>
                      <span className="jd-acc-label">{m.label}</span>
                      <ChevronDown size={18} className="jd-acc-chevron" />
                    </button>
                    <div className="jd-acc-panel">
                      <p>{m.desc}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </section>

          {/* ── ALASAN (expandable cards) ── */}
          <section id="alasan" className="jd-section jd-reveal">
            <span className="jd-eyebrow">Keunggulan</span>
            <h2 className="font-display jd-h2">Kenapa harus memilih {data.kode}?</h2>

            <div className="jd-reasons">
              {data.alasan.map((a, i) => {
                const open = openAlasan.includes(i);
                return (
                  <button
                    key={a.label}
                    type="button"
                    className={`jd-reason ${open ? 'is-open' : ''}`}
                    aria-expanded={open}
                    onClick={() => toggleAlasan(i)}
                  >
                    <span className="jd-reason-mark">
                      <Check size={15} strokeWidth={3} />
                    </span>
                    <span className="jd-reason-label">{a.label}</span>
                    <span className="jd-reason-desc">{a.desc}</span>
                    <span className="jd-reason-more">
                      {open ? 'Tutup' : 'Selengkapnya'}
                      <ChevronDown size={14} />
                    </span>
                  </button>
                );
              })}
            </div>
          </section>

          {/* ── KARIER ── */}
          <section id="karier" className="jd-section jd-reveal">
            <span className="jd-eyebrow">Prospek</span>
            <h2 className="font-display jd-h2">Profesi yang cocok untuk lulusan {data.kode}</h2>

            <div className="jd-jobs">
              {data.profesi.map((p, i) => (
                <span
                  key={p}
                  className="jd-job"
                  style={{ transitionDelay: `${i * 35}ms` }}
                >
                  <Briefcase size={15} />
                  {p}
                </span>
              ))}
            </div>
          </section>

          {/* ── CTA ── */}
          <section className="jd-cta jd-reveal">
            <h2 className="font-display jd-cta-title">
              Tertarik bergabung dengan peminatan {data.kode}?
            </h2>
            <p className="jd-cta-sub">
              Kuota tiap peminatan terbatas. Amankan tempatmu lewat jalur SPMB.
            </p>
            <div className="jd-cta-actions">
              <Link href="/spmb" className="jd-btn jd-btn-gold">
                Daftar Sekarang <ArrowUpRight size={16} />
              </Link>
              <Link
                href={data.kode === 'IPA' ? '/jurusan/ips' : '/jurusan/ipa'}
                className="jd-btn jd-btn-ghost"
              >
                Lihat peminatan {data.kode === 'IPA' ? 'IPS' : 'IPA'}
              </Link>
            </div>
          </section>
        </div>
      </main>

      <Footer />

      <style jsx global>{`
        .jd-main {
          background: #faf7f0;
        }

        /* HERO */
        .jd-hero {
          position: relative;
          overflow: hidden;
          min-height: 460px;
          display: flex;
          align-items: flex-end;
          padding: 96px 24px 60px;
        }
        .jd-hero-img {
          position: absolute;
          inset: 0;
          width: 100%;
          height: 100%;
          object-fit: cover;
          transform: scale(1.1);
          will-change: transform;
          z-index: 0;
        }
        .jd-hero-scrim {
          position: absolute;
          inset: 0;
          z-index: 1;
          background: linear-gradient(
            180deg,
            rgba(10, 22, 40, 0.35) 0%,
            rgba(10, 22, 40, 0.78) 70%,
            rgba(10, 22, 40, 0.92) 100%
          );
        }
        .jd-hero-inner {
          position: relative;
          z-index: 2;
          max-width: 900px;
          margin: 0 auto;
          width: 100%;
          animation: jdUp 0.7s cubic-bezier(0.16, 0.8, 0.3, 1) both;
        }
        .jd-back {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          color: #d9c79e;
          font-size: 13.5px;
          font-weight: 600;
          text-decoration: none;
          margin-bottom: 22px;
          transition: color 0.18s ease, gap 0.18s ease;
        }
        .jd-back:hover {
          color: #e8b84b;
          gap: 12px;
        }
        .jd-kode {
          display: inline-block;
          background: linear-gradient(135deg, #c8973a, #e8b84b);
          color: #0a1628;
          font-size: 12px;
          font-weight: 800;
          letter-spacing: 2px;
          padding: 6px 14px;
          border-radius: 7px;
          margin-bottom: 16px;
        }
        .jd-title {
          font-size: 44px;
          color: #fff;
          line-height: 1.15;
          max-width: 640px;
        }
        .jd-kicker {
          color: rgba(255, 255, 255, 0.82);
          font-size: 16px;
          margin-top: 12px;
          max-width: 560px;
        }
        .jd-hero-stats {
          display: flex;
          gap: 14px;
          margin-top: 28px;
          flex-wrap: wrap;
        }
        .jd-hero-stat {
          background: rgba(255, 255, 255, 0.08);
          border: 1px solid rgba(255, 255, 255, 0.16);
          backdrop-filter: blur(6px);
          border-radius: 14px;
          padding: 12px 18px;
          min-width: 108px;
        }
        .jd-hero-stat-num {
          display: block;
          font-family: 'Playfair Display', serif;
          font-size: 24px;
          font-weight: 700;
          color: #e8b84b;
          line-height: 1;
        }
        .jd-hero-stat-lbl {
          display: block;
          font-size: 11.5px;
          color: rgba(255, 255, 255, 0.7);
          margin-top: 5px;
          font-weight: 600;
        }

        /* STICKY NAV */
        .jd-nav {
          position: sticky;
          top: 0;
          z-index: 20;
          background: rgba(250, 247, 240, 0.9);
          backdrop-filter: blur(10px);
          border-bottom: 1px solid #ece3d2;
        }
        .jd-nav-inner {
          max-width: 820px;
          margin: 0 auto;
          display: flex;
          gap: 4px;
          padding: 0 24px;
          overflow-x: auto;
        }
        .jd-nav-link {
          flex-shrink: 0;
          background: none;
          border: none;
          font: inherit;
          cursor: pointer;
          padding: 15px 14px;
          font-size: 13.5px;
          font-weight: 700;
          color: #9a8f79;
          border-bottom: 2.5px solid transparent;
          transition: color 0.18s ease, border-color 0.18s ease;
        }
        .jd-nav-link:hover {
          color: #0a1628;
        }
        .jd-nav-link.is-active {
          color: #c8973a;
          border-bottom-color: #c8973a;
        }

        /* BODY */
        .jd-body {
          max-width: 820px;
          margin: 0 auto;
          padding: 20px 24px 90px;
        }
        .jd-section {
          padding: 44px 0;
          border-bottom: 1px solid #ece3d2;
          scroll-margin-top: 64px;
        }
        .jd-section:last-of-type {
          border-bottom: none;
        }
        .jd-eyebrow {
          display: block;
          font-size: 11px;
          font-weight: 800;
          letter-spacing: 2.5px;
          text-transform: uppercase;
          color: #c8973a;
          margin-bottom: 10px;
        }
        .jd-h2 {
          font-size: 28px;
          color: #0a1628;
          margin-bottom: 14px;
        }
        .jd-sub {
          color: #9ca3af;
          font-size: 13.5px;
          margin-bottom: 22px;
        }
        .jd-p {
          color: #6b7280;
          font-size: 15px;
          line-height: 1.85;
          margin-bottom: 16px;
        }
        .jd-p:last-child {
          margin-bottom: 0;
        }

        /* ACCORDION */
        .jd-acc {
          display: flex;
          flex-direction: column;
          gap: 10px;
        }
        .jd-acc-item {
          border: 1.5px solid #ece3d2;
          border-radius: 14px;
          background: #fff;
          overflow: hidden;
          transition: border-color 0.2s ease, box-shadow 0.2s ease;
        }
        .jd-acc-item.is-open {
          border-color: #c8973a;
          box-shadow: 0 12px 30px rgba(10, 22, 40, 0.07);
        }
        .jd-acc-head {
          width: 100%;
          display: flex;
          align-items: center;
          gap: 14px;
          padding: 16px 18px;
          background: none;
          border: none;
          font: inherit;
          cursor: pointer;
          text-align: left;
        }
        .jd-acc-num {
          font-family: 'Playfair Display', serif;
          font-size: 14px;
          font-weight: 700;
          color: #c8973a;
          background: #fbf4e4;
          width: 34px;
          height: 34px;
          border-radius: 9px;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }
        .jd-acc-label {
          flex: 1;
          font-size: 15px;
          font-weight: 700;
          color: #0a1628;
        }
        .jd-acc-chevron {
          color: #c8973a;
          flex-shrink: 0;
          transition: transform 0.28s ease;
        }
        .jd-acc-item.is-open .jd-acc-chevron {
          transform: rotate(180deg);
        }
        .jd-acc-panel {
          display: grid;
          grid-template-rows: 0fr;
          transition: grid-template-rows 0.32s ease;
        }
        .jd-acc-item.is-open .jd-acc-panel {
          grid-template-rows: 1fr;
        }
        .jd-acc-panel > p {
          overflow: hidden;
          margin: 0;
          padding: 0 18px 0 66px;
          color: #6b7280;
          font-size: 14px;
          line-height: 1.75;
          transition: padding 0.32s ease;
        }
        .jd-acc-item.is-open .jd-acc-panel > p {
          padding-top: 2px;
          padding-bottom: 18px;
        }

        /* REASONS */
        .jd-reasons {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 14px;
        }
        .jd-reason {
          position: relative;
          text-align: left;
          background: #fff;
          border: 1.5px solid #ece3d2;
          border-radius: 16px;
          padding: 20px;
          cursor: pointer;
          font: inherit;
          display: flex;
          flex-direction: column;
          gap: 8px;
          transition: border-color 0.2s ease, box-shadow 0.2s ease,
            transform 0.2s ease;
        }
        .jd-reason:hover {
          transform: translateY(-3px);
          border-color: #d9b978;
          box-shadow: 0 16px 34px rgba(10, 22, 40, 0.09);
        }
        .jd-reason.is-open {
          border-color: #c8973a;
        }
        .jd-reason-mark {
          width: 28px;
          height: 28px;
          border-radius: 50%;
          background: linear-gradient(135deg, #c8973a, #e8b84b);
          color: #fff;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }
        .jd-reason-label {
          font-size: 15px;
          font-weight: 700;
          color: #0a1628;
        }
        .jd-reason-desc {
          font-size: 13.5px;
          color: #6b7280;
          line-height: 1.7;
          overflow: hidden;
          max-height: 0;
          opacity: 0;
          transition: max-height 0.3s ease, opacity 0.3s ease;
        }
        .jd-reason.is-open .jd-reason-desc {
          max-height: 200px;
          opacity: 1;
        }
        .jd-reason-more {
          display: inline-flex;
          align-items: center;
          gap: 4px;
          font-size: 12px;
          font-weight: 700;
          color: #c8973a;
        }
        .jd-reason-more svg {
          transition: transform 0.28s ease;
        }
        .jd-reason.is-open .jd-reason-more svg {
          transform: rotate(180deg);
        }

        /* JOBS */
        .jd-jobs {
          display: flex;
          flex-wrap: wrap;
          gap: 10px;
        }
        .jd-job {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          background: #fff;
          border: 1px solid #ece3d2;
          border-radius: 999px;
          padding: 10px 16px;
          font-size: 13.5px;
          font-weight: 600;
          color: #0a1628;
          cursor: default;
          transition: background 0.18s ease, color 0.18s ease,
            border-color 0.18s ease, transform 0.18s ease;
        }
        .jd-job svg {
          color: #c8973a;
          transition: color 0.18s ease;
        }
        .jd-job:hover {
          background: #0a1628;
          border-color: #0a1628;
          color: #fff;
          transform: translateY(-2px);
        }
        .jd-job:hover svg {
          color: #e8b84b;
        }

        /* CTA */
        .jd-cta {
          margin-top: 40px;
          text-align: center;
          background: linear-gradient(160deg, #0a1628, #16233c);
          border-radius: 22px;
          padding: 48px 32px;
          color: #fff;
        }
        .jd-cta-title {
          font-size: 24px;
          margin-bottom: 10px;
        }
        .jd-cta-sub {
          color: rgba(255, 255, 255, 0.7);
          font-size: 14px;
          margin-bottom: 24px;
        }
        .jd-cta-actions {
          display: flex;
          gap: 12px;
          justify-content: center;
          flex-wrap: wrap;
        }
        .jd-btn {
          display: inline-flex;
          align-items: center;
          gap: 7px;
          padding: 13px 26px;
          border-radius: 10px;
          font-weight: 700;
          font-size: 14px;
          text-decoration: none;
          transition: transform 0.18s ease, box-shadow 0.18s ease,
            background 0.18s ease, color 0.18s ease;
        }
        .jd-btn-gold {
          background: linear-gradient(135deg, #c8973a, #e8b84b);
          color: #0a1628;
        }
        .jd-btn-gold:hover {
          transform: translateY(-2px);
          box-shadow: 0 14px 30px rgba(200, 151, 58, 0.45);
        }
        .jd-btn-ghost {
          background: transparent;
          color: #fff;
          border: 1.5px solid rgba(255, 255, 255, 0.4);
        }
        .jd-btn-ghost:hover {
          border-color: #e8b84b;
          color: #e8b84b;
        }

        /* REVEAL — only hide/animate where scroll-driven animations are supported;
           otherwise content stays plainly visible (Firefox/Safari fallback). */
        @supports (animation-timeline: view()) {
          .jd-reveal {
            opacity: 0;
            transform: translateY(22px);
            animation: jdReveal 0.6s ease forwards;
            animation-timeline: view();
            animation-range: entry 0% cover 22%;
          }
        }

        @keyframes jdUp {
          from {
            opacity: 0;
            transform: translateY(18px);
          }
          to {
            opacity: 1;
            transform: none;
          }
        }
        @keyframes jdReveal {
          to {
            opacity: 1;
            transform: none;
          }
        }

        @media (max-width: 720px) {
          .jd-hero {
            padding: 84px 20px 44px;
            min-height: 400px;
          }
          .jd-title {
            font-size: 30px;
          }
          .jd-h2 {
            font-size: 22px;
          }
          .jd-reasons {
            grid-template-columns: 1fr;
          }
        }

        @media (prefers-reduced-motion: reduce) {
          .jd-hero-inner,
          .jd-reveal {
            animation: none !important;
            opacity: 1 !important;
            transform: none !important;
          }
          .jd-hero-img {
            transform: scale(1.05) !important;
          }
          .jd-acc-panel,
          .jd-reason-desc,
          .jd-acc-chevron {
            transition: none !important;
          }
        }
      `}</style>
    </>
  );
}
