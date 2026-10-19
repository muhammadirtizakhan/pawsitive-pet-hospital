import { CLINIC } from '@/lib/seo';

export default function ServiceDetailPage({ service, active = false }) {
  if (!service) return null;
  return (
    <div className={`page-content${active ? ' active' : ''}`} id="page-service-detail">
      <section className="seo-content seo-service">
        <nav aria-label="Breadcrumb" className="seo-breadcrumb"><a href="/">Home</a><span>/</span><a href="/services">Services</a><span>/</span><span>{service.label}</span></nav>
        <span className="seo-eyebrow">PAWSITIVE CLINIC · MODEL COLONY</span>
        <h1>{service.heading}</h1>
        <p className="seo-lead">{service.intro}</p>
        <a className="seo-cta" href={`https://wa.me/${CLINIC.telephone.slice(1)}`}>Ask Maaz about availability</a>
        <div className="seo-service-grid">{service.sections.map(([title, text]) => <section key={title}><h2>{title}</h2><p>{text}</p></section>)}</div>
        <section><h2>Common questions</h2>{service.faqs.map(([q,a]) => <details key={q} className="seo-faq"><summary>{q}</summary><p>{a}</p></details>)}</section>
        <section><h2>Visit Pawsitive Clinic</h2><p>{CLINIC.streetAddress}, Karachi {CLINIC.postalCode}, Pakistan.</p><p>Call <a href={`tel:${CLINIC.telephone}`}>{CLINIC.phone}</a> to confirm opening hours, appointments and charges.</p></section>
        <nav className="seo-link-list" aria-label="Related services"><a href="/services/cat-grooming">Cat grooming</a><a href="/services/cat-boarding">Cat boarding</a><a href="/services/lab-tests-xray">Lab tests and X-ray</a><a href="/shop/cat-food">Shop cat food</a></nav>
      </section>
    </div>
  );
}
