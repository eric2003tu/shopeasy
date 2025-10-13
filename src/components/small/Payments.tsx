"use client";
import React, { useEffect, useState } from 'react';
import { getCart, clearCart } from '@/lib/cart';

export default function Payments() {
  const [cart, setCart] = useState(() => (typeof window !== 'undefined' ? getCart() : []));
  const [method, setMethod] = useState<'card' | 'paypal' | 'cod'>('card');
  const [processing, setProcessing] = useState(false);
  const [success, setSuccess] = useState(false);

  const total = cart.reduce((s, it) => s + (it.price || 0) * (it.quantity || 1), 0);

  useEffect(() => {
    if (typeof window !== 'undefined') setCart(getCart());
  }, []);

  const handlePay = async (e: React.FormEvent) => {
    e.preventDefault();
    if (cart.length === 0) return;
    setProcessing(true);
    // Simulate payment latency
    await new Promise((r) => setTimeout(r, 1000));

    // For PayPal, we could redirect; here we simply simulate success
    clearCart();
    setCart([]);
    setProcessing(false);
    setSuccess(true);
  };

  if (success) return (
    <div className="max-w-3xl mx-auto bg-white rounded-lg shadow p-6 text-center">
      <h2 className="text-2xl font-bold">Payment successful</h2>
      <p className="mt-2 text-gray-600">Thank you — your payment was processed.</p>
    </div>
  );

  return (
    <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-6">
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold mb-4">Order Summary</h3>
        {cart.length === 0 ? (
          <p className="text-gray-500">Your cart is empty.</p>
        ) : (
          <div className="space-y-3">
            {cart.map(it => (
              <div key={it.id} className="flex justify-between">
                <div>{it.name} x{it.quantity}</div>
                <div>${(it.price * (it.quantity || 1)).toFixed(2)}</div>
              </div>
            ))}
            <div className="text-right font-semibold">Total: ${total.toFixed(2)}</div>
          </div>
        )}
      </div>

      <form className="bg-white rounded-lg shadow p-6" onSubmit={handlePay}>
        <h3 className="text-lg font-semibold mb-4">Payment</h3>

        <div className="space-y-2 mb-4">
          <label className="flex items-center gap-2">
            <input type="radio" name="method" checked={method === 'card'} onChange={() => setMethod('card')} />
            <span>Card</span>
          </label>
          <label className="flex items-center gap-2">
            <input type="radio" name="method" checked={method === 'paypal'} onChange={() => setMethod('paypal')} />
            <span>PayPal</span>
          </label>
          <label className="flex items-center gap-2">
            <input type="radio" name="method" checked={method === 'cod'} onChange={() => setMethod('cod')} />
            <span>Cash on Delivery</span>
          </label>
        </div>

        {method === 'card' && (
          <div className="space-y-2 mb-4">
            <input placeholder="Card number" className="w-full p-2 border rounded" />
            <div className="grid grid-cols-2 gap-2">
              <input placeholder="MM/YY" className="p-2 border rounded" />
              <input placeholder="CVC" className="p-2 border rounded" />
            </div>
            <input placeholder="Name on card" className="w-full p-2 border rounded" />
          </div>
        )}

        <button type="submit" className="w-full py-3 bg-indigo-600 text-white rounded" disabled={processing || cart.length === 0}>
          {processing ? 'Processing...' : `Pay ${total.toFixed(2)}`}
        </button>
      </form>
    </div>
  );
}
