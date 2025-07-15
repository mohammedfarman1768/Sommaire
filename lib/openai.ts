import OpenAI from 'openai';
import { SUMMARY_SYSTEM_PROMPT } from '@/utils/prompts';

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY || '', // Make sure your env variable is set
});

export async function generateSummaryFromOpenAI(pdfText: string): Promise<string> {
  try {
    const completion = await client.chat.completions.create({
      model: 'gpt-4o',
      messages: [
        {
          role: 'system',
          content: SUMMARY_SYSTEM_PROMPT,
        },
        {
          role: 'user',
          content: `Transform this document into an engaging, easy-to-read summary with contextually relevant emojis and proper markdown formatting:\n\n${pdfText}`,
        },
      ],
      temperature: 0.7,
      max_tokens: 1500,
    });

    const content = completion.choices[0]?.message?.content;

    if (!content) {
      throw new Error('No content returned from OpenAI');
    }

    return content;
  } catch (err: any) {
    if (err?.status === 429) {
      throw new Error('RATE_LIMIT_EXCEEDED');
    }
    console.error('OpenAI API error:', err);
    throw new Error('Failed to generate summary');
  }
}
