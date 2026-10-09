'use client';

import { useRef, useState } from 'react';
import { ImageIcon, Trash2, Upload } from 'lucide-react';
import { MAX_UPLOAD_BYTES } from '@/lib/upload';

/* eslint-disable @next/next/no-img-element */

// Gambar diperkecil di browser sebelum disimpan (sisi terpanjang maks 1600px,
// WEBP/JPEG kualitas 0.85) supaya database & halaman tetap ringan.
const MAX_SIDE = 1600;

function loadImage(file: File): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const url = URL.createObjectURL(file);
    const img = new Image();
    img.onload = () => {
      URL.revokeObjectURL(url);
      resolve(img);
    };
    img.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error('Gambar tidak bisa dibaca.'));
    };
    img.src = url;
  });
}

async function compress(file: File): Promise<string> {
  const img = await loadImage(file);
  const scale = Math.min(1, MAX_SIDE / Math.max(img.naturalWidth, img.naturalHeight));
  const canvas = document.createElement('canvas');
  canvas.width = Math.round(img.naturalWidth * scale);
  canvas.height = Math.round(img.naturalHeight * scale);
  const ctx = canvas.getContext('2d');
  if (!ctx) throw new Error('Browser tidak mendukung kompresi gambar.');
  ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
  const webp = canvas.toDataURL('image/webp', 0.85);
  // Browser lama yang tidak bisa encode WEBP akan mengembalikan PNG → pakai JPEG.
  return webp.startsWith('data:image/webp') ? webp : canvas.toDataURL('image/jpeg', 0.85);
}

export default function ImageInput({
  value,
  onChange,
  hint,
}: {
  value: string;
  onChange: (v: string) => void;
  hint?: string;
}) {
  const ref = useRef<HTMLInputElement>(null);
  const [busy, setBusy] = useState(false);

  async function pick(file?: File) {
    if (!file) return;
    if (!file.type.startsWith('image/')) {
      alert('File harus berupa gambar.');
      return;
    }
    if (file.size > MAX_UPLOAD_BYTES) {
      alert('Ukuran gambar maksimal 4 MB.');
      return;
    }
    setBusy(true);
    try {
      onChange(await compress(file));
    } catch (e) {
      alert(e instanceof Error ? e.message : 'Gagal memproses gambar.');
    } finally {
      setBusy(false);
    }
  }

  const isData = value.startsWith('data:');

  return (
    <div>
      <div className="adm-img">
        <div className={`adm-img-preview ${value ? 'has' : ''}`}>
          {value ? (
            <img src={value} alt="Pratinjau" />
          ) : (
            <>
              <ImageIcon size={22} />
              Belum ada gambar
            </>
          )}
        </div>
        <div className="adm-img-side">
          <div className="adm-img-btns">
            <button
              type="button"
              className="adm-btn adm-btn-ghost adm-btn-sm"
              onClick={() => ref.current?.click()}
              disabled={busy}
            >
              <Upload size={15} />
              {busy ? 'Memproses…' : 'Upload gambar'}
            </button>
            {value && (
              <button type="button" className="adm-btn adm-btn-danger adm-btn-sm" onClick={() => onChange('')}>
                <Trash2 size={15} />
                Hapus
              </button>
            )}
          </div>
          <input
            className="adm-input"
            placeholder="atau tempel URL / path gambar"
            value={isData ? '' : value}
            onChange={(e) => onChange(e.target.value)}
          />
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
      <div className="adm-hint" style={{ marginTop: 8 }}>
        JPG/PNG/WEBP, maks 4 MB.{hint ? ` ${hint}` : ''}
        {isData && ' Gambar otomatis dikecilkan dan disimpan di database.'}
      </div>
    </div>
  );
}
