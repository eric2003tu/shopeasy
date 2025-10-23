"use client";
import React, { useEffect, useMemo, useState } from 'react';
import VoiceSearchBar from './VoiceSearchBar';
import { useI18n } from '@/i18n/I18nProvider';
import { useToast } from '@/context/ToastProvider';

export default function CartsTable() {
  type CartProduct = {
    id: number | string;
    title?: string;
    price?: number;
    quantity?: number;
    total?: number;
    thumbnail?: string;
  };

  type Cart = {
    id: number | string;
    products: CartProduct[];
    total?: number;
    discountedTotal?: number;
    userId?: number | string;
    totalProducts?: number;
    totalQuantity?: number;
  };

  const [carts, setCarts] = useState<Cart[]>([]);

  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(8);
  const [view, setView] = useState<Cart | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<Cart | null>(null);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [deleteConfirmInput, setDeleteConfirmInput] = useState('');

  useEffect(() => {
    // fetch carts from dummyjson
    let mounted = true;
    (async () => {
      try {
        const res = await fetch('https://dummyjson.com/carts?limit=1000');
        if (!res.ok) return;
        const data = await res.json();
        const list = Array.isArray(data?.carts) ? data.carts : [];
        if (mounted) setCarts(list as Cart[]);
      } catch {
        // ignore fetch errors for now
        // console.debug('Failed to fetch carts');
      }
    })();
    return () => { mounted = false; };
  }, []);
  const { t } = useI18n();
  const { toast } = useToast();

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return carts.filter((c) => {
      // dummyjson carts don't include a 'status' field; keep simple filters
      if (!q) return true;
      const owner = String(c.userId || '');
      return owner.toLowerCase().includes(q) || String(c.id).toLowerCase().includes(q);
    });
  }, [carts, search]);

  const total = filtered.length;
  const pageCount = Math.max(1, Math.ceil(total / pageSize));
  const currentPage = Math.min(page, pageCount);
  const paged = filtered.slice((currentPage - 1) * pageSize, currentPage * pageSize);
  const from = total === 0 ? 0 : (currentPage - 1) * pageSize + 1;
  const to = Math.min(currentPage * pageSize, total);

  function convertToCheckout(cart: Cart) {
    // create a checkout object (in-memory only, no localStorage persistence)
    const checkout = {
      id: `co_${Date.now().toString(36)}`,
      cartId: cart.id,
      userId: cart.userId,
      email: undefined,
      items: cart.products,
      total: cart.total,
      paymentStatus: 'pending',
      createdAt: new Date().toISOString().slice(0,10),
    };
    // mark cart as converted in-memory
    setCarts((prev) => prev.map((c) => c.id === cart.id ? { ...c, status: 'converted' } : c));
    toast({ title: 'Checkout created', description: 'Checkout created from cart (in-memory)', type: 'success' });
  }

  function openDelete(id: string | number) {
    const t = carts.find((c) => String(c.id) === String(id)) || null;
    setDeleteTarget(t);
    setDeleteConfirmInput('');
    setDeleteOpen(true);
  }

  function handleConfirmDelete() {
    if (!deleteTarget) return;
    const expected = String(deleteTarget.id).trim().toLowerCase();
    if (deleteConfirmInput.trim().toLowerCase() !== expected) return;
    setCarts((prev) => prev.filter((c) => String(c.id) !== String(deleteTarget.id)));
    setDeleteTarget(null);
    setDeleteOpen(false);
    setDeleteConfirmInput('');
  }

  function productName(item: CartProduct | { productName?: string }) {
    if ('productName' in item && typeof item.productName === 'string' && item.productName) return item.productName;
    if ('title' in item && typeof item.title === 'string' && item.title) return item.title;
  if ('id' in item) return String((item as CartProduct).id || '');
    return '';
  }

  // Removed resetSamples/localStorage persistence for carts; carts are fetched from dummyjson

  return (
    <div className="bg-white rounded-lg shadow p-4">
      <div className="flex items-center justify-between gap-4 mb-4">
        <div className="flex items-center gap-3">
          <VoiceSearchBar
            value={search}
            onChange={(val) => { setSearch(val); setPage(1); }}
            placeholder={t('admin.placeholders.searchCheckouts')}
          />
          {/* Removed className prop */}
          {/* status filter removed (dummyjson carts have no status) */}
        </div>

        <div className="flex items-center gap-3">
          <div className="text-sm text-gray-600">{t('admin.pagination.showing', { from, to, total })}</div>
          <div>
            <label className="text-xs">{t('admin.pagination.pageSize')}</label>
            <select value={pageSize} onChange={(e) => { setPageSize(Number(e.target.value)); setPage(1); }} className="ml-2 p-1 border rounded">
              <option value={5}>5</option>
              <option value={8}>8</option>
              <option value={12}>12</option>
              <option value={20}>20</option>
            </select>
          </div>
          <div className="inline-flex items-center gap-1">
            <button onClick={() => setPage((p) => Math.max(1, p - 1))} className="px-2 py-1 border rounded">{t('admin.pagination.prev')}</button>
            <span className="px-2 text-sm">{currentPage} / {pageCount}</span>
            <button onClick={() => setPage((p) => Math.min(pageCount, p + 1))} className="px-2 py-1 border rounded">{t('admin.pagination.next')}</button>
          </div>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">{t('admin.tables.carts.cart')}</th>
              <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">{t('admin.tables.carts.owner')}</th>
              <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">{t('admin.tables.carts.items')}</th>
              <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">{t('admin.tables.carts.total')}</th>
              <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">{t('admin.tables.carts.status')}</th>
              <th className="px-4 py-2 text-right text-xs font-medium text-gray-500 uppercase">{t('admin.tables.carts.actions')}</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {paged.map((c) => (
              <tr key={c.id} className="hover:bg-gray-50">
                <td className="px-4 py-3 text-sm font-medium">{c.id}</td>
                <td className="px-4 py-3 text-sm">{c.userId ?? t('admin.guest', { defaultValue: 'Guest' })}</td>
                <td className="px-4 py-3 text-sm">{(c.products || []).length}</td>
                <td className="px-4 py-3 text-sm font-semibold">${Number(c.total || 0).toFixed(2)}</td>
                <td className="px-4 py-3 text-sm capitalize">-</td>
                <td className="px-4 py-3 text-right">
                  <div className="inline-flex gap-2">
                    <button onClick={() => setView(c)} className="px-3 py-1 bg-[#634bc1] text-white rounded text-sm">{t('admin.buttons.view')}</button>
                    <button onClick={() => convertToCheckout(c)} className="px-3 py-1 bg-green-600 text-white rounded text-sm">{t('admin.buttons.convertToCheckout')}</button>
                    <button onClick={() => openDelete(c.id)} className="px-3 py-1 border border-red-300 text-red-600 rounded text-sm">{t('admin.buttons.delete')}</button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* pagination and filters above the table (moved) */}

      {view && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="fixed inset-0 bg-black/50" onClick={() => setView(null)} />
          <div className="relative z-60 w-full max-w-2xl bg-card rounded shadow-lg p-6">
            <h3 className="text-lg font-semibold mb-2">{t('admin.tables.carts.cart')} {view!.id}</h3>
            <div className="mb-4 text-sm text-muted-foreground">{t('admin.tables.carts.owner')}: {view!.userId ?? t('admin.guest', { defaultValue: 'Guest' })}</div>
            <div className="divide-y">
              {(view!.products || []).map((it, idx) => (
                <div key={idx} className="py-2 flex justify-between">
                  <div>
                    <div className="font-medium">{productName(it)}</div>
                    <div className="text-sm text-muted-foreground">Qty: {it.quantity}</div>
                  </div>
                  <div className="text-sm font-semibold">${((it.price || 0) * (it.quantity || 0)).toFixed(2)}</div>
                </div>
              ))}
            </div>
            <div className="mt-4 flex justify-end gap-3">
                    <button onClick={() => { convertToCheckout(view!); setView(null); }} className="px-3 py-1 bg-green-600 text-white rounded">{t('admin.buttons.convertToCheckout')}</button>
              <button onClick={() => setView(null)} className="px-3 py-1 bg-muted rounded">{t('admin.deleteDialog.cancel')}</button>
            </div>
          </div>
        </div>
      )}

      {/* Delete confirmation dialog */}
      {deleteOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="fixed inset-0 bg-black/50" onClick={() => setDeleteOpen(false)} />
          <div className="relative z-60 w-full max-w-md bg-white rounded shadow-lg p-6">
            <h3 className="text-lg font-semibold">{t('admin.deleteDialog.title')}</h3>
            <p className="text-sm text-gray-600 mt-2">{t('admin.deleteDialog.body', { target: deleteTarget?.id ?? '' })}</p>
            <input className="w-full mt-4 p-2 border rounded" value={deleteConfirmInput} onChange={(e) => setDeleteConfirmInput(e.target.value)} placeholder={t('admin.placeholders.typeCartConfirm')} />
            <div className="mt-4 flex justify-end gap-2">
              <button onClick={() => setDeleteOpen(false)} className="px-3 py-1 bg-muted rounded">{t('admin.deleteDialog.cancel')}</button>
              <button disabled={deleteTarget ? deleteConfirmInput.trim().toLowerCase() !== String(deleteTarget.id).trim().toLowerCase() : true} onClick={handleConfirmDelete} className="px-3 py-1 bg-red-600 text-white rounded disabled:opacity-50">{t('admin.deleteDialog.confirm')}</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
