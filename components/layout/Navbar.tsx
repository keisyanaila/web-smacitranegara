'use client';

import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState, useEffect, useRef, useSyncExternalStore } from 'react';
import { createPortal } from 'react-dom';
import { X, ChevronDown } from 'lucide-react';
import { SPMB_URL } from '@/lib/spmb';
import LangSwitch from './LangSwitch';
import { useLang } from '@/lib/lang';

// ─── Data ────────────────────────────────────────────────────────────────────

const ESKUL_LIST = [
  { nama: 'Paskibra',   href: '/ekstrakulikuler/paskibra'  },
  { nama: 'Futsal',     href: '/ekstrakulikuler/futsal'    },
  { nama: 'Taekwondo',  href: '/ekstrakulikuler/taekwondo' },
  { nama: 'Basket',     href: '/ekstrakulikuler/basket'    },
  { nama: 'Voli',       href: '/ekstrakulikuler/voli'      },
  { nama: 'Theater',    href: '/ekstrakulikuler/theater'   },
  { nama: 'Tari',       href: '/ekstrakulikuler/tari'      },
  { nama: 'Pramuka',    href: '/ekstrakulikuler/pramuka'   },
  { nama: 'Band',       href: '/ekstrakulikuler/band'      },
  { nama: 'IRMA',       href: '/ekstrakulikuler/irma'      },
  { nama: 'E-Sport',    href: '/ekstrakulikuler/esport'    },
  { nama: 'CN Gakuen',  href: '/ekstrakulikuler/cngakuen'  },
  { nama: 'Silat',      href: '/ekstrakulikuler/silat'     },
];

const TENTANG_LIST = [
  { nama: 'Profil Sekolah', href: '/tentang'    },
  { nama: 'Staff & Guru',   href: '/gurustaff'  },
];

// Label navbar per bahasa. Navbar diberi class "notranslate" supaya Google tidak
// menerjemahkan ulang (hasil mesin kurang pas, mis. "Prestasi" → "Performance").
const LABELS = {
  id: {
    beranda: 'Beranda', tentang: 'Tentang Kami', jurusan: 'Jurusan', eskul: 'Ekstrakurikuler',
    prestasi: 'Prestasi', berita: 'Berita', daftar: 'Daftar Sekarang',
    tagline: 'Pilihan Tepat di Sekolah yang MANTAP', eskulCount: '13+ EKSTRAKURIKULER',
    tentangItems: ['Profil Sekolah', 'Staff & Guru'],
  },
  en: {
    beranda: 'Home', tentang: 'About Us', jurusan: 'Programs', eskul: 'Extracurriculars',
    prestasi: 'Achievements', berita: 'News', daftar: 'Register Now',
    tagline: 'The Right Choice for a Great School', eskulCount: '13+ EXTRACURRICULARS',
    tentangItems: ['School Profile', 'Teachers & Staff'],
  },
};

const MOBILE_BP = 992;
const noopSubscribe = () => () => {};
const GOLD = 'linear-gradient(135deg, #F2CB66 0%, #D9A441 100%)';

// ─── Styles ──────────────────────────────────────────────────────────────────

