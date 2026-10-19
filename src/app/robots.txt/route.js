import { siteUrlFrom } from '@/lib/server/http';
export const dynamic = 'force-dynamic';
export async function GET(request) {
  const site = siteUrlFrom(name => request.headers.get(name));
  const preview = Boolean(process.env.VERCEL_ENV && process.env.VERCEL_ENV !== 'production');
  const text = preview ? 'User-agent: *\nDisallow: /\n' : `User-agent: *\nAllow: /\nDisallow: /api/\n\nSitemap: ${site}/sitemap.xml\n`;
  // Account/cart routes carry noindex in HTML; leave them crawlable so the directive is visible.
  return new Response(text, { headers: { 'Content-Type': 'text/plain; charset=utf-8', 'Cache-Control': 'public, max-age=300' } });
}
