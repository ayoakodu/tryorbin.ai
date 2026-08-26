/**
 * Unified AI inference router.
 *
 * Priority:
 *   1. Together AI — if the user has connected their API key in Integrations
 *   2. Base44 InvokeLLM — platform default, always available as fallback
 *
 * Drop-in replacement for `base44.integrations.Core.InvokeLLM({ prompt, response_json_schema })`.
 * Call signature is identical so every page just swaps the import.
 */
import { base44 } from '@/api/base44Client';
import { getApiKey } from './together';

const TOGETHER_BASE = 'https://api.together.xyz/v1';
const TOGETHER_MODEL = 'meta-llama/Llama-3.3-70B-Instruct-Turbo-Free';

function togetherAvailable() {
  try { return !!getApiKey(); } catch { return false; }
}

async function togetherText(prompt) {
  const apiKey = getApiKey();
  const res = await fetch(`${TOGETHER_BASE}/chat/completions`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${apiKey}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({
      model: TOGETHER_MODEL,
      messages: [{ role: 'user', content: prompt }],
      max_tokens: 2048,
    }),
  });
  if (!res.ok) {
    const err = await res.text();
    throw new Error(`Together AI error ${res.status}: ${err}`);
  }
  const data = await res.json();
  return data.choices?.[0]?.message?.content ?? '';
}

async function togetherJson(prompt) {
  const text = await togetherText(
    prompt + '\n\nRespond with valid JSON only. No markdown fences, no explanation outside the JSON.'
  );
  // Strip any accidental markdown fences
  const cleaned = text.replace(/```(?:json)?\s*/gi, '').replace(/```\s*/g, '').trim();
  // Extract the first JSON object or array
  const match = cleaned.match(/(\{[\s\S]*\}|\[[\s\S]*\])/);
  if (!match) throw new Error('Together AI returned non-JSON response');
  return JSON.parse(match[1]);
}

/**
 * @param {{ prompt: string, response_json_schema?: object }} opts
 * @returns {Promise<string | object>}  string when no schema, parsed object when schema provided
 */
export async function invokeLLM({ prompt, response_json_schema } = {}) {
  const wantJson = !!response_json_schema;

  if (togetherAvailable()) {
    return wantJson ? togetherJson(prompt) : togetherText(prompt);
  }

  // Base44 fallback — same interface
  return base44.integrations.Core.InvokeLLM({ prompt, response_json_schema });
}
