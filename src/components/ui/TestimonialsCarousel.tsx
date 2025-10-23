"use client";
import React from 'react';
import { sampleTestimonials, SampleTestimonial } from '@/lib/sampleData';

const TestimonialsCarousel: React.FC = () => {
  const items: SampleTestimonial[] = sampleTestimonials.slice(0, 15);
  const frameSize = 3;
  const frames: SampleTestimonial[][] = [];
  for (let i = 0; i < items.length; i += frameSize) {
    frames.push(items.slice(i, i + frameSize));
  }

  const slides = frames.length ? [...frames, frames[0]] : [];
  const total = slides.length;

  const [index, setIndex] = React.useState(0);
  const [isPaused, setIsPaused] = React.useState(false);
  const [isTransitionEnabled, setIsTransitionEnabled] = React.useState(true);
  const innerRef = React.useRef<HTMLDivElement | null>(null);
  const outerRef = React.useRef<HTMLDivElement | null>(null);
  const intervalRef = React.useRef<number | null>(null);
  const [outerWidth, setOuterWidth] = React.useState<number | null>(null);
  const delay = 4500;

  // use an interval for autoplay (more predictable than chained timeouts)
  React.useEffect(() => {
    if (isPaused) return;
    const id = window.setInterval(() => {
      setIsTransitionEnabled(true);
      setIndex(i => {
        const next = i + 1;
        return next >= slides.length ? slides.length - 1 : next;
      });
    }, delay);
    intervalRef.current = id as unknown as number;
    return () => { if (intervalRef.current) window.clearInterval(intervalRef.current); };
  }, [isPaused, slides.length]);

  React.useEffect(() => {
    const el = innerRef.current;
    if (!el) return;
    function onTransitionEnd() {
      if (index === slides.length - 1) {
        setIsTransitionEnabled(false);
        setIndex(0);
        requestAnimationFrame(() => requestAnimationFrame(() => setIsTransitionEnabled(true)));
      }
    }
    el.addEventListener('transitionend', onTransitionEnd);
    return () => el.removeEventListener('transitionend', onTransitionEnd);
  }, [index, slides.length]);

  // measure outer width for pixel-perfect sliding
  React.useEffect(() => {
    function measure() {
      const o = outerRef.current;
      if (!o) return;
      setOuterWidth(o.clientWidth || 0);
    }
    measure();
    window.addEventListener('resize', measure);
    return () => window.removeEventListener('resize', measure);
  }, []);

  const next = () => { setIsTransitionEnabled(true); setIndex(i => i + 1); };
  const prev = () => { setIsTransitionEnabled(true); setIndex(i => Math.max(0, i - 1)); };

  const frameWidthPercent = 100 / total;
  // pixel-based translate when we have outerWidth, otherwise fall back to percent
  const translateStyle = outerWidth ? `translateX(${-index * outerWidth}px)` : `translateX(${-(index * frameWidthPercent)}%)`;

  return (
    <div className="relative" onMouseEnter={() => setIsPaused(true)} onMouseLeave={() => setIsPaused(false)}>
      <div className="overflow-hidden" ref={outerRef}>
        <div
          ref={innerRef}
          className="flex h-full"
          style={{ width: outerWidth ? `${total * outerWidth}px` : `${total * 100}%`, transform: translateStyle, transition: isTransitionEnabled ? 'transform 700ms ease' : 'none' }}
        >
          {slides.map((frame, i) => (
            <div key={`tframe-${i}`} style={{ width: outerWidth ? `${outerWidth}px` : `${frameWidthPercent}%` }} className="p-2">
              <div className="grid grid-cols-3 gap-8">
                {frame.map((t: SampleTestimonial) => (
                  <div key={t.id} className="bg-white p-8 rounded-xl shadow-md hover:shadow-lg transition-shadow text-gray-800">
                    <div className="flex items-center mb-4 text-yellow-500">{[...Array(5)].map((_, i) => <span key={i} className="w-4 h-4 inline-block">★</span>)}</div>
                    <blockquote className="text-gray-600 italic mb-6">&quot;{t.quote}&quot;</blockquote>
                    <div className="flex items-center">
                      <div className="w-12 h-12 rounded-full bg-gray-200 flex items-center justify-center mr-4 text-gray-600">{t.author.split(' ').map((n: string) => n[0]).slice(0,2).join('')}</div>
                      <div>
                        <h4 className="font-bold text-gray-800">{t.author}</h4>
                        <p className="text-sm text-gray-500">{t.role}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Prev/Next controls for manual testing */}
      <div className="absolute -top-2 right-4 z-30 flex gap-2">
        <button onClick={prev} className="px-3 py-1 bg-white/20 text-white rounded">Prev</button>
        <button onClick={next} className="px-3 py-1 bg-white/20 text-white rounded">Next</button>
      </div>

      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 z-20 flex gap-2">
        {frames.map((_, i) => (
          <button key={i} onClick={() => { setIsTransitionEnabled(true); setIndex(i); }} className={`w-3 h-3 rounded-full ${i === (index % frames.length) ? 'bg-white' : 'bg-white/50'}`} aria-label={`Show testimonials set ${i + 1}`} />
        ))}
      </div>
    </div>
  );
};

export default TestimonialsCarousel;
