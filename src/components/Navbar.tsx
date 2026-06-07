import { useState } from 'react';
import { Smartphone, ShoppingBag, Globe, Menu, X, ChevronDown, Search, Heart, User, LogOut, LayoutDashboard } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface NavbarProps {
  user: { name: string; email: string; role?: 'user' | 'admin' } | null;
  onLoginClick: () => void;
  onLogout: () => void;
  onProfileClick?: () => void;
  onAdminClick?: () => void;
  cartItemCount: number;
  onCartClick: () => void;
  wishlistCount: number;
  onWishlistClick: () => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
}

const NAV_LINKS = [
  { name: 'Home', href: '#home' },
  { name: 'Products', href: '#products' },
  { name: 'About Us', href: '#about' },
  { name: 'Shopping', href: '#shopping' },
  { name: 'Support', href: '#support' },
  { name: 'Explore With Us', href: '#explore' },
];

const LANGUAGES = [
  { code: 'EN', name: 'English' },
  { code: 'ES', name: 'Español' },
  { code: 'FR', name: 'Français' },
  { code: 'DE', name: 'Deutsch' },
  { code: 'ZH', name: '中文' },
];

export function Navbar({ user, onLoginClick, onLogout, onProfileClick, onAdminClick, cartItemCount, onCartClick, wishlistCount, onWishlistClick, searchQuery, onSearchChange }: NavbarProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [currentLang, setCurrentLang] = useState('EN');
  const [showLangMenu, setShowLangMenu] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);

  return (
    <nav className="fixed top-0 left-0 right-0 z-40 bg-white/80 backdrop-blur-md border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex items-center gap-2">
            <Smartphone className="h-6 w-6 text-blue-600" />
            <span className="font-display font-bold text-xl tracking-tight text-slate-900">
              Alexi
            </span>
          </div>
          
          {/* Desktop Nav Links */}
          <div className="hidden lg:flex items-center gap-6 xl:gap-8">
            {NAV_LINKS.map((link) => {
              if (link.name === 'Products') {
                return (
                  <div key={link.name} className="relative group">
                    <a href={link.href} className="text-sm font-medium text-slate-600 hover:text-blue-600 transition-colors flex items-center gap-1 py-4">
                      {link.name}
                      <ChevronDown className="w-3.5 h-3.5 transition-transform group-hover:rotate-180" />
                    </a>
                    <div className="absolute top-full left-0 w-40 bg-white border border-slate-100 rounded-xl shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 transform translate-y-2 group-hover:translate-y-0 z-50">
                      <div className="py-2">
                        {['Apple', 'Samsung', 'Xiaomi', 'Redmi', 'Tecno'].map(brand => (
                          <button
                            key={brand}
                            onClick={() => {
                              onSearchChange(brand);
                              document.getElementById('products')?.scrollIntoView({ behavior: 'smooth' });
                            }}
                            className="w-full text-left px-4 py-2 text-sm text-slate-600 hover:text-blue-600 hover:bg-blue-50 transition-colors"
                          >
                            {brand}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                );
              }
              return (
                <a key={link.name} href={link.href} className="text-sm font-medium text-slate-600 hover:text-blue-600 transition-colors">
                  {link.name}
                </a>
              );
            })}
          </div>

          {/* Right Side Actions */}
          <div className="flex items-center gap-1 sm:gap-2">
            {/* Search Input */}
            <div className="hidden sm:flex items-center relative mr-1 md:mr-2">
              <Search className="absolute left-3 h-4 w-4 text-slate-400" />
              <input 
                type="text"
                placeholder="Search products..."
                value={searchQuery}
                onChange={(e) => onSearchChange(e.target.value)}
                className="pl-9 pr-4 py-1.5 w-40 md:w-48 lg:w-64 bg-slate-100 border-none rounded-full text-sm font-medium text-slate-800 placeholder-slate-400 focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all outline-none"
              />
            </div>

            {/* Language Translator */}
            <div className="relative">
              <button 
                onClick={() => setShowLangMenu(!showLangMenu)}
                className="flex items-center gap-1.5 p-2 text-slate-600 hover:text-slate-900 transition-colors rounded-lg hover:bg-slate-100"
                aria-label="Select language"
              >
                <Globe className="h-5 w-5" />
                <span className="text-sm font-medium hidden sm:block">{currentLang}</span>
                <ChevronDown className="h-4 w-4 hidden sm:block" />
              </button>
              
              <AnimatePresence>
                {showLangMenu && (
                  <>
                    <div 
                      className="fixed inset-0 z-10" 
                      onClick={() => setShowLangMenu(false)}
                    />
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      transition={{ duration: 0.15 }}
                      className="absolute right-0 mt-2 w-40 bg-white rounded-xl shadow-lg border border-slate-100 py-2 z-20 origin-top-right"
                    >
                      {LANGUAGES.map((lang) => (
                        <button
                          key={lang.code}
                          onClick={() => {
                            setCurrentLang(lang.code);
                            setShowLangMenu(false);
                          }}
                          className="w-full text-left px-4 py-2.5 text-sm text-slate-700 hover:bg-blue-50 hover:text-blue-700 flex justify-between items-center transition-colors"
                        >
                          {lang.name}
                          {currentLang === lang.code && <span className="w-1.5 h-1.5 rounded-full bg-blue-600" />}
                        </button>
                      ))}
                    </motion.div>
                  </>
                )}
              </AnimatePresence>
            </div>

            <button
              onClick={onWishlistClick}
              className="relative btn-icon"
              aria-label="Open wishlist"
            >
              <Heart className="h-5 w-5 sm:h-6 sm:w-6" />
              {wishlistCount > 0 && (
                <motion.span
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  key={wishlistCount}
                  className="absolute top-0 right-0 bg-rose-500 text-white text-[10px] font-bold z-10 h-4 w-4 rounded-full flex items-center justify-center border-2 border-white pointer-events-none transform translate-x-1/4 -translate-y-1/4"
                >
                  {wishlistCount}
                </motion.span>
              )}
            </button>

            {/* Cart Button */}
            <button
              onClick={onCartClick}
              className="relative btn-icon"
              aria-label="Open cart"
            >
              <ShoppingBag className="h-5 w-5 sm:h-6 sm:w-6" />
              {cartItemCount > 0 && (
                <motion.span
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  key={cartItemCount}
                  className="absolute top-0 right-0 bg-blue-600 text-white text-[10px] font-bold z-10 h-4 w-4 rounded-full flex items-center justify-center border-2 border-white pointer-events-none transform translate-x-1/4 -translate-y-1/4"
                >
                  {cartItemCount}
                </motion.span>
              )}
            </button>

            {/* User Menu */}
            <div className="relative">
              {user ? (
                <>
                  <button
                    onClick={() => setShowUserMenu(!showUserMenu)}
                    className="w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center font-medium text-sm hover:bg-blue-700 transition-all duration-200 transform hover:scale-110 active:scale-90"
                    aria-label="User menu"
                  >
                    {user.name.charAt(0).toUpperCase()}
                  </button>
                  <AnimatePresence>
                    {showUserMenu && (
                      <>
                        <div 
                          className="fixed inset-0 z-10" 
                          onClick={() => setShowUserMenu(false)}
                        />
                        <motion.div
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, scale: 0.95 }}
                          transition={{ duration: 0.15 }}
                          className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-lg border border-slate-100 py-2 z-20 origin-top-right overflow-hidden"
                        >
                          <div className="px-4 py-2 border-b border-slate-50 mb-1">
                            <p className="text-sm font-medium text-slate-900 truncate">{user.name}</p>
                            <p className="text-xs text-slate-500 truncate">{user.email}</p>
                          </div>
                          {user.role === 'admin' && (
                            <button
                              onClick={() => {
                                onAdminClick?.();
                                setShowUserMenu(false);
                              }}
                              className="w-full text-left px-4 py-2 text-sm text-blue-600 hover:bg-blue-50 flex items-center gap-2 transition-colors font-bold"
                            >
                              <LayoutDashboard className="w-4 h-4" />
                              Admin Dashboard
                            </button>
                          )}
                          <button
                            onClick={() => {
                              onProfileClick?.();
                              setShowUserMenu(false);
                            }}
                            className="w-full text-left px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 hover:text-blue-600 flex items-center gap-2 transition-colors"
                          >
                            <User className="w-4 h-4" />
                            My Profile
                          </button>
                          <button
                            onClick={() => {
                              onLogout();
                              setShowUserMenu(false);
                            }}
                            className="w-full text-left px-4 py-2 text-sm text-rose-600 hover:bg-rose-50 flex items-center gap-2 transition-colors"
                          >
                            <LogOut className="w-4 h-4" />
                            Sign Out
                          </button>
                        </motion.div>
                      </>
                    )}
                  </AnimatePresence>
                </>
              ) : (
                <button
                  onClick={onLoginClick}
                  className="btn-icon"
                  aria-label="Sign In"
                >
                  <User className="h-5 w-5 sm:h-6 sm:w-6" />
                </button>
              )}
            </div>

            {/* Mobile Menu Toggle */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="lg:hidden p-2 text-slate-600 hover:text-slate-900 transition-colors rounded-lg hover:bg-slate-100"
              aria-label="Toggle menu"
            >
              {isMobileMenuOpen ? <X className="h-5 w-5 sm:h-6 sm:w-6" /> : <Menu className="h-5 w-5 sm:h-6 sm:w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="lg:hidden border-t border-slate-100 bg-white overflow-hidden"
          >
            <div className="px-4 pt-4 pb-2">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                <input 
                  type="text"
                  placeholder="Search products..."
                  value={searchQuery}
                  onChange={(e) => onSearchChange(e.target.value)}
                  className="w-full pl-9 pr-4 py-2 bg-slate-100 border-none rounded-xl text-sm font-medium text-slate-800 placeholder-slate-400 focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all outline-none"
                />
              </div>
            </div>
            <div className="px-4 pb-4 space-y-1 shadow-inner mt-2">
              {user?.role === 'admin' && (
                <button
                  onClick={() => {
                    setIsMobileMenuOpen(false);
                    onAdminClick?.();
                  }}
                  className="w-full flex items-center gap-3 px-3 py-3 rounded-xl text-base font-bold text-blue-600 bg-blue-50 border border-blue-100 transition-colors mb-2"
                >
                  <LayoutDashboard className="h-5 w-5" />
                  Admin Dashboard
                </button>
              )}
              {NAV_LINKS.map((link) => {
                if (link.name === 'Products') {
                  return (
                    <div key={link.name}>
                      <a
                        href={link.href}
                        className="block px-3 py-2.5 rounded-lg text-base font-medium text-slate-700 hover:text-blue-600 hover:bg-blue-50 transition-colors"
                        onClick={() => setIsMobileMenuOpen(false)}
                      >
                        {link.name}
                      </a>
                      <div className="pl-6 space-y-1 mt-1 border-l-2 border-slate-100 ml-4">
                        {['Apple', 'Samsung', 'Xiaomi', 'Redmi', 'Tecno'].map(brand => (
                          <button
                            key={brand}
                            onClick={() => {
                              setIsMobileMenuOpen(false);
                              onSearchChange(brand);
                              document.getElementById('products')?.scrollIntoView({ behavior: 'smooth' });
                            }}
                            className="block w-full text-left px-3 py-2 rounded-lg text-sm font-medium text-slate-500 hover:text-blue-600 hover:bg-blue-50 transition-colors"
                          >
                            {brand}
                          </button>
                        ))}
                      </div>
                    </div>
                  );
                }
                return (
                  <a
                    key={link.name}
                    href={link.href}
                    className="block px-3 py-2.5 rounded-lg text-base font-medium text-slate-700 hover:text-blue-600 hover:bg-blue-50 transition-colors"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    {link.name}
                  </a>
                );
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
