import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  X, ChevronRight, BarChart3, Package, ShoppingCart, 
  Settings, Users, Plus, Edit2, Trash2, Check, ExternalLink,
  Smartphone, Tag, Zap, Wallet
} from 'lucide-react';
import { Product, Order, UserProfile } from '../types';

interface AdminDashboardProps {
  isOpen: boolean;
  onClose: () => void;
  allProducts: Product[];
  onAddProduct: (product: Product) => void;
  onUpdateProduct: (product: Product) => void;
  onDeleteProduct: (id: string) => void;
  allOrders: Order[];
  onUpdateOrderStatus: (orderId: string, status: Order['status']) => void;
}

type Tab = 'overview' | 'products' | 'orders' | 'inventory';

export function AdminDashboard({ 
  isOpen, 
  onClose, 
  allProducts, 
  onAddProduct, 
  onUpdateProduct, 
  onDeleteProduct,
  allOrders,
  onUpdateOrderStatus
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
      id: editingProduct?.id || Math.random().toString(36).substr(2, 9),
      name: formData.get('name') as string,
      brand: formData.get('brand') as string,
      price: Number(formData.get('price')),
      description: formData.get('description') as string,
      image: formData.get('image') as string || 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?q=80&w=800&auto=format&fit=crop',
      features: (formData.get('features') as string).split(',').map(f => f.trim()),
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
                label="Product Manager" 
              />
              <NavBtn 
                active={activeTab === 'orders'} 
                onClick={() => setActiveTab('orders')} 
                icon={<ShoppingCart className="w-5 h-5" />} 
                label="Orders & Payments" 
              />
              <NavBtn 
                active={activeTab === 'inventory'} 
                onClick={() => setActiveTab('inventory')} 
                icon={<Users className="w-5 h-5" />} 
                label="User Insights" 
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
                        <div key={order.id} className="flex items-center justify-between p-3 bg-slate-50 rounded-xl">
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
                      {allProducts.slice(0, 3).map(p => (
                        <div key={p.id}>
                          <div className="flex justify-between items-center mb-2">
                            <span className="text-sm font-medium text-slate-800">{p.name}</span>
                            <span className="text-sm font-bold text-slate-900">14 Sales</span>
                          </div>
                          <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                            <div className="h-full bg-blue-600 rounded-full" style={{ width: `${Math.random() * 60 + 20}%` }}></div>
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
                        <tr key={product.id} className="hover:bg-slate-50 transition-colors">
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
                         <div key={order.id} className="p-6 hover:bg-slate-50 transition-colors">
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

            {activeTab === 'inventory' && (
              <div className="flex flex-col items-center justify-center p-20 text-center space-y-4">
                <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center">
                  <Users className="w-8 h-8 text-slate-400" />
                </div>
                <h3 className="text-xl font-bold text-slate-900">User Data & Segmentation</h3>
                <p className="text-slate-500 max-w-sm">This module tracks user behavior, search trends, and localized demand forecasts to optimize your stock levels.</p>
                <div className="p-4 bg-blue-50 text-blue-700 text-sm rounded-xl font-medium">
                  Feature coming in Next Update
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
