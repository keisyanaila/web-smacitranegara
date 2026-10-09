'use client';

import { setLang, useLang } from '@/lib/lang';

/** Tombol kapsul ID | EN. Pilihan disimpan di cookie lalu halaman dimuat ulang. */
export default function LangSwitch() {
  const lang = useLang();

  return (
    <div className="lang-switch notranslate" translate="no" role="group" aria-label="Pilih bahasa">
      {(['id', 'en'] as const).map((l) => (
        <button
          key={l}
          type="button"
          className={lang === l ? 'is-active' : ''}
          aria-pressed={lang === l}
          onClick={() => lang !== l && setLang(l)}
        >
          {l.toUpperCase()}
        </button>
      ))}
    </div>
  );
}
