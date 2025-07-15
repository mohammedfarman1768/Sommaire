'use server';

import { getDbConnection } from '@/lib/db';
import { generateSummaryFromGemini } from '@/lib/geminiai';
import { fetchAndExtractPdfText } from '@/lib/langchain';
import { generateSummaryFromOpenAI } from '@/lib/openai';
import { auth } from '@clerk/nextjs/server';
import { revalidatePath } from 'next/cache';

// ------------------- Interfaces -------------------

interface GeneratePdfTextProps {
  fileUrl: string;
}

interface GeneratePdfSummaryProps {
  pdfText: string;
  fileName: string;
}

interface StorePdfSummaryProps {
  fileUrl: string;
  summary: string;
  title: string;
  fileName: string;
  key: string;
}

interface PdfTextResult {
  success: boolean;
  message: string;
  data: { pdfText: string } | null;
}

interface SummaryResult {
  success: boolean;
  message: string;
  data: {
    title: string;
    summary: string;
  } | null;
}

interface StoreSummaryResult {
  success: boolean;
  message: string;
  data?: {
    id: number;
  } | null;
}

// ------------------- Actions -------------------

export async function generatePdfText({
  fileUrl,
}: GeneratePdfTextProps): Promise<PdfTextResult> {
  if (!fileUrl) {
    return {
      success: false,
      message: 'File upload failed',
      data: null,
    };
  }

  try {
    const pdfText = await fetchAndExtractPdfText(fileUrl);

    if (!pdfText) {
      return {
        success: false,
        message: 'Failed to extract text from PDF',
        data: null,
      };
    }

    return {
      success: true,
      message: 'PDF text extracted successfully',
      data: { pdfText },
    };
  } catch (error) {
    return {
      success: false,
      message: 'Error extracting PDF text',
      data: null,
    };
  }
}

export async function generatePdfSummary({
  pdfText,
  fileName,
}: GeneratePdfSummaryProps): Promise<SummaryResult> {
  try {
    let summary: string | undefined;

    try {
      summary = await generateSummaryFromOpenAI(pdfText);
    } catch (error: any) {
      if (error?.message === 'RATE_LIMIT_EXCEEDED') {
        try {
          summary = await generateSummaryFromGemini(pdfText);
        } catch (geminiError) {
          console.error('Gemini Error', geminiError);
          throw new Error('Summary generation failed from all AI providers');
        }
      } else {
        throw error;
      }
    }

    if (!summary) {
      return {
        success: false,
        message: 'Summary generation failed',
        data: null,
      };
    }

    return {
      success: true,
      message: 'Summary generated successfully',
      data: {
        title: fileName,
        summary,
      },
    };
  } catch (error) {
    return {
      success: false,
      message: 'Error generating summary',
      data: null,
    };
  }
}

async function savePdfSummary({
  userId,
  fileUrl,
  summary,
  title,
  fileName,
  key,
}: StorePdfSummaryProps & { userId: string }): Promise<{ id: number; summary_text: string }> {
  try {
    const sql = await getDbConnection();
    const result = await sql`
      INSERT INTO pdf_summaries (
        user_id,
        original_file_url,
        summary_text,
        title,
        file_name,
        file_key
      )
      VALUES (
        ${userId},
        ${fileUrl},
        ${summary},
        ${title},
        ${fileName},
        ${key}
      )
      RETURNING id, summary_text
    `;

    const savedSummary = result[0] as { id: number; summary_text: string };
    return savedSummary;
  } catch (error) {
    console.error('Failed to save summary:', error);
    throw new Error('Error saving summary to database');
  }
}

export async function storePdfSummaryAction({
  fileUrl,
  summary,
  title,
  fileName,
  key,
}: StorePdfSummaryProps): Promise<StoreSummaryResult> {
  try {
    const { userId } = await auth();
    if (!userId) {
      return {
        success: false,
        message: 'User not found',
        data: null,
      };
    }

    const savedSummary = await savePdfSummary({
      userId,
      fileUrl,
      summary,
      title,
      fileName,
      key,
    });

    if (!savedSummary) {
      return {
        success: false,
        message: 'Failed to store summary',
        data: null,
      };
    }

    revalidatePath(`/summaries/${savedSummary.id}`);

    return {
      success: true,
      message: 'Summary stored successfully',
      data: {
        id: savedSummary.id,
      },
    };
  } catch (err: any) {
    return {
      success: false,
      message: err?.message || 'Summary storage failed',
      data: null,
    };
  }
}
