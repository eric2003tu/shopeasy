"use client";
import React, { useEffect, useMemo, useState } from 'react';
import VoiceSearchBar from './VoiceSearchBar';
import * as Dialog from '@radix-ui/react-dialog';
import { useI18n } from '@/i18n/I18nProvider';
// comments will be sourced from https://dummyjson.com/comments
// map the dummyjson shape to the table's expected Comment shape below

type AdminComment = {
  id: number | string;
  productName: string;
  userName: string;
  rating: number;
  comment: string;
  status: 'published' | 'pending' | 'hidden' | string;
  createdAt?: string;
};

type DummyComment = {
  id: number;
  body?: string;
  postId?: number;
  likes?: number;
  user?: { id?: number; username?: string; fullName?: string };
};

export default function CommentsTable() {
  const { t } = useI18n();
  // avoid colliding with the DOM `Comment` type
  const [comments, setComments] = useState<AdminComment[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('');
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(8);

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const res = await fetch('https://dummyjson.com/comments?limit=1000');
        if (!res.ok) return;
        const data = await res.json();
        const list = Array.isArray(data?.comments) ? data.comments : [];
        const mapped = list.map((c: DummyComment) => ({
          id: c.id,
          productName: `Post ${c.postId}`,
          userName: (c.user && (c.user.fullName || c.user.username)) || `User ${c.user?.id || ''}`,
          rating: Math.min(5, Math.max(1, Math.round((c.likes || 0) / 2))) || 3,
          comment: c.body || '',
          status: 'published',
          createdAt: new Date().toISOString().slice(0, 10),
        } as AdminComment));
        if (mounted) setComments(mapped);
      } catch {
        // ignore
      }
    })();
    return () => { mounted = false; };
  }, []);

  const filtered = useMemo(() => {
    const term = searchTerm.trim().toLowerCase();
    return comments.filter((c) => {
      if (term) {
        const hay = `${c.productName || ''} ${c.userName} ${c.comment}`.toLowerCase();
        if (!hay.includes(term)) return false;
      }
      if (statusFilter && c.status !== statusFilter) return false;
      return true;
    });
  }, [comments, searchTerm, statusFilter]);

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
            placeholder={t('admin.placeholders.searchComments') || 'Search comments'}
          />
          <select value={statusFilter} onChange={(e) => { setStatusFilter(e.target.value); setPage(1); }} className="p-2 border rounded">
            <option value="">{t('admin.labels.allStatus')}</option>
            <option value="published">{t('admin.comments.status.published')}</option>
            <option value="pending">{t('admin.comments.status.pending')}</option>
            <option value="hidden">{t('admin.comments.status.hidden')}</option>
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
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">{t('admin.tables.comments.product')}</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">{t('admin.tables.comments.user')}</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">{t('admin.tables.comments.rating')}</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">{t('admin.tables.comments.comment')}</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">{t('admin.tables.comments.status')}</th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">{t('admin.tables.comments.actions')}</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {paged.map((c) => (
              <tr key={c.id} className="hover:bg-gray-50 transition-colors">
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{c.productName}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{c.userName}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-yellow-600">{c.rating} / 5</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{c.comment}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm">
                  {c.status === 'published' ? <span className="text-green-600">{t('admin.comments.status.published')}</span> : c.status === 'hidden' ? <span className="text-red-600">{t('admin.comments.status.hidden')}</span> : <span className="text-yellow-600">{t('admin.comments.status.pending')}</span>}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right">
                  <div className="inline-flex gap-2">
                    <CommentViewButton comment={c} />
                    <button className="px-3 py-1 border border-red-300 text-red-600 rounded hover:bg-red-50 text-sm">{t('admin.comments.actions.hide')}</button>
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

function CommentDialogOverlay() {
  return <div className="fixed inset-0 bg-black/40 z-40" />;
}

function CommentViewButton({ comment }: { comment: AdminComment }) {
  const { t } = useI18n();
  const [open, setOpen] = useState(false);

  return (
    <Dialog.Root open={open} onOpenChange={setOpen}>
      <Dialog.Trigger asChild>
        <button onClick={() => setOpen(true)} className="px-3 py-1 bg-[#634bc1] text-white rounded hover:opacity-90 text-sm">{t('admin.buttons.view')}</button>
      </Dialog.Trigger>

      <Dialog.Portal>
        <CommentDialogOverlay />
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="w-full max-w-lg bg-card rounded-lg shadow-lg p-6">
            <div className="flex items-start justify-between gap-4">
              <div>
                <h3 className="text-lg font-semibold">{t('admin.comments.dialog.title')}</h3>
                <p className="text-sm text-gray-500">{t('admin.comments.dialog.id')}: {comment.id}</p>
              </div>
              <Dialog.Close asChild>
                <button className="text-gray-500 hover:text-gray-700">Close</button>
              </Dialog.Close>
            </div>

              <div className="mt-4 grid grid-cols-2 gap-3">
              <div className="text-xs text-gray-500">{t('admin.comments.fields.product')}</div>
              <div className="font-medium">{comment.productName}</div>

              <div className="text-xs text-gray-500">{t('admin.comments.fields.user')}</div>
              <div className="font-medium">{comment.userName}</div>

              <div className="text-xs text-gray-500">{t('admin.comments.fields.rating')}</div>
              <div className="font-medium">{comment.rating} / 5</div>

              <div className="text-xs text-gray-500">{t('admin.comments.fields.created')}</div>
              <div className="font-medium">{comment.createdAt}</div>

              <div className="text-xs text-gray-500">{t('admin.comments.fields.status')}</div>
              <div className="font-medium capitalize">{t(`admin.comments.status.${comment.status}`)}</div>

              <div className="text-xs text-gray-500">{t('admin.comments.fields.comment')}</div>
              <div className="font-medium col-span-2 break-words">{comment.comment}</div>
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
