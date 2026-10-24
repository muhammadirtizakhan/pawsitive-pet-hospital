'use client';

import { useState } from 'react';

// Replace this URL with your actual MP4 demo video later.
const DEMO_VIDEO_URL =
  'https://res.cloudinary.com/djaonuvzx/video/upload/v1792626254/pets_hospital_jpj4e4.mp4';

// Set this to false after adding your actual website tutorial.
const DEMO_IS_SAMPLE = true;

const steps = [
  {
    icon: 'fa-stethoscope',
    title: 'Explore Our Services',
    text:
      'Open Services to learn about veterinary care, laboratory testing, X-ray, grooming and boarding. Contact Maaz to confirm availability, charges and appointments.'
  },
  {
    icon: 'fa-bag-shopping',
    title: 'Find the Right Product',
    text:
      'Visit Shop and browse the available categories. Open a product to check its description, price, flavours and weights. Choose your preferred option before adding it to your cart.'
  },
  {
    icon: 'fa-cart-shopping',
    title: 'Review Your Cart',
    text:
      'Check your selected products, variants and quantities. Review the total before continuing to checkout.'
  },
  {
    icon: 'fa-address-card',
    title: 'Complete Checkout',
    text:
      'Enter your correct name, email, phone number and delivery address. Keep your Order ID after placing the order—you will need it for payment proof and support.'
  },
  {
    icon: 'fa-circle-check',
    title: 'Wait for Availability Confirmation',
    text:
      'Our team checks product availability first. Placing an order does not mean availability or payment has been confirmed. Wait for the confirmation update before paying.'
  },
  {
    icon: 'fa-box-open',
    title: 'Follow Your Order',
    text:
      'Open My Orders to see your latest order and payment status. If prompted, sign in to your account. For an order you cannot find, use the chatbot verification flow or contact Maaz.'
  }
];

const paymentSteps = [
  {
    title: 'Receive order confirmation',
    text:
      'Wait until the clinic confirms availability. Do not transfer payment before this confirmation.'
  },
  {
    title: 'Confirm payment details',
    text:
      'Use the account and payment method provided by Maaz. If anything is unclear, contact him before sending money.'
  },
  {
    title: 'Send your screenshot',
    text:
      'After paying, WhatsApp a clear payment screenshot and your Order ID to Maaz at +92 371 2699800. Attach the screenshot manually.'
  },
  {
    title: 'Allow time for verification',
    text:
      'The administrator checks that payment has arrived. A screenshot alone does not automatically mark the order as paid. Do not pay twice because an update is delayed.'
  },
  {
    title: 'Check your confirmation',
    text:
      'After verification, a payment confirmation update will be sent by email and/or WhatsApp. Check your inbox, spam folder and My Orders regularly.'
  }
];

const faqs = [
  {
    question: 'Should I pay immediately after checkout?',
    answer:
      'Please wait for the clinic to check availability and confirm your order. Then use the payment instructions provided by Maaz.'
  },
  {
    question: 'Where do I send my payment screenshot?',
    answer:
      'Send it to Maaz, Clinic Administrator, on WhatsApp at +92 371 2699800. Include your Order ID so the payment can be matched to your order.'
  },
  {
    question: 'I paid, but my status has not changed. What should I do?',
    answer:
      'Payment needs to be verified first. Check My Orders and your email. If you are concerned, contact Maaz with your Order ID and payment proof. Do not make another payment simply because the update is delayed.'
  },
  {
    question: 'Why does my order show Paid and Pending?',
    answer:
      'Payment status and order status describe different things. Paid means payment has been confirmed; Pending can mean fulfilment is still pending. Contact Maaz for a delivery update.'
  },
  {
    question: 'What if I do not receive a WhatsApp message?',
    answer:
      'Messaging services can sometimes be delayed or unavailable. Check your email, including spam or junk, and track the order in My Orders. Contact Maaz if you still need help.'
  },
  {
    question: 'How can the chatbot check my order?',
    answer:
      'Send your Order ID and checkout email together. If they match an order, a verification code is sent to that email. Enter the code in the website chat to check the order status. Never share your password.'
  },
  {
    question: 'How do I request cancellation or a refund?',
    answer:
      'Contact Maaz directly on +92 371 2699800 with your Order ID and request. He will review it and explain the applicable process. A request does not automatically cancel the order or issue a refund.'
  },
  {
    question: 'Can the chatbot book an appointment or diagnose my pet?',
    answer:
      'The chatbot can explain listed services and help you find information. Contact the clinic to arrange an appointment. Diagnosis and treatment decisions require a veterinarian.'
  }
];

