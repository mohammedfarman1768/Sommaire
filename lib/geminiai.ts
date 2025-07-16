import { GoogleGenerativeAI, type GenerateContentRequest } from '@google/generative-ai';
import { SUMMARY_SYSTEM_PROMPT } from '@/utils/prompts';

// ✅ Ensure correct env variable name matches your .env file
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');

export const generateSummaryFromGemini = async (pdfText: string): Promise<string> => {
  try {
    const model = genAI.getGenerativeModel({
      model: 'gemini-2.0-flash',
      generationConfig: {
        temperature: 0.7,
        maxOutputTokens: 1500,
      },
    });

    const prompt: GenerateContentRequest = {
      contents: [
        {
          role: 'user',
          parts: [
            { text: SUMMARY_SYSTEM_PROMPT },
            {
              text: `Transform this document into an engaging, easy-to-read summary with contextually relevant emojis and proper markdown formatting:\n\n${pdfText}`,
            },
          ],
        },
      ],
    };

    const result = await model.generateContent(prompt);
    const responseText = await result.response.text();

    if (!responseText) {
      throw new Error('Empty response from Gemini');
    }

    return responseText;
  } catch (err) {
    console.error('Gemini API Error:', err);
    throw err;
  }
};
