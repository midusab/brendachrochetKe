import React, { useState, useEffect } from 'react';
import { Product } from '../types';
import { 
  ArrowLeft, 
  ShoppingBag, 
  Zap, 
  Check, 
  Sparkles, 
  Ruler, 
  Truck, 
  ShieldCheck, 
  Heart, 
  Share2,
  ChevronRight
} from 'lucide-react';

interface ProductDetailPageProps {
  product: Product;
  allProducts: Product[];
  onBack: () => void;
  onAddToCart: (product: Product, size: string, color: string, quantity: number) => void;
  onDirectBuy: (product: Product, size: string, color: string, quantity: number) => void;
  onSelectRelated: (product: Product) => void;
  onOpenBespoke: () => void;
}

export const ProductDetailPage: React.FC<ProductDetailPageProps> = ({
  product,
  allProducts,
  onBack,
  onAddToCart,
  onDirectBuy,
  onSelectRelated,
  onOpenBespoke,
}) => {
  const [selectedSize, setSelectedSize] = useState<string>(product.sizes[0] || 'Standard');
  const [selectedColor, setSelectedColor] = useState<string>(product.colors[0] || 'Original');
  const [quantity, setQuantity] = useState<number>(1);
  const [addedNotice, setAddedNotice] = useState(false);
  const [copiedShare, setCopiedShare] = useState(false);

  // When product changes, reset defaults
  useEffect(() => {
    setSelectedSize(product.sizes[0] || 'Standard');
    setSelectedColor(product.colors[0] || 'Original');
    setQuantity(1);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [product.id]);

  const handleAdd = () => {
    onAddToCart(product, selectedSize, selectedColor, quantity);
    setAddedNotice(true);
    setTimeout(() => setAddedNotice(false), 2200);
  };

  const handleBuyNow = () => {
    onDirectBuy(product, selectedSize, selectedColor, quantity);
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: product.name,
        text: `Check out ${product.name} on Brenda Crochets!`,
        url: window.location.href,
      }).catch(() => {});
    } else {
      navigator.clipboard.writeText(window.location.href);
      setCopiedShare(true);
      setTimeout(() => setCopiedShare(false), 2000);
    }
  };

  // Related products from same category or collection
  const relatedProducts = allProducts
    .filter((p) => p.id !== product.id)
    .slice(0, 3);

  return (
    <div className="bg-[#FAF7F5] min-h-screen text-stone-900 pb-28 md:pb-20">
      
      {/* Navigation Breadcrumb Bar */}
      <div className="border-b border-rose-200/80 bg-white/80 sticky top-18 z-20 backdrop-blur-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex items-center justify-between text-xs">
          
          <div className="flex items-center gap-1.5 sm:gap-2 text-stone-500 overflow-x-auto whitespace-nowrap no-scrollbar py-0.5">
            <button
              onClick={onBack}
              className="text-stone-800 hover:text-rose-700 font-bold flex items-center gap-1.5 cursor-pointer shrink-0"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Catalog</span>
            </button>
            <ChevronRight className="w-3 h-3 text-stone-300 shrink-0" />
            <span className="text-stone-600 truncate max-w-28 sm:max-w-none">{product.categoryLabel.split('&')[0]}</span>
            <ChevronRight className="w-3 h-3 text-stone-300 shrink-0" />
            <span className="text-stone-900 font-semibold truncate max-w-32 sm:max-w-xs">{product.name}</span>
          </div>

          <button
            onClick={handleShare}
            className="flex items-center gap-1.5 text-xs text-stone-600 hover:text-rose-700 font-medium cursor-pointer shrink-0 ml-2 py-1 px-2 hover:bg-stone-100"
          >
            <Share2 className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">{copiedShare ? 'Link Copied!' : 'Share'}</span>
          </button>
        </div>
      </div>

      {/* Main Product Details Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8 lg:gap-12">
          
          {/* Left Column: High-Res Imagery Gallery (lg:col-span-7) */}
          <div className="lg:col-span-7 space-y-4">
            <div className="relative aspect-4/3 sm:aspect-square bg-white border border-rose-200 shadow-sm overflow-hidden rounded-none group">
              <img
                src={product.image}
                alt={product.name}
                className="w-full h-full object-cover group-hover:scale-102 transition-transform duration-700 ease-out rounded-none"
                referrerPolicy="no-referrer"
              />
              <div className="absolute top-3 left-3 sm:top-4 sm:left-4 bg-stone-900 text-white text-[10px] sm:text-[11px] font-mono tracking-wider px-2.5 py-1 uppercase rounded-none border border-stone-800">
                Handcrafted Slow Fashion
              </div>
              <div className="absolute top-3 right-3 sm:top-4 sm:right-4 bg-white/95 backdrop-blur-xs text-stone-800 text-[10px] sm:text-[11px] font-medium px-2 py-0.5 rounded-none border border-stone-200 shadow-2xs">
                {product.inStock ? 'Available to Order' : 'Custom Request'}
              </div>
            </div>

            {/* Artisan Assurance Bar - Responsive grid */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 sm:gap-3 text-xs text-stone-700">
              <div className="bg-white p-3 sm:p-3.5 border border-rose-200 rounded-none text-left space-y-0.5">
                <p className="font-bold text-stone-900 text-xs">Zero Scraps</p>
                <p className="text-[11px] text-stone-500">100% yarn utilized without fabric waste</p>
              </div>
              <div className="bg-white p-3 sm:p-3.5 border border-rose-200 rounded-none text-left space-y-0.5">
                <p className="font-bold text-stone-900 text-xs">Natural Fibers</p>
                <p className="text-[11px] text-stone-500">Kenyan organic cotton & soft merino</p>
              </div>
              <div className="bg-white p-3 sm:p-3.5 border border-rose-200 rounded-none text-left space-y-0.5">
                <p className="font-bold text-stone-900 text-xs">M-Pesa Verified</p>
                <p className="text-[11px] text-stone-500">Instant STK push & SMS receipt</p>
              </div>
            </div>
          </div>

          {/* Right Column: Purchase Module (lg:col-span-5) */}
          <div className="lg:col-span-5 flex flex-col justify-between space-y-6 text-left">
            
            <div className="space-y-5">
              
              {/* Category & Material Header */}
              <div className="space-y-1">
                <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-rose-800">
                  <span>{product.categoryLabel}</span>
                  <span aria-hidden="true" className="text-stone-300">·</span>
                  <span className="text-stone-500 truncate">{product.material.split(',')[0]}</span>
                </div>

                <h1 className="font-serif text-2xl sm:text-3xl lg:text-4xl font-bold text-stone-900 leading-tight">
                  {product.name}
                </h1>
              </div>

              {/* Price Banner */}
              <div className="flex flex-wrap items-baseline gap-3 pb-3 border-b border-rose-200">
                <span className="text-2xl sm:text-3xl font-bold text-stone-900 tabular-nums">
                  KES {product.priceKes.toLocaleString()}
                </span>
                {product.originalPriceKes && (
                  <span className="text-sm sm:text-base text-stone-400 line-through tabular-nums">
                    KES {product.originalPriceKes.toLocaleString()}
                  </span>
                )}
                <span className="text-[11px] sm:text-xs bg-rose-50 text-rose-800 px-2 py-0.5 border border-rose-200 font-semibold">
                  Taxes Included
                </span>
              </div>

              {/* Story & Description */}
              <p className="text-stone-600 text-xs sm:text-sm leading-relaxed">
                {product.description}
              </p>

              {/* Technical Stitch & Yarn Breakdown */}
              <div className="bg-white border border-stone-200 p-3.5 sm:p-4 space-y-2 text-xs">
                <div className="flex justify-between border-b border-stone-100 pb-1.5">
                  <span className="text-stone-500 font-medium">Yarn Material:</span>
                  <span className="font-semibold text-stone-900 text-right">{product.material}</span>
                </div>
                {product.stitchType && (
                  <div className="flex justify-between border-b border-stone-100 pb-1.5">
                    <span className="text-stone-500 font-medium">Stitch Pattern:</span>
                    <span className="font-semibold text-stone-900 text-right">{product.stitchType}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span className="text-stone-500 font-medium">Atelier Readiness:</span>
                  <span className="font-semibold text-rose-800 text-right">{product.leadTime}</span>
                </div>
              </div>

              {/* Size Selector - Touch friendly min-h 44px */}
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs font-semibold text-stone-800">
                  <span>Choose Fit / Size:</span>
                  <button 
                    onClick={onOpenBespoke}
                    className="text-rose-700 hover:underline flex items-center gap-1 cursor-pointer"
                  >
                    <Ruler className="w-3.5 h-3.5" />
                    <span>Custom Measurements?</span>
                  </button>
                </div>
                <div className="grid grid-cols-2 sm:flex sm:flex-wrap gap-2">
                  {product.sizes.map((size) => (
                    <button
                      key={size}
                      onClick={() => setSelectedSize(size)}
                      className={`min-h-[44px] px-3 py-2 text-xs font-medium border transition-all cursor-pointer rounded-none flex items-center justify-center text-center ${
                        selectedSize === size
                          ? 'border-rose-700 bg-rose-50 text-rose-900 font-bold ring-1 ring-rose-700'
                          : 'border-stone-300 text-stone-700 hover:border-stone-500 bg-white'
                      }`}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>

              {/* Color Combinations - Touch friendly min-h 44px */}
              <div className="space-y-2">
                <div className="text-xs font-semibold text-stone-800">
                  <span>Yarn Color Combination:</span>
                </div>
                <div className="grid grid-cols-1 sm:flex sm:flex-wrap gap-2">
                  {product.colors.map((color) => (
                    <button
                      key={color}
                      onClick={() => setSelectedColor(color)}
                      className={`min-h-[44px] px-3.5 py-2 text-xs font-medium border transition-all cursor-pointer rounded-none flex items-center justify-center text-center ${
                        selectedColor === color
                          ? 'border-rose-700 bg-rose-50 text-rose-900 font-bold ring-1 ring-rose-700'
                          : 'border-stone-300 text-stone-700 hover:border-stone-500 bg-white'
                      }`}
                    >
                      {color}
                    </button>
                  ))}
                </div>
              </div>

              {/* Quantity Stepper */}
              <div className="flex items-center gap-4 pt-1">
                <span className="text-xs font-semibold text-stone-800">Quantity:</span>
                <div className="flex items-center border border-stone-300 bg-white rounded-none">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="min-h-[40px] px-4 py-1.5 text-stone-600 hover:bg-stone-100 transition-colors text-base"
                    aria-label="Decrease quantity"
                  >
                    -
                  </button>
                  <span className="px-4 py-1.5 text-xs font-bold tabular-nums text-stone-900">
                    {quantity}
                  </span>
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    className="min-h-[40px] px-4 py-1.5 text-stone-600 hover:bg-stone-100 transition-colors text-base"
                    aria-label="Increase quantity"
                  >
                    +
                  </button>
                </div>
              </div>

            </div>

            {/* Desktop Action Buttons */}
            <div className="pt-6 border-t border-rose-200 space-y-3">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <button
                  onClick={handleAdd}
                  className="w-full min-h-[48px] py-3.5 px-4 bg-stone-900 hover:bg-stone-800 text-white font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition-colors cursor-pointer shadow-md rounded-none border border-stone-900 active:scale-98"
                >
                  {addedNotice ? (
                    <>
                      <Check className="w-4 h-4 text-emerald-400" />
                      <span>Added to Bag!</span>
                    </>
                  ) : (
                    <>
                      <ShoppingBag className="w-4 h-4" />
                      <span>Add to Bag</span>
                    </>
                  )}
                </button>

                <button
                  onClick={handleBuyNow}
                  className="w-full min-h-[48px] py-3.5 px-4 bg-rose-700 hover:bg-rose-800 text-white font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition-colors cursor-pointer shadow-md rounded-none border border-rose-600 active:scale-98"
                >
                  <Zap className="w-4 h-4 text-amber-300" />
                  <span>Instant M-Pesa Buy</span>
                </button>
              </div>

              {/* Delivery & Care Information */}
              <div className="bg-white p-3.5 sm:p-4 border border-rose-200 space-y-2 text-xs text-stone-600 rounded-none">
                <div className="flex items-start gap-2">
                  <Truck className="w-4 h-4 text-rose-700 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold text-stone-900">Kenya Delivery:</span>{' '}
                    <span>Doorstep Express Rider (24h · KES 150-300), County Express Courier (48h · KES 500 via G4S/Wells Fargo).</span>
                  </div>
                </div>

                <div className="flex items-start gap-2 pt-1 border-t border-stone-100">
                  <Heart className="w-4 h-4 text-rose-700 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold text-stone-900">Care Instruction:</span>{' '}
                    <span>{product.careGuide}</span>
                  </div>
                </div>
              </div>

            </div>

          </div>

        </div>

        {/* Related Creations from Brenda */}
        {relatedProducts.length > 0 && (
          <div className="mt-14 pt-10 border-t border-rose-200">
            <div className="flex items-center justify-between mb-6">
              <div>
                <span className="text-xs uppercase font-semibold text-rose-800 tracking-wider">
                  Complete the Wardrobe
                </span>
                <h3 className="font-serif text-xl sm:text-2xl font-bold text-stone-900">
                  More Pieces You'll Adore
                </h3>
              </div>
              <button
                onClick={onBack}
                className="text-xs font-semibold text-rose-700 hover:underline"
              >
                View Catalog →
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6">
              {relatedProducts.map((rel) => (
                <div
                  key={rel.id}
                  onClick={() => onSelectRelated(rel)}
                  className="bg-white border border-rose-200 overflow-hidden cursor-pointer group rounded-none hover:border-rose-400 transition-all hover:shadow-md"
                >
                  <div className="aspect-4/3 overflow-hidden bg-stone-100">
                    <img
                      src={rel.image}
                      alt={rel.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 rounded-none"
                    />
                  </div>
                  <div className="p-3.5 sm:p-4 space-y-1">
                    <p className="text-[11px] font-semibold text-rose-800 uppercase tracking-wide">
                      {rel.categoryLabel.split('&')[0]}
                    </p>
                    <h4 className="font-serif font-bold text-stone-900 text-sm group-hover:text-rose-700 transition-colors line-clamp-1">
                      {rel.name}
                    </h4>
                    <p className="text-xs font-bold text-stone-900 tabular-nums pt-0.5">
                      KES {rel.priceKes.toLocaleString()}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

      </div>

      {/* Mobile Sticky Bottom Purchase Bar (Displays on mobile for seamless checkout without scrolling) */}
      <div className="lg:hidden fixed bottom-14 inset-x-0 z-30 bg-white/95 backdrop-blur-md border-t border-rose-200 p-3 shadow-lg flex items-center justify-between gap-3">
        <div className="text-left shrink-0">
          <p className="text-[11px] text-stone-500 line-clamp-1 max-w-32">{product.name}</p>
          <p className="font-bold text-stone-900 text-sm tabular-nums">KES {product.priceKes.toLocaleString()}</p>
        </div>

        <div className="flex items-center gap-2 flex-1 justify-end">
          <button
            onClick={handleAdd}
            className="px-3.5 py-2.5 bg-stone-900 text-white text-xs font-bold rounded-none uppercase tracking-wider flex items-center justify-center gap-1.5 shadow-sm active:scale-95"
          >
            {addedNotice ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <ShoppingBag className="w-3.5 h-3.5" />}
            <span className="hidden xs:inline">Bag</span>
          </button>

          <button
            onClick={handleBuyNow}
            className="px-4 py-2.5 bg-rose-700 text-white text-xs font-bold rounded-none uppercase tracking-wider flex items-center justify-center gap-1.5 shadow-sm active:scale-95"
          >
            <Zap className="w-3.5 h-3.5 text-amber-300" />
            <span>Buy via M-Pesa</span>
          </button>
        </div>
      </div>

    </div>
  );
};
