import { requireCustomer } from '@/lib/server/customerSession';
import { db } from '@/lib/server/db';
import { ok, serverError, readBody, badBody } from '@/lib/server/http';

// AUTH — UPDATE PROFILE
export async function PUT(request, { params }) {
  try {
    const { id } = await params;
    const denied = requireCustomer(request, id);
    if (denied) return denied;
    const body = await readBody(request);
    if (!body) return badBody();
    const { name, phone, address, city } = body;
    const { supabase, supabaseAdmin } = db();
    const client = supabaseAdmin || supabase;

    const updates = {};
    if (name !== undefined) updates.name = name;
    if (phone !== undefined) updates.phone = phone;
    if (address !== undefined) updates.address = address;
    if (city !== undefined) updates.city = city;

    const { data: user, error } = await client
      .from('users')
      .update(updates)
      .eq('id', id)
      .select('id, name, email, phone, address, city')
      .single();

    if (error) throw error;
    return ok(user);
  } catch (err) {
    return serverError(err);
  }
}
