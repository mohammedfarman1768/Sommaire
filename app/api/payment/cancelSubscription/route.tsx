import { NextResponse } from 'next/server';
import { getDbConnection } from '@/lib/db';
import { razorpay } from '@/lib/razorpay';

interface CancelRequest {
  user_id: string;
  email: string;
}

export async function POST(req: Request): Promise<Response> {
  try {
    const { user_id }: CancelRequest = await req.json();

    if (!user_id) {
      return NextResponse.json({ error: 'Missing user_id' }, { status: 400 });
    }

    const sql = await getDbConnection();

    // Get user's subscription ID
    const query = await sql`
      SELECT subscription_id FROM users WHERE user_id = ${user_id}
    `;
    const subscriptionId: string | null = query?.[0]?.subscription_id;

    if (!subscriptionId) {
      return NextResponse.json({ error: 'No subscription found' }, { status: 400 });
    }

    // Fetch subscription details from Razorpay
    const subscription = await razorpay.subscriptions.fetch(subscriptionId);

    const endTimestamp = subscription?.current_end
      ? subscription.current_end * 1000
      : Date.now(); // fallback in case it's null/undefined

    const endDate = new Date(endTimestamp);

    // Fetch payments related to this subscription
    const paymentsResponse = await razorpay.payments.all({
      // @ts-ignore: Razorpay types don't include subscription_id, but it works
      subscription_id: subscriptionId,
    });

    // TypeScript workaround
    const items = (paymentsResponse as unknown as { items: any[] }).items || [];

    const firstPayment = items?.[0];
    const razorpay_payment_id = firstPayment?.id || null;
    const userEmail = firstPayment?.email || null;

    // Cancel the subscription in Razorpay
    await razorpay.subscriptions.cancel(subscriptionId);

    // Update user in DB
    await sql`
      UPDATE users
      SET status = 'active',
          subscription_id = NULL,
          subscription_end_date = ${endDate.toISOString()},
          price_id = 'basic_free'
      WHERE user_id = ${user_id}
    `;

    // Record cancellation in payments table
    await sql`
      INSERT INTO payments (
        amount,
        status,
        razorpay_payment_id,
        subscription_id,
        user_email,
        user_id
      )
      VALUES (
        ${200},
        'canceled',
        ${razorpay_payment_id},
        ${subscriptionId},
        ${userEmail},
        ${user_id}
      )
    `;

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error('❌ Cancel error:', err);
    return NextResponse.json({ error: 'Failed to cancel subscription' }, { status: 500 });
  }
}
