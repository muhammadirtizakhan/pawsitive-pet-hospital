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

// Public address of the site (used for SEO links) - SITE_URL if set, otherwise the request's own address.
export function siteUrlFrom(getHeader) {
  if (process.env.SITE_URL) return process.env.SITE_URL.replace(/\/$/, '');
  const host = getHeader('x-forwarded-host') || getHeader('host') || 'localhost:3000';
  const proto = (getHeader('x-forwarded-proto') || 'http').split(',')[0].trim();
  return `${proto}://${host}`.replace(/\/$/, '');
}
