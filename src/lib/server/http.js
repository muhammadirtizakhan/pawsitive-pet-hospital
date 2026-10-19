// Small helpers so the route files read like the old Express handlers.
import { NextResponse } from 'next/server';

export const json = (body, status = 200) => NextResponse.json(body, { status, headers: { 'Cache-Control': 'no-store' } });
export const ok = data => json(data === undefined ? { ok: true } : { ok: true, data });
export const fail = (status, error) => json({ ok: false, error }, status);
export const serverError = err => {
  console.error('Request failed', { code: err?.code || 'none', type: err?.name || 'Error' });
  return fail(500, process.env.NODE_ENV === 'production' ? 'Request could not be completed. Please try again.' : String(err?.message || err));
};

// Reads a JSON (or urlencoded) body like express.json() / express.urlencoded() did.
export async function readBody(request) {
  const type = request.headers.get('content-type') || '';
  try {
    if (type.includes('application/x-www-form-urlencoded')) {
      return Object.fromEntries(new URLSearchParams(await request.text()));
    }
    const text = await request.text();
    return text ? JSON.parse(text) : {};
  } catch {
    return null; // invalid body
  }
}
export const badBody = () => fail(400, 'Invalid request body');

// One canonical public origin. Set SITE_URL in Vercel Production when the domain changes.
// Never derive canonical URLs from arbitrary incoming Host headers.
export function siteUrlFrom() {
  const configured = process.env.SITE_URL || 'https://pawsitive-pet-hospital.vercel.app';
  try {
    const url = new URL(configured);
    if (!['https:', 'http:'].includes(url.protocol) || url.username || url.password) throw new Error();
    return url.origin;
  } catch {
    throw new Error('SITE_URL must be an absolute http(s) website URL');
  }
}
