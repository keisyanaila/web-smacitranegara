'use client';

import { useEffect, useState, useCallback } from 'react';
import { Pencil, Plus, Trash2 } from 'lucide-react';
import ImageInput from '@/components/admin/ImageInput';
import {
  FormCard,
  ListToolbar,
  StatusPill,
  Toggle,
  filterItems,
  type StatusFilter,
} from '@/components/admin/ui';
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

type Draft = Omit<Prestasi, 'id'> & { id: number | null };

const emptyDraft = (): Draft => ({
  id: null,
  nama: '',
  siswa: [{ nama: '', kelas: '' }],
  tahun: new Date().getFullYear(),
  kategori: 'Akademik',
  tingkat: '',
  foto: '',
  deskripsi: '',
  published: true,
});

const siswaLabel = (list: Siswa[]) =>
  list.map((s) => (s.kelas ? `${s.nama} — ${s.kelas}` : s.nama)).filter(Boolean).join(', ');

export default function AdminPrestasiPage() {
  const [items, setItems] = useState<Prestasi[]>([]);
  const [loading, setLoading] = useState(true);
  const [draft, setDraft] = useState<Draft | null>(null);
  const [saving, setSaving] = useState(false);
  const [err, setErr] = useState('');
  const [query, setQuery] = useState('');
  const [filter, setFilter] = useState<StatusFilter>('semua');

  // `loading` hanya untuk muat pertama; muat ulang setelah simpan berjalan di latar.
  const load = useCallback(async () => {
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

  function open(d: Draft) {
    setErr('');
    setDraft(d);
    window.scrollTo({ top: 0 });
  }

  function startEdit(p: Prestasi) {
    open({ ...p, siswa: p.siswa.length ? p.siswa : [{ nama: '', kelas: '' }] });
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
      const res = await fetch(draft.id ? `/api/prestasi/${draft.id}` : '/api/prestasi', {
        method: draft.id ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(draft),
      });
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

  const { counts, shown } = filterItems(
    items,
    filter,
    query,
    (p) => `${p.nama} ${p.kategori} ${p.tingkat} ${p.tahun} ${siswaLabel(p.siswa)}`
  );

  return (
    <>
      <div className="adm-head">
        <div>
          <div className="adm-h1">Prestasi</div>
          <div className="adm-sub">Prestasi yang berstatus Tayang muncul di halaman /prestasi.</div>
        </div>
        {!draft && (
          <button className="adm-btn" onClick={() => open(emptyDraft())}>
            <Plus size={16} /> Tambah prestasi
          </button>
        )}
      </div>

      {draft ? (
        <FormCard
          title={draft.id ? 'Edit prestasi' : 'Tambah prestasi'}
          onClose={() => setDraft(null)}
          onSubmit={save}
          footer={
            <>
              <button className="adm-btn" type="submit" disabled={saving}>
                {saving ? 'Menyimpan…' : 'Simpan prestasi'}
              </button>
              <button type="button" className="adm-btn adm-btn-ghost" onClick={() => setDraft(null)}>
                Batal
              </button>
            </>
          }
        >
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
                    placeholder="contoh : keisya naila azmika"
                    value={s.nama}
                    onChange={(e) => setSiswa(i, { nama: e.target.value })}
                  />
                  <input
                    className="adm-input"
                    placeholder="Kelas (mis. XI IPA 1)"
                    value={s.kelas}
                    onChange={(e) => setSiswa(i, { kelas: e.target.value })}
                  />
                  <button
                    type="button"
                    className="adm-icon-btn danger"
                    title="Hapus baris"
                    aria-label="Hapus baris"
                    onClick={() => setDraft({ ...draft, siswa: draft.siswa.filter((_, idx) => idx !== i) })}
                  >
                    <Trash2 size={15} />
                  </button>
                </div>
              ))}
              <button
                type="button"
                className="adm-btn adm-btn-ghost adm-btn-sm"
                style={{ alignSelf: 'flex-start' }}
                onClick={() => setDraft({ ...draft, siswa: [...draft.siswa, { nama: '', kelas: '' }] })}
              >
                <Plus size={14} /> Tambah siswa
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

          <div className="adm-row-2">
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
              <label className="adm-label">Status</label>
              <Toggle
                checked={draft.published}
                onChange={(v) => setDraft({ ...draft, published: v })}
                label={draft.published ? 'Tayang di situs' : 'Draft (tidak tampil)'}
              />
            </div>
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
        </FormCard>
      ) : loading ? (
        <div className="adm-empty">Memuat…</div>
      ) : (
        <div className="adm-panel">
          <ListToolbar
            query={query}
            onQuery={setQuery}
            placeholder="Cari prestasi…"
            filter={filter}
            onFilter={setFilter}
            counts={counts}
            shown={shown.length}
            noun="prestasi"
          />
          <table className="adm-table">
            <thead>
              <tr>
                <th>Nama</th>
                <th>Siswa / Kelas</th>
                <th>Kategori</th>
                <th>Status</th>
                <th />
              </tr>
            </thead>
            <tbody>
              {shown.length === 0 ? (
                <tr>
                  <td colSpan={5} className="adm-table-empty">
                    {items.length === 0 ? 'Belum ada prestasi. Klik “Tambah prestasi”.' : 'Tidak ada prestasi yang cocok.'}
                  </td>
                </tr>
              ) : (
                shown.map((p) => (
                  <tr key={p.id}>
                    <td style={{ width: '36%' }}>
                      <div className="adm-cell-title">
                        {p.foto ? <img className="adm-thumb" src={p.foto} alt="" onError={(e) => (e.currentTarget.style.visibility = 'hidden')} /> : <div className="adm-thumb" />}
                        {p.nama}
                      </div>
                    </td>
                    <td data-label="Siswa">{siswaLabel(p.siswa) || <span className="adm-cell-muted">—</span>}</td>
                    <td data-label="Kategori">{p.kategori}</td>
                    <td>
                      <StatusPill published={p.published} />
                    </td>
                    <td>
                      <div className="adm-cell-actions">
                        <button className="adm-btn adm-btn-ghost adm-btn-sm" onClick={() => startEdit(p)}>
                          <Pencil size={14} /> Edit
                        </button>
                        <button className="adm-btn adm-btn-danger adm-btn-sm" onClick={() => remove(p)}>
                          <Trash2 size={14} /> Hapus
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}
    </>
  );
}
