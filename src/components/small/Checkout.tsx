"use client";
import React, { useEffect, useState } from 'react';
import { getCart, clearCart, updateQuantity } from '@/lib/cart';

export default function Checkout() {
  const [cart, setCart] = useState(() => (typeof window !== 'undefined' ? getCart() : []));
  const [name, setName] = useState('');
  const [address, setAddress] = useState('');
  const [processing, setProcessing] = useState(false);
  const [placed, setPlaced] = useState(false);

  useEffect(() => {
    // sync with storage on mount
    if (typeof window !== 'undefined') setCart(getCart());
  }, []);

  const total = cart.reduce((s, it) => s + (it.price || 0) * (it.quantity || 1), 0);

  const handlePlaceOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !address || cart.length === 0) return;
    setProcessing(true);
    // Simulate network delay
    await new Promise((r) => setTimeout(r, 900));
    clearCart();
    setCart([]);
    setProcessing(false);
    setPlaced(true);
  };

  if (placed) return (
    <div className="max-w-3xl mx-auto bg-white rounded-lg shadow p-6 text-center">
      <h2 className="text-2xl font-bold">Thank you for your order</h2>
  <p className="mt-2 text-gray-600">We&#39;ve received your order and will process it shortly.</p>
    </div>
  );

  return (
    <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-6">
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold mb-4">Your Cart</h3>
        {cart.length === 0 ? (
          <p className="text-gray-500">Your cart is empty.</p>
        ) : (
          <div className="space-y-4">
            {cart.map(item => (
              <div key={item.id} className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <img src={item.image || '/placeholder.png'} alt={item.name} className="h-12 w-12 object-cover rounded" />
                  <div>
                    <div className="font-medium">{item.name}</div>
                    <div className="text-sm text-gray-500">${item.price.toFixed(2)}</div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    value={item.quantity}
                    min={1}
                    onChange={(e) => {
                      const q = Number(e.target.value) || 1;
                      updateQuantity(item.id, q);
                      setCart(getCart());
                    }}
                    className="w-16 p-1 border rounded"
                  />
                </div>
              </div>
            ))}
            <div className="text-right font-semibold">Total: ${total.toFixed(2)}</div>
          </div>
        )}
      </div>

      <form className="bg-white rounded-lg shadow p-6" onSubmit={handlePlaceOrder}>
        <h3 className="text-lg font-semibold mb-4">Delivery & Payment</h3>
        <label className="block text-sm font-medium mb-1">Full name</label>
        <input className="w-full p-2 border rounded mb-3" value={name} onChange={(e) => setName(e.target.value)} />

        <label className="block text-sm font-medium mb-1">Address</label>
        <textarea className="w-full p-2 border rounded mb-3" value={address} onChange={(e) => setAddress(e.target.value)} />

        <button type="submit" className="w-full py-3 bg-indigo-600 text-white rounded hover:bg-indigo-700" disabled={processing || cart.length === 0}>
          {processing ? 'Placing order...' : 'Place Order'}
        </button>
      </form>
    </div>
  );
}
