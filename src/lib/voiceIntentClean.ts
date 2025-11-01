// voiceIntentClean.ts - Professional voice intent parser with enhanced voice recognition
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
  infoType?: string | null; // 'price', 'category', 'weight', 'dimensions', 'description', 'availability', 'shipping'
  raw?: string;
  confidence?: number;
};

function normalize(s: string): string {
  return (s || '').trim().toLowerCase().replace(/[^\w\s]/g, '');
}

function extractNumber(s: string): number | null {
  // Match digits
  const digitMatch = s.match(/\b(\d+)\b/);
  if (digitMatch) return Number(digitMatch[1]);
  
  // Handle written numbers with expanded vocabulary
  const numberWords: Record<string, number> = {
    'zero': 0, 'one': 1, 'two': 2, 'three': 3, 'four': 4, 'five': 5,
    'six': 6, 'seven': 7, 'eight': 8, 'nine': 9, 'ten': 10,
    'eleven': 11, 'twelve': 12, 'thirteen': 13, 'fourteen': 14, 'fifteen': 15,
    'sixteen': 16, 'seventeen': 17, 'eighteen': 18, 'nineteen': 19,
    'twenty': 20, 'thirty': 30, 'forty': 40, 'fifty': 50,
    'sixty': 60, 'seventy': 70, 'eighty': 80, 'ninety': 90,
    'hundred': 100, 'thousand': 1000,
    'a': 1, 'an': 1, 'a couple': 2, 'couple': 2, 'few': 3, 'several': 3
  };
  
  const words = s.split(/\s+/);
  let total = 0;
  let current = 0;
  
  for (const word of words) {
    const num = numberWords[word];
    if (num !== undefined) {
      if (num >= 100) {
        current *= num;
        total += current;
        current = 0;
      } else {
        current += num;
      }
    }
  }
  
  total += current;
  return total > 0 ? total : null;
}

export function matchProductName(text: string, products: string[] = []): string | null {
  const t = normalize(text);
  if (!t || products.length === 0) return null;

  // Exact match first (highest confidence)
  for (const p of products) {
    const np = normalize(p);
    if (np === t) return p;
  }

  // Contains match (high confidence)
  for (const p of products) {
    const np = normalize(p);
    if (np.length > 2 && t.includes(np)) return p;
  }

  // Word-based fuzzy match (medium confidence)
  const words = t.split(/\s+/).filter(w => w.length > 2);
  let bestMatch: string | null = null;
  let bestScore = 0;

  for (const p of products) {
    const pw = normalize(p).split(/\s+/).filter(w => w.length > 2);
    const common = pw.filter(w => words.includes(w));
    const score = common.length / Math.max(pw.length, words.length);
    
    if (score > bestScore && score >= 0.5) {
      bestScore = score;
      bestMatch = p;
    }
  }

  if (bestMatch) return bestMatch;

  // Partial word match (low confidence)
  for (const p of products) {
    const pw = normalize(p).split(/\s+/).filter(w => w.length > 3);
    for (const word of pw) {
      if (t.includes(word) && word.length > 3) {
        return p;
      }
    }
  }

  return null;
}