const CSS = `
  @keyframes dropFadeIn {
    from { opacity: 0; transform: translateY(-8px); }
    to   { opacity: 1; transform: translateY(0); }
  }

  /* ── Bar melayang ── */
  .nav-wrap {
    position: sticky;
    top: 0;
    z-index: 100;
    height: 88px;
    margin-bottom: -88px;      /* melayang di atas hero, tidak mendorong konten */
    padding: 12px 16px 0;
    pointer-events: none;
  }
  .nav-bar {
    pointer-events: auto;
    max-width: 1240px;
    height: 66px;
    margin: 0 auto;
    padding: 0 14px 0 22px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 16px;
    border-radius: 18px;
    background: rgba(9, 38, 27, 0.78);
    border: 1px solid rgba(200, 151, 58, 0.28);
    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.22);
    backdrop-filter: blur(14px) saturate(140%);
    -webkit-backdrop-filter: blur(14px) saturate(140%);
    transition: background 0.3s, box-shadow 0.3s;
  }
  .nav-bar.is-scrolled { background: rgba(8, 33, 24, 0.94); box-shadow: 0 14px 36px rgba(0, 0, 0, 0.3); }

  .nav-brand { display: flex; align-items: center; gap: 12px; text-decoration: none; flex-shrink: 0; }
  .nav-brand-name { color: #fff; font-weight: 800; font-size: 16px; line-height: 1.2; }
  .nav-brand-tag { color: #C8973A; font-size: 11px; font-weight: 500; }

  .desktop-nav { display: flex; align-items: center; gap: 2px; }
  .nav-link {
    display: flex;
    align-items: center;
    gap: 5px;
    padding: 8px 13px;
    border: none;
    border-radius: 10px;
    background: none;
    color: rgba(255, 255, 255, 0.9);
    font-family: inherit;
    font-size: 14px;
    font-weight: 600;
    text-decoration: none;
    cursor: pointer;
    transition: color 0.2s, background 0.2s;
  }
  .nav-link:hover, .nav-link.is-active, .nav-link[aria-expanded="true"] { color: #E8B84B; background: rgba(255, 255, 255, 0.06); }
  .nav-link .chev { transition: transform 0.2s; }
  .nav-link[aria-expanded="true"] .chev { transform: rotate(180deg); }

  .desktop-auth { display: flex; align-items: center; gap: 12px; flex-shrink: 0; }
  .nav-cta {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    padding: 11px 22px;
    border-radius: 999px;
    background: ${GOLD};
    color: #1A1408;
    font-size: 14px;
    font-weight: 700;
    text-decoration: none;
    white-space: nowrap;
    box-shadow: 0 6px 18px rgba(217, 164, 65, 0.35);
    transition: transform 0.15s, filter 0.2s, box-shadow 0.2s;
  }
  .nav-cta:hover { transform: translateY(-1px); filter: brightness(1.05); box-shadow: 0 10px 24px rgba(217, 164, 65, 0.45); }

  /* ── Switch ID / EN ── */
  .lang-switch {
    display: inline-flex;
    padding: 3px;
    gap: 2px;
    border-radius: 999px;
    background: rgba(255, 255, 255, 0.05);
    border: 1px solid rgba(255, 255, 255, 0.14);
    flex-shrink: 0;
  }
  .lang-switch button {
    min-width: 34px;
    padding: 5px 9px;
    border: none;
    border-radius: 999px;
    background: transparent;
    color: rgba(255, 255, 255, 0.7);
    font-family: inherit;
    font-size: 12px;
    font-weight: 700;
    cursor: pointer;
    transition: background 0.2s, color 0.2s;
  }
  .lang-switch button:hover:not(.is-active) { color: #fff; }
  .lang-switch button.is-active { background: ${GOLD}; color: #1A1408; }

  .eskul-grid {
    display: grid;
    grid-template-columns: 1fr 1fr 1fr;
    gap: 8px 12px;
  }
  @media (max-width: 640px) {
    .eskul-grid { grid-template-columns: 1fr 1fr; }
  }
  .eskul-text-item {
    display: flex;
    align-items: center;
    padding: 6px 8px;
    border-radius: 8px;
    text-decoration: none;
    color: #1F2937;
    font-size: 13px;
    font-weight: 500;
    transition: background 0.15s;
  }
  .eskul-text-item:hover { background: #FAF7F0; }
  .tentang-list { display: flex; flex-direction: column; gap: 2px; }

  /* ── Tombol menu (hamburger) ── */
  .mobile-toggle {
    display: none;
    align-items: center;
    justify-content: center;
    width: 42px;
    height: 42px;
    border-radius: 12px;
    border: 1px solid rgba(255, 255, 255, 0.16);
    background: rgba(255, 255, 255, 0.05);
    cursor: pointer;
    flex-shrink: 0;
  }
  .hamburger { position: relative; width: 20px; height: 14px; }
  .hamburger span {
    position: absolute;
    left: 0;
    width: 100%;
    height: 2px;
    border-radius: 2px;
    background: #fff;
  }
  .hamburger span:nth-child(1) { top: 0; }
  .hamburger span:nth-child(2) { top: 6px; }
  .hamburger span:nth-child(3) { top: 12px; }

  @media (max-width: ${MOBILE_BP}px) {
    .desktop-nav  { display: none; }
    .desktop-auth { display: none; }
    .mobile-toggle { display: inline-flex; }
    .nav-wrap { height: 78px; margin-bottom: -78px; padding: 10px 12px 0; }
    .nav-bar { height: 60px; padding: 0 10px 0 14px; border-radius: 16px; }
  }
  @media (max-width: 420px) {
    .nav-brand-tag { display: none; }
  }

  /* ── Panel menu HP (melayang) ── */
  .drawer-root {
    position: fixed;
    inset: 0;
    z-index: 1000;
    pointer-events: none;
  }
  .drawer-root.is-open { pointer-events: auto; }

  .drawer-backdrop {
    position: absolute;
    inset: 0;
    background: rgba(4, 20, 14, 0.55);
    backdrop-filter: blur(3px);
    -webkit-backdrop-filter: blur(3px);
    opacity: 0;
    transition: opacity 0.3s ease;
  }
  .drawer-root.is-open .drawer-backdrop { opacity: 1; }

  .drawer {
    position: absolute;
    top: 10px;
    right: 10px;
    bottom: 10px;
    width: min(390px, calc(100vw - 20px));
    display: flex;
    flex-direction: column;
    border-radius: 22px;
    border: 1px solid rgba(200, 151, 58, 0.35);
    background: linear-gradient(180deg, #0D3326 0%, #08231A 100%);
    box-shadow: 0 24px 60px rgba(0, 0, 0, 0.45);
    overflow: hidden;
    opacity: 0;
    transform: translateX(24px) scale(0.98);
    transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1), opacity 0.25s ease;
  }
  .drawer-root.is-open .drawer { opacity: 1; transform: none; }

  .drawer-head {
    display: flex;
    align-items: center;
    gap: 10px;
    padding: 14px 14px 14px 16px;
    border-bottom: 1px solid rgba(255, 255, 255, 0.08);
  }
  .drawer-brand { display: flex; align-items: center; gap: 10px; text-decoration: none; flex: 1; min-width: 0; }
  .drawer-brand span { color: #fff; font-weight: 800; font-size: 15px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
  .drawer-close {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 40px;
    height: 40px;
    border-radius: 12px;
    border: 1px solid rgba(255, 255, 255, 0.16);
    background: rgba(255, 255, 255, 0.05);
    color: #fff;
    cursor: pointer;
    flex-shrink: 0;
    transition: background 0.2s, transform 0.15s;
  }
  .drawer-close:hover { background: rgba(200, 151, 58, 0.18); }
  .drawer-close:active { transform: scale(0.94); }

  .drawer-body {
    flex: 1;
    overflow-y: auto;
    padding: 14px 14px 16px;
    overscroll-behavior: contain;
  }

  .drawer-foot {
    padding: 14px 14px calc(14px + env(safe-area-inset-bottom, 0px));
    border-top: 1px solid rgba(255, 255, 255, 0.08);
  }

  .m-item {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 10px;
    width: 100%;
    padding: 13px 12px;
    border: none;
    background: none;
    color: #fff;
    font-family: inherit;
    font-size: 15.5px;
    font-weight: 700;
    text-align: left;
    text-decoration: none;
    cursor: pointer;
    border-radius: 12px;
    transition: color 0.2s, background 0.2s;
  }
  .m-item:hover, .m-item:focus-visible, .m-item.is-active {
    color: #E8B84B;
    background: rgba(255, 255, 255, 0.05);
    outline: none;
  }
  .m-item .chev { transition: transform 0.3s ease; color: #E8B84B; flex-shrink: 0; }
  .m-item.is-open .chev { transform: rotate(180deg); }

  .m-sub {
    overflow: hidden;
    max-height: 0;
    opacity: 0;
    transition: max-height 0.32s ease, opacity 0.25s ease;
  }
  .m-sub.is-open { max-height: 720px; opacity: 1; }
  .m-sub-inner {
    display: flex;
    flex-direction: column;
    gap: 2px;
    margin: 2px 0 8px 14px;
    padding: 2px 0 2px 12px;
    border-left: 2px solid rgba(200, 151, 58, 0.4);
  }
  .m-sub-link {
    padding: 10px;
    border-radius: 8px;
    color: rgba(255, 255, 255, 0.72);
    text-decoration: none;
    font-size: 14px;
    font-weight: 500;
    transition: background 0.15s, color 0.15s;
  }
  .m-sub-link:hover, .m-sub-link:focus-visible {
    background: rgba(200, 151, 58, 0.14);
    color: #E8B84B;
    outline: none;
  }

  .m-cta {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 100%;
    padding: 15px;
    border-radius: 14px;
    background: ${GOLD};
    color: #1A1408;
    font-size: 15px;
    font-weight: 700;
    text-decoration: none;
    box-shadow: 0 8px 20px rgba(217, 164, 65, 0.3);
    transition: transform 0.15s, filter 0.2s;
  }
  .m-cta:hover { filter: brightness(1.05); }
  .m-cta:active { transform: scale(0.98); }

  @media (prefers-reduced-motion: reduce) {
    .drawer, .drawer-backdrop, .m-sub { transition: none; }
  }
`;

