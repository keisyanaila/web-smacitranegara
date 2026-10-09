import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Pendaftaran SPMB pindah ke situs terpisah; link lama /spmb diarahkan ke sana.
  // Samakan dengan SPMB_URL di lib/spmb.ts.
  async redirects() {
    return [
      { source: "/spmb", destination: "https://spmb.citranegara.online", permanent: false },
    ];
  },
};

export default nextConfig;
