import JurusanDetail from '@/components/jurusan/JurusanDetail';
import { JURUSAN_DETAIL } from '@/app/jurusan/data';

export const metadata = {
  title: 'IPA — Ilmu Pengetahuan Alam | SMA Citra Negara',
  description:
    'Peminatan IPA SMA Citra Negara: mata pelajaran, keunggulan, dan prospek karier.',
};

export default function IpaPage() {
  return <JurusanDetail data={JURUSAN_DETAIL.ipa} />;
}
