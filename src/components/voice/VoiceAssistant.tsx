"use client";
import React, { useEffect, useRef, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { parseIntent, IntentResult } from '@/lib/voiceIntentClean';
import speak from '@/lib/tts';
import { addToCart, getCart, updateQuantity, clearCart } from '@/lib/cart';
import { searchProducts, fetchProductById, logout as apiLogout } from '@/lib/appClient';

/**
 * Enhanced VoiceAssistant component with professional voice recognition
 * - Improved Web Speech API handling
 * - Enhanced voice feedback
 * - Better error handling and user experience
 * - Comprehensive product and cart inquiries
 */
export default function VoiceAssistant({ enableTts = true, products = [] }: { enableTts?: boolean; products?: any[] }) {
  const router = useRouter();
  const pathname = usePathname();
  const [listening, setListening] = useState(false);
  const [lang, setLang] = useState('en-US');
  const [transcript, setTranscript] = useState('');
  const [currentProduct, setCurrentProduct] = useState<any | null>(null);
  const [currentMatches, setCurrentMatches] = useState<any[]>([]);
  const [isSupported, setIsSupported] = useState(false);
  const recognitionRef = useRef<any>(null);

  // Check browser support
  useEffect(() => {
    const supported = typeof window !== 'undefined' && 
      (!!(window as any).SpeechRecognition || !!(window as any).webkitSpeechRecognition);
    setIsSupported(supported);
    
    if (!supported && enableTts) {
      speak("Voice recognition is not supported in your browser. Please try Chrome, Edge, or Safari.");
    }
  }, [enableTts]);

  // Sync current product with product details page
  useEffect(() => {
    if (!pathname) return;
    const m = pathname.match(/\/shop\/products\/(\d+)/);
    if (m && m[1]) {
      const id = Number(m[1]);
      (async () => {
        try {
          const p = await fetchProductById(id);
          setCurrentProduct(p);
        } catch (e) {
          console.debug('[VoiceAssistant] Failed to fetch product for pathname', pathname, e);
        }
      })();
    }
  }, [pathname]);

  // Enhanced product matching algorithm
  function selectBestMatch(query: string, productsList: any[]) {
    if (!productsList || productsList.length === 0) return null;
    
    const q = (query || '').trim().toLowerCase();
    if (!q) return productsList[0];

    // Scoring system for better matching
    const scoredProducts = productsList.map((p: any) => {
      const title = (p.title || p.name || '').toLowerCase();
      let score = 0;

      // Exact match (highest score)
      if (title === q) score += 100;
      
      // Contains all query words
      const queryWords = q.split(/\s+/).filter(Boolean);
      const titleWords = title.split(/\s+/).filter(Boolean);
      const commonWords = queryWords.filter(word => titleWords.includes(word));
      
      if (commonWords.length === queryWords.length) score += 50;
      
      // Partial matches
      if (title.includes(q)) score += 30;
      if (q.includes(title)) score += 20;
      
      // Word overlap
      const overlapScore = (commonWords.length / Math.max(queryWords.length, 1)) * 20;
      score += overlapScore;

      return { product: p, score };
    });

    // Return product with highest score
    scoredProducts.sort((a, b) => b.score - a.score);
    return scoredProducts[0]?.score > 10 ? scoredProducts[0].product : productsList[0];
  }

  // Enhanced DOM interaction functions
  function clickAddToCartButton(): boolean {
    try {
      if (typeof document === 'undefined') return false;
      
      // Multiple strategies for finding add to cart button
      const selectors = [
        '[data-add-to-cart]',
        'button[aria-label*="add to cart" i]',
        'button:contains("Add to Cart")',
        'button:contains("Buy Now")',
        '.add-to-cart',
        '.buy-now',
        'button[data-action="add-to-cart"]'
      ];

      for (const selector of selectors) {
        try {
          if (selector.includes(':contains')) {
            // Text content search
            const buttons = Array.from(document.querySelectorAll('button'));
            const match = buttons.find(btn => 
              (btn.textContent || '').toLowerCase().includes('add to cart') ||
              (btn.textContent || '').toLowerCase().includes('buy now')
            );
            if (match) {
              match.click();
              return true;
            }
          } else {
            const element = document.querySelector(selector) as HTMLElement;
            if (element) {
              element.click();
              return true;
            }
          }
        } catch (e) {
          console.debug(`[VoiceAssistant] Selector ${selector} failed`, e);
        }
      }
    } catch (e) {
      console.debug('[VoiceAssistant] clickAddToCartButton failed', e);
    }
    return false;
  }

  function clickNavTarget(nameOrRoute: string): boolean {
    try {
      if (typeof document === 'undefined') return false;
      
      const key = (nameOrRoute || '').toLowerCase();
      const elements = Array.from(document.querySelectorAll('a, button, [data-nav]')) as HTMLElement[];
      
      for (const element of elements) {
        try {
          const href = (element as HTMLAnchorElement).href || '';
          const text = (element.textContent || '').toLowerCase();
          const ariaLabel = (element.getAttribute('aria-label') || '').toLowerCase();
          const dataNav = (element.getAttribute('data-nav') || '').toLowerCase();
          
          if (dataNav.includes(key) || 
              href.toLowerCase().includes(key) || 
              text.includes(key) || 
              ariaLabel.includes(key)) {
            element.click();
            return true;
          }
        } catch (e) {
          continue;
        }
      }
    } catch (e) {
      console.debug('[VoiceAssistant] clickNavTarget failed', e);
    }
    return false;
  }

  async function clickRemoveFromCart(productPhrase?: string | null, productId?: string | number): Promise<boolean> {
      try {
        if (typeof document === 'undefined') return false;
        
        // Navigate to cart if not already there
        if (!window.location.pathname.includes('/shop/carts')) {
          router.push('/shop/carts');
          await new Promise(res => setTimeout(res, 500));
        }
  
        // Multiple strategies for remove buttons
        if (productId) {
          const selectors = [
            `[data-remove-for="${productId}"]`,
            `[data-product-id="${productId}"] .remove-btn`,
            `#remove-${productId}`
          ];
          
          for (const selector of selectors) {
            const element = document.querySelector(selector) as HTMLElement;
            if (element) {
              element.click();
              return true;
            }
          }
        }
  
        // Text-based search
        if (productPhrase) {
          const phrase = productPhrase.toLowerCase();
          const elements = Array.from(document.querySelectorAll('[class*="item"], [class*="product"], [data-product]'));
          
          for (const element of elements) {
            const text = (element.textContent || '').toLowerCase();
            if (text.includes(phrase)) {
              const removeBtn = element.querySelector('button, [class*="remove"], [class*="delete"]') as HTMLElement;
              if (removeBtn) {
                removeBtn.click();
                return true;
              }
            }
          }
        }
  
        // Generic remove button
        const removeButtons = Array.from(document.querySelectorAll('button')).filter(btn => 
          (btn.textContent || '').toLowerCase().includes('remove') ||
          (btn.getAttribute('aria-label') || '').toLowerCase().includes('remove')
        );
        
        if (removeButtons.length > 0) {
          removeButtons[0].click();
          return true;
        }
      } catch (e) {
        console.debug('[VoiceAssistant] clickRemoveFromCart failed', e);
      }
      return false;
    }

  // Enhanced speech recognition setup
  useEffect(() => {
    if (!isSupported) return;

    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    const r = new SpeechRecognition();
    
    // Enhanced configuration for better voice recognition
    r.continuous = false;
    r.interimResults = true;
    r.maxAlternatives = 3;
    r.lang = lang;
    
    let finalTranscript = '';

    r.onstart = () => {
      setListening(true);
      setTranscript('');
      finalTranscript = '';
      if (enableTts) speak("I'm listening...");
    };

    r.onend = () => {
      setListening(false);
      // Process final transcript if any
      if (finalTranscript.trim()) {
        handleTranscript(finalTranscript.trim());
      }
    };

    r.onerror = (e: any) => {
      console.debug('[VoiceAssistant] Recognition error', e);
      setListening(false);
      
      if (enableTts) {
        switch (e.error) {
          case 'not-allowed':
          case 'permission-denied':
            speak('Microphone access is blocked. Please enable microphone permission in your browser settings.');
            break;
          case 'network':
            speak('Network error occurred. Please check your connection.');
            break;
          case 'audio-capture':
            speak('No microphone detected. Please check your microphone connection.');
            break;
          default:
            speak('Voice recognition error. Please try again.');
        }
      }
    };

    r.onresult = (ev: any) => {
      let interimTranscript = '';
      
      for (let i = ev.resultIndex; i < ev.results.length; ++i) {
        const transcript = ev.results[i][0].transcript;
        
        if (ev.results[i].isFinal) {
          finalTranscript += transcript;
        } else {
          interimTranscript += transcript;
        }
      }
      
      setTranscript(interimTranscript || finalTranscript);
    };

    recognitionRef.current = r;

    return () => {
      try { 
        r.stop();
        recognitionRef.current = null;
      } catch (e) {}
    };
  }, [lang, isSupported, enableTts]);

  // Enhanced transcript handling
  async function handleTranscript(text: string) {
    if (!text.trim()) {
      if (enableTts) speak("I didn't catch that. Please try again.");
      return;
    }

    console.debug('[VoiceAssistant] Processing transcript:', text);

    // Enhanced quick commands with better voice recognition
    const quickCommands = [
      {
        pattern: /^\s*(?:show|open|view|see)\s+(.+)/i,
        handler: async (match: RegExpMatchArray) => {
          const query = match[1].trim();
          try {
            const res = await searchProducts(query, 10);
            if (res?.products?.length) {
              const product = selectBestMatch(query, res.products);
              setCurrentProduct(product);
              setCurrentMatches(res.products.slice(0, 5));
              
              if (enableTts) {
                if (res.products.length === 1) {
                  speak(`Opening ${product.title}`);
                } else {
                  speak(`Found ${res.products.length} products. Opening ${product.title}`);
                }
              }
              
              router.push(`/products/${product.id}`);
            } else {
              if (enableTts) speak(`I couldn't find any products matching "${query}". Please try another name.`);
            }
          } catch (err) {
            console.debug('[VoiceAssistant] Quick command search failed', err);
            if (enableTts) speak("I'm having trouble searching right now. Please try again later.");
          }
          return true;
        }
      },
      {
        pattern: /\b(go to|open|show|take me to)\s+(login|sign in)\b/i,
        handler: () => {
          if (enableTts) speak('Opening login page');
          if (!clickNavTarget('login')) router.push('/login');
          return true;
        }
      },
      {
        pattern: /\b(go to|open|show|take me to)\s+(sign up|register|signup)\b/i,
        handler: () => {
          if (enableTts) speak('Opening registration page');
          if (!clickNavTarget('signup')) router.push('/signup');
          return true;
        }
      },
      {
        pattern: /\b(go to|open|show|take me to)\s+(payments?|checkout)\b/i,
        handler: () => {
          if (enableTts) speak('Opening payment page');
          if (!clickNavTarget('payments')) router.push('/shop/payments');
          return true;
        }
      }
    ];

    // Check quick commands first
    for (const command of quickCommands) {
      const match = text.match(command.pattern);
      if (match) {
        await command.handler(match);
        return;
      }
    }

    // Process through intent parser
    const productNames = products?.map((p: any) => p?.title || p?.name || String(p?.id) || '') || [];
    const intent: IntentResult = parseIntent(text, productNames);
    
    console.debug('[VoiceAssistant] Parsed intent:', intent);

    await handleIntent(intent, text);
  }

  // Enhanced intent handling
  async function handleIntent(intent: IntentResult, originalText: string) {
    if (!intent || intent.intent === 'unknown') {
      // Enhanced fallback: try search and provide helpful feedback
      try {
        const res = await searchProducts(originalText, 6);
        if (res?.products?.length) {
          setCurrentMatches(res.products);
          const bestMatch = selectBestMatch(originalText, res.products);
          setCurrentProduct(bestMatch);
          
          if (enableTts) {
            const matchCount = res.products.length;
            const productNames = res.products.slice(0, 3).map((p: any) => p.title).join(', ');
            
            if (matchCount === 1) {
              speak(`I found ${bestMatch.title}. Say "show details" or "add to cart" to proceed.`);
            } else {
              speak(`I found ${matchCount} products including ${productNames}. Say "show" followed by the product name for details.`);
            }
          }
        } else {
          if (enableTts) speak("I couldn't find any products matching your request. Please try different words or browse our categories.");
        }
      } catch (e) {
        console.debug('[VoiceAssistant] Fallback search failed', e);
        if (enableTts) speak("I'm having trouble understanding. Try saying things like 'show me phones', 'add to cart', or 'go to checkout'.");
      }
      return;
    }

    // Enhanced intent routing with better voice feedback
    switch (intent.intent) {
      case 'navigation':
        await handleNavigationIntent(intent);
        break;
      case 'view_product':
        await handleViewProductIntent(intent);
        break;
      case 'add_to_cart':
        await handleAddToCartIntent(intent);
        break;
      case 'remove_from_cart':
        await handleRemoveFromCartIntent(intent);
        break;
      case 'search':
        await handleSearchIntent(intent);
        break;
      case 'auth':
        await handleAuthIntent(intent);
        break;
        case 'search_orders':
          await handleSearchOrdersIntent(intent);
          break;
      case 'support':
        if (enableTts) speak('Opening help and support');
        if (!clickNavTarget('help')) router.push('/help');
        break;
      case 'small_talk':
        await handleSmallTalkIntent(intent);
        break;
      case 'action':
        await handleActionIntent(intent);
        break;
      case 'filter_products':
        await handleFilterIntent(intent);
        break;
      case 'product_inquiry':
        await handleProductInquiry(intent);
        break;
      case 'cart_inquiry':
        await handleCartInquiry(intent);
        break;
      case 'browse':
        if (enableTts) speak('Opening product browser');
        router.push('/shop/products');
        break;
      default:
        if (enableTts) speak("I understand what you're saying, but I can't perform that action yet.");
        break;
    }
  }

  // Enhanced intent handlers
  async function handleNavigationIntent(intent: IntentResult) {
    const target = intent.navTarget;
    const messages: Record<string, string> = {
      home: 'Going to homepage',
      products: 'Opening products',
      cart: 'Opening your cart',
      checkout: 'Proceeding to checkout',
      payments: 'Opening payments',
      orders: 'Showing your orders'
    };

    if (target && messages[target]) {
      if (enableTts) speak(messages[target]);
      const navSuccess = clickNavTarget(target);
      if (!navSuccess) {
        const routes: Record<string, string> = {
          home: '/',
          products: '/shop/products',
          cart: '/shop/carts',
          checkout: '/shop/checkouts',
          payments: '/shop/payments',
          orders: '/shop/orders'
        };
        if (routes[target]) router.push(routes[target]);
      }
    }
  }

  async function handleViewProductIntent(intent: IntentResult) {
    if (intent.product) {
      try {
        const res = await searchProducts(intent.product, 5);
        if (res?.products?.length) {
          const product = selectBestMatch(intent.product, res.products);
          setCurrentProduct(product);
          
          if (enableTts) {
            speak(`Found ${product.title}. Opening product details.`);
          }
          
          router.push(`/products/${product.id}`);
        } else {
          if (enableTts) speak(`Sorry, I couldn't find "${intent.product}" in our store. Please try another product name.`);
        }
      } catch (err) {
        console.debug('[VoiceAssistant] Product search failed', err);
        if (enableTts) speak("I'm having trouble accessing product information right now. Please try again later.");
      }
    }
  }

  async function handleAddToCartIntent(intent: IntentResult) {
    let productToAdd = currentProduct;
    
    // Resolve product from intent if provided
    if (intent.product && !productToAdd) {
      try {
        const res = await searchProducts(intent.product, 3);
        if (res?.products?.length) {
          productToAdd = selectBestMatch(intent.product, res.products);
        }
      } catch (e) {
        console.debug('[VoiceAssistant] Product search for add failed', e);
      }
    }

    // Fallback to current page product
    if (!productToAdd) {
      const pathMatch = window.location.pathname.match(/\/shop\/product\/(\d+)/);
      if (pathMatch && pathMatch[1]) {
        try {
          productToAdd = await fetchProductById(Number(pathMatch[1]));
        } catch (e) {
          console.debug('[VoiceAssistant] Fetch current product failed', e);
        }
      }
    }

    if (productToAdd) {
      try {
        const clicked = clickAddToCartButton();
        if (clicked) {
          if (enableTts) speak(`Added ${productToAdd.title} to your cart`);
        } else {
          const item = {
            id: String(productToAdd.id),
            name: productToAdd.title || productToAdd.name,
            price: productToAdd.price || 0,
            quantity: intent.quantity || 1,
            image: productToAdd.thumbnail || productToAdd.image
          };
          addToCart(item);
          if (enableTts) speak(`Added ${item.quantity} ${item.name} to your cart`);
        }
      } catch (e) {
        console.debug('[VoiceAssistant] Add to cart failed', e);
        if (enableTts) speak('Failed to add item to cart. Please try again.');
      }
    } else {
      if (enableTts) speak("I'm not sure which product to add. Please specify the product name or view a product first.");
    }
  }

  async function handleRemoveFromCartIntent(intent: IntentResult) {
    const removed = await clickRemoveFromCart(intent.product, intent.product ? undefined : currentProduct?.id);
    
    if (removed) {
      if (enableTts) speak(`Removed ${intent.product || 'item'} from your cart`);
    } else {
      if (enableTts) speak("I couldn't remove that item automatically. I've opened your cart for manual removal.");
      router.push('/shop/carts');
    }
  }

  async function handleSearchIntent(intent: IntentResult) {
    if (intent.query) {
      if (enableTts) speak(`Searching for ${intent.query}`);
      router.push(`/shop/products?search=${encodeURIComponent(intent.query)}`);
    }
  }

  async function handleAuthIntent(intent: IntentResult) {
    const target = intent.navTarget;
    const routes: Record<string, string> = {
      login: '/login',
      signup: '/signup',
      profile: '/shop/profile'
    };

    if (target === 'logout') {
      // perform logout: try clicking a logout element first, else clear client session
      if (enableTts) speak('Logging you out');
      const clicked = clickNavTarget('logout') || clickNavTarget('log out') || clickNavTarget('sign out');
      try {
        apiLogout();
      } catch (e) {
        console.debug('[VoiceAssistant] apiLogout failed', e);
      }
      if (!clicked) router.push('/');
      return;
    }

    if (target && routes[target]) {
      if (enableTts) speak(`Opening ${target}`);
      if (!clickNavTarget(target)) router.push(routes[target]);
    }
  }

  async function handleSearchOrdersIntent(intent: IntentResult) {
    const q = intent.query;
    if (!q) {
      if (enableTts) speak('Please provide an order number or order reference to search.');
      return;
    }

    if (enableTts) speak(`Searching orders for ${q}`);
    // Try to navigate to orders page and pass query param
    const encoded = encodeURIComponent(String(q));
    if (!clickNavTarget('orders')) {
      router.push(`/shop/orders?search=${encoded}`);
    } else {
      // if clicked, also update URL to reflect search param
      router.push(`/shop/orders?search=${encoded}`);
    }
  }

  async function handleSmallTalkIntent(intent: IntentResult) {
    const responses: Record<string, string> = {
      greeting: 'Hello! How can I help you with your shopping today?',
      thanks: "You're welcome! Is there anything else I can help you with?",
      goodbye: 'Goodbye! Thank you for shopping with us.'
    };

    if (intent.smallTalkType && responses[intent.smallTalkType]) {
      if (enableTts) speak(responses[intent.smallTalkType]);
    }
  }

  async function handleActionIntent(intent: IntentResult) {
    if (intent.confirm) {
      if (enableTts) speak('Action confirmed');
    } else if (intent.cancel) {
      if (enableTts) speak('Action cancelled');
    }
  }

  async function handleFilterIntent(intent: IntentResult) {
    if (enableTts) speak('Applying your filters');

    // Prefer explicit category filtering when user mentions a category
    // Cases handled:
    // - intent.filterType === 'category' and intent.filterValue present
    // - intent.filterType === 'category' and intent.product or intent.query present
    // - intent.filterType missing but intent.query or intent.product present -> treat as category
    try {
      const cat = (intent.filterType === 'category' && intent.filterValue)
        ? intent.filterValue
        : (intent.filterType === 'category' && (intent.product || intent.query))
          ? (intent.product || intent.query)
          : null;

      if (cat) {
        const category = String(cat).trim();
        // navigate to products page with category param
        router.push(`/shop/products?category=${encodeURIComponent(category)}`);
        return;
      }

      // fallback: use generic filter/value params
      const params = new URLSearchParams();
      if (intent.filterType) params.append('filter', String(intent.filterType));
      if (intent.filterValue) params.append('value', String(intent.filterValue));
      // if nothing specific, but we have a query, treat as search
      if (!params.toString() && intent.query) {
        router.push(`/shop/products?search=${encodeURIComponent(String(intent.query))}`);
        return;
      }

      router.push(`/shop/products?${params.toString()}`);
    } catch (e) {
      console.debug('[VoiceAssistant] handleFilterIntent failed', e);
      router.push('/shop/products');
    }
  }

  // NEW: Handle product information inquiries
  async function handleProductInquiry(intent: IntentResult) {
    let product = currentProduct;
    
    // Resolve product from intent if provided
    if (intent.product && !product) {
      try {
        const res = await searchProducts(intent.product, 3);
        if (res?.products?.length) {
          product = selectBestMatch(intent.product, res.products);
        }
      } catch (e) {
        console.debug('[VoiceAssistant] Product search for inquiry failed', e);
      }
    }

    if (!product) {
      if (enableTts) speak("I'm not sure which product you're asking about. Please specify the product name.");
      return;
    }

    const infoType = intent.infoType;
    const responses: Record<string, string> = {
      price: `The price for ${product.title} is $${product.price}`,
      category: `${product.title} is in the ${product.category || 'general'} category`,
      weight: `${product.title} weighs ${product.weight || 'unknown'}`,
      dimensions: `${product.title} dimensions are ${product.dimensions || 'not specified'}`,
      description: `${product.title}: ${product.description || 'No description available'}`,
      availability: `${product.title} is ${product.inStock ? 'in stock' : 'currently out of stock'}`,
      shipping: `${product.title} ${product.freeShipping ? 'qualifies for free shipping' : 'has standard shipping costs'}`,
      brand: `${product.title} is made by ${product.brand || 'unknown manufacturer'}`
    };

    if (infoType && responses[infoType]) {
      if (enableTts) speak(responses[infoType]);
    } else {
      if (enableTts) speak(`I don't have that information for ${product.title} available.`);
    }
  }

  // NEW: Handle cart inquiries - UPDATED to use your cart functions
  async function handleCartInquiry(intent: IntentResult) {
    const infoType = intent.infoType;
    
    try {
      const cartItems = getCart();
      const itemCount = cartItems.reduce((total, item) => total + (item.quantity || 0), 0);
      const total = cartItems.reduce((sum, item) => sum + (item.price * (item.quantity || 0)), 0);

      const responses: Record<string, string> = {
        count: `You have ${itemCount} ${itemCount === 1 ? 'item' : 'items'} in your cart`,
        total: `Your cart total is $${total.toFixed(2)}`,
        contents: itemCount > 0 
          ? `Your cart contains: ${cartItems.slice(0, 3).map(item => `${item.quantity} ${item.name}`).join(', ')}${itemCount > 3 ? ` and ${itemCount - 3} more items` : ''}`
          : 'Your cart is empty'
      };

      if (infoType && responses[infoType]) {
        if (enableTts) speak(responses[infoType]);
      } else {
        if (enableTts) speak(`You have ${itemCount} items in your cart with a total of $${total.toFixed(2)}`);
      }
    } catch (e) {
      console.debug('[VoiceAssistant] Cart inquiry failed', e);
      if (enableTts) speak("I'm having trouble accessing your cart information right now.");
    }
  }

  // Enhanced voice recognition control
  function startListening() {
    if (!isSupported) {
      if (enableTts) speak('Voice recognition is not available in your browser.');
      return;
    }

    try {
      const r = recognitionRef.current;
      if (r) {
        r.lang = lang;
        r.start();
      }
    } catch (e) {
      console.debug('[VoiceAssistant] Start listening error', e);
      if (enableTts) speak('Failed to start voice recognition. Please check your microphone permissions.');
    }
  }

  function stopListening() {
    try {
      recognitionRef.current?.stop();
    } catch (e) {
      console.debug('[VoiceAssistant] Stop listening error', e);
    }
  }

  if (!isSupported) {
    return (
      <div className="fixed right-4 bottom-4 z-50">
        <div className="bg-yellow-100 border border-yellow-400 rounded-lg p-3 text-sm">
          Voice commands not supported in this browser
        </div>
      </div>
    );
  }

  return (
    <div aria-live="polite" className="fixed right-4 bottom-4 z-50">
      <div className="flex flex-col items-end gap-3 bg-white rounded-2xl shadow-2xl p-4 border border-gray-200">
        {/* Language Selector */}
        <select 
          value={lang} 
          onChange={(e) => setLang(e.target.value)}
          className="text-sm px-3 py-2 rounded-lg border border-gray-300 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          aria-label="Select voice recognition language"
        >
          <option value="en-US">English (US)</option>
          <option value="en-GB">English (UK)</option>
          <option value="fr-FR">Français</option>
          <option value="es-ES">Español</option>
          <option value="de-DE">Deutsch</option>
          <option value="rw-RW">Kinyarwanda</option>
        </select>

        {/* Voice Button */}
        <button
          onClick={listening ? stopListening : startListening}
          aria-pressed={listening}
          title={listening ? 'Stop listening' : 'Start voice commands'}
          className={`
            relative p-5 rounded-full shadow-lg text-white font-semibold
            transition-all duration-300 ease-in-out transform hover:scale-105
            focus:outline-none focus:ring-4 focus:ring-opacity-50
            ${listening 
              ? 'bg-red-600 animate-pulse focus:ring-red-300' 
              : 'bg-gradient-to-br from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 focus:ring-blue-300'
            }
          `}
        >
          {listening ? (
            <>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-white rounded-full animate-pulse" />
                Listening...
              </div>
            </>
          ) : (
            'Start Voice'
          )}
        </button>

        {/* Transcript Display */}
        {transcript && (
          <div className="mt-2 bg-blue-50 border border-blue-200 rounded-xl p-3 text-sm max-w-xs break-words animate-fade-in">
            <div className="font-semibold text-blue-800 mb-1">You said:</div>
            <div className="text-blue-900">"{transcript}"</div>
          </div>
        )}

        {/* Status Indicator */}
        <div className="text-xs text-gray-500 text-center mt-1">
          {listening ? 'Speak now...' : 'Click to speak'}
        </div>
      </div>
    </div>
  );
}