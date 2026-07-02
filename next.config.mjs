/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'media.tenor.com',
      },
      {
        protocol: 'https',
        hostname: 'i.giphy.com',
      },
      {
        protocol: 'https',
        hostname: 'media.giphy.com',
      },
    ],
  },
};

export default nextConfig;
