import Link from 'next/link';
import { AlertTriangle, CalendarDays, CheckCircle2, Newspaper, Trophy, Users, XCircle } from 'lucide-react';
import { cekSistem } from '@/lib/admin-status';
import { getBeritaList } from '@/lib/berita';
import { getPrestasiList } from '@/lib/prestasi';
import { getStafList } from '@/lib/staf';
import { getSpmbSetting } from '@/lib/spmb-db';
import { ringkasanGelombang } from '@/lib/spmb';

export const dynamic = 'force-dynamic';

export const metadata = { title: 'Dashboard — Admin SMA Citra Negara' };

async function hitung<T extends { published: boolean }>(load: () => Promise<T[]>) {
  try {
    const list = await load();
    return { total: list.length, draft: list.filter((i) => !i.published).length };
  } catch {
    return null; // tabel belum ada / DB error — detailnya tampil di status sistem
  }
}

export default async function DashboardPage() {
  const [status, berita, prestasi, staf, spmb] = await Promise.all([
    cekSistem(),
    hitung(() => getBeritaList({ includeUnpublished: true })),
    hitung(() => getPrestasiList({ includeUnpublished: true })),
    hitung(() => getStafList({ includeUnpublished: true })),
    getSpmbSetting(),
  ]);

  return (
    <>
      <div className="adm-head">
        <div>
          <div className="adm-h1">Dashboard</div>
          <div className="adm-sub">Kelola konten situs SMA Citra Negara dari sini.</div>
        </div>
      </div>

      <details className={`adm-status ${status.siap ? '' : 'bad'}`} open={!status.siap}>
        <summary>
          {status.siap ? <CheckCircle2 size={18} /> : <AlertTriangle size={18} />}
          {status.ringkasan}
          <span className="adm-status-more">Lihat detail</span>
        </summary>
        <ul>
          {status.detail.map((c) => (
            <li key={c.label}>
              {c.ok ? <CheckCircle2 size={15} color="#15803d" /> : <XCircle size={15} color="#dc2626" />}
              <div>
                {c.label}
                {!c.ok && c.hint && <span>{c.hint}</span>}
              </div>
            </li>
          ))}
        </ul>
      </details>

      <div className="adm-card-grid">
        <Link href="/admin/berita" className="adm-stat">
          <div className="adm-stat-icon"><Newspaper size={19} /></div>
          <h3>Berita</h3>
          <div className="adm-stat-num">
            {berita ? berita.total : '–'}
            <small>berita{berita && berita.draft > 0 ? ` · ${berita.draft} draft` : ''}</small>
          </div>
          <p>Tambah, edit, dan hapus berita yang tampil di halaman /berita.</p>
          <span className="adm-stat-link">Kelola berita →</span>
        </Link>

        <Link href="/admin/prestasi" className="adm-stat">
          <div className="adm-stat-icon"><Trophy size={19} /></div>
          <h3>Prestasi</h3>
          <div className="adm-stat-num">
            {prestasi ? prestasi.total : '–'}
            <small>prestasi{prestasi && prestasi.draft > 0 ? ` · ${prestasi.draft} draft` : ''}</small>
          </div>
          <p>Kelola daftar prestasi yang tampil di halaman /prestasi.</p>
          <span className="adm-stat-link">Kelola prestasi →</span>
        </Link>

        <Link href="/admin/staf" className="adm-stat">
          <div className="adm-stat-icon"><Users size={19} /></div>
          <h3>Guru &amp; Staf</h3>
          <div className="adm-stat-num">
            {staf ? staf.total : '–'}
            <small>orang{staf && staf.draft > 0 ? ` · ${staf.draft} draft` : ''}</small>
          </div>
          <p>Kelola nama, jabatan, dan foto yang tampil di halaman Guru &amp; Staf.</p>
          <span className="adm-stat-link">Kelola guru &amp; staf →</span>
        </Link>

        <Link href="/admin/spmb" className="adm-stat">
          <div className="adm-stat-icon"><CalendarDays size={19} /></div>
          <h3>Jadwal SPMB</h3>
          <div className="adm-stat-num">
            {spmb.tahunAjaran}
            <small>{ringkasanGelombang(spmb.gelombang, new Date())}</small>
          </div>
          <p>Atur tahun ajaran dan tanggal gelombang pendaftaran yang tampil di Beranda.</p>
          <span className="adm-stat-link">Atur jadwal →</span>
        </Link>
      </div>
    </>
  );
}
