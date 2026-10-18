'use client';

export default function CartPage() {
  return (
    <div className="page-content" id="page-cart">
      <section className="cart-hero">
        <div className="cart-hero-overlay"></div>
        <div className="cart-hero-content">
          <span>{'Review & Checkout'}</span>
          <h1>Your Shopping Cart</h1>
          <p>
            Take a moment to review the items you've selected for your pet. Adjust quantities, remove anything
            you don't need, and proceed whenever you're ready for a smooth and secure checkout.
          </p>
        </div>
      </section>
      <section className="cart-section">
        <div className="cart-page-header">
          <h2>Shopping Cart</h2>
          <span className="cart-item-count" id="cartItemCount">
            0 items
          </span>
        </div>
        <div className="cart-container">
          <div className="cart-items" id="cartItems"></div>
          <div className="cart-summary">
            <h3>Order Summary</h3>
            <div className="summary-row">
              <span>Subtotal</span>
              <span id="cartSubtotal">Rs 0.00</span>
            </div>
            <div className="summary-row">
              <span>Shipping</span>
              <span>Free</span>
            </div>
            <div className="summary-divider"></div>
            <div className="summary-row total">
              <span>Total</span>
              <span id="cartTotal">Rs 0.00</span>
            </div>{' '}
            <button className="checkout-btn" onClick={() => window.proceedToCheckout()}>
              <i className="fa-solid fa-lock" style={{ marginRight: '8px' }}></i>
              Proceed to Checkout
            </button>{' '}
            <div className="cart-secure-note">
              <i className="fa-solid fa-shield-halved"></i>
              Secure checkout guaranteed
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
