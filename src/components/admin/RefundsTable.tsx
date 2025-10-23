"use client";
import React, { useMemo, useState } from 'react';
import VoiceSearchBar from './VoiceSearchBar';
import * as Dialog from '@radix-ui/react-dialog';
import { sampleRefunds, SampleRefund } from '@/lib/sampleData';
import { useI18n } from '@/i18n/I18nProvider';

export default function RefundsTable() {
  const { t } = useI18n();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('');
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(8);

  const filtered = useMemo(() => {
    const term = searchTerm.trim().toLowerCase();
    return sampleRefunds.filter((r) => {
      if (term) {
        const hay = `${r.orderId} ${r.productName || ''} ${r.userName} ${r.reason || ''}`.toLowerCase();
        if (!hay.includes(term)) return false;
      }
      if (statusFilter && r.status !== statusFilter) return false;
      return true;
    });
  }, [searchTerm, statusFilter]);

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
            placeholder={t('admin.placeholders.searchRefunds') || 'Search refunds'}
          />
          <select value={statusFilter} onChange={(e) => { setStatusFilter(e.target.value); setPage(1); }} className="p-2 border rounded">
            <option value="">{t('admin.labels.allStatus')}</option>
            <option value="pending">{t('admin.refunds.status.pending')}</option>
            <option value="approved">{t('admin.refunds.status.approved')}</option>
            <option value="rejected">{t('admin.refunds.status.rejected')}</option>
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
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">{t('admin.tables.refunds.order')}</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">{t('admin.tables.refunds.product')}</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">{t('admin.tables.refunds.user')}</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">{t('admin.tables.refunds.amount')}</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">{t('admin.tables.refunds.reason')}</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">{t('admin.tables.refunds.status')}</th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">{t('admin.tables.refunds.actions')}</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {paged.map((r: SampleRefund) => (
              <tr key={r.id} className="hover:bg-gray-50 transition-colors">
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{r.orderId}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{r.productName}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{r.userName}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-semibold">${r.amount.toFixed(2)}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{r.reason}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm">
                  {r.status === 'approved' ? <span className="text-green-600">{t('admin.refunds.status.approved')}</span> : r.status === 'rejected' ? <span className="text-red-600">{t('admin.refunds.status.rejected')}</span> : <span className="text-yellow-600">{t('admin.refunds.status.pending')}</span>}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right">
                  <div className="inline-flex gap-2">
                    <ViewButton refund={r} />
                    <button className="px-3 py-1 border border-red-300 text-red-600 rounded hover:bg-red-50 text-sm">{t('admin.refunds.actions.resolve')}</button>
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

// DialogPortal helper removed; we use Dialog.Portal directly where needed.

function DialogOverlay() {
  return <div className="fixed inset-0 bg-black/40 z-40" />;
}

function ViewButton({ refund }: { refund: SampleRefund }) {
  const { t } = useI18n();
  const [open, setOpen] = useState(false);

  return (
    <Dialog.Root open={open} onOpenChange={setOpen}>
      <Dialog.Trigger asChild>
        <button onClick={() => setOpen(true)} className="px-3 py-1 bg-[#634bc1] text-white rounded hover:opacity-90 text-sm">{t('admin.buttons.view')}</button>
      </Dialog.Trigger>

      <Dialog.Portal>
        <DialogOverlay />
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="w-full max-w-lg bg-card rounded-lg shadow-lg p-6">
            <div className="flex items-start justify-between gap-4">
              <div>
                <h3 className="text-lg font-semibold">{t('admin.refunds.dialog.title')}</h3>
                <p className="text-sm text-gray-500">{t('admin.refunds.dialog.id')}: {refund.id}</p>
              </div>
              <Dialog.Close asChild>
                <button className="text-gray-500 hover:text-gray-700">{t('admin.buttons.close')}</button>
              </Dialog.Close>
            </div>

            <div className="mt-4 grid grid-cols-2 gap-3">
              <div className="text-xs text-gray-500">{t('admin.refunds.fields.order')}</div>
              <div className="font-medium">{refund.orderId}</div>

              <div className="text-xs text-gray-500">{t('admin.refunds.fields.product')}</div>
              <div className="font-medium">{refund.productName}</div>

              <div className="text-xs text-gray-500">{t('admin.refunds.fields.customer')}</div>
              <div className="font-medium">{refund.userName}</div>

              <div className="text-xs text-gray-500">{t('admin.refunds.fields.amount')}</div>
              <div className="font-medium">${refund.amount.toFixed(2)}</div>

              <div className="text-xs text-gray-500">{t('admin.refunds.fields.status')}</div>
              <div className="font-medium capitalize">{t(`admin.refunds.status.${refund.status}`)}</div>

              <div className="text-xs text-gray-500">{t('admin.refunds.fields.created')}</div>
              <div className="font-medium">{refund.createdAt}</div>

              <div className="text-xs text-gray-500">{t('admin.refunds.fields.reason')}</div>
              <div className="font-medium">{refund.reason}</div>
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
