import { useState } from 'react';
import { Product } from '../types';
import { ShoppingCart, Heart } from 'lucide-react';
import { motion } from 'motion/react';

interface ProductCardProps {
  key?: string | number;
  product: Product;
  onAddToCart: (product: Product) => void;
  onClick?: () => void;
  isWishlisted?: boolean;
  onToggleWishlist?: () => void;
}

export function ProductCard({ product, onAddToCart, onClick, isWishlisted, onToggleWishlist }: ProductCardProps) {
  const [imageLoaded, setImageLoaded] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -4 }}
      transition={{ duration: 0.3 }}
      className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden flex flex-col h-full cursor-pointer group relative"
      onClick={onClick}
    >
      <div className="relative aspect-[4/3] overflow-hidden bg-slate-100">
        <div className={`absolute inset-0 bg-slate-200 animate-pulse ${imageLoaded ? 'opacity-0 hidden' : 'opacity-100'} transition-opacity duration-300`} />
        <img
          src={product.image}
          alt={product.name}
          onLoad={() => setImageLoaded(true)}
          className={`object-cover w-full h-full transition-all duration-700 group-hover:scale-105 ${imageLoaded ? 'scale-100 blur-0' : 'scale-105 blur-sm'}`}
          crossOrigin="anonymous"
        />
        <div className="absolute top-3 left-3 flex flex-col gap-1.5 z-10">
          <div className="bg-white/90 backdrop-blur-sm px-2.5 py-1 rounded-full text-xs font-semibold text-slate-700 shadow-sm border border-slate-100/50">
            {product.brand}
          </div>
          {product.isFeatured && (
            <div className="bg-blue-600 text-white text-[9px] font-black px-2 py-0.5 rounded-md shadow-lg flex items-center gap-1 leading-tight transform -rotate-1">
              FEATURED
            </div>
          )}
          {product.isOffer && (
            <div className="bg-emerald-500 text-white text-[9px] font-black px-2 py-0.5 rounded-md shadow-lg leading-tight transform rotate-2">
              {product.offerText || 'OFFER'}
            </div>
          )}
        </div>
        <button
          onClick={(e) => {
            e.stopPropagation();
            onToggleWishlist?.();
          }}
          className="absolute top-3 right-3 btn-icon bg-white/90 backdrop-blur-sm z-10"
        >
          <Heart className={`w-4 h-4 ${isWishlisted ? 'fill-rose-500 text-rose-500' : 'text-slate-400'}`} />
        </button>
      </div>

      <div className="p-5 flex flex-col flex-1">
        <div className="flex justify-between items-start mb-2">
          <h3 className="font-display text-lg font-bold text-slate-900 line-clamp-1">
            {product.name}
          </h3>
          <span className="font-sans font-semibold text-blue-600 whitespace-nowrap">
            KSh {product.price.toLocaleString()}
          </span>
        </div>
        
        <p className="text-sm text-slate-500 line-clamp-2 mb-4 flex-1">
          {product.description}
        </p>

        <div className="space-y-2 mb-5">
          {product.features.slice(0, 2).map((feature, i) => (
            <div key={i} className="text-xs text-slate-600 flex items-center gap-1.5">
              <span className="w-1 h-1 rounded-full bg-slate-300" />
              {feature}
            </div>
          ))}
        </div>

        <button
          onClick={(e) => {
            e.stopPropagation();
            onAddToCart(product);
          }}
          className="btn-primary w-full text-sm"
        >
          <ShoppingCart className="w-4 h-4" />
          Add to Cart
        </button>
      </div>
    </motion.div>
  );
}
