export default function WishlistPage() {
  return (
    <div className="page-content" id="page-wishlist">
      <section className="wishlist-section">
        <div className="cart-page-header">
          <h2>My Wishlist</h2>
          <span className="cart-item-count" id="wishlistCount">
            0 items
          </span>
        </div>
        <div className="wishlist-grid" id="wishlistItems"></div>
      </section>
    </div>
  );
}
