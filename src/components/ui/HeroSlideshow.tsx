"use client";
import React, { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import { sampleHeroSlides, sampleProducts } from '@/lib/sampleData';

interface HeroSlideshowProps {
  delay?: number; // ms
  className?: string;
  height?: string; // tailwind height classes or inline style
}

const HeroSlideshow: React.FC<HeroSlideshowProps> = ({ delay = 5000, className = '', height = 'py-16' }) => {
  const slides = sampleHeroSlides;
  const [current, setCurrent] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const timeoutRef = useRef<number | null>(null);

  useEffect(() => {
    if (isPaused) return;
    timeoutRef.current = window.setTimeout(() => {
      setCurrent((c) => (c + 1) % slides.length);
    }, delay);
    return () => {
      if (timeoutRef.current) window.clearTimeout(timeoutRef.current);
    };
  }, [current, isPaused, delay, slides.length]);

  const heroSlide = slides[current] || slides[0];
  const product = sampleProducts.find(p => p.id === heroSlide.id);

  return (
    <section
      className={`relative overflow-hidden text-white ${className} ${height}`}
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      <div className="absolute inset-0 z-0">
        {slides.map((s, i) => (
          <div key={s.id} className={`absolute inset-0 transition-opacity duration-1000 ${i === current ? 'opacity-100' : 'opacity-0'}`}>
            <Image src={s.image} alt={s.title} fill className="object-contain w-full h-full" sizes="100vw" priority={i === current} />
          </div>
        ))}

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
          <button key={s.id} aria-label={`Show slide ${i + 1}`} onClick={() => setCurrent(i)} className={`w-3 h-3 rounded-full ${i === current ? 'bg-white' : 'bg-white/50'}`} />
        ))}
      </div>
    </section>
  );
};

export default HeroSlideshow;
