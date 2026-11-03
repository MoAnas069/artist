import { useEffect, useState, useRef, ReactNode } from 'react';
import { motion, useScroll, useSpring } from 'framer-motion';
import { usePrefersReducedMotion } from '../../hooks/useMediaQuery';

/* ─── ScrollReveal ─────────────────────────────────────────── */
interface ScrollRevealProps {
  children: ReactNode;
  delay?: number;
  direction?: 'up' | 'down' | 'left' | 'right' | 'none';
  duration?: number;
  className?: string;
  style?: React.CSSProperties;
}

export function ScrollReveal({
  children,
  delay = 0,
  direction = 'up',
  duration = 0.6,
  className = '',
  style = {},
}: ScrollRevealProps) {
  const prefersReduced = usePrefersReducedMotion();

  if (prefersReduced) {
    return (
      <div className={className} style={style}>
        {children}
      </div>
    );
  }

  const getInitialPosition = () => {
    switch (direction) {
      case 'up':
        return { y: 24, opacity: 0 };
      case 'down':
        return { y: -24, opacity: 0 };
      case 'left':
        return { x: 28, opacity: 0 };
      case 'right':
        return { x: -28, opacity: 0 };
      case 'none':
        return { opacity: 0 };
      default:
        return { y: 24, opacity: 0 };
    }
  };

  return (
    <motion.div
      initial={getInitialPosition()}
      whileInView={{ x: 0, y: 0, opacity: 1 }}
      viewport={{ once: true, margin: '-50px' }}
      transition={{
        duration,
        delay,
        ease: [0.16, 1, 0.3, 1], // ease-out-expo
      }}
      className={className}
      style={style}
    >
      {children}
    </motion.div>
  );
}

/* ─── MaskReveal (Sophisticated image clip transition) ──────── */
interface MaskRevealProps {
  children: ReactNode;
  delay?: number;
  duration?: number;
  direction?: 'up' | 'left';
  className?: string;
  style?: React.CSSProperties;
}

export function MaskReveal({
  children,
  delay = 0,
  duration = 0.8,
  direction = 'up',
  className = '',
  style = {},
}: MaskRevealProps) {
  const prefersReduced = usePrefersReducedMotion();

  if (prefersReduced) {
    return (
      <div className={className} style={style}>
        {children}
      </div>
    );
  }

  const initialClip =
    direction === 'up'
      ? 'inset(100% 0% 0% 0%)'
      : 'inset(0% 100% 0% 0%)';

  return (
    <motion.div
      initial={{ clipPath: initialClip, opacity: 0.9 }}
      whileInView={{ clipPath: 'inset(0% 0% 0% 0%)', opacity: 1 }}
      viewport={{ once: true, margin: '-40px' }}
      transition={{
        duration,
        delay,
        ease: [0.16, 1, 0.3, 1],
      }}
      className={className}
      style={{ overflow: 'hidden', ...style }}
    >
      {children}
    </motion.div>
  );
}

/* ─── ReadingProgress (Minimal top indicator for articles) ─── */
export function ReadingProgress() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 120,
    damping: 24,
    restDelta: 0.001,
  });

  return (
    <motion.div
      style={{
        scaleX,
        transformOrigin: '0%',
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        height: '2px',
        backgroundColor: 'var(--color-charcoal)',
        zIndex: 1000,
      }}
      aria-hidden="true"
    />
  );
}

/* ─── CustomCursor (Minimal desktop editorial pointer) ──────── */
export function CustomCursor() {
  const [position, setPosition] = useState({ x: -100, y: -100 });
  const [hovered, setHovered] = useState(false);
  const [hoverText, setHoverText] = useState('');
  const [isVisible, setIsVisible] = useState(false);
  const prefersReduced = usePrefersReducedMotion();
  const cursorRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Only enable on non-touch devices with fine pointers
    if (typeof window === 'undefined' || prefersReduced) return;
    const isTouch = window.matchMedia('(pointer: coarse)').matches;
    if (isTouch) return;

    const onMouseMove = (e: MouseEvent) => {
      setPosition({ x: e.clientX, y: e.clientY });
      if (!isVisible) setIsVisible(true);

      // Check if hovering over an element with data-cursor or link/button
      const target = e.target as HTMLElement | null;
      if (!target) return;

      const cursorTarget = target.closest('[data-cursor]') as HTMLElement | null;
      if (cursorTarget) {
        setHovered(true);
        setHoverText(cursorTarget.getAttribute('data-cursor') || '');
        return;
      }

      const isInteractive = target.closest('a, button, input, textarea, [role="button"]');
      if (isInteractive) {
        setHovered(true);
        setHoverText('');
      } else {
        setHovered(false);
        setHoverText('');
      }
    };

    const onMouseLeave = () => setIsVisible(false);
    const onMouseEnter = () => setIsVisible(true);

    window.addEventListener('mousemove', onMouseMove, { passive: true });
    document.addEventListener('mouseleave', onMouseLeave);
    document.addEventListener('mouseenter', onMouseEnter);

    return () => {
      window.removeEventListener('mousemove', onMouseMove);
      document.removeEventListener('mouseleave', onMouseLeave);
      document.removeEventListener('mouseenter', onMouseEnter);
    };
  }, [isVisible, prefersReduced]);

  if (prefersReduced || !isVisible) return null;

  return (
    <div
      ref={cursorRef}
      style={{
        position: 'fixed',
        left: 0,
        top: 0,
        pointerEvents: 'none',
        zIndex: 9999,
        transform: `translate3d(${position.x}px, ${position.y}px, 0)`,
        transition: 'transform 0.08s cubic-bezier(0.16, 1, 0.3, 1)',
      }}
      aria-hidden="true"
    >
      <div
        style={{
          position: 'relative',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          width: hovered ? (hoverText ? 52 : 32) : 8,
          height: hovered ? (hoverText ? 52 : 32) : 8,
          transform: 'translate(-50%, -50%)',
          borderRadius: '50%',
          backgroundColor: hoverText
            ? 'var(--color-charcoal)'
            : hovered
            ? 'rgba(26, 26, 26, 0.12)'
            : 'var(--color-charcoal)',
          border: hovered && !hoverText ? '1px solid var(--color-charcoal)' : 'none',
          color: 'var(--color-bg)',
          fontSize: '0.5625rem',
          fontFamily: 'var(--font-mono)',
          letterSpacing: '0.12em',
          textTransform: 'uppercase',
          fontWeight: 600,
          transition: 'width 0.25s cubic-bezier(0.16, 1, 0.3, 1), height 0.25s cubic-bezier(0.16, 1, 0.3, 1), background-color 0.2s ease',
          boxShadow: hoverText ? '0 4px 16px rgba(0,0,0,0.15)' : 'none',
        }}
      >
        {hoverText && hoverText}
      </div>
    </div>
  );
}
