import { motion } from 'motion/react';
import { Star, TrendingUp } from 'lucide-react';
import { Product } from '../types';

interface ProductSuggestionsProps {
  products: Product[];
  onProductClick: (product: Product) => void;
}

export function ProductSuggestions({ products, onProductClick }: ProductSuggestionsProps) {
  // Just take a few random/specific products as suggestions
  const suggestedProducts = [...products]
    .sort(() => 0.5 - Math.random())
    .slice(0, 4);

  return (
    <section className="py-12 bg-slate-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-3 mb-8">
          <div className="p-2 bg-blue-600 text-white rounded-lg shadow-sm">
            <TrendingUp className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-2xl font-display font-bold text-slate-900 tracking-tight">Recommended for You</h2>
            <p className="text-sm text-slate-500">Based on your recent activity and preferences</p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {suggestedProducts.map((product, index) => (
            <motion.div
              key={product.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ scale: 1.02 }}
              onClick={() => onProductClick(product)}
              className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm cursor-pointer group relative overflow-hidden"
            >
              <div className="absolute top-4 right-4 z-10">
                <div className="flex items-center gap-1 px-2 py-1 bg-amber-50 text-amber-600 rounded-lg font-bold text-[10px]">
                  <Star className="w-3 h-3 fill-current" />
                  4.9
                </div>
              </div>

              <div className="aspect-square relative mb-4">
                <img 
                  src={product.image} 
                  alt={product.name}
                  className="w-full h-full object-contain group-hover:rotate-3 transition-transform duration-500"
                />
              </div>

              <div>
                <p className="text-[10px] font-bold text-blue-600 uppercase tracking-widest mb-1">{product.brand}</p>
                <h3 className="font-display font-bold text-slate-900 truncate mb-1">{product.name}</h3>
                <p className="text-sm font-bold text-slate-900">KSh {product.price.toLocaleString()}</p>
              </div>

              <div className="absolute inset-x-0 bottom-0 p-4 translate-y-full group-hover:translate-y-0 transition-transform bg-gradient-to-t from-white via-white to-transparent">
                <button className="btn-secondary w-full text-xs py-2">
                  Quick View
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
