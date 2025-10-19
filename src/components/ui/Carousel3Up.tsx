"use client";
import React from 'react';
import Image from 'next/image';
import Link from 'next/link';

interface Carousel3UpProps {
  categories: { image: string; name: string; count: number }[];
}

const Carousel3Up: React.FC<Carousel3UpProps> = ({ categories }) => {
  // prepare 15 cards (allow duplicates) by repeating the categories
  const items: { image: string; name: string; count: number }[] = [];
  while (items.length < 15) {
    for (const c of categories) {
      if (items.length >= 15) break;
      items.push(c);
    }
  }

  // group items into frames of 3 cards each so exactly 3 cards are visible per frame
  const frameSize = 3;
  const frames: { image: string; name: string; count: number }[][] = [];
  for (let i = 0; i < items.length; i += frameSize) {
    frames.push(items.slice(i, i + frameSize));
  }

  // clone-first frame for seamless loop
  const slides = frames.length ? [...frames, frames[0]] : [];
  const total = slides.length; // frames + cloned frame

  const [index, setIndex] = React.useState(0); // 0..frames.length (last is clone)
  const [isPaused, setIsPaused] = React.useState(false);
  const [isTransitionEnabled, setIsTransitionEnabled] = React.useState(true);
  const innerRef = React.useRef<HTMLDivElement | null>(null);
  const timeoutRef = React.useRef<number | null>(null);
  const delay = 4000;

  React.useEffect(() => {
    if (isPaused) return;
    timeoutRef.current = window.setTimeout(() => setIndex(i => i + 1), delay);
    return () => { if (timeoutRef.current) window.clearTimeout(timeoutRef.current); };
  }, [index, isPaused]);

  React.useEffect(() => {
    const el = innerRef.current;
    if (!el) return;
    function onTransitionEnd() {
      if (index === slides.length - 1) {
        // we reached cloned frame, snap back to first frame without transition
        setIsTransitionEnabled(false);
        setIndex(0);
        requestAnimationFrame(() => requestAnimationFrame(() => setIsTransitionEnabled(true)));
      }
    }
    el.addEventListener('transitionend', onTransitionEnd);
    return () => el.removeEventListener('transitionend', onTransitionEnd);
  }, [index, slides.length]);

  // each slide is a full frame (100% of viewport). inner track width = total * 100% and each frame width = 100/total %
  const frameWidthPercent = 100 / total;
  const translatePercent = -(index * frameWidthPercent);

  return (
    <div className="relative" onMouseEnter={() => setIsPaused(true)} onMouseLeave={() => setIsPaused(false)}>
      <div className="overflow-hidden">
        <div
          ref={innerRef}
          className="flex h-full"
          style={{
            width: `${total * 100}%`,
            transform: `translateX(${translatePercent}%)`,
            transition: isTransitionEnabled ? 'transform 700ms ease' : 'none'
          }}
        >
          {slides.map((frame, i) => (
            <div key={`frame-${i}`} style={{ width: `${frameWidthPercent}%` }} className="p-2">
              <div className="grid grid-cols-3 gap-4">
                {frame.map((cat, j) => (
                  <div key={`${cat.name}-${j}`} className="group relative rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-all">
                    <div className="h-64 overflow-hidden relative">
                      <Image src={cat.image} alt={cat.name} fill className="object-cover group-hover:scale-105 transition-transform duration-500" sizes="(min-width: 1024px) 11vw, (min-width: 640px) 16vw, 33vw" />
                    </div>
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent flex flex-col justify-end p-6">
                      <h3 className="text-2xl font-bold text-white mb-1">{cat.name}</h3>
                      <p className="text-gray-200">{cat.count} products</p>
                      <Link href={`/products?category=${cat.name.toLowerCase()}`} className="mt-3 inline-flex items-center text-white font-medium hover:text-[#ffdc89] transition-colors">
                        Shop now
                        <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3"></path>
                        </svg>
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* indicators */}
      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 z-20 flex gap-2">
        {items.slice(0, items.length).map((_, i) => (
          <button key={i} onClick={() => { setIsTransitionEnabled(true); setIndex(i); }} className={`w-3 h-3 rounded-full ${i === (index % items.length) ? 'bg-white' : 'bg-white/50'}`} aria-label={`Show set ${i + 1}`} />
        ))}
      </div>
    </div>
  );
};

export default Carousel3Up;
