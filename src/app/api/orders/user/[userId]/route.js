import { requireCustomer } from '@/lib/server/customerSession';
import { db } from '@/lib/server/db';
import { ok, fail, serverError } from '@/lib/server/http';

export const dynamic = 'force-dynamic';

// ORDERS — GET by user (order history)
export async function GET(request, { params }) {
  try {
    const { userId } = await params;
    const denied = requireCustomer(request, userId);
    if (denied) return denied;
    const { supabase, supabaseAdmin } = db();
    const client = supabaseAdmin || supabase;

    const { data: access, error: accessError } = await client.from('customer_orders').select('order_id').eq('user_id', userId);
    if (accessError) throw accessError;
    if (!access?.length) return ok([]);

    const { data, error } = await client
      .from('orders')
      .select(`
        id, subtotal, delivery_fee, total, payment_status, order_status, created_at,
        items:order_items(id, product_name, variant_name, quantity, unit_price, line_total)
      `)
      .in('id', access.map(item => item.order_id))
      .order('created_at', { ascending: false });

    if (error) throw error;
    return ok(data || []);
  } catch (err) {
    return serverError(err);
  }
}
