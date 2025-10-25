"use client";
import React, { useEffect, useState } from 'react';
import { getCart, clearCart, fetchUserCarts } from '@/lib/cart';
import { useAuth } from '@/context/AuthProvider';
import { loadStripe } from '@stripe/stripe-js';
import {
  CardElement,
  Elements,
  useStripe,
  useElements,
} from '@stripe/react-stripe-js';

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || '');

// Payment method types
type PaymentMethod = 'card' | 'paypal' | 'momo' | 'equity' | 'airtel' | 'cod';

// Payment method configuration
const paymentMethods = [
  { 
    id: 'card' as PaymentMethod, 
    name: 'Credit/Debit Card', 
    icon: '/card.png',
    description: 'Pay securely with your card'
  },
  { 
    id: 'paypal' as PaymentMethod, 
    name: 'PayPal', 
    icon: '/paypal.png',
    description: 'Pay with your PayPal account'
  },
  { 
    id: 'momo' as PaymentMethod, 
    name: 'Mobile Money', 
    icon: '/momo.png',
    description: 'Pay via Mobile Money'
  },
  { 
    id: 'equity' as PaymentMethod, 
    name: 'Equity Bank', 
    icon: '/equity.png',
    description: 'Pay via Equity Bank'
  },
  { 
    id: 'airtel' as PaymentMethod, 
    name: 'Airtel Money', 
    icon: '/airtel.png',
    description: 'Pay via Airtel Money'
  },
  { 
    id: 'cod' as PaymentMethod, 
    name: 'Cash on Delivery', 
    icon: '/cash.png',
    description: 'Pay when you receive your order'
  }
];

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

    console.log('PaymentMethod created (client-only):', paymentMethod?.id);
    clearCart();
    onSuccess();
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="mb-4">
        <label className="block text-sm font-medium mb-2 text-gray-700">Card details</label>
        <div className="p-3 border border-gray-300 rounded-lg bg-white">
          <CardElement options={{ 
            style: { 
              base: { 
                fontSize: '16px',
                color: '#374151',
                '::placeholder': { color: '#9CA3AF' }
              } 
            } 
          }} />
        </div>
      </div>
      {error && <div className="text-red-600 mb-4 text-sm bg-red-50 p-3 rounded-lg">{error}</div>}
      <button 
        type="submit" 
        className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-medium transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed" 
        disabled={!stripe || processing}
      >
        {processing ? 'Processing...' : `Pay $${total.toFixed(2)}`}
      </button>
    </form>
  );
}

function PaymentMethodButton({ 
  method, 
  isSelected, 
  onSelect 
}: { 
  method: typeof paymentMethods[0]; 
  isSelected: boolean; 
  onSelect: () => void; 
}) {
  return (
    <button
      type="button"
      onClick={onSelect}
      className={`w-full p-4 border rounded-lg text-left transition-all duration-200 ${
        isSelected 
          ? 'border-indigo-500 bg-indigo-50 ring-2 ring-indigo-500 ring-opacity-50' 
          : 'border-gray-300 bg-white hover:border-gray-400'
      }`}
    >
      <div className="flex items-center gap-3">
        <img src= {method.icon} className='w-10 h-10'/>
        <div className="flex-1">
          <div className="font-medium text-gray-900">{method.name}</div>
          <div className="text-sm text-gray-500">{method.description}</div>
        </div>
        <div className={`w-4 h-4 rounded-full border-2 ${
          isSelected ? 'border-indigo-500 bg-indigo-500' : 'border-gray-400'
        }`} />
      </div>
    </button>
  );
}

