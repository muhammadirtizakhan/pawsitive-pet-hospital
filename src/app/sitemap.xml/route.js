import { siteUrlFrom } from '@/lib/server/http';
import { getSeoCatalog } from '@/lib/server/seoCatalog';
import { publicPaths, productPath } from '@/lib/seo';
export const dynamic = 'force-dynamic';
const xml = value => String(value).replace(/[<>&"']/g, c => ({ '<':'&lt;', '>':'&gt;', '&':'&amp;', '"':'&quot;', "'":'&apos;' }[c]));
export async function GET(request) {
  const site = siteUrlFrom(name => request.headers.get(name));
  const catalog = await getSeoCatalog();
  // Do not publish a truncated successful sitemap during a database outage.
  if (!catalog.available) return new Response('Sitemap temporarily unavailable', { status: 503, headers: { 'Retry-After': '300', 'Cache-Control': 'no-store' } });
  const paths = [...new Set([...publicPaths(), ...catalog.products.map(productPath)])];
  const content = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${paths.map(path => `  <url><loc>${xml(site + path)}</loc></url>`).join('\n')}\n</urlset>\n`;
  return new Response(content, { headers: { 'Content-Type': 'application/xml; charset=utf-8', 'Cache-Control': 'public, max-age=0, s-maxage=300, stale-while-revalidate=300' } });
}
