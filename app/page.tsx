import HomeView from '@/components/home/HomeView';
import { getSpmbSetting } from '@/lib/spmb-db';

export const dynamic = 'force-dynamic';

export default async function HomePage() {
  const spmb = await getSpmbSetting();
  return <HomeView spmb={spmb} />;
}
