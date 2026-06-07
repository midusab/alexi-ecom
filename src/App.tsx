import { useState, useEffect, useRef } from 'react';
import { Navbar } from './components/Navbar';
import { ProductCard } from './components/ProductCard';
import { CartSidebar } from './components/CartSidebar';
import { Footer } from './components/Footer';
import { ProductModal } from './components/ProductModal';
import { AuthModal } from './components/AuthModal';
import { UserProfileModal } from './components/UserProfileModal';
import { CookieBanner } from './components/CookieBanner';
import { FlashSaleCarousel } from './components/FlashSaleCarousel';
import { WhatsNewCarousel } from './components/WhatsNewCarousel';
import { ProductSuggestions } from './components/ProductSuggestions';
import { AdminDashboard } from './components/AdminDashboard';
import { products as initialProducts } from './data';
import { Product, CartItem, UserProfile, Order, AppConfig } from './types';
import { motion, useScroll, useTransform } from 'motion/react';
import { Smartphone, LayoutDashboard } from 'lucide-react';

export default function App() {
  const [user, setUser] = useState<UserProfile | null>({
    name: 'John Doe',
    email: 'john@example.com',
    role: 'admin',
    phone: '+254 712 345 678',
    location: 'Westlands, Nairobi',
    notifications: [
      { id: 'n-1', title: 'Order Shipped!', message: 'Your order #523614 is on its way.', date: '2 hours ago', read: false },
      { id: 'n-2', title: 'Welcome!', message: 'Thanks for joining our tech store.', date: '3 days ago', read: true }
    ],
    orders: [
      {
        id: '523614',
        date: '2024-06-05',
        total: 125400,
        status: 'Shipped',
        trackingNumber: 'TRK-982741',
        items: [
          { id: '1', name: 'iPhone 15 Pro', quantity: 1, price: 125400, image: 'https://images.unsplash.com/photo-1696446701796-da61225697cc?q=80&w=800&auto=format&fit=crop' }
        ]
      }
    ]
  });
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isUserProfileOpen, setIsUserProfileOpen] = useState(false);
  const [isAdminOpen, setIsAdminOpen] = useState(false);
  
  const [products, setProducts] = useState<Product[]>(initialProducts);
  const [allOrders, setAllOrders] = useState<Order[]>([]);
  
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [cartSidebarInitialTab, setCartSidebarInitialTab] = useState<'cart' | 'wishlist'>('cart');
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  const [wishlistItems, setWishlistItems] = useState<Product[]>([]);

  const [config, setConfig] = useState<AppConfig>({
    flashSale: {
      endTime: new Date(Date.now() + 1000 * 60 * 60 * 4 + 1000 * 60 * 23).toISOString(),
      productIds: initialProducts.slice(0, 5).map(p => p.id),
      discountPercentage: 15
    },
    whatsNew: {
      items: [
        {
          id: 'wn-1',
          title: 'iPhone 15 Pro Max',
          description: 'The ultimate iPhone is here. Titanium design, A17 Pro chip, and a 48MP main camera.',
          image: 'https://images.unsplash.com/photo-1696446701796-da61225697cc?q=80&w=800&auto=format&fit=crop',
          link: '#products',
          color: '#3b82f6'
        },
        {
          id: 'wn-2',
          title: 'Samsung S24 Ultra',
          description: 'Epic, just like that. Experience AI-powered photography and the fastest processor yet.',
          image: 'https://images.unsplash.com/photo-1707153673562-b94e3391702f?q=80&w=800&auto=format&fit=crop',
          link: '#products',
          color: '#10b981'
        }
      ]
    }
  });

  useEffect(() => {
    // Simulate data loading
    const timer = setTimeout(() => setIsLoading(false), 1200);
    return () => clearTimeout(timer);
  }, []);

  const handleToggleWishlist = (product: Product) => {
    if (!user) {
      setIsAuthModalOpen(true);
      return;
    }
    setWishlistItems(prev => {
      if (prev.find(p => p.id === product.id)) {
        return prev.filter(p => p.id !== product.id);
      }
      return [...prev, product];
    });
  };

  const filteredProducts = products.filter(product => 
    product.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    product.brand.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleAddToCart = (product: Product) => {
    if (!user) {
      setIsAuthModalOpen(true);
      return;
    }
    setCartItems((prevItems) => {
      const existingItem = prevItems.find((item) => item.id === product.id);
      if (existingItem) {
        return prevItems.map((item) =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      return [...prevItems, { ...product, quantity: 1 }];
    });
    setIsCartOpen(true);
  };

  const handleUpdateQuantity = (id: string, quantity: number) => {
    setCartItems((prevItems) =>
      prevItems.map((item) => (item.id === id ? { ...item, quantity } : item))
    );
  };

  const handleRemoveItem = (id: string) => {
    setCartItems((prevItems) => prevItems.filter((item) => item.id !== id));
  };

  const handleCheckoutComplete = (order: Order) => {
    if (user) {
      const updatedUser = { ...user, orders: [order, ...user.orders] };
      setUser(updatedUser);
      setAllOrders(prev => [order, ...prev]);
      setCartItems([]);
    }
  };

  // Admin Handlers
  const handleAddProduct = (p: Product) => {
    setProducts(prev => {
      const exists = prev.some(item => item.id === p.id);
      if (exists) return prev.map(item => item.id === p.id ? p : item);
      return [p, ...prev];
    });
  };
  const handleUpdateProduct = (updated: Product) => setProducts(products.map(p => p.id === updated.id ? updated : p));
  const handleDeleteProduct = (id: string) => setProducts(products.filter(p => p.id !== id));
  const handleUpdateOrderStatus = (orderId: string, status: Order['status']) => {
    setAllOrders(allOrders.map(o => o.id === orderId ? { ...o, status } : o));
    // If current user owns this order, update it in their profile too
    if (user) {
      setUser({
        ...user,
        orders: user.orders.map(o => o.id === orderId ? { ...o, status } : o)
      });
    }
  };

  const cartItemCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  const heroRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"],
  });
  const backgroundY = useTransform(scrollYProgress, [0, 1], ["0%", "50%"]);

  return (
    <div className="min-h-screen pb-20">
      <Navbar
        user={user}
        onLoginClick={() => setIsAuthModalOpen(true)}
        onLogout={() => { setUser(null); setCartItems([]); setWishlistItems([]); setIsAdminOpen(false); }}
        onProfileClick={() => setIsUserProfileOpen(true)}
        onAdminClick={() => setIsAdminOpen(true)}
        cartItemCount={cartItemCount}
        onCartClick={() => { 
          if (!user) {
            setIsAuthModalOpen(true);
            return;
          }
          setCartSidebarInitialTab('cart'); setIsCartOpen(true); 
        }}
        wishlistCount={wishlistItems.length}
        onWishlistClick={() => { 
          if (!user) {
            setIsAuthModalOpen(true);
            return;
          }
          setCartSidebarInitialTab('wishlist'); setIsCartOpen(true); 
        }}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
      />

      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        onLogin={(loggedUser) => setUser(loggedUser)}
      />

      <AdminDashboard 
        isOpen={isAdminOpen}
        onClose={() => setIsAdminOpen(false)}
        allProducts={products}
        onAddProduct={handleAddProduct}
        onUpdateProduct={handleUpdateProduct}
        onDeleteProduct={handleDeleteProduct}
        allOrders={allOrders}
        onUpdateOrderStatus={handleUpdateOrderStatus}
        config={config}
        onUpdateConfig={setConfig}
      />

      {user && (
        <UserProfileModal
          isOpen={isUserProfileOpen}
          onClose={() => setIsUserProfileOpen(false)}
          user={user}
          onUpdateProfile={(data) => setUser({ ...user, ...data })}
          wishlistItems={wishlistItems}
          onRemoveFromWishlist={handleToggleWishlist}
          onAddToCart={handleAddToCart}
          onLogout={() => {
            setUser(null);
            setCartItems([]);
            setWishlistItems([]);
            setIsUserProfileOpen(false);
          }}
        />
      )}

        <CartSidebar
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        initialTab={cartSidebarInitialTab}
        items={cartItems}
        onUpdateQuantity={handleUpdateQuantity}
        onRemoveItem={handleRemoveItem}
        wishlistItems={wishlistItems}
        onToggleWishlist={handleToggleWishlist}
        onAddToCart={handleAddToCart}
        onCheckoutComplete={handleCheckoutComplete}
      />

      <main className="w-full flex-1">
        {/* Home Section */}
        <section ref={heroRef} id="home" className="pt-32 pb-24 flex flex-col items-center text-center space-y-4 scroll-mt-20 relative overflow-hidden min-h-[70vh] justify-center bg-slate-900">
          <motion.div 
            style={{ y: backgroundY }}
            className="absolute inset-0 z-0 h-[120%]"
          >
            <img src="https://images.unsplash.com/photo-1616348436168-de43ad0db179?q=80&w=2400&auto=format&fit=crop" alt="Hero background" className="w-full h-full object-cover opacity-60 mix-blend-overlay" crossOrigin="anonymous" />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/60 to-slate-900/20"></div>
          </motion.div>
          <div className="relative z-10 flex flex-col items-center p-8 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-400/20 text-blue-300 text-sm font-medium mb-4 backdrop-blur-md"
            >
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
              </span>
              New Arrivals
            </motion.div>
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="font-display text-4xl sm:text-5xl lg:text-7xl font-bold tracking-tight text-white drop-shadow-sm mb-6"
            >
              The Next Generation of <br className="hidden sm:block" />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-300">
                Mobile Devices
              </span>
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="max-w-2xl text-lg sm:text-xl text-slate-300 leading-relaxed font-medium"
            >
              Discover our curated collection of premium smartphones. Engineered for power, designed for elegance, and built to connect your world.
            </motion.p>
          </div>
        </section>

        <WhatsNewCarousel items={config.whatsNew.items} />

        <FlashSaleCarousel 
          products={products} 
          onProductClick={(product) => setSelectedProduct(product)}
          onAddToCart={handleAddToCart}
          config={config.flashSale}
        />

        <div className="px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full">
          <ProductSuggestions 
            products={products}
            onProductClick={(product) => setSelectedProduct(product)}
          />

          {/* Product Grid */}
          <section id="products" className="py-16 scroll-mt-20">
          <div className="flex flex-col items-center mb-12">
            <h2 className="font-display text-3xl font-bold text-slate-900 mb-4">Our Products</h2>
            <p className="text-slate-600 max-w-2xl text-center">Browse our latest lineup of high-performance devices tailored for every lifestyle.</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 xl:gap-10 min-h-[400px]">
            {isLoading ? (
              <div className="col-span-full flex justify-center items-center">
                <div className="relative flex justify-center items-center w-16 h-16">
                  <div className="absolute w-full h-full border-2 border-slate-100 rounded-full"></div>
                  <div className="absolute w-full h-full border-2 border-rose-500 border-t-transparent rounded-full animate-spin"></div>
                  <Smartphone className="w-6 h-6 text-slate-400 relative z-10" />
                </div>
              </div>
            ) : filteredProducts.length > 0 ? (
              filteredProducts.map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  onAddToCart={handleAddToCart}
                  onClick={() => { setSelectedProduct(product); }}
                  isWishlisted={!!wishlistItems.find(p => p.id === product.id)}
                  onToggleWishlist={() => handleToggleWishlist(product)}
                />
              ))
            ) : (
              <div className="col-span-1 sm:col-span-2 lg:col-span-3 text-center py-12 text-slate-500">
                <p className="text-lg">No products found matching "{searchQuery}".</p>
                <button 
                  onClick={() => setSearchQuery('')}
                  className="btn-ghost"
                >
                  Clear search
                </button>
              </div>
            )}
          </div>
        </section>

        {/* Shopping Section */}
        <section id="shopping" className="py-16 scroll-mt-20">
          <div className="bg-slate-900 rounded-3xl p-6 sm:p-12 text-center sm:text-left flex flex-col md:flex-row items-center justify-between gap-8 relative overflow-hidden">
            <div className="absolute top-0 right-0 -mr-16 -mt-16 w-64 h-64 rounded-full bg-blue-500/20 blur-3xl"></div>
            <div className="absolute bottom-0 left-0 -ml-16 -mb-16 w-48 h-48 rounded-full bg-cyan-500/20 blur-3xl"></div>
            
            <div className="max-w-xl z-10 w-full">
              <h2 className="font-display text-2xl sm:text-3xl font-bold text-white mb-4">Smart Shopping Experience</h2>
              <p className="text-slate-300 sm:text-lg mb-6">Enjoy free express shipping on all orders, hassle-free 30-day returns, and exclusive price-match guarantees when you shop directly with Alexi.</p>
              <button className="btn-secondary w-full sm:w-auto">
                Learn About Our Benefits
              </button>
            </div>
            <div className="w-full sm:w-2/3 md:w-1/3 aspect-square sm:aspect-[4/3] md:aspect-square bg-slate-800/50 rounded-2xl flex items-center justify-center relative z-10 border border-slate-700/50 backdrop-blur-sm overflow-hidden">
               <img src="https://images.unsplash.com/photo-1556740738-b6a63e27c4df?q=80&w=800&auto=format&fit=crop" alt="Shopping Experience" className="w-full h-full object-cover" crossOrigin="anonymous" />
            </div>
          </div>
        </section>

        {/* About Us Section */}
        <section id="about" className="py-16 scroll-mt-20">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 items-center">
            <div className="aspect-[16/9] sm:aspect-[4/3] rounded-3xl overflow-hidden bg-slate-100 relative shadow-inner">
              <img src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?q=80&w=1200&auto=format&fit=crop" alt="Alexi Team" className="w-full h-full object-cover" crossOrigin="anonymous" />
            </div>
            <div className="text-center sm:text-left">
              <h2 className="font-display text-2xl sm:text-3xl font-bold text-slate-900 mb-4 sm:mb-6">About Alexi</h2>
              <p className="text-slate-600 sm:text-lg mb-4 sm:mb-6 leading-relaxed">
                Founded in 2026, Alexi started with a simple belief: mobile technology should empower people without overwhelming them. We carefully curate the world's most advanced devices and make them accessible to everyone.
              </p>
              <p className="text-slate-600 sm:text-lg leading-relaxed">
                Our global team of tech enthusiasts is dedicated to providing not just phones, but complete daily companions that enhance how you live, work, and connect with the ones who matter most.
              </p>
            </div>
          </div>
        </section>

        {/* Support Section */}
        <section id="support" className="py-16 scroll-mt-20">
          <div className="bg-blue-50 rounded-3xl p-6 sm:p-12 overflow-hidden relative">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center">
              <div>
                <div className="mb-8 text-center sm:text-left">
                  <h2 className="font-display text-2xl sm:text-3xl font-bold text-slate-900 mb-4">We're Here to Help</h2>
                  <p className="text-slate-600 sm:text-lg">Whether you need technical assistance, warranty information, or order tracking, our dedicated support team is available 24/7.</p>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2 gap-4">
                  {['Technical Support', 'Order Tracking', 'Warranty & Repairs', 'Live Chat'].map((topic, i) => (
                    <div key={`support-topic-${i}`} className="bg-white rounded-2xl p-5 shadow-sm border border-slate-100 flex items-center gap-4 hover:-translate-y-1 transition-transform cursor-pointer">
                      <div className="w-10 h-10 sm:w-12 sm:h-12 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center shrink-0 font-bold">
                        {i + 1}
                      </div>
                      <div className="text-left">
                        <h3 className="font-semibold text-slate-900 text-sm sm:text-base leading-tight mb-1">{topic}</h3>
                        <p className="text-xs text-slate-500">Learn more about {topic.toLowerCase()}.</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              <div className="hidden lg:block aspect-square lg:aspect-[4/5] rounded-3xl overflow-hidden bg-slate-200 relative shadow-inner">
                <img src="https://images.unsplash.com/photo-1544717305-2782549b5136?q=80&w=800&auto=format&fit=crop" alt="Customer Support" className="w-full h-full object-cover" crossOrigin="anonymous" />
              </div>
            </div>
          </div>
        </section>

        {/* Explore With Us Section */}
        <section id="explore" className="py-16 scroll-mt-20 pb-24">
          <h2 className="font-display text-3xl font-bold text-slate-900 mb-10 text-center">Explore With Us</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { title: 'Innovation Lab', desc: 'See our latest prototypes', img: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?q=80&w=600&auto=format&fit=crop' },
              { title: 'Global Community', desc: 'Connect with Alexi users', img: 'https://images.unsplash.com/photo-1529156069898-49953e39b3ac?q=80&w=600&auto=format&fit=crop' },
              { title: 'Sustainability', desc: 'Our green initiatives', img: 'https://images.unsplash.com/photo-1518531933037-91b2f5f229cc?q=80&w=600&auto=format&fit=crop' },
              { title: 'Events', desc: 'Upcoming product launches', img: 'https://images.unsplash.com/photo-1540317580384-e5d43867caa6?q=80&w=600&auto=format&fit=crop' }
            ].map((item, i) => (
              <div key={`explore-item-${i}`} className="group relative rounded-2xl overflow-hidden aspect-[4/5] cursor-pointer">
                <img src={item.img} alt={item.title} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" crossOrigin="anonymous" />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900/90 via-slate-900/20 to-transparent flex flex-col justify-end p-6">
                  <h3 className="text-white font-display font-bold text-xl mb-1">{item.title}</h3>
                  <p className="text-slate-300 text-sm opacity-0 translate-y-4 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </section>
        </div>
      </main>
      <Footer />
      
      {selectedProduct && (
        <ProductModal
          product={selectedProduct}
          isOpen={!!selectedProduct}
          onClose={() => setSelectedProduct(null)}
          onAddToCart={handleAddToCart}
        />
      )}
      
      <CookieBanner />
    </div>
  );
}
