import { CATEGORIES, productPath } from '@/lib/seo';

function imageFor(p) {
  const images = [...(p.images || [])].sort((a,b) => Number(b.is_primary) - Number(a.is_primary) || (a.sort_order || 0) - (b.sort_order || 0));
  return images.find(i => /^https?:\/\//i.test(i.image_url || ''))?.image_url || '';
}
export default function ShopPage({ active = false, category = '', products = [], catalogAvailable = true }) {
  const info = CATEGORIES[category];
  return (
    <div className={`page-content${active ? ' active' : ''}`} id="page-shop">
      <section className="seo-content seo-shop-intro">
        <nav className="seo-breadcrumb" aria-label="Breadcrumb"><a href="/">Home</a><span>/</span><a href="/shop">Shop</a>{info && <><span>/</span><span>{info.name}</span></>}</nav>
        <h1>{info?.heading || 'Pet Food and Accessories in Karachi'}</h1>
        <p>{info?.copy || 'Browse pet food and everyday supplies at Pawsitive Clinic in Model Colony, Karachi. Open a product to check current prices, flavours and weights. Our team confirms availability before you pay; see the ordering guide for the next steps.'}</p>
        <nav className="seo-link-list" aria-label="Shop categories">{Object.entries(CATEGORIES).map(([key,c]) => <a key={key} href={`/shop/${key}`} aria-current={category === key ? 'page' : undefined}>{c.name}</a>)}<a href="/guide">Ordering and payment guide</a></nav>
      </section>
      <div className="shop-page-wrapper">
        <aside className="shop-sidebar">
          <div className="sidebar-title"><i className="fa-solid fa-sliders-h"></i>Filters</div>
          <div className="sidebar-section"><h2 className="seo-filter-heading">Categories</h2><div className="filter-group" id="shopCategoryFilters"><span className="filter-empty">Filters load when the shop is ready.</span></div></div>
          <div className="sidebar-section"><h2 className="seo-filter-heading">Price Range</h2><div className="filter-group">
            <div className="price-label"><span>Rs 0</span><span id="priceRangeMax">Rs 0</span></div>
            <input type="range" id="shopPriceRange" min="0" max="0" defaultValue="0" step="0.01" aria-label="Maximum product price" />
            <div className="price-filter-value">Up to <output id="priceFilterValue">Rs 0</output></div>
          </div></div>
        </aside>
        <div className="shop-products-grid">
          <div className="products-header"><div><h2>{info?.name || 'Pet Products'}</h2><span className="product-count" id="shopProductCount">{products.length} listed products</span></div>
            <select className="sort-select" id="shopSortSelect" aria-label="Sort products"><option value="featured">Sort by: Featured</option><option value="price-asc">Price: Low to High</option><option value="price-desc">Price: High to Low</option><option value="newest">Newest First</option><option value="best-selling">Best Selling</option></select>
          </div>
          <div className="products-row" id="shopProductsRow">{products.map(p => {
            const image = imageFor(p), price = Number(p.price ?? p.variants?.[0]?.price);
            return <article className="product-card-v2 seo-product-card" key={p.id}>
              <a href={productPath(p)} className="product-card-v2-img">{image && <img src={image} alt={p.name} loading="lazy" decoding="async" width="600" height="600" />}</a>
              <div className="product-card-v2-body"><div className="product-card-v2-category">{p.category?.name}</div><h3><a href={productPath(p)}>{p.name}</a></h3><p className="product-card-v2-price">{Number.isFinite(price) && price > 0 ? `Rs ${price.toFixed(2)}` : 'Contact for price'}</p>{p.weight && <p>{p.weight}</p>}</div>
            </article>;
          })}{!products.length && <p className="seo-catalog-notice">{catalogAvailable ? 'No products are currently listed in this selection. Contact the clinic for availability.' : 'The catalogue is temporarily unavailable. The shop will retry in your browser; please contact the clinic if it remains unavailable.'}</p>}</div>
        </div>
      </div>
    </div>
  );
}
