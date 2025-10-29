// Clean, single-file intent parser for client-side voice assistant
export type IntentResult = {
  intent: string;
  product?: string | null;
  query?: string | null;
  filterType?: string | null;
  filterValue?: string | null;
  quantity?: number | null;
  navTarget?: string | null;
  smallTalkType?: string | null;
  confirm?: boolean;
  cancel?: boolean;
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

  // Phrase lists (expanded to include user-provided variants)
  const phrases = {
    go_home: [
      'go to home','take me home','back to the homepage','open home page','show the main page','navigate home','homepage please','bring me to the start','i want the home screen','return to home','go to homepage','go home','home'
    ],
    open_products: [
      'show products','open products','take me to products','view all products','go to shop','i want to see items','show me what you sell','products page please','show items list','let me browse products','show items','browse products','view products','let me browse'
    ],
    open_cart: [
      'open my cart','show my cart','go to cart','what\'s in my cart?','what\'s in my cart','view shopping cart','take me to my cart','cart page','display my cart items','check my cart','show what i added','my cart','show cart','display my cart'
    ],
    go_checkout: [
      'proceed to checkout','i want to pay','checkout please','take me to checkout','let me finish my order','continue to checkout','go to payment step','i\'m ready to pay','finish the purchase','order now'
    ],
    open_payments: [
      'show payment page','payment method selection','i want to pay with mobile money','i want to pay with card','payment options please','take me to payment','pay now','go to payment screen','choose my payment','continue to payment','confirm payment'
    ],
    view_orders: [
      'show my orders','track my orders','go to my orders','order history page','i want to see what i bought','track delivery','where are my orders?','where are my orders','order page please','check my orders','display my order list'
    ],
    search_prefixes: [
      'search for','i want','do you have','find','look for','show me','i need','display','browse','get me','show me'
    ],
    filter_prefixes: [
      'filter by','show only','display only','show only','display items under','show discounts only','latest arrivals','show latest arrivals','sort alphabetically','sort by','sort by price','sort'
    ],
    details_prefixes: [
      'show details of','tell me about','open','product info for','i want to see','more information on','show me the specifications of','what is','let me see','display the info of','product details','show me the details of'
    ],
    add_to_cart_prefixes: [
      'add','put','i want to buy','take one','add it for me','add this item','get me','i need','please add','buy','add to cart','put in my cart','put in my basket'
    ],
    increase_qty_phrases: [
      'add one more','increase quantity','take another one','make it two','make it three','add another piece','i want more of that item','increase the number','add one extra','more of that product','raise item count'
    ],
    remove_phrases: [
      'remove','take out','delete','i don\'t want','remove it from cart','cancel that product','drop','take that out please','remove this one','clear','remove from cart','delete that item','remove the product'
    ],
    login_phrases: [
      'go to login','login please','i want to log in','show login page','let me sign in','i want to enter my account','navigate to login','login screen','i want my account','sign-in page please'
    ],
    signup_phrases: [
      'i want to sign up','create an account','register me','show signup page','open registration','make me an account','sign up please','let me register','registration screen','open account creation'
    ],
    profile_phrases: [
      'my account','show my profile','open personal page','account settings','profile screen','go to my account','view my details','show user page','account page please','i want to change my info'
    ],
    help_phrases: [
      'help me','i need assistance','i am stuck','what should i do','customer support please','i have a problem','can you assist me','show help page','help section','i need guidance'
    ],
    greetings_phrases: [
      'hello','hi','hey','good morning','good evening','how are you?','how are you','are you there','hello assistant','nice to meet you','i\'m back'
    ],
    confirm_phrases: [
      'yes','okay','sure','confirm','proceed','continue','that\'s correct','go ahead','do it','sounds good'
    ],
    cancel_phrases: [
      'stop','cancel','don\'t do that','forget it','no','i changed my mind','cancel the action','not that','wait','pause'
    ]
  } as const;

  function matchAny(list: readonly string[]) {
    for (const ph of list) {
      if (t.includes(ph)) return true;
    }
    return false;
  }

  // First, try exact phrase-list matches (covers the many variants the user provided)
  if (matchAny(phrases.go_home)) return { intent: 'go_home', confidence: 0.95, raw };
  if (matchAny(phrases.open_products)) return { intent: 'open_products', confidence: 0.95, raw };
  if (matchAny(phrases.open_cart)) return { intent: 'open_cart', confidence: 0.95, raw };
  if (matchAny(phrases.go_checkout)) return { intent: 'go_checkout', confidence: 0.95, raw };
  if (matchAny(phrases.open_payments)) return { intent: 'open_payments', confidence: 0.95, raw };
  if (matchAny(phrases.view_orders)) return { intent: 'view_orders', confidence: 0.95, raw };

  if (matchAny(phrases.login_phrases)) return { intent: 'login', confidence: 0.95, raw };
  if (matchAny(phrases.signup_phrases)) return { intent: 'signup', confidence: 0.95, raw };
  if (matchAny(phrases.profile_phrases)) return { intent: 'view_profile', confidence: 0.95, raw };
  if (matchAny(phrases.help_phrases)) return { intent: 'help', confidence: 0.95, raw };
  if (matchAny(phrases.greetings_phrases)) return { intent: 'greetings', smallTalkType: 'hello', confidence: 0.8, raw };
  if (matchAny(phrases.confirm_phrases)) return { intent: 'confirm', confirm: true, confidence: 0.95, raw };
  if (matchAny(phrases.cancel_phrases)) return { intent: 'cancel', cancel: true, confidence: 0.95, raw };



  // NAVIGATION intents
  if (/\b(home|homepage|main page|start|home screen)\b/.test(t) && /\b(go|open|take me|bring|return)\b/.test(t)) {
    return { intent: 'go_home', confidence: 0.9, raw };
  }

  if (/\b(show|open|view|go to|take me to)\b/.test(t) && /\b(products|items|shop|catalog)\b/.test(t)) {
    return { intent: 'open_products', confidence: 0.9, raw };
  }

  if (/\b(open|show|view|go to|take me to)\b/.test(t) && /\b(cart|carts|shopping cart|my cart|basket)\b/.test(t)) {
    return { intent: 'open_cart', confidence: 0.9, raw };
  }

  if (/\b(checkout|pay|payment|place order|finish)\b/.test(t) && /\b(proceed|go to|open|take me|let me)\b/.test(t)) {
    return { intent: 'go_checkout', confidence: 0.9, raw };
  }

  if (/\b(payment|payments|payment options|payment method)\b/.test(t) && /\b(show|open|go to|take me)\b/.test(t)) {
    return { intent: 'open_payments', confidence: 0.9, raw };
  }

  if (/\b(order(s)?|order history|my orders|track)\b/.test(t) && /\b(show|open|view|go to|where)\b/.test(t)) {
    return { intent: 'view_orders', confidence: 0.9, raw };
  }

  // SEARCH / FILTER / BROWSING
  if (/\b(search for|find|look for|search|show me|i want|do you have|get me|browse)\b/.test(t)) {
    const m = t.match(/(?:search for|find|look for|show me|i want|do you have|get me|browse)\s+(.+)$/);
    const q = m ? m[1] : (t || null);
    return { intent: 'search', query: q, confidence: 0.8, raw };
  }

  // filter (price/category/brand/color/discount/sort)
  if (/\b(filter|show only|display only|sort)\b/.test(t) || /\b(show only|display items under|show discounts|latest|arrivals)\b/.test(t)) {
    const ft = (t.match(/by\s+(price|category|brand|color|discount|price range|size)/) || [])[1] || null;
    const fv = (t.match(/(?:under|below|less than|under)\s+([\d,]+)|(?:for|of)\s+([a-z0-9\s]+)/) || []).slice(1).filter(Boolean)[0] || null;
    return { intent: 'filter_products', filterType: ft, filterValue: fv, confidence: 0.7, raw };
  }

  // PRODUCT DETAILS
  if (/\b(show details|tell me about|open|what is|product info|more information|specifications|details?)\b/.test(t)) {
    const m = t.match(/(?:for|about|of|on|about)\s+(.+)$/);
    const product = m ? m[1] : null;
    const matched = product ? matchProductName(product, products) : null;
    return { intent: 'view_product_details', product: matched || (product ? product : null), confidence: 0.8, raw };
  }

  // DIRECT product name (user just says a product)
  const directProduct = matchProductName(t, products);
  if (directProduct) return { intent: 'view_product_details', product: directProduct, confidence: 0.8, raw };

  // CART ACTIONS
  if (/\b(add|put|buy|purchase|get|i want|please add|add it)\b/.test(t) && ( /\b(cart|basket)\b/.test(t) || /to my cart|to cart/.test(t) || t.startsWith('add ') )) {
    const m = t.match(/(?:add|put|buy|purchase|get|please add)\s+(?:one\s+|a\s+|the\s+)?(.+?)?(?:\s+to\s+(?:my\s+)?cart)?\s*$/);
    let product = m ? m[1] : null;
    if (!product || product === 'it') product = null;
    const qty = extractNumber(t) || null;
    const matched = product ? matchProductName(product, products) : null;
    return { intent: 'add_to_cart', product: matched || (product ? product : null), quantity: qty, confidence: 0.75, raw };
  }

  // increase quantity
  if (/\b(add one more|increase quantity|add another|make it two|make it three|more of that|add another piece|increase the number|add one extra|raise item count)\b/.test(t)) {
    const qty = extractNumber(t) || 1;
    const m = t.match(/(?:of|for)\s+(.+)$/);
    const product = m ? m[1] : null;
    const matched = product ? matchProductName(product, products) : null;
    return { intent: 'increase_quantity', product: matched || (product ? product : null), quantity: qty, confidence: 0.7, raw };
  }

  if (/\b(remove|delete|take out|drop|cancel|i don'?t want)\b/.test(t) && /\b(cart|basket)\b/.test(t)) {
    // Capture the full product phrase up to an optional 'from cart' or end-of-string.
    const m = t.match(/(?:remove|delete|take out|drop|cancel|i don'?t want)\s+(.+?)(?:\s+from\s+cart)?\s*$/);
    const product = m ? m[1] : null;
    const matched = product ? matchProductName(product, products) : null;
    return { intent: 'remove_from_cart', product: matched || (product ? product : null), query: product || null, confidence: 0.75, raw };
  }

  // AUTH
  if (/\b(login|log in|sign in|let me sign in|show login|go to login)\b/.test(t)) return { intent: 'login', confidence: 0.9, raw };
  if (/\b(sign up|signup|register|create an account|let me register)\b/.test(t)) return { intent: 'signup', confidence: 0.9, raw };

  // PROFILE / HELP
  if (/\b(my account|profile|account settings|show my profile|view my details)\b/.test(t)) return { intent: 'view_profile', confidence: 0.9, raw };
  if (/\b(help|assist|customer support|i need assistance|what should i do)\b/.test(t)) return { intent: 'help', confidence: 0.9, raw };

  // SMALL TALK
  if (/\b(hello|hi|hey|good morning|good evening|are you there|i'm back)\b/.test(t)) return { intent: 'greetings', smallTalkType: 'hello', confidence: 0.6, raw };
  if (/^\s*(yes|okay|sure|confirm|proceed|continue|that's correct|go ahead|do it)\s*$/i.test(raw)) return { intent: 'confirm', confirm: true, confidence: 0.9, raw };
  if (/^\s*(stop|cancel|don't do that|forget it|no|wait|pause|i changed my mind)\s*$/i.test(raw)) return { intent: 'cancel', cancel: true, confidence: 0.9, raw };

  // fallback catch-alls
  if (/\b(my cart|view cart|show cart|open cart|cart)\b/.test(t)) return { intent: 'open_cart', confidence: 0.8, raw };
  if (/\b(checkout|pay|proceed to checkout|place order)\b/.test(t)) return { intent: 'go_checkout', confidence: 0.9, raw };

  return res;
}

export function detectIntent(text: string, products: string[] = []) { return parseIntent(text, products); }
export default detectIntent;
