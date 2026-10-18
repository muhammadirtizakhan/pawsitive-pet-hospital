'use client';

export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="footer-brand">
          <div className="footer-logo">
            <div className="logo-icon">
              <i className="fa-solid fa-paw"></i>
            </div>
            <div>
              <h2>Pawsitive Clinic</h2>
              <span>Pets Doctor</span>
            </div>
          </div>
          <p>
            Your trusted veterinary partner in Karachi. We provide compassionate, professional care for your
            beloved pets with state-of-the-art facilities and experienced veterinarians.
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
          <h4>Quick Links</h4>
          <ul className="footer-links">
            <li>
              <a
                href="#"
                onClick={(e) => {
                  window.showPage('home');
                  e.preventDefault();
                }}
              >
                <i className="fa-solid fa-chevron-right"></i>
                {' Home'}
              </a>
            </li>
            <li>
              <a
                href="#"
                onClick={(e) => {
                  window.showPage('about');
                  e.preventDefault();
                }}
              >
                <i className="fa-solid fa-chevron-right"></i>
                {' About Us'}
              </a>
            </li>
            <li>
              <a
                href="#"
                onClick={(e) => {
                  window.showPage('services');
                  e.preventDefault();
                }}
              >
                <i className="fa-solid fa-chevron-right"></i>
                {' Services'}
              </a>
            </li>
            <li>
              <a
                href="#"
                onClick={(e) => {
                  window.showPage('shop');
                  e.preventDefault();
                }}
              >
                <i className="fa-solid fa-chevron-right"></i>
                {' Shop'}
              </a>
            </li>
            <li>
              <a
                href="#"
                onClick={(e) => {
                  window.showPage('contact');
                  e.preventDefault();
                }}
              >
                <i className="fa-solid fa-chevron-right"></i>
                {' Contact'}
              </a>
            </li>
          </ul>
        </div>
        <div>
          <h4>Our Services</h4>
          <ul className="footer-links">
            <li>
              <a
                href="#"
                onClick={(e) => {
                  window.showPage('services');
                  e.preventDefault();
                }}
              >
                <i className="fa-solid fa-chevron-right"></i>
                {' Digital X-Ray'}
              </a>
            </li>
            <li>
              <a
                href="#"
                onClick={(e) => {
                  window.showPage('services');
                  e.preventDefault();
                }}
              >
                <i className="fa-solid fa-chevron-right"></i>
                {' Lab Tests'}
              </a>
            </li>
            <li>
              <a
                href="#"
                onClick={(e) => {
                  window.showPage('services');
                  e.preventDefault();
                }}
              >
                <i className="fa-solid fa-chevron-right"></i>
                {' Pet Grooming'}
              </a>
            </li>
            <li>
              <a
                href="#"
                onClick={(e) => {
                  window.showPage('services');
                  e.preventDefault();
                }}
              >
                <i className="fa-solid fa-chevron-right"></i>
                {' Dental Care'}
              </a>
            </li>
            <li>
              <a
                href="#"
                onClick={(e) => {
                  window.showPage('services');
                  e.preventDefault();
                }}
              >
                <i className="fa-solid fa-chevron-right"></i>
                {' Emergency Care'}
              </a>
            </li>
          </ul>
        </div>
        <div>
          <h4>Contact Us</h4>
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
              <span>12:00 AM - 12:00 PM</span>
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
          <a href="#">Sitemap</a>
        </div>
      </div>
    </footer>
  );
}
