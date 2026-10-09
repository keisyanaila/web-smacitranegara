'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import {
  CalendarDays,
  ExternalLink,
  LayoutDashboard,
  LogOut,
  Menu,
  Newspaper,
  Trophy,
} from 'lucide-react';

/* eslint-disable @next/next/no-img-element */

const LINKS = [
  { href: '/admin/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/admin/berita', label: 'Berita', icon: Newspaper },
  { href: '/admin/prestasi', label: 'Prestasi', icon: Trophy },
  { href: '/admin/spmb', label: 'Jadwal SPMB', icon: CalendarDays },
];

function Brand() {
  return (
    <Link href="/admin/dashboard" className="adm-brand">
      <img src="/images/logosma.png" alt="" />
      <div>
        <div className="adm-brand-name">SMA Citra Negara</div>
        <div className="adm-brand-tag">PANEL ADMIN</div>
      </div>
    </Link>
  );
}

export default function AdminShell({
  hasDb,
  children,
}: {
  hasDb: boolean;
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const [open, setOpen] = useState(false);

  async function logout() {
    await fetch('/api/auth/logout', { method: 'POST' });
    router.refresh();
    router.push('/admin');
  }

  return (
    <>
      <header className="adm-topbar">
        <button className="adm-menu-btn" onClick={() => setOpen(true)} aria-label="Buka menu">
          <Menu size={20} />
        </button>
        <Brand />
      </header>

      <div className={`adm-scrim ${open ? 'open' : ''}`} onClick={() => setOpen(false)} />

      <aside className={`adm-side ${open ? 'open' : ''}`}>
        <Brand />
        <nav className="adm-nav">
          {LINKS.map(({ href, label, icon: Icon }) => (
            <Link
              key={href}
              href={href}
              className={pathname.startsWith(href) ? 'active' : ''}
              onClick={() => setOpen(false)}
            >
              <Icon size={17} />
              {label}
            </Link>
          ))}
        </nav>
        <div className="adm-side-foot">
          <a href="/" target="_blank" rel="noreferrer" className="adm-side-link">
            <ExternalLink size={16} />
            Lihat situs
          </a>
          <button className="adm-logout" onClick={logout}>
            <LogOut size={16} />
            Keluar
          </button>
        </div>
      </aside>

      <div className="adm-content">
        <main className="adm-main">
          {!hasDb && (
            <div className="adm-warn">
              <code>DATABASE_URL</code> belum di-set. Isi <code>.env.local</code> dan jalankan{' '}
              <code>db/schema.sql</code> di Neon, lalu restart <code>npm run dev</code>. Sebelum itu,
              form tidak bisa menyimpan.
            </div>
          )}
          {children}
        </main>
      </div>
    </>
  );
}
