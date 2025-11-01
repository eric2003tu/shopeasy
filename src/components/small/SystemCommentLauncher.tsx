"use client";
import React from 'react';
import { CommentPopup } from './CommentPopup';

export default function SystemCommentLauncher() {
  // use postId 1 for system-wide comments (dummyjson requires positive postId)
  return (
    <div>
      <div className="fixed left-6 bottom-6 z-50">
        <CommentPopup postId={1} trigger={
          <button className="flex items-center gap-2 px-4 py-3 bg-[#634bc1] text-white rounded-full shadow-lg hover:bg-[#5340a0]">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path d="M2 5a2 2 0 012-2h12a2 2 0 012 2v8a2 2 0 01-2 2H7l-5 3V5z" /></svg>
            <span className="hidden sm:inline">Feedback</span>
          </button>
        } />
      </div>
    </div>
  );
}
