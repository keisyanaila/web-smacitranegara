'use client';

import { useEffect, useState, useCallback } from 'react';
import ImageInput from '@/components/admin/ImageInput';
import { PRESTASI_KATEGORI, type Siswa } from '@/lib/prestasi';

/* eslint-disable @next/next/no-img-element */

type Prestasi = {
  id: number;
  nama: string;
  siswa: Siswa[];
  tahun: number;
  kategori: string;
  tingkat: string;
  foto: string;
  deskripsi: string;
  published: boolean;
};

type Draft = {
  id: number | null;
  nama: string;
  siswa: Siswa[];
  tahun: number;
  kategori: string;
  tingkat: string;
  foto: string;
  deskripsi: string;
  published: boolean;
};

const emptyDraft = (): Draft => ({
  id: null,
  nama: '',
  siswa: [],
  tahun: new Date().getFullYear(),
  kategori: 'Akademik',
  tingkat: '',
  foto: '',
  deskripsi: '',
  published: true,
});

export default function AdminPrestasiPage() {
  const [items, setItems] = useState<Prestasi[]>([]);
  const [loading, setLoading] = useState(true);
  const [draft, setDraft] = useState<Draft | null>(null);
  const [saving, setSaving] = useState(false);
  const [err, setErr] = useState('');

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/prestasi?all=1', { cache: 'no-store' });
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

  function startEdit(p: Prestasi) {
    setErr('');
    setDraft({
      id: p.id,
      nama: p.nama,
      siswa: p.siswa.length ? p.siswa : [],
      tahun: p.tahun,
      kategori: p.kategori,
      tingkat: p.tingkat,
      foto: p.foto,
      deskripsi: p.deskripsi,
      published: p.published,
    });
  }

  function setSiswa(i: number, patch: Partial<Siswa>) {
    if (!draft) return;
    const next = draft.siswa.map((s, idx) => (idx === i ? { ...s, ...patch } : s));
    setDraft({ ...draft, siswa: next });
  }

  async function save(e: React.FormEvent) {
    e.preventDefault();
    if (!draft) return;
    setSaving(true);
    setErr('');
    try {
      const res = await fetch(
        draft.id ? `/api/prestasi/${draft.id}` : '/api/prestasi',
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

  async function remove(p: Prestasi) {
    if (!confirm(`Hapus prestasi "${p.nama}"?`)) return;
    const res = await fetch(`/api/prestasi/${p.id}`, { method: 'DELETE' });
    if (res.ok) {
      setItems((prev) => prev.filter((x) => x.id !== p.id));
      if (draft?.id === p.id) setDraft(null);
    } else {
      const data = await res.json().catch(() => ({}));
      alert(data.error || 'Gagal menghapus.');
    }
  }

  return (
    <>
      <div className="adm-head">
        <div>
          <div className="adm-h1">Prestasi</div>
          <div className="adm-sub">Isi yang tampil di halaman /prestasi.</div>
        </div>
        {!draft && (
          <button className="adm-btn" onClick={startNew}>
            + Tambah prestasi
          </button>
        )}
      </div>

      {draft && (
        <div className="adm-card" style={{ marginBottom: 26 }}>
          <h3 style={{ fontSize: 18, fontWeight: 800, marginBottom: 18 }}>
            {draft.id ? 'Edit prestasi' : 'Tambah prestasi'}
          </h3>
          <form className="adm-form" onSubmit={save}>
            {err && <div className="adm-alert adm-alert-err">{err}</div>}

            <div className="adm-field">
              <label className="adm-label">
                Nama prestasi <span className="req">*</span>
              </label>
              <input
                className="adm-input"
                placeholder="JUARA 1 Lomba …"
                value={draft.nama}
                onChange={(e) => setDraft({ ...draft, nama: e.target.value })}
                required
              />
            </div>

            <div className="adm-field">
              <label className="adm-label">Siswa berprestasi</label>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                {draft.siswa.map((s, i) => (
                  <div className="adm-siswa-row" key={i}>
                    <input
                      className="adm-input"
                      placeholder="Nama siswa / nama tim"
                      value={s.nama}
                      onChange={(e) => setSiswa(i, { nama: e.target.value })}
                    />
                    <input
                      className="adm-input"
                      placeholder="Kelas"
                      value={s.kelas}
                      onChange={(e) => setSiswa(i, { kelas: e.target.value })}
                    />
                    <button
                      type="button"
                      className="adm-x"
                      title="Hapus baris"
                      onClick={() =>
                        setDraft({ ...draft, siswa: draft.siswa.filter((_, idx) => idx !== i) })
                      }
                    >
                      ×
                    </button>
                  </div>
                ))}
                <button
                  type="button"
                  className="adm-btn adm-btn-ghost adm-btn-sm"
                  style={{ alignSelf: 'flex-start' }}
                  onClick={() => setDraft({ ...draft, siswa: [...draft.siswa, { nama: '', kelas: '' }] })}
                >
                  + Tambah siswa
                </button>
              </div>
              <div className="adm-hint">
                Tambah satu baris per siswa (nama + kelas). Untuk prestasi tim, boleh 1 baris berisi nama tim.
              </div>
            </div>

            <div className="adm-row-2">
              <div className="adm-field">
                <label className="adm-label">Tahun</label>
                <input
                  className="adm-input"
                  type="number"
                  value={draft.tahun}
                  onChange={(e) => setDraft({ ...draft, tahun: Number(e.target.value) })}
                />
              </div>
              <div className="adm-field">
                <label className="adm-label">Kategori</label>
                <select
                  className="adm-select"
                  value={draft.kategori}
                  onChange={(e) => setDraft({ ...draft, kategori: e.target.value })}
                >
                  {PRESTASI_KATEGORI.map((k) => (
                    <option key={k} value={k}>
                      {k}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="adm-field">
              <label className="adm-label">Tingkat</label>
              <input
                className="adm-input"
                placeholder="Nasional / Provinsi / Kota / Sekolah"
                value={draft.tingkat}
                onChange={(e) => setDraft({ ...draft, tingkat: e.target.value })}
              />
            </div>

            <div className="adm-field">
              <label className="adm-label">Foto</label>
              <ImageInput value={draft.foto} onChange={(v) => setDraft({ ...draft, foto: v })} />
            </div>

            <div className="adm-field">
              <label className="adm-label">Deskripsi</label>
              <textarea
                className="adm-textarea adm-textarea-lg"
                value={draft.deskripsi}
                onChange={(e) => setDraft({ ...draft, deskripsi: e.target.value })}
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
        <div className="adm-empty">Belum ada data. Klik “Tambah prestasi”.</div>
      ) : (
        <div className="adm-list">
          {items.map((p) => (
            <div className="adm-row" key={p.id}>
              {p.foto ? (
                <img className="adm-row-thumb" src={p.foto} alt="" />
              ) : (
                <div className="adm-row-thumb" />
              )}
              <div className="adm-row-main">
                <div className="adm-row-title">{p.nama}</div>
                <div className="adm-row-meta">
                  <span>{p.tahun}</span>
                  <span>· {p.kategori}</span>
                  {p.tingkat && <span>· {p.tingkat}</span>}
                  {p.siswa.length > 0 && <span>· {p.siswa.map((s) => s.nama).filter(Boolean).join(', ')}</span>}
                  <span className={p.published ? 'adm-pill' : 'adm-pill adm-pill-off'}>
                    {p.published ? 'Tampil' : 'Draft'}
                  </span>
                </div>
              </div>
              <div className="adm-row-actions">
                <button className="adm-btn adm-btn-ghost adm-btn-sm" onClick={() => startEdit(p)}>
                  Edit
                </button>
                <button className="adm-btn adm-btn-danger adm-btn-sm" onClick={() => remove(p)}>
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
