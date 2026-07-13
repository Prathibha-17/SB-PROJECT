import React from 'react';
import { Link } from 'react-router-dom';
import { BookOpen, Globe, Send, Share2, Mail, MapPin, Phone } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="relative bg-[#050508] border-t border-white/5 pt-20 pb-10 mt-auto overflow-hidden">
      
      {/* Background Neon ambient glows */}
      <div className="absolute w-[300px] h-[300px] rounded-full bg-indigo-900/10 filter blur-[80px] -bottom-20 -left-20 pointer-events-none" />
      <div className="absolute w-[200px] h-[200px] rounded-full bg-purple-900/10 filter blur-[60px] top-10 right-10 pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        
        {/* Footer Top Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
          
          {/* Logo & About */}
          <div className="flex flex-col gap-6">
            <Link to="/" className="flex items-center gap-2">
              <div className="w-9 h-9 rounded-lg bg-indigo-600/10 flex items-center justify-center border border-indigo-500/20">
                <BookOpen className="text-indigo-500" size={18} />
              </div>
              <span className="font-display font-extrabold text-lg text-white">
                Book<span className="text-indigo-500">Store</span>
              </span>
            </Link>
            <p className="text-gray-400 text-sm leading-relaxed">
              Your premium destination for discovering new worlds, learning bleeding-edge technologies, and mastering business leadership.
            </p>
            
            {/* Social Icons */}
            <div className="flex gap-3">
              <a 
                href="#" 
                className="w-10 h-10 rounded-xl bg-white/5 border border-white/5 hover:border-indigo-500/40 hover:bg-indigo-950/20 text-gray-400 hover:text-white flex items-center justify-center transition-all duration-300 shadow-[0_0_15px_rgba(0,0,0,0.5)]"
                aria-label="Twitter Social Link"
              >
                <Send size={15} />
              </a>
              <a 
                href="#" 
                className="w-10 h-10 rounded-xl bg-white/5 border border-white/5 hover:border-indigo-500/40 hover:bg-indigo-950/20 text-gray-400 hover:text-white flex items-center justify-center transition-all duration-300 shadow-[0_0_15px_rgba(0,0,0,0.5)]"
                aria-label="Github Social Link"
              >
                <Globe size={15} />
              </a>
              <a 
                href="#" 
                className="w-10 h-10 rounded-xl bg-white/5 border border-white/5 hover:border-indigo-500/40 hover:bg-indigo-950/20 text-gray-400 hover:text-white flex items-center justify-center transition-all duration-300 shadow-[0_0_15px_rgba(0,0,0,0.5)]"
                aria-label="Linkedin Social Link"
              >
                <Share2 size={15} />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-display text-white text-sm font-bold tracking-wider uppercase mb-6">Navigation</h4>
            <ul className="flex flex-col gap-4 text-sm text-gray-400">
              <li>
                <Link to="/" className="hover:text-white hover:underline decoration-indigo-500 underline-offset-4 transition-all duration-300">Home</Link>
              </li>
              <li>
                <Link to="/books" className="hover:text-white hover:underline decoration-indigo-500 underline-offset-4 transition-all duration-300">Books Catalog</Link>
              </li>
              <li>
                <Link to="/cart" className="hover:text-white hover:underline decoration-indigo-500 underline-offset-4 transition-all duration-300">Shopping Cart</Link>
              </li>
              <li>
                <Link to="/profile" className="hover:text-white hover:underline decoration-indigo-500 underline-offset-4 transition-all duration-300">My Profile</Link>
              </li>
            </ul>
          </div>

          {/* Categories */}
          <div>
            <h4 className="font-display text-white text-sm font-bold tracking-wider uppercase mb-6">Popular Genres</h4>
            <ul className="flex flex-col gap-4 text-sm text-gray-400">
              <li>
                <Link to="/books?category=Sci-Fi" className="hover:text-white hover:underline decoration-indigo-500 underline-offset-4 transition-all duration-300">Science Fiction</Link>
              </li>
              <li>
                <Link to="/books?category=Technology" className="hover:text-white hover:underline decoration-indigo-500 underline-offset-4 transition-all duration-300">Technology & AI</Link>
              </li>
              <li>
                <Link to="/books?category=Business" className="hover:text-white hover:underline decoration-indigo-500 underline-offset-4 transition-all duration-300">Business & Finance</Link>
              </li>
              <li>
                <Link to="/books?category=Self-Help" className="hover:text-white hover:underline decoration-indigo-500 underline-offset-4 transition-all duration-300">Self Improvement</Link>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="font-display text-white text-sm font-bold tracking-wider uppercase mb-6">Office Address</h4>
            <ul className="flex flex-col gap-5 text-sm text-gray-400">
              <li className="flex items-start gap-3">
                <MapPin size={16} className="text-indigo-500 mt-0.5 flex-shrink-0" />
                <span>100 Innovation Way, Silicon Valley, CA</span>
              </li>
              <li className="flex items-center gap-3">
                <Phone size={16} className="text-indigo-500 flex-shrink-0" />
                <span>+1 (555) 019-2834</span>
              </li>
              <li className="flex items-center gap-3">
                <Mail size={16} className="text-indigo-500 flex-shrink-0" />
                <span>support@bookstore.com</span>
              </li>
            </ul>
          </div>

        </div>

        <hr className="border-white/5 mb-10" />

        {/* Footer Bottom copyright */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-6 text-xs text-gray-500">
          <p>© {new Date().getFullYear()} BookStore Inc. All Rights Reserved. Designed as an Awwwards Demonstration.</p>
          <div className="flex gap-8">
            <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-white transition-colors">Terms of Service</a>
          </div>
        </div>

      </div>
    </footer>
  );
};

export default Footer;
