import type { Metadata } from 'next';
import './admin.css';
import { isAuthed, authConfigured } from '@/lib/auth';
import { hasDb } from '@/lib/db';
import LoginForm from '@/components/admin/LoginForm';
import AdminShell from '@/components/admin/AdminShell';

export const metadata: Metadata = {
  title: 'Admin — SMA Citra Negara',
  robots: { index: false, follow: false },
};

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const authed = await isAuthed();

  if (!authed) {
    return (
      <div className="adm">
        <LoginForm configured={authConfigured()} />
      </div>
    );
  }

  return (
    <div className="adm">
      <AdminShell hasDb={hasDb}>{children}</AdminShell>
    </div>
  );
}
