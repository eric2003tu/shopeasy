"use client";
import React, { useEffect, useMemo, useState } from 'react';
import { sampleCarts, SampleCart, sampleProducts, SampleCartItem } from '@/lib/sampleData';
import { useI18n } from '@/i18n/I18nProvider';

const STORAGE_KEY = 'shopeasy_admin_carts_v1';

export default function CartsTable() {
  const [carts, setCarts] = useState<SampleCart[]>(() => {
    try {
      const raw = typeof window !== 'undefined' ? localStorage.getItem(STORAGE_KEY) : null;
      if (raw) return JSON.parse(raw) as SampleCart[];
    } catch {}
    return sampleCarts;
  });

  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('');
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(8);
  const [view, setView] = useState<SampleCart | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<SampleCart | null>(null);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [deleteConfirmInput, setDeleteConfirmInput] = useState('');

  useEffect(() => {
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(carts)); } catch {}
  }, [carts]);
  const { t } = useI18n();

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return carts.filter((c) => {
      if (statusFilter && c.status !== statusFilter) return false;
      if (!q) return true;
      return (c.userId || c.guestEmail || '').toLowerCase().includes(q) || c.id.toLowerCase().includes(q);
    });
  }, [carts, search, statusFilter]);

  const total = filtered.length;
  const pageCount = Math.max(1, Math.ceil(total / pageSize));
  const currentPage = Math.min(page, pageCount);
  const paged = filtered.slice((currentPage - 1) * pageSize, currentPage * pageSize);
  const from = total === 0 ? 0 : (currentPage - 1) * pageSize + 1;
  const to = Math.min(currentPage * pageSize, total);

  function convertToCheckout(cart: SampleCart) {
    // create a checkout object and persist to localStorage checkouts list
    try {
      const raw = localStorage.getItem('shopeasy_admin_checkouts_v1');
      const checkouts = raw ? JSON.parse(raw) : [];
      const checkout = {
        id: `co_${Date.now().toString(36)}`,
        cartId: cart.id,
        userId: cart.userId,
        email: cart.guestEmail,
        items: cart.items,
        total: cart.total,
        paymentStatus: 'pending',
        createdAt: new Date().toISOString().slice(0,10),
      };
      checkouts.unshift(checkout);
      localStorage.setItem('shopeasy_admin_checkouts_v1', JSON.stringify(checkouts));
      // mark cart as converted
      setCarts((prev) => prev.map((c) => c.id === cart.id ? { ...c, status: 'converted' } : c));
      alert('Checkout created from cart');
    } catch {
      alert('Failed to convert cart');
    }
  }

  function openDelete(id: string) {
    const t = carts.find((c) => c.id === id) || null;
    setDeleteTarget(t);
    setDeleteConfirmInput('');
    setDeleteOpen(true);
  }

  function handleConfirmDelete() {
    if (!deleteTarget) return;
    const expected = (deleteTarget.id || '').trim().toLowerCase();
    if (deleteConfirmInput.trim().toLowerCase() !== expected) return;
    setCarts((prev) => prev.filter((c) => c.id !== deleteTarget.id));
    setDeleteTarget(null);
    setDeleteOpen(false);
    setDeleteConfirmInput('');
  }

  function productName(item: SampleCartItem) {
    if (item.productId) {
      const p = sampleProducts.find((x) => x.id === item.productId);
      if (p) return p.name;
    }
    return item.productName;
  }

  const resetSamples = () => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(sampleCarts));
      setCarts(sampleCarts);
      alert('Sample carts loaded');
    } catch {
      alert('Failed to load sample carts');
    }
  };

  return (
    <div className="bg-white rounded-lg shadow p-4">
      <div className="flex items-center justify-between gap-4 mb-4">
        <div className="flex items-center gap-3">
          <input value={search} onChange={(e) => { setSearch(e.target.value); setPage(1); }} placeholder={t('admin.placeholders.searchCheckouts')} className="px-3 py-2 border rounded w-72" />
          <select value={statusFilter} onChange={(e) => { setStatusFilter(e.target.value); setPage(1); }} className="p-2 border rounded">
            <option value="">{t('admin.labels.allStatus')}</option>
            <option value="active">{t('admin.carts.status.active', { defaultValue: 'Active' })}</option>
            <option value="abandoned">{t('admin.carts.status.abandoned', { defaultValue: 'Abandoned' })}</option>
            <option value="converted">{t('admin.carts.status.converted', { defaultValue: 'Converted' })}</option>
          </select>
          <button onClick={resetSamples} className="px-3 py-2 bg-muted rounded text-sm">{t('admin.buttons.resetSampleCarts')}</button>
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
                <td className="px-4 py-3 text-sm">{c.userId || c.guestEmail || t('admin.guest', { defaultValue: 'Guest' })}</td>
                <td className="px-4 py-3 text-sm">{c.items.length}</td>
                <td className="px-4 py-3 text-sm font-semibold">${c.total.toFixed(2)}</td>
                <td className="px-4 py-3 text-sm capitalize">{t(`admin.carts.status.${c.status}`, { defaultValue: c.status })}</td>
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
            <div className="mb-4 text-sm text-muted-foreground">{t('admin.tables.carts.owner')}: {view!.userId || view!.guestEmail || t('admin.guest', { defaultValue: 'Guest' })}</div>
            <div className="divide-y">
              {view!.items.map((it, idx) => (
                <div key={idx} className="py-2 flex justify-between">
                  <div>
                    <div className="font-medium">{productName(it)}</div>
                    <div className="text-sm text-muted-foreground">Qty: {it.quantity}</div>
                  </div>
                  <div className="text-sm font-semibold">${((it.price || 0) * it.quantity).toFixed(2)}</div>
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
              <button disabled={deleteTarget ? deleteConfirmInput.trim().toLowerCase() !== deleteTarget.id.trim().toLowerCase() : true} onClick={handleConfirmDelete} className="px-3 py-1 bg-red-600 text-white rounded disabled:opacity-50">{t('admin.deleteDialog.confirm')}</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
