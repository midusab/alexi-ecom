import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X } from 'lucide-react';

export function CookieBanner() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const consent = localStorage.getItem('cookie-consent');
    if (!consent) {
      // Small delay before showing
      const timer = setTimeout(() => setIsVisible(true), 1000);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleAccept = () => {
    localStorage.setItem('cookie-consent', 'true');
    setIsVisible(false);
  };

  const handleDecline = () => {
    localStorage.setItem('cookie-consent', 'false');
    setIsVisible(false);
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          transition={{ type: 'spring', damping: 20, stiffness: 300 }}
          className="fixed bottom-0 left-0 right-0 z-50 p-4 pointer-events-none"
        >
          <div className="max-w-4xl mx-auto pointer-events-auto bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col sm:flex-row items-center justify-between p-4 sm:p-6 gap-4">
            <div className="flex-1 pr-4">
              <h3 className="text-lg font-semibold text-slate-900 mb-1">We use cookies</h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                We use cookies to enhance your browsing experience, serve personalized ads or content, and analyze our traffic. By clicking "Accept All", you consent to our use of cookies.
              </p>
            </div>
            <div className="flex items-center gap-3 shrink-0 w-full sm:w-auto mt-2 sm:mt-0">
              <button
                onClick={handleDecline}
                className="btn-outline flex-1 sm:flex-none"
              >
                Decline
              </button>
              <button
                onClick={handleAccept}
                className="btn-primary flex-1 sm:flex-none"
              >
                Accept All
              </button>
              <button
                onClick={() => setIsVisible(false)}
                className="hidden sm:flex btn-icon"
                aria-label="Close"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
