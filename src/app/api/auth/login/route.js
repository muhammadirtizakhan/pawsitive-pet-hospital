import { takeRequestLimit } from '@/lib/server/requestLimit';
import { setCustomerSession } from '@/lib/server/customerSession';
import bcrypt from 'bcryptjs';
import { db } from '@/lib/server/db';
import { ok, fail, serverError, readBody, badBody } from '@/lib/server/http';

// AUTH — LOGIN
export async function POST(request) {
  const origin = request.headers.get('origin');
  if (origin && origin !== new URL(request.url).origin) return fail(403, 'Use this website to sign in.');
  try {
    if (!(await takeRequestLimit(request, 'customer-login', 20, 600))) return fail(429, 'Please wait before trying again.');
    const body = await readBody(request);
    if (!body) return badBody();
    const { email, password } = body;

    if (typeof email !== 'string' || typeof password !== 'string' || email.length > 254 || password.length > 256 || !email || !password) {
      return fail(400, 'Email and password required');
    }

    const { supabase, supabaseAdmin } = db();
    const client = supabaseAdmin || supabase;

    const { data: user, error } = await client
      .from('users')
      .select('*')
      .eq('email', email.toLowerCase())
      .maybeSingle();

    if (error) throw error;
    if (!user) {
      return fail(401, 'Invalid email or password');
    }

    const isValid = await bcrypt.compare(password, user.password);
    if (!isValid) {
      return fail(401, 'Invalid email or password');
    }

    const { password: _, ...userSafe } = user;
    return setCustomerSession(ok(userSafe), userSafe);
  } catch (err) {
    return serverError(err);
  }
}
