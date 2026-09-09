'use client';

import { useEffect, useRef, useState } from 'react';

/**
 * Tombol musik latar untuk halaman ekstrakurikuler.
 * - Coba autoplay pelan saat halaman dibuka; kalau diblokir browser,
 *   musik otomatis nyala pada interaksi pertama (klik / scroll / tombol).
 * - Tombol mengambang kanan-bawah untuk jeda / putar kapan saja.
 *   Setelah tombol ditekan, musik TIDAK akan nyala sendiri lagi
 *   (mis. karena scroll) — sepenuhnya dikontrol pengguna.
 *
 * Pakai: <EskulMusic src="/audio/namafile.mp3" />
 */
export default function EskulMusic({
  src = '/audio/musikband.mp3',
  volume = 0.35,
}: {
  src?: string;
  volume?: number;
}) {
  const audioRef = useRef<HTMLAudioElement>(null);
  const stopAutoKickRef = useRef<() => void>(() => {});
  const [playing, setPlaying] = useState(false);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    audio.volume = volume;

    let cleaned = false;
    const KICKS = ['pointerdown', 'pointermove', 'keydown', 'scroll', 'touchstart', 'mouseover', 'wheel'];

    const removeKick = () => {
      KICKS.forEach((ev) => window.removeEventListener(ev, onKick));
      document.removeEventListener('visibilitychange', onVis);
    };
    stopAutoKickRef.current = removeKick;

    const tryPlay = () =>
      audio
        .play()
        .then(() => {
          if (!cleaned) setPlaying(true);
          removeKick();
        })
        .catch(() => {});

    const onKick = () => tryPlay();
    const onVis = () => { if (document.visibilityState === 'visible') tryPlay(); };

    // 1) coba autoplay langsung
    tryPlay();
    // sekali lagi setelah frame berikutnya (kadang audio belum siap saat mount)
    const t = setTimeout(tryPlay, 300);
    // 2) fallback: nyalakan pada interaksi apa pun kalau autoplay diblokir browser
    KICKS.forEach((ev) => window.addEventListener(ev, onKick, { passive: true } as AddEventListenerOptions));
    document.addEventListener('visibilitychange', onVis);

    return () => {
      cleaned = true;
      clearTimeout(t);
      removeKick();
      audio.pause();
    };
  }, [src, volume]);

  const toggle = () => {
    const audio = audioRef.current;
    if (!audio) return;
    // Mulai sekarang pengguna yang pegang kendali — matikan autoplay-on-scroll.
    stopAutoKickRef.current();

    if (audio.paused) {
      audio.play().then(() => setPlaying(true)).catch(() => {});
    } else {
      audio.pause();
      setPlaying(false);
    }
  };

  return (
    <>
      <audio ref={audioRef} src={src} loop preload="auto" />

      <button
        type="button"
        onClick={toggle}
        className="emus-fab"
        aria-label={playing ? 'Jeda musik' : 'Putar musik'}
        aria-pressed={playing}
      >
        <span className="emus-icon" aria-hidden="true">{playing ? '❚❚' : '►'}</span>
        <span className="emus-label">{playing ? 'Jeda musik' : 'Putar musik'}</span>
        <span className={`emus-eq ${playing ? '' : 'is-paused'}`} aria-hidden="true">
          <span /><span /><span /><span />
        </span>
      </button>

      <style jsx global>{`
        .emus-fab {
          position: fixed;
          right: 18px;
          bottom: 18px;
          z-index: 60;
          display: inline-flex;
          align-items: center;
          gap: 9px;
          padding: 11px 17px;
          border: none;
          border-radius: 999px;
          cursor: pointer;
          font-size: 13px;
          font-weight: 700;
          color: #0A1628;
          background: linear-gradient(135deg, #E8B84B, #C8973A);
          box-shadow: 0 10px 26px rgba(200, 151, 58, 0.45);
          transition: transform 0.2s ease, box-shadow 0.2s ease;
        }
        .emus-fab:hover { transform: translateY(-2px); box-shadow: 0 14px 30px rgba(200, 151, 58, 0.5); }
        .emus-fab:active { transform: translateY(0); }
        .emus-icon { font-size: 12px; line-height: 1; letter-spacing: 1px; }
        .emus-eq { display: inline-flex; align-items: flex-end; gap: 2px; height: 14px; }
        .emus-eq span {
          width: 3px;
          background: #0A1628;
          border-radius: 2px;
          animation: emusEq 0.9s ease-in-out infinite;
        }
        .emus-eq span:nth-child(1) { height: 40%; animation-delay: -0.6s; }
        .emus-eq span:nth-child(2) { height: 100%; animation-delay: -0.2s; }
        .emus-eq span:nth-child(3) { height: 65%; animation-delay: -0.8s; }
        .emus-eq span:nth-child(4) { height: 85%; animation-delay: -0.4s; }
        .emus-eq.is-paused span { animation-play-state: paused; height: 30%; opacity: 0.5; }
        @keyframes emusEq {
          0%, 100% { transform: scaleY(0.4); }
          50% { transform: scaleY(1); }
        }
        @media (max-width: 640px) {
          .emus-fab { right: 12px; bottom: 12px; padding: 10px 14px; font-size: 12px; }
          .emus-label { display: none; }
        }
        @media (prefers-reduced-motion: reduce) {
          .emus-eq span { animation: none !important; }
          .emus-fab { transition: none; }
        }
      `}</style>
    </>
  );
}
