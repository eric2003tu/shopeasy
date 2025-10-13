"use client";
import React, { useEffect, useState } from 'react';
import Link from 'next/link';

interface CartItem {
  id: string;
  name: string;
  price: number;
  image?: string;
  quantity: number;
}

export default function CartsPage() {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [warning, setWarning] = useState<string>('');

  useEffect(() => {
    try {
      const stored = JSON.parse(localStorage.getItem('cart') || '[]');
      setCartItems(stored);
    } catch (err) {
      setWarning('Failed to load cart');
      setCartItems([]);
    }
  }, []);

  const updateQuantity = (id: string, qty: number) => {
    if (qty < 1) return;
    const next = cartItems.map(item => item.id === id ? { ...item, quantity: qty } : item);
    setCartItems(next);
    localStorage.setItem('cart', JSON.stringify(next));
  };

  const removeItem = (id: string) => {
    const next = cartItems.filter(i => i.id !== id);
    setCartItems(next);
    localStorage.setItem('cart', JSON.stringify(next));
  };

  const calculateTotal = () => cartItems.reduce((sum, it) => sum + it.price * it.quantity, 0).toFixed(2);

  if (warning) return <div className="min-h-screen flex items-center justify-center">{warning}</div>;

  return (
    <div className='min-h-screen p-8 bg-gray-50'>
      <div className='max-w-6xl mx-auto'>
        <h1 className='text-3xl font-bold text-[#634bc1] mb-6'>Your Cart</h1>

        {cartItems.length === 0 ? (
          <div className='bg-white rounded-lg shadow-md p-8 text-center'>
            <p className='text-gray-600 mb-4'>Your cart is empty</p>
            <Link href='/shop/products' className='inline-block bg-[#634bc1] text-white px-6 py-2 rounded'>Start shopping</Link>
          </div>
        ) : (
          <div className='grid grid-cols-1 gap-6'>
            {cartItems.map(item => (
              <div key={item.id} className='bg-white rounded-lg shadow-sm p-4 flex items-center gap-4'>
                <img src={item.image || '/placeholder.png'} alt={item.name} className='w-32 h-32 object-cover rounded' />
                <div className='flex-1'>
                  <h2 className='font-semibold text-lg'>{item.name}</h2>
                  <p className='text-gray-600'>${item.price.toFixed(2)}</p>
                </div>
                <div className='flex items-center gap-2'>
                  <button className='px-3 py-1 bg-gray-100 rounded' onClick={() => updateQuantity(item.id, item.quantity - 1)}>-</button>
                  <input type='number' value={item.quantity} onChange={(e) => updateQuantity(item.id, parseInt(e.target.value) || 1)} className='w-16 text-center border rounded py-1' />
                  <button className='px-3 py-1 bg-gray-100 rounded' onClick={() => updateQuantity(item.id, item.quantity + 1)}>+</button>
                  <button className='ml-4 px-4 py-2 bg-red-500 text-white rounded' onClick={() => removeItem(item.id)}>Remove</button>
                </div>
              </div>
            ))}

            <div className='flex justify-end'>
              <div className='bg-white p-6 rounded-lg shadow-md w-80'>
                <div className='flex justify-between mb-2'>
                  <span>Subtotal</span>
                  <span>${calculateTotal()}</span>
                </div>
                <button className='w-full mt-4 bg-[#634bc1] text-white py-2 rounded'>Proceed to checkout</button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
