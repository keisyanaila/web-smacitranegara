import { notFound } from 'next/navigation';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import BeritaDetail from '@/components/berita/BeritaDetail';
import { getBeritaBySlug, getBeritaList } from '@/lib/berita';

export const dynamic = 'force-dynamic';

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const item = await getBeritaBySlug(slug);
  return { title: item ? `${item.judul} — Berita SMA Citra Negara` : 'Berita tidak ditemukan' };
}

export default async function DetailBeritaPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const item = await getBeritaBySlug(slug);

  if (!item) notFound();

  const all = await getBeritaList();
  const related = all.filter((b) => b.href !== item.href).slice(0, 2);

  return (
    <>
      <Navbar />
      <BeritaDetail item={item} related={related} />
      <Footer />
    </>
  );
}
