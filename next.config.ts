/** @type {import('next').NextConfig} */
const nextConfig = {
  // ESLintを完全無効化（本番デプロイ用）
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  experimental: {
    appDir: true,
  },
  images: {
    domains: ['lh3.googleusercontent.com', 'avatars.githubusercontent.com'],
    unoptimized: true,
  },
  // 本番環境最適化
  poweredByHeader: false,
  compress: true,
  trailingSlash: false,
};

export default nextConfig;