// ─── Desktop sub-components ──────────────────────────────────────────────────

function DropdownPanel({ children, triggerRef, panelWidth = 480, id }: {
  children: React.ReactNode;
  triggerRef: React.RefObject<HTMLDivElement | null>;
  panelWidth?: number;
  id: string;
}) {
  const [style, setStyle] = useState<React.CSSProperties>({ visibility: 'hidden', position: 'fixed' });
  const [arrowLeft, setArrowLeft] = useState(0);

  useEffect(() => {
    if (!triggerRef.current) return;

    const update = () => {
      const triggerRect = triggerRef.current!.getBoundingClientRect();
      const vw = window.innerWidth;
      const MARGIN = 12;
      const width = Math.min(panelWidth, vw - MARGIN * 2);

      let left = triggerRect.left + triggerRect.width / 2 - width / 2;
      left = Math.max(MARGIN, Math.min(left, vw - width - MARGIN));

      setArrowLeft((triggerRect.left + triggerRect.width / 2) - left);

      setStyle({
        position: 'fixed',
        top: triggerRect.bottom + 18,
        left,
        width,
        visibility: 'visible',
      });
    };

    update();
    window.addEventListener('resize', update);
    return () => window.removeEventListener('resize', update);
  }, [triggerRef, panelWidth]);

  if (typeof window === 'undefined') return null;

  return createPortal(
    <div
      style={{
        ...style,
        background: 'white',
        borderRadius: 14,
        boxShadow: '0 16px 48px rgba(0,0,0,0.16)',
        border: '1px solid #F0EBE0',
        padding: '14px',
        zIndex: 99999,
        animation: 'dropFadeIn 0.15s ease',
      }}
      data-dropdown={id}
      className="notranslate"
      translate="no"
      role="menu"
      aria-label={`${id} dropdown`}
    >
      <div
        style={{
          position: 'absolute',
          top: -7,
          left: arrowLeft,
          transform: 'translateX(-50%) rotate(45deg)',
          width: 13,
          height: 13,
          background: 'white',
          border: '1px solid #F0EBE0',
          borderBottom: 'none',
          borderRight: 'none',
        }}
      />
      {children}
    </div>,
    document.body
  );
}

