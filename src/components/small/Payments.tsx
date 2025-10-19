"use client";
import React, { useEffect, useState, useRef } from 'react';
import { getCart, clearCart } from '@/lib/cart';
import { loadStripe } from '@stripe/stripe-js';
import {
  CardElement,
  Elements,
  ElementsConsumer,
  useStripe,
  useElements,
} from '@stripe/react-stripe-js';

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || '');

function CardForm({ total, onSuccess }: { total: number; onSuccess: () => void }) {
  const stripe = useStripe();
  const elements = useElements();
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!stripe || !elements) return;
    setProcessing(true);
    setError(null);

    const card = elements.getElement(CardElement);
    if (!card) {
      setError('Card element not found');
      setProcessing(false);
      return;
    }

    const { error: pmError, paymentMethod } = await stripe.createPaymentMethod({
      type: 'card',
      card,
    });

    if (pmError) {
      setError(pmError.message || 'Failed to create payment method');
      setProcessing(false);
      return;
    }

    // We have a PaymentMethod id (paymentMethod.id). In a real integration we'd send it to the backend to
    // create a PaymentIntent / charge. For now we just show success and clear cart so frontend flow works.
    console.log('PaymentMethod created (client-only):', paymentMethod?.id);
    clearCart();
    onSuccess();
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="mb-4">
        <label className="block text-sm font-medium mb-2">Card details</label>
        <div className="p-3 border rounded">
          <CardElement options={{ style: { base: { fontSize: '16px' } } }} />
        </div>
      </div>
      {error && <div className="text-red-600 mb-2">{error}</div>}
      <button type="submit" className="w-full py-3 bg-indigo-600 text-white rounded" disabled={!stripe || processing}>
        {processing ? 'Processing...' : `Pay $${total.toFixed(2)}`}
      </button>
    </form>
  );
}

export default function Payments() {
  const [cart, setCart] = useState(() => (typeof window !== 'undefined' ? getCart() : []));
  const [method, setMethod] = useState<'card' | 'paypal' | 'cod'>('card');
  const [success, setSuccess] = useState(false);

  const total = cart.reduce((s, it) => s + (it.price || 0) * (it.quantity || 1), 0);

  useEffect(() => {
    if (typeof window !== 'undefined') setCart(getCart());
  }, []);

  if (success) return (
    <div className="max-w-3xl mx-auto bg-white rounded-lg shadow p-6 text-center">
      <h2 className="text-2xl font-bold">Payment successful</h2>
      <p className="mt-2 text-gray-600">Thank you — payment method captured (client-only).</p>
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

      <div className="bg-white rounded-lg shadow p-6">
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
          <Elements stripe={stripePromise}>
            <CardForm total={total} onSuccess={() => setSuccess(true)} />
          </Elements>
        )}

        {method === 'paypal' && (
          <div>
            <p className="mb-4">PayPal flow will be integrated later. For now pick Card to test Stripe.</p>
          </div>
        )}

        {method === 'cod' && (
          <div>
            <p className="mb-4">Cash on Delivery selected. Place the order at checkout.</p>
            <button onClick={() => { clearCart(); setSuccess(true); }} className="w-full py-3 bg-indigo-600 text-white rounded">Place order (COD)</button>
          </div>
        )}
      </div>
    </div>
  );
}
