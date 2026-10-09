'use client';

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { readLang } from '@/lib/lang';

// Memuat Google Translate hanya kalau pengunjung memilih EN. Tampilan bawaan Google
// (banner, tooltip) disembunyikan lewat globals.css; kontrolnya cukup LangSwitch.

declare global {
  interface Window {
    googleTranslateElementInit?: () => void;
    google?: {
      translate: {
        TranslateElement: new (opts: Record<string, unknown>, id: string) => unknown;
      };
    };
  }
}

let patched = false;

/**
 * Google Translate membungkus teks dengan <font>, sehingga React kadang mencoba
 * menghapus/menyisipkan node yang sudah dipindah → error "removeChild ... not a child".
 * Patch ini membuat operasi tersebut aman (pola umum dari issue facebook/react#11538).
 */
function patchDomForTranslate() {
  if (patched || typeof Node === 'undefined') return;
  patched = true;
  const origRemove = Node.prototype.removeChild;
  Node.prototype.removeChild = function <T extends Node>(this: Node, child: T): T {
    if (child.parentNode !== this) return child;
    return origRemove.call(this, child) as T;
  };
  const origInsert = Node.prototype.insertBefore;
  Node.prototype.insertBefore = function <T extends Node>(this: Node, node: T, ref: Node | null): T {
    if (ref && ref.parentNode !== this) return node;
    return origInsert.call(this, node, ref) as T;
  };
}

export default function GoogleTranslate() {
  const isAdmin = usePathname()?.startsWith('/admin') ?? false;

  useEffect(() => {
    if (isAdmin || readLang() !== 'en') return;
    if (document.getElementById('google-translate-script')) return;

    patchDomForTranslate();
    window.googleTranslateElementInit = () => {
      if (!window.google?.translate) return;
      new window.google.translate.TranslateElement(
        { pageLanguage: 'id', includedLanguages: 'en', autoDisplay: false },
        'google_translate_element'
      );
    };
    const s = document.createElement('script');
    s.id = 'google-translate-script';
    s.src = 'https://translate.google.com/translate_a/element.js?cb=googleTranslateElementInit';
    s.async = true;
    document.body.appendChild(s);
  }, [isAdmin]);

  return <div id="google_translate_element" hidden />;
}
