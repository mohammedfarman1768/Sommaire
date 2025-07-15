import { getDbConnection } from './db';

// Define types for summaries
interface Summary {
  id: string;
  user_id: string;
  title: string;
  original_file_url: string;
  summary_text: string;
  status: string;
  created_at: string;
  updated_at: string;
  file_name: string;
  word_count: number;
}

export async function getSummaries(userId: string): Promise<Summary[]> {
  const sql = await getDbConnection();
  const summaries = await sql`
    SELECT * FROM pdf_summaries
    WHERE user_id = ${userId}
    ORDER BY created_at DESC;
  `;
  return summaries as Summary[];
}

export async function getSummaryById(id: string): Promise<Summary | null> {
  try {
    const sql = await getDbConnection();
    const result = await sql`
      SELECT
        id,
        user_id,
        title,
        original_file_url,
        summary_text,
        status,
        created_at,
        updated_at,
        file_name,
        LENGTH(summary_text) - LENGTH(REPLACE(summary_text, ' ', '')) + 1 as word_count
      FROM pdf_summaries
      WHERE id = ${id};
    `;
    return result[0] as Summary || null;
  } catch (error) {
    console.error('Error fetching summary by ID:', error);
    return null;
  }
}

export async function getUsersUploadCount(userId: string): Promise<number> {
  try {
    const sql = await getDbConnection();
    const result = await sql`
      SELECT COUNT(*) as count FROM pdf_summaries WHERE user_id = ${userId};
    `;
    return Number(result[0].count); // cast in case count is returned as string
  } catch (error) {
    console.error('Error fetching upload count:', error);
    return 0;
  }
}
