# Pawsitive website SEO patch — 19 October 2026

This patch is based on the uploaded `pawsitive-pet-hospital-main.zip`.
It contains only changed/new website files, plus this guide, a keyword map and the exact file list.
Apply the complete patch together: page rendering, browser navigation and metadata now share real URLs.

## Apply to the WEBSITE repository

1. Keep a backup or commit your current working website first.
2. Extract this ZIP into the existing website project root, where `package.json` is located.
3. MERGE the `src` and `public` folders and overwrite matching files. Do not delete or replace the whole existing folders. All other project files must remain.
4. The patch also replaces the root `next.config.mjs`.
5. No package or lockfile changes are needed. Keep your existing dependencies and environment variables.
6. In the website's Vercel project, set Production `SITE_URL` to:

   ```text
   https://pawsitive-pet-hospital.vercel.app
   ```

   Use the stable public production address, not a deployment-specific preview URL. No trailing path is needed.
7. Use your own local existing website environment configuration. Run:

   ```powershell
   npm run build
   npm run dev
   ```

8. Check the pages and shopping flow listed below. Then commit/push the website yourself:

   ```powershell
   git add .
   git commit -m "Improve website SEO and crawlable pages"
   git push
   ```

9. Wait for the website's new Production deployment to become Ready.

The dashboard and WhatsApp agent do not receive this patch. No SQL migration is required.

## Public URLs

- `/` — clinic in Model Colony, Malir, Karachi
- `/services` — existing services overview
- `/services/cat-grooming` — confirmed grooming options, preparation and booking FAQs
- `/services/cat-boarding` — boarding explanation, booking and preparation FAQs
- `/services/lab-tests-xray` — blood tests and X-ray information
- `/shop` — general pet products
- `/shop/cat-food` — cat-food catalogue and introduction
- `/shop/dog-food` — dog-food catalogue and introduction
- `/shop/pet-accessories` — accessories catalogue and introduction
- `/shop/other-animals` — other supplies
- `/products/ACTUAL-PRODUCT-UUID` — active product details, price, weight and options
- `/guide` — existing ordering/payment guide
- `/robots.txt`
- `/sitemap.xml`

About and Contact remain sections of the homepage, linked with real anchors.
Cart, wishlist, checkout, orders and payment routes have noindex metadata and are excluded from the sitemap.
Unknown page URLs and missing/inactive product URLs return 404; catalogue failures do not falsely classify existing products as deleted.

## What changed

- Public page navigation uses real links and document navigation. Metadata, canonical URLs and visible initial page content now match the requested URL.
- Only the requested screen is server rendered. After hydration, the existing shopping screens mount before the existing behaviour script starts. Small `active` prop changes in cart/checkout/order/payment/wishlist/guide components support this shared shell; their business logic was not rewritten.
- Shop/category pages contain server-rendered product names and crawlable product links; individual product pages contain server-rendered details.
- Active products are read through the existing public Supabase client. Only public product fields are passed to the browser. Product updates and the existing live API refresh remain available.
- Unique page titles, descriptions, self-referencing canonicals, Open Graph and Twitter metadata.
- VeterinaryCare, WebSite, WebPage/CollectionPage, BreadcrumbList, Service, ItemList and Product structured data where relevant.
- Product offers use actual catalogue prices in PKR. Active status is not treated as proof of stock; no invented InStock, delivery dates, reviews or ratings are added.
- No keyword-stuffing meta-keywords tag. Keywords are integrated into useful visible content, titles, headings and descriptive links.
- Homepage FAQ answers are in server HTML instead of being generated only in the browser. Conflicting hardcoded 24/7 hours in the old FAQ have been removed; current hours and charges require clinic confirmation.
- Grooming/boarding content uses confirmed services and avoids unconfirmed price, daycare, haircut or supervision promises.
- Homepage secondary headings use H2 while preserving their existing CSS appearance. Existing photographs and testimonial content were retained.
- Robots links to the current canonical sitemap; preview deployments are noindex and robots-disallowed.
- The sitemap includes public pages and active products. It contains no private orders/customer records and no fabricated last-modified dates. If the database is unavailable it returns 503 with Retry-After, instead of a misleading successful sitemap missing products.
- One SITE_URL controls metadata, JSON-LD, robots and sitemap origins. Arbitrary incoming Host headers cannot change the canonical website.

## Category matching

`src/lib/seo.js` contains `CATEGORIES` and their `matches` arrays. Current recognised category names include:

- Cat Food / Cat Foods
- Dog Food / Dog Foods
- Pet Accessories / Accessories / Pet Accessory
- Other Animals / Others / Other

Matching ignores case, repeated spaces, underscores and hyphens. If a dashboard category has a different name, add that exact normalised name to the corresponding `matches` array. Do not change database category IDs.

