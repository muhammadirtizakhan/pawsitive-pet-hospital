import data from './chatbotData';

export function redact(text) {
  return String(text)
    .replace(
      /\b[^\s@]+@[^\s@]+\.[^\s@]+\b/g,
      '[email]'
    )
    .replace(
      /\bORD-[a-f0-9]{6}\b/gi,
      '[order]'
    )
    .replace(
      /\b[a-f0-9]{8}(?:-[a-f0-9]{4}){3}-[a-f0-9]{12}\b/gi,
      '[order]'
    )
    .replace(
      /\+?\d[\d\s()-]{5,}\d/g,
      '[number]'
    );
}

export async function rank(query, documents, count = 8) {
  if (!documents.length) return [];

  const words = new Set(
    query.toLowerCase().match(/[\p{L}\p{N}]+/gu) || []
  );

  const fallback = documents
    .map((text, index) => ({
      text,
      index,
      score: [...words].reduce(
        (n, word) =>
          n + (
            word.length > 2
            && text.toLowerCase().includes(word)
              ? 1
              : 0
          ),
        0
      )
    }))
    .sort((a, b) => b.score - a.score)
    .slice(0, count)
    .map(item => item.index);

  if (!process.env.JINA_API_KEY) return fallback;

  try {
    const response = await fetch(
      'https://api.jina.ai/v1/rerank',
      {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${process.env.JINA_API_KEY}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          model:
            process.env.JINA_RERANK_MODEL
            || 'jina-reranker-v2-base-multilingual',
          query: redact(query).slice(0, 1500),
          documents,
          top_n: Math.min(count, documents.length),
          return_documents: false
        }),
        signal: AbortSignal.timeout(5000)
      }
    );

    if (!response.ok) return fallback;

    const result = await response.json();

    const indices = [
      ...new Set(
        (result.results || []).map(item => item.index)
      )
    ]
      .filter(index =>
        Number.isInteger(index)
        && index >= 0
        && index < documents.length
      )
      .slice(0, count);

    return indices.length ? indices : fallback;
  } catch {
    return fallback;
  }
}

export async function knowledge(query) {
  const documents = [
    ...(data.services || []).map(
      service => `${service.name}: ${service.details}`
    ),
    ...(data.faqs || []).map(
      faq => `${faq.q}\n${faq.a}`
    )
  ];

  const indices = await rank(query, documents, 8);

  // Contacts, safety rules, and service names are always included.
  return JSON.stringify({
    businessName: data.businessName,
    about: data.about,
    contact: data.contact,
    hours: data.hours,
    appointments: data.appointments,
    animals: data.animals,
    shop: data.shop,
    prices: data.prices,
    serviceNames: (data.services || []).map(
      service => service.name
    ),
    extraInfo: data.extraInfo,
    selectedInformation: indices.map(
      index => documents[index]
    )
  });
}