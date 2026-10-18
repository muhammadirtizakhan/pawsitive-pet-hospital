import { db } from './db';
import { rank } from './chatbotRetrieval';

export async function productContext(query) {
  const products = [];

  // Public catalog fields only.
  for (let from = 0; from < 1000; from += 200) {
    const { data, error } = await db().supabase
      .from('products')
      .select(`
        id,
        name,
        price,
        weight,
        base_description,
        category:categories(name),
        variants:product_variants(
          variant_type,
          variant_value,
          price,
          weight,
          stock
        )
      `)
      .eq('status', 'active')
      .order('id')
      .range(from, from + 199);

    if (error) throw error;

    products.push(...(data || []));

    if ((data || []).length < 200) break;

    if (from === 800) {
      throw new Error('Catalog exceeds safe retrieval limit');
    }
  }

  const catalog = products.map(product => ({
    name: product.name,
    category: product.category?.name || '',
    priceRs: product.price ?? null,
    weight: product.weight || null,
    description: (product.base_description || '')
      .slice(0, 1500),
    variants: (product.variants || []).slice(0, 40)
  }));

  const relevant = await rank(
    query,
    catalog.map(product => JSON.stringify(product)),
    8
  );

  return JSON.stringify({
    currency: 'PKR (display Rs)',
    live: true,

    nameIndex: catalog.map(product => ({
      name: product.name,
      category: product.category
    })),

    selectedProducts: relevant.map(
      index => catalog[index]
    ),

    rules:
      'Active means listed, not guaranteed in stock. Null means unknown. A base price and each variant price are separate; never invent missing prices or weights. No medical suitability unless explicitly documented.'
  });
}