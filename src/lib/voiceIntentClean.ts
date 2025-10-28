// Clean, single-file intent parser for client-side voice assistant
export type IntentResult = {
  intent: string;
  product?: string | null;
  query?: string | null;
  quantity?: number | null;
  raw?: string;
  confidence?: number;
};

function normalize(s: string) {
  return (s || '').trim().toLowerCase();
}

function extractNumber(s: string) {
  const m = s.match(/\b(\d+)\b/);
  if (m) return Number(m[1]);
  return null;
}

export function matchProductName(text: string, products: string[] = []) {
  const t = normalize(text);
  for (const p of products) {
    const np = normalize(p);
    if (np.length > 2 && t.includes(np)) return p;
  }
  const words = t.split(/[^a-z0-9]+/).filter(Boolean);
  for (const p of products) {
    const pw = normalize(p).split(/[^a-z0-9]+/).filter(Boolean);
    const common = pw.filter(w => words.includes(w));
    if (common.length >= Math.max(1, Math.min(2, pw.length))) return p;
  }
  return null;
}

export function parseIntent(raw: string, products: string[] = []): IntentResult {
  const t = normalize(raw || '');
  const res: IntentResult = { intent: 'unknown', raw, confidence: 0 };
  if (!t) return res;

  if (/\b(add|put|buy|purchase)\b/.test(t) && (/\b(cart|basket)\b/.test(t) || /to my cart/.test(t))) {
    const m = t.match(/(?:add|put|buy|purchase)\s+(?:the\s+)?(.+?)\s+(?:to|into)\s+(?:my\s+)?cart/);
    let product = m ? m[1] : null;
    if (!product) {
      const m2 = t.match(/(?:add|put|buy|purchase)\s+(.+)/);
      product = m2 ? m2[1] : null;
    }
    const matched = product ? matchProductName(product, products) : null;
    return { intent: 'add_to_cart', product: matched || (product ? product : null), query: product || null, quantity: extractNumber(t), confidence: 0.6, raw };
  }

  if (/\b(remove|delete|take out)\b/.test(t) && /\b(cart|basket)\b/.test(t)) {
    const m = t.match(/(?:remove|delete|take out)\s+(.+?)(?:\s+from\s+cart)?/);
    const product = m ? m[1] : null;
    const matched = product ? matchProductName(product, products) : null;
    return { intent: 'remove_from_cart', product: matched || (product ? product : null), query: product || null, confidence: 0.6, raw };
  }

  if (/\b(show|list|display)\b/.test(t) && /\b(product|products|items)\b/.test(t)) {
    const m = t.match(/(?:for|about|in|with)\s+(.+)$/);
    const q = m ? m[1] : null;
    return { intent: 'show_products', query: q, confidence: 0.6, raw };
  }

  if (/\b(show me|details|detail|information|info)\b/.test(t) && /\b(product|item|details?)\b/.test(t)) {
    const m = t.match(/(?:for|about|of)\s+(.+)$/);
    const product = m ? m[1] : null;
    const matched = product ? matchProductName(product, products) : null;
    return { intent: 'product_details', product: matched || (product ? product : null), confidence: 0.6, raw };
  }

  const directProduct = matchProductName(t, products);
  if (directProduct) return { intent: 'product_details', product: directProduct, confidence: 0.7, raw };

  if (/\b(my cart|view cart|show cart|open cart|cart)\b/.test(t)) return { intent: 'view_cart', confidence: 0.8, raw };

  if (/\b(checkout|pay|proceed to checkout|place order)\b/.test(t)) return { intent: 'checkout', confidence: 0.9, raw };

  if (/\b(search for|find|look for|search)\b/.test(t)) {
    const m = t.match(/(?:search for|find|look for|search)\s+(.+)$/);
    const q = m ? m[1] : null;
    return { intent: 'search', query: q, confidence: 0.6, raw };
  }

  return res;
}

export function detectIntent(text: string, products: string[] = []) { return parseIntent(text, products); }
export default detectIntent;
