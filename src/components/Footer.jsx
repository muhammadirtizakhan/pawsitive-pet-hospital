'use client';

export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="footer-brand">
          <div className="footer-logo">
           <div className="logo-icon" style={{ overflow: 'hidden', padding: 0 }}>
  <img
    src="https://res.cloudinary.com/djaonuvzx/image/upload/v1792352038/WhatsApp_Image_2026-10-19_at_12.29.45_AM-removebg-preview_zaza5i.png"
    alt="Pawsitive Clinic"
    style={{
      width: '100%',
      height: '100%',
      objectFit: 'cover',
      borderRadius: '50%',
      display: 'block'
    }}
  />
</div>
            <div>
              <h2>Pawsitive Clinic</h2>
              <span>Pets Doctor</span>
            </div>
          </div>
          <p>
            Your trusted veterinary partner in Karachi. We provide compassionate, professional care for your
            pets in Model Colony, Malir. Contact us for appointments, diagnostics, grooming and boarding.
          </p>
          <div className="footer-social">
            <a
              href="https://www.facebook.com/maaz262/"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Visit our Facebook page"
            >
              <i className="fa-brands fa-facebook-f"></i>
            </a>
            <a
              href="https://www.instagram.com/maazdvm.262/"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Visit our Instagram page"
            >
              <i className="fa-brands fa-instagram"></i>
            </a>
            <a href="mailto:maazdvm.262@gmail.com" aria-label="Email us">
              <i className="fa-solid fa-envelope"></i>
            </a>
            <a
              href="https://wa.me/923343601699"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Chat with us on WhatsApp"
            >
              <i className="fa-brands fa-whatsapp"></i>
            </a>
          </div>
        </div>
        <div>
          <h2 className="seo-footer-heading">Quick Links</h2>
          <ul className="footer-links">
            <li>
              <a
                href="/"
              >
                <i className="fa-solid fa-chevron-right"></i>
                {' Home'}
              </a>
            </li>
            <li>
              <a
                href="/#about-section"
              >
                <i className="fa-solid fa-chevron-right"></i>
                {' About Us'}
              </a>
            </li>
            <li>
              <a
                href="/services"
              >
                <i className="fa-solid fa-chevron-right"></i>
                {' Services'}
              </a>
            </li>
            <li>
              <a
                href="/shop"
              >
                <i className="fa-solid fa-chevron-right"></i>
                {' Shop'}
              </a>
            </li>
            <li>
              <a
                href="/#contact-section"
              >
                <i className="fa-solid fa-chevron-right"></i>
                {' Contact'}
              </a>
            </li>
          </ul>
        </div>
        <div>
          <h2 className="seo-footer-heading">Our Services</h2>
          <ul className="footer-links">
            <li>
              <a
                href="/services/lab-tests-xray"
              >
                <i className="fa-solid fa-chevron-right"></i>
                {' X-Ray Imaging'}
              </a>
            </li>
            <li>
              <a
                href="/services/lab-tests-xray"
              >
                <i className="fa-solid fa-chevron-right"></i>
                {' Lab Tests'}
              </a>
            </li>
            <li>
              <a
                href="/services/cat-grooming"
              >
                <i className="fa-solid fa-chevron-right"></i>
                {' Pet Grooming'}
              </a>
            </li>
            <li>
              <a
                href="/services"
              >
                <i className="fa-solid fa-chevron-right"></i>
                {' Treatment'}
              </a>
            </li>
            <li>
              <a
                href="/services/cat-boarding"
              >
                <i className="fa-solid fa-chevron-right"></i>
                {' Boarding'}
              </a>
            </li>
          </ul>
        </div>
        <div>
          <h2 className="seo-footer-heading">Contact Us</h2>
          <ul className="footer-contact">
            <li>
              <i className="fa-solid fa-location-dot"></i>
              <span>
                36/1-1 Sheet 19, near Malir Cantt Check Post No 2, Model Colony Block 19 Malir Cantonment,
                Karachi, 75080, Pakistan
              </span>
            </li>
            <li>
              <i className="fa-solid fa-phone"></i>
              <span>
                <a href="tel:+923343601699">+92 334 3601699</a>
              </span>
            </li>
            <li>
              <i className="fa-solid fa-envelope"></i>
              <span>
                <a href="mailto:maazdvm.262@gmail.com">maazdvm.262@gmail.com</a>
              </span>
            </li>
            <li>
              <i className="fa-solid fa-clock"></i>
              <span>Call to confirm current opening hours</span>
            </li>
          </ul>
        </div>
      </div>
      <div className="footer-bottom">
        <p>
          {'© 2026 '}
          <strong>Pawsitive Clinic</strong>. All Rights Reserved.
        </p>
        <div className="footer-bottom-links">
          <a href="#">Privacy Policy</a>
          <a href="#">Terms of Service</a>
          <a href="#">Cookie Policy</a>
          <a href="/sitemap.xml">Sitemap</a>
        </div>
      </div>
    </footer>
  );
}
