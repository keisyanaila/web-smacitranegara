'use client';

import { useEffect, useState, useCallback } from 'react';
import ImageInput from '@/components/admin/ImageInput';
import { BERITA_KATEGORI } from '@/lib/berita';

/* eslint-disable @next/next/no-img-element */

type Berita = {
  id: number;
  slug: string;
  judul: string;
  tanggal: string;
  tanggalLabel: string;
  kategori: string;
  ringkasan: string;
  foto: string;
  konten: string[];
  published: boolean;
};

type Draft = {
  id: number | null;
  judul: string;
  slug: string;
  tanggal: string;
  kategori: string;
  ringkasan: string;
  konten: string;
  foto: string;
  published: boolean;
};

const emptyDraft = (): Draft => ({
  id: null,
  judul: '',
  slug: '',
  tanggal: new Date().toISOString().slice(0, 10),
  kategori: 'Kegiatan',
  ringkasan: '',
  konten: '',
  foto: '',
  published: true,
});

export default function AdminBeritaPage() {
  const [items, setItems] = useState<Berita[]>([]);
  const [loading, setLoading] = useState(true);
  const [draft, setDraft] = useState<Draft | null>(null);
  const [saving, setSaving] = useState(false);
  const [err, setErr] = useState('');

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/berita?all=1', { cache: 'no-store' });
      const data = await res.json();
      setItems(data.items ?? []);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  function startNew() {
    setErr('');
    setDraft(emptyDraft());
  }

  function startEdit(b: Berita) {
    setErr('');
    setDraft({
      id: b.id,
      judul: b.judul,
      slug: b.slug,
      tanggal: b.tanggal,
      kategori: b.kategori,
      ringkasan: b.ringkasan,
      konten: b.konten.join('\n\n'),
      foto: b.foto,
      published: b.published,
    });
  }

  async function save(e: React.FormEvent) {
    e.preventDefault();
    if (!draft) return;
    setSaving(true);
    setErr('');
    try {
      const res = await fetch(
        draft.id ? `/api/berita/${draft.id}` : '/api/berita',
        {
          method: draft.id ? 'PUT' : 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(draft),
        }
      );
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setErr(data.error || 'Gagal menyimpan.');
        return;
      }
      setDraft(null);
      await load();
    } catch {
      setErr('Terjadi kesalahan jaringan.');
    } finally {
      setSaving(false);
    }
  }

  async function remove(b: Berita) {
    if (!confirm(`Hapus berita "${b.judul}"?`)) return;
    const res = await fetch(`/api/berita/${b.id}`, { method: 'DELETE' });
    if (res.ok) {
      setItems((prev) => prev.filter((x) => x.id !== b.id));
      if (draft?.id === b.id) setDraft(null);
    } else {
      const data = await res.json().catch(() => ({}));
      alert(data.error || 'Gagal menghapus.');
    }
  }

  return (
    <>
      <div className="adm-head">
        <div>
          <div className="adm-h1">Berita</div>
          <div className="adm-sub">Isi yang tampil di halaman /berita.</div>
        </div>
        {!draft && (
          <button className="adm-btn" onClick={startNew}>
            + Tambah berita
          </button>
        )}
      </div>

      {draft && (
        <div className="adm-card" style={{ marginBottom: 26 }}>
          <h3 style={{ fontSize: 18, fontWeight: 800, marginBottom: 18 }}>
            {draft.id ? 'Edit berita' : 'Tambah berita'}
          </h3>
          <form className="adm-form" onSubmit={save}>
            {err && <div className="adm-alert adm-alert-err">{err}</div>}

            <div className="adm-field">
              <label className="adm-label">
                Judul <span className="req">*</span>
              </label>
              <input
                className="adm-input"
                value={draft.judul}
                onChange={(e) => setDraft({ ...draft, judul: e.target.value })}
                required
              />
            </div>

            <div className="adm-row-2">
              <div className="adm-field">
                <label className="adm-label">Tanggal</label>
                <input
                  className="adm-input"
                  type="date"
                  value={draft.tanggal}
                  onChange={(e) => setDraft({ ...draft, tanggal: e.target.value })}
                />
              </div>
              <div className="adm-field">
                <label className="adm-label">Kategori</label>
                <select
                  className="adm-select"
                  value={draft.kategori}
                  onChange={(e) => setDraft({ ...draft, kategori: e.target.value })}
                >
                  {BERITA_KATEGORI.map((k) => (
                    <option key={k} value={k}>
                      {k}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="adm-field">
              <label className="adm-label">Slug URL</label>
              <input
                className="adm-input"
                placeholder="otomatis dari judul kalau dikosongkan"
                value={draft.slug}
                onChange={(e) => setDraft({ ...draft, slug: e.target.value })}
              />
              <div className="adm-hint">Alamat berita: /berita/{draft.slug || '…'}</div>
            </div>

            <div className="adm-field">
              <label className="adm-label">Gambar</label>
              <ImageInput value={draft.foto} onChange={(v) => setDraft({ ...draft, foto: v })} />
            </div>

            <div className="adm-field">
              <label className="adm-label">Ringkasan</label>
              <textarea
                className="adm-textarea"
                value={draft.ringkasan}
                onChange={(e) => setDraft({ ...draft, ringkasan: e.target.value })}
              />
              <div className="adm-hint">Satu-dua kalimat yang muncul di kartu daftar berita.</div>
            </div>

            <div className="adm-field">
              <label className="adm-label">Isi berita</label>
              <textarea
                className="adm-textarea adm-textarea-lg"
                value={draft.konten}
                onChange={(e) => setDraft({ ...draft, konten: e.target.value })}
              />
              <div className="adm-hint">Pisahkan antar paragraf dengan satu baris kosong.</div>
            </div>

            <label className="adm-check">
              <input
                type="checkbox"
                checked={draft.published}
                onChange={(e) => setDraft({ ...draft, published: e.target.checked })}
              />
              Tampilkan di situs
            </label>

            <div className="adm-form-actions">
              <button className="adm-btn" type="submit" disabled={saving}>
                {saving ? 'Menyimpan…' : 'Simpan'}
              </button>
              <button
                type="button"
                className="adm-btn adm-btn-ghost"
                onClick={() => setDraft(null)}
              >
                Batal
              </button>
            </div>
          </form>
        </div>
      )}

      {loading ? (
        <div className="adm-empty">Memuat…</div>
      ) : items.length === 0 ? (
        <div className="adm-empty">Belum ada data. Klik “Tambah berita”.</div>
      ) : (
        <div className="adm-list">
          {items.map((b) => (
            <div className="adm-row" key={b.id}>
              {b.foto ? (
                <img className="adm-row-thumb" src={b.foto} alt="" />
              ) : (
                <div className="adm-row-thumb" />
              )}
              <div className="adm-row-main">
                <div className="adm-row-title">{b.judul}</div>
                <div className="adm-row-meta">
                  <span>{b.tanggalLabel}</span>
                  <span>· {b.kategori}</span>
                  <span>· /berita/{b.slug}</span>
                  <span className={b.published ? 'adm-pill' : 'adm-pill adm-pill-off'}>
                    {b.published ? 'Tampil' : 'Draft'}
                  </span>
                </div>
              </div>
              <div className="adm-row-actions">
                <button className="adm-btn adm-btn-ghost adm-btn-sm" onClick={() => startEdit(b)}>
                  Edit
                </button>
                <button className="adm-btn adm-btn-danger adm-btn-sm" onClick={() => remove(b)}>
                  Hapus
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </>
  );
}
