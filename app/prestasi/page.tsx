import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import PrestasiBrowser from '@/components/prestasi/PrestasiBrowser';
import { getPrestasiList } from '@/lib/prestasi';

export const dynamic = 'force-dynamic';

export const metadata = {
  title: 'Prestasi & Penghargaan — SMA Citra Negara',
};

export default async function PrestasiPage() {
  const prestasi = await getPrestasiList();

  return (
    <>
      <Navbar />
      <PrestasiBrowser items={prestasi} />
      <Footer />
    </>
  );
}
