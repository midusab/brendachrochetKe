import React, { useState } from 'react';
import { Order } from '../types';
import { X, Search, Package, Clock, Truck, CheckCircle2, ShieldCheck } from 'lucide-react';

interface OrderTrackerModalProps {
  isOpen: boolean;
  onClose: () => void;
  orders: Order[];
  initialOrderId?: string;
}

export const OrderTrackerModal: React.FC<OrderTrackerModalProps> = ({
  isOpen,
  onClose,
  orders,
  initialOrderId,
}) => {
  if (!isOpen) return null;

  const [searchQuery, setSearchQuery] = useState(initialOrderId || '');
  const [searchedOrder, setSearchedOrder] = useState<Order | null>(
    initialOrderId
      ? orders.find((o) => o.id === initialOrderId || o.orderNumber === initialOrderId) || orders[0] || null
      : orders[0] || null
  );

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const query = searchQuery.trim().toLowerCase();
    const found = orders.find(
      (o) =>
        o.orderNumber.toLowerCase().includes(query) ||
        o.customerPhone.includes(query) ||
        o.mpesaReceiptCode.toLowerCase().includes(query)
    );
    setSearchedOrder(found || null);
  };

  const getStepIndex = (status: Order['orderStatus']) => {
    switch (status) {
      case 'received': return 0;
      case 'knitting': return 1;
      case 'dispatched': return 2;
      case 'delivered': return 3;
      default: return 0;
    }
  };

  const currentStep = searchedOrder ? getStepIndex(searchedOrder.orderStatus) : 0;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-stone-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 animate-in fade-in duration-200 rounded-none">
      <div 
        className="w-full max-w-xl bg-white rounded-none shadow-2xl overflow-hidden border border-rose-200 my-auto text-left"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-stone-900 to-rose-950 p-6 text-white flex items-center justify-between rounded-none">
          <div>
            <div className="text-xs text-rose-300 font-semibold tracking-wider uppercase">
              Live Courier & Atelier Tracker
            </div>
            <h2 className="font-serif text-2xl font-bold mt-1 text-white">
              Track Your Brenda Crochets Order
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-none bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer border border-white/20"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-6 rounded-none">
          {/* Search Bar */}
          <form onSubmit={handleSearch} className="flex gap-2">
            <div className="relative flex-1">
              <input
                type="text"
                placeholder="Search by Order # (e.g. BC-2026-8491) or Phone"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full text-xs p-3 bg-stone-50 border border-stone-300 rounded-none text-stone-900 focus:bg-white focus:outline-rose-600"
              />
            </div>
            <button
              type="submit"
              className="px-4 bg-rose-700 hover:bg-rose-800 text-white font-semibold text-xs rounded-none flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <Search className="w-3.5 h-3.5" />
              <span>Track</span>
            </button>
          </form>

          {searchedOrder ? (
            <div className="space-y-6">
              
              {/* Status Header */}
              <div className="bg-[#FAF7F5] p-4 rounded-none border border-rose-200 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-mono font-bold text-stone-900 text-sm">{searchedOrder.orderNumber}</span>
                    <span className="text-xs text-stone-400">·</span>
                    <span className="text-xs font-semibold text-rose-800 uppercase">
                      {searchedOrder.orderStatus}
                    </span>
                  </div>
                  <p className="text-xs text-stone-600 mt-0.5">
                    For <strong>{searchedOrder.customerName}</strong> · Delivered via {searchedOrder.deliveryZone.name}
                  </p>
                </div>
                <div className="text-right">
                  <span className="text-xs font-bold text-stone-900 tabular-nums block">
                    KES {searchedOrder.totalKes.toLocaleString()}
                  </span>
                  <span className="text-[11px] text-emerald-700 font-mono">
                    M-Pesa: {searchedOrder.mpesaReceiptCode}
                  </span>
                </div>
              </div>

              {/* Progress Stepper */}
              <div className="py-2">
                <div className="grid grid-cols-4 gap-2 text-center relative">
                  
                  {/* Step 1 */}
                  <div className="space-y-2 flex flex-col items-center">
                    <div className={`w-8 h-8 rounded-none flex items-center justify-center text-xs font-bold ${
                      currentStep >= 0 ? 'bg-rose-700 text-white' : 'bg-stone-200 text-stone-500'
                    }`}>
                      <CheckCircle2 className="w-4 h-4" />
                    </div>
                    <span className="text-[11px] font-semibold text-stone-800 leading-tight">Order Placed</span>
                  </div>

                  {/* Step 2 */}
                  <div className="space-y-2 flex flex-col items-center">
                    <div className={`w-8 h-8 rounded-none flex items-center justify-center text-xs font-bold ${
                      currentStep >= 1 ? 'bg-rose-700 text-white' : 'bg-stone-200 text-stone-500'
                    }`}>
                      <Package className="w-4 h-4" />
                    </div>
                    <span className="text-[11px] font-semibold text-stone-800 leading-tight">Knitting / Prep</span>
                  </div>

                  {/* Step 3 */}
                  <div className="space-y-2 flex flex-col items-center">
                    <div className={`w-8 h-8 rounded-none flex items-center justify-center text-xs font-bold ${
                      currentStep >= 2 ? 'bg-rose-700 text-white' : 'bg-stone-200 text-stone-500'
                    }`}>
                      <Truck className="w-4 h-4" />
                    </div>
                    <span className="text-[11px] font-semibold text-stone-800 leading-tight">With Courier</span>
                  </div>

                  {/* Step 4 */}
                  <div className="space-y-2 flex flex-col items-center">
                    <div className={`w-8 h-8 rounded-none flex items-center justify-center text-xs font-bold ${
                      currentStep >= 3 ? 'bg-emerald-600 text-white' : 'bg-stone-200 text-stone-500'
                    }`}>
                      <CheckCircle2 className="w-4 h-4" />
                    </div>
                    <span className="text-[11px] font-semibold text-stone-800 leading-tight">Delivered</span>
                  </div>

                </div>
              </div>

              {/* Delivery Details */}
              <div className="bg-stone-50 p-4 rounded-none text-xs space-y-2 border border-stone-200">
                <div className="flex justify-between">
                  <span className="text-stone-500">Destination:</span>
                  <span className="font-medium text-stone-800 text-right">{searchedOrder.deliveryAddress}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-stone-500">Estimated Delivery Time:</span>
                  <span className="font-semibold text-rose-800">{searchedOrder.deliveryZone.estimatedDays}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-stone-500">Pieces in Package:</span>
                  <span className="font-medium text-stone-800">
                    {searchedOrder.items.map(i => `${i.quantity}x ${i.product.name}`).join(', ')}
                  </span>
                </div>
              </div>

            </div>
          ) : (
            <div className="text-center py-8 text-stone-500 text-xs">
              No order found matching "{searchQuery}". Check your confirmation SMS for the exact order ID.
            </div>
          )}

          <div className="pt-2 text-center border-t border-stone-100">
            <button
              onClick={onClose}
              className="text-xs text-stone-500 hover:text-stone-900 font-medium cursor-pointer"
            >
              Close Window
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
