import React, { useState } from 'react';
import { Smartphone, Facebook, Twitter, Instagram, Youtube, Send, CheckCircle2 } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export function Footer() {
  const [email, setEmail] = useState('');
  const [isSubscribed, setIsSubscribed] = useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !email.includes('@')) return;
    
    // Add subscription logic here
    setEmail('');
    setIsSubscribed(true);
    
    setTimeout(() => {
      setIsSubscribed(false);
    }, 5000);
  };

  return (
    <footer className="bg-slate-900 border-t border-slate-800 pt-16 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="border-b border-slate-800 pb-12 mb-12 flex flex-col lg:flex-row items-center justify-between gap-8">
          <div className="text-center lg:text-left">
            <h3 className="text-white font-semibold text-lg mb-2">Subscribe to our newsletter</h3>
            <p className="text-slate-400 text-sm">Get the latest updates on new products and upcoming sales.</p>
          </div>
          <div className="w-full max-w-md relative">
            <form onSubmit={handleSubscribe} className="relative flex items-center">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                className="w-full pl-4 pr-32 py-3 bg-slate-800 border border-slate-700 rounded-xl text-sm text-white placeholder-slate-400 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                required
              />
              <button
                type="submit"
                className="absolute right-1 top-1 bottom-1 px-4 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-medium transition-colors flex items-center gap-2"
              >
                Subscribe
                <Send className="w-4 h-4" />
              </button>
            </form>
            
            <AnimatePresence>
              {isSubscribed && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  className="absolute top-full mt-4 left-0 right-0 flex items-center justify-center lg:justify-start gap-2 text-green-400 text-sm font-medium bg-green-500/10 py-2 px-4 rounded-lg border border-green-500/20"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  Thanks for subscribing! Check your inbox.
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <Smartphone className="h-6 w-6 text-blue-500" />
              <span className="font-display font-bold text-2xl tracking-tight text-white">
                Alexi
              </span>
            </div>
            <p className="text-slate-400 text-sm leading-relaxed max-w-xs">
              The next generation of mobile devices, curated for power, elegance, and connectivity.
            </p>
            <div className="flex items-center gap-4 pt-2">
              <a href="https://facebook.com" target="_blank" rel="noreferrer" className="text-slate-400 hover:text-white transition-colors" aria-label="Facebook">
                <Facebook className="h-5 w-5" />
              </a>
              <a href="https://twitter.com" target="_blank" rel="noreferrer" className="text-slate-400 hover:text-white transition-colors" aria-label="Twitter">
                <Twitter className="h-5 w-5" />
              </a>
              <a href="https://instagram.com" target="_blank" rel="noreferrer" className="text-slate-400 hover:text-white transition-colors" aria-label="Instagram">
                <Instagram className="h-5 w-5" />
              </a>
              <a href="https://youtube.com" target="_blank" rel="noreferrer" className="text-slate-400 hover:text-white transition-colors" aria-label="YouTube">
                <Youtube className="h-5 w-5" />
              </a>
            </div>
          </div>
          
          <div>
            <h3 className="text-white font-semibold mb-4">Shop</h3>
            <ul className="space-y-3">
              <li><a href="#products" className="text-slate-400 hover:text-white transition-colors text-sm">All Products</a></li>
              <li><a href="#products" className="text-slate-400 hover:text-white transition-colors text-sm">New Arrivals</a></li>
              <li><a href="#products" className="text-slate-400 hover:text-white transition-colors text-sm">Best Sellers</a></li>
              <li><a href="#products" className="text-slate-400 hover:text-white transition-colors text-sm">Accessories</a></li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-white font-semibold mb-4">Support</h3>
            <ul className="space-y-3">
              <li><a href="#support" className="text-slate-400 hover:text-white transition-colors text-sm">Help Center</a></li>
              <li><a href="#support" className="text-slate-400 hover:text-white transition-colors text-sm">Order Tracking</a></li>
              <li><a href="#support" className="text-slate-400 hover:text-white transition-colors text-sm">Warranty & Repairs</a></li>
              <li><a href="#support" className="text-slate-400 hover:text-white transition-colors text-sm">Returns</a></li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-white font-semibold mb-4">Company</h3>
            <ul className="space-y-3">
              <li><a href="#about" className="text-slate-400 hover:text-white transition-colors text-sm">About Us</a></li>
              <li><a href="#explore" className="text-slate-400 hover:text-white transition-colors text-sm">Explore With Us</a></li>
              <li><a href="#about" className="text-slate-400 hover:text-white transition-colors text-sm">Privacy Policy</a></li>
              <li><a href="#about" className="text-slate-400 hover:text-white transition-colors text-sm">Terms of Service</a></li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-slate-800 pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-slate-500 text-sm">
            &copy; {new Date().getFullYear()} Alexi Global. All rights reserved.
          </p>
          <div className="flex items-center gap-2">
             <span className="text-slate-500 text-sm">Region:</span>
             <button className="text-slate-300 text-sm font-medium hover:text-white transition-colors">Global (English)</button>
          </div>
        </div>
      </div>
    </footer>
  );
}