function NavButton({
  label, isOpen, onClick, ariaControls, active,
}: {
  label: string;
  isOpen: boolean;
  onClick: () => void;
  ariaControls: string;
  active: boolean;
}) {
  return (
    <button
      onClick={onClick}
      className={`nav-link${active ? ' is-active' : ''}`}
      aria-expanded={isOpen}
      aria-haspopup="true"
      aria-controls={ariaControls}
    >
      {label}
      <ChevronDown size={14} className="chev" />
    </button>
  );
}

// ─── Mobile accordion ───────────────────────────────────────────────────────

function MobileAccordion({
  label, items, isOpen, onToggle, onNavigate,
}: {
  label: string;
  items: { nama: string; href: string }[];
  isOpen: boolean;
  onToggle: () => void;
  onNavigate: () => void;
}) {
  return (
    <div>
      <button
        className={`m-item${isOpen ? ' is-open' : ''}`}
        onClick={onToggle}
        aria-expanded={isOpen}
      >
        <span>{label}</span>
        <ChevronDown size={18} className="chev" />
      </button>
      <div className={`m-sub${isOpen ? ' is-open' : ''}`}>
        <div className="m-sub-inner">
          {items.map(it => (
            <Link key={it.nama} href={it.href} className="m-sub-link" onClick={onNavigate}>
              {it.nama}
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}

// ─── Main Component ─────────────────────────────────────────────────────────

export default function Navbar() {
  const pathname = usePathname() ?? '/';
  const t = LABELS[useLang()];
  const tentangList = TENTANG_LIST.map((it, i) => ({ ...it, nama: t.tentangItems[i] }));
  // true hanya di browser (portal drawer butuh document.body)
  const mounted = useSyncExternalStore(noopSubscribe, () => true, () => false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [eskulOpen, setEskulOpen] = useState(false);
  const [mobileEskul, setMobileEskul] = useState(false);
  const [tentangOpen, setTentangOpen] = useState(false);
  const [mobileTentang, setMobileTentang] = useState(false);

  const eskulRef = useRef<HTMLDivElement>(null);
  const tentangRef = useRef<HTMLDivElement>(null);

  const isActive = (href: string) => (href === '/' ? pathname === '/' : pathname.startsWith(href));
  const tentangActive = TENTANG_LIST.some(it => isActive(it.href));
  const eskulActive = pathname.startsWith('/ekstrakulikuler');


  // Scroll listener
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    onScroll();
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Close desktop dropdowns on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      const target = e.target as Node;
      const inEskul = eskulRef.current?.contains(target) ||
        !!(target as HTMLElement).closest?.('[data-dropdown="eskul"]');
      const inTentang = tentangRef.current?.contains(target) ||
        !!(target as HTMLElement).closest?.('[data-dropdown="tentang"]');
      if (!inEskul) setEskulOpen(false);
      if (!inTentang) setTentangOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  // Close mobile menu when resizing up to desktop
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth > MOBILE_BP) setMobileOpen(false);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Lock body scroll + close on Escape while drawer is open
  useEffect(() => {
    if (!mobileOpen) return;
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setMobileOpen(false);
    };
    window.addEventListener('keydown', onKey);
    return () => {
      document.body.style.overflow = prevOverflow;
      window.removeEventListener('keydown', onKey);
    };
  }, [mobileOpen]);

  const closeMobile = () => {
    setMobileOpen(false);
    setMobileEskul(false);
    setMobileTentang(false);
  };

  return (
    <>
      <style>{CSS}</style>

      <header className="nav-wrap notranslate" translate="no">
        <nav
          className={`nav-bar${scrolled ? ' is-scrolled' : ''}`}
          role="navigation"
          aria-label="Main navigation"
        >
          {/* ── Logo ── */}
          <Link href="/" className="nav-brand" aria-label="SMA Citra Negara - Beranda">
            <Image
              src="/images/logosma.png"
              alt="Logo SMA Citra Negara"
              width={42}
              height={42}
              style={{ objectFit: 'contain' }}
              loading="eager"
            />
            <div>
              <div className="nav-brand-name notranslate" translate="no">SMA Citra Negara</div>
              <div className="nav-brand-tag">{t.tagline}</div>
            </div>
          </Link>

          {/* ── Desktop Nav ── */}
          <div className="desktop-nav">
            <NavLink href="/" active={isActive('/')}>{t.beranda}</NavLink>

            <div ref={tentangRef} style={{ position: 'relative' }}>
              <NavButton
                label={t.tentang}
                isOpen={tentangOpen}
                active={tentangActive}
                onClick={() => setTentangOpen(v => !v)}
                ariaControls="tentang-dropdown"
              />
              {tentangOpen && (
                <DropdownPanel triggerRef={tentangRef} panelWidth={220} id="tentang">
                  <div className="tentang-list">
                    {tentangList.map(it => (
                      <Link
                        key={it.href}
                        href={it.href}
                        className="eskul-text-item"
                        onClick={() => setTentangOpen(false)}
                      >
                        {it.nama}
                      </Link>
                    ))}
                  </div>
                </DropdownPanel>
              )}
            </div>

            <NavLink href="/jurusan" active={isActive('/jurusan')}>{t.jurusan}</NavLink>

            <div ref={eskulRef} style={{ position: 'relative' }}>
              <NavButton
                label={t.eskul}
                isOpen={eskulOpen}
                active={eskulActive}
                onClick={() => setEskulOpen(v => !v)}
                ariaControls="eskul-dropdown"
              />
              {eskulOpen && (
                <DropdownPanel triggerRef={eskulRef} panelWidth={480} id="eskul">
                  <p style={{
                    fontSize: 11,
                    color: '#9CA3AF',
                    fontWeight: 700,
                    letterSpacing: 1,
                    marginBottom: 12,
                    paddingLeft: 2,
                  }}>
                    {t.eskulCount}
                  </p>
                  <div className="eskul-grid">
                    {ESKUL_LIST.map(e => (
                      <Link
                        key={e.nama}
                        href={e.href}
                        className="eskul-text-item"
                        onClick={() => setEskulOpen(false)}
                      >
                        {e.nama}
                      </Link>
                    ))}
                  </div>
                </DropdownPanel>
              )}
            </div>

            <NavLink href="/prestasi" active={isActive('/prestasi')}>{t.prestasi}</NavLink>
            <NavLink href="/berita" active={isActive('/berita')}>{t.berita}</NavLink>
          </div>

          {/* ── Bahasa + Daftar (Desktop) ── */}
          <div className="desktop-auth">
            <LangSwitch />
            <a href={SPMB_URL} target="_blank" rel="noopener noreferrer" className="nav-cta">
              {t.daftar}
            </a>
          </div>

          {/* ── Mobile Toggle ── */}
          <button
            onClick={() => setMobileOpen(true)}
            className="mobile-toggle"
            aria-expanded={mobileOpen}
            aria-label="Buka menu"
            aria-controls="mobile-drawer"
          >
            <span className="hamburger">
              <span />
              <span />
              <span />
            </span>
          </button>
        </nav>
      </header>

      {/* ── Mobile Drawer (portal) ── */}
      {mounted && createPortal(
        <div
          className={`drawer-root notranslate${mobileOpen ? ' is-open' : ''}`}
          id="mobile-drawer"
          aria-hidden={!mobileOpen}
        >
          <div className="drawer-backdrop" onClick={closeMobile} />

          <aside className="drawer" role="dialog" aria-modal="true" aria-label="Menu navigasi">
            <div className="drawer-head">
              <Link href="/" onClick={closeMobile} className="drawer-brand">
                <Image
                  src="/images/logosma.png"
                  alt="Logo SMA Citra Negara"
                  width={36}
                  height={36}
                  style={{ objectFit: 'contain' }}
                />
                <span className="notranslate" translate="no">SMA Citra Negara</span>
              </Link>
              <LangSwitch />
              <button className="drawer-close" onClick={closeMobile} aria-label="Tutup menu">
                <X size={20} />
              </button>
            </div>

            <div className="drawer-body">
              <Link href="/" className={`m-item${isActive('/') ? ' is-active' : ''}`} onClick={closeMobile}>{t.beranda}</Link>

              <MobileAccordion
                label={t.tentang}
                items={tentangList}
                isOpen={mobileTentang}
                onToggle={() => setMobileTentang(v => !v)}
                onNavigate={closeMobile}
              />

              <Link href="/jurusan" className={`m-item${isActive('/jurusan') ? ' is-active' : ''}`} onClick={closeMobile}>{t.jurusan}</Link>

              <MobileAccordion
                label={t.eskul}
                items={ESKUL_LIST}
                isOpen={mobileEskul}
                onToggle={() => setMobileEskul(v => !v)}
                onNavigate={closeMobile}
              />

              <Link href="/prestasi" className={`m-item${isActive('/prestasi') ? ' is-active' : ''}`} onClick={closeMobile}>{t.prestasi}</Link>
              <Link href="/berita" className={`m-item${isActive('/berita') ? ' is-active' : ''}`} onClick={closeMobile}>{t.berita}</Link>
            </div>

            <div className="drawer-foot">
              <a
                href={SPMB_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="m-cta"
                onClick={closeMobile}
              >
                {t.daftar}
              </a>
            </div>
          </aside>
        </div>,
        document.body
      )}
    </>
  );
}

// ─── Helpers ───────────────────────────────────────────────────────────────

function NavLink({ href, active, children }: { href: string; active: boolean; children: React.ReactNode }) {
  return (
    <Link href={href} className={`nav-link${active ? ' is-active' : ''}`}>
      {children}
    </Link>
  );
}
