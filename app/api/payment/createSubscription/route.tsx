import { razorpay } from '@/lib/razorpay';
import { NextResponse } from 'next/server';

interface CreateSubscriptionRequest {
  email: string;
  userId: string;
}

export async function POST(req: Request): Promise<Response> {
  try {
    const { email, userId }: CreateSubscriptionRequest = await req.json();

    if (!email || !userId) {
      return NextResponse.json({ error: 'Missing email or userId' }, { status: 400 });
    }

    // ✅ Debug: print environment variables
    console.log('🔍 RAZORPAY_KEY_ID:', process.env.RAZORPAY_KEY_ID);
    console.log('🔍 RAZORPAY_KEY_SECRET:', process.env.RAZORPAY_KEY_SECRET?.slice(0, 4)); // for safety, only show part

    // ✅ Attempt to create subscription
    const subscription = await razorpay.subscriptions.create({
      plan_id: process.env.RAZORPAY_PLAN_ID!,
      customer_notify: 1,
      total_count: 12,
      notes: {
        email,
        userId,
      },
    });

    return NextResponse.json({ success: true, subscription });
  } catch (error: any) {
    console.error('❌ Subscription Error:', error);
    return NextResponse.json(
      {
        error: 'Failed to create subscription',
        details: error?.message || error,
      },
      { status: 500 }
    );
  }
}
