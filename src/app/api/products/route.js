import { db } from '@/lib/server/db';
import { ok, serverError } from '@/lib/server/http';

export const dynamic = 'force-dynamic';

// PRODUCTS — GET all (sirf active)
export async function GET() {
  try {
    const { supabase, supabaseAdmin } = db();
    const { data, error } = await supabase
      .from('products')
      .select(`
        id, name, brand, tag, price, weight, base_description, description_mode, status, category_id, created_at,
        category:categories(id, name),
        variants:product_variants(id, variant_type, variant_value, price, stock, weight, description_override),
        images:product_images(id, variant_id, image_url, is_primary, sort_order)
      `)
      .eq('status', 'active')
      .order('created_at', { ascending: false });

    if (error) throw error;

    const { data: orderItems, error: orderItemsError } = await (supabaseAdmin || supabase)
      .rpc('store_product_sales');
    const soldCounts = new Map();
    if (orderItemsError) console.warn('Product sales counts unavailable:', orderItemsError.message);
    for (const item of orderItems || []) {
      if (item.product_id) {
        soldCounts.set(item.product_id, (soldCounts.get(item.product_id) || 0) + Number(item.quantity || 0));
      }
    }

    const adapted = (data || []).map(p => {
      const images = (p.images || []).sort((a, b) =>
        (Number(b.is_primary) - Number(a.is_primary)) || (a.sort_order - b.sort_order)
      );
      const variants = (p.variants || []).map(variant => {
        const linkedImage = images.find(image => String(image.variant_id) === String(variant.id));
        return {
          ...variant,
          description_mode: variant.description_override ? 'change' : 'same',
          image_url: linkedImage?.image_url || '',
          is_primary: Boolean(linkedImage?.is_primary)
        };
      });
      const firstVariant = variants[0] || {};
      const primaryImage = images.find(image => image.is_primary) || images.find(image => !image.variant_id) || images[0];
      const mainImageUrl = primaryImage?.image_url || '';
      const galleryImages = [...new Set([mainImageUrl, ...images.map(image => image.image_url)].filter(Boolean))];
      const primaryFlavor = variants.find(variant => variant.variant_type === 'flavor' && variant.is_primary);

      const descParts = (p.base_description || '')
        .split(/\n|\|/)
        .map(s => s.trim())
        .filter(Boolean);
      while (descParts.length < 5) descParts.push('');

      return {
        id: p.id,
        name: p.name,
        created_at: p.created_at,
        sold_count: soldCounts.get(p.id) || 0,
        category: p.category?.name || '',
        category_id: p.category_id,
        price: parseFloat(p.price ?? firstVariant.price ?? 0),
        main_image_url: mainImageUrl,
        primary_flavor: primaryFlavor?.variant_value || 'None',
        primary_flavor_variant_id: primaryFlavor?.id || null,
        tag: p.tag || '',
        weight: p.weight || '',
        color: '',
        desc1: descParts[0] || '',
        desc2: descParts[1] || '',
        desc3: descParts[2] || '',
        desc4: descParts[3] || '',
        desc5: descParts[4] || '',
        images: galleryImages,
        variants: variants
      };
    });

    const response = ok(adapted);
    response.headers.set('Cache-Control', 'public, max-age=0, s-maxage=3, stale-while-revalidate=3');
    return response;
  } catch (err) {
    return serverError(err);
  }
}
