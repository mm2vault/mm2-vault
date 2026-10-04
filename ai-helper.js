function hasAiConfig() {
  return Boolean(window.MM2_AI_CONFIG?.apiKey && !window.MM2_AI_CONFIG.apiKey.includes('PASTE_'));
}

function parseLocalValueChanges(sourceText, items) {
  const updates = [];
  const unmatched = [];
  const lines = sourceText.split(/\\r?\\n/).map(line => line.trim()).filter(Boolean);
  const known = items.map(item => ({ id: item.id, name: item.name, value: Number(item.value) || 0 }));

  for (const line of lines) {
    const lower = line.toLowerCase();
    const item = known.find(entry => lower.includes(String(entry.name).toLowerCase()));
    if (!item) { unmatched.push(line); continue; }

    const numbers = [...line.matchAll(/(?:\\b|[+\\-])\\d+(?:[.,]\\d+)?/g)].map(match => Number(match[0].replace(',', '.'))).filter(Number.isFinite);
    const signed = line.match(/([+\\-])\\s*(\\d+(?:[.,]\\d+)?)/);
    const explicit = line.match(/(?:->|→|to|new|now|value|v\\s*[:=])\\s*([0-9][0-9,._]*)/i);
    let newValue = null;
    let change = 0;
    if (explicit) newValue = Number(explicit[1].replace(/[,_]/g, ''));
    else if (signed) {
      change = Number(signed[2].replace(',', '.')) * (signed[1] === '-' ? -1 : 1);
      newValue = item.value + change;
    } else if (numbers.length >= 2) {
      newValue = numbers[numbers.length - 1];
    }
    if (!Number.isFinite(newValue)) { unmatched.push(line); continue; }
    change = newValue - item.value;
    updates.push({ id: item.id, name: item.name, oldValue: item.value, newValue, change, direction: change > 0 ? 'up' : change < 0 ? 'down' : 'same', confidence: 'medium', reason: 'Local value parser' });
  }
  return { updates, unmatched };
}

async function analyzeValueChanges(sourceText, items) {
  if (!sourceText.trim()) throw new Error('Önce MM2Values dəyişiklik metnini yapışdır.');
  if (!hasAiConfig()) return parseLocalValueChanges(sourceText, items);

  const knownItems = items.map(item => ({ id: item.id, name: item.name, value: item.value }));
  const prompt = `You are an MM2 item value assistant. Parse the pasted MM2Values update text and match names only to known items. Return JSON only in this shape: {"updates":[{"id":"known id","name":"known name","oldValue":0,"newValue":0,"change":0,"direction":"up|down|same","confidence":"high|medium|low","reason":"short"}],"unmatched":["name"]}. Use an explicit new value when present. If the source gives only a signed delta like (+20) or (-250), calculate newValue from the known old value. Never invent a value or match an unknown item. Known items: ${JSON.stringify(knownItems)}. Source text: ${sourceText}`;
  const model = window.MM2_AI_CONFIG.model || 'gemini-3.6-flash';
  const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${encodeURIComponent(window.MM2_AI_CONFIG.apiKey)}`;
  const requestBody = JSON.stringify({ contents: [{ parts: [{ text: prompt }] }], generationConfig: { responseMimeType: 'application/json', temperature: 0.1 } });
  let response;
  for (let attempt = 0; attempt < 3; attempt += 1) {
    response = await fetch(endpoint, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: requestBody });
    if (![429, 500, 502, 503, 504].includes(response.status) || attempt === 2) break;
    await new Promise(resolve => setTimeout(resolve, 1500 * (attempt + 1)));
  }
  if (!response.ok) {
    const errorBody = await response.json().catch(() => ({}));
    throw new Error(`Gemini isteği başarısız (${response.status}): ${errorBody.error?.message || 'API xətası'}`);
  }
  const data = await response.json();
  const text = data.candidates?.[0]?.content?.parts?.[0]?.text;
  if (!text) throw new Error('Gemini boş cavab verdi.');
  try { return JSON.parse(text); } catch { throw new Error('Gemini geçerli JSON döndürmedi.'); }
}
