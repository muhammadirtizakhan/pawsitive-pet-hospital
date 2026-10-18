const { createHash } = require('node:crypto');
const { db } = require('./db');
async function takeRequestLimit(request, scope, max, seconds) {
  const client = db().supabaseAdmin;
  if (!client) throw new Error('Server service role required');
  const ip = String(request.headers.get('x-forwarded-for') || 'unknown').split(',')[0].trim();
  const key = createHash('sha256').update(`${scope}:${ip}`).digest('hex');
  const { data, error } = await client.rpc('app_take_limit', { p_key: key, p_max: max, p_seconds: seconds });
  if (error) throw new Error('Request limiter unavailable; run deployment migration');
  return data === true;
}
module.exports = { takeRequestLimit };
