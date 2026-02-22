import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

const RESEND_API_URL = 'https://api.resend.com/emails';

function isValidEmail(value: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

function escapeHtml(value: string) {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

async function sendContactEmail(params: {
  name: string;
  email: string;
  phone: string;
  message: string;
  locale: string;
}) {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    throw new Error('RESEND_API_KEY is not configured');
  }

  const to = process.env.CONTACT_TO_EMAIL || 'service@onnebau.de';
  const from = process.env.CONTACT_FROM_EMAIL || 'Onebbau <onboarding@resend.dev>';
  const localeLabel = params.locale === 'ru' ? 'RU' : 'DE';
  const phoneValue = params.phone || '—';

  const subject = `Neue Anfrage (${localeLabel}) — ${params.name}`;
  const text = [
    'Neue Kontaktanfrage von onebbau.de',
    '',
    `Name: ${params.name}`,
    `E-Mail: ${params.email}`,
    `Telefon: ${phoneValue}`,
    `Sprache: ${params.locale}`,
    '',
    'Nachricht:',
    params.message,
  ].join('\n');

  const html = `
    <h2>Neue Kontaktanfrage von onebbau.de</h2>
    <p><strong>Name:</strong> ${escapeHtml(params.name)}</p>
    <p><strong>E-Mail:</strong> ${escapeHtml(params.email)}</p>
    <p><strong>Telefon:</strong> ${escapeHtml(phoneValue)}</p>
    <p><strong>Sprache:</strong> ${escapeHtml(params.locale)}</p>
    <p><strong>Nachricht:</strong></p>
    <p>${escapeHtml(params.message).replace(/\n/g, '<br/>')}</p>
  `.trim();

  const response = await fetch(RESEND_API_URL, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      from,
      to: [to],
      reply_to: params.email,
      subject,
      text,
      html,
    }),
  });

  if (!response.ok) {
    const body = await response.text();
    throw new Error(`Resend error ${response.status}: ${body}`);
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const name = typeof body?.name === 'string' ? body.name.trim() : '';
    const email = typeof body?.email === 'string' ? body.email.trim() : '';
    const phone = typeof body?.phone === 'string' ? body.phone.trim() : '';
    const message = typeof body?.message === 'string' ? body.message.trim() : '';
    const locale = body?.locale === 'ru' ? 'ru' : 'de';

    if (!name || !email || !message) {
      return NextResponse.json(
        { error: 'Name, E-Mail und Nachricht sind erforderlich.' },
        { status: 400 }
      );
    }

    if (!isValidEmail(email)) {
      return NextResponse.json(
        { error: 'Bitte geben Sie eine gültige E-Mail-Adresse an.' },
        { status: 400 }
      );
    }

    await sendContactEmail({ name, email, phone, message, locale });

    const contact = await prisma.contactRequest.create({
      data: {
        name,
        email,
        phone: phone || null,
        message,
        locale,
      },
    });

    return NextResponse.json({ success: true, id: contact.id }, { status: 201 });
  } catch (error) {
    console.error('Contact form error:', error);
    return NextResponse.json(
      { error: 'Interner Serverfehler.' },
      { status: 500 }
    );
  }
}
