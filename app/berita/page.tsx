import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import BeritaBrowser from '@/components/berita/BeritaBrowser';
import { getBeritaList } from '@/lib/berita';

export const dynamic = 'force-dynamic';

export const metadata = {
  title: 'Berita & Kegiatan — SMA Citra Negara',
};

export default async function BeritaPage() {
  const berita = await getBeritaList();

  return (
    <>
      <Navbar />
      <BeritaBrowser items={berita} />
      <Footer />
    </>
  );
}
