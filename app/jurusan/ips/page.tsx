import JurusanDetail from '@/components/jurusan/JurusanDetail';
import { JURUSAN_DETAIL } from '@/app/jurusan/data';

export const metadata = {
  title: 'IPS — Ilmu Pengetahuan Sosial | SMA Citra Negara',
  description:
    'Peminatan IPS SMA Citra Negara: mata pelajaran, keunggulan, dan prospek karier.',
};

export default function IpsPage() {
  return <JurusanDetail data={JURUSAN_DETAIL.ips} />;
}
