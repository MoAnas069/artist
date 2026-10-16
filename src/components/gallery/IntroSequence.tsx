import { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useGallery } from '../../hooks/useGallery';

/**
 * IntroSequence — Art Gallery Grand Entrance
 *
 * Designed like entering a prestigious contemporary art gallery:
 * - Center-staged CHINTWO logo & emblem
 * - Curatorial exhibition subtitle
 * - Refined, prominent "CLICK TO ENTER" button
 * - Elegant doorway opening transition when entered
 */
export default function IntroSequence() {
  const { state, setPhase, completeIntro } = useGallery();
  const [entering, setEntering] = useState(false);

  const handleEnter = useCallback(() => {
    if (entering) return;
    setEntering(true);
    setPhase('intro-reveal');
    // Animate doors opening / camera stepping inside
    setTimeout(() => {
      completeIntro();
    }, 1200);
  }, [entering, setPhase, completeIntro]);

  if (state.phase !== 'intro' && state.phase !== 'intro-reveal' && !entering) {
    return null;
  }

  return (
    <AnimatePresence>
      {!state.introComplete && (
        <motion.div
          key="gallery-entrance"
          initial={{ opacity: 1 }}
          animate={{
            opacity: entering ? 0 : 1,
            scale: entering ? 1.08 : 1,
          }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 1000,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: '#0A0A0C',
            backgroundImage:
              'radial-gradient(circle at 50% 42%, rgba(255, 255, 255, 0.08) 0%, rgba(10, 10, 12, 0.98) 75%)',
            overflow: 'hidden',
            padding: '2rem',
          }}
        >
          {/* Subtle architectural door frame lines */}
          <div
            style={{
              position: 'absolute',
              top: '10%',
              bottom: '10%',
              left: '12%',
              right: '12%',
              border: '1px solid rgba(255, 255, 255, 0.06)',
              borderBottom: 'none',
              borderRadius: '2px 2px 0 0',
              pointerEvents: 'none',
            }}
          />

          {/* Plain white gallery light beneath threshold */}
          <div
            style={{
              position: 'absolute',
              bottom: 0,
              left: '50%',
              transform: 'translateX(-50%)',
              width: 'min(440px, 80vw)',
              height: '32%',
              background:
                'linear-gradient(to top, rgba(255, 255, 255, 0.15) 0%, rgba(255, 255, 255, 0.03) 60%, transparent 100%)',
              clipPath: 'polygon(20% 100%, 80% 100%, 65% 0%, 35% 0%)',
              pointerEvents: 'none',
              filter: 'blur(10px)',
            }}
          />

          {/* Central Museum Brand Plaque */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              textAlign: 'center',
              zIndex: 2,
              maxWidth: '90vw',
            }}
          >
            {/* Emblem */}
            <motion.img
              src="/chintwo-emblem-light.svg"
              alt=""
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.9, delay: 0.1 }}
              style={{
                width: 'clamp(54px, 8vw, 84px)',
                height: 'auto',
                marginBottom: '1.25rem',
                filter: 'drop-shadow(0 4px 20px rgba(255, 255, 255, 0.15))',
              }}
            />

            {/* Wordmark */}
            <motion.img
              src="/chintwo-text-light.svg"
              alt="CHINTWO"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.9, delay: 0.2 }}
              style={{
                width: 'clamp(260px, 45vw, 480px)',
                maxWidth: '85vw',
                height: 'auto',
                filter: 'drop-shadow(0 0 35px rgba(255, 255, 255, 0.12))',
              }}
            />

            {/* Subtitle */}
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.65 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              style={{
                marginTop: '1.25rem',
                fontFamily: 'var(--font-mono)',
                fontSize: 'clamp(0.6rem, 1.1vw, 0.72rem)',
                letterSpacing: '0.28em',
                textTransform: 'uppercase',
                color: '#E8E2DA',
              }}
            >
              Art Gallery & Studio Archive
            </motion.p>

            {/* Standardized Plain White "Click to Enter" Button */}
            <motion.button
              onClick={handleEnter}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.55 }}
              whileHover={{
                scale: 1.03,
                backgroundColor: '#F5F5F7',
                boxShadow: '0 6px 30px rgba(255, 255, 255, 0.35), 0 4px 14px rgba(0, 0, 0, 0.5)',
              }}
              whileTap={{ scale: 0.97 }}
              aria-label="Click to enter the art gallery"
              style={{
                marginTop: '2.5rem',
                minHeight: '48px',
                padding: '0.85rem 2.8rem',
                backgroundColor: '#FFFFFF',
                color: '#111013',
                border: '1px solid rgba(255, 255, 255, 0.9)',
                borderRadius: '4px',
                fontFamily: 'var(--font-body)',
                fontSize: 'clamp(0.72rem, 1.2vw, 0.82rem)',
                fontWeight: 600,
                letterSpacing: '0.22em',
                textTransform: 'uppercase',
                cursor: 'pointer',
                boxShadow:
                  '0 4px 20px rgba(255, 255, 255, 0.18), 0 2px 8px rgba(0, 0, 0, 0.4)',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.85rem',
                transition: 'all 0.25s cubic-bezier(0.16, 1, 0.3, 1)',
                outline: 'none',
              }}
            >
              <span>{entering ? 'Entering Gallery...' : 'Click to Enter'}</span>
              <span style={{ fontSize: '0.95rem', lineHeight: 1 }}>➔</span>
            </motion.button>
          </motion.div>

          {/* Exhibition Year / Location Footer */}
          <div
            style={{
              position: 'absolute',
              bottom: '1.75rem',
              fontFamily: 'var(--font-mono)',
              fontSize: '0.58rem',
              color: 'rgba(255, 255, 255, 0.3)',
              letterSpacing: '0.2em',
              textTransform: 'uppercase',
              textAlign: 'center',
            }}
          >
            Virtual Exhibition · 360° Walkthrough
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
