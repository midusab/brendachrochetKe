import React from 'react';
import { ShoppingBag, Sparkles, Compass, ShieldCheck, Search } from 'lucide-react';

interface MobileBottomNavProps {
  cartCount: number;
  onOpenCart: () => void;
  onOpenBespoke: () => void;
  onOpenTracker: () => void;
  onToggleStudio: () => void;
  isStudioMode: boolean;
  onScrollToShop: () => void;
}

export const MobileBottomNav: React.FC<MobileBottomNavProps> = ({
  cartCount,
  onOpenCart,
  onOpenBespoke,
  onOpenTracker,
  onToggleStudio,
  isStudioMode,
  onScrollToShop,
}) => {
  return (
    <div className="md:hidden fixed bottom-0 inset-x-0 z-40 bg-white/95 backdrop-blur-md border-t border-rose-200 shadow-lg px-2 py-2 rounded-none">
      <div className="grid grid-cols-5 gap-1 text-center">
        
        <button
          onClick={onScrollToShop}
          className="flex flex-col items-center justify-center py-1 text-stone-600 hover:text-rose-700 transition-colors rounded-none"
        >
          <Compass className="w-5 h-5" />
          <span className="text-[10px] font-medium mt-0.5">Collection</span>
        </button>

        <button
          onClick={onOpenBespoke}
          className="flex flex-col items-center justify-center py-1 text-stone-600 hover:text-rose-700 transition-colors rounded-none"
        >
          <Sparkles className="w-5 h-5 text-rose-600" />
          <span className="text-[10px] font-medium mt-0.5">Bespoke</span>
        </button>

        <button
          onClick={onOpenCart}
          className="flex flex-col items-center justify-center py-1 relative text-stone-900 hover:text-rose-700 transition-colors rounded-none"
        >
          <div className="relative">
            <ShoppingBag className="w-5 h-5" />
            {cartCount > 0 && (
              <span className="absolute -top-1 -right-2 bg-rose-600 text-white text-[9px] font-bold rounded-none w-4 h-4 flex items-center justify-center">
                {cartCount}
              </span>
            )}
          </div>
          <span className="text-[10px] font-bold mt-0.5">Bag</span>
        </button>

        <button
          onClick={onOpenTracker}
          className="flex flex-col items-center justify-center py-1 text-stone-600 hover:text-rose-700 transition-colors rounded-none"
        >
          <Search className="w-5 h-5" />
          <span className="text-[10px] font-medium mt-0.5">Track</span>
        </button>

        <button
          onClick={onToggleStudio}
          className={`flex flex-col items-center justify-center py-1 rounded-none transition-colors ${
            isStudioMode ? 'text-rose-700 font-bold' : 'text-stone-600 hover:text-rose-700'
          }`}
        >
          <ShieldCheck className="w-5 h-5" />
          <span className="text-[10px] font-medium mt-0.5">Studio</span>
        </button>

      </div>
    </div>
  );
};
