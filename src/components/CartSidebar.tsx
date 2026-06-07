import { useState, useEffect } from 'react';
import { CartItem, Product, Order } from '../types';
import { X, Minus, Plus, ShoppingBag, Loader2, Heart, ShoppingCart } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface CartSidebarProps {
  isOpen: boolean;
  onClose: () => void;
  initialTab?: 'cart' | 'wishlist';
  items: CartItem[];
  onUpdateQuantity: (id: string, newQuantity: number) => void;
  onRemoveItem: (id: string) => void;
  wishlistItems: Product[];
  onToggleWishlist: (product: Product) => void;
  onAddToCart: (product: Product) => void;
  onCheckoutComplete?: (order: Order) => void;
}

export function CartSidebar({ isOpen, onClose, initialTab = 'cart', items, onUpdateQuantity, onRemoveItem, wishlistItems, onToggleWishlist, onAddToCart, onCheckoutComplete }: CartSidebarProps) {
  const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const [activeSidebarTab, setActiveSidebarTab] = useState<'cart' | 'wishlist'>(initialTab);
  const [checkoutPhase, setCheckoutPhase] = useState<'cart' | 'payment' | 'verification' | 'success'>('cart');
  const [isProcessing, setIsProcessing] = useState(false);
  const [mpesaCode, setMpesaCode] = useState('');

  useEffect(() => {
    if (isOpen) {
      setActiveSidebarTab(initialTab);
    }
  }, [isOpen, initialTab]);

  const handleCheckoutClick = () => {
    setCheckoutPhase('payment');
  };

  const handlePaymentCompleted = () => {
    setCheckoutPhase('verification');
  };

  const handleVerify = () => {
    if (!mpesaCode.trim()) return;
    setIsProcessing(true);
    setTimeout(() => {
      setIsProcessing(false);
      setCheckoutPhase('success');
      
      if (onCheckoutComplete) {
        onCheckoutComplete({
          id: Math.floor(Math.random() * 1000000).toString(),
          date: new Date().toLocaleDateString(),
          total: subtotal,
          status: 'Processing',
          items: items.map(item => ({
            id: item.id,
            name: item.name,
            quantity: item.quantity,
            price: item.price,
            image: item.image,
            brand: item.brand
          }))
        });
      }
    }, 1500);
  };

  const handleWhatsAppOrder = () => {
    let message = `*New Verified Order from Alexi Store*\n\n`;
    message += `*Order Items:*\n`;
    
    items.forEach(item => {
      message += `▪ ${item.name} x${item.quantity} - KSh ${(item.price * item.quantity).toLocaleString()}\n`;
    });
    
    message += `\n*Total Amount:* KSh ${subtotal.toLocaleString()}\n`;
    message += `*M-PESA Code:* ${mpesaCode}\n`;
    message += `\nPayment verified. Please process the order.`;
    
    const encodedMessage = encodeURIComponent(message);
    const whatsappNumber = "1234567890"; 
    const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodedMessage}`;

    window.open(whatsappUrl, '_blank');
    onClose();
  };

  const handleClose = () => {
    onClose();
    setTimeout(() => {
      setCheckoutPhase('cart');
      setMpesaCode('');
    }, 300);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={handleClose}
            className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 transition-opacity"
          />

          {/* Sidebar */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed top-0 right-0 h-full w-full max-w-md bg-white shadow-2xl z-50 flex flex-col"
          >
            {/* Header */}
            <div className="px-6 py-5 border-b border-slate-100 flex flex-col z-10 bg-white shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <ShoppingBag className="w-5 h-5 text-blue-600" />
                  <h2 className="font-display font-bold text-lg text-slate-900">
                    {activeSidebarTab === 'wishlist' ? "Your Wishlist" : (checkoutPhase === 'cart' ? "Your Cart" : checkoutPhase === 'payment' ? "Payment" : checkoutPhase === 'verification' ? "Verification" : "Order Confirmed")}
                  </h2>
                </div>
                <button
                  onClick={handleClose}
                  className="btn-icon"
                  aria-label="Close cart"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              {checkoutPhase === 'cart' && (
                <div className="flex gap-4">
                  <button
                    onClick={() => setActiveSidebarTab('cart')}
                    className={`flex items-center gap-1.5 pb-2 text-sm font-medium border-b-2 transition-colors ${activeSidebarTab === 'cart' ? 'border-blue-600 text-blue-600' : 'border-transparent text-slate-500 hover:text-slate-700'}`}
                  >
                    Cart ({items.length})
                  </button>
                  <button
                    onClick={() => setActiveSidebarTab('wishlist')}
                    className={`flex items-center gap-1.5 pb-2 text-sm font-medium border-b-2 transition-colors ${activeSidebarTab === 'wishlist' ? 'border-blue-600 text-blue-600' : 'border-transparent text-slate-500 hover:text-slate-700'}`}
                  >
                    Wishlist ({wishlistItems.length})
                  </button>
                </div>
              )}
            </div>

            {/* Content Area */}
            <div className="flex-1 overflow-y-auto w-full relative">
              <AnimatePresence mode="wait">
              {activeSidebarTab === 'wishlist' && (
                <motion.div 
                  key="wishlist"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  className="h-full flex flex-col"
                >
                  {wishlistItems.length === 0 ? (
                    <div className="flex-1 flex flex-col items-center justify-center text-slate-500 p-6 space-y-4">
                      <Heart className="w-12 h-12 text-slate-200" />
                      <p>Your wishlist is empty</p>
                    </div>
                  ) : (
                    <ul className="p-6 space-y-6 flex-1">
                      {wishlistItems.map((item) => (
                        <motion.li
                          layout
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, scale: 0.9 }}
                          key={item.id}
                          className="flex gap-4"
                        >
                          <div className="w-20 h-20 rounded-xl overflow-hidden bg-slate-100 shrink-0">
                            <img
                              src={item.image}
                              alt={item.name}
                              crossOrigin="anonymous"
                              className="w-full h-full object-cover"
                            />
                          </div>
                          
                          <div className="flex-1 flex flex-col justify-between">
                            <div className="flex justify-between items-start gap-2">
                              <h3 className="font-medium text-slate-900 text-sm leading-tight">
                                {item.name}
                              </h3>
                              <span className="font-semibold text-sm whitespace-nowrap">
                                KSh {item.price.toLocaleString()}
                              </span>
                            </div>
                            
                            <div className="flex items-center justify-between mt-2">
                              <button
                                onClick={() => {
                                  onAddToCart(item);
                                  onToggleWishlist(item);
                                }}
                                className="flex items-center gap-1 text-xs text-blue-600 hover:text-blue-700 font-medium"
                              >
                                <ShoppingCart className="w-3.5 h-3.5" />
                                Add to Cart
                              </button>
                              
                              <button
                                onClick={() => onToggleWishlist(item)}
                                className="text-xs text-rose-500 hover:text-rose-600 font-medium"
                              >
                                Remove
                              </button>
                            </div>
                          </div>
                        </motion.li>
                      ))}
                    </ul>
                  )}
                </motion.div>
              )}

              {activeSidebarTab === 'cart' && checkoutPhase === 'cart' && (
                <motion.div 
                  key="cart"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  className="h-full flex flex-col"
                >
                  {items.length === 0 ? (
                    <div className="flex-1 flex flex-col items-center justify-center text-slate-500 p-6 space-y-4">
                      <ShoppingBag className="w-12 h-12 text-slate-200" />
                      <p>Your cart is empty</p>
                    </div>
                  ) : (
                    <>
                      <ul className="p-6 space-y-6 flex-1">
                        {items.map((item) => (
                          <motion.li
                            layout
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.9 }}
                            key={item.id}
                            className="flex gap-4"
                          >
                            <div className="w-20 h-20 rounded-xl overflow-hidden bg-slate-100 shrink-0">
                              <img
                                src={item.image}
                                alt={item.name}
                                crossOrigin="anonymous"
                                className="w-full h-full object-cover"
                              />
                            </div>
                            
                            <div className="flex-1 flex flex-col justify-between">
                              <div className="flex justify-between items-start gap-2">
                                <h3 className="font-medium text-slate-900 text-sm leading-tight">
                                  {item.name}
                                </h3>
                                <span className="font-semibold text-sm whitespace-nowrap">
                                  KSh {item.price.toLocaleString()}
                                </span>
                              </div>
                              
                              <div className="flex items-center justify-between mt-2">
                                {/* Quantity Controls */}
                                <div className="flex items-center bg-slate-50 border border-slate-200 rounded-lg overflow-hidden">
                                  <button
                                    onClick={() => {
                                      if (item.quantity > 1) {
                                        onUpdateQuantity(item.id, item.quantity - 1);
                                      } else {
                                        onRemoveItem(item.id);
                                      }
                                    }}
                                    className="px-2.5 py-1.5 text-slate-500 hover:text-slate-900 hover:bg-slate-200 transition-colors"
                                  >
                                    <Minus className="w-3.5 h-3.5" />
                                  </button>
                                  <span className="w-8 text-center text-sm font-medium text-slate-700">
                                    {item.quantity}
                                  </span>
                                  <button
                                    onClick={() => onUpdateQuantity(item.id, item.quantity + 1)}
                                    className="px-2.5 py-1.5 text-slate-500 hover:text-slate-900 hover:bg-slate-200 transition-colors"
                                  >
                                    <Plus className="w-3.5 h-3.5" />
                                  </button>
                                </div>
                                
                                <button
                                  onClick={() => onRemoveItem(item.id)}
                                  className="text-xs text-rose-500 hover:text-rose-600 font-medium tracking-wide underline underline-offset-2"
                                >
                                  Remove
                                </button>
                              </div>
                            </div>
                          </motion.li>
                        ))}
                      </ul>
                      <div className="p-6 border-t border-slate-100 bg-slate-50 mt-auto">
                        <div className="flex justify-between items-center mb-6">
                          <span className="text-slate-500 font-medium">Subtotal</span>
                          <span className="font-display font-bold text-xl text-slate-900">
                            KSh {subtotal.toLocaleString()}
                          </span>
                        </div>
                        <button 
                          onClick={handleCheckoutClick}
                          className="btn-primary w-full py-3.5"
                        >
                          Checkout
                        </button>
                      </div>
                    </>
                  )}
                </motion.div>
              )}

              {checkoutPhase === 'payment' && (
                <motion.div
                  key="payment"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  className="p-6 flex flex-col h-full items-center justify-center space-y-6 text-center"
                >
                  <div className="w-16 h-16 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mb-2">
                    <span className="font-bold text-2xl">$</span>
                  </div>
                  <div className="space-y-4 max-w-sm">
                    <h3 className="text-xl font-bold text-slate-900">M-PESA Payment</h3>
                    <p className="text-slate-600 text-sm">
                      Please make a payment of <strong className="text-slate-900">KSh {subtotal.toLocaleString()}</strong> to the Till Number below.
                    </p>
                    <div className="bg-slate-100 p-4 rounded-xl border border-slate-200">
                      <span className="text-xs text-slate-500 uppercase font-semibold tracking-wider">Buy Goods Till Number</span>
                      <div className="text-3xl font-mono font-bold text-slate-900 mt-1">
                        123456
                      </div>
                    </div>
                  </div>
                  <div className="w-full mt-8">
                    <button 
                      onClick={handlePaymentCompleted}
                      className="btn-primary w-full py-3.5"
                    >
                      I have made the payment
                    </button>
                    <button 
                      onClick={() => setCheckoutPhase('cart')}
                      className="btn-outline w-full mt-3 py-3.5"
                    >
                      Back to Cart
                    </button>
                  </div>
                </motion.div>
              )}

              {checkoutPhase === 'verification' && (
                <motion.div
                  key="verification"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  className="p-6 flex flex-col h-full items-center justify-center space-y-6 text-center"
                >
                  <div className="space-y-4 w-full">
                    <h3 className="text-xl font-bold text-slate-900">Verify Payment</h3>
                    <p className="text-slate-600 text-sm">
                      Enter the M-PESA transaction code you received via SMS (e.g. QWE123RTY4).
                    </p>
                    <input 
                      type="text" 
                      placeholder="Enter M-PESA Code"
                      value={mpesaCode}
                      onChange={(e) => setMpesaCode(e.target.value.toUpperCase())}
                      className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-center font-mono font-bold text-lg text-slate-900 tracking-widest focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all uppercase"
                    />
                  </div>
                  <div className="w-full mt-4">
                    <button 
                      onClick={handleVerify}
                      disabled={!mpesaCode.trim() || isProcessing}
                      className="btn-primary w-full py-3.5"
                    >
                      {isProcessing ? (
                        <><Loader2 className="w-5 h-5 animate-spin" /> Verifying...</>
                      ) : (
                        "Verify & Complete"
                      )}
                    </button>
                    <button 
                      onClick={() => setCheckoutPhase('payment')}
                      disabled={isProcessing}
                      className="w-full mt-3 text-slate-500 hover:text-slate-700 font-medium py-2 transition-colors disabled:opacity-50 text-sm"
                    >
                      Back
                    </button>
                  </div>
                </motion.div>
              )}

              {checkoutPhase === 'success' && (
                <motion.div
                  key="success"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  className="p-6 flex flex-col h-full items-center justify-center space-y-6 text-center"
                >
                  <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mb-2">
                    <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>
                  </div>
                  <div className="space-y-4 max-w-sm">
                    <h3 className="text-xl font-bold text-slate-900">Payment Successful!</h3>
                    <p className="text-slate-600 text-sm">
                      Your payment of KSh {subtotal.toLocaleString()} has been verified. 
                    </p>
                    <div className="bg-amber-50 border border-amber-200 p-4 rounded-xl text-left">
                      <p className="text-amber-800 text-xs leading-relaxed font-medium">
                        <strong>Note:</strong> We offer a reliable 2-day refund policy. If you cancel your order within 48 hours, you'll receive a full refund to your M-PESA account.
                      </p>
                    </div>
                  </div>
                  <div className="w-full mt-8">
                    <button 
                      onClick={handleWhatsAppOrder}
                      className="btn-base w-full py-3.5 bg-[#25D366] hover:bg-[#128C7E] text-white shadow-sm shadow-[#25D366]/20"
                    >
                      <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
                      Send Order via WhatsApp
                    </button>
                    <button 
                      onClick={handleClose}
                      className="w-full mt-3 text-slate-500 hover:text-slate-700 font-medium py-2 transition-colors text-sm"
                    >
                      Close
                    </button>
                  </div>
                </motion.div>
              )}
              </AnimatePresence>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
