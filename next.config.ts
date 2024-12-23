/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ['tiffycooks.com'],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'tiffycooks.com',
        pathname: '/wp-content/uploads/**',
      },
    ],
  },
};

export default nextConfig;
