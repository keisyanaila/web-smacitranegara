'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import {
  ArrowRight,
  Award,
  BookOpen,
  Building2,
  FlaskConical,
  GraduationCap,
  Sparkles,
  Trophy,
  Users,
  Utensils,
  Wifi,
  X,
} from 'lucide-react';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { SPMB_URL, type SpmbSetting } from '@/lib/spmb';
import Hero from './Hero';
import JurusanTabs from './JurusanTabs';
import { Counter, Reveal, useInView, useMagnetic, useSpotlight } from './fx';
import './home.css';



const FASILITAS = [
  { icon: FlaskConical, label: 'Lab tiap jurusan' },
  { icon: Wifi, label: 'WiFi semua gedung' },
  { icon: BookOpen, label: 'Perpustakaan' },
  { icon: Building2, label: 'Auditorium' },
  { icon: Utensils, label: 'Kantin' },
  { icon: Users, label: '2 Lapangan' },
];

const MARQUEE_A = ['JURUSAN IPA & IPS', 'AKREDITASI A', 'STARLINK 1 GBPS', '13+ EKSTRAKURIKULER', 'KUOTA TERBATAS'];
const MARQUEE_B = ['BERKARAKTER', 'BERPRESTASI', 'BERWAWASAN GLOBAL', 'SIAP KULIAH', 'KREATIF'];

function SectionHead({
  eyebrow,
  title,
  desc,
  dark = false,
  align = 'center',
}: {
  eyebrow: string;
  title: React.ReactNode;
  desc?: string;
  dark?: boolean;
  align?: 'center' | 'left';
}) {
  return (
    <Reveal className={`h-head h-head-${align}${dark ? ' h-head-dark' : ''}`}>
      <span className="h-eyebrow">{eyebrow}</span>
      <h2 className="font-display">{title}</h2>
      {desc && <p>{desc}</p>}
    </Reveal>
  );
}

/** Cincin progres yang "tergambar" saat terlihat. */
function Ring({ pct }: { pct: number }) {
  const { ref, inView } = useInView<SVGSVGElement>();
  const C = 2 * Math.PI * 52;
  return (
    <svg ref={ref} className="h-ring" viewBox="0 0 120 120" aria-hidden="true">
      <circle cx="60" cy="60" r="52" className="h-ring-bg" />
      <circle
        cx="60"
        cy="60"
        r="52"
        className="h-ring-fg"
        style={{ strokeDasharray: C, strokeDashoffset: inView ? C * (1 - pct) : C }}
      />
    </svg>
  );
}

function Bento() {
  const gridRef = useSpotlight<HTMLDivElement>('.h-tile');

  return (
    <div className="h-bento" ref={gridRef}>
      <Reveal className="h-tile h-tile-hero" variant="zoom">
        <div className="h-tile-akr">
          <div className="h-ring-wrap">
            <Ring pct={1} />
            <span className="font-display">A</span>
          </div>
          <div>
            <span className="h-tile-label">Akreditasi BAN-S/M</span>
            <h3 className="font-display">Terakreditasi A</h3>
            <p>Mutu pendidikan yang terukur dan diakui — dari kurikulum, guru, hingga fasilitas belajar.</p>
          </div>
        </div>
        <Award className="h-tile-bg-icon" size={180} strokeWidth={1} aria-hidden="true" />
      </Reveal>

      <Reveal className="h-tile h-tile-gold" delay={80}>
        <span className="h-tile-label">Internet Sekolah</span>
        <div className="h-tile-num font-display">1 Gbps</div>
        <div className="h-signal" aria-hidden="true">
          <span /><span /><span /><span />
        </div>
        <p>Starlink super cepat untuk belajar & riset.</p>
      </Reveal>

      <Reveal className="h-tile" delay={140}>
        <FlaskConical className="h-tile-icon" size={26} />
        <div className="h-tile-num font-display"><Counter value="50+" /></div>
        <p>Fasilitas lab untuk praktik langsung tiap jurusan.</p>
      </Reveal>

      <Reveal className="h-tile h-tile-wide h-tile-dark" delay={80}>
        <div className="h-dots" aria-hidden="true" />
        <GraduationCap className="h-tile-icon" size={26} />
        {/* Tahun ditulis biasa (bukan Counter) supaya tidak jadi "2.024". */}
        <div className="h-tile-num font-display notranslate" translate="no">2024</div>
        <span className="h-tile-label">Tahun berdiri · angkatan perdana sedang tumbuh bersama kami</span>
      </Reveal>

      <Reveal className="h-tile h-tile-wide" delay={140}>
        <span className="h-tile-label">Fasilitas lengkap</span>
        <ul className="h-fac">
          {FASILITAS.map(({ icon: Icon, label }, i) => (
            <li key={label} style={{ '--k': i } as React.CSSProperties}>
              <Icon size={16} /> {label}
            </li>
          ))}
        </ul>
      </Reveal>

      <Reveal className="h-tile h-tile-wide" delay={200}>
        <div className="h-tile-row">
          <div>
            <span className="h-tile-label">Ekstrakurikuler</span>
            <div className="h-tile-num font-display"><Counter value="13+" /></div>
          </div>
          <Trophy className="h-tile-icon" size={26} />
        </div>
        <p>Olahraga, seni, bela diri, hingga organisasi — wadah bakat di luar kelas.</p>
      </Reveal>
    </div>
  );
}

