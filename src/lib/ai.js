/**
 * Unified AI inference router.
 *
 * Priority:
 *   1. Claude API (Anthropic) — if the user has connected their API key in Integrations
 *   2. Base44 InvokeLLM — platform default, always available as fallback
 */
import { base44 } from '@/api/base44Client';
import { getApiKey } from './claude';

const CLAUDE_BASE = 'https://api.anthropic.com/v1';
const CLAUDE_MODEL = 'claude-haiku-4-5';

function claudeAvailable() {
  try { return !!getApiKey(); } catch { return false; }
}

async function claudeText(prompt) {
  const apiKey = getApiKey();
  const res = await fetch(`${CLAUDE_BASE}/messages`, {
    method: 'POST',
    headers: {
      'x-api-key': apiKey,
      'anthropic-version': '2023-06-01',
      'anthropic-dangerous-direct-browser-access': 'true',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: CLAUDE_MODEL,
      max_tokens: 2048,
      messages: [{ role: 'user', content: prompt }],
    }),
  });
  if (!res.ok) {
    const err = await res.text();
    throw new Error(`Claude API error ${res.status}: ${err}`);
  }
  const data = await res.json();
  return data.content?.[0]?.text ?? '';
}

async function claudeJson(prompt) {
  const text = await claudeText(
    prompt + '\n\nRespond with valid JSON only. No markdown fences, no explanation outside the JSON.'
  );
  const cleaned = text.replace(/```(?:json)?\s*/gi, '').replace(/```\s*/g, '').trim();
  const match = cleaned.match(/(\{[\s\S]*\}|\[[\s\S]*\])/);
  if (!match) throw new Error('Claude returned non-JSON response');
  return JSON.parse(match[1]);
}

/**
 * @param {{ prompt: string, response_json_schema?: object }} opts
 * @returns {Promise<string | object>}
 */
export async function invokeLLM({ prompt, response_json_schema } = {}) {
  const wantJson = !!response_json_schema;

  if (claudeAvailable()) {
    return wantJson ? claudeJson(prompt) : claudeText(prompt);
  }

  // Base44 fallback
  return base44.integrations.Core.InvokeLLM({ prompt, response_json_schema });
}
