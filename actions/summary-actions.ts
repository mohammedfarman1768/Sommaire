'use server';

import { getDbConnection } from '@/lib/db';
import { currentUser } from '@clerk/nextjs/server';
import { revalidatePath } from 'next/cache';
import { utapi } from '@/app/server/uploadthing';

interface DeleteSummaryActionProps {
  summaryId: string; // string, because it's a UUID
}

interface DeleteSummaryResult {
  success: boolean;
  error?: string;
}

export async function deleteSummaryAction({
  summaryId,
}: DeleteSummaryActionProps): Promise<DeleteSummaryResult> {
  try {
    const user = await currentUser();
    const userId = user?.id;

    if (!userId) {
      return { success: false, error: 'User not found' };
    }

    const sql = await getDbConnection();
    const result = await sql`
      DELETE FROM pdf_summaries 
      WHERE id = ${summaryId} AND user_id = ${userId} 
      RETURNING file_key;
    `;

    const key = result[0]?.file_key as string | undefined;

    if (!key) {
      return {
        success: false,
        error: 'No file key found for deletion.',
      };
    }

    const deleteFileResult = await utapi.deleteFiles(key);

    if ('deletedCount' in deleteFileResult && deleteFileResult.deletedCount === 0) {
      return {
        success: false,
        error: 'Failed to delete file from storage.',
      };
    }

    if (result.length > 0) {
      revalidatePath('/dashboard');
      return { success: true };
    }

    return {
      success: false,
      error: 'Summary not found or unauthorized.',
    };
  } catch (error: any) {
    console.error('Error Deleting Summary:', error);
    return {
      success: false,
      error: error?.message || 'Unexpected error occurred',
    };
  }
}
