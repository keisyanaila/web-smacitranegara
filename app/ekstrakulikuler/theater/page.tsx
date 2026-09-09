'use client';
import { useEffect, useRef, useState } from 'react';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import EskulMusic from '@/components/EskulMusic';
import Image from 'next/image';

const STATS = [
  { angka: '2014', label: 'Tahun Berdiri' },
  { angka: '25+', label: 'Anggota Aktif' },
  { angka: '11', label: 'Prestasi Diraih' },
  { angka: '100%', label: 'Dedikasi' },
];

const TUJUAN = [
  { icon: '🎭', judul: 'Kreativitas', deskripsi: 'Teater mendorong siswa berpikir kreatif dan inovatif dalam menciptakan karakter, alur cerita, dan pertunjukan yang memukau.' },
  { icon: '🎤', judul: 'Komunikasi & Kepercayaan Diri', deskripsi: 'Melalui latihan dialog dan akting, siswa belajar berkomunikasi efektif sekaligus mengatasi rasa gugup di depan publik.' },
  { icon: '🌟', judul: 'Apresiasi Seni', deskripsi: 'Siswa belajar menghargai seni teater, memahami berbagai aspek produksi panggung, dan kolaborasi lintas peran kreatif.' },
];

const KEGIATAN = [
  { no: '01', nama: 'Latihan Akting', detail: 'Ekspresi wajah, gerakan tubuh, dan intonasi suara.' },
  { no: '02', nama: 'Pembacaan Naskah', detail: 'Memahami karakter dan mengembangkan interpretasi peran.' },
  { no: '03', nama: 'Latihan Improvisasi', detail: 'Kreativitas dan berpikir cepat dalam situasi tak terduga.' },
  { no: '04', nama: 'Produksi Pertunjukan', detail: 'Latihan, pengaturan panggung, kostum, hingga pentas.' },
  { no: '05', nama: 'Kerja Kolaboratif', detail: 'Kerjasama sutradara, penulis naskah, dan kru teknis.' },
  { no: '06', nama: 'Workshop & Pelatihan', detail: 'Belajar dari profesional di bidang seni teater.' },
];

