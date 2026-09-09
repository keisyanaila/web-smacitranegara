'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Eye, EyeOff } from 'lucide-react';

export default function LoginForm({ configured }: { configured: boolean }) {
  const router = useRouter();
  const [pw, setPw] = useState('');
  const [show, setShow] = useState(false);
  const [err, setErr] = useState('');
  const [busy, setBusy] = useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setErr('');
    setBusy(true);
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password: pw }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setErr(data.error || 'Gagal masuk.');
        return;
      }
      router.refresh();
    } catch {
      setErr('Terjadi kesalahan jaringan.');
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="adm-login-wrap">
      <form className="adm-login" onSubmit={submit}>
        <h1>Masuk Admin</h1>
        <p>SMA Citra Negara</p>

        {!configured && (
          <div className="adm-alert adm-alert-err" style={{ marginBottom: 14 }}>
            <code>ADMIN_PASSWORD</code> belum di-set di <code>.env.local</code>.
          </div>
        )}

        <div className="adm-login-field">
          <input
            className="adm-input"
            type={show ? 'text' : 'password'}
            placeholder="Password admin"
            value={pw}
            onChange={(e) => setPw(e.target.value)}
            autoFocus
            autoComplete="current-password"
          />
          <button
            type="button"
            className="adm-eye"
            onClick={() => setShow((s) => !s)}
            aria-label={show ? 'Sembunyikan password' : 'Tampilkan password'}
          >
            {show ? <EyeOff size={18} /> : <Eye size={18} />}
          </button>
        </div>

        {err && (
          <div className="adm-alert adm-alert-err" style={{ marginBottom: 12 }}>
            {err}
          </div>
        )}

        <button className="adm-btn" type="submit" disabled={busy || !pw}>
          {busy ? 'Memproses…' : 'Masuk'}
        </button>
      </form>
    </div>
  );
}
