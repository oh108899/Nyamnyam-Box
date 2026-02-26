import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "jprpbxjosrpfwnsslvlm.supabase.co",
        pathname: "/storage/v1/object/public/**",
      },
    ],
  },
  async rewrites() {
    return [
      {
        source: "/api/:path*",
        destination: "https://kdt-api-function.azurewebsites.net/api/:path*",
      },
    ];
  },
};

export default nextConfig;