export function parseIntent(raw: string, products: string[] = []): IntentResult {
  const t = normalize(raw || '');
  const res: IntentResult = { intent: 'unknown', raw, confidence: 0.1 };
  
  if (!t || t.length < 2) {
    return res;
  }

  // Enhanced phrase lists with natural voice variations for better voice recognition
  const phrases = {
    // Navigation
    go_home: [
      'go home', 'take me home', 'back to home', 'home page', 'main page', 
      'start page', 'home screen', 'go to homepage', 'show homepage', 'open home',
      'return home', 'back home', 'lets go home', 'i want to go home', 'home please',
      'can we go home', 'navigate home', 'take me to home', 'show me home'
    ],
    open_products: [
      'show products', 'view products', 'browse products', 'see products', 
      'product list', 'all products', 'items list', 'what do you sell',
      'show me products', 'show items', 'view items', 'browse items',
      'what products', 'see what you have', 'show me what you sell',
      'display products', 'list products', 'product catalog', 'shopping',
      'whats available', 'available products', 'show me everything'
    ],
    open_cart: [
      'my cart', 'shopping cart', 'view cart', 'show cart', 'open cart',
      'whats in my cart', 'see my cart', 'check my cart', 'cart items',
      'show basket', 'my basket', 'view basket', 'shopping basket',
      'what did i add', 'whats in cart', 'show me my cart', 'cart please',
      'open my cart', 'display cart', 'show shopping cart', 'my shopping cart'
    ],
    go_checkout: [
      'checkout', 'proceed to checkout', 'go to checkout', 'place order',
      'buy now', 'make purchase', 'complete order', 'finish shopping',
      'ready to buy', 'pay now', 'order now', 'complete purchase',
      'i want to buy', 'lets checkout', 'take me to checkout', 'checkout now',
      'proceed with purchase', 'finalize order', 'make payment'
    ],
    open_payments: [
      'payment', 'payments', 'payment options', 'how to pay',
      'payment methods', 'choose payment', 'select payment',
      'payment page', 'go to payment', 'show payment options',
      'pay with card', 'pay with cash', 'payment screen', 'make payment',
      'payment methods', 'payment gateway', 'payment processing'
    ],
    view_orders: [
      'my orders', 'order history', 'past orders', 'previous orders',
      'see my orders', 'show orders', 'order list', 'track orders',
      'where is my order', 'order status', 'my purchases',
      'what i ordered', 'show my purchases', 'order tracking',
      'my order history', 'previous purchases'
    ],

    // Authentication
    login: [
      'login', 'log in', 'sign in', 'user login', 'account login',
      'go to login', 'show login', 'login page', 'sign in page',
      'i want to login', 'let me login', 'access my account', 'login please',
      'take me to login', 'sign in now', 'log me in'
    ],
    signup: [
      'sign up', 'register', 'create account', 'new account',
      'make account', 'join now', 'registration', 'signup page',
      'create profile', 'make new account', 'register account',
      'sign up please', 'create new account', 'register now'
    ],
    view_profile: [
      'my account', 'my profile', 'account settings', 'profile page',
      'user profile', 'account info', 'my details', 'personal info',
      'view profile', 'show my account', 'account page', 'my settings',
      'profile settings', 'account details'
    ],

    // Support
    help: [
      'help', 'help me', 'i need help', 'support', 'customer service',
      'assistance', 'can you help', 'what can you do', 'how does this work',
      'need assistance', 'help section', 'support page', 'get help',
      'help center', 'customer support', 'i need support'
    ],
    // Logout
    logout: [
      'log me out', 'logout', 'sign out', 'log off', 'log out', 'exit my account', 'sign me out', 'i want to log out', 'log off please', 'end session', 'stop my login session', 'remove account session'
    ],

    // Small Talk
    greetings: [
      'hello', 'hi', 'hey', 'good morning', 'good afternoon', 
      'good evening', 'how are you', 'whats up', 'hey there',
      'nice to meet you', 'hi there', 'hello there', 'greetings',
      'howdy', 'good day', 'morning', 'afternoon', 'evening'
    ],
    thanks: [
      'thank you', 'thanks', 'appreciate it', 'thank you very much',
      'thanks a lot', 'grateful', 'that helps', 'perfect thanks',
      'thank you so much', 'thanks a bunch', 'much appreciated'
    ],
    goodbye: [
      'goodbye', 'bye', 'see you', 'farewell', 'take care',
      'see you later', 'bye bye', 'have a good day', 'good night'
    ],

    // Actions
    confirm: [
      'yes', 'ok', 'okay', 'sure', 'confirm', 'proceed', 'continue',
      'that\'s right', 'correct', 'agree', 'accept', 'go ahead',
      'do it', 'sounds good', 'perfect', 'exactly', 'affirmative',
      'roger', 'approved', 'definitely', 'absolutely'
    ],
    cancel: [
      'no', 'cancel', 'stop', 'never mind', 'forget it', 'don\'t',
      'not now', 'later', 'wait', 'pause', 'hold on', 'abort',
      'cancel that', 'i changed my mind', 'skip', 'negative',
      'stop that', 'cancel order', 'cancel process'
    ]
  };

  // Helper function to check phrase matches with improved voice recognition
  function matchPhrase(phraseList: readonly string[]): boolean {
    return phraseList.some(phrase => {
      // For voice recognition, use more flexible matching
      const normalizedPhrase = normalize(phrase);
      const words = normalizedPhrase.split(/\s+/);
      
      // Check if all significant words from phrase are in the transcript
      const significantWords = words.filter(w => w.length > 2);
      if (significantWords.length > 0) {
        const matches = significantWords.filter(w => t.includes(w));
        return matches.length >= Math.max(1, significantWords.length * 0.7);
      }
      
      // Fallback to exact matching for short phrases
      return t === normalizedPhrase || t.includes(normalizedPhrase);
    });
  }

  // Enhanced intent detection with better voice recognition patterns

  // Check all phrase categories with improved confidence scoring
  if (matchPhrase(phrases.go_home)) return { intent: 'navigation', navTarget: 'home', confidence: 0.95, raw };
  if (matchPhrase(phrases.open_products)) return { intent: 'navigation', navTarget: 'products', confidence: 0.95, raw };
  if (matchPhrase(phrases.open_cart)) return { intent: 'navigation', navTarget: 'cart', confidence: 0.95, raw };
  if (matchPhrase(phrases.go_checkout)) return { intent: 'navigation', navTarget: 'checkout', confidence: 0.95, raw };
  if (matchPhrase(phrases.open_payments)) return { intent: 'navigation', navTarget: 'payments', confidence: 0.95, raw };
  if (matchPhrase(phrases.view_orders)) return { intent: 'navigation', navTarget: 'orders', confidence: 0.95, raw };
  
  if (matchPhrase(phrases.login)) return { intent: 'auth', navTarget: 'login', confidence: 0.95, raw };
  if (matchPhrase(phrases.signup)) return { intent: 'auth', navTarget: 'signup', confidence: 0.95, raw };
  if (matchPhrase(phrases.view_profile)) return { intent: 'auth', navTarget: 'profile', confidence: 0.95, raw };
  if (matchPhrase(phrases.logout)) return { intent: 'auth', navTarget: 'logout', confidence: 0.95, raw };
  
  if (matchPhrase(phrases.help)) return { intent: 'support', confidence: 0.95, raw };
  
  if (matchPhrase(phrases.greetings)) return { intent: 'small_talk', smallTalkType: 'greeting', confidence: 0.9, raw };
  if (matchPhrase(phrases.thanks)) return { intent: 'small_talk', smallTalkType: 'thanks', confidence: 0.9, raw };
  if (matchPhrase(phrases.goodbye)) return { intent: 'small_talk', smallTalkType: 'goodbye', confidence: 0.9, raw };
  
  if (matchPhrase(phrases.confirm)) return { intent: 'action', confirm: true, confidence: 0.95, raw };
  if (matchPhrase(phrases.cancel)) return { intent: 'action', cancel: true, confidence: 0.95, raw };

  // CART INQUIRIES - Enhanced with more variations
  if (/\b(how many|how much|what.*in|items? in|products? in|count|total).*\b(cart|basket)\b/.test(t)) {
    return { 
      intent: 'cart_inquiry', 
      infoType: 'count',
      confidence: 0.9, 
      raw 
    };
  }

  if (/\b(how much.*total|total.*cost|what.*total|cart total|basket total|order total)\b/.test(t)) {
    return { 
      intent: 'cart_inquiry', 
      infoType: 'total',
      confidence: 0.9, 
      raw 
    };
  }

  if (/\b(whats in|what is in|show me what.*in|list.*in).*\b(cart|basket)\b/.test(t)) {
    return { 
      intent: 'cart_inquiry', 
      infoType: 'contents',
      confidence: 0.85, 
      raw 
    };
  }

  // PRODUCT INFORMATION INQUIRIES - Comprehensive product questions
  if (/\b(how much|what.*price|cost|price of|how much does.*cost)\b/.test(t)) {
    const priceMatch = t.match(/(?:how much|what.*price|cost|price of|how much does.*cost)\s+(?:the\s+)?(.+?)(?:\s+cost)?$/);
    const product = priceMatch ? priceMatch[1] : null;
    const matchedProduct = product ? matchProductName(product, products) : null;
    
    return { 
      intent: 'product_inquiry', 
      product: matchedProduct || product,
      infoType: 'price',
      confidence: matchedProduct ? 0.9 : 0.7, 
      raw 
    };
  }

  // Category inquiries
  if (/\b(what.*category|which category|category of|type of|kind of)\b/.test(t)) {
    const categoryMatch = t.match(/(?:what.*category|which category|category of|type of|kind of)\s+(?:the\s+)?(.+?)(?:\s+belong to)?$/);
    const product = categoryMatch ? categoryMatch[1] : null;
    const matchedProduct = product ? matchProductName(product, products) : null;
    
    return { 
      intent: 'product_inquiry', 
      product: matchedProduct || product,
      infoType: 'category',
      confidence: matchedProduct ? 0.85 : 0.7, 
      raw 
    };
  }

  // Weight inquiries
  if (/\b(how heavy is|what.*weight|weight of|how much is.*weigh)\b/.test(t)) {
    const weightMatch = t.match(/(?:how heavy is|what.*weight|weight of|how much is.*weigh)\s+(?:the\s+)?(.+?)(?:\s+weigh)?$/);
    const product = weightMatch ? weightMatch[1] : null;
    const matchedProduct = product ? matchProductName(product, products) : null;
    
    return { 
      intent: 'product_inquiry', 
      product: matchedProduct || product,
      infoType: 'weight',
      confidence: matchedProduct ? 0.85 : 0.7, 
      raw 
    };
  }

  // Dimensions inquiries
  if (/\b(how big|what.*size|dimensions of|size of|measurements|how large)\b/.test(t)) {
    const sizeMatch = t.match(/(?:how big|what.*size|dimensions of|size of|measurements|how large)\s+(?:the\s+)?(.+?)(?:\s+is)?$/);
    const product = sizeMatch ? sizeMatch[1] : null;
    const matchedProduct = product ? matchProductName(product, products) : null;
    
    return { 
      intent: 'product_inquiry', 
      product: matchedProduct || product,
      infoType: 'dimensions',
      confidence: matchedProduct ? 0.85 : 0.7, 
      raw 
    };
  }

  // Description inquiries
  if (/\b(what.*about|tell me about|describe|what.*features|features of)\b/.test(t)) {
    const descMatch = t.match(/(?:what.*about|tell me about|describe|what.*features|features of)\s+(?:the\s+)?(.+?)(?:\s+have)?$/);
    const product = descMatch ? descMatch[1] : null;
    const matchedProduct = product ? matchProductName(product, products) : null;
    
    return { 
      intent: 'product_inquiry', 
      product: matchedProduct || product,
      infoType: 'description',
      confidence: matchedProduct ? 0.85 : 0.7, 
      raw 
    };
  }

  // Availability inquiries
  if (/\b(is.*available|available.*stock|in stock|out of stock|do you have)\b/.test(t)) {
    const availMatch = t.match(/(?:is|available|stock|have)\s+(?:the\s+)?(.+?)(?:\s+available)?$/);
    const product = availMatch ? availMatch[1] : null;
    const matchedProduct = product ? matchProductName(product, products) : null;
    
    return { 
      intent: 'product_inquiry', 
      product: matchedProduct || product,
      infoType: 'availability',
      confidence: matchedProduct ? 0.85 : 0.7, 
      raw 
    };
  }

  // Shipping inquiries
  if (/\b(shipping|delivery|when.*arrive|how long.*ship|free shipping)\b/.test(t)) {
    const shipMatch = t.match(/(?:shipping|delivery|arrive|ship)\s+(?:for\s+)?(?:the\s+)?(.+?)(?:\s+take)?$/);
    const product = shipMatch ? shipMatch[1] : null;
    const matchedProduct = product ? matchProductName(product, products) : null;
    
    return { 
      intent: 'product_inquiry', 
      product: matchedProduct || product,
      infoType: 'shipping',
      confidence: matchedProduct ? 0.8 : 0.6, 
      raw 
    };
  }

  // Brand inquiries
  if (/\b(what.*brand|who makes|manufacturer of|brand of|made by)\b/.test(t)) {
    const brandMatch = t.match(/(?:what.*brand|who makes|manufacturer of|brand of|made by)\s+(?:the\s+)?(.+?)(?:\s+made)?$/);
    const product = brandMatch ? brandMatch[1] : null;
    const matchedProduct = product ? matchProductName(product, products) : null;
    
    return { 
      intent: 'product_inquiry', 
      product: matchedProduct || product,
      infoType: 'brand',
      confidence: matchedProduct ? 0.85 : 0.7, 
      raw 
    };
  }

  // Enhanced product search intent with better voice patterns
  if (/\b(search|find|look for|show me|i want|i need|get me|looking for)\b/.test(t)) {
    const searchMatch = t.match(/(?:search|find|look for|show me|i want|i need|get me|looking for)\s+(?:the\s+)?(.+?)(?:\s+please)?$/);
    const query = searchMatch ? searchMatch[1] : t;
    const productMatch = matchProductName(query, products);
    
    if (productMatch) {
      return { 
        intent: 'view_product', 
        product: productMatch, 
        query: query,
        confidence: 0.85, 
        raw 
      };
    }
    
    return { 
      intent: 'search', 
      query: query,
      confidence: 0.8, 
      raw 
    };
  }

    // Search orders by reference/number (e.g. "find order 12345", "track order #123")
    if (/\b(order|orders|order number|track order|find order|search order)\b/.test(t)) {
      const numMatch = t.match(/(?:order number|order|#|order\s+)(\d{3,12})/);
      const orderNum = numMatch ? numMatch[1] : null;
      return {
        intent: 'search_orders',
        query: orderNum || t,
        confidence: orderNum ? 0.9 : 0.6,
        raw
      };
    }

  // Enhanced add to cart intent with better voice recognition
  if (/\b(add|put|buy|get|i want|order|purchase|grab)\b/.test(t) && (/\b(cart|basket)\b/.test(t) || /to (my )?cart/.test(t))) {
    const addMatch = t.match(/(?:add|put|buy|get|i want|order|purchase|grab)\s+(?:a |an |the )?(.+?)(?:\s+to\s+(?:my\s+)?cart)?$/);
    let product = addMatch ? addMatch[1] : null;
    
    // Enhanced product name cleaning for voice input
    if (product) {
      product = product.replace(/(please|thanks|thank you|to cart|my cart|shopping cart|basket)/gi, '').trim();
    }
    
    const quantity = extractNumber(t) || 1;
    const matchedProduct = product ? matchProductName(product, products) : null;
    
    return { 
      intent: 'add_to_cart', 
      product: matchedProduct || product,
      quantity: quantity,
      confidence: matchedProduct ? 0.85 : 0.7, 
      raw 
    };
  }

  // Enhanced remove from cart intent
  if (/\b(remove|delete|take out|drop|clear|get rid of)\b/.test(t) && /\b(cart|basket)\b/.test(t)) {
    const removeMatch = t.match(/(?:remove|delete|take out|drop|clear|get rid of)\s+(?:the\s+)?(.+?)(?:\s+from\s+(?:my\s+)?cart)?$/);
    const product = removeMatch ? removeMatch[1] : null;
    const matchedProduct = product ? matchProductName(product, products) : null;
    
    return { 
      intent: 'remove_from_cart', 
      product: matchedProduct || product,
      confidence: matchedProduct ? 0.85 : 0.7, 
      raw 
    };
  }

  // Enhanced product details intent
  if (/\b(details|information|info|about|tell me|show me|what is|describe)\b/.test(t)) {
    const detailsMatch = t.match(/(?:details|information|info|about|tell me|show me|what is|describe)\s+(?:the\s+)?(.+?)(?:\s+please)?$/);
    const product = detailsMatch ? detailsMatch[1] : t;
    const matchedProduct = matchProductName(product, products);
    
    return { 
      intent: 'view_product', 
      product: matchedProduct || product,
      confidence: matchedProduct ? 0.9 : 0.7, 
      raw 
    };
  }

  // Enhanced filter products intent
  if (/\b(filter|sort|show only|display only|by|under|below|above|less than|more than)\b/.test(t)) {
    const filterTypeMatch = t.match(/(?:by|filter by|sort by)\s+(price|category|brand|color|size|rating|type)/);
    const filterType = filterTypeMatch ? filterTypeMatch[1] : null;
    
    const valueMatch = t.match(/(?:under|below|less than|above|more than|over)\s+(\d+)/);
    const filterValue = valueMatch ? valueMatch[1] : null;
    
    return { 
      intent: 'filter_products', 
      filterType,
      filterValue,
      confidence: 0.7, 
      raw 
    };
  }

  // Direct product mention (user just says a product name) - improved for voice
  const directProduct = matchProductName(t, products);
  if (directProduct) {
    return { 
      intent: 'view_product', 
      product: directProduct, 
      confidence: 0.8, 
      raw 
    };
  }

  // Enhanced quantity modification for voice
  if (/\b(more|less|another|extra|increase|decrease|reduce|add more|remove some)\b/.test(t)) {
    const quantity = extractNumber(t) || 1;
    const productMatch = matchProductName(t, products);
    
    if (/\b(more|another|extra|increase|add more)\b/.test(t)) {
      return { 
        intent: 'increase_quantity', 
        product: productMatch,
        quantity,
        confidence: 0.7, 
        raw 
      };
    } else if (/\b(less|decrease|reduce|remove some)\b/.test(t)) {
      return { 
        intent: 'decrease_quantity', 
        product: productMatch,
        quantity,
        confidence: 0.7, 
        raw 
      };
    }
  }

  // Fallback for common shopping terms with voice-friendly patterns
  if (/\b(shop|store|buy|purchase|product|item|browse|shopping)\b/.test(t)) {
    return { 
      intent: 'browse', 
      confidence: 0.5, 
      raw 
    };
  }

  // Unknown but with better context analysis
  const words = t.split(/\s+/).length;
  if (words <= 3) {
    // Short phrases might be product names or navigation
    const possibleProduct = matchProductName(t, products);
    if (possibleProduct) {
      return {
        intent: 'view_product',
        product: possibleProduct,
        confidence: 0.6,
        raw
      };
    }
  }

  return res;
}

export function detectIntent(text: string, products: string[] = []): IntentResult {
  return parseIntent(text, products);
}

export default detectIntent;