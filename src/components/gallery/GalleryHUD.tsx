import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useGallery } from '../../hooks/useGallery';
import { useSiteSettings } from '../../hooks/useSiteSettings';
import { useIsMobile } from '../../hooks/useMediaQuery';
import type { GallerySection } from '../../types/gallery';

interface GalleryHUDProps {
  sections: GallerySection[];
  onNavigate: (destination: string) => void;
}

export default function GalleryHUD({ sections, onNavigate }: GalleryHUDProps) {
  const { state, returnToGallery, selectBoard } = useGallery();
  const { settings } = useSiteSettings();
  const isMobile = useIsMobile();
  const isInGallery = ['gallery', 'approaching', 'focused'].includes(state.phase);

  const handleStepForward = () => {
    window.dispatchEvent(new CustomEvent('gallery_step_forward'));
  };

  const handleStepBackward = () => {
    window.dispatchEvent(new CustomEvent('gallery_step_backward'));
  };

  const currentFocusedSection = sections.find((s) => s.sectionId === state.focusedFrame);

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 50,
        pointerEvents: 'none',
      }}
    >
      {/* ─── Top Bar ─────────────────────────────────── */}
      <AnimatePresence>
        {isInGallery && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: isMobile ? '1rem 1.25rem' : '1.25rem 1.75rem',
              pointerEvents: 'auto',
            }}
          >
            {/* Wordmark */}
            <img
              src="/chintwo-text-dark.svg"
              alt={settings.artistName || 'Chintwo'}
              style={{
                height: 'clamp(18px, 2.2vw, 24px)',
                width: 'auto',
                opacity: 0.85,
              }}
            />

            {/* Menu button */}
            <GalleryMenu sections={sections} onNavigate={onNavigate} />
          </motion.div>
        )}
      </AnimatePresence>

      {/* ─── Google Maps Style Floating Navigation Arrows ───────────── */}
      <AnimatePresence>
        {state.phase === 'gallery' && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ duration: 0.4 }}
            style={{
              position: 'absolute',
              right: isMobile ? '1rem' : '2.5rem',
              bottom: isMobile ? '5.5rem' : '3.5rem',
              display: 'flex',
              flexDirection: 'column',
              gap: '0.5rem',
              pointerEvents: 'auto',
              zIndex: 60,
            }}
          >
            {/* Step Forward Arrow */}
            <button
              onClick={handleStepForward}
              title="Walk Forward (or Press W / Up)"
              aria-label="Walk Forward"
              style={{
                width: isMobile ? '44px' : '48px',
                height: isMobile ? '44px' : '48px',
                borderRadius: '50%',
                backgroundColor: 'rgba(255, 255, 255, 0.85)',
                backdropFilter: 'blur(10px)',
                border: '1px solid rgba(136, 27, 36, 0.3)',
                boxShadow: '0 4px 16px rgba(0, 0, 0, 0.1)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                color: '#881B24',
                transition: 'all 0.2s ease',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = '#881B24';
                e.currentTarget.style.color = '#FFF';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.85)';
                e.currentTarget.style.color = '#881B24';
              }}
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 4L4 14h6v6h4v-6h6L12 4z" />
              </svg>
            </button>

            {/* Step Backward Arrow */}
            <button
              onClick={handleStepBackward}
              title="Walk Backward (or Press S / Down)"
              aria-label="Walk Backward"
              style={{
                width: isMobile ? '44px' : '48px',
                height: isMobile ? '44px' : '48px',
                borderRadius: '50%',
                backgroundColor: 'rgba(255, 255, 255, 0.85)',
                backdropFilter: 'blur(10px)',
                border: '1px solid rgba(136, 27, 36, 0.3)',
                boxShadow: '0 4px 16px rgba(0, 0, 0, 0.1)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                color: '#881B24',
                transition: 'all 0.2s ease',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = '#881B24';
                e.currentTarget.style.color = '#FFF';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.85)';
                e.currentTarget.style.color = '#881B24';
              }}
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 20L20 10h-6V4h-4v6H4l8 10z" />
              </svg>
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ─── Bottom Navigation & Interaction Hint ─────── */}
      <AnimatePresence>
        {state.phase === 'gallery' && (
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 12 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            style={{
              position: 'absolute',
              bottom: isMobile ? '1.25rem' : '2rem',
              left: 0,
              right: 0,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: isMobile ? '0.5rem' : '0.4rem',
              pointerEvents: 'none',
              padding: '0 1rem',
            }}
          >
            {/* Quick-switch Section Pills (Mobile & Desktop) */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.4rem',
                maxWidth: '92vw',
                overflowX: 'auto',
                padding: '0.35rem 0.6rem',
                backgroundColor: 'rgba(255, 255, 255, 0.85)',
                backdropFilter: 'blur(12px)',
                borderRadius: '30px',
                border: '1px solid rgba(136, 27, 36, 0.2)',
                boxShadow: '0 6px 24px rgba(0, 0, 0, 0.08)',
                pointerEvents: 'auto',
                WebkitOverflowScrolling: 'touch',
                scrollbarWidth: 'none',
              }}
            >
              {sections
                .filter((s) => s.visible)
                .map((section) => (
                  <button
                    key={section.sectionId}
                    onClick={() => {
                      // If already selected, navigate directly!
                      if (state.selectedBoard === section.sectionId) {
                        onNavigate(section.destination);
                      } else {
                        selectBoard(section.sectionId);
                      }
                    }}
                    style={{
                      padding: '0.45rem 0.95rem',
                      border: 'none',
                      background:
                        state.selectedBoard === section.sectionId
                          ? '#881B24'
                          : 'transparent',
                      color:
                        state.selectedBoard === section.sectionId
                          ? '#FFFFFF'
                          : 'var(--color-charcoal)',
                      borderRadius: '20px',
                      fontFamily: 'var(--font-mono)',
                      fontSize: '0.64rem',
                      fontWeight: 600,
                      letterSpacing: '0.12em',
                      textTransform: 'uppercase',
                      whiteSpace: 'nowrap',
                      cursor: 'pointer',
                      transition: 'all 0.2s ease',
                    }}
                  >
                    {section.title}
                  </button>
                ))}
            </div>

            <span
              style={{
                fontFamily: 'var(--font-mono)',
                fontSize: isMobile ? '0.6rem' : '0.65rem',
                color: 'rgba(60, 55, 50, 0.6)',
                letterSpacing: '0.18em',
                textTransform: 'uppercase',
                textAlign: 'center',
              }}
            >
              Drag to look 360° · Use carpet arrows to walk
            </span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ─── Frame Enter Prompt (Focused on an artwork) ─── */}
      <AnimatePresence>
        {state.phase === 'focused' && currentFocusedSection && (
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 15 }}
            transition={{ duration: 0.4, delay: 0.15 }}
            style={{
              position: 'absolute',
              bottom: isMobile ? 'calc(1.5rem + env(safe-area-inset-bottom, 0px))' : '2.5rem',
              left: 0,
              right: 0,
              margin: '0 auto',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '0.65rem',
              width: 'min(360px, 92vw)',
              pointerEvents: 'auto',
              zIndex: 70,
            }}
          >
            {/* Primary Action Button — Leads directly to page! */}
            <button
              onClick={() => onNavigate(currentFocusedSection.destination)}
              style={{
                width: '100%',
                minHeight: '48px',
                padding: isMobile ? '0.85rem 1.25rem' : '0.85rem 2.2rem',
                border: '1px solid rgba(212, 175, 55, 0.45)',
                borderRadius: '6px',
                backgroundColor: '#881B24',
                backgroundImage: 'linear-gradient(135deg, #A8242E 0%, #7B171F 100%)',
                color: '#FFFFFF',
                fontFamily: 'var(--font-body)',
                fontSize: isMobile ? '0.74rem' : '0.78rem',
                fontWeight: 600,
                letterSpacing: '0.18em',
                textTransform: 'uppercase',
                cursor: 'pointer',
                boxShadow:
                  '0 8px 30px rgba(136, 27, 36, 0.35), 0 0 0 1px rgba(255, 255, 255, 0.1)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '0.6rem',
                whiteSpace: 'nowrap',
                boxSizing: 'border-box',
                transition: 'all 0.2s ease',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-2px)';
                e.currentTarget.style.boxShadow =
                  '0 12px 36px rgba(136, 27, 36, 0.5), 0 0 0 1px rgba(255, 255, 255, 0.2)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow =
                  '0 8px 30px rgba(136, 27, 36, 0.35), 0 0 0 1px rgba(255, 255, 255, 0.1)';
              }}
            >
              <span>Enter {currentFocusedSection.title}</span>
              <span style={{ fontSize: '1rem', lineHeight: 1 }}>➔</span>
            </button>

            {/* Return to Free Browsing */}
            <button
              onClick={returnToGallery}
              style={{
                minHeight: '36px',
                padding: '0.45rem 1.5rem',
                border: '1px solid rgba(40, 36, 32, 0.12)',
                background: 'rgba(255, 255, 255, 0.9)',
                backdropFilter: 'blur(10px)',
                borderRadius: '20px',
                fontFamily: 'var(--font-mono)',
                fontSize: '0.64rem',
                fontWeight: 500,
                color: 'rgba(40, 36, 32, 0.8)',
                letterSpacing: '0.12em',
                textTransform: 'uppercase',
                cursor: 'pointer',
                boxShadow: '0 2px 10px rgba(0, 0, 0, 0.08)',
                whiteSpace: 'nowrap',
                transition: 'all 0.2s ease',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = '#FFF';
                e.currentTarget.style.color = '#1E1B18';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.9)';
                e.currentTarget.style.color = 'rgba(40, 36, 32, 0.8)';
              }}
            >
              ← Return to Carpet
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

