"use client";
import React from 'react';

interface User {
  id: number;
  username: string;
  fullName?: string;
}

interface CommentItem {
  id: number;
  body: string;
  postId: number;
  likes?: number;
  user: User;
}

export default function CommentsList({ comments }: { comments: CommentItem[] }) {
  if (!comments || comments.length === 0) {
    return <div className="text-sm text-gray-600">No comments yet.</div>;
  }

  return (
    <div className="mt-4 space-y-4">
      {comments.map(c => (
        <div key={c.id} className="bg-white p-3 rounded shadow-sm">
          <div className="flex items-start gap-3">
            <div className="flex-shrink-0 h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center text-sm font-semibold text-gray-700">
              {c.user.fullName ? c.user.fullName.split(' ').map(n=>n[0]).slice(0,2).join('') : (c.user.username || 'U').slice(0,2).toUpperCase()}
            </div>
            <div className="flex-1">
              <div className="flex items-center justify-between">
                <div className="text-sm font-medium">{c.user.fullName || c.user.username}</div>
                <div className="text-xs text-gray-500">#{c.id}</div>
              </div>
              <div className="text-gray-800 mt-1">{c.body}</div>
              {typeof c.likes !== 'undefined' && (
                <div className="text-xs text-gray-500 mt-2">{c.likes} likes</div>
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
