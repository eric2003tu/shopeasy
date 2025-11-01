"use client";
import React, { useEffect, useRef, useState } from 'react';
import { useAuth } from '@/context/AuthProvider';
import { useToast } from '@/context/ToastProvider';
import { useRouter } from 'next/navigation';
import { FaStar, FaTimes } from 'react-icons/fa';

interface CommentPayload {
  body: string;
  postId: number;
  userId: number;
  rating?: number;
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

export function CommentPopup({
  postId,
  trigger,
  onCreate
}: {
  postId: number;
  trigger?: React.ReactNode;
  onCreate?: (c: CommentResponse) => void;
}) {
  const { user } = useAuth();
  const { toast } = useToast();
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [text, setText] = useState('');
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [loading, setLoading] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);

  const ratingLabels = {
    1: { label: "Bad", color: "text-red-500", description: "Poor" },
    2: { label: "Fair", color: "text-orange-500", description: "better" },
    3: { label: "Good", color: "text-yellow-500", description: "Satisfactory" },
    4: { label: "Very Good", color: "text-lime-500", description: "Great " },
    5: { label: "Excellent", color: "text-green-500", description: "Outstanding" }
  };

  useEffect(() => {
    if (open) textareaRef.current?.focus();
  }, [open]);

  const ensureLoggedIn = () => {
    if (!user) {
      toast({
        type: 'info',
        title: 'Sign in required',
        description: 'Please sign in to leave a comment'
      });
      router.push('/login');
      return false;
    }
    return true;
  };

  const submit = async () => {
    if (!ensureLoggedIn()) return;
    const trimmed = text.trim();
    if (!trimmed) {
      toast({
        type: 'error',
        title: 'Comment required',
        description: 'Please write a comment before submitting'
      });
      return;
    }
    if (!postId || Number(postId) <= 0) {
      toast({
        type: 'error',
        title: 'Invalid post',
        description: 'Cannot post comment: invalid post id'
      });
      return;
    }
    setLoading(true);
    try {
      const payload: CommentPayload = {
        body: trimmed,
        postId,
        userId: Number(
          (user as unknown as { id?: number }).id || 0
        ),
      };

      // Add rating to payload if provided
      if (rating > 0) {
        payload.rating = rating;
      }

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
      toast({
        type: 'success',
        title: 'Comment posted',
        description: 'Your comment was added',
      });

      setText('');
      setRating(0);
      setOpen(false);
      onCreate?.(data);

    } catch (err) {
      console.error('Failed to post comment', err);
      toast({
        type: 'error',
        title: 'Failed',
        description: 'Could not post comment',
      });
    } finally {
      setLoading(false);
    }
  };

  const StarRating = () => (
    <div className="flex flex-col items-center mb-4">
      <p className="text-sm text-gray-600 mb-4">How would you rate our service?</p>
      
      {/* Rating categories and stars in aligned columns */}
      <div className="flex justify-between w-full max-w-md mb-3">
        {[1, 2, 3, 4, 5].map((star) => (
          <div
            key={star}
            className="flex flex-col items-center w-16"
          >
            {/* Category label above */}
            <div 
              className={`text-xs text-center mb-2 transition-all duration-200 ${
                (hoverRating === star || rating === star) 
                  ? ratingLabels[star as keyof typeof ratingLabels].color + ' font-semibold scale-110'
                  : 'text-gray-500'
              }`}
            >
              <div className="font-medium">
                {ratingLabels[star as keyof typeof ratingLabels].label}
              </div>
              <div className="text-[10px] mt-1 opacity-80 leading-tight">
                {ratingLabels[star as keyof typeof ratingLabels].description}
              </div>
            </div>

            {/* Star below */}
            <button
              type="button"
              className={`text-2xl transition-all duration-150 hover:scale-110 focus:outline-none ${
                star <= (hoverRating || rating)
                  ? ratingLabels[star as keyof typeof ratingLabels].color
                  : 'text-gray-300'
              }`}
              onClick={() => setRating(star)}
              onMouseEnter={() => setHoverRating(star)}
              onMouseLeave={() => setHoverRating(0)}
              disabled={loading}
            >
              <FaStar size={30}/>
            </button>
          </div>
        ))}
      </div>
      
      {/* Selected rating display */}
      <div className="text-center mt-2">
        {rating > 0 ? (
          <div className={`text-sm font-semibold ${ratingLabels[rating as keyof typeof ratingLabels].color}`}>
            <div>You selected: {ratingLabels[rating as keyof typeof ratingLabels].label}</div>
            <div className="text-xs font-normal text-gray-600 mt-1">
              {ratingLabels[rating as keyof typeof ratingLabels].description}
            </div>
          </div>
        ) : (
          <p className="text-sm text-gray-400">Click on a star to rate</p>
        )}
      </div>
    </div>
  );

  const defaultTrigger = (
    <button
      className="px-3 py-2 bg-[#634bc1] text-white rounded hover:bg-[#5540a5] transition-colors"
      onClick={() => setOpen(true)}
    >
      Write a comment
    </button>
  );

  return (
    <>
      {trigger ? (
        <span onClick={() => setOpen(true)}>
          {trigger}
        </span>
      ) : defaultTrigger}

      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div
            className="absolute inset-0 bg-black/50"
            onClick={() => setOpen(false)}
          />
          <div className="relative w-full max-w-2xl bg-white rounded shadow-lg p-6">
            <div className="flex items-start justify-between">
              <h3 className="text-lg font-semibold">Leave a comment</h3>
              <button
                className="text-gray-500 hover:text-gray-700 transition-colors"
                onClick={() => setOpen(false)}
              >
                <FaTimes />
              </button>
            </div>

            {/* Star Rating Component */}
            <StarRating />

            <div className="mt-3">
              <textarea
                ref={textareaRef}
                value={text}
                onChange={(e) => setText(e.target.value)}
                rows={6}
                className="w-full p-3 bg-gray-100/50 border-2 rounded focus:border-[#634bc1] focus:outline-none transition-colors"
                placeholder="Write your thoughts..."
              />
            </div>

            <div className="mt-4 flex items-center justify-end gap-3">
              <button
                className="px-3 py-2 bg-gray-200 rounded hover:bg-gray-300 transition-colors"
                onClick={() => setOpen(false)}
                disabled={loading}
              >
                Cancel
              </button>
              <button
                className="px-4 py-2 bg-[#634bc1] text-white rounded disabled:opacity-60 hover:bg-[#5540a5] transition-colors"
                onClick={submit}
                disabled={loading}
              >
                {loading ? 'Posting...' : 'Post comment'}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}