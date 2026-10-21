import React, { useState, useEffect, useRef } from 'react';
import { Product } from '../types';
import { ChevronLeft, ChevronRight, ShoppingBag, Eye, Zap, Sparkles } from 'lucide-react';

interface NetflixHeroCarouselProps {
  products: Product[];
  onViewProduct: (product: Product) => void;
  onQuickAdd: (product: Product, size: string, color: string) => void;
  onInstantBuy: (product: Product, size: string, color: string) => void;
}

export const NetflixHeroCarousel: React.FC<NetflixHeroCarouselProps> = ({
  products,
  onViewProduct,
  onQuickAdd,
  onInstantBuy,
}) => {
  // Use top 5 recently created creations
  const carouselItems = products.slice(0, 5);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [progress, setProgress] = useState(0);

  // Touch swipe support for mobile
  const touchStartX = useRef<number | null>(null);
  const touchEndX = useRef<number | null>(null);

  const SLIDE_DURATION_MS = 6000;
  const UPDATE_INTERVAL_MS = 60;

  // Auto-progress timer with visual Netflix-style progress bar
  useEffect(() => {
    if (carouselItems.length <= 1) return;

    if (isPaused) return;

    const interval = setInterval(() => {
      setProgress((prev) => {
        const increment = (UPDATE_INTERVAL_MS / SLIDE_DURATION_MS) * 100;
        if (prev + increment >= 100) {
          setCurrentIndex((idx) => (idx + 1) % carouselItems.length);
          return 0;
        }
        return prev + increment;
      });
    }, UPDATE_INTERVAL_MS);

    return () => clearInterval(interval);
  }, [isPaused, carouselItems.length, currentIndex]);

  // Reset progress when index manually changes
  const goToSlide = (idx: number) => {
    setCurrentIndex(idx);
    setProgress(0);
  };

  const handlePrev = () => {
    goToSlide((currentIndex - 1 + carouselItems.length) % carouselItems.length);
  };

  const handleNext = () => {
    goToSlide((currentIndex + 1) % carouselItems.length);
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.targetTouches[0].clientX;
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    touchEndX.current = e.targetTouches[0].clientX;
  };

  const handleTouchEnd = () => {
    if (!touchStartX.current || !touchEndX.current) return;
    const distance = touchStartX.current - touchEndX.current;
    const minSwipeDistance = 50;

    if (distance > minSwipeDistance) {
      handleNext();
    } else if (distance < -minSwipeDistance) {
      handlePrev();
    }

    touchStartX.current = null;
    touchEndX.current = null;
  };

  if (carouselItems.length === 0) return null;

  const currentItem = carouselItems[currentIndex];

  return (
    <section 
      className="relative w-full min-h-[560px] sm:min-h-[620px] lg:h-[680px] overflow-hidden bg-stone-950 text-white rounded-none select-none flex flex-col justify-between"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      aria-label="Recently Created Products Carousel"
    >
      {/* Background Image Stage: Product image takes the full background as carousel animates */}
      {carouselItems.map((item, index) => {
        const isActive = index === currentIndex;
        return (
          <div
            key={item.id}
            aria-hidden={!isActive}
            className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
              isActive ? 'opacity-100 z-10' : 'opacity-0 z-0 pointer-events-none'
            }`}
          >
            <img
              src={item.image}
              alt={item.name}
              className={`w-full h-full object-cover object-center transition-transform duration-7000 ease-out ${
                isActive ? 'scale-105' : 'scale-100'
              }`}
              referrerPolicy="no-referrer"
            />
          </div>
        );
      })}

      {/* Netflix Cinematic Scrim Overlays */}
      {/* 1. Left-to-right gradient on tablet/desktop, bottom-up on mobile */}
      <div className="absolute inset-0 z-20 bg-gradient-to-t sm:bg-gradient-to-r from-stone-950 via-stone-950/85 sm:via-stone-950/75 to-stone-950/20 sm:to-transparent pointer-events-none" />
      {/* 2. Top header fade for contrast */}
      <div className="absolute inset-x-0 top-0 h-28 z-20 bg-gradient-to-b from-stone-950/90 via-stone-950/40 to-transparent pointer-events-none" />
      {/* 3. Bottom blend gradient into page content */}
      <div className="absolute inset-x-0 bottom-0 h-44 z-20 bg-gradient-to-t from-stone-950 via-stone-950/75 to-transparent pointer-events-none" />

      {/* Netflix Top Stories/Preview Segmented Progress Bars */}
      <div className="relative z-30 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 pt-4 sm:pt-6">
        <div className="flex items-center gap-1.5 sm:gap-2">
          {carouselItems.map((item, idx) => {
            const isCompleted = idx < currentIndex;
            const isCurrent = idx === currentIndex;
            const fillWidth = isCompleted ? '100%' : isCurrent ? `${progress}%` : '0%';

            return (
              <button
                key={item.id}
                onClick={() => goToSlide(idx)}
                className="flex-1 h-1 sm:h-1.5 bg-white/20 hover:bg-white/35 transition-colors cursor-pointer rounded-none overflow-hidden relative"
                aria-label={`Jump to slide ${idx + 1}: ${item.name}`}
              >
                <div
                  className="h-full bg-rose-500 rounded-none transition-[width] duration-75 ease-linear"
                  style={{ width: fillWidth }}
                />
              </button>
            );
          })}
        </div>
      </div>

      {/* Foreground Content Container */}
      <div className="relative z-30 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8 sm:py-12 text-left my-auto">
        <div className="max-w-xl lg:max-w-2xl space-y-3 sm:space-y-4">
          
          {/* Top Tag Kicker: Recently Hand-Knitted */}
          <div className="flex flex-wrap items-center gap-2 text-[11px] sm:text-xs font-semibold uppercase tracking-widest text-rose-300">
            <span className="w-2 h-2 bg-rose-500 rounded-none inline-block animate-pulse"></span>
            <span className="flex items-center gap-1">
              <Sparkles className="w-3.5 h-3.5 text-rose-400" />
              Recently Created in Atelier
            </span>
            <span aria-hidden="true" className="text-stone-500 hidden sm:inline">·</span>
            <span className="text-stone-300 font-mono text-[10px] sm:text-[11px] bg-stone-900/75 px-2 py-0.5 border border-stone-700">
              {currentItem.categoryLabel}
            </span>
          </div>

          {/* Product Title */}
          <h1 className="font-serif text-2xl sm:text-4xl lg:text-5xl xl:text-6xl font-bold tracking-tight text-white leading-[1.1] text-balance drop-shadow-sm">
            {currentItem.name}
          </h1>

          {/* Price & Lead time */}
          <div className="flex flex-wrap items-baseline gap-2.5 sm:gap-3 pt-0.5">
            <span className="text-xl sm:text-3xl font-bold text-rose-400 tabular-nums">
              KES {currentItem.priceKes.toLocaleString()}
            </span>
            {currentItem.originalPriceKes && (
              <span className="text-xs sm:text-base text-stone-400 line-through tabular-nums">
                KES {currentItem.originalPriceKes.toLocaleString()}
              </span>
            )}
            <span className="text-[11px] sm:text-xs bg-white/10 backdrop-blur-xs px-2.5 py-1 text-stone-200 border border-white/20 font-medium">
              {currentItem.leadTime}
            </span>
            <span className="text-[10px] sm:text-xs bg-emerald-950/80 text-emerald-300 border border-emerald-600/60 px-2 py-0.5 font-mono">
              Lipa na M-Pesa Ready
            </span>
          </div>

          {/* Product Description */}
          <p className="text-xs sm:text-sm text-stone-300 leading-relaxed font-normal line-clamp-2 sm:line-clamp-3 max-w-xl">
            {currentItem.description}
          </p>

          {/* Yarn spec */}
          <div className="text-[11px] sm:text-xs text-stone-400 font-medium flex items-center gap-2">
            <span className="truncate">Yarn Composition: {currentItem.material}</span>
          </div>

          {/* Action CTAs */}
          <div className="flex flex-col sm:flex-row sm:items-center gap-2.5 pt-2 sm:pt-3">
            <button
              onClick={() => onViewProduct(currentItem)}
              className="w-full sm:w-auto px-5 py-3 sm:py-3.5 bg-rose-700 hover:bg-rose-800 text-white text-xs sm:text-sm font-bold tracking-wide uppercase flex items-center justify-center gap-2 transition-all cursor-pointer shadow-lg active:scale-98 border border-rose-600 rounded-none min-h-[44px]"
            >
              <Eye className="w-4 h-4" />
              <span>View Product Details</span>
            </button>

            <button
              onClick={() => {
                const defaultSize = currentItem.sizes[0] || 'Standard';
                const defaultColor = currentItem.colors[0] || 'Original';
                onInstantBuy(currentItem, defaultSize, defaultColor);
              }}
              className="w-full sm:w-auto px-5 py-3 sm:py-3.5 bg-white/95 hover:bg-white text-stone-950 text-xs sm:text-sm font-bold tracking-wide uppercase flex items-center justify-center gap-2 transition-all cursor-pointer shadow-lg active:scale-98 rounded-none border border-white min-h-[44px]"
            >
              <Zap className="w-4 h-4 text-rose-700" />
              <span>Instant M-Pesa Buy</span>
            </button>

            <button
              onClick={() => {
                const defaultSize = currentItem.sizes[0] || 'Standard';
                const defaultColor = currentItem.colors[0] || 'Original';
                onQuickAdd(currentItem, defaultSize, defaultColor);
              }}
              className="hidden sm:flex p-3.5 bg-stone-900/80 hover:bg-stone-800 text-stone-200 border border-stone-700 transition-colors cursor-pointer rounded-none items-center justify-center min-h-[44px] min-w-[44px]"
              title="Add to shopping bag"
              aria-label="Add to shopping bag"
            >
              <ShoppingBag className="w-4 h-4" />
            </button>
          </div>

        </div>
      </div>

      {/* Netflix-Style Bottom Carousel Controls & Slide Thumbnails */}
      <div className="relative z-30 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 pb-4 sm:pb-6 flex flex-row items-center justify-between gap-3 pointer-events-auto">
        
        {/* Thumbnail Preview Strip */}
        <div className="flex items-center gap-2 overflow-x-auto max-w-[calc(100%-110px)] pb-1 no-scrollbar">
          {carouselItems.map((item, idx) => (
            <button
              key={item.id}
              onClick={() => goToSlide(idx)}
              className={`group flex items-center gap-2 p-1 transition-all text-left cursor-pointer border rounded-none shrink-0 ${
                idx === currentIndex
                  ? 'bg-stone-900/95 border-rose-500 shadow-md ring-1 ring-rose-500'
                  : 'bg-stone-950/70 border-stone-800 hover:border-stone-600 opacity-60 hover:opacity-100'
              }`}
            >
              <div className="w-10 h-8 sm:w-12 sm:h-9 overflow-hidden bg-stone-900 shrink-0 border border-stone-700">
                <img
                  src={item.image}
                  alt={item.name}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="hidden lg:block pr-2 max-w-32">
                <p className="text-[10px] text-stone-400 uppercase truncate font-medium">
                  {item.categoryLabel.split('&')[0]}
                </p>
                <p className="text-xs text-white font-bold truncate">
                  {item.name}
                </p>
              </div>
            </button>
          ))}
        </div>

        {/* Navigation Arrows & Counter */}
        <div className="flex items-center gap-2 shrink-0">
          <div className="text-[11px] sm:text-xs font-mono text-stone-400">
            <span className="text-white font-bold">0{currentIndex + 1}</span> / 0{carouselItems.length}
          </div>

          <div className="flex items-center gap-1">
            <button
              onClick={handlePrev}
              aria-label="Previous product"
              className="p-2 sm:p-2.5 bg-stone-900/90 hover:bg-rose-700 text-white transition-colors cursor-pointer border border-stone-700 rounded-none active:scale-95 min-h-[36px] min-w-[36px] flex items-center justify-center"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              onClick={handleNext}
              aria-label="Next product"
              className="p-2 sm:p-2.5 bg-stone-900/90 hover:bg-rose-700 text-white transition-colors cursor-pointer border border-stone-700 rounded-none active:scale-95 min-h-[36px] min-w-[36px] flex items-center justify-center"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>

      </div>

    </section>
  );
};
