import { useState, useEffect, useCallback } from 'react';
import { useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { usePrefersReducedMotion } from '../../hooks/useMediaQuery';

interface CursorState {
  x: number;
  y: number;
  label: string;
  isHovering: boolean;
  isHidden: boolean;
}

export default function CustomCursor() {
  const location = useLocation();
  const prefersReducedMotion = usePrefersReducedMotion();
  const [cursor, setCursor] = useState<CursorState>({
    x: typeof window !== 'undefined' ? window.innerWidth / 2 : 500,
    y: typeof window !== 'undefined' ? window.innerHeight / 2 : 400,
    label: '',
    isHovering: false,
    isHidden: false,
  });
  const [isTouchDevice, setIsTouchDevice] = useState(false);

  useEffect(() => {
    setIsTouchDevice('ontouchstart' in window || navigator.maxTouchPoints > 0);
  }, []);

  const handleMouseMove = useCallback((e: MouseEvent) => {
    setCursor((prev) => ({ ...prev, x: e.clientX, y: e.clientY }));
  }, []);

  const handleMouseOver = useCallback((e: MouseEvent) => {
    const target = e.target as HTMLElement;
    const cursorEl = target.closest('[data-cursor]') as HTMLElement | null;
    const interactiveEl = target.closest('a, button, [role="button"], input, textarea, select') as HTMLElement | null;

    if (cursorEl) {
      const label = cursorEl.getAttribute('data-cursor') || '';
      setCursor((prev) => ({ ...prev, label, isHovering: true }));
    } else if (interactiveEl) {
      setCursor((prev) => ({ ...prev, label: '', isHovering: true }));
    }
  }, []);

  const handleMouseOut = useCallback((e: MouseEvent) => {
    const target = e.target as HTMLElement;
    if (target.closest('[data-cursor]') || target.closest('a, button, [role="button"], input, textarea, select')) {
      setCursor((prev) => ({ ...prev, label: '', isHovering: false }));
    }
  }, []);

  const handleMouseLeave = useCallback(() => {
    setCursor((prev) => ({ ...prev, isHidden: true }));
  }, []);

  const handleMouseEnter = useCallback(() => {
    setCursor((prev) => ({ ...prev, isHidden: false }));
  }, []);

  useEffect(() => {
    if (isTouchDevice || prefersReducedMotion) return;

    document.addEventListener('mousemove', handleMouseMove, { passive: true });
    document.addEventListener('mouseover', handleMouseOver, { passive: true });
    document.addEventListener('mouseout', handleMouseOut, { passive: true });
    document.documentElement.addEventListener('mouseleave', handleMouseLeave);
    document.documentElement.addEventListener('mouseenter', handleMouseEnter);

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseover', handleMouseOver);
      document.removeEventListener('mouseout', handleMouseOut);
      document.documentElement.removeEventListener('mouseleave', handleMouseLeave);
      document.documentElement.removeEventListener('mouseenter', handleMouseEnter);
    };
  }, [isTouchDevice, prefersReducedMotion, handleMouseMove, handleMouseOver, handleMouseOut, handleMouseLeave, handleMouseEnter]);

  // Home has its dedicated fullscreen x-ray reticle system
  if (isTouchDevice || prefersReducedMotion || location.pathname === '/') return null;

  const targetRadius = cursor.isHovering ? (cursor.label ? 44 : 26) : 10;

  return (
    <>
      <style>{`
        * { cursor: none !important; }
      `}</style>

      {/* Main Reticle Ring */}
      <motion.div
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          pointerEvents: 'none',
          zIndex: 99999,
          borderRadius: '50%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
        animate={{
          x: cursor.x - targetRadius,
          y: cursor.y - targetRadius,
          width: targetRadius * 2,
          height: targetRadius * 2,
          opacity: cursor.isHidden ? 0 : 1,
          border: cursor.isHovering
            ? '1.5px solid rgba(26, 26, 26, 0.85)'
            : '1.2px solid rgba(26, 26, 26, 0.65)',
          backgroundColor: cursor.isHovering
            ? 'rgba(255, 255, 255, 0.28)'
            : 'rgba(255, 255, 255, 0.05)',
          backdropFilter: cursor.isHovering ? 'blur(4px)' : 'blur(0px)',
          boxShadow: cursor.isHovering
            ? '0 0 20px rgba(0, 0, 0, 0.12)'
            : '0 0 6px rgba(0, 0, 0, 0.06)',
        }}
        transition={{
          type: 'spring',
          stiffness: 450,
          damping: 32,
          mass: 0.4,
        }}
      >
        {/* Center Precision Dot */}
        <div
          style={{
            width: 4,
            height: 4,
            borderRadius: '50%',
            backgroundColor: 'var(--color-charcoal, #1a1a1a)',
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
          }}
        />

        {/* Label badge */}
        <AnimatePresence>
          {cursor.label && (
            <motion.div
              initial={{ opacity: 0, y: 8, scale: 0.85 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 6, scale: 0.85 }}
              transition={{ duration: 0.18 }}
              style={{
                position: 'absolute',
                bottom: -22,
                left: '50%',
                transform: 'translateX(-50%)',
                whiteSpace: 'nowrap',
                fontSize: '0.625rem',
                fontFamily: 'var(--font-mono, monospace)',
                fontWeight: 600,
                letterSpacing: '0.14em',
                color: '#ffffff',
                backgroundColor: 'rgba(20, 20, 22, 0.88)',
                padding: '2px 8px',
                borderRadius: 999,
                border: '1px solid rgba(255, 255, 255, 0.15)',
                textTransform: 'uppercase',
                boxShadow: '0 2px 8px rgba(0, 0, 0, 0.2)',
              }}
            >
              {cursor.label}
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </>
  );
}
