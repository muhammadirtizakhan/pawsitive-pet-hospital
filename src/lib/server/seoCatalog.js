import { cache } from 'react';
import { db } from './db';

// Public fields only. Do not include orders, customers or service credentials in page props.
export const getSeoCatalog = cache(async () => {
  try {
    const { supabase } = db();
    const products = [];
    for (let start = 0; start < 49000; start += 1000) {
      const { data, error } = await supabase.from('products').select(`
        id, name, brand, price, weight, tag, base_description, created_at,
        category:categories(name),
        variants:product_variants(id, variant_type, variant_value, price, weight),
        images:product_images(image_url, is_primary, sort_order, variant_id)
      `).eq('status', 'active').order('id').range(start, start + 999)
        .abortSignal(AbortSignal.timeout(8000));
      if (error) throw error;
      products.push(...(data || []));
      if (!data || data.length < 1000) break;
    }
    return { available: true, products };
  } catch {
    console.error('SEO catalogue read unavailable; live shop can retry in the browser.');
    return { available: false, products: [] };
  }
});
export function productImage(product) {
  const images = [...(product?.images || [])].sort((a,b) => Number(b.is_primary) - Number(a.is_primary) || (a.sort_order || 0) - (b.sort_order || 0));
  return images.find(i => /^https?:\/\//i.test(i.image_url || ''))?.image_url || '';
}
