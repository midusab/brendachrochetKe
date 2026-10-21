import React, { useState } from 'react';
import { X, Sparkles, Send, CheckCircle2, Ruler, Heart } from 'lucide-react';
import { storage } from '../services/storage';

interface CustomCommissionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export const CustomCommissionModal: React.FC<CustomCommissionModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
}) => {
  if (!isOpen) return null;

  const [name, setName] = useState('');
  const [phone, setPhone] = useState('07');
  const [email, setEmail] = useState('');
  const [garmentType, setGarmentType] = useState("Women's Chunky Cardigan");
  const [yarnMaterial, setYarnMaterial] = useState('Organic Cotton & Merino Wool Blend');
  const [preferredColors, setPreferredColors] = useState('Blush Rose & Cream');
  const [bust, setBust] = useState('');
  const [waist, setWaist] = useState('');
  const [length, setLength] = useState('');
  const [notes, setNotes] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    storage.saveInquiry({
      clientName: name,
      clientPhone: phone,
      clientEmail: email,
      garmentType,
      yarnMaterial,
      preferredColors,
      measurements: {
        bustOrChest: bust || undefined,
        waist: waist || undefined,
        length: length || undefined,
      },
      notes,
    });
    setIsSubmitted(true);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-stone-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 animate-in fade-in duration-200 rounded-none">
      <div 
        className="w-full max-w-xl bg-white rounded-none shadow-2xl overflow-hidden border border-rose-200 my-auto text-left"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-rose-800 to-rose-950 p-6 text-white flex items-center justify-between rounded-none">
          <div>
            <div className="flex items-center gap-1.5 text-xs text-rose-300 font-semibold tracking-wider uppercase">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Bespoke Handcrafted Commission</span>
            </div>
            <h2 className="font-serif text-2xl font-bold mt-1 text-white">
              Made-to-Measure Crochet
            </h2>
            <p className="text-xs text-stone-300 mt-0.5">
              Have Brenda hand-knit an exclusive piece customized to your exact body measurements and favorite shades of pink.
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-none bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer border border-white/20"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {isSubmitted ? (
          <div className="p-8 text-center space-y-4 rounded-none">
            <div className="w-14 h-14 bg-rose-100 text-rose-700 rounded-none flex items-center justify-center mx-auto border border-rose-200">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <h3 className="font-serif text-2xl font-bold text-stone-900">
              Inquiry Received!
            </h3>
            <p className="text-xs sm:text-sm text-stone-600 max-w-md mx-auto leading-relaxed">
              Brenda will personally review your yarn preferences and sizing measurements. Expect a WhatsApp & SMS quote with M-Pesa deposit details sent to <strong>{phone}</strong> within 4 hours.
            </p>
            <button
              onClick={() => {
                setIsSubmitted(false);
                onSuccess();
                onClose();
              }}
              className="px-6 py-2.5 bg-rose-700 hover:bg-rose-800 text-white text-xs font-semibold rounded-none shadow-sm transition-colors cursor-pointer"
            >
              Back to Collection
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-6 space-y-4 text-xs text-stone-800 max-h-[75vh] overflow-y-auto rounded-none">
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              <div>
                <label className="block font-semibold text-stone-700 mb-1">Your Full Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Brenda Mwangi"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full text-xs p-2.5 bg-stone-50 border border-stone-300 rounded-none text-stone-900 focus:bg-white focus:outline-rose-600"
                />
              </div>

              <div>
                <label className="block font-semibold text-stone-700 mb-1">WhatsApp / Safaricom Phone *</label>
                <input
                  type="tel"
                  required
                  placeholder="0712 345 678"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full text-xs p-2.5 bg-stone-50 border border-stone-300 rounded-none text-stone-900 focus:bg-white focus:outline-rose-600"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block font-semibold text-stone-700 mb-1">Email Address *</label>
                <input
                  type="email"
                  required
                  placeholder="name@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full text-xs p-2.5 bg-stone-50 border border-stone-300 rounded-none text-stone-900 focus:bg-white focus:outline-rose-600"
                />
              </div>

              <div>
                <label className="block font-semibold text-stone-700 mb-1">Garment Type *</label>
                <select
                  value={garmentType}
                  onChange={(e) => setGarmentType(e.target.value)}
                  className="w-full text-xs p-2.5 bg-stone-50 border border-stone-300 rounded-none text-stone-900 focus:outline-rose-600"
                >
                  <option value="Women's Chunky Cardigan">Women's Chunky Cardigan</option>
                  <option value="Women's Scallop Lace Dress">Women's Scallop Lace Dress</option>
                  <option value="Two-Piece Crop & Skirt Set">Two-Piece Crop & Skirt Set</option>
                  <option value="Children / Baby Heirloom Romper Set">Children / Baby Heirloom Romper Set</option>
                  <option value="Custom Blanket / Throw">Custom Blanket / Throw</option>
                  <option value="Matching Mother & Child Set">Matching Mother & Child Set</option>
                </select>
              </div>

              <div>
                <label className="block font-semibold text-stone-700 mb-1">Yarn & Color Combination *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Dusty rose, blossom pink & ivory"
                  value={preferredColors}
                  onChange={(e) => setPreferredColors(e.target.value)}
                  className="w-full text-xs p-2.5 bg-stone-50 border border-stone-300 rounded-none text-stone-900 focus:bg-white focus:outline-rose-600"
                />
              </div>
            </div>

            {/* Custom Measurements */}
            <div className="bg-rose-50/60 p-3.5 rounded-none border border-rose-200 space-y-2">
              <div className="flex items-center gap-1.5 font-semibold text-rose-900 text-xs">
                <Ruler className="w-3.5 h-3.5 text-rose-700" />
                <span>Your Measurements (Inches or cm):</span>
              </div>
              <div className="grid grid-cols-3 gap-2">
                <div>
                  <label className="block text-[11px] text-stone-600">Bust/Chest</label>
                  <input
                    type="text"
                    placeholder="36 in"
                    value={bust}
                    onChange={(e) => setBust(e.target.value)}
                    className="w-full text-xs p-2 bg-white border border-stone-300 rounded-none"
                  />
                </div>
                <div>
                  <label className="block text-[11px] text-stone-600">Waist</label>
                  <input
                    type="text"
                    placeholder="29 in"
                    value={waist}
                    onChange={(e) => setWaist(e.target.value)}
                    className="w-full text-xs p-2 bg-white border border-stone-300 rounded-none"
                  />
                </div>
                <div>
                  <label className="block text-[11px] text-stone-600">Total Length</label>
                  <input
                    type="text"
                    placeholder="24 in"
                    value={length}
                    onChange={(e) => setLength(e.target.value)}
                    className="w-full text-xs p-2 bg-white border border-stone-300 rounded-none"
                  />
                </div>
              </div>
            </div>

            <div>
              <label className="block font-semibold text-stone-700 mb-1">
                Additional Notes or Inspo Link
              </label>
              <textarea
                rows={2}
                placeholder="Tell Brenda about any specific sleeve volume, neckline, or baby age..."
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                className="w-full text-xs p-2.5 bg-stone-50 border border-stone-300 rounded-none text-stone-900 focus:bg-white focus:outline-rose-600"
              />
            </div>

            <div className="pt-2">
              <button
                type="submit"
                className="w-full py-3 bg-rose-700 hover:bg-rose-800 text-white font-semibold text-xs rounded-none shadow-sm flex items-center justify-center gap-2 cursor-pointer transition-colors"
              >
                <Send className="w-3.5 h-3.5" />
                <span>Send Bespoke Request to Brenda</span>
              </button>
            </div>

          </form>
        )}

      </div>
    </div>
  );
};
