'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { CheckCircle, FileText, Calendar, AlertCircle, ChevronRight, Clock } from 'lucide-react';

const TAHUN_AJARAN = '2027/2028';

/**
 * Jadwal SPMB — 3 gelombang. Status tiap gelombang ("SEGERA / DIBUKA / DITUTUP")
 * dihitung otomatis dari tanggal hari ini, tidak perlu diubah manual tiap periode.
 * Kalau mau geser periode, cukup ubah `mulai`, `selesai`, dan `tgl` di bawah.
 */
const GELOMBANG = [
  {
    nama: 'Gelombang 1',
    mulai: '2026-09-01',
    selesai: '2026-11-30',
    tgl: '1 September – 30 November 2026',
  },
  {
    nama: 'Gelombang 2',
    mulai: '2026-12-01',
    selesai: '2027-02-28',
    tgl: '1 Desember 2026 – 28 Februari 2027',
  },
  {
    nama: 'Gelombang 3',
    mulai: '2027-03-01',
    selesai: '2027-06-30',
    tgl: '1 Maret – 30 Juni 2027',
  },
];

type GelombangStatus = 'upcoming' | 'buka' | 'selesai';

const STATUS_LABEL: Record<GelombangStatus, string> = {
  upcoming: 'SEGERA',
  buka: 'DIBUKA',
  selesai: 'DITUTUP',
};

function getGelombangStatus(mulai: string, selesai: string, now: Date): GelombangStatus {
  const start = new Date(mulai + 'T00:00:00');
  const end = new Date(selesai + 'T23:59:59');
  if (now > end) return 'selesai';
  if (now >= start) return 'buka';
  return 'upcoming';
}

const DAY_MS = 86_400_000;
const daysUntil = (target: Date, now: Date) =>
  Math.max(0, Math.ceil((target.getTime() - now.getTime()) / DAY_MS));

/** Persentase progres periode gelombang (0–100) untuk progress bar. */
function gelombangProgress(mulai: string, selesai: string, now: Date) {
  const start = new Date(mulai + 'T00:00:00').getTime();
  const end = new Date(selesai + 'T23:59:59').getTime();
  const pct = ((now.getTime() - start) / (end - start)) * 100;
  return Math.min(100, Math.max(0, pct));
}

const PERSYARATAN = [
  'Ijazah/SKHUN SMP/MTs (fotokopi)',
  'Kartu Keluarga (fotokopi)',
  'Akte Kelahiran (fotokopi)',
  'KTP orang tua/wali (fotokopi)',
  'Pas foto 3×4 berwarna (3 lembar)',
  'Surat keterangan sehat dari dokter',
  'Surat Keterangan Tidak Buta Warna (khusus jurusan TJKT, PPLG, dan DKV)',
];

const ALUR = [
  { no: 1, title: 'Buat Akun', desc: 'Daftarkan email Anda untuk membuat akun SPMB Online' },
  { no: 2, title: 'Isi Formulir', desc: 'Lengkapi data pribadi, data orang tua, dan pilih jurusan' },
  { no: 3, title: 'Upload Berkas', desc: 'Upload dokumen persyaratan dalam format PDF/JPG' },
  { no: 4, title: 'Submit', desc: 'Kirim formulir dan tunggu verifikasi dari admin sekolah' },
  { no: 5, title: 'Verifikasi', desc: 'Admin akan memverifikasi data dan berkas Anda' },
  { no: 6, title: 'Pengumuman', desc: 'Cek status penerimaan di dashboard akun Anda' },
];

