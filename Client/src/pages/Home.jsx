import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useBooks } from '../context/BookContext';
import { useCart } from '../context/CartContext';
import BookCard from '../components/BookCard';
import Loader from '../components/Loader';
import Book3D from '../components/Book3D';
import PageLoader from '../components/PageLoader';
import TiltCard from '../components/TiltCard';
import { motion, useAnimation } from 'framer-motion';
import {
  ArrowRight, BookOpen, Star, Zap, Award, ShieldCheck,
  CheckCircle, Quote, Send, ArrowLeft, Users, Grid, Shield
} from 'lucide-react';

/* ─────────────────────────────────────────────────────────────
   ZERO-GRAVITY FLOATING WORD
   Each word bobs independently at a unique phase + amplitude
───────────────────────────────────────────────────────────── */
const FloatingWord = ({ word, gradient, delay = 0, phase = 0, amplitude = 6 }) => {
  const floatVariants = {
    animate: {
      y: [0, -amplitude, amplitude * 0.4, -amplitude * 0.6, 0],
      rotate: [0, -0.8, 0.5, -0.4, 0],
      transition: {
        duration: 4.5 + phase * 0.8,
        repeat: Infinity,
        ease: 'easeInOut',
        delay,
      },
    },
  };

  return (
    <motion.span
      variants={floatVariants}
      animate="animate"
      style={{
        display: 'inline-block',
        marginRight: '0.28em',
        ...(gradient
          ? {
              backgroundImage: gradient,
              WebkitBackgroundClip: 'text',
              backgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              filter: 'drop-shadow(0 0 18px rgba(192,132,252,0.55)) drop-shadow(0 0 38px rgba(99,102,241,0.35))',
            }
          : {
              color: '#ffffff',
              filter: 'drop-shadow(0 0 12px rgba(255,255,255,0.18))',
            }),
      }}
    >
      {word}
    </motion.span>
  );
};

/* ─────────────────────────────────────────────────────────────
   3D GLASSMORPHISM TACTILE BUTTON
───────────────────────────────────────────────────────────── */
const GlassButton = ({ children, onClick, href, variant = 'primary', className = '' }) => {
  const [pressed, setPressed] = useState(false);

  const baseStyle = {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '8px',
    fontWeight: 700,
    fontSize: '0.875rem',
    borderRadius: '14px',
    border: 'none',
    cursor: 'none',
    outline: 'none',
    position: 'relative',
    overflow: 'hidden',
    transition: 'transform 0.12s cubic-bezier(0.34,1.56,0.64,1), box-shadow 0.18s ease',
    transform: pressed ? 'translateY(3px) scale(0.97)' : 'translateY(0px) scale(1)',
    userSelect: 'none',
    textDecoration: 'none',
    padding: '14px 32px',
  };

  const primaryStyle = {
    ...baseStyle,
    background: 'linear-gradient(135deg, rgba(79,70,229,0.85) 0%, rgba(139,92,246,0.90) 50%, rgba(168,85,247,0.85) 100%)',
    backdropFilter: 'blur(20px)',
    WebkitBackdropFilter: 'blur(20px)',
    color: '#ffffff',
    boxShadow: pressed
      ? '0 2px 8px rgba(79,70,229,0.4), 0 0 0 1px rgba(139,92,246,0.3), inset 0 1px 0 rgba(255,255,255,0.08)'
      : '0 8px 32px rgba(79,70,229,0.45), 0 2px 8px rgba(139,92,246,0.3), 0 0 0 1px rgba(139,92,246,0.4), inset 0 1px 0 rgba(255,255,255,0.20), inset 0 -2px 0 rgba(0,0,0,0.25)',
  };

  const outlineStyle = {
    ...baseStyle,
    background: 'rgba(255,255,255,0.04)',
    backdropFilter: 'blur(20px)',
    WebkitBackdropFilter: 'blur(20px)',
    color: '#e0e7ff',
    boxShadow: pressed
      ? '0 2px 6px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,255,255,0.04)'
      : '0 8px 24px rgba(0,0,0,0.25), 0 0 0 1px rgba(139,92,246,0.28), inset 0 1px 0 rgba(255,255,255,0.12), inset 0 -2px 0 rgba(0,0,0,0.20)',
  };

  const style = variant === 'primary' ? primaryStyle : outlineStyle;

  const inner = (
    <>
      {/* Top gloss reflection */}
      <span style={{
        position: 'absolute', top: 0, left: 0, right: 0, height: '46%',
        background: 'linear-gradient(180deg, rgba(255,255,255,0.14) 0%, transparent 100%)',
        borderRadius: '14px 14px 0 0',
        pointerEvents: 'none',
      }} />
      {/* Content */}
      <span style={{ position: 'relative', zIndex: 1, display: 'flex', alignItems: 'center', gap: '8px' }}>
        {children}
      </span>
    </>
  );

  const handlers = {
    onMouseDown:  () => setPressed(true),
    onMouseUp:    () => setPressed(false),
    onMouseLeave: () => setPressed(false),
    onTouchStart: () => setPressed(true),
    onTouchEnd:   () => setPressed(false),
  };

  if (href) {
    return <Link to={href} style={style} {...handlers} className={className}>{inner}</Link>;
  }
  return <button style={style} onClick={onClick} {...handlers} className={className}>{inner}</button>;
};

