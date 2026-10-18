export default function ShopPage() {
  return (
    <div className="page-content" id="page-shop">
      <div className="shop-page-wrapper">
        <aside className="shop-sidebar">
          <div className="sidebar-title">
            <i className="fa-solid fa-sliders-h"></i>
            Filters
          </div>
          <div className="sidebar-section">
            <h4>Categories</h4>
            <div className="filter-group" id="shopCategoryFilters">
              <span className="filter-empty">Loading categories...</span>
            </div>
          </div>
          <div className="sidebar-section">
            <h4>Price Range</h4>
            <div className="filter-group">
              <div className="price-label">
                <span>Rs 0</span>
                <span id="priceRangeMax">Rs 0</span>
              </div>
              <input
                type="range"
                id="shopPriceRange"
                min="0"
                max="0"
                defaultValue="0"
                step="0.01"
                aria-label="Maximum product price"
              />
              <div className="price-filter-value">
                {'Up to '}
                <output id="priceFilterValue">Rs 0</output>
              </div>
            </div>
          </div>
        </aside>
        <div className="shop-products-grid">
          <div className="products-header">
            <div>
              <h2>Pet Products</h2>{' '}
              <span className="product-count" id="shopProductCount">
                0 products
              </span>
            </div>
            <select className="sort-select" id="shopSortSelect" aria-label="Sort products">
              <option value="featured">Sort by: Featured</option>
              <option value="price-asc">Price: Low to High</option>
              <option value="price-desc">Price: High to Low</option>
              <option value="newest">Newest First</option>
              <option value="best-selling">Best Selling</option>
            </select>
          </div>
          <div className="products-row" id="shopProductsRow"></div>
        </div>
      </div>
    </div>
  );
}