export default function GuidePage({ active = false }) {
  const [playVideo, setPlayVideo] = useState(false);

  function navigate(page) {
    if (typeof window.showPage === 'function') {
      window.showPage(page);
    }
  }

  function openChat() {
    if (typeof window.openChatbot === 'function') {
      window.openChatbot();
    }
  }

  function jumpTo(id) {
    document.getElementById(id)?.scrollIntoView({
      behavior: 'smooth',
      block: 'start'
    });
  }

  return (
    <div className={`page-content${active ? ' active' : ''}`} id="page-guide">
      <div className="pg-guide">
        <section className="pg-hero">
          <div className="pg-wrap">
            <span className="pg-label">
              <i className="fa-solid fa-compass"></i>
              YOUR PAWSITIVE GUIDE
            </span>

            <h1>
              A little guidance.
              <br />
              <span>A smoother experience.</span>
            </h1>

            <p className="pg-intro">
              From choosing pet essentials to checking your order,
              here is how everything works at Pawsitive Clinic.
            </p>

            <div className="pg-actions">
              <button
                type="button"
                className="pg-button pg-primary"
                onClick={() => jumpTo('guide-start')}
              >
                Start Here
                <i className="fa-solid fa-arrow-right"></i>
              </button>

              <button
                type="button"
                className="pg-button pg-secondary"
                onClick={() => jumpTo('guide-video')}
              >
                <i className="fa-solid fa-circle-play"></i>
                Video Walkthrough
              </button>
            </div>

            <div className="pg-shortcuts">
              <button
                type="button"
                onClick={() => jumpTo('guide-payment')}
              >
                <i className="fa-solid fa-wallet"></i>
                Payment Guide
              </button>

              <button
                type="button"
                onClick={() => navigate('orders')}
              >
                <i className="fa-solid fa-box-open"></i>
                My Orders
              </button>

              <button type="button" onClick={openChat}>
                <i className="fa-solid fa-comments"></i>
                Ask the Chatbot
              </button>
            </div>
          </div>
        </section>

        <div className="pg-wrap">
          <section className="pg-section" id="guide-video">
            <div className="pg-video-layout">
              <div>
                <span className="pg-eyebrow">SEE HOW IT WORKS</span>
                <h2>Your website walkthrough</h2>

                <p className="pg-copy">
                  A dedicated space for a complete tour of shopping,
                  checkout, payment and order tracking.
                </p>

                <ul className="pg-checks">
                  <li>
                    <i className="fa-solid fa-check"></i>
                    Browse products and choose variants
                  </li>
                  <li>
                    <i className="fa-solid fa-check"></i>
                    Understand confirmation and payment
                  </li>
                  <li>
                    <i className="fa-solid fa-check"></i>
                    Find updates and contact support
                  </li>
                </ul>

                {DEMO_IS_SAMPLE && (
                  <p className="pg-sample-note">
                    The full Pawsitive tutorial is coming soon.
                    The video shown here is a sample preview.
                  </p>
                )}
              </div>

              <div className="pg-video-card">
                {playVideo ? (
                  <video
                    className="pg-video"
                    src={DEMO_VIDEO_URL}
                    controls
                    autoPlay
                    playsInline
                    preload="none"
                    aria-label={
                      DEMO_IS_SAMPLE
                        ? 'Sample preview video'
                        : 'Pawsitive website walkthrough'
                    }
                  >
                    Your browser does not support this video.
                  </video>
                ) : (
                  <button
                    type="button"
                    className="pg-video-cover"
                    onClick={() => setPlayVideo(true)}
                    aria-label={
                      DEMO_IS_SAMPLE
                        ? 'Play sample preview'
                        : 'Play website walkthrough'
                    }
                  >
                    <span className="pg-video-badge">
                      {DEMO_IS_SAMPLE
                        ? 'SAMPLE PREVIEW'
                        : 'WEBSITE WALKTHROUGH'}
                    </span>

                    <i
                      className="fa-solid fa-paw pg-video-paw"
                      aria-hidden="true"
                    ></i>

                    <span className="pg-play">
                      <i className="fa-solid fa-play"></i>
                    </span>

                    <span className="pg-video-caption">
                      {DEMO_IS_SAMPLE
                        ? 'Preview the video player'
                        : 'Watch the full guide'}
                      <small>
                        {DEMO_IS_SAMPLE
                          ? 'Full clinic tutorial coming soon'
                          : 'Get familiar with your next steps'}
                      </small>
                    </span>
                  </button>
                )}
              </div>
            </div>
          </section>

          <section className="pg-section" id="guide-start">
            <div className="pg-heading">
              <span className="pg-eyebrow">START WITH THE BASICS</span>
              <h2>From browsing to your doorstep</h2>
              <p>
                Follow these steps and keep your Order ID handy.
              </p>
            </div>

            <div className="pg-grid">
              {steps.map((step, index) => (
                <article className="pg-card" key={step.title}>
                  <div className="pg-card-top">
                    <span className="pg-icon">
                      <i className={`fa-solid ${step.icon}`}></i>
                    </span>
                    <span className="pg-index">
                      {String(index + 1).padStart(2, '0')}
                    </span>
                  </div>

                  <h3>{step.title}</h3>
                  <p>{step.text}</p>
                </article>
              ))}
            </div>

            <div className="pg-actions">
              <button
                type="button"
                className="pg-button pg-primary"
                onClick={() => navigate('shop')}
              >
                Browse the Shop
                <i className="fa-solid fa-arrow-right"></i>
              </button>

              <button
                type="button"
                className="pg-button pg-secondary"
                onClick={() => navigate('services')}
              >
                Explore Services
              </button>
            </div>
          </section>

          <section className="pg-section" id="guide-payment">
            <div className="pg-payment">
              <div className="pg-heading">
                <span className="pg-eyebrow">PAYMENT, MADE CLEAR</span>
                <h2>Confirmation first. Payment next.</h2>
                <p>
                  Please wait for availability confirmation before
                  transferring any money.
                </p>
              </div>

              <div className="pg-payment-list">
                {paymentSteps.map((step, index) => (
                  <article
                    className="pg-payment-step"
                    key={step.title}
                  >
                    <span className="pg-step-number">
                      {index + 1}
                    </span>

                    <div>
                      <h3>{step.title}</h3>
                      <p>{step.text}</p>
                    </div>
                  </article>
                ))}
              </div>

              <div className="pg-notice">
                <i className="fa-solid fa-envelope-open-text"></i>
                <p>
                  <strong>Keep an eye on your email.</strong>{' '}
                  WhatsApp updates can be delayed. Check your
                  inbox, spam folder and website order status
                  even when a message has not arrived.
                </p>
              </div>
            </div>
          </section>

          <section className="pg-section">
            <div className="pg-support">
              <div>
                <span className="pg-eyebrow">WE’RE HERE TO HELP</span>
                <h2>Contact Us</h2>
                <p className="pg-support-role">
                  Clinic Administrator · +92 371 2699800
                </p>

                <p className="pg-copy">
            <p className="pg-copy">
  For payment enquiries, order updates, cancellations or
  refund requests, contact our clinic team. Please include
  your Order ID so we can assist you.
</p>
                </p>

                <div className="pg-actions">
                  <a
                    className="pg-button pg-primary"
                    href="https://wa.me/923343601699"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <i className="fa-brands fa-whatsapp"></i>
                    WhatsApp here
                  </a>

                  <a
                    className="pg-button pg-secondary"
                    href="tel:+923343601699"
                  >
                    <i className="fa-solid fa-phone"></i>
                    Call Maaz
                  </a>
                </div>
              </div>

              <aside className="pg-support-note">
                <span className="pg-icon">
                  <i className="fa-solid fa-receipt"></i>
                </span>
                <h3>Refunds &amp; cancellations</h3>
                <p>
          Cancellation and refund requests are reviewed by our clinic team.
Submitting a request does not automatically cancel your order
or confirm a refund. Our team will guide you through the next steps.
                </p>
              </aside>
            </div>
          </section>

          <section className="pg-section">
            <div className="pg-heading">
              <span className="pg-eyebrow">QUICK ANSWERS</span>
              <h2>A few things you might be wondering</h2>
            </div>

            <div className="pg-faqs">
              {faqs.map(faq => (
                <details className="pg-faq" key={faq.question}>
                  <summary>{faq.question}</summary>
                  <p>{faq.answer}</p>
                </details>
              ))}
            </div>
          </section>

          <section className="pg-final">
            <span className="pg-icon">
              <i className="fa-solid fa-paw"></i>
            </span>
            <h2>Ready for your next step?</h2>
            <p>
              Browse the shop, check your order or ask us a question.
            </p>

            <div className="pg-actions">
              <button
                type="button"
                className="pg-button pg-primary"
                onClick={() => navigate('shop')}
              >
                Shop Now
              </button>

              <button
                type="button"
                className="pg-button pg-secondary"
                onClick={() => navigate('orders')}
              >
                My Orders
              </button>
            </div>
          </section>
        </div>
      </div>

      <style jsx>{`
        .pg-guide {
          --pg-orange: #ff7a00;
          --pg-dark: #232323;
          --pg-muted: #666;
          color: var(--pg-dark);
          background: #fff;
          font-family: inherit;
        }

        .pg-guide * {
          box-sizing: border-box;
        }

        .pg-wrap {
          width: min(1140px, 90%);
          margin: 0 auto;
        }

        .pg-hero {
          padding: 140px 0 65px;
          background:
            radial-gradient(
              circle at 90% 15%,
              #ffe1bd 0,
              transparent 36%
            ),
            linear-gradient(135deg, #fff9f2, #fff);
          border-bottom: 1px solid #f5e8db;
        }

        .pg-label,
        .pg-eyebrow {
          color: #a84800;
          font-size: 12px;
          font-weight: 700;
          letter-spacing: 1.7px;
        }

        .pg-label {
          display: inline-flex;
          align-items: center;
          gap: 9px;
          padding: 10px 15px;
          background: #ffecd8;
          border-radius: 30px;
        }

        .pg-hero h1 {
          margin: 24px 0 18px;
          font-size: clamp(34px, 5vw, 62px);
          line-height: 1.12;
          letter-spacing: -1.7px;
          font-weight: 800;
        }

        .pg-hero h1 span {
          color: #c75900;
        }

        .pg-intro {
          max-width: 650px;
          font-size: 17px;
          line-height: 1.8;
          color: var(--pg-muted);
        }

        .pg-actions {
          display: flex;
          flex-wrap: wrap;
          align-items: center;
          gap: 12px;
          margin-top: 26px;
        }

        .pg-button {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 10px;
          min-height: 48px;
          padding: 13px 22px;
          border-radius: 12px;
          border: 1px solid transparent;
          font: inherit;
          font-size: 14px;
          font-weight: 600;
          text-decoration: none;
          cursor: pointer;
          transition: transform 0.2s, background 0.2s;
        }

        .pg-button:hover {
          transform: translateY(-2px);
        }

        .pg-primary {
          color: #201307;
          background: var(--pg-orange);
          box-shadow: 0 8px 20px #ff7a0026;
        }

        .pg-primary:hover {
          background: #ff922e;
        }

        .pg-secondary {
          color: var(--pg-dark);
          background: #fff;
          border-color: #e8dfd5;
        }

        .pg-secondary:hover {
          background: #fff6eb;
        }

        .pg-shortcuts {
          display: flex;
          flex-wrap: wrap;
          gap: 12px 24px;
          margin-top: 32px;
        }

        .pg-shortcuts button {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 5px 0;
          border: 0;
          background: transparent;
          color: #634a35;
          font: inherit;
          font-size: 13px;
          cursor: pointer;
        }

        .pg-shortcuts i {
          color: #bb5300;
        }

        .pg-section {
          padding: 55px 0;
          scroll-margin-top: 100px;
        }

        .pg-heading {
          margin-bottom: 28px;
        }

        .pg-guide h2 {
          margin: 12px 0 14px;
          font-size: clamp(25px, 3vw, 36px);
          line-height: 1.25;
          letter-spacing: -0.7px;
        }

        .pg-guide h3 {
          margin: 0 0 10px;
          font-size: 18px;
          line-height: 1.4;
        }

        .pg-heading p,
        .pg-copy,
        .pg-card p,
        .pg-payment-step p,
        .pg-support-note p,
        .pg-faq p,
        .pg-final p {
          margin: 0;
          color: var(--pg-muted);
          font-size: 14px;
          line-height: 1.85;
        }

        .pg-video-layout {
          display: grid;
          grid-template-columns: 1fr 1.1fr;
          gap: 45px;
          align-items: center;
        }

        .pg-checks {
          display: grid;
          gap: 12px;
          list-style: none;
          padding: 0;
          margin: 22px 0;
          color: #555;
          font-size: 14px;
        }

        .pg-checks i {
          color: #b95000;
          margin-right: 10px;
        }

        .pg-sample-note {
          color: #84664e;
          font-size: 12px;
          line-height: 1.7;
        }

        .pg-video-card {
          border-radius: 22px;
          overflow: hidden;
          background: #24201c;
          box-shadow: 0 20px 50px #542e141a;
        }

        .pg-video-cover {
          position: relative;
          width: 100%;
          aspect-ratio: 16 / 10;
          overflow: hidden;
          border: 0;
          padding: 28px;
          background:
            radial-gradient(circle at 80% 20%, #704324, transparent 60%),
            #29231e;
          color: #fff;
          font: inherit;
          cursor: pointer;
        }

        .pg-video-badge {
          position: absolute;
          top: 22px;
          left: 22px;
          padding: 8px 12px;
          border: 1px solid #ffffff30;
          border-radius: 20px;
          font-size: 10px;
          letter-spacing: 1.5px;
        }

        .pg-video-paw {
          position: absolute;
          right: -15px;
          bottom: 0;
          font-size: 210px;
          color: #ffffff06;
          transform: rotate(-20deg);
        }

        .pg-play {
          display: inline-grid;
          place-items: center;
          width: 70px;
          height: 70px;
          border-radius: 50%;
          background: var(--pg-orange);
          color: #241507;
          box-shadow: 0 0 0 13px #ff7a001c;
          font-size: 22px;
        }

        .pg-video-caption {
          position: absolute;
          left: 24px;
          bottom: 22px;
          text-align: left;
          font-size: 16px;
          font-weight: 600;
        }

        .pg-video-caption small {
          display: block;
          margin-top: 5px;
          color: #dbccc1;
          font-size: 11px;
          font-weight: 400;
        }

        .pg-video {
          display: block;
          width: 100%;
          aspect-ratio: 16 / 10;
          background: #171717;
          object-fit: contain;
        }

        .pg-grid {
          display: grid;
          grid-template-columns: repeat(3, minmax(0, 1fr));
          gap: 20px;
        }

        .pg-card {
          padding: 26px;
          border: 1px solid #eee5dc;
          border-radius: 18px;
          background: #fff;
        }

        .pg-card-top {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 22px;
        }

        .pg-icon {
          display: inline-grid;
          place-items: center;
          width: 48px;
          height: 48px;
          border-radius: 14px;
          color: #b95000;
          background: #fff0df;
          font-size: 21px;
        }

        .pg-index {
          color: #c8b9aa;
          font-size: 24px;
          font-weight: 700;
        }

        .pg-payment {
          padding: 38px;
          border: 1px solid #f5d6b6;
          border-radius: 24px;
          background: #fffaf4;
        }

        .pg-payment-list {
          display: grid;
          gap: 24px;
        }

        .pg-payment-step {
          display: grid;
          grid-template-columns: 38px 1fr;
          gap: 18px;
        }

        .pg-step-number {
          display: grid;
          place-items: center;
          width: 38px;
          height: 38px;
          border-radius: 50%;
          background: #ff7a00;
          color: #241507;
          font-weight: 700;
        }

        .pg-notice {
          display: flex;
          align-items: flex-start;
          gap: 14px;
          margin-top: 30px;
          padding: 20px;
          border-radius: 14px;
          background: #ffecd8;
          color: #6f421f;
        }

        .pg-notice i {
          margin-top: 4px;
          font-size: 20px;
        }

        .pg-notice p {
          margin: 0;
          font-size: 13px;
          line-height: 1.8;
        }

        .pg-support {
          display: grid;
          grid-template-columns: 1.3fr 1fr;
          gap: 35px;
          align-items: center;
        }

        .pg-support-role {
          color: #a84800;
          font-weight: 600;
          font-size: 14px;
          margin-bottom: 16px;
        }

        .pg-support-note {
          background: #f8f7f5;
          border: 1px solid #ebe7e1;
          border-radius: 20px;
          padding: 30px;
        }

        .pg-support-note h3 {
          margin-top: 18px;
        }

        .pg-faqs {
          border-top: 1px solid #eae4dd;
        }

        .pg-faq {
          border-bottom: 1px solid #eae4dd;
          padding: 20px 4px;
        }

        .pg-faq summary {
          cursor: pointer;
          font-size: 15px;
          font-weight: 600;
          line-height: 1.6;
        }

        .pg-faq summary::marker {
          color: #c75900;
        }

        .pg-faq p {
          padding: 14px 0 0 18px;
          max-width: 900px;
        }

        .pg-final {
          padding: 42px 24px;
          margin: 15px 0 65px;
          text-align: center;
          border-radius: 24px;
          background: #fff4e7;
        }

        .pg-final .pg-actions {
          justify-content: center;
        }

        .pg-guide button:focus-visible,
        .pg-guide a:focus-visible,
        .pg-guide summary:focus-visible {
          outline: 3px solid #be5600;
          outline-offset: 4px;
        }

        @media (max-width: 900px) {
          .pg-grid {
            grid-template-columns: repeat(2, minmax(0, 1fr));
          }

          .pg-video-layout,
          .pg-support {
            grid-template-columns: 1fr;
            gap: 28px;
          }
        }

        @media (max-width: 600px) {
          .pg-hero {
            padding: 115px 0 42px;
          }

          .pg-section {
            padding: 35px 0;
          }

          .pg-grid {
            grid-template-columns: 1fr;
          }

          .pg-payment {
            padding: 24px 18px;
          }

          .pg-card {
            padding: 22px;
          }

          .pg-actions .pg-button {
            flex: 1 1 150px;
          }

          .pg-video-cover,
          .pg-video {
            aspect-ratio: 4 / 3;
          }

          .pg-payment-step {
            gap: 12px;
          }
        }
.pg-guide .pg-hero {
  position: relative;
  isolation: isolate;
  overflow: hidden;
}

.pg-guide .pg-hero::before {
  content: "";
  position: absolute;
  inset: 0;
  z-index: -1;
  background-image:

linear-gradient(
  90deg,
  rgba(255, 250, 244, 0.65) 0%,
  rgba(255, 250, 244, 0.40) 48%,
  rgba(255, 250, 244, 0.08) 100%
),

    url("https://images.pexels.com/photos/6816859/pexels-photo-6816859.jpeg?auto=compress&cs=tinysrgb&w=1600");
  background-size: cover;
  background-position: center, center 42%;
}
        @media (prefers-reduced-motion: reduce) {
          .pg-button {
            transition: none;
          }

          .pg-button:hover {
            transform: none;
          }
        }
      `}</style>
    </div>
  );
}
