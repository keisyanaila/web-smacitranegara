import type { Metadata } from 'next';
import './globals.css';
import SplashWelcome from '@/components/SplashWelcome';
import GoogleTranslate from '@/components/GoogleTranslate';

export const metadata: Metadata = {
  title: 'SMA Citra Negara - Sekolah Menengah Atas ',
  description: 'SMA Citra Negara - Mencetak generasi profesional dan berkarakter.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="id">
      <head>
        {/* Font dimuat paralel lewat <link> (lebih cepat daripada @import di CSS). */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        {/* eslint-disable-next-line @next/next/no-page-custom-font -- root layout App Router, berlaku untuk semua halaman */}
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,600;0,700;0,900;1,700&family=Plus+Jakarta+Sans:wght@300;400;500;600;700;800&display=swap"
        />
      </head>
      <body>
        <SplashWelcome duration={8500} />
        {children}
        <GoogleTranslate />
      </body>
    </html>
  );
}


