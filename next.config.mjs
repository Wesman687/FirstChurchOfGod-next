/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false,
  images: {
    remotePatterns: [
      {
        hostname: 'placehold.it',
      },
    ],
  },
};

export default nextConfig;
