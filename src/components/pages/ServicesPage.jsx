'use client';

export default function ServicesPage({ active = false }) {
  return (
    <div className={`page-content${active ? ' active' : ''}`} id="page-services">
      <section className="services-hero">
        <div className="services-hero-overlay"></div>
        <div className="services-hero-content">
          <div className="services-hero-tag">
            <i className="fa-solid fa-heart-pulse"></i>
            {' Our Services'}
          </div>
          <h1>
            {'Veterinary Services in '}
            <span>Karachi</span>
            {''}
          </h1>
          <p>
            Visit Pawsitive Clinic in Model Colony, Malir, for treatment, surgery consultations,
            blood tests and X-ray imaging. Ask Maaz about cat grooming, boarding and appointment availability.
          </p>
          <div className="hero-buttons">
            <button className="hero-btn-primary" onClick={() => window.openWhatsAppContact()}>
              <i className="fa-solid fa-phone"></i>
              Contact Us
            </button>
            <button className="hero-btn-secondary" onClick={() => window.showPage('shop')}>
              <i className="fa-solid fa-cart-shopping"></i>
              Shop Now
            </button>
          </div>
        </div>
      </section>
      <section className="service-showcase surgery-showcase">
        <div className="service-showcase-heading">
          <span>Specialist Care</span> <h2>Advanced Surgical Services</h2>
        </div>
        <div className="surgery-carousel" id="surgeryCarousel">
          <button
            className="service-carousel-arrow service-carousel-prev"
            type="button"
            onClick={() => window.moveSurgeryCards(-1)}
            aria-label="Previous surgical services"
          >
            <i className="fa-solid fa-chevron-left"></i>
          </button>{' '}
          <div className="surgery-track">
            <article className="surgery-card">
              <img
                loading="lazy"
                decoding="async"
                src={
                  'https://images.unsplash.com/photo-1581595220892-b0739db3ba8c?w=700&auto=format&fit=crop'
                }
                alt="Veterinarian performing surgery on a cat"
              />{' '}
              <div className="surgery-card-body">
                <h3>Surgeries</h3>
                <p>
                  You trust skilled hands for small and major procedures, and your pet receives careful
                  support from preparation through recovery.
                </p>
              </div>
            </article>
            <article className="surgery-card">
              <img
                loading="lazy"
                decoding="async"
                src={
                  'https://images.unsplash.com/photo-1583337130417-3346a1be7dee?w=700&auto=format&fit=crop'
                }
                alt="Veterinarian caring for a cat"
              />{' '}
              <div className="surgery-card-body">
                <h3>Neuter and Spay Surgery</h3>
                <p>
                  You choose a safe sterilization method with gentle aftercare, clear guidance, and a recovery
                  plan made for your pet.
                </p>
              </div>
            </article>
            <article className="surgery-card">
              <img
                loading="lazy"
                decoding="async"
                src={'https://images.unsplash.com/photo-1558788353-f76d92427f16?w=700&auto=format&fit=crop'}
                alt="Two puppies receiving care"
              />{' '}
              <div className="surgery-card-body">
                <h3>Reproductive Health Services</h3>
                <p>
                  You receive expert support for pregnancy care, observation, and every important stage before
                  delivery.
                </p>
              </div>
            </article>
            <article className="surgery-card">
              <img
                loading="lazy"
                decoding="async"
                src={
                  'https://images.unsplash.com/photo-1576201836106-db1758fd1c97?w=700&auto=format&fit=crop'
                }
                alt="Veterinarian examining a dog"
              />{' '}
              <div className="surgery-card-body">
                <h3>Orthopedic Surgery</h3>
                <p>
                  Your pet receives careful treatment for bone, joint, and mobility problems with a recovery
                  plan built around their comfort.
                </p>
              </div>
            </article>
            <article className="surgery-card">
              <img
                loading="lazy"
                decoding="async"
                src={
                  'https://images.unsplash.com/photo-1519052537078-e6302a4968d4?w=700&auto=format&fit=crop'
                }
                alt="Cat receiving veterinary care"
              />{' '}
              <div className="surgery-card-body">
                <h3>Soft Tissue Surgery</h3>
                <p>
                  You get dependable surgical care for soft tissue conditions, supported by close monitoring
                  before and after every procedure.
                </p>
              </div>
            </article>
            <article className="surgery-card">
              <img
                loading="lazy"
                decoding="async"
                src={
                  'https://images.unsplash.com/photo-1583337130417-3346a1be7dee?w=700&auto=format&fit=crop'
                }
                alt="Veterinarian caring for a pet"
              />{' '}
              <div className="surgery-card-body">
                <h3>Post-Operative Care</h3>
                <p>
                  Your pet stays supported after surgery with wound checks, medication guidance, and practical
                  advice for healing at home.
                </p>
              </div>
            </article>
          </div>{' '}
          <button
            className="service-carousel-arrow service-carousel-next"
            type="button"
            onClick={() => window.moveSurgeryCards(1)}
            aria-label="Next surgical services"
          >
            <i className="fa-solid fa-chevron-right"></i>
          </button>
        </div>
      </section>
      <section className="service-showcase diagnostics-showcase">
        <div className="service-showcase-heading">
          <span>Precision Medicine</span>
          <h2>Diagnostic and Laboratory Services</h2>
        </div>
        <div className="diagnostic-grid">
          <article
            className="diagnostic-card diagnostic-card-tall"
            style={{
              backgroundImage:
                "url('https://images.unsplash.com/photo-1579154204601-01588f351e67?w=800&auto=format&fit=crop')",
            }}
          >
            <div>
              <h3>CBC BC30</h3>
              <p>
                You receive accurate blood results through our BC30 machine, helping your pet get the right
                treatment on time.
              </p>
            </div>
          </article>
          <article
            className="diagnostic-card diagnostic-card-center"
            style={{
              backgroundImage:
                "url('https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=800&auto=format&fit=crop')",
            }}
          >
            <div>
              <h3>LFT AND RFT</h3>
              <p>
                You get clarity on liver and kidney health through specialized tests and detailed readings.
              </p>
            </div>
            <button type="button" onClick={() => window.showPage('contact')}>
              {'Learn More '}
              <i className="fa-solid fa-arrow-right"></i>
            </button>
          </article>
          <article
            className="diagnostic-card diagnostic-card-tall"
            style={{
              backgroundImage:
                "url('https://images.unsplash.com/photo-1581595220892-b0739db3ba8c?w=800&auto=format&fit=crop')",
            }}
          >
            <div>
              <h3>ENDOSCOPY</h3>
              <p>
                You receive answers for internal problems through a non-invasive method that helps your pet
                stay calm.
              </p>
            </div>
          </article>
          <article
            className="diagnostic-card"
            style={{
              backgroundImage:
                "url('https://images.unsplash.com/photo-1551601651-2a8555f1a136?w=800&auto=format&fit=crop')",
            }}
          >
            <div>
              <h3>ULTRASOUND COLOR DOPPLER</h3>
              <p>
                You gain a deeper view of your pet's heart and abdomen through real-time Doppler technology.
              </p>
            </div>
          </article>
          <article
            className="diagnostic-card"
            style={{
              backgroundImage:
                "url('https://images.unsplash.com/photo-1583337130417-3346a1be7dee?w=800&auto=format&fit=crop')",
            }}
          >
            <div>
              <h3>Pet X-Ray Imaging</h3>
              <p>Ask the veterinarian about X-ray imaging at the clinic and any preparation required for your pet.</p>
            </div>
          </article>
        </div>
      </section>
      <section className="service-showcase care-showcase">
        <div className="service-showcase-heading">
          <span>Everyday Wellness</span>
          <h2>Pet Grooming Services</h2>
        </div>
        <div className="care-row">
          <div className="care-copy">
            <h3>Cat Grooming in Karachi</h3>
            <p>
              Ask about cat bathing, coat brushing, nail trimming and teeth brushing. Share your cat’s
              coat condition and health needs before booking, and confirm the session details and charges.
            </p>
          </div>
          <img
            loading="lazy"
            decoding="async"
            src={'https://images.unsplash.com/photo-1516734212186-a967f81ad0d7?w=900&auto=format&fit=crop'}
            alt="Dog receiving a professional grooming session"
          />
        </div>
        <div className="care-row care-row-reverse">
          <img
            loading="lazy"
            decoding="async"
            src={'https://images.unsplash.com/photo-1558788353-f76d92427f16?w=900&auto=format&fit=crop'}
            alt="Dogs enjoying supervised day care"
          />
          <div className="care-copy">
            <h3>Cat Boarding in Karachi</h3>
            <p>
              Contact the clinic to discuss your cat’s boarding dates, usual food and care needs.
              Confirm space, preparation requirements, charges and collection times before booking.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
