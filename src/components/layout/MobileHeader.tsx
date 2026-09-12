import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useSiteSettings } from '../../hooks/useSiteSettings';
import { AnimatePresence, motion } from 'framer-motion';

interface MobileHeaderProps {
  centerLogo?: boolean;
}

export default function MobileHeader({ centerLogo = false }: MobileHeaderProps) {
  const { settings } = useSiteSettings();
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(false);

  const navItems = [
    { label: 'Art', path: '/work' },
    { label: 'About', path: '/me' },
    { label: 'Journal', path: '/journal' },
    { label: 'Shop', path: '/shop' },
    { label: 'Contact', path: '/contact' },
  ];

  return (
    <>
      <header
        style={{
          width: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: centerLogo ? 'center' : 'space-between',
          position: 'relative',
          padding: 'clamp(1.5rem, 4.5vw, 2.5rem) clamp(1.25rem, 4vw, 2rem) clamp(1rem, 3vw, 1.75rem)',
          boxSizing: 'border-box',
          zIndex: 40,
        }}
      >
        {/* Signature Artist Logo */}
        <Link
          to="/"
          className="artist-signature-brand"
          style={{
            textAlign: centerLogo ? 'center' : 'left',
          }}
          aria-label={settings.artistName}
        >
          {settings.artistName.toLowerCase()}
        </Link>

        {/* Minimal 2-Line Hamburger Menu Toggle */}
        <button
          onClick={() => setIsOpen(true)}
          aria-label="Open menu"
          style={{
            position: centerLogo ? 'absolute' : 'static',
            right: 'clamp(1.25rem, 4vw, 2rem)',
            top: '50%',
            transform: centerLogo ? 'translateY(-50%)' : 'none',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            gap: '6px',
            width: '40px',
            height: '40px',
            background: 'transparent',
            border: 'none',
            cursor: 'pointer',
            padding: 0,
          }}
        >
          <span
            style={{
              display: 'block',
              width: '24px',
              height: '1.5px',
              backgroundColor: 'var(--color-charcoal)',
              transition: 'all 0.2s ease',
            }}
          />
          <span
            style={{
              display: 'block',
              width: '24px',
              height: '1.5px',
              backgroundColor: 'var(--color-charcoal)',
              transition: 'all 0.2s ease',
            }}
          />
        </button>
      </header>

      {/* Owen Gent Style Full-Screen Ivory Menu Overlay */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25, ease: 'easeOut' }}
            style={{
              position: 'fixed',
              inset: 0,
              backgroundColor: 'var(--color-ivory)',
              zIndex: 9999,
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              padding: 'clamp(1.5rem, 4.5vw, 2.5rem) clamp(1.25rem, 4vw, 2rem)',
              boxSizing: 'border-box',
              overflowY: 'auto',
            }}
          >
            {/* Modal Header Bar */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                width: '100%',
              }}
            >
              <Link
                to="/"
                onClick={() => setIsOpen(false)}
                className="artist-signature-brand"
                style={{ fontSize: 'clamp(2.4rem, 6.5vw, 3.2rem)' }}
              >
                {settings.artistName.toLowerCase()}
              </Link>

              {/* Close Button ✕ */}
              <button
                onClick={() => setIsOpen(false)}
                aria-label="Close menu"
                style={{
                  width: '44px',
                  height: '44px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  background: 'transparent',
                  border: 'none',
                  cursor: 'pointer',
                  color: 'var(--color-charcoal)',
                  fontSize: '1.6rem',
                  lineHeight: 1,
                  fontFamily: 'var(--font-body)',
                  fontWeight: 300,
                  padding: 0,
                }}
              >
                ✕
              </button>
            </div>

            {/* Centered Navigation Links */}
            <nav
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 'clamp(1.25rem, 3.5vh, 2rem)',
                padding: '2rem 0',
                margin: 'auto 0',
              }}
            >
              {navItems.map((item) => {
                const isActive = location.pathname === item.path;
                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    onClick={() => setIsOpen(false)}
                    style={{
                      fontFamily: 'var(--font-body)',
                      fontSize: 'clamp(0.95rem, 3vw, 1.15rem)',
                      fontWeight: 500,
                      textTransform: 'uppercase',
                      letterSpacing: '0.18em',
                      color: isActive ? '#000000' : 'var(--color-charcoal)',
                      textDecoration: isActive ? 'underline' : 'none',
                      textUnderlineOffset: '6px',
                      textDecorationThickness: '1px',
                      padding: '0.4rem 1rem',
                      transition: 'all 0.2s ease',
                    }}
                  >
                    {item.label}
                  </Link>
                );
              })}

              {settings.instagram && (
                <a
                  href={settings.instagram}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    fontFamily: 'var(--font-body)',
                    fontSize: 'clamp(0.95rem, 3vw, 1.15rem)',
                    fontWeight: 500,
                    textTransform: 'uppercase',
                    letterSpacing: '0.18em',
                    color: 'var(--color-charcoal)',
                    textDecoration: 'none',
                    padding: '0.4rem 1rem',
                    transition: 'all 0.2s ease',
                    opacity: 0.85,
                  }}
                >
                  Instagram
                </a>
              )}
            </nav>

            {/* Bottom Copyright */}
            <div
              style={{
                textAlign: 'center',
                paddingTop: '1rem',
                fontFamily: 'var(--font-body)',
                fontSize: '0.8rem',
                color: 'var(--color-stone)',
                letterSpacing: '0.04em',
              }}
            >
              All artwork © {settings.artistName}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
