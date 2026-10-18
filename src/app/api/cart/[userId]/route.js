import { requireCustomer } from '@/lib/server/customerSession';
import { db } from '@/lib/server/db';
import { ok, fail, serverError, readBody, badBody } from '@/lib/server/http';

export const dynamic = 'force-dynamic';

// CART — read
export async function GET(request, { params }) {
  try {
    const { userId } = await params;
    const denied = requireCustomer(request, userId);
    if (denied) return denied;
    const { supabase, supabaseAdmin } = db();
    const client = supabaseAdmin || supabase;
    const { data: cart, error: cartError } = await client
      .from('carts')
      .select('id')
      .eq('user_id', userId)
      .maybeSingle();
    if (cartError) throw cartError;
    if (!cart) return ok([]);

    const { data, error } = await client
      .from('cart_items')
      .select(`
        id, product_id, variant_id, quantity,
        product:products(id, name, images:product_images(variant_id, image_url, is_primary, sort_order), variants:product_variants(id, variant_value, price)),
        variant:product_variants(id, variant_value, price)
      `)
      .eq('cart_id', cart.id);
    if (error) throw error;
    return ok(data || []);
  } catch (err) {
    return serverError(err);
  }
}

// CART — replace all items
export async function PUT(request, { params }) {
  try {
    const { userId } = await params;
    const denied = requireCustomer(request, userId);
    if (denied) return denied;
    const body = await readBody(request);
    if (!body) return badBody();
    const { items } = body;
    if (!Array.isArray(items) || items.length > 50) {
      return fail(400, 'Cart items must be an array');
    }

    const normalizedItems = items.map(item => ({
      product_id: item.product_id,
      variant_id: item.variant_id || null,
      quantity: Math.floor(Number(item.quantity))
    }));
    if (normalizedItems.some(item => !item.product_id || !Number.isFinite(item.quantity) || item.quantity < 1 || item.quantity > 100)) {
      return fail(400, 'Each cart item needs a product and a positive quantity');
    }

    const { supabase, supabaseAdmin } = db();
    const client = supabaseAdmin || supabase;
    const productIds = [...new Set(normalizedItems.map(item => item.product_id))];
    if (productIds.length) {
      const { data: availableProducts, error: productsError } = await client
        .from('products')
        .select('id')
        .in('id', productIds);
      if (productsError) throw productsError;
      const availableProductIds = new Set((availableProducts || []).map(product => String(product.id)));
      if (productIds.some(productId => !availableProductIds.has(String(productId)))) {
        return fail(400, 'Cart contains a product that is no longer available');
      }
    }

    const variantIds = [...new Set(normalizedItems.map(item => item.variant_id).filter(Boolean))];
    if (variantIds.length) {
      const { data: variants, error: variantsError } = await client
        .from('product_variants')
        .select('id, product_id')
        .in('id', variantIds);
      if (variantsError) throw variantsError;
      const productByVariant = new Map((variants || []).map(variant => [String(variant.id), String(variant.product_id)]));
      if (normalizedItems.some(item => item.variant_id && productByVariant.get(String(item.variant_id)) !== String(item.product_id))) {
        return fail(400, 'Cart contains a variant that no longer belongs to its product');
      }
    }

    const { data: cart, error: cartLookupError } = await client
      .from('carts')
      .select('id')
      .eq('user_id', userId)
      .maybeSingle();
    if (cartLookupError) throw cartLookupError;

    if (!cart && normalizedItems.length === 0) return ok();

    let cartId = cart?.id;
    if (!cartId) {
      const { data: createdCart, error: createError } = await client
        .from('carts')
        .insert({ user_id: userId })
        .select('id')
        .single();
      if (createError) throw createError;
      cartId = createdCart.id;
    }

    const { error: deleteError } = await client.from('cart_items').delete().eq('cart_id', cartId);
    if (deleteError) throw deleteError;

    if (normalizedItems.length) {
      const rows = normalizedItems.map(item => ({ ...item, cart_id: cartId }));
      const { error: insertError } = await client.from('cart_items').insert(rows);
      if (insertError) throw insertError;
    }

    const { error: updateError } = await client
      .from('carts')
      .update({ updated_at: new Date().toISOString() })
      .eq('id', cartId);
    if (updateError) throw updateError;

    return ok();
  } catch (err) {
    return serverError(err);
  }
}
