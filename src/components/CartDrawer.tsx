import React from 'react';
import { CartItem, DeliveryZone } from '../types';
import { DELIVERY_ZONES, FREE_DELIVERY_THRESHOLD_KES } from '../data/deliveryZones';
import { X, Trash2, ShoppingBag, ArrowRight, Truck, ShieldCheck } from 'lucide-react';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  items: CartItem[];
  onUpdateQuantity: (id: string, delta: number) => void;
  onRemoveItem: (id: string) => void;
  selectedZone: DeliveryZone;
  onSelectZone: (zone: DeliveryZone) => void;
  onProceedToCheckout: () => void;
}

export const CartDrawer: React.FC<CartDrawerProps> = ({
  isOpen,
  onClose,
  items,
  onUpdateQuantity,
  onRemoveItem,
  selectedZone,
  onSelectZone,
  onProceedToCheckout,
}) => {
  if (!isOpen) return null;

  const subtotal = items.reduce((acc, item) => acc + item.product.priceKes * item.quantity, 0);
  const isFreeDelivery = subtotal >= FREE_DELIVERY_THRESHOLD_KES;
  const deliveryFee = isFreeDelivery ? 0 : selectedZone.feeKes;
  const total = subtotal + deliveryFee;
  const remainingForFree = Math.max(0, FREE_DELIVERY_THRESHOLD_KES - subtotal);
  const progressPercent = Math.min(100, Math.round((subtotal / FREE_DELIVERY_THRESHOLD_KES) * 100));

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-stone-900/60 backdrop-blur-xs flex justify-end animate-in fade-in duration-200 rounded-none">
      <div 
        className="w-full max-w-md bg-[#FAF7F5] h-full shadow-2xl flex flex-col justify-between overflow-hidden border-l border-rose-200 rounded-none"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-4 sm:p-5 bg-white border-b border-rose-100 flex items-center justify-between rounded-none">
          <div className="flex items-center gap-2">
            <ShoppingBag className="w-5 h-5 text-rose-700" />
            <h2 className="font-serif text-xl font-bold text-stone-900">Your Shopping Bag</h2>
            <span className="text-xs text-stone-500 font-medium">({items.length} items)</span>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-none hover:bg-stone-100 text-stone-500 hover:text-stone-800 transition-colors cursor-pointer border border-transparent hover:border-stone-200"
            aria-label="Close bag"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Free delivery progress bar */}
        <div className="bg-rose-50/70 p-3.5 border-b border-rose-100/80 rounded-none">
          <div className="flex items-center justify-between text-xs text-stone-700 mb-1.5">
            <div className="flex items-center gap-1.5 font-medium">
              <Truck className="w-3.5 h-3.5 text-rose-600" />
              <span>
                {isFreeDelivery
                  ? 'Complimentary Delivery Unlocked!'
                  : `Add KES ${remainingForFree.toLocaleString()} for Free Delivery`}
              </span>
            </div>
            <span className="font-semibold text-rose-800">{progressPercent}%</span>
          </div>
          <div className="w-full bg-rose-200/50 h-1.5 rounded-none overflow-hidden">
            <div 
              className="bg-rose-600 h-full rounded-none transition-all duration-300" 
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>

        {/* Items List */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-4 rounded-none">
          {items.length === 0 ? (
            <div className="h-64 flex flex-col items-center justify-center text-center p-6 space-y-3 rounded-none">
              <div className="w-12 h-12 rounded-none bg-rose-100 text-rose-600 flex items-center justify-center border border-rose-200">
                <ShoppingBag className="w-6 h-6" />
              </div>
              <p className="font-serif text-lg font-bold text-stone-800">Your bag is empty</p>
              <p className="text-xs text-stone-500 max-w-xs">
                Explore Brenda's handcrafted sweaters, dresses, and baby wears to add to your wardrobe.
              </p>
              <button
                onClick={onClose}
                className="mt-2 px-4 py-2 bg-rose-700 text-white text-xs font-semibold rounded-none hover:bg-rose-800 transition-colors cursor-pointer"
              >
                Browse Collection
              </button>
            </div>
          ) : (
            items.map((item) => (
              <div
                key={item.id}
                className="flex gap-3 bg-white p-3.5 rounded-none border border-rose-200 shadow-2xs"
              >
                {/* Thumbnail */}
                <div className="w-20 h-20 rounded-none overflow-hidden bg-stone-100 shrink-0 border border-stone-200">
                  <img
                    src={item.product.image}
                    alt={item.product.name}
                    className="w-full h-full object-cover rounded-none"
                    referrerPolicy="no-referrer"
                  />
                </div>

                {/* Details */}
                <div className="flex-1 flex flex-col justify-between text-left rounded-none">
                  <div>
                    <h4 className="font-serif text-sm font-bold text-stone-900 line-clamp-1">
                      {item.product.name}
                    </h4>
                    <div className="text-xs text-stone-500 mt-0.5 space-x-1.5">
                      <span>Size: {item.selectedSize}</span>
                      <span>·</span>
                      <span>{item.selectedColor}</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between mt-2 pt-1">
                    {/* Quantity controls */}
                    <div className="flex items-center border border-stone-300 rounded-none bg-stone-50">
                      <button
                        onClick={() => onUpdateQuantity(item.id, -1)}
                        className="px-2 py-0.5 text-xs text-stone-600 hover:bg-stone-200 rounded-none"
                        title="Decrease"
                      >
                        -
                      </button>
                      <span className="px-2 text-xs font-semibold tabular-nums text-stone-800">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => onUpdateQuantity(item.id, 1)}
                        className="px-2 py-0.5 text-xs text-stone-600 hover:bg-stone-200 rounded-none"
                        title="Increase"
                      >
                        +
                      </button>
                    </div>

                    <div className="flex items-center gap-3">
                      <span className="text-xs font-bold text-stone-900 tabular-nums">
                        KES {(item.product.priceKes * item.quantity).toLocaleString()}
                      </span>
                      <button
                        onClick={() => onRemoveItem(item.id)}
                        className="text-stone-400 hover:text-rose-600 p-1 rounded-none"
                        title="Remove"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer / Summary / Instant Delivery Calculator */}
        {items.length > 0 && (
          <div className="p-4 sm:p-5 bg-white border-t border-rose-200 space-y-4 rounded-none">
            
            {/* Delivery Destination Selector */}
            <div className="space-y-1.5 text-left rounded-none">
              <label className="text-xs font-semibold text-stone-700 flex items-center justify-between">
                <span>Delivery Destination:</span>
                <span className="text-[11px] text-stone-400">{selectedZone.estimatedDays}</span>
              </label>
              <select
                value={selectedZone.id}
                onChange={(e) => {
                  const zone = DELIVERY_ZONES.find((z) => z.id === e.target.value);
                  if (zone) onSelectZone(zone);
                }}
                className="w-full text-xs font-medium bg-[#FAF7F5] border border-stone-300 rounded-none p-2.5 text-stone-800 focus:outline-rose-500"
              >
                {DELIVERY_ZONES.map((zone) => (
                  <option key={zone.id} value={zone.id}>
                    {zone.name} (+KES {zone.feeKes.toLocaleString()})
                  </option>
                ))}
              </select>
            </div>

            {/* Price Calculations */}
            <div className="space-y-1.5 text-xs text-stone-600 pt-1 border-t border-stone-100">
              <div className="flex justify-between">
                <span>Items Subtotal:</span>
                <span className="font-semibold text-stone-900 tabular-nums">
                  KES {subtotal.toLocaleString()}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span>Delivery Charge:</span>
                <span className="font-semibold text-stone-900 tabular-nums">
                  {isFreeDelivery ? (
                    <span className="text-emerald-700 font-bold">FREE (Threshold met)</span>
                  ) : (
                    `+KES ${deliveryFee.toLocaleString()}`
                  )}
                </span>
              </div>
              <div className="flex justify-between text-sm sm:text-base font-bold text-stone-900 pt-2 border-t border-stone-200">
                <span>Total Amount:</span>
                <span className="text-rose-700 tabular-nums">
                  KES {total.toLocaleString()}
                </span>
              </div>
            </div>

            {/* Checkout Action */}
            <button
              onClick={onProceedToCheckout}
              className="w-full py-3.5 px-4 bg-rose-700 hover:bg-rose-800 text-white font-semibold text-sm rounded-none flex items-center justify-center gap-2 transition-colors cursor-pointer shadow-sm active:scale-98"
            >
              <span>Proceed to M-Pesa Checkout</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <div className="flex items-center justify-center gap-2 text-[11px] text-stone-400">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
              <span>Instant Safaricom STK Push & Automated SMS confirmation</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
