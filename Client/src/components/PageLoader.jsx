import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { BookOpen } from 'lucide-react';
import gsap from 'gsap';

const PageLoader = ({ onComplete }) => {
  const [progress, setProgress] = useState(0);
  const [isDone, setIsDone] = useState(false);

  useEffect(() => {
    // Simulate loading progress
    const timer = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(timer);
          setTimeout(() => {
            setIsDone(true);
            if (onComplete) onComplete();
          }, 600);
          return 100;
        }
        // Random step increments for realistic loading
        const next = prev + Math.floor(Math.random() * 12) + 2;
        return Math.min(100, next);
      });
    }, 80);

    return () => clearInterval(timer);
  }, [onComplete]);

  return (
    <AnimatePresence>
      {!isDone && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ 
            y: '-100%',
            opacity: 0,
            transition: { duration: 0.8, ease: [0.76, 0, 0.24, 1] } 
          }}
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: '#0a0a0a',
            zIndex: 9999,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '24px',
            overflow: 'hidden'
          }}
        >
          {/* Neon Glow Effects */}
          <div style={{
            position: 'absolute',
            width: '400px',
            height: '400px',
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(79, 70, 229, 0.15) 0%, transparent 60%)',
            filter: 'blur(50px)',
            top: '30%',
            left: '30%',
            zIndex: -1
          }} />
          <div style={{
            position: 'absolute',
            width: '300px',
            height: '300px',
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(139, 92, 246, 0.15) 0%, transparent 60%)',
            filter: 'blur(50px)',
            bottom: '20%',
            right: '20%',
            zIndex: -1
          }} />

          {/* Book Animation */}
          <motion.div
            animate={{ 
              scale: [1, 1.1, 1],
              rotateY: [0, 180, 360]
            }}
            transition={{ 
              duration: 2.5,
              repeat: Infinity,
              ease: "easeInOut"
            }}
            style={{
              color: 'var(--accent)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              filter: 'drop-shadow(0 0 15px rgba(79, 70, 229, 0.6))'
            }}
          >
            <BookOpen size={64} />
          </motion.div>

          {/* Title */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            style={{ textAlign: 'center' }}
          >
            <h2 style={{
              fontFamily: 'var(--font-display)',
              fontSize: '1.5rem',
              fontWeight: 800,
              letterSpacing: '0.1em',
              textTransform: 'uppercase',
              background: 'linear-gradient(135deg, #ffffff 40%, #a5b4fc 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              marginBottom: '8px'
            }}>
              BookStore Systems
            </h2>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.8rem', letterSpacing: '0.05em' }}>
              PREPARING IMMERSIVE EXPERIENCE
            </p>
          </motion.div>

          {/* Percentage Counter */}
          <div style={{
            fontFamily: 'var(--font-display)',
            fontSize: '5rem',
            fontWeight: 800,
            color: 'var(--text-primary)',
            position: 'relative',
            height: '7.5rem',
            overflow: 'hidden',
            display: 'flex',
            alignItems: 'center'
          }}>
            <span style={{
              background: 'linear-gradient(180deg, #ffffff 30%, rgba(255, 255, 255, 0.1) 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              textShadow: '0 0 30px rgba(255, 255, 255, 0.1)'
            }}>
              {progress}%
            </span>
          </div>

          {/* Loading bar container */}
          <div style={{
            width: '240px',
            height: '4px',
            backgroundColor: 'rgba(255, 255, 255, 0.05)',
            borderRadius: 'var(--radius-full)',
            position: 'relative',
            overflow: 'hidden'
          }}>
            {/* Filling bar */}
            <motion.div
              style={{
                height: '100%',
                backgroundColor: 'var(--accent)',
                width: `${progress}%`,
                boxShadow: '0 0 10px var(--accent)'
              }}
              transition={{ ease: 'easeOut' }}
            />
          </div>

        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default PageLoader;
