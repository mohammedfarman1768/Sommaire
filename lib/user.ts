import { getDbConnection } from './db';
import { getUsersUploadCount } from './summaries';
import { pricingPlans } from '@/utils/constants';

// Define the return type of getPriceId
export async function getPriceId(userId: string | undefined): Promise<string | undefined> {
  if (!userId) return undefined;

  const sql = await getDbConnection();
  const query = await sql`SELECT price_id FROM users WHERE user_id = ${userId}`;
  return query?.[0]?.price_id as string | undefined;
}

// Define whether the user has reached their upload limit
export async function hasReachedUploadLimit(userId: string): Promise<boolean> {
  const uploadCount = await getUsersUploadCount(userId);
  const priceId = await getPriceId(userId);

  const isPro = pricingPlans.find((plan) => plan.priceId === priceId)?.id === 'pro';
  const uploadLimit = isPro ? 10 : 5;

  return uploadCount >= uploadLimit;
}