/* ─────────────────────────────────────────────────────────────
   ANIMATED COUNTER STAT CARD  (matches screenshot row)
───────────────────────────────────────────────────────────── */
const StatCard = ({ value, label, icon: Icon }) => {
  const [count, setCount] = useState(0);
  const numeric = parseInt(value.replace(/\D/g, ''), 10) || 0;
  const suffix  = value.includes('K') ? 'K' : '';

  useEffect(() => {
    let start = 0;
    const step = Math.ceil(numeric / 55);
    const id = setInterval(() => {
      start += step;
      if (start >= numeric) { setCount(numeric); clearInterval(id); }
      else setCount(start);
    }, 32);
    return () => clearInterval(id);
  }, [numeric]);

  return (
    <div className="flex items-center gap-3 px-5 py-3 rounded-2xl bg-white/5 border border-white/8 backdrop-blur-md">
      <div className="w-9 h-9 rounded-lg bg-indigo-500/15 border border-indigo-500/25 flex items-center justify-center text-indigo-400 flex-shrink-0">
        <Icon size={17} />
      </div>
      <div>
        <div className="font-extrabold text-lg leading-none text-white">
          {count}{suffix}+
        </div>
        <div className="text-[11px] font-semibold text-gray-400 mt-0.5 uppercase tracking-wider">
          {label}
        </div>
      </div>
    </div>
  );
};