export default function SPMBPage() {
  // Dihitung di client supaya status selalu sinkron dengan tanggal saat halaman dibuka.
  const [now, setNow] = useState<Date | null>(null);
  useEffect(() => {
    setNow(new Date());
    const id = setInterval(() => setNow(new Date()), 60 * 1000);
    return () => clearInterval(id);
  }, []);

  return (
    <>
      <Navbar />
      <main>
        {/* Hero */}
        <section className="hero-gradient" style={{ padding: '80px 24px' }}>
          <div style={{ maxWidth: 800, margin: '0 auto', textAlign: 'center' }}>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: 'rgba(200,151,58,0.15)', border: '1px solid rgba(200,151,58,0.3)', borderRadius: 20, padding: '6px 16px', color: '#E8B84B', fontSize: 12, fontWeight: 600, marginBottom: 20 }}>
              SPMB 2027/2028 
            </div>
            <h1 className="font-display" style={{ fontSize: 48, color: 'white', marginBottom: 16 }}>
              Sistem Penerimaan<br />Peserta Didik Baru
            </h1>
            <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: 17, lineHeight: 1.7, marginBottom: 36, maxWidth: 560, margin: '0 auto 36px' }}>
              Pendaftaran online SMA Citra Negara tahun ajaran 2027/2028 
              Proses mudah, transparan, dan dapat dipantau secara real-time.
            </p>
            <div style={{ display: 'flex', gap: 16, justifyContent: 'center', flexWrap: 'wrap' }}>
              <Link href="/register" className="btn-primary" style={{ fontSize: 16 }}>Daftar Sekarang</Link>
              <Link href="/login" className="btn-outline" style={{ fontSize: 16 }}>Sudah Punya Akun</Link>
            </div>
          </div>
        </section>

        {/* Jadwal — 3 gelombang, status otomatis mengikuti tanggal */}
        <section className="jadwal-section">
          <div className="jadwal-inner">
            <div className="jadwal-head">
              <div className="gold-line" style={{ margin: '0 auto 16px' }} />
              <h2 className="font-display jadwal-title">Jadwal Pendaftaran</h2>
              <p className="jadwal-sub">
                3 gelombang, tahun ajaran {TAHUN_AJARAN}
              </p>
              <span className="jadwal-live">
                <span className="jadwal-live-dot" />
                Status diperbarui otomatis mengikuti tanggal
              </span>
            </div>

            <div className="gel-grid">
              {GELOMBANG.map((g, i) => {
                const status: GelombangStatus = now
                  ? getGelombangStatus(g.mulai, g.selesai, now)
                  : 'upcoming';
                const isOpen = status === 'buka';
                const isDone = status === 'selesai';
                const progress = now ? gelombangProgress(g.mulai, g.selesai, now) : 0;
                const sisaHari = now ? daysUntil(new Date(g.selesai + 'T23:59:59'), now) : 0;
                const mulaiHari = now ? daysUntil(new Date(g.mulai + 'T00:00:00'), now) : 0;

                return (
                  <article
                    key={i}
                    className={`gel-card gel-card-${status}`}
                    style={{ animationDelay: `${i * 90}ms` }}
                  >
                    <div className="gel-card-row">
                      <span className="gel-num">{i + 1}</span>
                      <span className={`gel-badge gel-badge-${status}`}>
                        <span className="gel-badge-dot" />
                        {STATUS_LABEL[status]}
                      </span>
                    </div>

                    <h3 className="gel-name">{g.nama}</h3>
                    <div className="gel-date">
                      <Calendar size={14} />
                      <span>{g.tgl}</span>
                    </div>

                    <div className="gel-foot">
                      {isOpen && (
                        <>
                          <div className="gel-bar">
                            <span style={{ width: `${progress}%` }} />
                          </div>
                          <div className="gel-countdown">
                            <Clock size={13} />
                            Sisa <strong>{sisaHari}</strong> hari lagi
                          </div>
                        </>
                      )}
                      {status === 'upcoming' && (
                        <div className="gel-soon">
                          Dibuka dalam <strong>{mulaiHari}</strong> hari
                        </div>
                      )}
                      {isDone && (
                        <div className="gel-closed">
                          <CheckCircle size={13} /> Gelombang selesai
                        </div>
                      )}
                    </div>
                  </article>
                );
              })}
            </div>
          </div>

          <style jsx>{`
            .jadwal-section {
              padding: 80px 24px;
              background:
                radial-gradient(600px circle at 50% -10%, rgba(200, 151, 58, 0.08), transparent 60%),
                #ffffff;
            }
            .jadwal-inner { max-width: 1100px; margin: 0 auto; }
            .jadwal-head { text-align: center; margin-bottom: 52px; }
            .jadwal-title { font-size: 38px; color: #0a1628; }
            .jadwal-sub { color: #6b7280; margin-top: 10px; font-size: 15px; }
            .jadwal-live {
              display: inline-flex; align-items: center; gap: 8px; margin-top: 16px;
              padding: 6px 14px; border-radius: 999px;
              background: rgba(21, 128, 61, 0.08); border: 1px solid rgba(21, 128, 61, 0.2);
              color: #15803d; font-size: 12px; font-weight: 600;
            }
            .jadwal-live-dot {
              width: 7px; height: 7px; border-radius: 50%; background: #15803d;
              animation: livePulse 1.8s ease-out infinite;
            }
            @keyframes livePulse {
              0% { box-shadow: 0 0 0 0 rgba(21, 128, 61, 0.5); }
              70% { box-shadow: 0 0 0 7px rgba(21, 128, 61, 0); }
              100% { box-shadow: 0 0 0 0 rgba(21, 128, 61, 0); }
            }

            .gel-grid {
              position: relative;
              display: grid;
              grid-template-columns: repeat(3, 1fr);
              gap: 22px;
            }
            /* rel penghubung antar-gelombang (desktop) */
            .gel-grid::before {
              content: '';
              position: absolute; top: 52px; left: 14%; right: 14%; height: 2px;
              background: repeating-linear-gradient(90deg, #e4d7bd 0 8px, transparent 8px 16px);
              z-index: 0;
            }

            .gel-card {
              --gel-o: 1;
              position: relative; z-index: 1;
              display: flex; flex-direction: column;
              background: #ffffff;
              border: 1.5px solid #f0ebe0;
              border-radius: 18px;
              padding: 26px 24px 22px;
              box-shadow: 0 8px 24px rgba(10, 22, 40, 0.05);
              transition: transform 0.25s ease, box-shadow 0.25s ease, border-color 0.25s ease;
              opacity: 0;
              animation: gelIn 0.5s cubic-bezier(0.22, 1, 0.36, 1) forwards;
            }
            @keyframes gelIn {
              from { opacity: 0; transform: translateY(18px); }
              to { opacity: var(--gel-o); transform: translateY(0); }
            }
            .gel-card:hover {
              transform: translateY(-6px);
              box-shadow: 0 20px 44px rgba(10, 22, 40, 0.14);
              border-color: #d8c39a;
            }

            /* kartu gelombang yang sedang DIBUKA — menonjol */
            .gel-card-buka {
              border: none;
              padding: 27px 25px 23px;
              background: linear-gradient(160deg, #0b4d22 0%, #093b1e 100%);
              box-shadow: 0 22px 50px rgba(9, 59, 30, 0.34);
              transform: translateY(-6px);
            }
            .gel-card-buka::before {
              content: '';
              position: absolute; inset: -2px; border-radius: 20px; z-index: -1;
              background: linear-gradient(130deg, #c8973a, #e8b84b, #c8973a);
              background-size: 220% 220%;
              animation: shimmer 3.5s linear infinite;
            }
            @keyframes shimmer {
              0% { background-position: 0% 50%; }
              100% { background-position: 220% 50%; }
            }
            .gel-card-buka:hover { transform: translateY(-10px); }

            .gel-card-selesai { --gel-o: 0.62; }
            .gel-card-selesai:hover { transform: translateY(-3px); }

            .gel-card-row {
              display: flex; align-items: center; justify-content: space-between;
              margin-bottom: 16px;
            }
            .gel-num {
              width: 44px; height: 44px; border-radius: 50%;
              display: flex; align-items: center; justify-content: center;
              font-family: var(--display, 'Outfit', sans-serif);
              font-size: 20px; font-weight: 800;
              background: rgba(200, 151, 58, 0.12); color: #c8973a;
            }
            .gel-card-buka .gel-num {
              background: linear-gradient(135deg, #c8973a, #e8b84b); color: #08210f;
              box-shadow: 0 0 0 4px rgba(232, 184, 75, 0.18);
            }

            .gel-badge {
              display: inline-flex; align-items: center; gap: 6px;
              font-size: 10px; font-weight: 800; letter-spacing: 0.6px;
              padding: 5px 10px; border-radius: 999px;
            }
            .gel-badge-dot { width: 6px; height: 6px; border-radius: 50%; background: currentColor; }
            .gel-badge-upcoming { background: rgba(200, 151, 58, 0.14); color: #b07d1f; }
            .gel-badge-buka {
              background: #e8b84b; color: #08210f;
              animation: badgeGlow 2s ease-in-out infinite;
            }
            @keyframes badgeGlow {
              0%, 100% { box-shadow: 0 0 0 0 rgba(232, 184, 75, 0.5); }
              50% { box-shadow: 0 0 0 6px rgba(232, 184, 75, 0); }
            }
            .gel-badge-selesai { background: #eef0f2; color: #6b7280; }

            .gel-name {
              font-size: 18px; font-weight: 700; margin-bottom: 8px;
              color: #1a1408;
            }
            .gel-card-buka .gel-name { color: #ffffff; }

            .gel-date {
              display: flex; align-items: center; gap: 7px;
              font-size: 12.5px; color: #9ca3af; line-height: 1.4;
            }
            .gel-card-buka .gel-date { color: rgba(232, 184, 75, 0.9); }

            .gel-foot { margin-top: 18px; }
            .gel-bar {
              height: 6px; border-radius: 999px; overflow: hidden;
              background: rgba(255, 255, 255, 0.15); margin-bottom: 10px;
            }
            .gel-bar span {
              display: block; height: 100%; border-radius: 999px;
              background: linear-gradient(90deg, #c8973a, #e8b84b);
              transition: width 0.6s ease;
            }
            .gel-countdown {
              display: inline-flex; align-items: center; gap: 6px;
              font-size: 12.5px; color: #ffffff; font-weight: 600;
            }
            .gel-countdown strong { color: #e8b84b; font-size: 14px; }
            .gel-soon {
              font-size: 12px; color: #b07d1f; font-weight: 600;
              padding-top: 12px; border-top: 1px dashed #ece1c8;
            }
            .gel-soon strong { color: #0a1628; }
            .gel-closed {
              display: inline-flex; align-items: center; gap: 6px;
              font-size: 12px; color: #9ca3af; font-weight: 600;
              padding-top: 12px; border-top: 1px dashed #eef0f2;
            }

            @media (max-width: 860px) {
              .gel-grid { grid-template-columns: 1fr; gap: 16px; }
              .gel-grid::before { display: none; }
              .gel-card-buka, .gel-card-buka:hover { transform: none; }
              .gel-card:hover { transform: none; }
            }

            @media (prefers-reduced-motion: reduce) {
              .gel-card { animation: none; opacity: var(--gel-o); }
              .gel-card-buka::before, .gel-badge-buka, .jadwal-live-dot { animation: none; }
              .gel-card, .gel-card:hover, .gel-card-buka, .gel-card-buka:hover { transition: none; transform: none; }
            }
          `}</style>
        </section>

        {/* Biaya Pendidikan */}
        <section style={{ padding: '70px 24px', background: '#FAF7F0' }}>
          <div style={{ maxWidth: 900, margin: '0 auto' }}>
            <div style={{ textAlign: 'center', marginBottom: 44 }}>
              <div className="gold-line" style={{ margin: '0 auto 16px' }} />
              <div style={{ fontSize: 12, fontWeight: 700, letterSpacing: 2, color: '#C8973A', marginBottom: 8 }}>TAHUN PELAJARAN {TAHUN_AJARAN}</div>
              <h2 className="font-display" style={{ fontSize: 36, color: '#0A1628' }}>Biaya Pendidikan Siswa Baru</h2>
            </div>

            <div className="biaya-grid">
              {[
                { no: 1, kelas: 'Kelas Reguler', biaya: 'Rp5.100.000', unggulan: false },
                { no: 2, kelas: 'Kelas Plus', biaya: 'Rp6.000.000', unggulan: true },
              ].map(item => (
                <div
                  key={item.no}
                  className="biaya-card"
                  style={{
                    background: item.unggulan ? 'linear-gradient(155deg,#0A1628,#123a2b)' : 'white',
                    border: item.unggulan ? '1.5px solid #C8973A' : '1.5px solid #F0EBE0',
                  }}
                >
                  {item.unggulan && (
                    <div style={{ position: 'absolute', top: -12, left: 24, background: '#C8973A', color: '#0A1628', fontSize: 10, fontWeight: 800, padding: '4px 12px', borderRadius: 20, letterSpacing: 0.5 }}>
                      PILIHAN TERBAIK
                    </div>
                  )}
                  <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: 1.5, color: item.unggulan ? '#E8B84B' : '#C8973A', marginBottom: 10 }}>
                    NO. {item.no}
                  </div>
                  <h3 className="font-display" style={{ fontSize: 24, color: item.unggulan ? 'white' : '#0A1628', marginBottom: 18 }}>
                    {item.kelas}
                  </h3>
                  <div style={{ display: 'flex', alignItems: 'baseline', gap: 6, marginBottom: 6 }}>
                    <span className="font-display" style={{ fontSize: 32, fontWeight: 700, color: item.unggulan ? '#E8B84B' : '#0A1628' }}>
                      {item.biaya}
                    </span>
                  </div>
                  <div style={{ fontSize: 12.5, color: item.unggulan ? 'rgba(255,255,255,0.55)' : '#9CA3AF' }}>
                    Biaya pendidikan siswa baru
                  </div>
                </div>
              ))}
            </div>

            <p style={{ textAlign: 'center', fontSize: 12.5, color: '#9CA3AF', marginTop: 28 }}>
              Untuk rincian dan informasi lebih lanjut mengenai biaya pendidikan, silakan hubungi bagian Tata Usaha sekolah.
            </p>
          </div>

          <style jsx>{`
            .biaya-grid {
              display: grid;
              grid-template-columns: repeat(auto-fit, minmax(min(260px, 100%), 1fr));
              gap: 24px;
            }
            .biaya-card {
              position: relative;
              border-radius: 18px;
              padding: 32px 28px;
              transition: transform 0.2s ease, box-shadow 0.2s ease;
            }
            .biaya-card:hover {
              transform: translateY(-4px);
              box-shadow: 0 16px 34px rgba(10,22,40,0.12);
            }
            @media (max-width: 640px) {
              .biaya-card { padding: 28px 22px; }
            }
          `}</style>
        </section>

        {/* Alur */}
        <section style={{ padding: '70px 24px', background: '#FAF7F0' }}>
          <div style={{ maxWidth: 900, margin: '0 auto' }}>
            <div style={{ textAlign: 'center', marginBottom: 48 }}>
              <div className="gold-line" style={{ margin: '0 auto 16px' }} />
              <h2 className="font-display" style={{ fontSize: 36, color: '#0A1628' }}>Alur Pendaftaran</h2>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
              {ALUR.map((step, i) => (
                <div key={step.no} style={{ display: 'flex', gap: 20, alignItems: 'flex-start' }}>
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                    <div style={{ width: 44, height: 44, borderRadius: '50%', background: 'linear-gradient(135deg,#C8973A,#E8B84B)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: 16, color: '#0A1628', flexShrink: 0 }}>{step.no}</div>
                    {i < ALUR.length - 1 && <div style={{ width: 2, height: 36, background: '#E5E7EB', margin: '4px 0' }} />}
                  </div>
                  <div style={{ background: 'white', borderRadius: 12, padding: '16px 20px', flex: 1, border: '1px solid #F0EBE0', marginBottom: 4 }}>
                    <h4 style={{ fontSize: 15, fontWeight: 700, color: '#0A1628', marginBottom: 4 }}>{step.title}</h4>
                    <p style={{ fontSize: 13, color: '#6B7280' }}>{step.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Persyaratan */}
        <section style={{ padding: '70px 24px', background: 'white' }}>
          <div style={{ maxWidth: 1100, margin: '0 auto', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 60, alignItems: 'center' }}>
            <div>
              <div className="gold-line" style={{ marginBottom: 16 }} />
              <h2 className="font-display" style={{ fontSize: 36, color: '#0A1628', marginBottom: 16 }}>Persyaratan Dokumen</h2>
              <p style={{ color: '#6B7280', marginBottom: 28, fontSize: 15, lineHeight: 1.7 }}>
                Berikut adalah berkas persyaratan yang wajib diserahkan ke sekolah untuk proses verifikasi pendaftaran.
              </p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                {PERSYARATAN.map((item, i) => (
                  <div key={i} style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
                    <CheckCircle size={18} color="#C8973A" style={{ flexShrink: 0 }} />
                    <span style={{ fontSize: 14, color: '#374151' }}>{item}</span>
                  </div>
                ))}
              </div>
              <div style={{ background: '#FEF3C7', border: '1px solid #FDE68A', borderRadius: 10, padding: 16, marginTop: 24, display: 'flex', gap: 10, alignItems: 'flex-start' }}>
                <AlertCircle size={16} color="#92400E" style={{ flexShrink: 0, marginTop: 2 }} />
                <p style={{ fontSize: 13, color: '#92400E', lineHeight: 1.5 }}>
                  Setelah mengirimkan formulir pendaftaran secara online, calon peserta didik wajib menyerahkan fotokopi berkas persyaratan ke sekolah paling lambat 3 (tiga) hari kerja.
                </p>
              </div>
            </div>
            <div style={{ background: '#02513b', borderRadius: 20, padding: 36, color: 'white' }}>
              <h3 className="font-display" style={{ fontSize: 26, color: 'white', marginBottom: 8 }}>Mulai Daftar Sekarang</h3>
              <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: 14, lineHeight: 1.7, marginBottom: 28 }}>
                Proses pendaftaran 100% online. Buat akun, isi formulir, dan upload berkas dari rumah.
              </p>
              {['Buat akun gratis', 'Isi formulir online', 'Upload dokumen digital', 'Pantau status real-time'].map((f, i) => (
                <div key={i} style={{ display: 'flex', gap: 10, marginBottom: 14, alignItems: 'center' }}>
                  <div style={{ width: 24, height: 24, background: 'rgba(200,151,58,0.2)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <ChevronRight size={14} color="#C8973A" />
                  </div>
                  <span style={{ fontSize: 14, color: 'rgba(255,255,255,0.8)' }}>{f}</span>
                </div>
              ))}
              <Link href="/register" className="btn-primary" style={{ display: 'block', textAlign: 'center', marginTop: 28, fontSize: 15 }}>
                Daftar Sekarang →
              </Link>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
} 