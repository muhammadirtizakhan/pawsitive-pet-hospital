import { fileURLToPath } from 'node:url';

/** @type {import('next').NextConfig} */
const nextConfig = {
  turbopack: { root: fileURLToPath(new URL('.', import.meta.url)) },
  poweredByHeader: false, // same as app.disable('x-powered-by') in the old Express server
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' }
        ]
      }
    ];
  },
  async redirects() {
    // old server: GET /index.html -> 301 /
    return [{ source: '/index.html', destination: '/', statusCode: 301 }];
  }
};

export default nextConfig;
