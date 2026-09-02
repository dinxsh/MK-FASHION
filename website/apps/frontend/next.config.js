/** @type {import('next').NextConfig} */
const nextConfig = {
  // Keep generated Next files out of OneDrive's broken `.next` placeholder.
  distDir: '.next-cache',
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'cdn.parampara.in',
        port: '',
        pathname: '/**',
      },
    ],
  },
};

module.exports = nextConfig;
