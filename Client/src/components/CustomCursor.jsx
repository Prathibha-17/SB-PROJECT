import React, { useEffect, useRef, useState } from 'react';

/**
 * CustomCursor
 * – Inner neon dot that snaps to exact mouse position
 * – Outer glow ring that lerps behind (magnetic drag effect)
 * – Changes shape on hover over clickable elements
 */
const CustomCursor = () => {
  const dotRef   = useRef(null);
  const ringRef  = useRef(null);
  const labelRef = useRef(null);

  const mouse  = useRef({ x: -200, y: -200 });
  const ring   = useRef({ x: -200, y: -200 });
  const raf    = useRef(null);
  const isHover = useRef(false);

  useEffect(() => {
    const onMove = (e) => {
      mouse.current.x = e.clientX;
      mouse.current.y = e.clientY;
    };

    const onEnter = (e) => {
      if (e.target.closest('a,button,[data-cursor]')) {
        isHover.current = true;
        if (ringRef.current)  ringRef.current.style.transform  = `translate(-50%,-50%) scale(2.2)`;
        if (ringRef.current)  ringRef.current.style.borderColor = 'rgba(192,132,252,0.9)';
        if (ringRef.current)  ringRef.current.style.background  = 'rgba(139,92,246,0.08)';
      }
    };
    const onLeave = (e) => {
      if (e.target.closest('a,button,[data-cursor]')) {
        isHover.current = false;
        if (ringRef.current)  ringRef.current.style.transform  = `translate(-50%,-50%) scale(1)`;
        if (ringRef.current)  ringRef.current.style.borderColor = 'rgba(99,102,241,0.7)';
        if (ringRef.current)  ringRef.current.style.background  = 'transparent';
      }
    };
    const onClick = () => {
      if (dotRef.current) {
        dotRef.current.style.transform = 'translate(-50%,-50%) scale(2.5)';
        setTimeout(() => {
          if (dotRef.current) dotRef.current.style.transform = 'translate(-50%,-50%) scale(1)';
        }, 200);
      }
    };

    document.addEventListener('mousemove', onMove);
    document.addEventListener('mouseover', onEnter);
    document.addEventListener('mouseout',  onLeave);
    document.addEventListener('click',     onClick);

    const loop = () => {
      // lerp ring toward mouse
      ring.current.x += (mouse.current.x - ring.current.x) * 0.12;
      ring.current.y += (mouse.current.y - ring.current.y) * 0.12;

      if (dotRef.current) {
        dotRef.current.style.left = `${mouse.current.x}px`;
        dotRef.current.style.top  = `${mouse.current.y}px`;
      }
      if (ringRef.current) {
        ringRef.current.style.left = `${ring.current.x}px`;
        ringRef.current.style.top  = `${ring.current.y}px`;
      }

      raf.current = requestAnimationFrame(loop);
    };
    raf.current = requestAnimationFrame(loop);

    // Hide default cursor globally
    document.documentElement.style.cursor = 'none';

    return () => {
      document.removeEventListener('mousemove', onMove);
      document.removeEventListener('mouseover', onEnter);
      document.removeEventListener('mouseout',  onLeave);
      document.removeEventListener('click',     onClick);
      cancelAnimationFrame(raf.current);
      document.documentElement.style.cursor = '';
    };
  }, []);

  return (
    <>
      {/* ── OUTER GLOW RING ── */}
      <div
        ref={ringRef}
        style={{
          position: 'fixed',
          left: '-200px',
          top: '-200px',
          width: '42px',
          height: '42px',
          borderRadius: '50%',
          border: '1.5px solid rgba(99,102,241,0.7)',
          background: 'transparent',
          transform: 'translate(-50%,-50%) scale(1)',
          transition: 'transform 0.25s cubic-bezier(0.34,1.56,0.64,1), border-color 0.25s, background 0.25s',
          pointerEvents: 'none',
          zIndex: 99999,
          boxShadow: '0 0 14px rgba(99,102,241,0.35), 0 0 28px rgba(139,92,246,0.18)',
          mixBlendMode: 'normal',
        }}
      />

      {/* ── INNER NEON DOT ── */}
      <div
        ref={dotRef}
        style={{
          position: 'fixed',
          left: '-200px',
          top: '-200px',
          width: '7px',
          height: '7px',
          borderRadius: '50%',
          background: 'linear-gradient(135deg, #818cf8, #c084fc)',
          transform: 'translate(-50%,-50%) scale(1)',
          transition: 'transform 0.18s cubic-bezier(0.34,1.56,0.64,1)',
          pointerEvents: 'none',
          zIndex: 100000,
          boxShadow: '0 0 10px #818cf8, 0 0 20px #c084fc',
        }}
      />
    </>
  );
};

export default CustomCursor;
