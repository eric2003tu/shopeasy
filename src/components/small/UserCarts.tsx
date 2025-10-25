"use client";
import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import { useAuth } from '@/context/AuthProvider';
import { useToast } from '@/context/ToastProvider';

interface CartProduct {
  id: number;
  title: string;
  price: number;
  quantity: number;
  total: number;
  discountedPrice?: number;
  thumbnail?: string;
}

interface CartResponse {
  carts: Array<{
    id: number;
    products: CartProduct[];
    total: number;
    discountedTotal: number;
    userId: number;
    totalProducts: number;
    totalQuantity: number;
  }>;
  total: number;
  skip: number;
  limit: number;
}

export default function UserCarts() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [carts, setCarts] = useState<CartResponse | null>(null);

  const fetchCarts = async () => {
    if (!user?.id) return;
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`https://dummyjson.com/carts/user/${user.id}`);
      if (!res.ok) throw new Error(`Failed to load carts: ${res.status}`);
      const data: CartResponse = await res.json();
      setCarts(data);
    } catch (err: unknown) {
      console.error(err);
  const message = err instanceof Error ? err.message : String(err);
  setError(message);
      toast({ type: 'error', title: 'Carts failed', description: 'Could not load your carts' });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCarts();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user?.id]);

  if (!user) return null;

  return (
    <div className="mt-8">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold">Your carts</h3>
        <div className="flex items-center gap-2">
          <button className="px-3 py-1 border rounded text-sm" onClick={fetchCarts} disabled={loading}>{loading ? 'Refreshing...' : 'Refresh'}</button>
        </div>
      </div>

      {loading && <div className="text-sm text-gray-500">Loading carts...</div>}
      {error && <div className="text-sm text-red-500">{error}</div>}

      {carts && carts.carts.length === 0 && <div className="text-sm text-gray-500">No carts found</div>}

      <div className="space-y-4 mt-4">z
        {carts && carts.carts.map(cart => (
          <div key={cart.id} className="bg-white border rounded p-4">
            <div className="flex items-center justify-between mb-3">
              <div className="text-sm text-gray-600">Cart #{cart.id} • {cart.totalProducts} products • {cart.totalQuantity} items</div>
              <div className="text-sm font-semibold">Total: ${cart.total.toFixed(2)}</div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {cart.products.map(p => (
                <div key={p.id} className="flex items-center gap-3">
                  <div className="w-16 h-16 relative rounded overflow-hidden bg-gray-100 border">
                    {p.thumbnail ? <Image src={p.thumbnail} alt={p.title} fill className="object-cover" sizes="64px" /> : <div className="w-full h-full bg-gray-200" />}
                  </div>
                  <div className="flex-1">
                    <div className="font-medium">{p.title}</div>
                    <div className="text-sm text-gray-500">Qty: {p.quantity} • ${p.price.toFixed(2)}</div>
                  </div>
                  <div className="text-sm font-semibold">${p.total.toFixed(2)}</div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
