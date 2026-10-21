import React, { useState } from 'react';
import { CartItem, DeliveryZone, Order } from '../types';
import { DELIVERY_ZONES, FREE_DELIVERY_THRESHOLD_KES } from '../data/deliveryZones';
import { X, Smartphone, ShieldCheck, CheckCircle2, AlertCircle, Loader2, ArrowRight } from 'lucide-react';

interface CheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  items: CartItem[];
  selectedZone: DeliveryZone;
  onSelectZone: (zone: DeliveryZone) => void;
  onOrderComplete: (order: Order) => void;
}

export const CheckoutModal: React.FC<CheckoutModalProps> = ({
  isOpen,
  onClose,
  items,
  selectedZone,
  onSelectZone,
  onOrderComplete,
}) => {
  if (!isOpen) return null;

  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('07');
  const [customerEmail, setCustomerEmail] = useState('');
  const [deliveryAddress, setDeliveryAddress] = useState('');
  const [orderNotes, setOrderNotes] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<'mpesa_stk' | 'mpesa_till'>('mpesa_stk');
  const [manualCode, setManualCode] = useState('');

  // STK Push state machine
  const [isProcessingStk, setIsProcessingStk] = useState(false);
  const [showStkPrompt, setShowStkPrompt] = useState(false);
  const [stkPin, setStkPin] = useState('••••');
  const [formError, setFormError] = useState('');

  const subtotal = items.reduce((acc, item) => acc + item.product.priceKes * item.quantity, 0);
  const isFreeDelivery = subtotal >= FREE_DELIVERY_THRESHOLD_KES;
  const deliveryFee = isFreeDelivery ? 0 : selectedZone.feeKes;
  const total = subtotal + deliveryFee;

  // Generate authentic M-Pesa Code (e.g. TL92PX817K)
  const generateMpesaReceipt = () => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let code = 'TL';
    for (let i = 0; i < 8; i++) {
      code += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return code;
  };

  const handleValidate = () => {
    if (!customerName.trim()) {
      setFormError('Please enter your full name for order delivery.');
      return false;
    }
    const cleanPhone = customerPhone.replace(/\s+/g, '');
    if (!cleanPhone.match(/^(?:254|\+254|0)?(7|1)\d{8}$/)) {
      setFormError('Please enter a valid Safaricom Kenyan mobile number (e.g., 0712 345 678).');
      return false;
    }
    if (!customerEmail.trim() || !customerEmail.includes('@')) {
      setFormError('Please enter a valid email address for automated order confirmation.');
      return false;
    }
    if (!deliveryAddress.trim()) {
      setFormError('Please enter your doorstep delivery address or pick-up instructions.');
      return false;
    }
    setFormError('');
    return true;
  };

  const handleInitiatePayment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!handleValidate()) return;

    if (paymentMethod === 'mpesa_stk') {
      setIsProcessingStk(true);
      // Simulate Safaricom STK Push dispatch
      setTimeout(() => {
        setIsProcessingStk(false);
        setShowStkPrompt(true);
      }, 1200);
    } else {
      // Manual Till option
      if (!manualCode.trim() || manualCode.length < 8) {
        setFormError('Please input the 10-character M-Pesa transaction code received via SMS.');
        return;
      }
      finalizeOrder(manualCode.toUpperCase());
    }
  };

  const handleConfirmPin = () => {
    setShowStkPrompt(false);
    setIsProcessingStk(true);

    setTimeout(() => {
      setIsProcessingStk(false);
      const receiptCode = generateMpesaReceipt();
      finalizeOrder(receiptCode);
    }, 1800);
  };

  const finalizeOrder = (receiptCode: string) => {
    const orderData: Omit<Order, 'id' | 'orderNumber' | 'createdAt'> = {
      customerName: customerName.trim(),
      customerPhone: customerPhone.trim(),
      customerEmail: customerEmail.trim(),
      deliveryZone: selectedZone,
      deliveryAddress: deliveryAddress.trim(),
      orderNotes: orderNotes.trim() || undefined,
      items,
      subtotalKes: subtotal,
      deliveryFeeKes: deliveryFee,
      totalKes: total,
      paymentMethod,
      mpesaReceiptCode: receiptCode,
      paymentStatus: 'paid',
      orderStatus: 'received',
      smsSent: true,
      emailSent: true,
    };

    onOrderComplete(orderData as any);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-stone-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 animate-in fade-in duration-200 rounded-none">
      <div 
        className="w-full max-w-2xl bg-white rounded-none shadow-2xl overflow-hidden border border-rose-200 my-auto text-left"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-4 sm:p-6 bg-gradient-to-r from-rose-900 to-stone-900 text-white flex items-center justify-between rounded-none">
          <div>
            <div className="flex items-center gap-2 text-rose-300 text-xs font-semibold tracking-wide uppercase">
              <span>Lipa na M-Pesa Instant Checkout</span>
            </div>
            <h2 className="font-serif text-xl sm:text-2xl font-bold mt-0.5 text-white">
              Complete Your Handcrafted Order
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-none bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer border border-white/20"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Checkout Form */}
        <form onSubmit={handleInitiatePayment} className="p-4 sm:p-6 space-y-6 max-h-[80vh] overflow-y-auto rounded-none">
          
          {formError && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-none text-xs text-red-700 flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{formError}</span>
            </div>
          )}

          {/* Customer Details */}
          <div className="space-y-4">
            <h3 className="text-sm font-bold text-stone-900 uppercase tracking-wide border-b border-stone-200 pb-2 flex items-center justify-between">
              <span>1. Contact & Customer Details</span>
              <span className="text-[11px] font-normal text-stone-400">For SMS & email confirmation</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">
                  Full Name *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Brenda Mwangi"
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  className="w-full text-xs p-2.5 bg-stone-50 border border-stone-300 rounded-none text-stone-900 focus:bg-white focus:outline-rose-600"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">
                  Safaricom M-Pesa Phone *
                </label>
                <div className="relative">
                  <input
                    type="tel"
                    required
                    placeholder="0712 345 678"
                    value={customerPhone}
                    onChange={(e) => setCustomerPhone(e.target.value)}
                    className="w-full text-xs p-2.5 bg-stone-50 border border-stone-300 rounded-none text-stone-900 focus:bg-white focus:outline-rose-600"
                  />
                  <Smartphone className="w-4 h-4 text-emerald-600 absolute right-2.5 top-2.5 pointer-events-none" />
                </div>
              </div>

              <div className="sm:col-span-2">
                <label className="block text-xs font-semibold text-stone-700 mb-1">
                  Email Address (For Instant Invoice & Receipt) *
                </label>
                <input
                  type="email"
                  required
                  placeholder="name@example.com"
                  value={customerEmail}
                  onChange={(e) => setCustomerEmail(e.target.value)}
                  className="w-full text-xs p-2.5 bg-stone-50 border border-stone-300 rounded-none text-stone-900 focus:bg-white focus:outline-rose-600"
                />
              </div>
            </div>
          </div>

          {/* Delivery Location & Instant Charge Calculation */}
          <div className="space-y-4">
            <h3 className="text-sm font-bold text-stone-900 uppercase tracking-wide border-b border-stone-200 pb-2 flex items-center justify-between">
              <span>2. Delivery Zone & Address</span>
              <span className="text-[11px] font-normal text-rose-700 font-semibold">
                Instant delivery charges applied
              </span>
            </h3>

            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1.5">
                Delivery Region & Courier Option *
              </label>
              <select
                value={selectedZone.id}
                onChange={(e) => {
                  const zone = DELIVERY_ZONES.find((z) => z.id === e.target.value);
                  if (zone) onSelectZone(zone);
                }}
                className="w-full text-xs font-medium p-2.5 bg-rose-50/60 border border-rose-300 rounded-none text-stone-900 focus:outline-rose-600"
              >
                {DELIVERY_ZONES.map((zone) => (
                  <option key={zone.id} value={zone.id}>
                    {zone.name} — KES {zone.feeKes.toLocaleString()} ({zone.estimatedDays})
                  </option>
                ))}
              </select>
              <p className="text-[11px] text-stone-500 mt-1">
                {selectedZone.description}
              </p>
            </div>

            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">
                Doorstep Delivery Address / Street / Estate *
              </label>
              <input
                type="text"
                required
                placeholder="e.g. Kilimani, Rose Avenue, Apt 4B or Wells Fargo Mombasa Road"
                value={deliveryAddress}
                onChange={(e) => setDeliveryAddress(e.target.value)}
                className="w-full text-xs p-2.5 bg-stone-50 border border-stone-300 rounded-none text-stone-900 focus:bg-white focus:outline-rose-600"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">
                Special Delivery Notes (Optional)
              </label>
              <input
                type="text"
                placeholder="e.g. Call upon arrival at security gate / baby gift wrap"
                value={orderNotes}
                onChange={(e) => setOrderNotes(e.target.value)}
                className="w-full text-xs p-2.5 bg-stone-50 border border-stone-300 rounded-none text-stone-900 focus:bg-white focus:outline-rose-600"
              />
            </div>
          </div>

          {/* Payment Method Selector */}
          <div className="space-y-3">
            <h3 className="text-sm font-bold text-stone-900 uppercase tracking-wide border-b border-stone-200 pb-2">
              3. Lipa na M-Pesa Options
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setPaymentMethod('mpesa_stk')}
                className={`p-3 rounded-none border text-left flex flex-col justify-between transition-all cursor-pointer ${
                  paymentMethod === 'mpesa_stk'
                    ? 'border-emerald-600 bg-emerald-50/50 shadow-2xs'
                    : 'border-stone-200 hover:border-stone-300'
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs font-bold text-stone-900">M-Pesa STK Push</span>
                  <span className="text-[10px] bg-emerald-600 text-white font-semibold px-1.5 py-0.5 rounded-none">
                    Instant
                  </span>
                </div>
                <p className="text-[11px] text-stone-500 leading-snug">
                  Prompts your phone automatically to enter your M-Pesa PIN.
                </p>
              </button>

              <button
                type="button"
                onClick={() => setPaymentMethod('mpesa_till')}
                className={`p-3 rounded-none border text-left flex flex-col justify-between transition-all cursor-pointer ${
                  paymentMethod === 'mpesa_till'
                    ? 'border-rose-700 bg-rose-50/50 shadow-2xs'
                    : 'border-stone-200 hover:border-stone-300'
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs font-bold text-stone-900">Buy Goods Till No.</span>
                  <span className="text-[10px] bg-stone-700 text-white font-semibold px-1.5 py-0.5 rounded-none">
                    Manual
                  </span>
                </div>
                <p className="text-[11px] text-stone-500 leading-snug">
                  Pay to Till: <strong>849204</strong> (Brenda Crochets) & enter code.
                </p>
              </button>
            </div>

            {paymentMethod === 'mpesa_till' && (
              <div className="bg-stone-50 p-3 rounded-none border border-stone-300 space-y-2 text-xs text-stone-700 animate-in fade-in">
                <p className="font-semibold text-stone-900">Manual Payment Steps:</p>
                <ol className="list-decimal list-inside space-y-1 text-stone-600 text-[11px]">
                  <li>Go to M-Pesa &gt; Lipa na M-Pesa &gt; Buy Goods and Services</li>
                  <li>Enter Till Number: <strong className="text-rose-800">849204</strong> (Brenda Crochets)</li>
                  <li>Enter Amount: <strong className="text-stone-900">KES {total.toLocaleString()}</strong></li>
                  <li>Enter M-Pesa PIN and press Send</li>
                </ol>
                <div className="pt-2">
                  <label className="block text-xs font-semibold text-stone-700 mb-1">
                    Enter Safaricom Confirmation Code received via SMS:
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. TL84PX920K"
                    value={manualCode}
                    onChange={(e) => setManualCode(e.target.value.toUpperCase())}
                    className="w-full text-xs p-2 bg-white border border-stone-300 rounded-none font-mono uppercase tracking-wider"
                  />
                </div>
              </div>
            )}
          </div>

          {/* Pricing Summary Card */}
          <div className="bg-[#FAF7F5] rounded-none p-4 border border-rose-200 space-y-2 text-xs">
            <div className="flex justify-between text-stone-600">
              <span>Items Total ({items.length} items):</span>
              <span className="font-semibold text-stone-900 tabular-nums">KES {subtotal.toLocaleString()}</span>
            </div>
            <div className="flex justify-between text-stone-600">
              <span>Delivery Charge ({selectedZone.name.split('(')[0]}):</span>
              <span className="font-semibold text-stone-900 tabular-nums">
                {isFreeDelivery ? 'FREE' : `+KES ${deliveryFee.toLocaleString()}`}
              </span>
            </div>
            <div className="pt-2 border-t border-rose-200/60 flex justify-between items-center text-sm sm:text-base font-bold text-stone-900">
              <span>Payable Total:</span>
              <span className="text-rose-700 tabular-nums">KES {total.toLocaleString()}</span>
            </div>
          </div>

          {/* Submit Action */}
          <div>
            <button
              type="submit"
              disabled={isProcessingStk}
              className="w-full py-4 px-6 bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-sm rounded-none shadow-md flex items-center justify-center gap-2 transition-all cursor-pointer active:scale-98 disabled:opacity-60"
            >
              {isProcessingStk ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin text-white" />
                  <span>Contacting Safaricom M-Pesa Gateway...</span>
                </>
              ) : (
                <>
                  <ShieldCheck className="w-5 h-5" />
                  <span>
                    {paymentMethod === 'mpesa_stk'
                      ? `Send M-Pesa STK Push Prompt (KES ${total.toLocaleString()})`
                      : `Verify Payment & Place Order (KES ${total.toLocaleString()})`}
                  </span>
                </>
              )}
            </button>
            <p className="text-center text-[11px] text-stone-400 mt-2">
              Automated SMS receipt & email dispatch invoice sent immediately after confirmation.
            </p>
          </div>

        </form>

      </div>

      {/* Interactive Safaricom STK Push Simulator Modal */}
      {showStkPrompt && (
        <div className="fixed inset-0 z-60 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in rounded-none">
          <div className="w-full max-w-xs bg-stone-900 text-white rounded-none p-6 shadow-2xl border border-stone-700 text-center space-y-4">
            
            <div className="w-12 h-12 rounded-none bg-emerald-500/20 text-emerald-400 mx-auto flex items-center justify-center border border-emerald-500/30">
              <Smartphone className="w-6 h-6 animate-pulse" />
            </div>

            <div className="space-y-1">
              <span className="text-[10px] tracking-widest uppercase font-semibold text-emerald-400 bg-emerald-950/80 px-2.5 py-0.5 rounded-none border border-emerald-800">
                LIPA NA M-PESA ONLINE
              </span>
              <h4 className="text-base font-bold text-white pt-1">
                Enter M-PESA PIN
              </h4>
              <p className="text-xs text-stone-300 leading-snug">
                Do you want to pay <strong>KES {total.toLocaleString()}</strong> to <strong>BRENDA CROCHETS</strong> for Order?
              </p>
            </div>

            <div className="py-2">
              <div className="bg-stone-800 border border-stone-700 rounded-none py-3 px-4 text-center tracking-widest text-lg font-mono text-emerald-400">
                {stkPin}
              </div>
              <p className="text-[10px] text-stone-400 mt-1">Phone: {customerPhone}</p>
            </div>

            <div className="grid grid-cols-2 gap-2 pt-2">
              <button
                type="button"
                onClick={() => setShowStkPrompt(false)}
                className="py-2.5 text-xs font-semibold rounded-none bg-stone-800 hover:bg-stone-700 text-stone-300 cursor-pointer border border-stone-700"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleConfirmPin}
                className="py-2.5 text-xs font-bold rounded-none bg-emerald-600 hover:bg-emerald-500 text-white cursor-pointer shadow-lg active:scale-95"
              >
                Confirm PIN
              </button>
            </div>

          </div>
        </div>
      )}
    </div>
  );
};
