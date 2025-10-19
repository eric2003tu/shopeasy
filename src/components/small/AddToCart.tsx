"use client";
import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { sampleProducts } from '@/lib/sampleData';
import { CartItem, getCart, saveCart } from '@/lib/cart';

interface Product {
  id: string;
  name: string;
  price: number;
  images: string[];
  description?: string;
}

export default function AddToCart() {
  const [product, setProduct] = useState<Product | null>(null);
  const [warning, setWarning] = useState<string>('');

  useEffect(() => {
    const currentProduct = localStorage.getItem('id');
    if (currentProduct) {
      const found = sampleProducts.find(p => p.id === currentProduct);
      if (found) {
        setProduct({ id: found.id, name: found.name, price: found.price, images: found.images, description: found.description });
      } else {
        setWarning('Product not found');
      }
    }
  }, []);

  useEffect(() => {
    if (warning) {
      const timeout = setTimeout(() => setWarning(''), 3000);
      return () => clearTimeout(timeout);
    }
  }, [warning]);

  const addingToCart = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();

    if (!product) {
      setWarning('No product loaded');
      return;
    }

    try {
      const cart: CartItem[] = getCart();
      const existing = cart.find((c: CartItem) => c.id === product.id);
      if (existing) {
        existing.quantity += 1;
      } else {
        const newItem: CartItem = { id: product.id, name: product.name, price: product.price, image: product.images[0], quantity: 1 };
        cart.push(newItem);
      }
      saveCart(cart);
      setWarning('Product added to cart');
    } catch {
      setWarning('Failed to add product to cart');
    }
  };

  if (!product) {
    return (
      <div className='flex justify-center items-center h-[50vh] w-full'>
        <p className='text-gray-500'>Loading product...</p>
      </div>
    );
  }

  return (
    <div className='lg:w-2/3 mx-auto bg-white rounded-lg shadow-md p-6 grid grid-cols-2 gap-6'>
      <div className='w-full h-64 relative'>
        <Image src={product.images[0] || '/placeholder.png'} alt={`Image of ${product.name}`} fill className='object-contain rounded-md' sizes="(min-width: 1024px) 50vw, 100vw" />
      </div>
      <div className='flex flex-col gap-3'>
        <h1 className='text-3xl font-bold text-[#634bc1]'>{product.name}</h1>
        <p>{product.description}</p>
        <p className='text-[#634bc1] font-semibold'>${product.price}</p>
        <button
          className='text-center text-white p-2 px-4 lg:w-1/2 bg-[#634bc1] rounded-md hover:bg-[#5340a0] transition-colors'
          onClick={addingToCart}
        >
          Buy Now
        </button>
        {warning && <h1 className='text-[#634bc1]'>{warning}</h1>}
      </div>
    </div>
  );
}
