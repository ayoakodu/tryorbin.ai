const STORAGE_KEY = 'together_api_key';
const API_BASE = 'https://api.together.xyz/v1';
const DEFAULT_MODEL = 'meta-llama/Llama-3.3-70B-Instruct-Turbo-Free';

export function getApiKey() {
  return localStorage.getItem(STORAGE_KEY) || '';
}

export function setApiKey(key) {
  localStorage.setItem(STORAGE_KEY, key);
}

export async function invokeLLM(prompt) {
  const apiKey = getApiKey();
  if (!apiKey) throw new Error('Together AI API key not set. Connect Together AI in Integrations.');

  const response = await fetch(`${API_BASE}/chat/completions`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: DEFAULT_MODEL,
      messages: [{ role: 'user', content: prompt }],
    }),
  });

  if (!response.ok) {
    const err = await response.text();
    throw new Error(`Together AI error ${response.status}: ${err}`);
  }

  const data = await response.json();
  return data.choices?.[0]?.message?.content ?? '';
}

export async function invokeLLMJson(prompt) {
  const text = await invokeLLM(prompt);
  // Extract JSON from the response (model may wrap it in markdown code fences)
  const jsonMatch = text.match(/```(?:json)?\s*([\s\S]*?)```/) || [null, text];
  const jsonStr = jsonMatch[1].trim();
  return JSON.parse(jsonStr);
}
