'use client';

export default function ProductDetailPage() {
  return (
    <div className="page-content" id="page-product-detail">
      <section className="product-detail-section">
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
                src="data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw=="
                alt="Product"
              />
            </div>
            <div className="pd-thumbnails" id="pdThumbnails"></div>
          </div>
          <div className="product-detail-info">
            <span className="product-detail-tag" id="pdTag"></span> <h1 id="pdName"></h1>
            <div className="pd-category" id="pdCategory"></div>
            <div className="product-detail-price" id="pdPrice"></div>
            <div className="product-detail-weight" id="pdWeight" style={{display:'none',fontWeight:600,margin:'4px 0 10px'}}></div>
            <ul className="product-detail-desc" id="pdDesc"></ul>
            <div className="product-detail-variants" id="pdVariants"></div>
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
