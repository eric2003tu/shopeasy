"use client";
import React, { useEffect, useState } from 'react';
import { useI18n } from '@/i18n/I18nProvider';

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

  const { t } = useI18n();

  return (
  <div className="bg-card p-4 rounded mb-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        <div>
          <label className="text-sm mb-1 block">{t('admin.fields.product.name')}</label>
          <input value={product.name} onChange={(e) => change('name', e.target.value)} className="w-full p-2 border rounded" placeholder={t('admin.placeholders.productName')}
          />
        </div>
        <div>
          <label className="text-sm mb-1 block">{t('admin.fields.product.price')}</label>
          <input type="number" value={product.price} onChange={(e) => change('price', Number(e.target.value))} className="w-full p-2 border rounded" />
        </div>
        <div className="md:col-span-2">
          <label className="text-sm mb-1 block">{t('admin.fields.product.description')}</label>
          <textarea value={product.description} onChange={(e) => change('description', e.target.value)} className="w-full p-2 border rounded" />
        </div>
        <div>
          <label className="text-sm mb-1 block">{t('admin.fields.product.imageUrl')}</label>
          <input value={product.images[0]} onChange={(e) => change('images', [e.currentTarget.value])} className="w-full p-2 border rounded" />
        </div>
        <div>
          <label className="text-sm mb-1 block">{t('admin.fields.product.category')}</label>
          <input value={product.category} onChange={(e) => change('category', e.target.value)} className="w-full p-2 border rounded" />
        </div>
        <div>
          <label className="text-sm mb-1 block">{t('admin.fields.product.stock')}</label>
          <input type="number" value={product.stock} onChange={(e) => change('stock', Number(e.target.value))} className="w-full p-2 border rounded" />
        </div>
        <div className="flex items-center gap-2">
          <input type="checkbox" checked={product.featured} onChange={(e) => change('featured', e.target.checked)} />
          <label className="text-sm">{t('admin.fields.product.featured')}</label>
        </div>
      </div>

      <div className="mt-3 flex gap-2">
        <button onClick={() => onSave(product)} className="px-3 py-1 bg-primary text-primary-foreground rounded">{t('admin.buttons.save')}</button>
        <button onClick={onCancel} className="px-3 py-1 bg-muted rounded">{t('admin.buttons.cancel')}</button>
      </div>
    </div>
  );
};

export default ProductForm;
