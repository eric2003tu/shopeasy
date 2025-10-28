"use client";
import React, { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { parseIntent, IntentResult } from '@/lib/voiceIntentClean';
import speak from '@/lib/tts';
import { addToCart } from '@/lib/cart';

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
  const recognitionRef = useRef<any>(null);
  const supported = typeof window !== 'undefined' && (!!(window as any).SpeechRecognition || !!(window as any).webkitSpeechRecognition);

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
    const intent: IntentResult = parseIntent(text, products?.map((p: any) => p?.title || p?.name || String(p?.id) || ''));
    if (!intent || intent.intent === 'unknown') {
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
          if (enableTts) speak(`Showing details for ${intent.product}`);
          router.push(`/shop/products?search=${encodeURIComponent(intent.product)}`);
        } else {
          if (enableTts) speak("I couldn't find that product. Try saying the full product name.");
        }
        break;
      case 'add_to_cart':
        if (intent.product) {
          const item = { id: intent.product, name: intent.product, price: 0, quantity: intent.quantity || 1 } as any;
          try {
            addToCart(item);
            if (enableTts) speak(`Added ${intent.product} to your cart`);
          } catch (e) {
            if (enableTts) speak('Failed to add item to cart.');
          }
        } else {
          if (enableTts) speak("I couldn't detect the product to add. Try: 'Add iPhone 15 to my cart'.");
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
