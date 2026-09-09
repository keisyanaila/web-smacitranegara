'use client';

import { useRef } from 'react';
import { MAX_IMAGE_BYTES } from '@/lib/upload';

/* eslint-disable @next/next/no-img-element */
export default function ImageInput({
  value,
  onChange,
}: {
  value: string;
  onChange: (v: string) => void;
}) {
  const ref = useRef<HTMLInputElement>(null);

  function pick(file?: File) {
    if (!file) return;
    if (!file.type.startsWith('image/')) {
      alert('File harus berupa gambar.');
      return;
    }
    if (file.size > MAX_IMAGE_BYTES) {
      alert('Ukuran gambar maksimal 2 MB.');
      return;
    }
    const fr = new FileReader();
    fr.onload = () => onChange(String(fr.result));
    fr.readAsDataURL(file);
  }

  const isData = value.startsWith('data:');

  return (
    <div className="adm-img">
      <div className="adm-img-top">
        {value ? (
          <img className="adm-img-preview" src={value} alt="Pratinjau" />
        ) : (
          <div className="adm-img-preview" />
        )}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          <button type="button" className="adm-file-btn" onClick={() => ref.current?.click()}>
            Upload gambar
          </button>
          {value && (
            <button
              type="button"
              className="adm-btn adm-btn-ghost adm-btn-sm"
              onClick={() => onChange('')}
            >
              Hapus gambar
            </button>
          )}
          <input
            ref={ref}
            type="file"
            accept="image/png,image/jpeg,image/webp,image/gif"
            hidden
            onChange={(e) => {
              pick(e.target.files?.[0]);
              e.target.value = '';
            }}
          />
        </div>
      </div>

      <input
        className="adm-input"
        placeholder="atau tempel URL / path gambar (mis. /images/foto.jpg)"
        value={isData ? '' : value}
        onChange={(e) => onChange(e.target.value)}
      />
      <div className="adm-hint">
        JPG/PNG/WEBP, maks 2 MB. {isData && 'Gambar hasil upload disimpan langsung di database.'}
      </div>
    </div>
  );
}
