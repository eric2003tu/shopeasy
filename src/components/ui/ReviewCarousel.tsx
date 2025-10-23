"use client";
import React, { useState, useEffect, useRef, useCallback } from 'react';
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa';

interface Review {
  rating: number;
  comment: string;
  date?: string;
  reviewerName?: string;
  reviewerEmail?: string;
}

interface Props {
  reviews: Review[];
}

export default function ReviewCarousel({ reviews }: Props) {
  const [index, setIndex] = useState(0);
  const containerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    setIndex(0);
  }, [reviews]);

  const nextCb = useCallback(() => setIndex((i) => (i + 1) % reviews.length), [reviews.length]);
  const prevCb = useCallback(() => setIndex((i) => (i - 1 + reviews.length) % reviews.length), [reviews.length]);

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight') nextCb();
      if (e.key === 'ArrowLeft') prevCb();
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [nextCb, prevCb]);

  if (!reviews || reviews.length === 0) return null;

  const next = nextCb;
  const prev = prevCb;

  const r = reviews[index];

  return (
    <div ref={containerRef} className="w-full max-w-3xl mx-auto">
      <div className="relative bg-white rounded-lg shadow p-6">
        <div className="flex items-start justify-between">
          <div>
            <div className="text-sm text-gray-600">{r.reviewerName || r.reviewerEmail}</div>
            <div className="text-xs text-gray-400">{r.date ? new Date(r.date).toLocaleDateString() : ''}</div>
          </div>
          <div className="text-yellow-500 font-semibold">{`★ ${r.rating}/5`}</div>
        </div>
        <div className="mt-4 text-gray-800">{r.comment}</div>

        <div className="mt-4 flex items-center justify-between">
          <div className="text-sm text-gray-500">{index + 1} / {reviews.length}</div>
          <div className="flex items-center gap-2">
            <button aria-label="Previous review" onClick={prev} className="p-2 rounded hover:bg-gray-100">
              <FaChevronLeft />
            </button>
            <button aria-label="Next review" onClick={next} className="p-2 rounded hover:bg-gray-100">
              <FaChevronRight />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
