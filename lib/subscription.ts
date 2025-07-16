import { razorpay } from './razorpay';
import { getDbConnection } from './db';

interface SubscriptionDetails {
  status: string;
  nextBillingDate: Date;
}

interface LastPayment {
  updated_at: Date;
}

export async function getSubscriptionDetails(userId: string): Promise<SubscriptionDetails | null> {
  const sql = await getDbConnection();

  // ✅ Use "id" instead of non-existent "user_id"
  const userResult = await sql`
    SELECT subscription_id, status
    FROM users
    WHERE id = ${userId}
  `;

  const subscriptionId = userResult?.[0]?.subscription_id;
  const userStatus = userResult?.[0]?.status;

  if (!subscriptionId) return null;

  const subscription = await razorpay.subscriptions.fetch(subscriptionId);

  if (!subscription.current_end) {
    throw new Error('Missing current_end in Razorpay subscription');
  }

  return {
    status: userStatus,
    nextBillingDate: new Date(subscription.current_end * 1000),
  };
}

export async function getLastPayment(userId: string): Promise<LastPayment | null> {
  const sql = await getDbConnection();

  // ✅ Lookup by user email since payments only store user_email
  const userResult = await sql`
    SELECT email
    FROM users
    WHERE id = ${userId}
  `;
  const email = userResult?.[0]?.email;

  if (!email) return null;

  const query = await sql`
    SELECT updated_at
    FROM payments
    WHERE user_email = ${email}
    ORDER BY updated_at DESC
    LIMIT 1
  `;

  const result = query?.[0] as LastPayment | undefined;

  return result ?? null;
}
