"use client";
import React, { useMemo, useState } from 'react';
import VoiceSearchBar from './VoiceSearchBar';
import * as Dialog from '@radix-ui/react-dialog';
import { samplePayments, SamplePayment } from '@/lib/sampleData';
import { useI18n } from '@/i18n/I18nProvider';

export default function PaymentsTable() {
  const { t } = useI18n();
  const [searchTerm, setSearchTerm] = useState('');
  const [gatewayFilter, setGatewayFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(8);

  const filtered = useMemo(() => {
    const term = searchTerm.trim().toLowerCase();
    return samplePayments.filter((p) => {
      if (term) {
        const hay = `${p.orderId} ${p.transactionId} ${p.userName} ${p.gateway}`.toLowerCase();
        if (!hay.includes(term)) return false;
      }
      if (gatewayFilter && p.gateway !== gatewayFilter) return false;
      if (statusFilter && p.status !== statusFilter) return false;
      return true;
    });
  }, [searchTerm, gatewayFilter, statusFilter]);

  const total = filtered.length;
  const pageCount = Math.max(1, Math.ceil(total / pageSize));
  const currentPage = Math.min(page, pageCount);
  const paged = filtered.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  const from = total === 0 ? 0 : (currentPage - 1) * pageSize + 1;
  const to = Math.min(currentPage * pageSize, total);

  return (
    <div className="bg-white rounded-lg shadow p-4">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <VoiceSearchBar
            value={searchTerm}
            onChange={(val) => { setSearchTerm(val); setPage(1); }}
            placeholder={t('admin.placeholders.searchPayments') || 'Search payments'}
          />
          <select value={gatewayFilter} onChange={(e) => { setGatewayFilter(e.target.value); setPage(1); }} className="p-2 border rounded">
            <option value="">{t('admin.labels.allGateways') || 'All gateways'}</option>
            <option value="Stripe">Stripe</option>
            <option value="PayPal">PayPal</option>
            <option value="M-Pesa">M-Pesa</option>
            <option value="Manual">Manual</option>
          </select>
          <select value={statusFilter} onChange={(e) => { setStatusFilter(e.target.value); setPage(1); }} className="p-2 border rounded">
            <option value="">{t('admin.labels.allStatus')}</option>
            <option value="completed">{t('admin.payments.status.completed') || 'Completed'}</option>
            <option value="pending">{t('admin.payments.status.pending') || 'Pending'}</option>
            <option value="failed">{t('admin.payments.status.failed') || 'Failed'}</option>
            <option value="refunded">{t('admin.payments.status.refunded') || 'Refunded'}</option>
          </select>
        </div>
        <div className="flex items-center gap-2">
          <div className="text-sm text-gray-600">{t('admin.pagination.showing', { from, to, total })}</div>
          <div className="flex items-center gap-2">
            <label className="text-xs">{t('admin.pagination.pageSize')}</label>
            <select value={pageSize} onChange={(e) => { setPageSize(Number(e.target.value)); setPage(1); }} className="ml-2 p-1 border rounded">
              <option value={5}>5</option>
              <option value={8}>8</option>
              <option value={12}>12</option>
            </select>
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
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">{t('admin.tables.payments.order')}</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">{t('admin.tables.payments.items')}</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">{t('admin.tables.payments.transaction')}</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">{t('admin.tables.payments.user')}</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">{t('admin.tables.payments.gateway')}</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">{t('admin.tables.payments.amount')}</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">{t('admin.tables.payments.status')}</th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">{t('admin.tables.payments.actions')}</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {paged.map((p: SamplePayment) => (
              <tr key={p.id} className="hover:bg-gray-50 transition-colors">
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{p.orderId}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                  {p.items && p.items.length > 0 ? (
                    p.items.length === 1 ? `${p.items[0].productName} × ${p.items[0].quantity}` : `${p.items[0].productName} × ${p.items[0].quantity} + ${p.items.length - 1} more`
                  ) : <span className="text-gray-500">—</span>}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{p.transactionId}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{p.userName}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{p.gateway}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-semibold">${p.amount.toFixed(2)}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm">
                  {p.status === 'completed' ? <span className="text-green-600">{t('admin.payments.status.completed')}</span> : p.status === 'failed' ? <span className="text-red-600">{t('admin.payments.status.failed')}</span> : p.status === 'refunded' ? <span className="text-yellow-600">{t('admin.payments.status.refunded')}</span> : <span className="text-yellow-600">{t('admin.payments.status.pending')}</span>}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right">
                  <div className="inline-flex gap-2">
                    <PaymentViewButton payment={p} />
                    <button className="px-3 py-1 border border-gray-300 text-gray-700 rounded hover:bg-gray-50 text-sm">{t('admin.payments.actions.reconcile') || 'Reconcile'}</button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function PaymentOverlay() {
  return <div className="fixed inset-0 bg-black/40 z-40" />;
}

function PaymentViewButton({ payment }: { payment: SamplePayment }) {
  const [open, setOpen] = useState(false);
  const { t } = useI18n();

  return (
    <Dialog.Root open={open} onOpenChange={setOpen}>
      <Dialog.Trigger asChild>
  <button onClick={() => setOpen(true)} className="px-3 py-1 bg-[#634bc1] text-white rounded hover:opacity-90 text-sm">{t('admin.buttons.view')}</button>
      </Dialog.Trigger>

      <Dialog.Portal>
        <PaymentOverlay />
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="w-full max-w-lg bg-card rounded-lg shadow-lg p-6">
            <div className="flex items-start justify-between gap-4">
              <div>
                <h3 className="text-lg font-semibold">{t('admin.payments.dialog.title') || 'Payment details'}</h3>
                <p className="text-sm text-gray-500">{t('admin.payments.dialog.id') || 'Payment ID'}: {payment.id}</p>
              </div>
              <Dialog.Close asChild>
                <button className="text-gray-500 hover:text-gray-700">{t('admin.buttons.close')}</button>
              </Dialog.Close>
            </div>

            <div className="mt-4 grid grid-cols-2 gap-3">
              <div className="text-xs text-gray-500">{t('admin.payments.fields.order')}</div>
              <div className="font-medium">{payment.orderId}</div>

              <div className="text-xs text-gray-500">{t('admin.payments.fields.transaction')}</div>
              <div className="font-medium">{payment.transactionId}</div>

              <div className="text-xs text-gray-500">{t('admin.payments.fields.customer')}</div>
              <div className="font-medium">{payment.userName}</div>

              <div className="text-xs text-gray-500">{t('admin.payments.fields.gateway')}</div>
              <div className="font-medium">{payment.gateway}</div>

              <div className="text-xs text-gray-500">{t('admin.payments.fields.amount')}</div>
              <div className="font-medium">${payment.amount.toFixed(2)}</div>

              <div className="text-xs text-gray-500">{t('admin.payments.fields.status')}</div>
              <div className="font-medium capitalize">{payment.status}</div>

              <div className="text-xs text-gray-500">{t('admin.payments.fields.created')}</div>
              <div className="font-medium">{payment.createdAt}</div>
            </div>

            <div className="mt-4">
              <h4 className="text-sm font-medium">{t('admin.payments.items.title') || 'Items'}</h4>
              <ul className="mt-2 space-y-2">
                {payment.items && payment.items.length > 0 ? payment.items.map((it, idx) => (
                  <li key={idx} className="flex justify-between text-sm">
                    <span>{it.productName}{it.productId ? ` (${it.productId})` : ''} × {it.quantity}</span>
                    <span className="font-medium">{it.price ? `$${it.price.toFixed(2)}` : ''}</span>
                  </li>
                )) : <li className="text-sm text-gray-500">{t('admin.payments.items.none') || 'No items'}</li>}
              </ul>
            </div>

            <div className="mt-6 text-right">
              <Dialog.Close asChild>
                <button className="px-4 py-2 bg-gray-100 rounded">{t('admin.buttons.close')}</button>
              </Dialog.Close>
            </div>
          </div>
        </div>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
