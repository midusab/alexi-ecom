import React, { useState } from 'react';
import { X, Mail, Lock, User as UserIcon } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { UserProfile } from '../types';
import { useAuth } from '../../hooks/useAuth';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLogin: (user: UserProfile) => void;
}

const errorVariants = {
  hidden: { opacity: 0, height: 0, y: -5 },
  visible: { opacity: 1, height: 'auto', y: 0, transition: { duration: 0.2 } },
  exit: { opacity: 0, height: 0, y: -5, transition: { duration: 0.15 } }
};

export function AuthModal({ isOpen, onClose, onLogin }: AuthModalProps) {
  const { login, register } = useAuth();
  const [isLogin, setIsLogin] = useState(true);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState<{ name?: string; email?: string; password?: string }>({});
  const [loading, setLoading] = useState(false);
  const [shakeCount, setShakeCount] = useState(0);

  const validate = () => {
    const newErrors: { name?: string; email?: string; password?: string } = {};

    if (!isLogin && !name.trim()) {
      newErrors.name = 'Full name is required.';
    } else if (!isLogin && name.trim().length < 2) {
      newErrors.name = 'Name must be at least 2 characters.';
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email.trim()) {
      newErrors.email = 'Email address is required.';
    } else if (!emailRegex.test(email)) {
      newErrors.email = 'Please enter a valid email address.';
    }

    if (!password) {
      newErrors.password = 'Password is required.';
    } else if (password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters.';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});

    if (!validate()) {
      setShakeCount(prev => prev + 1);
      return;
    }

    setLoading(true);

    try {
      let loggedInUser: UserProfile;
      if (isLogin) {
        loggedInUser = await login(email, password);
      } else {
        loggedInUser = await register(name, email, password);
      }
      onLogin(loggedInUser);
      setName('');
      setEmail('');
      setPassword('');
      onClose();
    } catch (err: any) {
      console.error(err);
      const newErrors: { name?: string; email?: string; password?: string } = {};
      
      if (
        err.code === 'auth/invalid-credential' ||
        err.code === 'auth/wrong-password' ||
        err.code === 'auth/user-not-found'
      ) {
        newErrors.email = 'Invalid email or password.';
        newErrors.password = 'Invalid email or password.';
      } else if (err.code === 'auth/email-already-in-use') {
        newErrors.email = 'An account with this email already exists.';
      } else if (err.code === 'auth/weak-password') {
        newErrors.password = 'Password should be at least 6 characters.';
      } else if (err.code === 'auth/invalid-email') {
        newErrors.email = 'Please enter a valid email address.';
      } else {
        newErrors.email = err.message || 'An authentication error occurred.';
      }
      
      setErrors(newErrors);
      setShakeCount(prev => prev + 1);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
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
          className="relative w-full max-w-md bg-white rounded-2xl shadow-xl overflow-hidden"
        >
          <div className="flex justify-between items-center p-6 border-b border-slate-100 bg-white">
            <h2 className="text-2xl font-bold font-display shiny-text">
              {isLogin ? 'Welcome back' : 'Create an account'}
            </h2>
            <button
              onClick={onClose}
              className="btn-icon"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="p-6">
            <div className="flex gap-4 mb-6">
              <button
                onClick={() => {
                  setIsLogin(true);
                  setErrors({});
                }}
                className={`flex-1 pb-2 text-sm font-medium border-b-2 transition-colors ${
                  isLogin ? 'border-blue-600 text-blue-600' : 'border-transparent text-slate-500 hover:text-slate-700'
                }`}
              >
                Sign In
              </button>
              <button
                onClick={() => {
                  setIsLogin(false);
                  setErrors({});
                }}
                className={`flex-1 pb-2 text-sm font-medium border-b-2 transition-colors ${
                  !isLogin ? 'border-blue-600 text-blue-600' : 'border-transparent text-slate-500 hover:text-slate-700'
                }`}
              >
                Register
              </button>
            </div>

            <motion.form 
              onSubmit={handleSubmit} 
              className="space-y-4"
              animate={shakeCount > 0 ? { x: [0, -10, 10, -10, 10, -5, 5, 0] } : {}}
              transition={{ duration: 0.4 }}
              key={shakeCount}
            >
              {!isLogin && (
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Full Name</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                      <UserIcon className="h-5 w-5" />
                    </div>
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => {
                        setName(e.target.value);
                        if (errors.name) setErrors(prev => ({ ...prev, name: undefined }));
                      }}
                      className={`block w-full pl-10 pr-3 py-2 border rounded-xl outline-none transition-all ${
                        errors.name 
                          ? 'border-rose-500 focus:ring-2 focus:ring-rose-500 focus:border-rose-500' 
                          : 'border-slate-200 focus:ring-2 focus:ring-blue-500 focus:border-blue-500'
                      }`}
                      placeholder="John Doe"
                    />
                  </div>
                  <AnimatePresence>
                    {errors.name && (
                      <motion.p
                        variants={errorVariants}
                        initial="hidden"
                        animate="visible"
                        exit="hidden"
                        className="text-xs text-rose-500 mt-1 font-medium flex items-center gap-1"
                      >
                        <span className="w-1 h-1 rounded-full bg-rose-500 shrink-0"></span>
                        {errors.name}
                      </motion.p>
                    )}
                  </AnimatePresence>
                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Email Address</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                    <Mail className="h-5 w-5" />
                  </div>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value);
                      if (errors.email) setErrors(prev => ({ ...prev, email: undefined }));
                    }}
                    className={`block w-full pl-10 pr-3 py-2 border rounded-xl outline-none transition-all ${
                      errors.email 
                        ? 'border-rose-500 focus:ring-2 focus:ring-rose-500 focus:border-rose-500' 
                        : 'border-slate-200 focus:ring-2 focus:ring-blue-500 focus:border-blue-500'
                    }`}
                    placeholder="you@email.com"
                  />
                </div>
                <AnimatePresence>
                  {errors.email && (
                    <motion.p
                      variants={errorVariants}
                      initial="hidden"
                      animate="visible"
                      exit="hidden"
                      className="text-xs text-rose-500 mt-1 font-medium flex items-center gap-1"
                    >
                      <span className="w-1 h-1 rounded-full bg-rose-500 shrink-0"></span>
                      {errors.email}
                    </motion.p>
                  )}
                </AnimatePresence>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Password</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                    <Lock className="h-5 w-5" />
                  </div>
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => {
                      setPassword(e.target.value);
                      if (errors.password) setErrors(prev => ({ ...prev, password: undefined }));
                    }}
                    className={`block w-full pl-10 pr-3 py-2 border rounded-xl outline-none transition-all ${
                      errors.password 
                        ? 'border-rose-500 focus:ring-2 focus:ring-rose-500 focus:border-rose-500' 
                        : 'border-slate-200 focus:ring-2 focus:ring-blue-500 focus:border-blue-500'
                    }`}
                    placeholder="••••••••"
                  />
                </div>
                <AnimatePresence>
                  {errors.password && (
                    <motion.p
                      variants={errorVariants}
                      initial="hidden"
                      animate="visible"
                      exit="hidden"
                      className="text-xs text-rose-500 mt-1 font-medium flex items-center gap-1"
                    >
                      <span className="w-1 h-1 rounded-full bg-rose-500 shrink-0"></span>
                      {errors.password}
                    </motion.p>
                  )}
                </AnimatePresence>
              </div>

              <button
                type="submit"
                className="btn-primary w-full mt-6 flex justify-center items-center gap-2"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                    Please wait...
                  </>
                ) : (
                  isLogin ? 'Sign In' : 'Create Account'
                )}
              </button>
            </motion.form>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
