import { fileURLToPath } from 'node:url';

function canonicalRedirects() {
  if (!process.env.SITE_URL) return [];
  const canonical = new URL(process.env.SITE_URL);
  if (canonical.hostname.endsWith('.vercel.app') || ['localhost', '127.0.0.1'].includes(canonical.hostname)) return [];
  // Activates only after SITE_URL is changed to the purchased custom domain and redeployed.
  const alias = canonical.hostname.startsWith('www.') ? canonical.hostname.slice(4) : `www.${canonical.hostname}`;
  return ['pawsitive-pet-hospital.vercel.app', alias].filter(host => host !== canonical.hostname).map(host => ({
    source: '/:path*',
    has: [{ type: 'host', value: host.replace(/\./g, '\\.') }],
    destination: `${canonical.origin}/:path*`,
    permanent: true
  }));
}

/** @type {import('next').NextConfig} */
const nextConfig = {
  turbopack: { root: fileURLToPath(new URL('.', import.meta.url)) },
  poweredByHeader: false,
  async headers() {
    return [{ source: '/:path*', headers: [
      { key: 'X-Content-Type-Options', value: 'nosniff' },
      { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' }
    ] }];
  },
  async redirects() {
    return [...canonicalRedirects(), { source: '/index.html', destination: '/', statusCode: 301 }];
  }
};
export default nextConfig;
