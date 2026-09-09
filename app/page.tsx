'use client';
import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { CheckCircle, ChevronDown, Clock, X, Sparkles, Calendar } from 'lucide-react';

const JURUSAN = [
  {
    img: '/images/ipa1.png',
    kode: 'IPA',
    nama: 'Ilmu Pengetahuan Alam',
    desc: 'Rumpun ilmu yang mempelajari tentang gejala-gejala alam, makhluk hidup, dan seluruh isi alam semesta.',
    kuota: 72,
    highlights: ['Fisika, Kimia, Biologi lanjutan', 'Lab sains lengkap & modern', 'Persiapan olimpiade sains', 'Jalur favorit ke Fakultas Kedokteran & Teknik'],
  },
  {
    img: '/images/ips1.png',
    kode: 'IPS',
    nama: 'Ilmu Pengetahuan Sosial',
    desc: 'Rumpun ilmu yang mempelajari tentang manusia, masyarakat, dan interaksi sosial di lingkungan sekitarnya.',
    kuota: 72,
    highlights: ['Ekonomi, Sosiologi, Geografi', 'Studi kasus & simulasi sosial', 'Persiapan olimpiade ekonomi', 'Jalur favorit ke Hukum, Ekonomi & Ilmu Komunikasi'],
  },
];

const STATS = [
  { value: '1.200+', label: 'Siswa Aktif' },
  { value: '98%', label: 'Tingkat Kelulusan' },
  { value: '85%', label: 'Keterima PTN Kampus Top' },
  { value: '3+', label: 'Tahun Berdiri' },
];

const FASILITAS = [
  'Tersedia Lab Untuk Masing-Masing Jurusan',
  'Tersedia WiFi Untuk Siswa/i di Setiap Gedung & Lantai',
  'Ruang Perpustakaan',
  'Auditorium',
  'Kantin',
  '2 Lapangan (Gedung A & Gedung E)',
];

const FASILITAS_STATS = [
  { label: 'Lab', val: '50+', sub: 'Fasilitas Lab', bg: '#17713b' },
  { label: 'Internet', val: '1 Gbps', sub: 'Starlink', bg: '#cf962b' },
  { label: 'Akreditasi', val: 'A', sub: 'BAN-S/M', bg: '#0f4c35' },
  { label: 'Alumni', val: '5000+', sub: 'Tersebar Nasional', bg: '#093b1e' },
];

const MARQUEE_ITEMS = ['PPDB 2027/2028 DIBUKA', 'JURUSAN IPA & IPS', 'AKREDITASI A', 'KUOTA TERBATAS', 'DAFTAR SEKARANG'];
const ROTATING_WORDS = ['Cerah', 'Gemilang', 'Kompetitif', 'Mendunia'];

// Jadwal SPMB — 3 gelombang, tahun ajaran 2027/2028.
// Status tiap gelombang ("SEGERA / DIBUKA / DITUTUP") & countdown dihitung otomatis dari tanggal.
// Samakan dengan array GELOMBANG di app/spmb/page.tsx kalau periode digeser.
const GELOMBANG = [
  { nama: 'Gelombang 1', mulai: '2026-09-01', selesai: '2026-11-30', tgl: '1 Sep – 30 Nov 2026' },
  { nama: 'Gelombang 2', mulai: '2026-12-01', selesai: '2027-02-28', tgl: '1 Des 2026 – 28 Feb 2027' },
  { nama: 'Gelombang 3', mulai: '2027-03-01', selesai: '2027-06-30', tgl: '1 Mar – 30 Jun 2027' },
];

type GelombangStatus = 'upcoming' | 'buka' | 'selesai';

function getGelombangStatus(mulai: string, selesai: string, now: Date): GelombangStatus {
  const start = new Date(mulai + 'T00:00:00');
  const end = new Date(selesai + 'T23:59:59');
  if (now > end) return 'selesai';
  if (now >= start) return 'buka';
  return 'upcoming';
}

/** Hook kecil: fade/slide-in saat elemen masuk viewport (dimatikan otomatis jika user minta reduced motion) */
function useReveal<T extends HTMLElement>() {
  const ref = useRef<T | null>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReduced) {
      setVisible(true);
      return;
    }
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          obs.disconnect();
        }
      },
      { threshold: 0.15 }
    );
    obs.observe(node);
    return () => obs.disconnect();
  }, []);

  return { ref, visible };
}

function Reveal({ children, delay = 0 }: { children: React.ReactNode; delay?: number }) {
  const { ref, visible } = useReveal<HTMLDivElement>();
  return (
    <div
      ref={ref}
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? 'translateY(0)' : 'translateY(24px)',
        transition: `opacity 0.6s ease ${delay}ms, transform 0.6s ease ${delay}ms`,
      }}
    >
      {children}
    </div>
  );
}

