import { db } from '@/lib/server/db';
import { json } from '@/lib/server/http';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const { supabase } = db();
    const { error } = await supabase.from('categories').select('id').limit(1);
    if (error) throw error;
    return json({ ok: true, message: 'Website server connected to Supabase ✅' });
  } catch (err) {
    return json({ ok: false, error: 'Database connection unavailable' }, 500);
  }
}
