import React, { useState } from 'react';
import { ShoppingBag, Sparkles, Compass, ShieldCheck } from 'lucide-react';

interface HeaderProps {
  cartCount: number;
  onOpenCart: () => void;
  onOpenBespoke: () => void;
  onOpenTracker: () => void;
  isStudioMode: boolean;
  onToggleStudioMode: () => void;
  activeCategory: string;
  onSelectCategory: (category: any) => void;
}

export const Header: React.FC<HeaderProps> = ({
  cartCount,
  onOpenCart,
  onOpenBespoke,
  onOpenTracker,
  isStudioMode,
  onToggleStudioMode,
  onSelectCategory,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <>
      {/* Top micro banner for delivery highlight */}
      <div className="bg-rose-950 text-rose-100 text-[11px] sm:text-xs py-1.5 px-4 text-center tracking-wider font-medium flex items-center justify-center gap-2 rounded-none">
        <span>Handcrafted in Nairobi</span>
        <span aria-hidden="true" className="text-rose-400">·</span>
        <span>Instant Lipa na M-Pesa Checkout</span>
        <span aria-hidden="true" className="text-rose-400">·</span>
        <span className="hidden sm:inline">Complimentary delivery for orders over KES 10,000</span>
      </div>

      {/* Top Bar Contract: 3 distinct zones separated by gap-8 */}
      <header className="sticky top-0 z-40 bg-[#FAF7F5]/95 backdrop-blur-md border-b border-rose-100/80 transition-all duration-200 rounded-none">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-18 flex items-center justify-between gap-8">
          
          {/* Zone 1: Single text element wordmark */}
          <div className="flex items-center gap-3 shrink-0">
            <button
              onClick={() => {
                onSelectCategory('all');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="text-left group cursor-pointer"
            >
              <span className="font-serif text-2xl sm:text-3xl font-bold tracking-tight text-stone-900 group-hover:text-rose-700 transition-colors whitespace-nowrap block">
                Brenda Crochets
              </span>
            </button>
          </div>

          {/* Zone 2: 4-5 clean single-line text navigation links */}
          <nav className="hidden md:flex items-center gap-7 text-sm font-medium text-stone-600">
            <button
              onClick={() => {
                onSelectCategory('sweaters');
                const el = document.getElementById('collection-section');
                el?.scrollIntoView({ behavior: 'smooth' });
              }}
              className="hover:text-rose-700 transition-colors whitespace-nowrap shrink-0 cursor-pointer"
            >
              Sweaters & Cardigans
            </button>
            <button
              onClick={() => {
                onSelectCategory('dresses');
                const el = document.getElementById('collection-section');
                el?.scrollIntoView({ behavior: 'smooth' });
              }}
              className="hover:text-rose-700 transition-colors whitespace-nowrap shrink-0 cursor-pointer"
            >
              Dresses
            </button>
            <button
              onClick={() => {
                onSelectCategory('children');
                const el = document.getElementById('collection-section');
                el?.scrollIntoView({ behavior: 'smooth' });
              }}
              className="hover:text-rose-700 transition-colors whitespace-nowrap shrink-0 cursor-pointer"
            >
              Children & Baby
            </button>
            <button
              onClick={onOpenBespoke}
              className="hover:text-rose-700 transition-colors whitespace-nowrap shrink-0 flex items-center gap-1.5 cursor-pointer text-rose-800 font-semibold"
            >
              <Sparkles className="w-3.5 h-3.5 text-rose-500" />
              <span>Bespoke Order</span>
            </button>
            <button
              onClick={onOpenTracker}
              className="hover:text-stone-900 transition-colors whitespace-nowrap shrink-0 text-stone-500 cursor-pointer"
            >
              Track Order
            </button>
          </nav>

          {/* Zone 3: 1 primary action cluster */}
          <div className="flex items-center gap-3 shrink-0">
            {/* Brenda's Studio mode toggle button */}
            <button
              onClick={onToggleStudioMode}
              title="Post products & manage orders"
              className={`hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-none border transition-all cursor-pointer whitespace-nowrap ${
                isStudioMode
                  ? 'bg-rose-700 text-white border-rose-700 shadow-sm'
                  : 'bg-stone-50 text-stone-700 border-stone-200 hover:border-rose-300 hover:text-rose-800'
              }`}
            >
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>{isStudioMode ? "Storefront View" : "Brenda's Studio"}</span>
            </button>

            {/* Shopping Bag CTA */}
            <button
              onClick={onOpenCart}
              aria-label={`Shopping bag with ${cartCount} items`}
              className="relative flex items-center gap-2 px-3.5 py-2 text-xs font-semibold rounded-none bg-stone-900 text-white hover:bg-rose-700 transition-colors cursor-pointer shadow-sm active:scale-95"
            >
              <ShoppingBag className="w-4 h-4" />
              <span className="hidden sm:inline">Bag</span>
              {cartCount > 0 ? (
                <span className="bg-rose-500 text-white text-[11px] font-bold px-1.5 py-0.2 rounded-none min-w-4 text-center">
                  {cartCount}
                </span>
              ) : (
                <span className="text-stone-400 font-normal hidden sm:inline">(0)</span>
              )}
            </button>

            {/* Mobile menu hamburger toggle */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 text-stone-700 hover:text-rose-700 rounded-none hover:bg-stone-100 cursor-pointer"
              aria-label="Toggle menu"
            >
              <Compass className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Mobile menu dropdown */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t border-rose-100 bg-[#FAF7F5] px-4 pt-3 pb-4 space-y-2.5 rounded-none animate-in fade-in slide-in-from-top-2">
            <div className="flex flex-col gap-2 text-sm font-medium text-stone-700">
              <button
                onClick={() => {
                  onSelectCategory('all');
                  setMobileMenuOpen(false);
                }}
                className="text-left py-1.5 px-2 hover:bg-rose-50 rounded-none text-stone-900 font-semibold"
              >
                All Crochet Collections
              </button>
              <button
                onClick={() => {
                  onSelectCategory('sweaters');
                  setMobileMenuOpen(false);
                }}
                className="text-left py-1.5 px-2 hover:bg-rose-50 rounded-none"
              >
                Sweaters & Chunky Cardigans
              </button>
              <button
                onClick={() => {
                  onSelectCategory('dresses');
                  setMobileMenuOpen(false);
                }}
                className="text-left py-1.5 px-2 hover:bg-rose-50 rounded-none"
              >
                Knit Dresses & Two-Pieces
              </button>
              <button
                onClick={() => {
                  onSelectCategory('tops');
                  setMobileMenuOpen(false);
                }}
                className="text-left py-1.5 px-2 hover:bg-rose-50 rounded-none"
              >
                Summer Crop Tops & Halters
              </button>
              <button
                onClick={() => {
                  onSelectCategory('children');
                  setMobileMenuOpen(false);
                }}
                className="text-left py-1.5 px-2 hover:bg-rose-50 rounded-none"
              >
                Children & Baby Sets
              </button>
              <button
                onClick={() => {
                  onSelectCategory('accessories');
                  setMobileMenuOpen(false);
                }}
                className="text-left py-1.5 px-2 hover:bg-rose-50 rounded-none"
              >
                Crochet Bags & Bucket Hats
              </button>
              <button
                onClick={() => {
                  onOpenBespoke();
                  setMobileMenuOpen(false);
                }}
                className="text-left py-1.5 px-2 hover:bg-rose-50 rounded-none text-rose-700 font-semibold flex items-center gap-2"
              >
                <Sparkles className="w-4 h-4" />
                Custom Made-to-Measure Commission
              </button>
              <button
                onClick={() => {
                  onOpenTracker();
                  setMobileMenuOpen(false);
                }}
                className="text-left py-1.5 px-2 hover:bg-rose-50 rounded-none text-stone-600"
              >
                Track Existing Order
              </button>
              <div className="pt-2 border-t border-rose-100">
                <button
                  onClick={() => {
                    onToggleStudioMode();
                    setMobileMenuOpen(false);
                  }}
                  className="w-full text-center py-2 px-3 text-xs font-semibold rounded-none bg-rose-100 text-rose-800 hover:bg-rose-200"
                >
                  {isStudioMode ? "Return to Storefront" : "Brenda's Studio (Post Products / Orders)"}
                </button>
              </div>
            </div>
          </div>
        )}
      </header>
    </>
  );
};
