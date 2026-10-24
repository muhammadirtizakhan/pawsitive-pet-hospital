'use client';

import { HOME_FAQS } from '@/lib/seo';

export default function HomePage({ active = false }) {
  const avatarStyle = {
    width: '48px',
    height: '48px',
    borderRadius: '50%',
    background: '#FFF0E2',
    color: '#C45100',
    display: 'grid',
    placeItems: 'center',
    fontWeight: 700,
    fontSize: '20px',
    flexShrink: 0
  };

  return (
    <div className={`page-content${active ? ' active' : ''}`} id="page-home">
      <section className="hero" id="home">
        <div className="hero-overlay"></div>

        <div className="hero-content">
          <div className="hero-tag">
            <i className="fa-solid fa-heart-pulse"></i>
            {' Veterinary Excellence'}
          </div>

          <h1>
            {'Veterinary Care in Model Colony, Karachi'}
            <br />
            <span>Pets Doctor - Pawsitive Clinic</span>
          </h1>

          <p>
            Pawsitive Clinic provides veterinary treatment, surgery consultations,
            laboratory tests and X-ray imaging in Model Colony, Malir, Karachi.
            Contact Maaz for cat grooming, boarding and appointments, or browse
            pet food and accessories in our online shop.
          </p>

          <div className="hero-buttons">
            <button
              className="hero-btn-primary"
              onClick={() => window.showPage('services')}
            >
              <i className="fa-solid fa-stethoscope"></i>
              Explore Our Services
            </button>

            <button
              className="hero-btn-secondary"
              onClick={() => window.showPage('shop')}
            >
              <i className="fa-solid fa-cart-shopping"></i>
              Shop Now
            </button>
          </div>

          <div className="hero-stats">
            <div className="stat">
              <h3>Model Colony</h3>
              <p>Malir, Karachi</p>
            </div>

            <div className="stat">
              <h3>Clinic & Shop</h3>
              <p>Care and Pet Essentials</p>
            </div>

            <div className="stat">
              <h3>1st</h3>
              <p>Priority: Your Pet</p>
            </div>
          </div>
        </div>
      </section>

      <section className="hero-section-2" id="about-section">
        <div className="hero-content-2">
          <div className="small-title">
            Trusted Veterinary Care in Karachi
          </div>

          <h2>
            {'Expert Care For Your '}
            <span>Beloved Pets</span>
          </h2>

          <p>
            Visit our veterinary clinic near Malir Cantt Check Post No 2 for
            an examination and advice tailored to your pet. Discuss treatment,
            blood tests, X-rays and follow-up care directly with the veterinarian.
          </p>

          <div className="hero-buttons">
            <button
              className="primary-btn"
              onClick={() => window.openWhatsAppContact()}
            >
              <i
                className="fa-solid fa-phone"
                style={{ marginRight: '10px' }}
              ></i>
              {' Contact Us'}
            </button>
          </div>
        </div>

        <div className="hero-image-2">
          <img
            src="https://images.unsplash.com/photo-1548199973-03cce0bbc87b?w=1200&q=80"
            loading="lazy" decoding="async" width="1200" height="800" alt="Dogs outdoors"
          />
        </div>
      </section>

      <section className="pet-store" id="shop-section">
        <div className="section-header">
          <span>PET STORE</span>{' '}

          <h2>
            Everything Your Pets Need,
            <br />
            All in One Place
          </h2>

          <p>
            Discover premium pet food, accessories, and everyday
            essentials carefully selected to keep your furry companions
            healthy, comfortable, and happy.
          </p>
        </div>

        <div className="categories">
          <a className="store-card" href="/shop/cat-food">
            <div className="circle">
              <img
                loading="lazy"
                decoding="async"
                src="https://images.unsplash.com/photo-1548681528-6a5c45b66b42?w=1000"
                alt="Cat Food"
              />
            </div>

            <h3>Cat Food</h3>
            <p>Nutritious meals designed for cats of all ages.</p>
          </a>

          <a className="store-card" href="/shop/dog-food">
            <div className="circle">
              <img
                loading="lazy"
                decoding="async"
                src="https://images.unsplash.com/photo-1587300003388-59208cc962cb?w=1000"
                alt="Dog Food"
              />
            </div>

            <h3>Dog Food</h3>
            <p>High-quality nutrition for active, healthy dogs.</p>
          </a>

          <a className="store-card" href="/shop/pet-accessories">
            <div className="circle">
              <img
                loading="lazy"
                decoding="async"
                src="https://images.unsplash.com/photo-1601758228041-f3b2795255f1?w=1000"
                alt="Pet Accessories"
              />
            </div>

            <h3>Pet Accessories</h3>
            <p>{'Beds, toys, bowls, collars & daily essentials.'}</p>
          </a>

          <a className="store-card" href="/shop/other-animals">
            <div className="circle">
              <img
                loading="lazy"
                decoding="async"
                src="https://images.unsplash.com/photo-1444464666168-49d633b86797?w=1000"
                alt="Other Animals"
              />
            </div>

            <h3>Other Animals</h3>
            <p>{'Specialty food & care for birds, rabbits & more.'}</p>
          </a>
        </div>

        <div className="shop-btn">
          <button onClick={() => window.showPage('shop')}>
            <i
              className="fa-solid fa-cart-shopping"
              style={{ marginRight: '10px' }}
            ></i>
            {' Shop Now'}
          </button>
        </div>
      </section>


      <section className="testimonials">
        <div className="testimonial-header">
          <div className="testimonial-tag">
            <svg
              width="16"
              height="16"
              viewBox="0 0 13 14"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M1.613 8.2a.62.62 0 0 1-.553-.341.59.59 0 0 1 .076-.637l6.048-6.118a.31.31 0 0 1 .375-.069c.061.033.11.084.137.147a.3.3 0 0 1 .014.197L6.537 4.991a.59.59 0 0 0 .07.552.61.61 0 0 0 .504.257h4.276a.62.62 0 0 1 .553.341.59.59 0 0 1-.076.637l-6.048 6.119a.31.31 0 0 1-.375.067.295.295 0 0 1-.15-.344l1.172-3.61a.59.59 0 0 0-.07-.553.61.61 0 0 0-.504-.257z"
                stroke="#FF7A00"
                strokeMiterlimit="5.759"
                strokeLinecap="round"
              ></path>
            </svg>

            <span>Testimonials</span>
          </div>

          <h2>What Pet Parents Say About Us</h2>

          <p className="testimonial-sub">
            Hear from our happy clients about their experience at
            Pawsitive Clinic. We're dedicated to providing the best care
            for your furry family members.
          </p>
        </div>

        <div className="testimonial-grid">
          <div className="testimonial-card">
            <p className="quote">
              &ldquo;My cat was struggling with liver issues, and Maaz
              treated my cat at Pawsitive Clinic. Alhamdulillah, my cat
              has recovered. I am grateful to Maaz for the care and
              treatment.&rdquo;
            </p>

            <div className="user-info">
              <div aria-hidden="true" style={avatarStyle}>
                I
              </div>

              <div>
                <div className="name">Irtiza</div>
                <div className="role">Cat Parent</div>
              </div>
            </div>
          </div>

          <div className="testimonial-card">
            <p className="quote">
              &ldquo;My cat had a viral illness and a low blood count.
              After receiving treatment from Maaz at Pawsitive Clinic,
              my cat recovered, Alhamdulillah. I am thankful for the
              care my cat received during such a worrying time.&rdquo;
            </p>

            <div className="user-info">
              <div aria-hidden="true" style={avatarStyle}>
                G
              </div>

              <div>
                <div className="name">Ghazala</div>
                <div className="role">Cat Parent</div>
              </div>
            </div>
          </div>

          <div className="testimonial-card">
            <p className="quote">
              "The grooming service is top-notch! My Persian cat looked
              absolutely beautiful after her session at Pawsitive
              Clinic."
            </p>

            <div className="user-info">
              <img
                loading="lazy"
                decoding="async"
                src="https://images.unsplash.com/photo-1527980965255-d3b416303d12?w=200&auto=format&fit=crop&q=60"
                alt="user"
              />

              <div>
                <div className="name">Liam Carter</div>
                <div className="role">
                  Pet Parent • Bella the Persian Cat
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="faq-section">
        <div className="faq-wrapper">
          <img
            loading="lazy"
            decoding="async"
            className="faq-image"
            src="https://images.unsplash.com/photo-1601758125946-6ec2ef64daf8?w=800&auto=format&fit=crop"
            alt="Happy dog with owner"
          />

          <div className="faq-content">
            <div className="faq-tag">
              <svg
                width="16"
                height="16"
                viewBox="0 0 13 14"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M1.613 8.2a.62.62 0 0 1-.553-.341.59.59 0 0 1 .076-.637l6.048-6.118a.31.31 0 0 1 .375-.069c.061.033.11.084.137.147a.3.3 0 0 1 .014.197L6.537 4.991a.59.59 0 0 0 .07.552.61.61 0 0 0 .504.257h4.276a.62.62 0 0 1 .553.341.59.59 0 0 1-.076.637l-6.048 6.119a.31.31 0 0 1-.375.067.295.295 0 0 1-.15-.344l1.172-3.61a.59.59 0 0 0-.07-.553.61.61 0 0 0-.504-.257z"
                  stroke="#FF7A00"
                  strokeMiterlimit="5.759"
                  strokeLinecap="round"
                ></path>
              </svg>

              <span>FAQ's</span>
            </div>{' '}

            <h2>Frequently Asked Questions</h2>

            <p className="faq-sub">
              Find answers to the most common questions about our
              veterinary services, pet care, appointments, and more.
              Can't find what you're looking for? Feel free to contact us!
            </p>

            <div id="faqContainer">{HOME_FAQS.map(([question, answer]) => <details className="seo-faq" key={question}><summary>{question}</summary><p>{answer}</p></details>)}</div>
          </div>
        </div>
      </section>

      <section className="map-section" id="contact-section">
        <div className="map-header">
          <div className="map-tag">
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M12 13C13.6569 13 15 11.6569 15 10C15 8.34315 13.6569 7 12 7C10.3431 7 9 8.34315 9 10C9 11.6569 10.3431 13 12 13Z"
                stroke="#FF7A00"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              ></path>

              <path
                d="M12 2C8.13 2 5 5.13 5 9C5 14.25 12 22 12 22C12 22 19 14.25 19 9C19 5.13 15.87 2 12 2Z"
                stroke="#FF7A00"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              ></path>
            </svg>

            <span>Find Us</span>
          </div>{' '}

          <h2>Visit Our Clinic</h2>

          <p className="map-sub">
            Find us at 36/1-1 Sheet 19, Model Colony Block 19, near Malir Cantt
            Check Post No 2, Karachi 75080. Call +92 371 2699800 for directions
            and current opening hours.
          </p>
        </div>

        <div className="map-container">
          <iframe
            title="Pawsitive Clinic location in Model Colony, Karachi"
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3618.2!2d67.1918174!3d24.912041!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3eb33765a6802da1%3A0xb7eeee2f01290dce!2sPets+doctor-Pawsitive+clinic!5e0!3m2!1sen!2spk!4v1700000000000"
            width="100%"
            height="450"
            style={{
              border: '0',
              borderRadius: '20px',
              boxShadow: '0 20px 50px rgba(0,0,0,0.10)'
            }}
            allowFullScreen
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          ></iframe>
        </div>
      </section>
    </div>
  );
}
