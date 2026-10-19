'use client';

import { CATEGORIES, categoryKey } from '@/lib/seo';

export default function ProductDetailPage({ active = false, product = null }) {
  const images = [...(product?.images || [])].sort((a,b) => Number(b.is_primary) - Number(a.is_primary) || (a.sort_order || 0) - (b.sort_order || 0));
  const image = images.find(i => /^https?:\/\//i.test(i.image_url || ''))?.image_url;
  const key = categoryKey(product?.category?.name);
  const description = String(product?.base_description || '').split(/\n|\|/).map(s => s.trim()).filter(Boolean);
  const price = Number(product?.price ?? product?.variants?.[0]?.price);
  return (
    <div className={`page-content${active ? ' active' : ''}`} id="page-product-detail">
      <section className="product-detail-section">
        {product && <nav className="seo-breadcrumb" aria-label="Breadcrumb"><a href="/">Home</a><span>/</span><a href="/shop">Shop</a>{key && <><span>/</span><a href={`/shop/${key}`}>{CATEGORIES[key].name}</a></>}<span>/</span><span>{product.name}</span></nav>}
        <button className="pd-back-btn" onClick={() => window.showPage('shop')}>
          <i className="fa-solid fa-arrow-left"></i>
          Back to Shop
        </button>{' '}
        <div className="product-detail-grid">
          <div className="product-detail-image-col">
            <div className="product-detail-image">
              <img
                loading="lazy"
                decoding="async"
                id="pdImage"
                src={image || "data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEAAAICTAEAOw=="}
                alt={product?.name || "Product"}
              />
            </div>
            <div className="pd-thumbnails" id="pdThumbnails"></div>
          </div>
          <div className="product-detail-info">
            <span className="product-detail-tag" id="pdTag"></span> <h1 id="pdName">{product?.name}</h1>
            <div className="pd-category" id="pdCategory">{product?.category?.name}</div>
            <div className="product-detail-price" id="pdPrice">{product && Number.isFinite(price) && price > 0 ? `Rs ${price.toFixed(2)}` : ""}</div>
            <div className="product-detail-weight" id="pdWeight" style={{display:product?.weight ? 'block' : 'none',fontWeight:600,margin:'4px 0 10px'}}>{product?.weight}</div>
            <ul className="product-detail-desc" id="pdDesc">{description.map((text,i) => <li key={i}>{text}</li>)}</ul>
            <div className="product-detail-variants" id="pdVariants">{product?.variants?.length > 0 && <p>Options: {product.variants.map(v => [v.variant_value, v.weight].filter(Boolean).join(' · ')).join('; ')}</p>}</div>
            <p className="seo-order-note">Availability is confirmed by the clinic before payment. <a href="/guide">Read the ordering and payment guide</a>.</p>
            <div className="product-detail-actions">
              <div className="pd-qty">
                <button onClick={() => window.pdChangeQty(-1)}>−</button>
                <span id="pdQty">1</span>
                <button onClick={() => window.pdChangeQty(1)}>+</button>
              </div>
              <button className="product-detail-addcart" onClick={() => window.pdAddToCart()}>
                <i className="fa-solid fa-cart-plus" style={{ marginRight: '8px' }}></i>
                Add to Cart
              </button>
              <button
                className="pd-wishlist-btn"
                id="pdWishlistBtn"
                onClick={() => window.pdToggleWishlist()}
              >
                <i className="fa-regular fa-heart"></i>
                Add to Wishlist
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
