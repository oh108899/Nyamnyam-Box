import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "jprpbxjosrpfwnsslvlm.supabase.co",
        pathname: "/storage/v1/object/public/**",
      },
      // 프로필 이미지 가져오기
       {
        protocol: "https",
        hostname: "lh3.googleusercontent.com",
        pathname: "/**",
      },
      {
        protocol: "http",
        hostname: "img1.kakaocdn.net",
        pathname: "/**",
      },
      {
        protocol: "http",
        hostname: "k.kakaocdn.net",
        pathname: "/**",
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
