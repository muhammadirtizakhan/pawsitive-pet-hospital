import { after } from 'next/server';
import { db } from '@/lib/server/db';
import { readCustomer } from '@/lib/server/customerSession';
import { prepareCheckout } from '@/lib/server/checkout';
import { takeRequestLimit } from '@/lib/server/requestLimit';
import { ok, fail, serverError, readBody, badBody } from '@/lib/server/http';

export const runtime = 'nodejs';
export const maxDuration = 60;

export async function POST(request) {
  const origin = request.headers.get('origin');
  if (origin && origin !== new URL(request.url).origin) return fail(403, 'Use the website checkout.');
  try {
    if (!(await takeRequestLimit(request, 'checkout', 10, 600))) return fail(429, 'Please wait before placing another order.');
    const body = await readBody(request);
    if (!body || typeof body !== 'object') return badBody();
    const client = db().supabaseAdmin;
    if (!client) throw new Error('Server-side service role required');
    const prepared = await prepareCheckout(client, body);
    const customer = readCustomer(request);
    const { data: order, error } = await client.rpc('store_create_order', {
      p_order: prepared.order, p_items: prepared.items, p_customer_user: customer?.id || null
    });
    if (error) throw error;
    // Notifications have one owner: dashboard. Its cron also picks up this
    // persisted order if the wake-up request is delayed or unavailable.
    after(async () => {
      try {
        const url = new URL('/api/cron/tick', process.env.DASHBOARD_URL);
        if (url.protocol !== 'https:' && process.env.NODE_ENV === 'production') throw new Error('HTTPS dashboard URL required');
        const r = await fetch(url, { headers: { Authorization: `Bearer ${process.env.CRON_SECRET}` }, signal: AbortSignal.timeout(45000), cache: 'no-store' });
        if (!r.ok) throw new Error('Worker wake-up rejected');
      } catch { console.warn('Order saved; notification worker will retry on its next cron tick.'); }
    });
    return ok(order);
  } catch (err) {
    if (err?.status) return fail(err.status, err.message);
    return serverError(err);
  }
}
