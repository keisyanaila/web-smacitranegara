import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ArrowLeft, Award, Calendar } from 'lucide-react';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { getPrestasiById, KATEGORI_COLOR } from '@/lib/prestasi';

export const dynamic = 'force-dynamic';

const NAVY = '#0A1628';
const GOLD = '#C8973A';
const GRAY = '#6B7280';
const BORDER = '#F0EBE0';

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const item = await getPrestasiById(Number(id));
  return { title: item ? `${item.nama} — Prestasi SMA Citra Negara` : 'Prestasi tidak ditemukan' };
}

export default async function DetailPrestasiPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const item = await getPrestasiById(Number(id));
  if (!item) notFound();

  const warna = KATEGORI_COLOR[item.kategori] ?? GOLD;
  const paragraf = item.deskripsi.split(/\n\s*\n/).map((p) => p.trim()).filter(Boolean);

  return (
    <>
      <Navbar />

      <main style={{ background: '#FAF7F0', padding: '70px 24px 90px' }}>
        <div style={{ maxWidth: 900, margin: '0 auto' }}>
          <Link
            href="/prestasi"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 8,
              color: NAVY,
              textDecoration: 'none',
              marginBottom: 28,
              fontWeight: 600,
            }}
          >
            <ArrowLeft size={18} />
            Kembali ke Prestasi
          </Link>

          {item.foto && (
            <div
              style={{
                width: '100%',
                height: 420,
                borderRadius: 18,
                overflow: 'hidden',
                border: `1px solid ${BORDER}`,
                marginBottom: 36,
                background: BORDER,
              }}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={item.foto}
                alt={item.nama}
                style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
              />
            </div>
          )}

          <div
            style={{
              background: 'white',
              borderRadius: 20,
              padding: '42px',
              border: `1px solid ${BORDER}`,
              boxShadow: '0 12px 35px rgba(10,22,40,.08)',
            }}
          >
            <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', marginBottom: 18 }}>
              <span
                style={{
                  background: warna,
                  color: 'white',
                  padding: '6px 14px',
                  borderRadius: 20,
                  fontSize: 13,
                  fontWeight: 700,
                }}
              >
                {item.kategori}
              </span>
              <span style={{ display: 'flex', alignItems: 'center', gap: 6, color: GRAY, fontSize: 14 }}>
                <Calendar size={15} />
                Tahun {item.tahun}
              </span>
              {item.tingkat && (
                <span style={{ display: 'flex', alignItems: 'center', gap: 6, color: GRAY, fontSize: 14 }}>
                  <Award size={15} />
                  Tingkat {item.tingkat}
                </span>
              )}
            </div>

            <h1 className="font-display" style={{ fontSize: 34, color: NAVY, lineHeight: 1.3, marginBottom: 24 }}>
              {item.nama}
            </h1>

            {item.siswa.length > 0 && (
              <div
                style={{
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: 12,
                  background: '#FBF4E4',
                  border: `1px solid ${BORDER}`,
                  borderRadius: 12,
                  padding: '16px 20px',
                  marginBottom: 32,
                }}
              >
                <Award color={GOLD} size={20} style={{ flexShrink: 0, marginTop: 2 }} />
                <div>
                  <div style={{ fontWeight: 700, color: NAVY, marginBottom: 6 }}>Diraih oleh</div>
                  <ul style={{ margin: 0, paddingLeft: 18, color: GRAY, fontSize: 14, lineHeight: 1.8 }}>
                    {item.siswa.map((s, i) => (
                      <li key={i}>
                        {s.nama}
                        {s.kelas ? ` — kelas ${s.kelas}` : ''}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            )}

            {paragraf.length > 0 && (
              <>
                <h2 style={{ color: NAVY, fontSize: 22, fontWeight: 700, marginBottom: 16 }}>
                  Deskripsi Prestasi
                </h2>
                {paragraf.map((p, i) => (
                  <p
                    key={i}
                    style={{
                      color: GRAY,
                      lineHeight: 1.9,
                      fontSize: 16,
                      textAlign: 'justify',
                      marginBottom: i < paragraf.length - 1 ? 18 : 0,
                    }}
                  >
                    {p}
                  </p>
                ))}
              </>
            )}
          </div>
        </div>
      </main>

      <Footer />
    </>
  );
}