function useCountdown(targetISO: string) {
  const [daysLeft, setDaysLeft] = useState<number | null>(null);

  useEffect(() => {
    const update = () => {
      const target = new Date(targetISO + 'T23:59:59');
      const now = new Date();
      const diff = target.getTime() - now.getTime();
      setDaysLeft(Math.max(0, Math.ceil(diff / (1000 * 60 * 60 * 24))));
    };
    update();
    const id = setInterval(update, 1000 * 60 * 60); // refresh tiap jam cukup
    return () => clearInterval(id);
  }, [targetISO]);

  return daysLeft;
}

// Index gelombang yang sedang berjalan (atau berikutnya kalau belum mulai).
// Semua gelombang lewat → index terakhir.
function getActiveGelombangIndex() {
  const now = new Date();
  for (let i = 0; i < GELOMBANG.length; i++) {
    const end = new Date(GELOMBANG[i].selesai + 'T23:59:59');
    if (now <= end) return i;
  }
  return GELOMBANG.length - 1;
}

/** Ref magnetic: elemen sedikit "menarik" ke arah kursor. Mati otomatis di layar sentuh & reduced motion. */
function useMagnetic<T extends HTMLElement>(strength = 16) {
  const ref = useRef<T | null>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    if (!window.matchMedia('(pointer: fine)').matches) return;
    const onMove = (e: MouseEvent) => {
      const rect = el.getBoundingClientRect();
      const x = e.clientX - rect.left - rect.width / 2;
      const y = e.clientY - rect.top - rect.height / 2;
      el.style.transform = `translate(${x / strength}px, ${y / strength}px)`;
    };
    const onLeave = () => { el.style.transform = ''; };
    el.addEventListener('mousemove', onMove);
    el.addEventListener('mouseleave', onLeave);
    return () => {
      el.removeEventListener('mousemove', onMove);
      el.removeEventListener('mouseleave', onLeave);
    };
  }, [strength]);
  return ref;
}

function parseStatValue(value: string) {
  const match = value.match(/^([\d.]+)(.*)$/);
  if (!match) return { target: 0, suffix: value };
  return { target: parseInt(match[1].replace(/\./g, ''), 10), suffix: match[2] };
}

function StatCounter({ value, inView }: { value: string; inView: boolean }) {
  const { target, suffix } = parseStatValue(value);
  const [display, setDisplay] = useState(0);
  useEffect(() => {
    if (!inView) return;
    let frame: number;
    const duration = 1400;
    const start = performance.now();
    const tick = (now: number) => {
      const progress = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setDisplay(Math.round(eased * target));
      if (progress < 1) frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [inView, target]);
  return <>{display.toLocaleString('id-ID')}{suffix}</>;
}

function RotatingWord() {
  const [index, setIndex] = useState(0);
  const [animKey, setAnimKey] = useState(0);
  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const id = setInterval(() => {
      setIndex(i => (i + 1) % ROTATING_WORDS.length);
      setAnimKey(k => k + 1);
    }, 2200);
    return () => clearInterval(id);
  }, []);
  return <span key={animKey} className="gradient-text rotating-word">{ROTATING_WORDS[index]}</span>;
}

