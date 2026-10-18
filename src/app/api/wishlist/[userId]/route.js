import { requireCustomer } from '@/lib/server/customerSession';
import { db } from '@/lib/server/db';
import { ok, fail, serverError, readBody, badBody } from '@/lib/server/http';

export const dynamic = 'force-dynamic';

// WISHLIST — list product ids
export async function GET(request, { params }) {
  try {
    const { userId } = await params;
    const denied = requireCustomer(request, userId);
    if (denied) return denied;
    const { supabase, supabaseAdmin } = db();
    const client = supabaseAdmin || supabase;
    const { data, error } = await client
      .from('wishlist')
      .select('product_id, created_at')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });
    if (error) throw error;
    return ok((data || []).map(item => item.product_id));
  } catch (err) {
    return serverError(err);
  }
}

// WISHLIST — add
export async function POST(request, { params }) {
  try {
    const { userId } = await params;
    const denied = requireCustomer(request, userId);
    if (denied) return denied;
    const body = await readBody(request);
    if (!body) return badBody();
    const { product_id } = body;
    if (!product_id) {
      return fail(400, 'Product ID required');
    }
    const { supabase, supabaseAdmin } = db();
    const client = supabaseAdmin || supabase;
    const { data: product, error: productError } = await client
      .from('products')
      .select('id')
      .eq('id', product_id)
      .maybeSingle();
    if (productError) throw productError;
    if (!product) return fail(404, 'Product is no longer available');

    const { data: existing, error: lookupError } = await client
      .from('wishlist')
      .select('id')
      .eq('user_id', userId)
      .eq('product_id', product_id)
      .maybeSingle();
    if (lookupError) throw lookupError;
    if (existing) return ok();

    const { error } = await client
      .from('wishlist')
      .insert({ user_id: userId, product_id });
    if (error) throw error;
    return ok();
  } catch (err) {
    return serverError(err);
  }
}
