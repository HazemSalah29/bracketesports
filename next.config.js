/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ['images.unsplash.com', 'cdn.jsdelivr.net'],
  },
  // Enable standalone output for production deployment
  output: process.env.NODE_ENV === 'production' ? 'standalone' : undefined,

  // Disable x-powered-by header for security
  poweredByHeader: false,
  // Enable compression
  compress: true,

  // Remove rewrites since we're using Next.js API routes, not external backend
  // If you need external API rewrites later, uncomment and configure properly:
  // async rewrites() {
  //   return [
  //     {
  //       source: '/api/:path*',
  //       destination: `${process.env.NEXT_PUBLIC_API_URL}/api/:path*`,
  //     },
  //   ];
  // },
};

module.exports = nextConfig;
