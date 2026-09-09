'use client';
import Image from 'next/image';
import { useEffect, useRef, useState } from 'react';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { Target, Eye, ChevronDown, CalendarDays, GraduationCap, Users, Award } from 'lucide-react';

/* ══════════════════════════════════════════
   DATA STRUKTUR ORGANISASI (isi tidak diubah)
══════════════════════════════════════════ */
type Orang = { nama: string; jabatan: string };
type Departemen = { nama: string; jabatan: string; tim?: Orang[] };

const KETUA_YATKJ: Orang = { nama: 'Dr. M. Rizki Darmaguna Hasan, S.Tr., M.Pd', jabatan: 'Ketua YATKJ' };
const ADVISOR: Orang = { nama: 'Hj. Mutiah, S.Pd., MM', jabatan: 'Advisor BPH' };
const KETUA_BPH: Orang = { nama: 'Agustin Wijayanti, S.H., MM', jabatan: 'Ketua BPH YATKJ' };
const KETUA_KOMITE: Orang = { nama: 'Elly Kurniawati, S.H', jabatan: 'Ketua Komite' };
const KEPSEK: Orang = { nama: 'Ahmad Taufik, S.Kom', jabatan: 'Kepala SMA Citra Negara' };

const DEPARTEMEN: Departemen[] = [
  {
    nama: 'Drs. Dedi Suandi, M.Pd', jabatan: 'Waka Kurikulum',
    tim: [
      { nama: 'Febia Maulina, S.Pd', jabatan: 'Kepala Lab IPA' },
      { nama: 'Magreza Wahyu I, S.T', jabatan: 'Kepala Lab Komputer' },
    ],
  },
  {
    nama: 'Andri Prihadi, S.T', jabatan: 'Waka Kesiswaan',
    tim: [
      { nama: 'Sylviana, SE, S.Sos, M.Pd.I', jabatan: 'Pembina OSIS' },
      { nama: 'Samsul Bahri, S.Pd', jabatan: 'Pembina IRMA' },
      { nama: 'Annisa Larasati, Sos', jabatan: 'Pembina NAKAMA' },
      { nama: 'Balqis Ananda Safitri, S.Pd', jabatan: 'Guru BK' },
    ],
  },
  {
    nama: 'Riki Yakub, S.Kom', jabatan: 'Waka Sapras',
    tim: [
      { nama: 'Riza Febriansyah', jabatan: 'Office Boy' },
      { nama: 'Haris Isyanto', jabatan: 'Security' },
    ],
  },
  { nama: 'Ir. Lukman Kharis, M.Pd', jabatan: 'Waka Humas' },
  {
    nama: 'Decky Ryansyah, M.Kom', jabatan: 'Kepala IT',
    tim: [{ nama: 'Ilham Nur Fajril', jabatan: 'Teknisi' }],
  },
  {
    nama: 'Nindi Tiarawati, S.Pd', jabatan: 'Kepala Tata Usaha',
    tim: [
      { nama: 'Syafangatul Karim, S.Pd', jabatan: 'Bendahara' },
      { nama: 'Lia Lestari', jabatan: 'Sekretaris Tata Usaha' },
    ],
  },
];

const STATS = [
  { icon: CalendarDays, to: 2024, suffix: '', label: 'Tahun Berdiri' },
  { icon: GraduationCap, to: 2, suffix: '', label: 'Program Peminatan' },
  { icon: Users, to: 500, suffix: '+', label: 'Siswa Aktif' },
  { icon: Award, to: 50, suffix: '+', label: 'Prestasi Diraih' },
];

/* Isi Visi & Misi — sama persis dengan versi sebelumnya */
const VISI =
  'Terwujudnya Sekolah Kejujuran yang Religius, Disiplin dan Terampil Dalam Menyongsong Generasi Emas di Tahun 2045';

