import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { ShoppingBag, Sun, Moon, Menu, X } from 'lucide-react';
import { useSiteSettings } from '../../hooks/useSiteSettings';
import { useCart } from '../../context/CartContext';
import { useTheme } from '../../context/ThemeContext';
import AmbientSound from '../audio/AmbientSound';

const NAV_ITEMS = [
  { label: 'WORKS', path: '/works', index: '01' },
  { label: 'PRINTS', path: '/prints', index: '02' },
  { label: 'ABOUT', path: '/about', index: '03' },
  { label: 'JOURNAL', path: '/journal', index: '04' },
  { label: 'CONTACT', path: '/contact', index: '05' },
];

export default function Navbar() {
  const location = useLocation();
  const { settings } = useSiteSettings();
  const { totalCount, openCart } = useCart();
  const { theme, toggleTheme } = useTheme();
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

  useEffect(() => {
    document.body.style.overflow = menuOpen ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [menuOpen]);

  const isCurrent = (path: string) => {
    if (path === '/works') {
      return location.pathname === '/works' || location.pathname.startsWith('/work');
    }
    if (path === '/prints') {
      return location.pathname === '/prints' || location.pathname.startsWith('/editions') || location.pathname.startsWith('/shop');
    }
    return location.pathname.startsWith(path);
  };

  return (
    <>
      <header
        className={`dusk-nav ${scrolled ? 'dusk-nav--scrolled' : ''}`}
        role="banner"
      >
        <div className="dusk-nav-inner">
          {/* Brand Left */}
          <Link to="/" className="dusk-wordmark" aria-label={settings.artistName || 'CHINTWO'}>
            <span className="dusk-wordmark-title">CHINTWO</span>
            <span className="dusk-wordmark-sub">STUDIO ARCHIVE</span>
          </Link>

          {/* Center / Desktop Links */}
          <nav className="dusk-nav-links" role="navigation" aria-label="Main gallery navigation">
            {NAV_ITEMS.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`dusk-nav-link ${isCurrent(item.path) ? 'active' : ''}`}
              >
                <span className="dusk-nav-index">{item.index}</span>
                <span className="dusk-nav-text">{item.label}</span>
              </Link>
            ))}
          </nav>

          {/* Right Controls: Ambient Audio, Daylight Toggle, Cart Folio */}
          <div className="dusk-nav-actions">
            <AmbientSound />

            {/* Daylight / Dusk Theme Toggle */}
            <button
              type="button"
              onClick={toggleTheme}
              className="dusk-theme-toggle"
              title={theme === 'dusk' ? 'Switch to restrained Daylight Mode' : 'Switch to signature Dusk Gallery Mode'}
              aria-label="Toggle theme"
            >
              {theme === 'dusk' ? <Sun size={15} /> : <Moon size={15} />}
            </button>

            {/* Collector Cart Folio Button */}
            <button
              type="button"
              onClick={openCart}
              className="dusk-cart-nav-btn"
              aria-label={`Open collection folio, ${totalCount} items`}
            >
              <ShoppingBag size={15} />
              <span className="dusk-cart-nav-text">FOLIO</span>
              {totalCount > 0 && <span className="dusk-cart-count">{totalCount}</span>}
            </button>

            {/* Mobile Menu Toggle */}
            <button
              type="button"
              className="dusk-mobile-toggle"
              onClick={() => setMenuOpen(true)}
              aria-label="Open mobile navigation"
              aria-expanded={menuOpen}
            >
              <Menu size={20} />
            </button>
          </div>
        </div>
      </header>

      {/* Full-Screen Mobile Menu Overlay */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            className="dusk-mobile-menu"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.28, ease: 'easeOut' }}
            role="dialog"
            aria-modal="true"
            aria-label="Mobile navigation menu"
          >
            <div className="dusk-mobile-menu-header">
              <Link to="/" className="dusk-wordmark" onClick={() => setMenuOpen(false)}>
                <span className="dusk-wordmark-title">CHINTWO</span>
                <span className="dusk-wordmark-sub">STUDIO ARCHIVE</span>
              </Link>
              <button
                type="button"
                onClick={() => setMenuOpen(false)}
                className="dusk-mobile-menu-close"
                aria-label="Close mobile navigation"
              >
                <X size={22} />
              </button>
            </div>

            <nav className="dusk-mobile-menu-links">
              {NAV_ITEMS.map((item, i) => (
                <motion.div
                  key={item.path}
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.04 * i, duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
                >
                  <Link
                    to={item.path}
                    className={`dusk-mobile-link ${isCurrent(item.path) ? 'active' : ''}`}
                    onClick={() => setMenuOpen(false)}
                  >
                    <span className="dusk-mobile-index">{item.index}</span>
                    <span className="dusk-mobile-label">{item.label}</span>
                  </Link>
                </motion.div>
              ))}
            </nav>

            <div className="dusk-mobile-menu-footer">
              <div className="dusk-mobile-actions">
                <button
                  type="button"
                  onClick={() => {
                    setMenuOpen(false);
                    openCart();
                  }}
                  className="btn-dusk btn-dusk--primary"
                  style={{ width: '100%', justifyContent: 'center' }}
                >
                  <ShoppingBag size={16} />
                  <span>VIEW COLLECTOR FOLIO ({totalCount})</span>
                </button>
              </div>

              <div className="dusk-mobile-socials">
                {settings.instagram && (
                  <a href={settings.instagram} target="_blank" rel="noopener noreferrer">
                    Instagram
                  </a>
                )}
                {settings.email && (
                  <a href={`mailto:${settings.email}`}>
                    {settings.email}
                  </a>
                )}
              </div>
              <p className="dusk-mobile-copy">
                {settings.copyrightText || `© ${new Date().getFullYear()} Chintwo. All rights reserved.`}
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
