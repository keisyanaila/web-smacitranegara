'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { X, ChevronDown } from 'lucide-react';

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

const MOBILE_BP = 992;

// ─── Types ───────────────────────────────────────────────────────────────────

interface Session {
  role: string;
  namaLengkap?: string;
}

// ─── Styles ──────────────────────────────────────────────────────────────────

const styles = {
  navLink: {
    color: 'rgba(255,255,255,0.85)',
    textDecoration: 'none',
    padding: '8px 14px',
    borderRadius: 6,
    fontSize: 14,
    fontWeight: 500,
    transition: 'all 0.2s',
  },
  btnPrimary: {
    background: '#C8973A',
    color: 'white',
    border: 'none',
    borderRadius: 6,
    padding: '9px 20px',
    fontSize: 13,
    fontWeight: 600,
    cursor: 'pointer',
    textDecoration: 'none',
    transition: 'all 0.2s',
  },
};

const CSS = `
  @keyframes dropFadeIn {
    from { opacity: 0; transform: translateY(-8px); }
    to   { opacity: 1; transform: translateY(0); }
  }
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
  .desktop-nav { display: flex; align-items: center; gap: 4px; }
  .desktop-auth { display: flex; align-items: center; gap: 10px; flex-shrink: 0; }
  .mobile-toggle { display: none; }

  @media (max-width: ${MOBILE_BP}px) {
    .desktop-nav  { display: none; }
    .desktop-auth { display: none; }
    .mobile-toggle { display: inline-flex; }
  }

  /* ── Animated hamburger ── */
  .hamburger {
    position: relative;
    width: 26px;
    height: 18px;
    background: none;
    border: none;
    cursor: pointer;
    padding: 0;
    flex-shrink: 0;
  }
  .hamburger span {
    position: absolute;
    left: 0;
    width: 100%;
    height: 2px;
    border-radius: 2px;
    background: #fff;
    transition: transform 0.3s ease, opacity 0.2s ease, top 0.3s ease;
  }
  .hamburger span:nth-child(1) { top: 0; }
  .hamburger span:nth-child(2) { top: 8px; }
  .hamburger span:nth-child(3) { top: 16px; }
  .hamburger.is-open span:nth-child(1) { top: 8px; transform: rotate(45deg); }
  .hamburger.is-open span:nth-child(2) { opacity: 0; transform: scaleX(0); }
  .hamburger.is-open span:nth-child(3) { top: 8px; transform: rotate(-45deg); }

  /* ── Mobile drawer ── */
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
    background: rgba(4,20,14,0.55);
    backdrop-filter: blur(3px);
    -webkit-backdrop-filter: blur(3px);
    opacity: 0;
    transition: opacity 0.3s ease;
  }
  .drawer-root.is-open .drawer-backdrop { opacity: 1; }

  .drawer {
    position: absolute;
    top: 0;
    right: 0;
    height: 100%;
    width: min(360px, 86vw);
    display: flex;
    flex-direction: column;
    background: linear-gradient(180deg, #0B3D2E 0%, #082A20 100%);
    box-shadow: -14px 0 44px rgba(0,0,0,0.4);
    transform: translateX(100%);
    transition: transform 0.34s cubic-bezier(0.4, 0, 0.2, 1);
  }
  .drawer-root.is-open .drawer { transform: translateX(0); }

  .drawer-head {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 12px;
    padding: 18px 20px;
    border-bottom: 1px solid rgba(200,151,58,0.22);
  }
  .drawer-close {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 38px;
    height: 38px;
    border-radius: 10px;
    border: 1px solid rgba(255,255,255,0.14);
    background: rgba(255,255,255,0.04);
    color: #fff;
    cursor: pointer;
    transition: background 0.2s, transform 0.15s;
  }
  .drawer-close:hover { background: rgba(200,151,58,0.18); }
  .drawer-close:active { transform: scale(0.94); }

  .drawer-body {
    flex: 1;
    overflow-y: auto;
    padding: 8px 20px 16px;
    overscroll-behavior: contain;
  }

  .drawer-foot {
    padding: 16px 20px calc(16px + env(safe-area-inset-bottom, 0px));
    border-top: 1px solid rgba(200,151,58,0.22);
    display: flex;
    flex-direction: column;
    gap: 10px;
  }

  .m-item {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 10px;
    width: 100%;
    padding: 14px 6px;
    border: none;
    border-bottom: 1px solid rgba(255,255,255,0.07);
    background: none;
    color: rgba(255,255,255,0.9);
    font-family: inherit;
    font-size: 15px;
    font-weight: 500;
    text-align: left;
    text-decoration: none;
    cursor: pointer;
    border-radius: 8px;
    transition: color 0.2s, background 0.2s, padding-left 0.2s;
  }
  .m-item:hover, .m-item:focus-visible {
    color: #E8B84B;
    background: rgba(200,151,58,0.10);
    padding-left: 12px;
    outline: none;
  }
  .m-item:active { transform: scale(0.99); }
  .m-item .chev { transition: transform 0.3s ease; color: #C8973A; flex-shrink: 0; }
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
    margin: 4px 0 8px 6px;
    padding: 4px 0 4px 14px;
    border-left: 2px solid rgba(200,151,58,0.4);
  }
  .m-sub-link {
    padding: 11px 10px;
    border-radius: 8px;
    color: rgba(255,255,255,0.72);
    text-decoration: none;
    font-size: 13.5px;
    transition: background 0.15s, color 0.15s;
  }
  .m-sub-link:hover, .m-sub-link:focus-visible {
    background: rgba(200,151,58,0.14);
    color: #E8B84B;
    outline: none;
  }

  .m-btn {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 100%;
    padding: 13px;
    border-radius: 10px;
    font-size: 14px;
    font-weight: 600;
    text-decoration: none;
    cursor: pointer;
    font-family: inherit;
    transition: transform 0.15s, filter 0.2s, background 0.2s;
  }
  .m-btn:active { transform: scale(0.98); }
  .m-btn-solid { background: #C8973A; color: #fff; border: none; }
  .m-btn-solid:hover { filter: brightness(1.06); }
  .m-btn-ghost {
    background: transparent;
    color: #fff;
    border: 1px solid rgba(255,255,255,0.28);
  }
  .m-btn-ghost:hover { background: rgba(255,255,255,0.08); }
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
        top: triggerRect.bottom + 10,
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
  label, isOpen, onClick, ariaControls,
}: {
  label: string;
  isOpen: boolean;
  onClick: () => void;
  ariaControls: string;
}) {
  return (
    <button
      onClick={onClick}
      style={{
        ...styles.navLink,
        background: 'none',
        border: 'none',
        cursor: 'pointer',
        display: 'flex',
        alignItems: 'center',
        gap: 5,
        color: isOpen ? '#C8973A' : 'rgba(255,255,255,0.85)',
      }}
      aria-expanded={isOpen}
      aria-haspopup="true"
      aria-controls={ariaControls}
    >
      {label}
      <ChevronDown
        size={14}
        style={{
          transition: 'transform 0.2s',
          transform: isOpen ? 'rotate(180deg)' : 'rotate(0)',
        }}
      />
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
  const [mounted, setMounted] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [eskulOpen, setEskulOpen] = useState(false);
  const [mobileEskul, setMobileEskul] = useState(false);
  const [tentangOpen, setTentangOpen] = useState(false);
  const [mobileTentang, setMobileTentang] = useState(false);
  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const eskulRef = useRef<HTMLDivElement>(null);
  const tentangRef = useRef<HTMLDivElement>(null);

  useEffect(() => setMounted(true), []);

  // Scroll listener
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    onScroll();
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Session fetch
  useEffect(() => {
    const fetchSession = async () => {
      try {
        const response = await fetch('/api/auth/me', {
          credentials: 'same-origin',
          headers: { 'Content-Type': 'application/json' },
        });
        if (!response.ok) throw new Error('Failed to fetch session');
        const data = await response.json();
        if (data.user) setSession(data.user);
      } catch (error) {
        console.error('Session fetch error:', error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchSession();
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

  const handleLogout = async () => {
    try {
      const response = await fetch('/api/auth/logout', {
        method: 'POST',
        credentials: 'same-origin',
        headers: { 'Content-Type': 'application/json' },
      });
      if (!response.ok) throw new Error('Logout failed');
      setSession(null);
      window.location.href = '/';
    } catch (error) {
      console.error('Logout error:', error);
      window.location.href = '/';
    }
  };

  const closeMobile = () => {
    setMobileOpen(false);
    setMobileEskul(false);
    setMobileTentang(false);
  };

  const dashboardHref = session?.role === 'admin' ? '/admin/dashboard' : '/dashboard';

  return (
    <>
      <style>{CSS}</style>

      <nav
        style={{
          background: scrolled ? '#145A45' : '#0B3D2E',
          borderBottom: '2px solid #C8973A',
          position: 'sticky',
          top: 0,
          zIndex: 100,
          transition: 'background 0.3s',
        }}
        role="navigation"
        aria-label="Main navigation"
      >
        <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 24px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: 70 }}>

            {/* ── Logo ── */}
            <Link
              href="/"
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 12,
                textDecoration: 'none',
                flexShrink: 0,
              }}
              aria-label="SMA Citra Negara - Beranda"
            >
              <div style={{ width: 46, height: 44 }}>
                <Image
                  src="/images/logosma.png"
                  alt="Logo SMA Citra Negara"
                  width={44}
                  height={44}
                  style={{ objectFit: 'contain' }}
                  priority
                />
              </div>
              <div>
                <div style={{ color: 'white', fontWeight: 800, fontSize: 16, lineHeight: 1.2 }}>
                  SMA Citra Negara
                </div>
                <div style={{ color: '#C8973A', fontSize: 11, fontWeight: 500 }}>
                  Pilihan Tepat di Sekolah yang MANTAP
                </div>
              </div>
            </Link>

            {/* ── Desktop Nav ── */}
            <div className="desktop-nav">
              <NavLink href="/">Beranda</NavLink>

              <div ref={tentangRef} style={{ position: 'relative' }}>
                <NavButton
                  label="Tentang Kami"
                  isOpen={tentangOpen}
                  onClick={() => setTentangOpen(v => !v)}
                  ariaControls="tentang-dropdown"
                />
                {tentangOpen && (
                  <DropdownPanel triggerRef={tentangRef} panelWidth={220} id="tentang">
                    <div className="tentang-list">
                      {TENTANG_LIST.map(t => (
                        <Link
                          key={t.nama}
                          href={t.href}
                          className="eskul-text-item"
                          onClick={() => setTentangOpen(false)}
                        >
                          {t.nama}
                        </Link>
                      ))}
                    </div>
                  </DropdownPanel>
                )}
              </div>

              <NavLink href="/jurusan">Bidang Studi</NavLink>

              <div ref={eskulRef} style={{ position: 'relative' }}>
                <NavButton
                  label="Ekstrakurikuler"
                  isOpen={eskulOpen}
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
                      13+ EKSTRAKURIKULER
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

              <NavLink href="/prestasi">Prestasi</NavLink>
              <NavLink href="/berita">Berita</NavLink>
              <NavLink href="/spmb">SPMB</NavLink>
            </div>

            {/* ── Auth Buttons (Desktop) ── */}
            <div className="desktop-auth">
              {isLoading ? (
                <div style={{ width: 100, height: 30, background: 'rgba(255,255,255,0.1)', borderRadius: 6 }} />
              ) : session ? (
                <>
                  <Link
                    href={dashboardHref}
                    style={{ color: '#C8973A', fontSize: 14, fontWeight: 600, textDecoration: 'none' }}
                  >
                    {session.namaLengkap || 'Dashboard'}
                  </Link>
                  <button
                    onClick={handleLogout}
                    style={{
                      background: 'transparent',
                      border: '1px solid rgba(255,255,255,0.3)',
                      color: 'rgba(255,255,255,0.7)',
                      padding: '7px 16px',
                      borderRadius: 6,
                      cursor: 'pointer',
                      fontSize: 13,
                      transition: 'all 0.2s',
                    }}
                    onMouseEnter={(e) => { e.currentTarget.style.background = 'rgba(255,255,255,0.1)'; }}
                    onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent'; }}
                  >
                    Keluar
                  </button>
                </>
              ) : (
                <>
                  <Link
                    href="/login"
                    style={{
                      color: 'rgba(255,255,255,0.8)',
                      textDecoration: 'none',
                      fontSize: 14,
                      fontWeight: 500,
                      padding: '8px 16px',
                      transition: 'color 0.2s',
                    }}
                    onMouseEnter={(e) => { e.currentTarget.style.color = '#C8973A'; }}
                    onMouseLeave={(e) => { e.currentTarget.style.color = 'rgba(255,255,255,0.8)'; }}
                  >
                    Masuk
                  </Link>
                  <Link
                    href="/register"
                    style={{ ...styles.btnPrimary, display: 'inline-block' }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.background = '#B07D2E';
                      e.currentTarget.style.transform = 'translateY(-1px)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.background = '#C8973A';
                      e.currentTarget.style.transform = 'translateY(0)';
                    }}
                  >
                    Daftar Sekarang
                  </Link>
                </>
              )}
            </div>

            {/* ── Mobile Toggle ── */}
            <button
              onClick={() => setMobileOpen(v => !v)}
              className={`hamburger mobile-toggle${mobileOpen ? ' is-open' : ''}`}
              aria-expanded={mobileOpen}
              aria-label={mobileOpen ? 'Tutup menu' : 'Buka menu'}
              aria-controls="mobile-drawer"
            >
              <span />
              <span />
              <span />
            </button>
          </div>
        </div>
      </nav>

      {/* ── Mobile Drawer (portal) ── */}
      {mounted && createPortal(
        <div
          className={`drawer-root${mobileOpen ? ' is-open' : ''}`}
          id="mobile-drawer"
          aria-hidden={!mobileOpen}
        >
          <div className="drawer-backdrop" onClick={closeMobile} />

          <aside className="drawer" role="dialog" aria-modal="true" aria-label="Menu navigasi">
            <div className="drawer-head">
              <Link
                href="/"
                onClick={closeMobile}
                style={{ display: 'flex', alignItems: 'center', gap: 10, textDecoration: 'none' }}
              >
                <Image
                  src="/images/logosma.png"
                  alt="Logo SMA Citra Negara"
                  width={36}
                  height={36}
                  style={{ objectFit: 'contain' }}
                />
                <span style={{ color: '#fff', fontWeight: 800, fontSize: 15 }}>
                  SMA Citra Negara
                </span>
              </Link>
              <button className="drawer-close" onClick={closeMobile} aria-label="Tutup menu">
                <X size={20} />
              </button>
            </div>

            <div className="drawer-body">
              <Link href="/" className="m-item" onClick={closeMobile}>Beranda</Link>

              <MobileAccordion
                label="Tentang Kami"
                items={TENTANG_LIST}
                isOpen={mobileTentang}
                onToggle={() => setMobileTentang(v => !v)}
                onNavigate={closeMobile}
              />

              <Link href="/jurusan" className="m-item" onClick={closeMobile}>Bidang Studi</Link>

              <MobileAccordion
                label="Ekstrakurikuler"
                items={ESKUL_LIST}
                isOpen={mobileEskul}
                onToggle={() => setMobileEskul(v => !v)}
                onNavigate={closeMobile}
              />

              <Link href="/prestasi" className="m-item" onClick={closeMobile}>Prestasi</Link>
              <Link href="/berita" className="m-item" onClick={closeMobile}>Berita</Link>
              <Link href="/spmb" className="m-item" onClick={closeMobile}>SPMB</Link>
            </div>

            <div className="drawer-foot">
              {isLoading ? (
                <div style={{ height: 46, background: 'rgba(255,255,255,0.06)', borderRadius: 10 }} />
              ) : session ? (
                <>
                  <Link href={dashboardHref} className="m-btn m-btn-solid" onClick={closeMobile}>
                    {session.namaLengkap || 'Dashboard'}
                  </Link>
                  <button className="m-btn m-btn-ghost" onClick={handleLogout}>Keluar</button>
                </>
              ) : (
                <>
                  <Link href="/register" className="m-btn m-btn-solid" onClick={closeMobile}>
                    Daftar Sekarang
                  </Link>
                  <Link href="/login" className="m-btn m-btn-ghost" onClick={closeMobile}>
                    Masuk
                  </Link>
                </>
              )}
            </div>
          </aside>
        </div>,
        document.body
      )}
    </>
  );
}

// ─── Helpers ───────────────────────────────────────────────────────────────

function NavLink({ href, children }: { href: string; children: React.ReactNode }) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <Link
      href={href}
      style={{
        ...styles.navLink,
        color: isHovered ? '#C8973A' : 'rgba(255,255,255,0.85)',
        background: isHovered ? 'rgba(200,151,58,0.1)' : 'transparent',
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {children}
    </Link>
  );
}
