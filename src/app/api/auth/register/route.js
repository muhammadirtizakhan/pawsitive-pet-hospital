import { takeRequestLimit } from '@/lib/server/requestLimit';
import { setCustomerSession } from '@/lib/server/customerSession';
import bcrypt from 'bcryptjs';
import { db } from '@/lib/server/db';
import { ok, fail, serverError, readBody, badBody } from '@/lib/server/http';

// AUTH — REGISTER
export async function POST(request) {
  const origin = request.headers.get('origin');
  if (origin && origin !== new URL(request.url).origin) return fail(403, 'Use this website to sign in.');
  try {
    if (!(await takeRequestLimit(request, 'customer-register', 5, 3600))) return fail(429, 'Please wait before trying again.');
    const body = await readBody(request);
    if (!body) return badBody();
    const { name, email, password, phone, address, city } = body;

    if (typeof name !== 'string' || typeof email !== 'string' || typeof password !== 'string' || name.length > 120 || email.length > 254 || password.length > 256 || !name.trim() || !email || !password) {
      return fail(400, 'Name, email, and password required');
    }
    if (password.length < 6) {
      return fail(400, 'Password must be at least 6 characters');
    }

    const { supabase, supabaseAdmin } = db();
    const client = supabaseAdmin || supabase;

    const { data: existing } = await client
      .from('users')
      .select('id')
      .eq('email', email.toLowerCase())
      .maybeSingle();

    if (existing) {
      return fail(400, 'Email already registered');
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const { data: user, error } = await client
      .from('users')
      .insert([{
        name,
        email: email.toLowerCase(),
        password: hashedPassword,
        phone: phone || null,
        address: address || null,
        city: city || null
      }])
      .select('id, name, email, phone, address, city, created_at')
      .single();

    if (error) throw error;
    return setCustomerSession(ok(user), user);
  } catch (err) {
    return serverError(err);
  }
}
