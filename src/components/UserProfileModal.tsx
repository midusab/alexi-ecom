import { useState } from 'react';
import { X, User as UserIcon, MapPin, Phone, ShoppingBag, Heart, Bell, Check, Edit2, LogOut, Package, Search, Truck, Map, Calendar } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { UserProfile, Product, Notification, Order } from '../types';

interface UserProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: UserProfile;
  onUpdateProfile: (data: Partial<UserProfile>) => void;
  wishlistItems: Product[];
  onRemoveFromWishlist: (product: Product) => void;
  onAddToCart: (product: Product) => void;
  onLogout: () => void;
}

export function UserProfileModal({ 
  isOpen, 
  onClose, 
  user, 
  onUpdateProfile, 
  wishlistItems, 
  onRemoveFromWishlist, 
  onAddToCart,
  onLogout
}: UserProfileModalProps) {
  const [activeTab, setActiveTab] = useState<'profile' | 'orders' | 'wishlist' | 'notifications' | 'tracking'>('profile');
  const [trackingId, setTrackingId] = useState('');
  const [selectedTrackingOrder, setSelectedTrackingOrder] = useState<Order | null>(null);
  
  // Profile editing state
  const [isEditing, setIsEditing] = useState(false);
  const [editName, setEditName] = useState(user.name);
  const [editPhone, setEditPhone] = useState(user.phone || '');
  const [editLocation, setEditLocation] = useState(user.location || '');

  const handleSaveProfile = () => {
    onUpdateProfile({
      name: editName,
      phone: editPhone,
      location: editLocation
    });
    setIsEditing(false);
  };

  const unreadCount = user.notifications.filter(n => !n.read).length;

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
        />
        
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 10 }}
          className="relative w-full max-w-4xl bg-slate-50 rounded-2xl shadow-xl overflow-hidden flex flex-col max-h-[90vh]"
        >
          {/* Header */}
          <div className="flex justify-between items-center px-6 py-4 border-b border-slate-200 bg-white shrink-0">
            <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
              <div className="w-8 h-8 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-sm font-bold">
                {user.name.charAt(0).toUpperCase()}
              </div>
              My Account
            </h2>
            <button
              onClick={onClose}
              className="btn-icon"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="flex flex-col md:flex-row flex-1 overflow-hidden">
            {/* Sidebar */}
            <div className="w-full md:w-64 bg-white border-r border-slate-200 shrink-0 overflow-y-auto">
              <div className="p-4 space-y-1">
                <button
                  onClick={() => setActiveTab('profile')}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-colors ${
                    activeTab === 'profile' ? 'bg-blue-50 text-blue-700' : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                  }`}
                >
                  <UserIcon className="w-4 h-4" />
                  Personal Info
                </button>
                <button
                  onClick={() => setActiveTab('orders')}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-colors ${
                    activeTab === 'orders' ? 'bg-blue-50 text-blue-700' : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                  }`}
                >
                  <ShoppingBag className="w-4 h-4" />
                  Order History
                </button>
                <button
                  onClick={() => setActiveTab('tracking')}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-colors ${
                    activeTab === 'tracking' ? 'bg-blue-50 text-blue-700' : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                  }`}
                >
                  <Package className="w-4 h-4" />
                  Track Order
                </button>
                <button
                  onClick={() => setActiveTab('wishlist')}
                  className={`w-full flex items-center justify-between px-4 py-3 rounded-xl text-sm font-medium transition-colors ${
                    activeTab === 'wishlist' ? 'bg-blue-50 text-blue-700' : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Heart className="w-4 h-4" />
                    Wishlist
                  </div>
                  {wishlistItems.length > 0 && (
                    <span className="bg-rose-100 text-rose-600 py-0.5 px-2 rounded-full text-xs font-bold">
                      {wishlistItems.length}
                    </span>
                  )}
                </button>
                <button
                  onClick={() => setActiveTab('notifications')}
                  className={`w-full flex items-center justify-between px-4 py-3 rounded-xl text-sm font-medium transition-colors ${
                    activeTab === 'notifications' ? 'bg-blue-50 text-blue-700' : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Bell className="w-4 h-4" />
                    Notifications
                  </div>
                  {unreadCount > 0 && (
                    <span className="bg-blue-600 text-white py-0.5 px-2 rounded-full text-xs font-bold">
                      {unreadCount}
                    </span>
                  )}
                </button>
              </div>

              <div className="p-4 border-t border-slate-100 mt-auto">
                <button
                  onClick={onLogout}
                  className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-rose-600 hover:bg-rose-50 transition-colors"
                >
                  <LogOut className="w-4 h-4" />
                  Sign Out
                </button>
              </div>
            </div>

            {/* Main Content Area */}
            <div className="flex-1 overflow-y-auto p-6 md:p-8">
              <AnimatePresence mode="wait">
                {activeTab === 'profile' && (
                  <motion.div
                    key="profile"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="max-w-2xl"
                  >
                    <div className="flex justify-between items-center mb-6">
                      <h3 className="text-xl font-bold text-slate-900">Personal Information</h3>
                      {!isEditing ? (
                        <button
                          onClick={() => setIsEditing(true)}
                          className="btn-outline px-3 py-1.5 text-sm"
                        >
                          <Edit2 className="w-4 h-4" />
                          Edit Profile
                        </button>
                      ) : (
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => setIsEditing(false)}
                            className="btn-ghost px-3 py-1.5 text-sm"
                          >
                            Cancel
                          </button>
                          <button
                            onClick={handleSaveProfile}
                            className="btn-primary px-4 py-1.5 text-sm"
                          >
                            <Check className="w-4 h-4" />
                            Save
                          </button>
                        </div>
                      )}
                    </div>

                    <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 space-y-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                          <label className="block text-sm font-medium text-slate-500 mb-1">Full Name</label>
                          {isEditing ? (
                            <input
                              type="text"
                              value={editName}
                              onChange={(e) => setEditName(e.target.value)}
                              className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                            />
                          ) : (
                            <div className="text-slate-900 font-medium">{user.name}</div>
                          )}
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-slate-500 mb-1">Email Address</label>
                          <div className="text-slate-900 font-medium flex items-center gap-2">
                            {user.email}
                            <span className="text-[10px] bg-green-100 text-green-700 px-2 py-0.5 rounded-full font-bold uppercase tracking-wider">Verified</span>
                          </div>
                        </div>
                      </div>

                      <div className="border-t border-slate-100 pt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                          <label className="block text-sm font-medium text-slate-500 mb-1">Phone Number</label>
                          {isEditing ? (
                            <div className="relative">
                              <Phone className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
                              <input
                                type="tel"
                                value={editPhone}
                                onChange={(e) => setEditPhone(e.target.value)}
                                placeholder="+254 7XX XXX XXX"
                                className="w-full pl-9 pr-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                              />
                            </div>
                          ) : (
                            <div className="flex items-center gap-2 text-slate-900 font-medium">
                              <Phone className="w-4 h-4 text-slate-400" />
                              {user.phone || <span className="text-slate-400 italic font-normal">Not provided</span>}
                            </div>
                          )}
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-slate-500 mb-1">Delivery Location</label>
                          {isEditing ? (
                            <div className="relative">
                              <MapPin className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
                              <input
                                type="text"
                                value={editLocation}
                                onChange={(e) => setEditLocation(e.target.value)}
                                placeholder="Nairobi, Kenya"
                                className="w-full pl-9 pr-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                              />
                            </div>
                          ) : (
                            <div className="flex items-center gap-2 text-slate-900 font-medium">
                              <MapPin className="w-4 h-4 text-slate-400" />
                              {user.location || <span className="text-slate-400 italic font-normal">Not provided</span>}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}

                {activeTab === 'orders' && (
                  <motion.div
                    key="orders"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                  >
                    <h3 className="text-xl font-bold text-slate-900 mb-6">Order History</h3>
                    
                    {user.orders.length === 0 ? (
                      <div className="text-center py-12 bg-white rounded-2xl border border-slate-100 border-dashed">
                        <ShoppingBag className="w-12 h-12 text-slate-300 mx-auto mb-4" />
                        <h4 className="text-lg font-medium text-slate-900 mb-2">No orders yet</h4>
                        <p className="text-slate-500">When you place an order, it will appear here.</p>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        {user.orders.map(order => (
                          <div key={order.id} className="bg-white rounded-xl p-5 border border-slate-100 shadow-sm">
                            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                              <div>
                                <div className="flex items-center gap-3 mb-1">
                                  <span className="font-bold text-slate-900">Order #{order.id}</span>
                                  <span className={`text-xs font-bold px-2.5 py-0.5 rounded-full ${
                                    order.status === 'Delivered' ? 'bg-green-100 text-green-700' :
                                    order.status === 'Processing' ? 'bg-amber-100 text-amber-700' :
                                    order.status === 'Cancelled' ? 'bg-rose-100 text-rose-700' :
                                    'bg-blue-100 text-blue-700'
                                  }`}>
                                    {order.status}
                                  </span>
                                </div>
                                <p className="text-sm text-slate-500">{order.date}</p>
                              </div>
                              <div className="sm:text-right flex flex-col items-end gap-2">
                                <div>
                                  <p className="text-sm text-slate-500 mb-0.5">Total Amount</p>
                                  <p className="text-lg font-bold text-slate-900">KSh {order.total.toLocaleString()}</p>
                                </div>
                                <div className="flex gap-2">
                                  <button
                                    onClick={() => {
                                      setTrackingId(order.id);
                                      setSelectedTrackingOrder(order);
                                      setActiveTab('tracking');
                                    }}
                                    className="btn-outline py-1.5 px-3 text-xs bg-blue-50 border-blue-100 text-blue-600 hover:bg-blue-100 flex items-center gap-1"
                                  >
                                    <Truck className="w-3 h-3" />
                                    Track
                                  </button>
                                  <button
                                    onClick={() => {
                                      order.items.forEach(item => {
                                        onAddToCart({
                                          id: item.id,
                                          name: item.name,
                                          brand: item.brand || '',
                                          price: item.price,
                                          image: item.image || '',
                                          description: '',
                                          features: [],
                                          specs: { screen: '', processor: '', ram: '', storage: '', battery: '', camera: '' }
                                        });
                                      });
                                    }}
                                    className="btn-outline py-1.5 px-3 text-xs"
                                  >
                                    Reorder All
                                  </button>
                                </div>
                              </div>
                            </div>

                            {/* Visual Status Bar */}
                            {order.status !== 'Cancelled' && (
                              <div className="mb-6 relative">
                                <div className="absolute top-2 left-6 right-6 h-1 bg-slate-100 rounded-full mt-0.5"></div>
                                <div 
                                  className="absolute top-2 left-6 h-1 bg-blue-500 rounded-full transition-all duration-500 mt-0.5"
                                  style={{ 
                                    width: 
                                      order.status === 'Pending' ? '0%' :
                                      order.status === 'Processing' ? '33.33%' :
                                      order.status === 'Shipped' ? '66.66%' :
                                      order.status === 'Delivered' ? '100%' : '0%' 
                                  }}
                                ></div>
                                <div className="relative flex justify-between items-start text-xs font-medium w-full">
                                  {['Pending', 'Processing', 'Shipped', 'Delivered'].map((step, idx) => {
                                    const isActive = 
                                      order.status === step || 
                                      (order.status === 'Delivered') ||
                                      (order.status === 'Shipped' && idx < 3) ||
                                      (order.status === 'Processing' && idx < 2);
                                    
                                    return (
                                      <div key={`order-step-${order.id}-${step}`} className="flex flex-col items-center gap-1.5 w-[60px] -ml-[30px] first:ml-0 last:-mr-[30px]" style={{ left: `${idx * 33.33}%` }}>
                                        <div className={`w-5 h-5 rounded-full flex items-center justify-center z-10 border-2 ${isActive ? 'bg-blue-600 border-blue-600 text-white' : 'bg-white border-slate-200 text-transparent'}`}>
                                          {isActive && <Check className="w-3 h-3" strokeWidth={3} />}
                                        </div>
                                        <span className={`text-center ${isActive ? 'text-slate-900' : 'text-slate-400'}`}>{step}</span>
                                      </div>
                                    );
                                  })}
                                </div>
                              </div>
                            )}

                            <div className="bg-slate-50 p-4 rounded-xl">
                              <p className="text-sm font-bold text-slate-700 mb-3 flex items-center justify-between">
                                Items Included
                                <span className="text-xs bg-slate-200 px-2 py-0.5 rounded text-slate-600">
                                  {order.items.reduce((sum, i) => sum + i.quantity, 0)} {order.items.reduce((sum, i) => sum + i.quantity, 0) === 1 ? 'item' : 'items'}
                                </span>
                              </p>
                              <ul className="space-y-3">
                                {order.items.map((item, i) => (
                                  <li key={`order-item-${order.id}-${item.id}-${i}`} className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-lg bg-white border border-slate-200 overflow-hidden shrink-0">
                                      {item.image ? (
                                        <img src={item.image} alt={item.name} className="w-full h-full object-contain" />
                                      ) : (
                                        <div className="w-full h-full flex items-center justify-center bg-slate-100 italic text-[8px] text-slate-400">No img</div>
                                      )}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                      <p className="text-sm font-medium text-slate-900 truncate">{item.name}</p>
                                      <p className="text-xs text-slate-500">{item.quantity} x KSh {item.price.toLocaleString()}</p>
                                    </div>
                                    <div className="flex flex-col items-end gap-1">
                                      <div className="text-sm font-bold text-slate-900">
                                        KSh {(item.price * item.quantity).toLocaleString()}
                                      </div>
                                      <button
                                        onClick={() => {
                                          onAddToCart({
                                            id: item.id,
                                            name: item.name,
                                            brand: item.brand || '',
                                            price: item.price,
                                            image: item.image || '',
                                            description: '',
                                            features: [],
                                            specs: { screen: '', processor: '', ram: '', storage: '', battery: '', camera: '' }
                                          });
                                        }}
                                        className="text-[10px] font-bold text-blue-600 hover:text-blue-700 uppercase tracking-wider"
                                      >
                                        Reorder
                                      </button>
                                    </div>
                                  </li>
                                ))}
                              </ul>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </motion.div>
                )}

                {activeTab === 'wishlist' && (
                  <motion.div
                    key="wishlist"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                  >
                    <h3 className="text-xl font-bold text-slate-900 mb-6">My Wishlist</h3>
                    
                    {wishlistItems.length === 0 ? (
                      <div className="text-center py-12 bg-white rounded-2xl border border-slate-100 border-dashed">
                        <Heart className="w-12 h-12 text-slate-300 mx-auto mb-4" />
                        <h4 className="text-lg font-medium text-slate-900 mb-2">Your wishlist is empty</h4>
                        <p className="text-slate-500">Save items you like to view them later.</p>
                      </div>
                    ) : (
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {wishlistItems.map(item => (
                          <div key={item.id} className="bg-white rounded-xl p-4 border border-slate-100 shadow-sm flex gap-4">
                            <img src={item.image} alt={item.name} className="w-20 h-20 object-cover rounded-lg bg-slate-100" />
                            <div className="flex-1 flex flex-col">
                              <h4 className="font-medium text-sm text-slate-900 line-clamp-2">{item.name}</h4>
                              <p className="font-bold text-blue-600 text-sm mt-1">KSh {item.price.toLocaleString()}</p>
                              <div className="mt-auto flex gap-2 pt-2">
                                <button
                                  onClick={() => {
                                    onAddToCart(item);
                                    onRemoveFromWishlist(item);
                                  }}
                                  className="btn-secondary flex-1 py-1.5 text-xs"
                                >
                                  Move to Cart
                                </button>
                                <button
                                  onClick={() => onRemoveFromWishlist(item)}
                                  className="btn-ghost p-1.5"
                                >
                                  <X className="w-4 h-4 text-rose-500" />
                                </button>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </motion.div>
                )}

                {activeTab === 'tracking' && (
                  <motion.div
                    key="tracking"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="max-w-2xl"
                  >
                    <h3 className="text-xl font-bold text-slate-900 mb-6">Real-Time Order Tracking</h3>
                    
                    <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 mb-8">
                      <p className="text-sm text-slate-500 mb-4">Enter your Order ID or Tracking Number to see the latest shipment status.</p>
                      <div className="flex gap-3">
                        <div className="relative flex-1">
                          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                          <input 
                            type="text" 
                            placeholder="e.g. 523614 or TRK-982..."
                            value={trackingId}
                            onChange={(e) => setTrackingId(e.target.value)}
                            className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-500 font-mono text-sm"
                          />
                        </div>
                        <button 
                          onClick={() => {
                            const foundOrder = user.orders.find(o => o.id === trackingId || o.trackingNumber === trackingId);
                            setSelectedTrackingOrder(foundOrder || null);
                          }}
                          className="btn-primary px-6"
                        >
                          Track
                        </button>
                      </div>
                    </div>

                    {!selectedTrackingOrder ? (
                      trackingId && (
                        <div className="text-center py-12 bg-white rounded-2xl border border-slate-100 italic text-slate-500">
                          <p>No order found with ID "{trackingId}". Please check your confirmation email.</p>
                        </div>
                      )
                    ) : (
                      <div className="space-y-6">
                        <div className="bg-blue-600 rounded-2xl p-6 text-white overflow-hidden relative shadow-lg">
                          <div className="relative z-10">
                            <div className="flex justify-between items-start mb-6">
                              <div>
                                <p className="text-blue-100 text-xs font-bold uppercase tracking-widest mb-1">Status</p>
                                <h4 className="text-2xl font-black">{selectedTrackingOrder.status}</h4>
                              </div>
                              <Package className="w-12 h-12 text-blue-400/50" />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                              <div>
                                <p className="text-blue-100 text-[10px] font-bold uppercase tracking-widest mb-1">Estimated Delivery</p>
                                <p className="font-bold flex items-center gap-2">
                                  <Calendar className="w-4 h-4" />
                                  June 12, 2026
                                </p>
                              </div>
                              <div>
                                <p className="text-blue-100 text-[10px] font-bold uppercase tracking-widest mb-1">Carrier</p>
                                <p className="font-bold flex items-center gap-2">
                                  <Truck className="w-4 h-4" />
                                  G4S Logistics
                                </p>
                              </div>
                            </div>
                          </div>
                          <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-10 -mt-10 blur-2xl" />
                        </div>

                        <div className="relative space-y-8 pl-8 before:content-[''] before:absolute before:left-[15px] before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-100">
                          {(selectedTrackingOrder.trackingEvents || [
                            { status: 'Delivered', location: 'Nairobi, KE', timestamp: 'Today, 2:30 PM', description: 'Package has been delivered to recipient' },
                            { status: 'Out for Delivery', location: 'Nairobi, KE', timestamp: 'Today, 8:45 AM', description: 'Package is with our delivery agent' },
                            { status: 'Arrived at Facility', location: 'Mombasa Road, KE', timestamp: 'Yesterday, 11:20 PM', description: 'Package reached the local distribution center' },
                            { status: 'Shipped', location: 'Dubai, UAE', timestamp: '3 days ago', description: 'Package has left the origin warehouse' },
                            { status: 'Processed', location: 'Dubai, UAE', timestamp: '4 days ago', description: 'Order information received by carrier' },
                          ]).slice(
                            selectedTrackingOrder.status === 'Pending' ? 4 :
                            selectedTrackingOrder.status === 'Processing' ? 3 :
                            selectedTrackingOrder.status === 'Shipped' ? 2 :
                            selectedTrackingOrder.status === 'Delivered' ? 0 : 0
                          ).map((event, idx) => (
                            <div key={`tracking-event-${selectedTrackingOrder.id}-${idx}`} className="relative">
                              <div className={`absolute -left-[25px] top-1 w-4 h-4 rounded-full border-2 border-white shadow-sm transition-colors ${idx === 0 ? 'bg-blue-600 animate-pulse ring-4 ring-blue-100' : 'bg-slate-300'}`}></div>
                              <div className="flex flex-col">
                                <div className="flex items-center justify-between mb-1">
                                  <span className={`text-sm font-bold ${idx === 0 ? 'text-slate-900' : 'text-slate-500'}`}>{event.status}</span>
                                  <span className="text-[10px] font-medium text-slate-400 bg-slate-50 px-2 py-0.5 rounded-full">{event.timestamp}</span>
                                </div>
                                <div className="flex items-center gap-1.5 text-xs text-slate-400 mb-1">
                                  <MapPin className="w-3 h-3" />
                                  {event.location}
                                </div>
                                <p className="text-xs text-slate-600">{event.description}</p>
                              </div>
                            </div>
                          ))}
                        </div>

                        <div className="bg-slate-100 p-4 rounded-2xl flex items-center gap-4">
                          <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center border border-slate-200">
                             <Map className="w-6 h-6 text-slate-400" />
                          </div>
                          <div className="flex-1">
                            <p className="text-sm font-bold text-slate-900">Live Map Tracking</p>
                            <p className="text-xs text-slate-500">Real-time GPS tracking is available on our mobile app.</p>
                          </div>
                          <button className="text-xs font-bold text-blue-600">Get App</button>
                        </div>
                      </div>
                    )}
                  </motion.div>
                )}

                {activeTab === 'notifications' && (
                  <motion.div
                    key="notifications"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                  >
                    <div className="flex justify-between items-center mb-6">
                      <h3 className="text-xl font-bold text-slate-900">Notifications</h3>
                      {unreadCount > 0 && (
                        <button
                          onClick={() => {
                            const readAll = user.notifications.map(n => ({...n, read: true}));
                            onUpdateProfile({ notifications: readAll });
                          }}
                          className="text-sm font-medium text-blue-600 hover:text-blue-700"
                        >
                          Mark all as read
                        </button>
                      )}
                    </div>
                    
                    {user.notifications.length === 0 ? (
                      <div className="text-center py-12 bg-white rounded-2xl border border-slate-100 border-dashed">
                        <Bell className="w-12 h-12 text-slate-300 mx-auto mb-4" />
                        <h4 className="text-lg font-medium text-slate-900 mb-2">All caught up</h4>
                        <p className="text-slate-500">You don't have any new notifications.</p>
                      </div>
                    ) : (
                      <div className="space-y-3">
                        {user.notifications.map(notification => (
                          <div 
                            key={notification.id} 
                            className={`p-4 rounded-xl border ${notification.read ? 'bg-white border-slate-100' : 'bg-blue-50/50 border-blue-100'} flex gap-4`}
                          >
                            <div className={`mt-1 shrink-0 ${notification.read ? 'text-slate-400' : 'text-blue-600'}`}>
                              <Bell className="w-5 h-5" />
                            </div>
                            <div>
                              <h4 className={`font-semibold text-sm ${notification.read ? 'text-slate-700' : 'text-slate-900'}`}>
                                {notification.title}
                              </h4>
                              <p className="text-slate-600 text-sm mt-1">{notification.message}</p>
                              <p className="text-xs text-slate-400 mt-2">{notification.date}</p>
                            </div>
                            {!notification.read && (
                              <div className="ml-auto flex items-start">
                                <div className="w-2 h-2 rounded-full bg-blue-600"></div>
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
