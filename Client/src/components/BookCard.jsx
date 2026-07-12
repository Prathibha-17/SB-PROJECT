import React from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { Star, ShoppingCart } from 'lucide-react';

const BookCard = ({ book }) => {
  const { addToCart } = useCart();
  const isOutOfStock = book.stock <= 0;

  const handleAddToCart = (e) => {
    e.preventDefault(); // Stop routing to details page when clicking Cart button
    addToCart(book, 1);
  };

  return (
    <div className="group relative flex flex-col h-full bg-[#1e1e24]/40 border border-white/5 hover:border-indigo-500/30 rounded-2xl p-4 overflow-hidden transition-all duration-500 shadow-lg hover:shadow-[0_0_20px_rgba(79,70,229,0.15)] backdrop-blur-xl">
      
      {/* Background glowing gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/0 via-indigo-500/0 to-indigo-500/0 group-hover:to-indigo-500/5 transition-all duration-500 pointer-events-none" />

      {/* Category Badge */}
      <span className="absolute top-6 left-6 z-10 font-sans text-[10px] font-bold text-indigo-400 bg-indigo-950/60 border border-indigo-500/20 px-2.5 py-1 rounded-full uppercase tracking-wider shadow-md backdrop-blur-md">
        {book.category}
      </span>

      {/* Book Cover Link */}
      <Link to={`/book/${book.id}`} className="flex-grow flex flex-col">
        {/* Cover Container */}
        <div className="relative rounded-xl overflow-hidden aspect-[3/4] mb-4 bg-black/40 border border-white/5 shadow-inner">
          <img 
            src={book.coverUrl} 
            alt={book.title} 
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
          />
          {isOutOfStock && (
            <div className="absolute inset-0 bg-black/85 flex items-center justify-center text-red-500 font-display font-extrabold text-sm uppercase tracking-widest border border-red-500/20">
              Sold Out
            </div>
          )}
        </div>

        {/* Info */}
        <h3 className="font-display font-bold text-base text-white group-hover:text-indigo-400 transition-colors duration-300 line-clamp-2 min-h-[3rem] mb-1.5 leading-snug">
          {book.title}
        </h3>
        
        <p className="text-xs text-gray-400 font-medium mb-3">
          by {book.author}
        </p>

        {/* Rating Row */}
        <div className="flex items-center gap-1.5 mb-4">
          <div className="flex items-center text-yellow-500">
            <Star size={12} fill="currentColor" />
          </div>
          <span className="text-xs font-bold text-gray-200">
            {book.rating.toFixed(1)}
          </span>
          <span className="text-[10px] text-gray-500">
            ({book.reviews} reviews)
          </span>
        </div>
      </Link>

      {/* Pricing & Cart Action */}
      <div className="flex items-center justify-between pt-3 border-t border-white/5 mt-auto">
        <span className="font-display font-extrabold text-lg text-white">
          ₹{book.price.toFixed(2)}
        </span>

        <button 
          onClick={handleAddToCart}
          disabled={isOutOfStock}
          className={`flex items-center justify-center w-9 h-9 rounded-xl transition-all duration-300 ${
            isOutOfStock 
              ? 'bg-white/5 text-gray-600 cursor-not-allowed border border-white/5' 
              : 'bg-indigo-600 hover:bg-indigo-500 text-white shadow-[0_0_10px_rgba(79,70,229,0.3)] hover:shadow-[0_0_15px_rgba(79,70,229,0.6)] border border-indigo-500/30'
          }`}
          title={isOutOfStock ? "Out of Stock" : "Add to Cart"}
        >
          <ShoppingCart size={15} />
        </button>
      </div>

    </div>
  );
};

export default BookCard;
