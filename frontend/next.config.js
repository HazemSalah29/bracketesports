/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ['images.unsplash.com', 'cdn.jsdelivr.net'],
  },
  // Enable standalone output for production deployment
  output: process.env.NODE_ENV === 'production' ? 'standalone' : undefined,
  // For static export on shared hosting, you would use:
  // output: 'export',
  // trailingSlash: true,

  // Disable x-powered-by header for security
  poweredByHeader: false,
  // Enable compression
  compress: true,

  // Configure redirects and rewrites if needed
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: `${process.env.NEXT_PUBLIC_API_URL}/api/:path*`,
      },
    ];
  },
};

module.exports = nextConfig;
