"use client";
import React from 'react';
import Link from 'next/link';
import Image from 'next/image';

interface ProductCardProps {
  image: string;
  name: string;
  price: number;
  originalPrice?: number;
  rating?: number;
  reviews?: number;
  isNew?: boolean;
}

export default function ProductCard({ image, name, price, originalPrice, rating, reviews, isNew }: ProductCardProps) {
  return (
    <div className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-xl transition-all group">
      <div className="relative h-64 overflow-hidden">
        <Image src={image} alt={name} fill className="object-cover group-hover:scale-105 transition-transform duration-500" sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw" />
      </div>
      <div className="p-6">
        <div className="flex justify-between items-start mb-2">
          <h3 className="text-lg font-bold text-gray-800">{name}</h3>
          {rating !== undefined && (
            <span className="flex items-center bg-gray-100 px-2 py-1 rounded text-sm">
              <svg className="w-3 h-3 mr-1 text-yellow-400" viewBox="0 0 24 24" fill="currentColor"><path d="M12 .587l3.668 7.431L23.2 9.75l-5.6 5.45L18.335 24 12 20.016 5.665 24l.735-8.8L.8 9.75l7.532-1.732L12 .587z"/></svg>
              {rating} <span className="text-gray-500 ml-1">({reviews ?? 0})</span>
            </span>
          )}
        </div>
        <div className="flex items-center gap-3 mb-4">
          <p className="text-2xl font-bold text-[#634bc1]">${price.toFixed(2)}</p>
          {originalPrice && (
            <p className="text-gray-400 line-through">${originalPrice.toFixed(2)}</p>
          )}
        </div>
        <div className="grid grid-cols-2 gap-3">
          <Link href="/products" className="py-2 text-center bg-[#634bc1] text-white rounded-lg hover:bg-[#756a9f] transition-colors">
            View
          </Link>
          <button className="py-2 text-center border border-gray-300 rounded-lg hover:bg-gray-100 transition-colors">
            Add to cart
          </button>
        </div>
      </div>
    </div>
  );
}