const MISI = [
  'Menanamkan karakter religius dan berakhlak mulia melalui pembiasaan keagamaan serta penguatan nilai moral dalam kehidupan sekolah.',
  'Mewujudkan budaya disiplin dan tanggung jawab melalui tata tertib yang konsisten dan pembiasaan perilaku positif.',
  'Meningkatkan penguasaan IPTEK dan literasi digital melalui pembelajaran inovatif dan pemanfaatan teknologi dalam proses belajar.',
  'Membangun lingkungan belajar yang aman, kolaboratif, dan berorientasi pada keterampilan abad 21 untuk menyiapkan Generasi Emas 2045.',
];

/* ══════════════════════════════════════════
   CSS — disamakan dengan halaman /smkcn/tentang
══════════════════════════════════════════ */
const CSS = `
  /* ── Scroll reveal ── */
  .reveal { opacity: 0; transform: translateY(28px); transition: opacity .7s ease, transform .7s ease; }
  .reveal.in { opacity: 1; transform: none; }
  .reveal.d1 { transition-delay: .08s; }
  .reveal.d2 { transition-delay: .16s; }
  .reveal.d3 { transition-delay: .24s; }
  .reveal.d4 { transition-delay: .32s; }
  @media (prefers-reduced-motion: reduce) {
    .reveal { opacity: 1; transform: none; transition: none; }
  }

  /* ── Hero ── */
  .hero-section { padding: 90px 24px 70px; }
  .hero-inner { max-width: 820px; margin: 0 auto; text-align: center; }
  .hero-logo-wrap { width: 170px; height: 170px; position: relative; margin: 0 auto; border-radius: 12px; overflow: hidden; }
  .hero-title { font-size: 46px; color: white; margin-bottom: 16px; }
  .hero-desc { color: rgba(255,255,255,0.75); font-size: 17px; line-height: 1.7; max-width: 600px; margin: 0 auto; }

  /* ── Stat strip ── */
  .stat-strip {
    max-width: 1000px; margin: -46px auto 0; padding: 0 24px;
    display: grid; grid-template-columns: repeat(4, 1fr); gap: 18px;
    position: relative; z-index: 5;
  }
  .stat-card {
    background: #fff; border: 1px solid #ECE3D2; border-radius: 16px;
    padding: 22px 16px; text-align: center;
    box-shadow: 0 14px 34px rgba(10,22,40,0.10);
    transition: transform .25s ease, box-shadow .25s ease;
  }
  .stat-card:hover { transform: translateY(-5px); box-shadow: 0 20px 40px rgba(10,22,40,0.16); }
  .stat-ico {
    width: 42px; height: 42px; border-radius: 11px; margin: 0 auto 10px;
    display: flex; align-items: center; justify-content: center;
    background: linear-gradient(135deg, #C8973A, #E8B84B);
  }
  .stat-num { font-family: 'Playfair Display', serif; font-size: 30px; font-weight: 700; color: #123524; line-height: 1; }
  .stat-lbl { font-size: 12.5px; color: #6B7280; margin-top: 6px; font-weight: 600; letter-spacing: .3px; }

  /* ── Section shell ── */
  .sec { padding: 78px 24px; }
  .sec-cream { background: #FAF7F0; }
  .sec-white { background: #fff; }
  .sec-head { text-align: center; margin-bottom: 48px; }
  .sec-title { font-size: 36px; color: #0A1628; margin: 6px 0 0; }
  .sec-kicker { color: #C8973A; font-weight: 700; font-size: 13px; letter-spacing: 2px; text-transform: uppercase; }

  /* ── Sambutan ── */
  .sambutan-grid {
    display: grid; grid-template-areas: "photo" "text";
    grid-template-columns: 1fr; gap: 28px; max-width: 700px; margin: 0 auto;
  }
  .sambutan-photo-area { grid-area: photo; }
  .sambutan-text-area { grid-area: text; }
  .sambutan-photo-wrap {
    width: 210px; margin: 0 auto; border-radius: 16px; overflow: hidden;
    box-shadow: 0 16px 34px rgba(0,0,0,0.16); border: 4px solid #fff;
  }
  .sambutan-name { font-family: 'Playfair Display', serif; font-size: 20px; color: #123524; margin-top: 14px; text-align: center; }
  .sambutan-role { font-size: 12.5px; color: #C8973A; font-weight: 700; text-align: center; letter-spacing: 1px; }
  .sambutan-p { color: #4B5563; line-height: 1.9; font-size: 15px; margin-bottom: 14px; }
  .sambutan-fade {
    position: relative; max-height: 168px; overflow: hidden;
    transition: max-height .5s ease;
  }
  .sambutan-fade.open { max-height: 1400px; }
  .sambutan-fade:not(.open)::after {
    content: ''; position: absolute; left: 0; right: 0; bottom: 0; height: 70px;
    background: linear-gradient(transparent, #FAF7F0);
  }
  .read-btn {
    display: inline-flex; align-items: center; gap: 6px; margin-top: 6px;
    background: none; border: none; cursor: pointer;
    color: #123524; font-weight: 700; font-size: 14px; font-family: inherit;
  }
  .read-btn svg { transition: transform .3s ease; }
  .read-btn.open svg { transform: rotate(180deg); }
  @media (min-width: 861px) {
    .sambutan-grid {
      grid-template-areas: "photo text"; grid-template-columns: 300px 1fr;
      max-width: 1080px; gap: 60px; align-items: start;
    }
    .sambutan-photo-wrap { width: 100%; max-width: 300px; position: sticky; top: 100px; }
  }

  /* ── Visi Misi tabs ── */
  .vm-wrap { max-width: 900px; margin: 0 auto; }
  .vm-tabs { display: flex; gap: 10px; justify-content: center; margin-bottom: 26px; flex-wrap: wrap; }
  .vm-tab {
    display: inline-flex; align-items: center; gap: 8px;
    padding: 11px 24px; border-radius: 999px; cursor: pointer;
    border: 1.5px solid #E2D9C8; background: #fff; color: #6B7280;
    font-weight: 700; font-size: 14px; font-family: inherit; transition: all .2s ease;
  }
  .vm-tab.active { background: linear-gradient(135deg, #123524, #1E5A3D); color: #fff; border-color: #123524; }
  .vm-tab:not(.active):hover { border-color: #C8973A; color: #123524; }
  .vm-panel {
    background: linear-gradient(160deg, #123524, #0B2A1C); color: #fff;
    border-radius: 20px; padding: 40px; box-shadow: 0 20px 50px rgba(18,53,36,0.28);
  }
  .vm-panel h3 { font-family: 'Playfair Display', serif; font-size: 24px; margin-bottom: 16px; display: flex; align-items: center; gap: 10px; }
  .vm-list { list-style: none; padding: 0; margin: 0; display: grid; gap: 14px; }
  .vm-list li { display: flex; gap: 12px; font-size: 14.5px; line-height: 1.75; color: rgba(255,255,255,0.85); }
  .vm-list li::before {
    content: ''; flex-shrink: 0; width: 22px; height: 22px; border-radius: 7px; margin-top: 2px;
    background: rgba(200,151,58,0.22);
    background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='14' height='14' viewBox='0 0 24 24' fill='none' stroke='%23E8B84B' stroke-width='3' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpolyline points='20 6 9 17 4 12'/%3E%3C/svg%3E");
    background-repeat: no-repeat; background-position: center;
  }
  .vm-single { font-size: 16px; line-height: 1.9; color: rgba(255,255,255,0.9); }

  /* ── Struktur toggle ── */
  .struktur-toggle { display: flex; justify-content: center; margin: 0 auto 8px; }
  .struktur-toggle button {
    display: inline-flex; align-items: center; gap: 8px;
    background: linear-gradient(135deg, #C8973A, #E8B84B); color: #0A1628;
    border: none; border-radius: 999px; padding: 11px 26px; cursor: pointer;
    font-weight: 700; font-size: 14px; font-family: inherit;
  }
  .struktur-toggle button svg { transition: transform .3s ease; }
  .struktur-toggle button.open svg { transform: rotate(180deg); }

  /* ── Struktur diagram (gaya SMK: Box / VLine / HLine) ── */
  .struktur-section { padding: 40px 16px 70px; background: #fff; overflow-x: auto; }
  .struktur-tree { min-width: 1100px; }
  .struktur-hint { display: none; }
  .struktur-box {
    border-radius: 9px; padding: 8px 14px; text-align: center;
    min-width: 148px; max-width: 200px; box-shadow: 0 2px 8px rgba(0,0,0,0.06); flex-shrink: 0;
  }
  .struktur-box-wide { min-width: 220px; max-width: 260px; }
  .struktur-box-name { font-size: 12px; font-weight: 700; line-height: 1.35; }
  .struktur-box-label { font-size: 10px; margin-top: 2px; font-weight: 600; }

  @media (max-width: 900px) {
    .stat-strip { grid-template-columns: 1fr 1fr; gap: 14px; }
  }
  @media (max-width: 768px) {
    .hero-section { padding: 60px 20px 56px; }
    .hero-title { font-size: 29px; }
    .hero-logo-wrap { width: 120px; height: 120px; }
    .hero-desc { font-size: 15px; }
    .sec { padding: 56px 20px; }
    .sec-title { font-size: 26px; }
    .vm-panel { padding: 26px 22px; }
    .struktur-hint { display: block; }
    .struktur-tree { min-width: 900px; }
    .struktur-box { min-width: 128px; max-width: 170px; padding: 7px 10px; }
    .struktur-box-wide { min-width: 190px; max-width: 220px; }
    .struktur-box-name { font-size: 11px; }
    .struktur-box-label { font-size: 9.5px; }
  }
  @media (max-width: 480px) {
    .hero-title { font-size: 24px; }
    .stat-strip { grid-template-columns: 1fr 1fr; }
    .struktur-tree { min-width: 760px; }
    .struktur-box { min-width: 112px; max-width: 150px; padding: 6px 8px; }
    .struktur-box-wide { min-width: 170px; max-width: 200px; }
    .struktur-box-name { font-size: 10.5px; }
    .struktur-box-label { font-size: 9px; }
  }
`;

