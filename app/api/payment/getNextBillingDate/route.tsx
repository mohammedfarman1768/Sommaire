import { NextResponse } from 'next/server';
import { getDbConnection } from '@/lib/db';
import { razorpay } from '@/lib/razorpay';

interface RequestBody {
  user_id: string;
}

export async function POST(req: Request): Promise<Response> {
  try {
    const { user_id }: RequestBody = await req.json();

    if (!user_id) {
      return NextResponse.json({ error: 'Missing user_id' }, { status: 400 });
    }

    const sql = await getDbConnection();

    const result = await sql`
      SELECT subscription_id FROM users WHERE user_id = ${user_id}
    `;

    const subscriptionId = result?.[0]?.subscription_id;

    if (!subscriptionId) {
      return NextResponse.json(
        { error: 'No subscription found for user' },
        { status: 404 }
      );
    }

    const subscription = await razorpay.subscriptions.fetch(subscriptionId);

    if (!subscription.current_end) {
      return NextResponse.json(
        { error: 'Subscription does not have a current_end date' },
        { status: 400 }
      );
    }

    const nextBillingDate = new Date(subscription.current_end * 1000); // Convert from UNIX to JS date

    return NextResponse.json({
      success: true,
      next_billing_date: nextBillingDate.toISOString(),
      status: subscription.status,
    });

  } catch (error: any) {
    console.error('❌ Error fetching billing date:', error);
    return NextResponse.json(
      {
        error: 'Internal Server Error',
        details: error?.message || error,
      },
      { status: 500 }
    );
  }
}
