import { randomBytes } from 'node:crypto';
import { NextResponse } from 'next/server';

import {
  askGemini,
  cleanMessages,
  fallbackReply
} from '@/lib/server/chatbot';

import {
  handleOrder,
  hash,
  takeLimit
} from '@/lib/server/chatbotOrders';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';
export const maxDuration = 60;

export async function POST(request) {
  const origin = request.headers.get('origin');

  if (
    origin
    && origin !== new URL(request.url).origin
  ) {
    return NextResponse.json(
      {
        ok: false,
        reply: 'Please use the website chat.'
      },
      { status: 403 }
    );
  }

  const cookie = request.cookies
    .get('pawsitive_chat')?.value;

  const token = /^[a-f0-9]{64}$/.test(cookie || '')
    ? cookie
    : randomBytes(32).toString('hex');

  const respond = (reply, status = 200) => {
    const response = NextResponse.json(
      {
        ok: status === 200,
        reply
      },
      { status }
    );

    response.headers.set('Cache-Control', 'no-store');

    response.cookies.set('pawsitive_chat', token, {
      httpOnly: true,
      sameSite: 'strict',
      secure: process.env.NODE_ENV === 'production',
      path: '/',
      maxAge: 1800
    });

    return response;
  };

  try {
    const raw = await request.text();

    if (raw.length > 60000) {
      return respond('Please send a shorter message.', 413);
    }

    let body;

    try {
      body = JSON.parse(raw);
    } catch {
      return respond('Invalid message.', 400);
    }

    const contents = cleanMessages(body?.messages);

    if (!contents) {
      return respond('Please send a message.', 400);
    }

    // Deploy behind a proxy that overwrites x-forwarded-for,
    // as Vercel does.
    const ip = (
      request.headers.get('x-forwarded-for')
      || 'unknown'
    )
      .split(',')[0]
      .trim();

    if (
      !(await takeLimit(`chat-ip:${ip}`, 30, 600))
      || !(await takeLimit(`chat-session:${token}`, 30, 600))
    ) {
      return respond(
        'Please wait a few minutes before sending more messages.',
        429
      );
    }

    const text = contents.at(-1).parts[0].text;

    const orderReply = await handleOrder(
      text,
      hash(token),
      ip
    );

    return respond(
      orderReply ?? await askGemini(contents)
    );
  }catch (err) {
    const message = String(err?.message || '');

    console.error('CHATBOT ERROR:', {
      code: String(err?.code || 'none'),
      type: String(err?.name || 'Error'),
      reason:
        /^Gemini HTTP \d{3}$/.test(message) ||
        [
          'Chatbot requires server-side service role',
          'Set CHATBOT_OTP_SECRET',
          'Gemini is not configured',
          'Empty Gemini reply'
        ].includes(message)
          ? message
          : 'Underlying request failed',
      serviceRoleConfigured: Boolean(
        process.env.SUPABASE_SERVICE_ROLE_KEY
      ),
      geminiConfigured: Boolean(process.env.GEMINI_API_KEY),
      otpSecretValid:
        (process.env.CHATBOT_OTP_SECRET || '').length >= 32
    });
    return respond(
      `I could not check that right now. ${fallbackReply()}`,
      503
    );
  }
}