/* ─────────────────────────────────────────────────────────────
   STARFIELD CANVAS  (matches the screenshot deep-space bg)
───────────────────────────────────────────────────────────── */
const Starfield = () => {
  const cvRef = useRef();

  useEffect(() => {
    const cv = cvRef.current;
    const ctx = cv.getContext('2d');
    let raf;

    const resize = () => { cv.width = window.innerWidth; cv.height = window.innerHeight; };
    resize();
    window.addEventListener('resize', resize);

    // Build stars once
    const stars = Array.from({ length: 220 }, () => ({
      x: Math.random() * window.innerWidth,
      y: Math.random() * window.innerHeight,
      r: Math.random() * 1.4 + 0.3,
      a: Math.random(),
      speed: Math.random() * 0.004 + 0.001,
    }));

    let t = 0;
    const draw = () => {
      ctx.clearRect(0, 0, cv.width, cv.height);
      t += 0.012;
      stars.forEach(s => {
        const alpha = (Math.sin(t * s.speed * 40 + s.a * 10) + 1) / 2;
        ctx.beginPath();
        ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(200,210,255,${alpha * 0.75})`;
        ctx.fill();
      });
      raf = requestAnimationFrame(draw);
    };
    draw();
    return () => { cancelAnimationFrame(raf); window.removeEventListener('resize', resize); };
  }, []);

  return (
    <canvas
      ref={cvRef}
      className="absolute inset-0 w-full h-full pointer-events-none"
      style={{ zIndex: 0 }}
    />
  );
};

/* ─────────────────────────────────────────────────────────────
   HOME PAGE
───────────────────────────────────────────────────────────── */
const Home = () => {
  const { books, loading, categories } = useBooks();
  const navigate = useNavigate();
  const [pageLoading, setPageLoading] = useState(true);

  const featuredBooks = [...books].sort((a, b) => b.rating - a.rating).slice(0, 3);

  /* Testimonials */
  const testimonials = [
    {
      id: 1,
      name: 'Sophia Martinez',
      role: 'Lead Software Architect',
      quote: 'The Tech & AI selection here is unmatched. Finding Deep Learning guides structured this professionally has accelerated our engineering research significantly.',
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=150',
      rating: 5,
    },
    {
      id: 2,
      name: 'Ethan Thorne',
      role: 'Sci-Fi Novelist',
      quote: 'Browsing through the space opera collection feels like reading a curated art catalog. The interface is stunning and the checkout takes less than ten seconds.',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=150',
      rating: 5,
    },
    {
      id: 3,
      name: 'Liam Vance',
      role: 'Business Consultant',
      quote: 'The Business and Market Strategy books list here is highly refined, offering top-tier insights without sorting through filler catalog items.',
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=150',
      rating: 5,
    },
  ];
  const [activeTestimonial, setActiveTestimonial] = useState(0);

  const [newsletterEmail, setNewsletterEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);
  const handleSubscribe = (e) => {
    e.preventDefault();
    if (newsletterEmail.trim()) {
      setSubscribed(true);
      setNewsletterEmail('');
      setTimeout(() => setSubscribed(false), 5000);
    }
  };

  if (pageLoading) return <PageLoader onComplete={() => setPageLoading(false)} />;
  if (loading)     return <Loader message="Loading BookStore…" />;

  return (
    <div className="relative min-h-screen bg-[#050714] text-white overflow-x-hidden font-sans">

      {/* ══════════════════════════════════════════════════════
          HERO SECTION  — matches screenshot layout exactly
         ══════════════════════════════════════════════════════ */}
      <section
        id="hero"
        className="relative min-h-screen flex flex-col overflow-hidden"
        style={{ background: 'radial-gradient(ellipse 80% 60% at 60% 40%, #0d1540 0%, #050714 70%)' }}
      >
        {/* Animated starfield */}
        <Starfield />

        {/* Blurred bookshelf backdrop */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            backgroundImage: "url('https://images.unsplash.com/photo-1507842217343-583bb7270b66?q=80&w=1800')",
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            opacity: 0.07,
            filter: 'blur(8px)',
            zIndex: 0,
          }}
        />

        {/* Ambient glow blobs */}
        <div className="absolute inset-0 pointer-events-none" style={{ zIndex: 1 }}>
          <div className="absolute top-1/4 left-1/4 w-[520px] h-[520px] rounded-full"
            style={{ background: 'radial-gradient(circle, rgba(79,70,229,0.18) 0%, transparent 70%)', filter: 'blur(60px)' }} />
          <div className="absolute top-1/3 right-1/4 w-[420px] h-[420px] rounded-full"
            style={{ background: 'radial-gradient(circle, rgba(139,92,246,0.14) 0%, transparent 70%)', filter: 'blur(50px)' }} />
          <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[600px] h-[200px] rounded-full"
            style={{ background: 'radial-gradient(circle, rgba(0,229,255,0.08) 0%, transparent 70%)', filter: 'blur(40px)' }} />
        </div>

        {/* ── MAIN HERO CONTENT ── */}
        <div
          className="relative flex-1 flex items-center"
          style={{ zIndex: 10, paddingTop: '88px' }}
        >
          <div className="w-full max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-0 items-center min-h-[calc(100vh-88px)]">

            {/* ── LEFT COLUMN ── */}
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.9, ease: 'easeOut' }}
              className="flex flex-col gap-6 py-16 lg:py-0"
            >
              {/* Welcome tag */}
              <motion.p
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2, duration: 0.6 }}
                className="text-indigo-400 text-xs font-bold tracking-[0.22em] uppercase"
              >
                WELCOME TO BOOKSTORE
              </motion.p>

              {/* Main heading — zero-gravity floating words */}
              <motion.h1
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3, duration: 0.6 }}
                className="font-extrabold leading-[1.12] tracking-tight"
                style={{ fontSize: 'clamp(2.3rem, 4.4vw, 3.55rem)', fontFamily: "'Outfit', 'Inter', sans-serif", lineHeight: 1.12 }}
              >
                <span style={{ display: 'block' }}>
                  <FloatingWord word="Discover" delay={0.0} phase={0.0} amplitude={7} />
                  <FloatingWord word="Endless"  delay={0.2} phase={1.3} amplitude={5} />
                </span>
                <span style={{ display: 'block' }}>
                  <FloatingWord word="Stories"  delay={0.4} phase={0.8} amplitude={6} />
                  <FloatingWord word="Through"  delay={0.6} phase={2.0} amplitude={8} />
                </span>
                <span style={{ display: 'block' }}>
                  <FloatingWord
                    word="Books"
                    delay={0.8}
                    phase={1.5}
                    amplitude={10}
                    gradient="linear-gradient(135deg, #818cf8 0%, #c084fc 50%, #e879f9 100%)"
                  />
                </span>
              </motion.h1>

              {/* Description */}
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5, duration: 0.7 }}
                className="text-gray-400 text-sm leading-relaxed max-w-[420px]"
              >
                Explore thousands of books across every genre. Find your next adventure,
                learn something new, and dive into endless imagination.
              </motion.p>

              {/* CTA Buttons — 3D Glassmorphism Tactile */}
              <motion.div
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.65, duration: 0.6 }}
                className="flex flex-wrap gap-4 items-center"
              >
                <GlassButton href="/books" variant="primary">
                  <span>Explore Books</span>
                  <ArrowRight size={15} />
                </GlassButton>

                <GlassButton
                  variant="outline"
                  onClick={() => document.getElementById('categories')?.scrollIntoView({ behavior: 'smooth' })}
                >
                  Browse Categories
                </GlassButton>
              </motion.div>

              {/* Stats row */}
              <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.85, duration: 0.7 }}
                className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-4"
              >
                <StatCard value="20K+" label="Books"      icon={BookOpen} />
                <StatCard value="10K+" label="Readers"    icon={Users}    />
                <StatCard value="500+" label="Authors"    icon={Shield}   />
                <StatCard value="50+"  label="Categories" icon={Grid}     />
              </motion.div>
            </motion.div>

            {/* ── RIGHT COLUMN — 3D Book Scene ── */}
            <motion.div
              initial={{ opacity: 0, scale: 0.88 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 1.1, ease: 'easeOut', delay: 0.2 }}
              className="relative flex items-center justify-center"
              style={{ height: '100%', minHeight: '560px' }}
            >
              {/* Glow halo behind the book */}
              <div
                className="absolute rounded-full pointer-events-none"
                style={{
                  width: '380px', height: '380px',
                  background: 'radial-gradient(circle, rgba(79,70,229,0.22) 0%, transparent 70%)',
                  filter: 'blur(40px)',
                  top: '50%', left: '50%',
                  transform: 'translate(-50%, -50%)',
                  zIndex: 0,
                }}
              />
              <div style={{ width: '100%', height: '560px', position: 'relative', zIndex: 5 }}>
                <Book3D />
              </div>
            </motion.div>

          </div>
        </div>

        {/* ── SCROLL DOWN INDICATOR ── */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.4, duration: 0.7 }}
          className="absolute bottom-7 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
          style={{ zIndex: 20 }}
        >
          {/* Mouse outline */}
          <div
            className="w-[18px] h-[30px] rounded-full border-2 border-white/30 flex justify-center"
            style={{ paddingTop: '5px' }}
          >
            <motion.div
              animate={{ y: [0, 7, 0], opacity: [1, 0.2, 1] }}
              transition={{ duration: 1.6, repeat: Infinity, ease: 'easeInOut' }}
              className="w-[3px] h-[5px] rounded-full bg-white/70"
            />
          </div>
          <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-white/40">
            Scroll Down
          </span>
        </motion.div>
      </section>

      {/* ══════════════════════════════════════════════════════
          FEATURED BOOKS
         ══════════════════════════════════════════════════════ */}
      <section
        id="featured-books"
        className="relative py-28 border-t border-white/5"
        style={{ background: 'linear-gradient(180deg, #070a1a 0%, #050714 100%)', zIndex: 10 }}
      >
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-14">
            <div>
              <div className="flex items-center gap-2 text-indigo-400 text-xs font-bold tracking-wider uppercase mb-3">
                <Award size={13} /> <span>Featured Masterpieces</span>
              </div>
              <h2 className="font-extrabold text-3xl md:text-4xl text-white" style={{ fontFamily: "'Outfit',sans-serif" }}>
                Critically Acclaimed Reads
              </h2>
            </div>
            <Link to="/books" className="group inline-flex items-center gap-1.5 text-sm font-bold text-indigo-400 hover:text-white transition-colors">
              Explore full catalog
              <ArrowRight size={15} className="group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {featuredBooks.map((book) => (
              <TiltCard key={book.id}><BookCard book={book} /></TiltCard>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════
          CATEGORIES
         ══════════════════════════════════════════════════════ */}
      <section id="categories" className="relative py-28" style={{ zIndex: 10 }}>
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center max-w-xl mx-auto mb-16">
            <div className="flex items-center justify-center gap-2 text-indigo-400 text-xs font-bold tracking-wider uppercase mb-3">
              <Zap size={13} /> <span>Explore by Category</span>
            </div>
            <h2 className="font-extrabold text-3xl md:text-4xl text-white mb-4" style={{ fontFamily: "'Outfit',sans-serif" }}>
              Uncover Books by Genre
            </h2>
            <p className="text-gray-400 text-sm leading-relaxed">
              From deep tech neural networks to thrilling historical mysteries.
            </p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-5">
            {categories.filter(c => c !== 'All').map((cat) => (
              <TiltCard key={cat}>
                <div
                  onClick={() => navigate(`/books?category=${cat}`)}
                  className="flex flex-col items-center justify-center p-7 rounded-2xl bg-white/4 border border-white/6 hover:border-indigo-500/30 hover:bg-indigo-950/20 text-center transition-all duration-300 group cursor-pointer h-full"
                >
                  <div className="w-11 h-11 rounded-xl bg-indigo-600/10 flex items-center justify-center border border-indigo-500/20 text-indigo-400 mb-5 group-hover:scale-110 group-hover:bg-indigo-600 group-hover:text-white transition-all duration-300">
                    <BookOpen size={19} />
                  </div>
                  <h3 className="font-bold text-sm text-gray-200 group-hover:text-white mb-1 transition-colors">{cat}</h3>
                  <span className="text-[10px] font-bold text-gray-500 group-hover:text-indigo-400 uppercase tracking-widest transition-colors">Browse</span>
                </div>
              </TiltCard>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════
          POPULAR AUTHORS
         ══════════════════════════════════════════════════════ */}
      <section
        id="authors"
        className="relative py-28 border-y border-white/5"
        style={{ background: 'linear-gradient(180deg, #07091a 0%, #050714 100%)', zIndex: 10 }}
      >
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center max-w-xl mx-auto mb-16">
            <p className="text-indigo-400 text-xs font-bold tracking-wider uppercase mb-3">Featured Creators</p>
            <h2 className="font-extrabold text-3xl md:text-4xl text-white mb-4" style={{ fontFamily: "'Outfit',sans-serif" }}>
              Visionaries Reshaping Literature
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            {[
              { name: 'Dr. Marcus Thorne', role: 'Technology & AI',   books: 5, img: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=150' },
              { name: 'Elena Vance',       role: 'Science Fiction',   books: 8, img: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&q=80&w=150' },
              { name: 'James Clearfield',  role: 'Self-Help',         books: 3, img: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&q=80&w=150' },
            ].map((a) => (
              <div key={a.name} className="flex flex-col items-center text-center p-8 rounded-3xl bg-white/4 border border-white/5 backdrop-blur-xl relative overflow-hidden group">
                <div className="absolute inset-0 bg-gradient-to-b from-indigo-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-500 pointer-events-none" />
                <img src={a.img} alt={a.name} className="w-24 h-24 rounded-full object-cover border-2 border-indigo-500 mb-5 group-hover:scale-105 transition-transform duration-500 shadow-[0_0_18px_rgba(79,70,229,0.35)]" />
                <h3 className="font-bold text-lg text-white mb-1">{a.name}</h3>
                <p className="text-xs font-semibold text-indigo-400 uppercase tracking-widest mb-4">{a.role}</p>
                <div className="px-4 py-1.5 rounded-full bg-white/5 text-[10px] text-gray-400 font-bold uppercase tracking-wider border border-white/5">
                  {a.books} published books
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════
          WHY CHOOSE US
         ══════════════════════════════════════════════════════ */}
      <section id="why-us" className="relative py-28" style={{ zIndex: 10 }}>
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div className="flex flex-col gap-6">
              <p className="text-indigo-400 text-xs font-bold tracking-wider uppercase">Our Brand Standard</p>
              <h2 className="font-extrabold text-3xl md:text-4xl text-white" style={{ fontFamily: "'Outfit',sans-serif" }}>
                Cinematic Reading Redefined
              </h2>
              <p className="text-gray-400 text-sm leading-relaxed">
                We bridge high-end 3D graphics, seamless user state cache systems, and custom database APIs to give you a library management experience like no other.
              </p>
              <ul className="flex flex-col gap-4 mt-2">
                {[
                  'Instant digital receipt generation and inventory level tracking.',
                  'Interactive 3D cover tilt shaders and page-flipping dynamic models.',
                  'Complete localized data persistence mapping across browser refreshes.',
                ].map((item) => (
                  <li key={item} className="flex items-start gap-3 text-gray-300 text-sm">
                    <CheckCircle size={17} className="text-indigo-500 mt-0.5 flex-shrink-0" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="grid grid-cols-2 gap-5">
              {[
                { icon: Zap,        title: 'Instant Sync',       desc: 'Local persistence APIs synchronize cart changes instantly to maintain stock counts.' },
                { icon: ShieldCheck,title: 'Secure COD',         desc: 'Authentic receipt triggers secure order states directly inside the database panel.' },
                { icon: Award,      title: 'Premium Curations',  desc: 'Only the highest-rated novels, deep tech, and finance books pass review checkpoints.' },
                { icon: BookOpen,   title: '3D Previewing',      desc: 'Explore WebGL procedurally rendered layouts before adding books to your cart.' },
              ].map(({ icon: Icon, title, desc }) => (
                <div key={title} className="p-7 rounded-2xl bg-white/4 border border-white/5 flex flex-col gap-3">
                  <div className="w-10 h-10 rounded-lg bg-indigo-500/10 flex items-center justify-center text-indigo-400">
                    <Icon size={19} />
                  </div>
                  <h3 className="font-bold text-white text-sm">{title}</h3>
                  <p className="text-gray-400 text-xs leading-relaxed">{desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════
          TESTIMONIALS
         ══════════════════════════════════════════════════════ */}
      <section
        className="relative py-28 border-t border-white/5"
        style={{ background: 'linear-gradient(180deg, #07091a 0%, #050714 100%)', zIndex: 10 }}
      >
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center max-w-xl mx-auto mb-16">
            <p className="text-indigo-400 text-xs font-bold tracking-wider uppercase mb-3">Reader Feedbacks</p>
            <h2 className="font-extrabold text-3xl md:text-4xl text-white" style={{ fontFamily: "'Outfit',sans-serif" }}>
              Endorsed by Top Professionals
            </h2>
          </div>
          <div className="max-w-2xl mx-auto relative" style={{ height: '320px' }}>
            {/* Arrows */}
            <button onClick={() => setActiveTestimonial(p => (p - 1 + testimonials.length) % testimonials.length)}
              className="absolute left-[-56px] top-1/2 -translate-y-1/2 z-30 w-11 h-11 rounded-full border border-white/10 bg-black/50 hover:bg-indigo-600 text-white flex items-center justify-center transition-all">
              <ArrowLeft size={15} />
            </button>
            <button onClick={() => setActiveTestimonial(p => (p + 1) % testimonials.length)}
              className="absolute right-[-56px] top-1/2 -translate-y-1/2 z-30 w-11 h-11 rounded-full border border-white/10 bg-black/50 hover:bg-indigo-600 text-white flex items-center justify-center transition-all">
              <ArrowRight size={15} />
            </button>
            {testimonials.map((t, i) => {
              const diff = (i - activeTestimonial + testimonials.length) % testimonials.length;
              const isActive = diff === 0;
              return (
                <div key={t.id} style={{
                  position: 'absolute', inset: 0,
                  transform: `perspective(900px) translate3d(0,${diff === 0 ? 0 : diff === 1 ? 18 : 36}px,${diff === 0 ? 20 : diff === 1 ? -15 : -40}px) rotateY(${diff === 0 ? -4 : diff === 1 ? 8 : 18}deg) scale(${diff === 0 ? 1 : diff === 1 ? 0.95 : 0.9})`,
                  opacity: diff === 0 ? 1 : diff === 1 ? 0.55 : 0.18,
                  zIndex: diff === 0 ? 20 : diff === 1 ? 10 : 5,
                  transition: 'all 0.6s cubic-bezier(0.25,1,0.5,1)',
                  pointerEvents: isActive ? 'auto' : 'none',
                }}>
                  <div className="h-full flex flex-col justify-between p-8 md:p-10 bg-white/4 border border-white/6 backdrop-blur-2xl rounded-3xl relative overflow-hidden">
                    <Quote className="absolute top-5 right-7 text-indigo-500/10" size={72} />
                    <p className="text-gray-200 text-sm leading-relaxed italic relative z-10">"{t.quote}"</p>
                    <div className="flex items-center gap-4 relative z-10">
                      <img src={t.avatar} alt={t.name} className="w-11 h-11 rounded-full object-cover border border-indigo-500" />
                      <div>
                        <h4 className="font-bold text-white text-sm">{t.name}</h4>
                        <p className="text-xs text-indigo-400">{t.role}</p>
                      </div>
                      <div className="ml-auto flex text-yellow-500">
                        {Array.from({ length: t.rating }).map((_, j) => <Star key={j} size={13} fill="currentColor" />)}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════
          NEWSLETTER
         ══════════════════════════════════════════════════════ */}
      <section id="newsletter" className="relative py-28" style={{ zIndex: 10 }}>
        <div className="max-w-3xl mx-auto px-6">
          <div className="p-12 md:p-16 rounded-[2.5rem] border border-indigo-500/20 backdrop-blur-2xl relative overflow-hidden"
            style={{ background: 'linear-gradient(135deg, rgba(30,27,90,0.5), rgba(15,7,40,0.7))' }}>
            <div className="absolute top-[-40px] right-[-40px] w-[180px] h-[180px] rounded-full"
              style={{ background: 'radial-gradient(circle, rgba(99,102,241,0.18) 0%, transparent 70%)', filter: 'blur(30px)', pointerEvents: 'none' }} />
            <div className="text-center max-w-lg mx-auto flex flex-col gap-5 items-center relative z-10">
              <div className="w-12 h-12 rounded-2xl bg-indigo-600/15 flex items-center justify-center border border-indigo-500/25 text-indigo-400">
                <Send size={21} />
              </div>
              <h2 className="font-extrabold text-3xl md:text-4xl text-white" style={{ fontFamily: "'Outfit',sans-serif" }}>
                Unlock Exquisite Releases
              </h2>
              <p className="text-gray-400 text-sm leading-relaxed">
                Join our newsletter to receive announcements of newly published tech books, sci-fi sequels, and store coupons.
              </p>
              {subscribed ? (
                <div className="px-6 py-3 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-sm font-semibold">
                  ✓ Subscribed successfully!
                </div>
              ) : (
                <form onSubmit={handleSubscribe} className="w-full flex flex-col sm:flex-row gap-3">
                  <input
                    type="email"
                    placeholder="Enter your email address…"
                    value={newsletterEmail}
                    onChange={e => setNewsletterEmail(e.target.value)}
                    className="flex-grow bg-black/50 border border-white/8 rounded-full px-6 py-3.5 text-sm text-white focus:outline-none focus:border-indigo-500 placeholder-gray-500"
                    required
                  />
                  <button type="submit"
                    className="bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-sm px-7 py-3.5 rounded-full transition-all whitespace-nowrap"
                    style={{ boxShadow: '0 0 20px rgba(79,70,229,0.35)' }}>
                    Subscribe
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </section>

    </div>
  );
};

export default Home;
