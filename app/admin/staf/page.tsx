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
import { STAF_KATEGORI, type StafItem } from '@/lib/staf-data';

/* eslint-disable @next/next/no-img-element */

type Draft = Omit<StafItem, 'id'> & { id: number | null };

const emptyDraft = (): Draft => ({
  id: null,
  nama: '',
  jabatan: '',
  kategori: 'Guru',
  foto: '',
  published: true,
});

export default function AdminStafPage() {
  const [items, setItems] = useState<StafItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [draft, setDraft] = useState<Draft | null>(null);
  const [saving, setSaving] = useState(false);
  const [err, setErr] = useState('');
  const [query, setQuery] = useState('');
  const [filter, setFilter] = useState<StatusFilter>('semua');

  // `loading` hanya untuk muat pertama; muat ulang setelah simpan berjalan di latar.
  const load = useCallback(async () => {
    try {
      const res = await fetch('/api/staf?all=1', { cache: 'no-store' });
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

  async function save(e: React.FormEvent) {
    e.preventDefault();
    if (!draft) return;
    setSaving(true);
    setErr('');
    try {
      const res = await fetch(draft.id ? `/api/staf/${draft.id}` : '/api/staf', {
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

  async function remove(s: StafItem) {
    if (!confirm(`Hapus "${s.nama}" dari daftar guru & staf?`)) return;
    const res = await fetch(`/api/staf/${s.id}`, { method: 'DELETE' });
    if (res.ok) {
      setItems((prev) => prev.filter((x) => x.id !== s.id));
      if (draft?.id === s.id) setDraft(null);
    } else {
      const data = await res.json().catch(() => ({}));
      alert(data.error || 'Gagal menghapus.');
    }
  }

  const { counts, shown } = filterItems(
    items,
    filter,
    query,
    (s) => `${s.nama} ${s.jabatan} ${s.kategori}`
  );

  return (
    <>
      <div className="adm-head">
        <div>
          <div className="adm-h1">Guru &amp; Staf</div>
          <div className="adm-sub">
            Data yang berstatus Tayang muncul di halaman /gurustaff, diurutkan per kategori lalu sesuai abjad nama.
          </div>
        </div>
        {!draft && (
          <button className="adm-btn" onClick={() => open(emptyDraft())}>
            <Plus size={16} /> Tambah guru/staf
          </button>
        )}
      </div>

      {draft ? (
        <FormCard
          title={draft.id ? 'Edit guru/staf' : 'Tambah guru/staf'}
          onClose={() => setDraft(null)}
          onSubmit={save}
          footer={
            <>
              <button className="adm-btn" type="submit" disabled={saving}>
                {saving ? 'Menyimpan…' : 'Simpan guru/staf'}
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
              Nama lengkap &amp; gelar <span className="req">*</span>
            </label>
            <input
              className="adm-input"
              placeholder="contoh : Salmah, S.Pd"
              value={draft.nama}
              onChange={(e) => setDraft({ ...draft, nama: e.target.value })}
              required
            />
          </div>

          <div className="adm-field">
            <label className="adm-label">Jabatan</label>
            <input
              className="adm-input"
              placeholder="contoh : Waka Kurikulum / Guru Matematika"
              value={draft.jabatan}
              onChange={(e) => setDraft({ ...draft, jabatan: e.target.value })}
            />
          </div>

          <div className="adm-row-2">
            <div className="adm-field">
              <label className="adm-label">Kategori</label>
              <select
                className="adm-select"
                value={draft.kategori}
                onChange={(e) => setDraft({ ...draft, kategori: e.target.value })}
              >
                {STAF_KATEGORI.map((k) => (
                  <option key={k} value={k}>
                    {k}
                  </option>
                ))}
              </select>
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
            <div className="adm-hint">
              Foto potret (tegak). JPG/PNG/WEBP maks 4 MB. Kosongkan untuk memakai inisial nama.
            </div>
          </div>
        </FormCard>
      ) : loading ? (
        <div className="adm-empty">Memuat…</div>
      ) : (
        <div className="adm-panel">
          <ListToolbar
            query={query}
            onQuery={setQuery}
            placeholder="Cari nama / jabatan…"
            filter={filter}
            onFilter={setFilter}
            counts={counts}
            shown={shown.length}
            noun="orang"
          />
          <table className="adm-table">
            <thead>
              <tr>
                <th>Nama</th>
                <th>Jabatan</th>
                <th>Kategori</th>
                <th>Status</th>
                <th />
              </tr>
            </thead>
            <tbody>
              {shown.length === 0 ? (
                <tr>
                  <td colSpan={5} className="adm-table-empty">
                    {items.length === 0 ? 'Belum ada data. Klik “Tambah guru/staf”.' : 'Tidak ada data yang cocok.'}
                  </td>
                </tr>
              ) : (
                shown.map((s) => (
                  <tr key={s.id}>
                    <td style={{ width: '34%' }}>
                      <div className="adm-cell-title">
                        {s.foto ? <img className="adm-thumb" src={s.foto} alt="" onError={(e) => (e.currentTarget.style.visibility = 'hidden')} /> : <div className="adm-thumb" />}
                        {s.nama}
                      </div>
                    </td>
                    <td data-label="Jabatan">{s.jabatan || <span className="adm-cell-muted">—</span>}</td>
                    <td data-label="Kategori">{s.kategori}</td>
                    <td>
                      <StatusPill published={s.published} />
                    </td>
                    <td>
                      <div className="adm-cell-actions">
                        <button className="adm-btn adm-btn-ghost adm-btn-sm" onClick={() => open({ ...s })}>
                          <Pencil size={14} /> Edit
                        </button>
                        <button className="adm-btn adm-btn-danger adm-btn-sm" onClick={() => remove(s)}>
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
