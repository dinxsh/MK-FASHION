/** @type {import('next').NextConfig} */
const nextConfig = {
  async redirects() {
    return [{ source: '/admin/:path*', destination: '/studio', permanent: false }];
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'cdn.parampara.in',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'cdn.sanity.io',
        port: '',
        pathname: '/**',
      },
    ],
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
};

module.exports = nextConfig;
