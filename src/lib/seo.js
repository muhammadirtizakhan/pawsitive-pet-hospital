// Public clinic facts and route content. Keep prices/availability in the database.
export const CLINIC = {
  name: 'Pawsitive Clinic',
  phone: '+92 334 3601699',
  telephone: '+923343601699',
  email: 'maazdvm.262@gmail.com',
  streetAddress: '36/1-1 Sheet 19, near Malir Cantt Check Post No 2, Model Colony Block 19, Malir Cantonment',
  locality: 'Karachi', postalCode: '75080', country: 'PK',
  image: 'https://res.cloudinary.com/djaonuvzx/image/upload/v1792352038/WhatsApp_Image_2026-10-19_at_12.29.45_AM-removebg-preview_zaza5i.png',
  sameAs: ['https://www.facebook.com/maaz262/', 'https://www.instagram.com/maazdvm.262/']
};

export const PAGE_SEO = {
  '/': { page: 'home', title: 'Vet Clinic in Model Colony, Karachi | Pawsitive Clinic', description: 'Visit Pawsitive Clinic in Model Colony, Malir, Karachi for veterinary treatment, grooming, boarding, lab tests and X-rays. Shop pet food and accessories.' },
  '/services': { page: 'services', title: 'Veterinary Services in Karachi | Pawsitive Clinic', description: 'Explore veterinary treatment, surgery consultations, cat grooming, boarding, blood tests and X-rays at Pawsitive Clinic in Model Colony, Karachi.' },
  '/shop': { page: 'shop', title: 'Pet Food & Accessories in Karachi | Pawsitive Clinic', description: 'Browse pet food and accessories at Pawsitive Clinic, Karachi. Compare current prices, flavours and weights, and wait for availability confirmation before paying.' },
  '/guide': { page: 'guide', title: 'Ordering & Payment Guide | Pawsitive Clinic Karachi', description: 'Learn how to shop, wait for product availability confirmation, send payment proof and track your order at Pawsitive Clinic. Contact Maaz for order support.' }
};

export const CATEGORIES = {
  'cat-food': { name: 'Cat Food', matches: ['cat food', 'cat foods'], title: 'Buy Cat Food in Karachi | Pawsitive Clinic', heading: 'Shop Cat Food in Karachi', description: 'Browse cat food at Pawsitive Clinic in Karachi. Compare available brands, flavours, pack weights and current prices before placing your order.', copy: 'Looking for cat food in Karachi? Browse the current catalogue below and open a product for its ingredients or description, price and available options. Choose a life-stage appropriate food using the manufacturer’s label. If your cat has a diagnosed condition or needs a prescription diet, ask the veterinarian before switching food.' },
  'dog-food': { name: 'Dog Food', matches: ['dog food', 'dog foods'], title: 'Dog Food in Karachi | Pawsitive Clinic', heading: 'Shop Dog Food in Karachi', description: 'Explore available dog food at Pawsitive Clinic, Karachi. Check product descriptions, weights, options and current prices online.', copy: 'Browse dog food in our current catalogue. Check the product label for age, size and feeding guidance, and review the selected pack and price before ordering. Product availability is checked by the clinic before payment.' },
  'pet-accessories': { name: 'Pet Accessories', matches: ['pet accessories', 'accessories', 'pet accessory'], title: 'Pet Accessories in Karachi | Pawsitive Clinic', heading: 'Pet Accessories in Karachi', description: 'Browse available pet accessories and everyday essentials at Pawsitive Clinic in Karachi. Check product details and prices before ordering.', copy: 'Find the pet accessories currently listed in our shop. Open each product to check its description, size or variant and current price. Contact the clinic if you need help checking suitability for your pet.' },
  'other-animals': { name: 'Other Animals', matches: ['other animals', 'others', 'other'], title: 'Other Pet Supplies in Karachi | Pawsitive Clinic', heading: 'Other Pet Supplies in Karachi', description: 'Explore other pet supplies currently listed at Pawsitive Clinic, Karachi. Contact the clinic to confirm species suitability and product availability.', copy: 'Browse other supplies in the current catalogue. Please confirm the intended species, product suitability and availability with the clinic before buying.' }
};
export function categoryKey(name = '') {
  const normalized = name.trim().toLowerCase().replace(/[_-]+/g, ' ').replace(/\s+/g, ' ');
  return Object.keys(CATEGORIES).find(key => CATEGORIES[key].matches.includes(normalized)) || '';
}
export const productPath = product => `/products/${encodeURIComponent(product.id)}`;
export const plainText = value => String(value || '').replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim();

