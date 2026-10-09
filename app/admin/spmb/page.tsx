'use client';

import { useEffect, useState } from 'react';
import { Plus, Trash2 } from 'lucide-react';
import {
  MAX_GELOMBANG,
  STATUS_GELOMBANG_LABEL,
  statusGelombang,
  type Gelombang,
  type SpmbSetting,
} from '@/lib/spmb';

const PILL: Record<string, string> = {
  berjalan: 'adm-pill',
  akan: 'adm-pill adm-pill-off',
  selesai: 'adm-pill adm-pill-gold',
};

/** "2026-10-09 06:54" dalam zona waktu browser. */
function waktuLokal(iso: string) {
  const d = new Date(iso);
  const p = (n: number) => String(n).padStart(2, '0');
  return `${d.getFullYear()}-${p(d.getMonth() + 1)}-${p(d.getDate())} ${p(d.getHours())}:${p(d.getMinutes())}`;
}

export default function AdminSpmbPage() {
  const [saved, setSaved] = useState<SpmbSetting | null>(null);
  const [draft, setDraft] = useState<SpmbSetting | null>(null);
  const [updatedAt, setUpdatedAt] = useState<string | null>(null);
  const [now, setNow] = useState<Date | null>(null);
  const [saving, setSaving] = useState(false);
  const [err, setErr] = useState('');
  const [ok, setOk] = useState('');

  useEffect(() => {
    fetch('/api/spmb', { cache: 'no-store' })
      .then((res) => res.json())
      .then((data) => {
        setSaved(data.setting);
        setDraft(data.setting);
        setUpdatedAt(data.updatedAt ?? null);
        setNow(new Date());
      })
      .catch(() => setErr('Gagal memuat pengaturan.'));
  }, []);

  const dirty = JSON.stringify(saved) !== JSON.stringify(draft);

  function update(patch: Partial<SpmbSetting>) {
    if (!draft) return;
    setOk('');
    setDraft({ ...draft, ...patch });
  }

  function setGel(i: number, patch: Partial<Gelombang>) {
    if (!draft) return;
    update({ gelombang: draft.gelombang.map((g, idx) => (idx === i ? { ...g, ...patch } : g)) });
  }

  function addGel() {
    if (!draft) return;
    // Usulkan mulai = selesai gelombang terakhir (boleh bersambung di hari yang sama).
    const last = draft.gelombang[draft.gelombang.length - 1];
    update({
      gelombang: [
        ...draft.gelombang,
        { nama: `Gelombang ${draft.gelombang.length + 1}`, mulai: last?.selesai ?? '', selesai: '' },
      ],
    });
  }

  /** Geser semua periode 1 tahun ke depan — praktis saat ganti tahun ajaran. */
  function shiftYear() {
    if (!draft) return;
    const bump = (iso: string) => {
      if (!/^\d{4}-\d{2}-\d{2}$/.test(iso)) return iso;
      const [y, m, d] = iso.split('-').map(Number);
      // 29 Feb → 28 Feb kalau tahun berikutnya bukan kabisat
      const last = new Date(Date.UTC(y + 1, m, 0)).getUTCDate();
      return `${y + 1}-${String(m).padStart(2, '0')}-${String(Math.min(d, last)).padStart(2, '0')}`;
    };
    const ta = /^(\d{4})\/(\d{4})$/.exec(draft.tahunAjaran.trim());
    update({
      tahunAjaran: ta ? `${Number(ta[1]) + 1}/${Number(ta[2]) + 1}` : draft.tahunAjaran,
      gelombang: draft.gelombang.map((g) => ({ ...g, mulai: bump(g.mulai), selesai: bump(g.selesai) })),
    });
  }

  async function save(e: React.FormEvent) {
    e.preventDefault();
    if (!draft) return;
    setSaving(true);
    setErr('');
    setOk('');
    try {
      const res = await fetch('/api/spmb', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(draft),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setErr(data.error || 'Gagal menyimpan.');
        return;
      }
      setSaved(data.setting);
      setDraft(data.setting);
      setUpdatedAt(data.updatedAt ?? null);
      setNow(new Date());
      setOk('Tersimpan. Beranda sudah memakai jadwal baru.');
    } catch {
      setErr('Terjadi kesalahan jaringan.');
    } finally {
      setSaving(false);
    }
  }

  return (
    <>
      <div className="adm-head">
        <div>
          <div className="adm-h1">Jadwal SPMB</div>
          <div className="adm-sub">
            Tahun ajaran & gelombang ini tampil di Beranda (kartu “Jadwal SPMB”).
          </div>
        </div>
      </div>

      {!draft ? (
        <div className="adm-empty">{err || 'Memuat…'}</div>
      ) : (
        <form className="adm-card adm-form" onSubmit={save}>
          <div className="adm-sub" style={{ marginTop: 0 }}>
            {updatedAt ? `Terakhir disimpan: ${waktuLokal(updatedAt)}. ` : 'Belum pernah disimpan — ini jadwal bawaan. '}
            Status (Selesai / Sedang Berlangsung / Akan Datang) dihitung otomatis dari tanggal hari ini.
          </div>

          {err && <div className="adm-alert adm-alert-err">{err}</div>}
          {ok && <div className="adm-alert adm-alert-ok">{ok}</div>}

          <div className="adm-field">
            <label className="adm-label">
              Tahun ajaran <span className="req">*</span>
            </label>
            <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
              <input
                className="adm-input"
                style={{ maxWidth: 220 }}
                placeholder="2027/2028"
                value={draft.tahunAjaran}
                onChange={(e) => update({ tahunAjaran: e.target.value })}
                required
              />
              <button type="button" className="adm-btn adm-btn-ghost" onClick={shiftYear}>
                Geser semua +1 tahun
              </button>
            </div>
            <div className="adm-hint">
              Format: 2027/2028. “Geser semua +1 tahun” menaikkan tahun ajaran sekaligus semua tanggal
              gelombang (belum tersimpan sampai klik Simpan).
            </div>
          </div>

          <div className="adm-field">
            <label className="adm-label">
              Gelombang pendaftaran <span className="req">*</span>
            </label>
            <div className="adm-gel">
              <table className="adm-table">
                <thead>
                  <tr>
                    <th>Nama</th>
                    <th>Mulai</th>
                    <th>Selesai</th>
                    <th>Status</th>
                    <th />
                  </tr>
                </thead>
                <tbody>
                  {draft.gelombang.map((g, i) => {
                    const st = now ? statusGelombang(g, now) : null;
                    return (
                      <tr key={i}>
                        <td data-label="Nama">
                          <input
                            className="adm-input"
                            placeholder={`Gelombang ${i + 1}`}
                            value={g.nama}
                            onChange={(e) => setGel(i, { nama: e.target.value })}
                          />
                        </td>
                        <td data-label="Mulai">
                          <input
                            className="adm-input"
                            type="date"
                            value={g.mulai}
                            onChange={(e) => setGel(i, { mulai: e.target.value })}
                            required
                          />
                        </td>
                        <td data-label="Selesai">
                          <input
                            className="adm-input"
                            type="date"
                            value={g.selesai}
                            min={g.mulai || undefined}
                            onChange={(e) => setGel(i, { selesai: e.target.value })}
                            required
                          />
                        </td>
                        <td>
                          {st ? (
                            <span className={PILL[st]}>{STATUS_GELOMBANG_LABEL[st]}</span>
                          ) : (
                            <span className="adm-cell-muted">—</span>
                          )}
                        </td>
                        <td>
                          <div className="adm-cell-actions">
                            <button
                              type="button"
                              className="adm-btn adm-btn-danger adm-btn-sm"
                              disabled={draft.gelombang.length <= 1}
                              onClick={() => update({ gelombang: draft.gelombang.filter((_, idx) => idx !== i) })}
                            >
                              <Trash2 size={14} /> Hapus
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
            {draft.gelombang.length < MAX_GELOMBANG && (
              <button
                type="button"
                className="adm-btn adm-btn-ghost"
                style={{ alignSelf: 'flex-start', marginTop: 4 }}
                onClick={addGel}
              >
                <Plus size={15} /> Tambah gelombang
              </button>
            )}
            <div className="adm-hint">
              Urutan gelombang otomatis mengikuti tanggal mulai setelah disimpan. Gelombang boleh
              bersambung di hari yang sama, tapi tidak boleh tumpang tindih.
            </div>
          </div>

          <div className="adm-form-actions" style={{ display: 'flex', gap: 10 }}>
            <button className="adm-btn" type="submit" disabled={saving || !dirty}>
              {saving ? 'Menyimpan…' : 'Simpan'}
            </button>
            <button
              type="button"
              className="adm-btn adm-btn-ghost"
              disabled={!dirty || saving}
              onClick={() => {
                setDraft(saved);
                setErr('');
              }}
            >
              Batalkan perubahan
            </button>
          </div>
        </form>
      )}
    </>
  );
}
