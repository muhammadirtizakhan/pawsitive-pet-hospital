import { headers } from 'next/headers';
import SiteMarkup from '@/components/SiteMarkup';
import { siteUrlFrom } from '@/lib/server/http';

// The old server answered "/" and every unknown address with the same single page - kept as is.
export const dynamic = 'force-dynamic';

const TITLE = 'Pawsitive Clinic | Pet Doctor & Pet Store in Karachi';
const DESCRIPTION =
  'Trusted veterinary care in Karachi: checkups, surgeries and grooming, plus a pet store for food and accessories. Order online from Pawsitive Clinic.';
const OG_DESCRIPTION = 'Veterinary care, grooming and a pet store in Karachi. Order pet food and accessories online.';
const OG_IMAGE = 'https://images.unsplash.com/photo-1548199973-03cce0bbc87b?w=1200&q=80';

async function currentSiteUrl() {
  const h = await headers();
  return siteUrlFrom(name => h.get(name));
}

export async function generateMetadata() {
  const siteUrl = await currentSiteUrl();
  return {
    title: TITLE,
    description: DESCRIPTION,
    alternates: { canonical: `${siteUrl}/` },
    openGraph: {
      type: 'website',
      siteName: 'Pawsitive Clinic',
      title: TITLE,
      description: OG_DESCRIPTION,
      url: `${siteUrl}/`,
      images: [OG_IMAGE]
    },
    twitter: { card: 'summary_large_image' }
  };
}

export const viewport = { themeColor: '#FF8A00' };

export default async function Page() {
  const siteUrl = await currentSiteUrl();
  const businessMarkup = {
    '@context': 'https://schema.org',
    '@type': 'VeterinaryCare',
    name: 'Pawsitive Clinic',
    url: `${siteUrl}/`,
    image: OG_IMAGE,
    telephone: '+923343601699',
    email: 'maazdvm.262@gmail.com',
    address: { '@type': 'PostalAddress', addressLocality: 'Karachi', addressCountry: 'PK' }
  };
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(businessMarkup).replace(/</g, '\\u003c') }}
      />
      <SiteMarkup />
    </>
  );
}
