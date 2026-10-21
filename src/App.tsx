import React, { useState, useEffect } from 'react';
import { Product, CartItem, Order, DeliveryZone, ProductCategory } from './types';
import { storage } from './services/storage';
import { DELIVERY_ZONES } from './data/deliveryZones';
import { Header } from './components/Header';
import { NetflixHeroCarousel } from './components/NetflixHeroCarousel';
import { ProductCard } from './components/ProductCard';
import { ProductDetailPage } from './components/ProductDetailPage';
import { CartDrawer } from './components/CartDrawer';
import { CheckoutModal } from './components/CheckoutModal';
import { OrderSuccessModal } from './components/OrderSuccessModal';
import { AdminStudio } from './components/AdminStudio';
import { CustomCommissionModal } from './components/CustomCommissionModal';
import { OrderTrackerModal } from './components/OrderTrackerModal';
import { MobileBottomNav } from './components/MobileBottomNav';
import { 
  Sparkles, 
  Search, 
  SlidersHorizontal, 
  Heart, 
  Truck, 
  ShieldCheck, 
  MessageSquare, 
  ArrowRight,
  Phone,
  Mail
} from 'lucide-react';

export default function App() {
  // Main Data States
  const [products, setProducts] = useState<Product[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [selectedZone, setSelectedZone] = useState<DeliveryZone>(DELIVERY_ZONES[1]); // Default: Nairobi Metro

  // Page Routing & Navigation
  const [currentView, setCurrentView] = useState<'catalog' | 'product-detail'>('catalog');
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [activeCategory, setActiveCategory] = useState<ProductCategory>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<'featured' | 'price-asc' | 'price-desc' | 'rating'>('featured');
  const [isStudioMode, setIsStudioMode] = useState(false);

  // Modal Dialog States
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [completedOrder, setCompletedOrder] = useState<Order | null>(null);
  const [isBespokeOpen, setIsBespokeOpen] = useState(false);
  const [isTrackerOpen, setIsTrackerOpen] = useState(false);
  const [trackingOrderId, setTrackingOrderId] = useState<string | undefined>(undefined);

  // Load persistent data on mount
  useEffect(() => {
    setProducts(storage.getProducts());
    setOrders(storage.getOrders());
    setCart(storage.getCart());
  }, []);

  // Save cart changes
  const updateCartState = (newCart: CartItem[]) => {
    setCart(newCart);
    storage.saveCart(newCart);
  };

  const handleAddToCart = (product: Product, size: string, color: string, quantity: number = 1) => {
    const itemId = `${product.id}-${size}-${color}`;
    const existingIndex = cart.findIndex((item) => item.id === itemId);

    let updatedCart: CartItem[];
    if (existingIndex > -1) {
      updatedCart = [...cart];
      updatedCart[existingIndex].quantity += quantity;
    } else {
      updatedCart = [
        ...cart,
        {
          id: itemId,
          productId: product.id,
          product,
          quantity,
          selectedSize: size,
          selectedColor: color,
        },
      ];
    }
    updateCartState(updatedCart);
  };

  const handleQuickAdd = (product: Product, size: string, color: string) => {
    handleAddToCart(product, size, color, 1);
  };

  const handleDirectBuy = (product: Product, size: string, color: string, quantity: number) => {
    handleAddToCart(product, size, color, quantity);
    setIsCheckoutOpen(true);
  };

  const handleOpenProductDetails = (product: Product) => {
    setSelectedProduct(product);
    setCurrentView('product-detail');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleUpdateQuantity = (itemId: string, delta: number) => {
    const updated = cart
      .map((item) => {
        if (item.id === itemId) {
          const newQty = item.quantity + delta;
          return newQty > 0 ? { ...item, quantity: newQty } : null;
        }
        return item;
      })
      .filter(Boolean) as CartItem[];
    updateCartState(updated);
  };

  const handleRemoveFromCart = (itemId: string) => {
    const updated = cart.filter((item) => item.id !== itemId);
    updateCartState(updated);
  };

  // Order Placement & Completion
  const handleOrderComplete = (orderData: Omit<Order, 'id' | 'orderNumber' | 'createdAt'>) => {
    const newOrder = storage.createOrder(orderData);
    setOrders(storage.getOrders());
    updateCartState([]); // Clear cart
    setIsCheckoutOpen(false);
    setCompletedOrder(newOrder);
  };

  // Admin Studio operations
  const handleAddProduct = (newProduct: Omit<Product, 'id'>) => {
    storage.addProduct(newProduct);
    setProducts(storage.getProducts());
  };

  const handleDeleteProduct = (id: string) => {
    storage.deleteProduct(id);
    setProducts(storage.getProducts());
  };

  const handleUpdateOrderStatus = (orderId: string, status: Order['orderStatus']) => {
    const updatedOrders = storage.updateOrderStatus(orderId, status);
    setOrders(updatedOrders);
  };

  // Filtered & Sorted Products
  const filteredProducts = products.filter((product) => {
    const matchesCategory = activeCategory === 'all' || product.category === activeCategory;
    const matchesSearch = 
      product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.material.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  }).sort((a, b) => {
    if (sortBy === 'price-asc') return a.priceKes - b.priceKes;
    if (sortBy === 'price-desc') return b.priceKes - a.priceKes;
    if (sortBy === 'rating') return b.rating - a.rating;
    return (b.featured ? 1 : 0) - (a.featured ? 1 : 0);
  });

  const cartItemsCount = cart.reduce((acc, item) => acc + item.quantity, 0);

  const categoriesList: { id: ProductCategory; label: string }[] = [
    { id: 'all', label: 'All Creations' },
    { id: 'sweaters', label: "Sweaters & Cardigans" },
    { id: 'dresses', label: 'Knit Dresses' },
    { id: 'tops', label: 'Summer Tops & Halters' },
    { id: 'children', label: 'Children & Baby Wears' },
    { id: 'accessories', label: 'Bags & Hats' },
  ];

  return (
    <div className="min-h-screen bg-[#FAF7F5] text-stone-800 flex flex-col font-sans selection:bg-rose-200 selection:text-rose-900 rounded-none">
      
      {/* Top Header */}
      <Header
        cartCount={cartItemsCount}
        onOpenCart={() => setIsCartOpen(true)}
        onOpenBespoke={() => setIsBespokeOpen(true)}
        onOpenTracker={() => setIsTrackerOpen(true)}
        isStudioMode={isStudioMode}
        onToggleStudioMode={() => setIsStudioMode(!isStudioMode)}
        activeCategory={activeCategory}
        onSelectCategory={(cat) => {
          setActiveCategory(cat);
          setCurrentView('catalog');
        }}
      />

      {/* Main View Router: Studio, Product Details Page, or Storefront Catalog */}
      {isStudioMode ? (
        <AdminStudio
          products={products}
          orders={orders}
          onAddProduct={handleAddProduct}
          onDeleteProduct={handleDeleteProduct}
          onUpdateOrderStatus={handleUpdateOrderStatus}
          onExitStudio={() => setIsStudioMode(false)}
        />
      ) : currentView === 'product-detail' && selectedProduct ? (
        <ProductDetailPage
          product={selectedProduct}
          allProducts={products}
          onBack={() => setCurrentView('catalog')}
          onAddToCart={handleAddToCart}
          onDirectBuy={(p, s, c, q) => handleDirectBuy(p, s, c, q)}
          onSelectRelated={(p) => {
            setSelectedProduct(p);
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          onOpenBespoke={() => setIsBespokeOpen(true)}
        />
      ) : (
        <main className="flex-1 pb-16 md:pb-0">
          
          {/* Netflix-Style Hero Carousel (Product image takes background as carousel animates) */}
          <NetflixHeroCarousel
            products={products}
            onViewProduct={handleOpenProductDetails}
            onQuickAdd={handleQuickAdd}
            onInstantBuy={(p, s, c) => handleDirectBuy(p, s, c, 1)}
          />

          {/* Collection Showcase Section */}
          <section id="collection-section" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14">
            
            {/* Section Header */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
              <div>
                <div className="flex items-center gap-2 text-xs font-semibold text-rose-800 tracking-wider uppercase mb-1">
                  <span>Authentic Handcrafted Catalog</span>
                  <span aria-hidden="true">·</span>
                  <span>{filteredProducts.length} pieces available</span>
                </div>
                <h2 className="font-serif text-3xl sm:text-4xl font-bold text-stone-900">
                  Curated Crochet Wears
                </h2>
              </div>

              {/* Search & Sort Filters */}
              <div className="flex flex-wrap items-center gap-3">
                <div className="relative min-w-56 flex-1 sm:flex-initial">
                  <Search className="w-4 h-4 text-stone-400 absolute left-3 top-3" />
                  <input
                    type="text"
                    placeholder="Search cardigans, dresses, tops..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full text-xs pl-9 pr-3 py-2 bg-white border border-stone-200 rounded-none text-stone-900 focus:outline-rose-600 shadow-2xs"
                  />
                </div>

                <div className="flex items-center gap-2">
                  <SlidersHorizontal className="w-3.5 h-3.5 text-stone-400 shrink-0" />
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value as any)}
                    className="text-xs bg-white border border-stone-200 rounded-none py-2 px-3 text-stone-700 font-medium focus:outline-rose-600 shadow-2xs cursor-pointer"
                  >
                    <option value="featured">Featured First</option>
                    <option value="price-asc">Price: Low to High</option>
                    <option value="price-desc">Price: High to Low</option>
                    <option value="rating">Top Rated</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Category Navigation Tabs */}
            <div className="flex items-center gap-2 overflow-x-auto pb-4 mb-8 no-scrollbar">
              {categoriesList.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => setActiveCategory(cat.id)}
                  className={`px-4 py-2 text-xs font-semibold rounded-none transition-all whitespace-nowrap shrink-0 cursor-pointer ${
                    activeCategory === cat.id
                      ? 'bg-rose-700 text-white shadow-sm border border-rose-700'
                      : 'bg-white text-stone-600 border border-stone-200 hover:border-rose-300 hover:text-stone-900'
                  }`}
                >
                  {cat.label}
                </button>
              ))}
            </div>

            {/* 3-Column / 2-Column Responsive Product Grid */}
            {filteredProducts.length === 0 ? (
              <div className="bg-white rounded-none border border-rose-200 p-12 text-center space-y-3">
                <p className="font-serif text-xl font-bold text-stone-800">No creations found</p>
                <p className="text-xs text-stone-500 max-w-sm mx-auto">
                  Try adjusting your search query or reset the category filter to view all pieces.
                </p>
                <button
                  onClick={() => {
                    setActiveCategory('all');
                    setSearchQuery('');
                  }}
                  className="px-4 py-2 bg-rose-700 text-white text-xs font-semibold rounded-none hover:bg-rose-800 cursor-pointer"
                >
                  Reset Filters
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
                {filteredProducts.map((product) => (
                  <ProductCard
                    key={product.id}
                    product={product}
                    onOpenDetails={handleOpenProductDetails}
                    onQuickAdd={handleQuickAdd}
                  />
                ))}
              </div>
            )}

          </section>

          {/* Artisanal Craftsmanship & Slow Fashion Section */}
          <section className="bg-white border-y border-rose-200 py-16">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
                
                <div className="lg:col-span-5 space-y-5 text-left">
                  <div className="inline-flex items-center gap-1.5 text-xs font-semibold tracking-wider uppercase text-rose-800 bg-rose-50 px-3 py-1 rounded-none border border-rose-200">
                    <Heart className="w-3.5 h-3.5 text-rose-600" />
                    <span>Meet the Artisan</span>
                  </div>

                  <h2 className="font-serif text-3xl sm:text-4xl font-bold text-stone-900 leading-tight">
                    Every piece is crafted stitch by stitch with authentic slow-fashion love.
                  </h2>

                  <p className="text-stone-600 text-sm sm:text-base leading-relaxed">
                    "I believe in clothes that breathe, hold memories, and carry human warmth. In an age of mass-produced fast fashion, Brenda Crochets celebrates the deliberate beauty of hand-weaving with natural Kenyan fibers, soft wool, and delicate blush palettes."
                  </p>

                  <div className="pt-2 flex items-center gap-4">
                    <button
                      onClick={() => setIsBespokeOpen(true)}
                      className="px-5 py-3 bg-rose-700 hover:bg-rose-800 text-white text-xs font-semibold rounded-none shadow-sm transition-colors cursor-pointer"
                    >
                      Commission a Custom Garment
                    </button>
                    <button
                      onClick={() => setIsStudioMode(true)}
                      className="text-xs font-semibold text-stone-600 hover:text-rose-800 underline cursor-pointer"
                    >
                      Post New Products (Brenda's Portal)
                    </button>
                  </div>
                </div>

                <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="p-6 bg-[#FAF7F5] rounded-none border border-rose-200 space-y-2">
                    <p className="font-serif text-xl font-bold text-stone-900">Zero-Waste Slow Fashion</p>
                    <p className="text-xs text-stone-600 leading-relaxed">
                      Crochet garments produce virtually zero fabric scraps compared to cut-and-sew apparel. Every single meter of yarn is knitted into the structure.
                    </p>
                  </div>

                  <div className="p-6 bg-[#FAF7F5] rounded-none border border-rose-200 space-y-2">
                    <p className="font-serif text-xl font-bold text-stone-900">Skin-Friendly Organic Yarn</p>
                    <p className="text-xs text-stone-600 leading-relaxed">
                      We prioritize breathable milk cotton and baby-safe combed cotton yarn that is hypoallergenic, gentle on sensitive skin, and machine-washable in cool water.
                    </p>
                  </div>

                  <div className="p-6 bg-[#FAF7F5] rounded-none border border-rose-200 space-y-2">
                    <p className="font-serif text-xl font-bold text-stone-900">Seamless Lipa na M-Pesa</p>
                    <p className="text-xs text-stone-600 leading-relaxed">
                      Instant mobile STK push checkout with zero payment friction. Automated SMS order receipt sent to your phone within seconds.
                    </p>
                  </div>

                  <div className="p-6 bg-[#FAF7F5] rounded-none border border-rose-200 space-y-2">
                    <p className="font-serif text-xl font-bold text-stone-900">Insured Doorstep Delivery</p>
                    <p className="text-xs text-stone-600 leading-relaxed">
                      Direct courier dispatch across all 47 Kenyan counties and international air express via DHL. Real-time order progress tracking available 24/7.
                    </p>
                  </div>
                </div>

              </div>
            </div>
          </section>

          {/* Social Proof & Testimonials */}
          <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
            <div className="text-center max-w-xl mx-auto mb-10 space-y-2">
              <span className="text-xs font-semibold text-rose-800 tracking-wider uppercase">
                Customer Stories
              </span>
              <h2 className="font-serif text-3xl font-bold text-stone-900">
                Loved by Women & Mothers Across Kenya
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-white p-6 rounded-none border border-rose-200 shadow-2xs space-y-3 text-left">
                <div className="flex text-amber-400 text-xs">★★★★★</div>
                <p className="text-xs sm:text-sm text-stone-700 leading-relaxed italic">
                  "I ordered the blush balloon-sleeve cardigan for my birthday trip to Naivasha. It is so warm, luxurious, and the stitch details are truly bespoke. Everyone kept asking where I bought it!"
                </p>
                <div className="pt-2 border-t border-stone-100 text-xs">
                  <p className="font-bold text-stone-900">Wangari Njoroge</p>
                  <p className="text-stone-400">Verified Online Buyer · Kenya</p>
                </div>
              </div>

              <div className="bg-white p-6 rounded-none border border-rose-200 shadow-2xs space-y-3 text-left">
                <div className="flex text-amber-400 text-xs">★★★★★</div>
                <p className="text-xs sm:text-sm text-stone-700 leading-relaxed italic">
                  "The petal pink baby set was the standout gift at my sister's baby shower. The organic cotton is baby-safe, so soft and gentle. M-Pesa checkout was instantaneous."
                </p>
                <div className="pt-2 border-t border-stone-100 text-xs">
                  <p className="font-bold text-stone-900">Dr. Faith Achieng</p>
                  <p className="text-stone-400">Verified Online Buyer · Kenya</p>
                </div>
              </div>

              <div className="bg-white p-6 rounded-none border border-rose-200 shadow-2xs space-y-3 text-left">
                <div className="flex text-amber-400 text-xs">★★★★★</div>
                <p className="text-xs sm:text-sm text-stone-700 leading-relaxed italic">
                  "Brenda made my custom lace dress for our garden brunch. Sent my measurements, got the SMS confirmation, and it fit like a dream. Proudly Kenyan craftsmanship!"
                </p>
                <div className="pt-2 border-t border-stone-100 text-xs">
                  <p className="font-bold text-stone-900">Mercy Kilonzo</p>
                  <p className="text-stone-400">Verified Bespoke Client · Kenya</p>
                </div>
              </div>
            </div>
          </section>

        </main>
      )}

      {/* Footer */}
      <footer className="bg-stone-900 text-stone-300 border-t border-stone-800 text-left pt-12 pb-16 rounded-none">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            
            <div className="space-y-3">
              <h3 className="font-serif text-2xl font-bold text-white">Brenda Crochets</h3>
              <p className="text-xs text-stone-400 leading-relaxed">
                Artisanal handcrafted knitwear boutique. Weaving cozy chunky cardigans, dresses, tops, and baby wears in signature blush pink palettes with instant doorstep delivery across Kenya.
              </p>
              <div className="text-xs text-rose-400 font-mono font-medium">
                Till: 849204 · Brenda Crochets
              </div>
            </div>

            <div className="space-y-2 text-xs">
              <p className="font-bold uppercase tracking-wider text-white">Curated Collections</p>
              <ul className="space-y-1.5 text-stone-400">
                <li><button onClick={() => { setActiveCategory('sweaters'); setCurrentView('catalog'); window.scrollTo({ top: 500, behavior: 'smooth' }); }} className="hover:text-white cursor-pointer">Women's Sweaters & Cardigans</button></li>
                <li><button onClick={() => { setActiveCategory('dresses'); setCurrentView('catalog'); window.scrollTo({ top: 500, behavior: 'smooth' }); }} className="hover:text-white cursor-pointer">Knit Dresses & Sets</button></li>
                <li><button onClick={() => { setActiveCategory('tops'); setCurrentView('catalog'); window.scrollTo({ top: 500, behavior: 'smooth' }); }} className="hover:text-white cursor-pointer">Summer Crop Tops & Halters</button></li>
                <li><button onClick={() => { setActiveCategory('children'); setCurrentView('catalog'); window.scrollTo({ top: 500, behavior: 'smooth' }); }} className="hover:text-white cursor-pointer">Children & Baby Heirloom Wears</button></li>
                <li><button onClick={() => { setActiveCategory('accessories'); setCurrentView('catalog'); window.scrollTo({ top: 500, behavior: 'smooth' }); }} className="hover:text-white cursor-pointer">Bags & Bucket Hats</button></li>
              </ul>
            </div>

            <div className="space-y-2 text-xs">
              <p className="font-bold uppercase tracking-wider text-white">Customer Support</p>
              <ul className="space-y-1.5 text-stone-400">
                <li><button onClick={() => setIsTrackerOpen(true)} className="hover:text-white cursor-pointer">Track Order Progress</button></li>
                <li><button onClick={() => setIsBespokeOpen(true)} className="hover:text-white cursor-pointer">Custom Sizing Request</button></li>
                <li><span className="text-stone-400">Doorstep Delivery Across All Counties (24-48h)</span></li>
                <li><span className="text-stone-400">Payment: Safaricom Lipa na M-Pesa</span></li>
              </ul>
            </div>

            <div className="space-y-2 text-xs">
              <p className="font-bold uppercase tracking-wider text-white">Get in Touch with Brenda</p>
              <div className="space-y-1.5 text-stone-400">
                <p className="flex items-center gap-2">
                  <Phone className="w-3.5 h-3.5 text-rose-500" />
                  <span>+254 712 345 678 (WhatsApp / Call)</span>
                </p>
                <p className="flex items-center gap-2">
                  <Mail className="w-3.5 h-3.5 text-rose-500" />
                  <span>orders@brendacrochets.co.ke</span>
                </p>
                <p className="text-[11px] text-stone-500 pt-1">
                  100% Online Boutique · Doorstep Delivery Across All Counties
                </p>
              </div>
            </div>

          </div>

          <div className="pt-8 border-t border-stone-800 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-stone-500">
            <p>© {new Date().getFullYear()} Brenda Crochets. All handcrafted rights reserved.</p>
            <div className="flex items-center gap-4">
              <span>Lipa na M-Pesa Verified</span>
              <span>·</span>
              <span>Automated SMS & Email System</span>
              <span>·</span>
              <button 
                onClick={() => setIsStudioMode(!isStudioMode)} 
                className="text-rose-400 hover:underline cursor-pointer"
              >
                {isStudioMode ? "Exit Studio" : "Brenda's Studio Login"}
              </button>
            </div>
          </div>
        </div>
      </footer>

      {/* Mobile Bottom Navigation */}
      <MobileBottomNav
        cartCount={cartItemsCount}
        onOpenCart={() => setIsCartOpen(true)}
        onOpenBespoke={() => setIsBespokeOpen(true)}
        onOpenTracker={() => setIsTrackerOpen(true)}
        onToggleStudio={() => setIsStudioMode(!isStudioMode)}
        isStudioMode={isStudioMode}
        onScrollToShop={() => {
          setIsStudioMode(false);
          setCurrentView('catalog');
          const el = document.getElementById('collection-section');
          el?.scrollIntoView({ behavior: 'smooth' });
        }}
      />

      {/* Cart Drawer */}
      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        items={cart}
        onUpdateQuantity={handleUpdateQuantity}
        onRemoveItem={handleRemoveFromCart}
        selectedZone={selectedZone}
        onSelectZone={(zone) => setSelectedZone(zone)}
        onProceedToCheckout={() => {
          setIsCartOpen(false);
          setIsCheckoutOpen(true);
        }}
      />

      {/* Checkout Modal */}
      <CheckoutModal
        isOpen={isCheckoutOpen}
        onClose={() => setIsCheckoutOpen(false)}
        items={cart}
        selectedZone={selectedZone}
        onSelectZone={(zone) => setSelectedZone(zone)}
        onOrderComplete={handleOrderComplete}
      />

      {/* Order Success & Automated Confirmation Modal */}
      <OrderSuccessModal
        order={completedOrder}
        onClose={() => setCompletedOrder(null)}
        onTrackOrder={(orderId) => {
          setTrackingOrderId(orderId);
          setCompletedOrder(null);
          setIsTrackerOpen(true);
        }}
      />

      {/* Bespoke Commission Modal */}
      <CustomCommissionModal
        isOpen={isBespokeOpen}
        onClose={() => setIsBespokeOpen(false)}
        onSuccess={() => {}}
      />

      {/* Order Tracker Modal */}
      <OrderTrackerModal
        isOpen={isTrackerOpen}
        onClose={() => setIsTrackerOpen(false)}
        orders={orders}
        initialOrderId={trackingOrderId}
      />

    </div>
  );
}
