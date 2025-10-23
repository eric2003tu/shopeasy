"use client";
import React, { useEffect, useRef, useState } from 'react';
import { useAuth } from '@/context/AuthProvider';
import { useToast } from '@/context/ToastProvider';
import { useRouter } from 'next/navigation';

interface CommentPayload {
  body: string;
  postId: number;
  userId: number;
}

interface CommentResponse {
  id: number;
  body: string;
  postId: number;
  user: {
    id: number;
    username: string;
    fullName?: string;
  };
}

export default function CommentPopup({ postId, trigger, onCreate }: { postId: number; trigger?: React.ReactNode; onCreate?: (c: CommentResponse) => void; }) {
  const { user } = useAuth();
  const { toast } = useToast();
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [text, setText] = useState('');
  const [loading, setLoading] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);

  useEffect(() => {
    if (open) textareaRef.current?.focus();
  }, [open]);

  const ensureLoggedIn = () => {
    if (!user) {
      toast({ type: 'info', title: 'Sign in required', description: 'Please sign in to leave a comment' });
      router.push('/login');
      return false;
    }
    return true;
  };

  const submit = async () => {
    if (!ensureLoggedIn()) return;
    const trimmed = text.trim();
    if (!trimmed) {
      toast({ type: 'error', title: 'Comment required', description: 'Please write a comment before submitting' });
      return;
    }
    if (!postId || Number(postId) <= 0) {
      toast({ type: 'error', title: 'Invalid post', description: 'Cannot post comment: invalid post id' });
      return;
    }
    setLoading(true);
    try {
  const payload: CommentPayload = { body: trimmed, postId, userId: Number((user as unknown as { id?: number }).id || 0) };
      const res = await fetch('https://dummyjson.com/comments/add', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      if (!res.ok) {
        let message = `HTTP ${res.status}`;
        try {
          const json = await res.json();
          if (json?.message) message = json.message;
        } catch {}
        throw new Error(message);
      }
      const data = await res.json() as CommentResponse;
      toast({ type: 'success', title: 'Comment posted', description: 'Your comment was added' });
      setText('');
      setOpen(false);
      if (onCreate) onCreate(data);
    } catch (err) {
      console.error('Failed to post comment', err);
      toast({ type: 'error', title: 'Failed', description: 'Could not post comment' });
    } finally {
      setLoading(false);
    }
  };

  const defaultTrigger = (
    <button className="px-3 py-2 bg-[#634bc1] text-white rounded" onClick={() => { if (!ensureLoggedIn()) return; setOpen(true); }}>
      Write a comment
    </button>
  );

  return (
    <>
      {trigger ? (
        <span onClick={() => { if (!ensureLoggedIn()) return; setOpen(true); }}>{trigger}</span>
      ) : defaultTrigger}

      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-black/50" onClick={() => setOpen(false)} />
          <div className="relative z-60 w-full max-w-xl bg-white rounded shadow-lg p-6">
            <div className="flex items-start justify-between">
              <h3 className="text-lg font-semibold">Leave a comment</h3>
              <button className="text-gray-500" onClick={() => setOpen(false)}>✕</button>
            </div>
            <div className="mt-3">
              <textarea ref={textareaRef} value={text} onChange={(e) => setText(e.target.value)} rows={6} className="w-full p-3 border rounded" placeholder="Write your thoughts..." />
            </div>
            <div className="mt-4 flex items-center justify-end gap-3">
              <button className="px-3 py-2 bg-muted rounded" onClick={() => setOpen(false)} disabled={loading}>Cancel</button>
              <button className="px-4 py-2 bg-[#634bc1] text-white rounded disabled:opacity-60" onClick={submit} disabled={loading}>{loading ? 'Posting...' : 'Post comment'}</button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