/* ══════════════════════════════════════════
   Hook: scroll reveal
══════════════════════════════════════════ */
function useReveal() {
  useEffect(() => {
    const els = Array.from(document.querySelectorAll('.reveal'));
    if (!('IntersectionObserver' in window)) {
      els.forEach((el) => el.classList.add('in'));
      return;
    }
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add('in');
            io.unobserve(e.target);
          }
        });
      },
      { threshold: 0.15 },
    );
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);
}

/* ══════════════════════════════════════════
   Angka beranimasi saat terlihat
══════════════════════════════════════════ */
function Counter({ to, suffix = '' }: { to: number; suffix?: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const [val, setVal] = useState(0);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;
    let raf = 0;
    const io = new IntersectionObserver(
      ([e]) => {
        if (!e.isIntersecting) return;
        io.disconnect();
        const start = performance.now();
        const dur = 1400;
        const tick = (now: number) => {
          const p = Math.min((now - start) / dur, 1);
          const eased = 1 - Math.pow(1 - p, 3);
          setVal(Math.round(to * eased));
          if (p < 1) raf = requestAnimationFrame(tick);
        };
        raf = requestAnimationFrame(tick);
      },
      { threshold: 0.5 },
    );
    io.observe(node);
    return () => {
      io.disconnect();
      cancelAnimationFrame(raf);
    };
  }, [to]);

  return (
    <span ref={ref} className="stat-num">
      {val}
      {suffix}
    </span>
  );
}

