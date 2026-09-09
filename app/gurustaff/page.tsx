'use client';
import { useMemo, useState } from 'react';
import Image from 'next/image';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { Search, X, Users } from 'lucide-react';

/* ══════════════════════════════════════════
   DATA STAF
   Isi "foto" dengan path file di /public/images/staf/, mis. "/images/staf/dedi-suandi.jpg"
   Kosongkan / hapus baris "foto" kalau belum ada fotonya — otomatis pakai avatar inisial.
══════════════════════════════════════════ */
type Staf = { nama: string; jabatan: string; kategori: string; foto?: string };

const STAF: Staf[] = [
  { nama: 'Ahmad Taufik, S.Kom', jabatan: 'Kepala Sekolah', kategori: 'Pimpinan', foto: '/images/kepseksma.jpg' },
  { nama: 'Drs. Dedi Suandi, M.Pd', jabatan: 'Waka Kurikulum', kategori: 'Kurikulum', foto: '/images/dedi.jpg' },
  { nama: 'Febia Maulina, S.Pd', jabatan: 'Kepala Lab IPA', kategori: 'Kurikulum', foto: '/images/febia.jpg' },
  { nama: 'Magreza Wahyu I, S.T', jabatan: 'Kepala Lab Komputer', kategori: 'Kurikulum', foto: '/images/kosong.jpg' },
  { nama: 'Andri Prihadi, S.T', jabatan: 'Waka Kesiswaan', kategori: 'Kesiswaan', foto: '/images/kosong.jpg' },
  { nama: 'Sylviana, SE, S.Sos, M.Pd.I', jabatan: 'Pembina OSIS', kategori: 'Kesiswaan', foto: '/images/kosong.jpg' },
  { nama: 'Samsul Bahri, S.Pd', jabatan: 'Pembina IRMA', kategori: 'Kesiswaan', foto: '/images/samsul.jpg' },
  { nama: 'Annisa Larasati, Sos', jabatan: 'Pembina NAKAMA', kategori: 'Kesiswaan', foto: '/images/annisa.jpg' },
  { nama: 'Balqis Ananda Safitri, S.Pd', jabatan: 'Guru BK', kategori: 'Kesiswaan', foto: '/images/kosong.jpg' },
  { nama: 'Riki Yakub, S.Kom', jabatan: 'Waka Sapras', kategori: 'Sapras', foto: '/images/kosong.jpg' },
  { nama: 'Riza Febriansyah', jabatan: 'Office Boy', kategori: 'Sapras', foto: '/images/kosong.jpg' },
  { nama: 'Haris Isyanto', jabatan: 'Security', kategori: 'Sapras', foto: '/images/kosong.jpg' },
  { nama: 'Ir. Lukman Kharis, M.Pd', jabatan: 'Waka Humas', kategori: 'Humas', foto: '/images/kosong.jpg' },
  { nama: 'Decky Ryansyah, M.Kom', jabatan: 'Kepala IT', kategori: 'IT', foto: '/images/kosong.jpg' },
  { nama: 'Ilham Nur Fajril', jabatan: 'Teknisi', kategori: 'IT', foto: '/images/kosong.jpg' },
  { nama: 'Nindi Tiarawati, S.Pd', jabatan: 'Kepala Tata Usaha', kategori: 'Tata Usaha', foto: '/images/kosong.jpg' },
  { nama: 'Syafangatul Karim, S.Pd', jabatan: 'Bendahara', kategori: 'Tata Usaha', foto: '/images/kosong.jpg' },
  { nama: 'Lia Lestari', jabatan: 'Sekretaris Tata Usaha', kategori: 'Tata Usaha', foto: '/images/kosong.jpg' },
];

const WARNA_KATEGORI: Record<string, string> = {
  Pimpinan: '#0A1628',
  Kurikulum: '#C8973A',
  Kesiswaan: '#17713b',
  Sapras: '#8a5a2b',
  Humas: '#0A1628',
  IT: '#17713b',
  'Tata Usaha': '#C8973A',
};

const KATEGORI_LIST = ['Semua', ...Array.from(new Set(STAF.map(s => s.kategori)))];

function getInisial(nama: string) {
  const kata = nama.split(' ').filter(w => w.length > 1 && !w.includes('.'));
  const dipakai = kata.length >= 2 ? kata.slice(0, 2) : nama.split(' ').slice(0, 2);
  return dipakai.map(w => w[0]).join('').toUpperCase();
}

