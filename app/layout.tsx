import type { Metadata } from 'next';
import './globals.css';
import SplashWelcome from '@/components/SplashWelcome';

export const metadata: Metadata = {
  title: 'SMA Citra Negara - Sekolah Menengah Atas ',
  description: 'SMA Citra Negara - Mencetak generasi profesional dan berkarakter.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="id">
      <body>
        <SplashWelcome duration={8500} />
        {children}
      </body>
    </html>
  );
}


