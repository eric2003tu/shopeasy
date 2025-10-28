"use client";
import React, { useEffect, useState } from 'react';
import VoiceAssistant from '@/components/voice/VoiceAssistant';
import { sampleOrders } from '@/lib/sampleData';
import { useAuth } from '@/context/AuthProvider';

export default function VoiceDemoPage() {
  const { user } = useAuth();
  const [products, setProducts] = useState<Array<any>>([]);

  useEffect(() => {
    // load products from dummyjson to help intent matching
    (async () => {
      try {
        const r = await fetch('https://dummyjson.com/products?limit=100');
        if (!r.ok) return;
        const data = await r.json();
        setProducts(Array.isArray(data.products) ? data.products : []);
      } catch {}
    })();
  }, []);

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-2xl font-semibold mb-4">Voice demo & Orders</h1>

      <section className="mb-6">
        <h2 className="font-medium mb-2">Voice Assistant</h2>
        <p className="text-sm text-muted-foreground mb-3">Click Speak and say commands like "Show products", "Add sportwatch x to cart", or "Checkout". Language can be changed in the component props.</p>
        <VoiceAssistant enableTts products={products} />
      </section>

      <section>
        <h2 className="font-medium mb-2">Your recent orders (sample)</h2>
        <div className="space-y-3">
          {sampleOrders.map((o) => (
            <div key={o.id} className="border rounded p-3">
              <div className="flex justify-between items-center">
                <div>
                  <div className="font-medium">Order {o.id}</div>
                  <div className="text-sm text-muted-foreground">{o.createdAt} · {o.status}</div>
                </div>
                <div className="text-right">
                  <div className="font-semibold">${o.total.toFixed(2)}</div>
                </div>
              </div>
              <details className="mt-2">
                <summary className="cursor-pointer text-sm text-muted-foreground">Items ({o.items.length})</summary>
                <ul className="mt-2 space-y-1">
                  {o.items.map((it, idx) => (
                    <li key={idx} className="flex justify-between text-sm">
                      <span>{it.productName} × {it.quantity}</span>
                      <span>${(it.price || 0).toFixed(2)}</span>
                    </li>
                  ))}
                </ul>
              </details>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
