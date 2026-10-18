const crypto = require('node:crypto');

const COOKIE = 'pawsitive_customer_session';
const MAX_AGE = 7 * 86400;
const UUID = /^[a-f0-9]{8}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{12}$/i;
function secret() {
  const value = process.env.CUSTOMER_SESSION_SECRET;
  if (!value || value.length < 32) throw new Error('Set CUSTOMER_SESSION_SECRET (32+ characters)');
  return value;
}
function sign(value) {
  return crypto.createHmac('sha256', secret()).update(value).digest('hex');
}
function readCustomer(request) {
  const entry = (request.headers.get('cookie') || '').split(';').map(s => s.trim()).find(s => s.startsWith(`${COOKIE}=`));
  if (!entry) return null;
  try {
    const [payload, signature, extra] = decodeURIComponent(entry.slice(COOKIE.length + 1)).split('.');
    if (extra || !payload || !/^[a-f0-9]{64}$/.test(signature || '')) return null;
    if (!crypto.timingSafeEqual(Buffer.from(signature), Buffer.from(sign(payload)))) return null;
    const session = JSON.parse(Buffer.from(payload, 'base64url').toString());
    if (!UUID.test(session.id || '') || !Number.isFinite(session.expires) || session.expires <= Date.now()) return null;
    return { id: session.id };
  } catch { return null; }
}
function requireCustomer(request, id) {
  const session = readCustomer(request);
  if (!session) return Response.json({ ok: false, error: 'Please sign in again.' }, { status: 401 });
  if (!UUID.test(id || '') || session.id.toLowerCase() !== id.toLowerCase()) {
    return Response.json({ ok: false, error: 'Access denied.' }, { status: 403 });
  }
  const origin = request.headers.get('origin');
  if (!['GET', 'HEAD'].includes(request.method) && origin && origin !== new URL(request.url).origin) {
    return Response.json({ ok: false, error: 'Use the website to make this change.' }, { status: 403 });
  }
  return null;
}
function setCustomerSession(response, user) {
  const payload = Buffer.from(JSON.stringify({ id: user.id, expires: Date.now() + MAX_AGE * 1000 })).toString('base64url');
  response.headers.append('Set-Cookie', `${COOKIE}=${payload}.${sign(payload)}; HttpOnly; SameSite=Lax; Path=/; Max-Age=${MAX_AGE}${process.env.NODE_ENV === 'production' ? '; Secure' : ''}`);
  response.headers.set('Cache-Control', 'private, no-store');
  return response;
}
function clearCustomerSession(response) {
  response.headers.append('Set-Cookie', `${COOKIE}=; HttpOnly; SameSite=Lax; Path=/; Max-Age=0${process.env.NODE_ENV === 'production' ? '; Secure' : ''}`);
  return response;
}
module.exports = { readCustomer, requireCustomer, setCustomerSession, clearCustomerSession };
