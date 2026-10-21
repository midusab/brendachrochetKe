import React, { useState } from 'react';
import { Product } from '../types';
import { Eye, ShoppingBag, Check } from 'lucide-react';

interface ProductCardProps {
  product: Product;
  onOpenDetails: (product: Product) => void;
  onQuickAdd: (product: Product, size: string, color: string) => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({
  product,
  onOpenDetails,
  onQuickAdd,
}) => {
  const [imageLoaded, setImageLoaded] = useState(false);
  const [isAdding, setIsAdding] = useState(false);
  const [addedSuccess, setAddedSuccess] = useState(false);

  const handleQuickAddClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsAdding(true);
    const defaultSize = product.sizes[0] || 'Standard';
    const defaultColor = product.colors[0] || 'Original';
    onQuickAdd(product, defaultSize, defaultColor);
    
    setTimeout(() => {
      setIsAdding(false);
      setAddedSuccess(true);
      setTimeout(() => setAddedSuccess(false), 1600);
    }, 250);
  };

  return (
    <article
      onClick={() => onOpenDetails(product)}
      className="group relative flex flex-col bg-white rounded-none overflow-hidden border border-rose-100/80 hover:border-rose-400 transition-all duration-300 hover:shadow-md cursor-pointer"
    >
      {/* Product Image Stage (65-75% height) */}
      <div className="relative aspect-4/3 sm:aspect-square bg-[#FDF8F7] overflow-hidden rounded-none">
        <img
          src={product.image}
          alt={product.name}
          onLoad={() => setImageLoaded(true)}
          className={`w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out rounded-none ${
            imageLoaded ? 'opacity-100' : 'opacity-0'
          }`}
          referrerPolicy="no-referrer"
        />

        {/* Fallback placeholder while loading or error */}
        {!imageLoaded && (
          <div className="absolute inset-0 bg-[#F5EFEB] flex items-center justify-center text-xs text-stone-400 font-medium rounded-none">
            Handcrafted with wool...
          </div>
        )}

        {/* In-stock / limited run marker */}
        <div className="absolute top-3 left-3 flex items-center gap-1.5 text-[11px] font-medium text-stone-700 bg-white/95 backdrop-blur-xs px-2 py-0.5 rounded-none shadow-2xs border border-stone-200/60">
          <span className="w-1.5 h-1.5 rounded-none bg-emerald-500"></span>
          <span>{product.inStock ? 'Available' : 'Custom Order'}</span>
        </div>

        {/* Quick actions overlay - Always visible on touch screens, hover-reveal on desktop */}
        <div className="absolute inset-x-2.5 bottom-2.5 flex items-center justify-between gap-1.5 opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity duration-200">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onOpenDetails(product);
            }}
            className="flex-1 py-2 px-3 bg-white/95 backdrop-blur-xs hover:bg-white text-stone-800 text-xs font-semibold rounded-none shadow-sm border border-stone-200 flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
          >
            <Eye className="w-3.5 h-3.5 text-stone-600" />
            <span>Details</span>
          </button>

          <button
            onClick={handleQuickAddClick}
            disabled={isAdding}
            className="flex-1 py-2 px-3 bg-rose-700 hover:bg-rose-800 text-white text-xs font-semibold rounded-none shadow-sm flex items-center justify-center gap-1.5 transition-colors cursor-pointer active:scale-95"
          >
            {addedSuccess ? (
              <>
                <Check className="w-3.5 h-3.5" />
                <span>Added</span>
              </>
            ) : (
              <>
                <ShoppingBag className="w-3.5 h-3.5" />
                <span>Quick Add</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Card Content & Metadata */}
      <div className="p-4 flex flex-col flex-1 justify-between bg-white rounded-none">
        <div>
          {/* Category & Material Kicker */}
          <div className="flex items-center gap-2 text-xs text-rose-800 font-medium tracking-wide">
            <span className="uppercase text-[11px] font-semibold">{product.categoryLabel.split('&')[0]}</span>
            <span aria-hidden="true" className="text-stone-300">·</span>
            <span className="text-stone-500 truncate text-[11px]">{product.material.split(',')[0]}</span>
          </div>

          {/* Product Name */}
          <h3 className="font-serif text-lg font-bold text-stone-900 group-hover:text-rose-800 transition-colors mt-1.5 line-clamp-1">
            {product.name}
          </h3>

          {/* Short note */}
          <p className="text-xs text-stone-500 mt-1 line-clamp-2 leading-relaxed">
            {product.description}
          </p>
        </div>

        {/* Price & Size overview */}
        <div className="pt-3 mt-3 border-t border-stone-100 flex items-center justify-between">
          <div className="flex items-baseline gap-2">
            <span className="text-stone-900 font-bold text-base tabular-nums">
              KES {product.priceKes.toLocaleString()}
            </span>
            {product.originalPriceKes && (
              <span className="text-xs text-stone-400 line-through tabular-nums">
                KES {product.originalPriceKes.toLocaleString()}
              </span>
            )}
          </div>

          <span className="text-[11px] text-stone-400 font-medium">
            {product.sizes.length} sizes
          </span>
        </div>
      </div>
    </article>
  );
};