export default function Payments() {
  const { user } = useAuth();
  const [cart, setCart] = useState(() => (typeof window !== 'undefined' ? getCart() : []));
  const [method, setMethod] = useState<PaymentMethod>('card');
  const [success, setSuccess] = useState(false);

  const total = cart.reduce((s, it) => s + (it.price || 0) * (it.quantity || 1), 0);

  useEffect(() => {
    let mounted = true;
    const load = async () => {
      // If user is logged in, try to load their cart from the backend and use it as the authoritative source
      try {
        if (user && typeof (user as any).id !== 'undefined') {
          const userId = Number((user as any).id);
          const remoteCart = await fetchUserCarts(userId);
          if (remoteCart && Array.isArray(remoteCart.products) && remoteCart.products.length > 0) {
            const mapped = remoteCart.products.map((p: any) => ({
              id: String(p.id),
              name: p.title || p.name || `Product ${p.id}`,
              price: Number(p.price || 0),
              image: p.thumbnail || p.image || undefined,
              quantity: Number(p.quantity || 1),
            }));
            if (mounted) setCart(mapped);
            return;
          }
        }
      } catch (err) {
        // fallback to local cart on any error
        // console.debug('[Payments] fetchUserCarts failed', err);
      }

      // fallback: use local cart (guest or if backend unavailable)
      if (mounted && typeof window !== 'undefined') setCart(getCart());
    };
    load();
    return () => { mounted = false; };
  }, [user]);

  const handleContinue = () => {
    // In a real app, you would integrate with each payment provider's API
    console.log(`Processing ${method} payment for $${total.toFixed(2)}`);
    
    // For demo purposes, we'll just clear cart and show success
    if (method !== 'card') { // Card has its own form submission
      clearCart();
      setSuccess(true);
    }
  };

  if (success) return (
    <div className="w-full h-fit mx-auto bg-green-500 text-white rounded-lg shadow-lg p-8 text-center">
      <div className="w-16 h-16 bg-green-400 rounded-full flex items-center justify-center mx-auto mb-4">
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
        </svg>
      </div>
      <h2 className="text-2xl font-bold mb-2">Payment Successful</h2>
      <p className="text-green-100">Thank you for your order. Your payment has been processed successfully.</p>
    </div>
  );

  return (
    <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-8 p-4">
      {/* Order Summary */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        <h3 className="text-xl font-semibold mb-6 text-gray-900">Order Summary</h3>
        {cart.length === 0 ? (
          <p className="text-gray-500 text-center py-8">Your cart is empty.</p>
        ) : (
          <div className="space-y-4">
            {cart.map(it => (
              <div key={it.id} className="flex justify-between items-center py-3 border-b border-gray-100">
                <div className="flex-1">
                  <div className="font-medium text-gray-900">{it.name}</div>
                  <div className="text-sm text-gray-500">Quantity: {it.quantity}</div>
                </div>
                <div className="font-semibold text-gray-900">
                  ${(it.price * (it.quantity || 1)).toFixed(2)}
                </div>
              </div>
            ))}
            <div className="flex justify-between items-center pt-4 border-t border-gray-200">
              <span className="text-lg font-semibold text-gray-900">Total:</span>
              <span className="text-xl font-bold text-indigo-600">${total.toFixed(2)}</span>
            </div>
          </div>
        )}
      </div>

      {/* Payment Section */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        <h3 className="text-xl font-semibold mb-6 text-gray-900">Payment Method</h3>
        
        {/* Payment Method Selection */}
        <div className="space-y-3 mb-6">
          {paymentMethods.map(paymentMethod => (
            <PaymentMethodButton
              key={paymentMethod.id}
              method={paymentMethod}
              isSelected={method === paymentMethod.id}
              onSelect={() => setMethod(paymentMethod.id)}
            />
          ))}
        </div>

        {/* Payment Form */}
        <div className="mt-6">
          {method === 'card' && (
            <Elements stripe={stripePromise}>
              <CardForm total={total} onSuccess={() => setSuccess(true)} />
            </Elements>
          )}

          {method === 'paypal' && (
            <div className="space-y-4">
              <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                <p className="text-blue-800 text-sm">
                  You will be redirected to PayPal to complete your payment securely.
                </p>
              </div>
              <button 
                onClick={handleContinue}
                className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors duration-200"
              >
                Continue to PayPal
              </button>
            </div>
          )}

          {method === 'momo' && (
            <div className="space-y-4">
              <div className="p-4 bg-purple-50 rounded-lg border border-purple-200">
                <p className="text-purple-800 text-sm">
                  Complete your payment using Mobile Money. You will receive a prompt on your phone.
                </p>
              </div>
              <button 
                onClick={handleContinue}
                className="w-full py-3 bg-purple-600 hover:bg-purple-700 text-white rounded-lg font-medium transition-colors duration-200"
              >
                Pay with Mobile Money
              </button>
            </div>
          )}

          {method === 'equity' && (
            <div className="space-y-4">
              <div className="p-4 bg-green-50 rounded-lg border border-green-200">
                <p className="text-green-800 text-sm">
                  Secure payment through Equity Bank. You will be redirected to Equity's payment portal.
                </p>
              </div>
              <button 
                onClick={handleContinue}
                className="w-full py-3 bg-green-600 hover:bg-green-700 text-white rounded-lg font-medium transition-colors duration-200"
              >
                Pay with Equity Bank
              </button>
            </div>
          )}

          {method === 'airtel' && (
            <div className="space-y-4">
              <div className="p-4 bg-red-50 rounded-lg border border-red-200">
                <p className="text-red-800 text-sm">
                  Pay using Airtel Money. You will receive a USSD prompt on your Airtel line.
                </p>
              </div>
              <button 
                onClick={handleContinue}
                className="w-full py-3 bg-red-600 hover:bg-red-700 text-white rounded-lg font-medium transition-colors duration-200"
              >
                Pay with Airtel Money
              </button>
            </div>
          )}

          {method === 'cod' && (
            <div className="space-y-4">
              <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                <p className="text-gray-800 text-sm">
                  Pay when you receive your order. Our delivery agent will collect the payment.
                </p>
              </div>
              <button 
                onClick={handleContinue}
                className="w-full py-3 bg-gray-600 hover:bg-gray-700 text-white rounded-lg font-medium transition-colors duration-200"
              >
                Place Order (Cash on Delivery)
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}