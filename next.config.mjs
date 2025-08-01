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
      {
        protocol: 'https',
        hostname: 'firebasestorage.googleapis.com',
        port: '',
        pathname: '/v0/b/**',
      },
      {
        protocol: 'https', 
        hostname: 'lh3.googleusercontent.com',
        port: '',
        pathname: '/**',
      },
    ],
  },
};

export default nextConfig;
