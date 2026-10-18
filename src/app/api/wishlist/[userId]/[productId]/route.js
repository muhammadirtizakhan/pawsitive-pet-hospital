import { requireCustomer } from '@/lib/server/customerSession';
import { db } from '@/lib/server/db';
import { ok, serverError } from '@/lib/server/http';

// WISHLIST — remove
export async function DELETE(request, { params }) {
  try {
    const { userId, productId } = await params;
    const denied = requireCustomer(request, userId);
    if (denied) return denied;
    const { supabase, supabaseAdmin } = db();
    const client = supabaseAdmin || supabase;
    const { error } = await client
      .from('wishlist')
      .delete()
      .eq('user_id', userId)
      .eq('product_id', productId);
    if (error) throw error;
    return ok();
  } catch (err) {
    return serverError(err);
  }
}
