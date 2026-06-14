import { base44 } from '@/api/base44Client';

// Returns plain text response using Base44's built-in LLM integration
export async function invokeLLM(prompt) {
  const result = await base44.integrations.Core.InvokeLLM({ prompt });
  return result || '';
}

// Returns parsed JSON response
export async function invokeLLMJson(prompt) {
  const result = await base44.integrations.Core.InvokeLLM({
    prompt: prompt + '\n\nRespond with valid JSON only, no markdown fences.',
    response_json_schema: {
      type: 'object',
      properties: {},
      additionalProperties: true,
    },
  });
  return result || null;
}