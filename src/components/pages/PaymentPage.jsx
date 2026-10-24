'use client';

export default function PaymentPage({ active = false }) {
  const contactStyle = {
    color: '#FF7A00',
    fontWeight: 600,
    textDecoration: 'underline',
    textUnderlineOffset: '3px'
  };

  function contactMaaz() {
    const orderId = document
      .getElementById('paymentOrderId')
      ?.textContent?.trim();

    const message =
      orderId && orderId !== '—'
        ? `Hello Maaz, I need assistance with my order ${orderId}.`
        : 'Hello Maaz, I need assistance with my order.';

    window.open(
      `https://wa.me/923343601699?text=${encodeURIComponent(message)}`,
      '_blank',
      'noopener,noreferrer'
    );
  }

  return (
    <div className={`page-content${active ? ' active' : ''}`} id="page-payment">
      <section className="payment-hero">
        <div className="payment-hero-overlay"></div>

        <div className="payment-hero-content">
          <span>What Happens Next</span>

          <h1>Your Order &amp; Payment Guide</h1>

          <p>
            Thank you for placing your order. We will check product
            availability first. Please wait for our order confirmation
            before making your payment.
          </p>
        </div>
      </section>

      <section className="payment-section">
        <div className="payment-container">
          <div className="payment-card">
            <div className="payment-header">
              <div className="payment-status">
                <i className="fa-solid fa-circle-info"></i>
                Order &amp; Payment Steps
              </div>

              <div className="payment-order">
                <span>Order ID</span>{' '}
                <strong id="paymentOrderId">—</strong>
              </div>
            </div>

            <div className="payment-instructions">
              <h4>Please Follow These Steps</h4>

              <div className="instruction-step">
                <div className="step-number">1</div>

                <div className="step-content">
                  <h5>Wait for Availability Confirmation</h5>

                  <p>
                    Our team will first check the availability of your
                    ordered products. You will receive an order
                    confirmation update once availability has been
                    checked.
                    {' '}
                    <strong>
                      Please do not make payment before your order
                      is confirmed.
                    </strong>
                  </p>
                </div>
              </div>

              <div className="instruction-step">
                <div className="step-number">2</div>

                <div className="step-content">
                  <h5>Make Payment After Confirmation</h5>

                  <p>
                    Your order total is{' '}
                    <strong id="paymentAmount">Rs 0.00</strong>.
                    Once your order is confirmed, make payment using
                    the payment method and account details provided
                    by Maaz, our clinic administrator.
                    If you have not received the payment details,
                    contact Maaz before transferring any money.
                  </p>
                </div>
              </div>

              <div className="instruction-step">
                <div className="step-number">3</div>

                <div className="step-content">
                  <h5>Send Your Payment Screenshot to Maaz</h5>

                  <p>
                    After paying, send a clear screenshot of your
                    payment along with your Order ID{' '}
                    (<span id="refOrderId">—</span>) to{' '}
                    <strong>Maaz — Clinic Administrator</strong>{' '}
                    on WhatsApp:{' '}
                    <a
                      href="https://wa.me/923343601699"
                      target="_blank"
                      rel="noopener noreferrer"
                      style={contactStyle}
                    >
                      +92 371 2699800
                    </a>.
                    Attach the screenshot manually in your WhatsApp
                    conversation.
                  </p>
                </div>
              </div>

              <div className="instruction-step">
                <div className="step-number">4</div>

                <div className="step-content">
                  <h5>Wait for Payment Verification</h5>

                  <p>
                    Maaz will verify that your payment has been
                    received. Sending a screenshot does not
                    immediately mark your order as paid.
                    Please wait for verification, and do not pay
                    again simply because the status has not
                    updated yet.
                  </p>
                </div>
              </div>

              <div className="instruction-step">
                <div className="step-number">5</div>

                <div className="step-content">
                  <h5>Check Your Confirmation Updates</h5>

                  <p>
                    After your payment is verified, a payment
                    confirmation update will be sent by email
                    and/or WhatsApp. Please check your email
                    regularly, including your spam or junk folder.
                    WhatsApp messages may sometimes be delayed
                    or unavailable.
                  </p>
                </div>
              </div>

              <div className="instruction-step">
                <div className="step-number">6</div>

                <div className="step-content">
                  <h5>Track Your Order in My Orders</h5>

                  <p>
                    Visit the My Orders section on our website
                    to check your latest order and payment status.
                    Payment confirmation and delivery status are
                    separate updates. If you need help with your
                    delivery or cannot find your order, contact
                    Maaz with your Order ID.
                  </p>
                </div>
              </div>
            </div>

            <div className="payment-timing">
              <i className="fa-solid fa-circle-info"></i>

              <p>
                <strong>Keep checking your email and My Orders.</strong>
                {' '}
                If a confirmation message does not arrive, check
                your website order status and contact Maaz for
                assistance. A delayed message does not necessarily
                mean your payment has failed.
              </p>
            </div>

            <div className="payment-instructions">
              <h4>Need to Cancel an Order or Request a Refund?</h4>

              <p>
                Please contact{' '}
                <strong>Maaz — Clinic Administrator</strong>{' '}
                directly on{' '}
                <a
                  href="https://wa.me/923343601699"
                  target="_blank"
                  rel="noopener noreferrer"
                  style={contactStyle}
                >
                  WhatsApp: +92 371 2699800
                </a>
                {' '}or{' '}
                <a
                  href="tel:+923343601699"
                  style={contactStyle}
                >
                  call +92 371 2699800
                </a>.
                Share your Order ID and explain your request.
                Maaz will review it and guide you through the
                applicable cancellation or refund process.
                Submitting a request does not automatically
                cancel an order or issue a refund.
              </p>
            </div>

            <div
              className="payment-actions"
              style={{ flexWrap: 'wrap', gap: '12px' }}
            >
              <button
                type="button"
                className="btn-whatsapp"
                onClick={contactMaaz}
              >
                <i
                  className="fa-brands fa-whatsapp"
                  style={{ marginRight: '6px' }}
                ></i>
                WhatsApp Maaz
              </button>

              <button
                type="button"
                className="btn-home"
                onClick={() => window.showPage('orders')}
              >
                <i
                  className="fa-solid fa-box"
                  style={{ marginRight: '6px' }}
                ></i>
                My Orders
              </button>

              <button
                type="button"
                className="btn-home"
                onClick={() => window.showPage('shop')}
              >
                <i
                  className="fa-solid fa-cart-shopping"
                  style={{ marginRight: '6px' }}
                ></i>
                Continue Shopping
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
