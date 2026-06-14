import Anthropic from '@anthropic-ai/sdk';

export const anthropic = new Anthropic({
  apiKey: import.meta.env.VITE_ANTHROPIC_API_KEY,
  dangerouslyAllowBrowser: true,
});

// Returns plain text response
export async function invokeLLM(prompt) {
  const message = await anthropic.messages.create({
    model: 'claude-opus-4-8',
    max_tokens: 1024,
    messages: [{ role: 'user', content: prompt }],
  });
  return message.content.find(b => b.type === 'text')?.text ?? '';
}

// Returns parsed JSON response
export async function invokeLLMJson(prompt) {
  const text = await invokeLLM(prompt + '\n\nRespond with valid JSON only, no markdown fences.');
  try {
    const match = text.match(/\{[\s\S]*\}/);
    return match ? JSON.parse(match[0]) : null;
  } catch {
    return null;
  }
}
