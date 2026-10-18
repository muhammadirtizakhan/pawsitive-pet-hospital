import { createHash, createHmac, randomInt } from 'node:crypto';
import { db } from './db';

export const hash = value =>
  createHash('sha256').update(String(value)).digest('hex');

export function adminClient() {
  const client = db().supabaseAdmin;

  if (!client) {
    throw new Error('Chatbot requires server-side service role');
  }

  return client;
}

export async function takeLimit(key, max, seconds) {
  const { data, error } = await adminClient().rpc(
    'chatbot_take_limit',
    {
      p_key: hash(key),
      p_max: max,
      p_seconds: seconds
    }
  );

  if (error) throw error;

  return data === true;
}

export function orderRef(text) {
  return (
    text.match(
      /\b[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}\b/i
    )?.[0]?.toLowerCase()
    ||
    text.match(/\bORD-([0-9a-f]{6})\b/i)?.[1]?.toLowerCase()
    ||
    null
  );
}

function codeHash(session, code) {
  const secret = process.env.CHATBOT_OTP_SECRET;

  if (!secret || secret.length < 32) {
    throw new Error('Set CHATBOT_OTP_SECRET');
  }

  return createHmac('sha256', secret)
    .update(`${session}:${code}`)
    .digest('hex');
}

const phone = '+92 334 3601699';

const roman = text =>
  /\b(bhai|mera|meri|hai|hain|kya|nahi|kr|karo|batao|aya|aaya|abhi|paisa|kitna)\b/i
    .test(text);

const choose = (text, en, ur) => roman(text) ? ur : en;

const help = text => choose(
  text,
  'To check your order securely, send its ID and the email used at checkout together, for example: track ORD-ABC123 your@email.com. Then enter the 6-digit code emailed to you here. Never share your password.',
  'Order check karne ke liye ID aur checkout wali email saath bhejein: track ORD-ABC123 your@email.com. Phir email par aane wala 6-digit code isi chat mein likhein. Password share na karein.'
);

export function statusReply(order, text) {
  const ref = `ORD-${order.id.slice(0, 6).toUpperCase()}`;
  const cancelled = order.order_status === 'cancelled';
  const paid = order.payment_status === 'paid';
  const state = cancelled ? 'Cancelled' : paid ? 'Paid' : order.order_status === 'checking' ? 'Checking availability' : 'Pending payment';
  const note = cancelled
    ? choose(text, `For cancellation or refund help, contact Maaz at ${phone}.`, `Cancellation ya refund ke liye Maaz bhai se ${phone} par rabta karein.`)
    : paid
      ? choose(text, `Your payment is confirmed. For an order that has not arrived or a delivery update, send this order ID to Maaz at ${phone}. A delivery date is not available in this record.`, `Aapki payment confirmed hai. Order nahi mila ya delivery update chahiye to yeh order ID Maaz bhai ko ${phone} par bhejein. Record mein delivery ki tareekh available nahi hai.`)
      : order.order_status === 'checking'
        ? choose(text, 'We are checking availability. Please wait for confirmation before paying.', 'Availability check ho rahi hai. Payment se pehle confirmation ka wait karein.')
        : choose(text, `Payment is not confirmed in our records. If you already paid, send your screenshot and order ID to Maaz at ${phone} for verification.`, `Record mein payment confirm nahi hai. Agar pay kar diya hai to screenshot aur order ID Maaz bhai ko ${phone} par bhejein.`);
  return `${ref}\nStatus: ${state}\n${note}`;
}

async function lookup(ref, email) {
  let query = adminClient()
    .from('orders')
    .select('id,customer_email')
    .eq('customer_email', email);

  query = ref.length === 36
    ? query.eq('id', ref)
    : query
      .gte('id', `${ref}00-0000-0000-0000-000000000000`)
      .lte('id', `${ref}ff-ffff-ffff-ffff-ffffffffffff`);

  const { data, error } = await query.limit(2);

  if (error) throw error;

  return data?.length === 1 ? data[0] : null;
}

