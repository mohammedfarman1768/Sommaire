'use server';

import { neon, type NeonQueryFunction } from '@neondatabase/serverless';

export async function getDbConnection(): Promise<NeonQueryFunction<false, false>> {
  if (!process.env.DATABASE_URL) {
    throw new Error('DATABASE_URL not found');
  }

  const sql = neon(process.env.DATABASE_URL);
  return sql;
}
