import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useSiteSettings } from '../../hooks/useSiteSettings';
import type { GallerySection } from '../../types/gallery';

interface MobileGalleryProps {
  sections: GallerySection[];
}

/**
 * MobileGallery — A polished 2D fallback for mobile/low-performance devices.
 * Retains the gallery design language with framed artwork cards,
 * labels, and smooth transitions.
 */
export default function MobileGallery({ sections }: MobileGalleryProps) {
  const navigate = useNavigate();
  const { settings } = useSiteSettings();
  const visibleSections = sections
    .filter((s) => s.visible)
    .sort((a, b) => a.sortOrder - b.sortOrder);

  return (
    <div
      style={{
        minHeight: '100vh',
        backgroundColor: 'var(--color-ivory)',
        color: 'var(--color-charcoal)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        width: '100%',
        overflowX: 'hidden',
      }}
    >
      {/* Header */}
      <header
        style={{
          width: '100%',
          padding: '1.5rem 1.25rem',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '0.25rem',
        }}
      >
        <img
          src="/chintwo-emblem-dark.svg"
          alt=""
          style={{ width: '36px', height: 'auto', marginBottom: '0.35rem' }}
        />
        <img
          src="/chintwo-text-dark.svg"
          alt={settings.artistName || 'Chintwo'}
          style={{
            width: 'clamp(180px, 50vw, 280px)',
            height: 'auto',
          }}
        />
        <p
          style={{
            fontFamily: 'var(--font-body)',
            fontSize: '0.65rem',
            color: 'var(--color-stone)',
            letterSpacing: '0.15em',
            textTransform: 'uppercase',
            marginTop: '0.25rem',
          }}
        >
          explore the gallery
        </p>
      </header>

      {/* Gallery Cards */}
      <main
        style={{
          width: '100%',
          maxWidth: '400px',
          padding: '0.5rem 1.25rem 4rem',
          display: 'flex',
          flexDirection: 'column',
          gap: '1.5rem',
        }}
      >
        {visibleSections.map((section, i) => (
          <motion.button
            key={section.sectionId}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: i * 0.1, ease: [0.16, 1, 0.3, 1] }}
            onClick={() => navigate(section.destination)}
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              border: 'none',
              background: 'none',
              cursor: 'pointer',
              width: '100%',
              padding: 0,
            }}
          >
            {/* Framed artwork */}
            <div
              style={{
                width: '100%',
                aspectRatio: section.frameType === 'portrait' ? '3/4' : section.frameType === 'square' ? '1/1' : '4/3',
                position: 'relative',
                backgroundColor: '#2A2118',
                padding: '8px',
                boxShadow: '0 4px 20px rgba(0,0,0,0.12), 0 1px 4px rgba(0,0,0,0.08)',
              }}
            >
              {/* White mat */}
              <div
                style={{
                  width: '100%',
                  height: '100%',
                  backgroundColor: '#FAF8F5',
                  padding: '12px',
                }}
              >
                <img
                  src={section.frameImage}
                  alt={section.title}
                  loading="lazy"
                  style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                    display: 'block',
                  }}
                />
              </div>
            </div>

            {/* Title board simulation */}
            <div
              style={{
                marginTop: '0.75rem',
                padding: '0.4rem 0.8rem',
                backgroundColor: '#E8E2DA',
                border: '1px solid rgba(0,0,0,0.04)',
                textAlign: 'center',
              }}
            >
              <span
                style={{
                  fontFamily: 'var(--font-editorial)',
                  fontSize: '0.8rem',
                  fontWeight: 500,
                  letterSpacing: '0.18em',
                  color: 'var(--color-charcoal)',
                  display: 'block',
                }}
              >
                {section.title}
              </span>
              <span
                style={{
                  fontFamily: 'var(--font-body)',
                  fontSize: '0.6rem',
                  letterSpacing: '0.08em',
                  color: 'var(--color-stone)',
                  display: 'block',
                  marginTop: '2px',
                }}
              >
                {section.subtitle}
              </span>
            </div>
          </motion.button>
        ))}
      </main>

      {/* Footer */}
      <footer
        style={{
          textAlign: 'center',
          padding: '1.5rem 1.5rem 4rem',
          fontFamily: 'var(--font-body)',
          fontSize: '0.7rem',
          color: 'var(--color-stone)',
          letterSpacing: '0.05em',
          marginTop: 'auto',
        }}
      >
        {settings.copyrightText || `© ${new Date().getFullYear()} ${settings.artistName}`}
      </footer>
    </div>
  );
}
