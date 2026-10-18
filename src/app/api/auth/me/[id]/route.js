import { requireCustomer } from '@/lib/server/customerSession';
import { db } from '@/lib/server/db';
import { ok, fail, serverError } from '@/lib/server/http';

export const dynamic = 'force-dynamic';

// AUTH — GET USER by ID
export async function GET(request, { params }) {
  try {
    const { id } = await params;
    const denied = requireCustomer(request, id);
    if (denied) return denied;
    const { supabase, supabaseAdmin } = db();
    const client = supabaseAdmin || supabase;

    const { data: user, error } = await client
      .from('users')
      .select('id, name, email, phone, address, city, created_at')
      .eq('id', id)
      .maybeSingle();

    if (error) throw error;
    if (!user) return fail(404, 'User not found');
    return ok(user);
  } catch (err) {
    return serverError(err);
  }
}
