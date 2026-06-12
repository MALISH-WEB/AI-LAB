import OpenAI from 'openai';
import { env } from '../config/env';

const openaiClient = env.openaiApiKey ? new OpenAI({ apiKey: env.openaiApiKey }) : null;

const fallbackResponse = (prompt: string, context?: string): string =>
  `AI Tutor (fallback): Based on your prompt \"${prompt}\"${context ? ` and context \"${context}\"` : ''}, focus on validating interfaces, routes, and subnet alignment before retesting connectivity.`;

export const generateTutorResponse = async (prompt: string, context?: string): Promise<{ text: string; usedFallback: boolean }> => {
  if (!openaiClient) {
    return { text: fallbackResponse(prompt, context), usedFallback: true };
  }

  const response = await openaiClient.responses.create({
    model: env.openaiModel,
    input: [
      {
        role: 'system',
        content: 'You are an educational networking lab tutor. Give concise hints without revealing final answers.'
      },
      {
        role: 'user',
        content: `Context: ${context ?? 'none'}\nQuestion: ${prompt}`
      }
    ]
  });

  const text = response.output_text || fallbackResponse(prompt, context);
  return { text, usedFallback: false };
};
