import React, { useState } from 'react';
import { Order } from '../types';
import { CheckCircle2, MessageSquare, Mail, Printer, X, Copy, ExternalLink, Sparkles, Heart } from 'lucide-react';

interface OrderSuccessModalProps {
  order: Order | null;
  onClose: () => void;
  onTrackOrder: (orderId: string) => void;
}

export const OrderSuccessModal: React.FC<OrderSuccessModalProps> = ({
  order,
  onClose,
  onTrackOrder,
}) => {
  if (!order) return null;

  const [activeTab, setActiveTab] = useState<'sms' | 'email'>('sms');
  const [copiedText, setCopiedText] = useState(false);

  const currentDate = new Date().toLocaleDateString('en-GB', {
    day: '2-digit',
    month: '2-digit',
    year: '2-digit',
  });
  const currentTime = new Date().toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: true,
  });

  const mpesaSmsText = `${order.mpesaReceiptCode} Confirmed. Ksh${order.totalKes.toLocaleString()}.00 sent to BRENDA CROCHETS (Till 849204) on ${currentDate} at ${currentTime}. Transaction cost, Ksh0.00.`;
  const brendaSmsText = `BRENDA CROCHETS: Jambo ${order.customerName.split(' ')[0]}! Order #${order.orderNumber} confirmed. Brenda is preparing your hand-knitted pieces for delivery to ${order.deliveryZone.name}. ETA: ${order.deliveryZone.estimatedDays}. For care or updates, Call/WhatsApp +254712345678.`;

  const handleCopySms = () => {
    navigator.clipboard.writeText(`${mpesaSmsText}\n\n${brendaSmsText}`);
    setCopiedText(true);
    setTimeout(() => setCopiedText(false), 2000);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-stone-900/65 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 animate-in fade-in duration-200 rounded-none">
      <div 
        className="w-full max-w-2xl bg-white rounded-none shadow-2xl overflow-hidden border border-rose-200 my-auto text-left"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Celebration Header */}
        <div className="bg-gradient-to-br from-rose-800 via-rose-900 to-stone-900 text-white p-6 sm:p-8 text-center relative rounded-none">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 rounded-none bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer border border-white/20"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="w-14 h-14 bg-emerald-500 text-white rounded-none flex items-center justify-center mx-auto mb-3 shadow-lg shadow-emerald-950/40">
            <CheckCircle2 className="w-8 h-8" />
          </div>

          <p className="text-xs uppercase tracking-widest text-rose-300 font-semibold">
            Order Confirmed & M-Pesa Verified
          </p>
          <h2 className="font-serif text-2xl sm:text-3xl font-bold mt-1 text-white">
            Thank you, {order.customerName.split(' ')[0]}!
          </h2>
          <p className="text-xs sm:text-sm text-stone-300 mt-1 max-w-md mx-auto">
            Order <span className="font-mono font-bold text-white">{order.orderNumber}</span> has been routed to Brenda's atelier. Automated confirmations have been dispatched.
          </p>

          <div className="mt-4 inline-flex items-center gap-2 bg-white/10 backdrop-blur-xs px-3 py-1 rounded-none text-xs text-rose-200 border border-white/20 font-mono">
            <span>M-Pesa Ref: <strong>{order.mpesaReceiptCode}</strong></span>
          </div>
        </div>

        {/* View Toggle Bar (SMS Preview vs Email Preview) */}
        <div className="border-b border-stone-200 bg-stone-50 px-4 sm:px-6 flex items-center justify-between rounded-none">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setActiveTab('sms')}
              className={`py-3 px-4 text-xs font-semibold flex items-center gap-2 border-b-2 transition-all cursor-pointer rounded-none ${
                activeTab === 'sms'
                  ? 'border-rose-700 text-rose-800 bg-white shadow-2xs'
                  : 'border-transparent text-stone-600 hover:text-stone-900'
              }`}
            >
              <MessageSquare className="w-4 h-4 text-emerald-600" />
              <span>Automated SMS ({order.customerPhone})</span>
            </button>

            <button
              onClick={() => setActiveTab('email')}
              className={`py-3 px-4 text-xs font-semibold flex items-center gap-2 border-b-2 transition-all cursor-pointer rounded-none ${
                activeTab === 'email'
                  ? 'border-rose-700 text-rose-800 bg-white shadow-2xs'
                  : 'border-transparent text-stone-600 hover:text-stone-900'
              }`}
            >
              <Mail className="w-4 h-4 text-rose-600" />
              <span>Automated Email ({order.customerEmail})</span>
            </button>
          </div>

          <button
            onClick={handlePrint}
            title="Print receipt invoice"
            className="hidden sm:flex items-center gap-1.5 text-xs text-stone-600 hover:text-rose-700 font-medium cursor-pointer"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>Print Invoice</span>
          </button>
        </div>

        {/* Tab Content */}
        <div className="p-4 sm:p-6 max-h-[60vh] overflow-y-auto rounded-none">
          
          {/* SMS SIMULATION TAB */}
          {activeTab === 'sms' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between text-xs text-stone-500">
                <span className="font-medium">Live Safaricom & Brenda SMS Feed to {order.customerPhone}</span>
                <button
                  onClick={handleCopySms}
                  className="flex items-center gap-1 text-rose-700 hover:underline cursor-pointer"
                >
                  <Copy className="w-3 h-3" />
                  <span>{copiedText ? 'Copied!' : 'Copy Messages'}</span>
                </button>
              </div>

              {/* Simulated Phone Screen Messages */}
              <div className="bg-[#EFEAE2] p-4 rounded-none space-y-3 font-sans border border-stone-300 shadow-inner">
                
                {/* 1. Safaricom M-Pesa Official SMS */}
                <div className="max-w-[90%] bg-white rounded-none p-3.5 shadow-xs text-xs text-stone-800 space-y-1 border border-stone-200">
                  <div className="flex items-center justify-between text-[10px] text-emerald-700 font-bold uppercase tracking-wider">
                    <span>MPESA_SAFARICOM</span>
                    <span className="text-stone-400 font-normal">{currentTime}</span>
                  </div>
                  <p className="font-mono text-stone-800 text-[11px] leading-relaxed">
                    {mpesaSmsText}
                  </p>
                </div>

                {/* 2. Brenda Crochets Confirmation SMS */}
                <div className="max-w-[90%] bg-[#DCF8C6] rounded-none p-3.5 shadow-xs text-xs text-stone-800 space-y-1 ml-auto border border-emerald-300">
                  <div className="flex items-center justify-between text-[10px] text-rose-900 font-bold uppercase tracking-wider">
                    <span>BRENDA_CROCHETS</span>
                    <span className="text-stone-500 font-normal">{currentTime}</span>
                  </div>
                  <p className="text-stone-800 text-[11px] leading-relaxed">
                    {brendaSmsText}
                  </p>
                </div>

              </div>

              <div className="bg-emerald-50 border border-emerald-200 rounded-none p-3 text-xs text-emerald-800 flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>
                  SMS broadcast simulated successfully. A physical text message is dispatched to Safaricom MSISDN <strong>{order.customerPhone}</strong>.
                </span>
              </div>
            </div>
          )}

          {/* EMAIL INVOICE TAB */}
          {activeTab === 'email' && (
            <div className="bg-white border border-stone-200 rounded-none p-6 shadow-xs space-y-6 text-stone-800">
              
              {/* Email Header */}
              <div className="border-b border-rose-100 pb-4 flex justify-between items-start">
                <div>
                  <h3 className="font-serif text-2xl font-bold text-stone-900">Brenda Crochets</h3>
                  <p className="text-xs text-rose-700 font-medium">Artisanal Handcrafted Knitwear · Nairobi, Kenya</p>
                  <p className="text-xs text-stone-500 mt-1">Order Date: {new Date(order.createdAt).toLocaleDateString()}</p>
                </div>
                <div className="text-right">
                  <span className="text-xs font-mono font-bold text-stone-900 block">{order.orderNumber}</span>
                  <span className="inline-block mt-1 px-2 py-0.5 text-[10px] font-bold rounded-none bg-emerald-100 text-emerald-800 border border-emerald-300">
                    PAID VIA M-PESA
                  </span>
                </div>
              </div>

              {/* Delivery info */}
              <div className="grid grid-cols-2 gap-4 text-xs bg-[#FAF7F5] p-3.5 rounded-none border border-rose-100/60">
                <div>
                  <p className="font-semibold text-stone-700">Deliver To:</p>
                  <p className="text-stone-900 font-medium mt-0.5">{order.customerName}</p>
                  <p className="text-stone-600">{order.customerPhone}</p>
                  <p className="text-stone-600 mt-1">{order.deliveryAddress}</p>
                </div>
                <div>
                  <p className="font-semibold text-stone-700">Courier Service:</p>
                  <p className="text-stone-900 font-medium mt-0.5">{order.deliveryZone.name}</p>
                  <p className="text-stone-600">ETA: {order.deliveryZone.estimatedDays}</p>
                  <p className="text-stone-500 mt-1 font-mono text-[11px]">M-Pesa Ref: {order.mpesaReceiptCode}</p>
                </div>
              </div>

              {/* Itemized list */}
              <div>
                <p className="text-xs font-bold text-stone-700 uppercase tracking-wide mb-2">Ordered Pieces</p>
                <div className="divide-y divide-stone-100 border border-stone-200 rounded-none overflow-hidden">
                  {order.items.map((item) => (
                    <div key={item.id} className="p-3 flex items-center justify-between text-xs">
                      <div className="flex items-center gap-3">
                        <img
                          src={item.product.image}
                          alt={item.product.name}
                          className="w-10 h-10 object-cover rounded-none bg-stone-100 border border-stone-200"
                        />
                        <div>
                          <p className="font-semibold text-stone-900">{item.product.name}</p>
                          <p className="text-stone-500 text-[11px]">
                            {item.selectedSize} · {item.selectedColor} · Qty: {item.quantity}
                          </p>
                        </div>
                      </div>
                      <span className="font-semibold text-stone-900 tabular-nums">
                        KES {(item.product.priceKes * item.quantity).toLocaleString()}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Cost Totals */}
              <div className="space-y-1.5 text-xs text-stone-600 border-t border-stone-100 pt-3">
                <div className="flex justify-between">
                  <span>Subtotal:</span>
                  <span className="font-semibold text-stone-900 tabular-nums">KES {order.subtotalKes.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span>Delivery Charges:</span>
                  <span className="font-semibold text-stone-900 tabular-nums">
                    {order.deliveryFeeKes === 0 ? 'FREE' : `+KES ${order.deliveryFeeKes.toLocaleString()}`}
                  </span>
                </div>
                <div className="flex justify-between text-sm font-bold text-stone-900 border-t border-stone-200 pt-2">
                  <span>Total Amount Paid:</span>
                  <span className="text-rose-700 tabular-nums">KES {order.totalKes.toLocaleString()}</span>
                </div>
              </div>

              {/* Care reminder */}
              <div className="p-3 bg-stone-50 rounded-none text-[11px] text-stone-500 space-y-1 border border-stone-200">
                <p className="font-semibold text-stone-700 flex items-center gap-1">
                  <Heart className="w-3.5 h-3.5 text-rose-500" />
                  <span>Garment Care Promise:</span>
                </p>
                <p>
                  Hand wash gently in lukewarm water using mild detergent. Lay flat on towel to dry. Avoid hanging while wet.
                </p>
              </div>

            </div>
          )}

        </div>

        {/* Action Footer */}
        <div className="p-4 sm:p-6 bg-stone-50 border-t border-stone-200 flex flex-col sm:flex-row items-center justify-between gap-3 rounded-none">
          <button
            onClick={() => onTrackOrder(order.id)}
            className="w-full sm:w-auto px-4 py-2.5 rounded-none border border-stone-300 text-stone-700 text-xs font-semibold hover:border-rose-300 hover:text-rose-800 flex items-center justify-center gap-2 cursor-pointer transition-colors bg-white"
          >
            <span>Live Order Status Tracking</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </button>

          <button
            onClick={onClose}
            className="w-full sm:w-auto px-6 py-2.5 rounded-none bg-rose-700 hover:bg-rose-800 text-white text-xs font-semibold cursor-pointer shadow-sm transition-colors"
          >
            Back to Collection
          </button>
        </div>

      </div>
    </div>
  );
};
