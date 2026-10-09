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
  tanggalPendek,
  type StatusFilter,
} from '@/components/admin/ui';
import { BERITA_KATEGORI, PENULIS_DEFAULT } from '@/lib/berita';

/* eslint-disable @next/next/no-img-element */

type Berita = {
  id: number;
  slug: string;
  judul: string;
  tanggal: string;
  kategori: string;
  ringkasan: string;
  foto: string;
  konten: string[];
  penulis: string;
  published: boolean;
};

type Draft = {
  id: number | null;
  judul: string;
  slug: string;
  tanggal: string;
  kategori: string;
  penulis: string;
  ringkasan: string;
  konten: string;
  foto: string;
  published: boolean;
};

// Tanggal hari ini menurut zona waktu browser (bukan UTC).
const today = () => {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
};

const emptyDraft = (): Draft => ({
  id: null,
  judul: '',
  slug: '',
  tanggal: today(),
  kategori: 'Kegiatan',
  penulis: PENULIS_DEFAULT,
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
  const [query, setQuery] = useState('');
  const [filter, setFilter] = useState<StatusFilter>('semua');

  // `loading` hanya untuk muat pertama; muat ulang setelah simpan berjalan di latar.
  const load = useCallback(async () => {
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

  function open(d: Draft) {
    setErr('');
    setDraft(d);
    window.scrollTo({ top: 0 });
  }

  function startEdit(b: Berita) {
    open({
      id: b.id,
      judul: b.judul,
      slug: b.slug,
      tanggal: b.tanggal,
      kategori: b.kategori,
      penulis: b.penulis,
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
      const res = await fetch(draft.id ? `/api/berita/${draft.id}` : '/api/berita', {
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

  const { counts, shown } = filterItems(
    items,
    filter,
    query,
    (b) => `${b.judul} ${b.kategori} ${b.ringkasan} ${b.penulis}`
  );

  return (
    <>
      <div className="adm-head">
        <div>
          <div className="adm-h1">Berita</div>
          <div className="adm-sub">Berita yang berstatus Tayang muncul di halaman /berita, terbaru di atas.</div>
        </div>
        {!draft && (
          <button className="adm-btn" onClick={() => open(emptyDraft())}>
            <Plus size={16} /> Tambah berita
          </button>
        )}
      </div>

      {draft ? (
        <FormCard
          title={draft.id ? 'Edit berita' : 'Tambah berita'}
          onClose={() => setDraft(null)}
          onSubmit={save}
          footer={
            <>
              <button className="adm-btn" type="submit" disabled={saving}>
                {saving ? 'Menyimpan…' : 'Simpan berita'}
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
              Judul <span className="req">*</span>
            </label>
            <input
              className="adm-input"
              value={draft.judul}
              onChange={(e) => setDraft({ ...draft, judul: e.target.value })}
              required
            />
          </div>

          <div className="adm-field">
            <label className="adm-label">Slug (URL)</label>
            <input
              className="adm-input"
              value={draft.slug}
              onChange={(e) => setDraft({ ...draft, slug: e.target.value })}
            />
            <div className="adm-hint">
              Kosongkan untuk dibuat otomatis dari judul. Contoh: juara-lomba-2027
            </div>
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

          <div className="adm-row-2">
            <div className="adm-field">
              <label className="adm-label">Penulis</label>
              <input
                className="adm-input"
                value={draft.penulis}
                onChange={(e) => setDraft({ ...draft, penulis: e.target.value })}
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
            <label className="adm-label">Gambar</label>
            <ImageInput
              value={draft.foto}
              onChange={(v) => setDraft({ ...draft, foto: v })}
              hint="Disarankan rasio 16:9."
            />
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
        </FormCard>
      ) : loading ? (
        <div className="adm-empty">Memuat…</div>
      ) : (
        <div className="adm-panel">
          <ListToolbar
            query={query}
            onQuery={setQuery}
            placeholder="Cari berita…"
            filter={filter}
            onFilter={setFilter}
            counts={counts}
            shown={shown.length}
            noun="berita"
          />
          <table className="adm-table">
            <thead>
              <tr>
                <th>Judul</th>
                <th>Kategori</th>
                <th>Tanggal</th>
                <th>Status</th>
                <th />
              </tr>
            </thead>
            <tbody>
              {shown.length === 0 ? (
                <tr>
                  <td colSpan={5} className="adm-table-empty">
                    {items.length === 0 ? 'Belum ada berita. Klik “Tambah berita”.' : 'Tidak ada berita yang cocok.'}
                  </td>
                </tr>
              ) : (
                shown.map((b) => (
                  <tr key={b.id}>
                    <td>
                      <div className="adm-cell-title">
                        {b.foto ? <img className="adm-thumb" src={b.foto} alt="" onError={(e) => (e.currentTarget.style.visibility = 'hidden')} /> : <div className="adm-thumb" />}
                        {b.judul}
                      </div>
                    </td>
                    <td data-label="Kategori">{b.kategori}</td>
                    <td data-label="Tanggal" style={{ whiteSpace: 'nowrap' }}>{tanggalPendek(b.tanggal)}</td>
                    <td>
                      <StatusPill published={b.published} />
                    </td>
                    <td>
                      <div className="adm-cell-actions">
                        <button className="adm-btn adm-btn-ghost adm-btn-sm" onClick={() => startEdit(b)}>
                          <Pencil size={14} /> Edit
                        </button>
                        <button className="adm-btn adm-btn-danger adm-btn-sm" onClick={() => remove(b)}>
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
