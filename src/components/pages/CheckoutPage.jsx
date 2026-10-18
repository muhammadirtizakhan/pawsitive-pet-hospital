'use client';

export default function CheckoutPage() {
  return (
    <div className="page-content" id="page-checkout">
      <section className="checkout-hero">
        <div className="checkout-hero-overlay"></div>
        <div className="checkout-hero-content">
          <span>Almost There</span>
          <h1>Complete Your Order</h1>
          <p>
            Just a few details away from getting everything your pet needs delivered right to your door. Fill
            in your shipping information below to finish placing your order.
          </p>
        </div>
      </section>
      <section className="checkout-section">
        <div className="checkout-container">
          <div className="checkout-form">
            <h3>Shipping Details</h3>
            <form
              onSubmit={(e) => {
                const event = e.nativeEvent;
                window.placeOrder(event);
              }}
            >
              <div className="form-group">
                <label>Full Name</label>{' '}
                <input type="text" id="checkoutName" placeholder="John Doe" required />
              </div>
              <div className="form-group">
                <label>Email Address</label>{' '}
                <input type="email" id="checkoutEmail" placeholder="you@example.com" required />
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label>Phone Number</label>{' '}
                  <input type="tel" id="checkoutPhone" placeholder="+92 300 1234567" required />
                </div>
                <div className="form-group">
                  <label>City</label> <input type="text" id="checkoutCity" placeholder="Karachi" required />
                </div>
              </div>
              <div className="form-group">
                <label>Delivery Address</label>{' '}
                <textarea
                  id="checkoutAddress"
                  rows="3"
                  placeholder="House #, Street, Area"
                  required
                ></textarea>
              </div>{' '}
              <button type="submit" className="place-order-btn">
                <i className="fa-solid fa-bag-shopping" style={{ marginRight: '8px' }}></i>
                Place Order
              </button>{' '}
              <p className="secure-note">
                <i className="fa-solid fa-shield-halved"></i>
                {' Your information is safe and secure with us.'}
              </p>
            </form>
          </div>
          <div className="checkout-summary">
            <h3>Order Summary</h3>
            <div id="checkoutItems"></div>
            <div className="summary-row total" style={{ marginTop: '12px' }}>
              <span>Total</span>
              <span id="checkoutTotal">Rs 0.00</span>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
