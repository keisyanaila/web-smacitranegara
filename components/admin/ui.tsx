'use client';

import { Search, X } from 'lucide-react';

// Potongan UI yang dipakai bersama oleh halaman-halaman admin.

export function Toggle({
  checked,
  onChange,
  label,
}: {
  checked: boolean;
  onChange: (v: boolean) => void;
  label: string;
}) {
  return (
    <label className="adm-switch">
      <input type="checkbox" checked={checked} onChange={(e) => onChange(e.target.checked)} />
      <span className="adm-switch-track" />
      {label}
    </label>
  );
}

export type StatusFilter = 'semua' | 'tayang' | 'draft';

/** Kotak cari + tab Semua/Tayang/Draft + jumlah hasil. */
export function ListToolbar({
  query,
  onQuery,
  placeholder,
  filter,
  onFilter,
  counts,
  shown,
  noun,
}: {
  query: string;
  onQuery: (v: string) => void;
  placeholder: string;
  filter: StatusFilter;
  onFilter: (v: StatusFilter) => void;
  counts: Record<StatusFilter, number>;
  shown: number;
  noun: string;
}) {
  const tabs: [StatusFilter, string][] = [
    ['semua', 'Semua'],
    ['tayang', 'Tayang'],
    ['draft', 'Draft'],
  ];
  return (
    <div className="adm-toolbar">
      <div className="adm-search">
        <Search size={15} />
        <input
          className="adm-input"
          placeholder={placeholder}
          value={query}
          onChange={(e) => onQuery(e.target.value)}
        />
      </div>
      <div className="adm-tabs" role="tablist">
        {tabs.map(([key, label]) => (
          <button
            key={key}
            type="button"
            role="tab"
            aria-selected={filter === key}
            className={filter === key ? 'active' : ''}
            onClick={() => onFilter(key)}
          >
            {label} ({counts[key]})
          </button>
        ))}
      </div>
      <div className="adm-toolbar-count">
        {shown} {noun}
      </div>
    </div>
  );
}

/** Hitung jumlah per status + saring item berdasarkan tab & kata kunci. */
export function filterItems<T extends { published: boolean }>(
  items: T[],
  filter: StatusFilter,
  query: string,
  text: (item: T) => string
) {
  const counts: Record<StatusFilter, number> = {
    semua: items.length,
    tayang: items.filter((i) => i.published).length,
    draft: items.filter((i) => !i.published).length,
  };
  const q = query.trim().toLowerCase();
  const shown = items.filter(
    (i) =>
      (filter === 'semua' || (filter === 'tayang') === i.published) &&
      (!q || text(i).toLowerCase().includes(q))
  );
  return { counts, shown };
}

export function StatusPill({ published }: { published: boolean }) {
  return (
    <span className={published ? 'adm-pill' : 'adm-pill adm-pill-off'}>
      {published ? 'Tayang' : 'Draft'}
    </span>
  );
}

/** Kartu form dengan judul + tombol tutup, isi, dan footer tombol yang menempel di bawah. */
export function FormCard({
  title,
  onClose,
  onSubmit,
  footer,
  children,
}: {
  title: string;
  onClose: () => void;
  onSubmit: (e: React.FormEvent) => void;
  footer: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <form className="adm-form-card" onSubmit={onSubmit}>
      <div className="adm-form-head">
        <h3>{title}</h3>
        <button type="button" className="adm-icon-btn" onClick={onClose} aria-label="Tutup">
          <X size={16} />
        </button>
      </div>
      <div className="adm-form-body adm-form">{children}</div>
      <div className="adm-form-foot">{footer}</div>
    </form>
  );
}

/** "9 Okt 2026" dari "2026-10-09". */
export function tanggalPendek(iso: string): string {
  const BLN = ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Agu', 'Sep', 'Okt', 'Nov', 'Des'];
  const [y, m, d] = iso.split('-').map(Number);
  if (!y || !m || !d) return iso;
  return `${d} ${BLN[m - 1]} ${y}`;
}
