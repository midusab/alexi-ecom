import React, { useState } from 'react';
import { Product, Review } from '../types';
import { X, Star, ShoppingCart, Send, User } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface ProductModalProps {
  product: Product;
  isOpen: boolean;
  onClose: () => void;
  onAddToCart: (product: Product) => void;
}

export function ProductModal({ product, isOpen, onClose, onAddToCart }: ProductModalProps) {
  const [activeTab, setActiveTab] = useState<'details' | 'reviews' | 'video'>('details');
  const [newReview, setNewReview] = useState('');
  const [rating, setRating] = useState(5);
  const [reviews, setReviews] = useState<Review[]>(product.reviews || []);

  const handleAddReview = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newReview.trim()) return;

    const review: Review = {
      id: Math.random().toString(),
      author: 'You',
      rating,
      comment: newReview,
      date: new Date().toISOString().split('T')[0],
    };

    setReviews([review, ...reviews]);
    setNewReview('');
    setRating(5);
  };

  if (!isOpen) return null;

  const averageRating = reviews.length > 0 
    ? (reviews.reduce((acc, r) => acc + r.rating, 0) / reviews.length).toFixed(1)
    : 5.0;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
        />
        
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="relative w-full max-w-4xl max-h-[90vh] bg-white rounded-3xl shadow-2xl overflow-hidden flex flex-col z-10"
        >
          <button
            onClick={onClose}
            className="absolute top-4 right-4 z-20 btn-icon bg-white/80 backdrop-blur shadow-sm"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="overflow-y-auto flex-1 custom-scrollbar">
            <div className="flex flex-col md:flex-row border-b border-slate-100">
              <div className="w-full md:w-1/2 relative bg-slate-50 min-h-[300px]">
                <img
                  src={product.image}
                  alt={product.name}
                  className="absolute inset-0 w-full h-full object-cover"
                  crossOrigin="anonymous"
                />
              </div>
              
              <div className="w-full md:w-1/2 p-6 sm:p-8 flex flex-col justify-center">
                <div className="mb-2 flex items-center justify-between">
                  <span className="text-sm font-semibold text-blue-600 bg-blue-50 px-3 py-1 rounded-full">
                    {product.brand}
                  </span>
                  <div className="flex items-center gap-1 text-amber-500">
                    <Star className="w-4 h-4 fill-current" />
                    <span className="text-sm font-semibold text-slate-700">{averageRating} ({reviews.length})</span>
                  </div>
                </div>
                
                <h2 className="text-3xl font-display font-bold text-slate-900 mb-2">{product.name}</h2>
                <div className="text-2xl font-semibold text-slate-900 mb-6">KSh {product.price.toLocaleString()}</div>
                
                <button
                  onClick={() => {
                    onAddToCart(product);
                    onClose();
                  }}
                  className="btn-primary w-full py-4 mb-6"
                >
                  <ShoppingCart className="w-5 h-5" />
                  Add to Cart
                </button>

                <div className="flex gap-4 border-b border-slate-200">
                  <button 
                    onClick={() => setActiveTab('details')}
                    className={`pb-3 text-sm font-medium border-b-2 transition-colors ${activeTab === 'details' ? 'border-blue-600 text-blue-600' : 'border-transparent text-slate-500 hover:text-slate-700'}`}
                  >
                    Details & Specs
                  </button>
                  <button 
                    onClick={() => setActiveTab('reviews')}
                    className={`pb-3 text-sm font-medium border-b-2 transition-colors ${activeTab === 'reviews' ? 'border-blue-600 text-blue-600' : 'border-transparent text-slate-500 hover:text-slate-700'}`}
                  >
                    Reviews ({reviews.length})
                  </button>
                  {product.videoUrl && (
                    <button 
                      onClick={() => setActiveTab('video')}
                      className={`pb-3 text-sm font-medium border-b-2 transition-colors ${activeTab === 'video' ? 'border-blue-600 text-blue-600' : 'border-transparent text-slate-500 hover:text-slate-700'}`}
                    >
                      Video Demo
                    </button>
                  )}
                </div>
              </div>
            </div>

            <div className="p-6 sm:p-8 bg-slate-50/50">
              {activeTab === 'details' ? (
                <div className="space-y-8 animate-in fade-in duration-300">
                  <div>
                    <h3 className="text-lg font-semibold text-slate-900 mb-3">Overview</h3>
                    <p className="text-slate-600 leading-relaxed">{product.description}</p>
                  </div>
                  
                  <div>
                    <h3 className="text-lg font-semibold text-slate-900 mb-3">Key Features</h3>
                    <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {product.features.map((feature, i) => (
                        <li key={i} className="flex items-center gap-2 text-slate-600">
                          <div className="w-1.5 h-1.5 rounded-full bg-blue-500" />
                          {feature}
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div>
                    <h3 className="text-lg font-semibold text-slate-900 mb-4">Technical Specifications</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-4">
                      {Object.entries(product.specs).map(([key, value]) => (
                        <div key={key} className="flex justify-between py-2 border-b border-slate-200">
                          <span className="text-slate-500 capitalize">{key}</span>
                          <span className="font-medium text-slate-900">{value}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              ) : activeTab === 'video' && product.videoUrl ? (
                <div className="space-y-8 animate-in fade-in duration-300">
                  <div className="aspect-video w-full rounded-2xl overflow-hidden bg-black shadow-lg">
                    <video 
                      src={product.videoUrl} 
                      controls 
                      autoPlay 
                      className="w-full h-full object-contain"
                    />
                  </div>
                </div>
              ) : (
                <div className="space-y-8 animate-in fade-in duration-300">
                  {/* Add Review Form */}
                  <form onSubmit={handleAddReview} className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
                    <h3 className="text-lg font-semibold text-slate-900 mb-4">Write a Review</h3>
                    <div className="mb-4">
                      <label className="block text-sm font-medium text-slate-700 mb-2">Rating</label>
                      <div className="flex gap-1">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <button
                            key={star}
                            type="button"
                            onClick={() => setRating(star)}
                            className="p-1 focus:outline-none"
                          >
                            <Star className={`w-6 h-6 ${star <= rating ? 'fill-amber-400 text-amber-400' : 'text-slate-200'}`} />
                          </button>
                        ))}
                      </div>
                    </div>
                    <div className="mb-4">
                      <label className="block text-sm font-medium text-slate-700 mb-2">Your Comment</label>
                      <textarea
                        value={newReview}
                        onChange={(e) => setNewReview(e.target.value)}
                        placeholder="What do you think about this product?"
                        className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all resize-none h-24 text-slate-700"
                        required
                      />
                    </div>
                    <button
                      type="submit"
                      disabled={!newReview.trim()}
                      className="btn-primary px-8"
                    >
                      <Send className="w-4 h-4" />
                      Post Review
                    </button>
                  </form>

                  {/* Review List */}
                  <div className="space-y-4">
                    {reviews.map((review) => (
                      <div key={review.id} className="bg-white p-5 rounded-2xl shadow-sm border border-slate-100">
                        <div className="flex justify-between items-start mb-3">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-slate-100 rounded-full flex items-center justify-center text-slate-500">
                              <User className="w-5 h-5" />
                            </div>
                            <div>
                              <div className="font-semibold text-slate-900">{review.author}</div>
                              <div className="text-xs text-slate-500">{review.date}</div>
                            </div>
                          </div>
                          <div className="flex gap-0.5">
                            {Array.from({ length: 5 }).map((_, i) => (
                              <Star key={i} className={`w-4 h-4 ${i < review.rating ? 'fill-amber-400 text-amber-400' : 'text-slate-200'}`} />
                            ))}
                          </div>
                        </div>
                        <p className="text-slate-600 text-sm">{review.comment}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
