/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    remotePatterns: [
      {
        hostname: 'placehold.it',
      },
    ],
  },
};

export default nextConfig;