async function sendCode(email, code) {
  if (
    !process.env.BREVO_API_KEY
    || !process.env.BREVO_SENDER_EMAIL
  ) {
    throw new Error('Email not configured');
  }

  const response = await fetch(
    'https://api.brevo.com/v3/smtp/email',
    {
      method: 'POST',
      headers: {
        'api-key': process.env.BREVO_API_KEY,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        sender: {
          name: 'Pawsitive Clinic',
          email: process.env.BREVO_SENDER_EMAIL
        },
        to: [{ email }],
        subject: 'Your Pawsitive order verification code',
        textContent:
          `Your code is ${code}. It expires in 10 minutes. Enter it only in the Pawsitive website chat where you requested it. If you did not request it, ignore this email.`
      }),
      signal: AbortSignal.timeout(10000)
    }
  );

  if (!response.ok) {
    throw new Error('Verification email failed');
  }
}

export async function handleOrder(text, session, ip) {
  const ref = orderRef(text);

  const otp = text.trim().match(
    /^(?:code\s*:?\s*|otp\s*:?\s*)?(\d{6})$/i
  )?.[1];

  const wanted = ref
    || otp
    || /\b(order|delivery|deliver|parcel|payment|paid|tracking|status|refund|shipment|shipped|pending|unpaid|cancelled)\b|آرڈر|ادائیگی/i
      .test(text);

  if (!wanted) return null;

  const client = adminClient();

  if (otp) {
    const { data, error } = await client.rpc(
      'chatbot_verify_code',
      {
        p_session: session,
        p_hash: codeHash(session, otp)
      }
    );

    if (error) throw error;

    if (!data) {
      return 'Code is incorrect, expired, or already used. Maximum 5 attempts. To request a new code, send your order ID and checkout email again.';
    }
  }

  const { data: verified, error } = await client
    .from('chatbot_order_sessions')
    .select('order_id,verified_until')
    .eq('session_hash', session)
    .maybeSingle();

  if (error) throw error;

  if (
    verified?.order_id
    && Date.parse(verified.verified_until) > Date.now()
    && (!ref || verified.order_id.startsWith(ref))
  ) {
    const { data: order, error: orderError } = await client
      .from('orders')
      .select('id,payment_status,order_status')
      .eq('id', verified.order_id)
      .maybeSingle();

    if (orderError) throw orderError;

    return order
      ? statusReply(order, text)
      : `This order is no longer available. Contact ${phone}.`;
  }

  const email = text.match(
    /\b[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}\b/i
  )?.[0]?.toLowerCase();

  if (!ref || !email) return help(text);

  codeHash(session, 'check-config');

  if (
    !(await takeLimit(`otp-session:${session}`, 1, 60))
    || !(await takeLimit(`otp-email:${email}`, 3, 3600))
    || !(await takeLimit(`otp-ip:${ip}`, 10, 3600))
  ) {
    return 'Please wait before requesting another code. If you cannot access your checkout email, contact the clinic.';
  }

  const order = await lookup(ref, email);
  const code = String(randomInt(100000, 1000000));

  const { error: saveError } = await client
    .from('chatbot_order_sessions')
    .upsert({
      session_hash: session,
      order_id: order?.id || null,
      code_hash: codeHash(session, code),
      expires_at: new Date(Date.now() + 600000).toISOString(),
      attempts: 0,
      verified_until: null
    });

  if (saveError) throw saveError;

  // Same public reply for matched/unmatched orders.
  // Never reveal an email or customer details.
  if (order) {
    try {
      await sendCode(order.customer_email, code);
    } catch {
      console.warn('Chatbot verification email unavailable');
    }
  }

  return choose(
    text,
    'If those details match an order, a 6-digit code will be sent to its checkout email. Check inbox/spam and enter the code here within 10 minutes. If it does not arrive, contact the clinic.',
    'Agar details order se match hoti hain to checkout email par 6-digit code aayega. Inbox/spam check karke 10 minute ke andar code yahan likhein. Code na aaye to clinic se rabta karein.'
  );
}