function Marquee() {
  return (
    <div className="h-marquee" aria-hidden="true">
      <div className="h-marquee-row">
        <div className="h-marquee-track">
          {[...MARQUEE_A, ...MARQUEE_A].map((t, i) => (
            <span key={i}><Sparkles size={14} /> {t}</span>
          ))}
        </div>
      </div>
      <div className="h-marquee-row h-marquee-alt">
        <div className="h-marquee-track h-marquee-rev">
          {[...MARQUEE_B, ...MARQUEE_B].map((t, i) => (
            <span key={i}>{t} <span className="h-marquee-star">✦</span></span>
          ))}
        </div>
      </div>
    </div>
  );
}


function FinalCta({ ta }: { ta: string }) {
  const btn = useMagnetic<HTMLAnchorElement>();
  return (
    <section className="h-cta h-cv">
      <div className="h-cta-glow" aria-hidden="true" />
      <Reveal className="h-cta-card" variant="zoom">
        <span className="h-eyebrow">SPMB {ta}</span>
        <h2 className="font-display">
          Siap Menulis Cerita <em>Suksesmu</em> di Sini?
        </h2>
        <p>Kuota setiap jurusan terbatas. Daftar online dalam hitungan menit — langsung dari HP-mu.</p>
        <div className="h-cta-actions">
          <a ref={btn} href={SPMB_URL} target="_blank" rel="noopener noreferrer" className="h-btn h-btn-gold h-btn-lg">
            <span>Daftar Sekarang</span>
            <ArrowRight size={18} />
          </a>
          <Link href="/tentang" className="h-btn h-btn-ghost h-btn-lg">Kenali Sekolah Kami</Link>
        </div>
        <ul className="h-cta-trust">
          <li><Award size={15} /> Akreditasi A</li>
          <li><GraduationCap size={15} /> Peminatan IPA & IPS</li>
          <li><Sparkles size={15} /> 13+ ekstrakurikuler</li>
        </ul>
      </Reveal>
    </section>
  );
}

/** Bar daftar di bawah layar HP — muncul setelah tombol daftar di hero terlewati. */
function MobileBar({ ta }: { ta: string }) {
  const [show, setShow] = useState(false);
  const [closed, setClosed] = useState(false);

  useEffect(() => {
    const target = document.getElementById('h-hero-cta');
    const footer = document.querySelector('footer');
    if (!target) return;
    let pastHero = false;
    let atFooter = false;
    // Tampil setelah tombol hero terlewati, sembunyi lagi saat footer terlihat
    // supaya info kontak di footer tidak tertutup.
    const io = new IntersectionObserver((entries) => {
      for (const e of entries) {
        if (e.target === target) pastHero = !e.isIntersecting && e.boundingClientRect.top < 0;
        else atFooter = e.isIntersecting;
      }
      setShow(pastHero && !atFooter);
    });
    io.observe(target);
    if (footer) io.observe(footer);
    return () => io.disconnect();
  }, []);

  // Selalu dirender (hanya class yang berubah) supaya aman untuk terjemahan Google.
  return (
    <div className={`h-mbar${show && !closed ? ' is-on' : ''}`} aria-hidden={!show || closed}>
      <div>
        <strong>PPDB {ta} Dibuka</strong>
        <span>Kuota terbatas — daftar sekarang</span>
      </div>
      <a href={SPMB_URL} target="_blank" rel="noopener noreferrer" className="h-btn h-btn-gold">Daftar</a>
      <button type="button" aria-label="Tutup" onClick={() => setClosed(true)}>
        <X size={18} />
      </button>
    </div>
  );
}

export default function HomeView({ spmb }: { spmb: SpmbSetting }) {
  return (
    <div className="h-root">
      <div className="h-progress" aria-hidden="true" />
      <Navbar />
      <main>
        <Hero spmb={spmb} />

        <Marquee />

        <section className="h-sec h-sec-white" id="keunggulan">
          <div className="h-wrap">
            <SectionHead
              eyebrow="Kenapa Citra Negara"
              title={<>Sekolah yang Bikin Kamu <em>Berkembang</em></>}
              desc="Bukan cuma tempat belajar — ini ekosistem untuk tumbuh jadi versi terbaik dirimu."
            />
            <Bento />
          </div>
        </section>

        <section className="h-sec h-sec-cream h-cv">
          <div className="h-wrap">
            <SectionHead
              eyebrow="Program Keahlian"
              title={<>Pilih Jalur <em>Masa Depanmu</em></>}
              desc="Dua peminatan, satu tujuan: membekalimu melangkah ke jenjang berikutnya."
            />
            <Reveal delay={100}>
              <JurusanTabs />
            </Reveal>
          </div>
        </section>



        <FinalCta ta={spmb.tahunAjaran} />
      </main>
      <Footer />
      <MobileBar ta={spmb.tahunAjaran} />
    </div>
  );
}
