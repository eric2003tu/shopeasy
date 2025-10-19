"use client";
import React, { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import { sampleHeroSlides, sampleProducts } from '@/lib/sampleData';

interface HeroSlideshowProps {
  delay?: number; // ms
  className?: string;
  height?: string; // tailwind height classes or inline style
}

// Sliding carousel (right -> left) with cloned-first slide for seamless loop
const HeroSlideshow: React.FC<HeroSlideshowProps> = ({ delay = 5000, className = '', height = 'py-16' }) => {
  const slides = sampleHeroSlides ?? [];

  // add clone of first slide at end for seamless transition (compute before hooks)
  const slidesWithClone = slides.length > 0 ? [...slides, slides[0]] : [];
  const total = slidesWithClone.length;

  // Hooks must be called unconditionally at the top level
  const [index, setIndex] = useState(0); // 0 .. slides.length (clone index == slides.length)
  const [isPaused, setIsPaused] = useState(false);
  const [isTransitionEnabled, setIsTransitionEnabled] = useState(true);
  const innerRef = useRef<HTMLDivElement | null>(null);
  const timeoutRef = useRef<number | null>(null);

  useEffect(() => {
    if (isPaused) return;
    timeoutRef.current = window.setTimeout(() => {
      setIndex((i) => i + 1);
    }, delay);
    return () => {
      if (timeoutRef.current) window.clearTimeout(timeoutRef.current);
    };
  }, [index, isPaused, delay]);

  // when we reach the cloned slide (index === slides.length), after transition ends we snap to 0 without transition
  useEffect(() => {
    const el = innerRef.current;
    if (!el) return;
    function onTransitionEnd() {
      if (index === slides.length) {
        // disable transition, snap back to real first slide
        setIsTransitionEnabled(false);
        setIndex(0);
        // re-enable transition on next tick
        requestAnimationFrame(() => requestAnimationFrame(() => setIsTransitionEnabled(true)));
      }
    }
    el.addEventListener('transitionend', onTransitionEnd);
    return () => el.removeEventListener('transitionend', onTransitionEnd);
  }, [index, slides.length]);

  // if there are no slides, return early AFTER hooks have been called
  if (!slides || slides.length === 0) return null;

  const goTo = (i: number) => {
    setIsTransitionEnabled(true);
    setIndex(i);
  };

  const percentPer = 100 / total; // percent width per slide inside inner container
  const translatePercent = -(index * percentPer);

  const heroSlide = slides[index % slides.length] || slides[0];
  const product = sampleProducts.find(p => p.id === heroSlide.id);

  return (
    <section
      className={`relative overflow-hidden text-white ${className} ${height}`}
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      <div className="absolute inset-0 z-0">
        <div
          ref={innerRef}
          className="h-full flex"
          style={{
            width: `${total * 100}%`,
            transform: `translateX(${translatePercent}%)`,
            transition: isTransitionEnabled ? 'transform 700ms ease' : 'none'
          }}
        >
          {slidesWithClone.map((s, i) => (
            <div key={`${s.id}-${i}`} style={{ width: `${percentPer}%` }} className="relative h-full">
              <Image src={s.image} alt={s.title} fill className="object-contain w-full h-full" sizes="100vw" priority={i === 0} />
            </div>
          ))}

        </div>
        <div className="absolute inset-0 bg-gradient-to-r from-[#332e47]/60 to-[#1d163c]/60" />
      </div>

      <div className="relative z-10 max-w-6xl mx-auto grid md:grid-cols-2 gap-8 items-center">
        <div className="space-y-6 px-4">
          <h1 className="text-4xl md:text-5xl font-bold leading-tight">{heroSlide.title}</h1>
          <p className="text-lg md:text-xl">{heroSlide.subtitle}</p>
          {product && typeof product.price === 'number' && (
            <div className="flex items-center gap-4">
              <div className="text-3xl font-bold text-[#ffdc89]">${product.price.toFixed(2)}</div>
            </div>
          )}
          <div className="flex flex-wrap gap-4">
            <a href="/signup" className="px-8 py-3 bg-[#ffdc89] text-[#634bc1] font-semibold rounded-lg hover:bg-[#ffe8a8] transition-colors shadow-lg">Sign up</a>
            <a href="/products" className="px-8 py-3 border-2 border-white font-semibold rounded-lg hover:bg-white hover:text-[#634bc1] transition-colors">Start shopping</a>
          </div>
        </div>

        <div className="hidden md:block">
          {/* placeholder for Search or any right-side content */}
        </div>
      </div>

      <div className="absolute -bottom-20 -right-20 w-64 h-64 rounded-full bg-[#ffdc89] opacity-10" />
      <div className="absolute -top-20 -left-20 w-64 h-64 rounded-full bg-[#634bc1] opacity-10" />

      <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 z-20 flex gap-2">
        {slides.map((s, i) => (
          <button key={s.id} aria-label={`Show slide ${i + 1}`} onClick={() => goTo(i)} className={`w-3 h-3 rounded-full ${i === (index % slides.length) ? 'bg-white' : 'bg-white/50'}`} />
        ))}
      </div>
    </section>
  );
};

export default HeroSlideshow;
