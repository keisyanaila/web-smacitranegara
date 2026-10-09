'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowUpRight, Check } from 'lucide-react';
import { SPMB_URL } from '@/lib/spmb';

const JURUSAN = [
  {
    kode: 'IPA',
    nama: 'Ilmu Pengetahuan Alam',
    foto: '/images/ipa.jpg',
    href: '/jurusan/ipa',
    desc: 'Rumpun ilmu yang mempelajari gejala-gejala alam, makhluk hidup, dan seluruh isi alam semesta — lewat praktikum nyata, bukan sekadar hafalan.',
    kuota: 72,
    highlights: ['Fisika, Kimia, Biologi lanjutan', 'Lab sains lengkap & modern', 'Persiapan olimpiade sains', 'Jalur favorit ke Kedokteran & Teknik'],
  },
  {
    kode: 'IPS',
    nama: 'Ilmu Pengetahuan Sosial',
    foto: '/images/ips.jpg',
    href: '/jurusan/ips',
    desc: 'Rumpun ilmu yang mempelajari manusia, masyarakat, dan interaksi sosial — dengan studi kasus, diskusi, dan simulasi yang dekat dengan dunia nyata.',
    kuota: 72,
    highlights: ['Ekonomi, Sosiologi, Geografi', 'Studi kasus & simulasi sosial', 'Persiapan olimpiade ekonomi', 'Jalur favorit ke Hukum, Ekonomi & Komunikasi'],
  },
];

/**
 * Tab IPA/IPS. Kedua panel selalu ada di DOM dan hanya ditukar lewat class —
 * teksnya tidak pernah diganti React, jadi tetap aman saat diterjemahkan Google (mode EN).
 */
export default function JurusanTabs() {
  const [active, setActive] = useState(0);

  return (
    <div className="h-jur">
      <div className="h-jur-tabs" role="tablist" aria-label="Pilih jurusan">
        <span className="h-jur-indicator" style={{ transform: `translateX(${active * 100}%)` }} />
        {JURUSAN.map((j, i) => (
          <button
            key={j.kode}
            type="button"
            role="tab"
            id={`jur-tab-${j.kode}`}
            aria-selected={active === i}
            aria-controls={`jur-panel-${j.kode}`}
            className={active === i ? 'is-active' : ''}
            onClick={() => setActive(i)}
          >
            {j.kode}
          </button>
        ))}
      </div>

      <div className="h-jur-panels">
        {JURUSAN.map((j, i) => (
          <div
            key={j.kode}
            role="tabpanel"
            id={`jur-panel-${j.kode}`}
            aria-labelledby={`jur-tab-${j.kode}`}
            className={`h-jur-panel${active === i ? ' is-active' : ''}`}
            inert={active !== i}
          >
            <div className="h-jur-photo">
              <Image src={j.foto} alt={`Kegiatan jurusan ${j.kode}`} fill sizes="(max-width: 900px) 100vw, 560px" />
              <span className="h-jur-code font-display">{j.kode}</span>
            </div>
            <div className="h-jur-info">
              <h3 className="font-display">{j.nama}</h3>
              <p>{j.desc}</p>
              <ul>
                {j.highlights.map((h, k) => (
                  <li key={h} style={{ '--k': k } as React.CSSProperties}>
                    <span className="h-jur-check"><Check size={13} strokeWidth={3} /></span>
                    {h}
                  </li>
                ))}
              </ul>
              <div className="h-jur-quota">
                <div className="h-jur-quota-top">
                  <span>Kuota tahun ini</span>
                  <strong>{j.kuota} siswa</strong>
                </div>
                <div className="h-jur-bar"><span /></div>
              </div>
              <div className="h-jur-actions">
                <Link href={j.href} className="h-btn h-btn-dark">
                  Detail {j.kode} <ArrowUpRight size={16} />
                </Link>
                <a href={SPMB_URL} target="_blank" rel="noopener noreferrer" className="h-btn h-btn-line">
                  Daftar {j.kode}
                </a>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
