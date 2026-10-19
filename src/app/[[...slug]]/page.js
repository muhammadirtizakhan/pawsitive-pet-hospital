import { headers } from 'next/headers';
import { notFound } from 'next/navigation';
import { cache } from 'react';
import SiteMarkup from '@/components/SiteMarkup';
import { CLINIC, PAGE_SEO, CATEGORIES, SERVICES, categoryKey, productPath, plainText } from '@/lib/seo';
import { getSeoCatalog, productImage } from '@/lib/server/seoCatalog';
import { siteUrlFrom } from '@/lib/server/http';

export const dynamic = 'force-dynamic';
export const viewport = { themeColor: '#FF8A00' };
const PRIVATE = { '/cart': 'cart', '/wishlist': 'wishlist', '/orders': 'orders', '/checkout': 'checkout', '/payment': 'payment' };
const resolveRoute = cache(async path => {
  if (PAGE_SEO[path]) {
    const catalog = path === '/shop' ? await getSeoCatalog() : { products: [], available: true };
    return { ...PAGE_SEO[path], path, products: catalog.products, catalogAvailable: catalog.available };
  }
  if (PRIVATE[path]) return { page: PRIVATE[path], path, private: true, title: 'Your Account & Order | Pawsitive Clinic', description: 'Manage your shopping and order at Pawsitive Clinic.' };
  const category = /^\/shop\/([^/]+)$/.exec(path)?.[1];
  if (category && CATEGORIES[category]) {
    const catalog = await getSeoCatalog();
    return { ...CATEGORIES[category], page: 'shop', path, category, products: catalog.products.filter(p => categoryKey(p.category?.name) === category), catalogAvailable: catalog.available };
  }
  const serviceKey = /^\/services\/([^/]+)$/.exec(path)?.[1];
  if (serviceKey && SERVICES[serviceKey]) return { ...SERVICES[serviceKey], page: 'service-detail', path, service: SERVICES[serviceKey] };
  const id = /^\/products\/([0-9a-f-]{36})$/i.exec(path)?.[1];
  if (id) {
    const catalog = await getSeoCatalog();
    if (!catalog.available) throw new Error('Product catalogue temporarily unavailable');
    const product = catalog.products.find(p => p.id === id.toLowerCase());
    if (!product) return null;
    const description = plainText(product.base_description) || `View ${product.name} at Pawsitive Clinic, Karachi. Check current price, weight and options. Availability is confirmed before payment.`;
    return { path, page: 'product-detail', product, title: `${product.name} | Pawsitive Clinic Karachi`, description: description.slice(0, 170) };
  }
  return null;
});
async function routeFor(params) { const { slug = [] } = await params; return resolveRoute('/' + slug.join('/')); }
async function origin() { const h = await headers(); return siteUrlFrom(n => h.get(n)); }
export async function generateMetadata({ params }) {
  const route = await routeFor(params);
  if (!route) return { title: 'Page Not Found | Pawsitive Clinic', robots: { index: false, follow: true } };
  const site = await origin(), url = site + route.path;
  const preview = Boolean(process.env.VERCEL_ENV && process.env.VERCEL_ENV !== 'production');
  const image = route.product ? productImage(route.product) || CLINIC.image : CLINIC.image;
  return {
    metadataBase: new URL(site), title: route.title, description: route.description,
    alternates: { canonical: url },
    robots: { index: !route.private && !preview, follow: !route.private },
    openGraph: { type: 'website', locale: 'en_PK', siteName: CLINIC.name, title: route.title, description: route.description, url, images: [{ url: image, alt: route.product?.name || CLINIC.name }] },
    twitter: { card: 'summary', title: route.title, description: route.description, images: [image] }
  };
}
export default async function Page({ params }) {
  const route = await routeFor(params);
  if (!route) notFound();
  const site = await origin(), url = site + route.path;
  const business = { '@type': 'VeterinaryCare', '@id': `${site}/#clinic`, name: CLINIC.name, url: `${site}/`, image: CLINIC.image, telephone: CLINIC.telephone, email: CLINIC.email,
    address: { '@type': 'PostalAddress', streetAddress: CLINIC.streetAddress, addressLocality: CLINIC.locality, addressRegion: 'Sindh', postalCode: CLINIC.postalCode, addressCountry: CLINIC.country }, sameAs: CLINIC.sameAs };
  const graph = [business, { '@type': 'WebSite', '@id': `${site}/#website`, url: `${site}/`, name: CLINIC.name, publisher: { '@id': business['@id'] } },
    { '@type': route.page === 'shop' ? 'CollectionPage' : 'WebPage', '@id': `${url}#page`, url, name: route.title, description: route.description, isPartOf: { '@id': `${site}/#website` }, about: { '@id': business['@id'] } }];
  if (route.path !== '/' && !route.private) {
    const parent = route.product || route.category ? '/shop' : route.service ? '/services' : null;
    const crumbs = [{ '@type': 'ListItem', position: 1, name: 'Home', item: `${site}/` }];
    if (parent) crumbs.push({ '@type': 'ListItem', position: 2, name: parent === '/shop' ? 'Shop' : 'Services', item: site + parent });
    crumbs.push({ '@type': 'ListItem', position: crumbs.length + 1, name: route.product?.name || route.heading || route.title.split(' | ')[0], item: url });
    graph.push({ '@type': 'BreadcrumbList', itemListElement: crumbs });
  }
  if (route.service) graph.push({ '@type': 'Service', name: route.heading, description: route.description, url, provider: { '@id': business['@id'] }, areaServed: { '@type': 'City', name: 'Karachi' } });
  if (route.products?.length) graph.push({ '@type': 'ItemList', itemListElement: route.products.map((p,i) => ({ '@type': 'ListItem', position: i + 1, name: p.name, url: site + productPath(p) })) });
  if (route.product) {
    const p = route.product, prices = [p.price, ...(p.variants || []).map(v => v.price)].filter(v => v !== null && v !== '' && Number.isFinite(Number(v)) && Number(v) > 0).map(Number);
    const product = { '@type': 'Product', '@id': `${url}#product`, name: p.name, sku: p.id, url, description: plainText(p.base_description) || route.description };
    const image = productImage(p); if (image) product.image = [image];
    if (p.brand) product.brand = { '@type': 'Brand', name: p.brand };
    // Active catalogue status does not prove stock. Do not invent InStock or delivery dates.
    if (prices.length) product.offers = { '@type': 'AggregateOffer', priceCurrency: 'PKR', lowPrice: Math.min(...prices).toFixed(2), highPrice: Math.max(...prices).toFixed(2), url, seller: { '@id': business['@id'] } };
    graph.push(product);
  }
  return <>
    {!route.private && <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({ '@context': 'https://schema.org', '@graph': graph }).replace(/</g, '\\u003c') }} />}
    <SiteMarkup initialPage={route.page} category={route.category || ''} initialProducts={route.products || []} initialProduct={route.product || null} service={route.service || null} catalogAvailable={route.catalogAvailable !== false} />
  </>;
}
