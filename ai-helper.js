function hasAiConfig() {
  return Boolean(window.MM2_AI_CONFIG?.apiKey && !window.MM2_AI_CONFIG.apiKey.includes('PASTE_'));
}

async function analyzeValueChanges(sourceText, items) {
  if (!hasAiConfig()) throw new Error('Gemini API key yapılandırılmamış. ai-config.local.js dosyasını oluştur.');
  if (!sourceText.trim()) throw new Error('Önce MM2Values değişiklik metnini yapıştır.');

  const knownItems = items.map(item => ({ id: item.id, name: item.name, value: item.value }));
  const prompt = `You are an MM2 item value assistant. Parse the pasted MM2Values update text and match names only to known items. Return JSON only in this shape: {"updates":[{"id":"known id","name":"known name","oldValue":0,"newValue":0,"change":0,"direction":"up|down|same","confidence":"high|medium|low","reason":"short"}],"unmatched":["name"]}. Use an explicit new value when present. If the source gives only a signed delta like (+20) or (-250), calculate newValue from the known old value. Never invent a value or match an unknown item. Known items: ${JSON.stringify(knownItems)}. Source text: ${sourceText}`;
  const model = window.MM2_AI_CONFIG.model || 'gemini-3.6-flash';
  const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${encodeURIComponent(window.MM2_AI_CONFIG.apiKey)}`;
  const requestBody = JSON.stringify({ contents: [{ parts: [{ text: prompt }] }], generationConfig: { responseMimeType: 'application/json', temperature: 0.1 } });
  let response;
  for (let attempt = 0; attempt < 3; attempt += 1) {
    response = await fetch(endpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: requestBody
    });
    if (![429, 500, 502, 503, 504].includes(response.status) || attempt === 2) break;
    await new Promise(resolve => setTimeout(resolve, 1500 * (attempt + 1)));
  }
  if (!response.ok) {
    const errorBody = await response.json().catch(() => ({}));
    const apiMessage = errorBody.error?.message || 'Model bulunamadı veya API etkin deyil.';
    if (response.status === 503) throw new Error('Gemini şu anda yoğun. Otomatik 3 deneme de başarısız oldu; birkaç dakika sonra tekrar dene.');
    throw new Error(`Gemini isteği başarısız (${response.status}): ${apiMessage}`);
  }
  const data = await response.json();
  const text = data.candidates?.[0]?.content?.parts?.[0]?.text;
  if (!text) throw new Error('Gemini boş cevap verdi.');
  try { return JSON.parse(text); } catch { throw new Error('Gemini geçerli JSON döndürmedi.'); }
}
