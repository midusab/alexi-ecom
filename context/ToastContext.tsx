import React, { createContext, useState, useCallback } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';

export type ToastType = 'success' | 'error' | 'info';

interface Toast {
  id: string;
  message: string;
  type: ToastType;
}

interface ToastContextType {
  showToast: (message: string, type: ToastType) => void;
}

export const ToastContext = createContext<ToastContextType | undefined>(undefined);

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
  }, []);

  const showToast = useCallback((message: string, type: ToastType) => {
    const id = Math.random().toString(36).substring(2, 9);
    setToasts((prev) => [...prev, { id, message, type }]);

    setTimeout(() => {
      removeToast(id);
    }, 4000);
  }, [removeToast]);

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      
      {/* Toast Container Overlay */}
      <div className="fixed top-4 right-4 z-[100] flex flex-col gap-3 pointer-events-none max-w-full sm:max-w-md">
        <AnimatePresence>
          {toasts.map((toast) => (
            <motion.div
              key={toast.id}
              layout
              initial={{ opacity: 0, x: 50, scale: 0.9 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              exit={{ opacity: 0, x: 50, scale: 0.9, transition: { duration: 0.15 } }}
              transition={{ type: 'spring', stiffness: 300, damping: 25 }}
              className={`pointer-events-auto flex items-center justify-between gap-3 p-4 rounded-2xl shadow-xl border backdrop-blur-md min-w-[280px] sm:min-w-[340px] ${
                toast.type === 'success' ? 'bg-white/95 border-emerald-100 text-slate-800' :
                toast.type === 'error' ? 'bg-white/95 border-rose-100 text-slate-800' :
                'bg-white/95 border-blue-100 text-slate-800'
              }`}
            >
              <div className="flex items-center gap-3">
                {toast.type === 'success' && (
                  <div className="p-1.5 bg-emerald-50 text-emerald-600 rounded-xl shrink-0">
                    <CheckCircle2 className="w-5 h-5" />
                  </div>
                )}
                {toast.type === 'error' && (
                  <div className="p-1.5 bg-rose-50 text-rose-600 rounded-xl shrink-0">
                    <AlertCircle className="w-5 h-5" />
                  </div>
                )}
                {toast.type === 'info' && (
                  <div className="p-1.5 bg-blue-50 text-blue-600 rounded-xl shrink-0">
                    <Info className="w-5 h-5" />
                  </div>
                )}
                
                <p className="text-sm font-medium text-slate-800 leading-tight">
                  {toast.message}
                </p>
              </div>
              
              <button
                onClick={() => removeToast(toast.id)}
                className="text-slate-400 hover:text-slate-600 p-1 hover:bg-slate-50 rounded-lg shrink-0 transition-colors"
                aria-label="Close notification"
              >
                <X className="w-4 h-4" />
              </button>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </ToastContext.Provider>
  );
}
