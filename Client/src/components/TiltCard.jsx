import React, { useRef } from 'react';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';

const TiltCard = ({ children, className = '', style = {} }) => {
  const cardRef = useRef(null);

  // Motion values for coordinates
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  // Physics springs for damping
  const rotateX = useSpring(useTransform(y, [-0.5, 0.5], [15, -15]), {
    damping: 25,
    stiffness: 200
  });
  const rotateY = useSpring(useTransform(x, [-0.5, 0.5], [-15, 15]), {
    damping: 25,
    stiffness: 200
  });

  // Scale and lighting glares
  const scale = useSpring(1, { damping: 15, stiffness: 200 });
  const opacity = useSpring(0, { damping: 15, stiffness: 200 });
  const glowX = useSpring(0, { damping: 15, stiffness: 200 });
  const glowY = useSpring(0, { damping: 15, stiffness: 200 });

  const handleMouseMove = (e) => {
    if (!cardRef.current) return;
    
    const rect = cardRef.current.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;
    
    // Normalized position relative to center of card (-0.5 to 0.5)
    const mouseX = (e.clientX - rect.left) / width - 0.5;
    const mouseY = (e.clientY - rect.top) / height - 0.5;

    x.set(mouseX);
    y.set(mouseY);

    // Glow position (in percentage)
    glowX.set(((e.clientX - rect.left) / width) * 100);
    glowY.set(((e.clientY - rect.top) / height) * 100);
  };

  const handleMouseEnter = () => {
    scale.set(1.03);
    opacity.set(0.65);
  };

  const handleMouseLeave = () => {
    scale.set(1);
    opacity.set(0);
    x.set(0);
    y.set(0);
  };

  // Convert glow position to css properties
  const background = useTransform(
    [glowX, glowY, opacity],
    ([gx, gy, op]) => `radial-gradient(circle at ${gx}% ${gy}%, rgba(255, 255, 255, 0.15) 0%, transparent 80%), radial-gradient(circle at ${gx}% ${gy}%, rgba(79, 70, 229, 0.1) 0%, transparent 50%)`
  );

  return (
    <motion.div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      style={{
        ...style,
        transformStyle: 'preserve-3d',
        rotateX,
        rotateY,
        scale,
        position: 'relative'
      }}
      className={`relative cursor-pointer transition-shadow duration-300 ${className}`}
    >
      {/* 3D Child container */}
      <div style={{ transform: 'translateZ(20px)', transformStyle: 'preserve-3d', height: '100%' }}>
        {children}
      </div>

      {/* Dynamic Cursor Flare Hover Overlay */}
      <motion.div
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          borderRadius: 'inherit',
          pointerEvents: 'none',
          zIndex: 3,
          background,
          opacity
        }}
      />
    </motion.div>
  );
};

export default TiltCard;
