"use client";
import React, { useMemo, useState } from 'react';
import * as Dialog from '@radix-ui/react-dialog';
import { sampleRefunds, SampleRefund } from '@/lib/sampleData';

export default function RefundsTable() {
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

  return (
    <div className="bg-white rounded-lg shadow p-4">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <input value={searchTerm} onChange={(e) => { setSearchTerm(e.target.value); setPage(1); }} placeholder="Search refunds" className="px-3 py-2 border rounded w-64" />
          <select value={statusFilter} onChange={(e) => { setStatusFilter(e.target.value); setPage(1); }} className="p-2 border rounded">
            <option value="">All status</option>
            <option value="pending">Pending</option>
            <option value="approved">Approved</option>
            <option value="rejected">Rejected</option>
          </select>
        </div>
        <div className="flex items-center gap-2">
          <div className="text-sm text-gray-600">Showing <strong>{(currentPage - 1) * pageSize + 1}</strong> - <strong>{Math.min(currentPage * pageSize, total)}</strong> of <strong>{total}</strong></div>
          <div className="flex items-center gap-2">
            <label className="text-xs">Page size</label>
            <select value={pageSize} onChange={(e) => { setPageSize(Number(e.target.value)); setPage(1); }} className="ml-2 p-1 border rounded">
              <option value={5}>5</option>
              <option value={8}>8</option>
              <option value={12}>12</option>
            </select>
            <button onClick={() => setPage((p) => Math.max(1, p - 1))} className="px-2 py-1 border rounded">Prev</button>
            <span className="px-2 text-sm">{currentPage} / {pageCount}</span>
            <button onClick={() => setPage((p) => Math.min(pageCount, p + 1))} className="px-2 py-1 border rounded">Next</button>
          </div>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Order</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Product</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">User</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Reason</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
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
                  {r.status === 'approved' ? <span className="text-green-600">Approved</span> : r.status === 'rejected' ? <span className="text-red-600">Rejected</span> : <span className="text-yellow-600">Pending</span>}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right">
                  <div className="inline-flex gap-2">
                    <ViewButton refund={r} />
                    <button className="px-3 py-1 border border-red-300 text-red-600 rounded hover:bg-red-50 text-sm">Resolve</button>
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

function DialogPortal({ children }: { children: React.ReactNode }) {
  return (
    <Dialog.Portal>
      {children}
    </Dialog.Portal>
  );
}

function DialogOverlay() {
  return <div className="fixed inset-0 bg-black/40 z-40" />;
}

function ViewButton({ refund }: { refund: SampleRefund }) {
  const [open, setOpen] = useState(false);

  return (
    <Dialog.Root open={open} onOpenChange={setOpen}>
      <Dialog.Trigger asChild>
        <button onClick={() => setOpen(true)} className="px-3 py-1 bg-[#634bc1] text-white rounded hover:opacity-90 text-sm">View</button>
      </Dialog.Trigger>

      <Dialog.Portal>
        <DialogOverlay />
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="w-full max-w-lg bg-card rounded-lg shadow-lg p-6">
            <div className="flex items-start justify-between gap-4">
              <div>
                <h3 className="text-lg font-semibold">Refund details</h3>
                <p className="text-sm text-gray-500">Refund ID: {refund.id}</p>
              </div>
              <Dialog.Close asChild>
                <button className="text-gray-500 hover:text-gray-700">Close</button>
              </Dialog.Close>
            </div>

            <div className="mt-4 grid grid-cols-2 gap-3">
              <div className="text-xs text-gray-500">Order ID</div>
              <div className="font-medium">{refund.orderId}</div>

              <div className="text-xs text-gray-500">Product</div>
              <div className="font-medium">{refund.productName}</div>

              <div className="text-xs text-gray-500">Customer</div>
              <div className="font-medium">{refund.userName}</div>

              <div className="text-xs text-gray-500">Amount</div>
              <div className="font-medium">${refund.amount.toFixed(2)}</div>

              <div className="text-xs text-gray-500">Status</div>
              <div className="font-medium capitalize">{refund.status}</div>

              <div className="text-xs text-gray-500">Created</div>
              <div className="font-medium">{refund.createdAt}</div>

              <div className="text-xs text-gray-500">Reason</div>
              <div className="font-medium">{refund.reason}</div>
            </div>

            <div className="mt-6 text-right">
              <Dialog.Close asChild>
                <button className="px-4 py-2 bg-gray-100 rounded">Close</button>
              </Dialog.Close>
            </div>
          </div>
        </div>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
