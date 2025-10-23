import React from 'react';
import Image from 'next/image';
import ProductCard from '@/components/ui/ProductCard';
import ProductActionsClient from '@/components/product/ProductActionsClient';
import ProductCommentsClientWrapper from '@/components/product/ProductCommentsClientWrapper';
import ReviewCarousel from '@/components/ui/ReviewCarousel';
import { fetchProductById, fetchProducts, ApiProduct } from '@/lib/appClient';
import { notFound } from 'next/navigation';

interface Props {
  id: string | number;
}

function formatPrice(p: number) {
  return `$${p.toFixed(2)}`;
}

export default async function ProductDetailServer({ id }: Props) {
  const pid = typeof id === 'string' ? Number(id) : id;
  if (Number.isNaN(pid)) return notFound();

  let product: ApiProduct | null = null;
  try {
    product = await fetchProductById(pid);
  } catch (e) {
    return notFound();
  }

  let related: ApiProduct[] = [];
  try {
    const list = await fetchProducts(30, 0);
    related = list.products.filter(p => p.id !== product!.id && p.category === product!.category).slice(0,6);
  } catch (e) {
    related = [];
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-6xl mx-auto grid lg:grid-cols-2 gap-10 items-start">
        <div>
          <div className="w-full bg-white rounded-xl overflow-hidden shadow-md">
            <div className="relative w-full h-[520px]">
              <Image src={product!.images?.[0] || product!.thumbnail || '/placeholder.png'} alt={product!.title} fill className="w-full h-full object-cover" sizes="(max-width: 1024px) 100vw, 50vw" />
            </div>
            {product!.images && product!.images.length > 1 && (
              <div className="mt-4 px-4 py-3 flex gap-3 overflow-x-auto">
                {product!.images.map((img, idx) => (
                  <div key={idx} className="flex-shrink-0 w-24 h-24 bg-gray-100 rounded overflow-hidden border">
                    <Image src={img} alt={`${product!.title} ${idx}`} width={96} height={96} className="object-cover" />
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
        <div>
          <h1 className="text-3xl font-bold mb-4">{product!.title}</h1>
          <p className="text-gray-700 mb-4">{product!.description}</p>
          <div className="flex items-center gap-4 mb-4">
            <div className="text-2xl font-bold text-[#634bc1]">{formatPrice(product!.price)}</div>
            {product!.discountPercentage ? <div className="text-sm text-green-600">-{product!.discountPercentage}%</div> : null}
            <div className="text-sm text-gray-600">{product!.availabilityStatus || (product!.stock && product!.stock > 0 ? 'In stock' : 'Out of stock')}</div>
          </div>

          <div className="mb-6">
            <div className="text-sm text-gray-500">Brand: <strong>{product!.brand}</strong></div>
            <div className="text-sm text-gray-500">Category: <strong>{product!.category}</strong></div>
            {product!.sku && <div className="text-sm text-gray-500">SKU: <strong>{product!.sku}</strong></div>}
            {product!.weight && <div className="text-sm text-gray-500">Weight: <strong>{product!.weight}</strong></div>}
            {product!.dimensions && (
              <div className="text-sm text-gray-500">Dimensions: <strong>{`${product!.dimensions.width} x ${product!.dimensions.height} x ${product!.dimensions.depth}`}</strong></div>
            )}
          </div>

          <div className="mb-6">
            {/* client actions (add to cart with loading) */}
            <ProductActionsClient id={product!.id} title={product!.title} price={product!.price} image={product!.thumbnail || product!.images?.[0]} />
            <div className="mt-3">
              {/* comment popup for logged-in users (rendered by a client wrapper) */}
              <ProductCommentsClientWrapper postId={product!.id} />
            </div>
          </div>

          {product!.reviews && Array.isArray(product!.reviews) && product!.reviews.length > 0 && (
            <div className="mt-8">
              <h2 className="text-xl font-semibold mb-3">Reviews</h2>
              <ReviewCarousel reviews={product!.reviews as { rating: number; comment: string; date?: string; reviewerName?: string; reviewerEmail?: string }[]} />
            </div>
          )}
        </div>
      </div>

      {related.length > 0 && (
        <section className="max-w-6xl mx-auto mt-12">
          <h2 className="text-xl font-bold mb-4">Related products</h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {related.map(r => (
              <ProductCard key={r.id} image={r.images?.[0]||r.thumbnail||'/placeholder.png'} name={r.title} price={r.price} rating={r.rating||0} reviews={0} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