/* ══════════════════════════════════════════
   KOMPONEN STRUKTUR ORGANISASI (gaya SMK)
══════════════════════════════════════════ */
function Box({ name, label, variant = 'default', wide = false }: {
  name: string; label: string; variant?: string; wide?: boolean;
}) {
  const styles: Record<string, { bg: string; border: string; nameColor: string; labelColor: string }> = {
    default: { bg: 'white', border: '#E2D9C8', nameColor: '#0A1628', labelColor: '#6B7280' },
    dark: { bg: '#023d17', border: '#C8973A', nameColor: 'white', labelColor: '#C8973A' },
    gold: { bg: 'linear-gradient(135deg,#C8973A,#E8B84B)', border: '#C8973A', nameColor: '#0A1628', labelColor: '#0A1628' },
    cream: { bg: '#FAF7F0', border: '#E2D9C8', nameColor: '#0A1628', labelColor: '#6B7280' },
  };
  const s = styles[variant] ?? styles.default;
  return (
    <div className={`struktur-box ${wide ? 'struktur-box-wide' : ''}`} style={{ background: s.bg, border: `1.5px solid ${s.border}` }}>
      <div className="struktur-box-name" style={{ color: s.nameColor }}>{name}</div>
      <div className="struktur-box-label" style={{ color: s.labelColor }}>{label}</div>
    </div>
  );
}
const VLine = ({ h = 18 }: { h?: number }) => (
  <div style={{ width: 2, height: h, background: '#C8973A', alignSelf: 'center', flexShrink: 0 }} />
);
const HLine = ({ w = 32 }: { w?: number }) => (
  <div style={{ height: 2, width: w, background: '#C8973A', alignSelf: 'center', flexShrink: 0 }} />
);
function VCol({ children }: { children: React.ReactNode }) {
  return <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>{children}</div>;
}

