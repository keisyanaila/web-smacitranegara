'use client';

import Link from 'next/link';
import { ArrowLeft, Calendar, Newspaper } from 'lucide-react';
import type { BeritaItem } from '@/app/berita/data';
import { KATEGORI_COLOR } from '@/app/berita/data';

const NAVY = '#0A1628';
const GOLD = '#C8973A';
const GRAY = '#6B7280';
const BORDER = '#F0EBE0';

export default function BeritaDetail({ item, related }: { item: BeritaItem; related: BeritaItem[] }) {
  const warna = KATEGORI_COLOR[item.kategori] ?? GOLD;

  return (
    <main style={{ background: '#FAF7F0', padding: '70px 24px 90px' }}>
      <div style={{ maxWidth: 900, margin: '0 auto' }}>
        <Link
          href="/berita"
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
          Kembali ke Berita
        </Link>

        {/* Hero image */}
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
            alt={item.judul}
            style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
          />
        </div>

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
              {item.tanggalLabel}
            </span>
          </div>

          <h1 className="font-display" style={{ fontSize: 34, color: NAVY, lineHeight: 1.3, marginBottom: 26 }}>
            {item.judul}
          </h1>

          <div
            style={{
              display: 'flex',
              alignItems: 'flex-start',
              gap: 12,
              background: '#FBF4E4',
              border: `1px solid ${BORDER}`,
              borderRadius: 12,
              padding: '16px 20px',
              marginBottom: 36,
            }}
          >
            <Newspaper color={GOLD} size={20} style={{ flexShrink: 0, marginTop: 2 }} />
            <div style={{ color: GRAY, fontSize: 14, lineHeight: 1.6 }}>{item.ringkasan}</div>
          </div>

          {item.konten.map((p, i) => (
            <p
              key={i}
              style={{
                color: GRAY,
                lineHeight: 1.9,
                fontSize: 16,
                textAlign: 'justify',
                marginBottom: i < item.konten.length - 1 ? 20 : 0,
              }}
            >
              {p}
            </p>
          ))}
        </div>

        {/* Berita lainnya */}
        {related.length > 0 && (
          <div style={{ marginTop: 48 }}>
            <h2 className="font-display" style={{ fontSize: 22, color: NAVY, marginBottom: 18 }}>
              Berita Lainnya
            </h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: 18 }}>
              {related.map(r => (
                <Link
                  key={r.href}
                  href={r.href}
                  style={{
                    background: 'white', borderRadius: 14, overflow: 'hidden',
                    border: `1px solid ${BORDER}`, textDecoration: 'none',
                    display: 'flex', flexDirection: 'column',
                    boxShadow: '0 2px 10px rgba(10,22,40,0.05)',
                  }}
                >
                  <div style={{ width: '100%', height: 140, background: BORDER }}>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={r.foto} alt={r.judul} style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
                  </div>
                  <div style={{ padding: '14px 16px' }}>
                    <div style={{ color: GRAY, fontSize: 11, marginBottom: 6 }}>{r.tanggalLabel}</div>
                    <div style={{ color: NAVY, fontSize: 13.5, fontWeight: 700, lineHeight: 1.4 }}>{r.judul}</div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
