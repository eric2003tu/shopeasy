"use client";
import React, { useEffect, useState, useMemo } from 'react';
import Image from 'next/image';
import { sampleProducts, SampleProduct } from '@/lib/sampleData';
import ProductForm from './ProductForm';
import * as Dialog from '@radix-ui/react-dialog';

function DialogPortal({ children }: { children: React.ReactNode }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {children}
    </div>
  );
}

function DialogOverlay() {
  return <div className="fixed inset-0 bg-black/40 z-50" />;
}

const STORAGE_KEY = 'shopeasy_admin_products_v1';

export default function ProductsTable() {
  const [products, setProducts] = useState<SampleProduct[]>(() => {
    try {
      const raw = typeof window !== 'undefined' ? localStorage.getItem(STORAGE_KEY) : null;
      if (raw) return JSON.parse(raw) as SampleProduct[];
    } catch {
      // ignore
    }
    return sampleProducts;
  });

  const [editing, setEditing] = useState<SampleProduct | null>(null);
  const [sheetOpen, setSheetOpen] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<SampleProduct | null>(null);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [deleteConfirmInput, setDeleteConfirmInput] = useState('');
  // filtering & pagination
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string>('');
  const [statusFilter, setStatusFilter] = useState<string>(''); // active | funded | completed
  const [priceMin, setPriceMin] = useState<string>('');
  const [priceMax, setPriceMax] = useState<string>('');
  const [stockMin, setStockMin] = useState<string>('');
  const [stockMax, setStockMax] = useState<string>('');

  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(8);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(products));
    } catch {
      // ignore
    }
  }, [products]);

  const categories = useMemo(() => {
    const set = new Set<string>();
    products.forEach((p) => p.category && set.add(p.category));
    return Array.from(set).sort();
  }, [products]);

  const filtered = useMemo(() => {
    const term = searchTerm.trim().toLowerCase();
    return products.filter((p) => {
      if (term) {
        const inText = (p.name + ' ' + (p.description || '')).toLowerCase();
        if (!inText.includes(term)) return false;
      }
      if (categoryFilter && p.category !== categoryFilter) return false;
      if (statusFilter) {
        if (statusFilter === 'active' && (p.funded || p.completed)) return false;
        if (statusFilter === 'funded' && !p.funded) return false;
        if (statusFilter === 'completed' && !p.completed) return false;
      }
      if (priceMin && Number(priceMin) > p.price) return false;
      if (priceMax && Number(priceMax) < p.price) return false;
      if (stockMin && Number(stockMin) > (p.stock || 0)) return false;
      if (stockMax && Number(stockMax) < (p.stock || 0)) return false;
      return true;
    });
  }, [products, searchTerm, categoryFilter, statusFilter, priceMin, priceMax, stockMin, stockMax]);

  const total = filtered.length;
  const pageCount = Math.max(1, Math.ceil(total / pageSize));
  const currentPage = Math.min(page, pageCount);
  const paged = filtered.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  const handleSave = (p: Partial<SampleProduct>) => {
    if (editing) {
      setProducts((prev) => prev.map((x) => (x.id === editing.id ? { ...x, ...(p as SampleProduct) } : x)));
    } else {
      const id = `${Date.now().toString(36)}${Math.random().toString(36).slice(2, 8)}`;
      const newP: SampleProduct = {
        id,
        name: p.name || 'Untitled',
        description: p.description || '',
        price: Number(p.price) || 0,
        images: (p.images as string[]) || ['/placeholder-product.jpg'],
        category: p.category || 'Misc',
        stock: Number(p.stock) || 0,
        funded: false,
        completed: false,
      };
      setProducts((prev) => [newP, ...prev]);
    }
    setEditing(null);
    setSheetOpen(false);
  };

  const handleEdit = (id: string) => {
    const p = products.find((x) => x.id === id);
    if (!p) return;
    setEditing(p);
    setSheetOpen(true);
  };

  const handleDelete = (id: string) => {
    const p = products.find((x) => x.id === id);
    if (!p) return;
    setDeleteTarget(p);
    setDeleteConfirmInput('');
    setDeleteOpen(true);
  };

  const handleConfirmDelete = () => {
    if (!deleteTarget) return;
    const expected = (deleteTarget.name || '').trim().toLowerCase();
    if (deleteConfirmInput.trim().toLowerCase() !== expected) return;
    setProducts((prev) => prev.filter((x) => x.id !== deleteTarget.id));
    setDeleteTarget(null);
    setDeleteOpen(false);
    setDeleteConfirmInput('');
  };

  return (
    <div className="bg-white rounded-lg shadow p-4">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <input value={searchTerm} onChange={(e) => { setSearchTerm(e.target.value); setPage(1); }} placeholder="Search products" className="px-3 py-2 border rounded w-64" />
          <select value={categoryFilter} onChange={(e) => { setCategoryFilter(e.target.value); setPage(1); }} className="p-2 border rounded">
            <option value="">All categories</option>
            {categories.map((c) => <option key={c} value={c}>{c}</option>)}
          </select>
          <select value={statusFilter} onChange={(e) => { setStatusFilter(e.target.value); setPage(1); }} className="p-2 border rounded">
            <option value="">All status</option>
            <option value="active">Active</option>
            <option value="funded">Funded</option>
            <option value="completed">Completed</option>
          </select>
        </div>
        <div className="flex items-center gap-2">
            <Dialog.Root open={sheetOpen} onOpenChange={setSheetOpen}>
              <Dialog.Trigger asChild>
                <button className="px-3 py-1 bg-[#634bc1] text-white rounded hover:opacity-95 text-sm">Add product</button>
              </Dialog.Trigger>
              <Dialog.Portal>
                <DialogOverlay />
                <DialogPortal>
                  <Dialog.Content className="w-full max-w-xl bg-card rounded shadow-lg">
                    <div className="p-4">
                      <h3 className="text-lg font-semibold mb-2">{editing ? 'Edit product' : 'Add product'}</h3>
                      <ProductForm
                        initial={editing ? { _id: editing.id, name: editing.name, description: editing.description, price: editing.price, images: editing.images, category: editing.category, stock: editing.stock, featured: false } : undefined}
                        onSave={(prod) => handleSave({
                          name: prod.name,
                          description: prod.description,
                          price: prod.price,
                          images: prod.images,
                          category: prod.category,
                          stock: prod.stock,
                        })}
                        onCancel={() => {
                          setEditing(null);
                          setSheetOpen(false);
                        }}
                      />
                    </div>
                    <Dialog.Close asChild>
                      <button className="absolute top-3 right-3 text-gray-500">✕</button>
                    </Dialog.Close>
                  </Dialog.Content>
                </DialogPortal>
              </Dialog.Portal>
            </Dialog.Root>
          </div>
      </div>

      <div className="overflow-x-auto">
        <div className="flex items-center justify-between px-2 py-3">
          <div className="text-sm text-gray-600">Showing <strong>{(currentPage - 1) * pageSize + 1}</strong> - <strong>{Math.min(currentPage * pageSize, total)}</strong> of <strong>{total}</strong></div>
          <div className="flex items-center gap-2">
            <div>
              <label className="text-xs">Page size</label>
              <select value={pageSize} onChange={(e) => { setPageSize(Number(e.target.value)); setPage(1); }} className="ml-2 p-1 border rounded">
                <option value={5}>5</option>
                <option value={8}>8</option>
                <option value={12}>12</option>
                <option value={20}>20</option>
              </select>
            </div>
            <div className="inline-flex items-center gap-1">
              <button onClick={() => setPage((p) => Math.max(1, p - 1))} className="px-2 py-1 border rounded">Prev</button>
              <span className="px-2 text-sm">{currentPage} / {pageCount}</span>
              <button onClick={() => setPage((p) => Math.min(pageCount, p + 1))} className="px-2 py-1 border rounded">Next</button>
            </div>
          </div>
        </div>
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Product</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Price</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Stock</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {paged.map((p) => (
              <tr key={p.id} className="hover:bg-gray-50 transition-colors">
                <td className="px-6 py-4 whitespace-nowrap flex items-center gap-4">
                  <div className="h-12 w-12 relative rounded overflow-hidden bg-gray-100">
                    <Image src={p.images[0] || '/placeholder-product.jpg'} alt={p.name} fill className="object-contain" sizes="48px" />
                  </div>
                  <div>
                    <div className="text-sm font-medium text-gray-900">{p.name}</div>
                    <div className="text-xs text-gray-500">{p.description}</div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{p.category}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-semibold">${p.price.toFixed(2)}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm">{p.stock}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm">
                  {p.completed ? <span className="text-green-600">Completed</span> : p.funded ? <span className="text-yellow-600">Funded</span> : <span className="text-gray-600">Active</span>}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right">
                  <div className="inline-flex gap-2">
                    <button onClick={() => handleEdit(p.id)} className="px-3 py-1 bg-[#634bc1] text-white rounded hover:opacity-90 text-sm">Edit</button>
                    <button onClick={() => handleDelete(p.id)} className="px-3 py-1 border border-red-300 text-red-600 rounded hover:bg-red-50 text-sm">Delete</button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {/* Delete confirmation dialog */}
      <DeleteDialog open={deleteOpen} onOpenChange={setDeleteOpen} target={deleteTarget} value={deleteConfirmInput} setValue={setDeleteConfirmInput} onConfirm={handleConfirmDelete} />
    </div>
  );
}

// Delete confirmation dialog component is rendered inside the file so it can access state
function DeleteDialog({ open, onOpenChange, target, value, setValue, onConfirm }: {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  target: SampleProduct | null;
  value: string;
  setValue: (v: string) => void;
  onConfirm: () => void;
}) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="fixed inset-0 bg-black/50" onClick={() => onOpenChange(false)} />
      <div className="relative z-60 w-full max-w-md bg-white rounded shadow-lg p-6">
        <h3 className="text-lg font-semibold">Confirm deletion</h3>
        <p className="text-sm text-gray-600 mt-2">Type <strong className="font-medium">{target?.name}</strong> below to confirm deletion. This action cannot be undone.</p>
        <input className="w-full mt-4 p-2 border rounded" value={value} onChange={(e) => setValue(e.target.value)} placeholder="Type product name to confirm" />
        <div className="mt-4 flex justify-end gap-2">
          <button onClick={() => onOpenChange(false)} className="px-3 py-1 bg-muted rounded">Cancel</button>
          <button disabled={target ? value.trim().toLowerCase() !== target.name.trim().toLowerCase() : true} onClick={onConfirm} className="px-3 py-1 bg-red-600 text-white rounded disabled:opacity-50">Delete</button>
        </div>
      </div>
    </div>
  );
}