export default function TheaterPage() {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [playing, setPlaying] = useState(false);

  useEffect(() => {
    const items = document.querySelectorAll('.thr-reveal');
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) entry.target.classList.add('is-visible');
      });
    }, { threshold: 0.12 });

    items.forEach((item) => observer.observe(item));

    // Coba langsung menyalakan musik saat halaman/tab Theater dibuka.
    // Jika browser memblokir autoplay, musik akan mulai setelah interaksi pertama pengguna.
    const startMusic = async () => {
      const audio = audioRef.current;
      if (!audio) return;

      audio.volume = 0.55;
      audio.muted = false;

      try {
        await audio.play();
        setPlaying(true);
      } catch {
        const resumeAfterInteraction = async () => {
          try {
            await audio.play();
            setPlaying(true);
          } catch {
            setPlaying(false);
          }
          window.removeEventListener('pointerdown', resumeAfterInteraction);
          window.removeEventListener('keydown', resumeAfterInteraction);
          window.removeEventListener('touchstart', resumeAfterInteraction);
        };

        window.addEventListener('pointerdown', resumeAfterInteraction, { once: true });
        window.addEventListener('keydown', resumeAfterInteraction, { once: true });
        window.addEventListener('touchstart', resumeAfterInteraction, { once: true });
      }
    };

    startMusic();

    return () => {
      observer.disconnect();
    };
  }, []);

  const toggleMusic = async () => {
    if (!audioRef.current) return;
    if (playing) {
      audioRef.current.pause();
      setPlaying(false);
      return;
    }
    try {
      await audioRef.current.play();
      setPlaying(true);
    } catch {
      setPlaying(false);
    }
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Barlow:wght@400;500;600;700&family=Barlow+Condensed:wght@600;700;800&display=swap');

        .thr-root { font-family:'Barlow',sans-serif; background:linear-gradient(180deg,#FFFDF9 0%,#FFF6EF 45%,#FFF0E8 100%); color:#5A3040; min-height:100vh; overflow:hidden; }
        .thr-hero { position:relative; overflow:hidden; background:#FFF9F4; }
        .thr-hero-img { position:relative; width:100%; height:min(70vh,600px); }
        .thr-hero-img img { object-fit:cover; object-position:center top; filter:brightness(1.12) saturate(1.15) contrast(1.02); animation:thrImageBreath 9s ease-in-out infinite alternate; }
        .thr-hero-overlay { position:absolute; inset:0; background:linear-gradient(to bottom,transparent 20%,rgba(255,248,240,.08) 60%,#FFF9F4 100%); pointer-events:none; }

        /* Tirai hanya menjadi lapisan dekoratif sehingga ukuran/posisi gambar tidak berubah. */
        .thr-curtain { position:absolute; z-index:4; top:0; width:24%; height:100%; pointer-events:none; filter:drop-shadow(0 8px 18px rgba(160,70,90,.18)); animation:curtainOpen 2s cubic-bezier(.7,0,.2,1) 1.1s forwards; }
        .thr-curtain.left { left:0; transform-origin:left top; background:repeating-linear-gradient(90deg,#FF6688 0,#FF9B8C 12%,#FF6688 25%); clip-path:polygon(0 0,100% 0,78% 100%,0 100%); }
        .thr-curtain.right { right:0; transform-origin:right top; background:repeating-linear-gradient(90deg,#FF6688 0,#FF9B8C 12%,#FF6688 25%); clip-path:polygon(0 0,100% 0,100% 100%,22% 100%); animation-name:curtainOpenRight; }
        .thr-stage-light { position:absolute; z-index:2; inset:-20% -10%; pointer-events:none; background:conic-gradient(from 205deg at 50% 0%,transparent 0 32%,rgba(255,224,120,.34) 40%,transparent 49% 100%); mix-blend-mode:screen; animation:spotlightMove 6s ease-in-out infinite alternate; }

        .thr-hero-content { position:absolute; z-index:5; bottom:0; left:0; right:0; padding:0 clamp(24px,6vw,80px) clamp(40px,6vw,72px); animation:heroRise 1s ease .65s both; }
        .thr-eyebrow { display:inline-flex; align-items:center; gap:10px; font-family:'Barlow Condensed',sans-serif; font-size:13px; font-weight:700; letter-spacing:3px; text-transform:uppercase; color:#FF4F81; margin-bottom:16px; }
        .thr-eyebrow::before { content:''; display:block; width:32px; height:2px; background:#FF4F81; box-shadow:0 0 12px #FF4F81; }
        .thr-title { font-family:'Bebas Neue',sans-serif; font-size:clamp(72px,12vw,160px); line-height:.9; color:#6A2945; letter-spacing:2px; margin:0 0 20px; text-shadow:0 0 30px rgba(200,125,212,.18); }
        .thr-title span { color:#FF4F81; animation:titleGlow 2.8s ease-in-out infinite; }
        .thr-subtitle { max-width:560px; font-size:clamp(15px,1.8vw,18px); color:rgba(90,48,64,.88); line-height:1.7; }

        .thr-music { position:fixed; z-index:30; right:22px; bottom:22px; display:flex; align-items:center; gap:10px; padding:10px 14px 10px 10px; border:1px solid rgba(255,79,129,.42); background:rgba(255,255,255,.96); backdrop-filter:blur(12px); color:#6A2945; cursor:pointer; border-radius:999px; box-shadow:0 10px 35px rgba(160,70,90,.14); transition:.3s; }
        .thr-music:hover { border-color:#FF4F81; transform:translateY(-3px); box-shadow:0 0 25px rgba(255,79,129,.26); }
        .thr-music-icon { width:34px; height:34px; border-radius:50%; display:grid; place-items:center; background:#FF4F81; color:#FFF9F4; font-weight:800; }
        .thr-eq { display:flex; align-items:flex-end; gap:3px; height:16px; }
        .thr-eq i { display:block; width:3px; height:5px; background:#FF4F81; border-radius:3px; }
        .thr-music.playing .thr-eq i { animation:eq .7s ease-in-out infinite alternate; }
        .thr-eq i:nth-child(2){animation-delay:.15s}.thr-eq i:nth-child(3){animation-delay:.3s}.thr-eq i:nth-child(4){animation-delay:.1s}

        .thr-stats { display:grid; grid-template-columns:repeat(4,1fr); border-top:1px solid rgba(255,79,129,.28); border-bottom:1px solid rgba(255,79,129,.28); position:relative; }
        .thr-stat { padding:28px 20px; text-align:center; border-right:1px solid rgba(255,79,129,.20); transition:.35s; }
        .thr-stat:hover { background:rgba(255,79,129,.08); transform:translateY(-3px); }
        .thr-stat:last-child { border-right:none; }
        .thr-stat-num { font-family:'Bebas Neue',sans-serif; font-size:42px; color:#FF4F81; line-height:1; margin-bottom:6px; }
        .thr-stat-label { font-size:11px; font-weight:600; letter-spacing:2px; text-transform:uppercase; color:rgba(90,48,64,.62); }

        .thr-section { max-width:1100px; margin:0 auto; padding:clamp(56px,8vw,96px) clamp(24px,6vw,80px); }
        .thr-section-label { font-family:'Barlow Condensed',sans-serif; font-size:11px; font-weight:700; letter-spacing:3px; text-transform:uppercase; color:#FF4F81; margin-bottom:12px; }
        .thr-section-heading { font-family:'Bebas Neue',sans-serif; font-size:clamp(40px,5vw,64px); color:#6A2945; line-height:1; margin-bottom:48px; }
        .thr-tujuan-grid { display:grid; grid-template-columns:repeat(3,1fr); gap:2px; }
        .thr-tujuan-card { background:#FFF0E7; padding:36px 28px; border:1px solid rgba(255,79,129,.14); transition:.4s; position:relative; overflow:hidden; }
        .thr-tujuan-card::before { content:''; position:absolute; width:180px; height:180px; border-radius:50%; top:-100px; right:-80px; background:rgba(255,79,129,.16); filter:blur(35px); opacity:0; transition:.4s; }
        .thr-tujuan-card::after { content:''; position:absolute; bottom:0; left:0; right:0; height:2px; background:#FF4F81; transform:scaleX(0); transform-origin:left; transition:.4s; }
        .thr-tujuan-card:hover { background:#FFE1D6; border-color:rgba(255,79,129,.42); transform:translateY(-7px); box-shadow:0 20px 45px rgba(160,70,90,.10); }
        .thr-tujuan-card:hover::before { opacity:1; }
        .thr-tujuan-card:hover::after { transform:scaleX(1); }
        .thr-tujuan-icon { font-size:36px; margin-bottom:20px; display:block; transition:.4s; }
        .thr-tujuan-card:hover .thr-tujuan-icon { transform:translateY(-5px) rotate(-4deg) scale(1.08); }
        .thr-tujuan-title { font-family:'Barlow Condensed',sans-serif; font-size:22px; font-weight:800; color:#6A2945; text-transform:uppercase; letter-spacing:1px; margin-bottom:12px; }
        .thr-tujuan-desc { font-size:14px; color:rgba(90,48,64,.78); line-height:1.75; }

        .thr-kegiatan-grid { display:grid; grid-template-columns:repeat(2,1fr); gap:1px; background:rgba(255,79,129,.16); }
        .thr-kegiatan-item { background:#FFF9F4; padding:28px 32px; display:flex; align-items:flex-start; gap:20px; transition:.35s; position:relative; overflow:hidden; }
        .thr-kegiatan-item::after { content:'→'; position:absolute; right:24px; top:50%; transform:translate(20px,-50%); opacity:0; color:#FF4F81; font-size:22px; transition:.35s; }
        .thr-kegiatan-item:hover { background:#FFF0E7; padding-left:38px; }
        .thr-kegiatan-item:hover::after { transform:translate(0,-50%); opacity:1; }
        .thr-kegiatan-no { font-family:'Bebas Neue',sans-serif; font-size:32px; color:rgba(255,79,129,.38); line-height:1; flex-shrink:0; width:40px; transition:.35s; }
        .thr-kegiatan-item:hover .thr-kegiatan-no { color:#FF4F81; text-shadow:0 0 14px rgba(200,125,212,.4); }
        .thr-kegiatan-nama { font-family:'Barlow Condensed',sans-serif; font-size:18px; font-weight:700; color:#6A2945; text-transform:uppercase; letter-spacing:.5px; margin-bottom:4px; }
        .thr-kegiatan-detail { font-size:13px; color:rgba(90,48,64,.62); }

        .thr-divider { display:flex; align-items:center; gap:16px; max-width:1100px; margin:0 auto; padding:0 clamp(24px,6vw,80px); opacity:.25; }
        .thr-divider::before,.thr-divider::after { content:''; flex:1; height:1px; background:#FF4F81; }
        .thr-divider-icon { font-size:14px; animation:spin 5s linear infinite; }

        .thr-reveal { opacity:0; transform:translateY(35px); transition:opacity .8s ease,transform .8s ease; }
        .thr-reveal.is-visible { opacity:1; transform:none; }
        .thr-delay-1{transition-delay:.08s}.thr-delay-2{transition-delay:.16s}.thr-delay-3{transition-delay:.24s}

        @keyframes curtainOpen { to { transform:translateX(-105%); } }
        @keyframes curtainOpenRight { to { transform:translateX(105%); } }
        @keyframes heroRise { from{opacity:0;transform:translateY(25px)} to{opacity:1;transform:none} }
        @keyframes titleGlow { 0%,100%{text-shadow:0 0 0 rgba(200,125,212,0)} 50%{text-shadow:0 0 28px rgba(200,125,212,.65)} }
        @keyframes spotlightMove { from{transform:translateX(-4%) rotate(-2deg)} to{transform:translateX(4%) rotate(2deg)} }
        @keyframes thrImageBreath { from{transform:scale(1)} to{transform:scale(1.035)} }
        @keyframes eq { from{height:4px} to{height:16px} }
        @keyframes spin { to{transform:rotate(360deg)} }

        @media (max-width:768px){ .thr-tujuan-grid{grid-template-columns:1fr}.thr-curtain{width:34%}.thr-kegiatan-grid{grid-template-columns:1fr}.thr-music span{display:none} }
        @media (max-width:640px){ .thr-stats{grid-template-columns:repeat(2,1fr)}.thr-stat:nth-child(2){border-right:none}.thr-stat:nth-child(-n+2){border-bottom:1px solid rgba(255,79,129,.20)} }
        @media (prefers-reduced-motion:reduce){ *,*::before,*::after{animation-duration:.01ms!important;animation-iteration-count:1!important;scroll-behavior:auto!important;transition-duration:.01ms!important}.thr-reveal{opacity:1;transform:none} }
      `}</style>

      <div className="thr-root">
        <Navbar />
        <audio ref={audioRef} src="/audio/theater.mp3" loop preload="none" onEnded={() => setPlaying(false)} />

        <button className={`thr-music ${playing ? 'playing' : ''}`} onClick={toggleMusic} aria-label={playing ? 'Matikan musik' : 'Putar musik teater'}>
          <div className="thr-music-icon">{playing ? 'Ⅱ' : '▶'}</div>
          <div className="thr-eq"><i/><i/><i/><i/></div>
          <span>{playing ? 'MUSIK BERMAIN' : 'PUTAR SUASANA'}</span>
        </button>

        <main>
          <section className="thr-hero">
            <div className="thr-hero-img">
              <Image src="/images/citter.jpg" alt="Theater SMK Citra Negara" fill priority />
              <div className="thr-stage-light" />
              <div className="thr-hero-overlay" />
              <div className="thr-curtain left" />
              <div className="thr-curtain right" />
            </div>
            <div className="thr-hero-content">
              <div className="thr-eyebrow">Ekstrakurikuler SMK Citra Negara</div>
              <h1 className="thr-title">THE<span>ATER</span></h1>
              <p className="thr-subtitle">Teater menawarkan kesempatan bagi siswa untuk mengeksplorasi kreativitas dan mengembangkan keterampilan komunikasi. Dari akting hingga produksi panggung, kami membentuk seniman muda yang percaya diri.</p>
            </div>
          </section>

          <div className="thr-stats">
            {STATS.map((s, i) => <div key={s.label} className={`thr-stat thr-reveal thr-delay-${i > 2 ? 3 : i}`}><div className="thr-stat-num">{s.angka}</div><div className="thr-stat-label">{s.label}</div></div>)}
          </div>

          <section className="thr-section">
            <div className="thr-section-label thr-reveal">Mengapa Theater</div>
            <h2 className="thr-section-heading thr-reveal">TUJUAN KAMI</h2>
            <div className="thr-tujuan-grid">
              {TUJUAN.map((t, i) => <div key={t.judul} className={`thr-tujuan-card thr-reveal thr-delay-${i+1}`}><span className="thr-tujuan-icon">{t.icon}</span><div className="thr-tujuan-title">{t.judul}</div><p className="thr-tujuan-desc">{t.deskripsi}</p></div>)}
            </div>
          </section>

          <div className="thr-divider"><span className="thr-divider-icon">✦</span></div>

          <section className="thr-section" style={{paddingTop:'clamp(40px,5vw,64px)'}}>
            <div className="thr-section-label thr-reveal">Program Latihan</div>
            <h2 className="thr-section-heading thr-reveal">KEGIATAN RUTIN</h2>
            <div className="thr-kegiatan-grid">
              {KEGIATAN.map((k, i) => <div key={k.no} className={`thr-kegiatan-item thr-reveal thr-delay-${(i%3)+1}`}><div className="thr-kegiatan-no">{k.no}</div><div><div className="thr-kegiatan-nama">{k.nama}</div><div className="thr-kegiatan-detail">{k.detail}</div></div></div>)}
            </div>
          </section>
        </main>
        <EskulMusic src="/audio/theater.mp3" />
        <Footer />
      </div>
    </>
  );
}