function ScrollProgressBar() {
  const [progress, setProgress] = useState(0);
  useEffect(() => {
    const onScroll = () => {
      const h = document.documentElement;
      const scrollTop = h.scrollTop || document.body.scrollTop;
      const scrollHeight = (h.scrollHeight || document.body.scrollHeight) - h.clientHeight;
      setProgress(scrollHeight > 0 ? (scrollTop / scrollHeight) * 100 : 0);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener('scroll', onScroll);
  }, []);
  return <div className="scroll-progress" style={{ width: `${progress}%` }} />;
}

function CustomCursor() {
  const dotRef = useRef<HTMLDivElement | null>(null);
  const ringRef = useRef<HTMLDivElement | null>(null);
  useEffect(() => {
    const isFine = window.matchMedia('(pointer: fine)').matches;
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (!isFine || reduced) return;
    let ringX = 0, ringY = 0, mouseX = 0, mouseY = 0;
    const move = (e: MouseEvent) => {
      mouseX = e.clientX; mouseY = e.clientY;
      if (dotRef.current) dotRef.current.style.transform = `translate(${mouseX}px, ${mouseY}px) translate(-50%, -50%)`;
      const target = e.target as HTMLElement;
      const interactive = target.closest && target.closest('a, button, [role="button"]');
      if (ringRef.current) ringRef.current.classList.toggle('cursor-ring-hover', !!interactive);
    };
    let raf: number;
    const loop = () => {
      ringX += (mouseX - ringX) * 0.18;
      ringY += (mouseY - ringY) * 0.18;
      if (ringRef.current) ringRef.current.style.transform = `translate(${ringX}px, ${ringY}px) translate(-50%, -50%)`;
      raf = requestAnimationFrame(loop);
    };
    window.addEventListener('mousemove', move);
    raf = requestAnimationFrame(loop);
    return () => {
      window.removeEventListener('mousemove', move);
      cancelAnimationFrame(raf);
    };
  }, []);
  return (
    <>
      <div ref={dotRef} className="cursor-dot" />
      <div ref={ringRef} className="cursor-ring" />
    </>
  );
}

function handleTilt(e: React.MouseEvent<HTMLButtonElement>) {
  const card = e.currentTarget;
  const rect = card.getBoundingClientRect();
  const x = e.clientX - rect.left;
  const y = e.clientY - rect.top;
  const rotateX = ((y / rect.height) - 0.5) * -6;
  const rotateY = ((x / rect.width) - 0.5) * 6;
  card.style.transform = `perspective(900px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-4px)`;
  card.style.setProperty('--mx', `${(x / rect.width) * 100}%`);
  card.style.setProperty('--my', `${(y / rect.height) * 100}%`);
}
function resetTilt(e: React.MouseEvent<HTMLButtonElement>) {
  e.currentTarget.style.transform = '';
}

export default function HomePage() {
  const [openJurusan, setOpenJurusan] = useState<string | null>(null);
  const [mobileBarDismissed, setMobileBarDismissed] = useState(false);
  const now = new Date();
  const activeStep = getActiveGelombangIndex();
  const activeStatus = getGelombangStatus(GELOMBANG[activeStep].mulai, GELOMBANG[activeStep].selesai, now);
  const daysLeft = useCountdown(GELOMBANG[activeStep].selesai);
  const pendaftaranDibuka = daysLeft !== null && daysLeft > 0 && activeStatus === 'buka';

  const heroRef = useRef<HTMLElement | null>(null);
  const blobWrap1Ref = useRef<HTMLDivElement | null>(null);
  const blobWrap2Ref = useRef<HTMLDivElement | null>(null);
  const statsReveal = useReveal<HTMLDivElement>();
  const magneticHero = useMagnetic<HTMLAnchorElement>();
  const magneticTimeline = useMagnetic<HTMLAnchorElement>();
  const magneticCta = useMagnetic<HTMLAnchorElement>();

  function handleHeroMove(e: React.MouseEvent<HTMLElement>) {
    const el = heroRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    el.style.setProperty('--spot-x', `${e.clientX - rect.left}px`);
    el.style.setProperty('--spot-y', `${e.clientY - rect.top}px`);
  }

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const onScroll = () => {
      const y = window.scrollY * 0.15;
      if (blobWrap1Ref.current) blobWrap1Ref.current.style.transform = `translateY(${y}px)`;
      if (blobWrap2Ref.current) blobWrap2Ref.current.style.transform = `translateY(${-y}px)`;
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <>
      <ScrollProgressBar />
      <CustomCursor />
      <Navbar />
      <main>
        {/* HERO */}
        <section ref={heroRef} onMouseMove={handleHeroMove} className="hero-gradient hero-section grain-overlay">
          {/* Background video — file: public/videos/sma.mp4 */}
          <div className="hero-video-wrap">
            <video
              className="hero-video"
              autoPlay
              muted
              loop
              playsInline
              preload="auto"
              poster="/images/logosma.png"
            >
              <source src="/videos/sma.mp4" type="video/mp4" />
            </video>
            <div className="hero-video-tint" />
          </div>
          <div ref={blobWrap1Ref} className="hero-blob-wrap"><div className="hero-blob hero-blob-1" /></div>
          <div ref={blobWrap2Ref} className="hero-blob-wrap"><div className="hero-blob hero-blob-2" /></div>
          <div className="hero-inner">
            <div className="hero-enter">
              <div className="badge-pill">
                <span className="badge-dot" />
                PENERIMAAN PESERTA DIDIK BARU 2027/2028
              </div>
              <h1 className="font-display hero-title">
                Raih Masa Depan <RotatingWord /> Bersama SMA Citra Negara
              </h1>
              <p className="hero-desc">
                Bergabunglah dengan ribuan alumni sukses. Pendidikan berkualitas tinggi dengan kurikulum terkini.
              </p>
              <div className="hero-buttons">
                <Link
                  ref={magneticHero}
                  href="/spmb"
                  className="btn-primary"
                  style={{ transition: 'transform .2s ease-out', display: 'inline-block' }}
                >Daftar SPMB Sekarang →</Link>
                <Link href="/tentang" className="btn-outline">Pelajari Lebih Lanjut</Link>
              </div>

              {pendaftaranDibuka && (
                <div className="countdown-chip">
                  <Clock size={14} />
                  <span><strong>{daysLeft}</strong> hari lagi menuju penutupan pendaftaran gelombang ini</span>
                </div>
              )}

              <div className="stats-row" ref={statsReveal.ref}>
                {STATS.map(s => (
                  <div key={s.label}>
                    <div className="font-display stat-value">
                      <StatCounter value={s.value} inView={statsReveal.visible} />
                    </div>
                    <div className="stat-label">{s.label}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Timeline Card */}
            <div className="timeline-wrap">
              <div className="timeline-card">
                <div className="tl-head">
                  <div className="tl-icon"><Calendar size={20} /></div>
                  <div>
                    <h3 className="font-display" style={{ color: 'white', fontSize: 22, lineHeight: 1.15 }}>Jadwal SPMB 2027</h3>
                    <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: 13, marginTop: 2 }}>Tahun Ajaran 2027/2028</p>
                  </div>
                </div>

                <div className="tl-list">
                  {GELOMBANG.map((item, i) => {
                    const status = getGelombangStatus(item.mulai, item.selesai, now);
                    const isActive = i === activeStep;
                    const selesai = status === 'selesai';
                    const label = status === 'buka' ? 'DIBUKA' : selesai ? 'DITUTUP' : 'AKAN DATANG';
                    return (
                      <div
                        key={i}
                        className={`tl-item ${isActive ? 'tl-item-active' : ''} ${selesai ? 'tl-item-done' : ''}`}
                      >
                        <div className={`tl-dot ${isActive ? 'tl-dot-active' : ''} ${selesai ? 'tl-dot-done' : ''}`}>
                          {selesai ? '✓' : i + 1}
                        </div>
                        <div className="tl-body">
                          <div className="tl-row">
                            <span className="tl-name">{item.nama}</span>
                            <span className={`tl-badge ${isActive ? 'tl-badge-active' : ''} ${selesai ? 'tl-badge-done' : ''}`}>{label}</span>
                          </div>
                          <div className="tl-date">{item.tgl}</div>
                        </div>
                      </div>
                    );
                  })}
                </div>

                <Link
                  ref={magneticTimeline}
                  href="/register"
                  className="btn-primary"
                  style={{ display: 'block', textAlign: 'center', marginTop: 24, fontSize: 14, transition: 'transform .2s ease-out' }}
                >Mulai Pendaftaran</Link>
              </div>
            </div>
          </div>
        </section>

        {/* MARQUEE */}
        <div className="marquee-strip">
          <div className="marquee-track">
            {[...MARQUEE_ITEMS, ...MARQUEE_ITEMS].map((t, i) => (
              <span key={i}><Sparkles size={13} /> {t}</span>
            ))}
          </div>
        </div>

        {/* JURUSAN */}
        <section className="section-white">
          <div className="section-inner">
            <Reveal>
              <div style={{ textAlign: 'center', marginBottom: 56 }}>
                <div className="gold-line" style={{ margin: '0 auto 16px' }} />
                <h2 className="font-display" style={{ fontSize: 38, color: '#0A1628', marginBottom: 12 }}>Program Keahlian</h2>
                <p style={{ color: '#6B7280', maxWidth: 500, margin: '0 auto', fontSize: 16 }}>Pilih jurusan sesuai minat dan bakat — ketuk kartu untuk lihat detail.</p>
              </div>
            </Reveal>
            <div className="jurusan-grid">
              {JURUSAN.map((j, idx) => {
                const isOpen = openJurusan === j.kode;
                return (
                  <Reveal key={j.kode} delay={idx * 100}>
                    <button
                      type="button"
                      className={`jurusan-card ${isOpen ? 'jurusan-card-open' : ''}`}
                      onClick={() => setOpenJurusan(isOpen ? null : j.kode)}
                      onMouseMove={handleTilt}
                      onMouseLeave={resetTilt}
                      aria-expanded={isOpen}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                        <img src={j.img} alt={j.kode} style={{ width: 56, height: 56, objectFit: 'contain', flexShrink: 0 }} />
                        <div style={{ textAlign: 'left', flex: 1 }}>
                          <div style={{ background: '#C8973A', color: 'white', fontSize: 10, fontWeight: 700, padding: '2px 8px', borderRadius: 4, display: 'inline-block', marginBottom: 6 }}>{j.kode}</div>
                          <h3 style={{ fontSize: 15, fontWeight: 700, color: '#0A1628', lineHeight: 1.3 }}>{j.nama}</h3>
                        </div>
                        <ChevronDown size={20} color="#C8973A" style={{ flexShrink: 0, transition: 'transform 0.25s ease', transform: isOpen ? 'rotate(180deg)' : 'none' }} />
                      </div>
                      <p style={{ fontSize: 12, color: '#6B7280', lineHeight: 1.5, margin: '14px 0 8px', textAlign: 'left' }}>{j.desc}</p>
                      <div style={{ fontSize: 12, color: '#C8973A', fontWeight: 600, textAlign: 'left' }}>Kuota: {j.kuota} siswa</div>

                      <div className="jurusan-detail" style={{ maxHeight: isOpen ? 240 : 0, opacity: isOpen ? 1 : 0 }}>
                        <div style={{ borderTop: '1px solid #F0EBE0', marginTop: 16, paddingTop: 16 }}>
                          {j.highlights.map((h, i) => (
                            <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
                              <CheckCircle size={14} color="#C8973A" style={{ flexShrink: 0 }} />
                              <span style={{ fontSize: 12.5, color: '#374151', textAlign: 'left' }}>{h}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </button>
                  </Reveal>
                );
              })}
            </div>
          </div>
        </section>

        {/* FASILITAS */}
        <section className="section-cream">
          <div className="fasilitas-inner">
            <Reveal>
              <div>
                <div className="gold-line" style={{ marginBottom: 16 }} />
                <h2 className="font-display" style={{ fontSize: 38, color: '#0A1628', marginBottom: 16 }}>Fasilitas Sekolah</h2>
                <p style={{ color: '#6B7280', lineHeight: 1.8, marginBottom: 32, fontSize: 16 }}>Lingkungan belajar terbaik dengan fasilitas modern yang mendukung proses pembelajaran berkualitas tinggi.</p>
                {FASILITAS.map((f, i) => (
                  <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 12 }}>
                    <CheckCircle size={18} color="#C8973A" />
                    <span style={{ fontSize: 14, color: '#374151' }}>{f}</span>
                  </div>
                ))}
              </div>
            </Reveal>
            <Reveal delay={150}>
              <div className="fasilitas-stats-grid">
                {FASILITAS_STATS.map((item, i) => (
                  <div key={i} className="stat-tile" style={{ background: item.bg, borderRadius: 16, padding: 24, color: 'white' }}>
                    <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.6)', marginBottom: 8 }}>{item.label}</div>
                    <div className="font-display" style={{ fontSize: 32, fontWeight: 700, color: '#E8B84B' }}>{item.val}</div>
                    <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.5)', marginTop: 4 }}>{item.sub}</div>
                  </div>
                ))}
              </div>
            </Reveal>
          </div>
        </section>

        {/* CTA */}
        <section className="cta-section">
          <Reveal>
            <div style={{ maxWidth: 700, margin: '0 auto', textAlign: 'center', position: 'relative', zIndex: 1 }}>
              <Sparkles size={26} color="#E8B84B" className="cta-sparkle" />
              <h2 className="font-display cta-title">Siap Bergabung?</h2>
              <p style={{ color: 'rgba(255,255,255,0.65)', fontSize: 16, lineHeight: 1.7, marginBottom: 36 }}>Pendaftaran Peserta Didik Baru tahun ajaran 2027/2028 sudah dibuka. Jangan lewatkan kesempatan ini!</p>
              <div style={{ display: 'flex', gap: 16, justifyContent: 'center', flexWrap: 'wrap' }}>
                <Link
                  ref={magneticCta}
                  href="/register"
                  className="btn-primary"
                  style={{ fontSize: 16, transition: 'transform .2s ease-out', display: 'inline-block' }}
                >Daftar Sekarang</Link>
                <Link href="/spmb" className="btn-outline" style={{ fontSize: 16 }}>Info SPMB</Link>
              </div>
            </div>
          </Reveal>
        </section>
      </main>
      <Footer />

      {/* Sticky mobile CTA */}
      {!mobileBarDismissed && (
        <div className="mobile-cta-bar">
          <div>
            <div style={{ fontWeight: 700, fontSize: 13, color: '#0A1628' }}>PPDB 2027/2028 Dibuka</div>
            <div style={{ fontSize: 11, color: '#6B7280' }}>Daftar sekarang, kuota terbatas</div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <Link href="/register" className="btn-primary" style={{ fontSize: 13, padding: '10px 16px' }}>Daftar</Link>
            <button
              type="button"
              aria-label="Tutup"
              onClick={() => setMobileBarDismissed(true)}
              style={{ background: 'none', border: 'none', padding: 6, color: '#6B7280', cursor: 'pointer' }}
            >
              <X size={18} />
            </button>
          </div>
        </div>
      )}

      <style jsx>{`
        :global(.scroll-progress) {
          position: fixed; top: 0; left: 0; height: 3px;
          background: linear-gradient(90deg, #C8973A, #E8B84B, #17713b);
          z-index: 100; transition: width .1s linear;
        }
        :global(.cursor-dot) { position: fixed; top: 0; left: 0; width: 8px; height: 8px; background: #E8B84B; border-radius: 50%; pointer-events: none; z-index: 200; will-change: transform; }
        :global(.cursor-ring) { position: fixed; top: 0; left: 0; width: 36px; height: 36px; border: 1.5px solid rgba(232,184,75,0.6); border-radius: 50%; pointer-events: none; z-index: 199; will-change: transform; transition: width .25s ease, height .25s ease, border-color .25s ease, background .25s ease; }
        :global(.cursor-ring.cursor-ring-hover) { width: 56px; height: 56px; background: rgba(232,184,75,0.12); border-color: #E8B84B; }
        @media (pointer: coarse) { :global(.cursor-dot), :global(.cursor-ring) { display: none; } }

        :global(.gradient-text) {
          background: linear-gradient(90deg, #E8B84B, #C8973A, #E8B84B);
          background-size: 200% auto;
          -webkit-background-clip: text; background-clip: text; color: transparent;
          animation: gradient-text-move 3s linear infinite;
        }
        :global(.rotating-word) { display: inline-block; animation: word-pop-in .5s cubic-bezier(.22,1,.36,1); }
        @keyframes gradient-text-move { to { background-position: 200% center; } }
        @keyframes word-pop-in { from { opacity: 0; transform: translateY(16px); } to { opacity: 1; transform: translateY(0); } }

        .hero-section { padding: 100px 24px 120px; position: relative; overflow: hidden; }

        .hero-video-wrap { position: absolute; inset: 0; z-index: 0; overflow: hidden; pointer-events: none; }
        .hero-video {
          position: absolute; inset: 0; width: 100%; height: 100%;
          object-fit: cover; display: block;
          filter: brightness(1.08) saturate(1.05) contrast(1.02);
        }
        .hero-video-tint {
          position: absolute; inset: 0;
          background:
            linear-gradient(105deg, rgba(4,26,14,0.72) 0%, rgba(5,46,22,0.42) 42%, rgba(5,46,22,0.24) 100%),
            radial-gradient(130% 100% at 50% 0%, rgba(4,20,11,0) 55%, rgba(4,20,11,0.38) 100%);
        }

        .hero-section::before {
          content: '';
          position: absolute; inset: 0;
          background: radial-gradient(500px circle at var(--spot-x, 50%) var(--spot-y, 50%), rgba(232,184,75,0.14), transparent 60%);
          pointer-events: none; z-index: 0;
        }
        .grain-overlay { position: relative; }
        .grain-overlay::after {
          content: '';
          position: absolute; inset: 0; z-index: 0; pointer-events: none; opacity: 0.05; mix-blend-mode: overlay;
          background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='120' height='120'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E");
        }
        .hero-blob-wrap { position: absolute; inset: 0; z-index: 0; pointer-events: none; }
        .hero-blob { position: absolute; border-radius: 50%; filter: blur(90px); opacity: 0.32; }
        .hero-blob-1 { width: 420px; height: 420px; background: #C8973A; top: -120px; right: -100px; animation: float-blob 10s ease-in-out infinite; }
        .hero-blob-2 { width: 320px; height: 320px; background: #17713b; bottom: -100px; left: -80px; animation: float-blob 12s ease-in-out infinite reverse; }
        @keyframes float-blob { 0%, 100% { transform: translate(0,0) scale(1); } 50% { transform: translate(30px,-20px) scale(1.08); } }

        .hero-inner {
          max-width: 1200px; margin: 0 auto;
          display: grid; grid-template-columns: 1fr 1fr; gap: 60px; align-items: center;
          position: relative; z-index: 1;
        }
        .hero-enter > * { opacity: 0; animation: fade-up-in .8s cubic-bezier(.22,1,.36,1) forwards; }
        .hero-enter > *:nth-child(1) { animation-delay: .05s; }
        .hero-enter > *:nth-child(2) { animation-delay: .15s; }
        .hero-enter > *:nth-child(3) { animation-delay: .25s; }
        .hero-enter > *:nth-child(4) { animation-delay: .35s; }
        .hero-enter > *:nth-child(5) { animation-delay: .45s; }
        @keyframes fade-up-in { from { opacity: 0; transform: translateY(24px); } to { opacity: 1; transform: none; } }

        .badge-pill {
          display: inline-flex; align-items: center; gap: 10px;
          background: rgba(200, 151, 58, 0.15);
          border: 1px solid rgba(200, 151, 58, 0.3);
          border-radius: 20px; padding: 6px 16px;
          color: #E8B84B; font-size: 12px; font-weight: 600; margin-bottom: 24px;
        }
        .badge-dot { width: 6px; height: 6px; border-radius: 50%; background: #4ADE80; animation: badge-pulse 1.8s ease-out infinite; }
        @keyframes badge-pulse {
          0% { box-shadow: 0 0 0 0 rgba(74,222,128,0.6); }
          70% { box-shadow: 0 0 0 8px rgba(74,222,128,0); }
          100% { box-shadow: 0 0 0 0 rgba(74,222,128,0); }
        }
        .hero-title { font-size: 56px; color: white; line-height: 1.15; margin-bottom: 24px; font-weight: 700; }
        .hero-desc { color: rgba(255, 255, 255, 0.75); font-size: 17px; line-height: 1.7; margin-bottom: 36px; max-width: 480px; }
        .hero-buttons { display: flex; gap: 16px; flex-wrap: wrap; }
        .hero-buttons :global(a) { transition: box-shadow .25s ease; }
        .hero-buttons :global(a:hover) { box-shadow: 0 10px 24px rgba(200,151,58,0.3); }
        .countdown-chip {
          display: inline-flex; align-items: center; gap: 8px; margin-top: 20px;
          padding: 8px 14px; background: rgba(232, 184, 75, 0.12);
          border: 1px solid rgba(232, 184, 75, 0.35); border-radius: 10px;
          color: #E8B84B; font-size: 12.5px;
          animation: countdown-glow 2.4s ease-in-out infinite;
        }
        @keyframes countdown-glow {
          0%, 100% { box-shadow: 0 0 0 0 rgba(232,184,75,0.15); }
          50% { box-shadow: 0 0 0 6px rgba(232,184,75,0); }
        }
        .stats-row { display: flex; gap: 32px; margin-top: 48px; flex-wrap: wrap; }
        .stat-value { color: #E8B84B; font-size: 28px; font-weight: 700; }
        .stat-label { color: rgba(255, 255, 255, 0.6); font-size: 12px; }
        .timeline-wrap { display: flex; justify-content: center; }
        .timeline-card {
          background: rgba(255, 255, 255, 0.06); backdrop-filter: blur(20px);
          border: 1px solid rgba(200, 151, 58, 0.3); border-radius: 20px;
          padding: 36px; width: 100%; max-width: 380px;
        }
        .tl-head { display: flex; align-items: center; gap: 14px; margin-bottom: 22px; }
        .tl-icon {
          width: 44px; height: 44px; border-radius: 12px; flex-shrink: 0;
          display: flex; align-items: center; justify-content: center;
          background: linear-gradient(135deg,#C8973A,#E8B84B); color: #0A1628;
          box-shadow: 0 0 22px rgba(232,184,75,0.28);
        }

        .tl-list { position: relative; display: flex; flex-direction: column; gap: 4px; }
        .tl-list::before {
          content: ''; position: absolute; left: 27px; top: 16px; bottom: 16px; width: 2px;
          background: rgba(255,255,255,0.1);
        }

        .tl-item {
          position: relative; display: flex; gap: 14px; padding: 12px;
          border-radius: 12px; transition: background .25s ease;
        }
        .tl-item-active {
          background: linear-gradient(135deg, rgba(200,151,58,0.18), rgba(200,151,58,0.04));
          box-shadow: inset 0 0 0 1px rgba(232,184,75,0.35);
        }
        .tl-item-done { opacity: 0.5; }

        .tl-dot {
          position: relative; z-index: 1;
          width: 32px; height: 32px; border-radius: 50%; flex-shrink: 0;
          display: flex; align-items: center; justify-content: center;
          font-size: 13px; font-weight: 800;
          background: #16273e; color: rgba(255,255,255,0.4);
        }
        .tl-dot-active {
          background: linear-gradient(135deg,#C8973A,#E8B84B); color: #0A1628;
          box-shadow: 0 0 0 4px rgba(232,184,75,0.16);
        }
        .tl-dot-done { background: rgba(232,184,75,0.22); color: #E8B84B; }

        .tl-body { flex: 1; min-width: 0; }
        .tl-row { display: flex; align-items: center; gap: 8px; flex-wrap: wrap; }
        .tl-name { font-size: 13px; font-weight: 700; color: rgba(255,255,255,0.55); }
        .tl-item-active .tl-name { color: #fff; }
        .tl-badge {
          font-size: 8.5px; font-weight: 800; letter-spacing: 0.5px;
          padding: 2px 7px; border-radius: 999px;
          background: rgba(200,151,58,0.15); color: #E8B84B;
        }
        .tl-badge-active { background: #E8B84B; color: #0A1628; }
        .tl-badge-done { background: rgba(255,255,255,0.1); color: rgba(255,255,255,0.45); }
        .tl-date { font-size: 11.5px; color: rgba(255,255,255,0.3); margin-top: 3px; }
        .tl-item-active .tl-date { color: rgba(232,184,75,0.85); }

        .marquee-strip { background: #0A1628; overflow: hidden; padding: 14px 0; border-top: 1px solid rgba(255,255,255,0.08); border-bottom: 1px solid rgba(255,255,255,0.08); }
        .marquee-track { display: flex; width: max-content; animation: marquee 22s linear infinite; gap: 40px; }
        .marquee-track span { display: flex; align-items: center; gap: 8px; color: #E8B84B; font-weight: 700; font-size: 13px; letter-spacing: 0.05em; text-transform: uppercase; white-space: nowrap; }
        @keyframes marquee { 0% { transform: translateX(0); } 100% { transform: translateX(-50%); } }

        .section-white { padding: 80px 24px; background: white; }
        .section-cream { padding: 80px 24px; background: #FAF7F0; }
        .section-inner { max-width: 1200px; margin: 0 auto; }

        .jurusan-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(min(320px, 100%), 1fr)); gap: 20px; }
        .jurusan-card {
          position: relative; isolation: isolate;
          background: white; border: 1.5px solid #F0EBE0; border-radius: 14px; padding: 24px;
          transition: border-color .2s, box-shadow .2s, transform .15s ease-out;
          cursor: pointer; width: 100%; text-align: left; font: inherit;
          -webkit-tap-highlight-color: transparent; will-change: transform;
        }
        .jurusan-card::before {
          content: '';
          position: absolute; inset: -2px; border-radius: 16px;
          background: linear-gradient(120deg, #C8973A, #15803d, #E8B84B, #C8973A);
          background-size: 300% 300%;
          z-index: -1; opacity: 0; transition: opacity .3s ease;
          animation: shimmer-move 3s linear infinite;
        }
        .jurusan-card:hover::before, .jurusan-card-open::before { opacity: 1; }
        @keyframes shimmer-move { 0% { background-position: 0% 50%; } 100% { background-position: 300% 50%; } }
        .jurusan-card::after {
          content: '';
          position: absolute; inset: 0; border-radius: 14px;
          background: radial-gradient(200px circle at var(--mx, 50%) var(--my, 50%), rgba(200,151,58,0.1), transparent 70%);
          opacity: 0; transition: opacity .3s; pointer-events: none;
        }
        .jurusan-card:hover::after { opacity: 1; }
        .jurusan-card:hover, .jurusan-card:focus-visible, .jurusan-card-open {
          border-color: #C8973A; box-shadow: 0 8px 30px rgba(200, 151, 58, 0.15);
        }
        .jurusan-card:active { transform: scale(0.99); }
        .jurusan-detail { overflow: hidden; transition: max-height 0.35s ease, opacity 0.3s ease; }

        .fasilitas-inner { max-width: 1200px; margin: 0 auto; display: grid; grid-template-columns: 1.1fr 1fr; gap: 60px; align-items: center; }
        .fasilitas-stats-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; }
        .stat-tile { transition: transform .3s ease, box-shadow .3s ease; }
        .stat-tile:hover { transform: translateY(-6px) scale(1.02); box-shadow: 0 16px 32px rgba(0,0,0,0.18); }

        .cta-section { padding: 80px 24px; background: #15803d; position: relative; overflow: hidden; }
        .cta-section::before {
          content: '';
          position: absolute; inset: 0;
          background: radial-gradient(400px circle at 50% 0%, rgba(232,184,75,0.18), transparent 70%);
          animation: pulse-glow 4s ease-in-out infinite;
        }
        @keyframes pulse-glow { 0%, 100% { opacity: 0.6; } 50% { opacity: 1; } }
        .cta-title { color: white; font-size: 40px; margin-bottom: 16px; }
        .cta-sparkle { margin-bottom: 12px; animation: spin-slow 6s linear infinite; }
        @keyframes spin-slow { to { transform: rotate(360deg); } }

        .mobile-cta-bar {
          display: none; position: fixed; left: 0; right: 0; bottom: 0; z-index: 40;
          background: white; border-top: 1px solid #F0EBE0;
          box-shadow: 0 -4px 20px rgba(0,0,0,0.08);
          padding: 12px 16px calc(12px + env(safe-area-inset-bottom));
          align-items: center; justify-content: space-between;
        }

        :global(:focus-visible) { outline: 2px solid #E8B84B; outline-offset: 2px; }

        @media (prefers-reduced-motion: reduce) {
          :global(*), :global(*::before), :global(*::after) {
            animation-duration: 0.01ms !important;
            animation-iteration-count: 1 !important;
            transition-duration: 0.01ms !important;
            scroll-behavior: auto !important;
          }
        }

        @media (max-width: 900px) {
          .hero-inner { grid-template-columns: 1fr; gap: 40px; }
          .fasilitas-inner { grid-template-columns: 1fr; gap: 36px; }
          .hero-desc { max-width: 100%; }
        }

        @media (max-width: 640px) {
          .hero-section { padding: 64px 20px 48px; }
          .hero-title { font-size: 34px; }
          .badge-pill { font-size: 10.5px; padding: 5px 12px; }
          .hero-buttons { flex-direction: column; }
          .hero-buttons :global(a) { text-align: center; }
          .stats-row { gap: 20px; margin-top: 32px; }
          .stat-value { font-size: 22px; }
          .timeline-card { padding: 24px 20px; }
          .section-white, .section-cream { padding: 56px 16px 88px; }
          .cta-section { padding: 56px 20px; }
          .cta-title { font-size: 30px; }
          .fasilitas-stats-grid { gap: 12px; }
          .mobile-cta-bar { display: flex; }
        }

        @media (prefers-reduced-motion: reduce) {
          .jurusan-detail, .jurusan-card, .tl-dot, .tl-item { transition: none; }
          .hero-video { display: none; }
        }
      `}</style>
    </>
  );
}