function StafCard({ staf }: { staf: Staf }) {
  const warna = WARNA_KATEGORI[staf.kategori] ?? '#C8973A';
  const [gagalMuat, setGagalMuat] = useState(false);
  const tampilkanFoto = !!staf.foto && !gagalMuat;

  return (
    <div className="staf-card" style={{ ['--aksen' as string]: warna }}>
      <div className="staf-avatar-wrap">
        {tampilkanFoto ? (
          <Image
            src={staf.foto as string}
            alt={staf.nama}
            fill
            sizes="(max-width: 640px) 45vw, 190px"
            className="staf-foto"
            onError={() => setGagalMuat(true)}
          />
        ) : (
          <div className="staf-avatar">{getInisial(staf.nama)}</div>
        )}
        <div className="staf-avatar-ring" />
      </div>
      <div className="staf-nama">{staf.nama}</div>
      <div className="staf-jabatan">{staf.jabatan}</div>
      <div className="staf-kategori-pill">{staf.kategori}</div>
    </div>
  );
}

/* ══════════════════════════════════════════
   HALAMAN STAF
══════════════════════════════════════════ */
export default function StafPage() {
  const [kategoriAktif, setKategoriAktif] = useState('Semua');
  const [query, setQuery] = useState('');

  const hasil = useMemo(() => {
    return STAF.filter(s => {
      const cocokKategori = kategoriAktif === 'Semua' || s.kategori === kategoriAktif;
      const cocokQuery = s.nama.toLowerCase().includes(query.trim().toLowerCase());
      return cocokKategori && cocokQuery;
    });
  }, [kategoriAktif, query]);

  return (
    <>
      <Navbar />
      <main>
        {/* Hero */}
        <section className="hero-gradient staf-hero">
          <div className="staf-hero-inner">
            <div className="staf-hero-icon"><Users size={22} color="#E8B84B" /></div>
            <h1 className="font-display staf-hero-title">Tim & Staf Sekolah</h1>
            <p className="staf-hero-desc">
              Mengenal para pendidik dan tenaga kependidikan yang mendampingi perjalanan belajar siswa/i SMA Citra Negara.
            </p>
          </div>
        </section>

        {/* Filter & Search */}
        <section className="staf-toolbar-section">
          <div className="staf-toolbar">
            <div className="staf-chips">
              {KATEGORI_LIST.map(k => (
                <button
                  key={k}
                  type="button"
                  className={`staf-chip ${kategoriAktif === k ? 'staf-chip-aktif' : ''}`}
                  onClick={() => setKategoriAktif(k)}
                >
                  {k}
                </button>
              ))}
            </div>
            <div className="staf-search">
              <Search size={16} color="#9CA3AF" />
              <input
                type="text"
                placeholder="Cari nama staf..."
                value={query}
                onChange={e => setQuery(e.target.value)}
              />
              {query && (
                <button type="button" aria-label="Bersihkan pencarian" onClick={() => setQuery('')} className="staf-search-clear">
                  <X size={15} color="#9CA3AF" />
                </button>
              )}
            </div>
          </div>
          <div className="staf-count">
            Menampilkan <strong>{hasil.length}</strong> dari {STAF.length} staf
          </div>
        </section>

        {/* Grid */}
        <section className="staf-grid-section">
          {hasil.length > 0 ? (
            <div className="staf-grid">
              {hasil.map((s, i) => <StafCard key={i} staf={s} />)}
            </div>
          ) : (
            <div className="staf-empty">
              <Users size={32} color="#D1CBBB" />
              <p>Tidak ada staf dengan nama &ldquo;{query}&rdquo;{kategoriAktif !== 'Semua' ? ` di bidang ${kategoriAktif}` : ''}.</p>
            </div>
          )}
        </section>

        <style jsx global>{`
          .staf-hero { padding: 72px 24px 56px; }
          .staf-hero-inner { max-width: 640px; margin: 0 auto; text-align: center; }
          .staf-hero-icon {
            width: 48px; height: 48px; border-radius: 14px;
            background: rgba(232,184,75,0.15); border: 1px solid rgba(232,184,75,0.3);
            display: flex; align-items: center; justify-content: center; margin: 0 auto 20px;
          }
          .staf-hero-title { font-size: 40px; color: white; margin-bottom: 14px; }
          .staf-hero-desc { color: rgba(255,255,255,0.7); font-size: 15.5px; line-height: 1.7; }

          .staf-toolbar-section {
            padding: 32px 24px 0; max-width: 1100px; margin: 0 auto;
          }
          .staf-toolbar {
            display: flex; align-items: center; justify-content: space-between; gap: 16px;
            flex-wrap: wrap; padding-bottom: 20px; border-bottom: 1px solid #F0EBE0;
          }
          .staf-chips { display: flex; gap: 8px; flex-wrap: wrap; }
          .staf-chip {
            border: 1.5px solid #EDE6D6; background: white; color: #6B7280;
            font-size: 12.5px; font-weight: 600; padding: 8px 16px; border-radius: 20px;
            cursor: pointer; transition: all 0.18s; -webkit-tap-highlight-color: transparent;
          }
          .staf-chip:hover { border-color: #C8973A; color: #0A1628; }
          .staf-chip-aktif { background: #0A1628; border-color: #0A1628; color: #E8B84B; }

          .staf-search {
            display: flex; align-items: center; gap: 8px;
            border: 1.5px solid #EDE6D6; border-radius: 20px; padding: 8px 14px;
            min-width: 220px; flex: 1; max-width: 280px;
          }
          .staf-search input {
            border: none; outline: none; font-size: 13px; color: #0A1628; flex: 1; background: transparent;
          }
          .staf-search input::placeholder { color: #9CA3AF; }
          .staf-search-clear { background: none; border: none; cursor: pointer; padding: 2px; display: flex; }

          .staf-count { font-size: 12.5px; color: #9CA3AF; margin-top: 14px; }

          .staf-grid-section { max-width: 1100px; margin: 0 auto; padding: 32px 24px 100px; }
          .staf-grid {
            display: grid; grid-template-columns: repeat(auto-fill, minmax(min(190px, 100%), 1fr));
            gap: 20px;
          }

          .staf-empty {
            text-align: center; padding: 60px 20px; color: #9CA3AF; font-size: 14px;
            display: flex; flex-direction: column; align-items: center; gap: 12px;
          }

          .staf-card {
            background: white; border: 1.5px solid #F0EBE0; border-radius: 16px;
            padding: 24px 16px 18px; text-align: center;
            transition: transform 0.22s ease, box-shadow 0.22s ease, border-color 0.22s ease;
            position: relative; overflow: hidden;
          }
          .staf-card::before {
            content: ''; position: absolute; top: 0; left: 0; right: 0; height: 4px;
            background: var(--aksen); transform: scaleX(0); transform-origin: left;
            transition: transform 0.25s ease;
          }
          .staf-card:hover { transform: translateY(-5px); box-shadow: 0 14px 30px rgba(10,22,40,0.10); border-color: transparent; }
          .staf-card:hover::before { transform: scaleX(1); }

          .staf-avatar-wrap { position: relative; width: 100%; aspect-ratio: 1 / 1; margin: 0 auto 16px; border-radius: 14px; overflow: hidden; }
          .staf-foto { object-fit: cover; }
          .staf-avatar {
            width: 100%; height: 100%; border-radius: 14px;
            background: linear-gradient(135deg, var(--aksen), #E8B84B);
            color: white; font-weight: 700; font-size: 32px;
            display: flex; align-items: center; justify-content: center;
            position: relative; z-index: 1;
          }
          .staf-avatar-ring {
            position: absolute; inset: -5px; border-radius: 16px;
            border: 1.5px solid var(--aksen); opacity: 0;
            transition: opacity 0.22s ease, inset 0.22s ease; pointer-events: none;
          }
          .staf-card:hover .staf-avatar-ring { opacity: 0.5; inset: -8px; }

          .staf-nama { font-size: 13.5px; font-weight: 700; color: #0A1628; line-height: 1.35; margin-bottom: 4px; }
          .staf-jabatan { font-size: 12px; color: #6B7280; margin-bottom: 12px; }
          .staf-kategori-pill {
            display: inline-block; font-size: 10px; font-weight: 700; letter-spacing: 0.5px;
            color: var(--aksen); background: color-mix(in srgb, var(--aksen) 12%, white);
            padding: 4px 10px; border-radius: 20px;
          }

          @media (max-width: 640px) {
            .staf-hero { padding: 56px 20px 44px; }
            .staf-hero-title { font-size: 30px; }
            .staf-toolbar { flex-direction: column; align-items: stretch; }
            .staf-search { max-width: 100%; }
            .staf-grid { grid-template-columns: repeat(2, 1fr); gap: 14px; }
          }
        `}</style>
      </main>
      <Footer />
    </>
  );
}