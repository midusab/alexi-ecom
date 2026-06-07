import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Timer, Zap, ChevronLeft, ChevronRight } from 'lucide-react';
import { Product, AppConfig } from '../types';

interface FlashSaleCarouselProps {
  products: Product[];
  onProductClick: (product: Product) => void;
  onAddToCart: (product: Product) => void;
  config: AppConfig['flashSale'];
}

export function FlashSaleCarousel({ products, onProductClick, onAddToCart, config }: FlashSaleCarouselProps) {
  const [timeLeft, setTimeLeft] = useState({ hours: 0, minutes: 0, seconds: 0 });
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const calculateTimeLeft = () => {
      const difference = new Date(config.endTime).getTime() - new Date().getTime();
      
      if (difference > 0) {
        return {
          hours: Math.floor((difference / (1000 * 60 * 60))),
          minutes: Math.floor((difference / 1000 / 60) % 60),
          seconds: Math.floor((difference / 1000) % 60),
        };
      }
      return { hours: 0, minutes: 0, seconds: 0 };
    };

    setTimeLeft(calculateTimeLeft());
    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);
    return () => clearInterval(timer);
  }, [config.endTime]);

  const flashSaleProducts = products
    .filter(p => config.productIds.includes(p.id))
    .map(p => ({
      ...p,
      salePrice: Math.floor(p.price * (1 - config.discountPercentage / 100)),
      discount: config.discountPercentage
    }));

  if (flashSaleProducts.length === 0) return null;

  const scroll = (direction: 'left' | 'right') => {
    if (scrollRef.current) {
      const scrollAmount = direction === 'left' ? -300 : 300;
      scrollRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  return (
    <section className="py-8 bg-white border-b border-slate-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 px-3 py-1 bg-red-600 text-white rounded-lg font-bold text-sm uppercase tracking-wider animate-pulse">
              <Zap className="w-4 h-4 fill-current" />
              Flash Sale
            </div>
            <div className="flex items-center gap-2 text-slate-900 font-display font-bold">
              <Timer className="w-5 h-5 text-red-600" />
              <div className="flex gap-1.5 items-center">
                <span className="w-8 h-8 flex items-center justify-center bg-slate-900 text-white rounded-md text-sm">
                  {String(timeLeft.hours).padStart(2, '0')}
                </span>
                <span className="font-bold text-slate-400">:</span>
                <span className="w-8 h-8 flex items-center justify-center bg-slate-900 text-white rounded-md text-sm">
                  {String(timeLeft.minutes).padStart(2, '0')}
                </span>
                <span className="font-bold text-slate-400">:</span>
                <span className="w-8 h-8 flex items-center justify-center bg-slate-900 text-white rounded-md text-sm">
                  {String(timeLeft.seconds).padStart(2, '0')}
                </span>
              </div>
            </div>
          </div>
          <div className="flex gap-2">
            <button 
              onClick={() => scroll('left')}
              className="btn-icon border border-slate-200"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button 
              onClick={() => scroll('right')}
              className="btn-icon border border-slate-200"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>

        <div 
          ref={scrollRef}
          className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide no-scrollbar"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          {flashSaleProducts.map((product) => (
            <motion.div
              key={product.id}
              whileHover={{ y: -4 }}
              className="flex-none w-48 sm:w-56 group"
            >
              <div 
                className="bg-white rounded-xl border border-slate-100 overflow-hidden cursor-pointer"
                onClick={() => onProductClick(product)}
              >
                <div className="aspect-square relative overflow-hidden bg-slate-50">
                  <span className="absolute top-2 left-2 z-10 px-2 py-1 bg-red-600 text-white text-[10px] font-bold rounded">
                    -{product.discount}%
                  </span>
                  <img 
                    src={product.image} 
                    alt={product.name}
                    className="w-full h-full object-contain mix-blend-multiply group-hover:scale-110 transition-transform duration-500"
                  />
                </div>
                <div className="p-3">
                  <h4 className="text-sm font-medium text-slate-900 mb-1 truncate">{product.name}</h4>
                  <div className="flex items-baseline gap-2">
                    <span className="text-red-600 font-bold">KSh {product.salePrice.toLocaleString()}</span>
                  </div>
                  <div className="flex items-center gap-1.5 mt-0.5">
                    <span className="text-[11px] text-slate-400 line-through">KSh {product.price.toLocaleString()}</span>
                  </div>
                  <div className="mt-3">
                    <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
                      <motion.div 
                        initial={{ width: 0 }}
                        animate={{ width: '65%' }}
                        className="h-full bg-red-600 rounded-full"
                      />
                    </div>
                    <p className="text-[10px] text-slate-500 mt-1 uppercase font-bold tracking-wider">65% Sold</p>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
