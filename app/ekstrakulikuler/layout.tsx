import EskulPerf from '@/components/EskulPerf';
import './eskul-perf.css';

export default function EkstrakurikulerLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      {children}
      <EskulPerf />
    </>
  );
}
