import { db } from '@/lib/server/db';
import { ok, serverError } from '@/lib/server/http';

export const dynamic = 'force-dynamic';

// CATEGORIES
export async function GET() {
  try {
    const { supabase, supabaseAdmin } = db();
    const { data, error } = await (supabaseAdmin || supabase).from('categories').select('*').order('name');
    if (error) throw error;
    const response = ok(data);
    response.headers.set('Cache-Control', 'public, max-age=0, s-maxage=3, stale-while-revalidate=3');
    return response;
  } catch (err) {
    return serverError(err);
  }
}
