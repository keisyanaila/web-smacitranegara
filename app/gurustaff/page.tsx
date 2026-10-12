import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import StafBrowser from '@/components/staf/StafBrowser';
import { getStafList } from '@/lib/staf';
import { withPublicFoto } from '@/lib/foto';

// Data guru & staf dikelola dari /admin/staf.
export const dynamic = 'force-dynamic';

export const metadata = {
  title: 'Guru & Staf — SMA Citra Negara',
};

export default async function StafPage() {
  const staf = await getStafList();

  return (
    <>
      <Navbar />
      <StafBrowser items={staf.map((s) => withPublicFoto('staf', s))} />
      <Footer />
    </>
  );
}
