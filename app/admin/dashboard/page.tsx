import Link from 'next/link';

export const metadata = { title: 'Dashboard — Admin SMA Citra Negara' };

export default function DashboardPage() {
  return (
    <>
      <div className="adm-head">
        <div>
          <div className="adm-h1">Dashboard</div>
          <div className="adm-sub">Kelola isi website SMA Citra Negara.</div>
        </div>
      </div>

      <div className="adm-card-grid">
        <Link href="/admin/berita" className="adm-card">
          <h3>Berita</h3>
          <p>Tambah, edit, dan hapus berita yang tampil di halaman /berita.</p>
        </Link>
        <Link href="/admin/prestasi" className="adm-card">
          <h3>Prestasi</h3>
          <p>Kelola daftar prestasi yang tampil di halaman /prestasi.</p>
        </Link>
      </div>
    </>
  );
}