function StrukturDiagram() {
  return (
    <div className="struktur-section">
      <div style={{ maxWidth: 1280, margin: '0 auto' }}>
        <p className="struktur-hint" style={{ textAlign: 'center', color: '#9CA3AF', fontSize: 12, marginBottom: 12 }}>
          ← Geser untuk melihat struktur lengkap →
        </p>
        <div className="struktur-tree" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <Box name={KETUA_YATKJ.nama} label={KETUA_YATKJ.jabatan} variant="gold" wide />
            <HLine w={40} />
            <Box name={ADVISOR.nama} label={ADVISOR.jabatan} />
          </div>
          <VLine />
          <Box name={KETUA_BPH.nama} label={KETUA_BPH.jabatan} />
          <VLine />
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <Box name={KETUA_KOMITE.nama} label={KETUA_KOMITE.jabatan} variant="cream" />
            <HLine w={32} />
            <Box name={KEPSEK.nama} label={KEPSEK.jabatan} variant="dark" wide />
          </div>
          <VLine h={24} />
          <div style={{ display: 'flex', alignItems: 'flex-start', width: '100%', justifyContent: 'space-between', position: 'relative' }}>
            <div style={{ position: 'absolute', top: 0, left: '8%', right: '8%', height: 2, background: '#C8973A' }} />
            {DEPARTEMEN.map((d, i) => (
              <VCol key={i}>
                <VLine h={16} />
                <Box name={d.nama} label={d.jabatan} />
                {!!d.tim?.length && (
                  <>
                    <VLine />
                    {d.tim.map((t, j) => (
                      <div key={j} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                        {j > 0 && <VLine h={10} />}
                        <Box name={t.nama} label={t.jabatan} variant="cream" />
                      </div>
                    ))}
                  </>
                )}
              </VCol>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════
   HALAMAN
══════════════════════════════════════════ */
export default function TentangPage() {
  useReveal();
  const [readMore, setReadMore] = useState(false);
  const [vmTab, setVmTab] = useState<'visi' | 'misi'>('visi');
  const [showStruktur, setShowStruktur] = useState(false);

  return (
    <>
      <style>{CSS}</style>
      <Navbar />
      <main>
        {/* ── HERO ── */}
        <section className="hero-gradient hero-section">
          <div className="hero-inner">
            <div className="flex justify-center mb-6">
              <div className="hero-logo-wrap">
                <Image src="/images/logosma.png" alt="Logo SMA Citra Negara" fill style={{ objectFit: 'contain' }} />
              </div>
            </div>
            <h1 className="font-display hero-title">Tentang SMA Citra Negara</h1>
            <p className="hero-desc">
              Berfokus pada pembentukan karakter religius-disiplin, penguatan IPTEK dan literasi digital, serta
              penciptaan lingkungan kolaboratif yang membekali siswa.
            </p>
          </div>
        </section>

        {/* ── STAT STRIP ── */}
        <div className="stat-strip">
          {STATS.map((s, i) => (
            <div key={s.label} className={`stat-card reveal d${i + 1}`}>
              <div className="stat-ico">
                <s.icon size={20} color="#0A1628" />
              </div>
              <Counter to={s.to} suffix={s.suffix} />
              <div className="stat-lbl">{s.label}</div>
            </div>
          ))}
        </div>

        {/* ── SAMBUTAN ── */}
        <section className="sec sec-cream">
          <div className="sec-head reveal">
            <span className="sec-kicker">Sambutan</span>
            <h2 className="font-display sec-title">Kepala Sekolah</h2>
          </div>
          <div className="sambutan-grid">
            <div className="sambutan-photo-area reveal">
              <div className="sambutan-photo-wrap">
                <Image
                  src="/images/kepseksma.jpg"
                  alt="Kepala Sekolah SMA Citra Negara"
                  width={360}
                  height={440}
                  sizes="(min-width: 861px) 300px, 210px"
                  style={{ width: '100%', height: 'auto', display: 'block', objectFit: 'contain' }}
                />
              </div>
              <div className="sambutan-name">Ahmad Taufik, S.Kom</div>
              <div className="sambutan-role">KEPALA SMA CITRA NEGARA</div>
            </div>

            <div className="sambutan-text-area reveal d1">
              <div className={`sambutan-fade ${readMore ? 'open' : ''}`}>
                <p className="sambutan-p">
                  Saya Ahmad Taufik, S.Kom selaku kepala sekolah SMA Citra Negara. Salam sejahtera untuk seluruh
                  siswa-siswi, orang tua, guru, dan staf sekolah kita yang tercinta.
                </p>
                <p className="sambutan-p">
                  Hari ini, kita semua bersyukur dan merasa bangga karena telah meluncurkan website resmi sekolah
                  kita. Website ini diharapkan dapat menjadi sarana informasi dan komunikasi yang efektif antara
                  sekolah, orang tua, dan siswa-siswi.
                </p>
              </div>
              <button
                className={`read-btn ${readMore ? 'open' : ''}`}
                onClick={() => setReadMore((v) => !v)}
              >
                {readMore ? 'Tutup' : 'Baca selengkapnya'} <ChevronDown size={16} />
              </button>
            </div>
          </div>
        </section>

        {/* ── VISI & MISI (tab) ── */}
        <section className="sec sec-white">
          <div className="sec-head reveal">
            <span className="sec-kicker">Arah Sekolah</span>
            <h2 className="font-display sec-title">Visi &amp; Misi</h2>
          </div>
          <div className="vm-wrap">
            <div className="vm-tabs reveal">
              <button className={`vm-tab ${vmTab === 'visi' ? 'active' : ''}`} onClick={() => setVmTab('visi')}>
                <Eye size={16} /> Visi
              </button>
              <button className={`vm-tab ${vmTab === 'misi' ? 'active' : ''}`} onClick={() => setVmTab('misi')}>
                <Target size={16} /> Misi
              </button>
            </div>
            <div className="vm-panel reveal d1">
              {vmTab === 'visi' ? (
                <>
                  <h3><Eye size={22} color="#E8B84B" /> Visi</h3>
                  <p className="vm-single">{VISI}</p>
                </>
              ) : (
                <>
                  <h3><Target size={22} color="#E8B84B" /> Misi</h3>
                  <ul className="vm-list">
                    {MISI.map((m) => <li key={m}>{m}</li>)}
                  </ul>
                </>
              )}
            </div>
          </div>
        </section>

        {/* ── STRUKTUR ORGANISASI (collapsible, gaya SMK) ── */}
        <section className="sec sec-cream" style={{ paddingBottom: showStruktur ? 24 : 78 }}>
          <div className="sec-head reveal" style={{ marginBottom: 28 }}>
            <span className="sec-kicker">SMA Citra Negara</span>
            <h2 className="font-display sec-title">Struktur Organisasi</h2>
          </div>
          <div className="struktur-toggle">
            <button
              className={showStruktur ? 'open' : ''}
              onClick={() => setShowStruktur((v) => !v)}
            >
              {showStruktur ? 'Sembunyikan bagan' : 'Lihat bagan struktur'} <ChevronDown size={16} />
            </button>
          </div>
        </section>
        {showStruktur && <StrukturDiagram />}
      </main>
      <Footer />
    </>
  );
}