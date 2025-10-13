"use client";
import React, { useEffect, useState } from 'react';
import ProductForm from './ProductForm';
import ConfirmDialog from './ConfirmDialog';
import Image from 'next/image';
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

const STORAGE_KEY = 'admin_products_v1';

const loadFromStorage = (): Product[] => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    return JSON.parse(raw) as Product[];
  } catch {
    return [];
  }
};

const saveToStorage = (items: Product[]) => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
};

const ProductsAdmin: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [editing, setEditing] = useState<Product | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [confirm, setConfirm] = useState<{ open: boolean; id?: string; message?: string }>({ open: false });

  useEffect(() => {
    const stored = loadFromStorage();
    if (stored.length) setProducts(stored);
    else {
      const defaultProducts = window.__SHOPEASY_DEFAULT_PRODUCTS as Product[] | undefined;
      if (defaultProducts && defaultProducts.length) {
        setProducts(defaultProducts);
        saveToStorage(defaultProducts);
      }
    }
  }, []);

  useEffect(() => {
    saveToStorage(products);
  }, [products]);

  const onAdd = () => {
    setEditing(null);
    setShowForm(true);
  };

  const onEdit = (p: Product) => {
    setEditing(p);
    setShowForm(true);
  };

  const onDelete = (id?: string) => {
    if (!id) return;
    setConfirm({ open: true, id, message: '' });
  };

  const confirmDelete = (id?: string) => {
    if (!id) return setConfirm({ open: false });
    setProducts(prev => prev.filter(p => p._id !== id));
    setConfirm({ open: false });
  };

  const saveProduct = (product: Product) => {
    if (product._id && product._id !== '') {
      setProducts(prev => prev.map(p => p._id === product._id ? product : p));
    } else {
      product._id = Date.now().toString();
      setProducts(prev => [product, ...prev]);
    }
    setShowForm(false);
  };

  const { t } = useI18n();

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold">{t('admin.products')}</h2>
        <div className="flex items-center gap-2">
          <button onClick={onAdd} className="px-3 py-1 bg-primary text-primary-foreground rounded">{t('admin.buttons.addProduct')}</button>
          <button onClick={() => { localStorage.removeItem(STORAGE_KEY); setProducts([]); }} className="px-3 py-1 bg-destructive/10 text-destructive rounded">{t('admin.buttons.clear') || 'Clear'}</button>
        </div>
      </div>

      {showForm && <ProductForm initial={editing ?? undefined} onCancel={() => setShowForm(false)} onSave={saveProduct} />}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-4">
        {products.map(p => (
          <div key={p._id} className="bg-card rounded shadow p-4">
            <div className="h-40 mb-3 bg-muted/60 flex items-center justify-center">
              <div className="relative h-20 w-20">
                <Image
                  src={(p.images && p.images[0]) || '/placeholder-product.jpg'}
                  alt={p.name}
                  fill
                  className="object-contain"
                  sizes="80px"
                />
              </div>
            </div>
            <h3 className="font-semibold text-lg">{p.name}</h3>
            <p className="text-sm text-muted-foreground mb-2">{p.description}</p>
            <div className="flex items-center justify-between">
              <div className="text-primary font-bold">${p.price}</div>
              <div className="flex gap-2">
                <button onClick={() => onEdit(p)} className="px-2 py-1 bg-accent/10 text-accent rounded">{t('admin.buttons.editProduct')}</button>
                <button onClick={() => onDelete(p._id)} className="px-2 py-1 bg-destructive/10 text-destructive rounded">{t('admin.buttons.delete')}</button>
              </div>
            </div>
          </div>
        ))}
      </div>

      <ConfirmDialog open={confirm.open} message={confirm.message} onConfirm={() => confirmDelete(confirm.id)} onCancel={() => setConfirm({ open: false })} />
    </div>
  );
};

export default ProductsAdmin;
