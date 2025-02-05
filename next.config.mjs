/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false,
  experimental: { // ✅ Enable App Router API routes
  },
  images: {
    remotePatterns: [
      {
        hostname: 'placehold.it',
      },
    ],
  },
};

export default nextConfig;