export const HOME_FAQS = [
  ['Where is Pawsitive Clinic in Karachi?', 'We are in Model Colony Block 19, near Malir Cantt Check Post No 2, Karachi. Call or WhatsApp +92 334 3601699 for directions and current opening hours.'],
  ['Which services can I ask about?', 'Contact us for veterinary treatment, surgery consultations, laboratory and blood tests, X-ray imaging, cat grooming, deworming guidance and boarding. Confirm the required service and appointment before visiting.'],
  ['How do I book cat grooming or boarding?', 'Call or WhatsApp Maaz at +92 334 3601699. Share your cat’s age, health needs and requested grooming service or boarding dates. Confirm availability, preparation requirements and charges with the clinic.'],
  ['How do I order cat food in Karachi?', 'Open Shop, select a product and its options, review your cart and complete checkout. Wait for availability confirmation before paying. Follow the Guide for payment proof and order tracking.'],
  ['What should I do if my pet needs urgent care?', 'Contact an available veterinarian immediately for a serious injury or illness. Call the clinic to confirm whether a veterinarian is available; do not assume round-the-clock emergency coverage.']
];
export const SERVICES = {
  'cat-grooming': {
    title: 'Cat Grooming in Model Colony, Karachi | Pawsitive Clinic', heading: 'Cat Grooming in Karachi', label: 'Grooming',
    description: 'Ask about cat bathing, coat brushing, nail trimming and teeth brushing at Pawsitive Clinic in Model Colony, Karachi. Confirm grooming charges and availability.',
    intro: 'Cat grooming at Pawsitive Clinic in Model Colony, Karachi includes bathing or washing, coat brushing, nail trimming and teeth brushing. Tell the team which services you need so they can discuss an appropriate session for your cat.',
    sections: [
      ['What to discuss before grooming', 'Share your cat’s age, coat condition, handling preferences and any existing illness. Mention painful skin, wounds or severe matting before the visit so the veterinarian can advise whether an examination is needed.'],
      ['Bathing, brushing and nail care', 'Ask which washing, drying and coat-care steps are included in your appointment. Nail trimming and teeth brushing can be discussed with the team. Brushing is routine hygiene; painful teeth or gums need veterinary assessment.'],
      ['Booking in Model Colony', 'Call or WhatsApp Maaz with your requested services and preferred date. Confirm the price, expected duration and any preparation before bringing your cat to the clinic near Malir Cantt Check Post No 2.']
    ],
    faqs: [
      ['What is the cat grooming price in Karachi?', 'Please contact Pawsitive Clinic for a confirmed quote for your cat and requested services. No fixed grooming price is published here.'],
      ['How long does cat grooming take?', 'The duration depends on the requested services, coat condition and handling needs. Confirm the expected session length when booking.'],
      ['Do you offer haircuts or lion cuts?', 'Haircuts, lion cuts and specialist coat treatments are not confirmed on this page. Ask the clinic which options are currently available.']
    ]
  },
  'cat-boarding': {
    title: 'Cat Boarding in Model Colony, Karachi | Pawsitive Clinic', heading: 'Cat Boarding in Karachi', label: 'Boarding',
    description: 'Contact Pawsitive Clinic in Model Colony, Karachi for cat boarding availability, stay dates, preparation requirements and current charges.',
    intro: 'Need cat boarding in Karachi while you are away? Contact Pawsitive Clinic in Model Colony to discuss your cat’s stay dates and care requirements. Boarding is a temporary stay arranged with the clinic; a place is confirmed only after the team checks availability.',
    sections: [
      ['How cat boarding works', 'Start by sharing your arrival and collection dates, your cat’s age, usual food and any health concerns. The team will explain the available arrangement, requirements and charges before you book.'],
      ['Preparing for your cat’s stay', 'Ask about vaccination or parasite-care requirements, feeding arrangements, belongings and emergency contacts. Tell the team about prescribed medicines or recent illness and confirm whether the required care can be provided.'],
      ['Short stays and longer bookings', 'For a weekend, a week or another period, confirm dates directly with the clinic. Discuss collection times and what happens if your plans change. Daycare, cat-only accommodation and continuous supervision are not assumed.']
    ],
    faqs: [
      ['How much is cat boarding per day?', 'Contact Maaz for the current boarding rate and what is included. Charges and availability must be confirmed for your requested dates.'],
      ['Can I board my cat for a week?', 'Share your exact dates and your cat’s care needs with the clinic. The team must confirm space and the suitability of the arrangement.'],
      ['Is boarding suitable for every cat?', 'Suitability depends on health, temperament and care needs. Discuss these with the clinic before making a booking.']
    ]
  },
  'lab-tests-xray': {
    title: 'Veterinary Blood Tests & Pet X-Ray in Karachi | Pawsitive Clinic', heading: 'Veterinary Lab Tests and X-Ray in Karachi', label: 'Diagnostics',
    description: 'Ask about CBC, haemoglobin, blood chemistry and enzyme tests, and pet X-ray imaging at Pawsitive Clinic in Model Colony, Karachi.',
    intro: 'Pawsitive Clinic offers laboratory testing and X-ray imaging in Model Colony, Karachi. Ask about CBC, haemoglobin and blood chemistry or enzyme tests. The veterinarian selects appropriate investigations based on an examination and your pet’s history.',
    sections: [
      ['CBC and haemoglobin testing', 'A complete blood count examines blood-cell measurements, including red cells, white cells and platelets. Haemoglobin is one of the measurements used to assess red-cell health. Results need veterinary interpretation alongside the examination.'],
      ['Blood chemistry and enzyme tests', 'Chemistry measurements can support assessment of organ function and other concerns. Ask which liver, kidney or enzyme tests are appropriate and available; not every investigation is needed for every pet.'],
      ['Pet X-ray imaging', 'X-ray imaging can support assessment of bones and certain internal structures when recommended by the veterinarian. Contact the clinic for preparation, handling requirements and appointment availability. A mobile or home-visit X-ray service is not assumed.']
    ],
    faqs: [
      ['What is the CBC or X-ray fee?', 'Confirm the required investigation and exact charge directly with the clinic. Prices are not listed here.'],
      ['Does my pet need to fast before a blood test?', 'Preparation depends on the specific test and your pet’s condition. Ask the veterinarian for instructions; do not fast an unwell pet without veterinary guidance.'],
      ['When will results be available?', 'Ask the team about the expected turnaround for the selected test. Same-day results are not guaranteed on this page.']
    ]
  }
};
export const publicPaths = () => [...Object.keys(PAGE_SEO), ...Object.keys(SERVICES).map(k => `/services/${k}`), ...Object.keys(CATEGORIES).map(k => `/shop/${k}`)];
