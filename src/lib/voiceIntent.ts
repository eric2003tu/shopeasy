// @ts-nocheck
// Deprecated/legacy: replaced by voiceIntentClean.ts
// Keep a tiny stub so TypeScript won't try to compile old concatenated implementations.
export const __VOICE_INTENT_DEPRECATED = true;

// VOICE_INTENT_CLEAN_SINGLE_IMPL
// Purpose: single, minimal intent parser used by the client-side assistant.
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

export function detectIntent(text: string, products: string[] = []) {
  return parseIntent(text, products);
}

export default detectIntent;
// Single, cleaned intent detection module
export type IntentResult = {
  intent: string;
  product?: string | null;
  query?: string | null;
  quantity?: number | null;
  price?: number | null;
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

export function detectIntent(text: string, products: string[] = []) {
  return parseIntent(text, products);
}

export default detectIntent;


// Simple intent detector for free-speech input.
// Returns an IntentResult describing the detected intent and extracted data.

export type IntentResult = {
  intent: string; // e.g. 'add_to_cart', 'show_products', 'product_details', 'checkout', 'view_cart', 'remove_from_cart', 'search'
  product?: string | null;
  query?: string | null;
  quantity?: number | null;
  price?: number | null;
  raw?: string;
  confidence?: number;
};

function normalize(s: string) {
  return s.trim().toLowerCase();
}

function extractNumber(s: string) {
  const m = s.match(/\b(\d+)\b/);
  if (m) return Number(m[1]);
  return null;
}

// Very small fuzzy match: returns the first product name that is contained in text
export function matchProductName(text: string, products: string[] = []) {
  const t = normalize(text);
  // exact phrase match
  for (const p of products) {
    const np = normalize(p);
    if (np.length > 2 && t.includes(np)) return p;
  }
  // word-based loose match
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

  if (!t) return { ...res, intent: 'unknown' };

  // add to cart
  if (/\b(add|put|drop)\b/.test(t) && /\b(cart|basket)\b|\bto my cart\b/.test(t)) {
    // try to extract product name after 'add' or before 'to cart'
    const m = t.match(/(?:add|put|drop)\s+(?:the\s+)?(.+?)\s+(?:to|into)\s+(?:my\s+)?cart/);
    let product = m ? m[1] : null;
    if (!product) {
      // try simple: 'add iphone' -> capture word after add
      const m2 = t.match(/(?:add|put|drop)\s+(.+)/);
      product = m2 ? m2[1] : null;
    }
    // try to match against products list
    const matched = product ? matchProductName(product, products) : null;
    return { intent: 'add_to_cart', product: matched || (product ? product : null), query: product || null, quantity: extractNumber(t), confidence: 0.6 };
  }

  // remove from cart
  if (/\b(remove|delete|take out|remove from)\b/.test(t) && /\b(cart|basket)\b/.test(t)) {
    const m = t.match(/(?:remove|delete|take out)\s+(.+?)(?:\s+from\s+cart)?/);
    const product = m ? m[1] : null;
    const matched = product ? matchProductName(product, products) : null;
    return { intent: 'remove_from_cart', product: matched || (product ? product : null), query: product || null, confidence: 0.6 };
  }

  // show products / filter
  if (/\b(show|list|display)\b/.test(t) && /\b(product|products|items)\b/.test(t)) {
    // check for category or query
    const m = t.match(/(?:for|about|in|with)\s+(.+)$/);
    const q = m ? m[1] : null;
    return { intent: 'show_products', query: q, confidence: 0.6 };
  }

  // product details
  if (/\b(show me|details|detail|information|info)\b/.test(t) && /\b(product|item|details?)\b/.test(t)) {
    // try to extract product name
    const m = t.match(/(?:for|about|of)\s+(.+)$/);
    const product = m ? m[1] : null;
    const matched = product ? matchProductName(product, products) : null;
    return { intent: 'product_details', product: matched || (product ? product : null), confidence: 0.6 };
  }

  // direct 'show iphone' or 'iphone details'
  const directProduct = matchProductName(t, products);
  if (directProduct) return { intent: 'product_details', product: directProduct, confidence: 0.7 };

  // view cart
  if (/\b(my cart|view cart|show cart|open cart|cart)\b/.test(t)) return { intent: 'view_cart', confidence: 0.8 };

  // checkout
  if (/\b(checkout|pay|proceed to checkout|place order)\b/.test(t)) return { intent: 'checkout', confidence: 0.9 };

  // search
  if (/\b(search for|find|look for|search)\b/.test(t)) {
    const m = t.match(/(?:search for|find|look for|search)\s+(.+)$/);
    const q = m ? m[1] : null;
    return { intent: 'search', query: q, confidence: 0.6 };
  }

  return { ...res, intent: 'unknown' };
}

export default parseIntent;
// Simple intent detection utility for free-form text
export type Intent =
  | { intent: 'show_products' }
  | { intent: 'product_details'; product?: string }
  | { intent: 'add_to_cart'; product?: string; quantity?: number }
  | { intent: 'remove_from_cart'; product?: string; quantity?: number }
  | { intent: 'show_cart' }
  | { intent: 'checkout' }
  | { intent: 'filter'; filter?: string }
  | { intent: 'search'; query?: string }
  | { intent: 'unknown' };

function normalize(s: string) {
  return s.trim().toLowerCase();
}

function extractQuantity(text: string) {
  // very small heuristic: look for 'two', '3', '1x', 'x 2' etc.
  const numMatch = text.match(/(?:\b(\d{1,3})\b)|(?:\b(one|two|three|four|five|six|seven|eight|nine|ten)\b)/i);
  if (!numMatch) return undefined;
  if (numMatch[1]) return Number(numMatch[1]);
  const map: Record<string, number> = { one: 1, two: 2, three: 3, four: 4, five: 5, six: 6, seven: 7, eight: 8, nine: 9, ten: 10 };
  return map[(numMatch[2] || '').toLowerCase()] || undefined;
}

// naive product matcher: tries exact contains or token overlap
export function findProductMatch(text: string, products: Array<{ id: number | string; title?: string; name?: string }>) {
  const t = normalize(text);
  // try exact contains on title/name
  for (const p of products) {
    const name = normalize((p.title || p.name || '').replace(/[^a-z0-9 ]/gi, ''));
    if (!name) continue;
    if (name.includes(t) || t.includes(name)) return p;
    // token overlap
    const nameTokens = name.split(/\s+/);
    const tokens = t.split(/\s+/);
    const common = tokens.filter((tok) => nameTokens.includes(tok));
    if (common.length >= Math.min(2, Math.ceil(nameTokens.length / 2))) return p;
  }
  // fallback: try partial token match
  for (const p of products) {
    const name = normalize((p.title || p.name || '').replace(/[^a-z0-9 ]/gi, ''));
    const tokens = t.split(/\s+/);
    for (const tok of tokens) {
      if (tok.length > 3 && name.includes(tok)) return p;
    }
  }
  return null;
}

export function detectIntent(textRaw: string, products: Array<{ id: number | string; title?: string; name?: string }> = []): Intent {
  const text = normalize(textRaw);
  if (!text) return { intent: 'unknown' };

  // checkout
  if (/\b(check ?out|pay|place order|purchase)\b/.test(text)) return { intent: 'checkout' };

  // show cart
  if (/\b(show|open|view) (my )?cart\b/.test(text) || /view cart/.test(text)) return { intent: 'show_cart' };

  // show products / browse
  if (/\b(show|list|browse|display|see) (products|items|things)\b/.test(text) || /show me (products|items)/.test(text)) return { intent: 'show_products' };

  // product details patterns
  let m = text.match(/(?:show|open|view|details? of|tell me about) (.+)/);
  if (m && m[1]) {
    const candidate = m[1].trim();
    const p = findProductMatch(candidate, products);
    if (p) return { intent: 'product_details', product: (p.title || p.name) };
    return { intent: 'product_details', product: candidate };
  }

  // add to cart
  if (/\b(add|put|buy|add to cart|purchase)\b/.test(text)) {
    // try to extract product phrase after 'add' or 'buy'
    let qm = text.match(/(?:add|put|buy|purchase|add to cart) (?:the )?(?:product )?(?:of )?(.+)/);
    const qty = extractQuantity(text);
    if (qm && qm[1]) {
      const phrase = qm[1].replace(/ to cart| to my cart| please| now/gi, '').trim();
      const p = findProductMatch(phrase, products);
      if (p) return { intent: 'add_to_cart', product: (p.title || p.name), quantity: qty };
      return { intent: 'add_to_cart', product: phrase, quantity: qty };
    }
    // fallback if no phrase, still return add_to_cart
    return { intent: 'add_to_cart' };
  }

  // remove from cart
  if (/\b(remove|delete|remove from cart|remove item)\b/.test(text)) {
    let qm = text.match(/(?:remove|delete) (.+)/);
    const qty = extractQuantity(text);
    if (qm && qm[1]) {
      const phrase = qm[1].replace(/ from cart| please/gi, '').trim();
      const p = findProductMatch(phrase, products);
      if (p) return { intent: 'remove_from_cart', product: (p.title || p.name), quantity: qty };
      return { intent: 'remove_from_cart', product: phrase, quantity: qty };
    }
    return { intent: 'remove_from_cart' };
  }

  // filter by category/brand
  m = text.match(/(?:filter|show|only) (?:by )?(category|brand|type) (.+)/);
  if (m && m[2]) return { intent: 'filter', filter: m[2].trim() };

  // search fallback
  if (/\b(search for|find|look for|i want|i need)\b/.test(text)) {
    // extract phrase
    const q = text.replace(/(search for|find|look for|i want|i need)/g, '').trim();
    return { intent: 'search', query: q || text };
  }

  return { intent: 'unknown' };
}

export default detectIntent;