/* ─── Accessible Gallery Menu ─────────────────────────── */
function GalleryMenu({
  sections,
  onNavigate,
}: {
  sections: GallerySection[];
  onNavigate: (dest: string) => void;
}) {
  const [open, setOpen] = useState(false);

  return (
    <div style={{ position: 'relative' }}>
      <button
        onClick={() => setOpen(!open)}
        aria-label={open ? 'Close menu' : 'Open menu'}
        aria-expanded={open}
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          width: '40px',
          height: '40px',
          border: '1px solid rgba(0,0,0,0.08)',
          background: 'rgba(255,255,255,0.8)',
          backdropFilter: 'blur(10px)',
          borderRadius: '6px',
          cursor: 'pointer',
          gap: '5px',
          padding: '8px',
          boxShadow: '0 2px 10px rgba(0,0,0,0.05)',
        }}
      >
        <span
          style={{
            width: '18px',
            height: '1.5px',
            backgroundColor: '#1E1B18',
            borderRadius: '1px',
            transition: 'all 0.2s ease',
            transform: open ? 'rotate(45deg) translate(2.5px, 2.5px)' : 'none',
          }}
        />
        <span
          style={{
            width: '18px',
            height: '1.5px',
            backgroundColor: '#1E1B18',
            borderRadius: '1px',
            transition: 'all 0.2s ease',
            opacity: open ? 0 : 1,
          }}
        />
        <span
          style={{
            width: '18px',
            height: '1.5px',
            backgroundColor: '#1E1B18',
            borderRadius: '1px',
            transition: 'all 0.2s ease',
            transform: open ? 'rotate(-45deg) translate(2.5px, -2.5px)' : 'none',
          }}
        />
      </button>

      <AnimatePresence>
        {open && (
          <motion.nav
            initial={{ opacity: 0, y: -8, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -8, scale: 0.96 }}
            transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
            aria-label="Gallery sections"
            style={{
              position: 'absolute',
              top: '100%',
              right: 0,
              marginTop: '0.5rem',
              backgroundColor: 'rgba(255, 255, 255, 0.96)',
              backdropFilter: 'blur(16px)',
              borderRadius: '8px',
              border: '1px solid rgba(0,0,0,0.08)',
              boxShadow: '0 12px 40px rgba(0,0,0,0.12)',
              padding: '0.6rem 0',
              minWidth: '200px',
              zIndex: 100,
            }}
          >
            {sections
              .filter((s) => s.visible)
              .map((section) => (
                <button
                  key={section.sectionId}
                  onClick={() => {
                    setOpen(false);
                    onNavigate(section.destination);
                  }}
                  style={{
                    display: 'block',
                    width: '100%',
                    padding: '0.65rem 1.4rem',
                    border: 'none',
                    background: 'none',
                    textAlign: 'left',
                    fontFamily: 'var(--font-body)',
                    fontSize: '0.74rem',
                    fontWeight: 600,
                    letterSpacing: '0.14em',
                    textTransform: 'uppercase',
                    color: 'var(--color-charcoal)',
                    cursor: 'pointer',
                    transition: 'all 0.15s ease',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = 'rgba(136, 27, 36, 0.08)';
                    e.currentTarget.style.color = '#881B24';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = 'transparent';
                    e.currentTarget.style.color = 'var(--color-charcoal)';
                  }}
                >
                  {section.title}
                  <span
                    style={{
                      display: 'block',
                      fontSize: '0.58rem',
                      fontWeight: 400,
                      color: 'var(--color-stone)',
                      letterSpacing: '0.06em',
                      marginTop: '2px',
                    }}
                  >
                    {section.subtitle}
                  </span>
                </button>
              ))}
          </motion.nav>
        )}
      </AnimatePresence>
    </div>
  );
}
