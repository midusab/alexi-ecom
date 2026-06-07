import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ChevronLeft, ChevronRight, PlusCircle, ArrowRight } from 'lucide-react';

interface WhatsNewItem {
  id: string;
  title: string;
  description: string;
  image: string;
  link: string;
  color: string;
}

interface WhatsNewCarouselProps {
  items: WhatsNewItem[];
}

export function WhatsNewCarousel({ items }: WhatsNewCarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % items.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [items.length]);

  const next = () => setCurrentIndex((prev) => (prev + 1) % items.length);
  const prev = () => setCurrentIndex((prev) => (prev - 1 + items.length) % items.length);

  if (!items || items.length === 0) return null;

  const currentItem = items[currentIndex];
  if (!currentItem) return null;

  return (
    <section className="py-12 bg-white overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-3xl font-bold text-slate-900 font-display flex items-center gap-3">
              <PlusCircle className="w-8 h-8 text-blue-600" />
              What's New
            </h2>
            <p className="text-slate-500 mt-1">Explore our latest drops and exclusive tech updates.</p>
          </div>
          <div className="flex gap-2">
            <button onClick={prev} className="btn-icon border border-slate-200 hover:bg-slate-50">
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button onClick={next} className="btn-icon border border-slate-200 hover:bg-slate-50">
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>

        <div className="relative h-[400px] sm:h-[500px] rounded-[2rem] overflow-hidden shadow-2xl">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentItem.id}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
              className="absolute inset-0"
            >
              <div 
                className="absolute inset-0 opacity-10"
                style={{ backgroundColor: currentItem.color }}
              />
              <div className="absolute inset-0 flex flex-col md:flex-row">
                <div className="w-full md:w-1/2 p-8 md:p-16 flex flex-col justify-center z-10">
                  <motion.span 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="text-xs font-bold uppercase tracking-[0.2em] text-blue-600 mb-4"
                  >
                    Fresh Arrival
                  </motion.span>
                  <motion.h3 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    className="text-4xl md:text-6xl font-bold text-slate-900 font-display mb-6 leading-tight"
                  >
                    {currentItem.title}
                  </motion.h3>
                  <motion.p 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                    className="text-lg text-slate-600 mb-8 max-w-md"
                  >
                    {currentItem.description}
                  </motion.p>
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 }}
                  >
                    <a 
                      href={currentItem.link}
                      className="inline-flex items-center gap-2 bg-slate-900 text-white px-8 py-4 rounded-2xl font-bold hover:bg-slate-800 transition-all hover:gap-4 group outline-none focus:ring-4 focus:ring-slate-900/10"
                    >
                      Learn More
                      <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
                    </a>
                  </motion.div>
                </div>
                <div className="w-full md:w-1/2 relative bg-slate-50 flex items-center justify-center p-8">
                  <motion.div
                    initial={{ opacity: 0, scale: 0.8, rotate: -10 }}
                    animate={{ opacity: 1, scale: 1, rotate: 0 }}
                    transition={{ delay: 0.3, duration: 0.8 }}
                    className="relative z-10 w-full h-full max-w-sm"
                  >
                    <img 
                      src={currentItem.image} 
                      alt={currentItem.title}
                      className="w-full h-full object-contain drop-shadow-[0_20px_50px_rgba(0,0,0,0.15)]"
                    />
                  </motion.div>
                  <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-white/50 rounded-full blur-3xl" />
                </div>
              </div>
            </motion.div>
          </AnimatePresence>

          <div className="absolute bottom-8 left-8 md:left-16 flex gap-2 z-20">
            {items.map((item, i) => (
              <button
                key={item.id}
                onClick={() => setCurrentIndex(i)}
                className={`h-1.5 rounded-full transition-all duration-300 ${
                  i === currentIndex ? 'w-8 bg-slate-900' : 'w-2 bg-slate-300 hover:bg-slate-400'
                }`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
