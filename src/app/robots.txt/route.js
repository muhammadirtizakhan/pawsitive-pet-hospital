import { siteUrlFrom } from '@/lib/server/http';

export const dynamic = 'force-dynamic';

export async function GET(request) {
  const siteUrl = siteUrlFrom(name => request.headers.get(name));
  return new Response(`User-agent: *\nAllow: /\nDisallow: /api/\n\nSitemap: ${siteUrl}/sitemap.xml\n`, {
    headers: { 'Content-Type': 'text/plain; charset=utf-8' }
  });
}
