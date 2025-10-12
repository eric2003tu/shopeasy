"use client";
import React, { useEffect, useState } from 'react';

interface Product {
  _id?: string;
  name: string;
  description?: string;
  price: number;
  images: string[];
  category?: string;
  stock?: number;
  featured?: boolean;
}

interface Props {
  initial?: Partial<Product>;
  onSave: (p: Product) => void;
  onCancel: () => void;
}

const ProductForm: React.FC<Props> = ({ initial, onSave, onCancel }) => {
  const [product, setProduct] = useState<Product>(() => ({
    _id: initial?._id || '',
    name: initial?.name || '',
    description: initial?.description || '',
    price: initial?.price ?? 0,
    images: initial?.images || ['/placeholder-product.jpg'],
    category: initial?.category || '',
    stock: initial?.stock ?? 0,
    featured: initial?.featured ?? false,
  } as Product));

  useEffect(() => {
    setProduct(prev => ({ ...prev, ...(initial || {}) } as Product));
  }, [initial]);

  const change = <K extends keyof Product>(k: K, v: Product[K]) => setProduct(prev => ({ ...prev, [k]: v } as Product));

  return (
  <div className="bg-card p-4 rounded mb-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        <div>
          <label className="text-sm mb-1 block">Name</label>
          <input value={product.name} onChange={(e) => change('name', e.target.value)} className="w-full p-2 border rounded" />
        </div>
        <div>
          <label className="text-sm mb-1 block">Price</label>
          <input type="number" value={product.price} onChange={(e) => change('price', Number(e.target.value))} className="w-full p-2 border rounded" />
        </div>
        <div className="md:col-span-2">
          <label className="text-sm mb-1 block">Description</label>
          <textarea value={product.description} onChange={(e) => change('description', e.target.value)} className="w-full p-2 border rounded" />
        </div>
        <div>
          <label className="text-sm mb-1 block">Image URL</label>
          <input value={product.images[0]} onChange={(e) => change('images', [e.currentTarget.value])} className="w-full p-2 border rounded" />
        </div>
        <div>
          <label className="text-sm mb-1 block">Category</label>
          <input value={product.category} onChange={(e) => change('category', e.target.value)} className="w-full p-2 border rounded" />
        </div>
        <div>
          <label className="text-sm mb-1 block">Stock</label>
          <input type="number" value={product.stock} onChange={(e) => change('stock', Number(e.target.value))} className="w-full p-2 border rounded" />
        </div>
        <div className="flex items-center gap-2">
          <input type="checkbox" checked={product.featured} onChange={(e) => change('featured', e.target.checked)} />
          <label className="text-sm">Featured</label>
        </div>
      </div>

      <div className="mt-3 flex gap-2">
        <button onClick={() => onSave(product)} className="px-3 py-1 bg-primary text-primary-foreground rounded">Save</button>
        <button onClick={onCancel} className="px-3 py-1 bg-muted rounded">Cancel</button>
      </div>
    </div>
  );
};

export default ProductForm;
