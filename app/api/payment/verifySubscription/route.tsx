// app/api/payment/createSubscription/route.ts
import { razorpay } from '@/lib/razorpay';
import { NextResponse } from 'next/server';

interface CreateSubscriptionRequest {
  email: string;
  userId: string;
}

export async function POST(req: Request): Promise<Response> {
  try {
    const { email, userId }: CreateSubscriptionRequest = await req.json();

    // 🔍 Logging input
    console.log('📥 Subscription request received:', { email, userId });

    if (!email || !userId) {
      return NextResponse.json({ error: 'Missing email or userId' }, { status: 400 });
    }

    // 🔍 Logging env
    console.log('🔍 RAZORPAY_PLAN_ID:', process.env.RAZORPAY_PLAN_ID);

    // 🧾 Create subscription
    const subscription = await razorpay.subscriptions.create({
      plan_id: process.env.RAZORPAY_PLAN_ID!,
      customer_notify: 1,
      total_count: 12,
      notes: { email, userId },
    });

    // ✅ Success
    console.log('✅ Subscription created:', subscription.id);
    return NextResponse.json({ success: true, subscription });

  } catch (error: any) {
    console.error('❌ Subscription Error:', error);
    return NextResponse.json(
      {
        error: 'Failed to create subscription',
        details: error?.description || error?.message || error,
      },
      { status: 500 }
    );
  }
}
