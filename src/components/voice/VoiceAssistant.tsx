"use client";
import React, { useEffect, useRef, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { parseIntent, IntentResult } from '@/lib/voiceIntentClean';
import speak from '@/lib/tts';
import { addToCart } from '@/lib/cart';
import { searchProducts, fetchProductById } from '@/lib/appClient';

/**
 * Single global VoiceAssistant component.
 * - Uses Web Speech API for speech-to-text
 * - Uses simple parseIntent() to map free-speech -> intent
 * - Uses speak() for TTS feedback
 * - Triggers navigation and cart updates
 */
export default function VoiceAssistant({ enableTts = true, products = [] }: { enableTts?: boolean; products?: any[] }) {
  const router = useRouter();
  const [listening, setListening] = useState(false);
  const [lang, setLang] = useState('en-US');
  const [transcript, setTranscript] = useState('');
  const [currentProduct, setCurrentProduct] = useState<any | null>(null);
  const [currentMatches, setCurrentMatches] = useState<any[]>([]);
  const recognitionRef = useRef<any>(null);
  const pathname = usePathname();

  // Keep `currentProduct` in sync with the product details page if user navigates there manually
  useEffect(() => {
    if (!pathname) return;
    const m = pathname.match(/\/shop\/product\/(\d+)/);
    if (m && m[1]) {
      const id = Number(m[1]);
      // fetch product details and set as currentProduct
      (async () => {
        try {
          const p = await fetchProductById(id);
          setCurrentProduct(p);
        } catch (e) {
          console.debug('[VoiceAssistant] failed to fetch product for pathname', pathname, e);
        }
      })();
    }
  }, [pathname]);

  // Helper: pick the best product match from a search result
  function selectBestMatch(query: string, productsList: any[]) {
    if (!productsList || productsList.length === 0) return null;
    const q = (query || '').trim().toLowerCase();
    if (!q) return productsList[0];
    // 1) exact title match
    const exact = productsList.find((p: any) => (p.title || '').toLowerCase() === q);
    if (exact) return exact;
    // 2) whole-word contains (title contains all tokens)
    const tokens = q.split(/\s+/).filter(Boolean);
    const whole = productsList.find((p: any) => {
      const t = (p.title || '').toLowerCase();
      return tokens.every((tok: string) => new RegExp(`\\b${tok.replace(/[-\\/\\^$*+?.()|[\]{}]/g, '\\$&')}\\b`).test(t));
    });
    if (whole) return whole;
    // 3) contains query as substring
    const substr = productsList.find((p: any) => (p.title || '').toLowerCase().includes(q));
    if (substr) return substr;
    // 4) fallback to first
    return productsList[0];
  }
  const supported = typeof window !== 'undefined' && (!!(window as any).SpeechRecognition || !!(window as any).webkitSpeechRecognition);

  // Try to find and click the page's 'Add to cart' button to emulate a real user click.
  function clickAddToCartButton(): boolean {
    try {
      if (typeof document === 'undefined') return false;
      const buttons = Array.from(document.querySelectorAll('button')) as HTMLButtonElement[];
      const candidate = buttons.find(b => (b.innerText || b.textContent || '').toLowerCase().includes('add to cart') || (b.innerText || b.textContent || '').toLowerCase().includes('buy now'));
      if (candidate) {
        candidate.click();
        return true;
      }
      // try data attribute or aria-label
      const labeled = buttons.find(b => (b.getAttribute('aria-label') || '').toLowerCase().includes('add to cart') || (b.dataset?.action || '').toLowerCase().includes('add'));
      if (labeled) {
        labeled.click();
        return true;
      }
    } catch (e) {
      console.debug('[VoiceAssistant] clickAddToCartButton failed', e);
    }
    return false;
  }

  useEffect(() => {
    if (!supported) return;
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    const r = new SpeechRecognition();
    r.lang = lang;
    r.interimResults = false;
    r.maxAlternatives = 1;

    r.onstart = () => setListening(true);
    r.onend = () => setListening(false);
    r.onerror = (e: any) => {
      console.debug('[VoiceAssistant] recognition error', e);
      setListening(false);
      if (e?.error === 'not-allowed' || e?.error === 'permission-denied') {
        if (enableTts) speak('Microphone access blocked. Please enable microphone permission.');
      }
    };

    r.onresult = (ev: any) => {
      const last = ev.results[ev.results.length - 1];
      const text = last[0].transcript.trim();
      setTranscript(text);
      handleTranscript(text);
    };

    recognitionRef.current = r;
    return () => {
      try { r.onstart = r.onend = r.onerror = r.onresult = null; } catch {};
      recognitionRef.current = null;
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [lang]);

  async function handleTranscript(text: string) {
    // Quick 'show <name>' command detection (user explicitly requests details)
    const showCmd = text.match(/^\s*(?:show|open|view)\s+(.+)/i);
    if (showCmd && showCmd[1]) {
      const q = showCmd[1].trim();
      try {
        const res = await searchProducts(q, 10);
        if (res?.products?.length) {
          const p = selectBestMatch(q, res.products);
          setCurrentProduct(p);
          setCurrentMatches(res.products.slice(0, 5));
          if (enableTts) speak(`Opening details for ${p.title}`);
          router.push(`/shop/product/${p.id}`);
        } else {
          if (enableTts) speak(`I couldn't find any product matching ${q}. Please try another name.`);
        }
      } catch (err) {
        console.debug('[VoiceAssistant] show command search failed', err);
        if (enableTts) speak("I couldn't check the store right now. Try again later.");
      }
      return;
    }

    const intent: IntentResult = parseIntent(text, products?.map((p: any) => p?.title || p?.name || String(p?.id) || ''));
    if (!intent || intent.intent === 'unknown') {
      // Try a backend search as a fallback: if user just said a product name, surface matches
      try {
        const res = await searchProducts(text, 6);
        if (res?.products?.length) {
          setCurrentMatches(res.products);
          const best = selectBestMatch(text, res.products);
          setCurrentProduct(best);
          const names = res.products.slice(0, 3).map((x: any) => x.title).join(', ');
          if (enableTts) speak(`I found ${res.products.length} products. First matches: ${names}. Say 'show <product name>' to see details or 'add it to cart' to add the first one.`);
          return;
        }
      } catch (e) {
        console.debug('[VoiceAssistant] fallback search failed', e);
      }
      if (enableTts) speak("Sorry, I didn't understand that. Try: 'Show me products' or 'Add iPhone to cart'.");
      return;
    }

    switch (intent.intent) {
      case 'show_products':
        if (enableTts) speak(`Showing products${intent.query ? ` for ${intent.query}` : ''}`);
        router.push('/shop/products');
        break;
      case 'product_details':
        if (intent.product) {
          // Search for the named product in the backend
          try {
            const res = await searchProducts(intent.product, 5);
            if (res?.products?.length) {
              const p = res.products[0];
              setCurrentProduct(p);
              if (enableTts) speak(`Found ${p.title}. Opening details.`);
              router.push(`/shop/product/${p.id}`);
            } else {
              setCurrentProduct(null);
              if (enableTts) speak(`Product ${intent.product} is not in the store. Please try another product.`);
            }
          } catch (err) {
            console.debug('[VoiceAssistant] product search failed', err);
            if (enableTts) speak("I couldn't check the store right now. Try again later.");
          }
        } else {
          if (enableTts) speak("I couldn't find that product. Try saying the full product name.");
        }
        break;
      case 'add_to_cart':
        // If intent includes a product phrase, try to resolve it first
        if (intent.product) {
          try {
            const res = await searchProducts(intent.product, 5);
            if (res?.products?.length) {
              const p = selectBestMatch(intent.product || '', res.products);
              // Try to emulate the page's Add button click first (so any UI flows run)
              const clicked = clickAddToCartButton();
              if (clicked) {
                setCurrentProduct(p);
                setCurrentMatches(res.products.slice(0, 5));
                if (enableTts) speak(`Clicked the page's Add to cart button for ${p.title}`);
              } else {
                const item = { id: p.id, name: p.title, price: p.price, quantity: intent.quantity || 1 } as any;
                addToCart(item);
                setCurrentProduct(p);
                setCurrentMatches(res.products.slice(0, 5));
                if (enableTts) speak(`Added ${p.title} to your cart`);
              }
            } else {
              if (enableTts) speak(`Product ${intent.product} is not in the store. Please try another product.`);
            }
          } catch (e) {
            console.debug('[VoiceAssistant] add/search error', e);
            if (enableTts) speak('Failed to add item to cart.');
          }
        } else {
          // If there's no explicit product in the intent, but the user is viewing a product page,
          // prefer that `currentProduct`. If not set yet, try deriving it from the pathname.
          let p = currentProduct;
          if (!p) {
            const m = window.location.pathname.match(/\/shop\/product\/(\d+)/);
            if (m && m[1]) {
              try {
                p = await fetchProductById(Number(m[1]));
                setCurrentProduct(p);
              } catch (e) {
                console.debug('[VoiceAssistant] fetch by pathname failed', e);
              }
            }
          }

          if (p) {
            try {
              // attempt to click the page button first
              const clicked = clickAddToCartButton();
              if (clicked) {
                if (enableTts) speak(`Clicked the page's Add to cart button for ${p.title || p.name}`);
              } else {
                const item = { id: p.id, name: p.title || p.name, price: p.price || 0, quantity: intent.quantity || 1 } as any;
                addToCart(item);
                if (enableTts) speak(`Added ${item.name} to your cart`);
              }
            } catch (e) {
              console.debug('[VoiceAssistant] add current product failed', e);
              if (enableTts) speak('Failed to add item to cart.');
            }
          } else if (currentProduct) {
            // existing fallback: add currentProduct if present
            try {
              const p2 = currentProduct;
              // try to click page button first
              const clicked2 = clickAddToCartButton();
              if (clicked2) {
                if (enableTts) speak(`Clicked the page's Add to cart button for ${p2.title || p2.name}`);
              } else {
                const item = { id: p2.id, name: p2.title || p2.name, price: p2.price || 0, quantity: intent.quantity || 1 } as any;
                addToCart(item);
                if (enableTts) speak(`Added ${item.name} to your cart`);
              }
            } catch (e) {
              console.debug('[VoiceAssistant] add current product failed', e);
              if (enableTts) speak('Failed to add item to cart.');
            }
          } else {
            if (enableTts) speak("I couldn't detect the product to add. First say the product name, then say 'add it to cart'.");
          }
        }
        break;
      case 'view_cart':
        if (enableTts) speak('Opening your cart');
        router.push('/shop/carts');
        break;
      case 'checkout':
        if (enableTts) speak('Proceeding to checkout');
        router.push('/shop/checkouts');
        break;
      case 'remove_from_cart':
        if (enableTts) speak('Removing item from cart — open cart to confirm.');
        router.push('/shop/carts');
        break;
      case 'search':
        if (enableTts) speak(`Searching for ${intent.query}`);
        router.push(`/shop/products?search=${encodeURIComponent(intent.query || '')}`);
        break;
      default:
        if (enableTts) speak("Sorry, I couldn't perform that action.");
        break;
    }
  }

  function startListening() {
    if (!supported) {
      speak('Voice recognition is not supported in this browser.');
      return;
    }
    try {
      const r = recognitionRef.current;
      if (!r) return;
      r.lang = lang;
      r.start();
    } catch (e) {
      console.debug('[VoiceAssistant] start error', e);
      speak('Failed to start voice recognition');
    }
  }

  return (
    <div aria-live="polite">
      <div style={{ position: 'fixed', right: 20, bottom: 20, zIndex: 9999 }}>
        <div className="flex flex-col items-end gap-2">
          <select value={lang} onChange={(e) => setLang(e.target.value)} className="mb-2 p-1 rounded bg-white border">
            <option value="en-US">English</option>
            <option value="fr-FR">Français</option>
            <option value="es-ES">Español</option>
            <option value="rw-RW">Kinyarwanda</option>
          </select>

          <button
            onClick={startListening}
            aria-pressed={listening}
            title={listening ? 'Listening' : 'Start voice' }
            className={`p-4 rounded-full shadow-lg text-white ${listening ? 'bg-red-600 animate-pulse' : 'bg-indigo-600 hover:bg-indigo-700'}`}>
            {listening ? 'Listening…' : 'Speak'}
          </button>
          {transcript && (
            <div className="mt-2 bg-white p-2 rounded shadow text-sm max-w-xs break-words">"{transcript}"</div>
          )}
        </div>
      </div>
    </div>
  );
}
