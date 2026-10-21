import React, { useState, useEffect } from 'react';
import { Product } from '../types';
import { ChevronLeft, ChevronRight, ShoppingBag, Eye, Sparkles, Zap } from 'lucide-react';

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
  // Use the top 4-5 featured/recent creations
  const carouselItems = products.slice(0, 5);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  // Auto-advance carousel every 6 seconds if not hovered/paused
  useEffect(() => {
    if (isPaused || carouselItems.length <= 1) return;

    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % carouselItems.length);
    }, 6000);

    return () => clearInterval(timer);
  }, [isPaused, carouselItems.length]);

  if (carouselItems.length === 0) return null;

  const currentItem = carouselItems[currentIndex];

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev - 1 + carouselItems.length) % carouselItems.length);
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % carouselItems.length);
  };

  return (
    <section 
      className="relative w-full h-[520px] sm:h-[600px] lg:h-[660px] overflow-hidden bg-stone-950 text-white rounded-none select-none"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      {/* Background Image Stage with smooth fade & Ken-Burns style slow motion */}
      {carouselItems.map((item, index) => (
        <div
          key={item.id}
          className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
            index === currentIndex ? 'opacity-100 z-10' : 'opacity-0 z-0'
          }`}
        >
          <img
            src={item.image}
            alt={item.name}
            className={`w-full h-full object-cover object-center transition-transform duration-7000 ease-out ${
              index === currentIndex ? 'scale-105' : 'scale-100'
            }`}
            referrerPolicy="no-referrer"
          />
        </div>
      ))}

      {/* Netflix Cinematic Scrim Overlays */}
      {/* 1. Left to right horizontal gradient so text is razor sharp */}
      <div className="absolute inset-0 z-20 bg-gradient-to-r from-stone-950 via-stone-950/80 to-transparent pointer-events-none" />
      {/* 2. Top header fade */}
      <div className="absolute inset-x-0 top-0 h-32 z-20 bg-gradient-to-b from-stone-950/70 to-transparent pointer-events-none" />
      {/* 3. Bottom blend gradient into page content */}
      <div className="absolute inset-x-0 bottom-0 h-44 z-20 bg-gradient-to-t from-stone-950 via-stone-950/60 to-transparent pointer-events-none" />

      {/* Foreground Content Container */}
      <div className="relative z-30 max-w-7xl mx-auto h-full px-4 sm:px-6 lg:px-8 flex flex-col justify-center text-left">
        <div className="max-w-xl lg:max-w-2xl space-y-4 pt-12 sm:pt-0">
          
          {/* Top Tag Kicker */}
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-rose-300">
            <span className="w-2 h-2 bg-rose-500 rounded-none inline-block"></span>
            <span>Recently Hand-Knitted in Atelier</span>
            <span aria-hidden="true" className="text-stone-500">·</span>
            <span className="text-stone-300 font-mono text-[11px]">{currentItem.categoryLabel}</span>
          </div>

          {/* Product Title */}
          <h1 className="font-serif text-3xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-white leading-[1.08] text-balance drop-shadow-sm">
            {currentItem.name}
          </h1>

          {/* Price & Lead time */}
          <div className="flex flex-wrap items-baseline gap-3 pt-1">
            <span className="text-2xl sm:text-3xl font-bold text-rose-400 tabular-nums">
              KES {currentItem.priceKes.toLocaleString()}
            </span>
            {currentItem.originalPriceKes && (
              <span className="text-sm sm:text-base text-stone-400 line-through tabular-nums">
                KES {currentItem.originalPriceKes.toLocaleString()}
              </span>
            )}
            <span className="text-xs bg-white/10 backdrop-blur-xs px-2.5 py-1 text-stone-200 border border-white/20 font-medium">
              {currentItem.leadTime}
            </span>
          </div>

          {/* Product Description */}
          <p className="text-sm sm:text-base text-stone-300 leading-relaxed font-normal line-clamp-3 max-w-xl">
            {currentItem.description}
          </p>

          {/* Material note */}
          <div className="text-xs text-stone-400 font-medium flex items-center gap-2">
            <span>Yarn: {currentItem.material}</span>
            <span aria-hidden="true">·</span>
            <span>Handmade by Brenda</span>
          </div>

          {/* CTAs */}
          <div className="flex flex-wrap items-center gap-3 pt-3">
            <button
              onClick={() => onViewProduct(currentItem)}
              className="px-6 py-3.5 bg-rose-700 hover:bg-rose-800 text-white text-xs sm:text-sm font-bold tracking-wide uppercase flex items-center gap-2 transition-all cursor-pointer shadow-lg active:scale-98 border border-rose-600 rounded-none"
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
              className="px-5 py-3.5 bg-white/90 hover:bg-white text-stone-950 text-xs sm:text-sm font-bold tracking-wide uppercase flex items-center gap-2 transition-all cursor-pointer shadow-lg active:scale-98 rounded-none border border-white"
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
              className="p-3.5 bg-stone-900/80 hover:bg-stone-800 text-stone-200 border border-stone-700 transition-colors cursor-pointer rounded-none"
              title="Add to shopping bag"
            >
              <ShoppingBag className="w-4 h-4" />
            </button>
          </div>

        </div>
      </div>

      {/* Netflix-Style Bottom Carousel Controls & Slide Bar */}
      <div className="absolute bottom-6 left-4 right-4 sm:left-8 sm:right-8 z-30 flex flex-col sm:flex-row sm:items-end justify-between gap-4 pointer-events-auto">
        
        {/* Thumbnail Preview Strip */}
        <div className="flex items-center gap-2 overflow-x-auto max-w-full pb-1 no-scrollbar">
          {carouselItems.map((item, idx) => (
            <button
              key={item.id}
              onClick={() => setCurrentIndex(idx)}
              className={`group flex items-center gap-2 p-1.5 transition-all text-left cursor-pointer border rounded-none ${
                idx === currentIndex
                  ? 'bg-stone-900/90 border-rose-500 shadow-md ring-1 ring-rose-500'
                  : 'bg-stone-950/70 border-stone-800 hover:border-stone-600 opacity-60 hover:opacity-100'
              }`}
            >
              <div className="w-12 h-10 sm:w-14 sm:h-11 overflow-hidden bg-stone-900 shrink-0 border border-stone-700">
                <img
                  src={item.image}
                  alt={item.name}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="hidden md:block pr-2 max-w-36">
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
        <div className="flex items-center gap-3 self-end sm:self-auto shrink-0">
          <div className="text-xs font-mono text-stone-400">
            <span className="text-white font-bold">0{currentIndex + 1}</span> / 0{carouselItems.length}
          </div>

          <div className="flex items-center gap-1">
            <button
              onClick={handlePrev}
              aria-label="Previous product"
              className="p-2.5 bg-stone-900/90 hover:bg-rose-700 text-white transition-colors cursor-pointer border border-stone-700 rounded-none active:scale-95"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              onClick={handleNext}
              aria-label="Next product"
              className="p-2.5 bg-stone-900/90 hover:bg-rose-700 text-white transition-colors cursor-pointer border border-stone-700 rounded-none active:scale-95"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>

      </div>

    </section>
  );
};
