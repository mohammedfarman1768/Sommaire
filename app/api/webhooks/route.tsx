import { Webhook } from 'svix';
import { headers } from 'next/headers';
import { NextResponse } from 'next/server';
import { getDbConnection } from '@/lib/db';
import { pricingPlans } from '@/utils/constants';

interface ClerkEmailAddress {
  email_address: string;
}

interface ClerkUserCreatedEvent {
  id: string;
  email_addresses: ClerkEmailAddress[];
  first_name?: string;
  last_name?: string;
}

interface WebhookEvent {
  type: string;
  data: ClerkUserCreatedEvent;
}

export async function POST(req: Request): Promise<Response> {
  const WEBHOOK_SECRET = process.env.CLERK_WEBHOOK_SECRET;
  if (!WEBHOOK_SECRET) {
    console.error('Missing Clerk webhook secret');
    return new Response('Webhook secret not configured', { status: 500 });
  }

  // Get raw request body
  const payload = await req.text();

  // Get and normalize headers
  const headersList = await headers();
  const allHeaders: Record<string, string> = {};
  for (const [key, value] of headersList.entries()) {
    allHeaders[key.toLowerCase()] = value;
  }

  const svixId = allHeaders['svix-id'];
  const svixTimestamp = allHeaders['svix-timestamp'];
  const svixSignature = allHeaders['svix-signature'];

  if (!svixId || !svixTimestamp || !svixSignature) {
    return new Response('Missing Svix headers', { status: 400 });
  }

  const svixHeaders = {
    'svix-id': svixId,
    'svix-timestamp': svixTimestamp,
    'svix-signature': svixSignature,
  };

  let evt: WebhookEvent;
  try {
    const wh = new Webhook(WEBHOOK_SECRET);
    evt = wh.verify(payload, svixHeaders) as WebhookEvent;
  } catch (err) {
    console.error('Error verifying webhook:', err);
    return new Response('Error verifying webhook', { status: 400 });
  }

  const { type: eventType, data: eventData } = evt;

  if (eventType === 'user.created') {
    const { id, email_addresses, first_name, last_name } = eventData;

    try {
      const sql = await getDbConnection();
      const email = email_addresses[0]?.email_address || '';
      const fullName = [first_name, last_name].filter(Boolean).join(' ') || '';

      const basicPlan = pricingPlans.find((plan) => plan.id === 'basic');
      const basicPriceId = basicPlan?.priceId || '';

      await sql`
        INSERT INTO users(email, full_name, user_id, price_id, status) 
        VALUES (${email}, ${fullName}, ${id}, ${basicPriceId}, 'active')
      `;

      console.log('✅ User created in database:', id);
    } catch (error) {
      console.error('❌ Error storing user in database:', error);
      return NextResponse.json({ error: 'Database error' }, { status: 500 });
    }
  }

  return NextResponse.json({ success: true });
}
