"use client";
import React, { useEffect, useState } from 'react';
import { CommentPopup } from '../small/CommentPopup';
import CommentsList from './CommentsList';

interface CommentResp {
  id: number;
  body: string;
  postId: number;
  likes?: number;
  user: { id: number; username: string; fullName?: string };
}

export default function ProductCommentsClientWrapper({ postId }: { postId: number }) {
  const [comments, setComments] = useState<CommentResp[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    const load = async () => {
      try {
        const res = await fetch(`https://dummyjson.com/comments/post/${postId}`);
        if (!res.ok) throw new Error('Failed to load comments');
        const data = await res.json();
        if (mounted) setComments(Array.isArray(data?.comments) ? data.comments : []);
      } catch (e) {
        console.debug('comments fetch failed', e);
        if (mounted) setComments([]);
      } finally {
        if (mounted) setLoading(false);
      }
    };
    load();
    return () => { mounted = false; };
  }, [postId]);

  const handleCreate = (c: CommentResp) => {
    // prepend new comment
    setComments(prev => [c, ...prev]);
  };

  return (
    <div>
      <div className="mb-3">
        <CommentPopup postId={postId} onCreate={handleCreate} />
      </div>
      <div>
        {loading ? <div className="text-sm text-gray-600">Loading comments...</div> : <CommentsList comments={comments} />}
      </div>
    </div>
  );
}
