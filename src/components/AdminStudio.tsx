import React, { useState } from 'react';
import { Product, Order, ProductCategory } from '../types';
import { 
  PlusCircle, 
  Package, 
  DollarSign, 
  ShoppingBag, 
  Upload, 
  Trash2, 
  CheckCircle, 
  Clock, 
  Truck, 
  CheckCircle2, 
  MessageSquare,
  Sparkles,
  X
} from 'lucide-react';

interface AdminStudioProps {
  products: Product[];
  orders: Order[];
  onAddProduct: (product: Omit<Product, 'id'>) => void;
  onDeleteProduct: (id: string) => void;
  onUpdateOrderStatus: (orderId: string, status: Order['orderStatus']) => void;
  onExitStudio: () => void;
}

export const AdminStudio: React.FC<AdminStudioProps> = ({
  products,
  orders,
  onAddProduct,
  onDeleteProduct,
  onUpdateOrderStatus,
  onExitStudio,
}) => {
  const [activeTab, setActiveTab] = useState<'orders' | 'products' | 'new-product'>('orders');
  const [smsToast, setSmsToast] = useState<string | null>(null);

  // New product form state
  const [newName, setNewName] = useState('');
  const [newCategory, setNewCategory] = useState<ProductCategory>('sweaters');
  const [newPrice, setNewPrice] = useState<number>(3800);
  const [newOriginalPrice, setNewOriginalPrice] = useState<number | undefined>(4500);
  const [newMaterial, setNewMaterial] = useState('100% Organic Kenyan Cotton Yarn');
  const [newLeadTime, setNewLeadTime] = useState('Ready to ship in 24 hours');
  const [newDescription, setNewDescription] = useState('');
  const [newSizes, setNewSizes] = useState<string>('Small, Medium, Large');
  const [newColors, setNewColors] = useState<string>('Blush Rose & Cream, Oatmeal');
  const [newImage, setNewImage] = useState<string>('/src/assets/images/crochet_chunky_cardigan_1792574550136.jpg');
  const [careGuide, setCareGuide] = useState('Gentle hand wash in cold water, lay flat to dry in shade.');
  const [imagePreview, setImagePreview] = useState<string>('/src/assets/images/crochet_chunky_cardigan_1792574550136.jpg');

  // Handle image upload via file reader
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const result = reader.result as string;
        setImagePreview(result);
        setNewImage(result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleCreateProduct = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName.trim() || !newPrice) return;

    const categoryLabels: Record<ProductCategory, string> = {
      all: 'All Pieces',
      sweaters: "Women's Sweaters & Cardigans",
      dresses: 'Dresses & Matching Sets',
      tops: 'Summer Tops & Halters',
      children: 'Children & Baby Hand-Knit Wears',
      accessories: 'Bags & Accessories',
      bespoke: 'Made-to-Measure Bespoke',
    };

    const productPayload: Omit<Product, 'id'> = {
      name: newName.trim(),
      category: newCategory,
      categoryLabel: categoryLabels[newCategory] || 'Handcrafted Knitwear',
      priceKes: Number(newPrice),
      originalPriceKes: newOriginalPrice ? Number(newOriginalPrice) : undefined,
      image: newImage,
      description: newDescription.trim() || 'Exquisitely handcrafted crochet piece woven with fine natural yarn.',
      material: newMaterial.trim(),
      leadTime: newLeadTime.trim(),
      sizes: newSizes.split(',').map((s) => s.trim()).filter(Boolean),
      colors: newColors.split(',').map((c) => c.trim()).filter(Boolean),
      inStock: true,
      featured: true,
      rating: 5.0,
      reviewsCount: 1,
      careGuide: careGuide.trim(),
      stitchType: 'Handcrafted signature stitch'
    };

    onAddProduct(productPayload);
    setActiveTab('products');
    setSmsToast(`"${newName}" was successfully published to Brenda Crochets storefront!`);
    setTimeout(() => setSmsToast(null), 3500);

    // Reset form
    setNewName('');
    setNewDescription('');
  };

  // Quick SMS update trigger for Brenda
  const handleNotifyCustomer = (order: Order) => {
    const msg = `Dispatch update sent to ${order.customerName} (${order.customerPhone}): Your order #${order.orderNumber} is marked "${order.orderStatus.toUpperCase()}"!`;
    setSmsToast(msg);
    setTimeout(() => setSmsToast(null), 4000);
  };

  const totalRevenue = orders.reduce((acc, o) => acc + o.totalKes, 0);

  return (
    <div className="bg-[#FAF7F5] min-h-screen text-stone-900 pb-20 rounded-none">
      
      {/* Studio Banner */}
      <div className="bg-stone-900 text-white border-b border-stone-800 rounded-none">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-rose-400 text-xs font-semibold uppercase tracking-wider">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Brenda's Creator & Studio Management Portal</span>
            </div>
            <h1 className="font-serif text-2xl sm:text-3xl font-bold mt-1 text-white">
              Brenda Crochets Studio
            </h1>
            <p className="text-xs text-stone-400 mt-0.5">
              Post new handmade items to your website, track M-Pesa payments & update delivery dispatch.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setActiveTab('new-product')}
              className="px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white text-xs font-semibold rounded-none flex items-center gap-2 cursor-pointer shadow-sm transition-colors border border-rose-500"
            >
              <PlusCircle className="w-4 h-4" />
              <span>Post New Product</span>
            </button>

            <button
              onClick={onExitStudio}
              className="px-4 py-2 bg-stone-800 hover:bg-stone-700 text-stone-200 text-xs font-medium rounded-none border border-stone-700 cursor-pointer transition-colors"
            >
              Back to Storefront
            </button>
          </div>
        </div>
      </div>

      {/* KPI Overview Strip */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-white p-4 rounded-none border border-rose-200 shadow-2xs">
            <div className="text-xs text-stone-500 font-medium">Total Paid Revenue</div>
            <div className="font-serif text-xl sm:text-2xl font-bold text-stone-900 mt-1 tabular-nums">
              KES {totalRevenue.toLocaleString()}
            </div>
            <div className="text-[11px] text-emerald-600 mt-0.5 flex items-center gap-1 font-medium">
              <CheckCircle className="w-3 h-3" />
              <span>Verified M-Pesa Payments</span>
            </div>
          </div>

          <div className="bg-white p-4 rounded-none border border-rose-200 shadow-2xs">
            <div className="text-xs text-stone-500 font-medium">Customer Orders</div>
            <div className="font-serif text-xl sm:text-2xl font-bold text-stone-900 mt-1 tabular-nums">
              {orders.length}
            </div>
            <div className="text-[11px] text-rose-700 mt-0.5 font-medium">
              Across Kenya & Global
            </div>
          </div>

          <div className="bg-white p-4 rounded-none border border-rose-200 shadow-2xs">
            <div className="text-xs text-stone-500 font-medium">Live Products on Site</div>
            <div className="font-serif text-xl sm:text-2xl font-bold text-stone-900 mt-1 tabular-nums">
              {products.length}
            </div>
            <div className="text-[11px] text-stone-400 mt-0.5">
              Available for browsing
            </div>
          </div>

          <div className="bg-white p-4 rounded-none border border-rose-200 shadow-2xs">
            <div className="text-xs text-stone-500 font-medium">Lipa na M-Pesa Till</div>
            <div className="font-mono text-xl sm:text-2xl font-bold text-emerald-700 mt-1">
              849204
            </div>
            <div className="text-[11px] text-stone-500 mt-0.5">
              Brenda Crochets Account
            </div>
          </div>
        </div>
      </div>

      {/* Toast Notification */}
      {smsToast && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-4">
          <div className="bg-stone-900 text-white p-3.5 rounded-none shadow-lg border border-rose-400/40 flex items-center justify-between text-xs animate-in slide-in-from-top-2">
            <div className="flex items-center gap-2">
              <MessageSquare className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>{smsToast}</span>
            </div>
            <button onClick={() => setSmsToast(null)} className="text-stone-400 hover:text-white cursor-pointer">
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* Studio Navigation Tabs */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex border-b border-rose-200 gap-6 text-sm font-semibold text-stone-600">
          <button
            onClick={() => setActiveTab('orders')}
            className={`pb-3 border-b-2 cursor-pointer transition-colors flex items-center gap-2 rounded-none ${
              activeTab === 'orders'
                ? 'border-rose-700 text-rose-800'
                : 'border-transparent hover:text-stone-900'
            }`}
          >
            <Package className="w-4 h-4" />
            <span>Customer Orders ({orders.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('products')}
            className={`pb-3 border-b-2 cursor-pointer transition-colors flex items-center gap-2 rounded-none ${
              activeTab === 'products'
                ? 'border-rose-700 text-rose-800'
                : 'border-transparent hover:text-stone-900'
            }`}
          >
            <ShoppingBag className="w-4 h-4" />
            <span>Store Products ({products.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('new-product')}
            className={`pb-3 border-b-2 cursor-pointer transition-colors flex items-center gap-2 rounded-none ${
              activeTab === 'new-product'
                ? 'border-rose-700 text-rose-800'
                : 'border-transparent hover:text-stone-900'
            }`}
          >
            <PlusCircle className="w-4 h-4 text-rose-600" />
            <span>Post New Item</span>
          </button>
        </div>

        {/* TAB 1: CUSTOMER ORDERS */}
        {activeTab === 'orders' && (
          <div className="mt-6 space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="font-serif text-lg font-bold text-stone-900">
                Recent Orders & Courier Dispatch
              </h2>
              <span className="text-xs text-stone-500">
                Sorted by newest first
              </span>
            </div>

            <div className="bg-white rounded-none border border-rose-200 overflow-hidden shadow-2xs divide-y divide-stone-100">
              {orders.map((order) => (
                <div key={order.id} className="p-4 sm:p-6 space-y-4 rounded-none">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-stone-100 pb-3">
                    <div className="space-y-0.5">
                      <div className="flex items-center gap-2">
                        <span className="font-mono font-bold text-stone-900 text-sm">
                          {order.orderNumber}
                        </span>
                        <span className="text-xs text-stone-400">·</span>
                        <span className="text-xs text-stone-500">
                          {new Date(order.createdAt).toLocaleString()}
                        </span>
                      </div>
                      <p className="text-xs text-stone-600">
                        Customer: <strong className="text-stone-900">{order.customerName}</strong> ({order.customerPhone}) · {order.customerEmail}
                      </p>
                    </div>

                    <div className="flex items-center gap-2">
                      <span className="text-xs font-mono font-semibold bg-emerald-50 text-emerald-800 px-2.5 py-1 rounded-none border border-emerald-300">
                        M-Pesa: {order.mpesaReceiptCode}
                      </span>
                      <span className="text-sm font-bold text-rose-800 tabular-nums">
                        KES {order.totalKes.toLocaleString()}
                      </span>
                    </div>
                  </div>

                  {/* Address and Items */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                    <div className="space-y-1 bg-stone-50 p-3 rounded-none border border-stone-300">
                      <div className="flex items-center gap-1.5 font-semibold text-stone-800">
                        <Truck className="w-3.5 h-3.5 text-rose-600" />
                        <span>Delivery Destination: {order.deliveryZone.name}</span>
                      </div>
                      <p className="text-stone-600">
                        <strong>Address:</strong> {order.deliveryAddress}
                      </p>
                      {order.orderNotes && (
                        <p className="text-stone-500 italic">
                          <strong>Note:</strong> "{order.orderNotes}"
                        </p>
                      )}
                      <p className="text-[11px] text-stone-400">
                        Delivery Charge: KES {order.deliveryFeeKes.toLocaleString()} · ETA: {order.deliveryZone.estimatedDays}
                      </p>
                    </div>

                    <div className="space-y-2">
                      <p className="font-semibold text-stone-700">Order Items ({order.items.length}):</p>
                      <div className="space-y-1.5">
                        {order.items.map((item) => (
                          <div key={item.id} className="flex items-center justify-between text-stone-700">
                            <span className="truncate pr-2">
                              {item.quantity}x {item.product.name} ({item.selectedSize})
                            </span>
                            <span className="font-semibold shrink-0 tabular-nums">
                              KES {(item.product.priceKes * item.quantity).toLocaleString()}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Status Controller & Actions */}
                  <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-stone-100">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-semibold text-stone-600">Dispatch Status:</span>
                      <select
                        value={order.orderStatus}
                        onChange={(e) => onUpdateOrderStatus(order.id, e.target.value as Order['orderStatus'])}
                        className="text-xs font-semibold p-1.5 bg-rose-50 border border-rose-300 rounded-none text-stone-800 cursor-pointer"
                      >
                        <option value="received">Order Received</option>
                        <option value="knitting">Knitting in Atelier</option>
                        <option value="dispatched">Handed to Courier</option>
                        <option value="delivered">Delivered to Customer</option>
                      </select>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleNotifyCustomer(order)}
                        className="px-3 py-1.5 text-xs font-medium rounded-none bg-stone-100 hover:bg-stone-200 text-stone-700 flex items-center gap-1.5 cursor-pointer border border-stone-300"
                      >
                        <MessageSquare className="w-3.5 h-3.5 text-emerald-600" />
                        <span>Send SMS Dispatch Update</span>
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 2: PRODUCTS CATALOG MANAGEMENT */}
        {activeTab === 'products' && (
          <div className="mt-6 space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="font-serif text-lg font-bold text-stone-900">
                Current Products on Brenda Crochets
              </h2>
              <button
                onClick={() => setActiveTab('new-product')}
                className="text-xs font-semibold text-rose-700 hover:underline flex items-center gap-1 cursor-pointer"
              >
                <PlusCircle className="w-3.5 h-3.5" />
                <span>Add Another Piece</span>
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {products.map((product) => (
                <div
                  key={product.id}
                  className="bg-white p-3.5 rounded-none border border-rose-200 shadow-2xs flex gap-3 relative"
                >
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-20 h-20 object-cover rounded-none bg-stone-100 shrink-0 border border-stone-200"
                  />
                  <div className="flex-1 flex flex-col justify-between text-xs">
                    <div>
                      <span className="text-[10px] uppercase font-semibold text-rose-800">
                        {product.categoryLabel.split('&')[0]}
                      </span>
                      <h4 className="font-serif font-bold text-stone-900 text-sm line-clamp-1 mt-0.5">
                        {product.name}
                      </h4>
                      <p className="text-stone-500 text-[11px] line-clamp-1 mt-0.5">
                        {product.material}
                      </p>
                    </div>

                    <div className="flex items-center justify-between pt-1">
                      <span className="font-bold text-stone-900 tabular-nums">
                        KES {product.priceKes.toLocaleString()}
                      </span>
                      <button
                        onClick={() => onDeleteProduct(product.id)}
                        className="text-stone-400 hover:text-red-600 p-1 cursor-pointer"
                        title="Remove product"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 3: POST NEW PRODUCT FORM */}
        {activeTab === 'new-product' && (
          <div className="mt-6 max-w-3xl bg-white p-6 sm:p-8 rounded-none border border-rose-200 shadow-sm space-y-6">
            <div>
              <div className="text-xs font-semibold uppercase tracking-wider text-rose-700">
                Storefront Inventory
              </div>
              <h2 className="font-serif text-2xl font-bold text-stone-900 mt-1">
                Post a New Crochet Creation
              </h2>
              <p className="text-xs text-stone-500 mt-0.5">
                Fill in the details below to immediately publish this piece to Brenda Crochets online shop.
              </p>
            </div>

            <form onSubmit={handleCreateProduct} className="space-y-5 text-xs text-stone-800 rounded-none">
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="sm:col-span-2">
                  <label className="block font-semibold text-stone-700 mb-1">
                    Product Title *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Blossom Chunky Crochet Cardigan with Balloon Sleeves"
                    value={newName}
                    onChange={(e) => setNewName(e.target.value)}
                    className="w-full text-xs p-2.5 bg-stone-50 border border-stone-300 rounded-none text-stone-900 focus:bg-white focus:outline-rose-600"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-stone-700 mb-1">
                    Category (Referencing Top Fashion Sites) *
                  </label>
                  <select
                    value={newCategory}
                    onChange={(e) => setNewCategory(e.target.value as ProductCategory)}
                    className="w-full text-xs p-2.5 bg-stone-50 border border-stone-300 rounded-none text-stone-900 focus:outline-rose-600"
                  >
                    <option value="sweaters">Women's Sweaters & Chunky Cardigans</option>
                    <option value="dresses">Dresses & Matching Sets</option>
                    <option value="tops">Summer Crop Tops & Halters</option>
                    <option value="children">Children & Baby Hand-Knit Wears</option>
                    <option value="accessories">Bags, Bucket Hats & Accessories</option>
                    <option value="bespoke">Custom Made-to-Measure</option>
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-stone-700 mb-1">
                    Selling Price in KES *
                  </label>
                  <input
                    type="number"
                    required
                    min={100}
                    step={100}
                    placeholder="4500"
                    value={newPrice}
                    onChange={(e) => setNewPrice(Number(e.target.value))}
                    className="w-full text-xs p-2.5 bg-stone-50 border border-stone-300 rounded-none text-stone-900 focus:bg-white focus:outline-rose-600 font-semibold"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-stone-700 mb-1">
                    Original Price (Optional Compare-at in KES)
                  </label>
                  <input
                    type="number"
                    step={100}
                    placeholder="5200"
                    value={newOriginalPrice || ''}
                    onChange={(e) => setNewOriginalPrice(e.target.value ? Number(e.target.value) : undefined)}
                    className="w-full text-xs p-2.5 bg-stone-50 border border-stone-300 rounded-none text-stone-900 focus:bg-white focus:outline-rose-600"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-stone-700 mb-1">
                    Material / Yarn Composition *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="70% Organic Cotton, 30% Merino Wool"
                    value={newMaterial}
                    onChange={(e) => setNewMaterial(e.target.value)}
                    className="w-full text-xs p-2.5 bg-stone-50 border border-stone-300 rounded-none text-stone-900 focus:bg-white focus:outline-rose-600"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-stone-700 mb-1">
                    Lead Time / Delivery Readiness *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Ready to ship in 24 hours (or 5 days custom)"
                    value={newLeadTime}
                    onChange={(e) => setNewLeadTime(e.target.value)}
                    className="w-full text-xs p-2.5 bg-stone-50 border border-stone-300 rounded-none text-stone-900 focus:bg-white focus:outline-rose-600"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-stone-700 mb-1">
                    Available Sizes (comma-separated) *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Small, Medium, Large, Custom Fit"
                    value={newSizes}
                    onChange={(e) => setNewSizes(e.target.value)}
                    className="w-full text-xs p-2.5 bg-stone-50 border border-stone-300 rounded-none text-stone-900 focus:bg-white focus:outline-rose-600"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-stone-700 mb-1">
                    Color Variations (comma-separated) *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Blush Pink, Dusty Rose & Cream, Oatmeal"
                    value={newColors}
                    onChange={(e) => setNewColors(e.target.value)}
                    className="w-full text-xs p-2.5 bg-stone-50 border border-stone-300 rounded-none text-stone-900 focus:bg-white focus:outline-rose-600"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block font-semibold text-stone-700 mb-1">
                    Product Description *
                  </label>
                  <textarea
                    rows={3}
                    required
                    placeholder="Describe the stitch, the fit, comfort, and story behind this piece..."
                    value={newDescription}
                    onChange={(e) => setNewDescription(e.target.value)}
                    className="w-full text-xs p-2.5 bg-stone-50 border border-stone-300 rounded-none text-stone-900 focus:bg-white focus:outline-rose-600"
                  />
                </div>

                {/* Product Image Stage */}
                <div className="sm:col-span-2">
                  <label className="block font-semibold text-stone-700 mb-1">
                    Product Photography *
                  </label>
                  
                  <div className="flex flex-col sm:flex-row gap-4 items-start">
                    <div className="w-28 h-28 rounded-none bg-stone-100 overflow-hidden border border-stone-300 shrink-0">
                      <img
                        src={imagePreview}
                        alt="Product preview"
                        className="w-full h-full object-cover rounded-none"
                      />
                    </div>

                    <div className="flex-1 space-y-2">
                      <p className="text-stone-500 text-[11px]">
                        Upload a photo from your camera roll / computer or select one from Brenda's atelier archive:
                      </p>
                      
                      <label className="inline-flex items-center gap-1.5 px-3 py-2 bg-stone-100 hover:bg-stone-200 rounded-none cursor-pointer font-medium text-stone-700 text-xs border border-stone-300">
                        <Upload className="w-3.5 h-3.5 text-rose-700" />
                        <span>Choose Local Photo File</span>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleFileUpload}
                          className="hidden"
                        />
                      </label>

                      <div className="flex flex-wrap gap-2 pt-1">
                        <button
                          type="button"
                          onClick={() => {
                            setNewImage('/src/assets/images/crochet_chunky_cardigan_1792574550136.jpg');
                            setImagePreview('/src/assets/images/crochet_chunky_cardigan_1792574550136.jpg');
                          }}
                          className="text-[11px] px-2 py-1 bg-rose-50 border border-rose-300 rounded-none hover:bg-rose-100 cursor-pointer"
                        >
                          Use Cardigan Photo
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            setNewImage('/src/assets/images/crochet_knit_dress_1792574551072.jpg');
                            setImagePreview('/src/assets/images/crochet_knit_dress_1792574551072.jpg');
                          }}
                          className="text-[11px] px-2 py-1 bg-rose-50 border border-rose-300 rounded-none hover:bg-rose-100 cursor-pointer"
                        >
                          Use Knit Dress Photo
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            setNewImage('/src/assets/images/crochet_baby_set_1792574550078.jpg');
                            setImagePreview('/src/assets/images/crochet_baby_set_1792574550078.jpg');
                          }}
                          className="text-[11px] px-2 py-1 bg-rose-50 border border-rose-300 rounded-none hover:bg-rose-100 cursor-pointer"
                        >
                          Use Baby Romper Photo
                        </button>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="sm:col-span-2">
                  <label className="block font-semibold text-stone-700 mb-1">
                    Washing & Care Instructions
                  </label>
                  <input
                    type="text"
                    value={careGuide}
                    onChange={(e) => setCareGuide(e.target.value)}
                    className="w-full text-xs p-2.5 bg-stone-50 border border-stone-300 rounded-none text-stone-900 focus:bg-white focus:outline-rose-600"
                  />
                </div>

              </div>

              <div className="pt-4 border-t border-stone-100 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setActiveTab('products')}
                  className="px-4 py-2.5 text-xs font-semibold text-stone-600 hover:text-stone-900 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 bg-rose-700 hover:bg-rose-800 text-white font-semibold text-xs rounded-none shadow-sm transition-colors cursor-pointer border border-rose-600"
                >
                  Publish to Brenda Crochets Storefront
                </button>
              </div>

            </form>
          </div>
        )}

      </div>
    </div>
  );
};
