import React, { useState, useEffect } from 'react';
import { Link, NavLink, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { BookOpen, ShoppingCart, User, LogOut, Menu, X, LayoutDashboard, Search } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const Navbar = () => {
  const { user, logout, isAdmin } = useAuth();
  const { cartCount } = useCart();
  const navigate = useNavigate();
  const location = useLocation();

  const [scrolled, setScrolled] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchVal, setSearchVal] = useState('');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Monitor scrolling to toggle blur
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 30) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleLogout = () => {
    logout();
    setMobileMenuOpen(false);
    navigate('/login');
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchVal.trim()) {
      navigate(`/books?search=${encodeURIComponent(searchVal)}`);
      setSearchVal('');
      setSearchOpen(false);
    }
  };

  // Helper to handle landing section scroll-overs
  const handleNavClick = (sectionId) => {
    setMobileMenuOpen(false);
    if (location.pathname !== '/') {
      navigate(`/#${sectionId}`);
    } else {
      const el = document.getElementById(sectionId);
      if (el) {
        el.scrollIntoView({ behavior: 'smooth' });
      }
    }
  };

  return (
    <nav className={`fixed top-0 left-0 right-0 z-[100] transition-all duration-500 ${
      scrolled 
        ? 'bg-[#0a0a0a]/75 backdrop-blur-xl border-b border-white/5 py-4' 
        : 'bg-transparent py-6'
    }`}>
      <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
        
        {/* Brand Logo */}
        <Link to="/" className="flex items-center gap-2 group">
          <div className="w-10 h-10 rounded-xl bg-indigo-600/10 flex items-center justify-center border border-indigo-500/20 group-hover:border-indigo-500/50 transition-all duration-300 shadow-[0_0_15px_rgba(79,70,229,0.1)] group-hover:shadow-[0_0_15px_rgba(79,70,229,0.3)]">
            <BookOpen className="text-indigo-500 group-hover:text-indigo-400 transition-all duration-300" size={20} />
          </div>
          <span className="font-display font-extrabold text-xl tracking-tight text-white">
            Book<span className="text-indigo-500">Store</span>
          </span>
        </Link>

        {/* Center Navigation Links (Desktop) */}
        <div className="hidden lg:flex items-center gap-8">
          <NavLink 
            to="/" 
            className={({ isActive }) => `font-sans text-sm font-medium tracking-wide transition-colors ${
              isActive ? 'text-white' : 'text-gray-400 hover:text-white'
            }`}
          >
            Home
          </NavLink>
          <NavLink 
            to="/books" 
            className={({ isActive }) => `font-sans text-sm font-medium tracking-wide transition-colors ${
              isActive ? 'text-white' : 'text-gray-400 hover:text-white'
            }`}
          >
            Books
          </NavLink>
          <button 
            onClick={() => handleNavClick('categories')} 
            className="font-sans text-sm font-medium tracking-wide text-gray-400 hover:text-white transition-colors"
          >
            Categories
          </button>
          <button 
            onClick={() => handleNavClick('authors')} 
            className="font-sans text-sm font-medium tracking-wide text-gray-400 hover:text-white transition-colors"
          >
            Authors
          </button>
          <button 
            onClick={() => handleNavClick('featured-books')} 
            className="font-sans text-sm font-medium tracking-wide text-gray-400 hover:text-white transition-colors"
          >
            Deals
          </button>
          <button 
            onClick={() => handleNavClick('why-us')} 
            className="font-sans text-sm font-medium tracking-wide text-gray-400 hover:text-white transition-colors"
          >
            About
          </button>
          <button 
            onClick={() => handleNavClick('newsletter')} 
            className="font-sans text-sm font-medium tracking-wide text-gray-400 hover:text-white transition-colors"
          >
            Contact
          </button>
          {isAdmin && (
            <Link 
              to="/admin" 
              className="flex items-center gap-1 font-sans text-sm font-medium tracking-wide text-indigo-400 hover:text-indigo-300 transition-colors"
            >
              <LayoutDashboard size={14} />
              <span>Admin</span>
            </Link>
          )}
        </div>

        {/* Right side controls */}
        <div className="flex items-center gap-6">
          {/* Expanded Search bar overlay */}
          <div className="relative">
            <AnimatePresence>
              {searchOpen && (
                <motion.form 
                  onSubmit={handleSearchSubmit}
                  initial={{ width: 0, opacity: 0 }}
                  animate={{ width: 220, opacity: 1 }}
                  exit={{ width: 0, opacity: 0 }}
                  className="absolute right-8 top-1/2 -translate-y-1/2"
                >
                  <input
                    type="text"
                    placeholder="Search titles..."
                    value={searchVal}
                    onChange={(e) => setSearchVal(e.target.value)}
                    className="w-full bg-[#1e1e1e] border border-white/10 rounded-full px-4 py-1.5 text-xs text-white focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
                    autoFocus
                  />
                </motion.form>
              )}
            </AnimatePresence>
            <button 
              onClick={() => setSearchOpen(!searchOpen)} 
              className="text-gray-400 hover:text-white p-1 transition-colors"
              aria-label="Search Catalog"
            >
              {searchOpen ? <X size={20} /> : <Search size={20} />}
            </button>
          </div>

          {/* Cart trigger */}
          <Link to="/cart" className="relative p-1 text-gray-400 hover:text-white transition-colors" aria-label="Shopping Cart">
            <ShoppingCart size={20} />
            {cartCount > 0 && (
              <span className="absolute -top-1.5 -right-1.5 bg-indigo-600 text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center border border-[#0a0a0a] shadow-[0_0_10px_rgba(79,70,229,0.5)]">
                {cartCount}
              </span>
            )}
          </Link>

          {/* User auth layout (Desktop) */}
          <div className="hidden lg:flex items-center gap-4">
            {user ? (
              <div className="flex items-center gap-4">
                <Link to="/profile" className="flex items-center gap-2">
                  <img 
                    src={user.avatar} 
                    alt={user.name} 
                    className="w-8 h-8 rounded-full border border-indigo-500/30 object-cover shadow-[0_0_8px_rgba(79,70,229,0.2)]" 
                  />
                  <span className="text-xs font-semibold text-gray-200 hover:text-white transition-colors">
                    {user.name.split(' ')[0]}
                  </span>
                </Link>
                <button 
                  onClick={handleLogout} 
                  className="flex items-center gap-1 text-xs text-gray-400 hover:text-red-400 border border-white/5 hover:border-red-500/20 px-3 py-1.5 rounded-full bg-[#1e1e1e]/40 transition-all duration-300"
                >
                  <LogOut size={12} />
                  <span>Logout</span>
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-3">
                <Link to="/login" className="text-xs font-semibold text-gray-400 hover:text-white transition-colors">
                  Login
                </Link>
                <Link to="/register" className="text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-500 px-4 py-2 rounded-full shadow-[0_0_15px_rgba(79,70,229,0.3)] hover:shadow-[0_0_15px_rgba(79,70,229,0.5)] transition-all duration-300">
                  Sign Up
                </Link>
              </div>
            )}
          </div>

          {/* Mobile responsive toggle */}
          <button 
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)} 
            className="lg:hidden text-gray-400 hover:text-white p-1 transition-colors"
            aria-label="Toggle Menu"
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

      </div>

      {/* Mobile Menu Drawer */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="absolute top-full left-0 right-0 bg-[#0a0a0a]/95 backdrop-blur-2xl border-b border-white/5 py-8 px-6 flex flex-col gap-6 lg:hidden"
          >
            <Link to="/" onClick={() => setMobileMenuOpen(false)} className="text-sm font-semibold text-gray-200">Home</Link>
            <Link to="/books" onClick={() => setMobileMenuOpen(false)} className="text-sm font-semibold text-gray-200">Books</Link>
            <button onClick={() => handleNavClick('categories')} className="text-left text-sm font-semibold text-gray-200">Categories</button>
            <button onClick={() => handleNavClick('authors')} className="text-left text-sm font-semibold text-gray-200">Authors</button>
            <button onClick={() => handleNavClick('featured-books')} className="text-left text-sm font-semibold text-gray-200">Deals</button>
            <button onClick={() => handleNavClick('why-us')} className="text-left text-sm font-semibold text-gray-200">About</button>
            <button onClick={() => handleNavClick('newsletter')} className="text-left text-sm font-semibold text-gray-200">Contact</button>
            {isAdmin && (
              <Link to="/admin" onClick={() => setMobileMenuOpen(false)} className="text-sm font-semibold text-indigo-400">Admin Console</Link>
            )}
            
            <hr className="border-white/5" />
            
            {user ? (
              <div className="flex items-center justify-between">
                <Link to="/profile" onClick={() => setMobileMenuOpen(false)} className="flex items-center gap-3">
                  <img src={user.avatar} alt={user.name} className="w-10 h-10 rounded-full border border-indigo-500/30 object-cover" />
                  <div>
                    <h4 className="text-sm font-bold text-white">{user.name}</h4>
                    <p className="text-xs text-gray-400">{user.email}</p>
                  </div>
                </Link>
                <button onClick={handleLogout} className="flex items-center gap-1 text-xs text-red-400 border border-red-500/10 px-3 py-2 rounded-full bg-red-950/20">
                  <LogOut size={12} />
                  <span>Logout</span>
                </button>
              </div>
            ) : (
              <div className="flex flex-col gap-3">
                <Link to="/login" onClick={() => setMobileMenuOpen(false)} className="w-full text-center border border-white/10 rounded-full py-2.5 text-sm font-semibold text-white">
                  Login
                </Link>
                <Link to="/register" onClick={() => setMobileMenuOpen(false)} className="w-full text-center bg-indigo-600 rounded-full py-2.5 text-sm font-semibold text-white shadow-lg">
                  Sign Up
                </Link>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default Navbar;