## Check after deployment

1. Open `/services/cat-grooming` and `/services/cat-boarding` directly and refresh each. The right screen should appear immediately.
2. Open `/shop/cat-food`. Check that the category matches your actual database name and shows the expected products.
3. Open a product from its link. Refresh; verify name, price, weight, flavour selection and add-to-cart.
4. Open the cart, change quantity, continue to checkout, and check login/My Orders using your normal test account. Actual checkout/payment notifications require your own controlled live test.
5. Check mobile Home, Shop, Product and Guide appearance.
6. Open View Source for a service/product page. Check its unique title, description, canonical, JSON-LD and visible product/service text.
7. Open `/robots.txt` and `/sitemap.xml`. Sitemap links must all use the stable Production website origin.
8. Open `/this-page-does-not-exist`: it should show the 404 page.
9. Run Google's Rich Results Test on a live product and clinic page and PageSpeed Insights on mobile. Rich-result eligibility is not a guarantee of display or ranking.
10. Confirm all published clinic hours, services and specialist procedures with Maaz. The existing overview still contains advanced service descriptions from your source; SEO cannot independently verify their availability.

## When the custom domain is purchased

Use the EXACT domain that you own; confirm its spelling before making changes. `www.example.com` below is only an example.

1. Add the chosen domain and its www/apex counterpart in Vercel > website project > Settings > Domains. Configure the DNS records Vercel displays and wait for valid HTTPS.
2. Choose one canonical version, for example `https://www.example.com`.
3. Change website Production `SITE_URL` to that exact origin and REDEPLOY. All metadata, schema, robots and sitemap URLs update from this setting.
4. The included `next.config.mjs` then activates permanent (308) redirects from `pawsitive-pet-hospital.vercel.app` and the alternate www/apex hostname to the chosen domain, preserving page paths. Vercel also needs both custom hostnames correctly attached to the project. The current Vercel-only deployment does not activate these custom-domain redirects.
5. In the DASHBOARD project change `STORE_URL` to the new website origin and redeploy the dashboard, if its templates use STORE_URL for customer links. If the dashboard domain stays the same, website DASHBOARD_URL, the Whapi webhook and the cron URL stay the same.
6. Search for the old website production hostname in any other email templates, manually entered links, chatbot knowledge or social profiles, and update actual website links. Do not blindly replace all Vercel addresses: the separate dashboard host is still needed.
7. Verify the old domain redirects to the same path on the new domain. Test homepage, services, a category and a product, including query strings.
8. Verify the new domain in Google Search Console; submit `https://YOUR-DOMAIN/sitemap.xml`. If the old property has been indexed and the move is eligible, use Search Console Change of Address. Keep old-host redirects active.
9. Update Google Business Profile, Facebook/Instagram website links and other business listings to the new website address.

No manual editing of every canonical or sitemap URL is needed. Changing a domain requires DNS, HTTPS, redeployment and redirect checks in addition to changing SITE_URL.

## Validation and remaining work

Performed locally with a mock public catalogue, without using customer credentials or placing live orders:

- Next.js 16.3.6 production builds with Node 22.23.3 and Node 24.19.0.
- HTTP checks for Home, services, service detail pages, shop/category, Guide, product and private routes.
- Unique metadata/canonicals; one server-rendered screen and H1 per requested public page; product text/links/prices without JavaScript.
- Unknown/missing product 404; private pages noindex.
- Sitemap XML parsing and expected public/product URLs; robots sitemap link.
- React hydration and the legacy behaviour script in a simulated DOM: initial screen selection, FAQ duplication prevention, category filter/sort, product flavour/weight, add-to-cart and cart local storage, Boarding and Guide.
- Future custom-domain redirect configuration.

A real browser visual/mobile test and live provider/database/checkout test were not completed here. Browser installation was unavailable in this environment. No Lighthouse score, search-volume estimate, indexing outcome or ranking percentage is claimed.

The keyword exports contain suggestions only, not verified search volume or organic difficulty. Source attribution and priorities are in SEO-KEYWORD-MAP.csv.

Next off-site work: Google Search Console, Google Business Profile with verified NAP/hours, genuine customer reviews, indexing checks, useful veterinarian-reviewed content and performance monitoring. This patch completes the listed code/content work; it is not a measurable “70% of rankings” milestone.

Official references:
- https://developers.google.com/search/docs/appearance/structured-data/product-snippet
- https://developers.google.com/search/docs/appearance/structured-data/local-business
- https://developers.google.com/search/docs/crawling-indexing/sitemaps/build-sitemap
- https://developers.google.com/search/docs/crawling-indexing/links-crawlable
