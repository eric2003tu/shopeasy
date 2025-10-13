import React from 'react';
import { sampleProducts } from '@/lib/sampleData';
import { notFound } from 'next/navigation';
import ProductCard from '@/components/ui/ProductCard';

interface Props {
  params: { id: string };
}

export default function ProductDetail({ params }: Props) {
  const product = sampleProducts.find((p) => p.id === params.id);
  if (!product) return notFound();

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-6xl mx-auto grid lg:grid-cols-2 gap-10 items-start">
        <div>
          <div className="w-full h-96 bg-white rounded-xl overflow-hidden shadow-md">
            <img src={product.images[0] || '/placeholder.png'} alt={product.name} className="w-full h-full object-cover" />
          </div>
        </div>
        <div>
          <h1 className="text-3xl font-bold mb-4">{product.name}</h1>
          <p className="text-gray-700 mb-4">{product.description}</p>
          <div className="text-2xl font-bold text-[#634bc1] mb-6">${product.price}</div>
          <div className="flex gap-3">
            <button className="px-6 py-3 bg-[#634bc1] text-white rounded-lg">Add to cart</button>
            <button className="px-6 py-3 border border-gray-300 rounded-lg">Buy now</button>
          </div>
        </div>
      </div>

      <section className="max-w-6xl mx-auto mt-12">
        <h2 className="text-xl font-bold mb-4">Related products</h2>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {sampleProducts.filter(p => p.id !== product.id).slice(0,6).map(r => (
            <ProductCard key={r.id} image={r.images[0]||'/placeholder.png'} name={r.name} price={r.price} rating={4.5} reviews={120} />
          ))}
        </div>
      </section>
    </div>
  );
}
