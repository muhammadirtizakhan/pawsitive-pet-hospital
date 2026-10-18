// Supabase clients, created on first use (so `next build` works without env vars).
const { createClient } = require('@supabase/supabase-js');

let cached = null;

function db() {
  if (cached) return cached;
  const supabaseUrl = process.env.SUPABASE_URL;
  const supabaseAnonKey = process.env.SUPABASE_ANON_KEY;
  const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error('❌ SUPABASE_URL or SUPABASE_ANON_KEY missing in .env');
  }

  const supabase = createClient(supabaseUrl, supabaseAnonKey);
  const supabaseAdmin = supabaseServiceKey
    ? createClient(supabaseUrl, supabaseServiceKey, {
        auth: { autoRefreshToken: false, persistSession: false }
      })
    : null;

  cached = { supabase, supabaseAdmin };
  return cached;
}

module.exports = { db };
