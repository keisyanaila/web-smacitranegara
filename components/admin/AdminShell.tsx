'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';

const LINKS = [
  { href: '/admin/dashboard', label: 'Dashboard' },
  { href: '/admin/berita', label: 'Berita' },
  { href: '/admin/prestasi', label: 'Prestasi' },
];

export default function AdminShell({
  hasDb,
  children,
}: {
  hasDb: boolean;
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();

  async function logout() {
    await fetch('/api/auth/logout', { method: 'POST' });
    router.refresh();
    router.push('/admin');
  }

  return (
    <>
      <header className="adm-bar">
        <div className="adm-bar-inner">
          <div className="adm-brand">
            SMA Citra Negara <span>· Admin</span>
          </div>
          <nav className="adm-nav">
            {LINKS.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                className={pathname.startsWith(l.href) ? 'active' : ''}
              >
                {l.label}
              </Link>
            ))}
            <a href="/" target="_blank" rel="noreferrer">
              Lihat situs ↗
            </a>
          </nav>
          <button className="adm-logout" onClick={logout}>
            Keluar
          </button>
        </div>
      </header>

      {!hasDb && (
        <div className="adm-warn">
          <code>DATABASE_URL</code> belum di-set. Isi <code>.env.local</code> dan jalankan{' '}
          <code>db/schema.sql</code> di Neon, lalu restart <code>npm run dev</code>. Sebelum itu,
          form tidak bisa menyimpan.
        </div>
      )}

      <main className="adm-main">{children}</main>
    </>
  );
}
