"use client";
import React, { useMemo, useState } from 'react';
import * as Dialog from '@radix-ui/react-dialog';
import { samplePayments, SamplePayment } from '@/lib/sampleData';

export default function PaymentsTable() {
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

  return (
    <div className="bg-white rounded-lg shadow p-4">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <input value={searchTerm} onChange={(e) => { setSearchTerm(e.target.value); setPage(1); }} placeholder="Search payments" className="px-3 py-2 border rounded w-64" />
          <select value={gatewayFilter} onChange={(e) => { setGatewayFilter(e.target.value); setPage(1); }} className="p-2 border rounded">
            <option value="">All gateways</option>
            <option value="Stripe">Stripe</option>
            <option value="PayPal">PayPal</option>
            <option value="M-Pesa">M-Pesa</option>
            <option value="Manual">Manual</option>
          </select>
          <select value={statusFilter} onChange={(e) => { setStatusFilter(e.target.value); setPage(1); }} className="p-2 border rounded">
            <option value="">All status</option>
            <option value="completed">Completed</option>
            <option value="pending">Pending</option>
            <option value="failed">Failed</option>
            <option value="refunded">Refunded</option>
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
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Items</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Transaction</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">User</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Gateway</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
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
                  {p.status === 'completed' ? <span className="text-green-600">Completed</span> : p.status === 'failed' ? <span className="text-red-600">Failed</span> : p.status === 'refunded' ? <span className="text-yellow-600">Refunded</span> : <span className="text-yellow-600">Pending</span>}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right">
                  <div className="inline-flex gap-2">
                    <PaymentViewButton payment={p} />
                    <button className="px-3 py-1 border border-gray-300 text-gray-700 rounded hover:bg-gray-50 text-sm">Reconcile</button>
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

  return (
    <Dialog.Root open={open} onOpenChange={setOpen}>
      <Dialog.Trigger asChild>
        <button onClick={() => setOpen(true)} className="px-3 py-1 bg-[#634bc1] text-white rounded hover:opacity-90 text-sm">View</button>
      </Dialog.Trigger>

      <Dialog.Portal>
        <PaymentOverlay />
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="w-full max-w-lg bg-card rounded-lg shadow-lg p-6">
            <div className="flex items-start justify-between gap-4">
              <div>
                <h3 className="text-lg font-semibold">Payment details</h3>
                <p className="text-sm text-gray-500">Payment ID: {payment.id}</p>
              </div>
              <Dialog.Close asChild>
                <button className="text-gray-500 hover:text-gray-700">Close</button>
              </Dialog.Close>
            </div>

            <div className="mt-4 grid grid-cols-2 gap-3">
              <div className="text-xs text-gray-500">Order ID</div>
              <div className="font-medium">{payment.orderId}</div>

              <div className="text-xs text-gray-500">Transaction ID</div>
              <div className="font-medium">{payment.transactionId}</div>

              <div className="text-xs text-gray-500">Customer</div>
              <div className="font-medium">{payment.userName}</div>

              <div className="text-xs text-gray-500">Gateway</div>
              <div className="font-medium">{payment.gateway}</div>

              <div className="text-xs text-gray-500">Amount</div>
              <div className="font-medium">${payment.amount.toFixed(2)}</div>

              <div className="text-xs text-gray-500">Status</div>
              <div className="font-medium capitalize">{payment.status}</div>

              <div className="text-xs text-gray-500">Created</div>
              <div className="font-medium">{payment.createdAt}</div>
            </div>

            <div className="mt-4">
              <h4 className="text-sm font-medium">Items</h4>
              <ul className="mt-2 space-y-2">
                {payment.items && payment.items.length > 0 ? payment.items.map((it, idx) => (
                  <li key={idx} className="flex justify-between text-sm">
                    <span>{it.productName}{it.productId ? ` (${it.productId})` : ''} × {it.quantity}</span>
                    <span className="font-medium">{it.price ? `$${it.price.toFixed(2)}` : ''}</span>
                  </li>
                )) : <li className="text-sm text-gray-500">No items</li>}
              </ul>
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
