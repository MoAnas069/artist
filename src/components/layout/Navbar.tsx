import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { useSiteSettings } from '../../hooks/useSiteSettings';

const NAV_ITEMS = [
  { label: 'WORK', path: '/work', index: '01' },
  { label: 'PERSON', path: '/about', index: '02' },
  { label: 'NOTES', path: '/journal', index: '03' },
  { label: 'EDITIONS', path: '/editions', index: '04' },
  { label: 'CONTACT', path: '/contact', index: '05' },
];

export default function Navbar() {
  const location = useLocation();
  const { settings } = useSiteSettings();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    setMenuOpen(false);
  }, [location.pathname]);

  // Lock body scroll when menu is open
  useEffect(() => {
    document.body.style.overflow = menuOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [menuOpen]);

  const socialLinks = [
    ...(settings.instagram ? [{ label: 'Instagram', url: settings.instagram }] : []),
    ...(settings.twitter ? [{ label: 'X / Twitter', url: settings.twitter }] : []),
    ...(settings.threads ? [{ label: 'Threads', url: settings.threads }] : []),
    ...(settings.discord ? [{ label: 'Discord', url: settings.discord }] : []),
  ];

  return (
    <>
      <nav className={`nav${scrolled ? ' nav--scrolled' : ''}`} role="navigation" aria-label="Main navigation">
        {/* Wordmark */}
        <Link to="/" className="wordmark" aria-label={settings.artistName || 'CHINTWO'}>
          CHINTWO<span className="wordmark-reg">®</span>
        </Link>

        {/* Desktop Links */}
        <div className="nav__links">
          {NAV_ITEMS.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`nav__link${location.pathname.startsWith(item.path) ? ' nav__link--active' : ''}`}
            >
              <span className="nav__link-index">{item.index}</span>
              <span className="nav__link-text">{item.label}</span>
            </Link>
          ))}
        </div>

        {/* Minimal Toggle */}
        <button
          className="nav__toggle"
          onClick={() => setMenuOpen(true)}
          aria-label="Open navigation menu"
          aria-expanded={menuOpen}
        >
          <span className="nav__toggle-bar" />
          <span className="nav__toggle-bar" />
          <span className="nav__toggle-bar" />
        </button>
      </nav>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            className="mobile-menu"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25, ease: 'easeOut' }}
            role="dialog"
            aria-modal="true"
            aria-label="Navigation menu"
          >
            {/* Header */}
            <div className="mobile-menu__header">
              <Link to="/" className="wordmark" onClick={() => setMenuOpen(false)}>
                CHINTWO
              </Link>
              <button
                onClick={() => setMenuOpen(false)}
                aria-label="Close menu"
                style={{
                  width: 44,
                  height: 44,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '1.5rem',
                  fontWeight: 300,
                }}
              >
                ✕
              </button>
            </div>

            {/* Navigation */}
            <nav className="mobile-menu__nav">
              {NAV_ITEMS.map((item, i) => (
                <motion.div
                  key={item.path}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.05 * i, duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
                >
                  <Link
                    to={item.path}
                    className="mobile-menu__link"
                    onClick={() => setMenuOpen(false)}
                  >
                    <span className="mobile-menu__index">{item.index}</span>
                    {item.label}
                  </Link>
                </motion.div>
              ))}
            </nav>

            {/* Footer */}
            <div className="mobile-menu__footer">
              <div style={{ display: 'flex', gap: '1.25rem', flexWrap: 'wrap' }}>
                {socialLinks.map((link) => (
                  <a
                    key={link.label}
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mobile-menu__social-link"
                  >
                    {link.label}
                  </a>
                ))}
                {settings.email && (
                  <a href={`mailto:${settings.email}`} className="mobile-menu__social-link">
                    Email
                  </a>
                )}
              </div>
              <span className="type-meta-sm" style={{ color: 'var(--color-muted)' }}>
                {settings.copyrightText || `© ${new Date().getFullYear()} ${settings.artistName}`}
              </span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
