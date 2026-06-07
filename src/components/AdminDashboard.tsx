import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  X, ChevronRight, BarChart3, Package, ShoppingCart, 
  Settings, Users, Plus, Edit2, Trash2, Check, ExternalLink,
  Smartphone, Tag, Zap, Wallet, Layout, Clock, LayoutGrid
} from 'lucide-react';
import { Product, Order, UserProfile, AppConfig } from '../types';

interface AdminDashboardProps {
  isOpen: boolean;
  onClose: () => void;
  allProducts: Product[];
  onAddProduct: (product: Product) => void;
  onUpdateProduct: (product: Product) => void;
  onDeleteProduct: (id: string) => void;
  allOrders: Order[];
  onUpdateOrderStatus: (orderId: string, status: Order['status']) => void;
  config: AppConfig;
  onUpdateConfig: (config: AppConfig) => void;
}

type Tab = 'overview' | 'products' | 'orders' | 'users' | 'storefront';

export function AdminDashboard({ 
  isOpen, 
  onClose, 
  allProducts, 
  onAddProduct, 
  onUpdateProduct, 
  onDeleteProduct,
  allOrders,
  onUpdateOrderStatus,
  config,
  onUpdateConfig
}: AdminDashboardProps) {
  const [activeTab, setActiveTab] = useState<Tab>('overview');
  const [isAddingProduct, setIsAddingProduct] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  // Stats calculation
  const totalSales = allOrders.reduce((sum, order) => sum + order.total, 0);
  const pendingOrders = allOrders.filter(o => o.status === 'Pending').length;
  const processingOrders = allOrders.filter(o => o.status === 'Processing').length;

  const handleProductSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const productData: Product = {
      id: editingProduct?.id || `p-${Math.random().toString(36).substr(2, 9)}`,
      name: formData.get('name') as string,
      brand: formData.get('brand') as string,
      price: Number(formData.get('price')),
      description: formData.get('description') as string,
      image: formData.get('image') as string || 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?q=80&w=800&auto=format&fit=crop',
      features: (formData.get('features') as string).split(',').map(f => f.trim()).filter(Boolean),
      isFeatured: formData.get('isFeatured') === 'on',
      isOffer: formData.get('isOffer') === 'on',
      offerText: formData.get('offerText') as string,
      specs: {
        screen: formData.get('screen') as string,
        processor: formData.get('processor') as string,
        ram: formData.get('ram') as string,
        storage: formData.get('storage') as string,
        battery: formData.get('battery') as string,
        camera: formData.get('camera') as string,
      }
    };

    if (editingProduct) {
      onUpdateProduct(productData);
    } else {
      onAddProduct(productData);
    }
    setIsAddingProduct(false);
    setEditingProduct(null);
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-0 md:p-4">
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
          className="relative w-full max-w-6xl h-full md:h-[90vh] bg-slate-50 md:rounded-3xl shadow-2xl overflow-hidden flex flex-col md:flex-row"
        >
          {/* Sidebar */}
          <div className="w-full md:w-64 bg-slate-900 text-white p-6 flex flex-col shrink-0">
            <div className="flex items-center gap-3 mb-10">
              <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center">
                <Settings className="w-6 h-6 text-white" />
              </div>
              <h2 className="text-xl font-bold font-display">Alexi Admin</h2>
            </div>

            <nav className="flex-1 space-y-2">
              <NavBtn 
                active={activeTab === 'overview'} 
                onClick={() => setActiveTab('overview')} 
                icon={<BarChart3 className="w-5 h-5" />} 
                label="Sales Overview" 
              />
              <NavBtn 
                active={activeTab === 'products'} 
                onClick={() => setActiveTab('products')} 
                icon={<Package className="w-5 h-5" />} 
                label="Products & Offers" 
              />
              <NavBtn 
                active={activeTab === 'orders'} 
                onClick={() => setActiveTab('orders')} 
                icon={<ShoppingCart className="w-5 h-5" />} 
                label="Orders & Payments" 
              />
              <NavBtn 
                active={activeTab === 'users'} 
                onClick={() => setActiveTab('users')} 
                icon={<Users className="w-5 h-5" />} 
                label="User Insights" 
              />
              <NavBtn 
                active={activeTab === 'storefront'} 
                onClick={() => setActiveTab('storefront')} 
                icon={<Layout className="w-5 h-5" />} 
                label="Storefront" 
              />
            </nav>

            <button 
              onClick={onClose}
              className="mt-auto flex items-center gap-2 p-3 text-slate-400 hover:text-white transition-colors"
            >
              <X className="w-5 h-5" />
              Close Dashboard
            </button>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-y-auto p-4 md:p-10">
            {activeTab === 'overview' && (
              <div className="space-y-8">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div>
                    <h3 className="text-2xl font-bold text-slate-900 font-display">Business Analytics</h3>
                    <p className="text-slate-500">Real-time performance metrics</p>
                  </div>
                  <div className="flex gap-2">
                    <button className="btn-outline text-xs py-1.5 px-3">Download Report</button>
                    <button className="btn-primary text-xs py-1.5 px-3">Refresh Data</button>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  <StatCard label="Total Revenue" value={`KSh ${totalSales.toLocaleString()}`} icon={<Wallet className="text-emerald-500" />} change="+12.5%" />
                  <StatCard label="Total Orders" value={allOrders.length} icon={<ShoppingCart className="text-blue-500" />} change="+8.1%" />
                  <StatCard label="Pending Payments" value={pendingOrders} icon={<Zap className="text-amber-500" />} change="-2.4%" />
                  <StatCard label="Active Items" value={allProducts.length} icon={<Smartphone className="text-purple-500" />} change="+1.2%" />
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm">
                    <h4 className="font-bold text-slate-900 mb-6 flex items-center gap-2">
                      <Zap className="w-5 h-5 text-red-500" /> Recent Activity
                    </h4>
                    <div className="space-y-4">
                      {allOrders.slice(0, 5).map(order => (
                        <div key={`overview-activity-${order.id}`} className="flex items-center justify-between p-3 bg-slate-50 rounded-xl">
                          <div className="flex items-center gap-3">
                            <div className="w-2 h-2 rounded-full bg-blue-500"></div>
                            <div>
                              <p className="text-sm font-medium text-slate-900">Order #{order.id.slice(-4)}</p>
                              <p className="text-xs text-slate-500">{order.date}</p>
                            </div>
                          </div>
                          <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                            order.status === 'Delivered' ? 'bg-emerald-100 text-emerald-600' : 'bg-amber-100 text-amber-600'
                          }`}>
                            {order.status}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm">
                    <h4 className="font-bold text-slate-900 mb-6">Top Selling Models</h4>
                    <div className="space-y-6">
                      {allProducts.slice(0, 3).map((p, idx) => (
                        <div key={`overview-top-${p.id}-${idx}`}>
                          <div className="flex justify-between items-center mb-2">
                            <span className="text-sm font-medium text-slate-800">{p.name}</span>
                            <span className="text-sm font-bold text-slate-900">{25 - idx * 5} Sales</span>
                          </div>
                          <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                            <div className="h-full bg-blue-600 rounded-full" style={{ width: `${90 - idx * 20}%` }}></div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'products' && (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <h3 className="text-2xl font-bold text-slate-900 font-display">Product Inventory</h3>
                  <button 
                    onClick={() => { setIsAddingProduct(true); setEditingProduct(null); }}
                    className="btn-primary flex items-center gap-2"
                  >
                    <Plus className="w-5 h-5" />
                    Add Product
                  </button>
                </div>

                <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
                  <table className="w-full text-left">
                    <thead className="bg-slate-50 border-b border-slate-200">
                      <tr>
                        <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-widest">Model</th>
                        <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-widest">Price</th>
                        <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-widest text-center">Status</th>
                        <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-widest text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {allProducts.map(product => (
                        <tr key={`manage-product-${product.id}`} className="hover:bg-slate-50 transition-colors">
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-3">
                              <img src={product.image} className="w-10 h-10 rounded-lg object-contain bg-slate-50 p-1" />
                              <div>
                                <p className="font-bold text-slate-900">{product.name}</p>
                                <p className="text-xs text-slate-500">{product.brand}</p>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <p className="font-bold text-slate-900">KSh {product.price.toLocaleString()}</p>
                          </td>
                          <td className="px-6 py-4 text-center">
                            <span className="text-[10px] font-bold px-2 py-1 bg-emerald-100 text-emerald-600 rounded-lg">In Stock</span>
                          </td>
                          <td className="px-6 py-4 text-right">
                            <div className="flex justify-end gap-2">
                              <button 
                                onClick={() => { setEditingProduct(product); setIsAddingProduct(true); }}
                                className="p-2 text-slate-400 hover:text-blue-600 transition-colors"
                              >
                                <Edit2 className="w-4 h-4" />
                              </button>
                              <button 
                                onClick={() => onDeleteProduct(product.id)}
                                className="p-2 text-slate-400 hover:text-rose-600 transition-colors"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {activeTab === 'orders' && (
              <div className="space-y-6">
                <h3 className="text-2xl font-bold text-slate-900 font-display">Orders & Financials</h3>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                   <div className="bg-amber-50 p-4 rounded-2xl border border-amber-100">
                     <p className="text-amber-700 text-xs font-bold uppercase mb-1">Verify Needed</p>
                     <p className="text-2xl font-bold text-amber-900">{pendingOrders}</p>
                   </div>
                </div>

                <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
                   <div className="divide-y divide-slate-100">
                     {allOrders.length === 0 ? (
                       <div className="p-12 text-center text-slate-400">No orders to display.</div>
                     ) : (
                       allOrders.map(order => (
                         <div key={`manage-order-${order.id}`} className="p-6 hover:bg-slate-50 transition-colors">
                           <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                             <div>
                               <div className="flex items-center gap-3 mb-1">
                                 <h4 className="font-bold text-slate-900">Order #{order.id.slice(-8).toUpperCase()}</h4>
                                 <span className={`text-[10px] font-bold px-2 py-0.5 rounded-lg ${
                                   order.status === 'Pending' ? 'bg-amber-100 text-amber-600' :
                                   order.status === 'Processing' ? 'bg-blue-100 text-blue-600' :
                                   'bg-emerald-100 text-emerald-600'
                                 }`}>
                                   {order.status}
                                 </span>
                               </div>
                               <p className="text-xs text-slate-500">{order.date} • {order.items.length} Items</p>
                             </div>
                             <div className="flex items-center gap-6">
                               <div className="text-right">
                                 <p className="text-xs text-slate-500 mb-1">Total</p>
                                 <p className="font-bold text-slate-900">KSh {order.total.toLocaleString()}</p>
                               </div>
                               {order.status === 'Pending' && (
                                 <button 
                                   onClick={() => onUpdateOrderStatus(order.id, 'Processing')}
                                   className="btn-primary py-2 px-4 text-xs"
                                 >
                                   Verify Payment
                                 </button>
                               )}
                               {order.status === 'Processing' && (
                                 <button 
                                   onClick={() => onUpdateOrderStatus(order.id, 'Shipped')}
                                   className="btn-outline py-2 px-4 text-xs"
                                 >
                                   Mark as Shipped
                                 </button>
                               )}
                             </div>
                           </div>
                         </div>
                       ))
                     )}
                   </div>
                </div>
              </div>
            )}

            {activeTab === 'users' && (
              <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                <h3 className="text-2xl font-bold text-slate-900 font-display">User Activity</h3>
                <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
                  <div className="p-6 border-b border-slate-100">
                    <p className="text-slate-500 text-sm">Monitor recent user registrations and login activities.</p>
                  </div>
                  <div className="divide-y divide-slate-100">
                    {[
                      { email: 'user_1@gmail.com', name: 'John Doe', status: 'Active', date: '2026-06-07' },
                      { email: 'user_2@gmail.com', name: 'Jane Smith', status: 'Inactive', date: '2026-06-06' },
                      { email: 'user_3@gmail.com', name: 'Robert Maina', status: 'Active', date: '2026-06-05' },
                      { email: 'user_4@gmail.com', name: 'Alice Wambui', status: 'Active', date: '2026-06-05' },
                      { email: 'user_5@gmail.com', name: 'Samuel Otieno', status: 'Banned', date: '2026-06-04' },
                    ].map((user) => (
                      <div key={`user-insight-${user.email}`} className="p-4 flex items-center justify-between hover:bg-slate-50 transition-colors">
                        <div className="flex items-center gap-4">
                          <div className="w-10 h-10 bg-slate-100 rounded-full flex items-center justify-center font-bold text-slate-500">
                            {user.name.charAt(0)}
                          </div>
                          <div>
                            <p className="text-sm font-bold text-slate-900">{user.name}</p>
                            <p className="text-xs text-slate-500">{user.email} • Registered {user.date}</p>
                          </div>
                        </div>
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                          user.status === 'Active' ? 'bg-emerald-100 text-emerald-600' :
                          user.status === 'Banned' ? 'bg-rose-100 text-rose-600' :
                          'bg-slate-100 text-slate-500'
                        }`}>
                          {user.status}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'storefront' && (
              <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-500">
                <div className="flex justify-between items-end">
                  <div>
                    <h3 className="text-3xl font-bold text-slate-900 font-display">Storefront Management</h3>
                    <p className="text-slate-500">Configure promotional banners and flash sales.</p>
                  </div>
                </div>

                {/* Flash Sale Control */}
                <div className="bg-white p-8 rounded-[2rem] border border-slate-200 shadow-sm space-y-6">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-red-50 text-red-600 rounded-xl">
                      <Zap className="w-6 h-6" />
                    </div>
                    <div>
                      <h4 className="text-xl font-bold text-slate-900">Flash Sale Settings</h4>
                      <p className="text-xs text-slate-500">Manage the active countdown and eligible products.</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-bold text-slate-700 mb-2">End Date & Time</label>
                        <div className="flex gap-2">
                          <input 
                            type="datetime-local" 
                            defaultValue={config.flashSale.endTime.slice(0, 16)}
                            onChange={(e) => onUpdateConfig({
                              ...config,
                              flashSale: { ...config.flashSale, endTime: new Date(e.target.value).toISOString() }
                            })}
                            className="flex-1 p-3 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-500" 
                          />
                        </div>
                      </div>
                      <div>
                        <label className="block text-sm font-bold text-slate-700 mb-2">Discount Percentage (%)</label>
                        <input 
                          type="number" 
                          defaultValue={config.flashSale.discountPercentage}
                          onChange={(e) => onUpdateConfig({
                            ...config,
                            flashSale: { ...config.flashSale, discountPercentage: Number(e.target.value) }
                          })}
                          className="w-full p-3 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-500" 
                        />
                      </div>
                    </div>

                    <div className="space-y-4">
                      <label className="block text-sm font-bold text-slate-700 mb-2">Selected Products</label>
                      <div className="max-h-[200px] overflow-y-auto border border-slate-100 rounded-2xl p-2 space-y-1">
                        {allProducts.map(p => (
                          <label key={`fs-p-select-${p.id}`} className="flex items-center gap-3 p-2 hover:bg-slate-50 rounded-lg cursor-pointer transition-colors">
                            <input 
                              type="checkbox" 
                              checked={config.flashSale.productIds.includes(p.id)}
                              onChange={(e) => {
                                const newIds = e.target.checked 
                                  ? [...config.flashSale.productIds, p.id]
                                  : config.flashSale.productIds.filter(id => id !== p.id);
                                onUpdateConfig({
                                  ...config,
                                  flashSale: { ...config.flashSale, productIds: newIds }
                                });
                              }}
                              className="w-4 h-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                            />
                            <img src={p.image} className="w-8 h-8 rounded object-contain bg-slate-50" />
                            <span className="text-sm font-medium text-slate-800 truncate">{p.name}</span>
                          </label>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                {/* What's New Carousel Management */}
                <div className="bg-white p-8 rounded-[2rem] border border-slate-200 shadow-sm space-y-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-blue-50 text-blue-600 rounded-xl">
                        <LayoutGrid className="w-6 h-6" />
                      </div>
                      <div>
                        <h4 className="text-xl font-bold text-slate-900">"What's New" Carousel</h4>
                        <p className="text-xs text-slate-500">Featured banners for the main page hero section.</p>
                      </div>
                    </div>
                    <button 
                      onClick={() => {
                        const newItem = {
                          id: `wn-${Date.now()}`,
                          title: 'New Arrival',
                          description: 'Discover the latest in mobile technology.',
                          image: 'https://images.unsplash.com/photo-1592899677977-9c10ca588bbd?q=80&w=800&auto=format&fit=crop',
                          link: '#products',
                          color: '#3b82f6'
                        };
                        onUpdateConfig({
                          ...config,
                          whatsNew: { ...config.whatsNew, items: [...config.whatsNew.items, newItem] }
                        });
                      }}
                      className="btn-outline flex items-center gap-2 py-2"
                    >
                      <Plus className="w-4 h-4" /> Add Slide
                    </button>
                  </div>

                  <div className="grid grid-cols-1 gap-6">
                    {config.whatsNew.items.map((item, index) => (
                      <div key={item.id} className="p-6 bg-slate-50 rounded-2xl border border-slate-100 flex flex-col md:flex-row gap-6 relative group">
                        <button 
                          onClick={() => {
                            const newItems = config.whatsNew.items.filter(it => it.id !== item.id);
                            onUpdateConfig({ ...config, whatsNew: { ...config.whatsNew, items: newItems } });
                          }}
                          className="absolute -top-2 -right-2 w-8 h-8 bg-white text-rose-500 rounded-full shadow-md flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-rose-50"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                        
                        <div className="w-full md:w-48 aspect-video md:aspect-[4/5] bg-white rounded-xl border border-slate-200 overflow-hidden shrink-0">
                          <img src={item.image} className="w-full h-full object-cover" />
                        </div>
                        
                        <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-4">
                          <div className="col-span-full">
                            <label className="text-[10px] uppercase font-black text-slate-400 tracking-widest mb-1 block">Title</label>
                            <input 
                              type="text" 
                              value={item.title}
                              onChange={(e) => {
                                const newItems = [...config.whatsNew.items];
                                newItems[index] = { ...item, title: e.target.value };
                                onUpdateConfig({ ...config, whatsNew: { ...config.whatsNew, items: newItems } });
                              }}
                              className="w-full p-2 bg-white border border-slate-200 rounded-lg outline-none focus:ring-2 focus:ring-blue-500 font-bold"
                            />
                          </div>
                          <div className="col-span-full">
                            <label className="text-[10px] uppercase font-black text-slate-400 tracking-widest mb-1 block">Description</label>
                            <textarea 
                              value={item.description}
                              rows={2}
                              onChange={(e) => {
                                const newItems = [...config.whatsNew.items];
                                newItems[index] = { ...item, description: e.target.value };
                                onUpdateConfig({ ...config, whatsNew: { ...config.whatsNew, items: newItems } });
                              }}
                              className="w-full p-2 bg-white border border-slate-200 rounded-lg outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                            />
                          </div>
                          <div>
                            <label className="text-[10px] uppercase font-black text-slate-400 tracking-widest mb-1 block">Image URL</label>
                            <input 
                              type="text" 
                              value={item.image}
                              onChange={(e) => {
                                const newItems = [...config.whatsNew.items];
                                newItems[index] = { ...item, image: e.target.value };
                                onUpdateConfig({ ...config, whatsNew: { ...config.whatsNew, items: newItems } });
                              }}
                              className="w-full p-2 bg-white border border-slate-200 rounded-lg outline-none focus:ring-2 focus:ring-blue-500 text-xs"
                            />
                          </div>
                          <div>
                            <label className="text-[10px] uppercase font-black text-slate-400 tracking-widest mb-1 block">Theme Color</label>
                            <div className="flex gap-2 items-center">
                              <input 
                                type="color" 
                                value={item.color}
                                onChange={(e) => {
                                  const newItems = [...config.whatsNew.items];
                                  newItems[index] = { ...item, color: e.target.value };
                                  onUpdateConfig({ ...config, whatsNew: { ...config.whatsNew, items: newItems } });
                                }}
                                className="w-8 h-8 rounded cursor-pointer"
                              />
                              <span className="text-xs font-mono text-slate-500">{item.color}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        </motion.div>
      </div>

      {/* Product Form Modal */}
      <AnimatePresence>
        {isAddingProduct && (
          <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsAddingProduct(false)}
              className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
            />
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              className="relative w-full max-w-3xl bg-white rounded-3xl shadow-2xl overflow-hidden overflow-y-auto max-h-[90vh]"
            >
              <div className="p-8 border-b border-slate-100 flex items-center justify-between">
                <h3 className="text-2xl font-bold text-slate-900 font-display">
                  {editingProduct ? 'Edit Product' : 'Add New Device'}
                </h3>
                <button onClick={() => setIsAddingProduct(false)} className="btn-icon">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleProductSubmit} className="p-8 space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-2">Model Name</label>
                    <input name="name" defaultValue={editingProduct?.name} required className="w-full p-3 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-500" />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-2">Brand</label>
                    <input name="brand" defaultValue={editingProduct?.brand} required className="w-full p-3 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-500" />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-2">Price (KSh)</label>
                    <input name="price" type="number" defaultValue={editingProduct?.price} required className="w-full p-3 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-500" />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-2">Image URL</label>
                    <input name="image" defaultValue={editingProduct?.image} placeholder="https://..." className="w-full p-3 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-500" />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">Description</label>
                  <textarea name="description" defaultValue={editingProduct?.description} required rows={3} className="w-full p-3 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-500" />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-2">Screen</label>
                    <input name="screen" defaultValue={editingProduct?.specs.screen} className="w-full p-3 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-500" />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-2">RAM</label>
                    <input name="ram" defaultValue={editingProduct?.specs.ram} className="w-full p-3 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-500" />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-2">Storage</label>
                    <input name="storage" defaultValue={editingProduct?.specs.storage} className="w-full p-3 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-500" />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-2">Camera</label>
                    <input name="camera" defaultValue={editingProduct?.specs.camera} className="w-full p-3 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-500" />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-2">Battery</label>
                    <input name="battery" defaultValue={editingProduct?.specs.battery} className="w-full p-3 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-500" />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-2">Processor</label>
                    <input name="processor" defaultValue={editingProduct?.specs.processor} className="w-full p-3 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-500" />
                  </div>
                </div>

                <div>
                   <label className="block text-sm font-bold text-slate-700 mb-2">Key Features (comma separated)</label>
                   <input name="features" defaultValue={editingProduct?.features.join(', ')} className="w-full p-3 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-500" />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 bg-slate-50 p-6 rounded-2xl border border-slate-100">
                  <div className="space-y-4">
                    <label className="flex items-center gap-3 cursor-pointer group">
                      <div className="relative">
                        <input type="checkbox" name="isFeatured" defaultChecked={editingProduct?.isFeatured} className="peer sr-only" />
                        <div className="w-10 h-6 bg-slate-200 rounded-full transition-colors peer-checked:bg-blue-600"></div>
                        <div className="absolute left-1 top-1 w-4 h-4 bg-white rounded-full transition-transform peer-checked:translate-x-4"></div>
                      </div>
                      <span className="text-sm font-bold text-slate-700">Mark as Featured Product</span>
                    </label>
                    <label className="flex items-center gap-3 cursor-pointer group">
                      <div className="relative">
                        <input type="checkbox" name="isOffer" defaultChecked={editingProduct?.isOffer} className="peer sr-only" />
                        <div className="w-10 h-6 bg-slate-200 rounded-full transition-colors peer-checked:bg-emerald-600"></div>
                        <div className="absolute left-1 top-1 w-4 h-4 bg-white rounded-full transition-transform peer-checked:translate-x-4"></div>
                      </div>
                      <span className="text-sm font-bold text-slate-700">Set as Special Offer</span>
                    </label>
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-2">Offer Badge Text (optional)</label>
                    <input name="offerText" defaultValue={editingProduct?.offerText} placeholder="e.g. 15% OFF" className="w-full p-3 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-500 bg-white" />
                  </div>
                </div>

                <div className="flex justify-end gap-3 pt-4">
                  <button type="button" onClick={() => setIsAddingProduct(false)} className="btn-outline">Cancel</button>
                  <button type="submit" className="btn-primary">
                    {editingProduct ? 'Update Product' : 'Save Device'}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </AnimatePresence>
  );
}

function NavBtn({ active, onClick, icon, label }: { active: boolean, onClick: () => void, icon: React.ReactNode, label: string }) {
  return (
    <button 
      onClick={onClick}
      className={`w-full flex items-center gap-3 p-3 rounded-xl transition-all ${
        active ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/20' : 'text-slate-400 hover:text-white hover:bg-slate-800'
      }`}
    >
      {icon}
      <span className="font-medium text-sm">{label}</span>
      {active && <motion.div layoutId="activeNav" className="ml-auto w-1.5 h-1.5 rounded-full bg-white" />}
    </button>
  );
}

function StatCard({ label, value, icon, change }: { label: string, value: string | number, icon: React.ReactNode, change: string }) {
  return (
    <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm">
      <div className="flex items-center justify-between mb-4">
        <div className="p-2 bg-slate-50 rounded-xl">{icon}</div>
        <span className={`text-xs font-bold ${change.startsWith('+') ? 'text-emerald-500' : 'text-rose-500'}`}>{change}</span>
      </div>
      <p className="text-slate-500 text-xs font-medium mb-1 uppercase tracking-wider">{label}</p>
      <h4 className="text-2xl font-bold text-slate-900 font-display">{value}</h4>
    </div>
  );
}
