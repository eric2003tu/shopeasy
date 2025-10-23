"use client";
import React, { useState } from 'react';
import { addToCart, syncCartToServer } from '@/lib/cart';
import { useToast } from '@/context/ToastProvider';

interface Props {
  id: number | string;
  title: string;
  price: number;
  image?: string;
}

export default function ProductActionsClient({ id, title, price, image }: Props) {
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const handleAdd = async () => {
    try {
      setLoading(true);
      addToCart({ id: String(id), name: title, price, image, quantity: 1 });
      toast({ type: 'success', title: 'Added', description: `${title} added to cart` });

      const token = typeof window !== 'undefined' ? localStorage.getItem('shopeasy_token') : null;
      const rawUser = typeof window !== 'undefined' ? localStorage.getItem('shopeasy_user') : null;
      const parsed = rawUser ? JSON.parse(rawUser) : null;
      const userId = parsed?.id || parsed?.userId || null;
      if (token && userId) {
        try {
          const remote = await syncCartToServer(Number(userId), token);
          toast({ type: 'success', title: 'Cart synced', description: `Server cart total: ${remote?.total ?? 'n/a'}` });
        } catch (err) {
          console.debug('cart sync failed', err);
          toast({ type: 'error', title: 'Sync failed', description: 'Could not sync cart to server' });
        }
      }
    } catch (err) {
      console.error('Add to cart failed', err);
      toast({ type: 'error', title: 'Error', description: 'Could not add to cart' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex gap-3">
      <button disabled={loading} onClick={handleAdd} className={`px-6 py-3 rounded-lg text-white ${loading ? 'bg-indigo-400' : 'bg-[#634bc1] hover:bg-[#5340a0]'}`}>
        {loading ? (
          <span className="inline-flex items-center gap-2">
            <svg className="w-4 h-4 animate-spin" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"></path></svg>
            Adding...
          </span>
        ) : 'Add to cart'}
      </button>

      <button className="px-6 py-3 border border-gray-300 rounded-lg">Buy now</button>
    </div>
  );
}
