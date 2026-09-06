import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowUpRight } from 'lucide-react';
import { useSiteSettings } from '../../hooks/useSiteSettings';

interface MenuOverlayProps {
  onClose: () => void;
}

interface MenuItem {
  number: string;
  label: string;
  sublabel: string;
  category: string;
  path: string;
  image: string;
}

export default function MenuOverlay({ onClose }: MenuOverlayProps) {
  const { settings } = useSiteSettings();
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  const menuItems: MenuItem[] = [
    {
      number: '01',
      label: 'Art',
      sublabel: 'Selected Paintings, Drawings & Exhibitions',
      category: 'Gallery & Series',
      path: '/work',
      // Vivid colorful artwork with deep acrylics, cobalt blue, warm ochre, and expressive brushwork
      image: 'https://images.unsplash.com/photo-1541701494587-cb58502866ab?w=1920&auto=format&fit=crop&q=85',
    },
    {
      number: '02',
      label: 'Me',
      sublabel: 'Biography, Philosophy & Studio Practice',
      category: 'Biography & Atelier',
      path: '/me',
      // The artist's studio atelier, natural light, and portrait space
      image: settings.artistPortrait || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=1920&auto=format&fit=crop&q=85',
    },
    {
      number: '03',
      label: 'Journal',
      sublabel: 'Studio Notes, Process & Literary Essays',
      category: 'Writings & Reflections',
      path: '/journal',
      // Poetic literary notebooks, manuscript pages, and dark ink washes
      image: 'https://images.unsplash.com/photo-1457369804613-52c61a468e7d?w=1920&auto=format&fit=crop&q=85',
    },
    {
      number: '04',
      label: 'Shop',
      sublabel: 'Limited Edition Archival Prints & Objects',
      category: 'Editions & Objects',
      path: '/shop',
      // Printmaking workshop, textured archival paper, and collector editions
      image: 'https://images.unsplash.com/photo-1513519245088-0e12902e5a38?w=1920&auto=format&fit=crop&q=85',
    },
    {
      number: '05',
      label: 'Contact',
      sublabel: 'Commissions, Gallery Inquiries & Press',
      category: 'Correspondence & Inquiry',
      path: '/contact',
      // Architectural letterpress, postal stationery, and dark studio desk
      image: 'https://images.unsplash.com/photo-1586075010923-2dd4570fb338?w=1920&auto=format&fit=crop&q=85',
    },
  ];

  const socialLinks = [
    ...(settings.instagram ? [{ label: 'Instagram', url: settings.instagram }] : [{ label: 'Instagram', url: '#' }]),
    ...(settings.threads ? [{ label: 'Threads', url: settings.threads }] : []),
    ...(settings.twitter ? [{ label: 'X / Twitter', url: settings.twitter }] : [{ label: 'X / Twitter', url: '#' }]),
    ...(settings.discord ? [{ label: 'Discord', url: settings.discord }] : []),
    { label: 'Email', url: `mailto:${settings.email || 'hello@artist.com'}` },
  ];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.35, ease: 'easeInOut' }}
      role="dialog"
      aria-modal="true"
      aria-label="Site navigation"
      style={{
        position: 'fixed',
        inset: 0,
        backgroundColor: '#09090b',
        zIndex: 999,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        paddingTop: 'var(--nav-height)',
        overflowY: 'auto',
        overflowX: 'hidden',
      }}
    >
      {/* ─────────────────────────────────────────────────────────────
          FULL-WIDTH RECTANGULAR NAVIGATION SECTIONS
          Each button spans edge-to-edge (from one side of screen to other)
          and reveals a rich, colorful artwork / visual on hover!
          ───────────────────────────────────────────────────────────── */}
      <nav
        style={{
          display: 'flex',
          flexDirection: 'column',
          width: '100%',
          flex: 1,
          justifyContent: 'center',
        }}
      >
        {menuItems.map((item, i) => {
          const isHovered = hoveredIndex === i;
          return (
            <Link
              key={item.path}
              to={item.path}
              onClick={onClose}
              onMouseEnter={() => setHoveredIndex(i)}
              onMouseLeave={() => setHoveredIndex(null)}
              data-cursor={item.label}
              style={{
                position: 'relative',
                width: '100%',
                display: 'block',
                textDecoration: 'none',
                overflow: 'hidden',
                borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
                borderTop: i === 0 ? '1px solid rgba(255, 255, 255, 0.08)' : 'none',
                backgroundColor: isHovered ? '#111115' : 'transparent',
                transition: 'background-color 0.4s ease',
              }}
            >
              {/* ── Background Artwork Layer (Spans edge-to-edge) ── */}
              <div
                style={{
                  position: 'absolute',
                  inset: 0,
                  backgroundImage: `url(${item.image})`,
                  backgroundSize: 'cover',
                  backgroundPosition: 'center',
                  opacity: isHovered ? 1 : 0,
                  transform: isHovered ? 'scale(1.03)' : 'scale(1)',
                  transition: 'opacity 0.5s cubic-bezier(0.16, 1, 0.3, 1), transform 0.7s cubic-bezier(0.16, 1, 0.3, 1)',
                  zIndex: 1,
                  pointerEvents: 'none',
                }}
              />

              {/* ── Dark Film Scrim for Maximum Text Legibility ── */}
              <div
                style={{
                  position: 'absolute',
                  inset: 0,
                  background: 'linear-gradient(90deg, rgba(8, 8, 10, 0.8) 0%, rgba(8, 8, 10, 0.4) 50%, rgba(8, 8, 10, 0.82) 100%)',
                  opacity: isHovered ? 1 : 0,
                  transition: 'opacity 0.45s ease',
                  zIndex: 2,
                  pointerEvents: 'none',
                }}
              />

              {/* ── Foreground Button Content ── */}
              <div
                style={{
                  position: 'relative',
                  zIndex: 3,
                  width: '100%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: 'clamp(1rem, 2.5vh, 2rem) clamp(2rem, 6vw, 6rem)',
                  minHeight: 'clamp(72px, 12.5vh, 130px)',
                  boxSizing: 'border-box',
                }}
              >
                {/* Left Side: Number & Category Title */}
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'baseline',
                    gap: 'clamp(1.25rem, 3vw, 3rem)',
                  }}
                >
                  <span
                    style={{
                      fontFamily: 'var(--font-mono, monospace)',
                      fontSize: 'clamp(0.85rem, 1.2vw, 1.1rem)',
                      color: isHovered ? '#ffffff' : 'rgba(255, 255, 255, 0.35)',
                      letterSpacing: '0.15em',
                      transition: 'color 0.3s ease',
                      fontWeight: 500,
                    }}
                  >
                    {item.number}
                  </span>

                  <h2
                    style={{
                      fontFamily: 'var(--font-display)',
                      fontSize: 'clamp(2.2rem, 5.5vw, 4.5rem)',
                      fontWeight: 400,
                      lineHeight: 1,
                      margin: 0,
                      color: isHovered ? '#ffffff' : 'rgba(245, 240, 235, 0.82)',
                      letterSpacing: '-0.02em',
                      transform: isHovered ? 'translateX(10px)' : 'translateX(0)',
                      transition: 'color 0.3s ease, transform 0.35s cubic-bezier(0.16, 1, 0.3, 1)',
                      textShadow: isHovered ? '0 2px 25px rgba(0, 0, 0, 0.85)' : 'none',
                    }}
                  >
                    {item.label}
                  </h2>
                </div>

                {/* Right Side: Meta Tag, Subtitle & Arrow */}
                <div style={{ display: 'flex', alignItems: 'center', gap: 'clamp(1.5rem, 3vw, 3.5rem)' }}>
                  <div
                    style={{
                      textAlign: 'right',
                    }}
                    className="menu-item-meta"
                  >
                    <div
                      style={{
                        fontSize: '0.6875rem',
                        fontFamily: 'var(--font-mono, monospace)',
                        letterSpacing: '0.2em',
                        textTransform: 'uppercase',
                        color: isHovered ? '#ffffff' : 'rgba(255, 255, 255, 0.35)',
                        marginBottom: '0.25rem',
                        transition: 'color 0.3s ease',
                        fontWeight: 600,
                      }}
                    >
                      {item.category}
                    </div>
                    <div
                      style={{
                        fontSize: 'clamp(0.78rem, 1vw, 0.875rem)',
                        fontFamily: 'var(--font-body)',
                        color: isHovered ? 'rgba(255, 255, 255, 0.85)' : 'rgba(255, 255, 255, 0.35)',
                        transition: 'color 0.3s ease',
                        letterSpacing: '0.02em',
                      }}
                    >
                      {item.sublabel}
                    </div>
                  </div>

                  {/* Circular Arrow Badge */}
                  <div
                    style={{
                      width: 'clamp(36px, 4vw, 46px)',
                      height: 'clamp(36px, 4vw, 46px)',
                      borderRadius: '50%',
                      border: isHovered ? '1px solid rgba(255, 255, 255, 0.8)' : '1px solid rgba(255, 255, 255, 0.15)',
                      backgroundColor: isHovered ? 'rgba(255, 255, 255, 0.2)' : 'rgba(255, 255, 255, 0.03)',
                      backdropFilter: isHovered ? 'blur(8px)' : 'none',
                      WebkitBackdropFilter: isHovered ? 'blur(8px)' : 'none',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: isHovered ? '#ffffff' : 'rgba(255, 255, 255, 0.6)',
                      transform: isHovered ? 'translateX(4px) scale(1.08)' : 'translateX(0) scale(1)',
                      transition: 'all 0.35s cubic-bezier(0.16, 1, 0.3, 1)',
                      flexShrink: 0,
                    }}
                  >
                    <ArrowUpRight size={18} />
                  </div>
                </div>
              </div>
            </Link>
          );
        })}
      </nav>

      {/* ─────────────────────────────────────────────────────────────
          FOOTER / SOCIAL LINKS
          ───────────────────────────────────────────────────────────── */}
      <footer
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: 'var(--space-md)',
          padding: 'clamp(1.5rem, 3vh, 2.5rem) clamp(2rem, 6vw, 6rem)',
          borderTop: '1px solid rgba(255, 255, 255, 0.08)',
          backgroundColor: '#09090b',
        }}
      >
        <div style={{ display: 'flex', gap: 'clamp(1rem, 2vw, 2rem)', flexWrap: 'wrap' }}>
          {socialLinks.map((link) => (
            <a
              key={link.label}
              href={link.url}
              target={link.url.startsWith('http') ? '_blank' : undefined}
              rel="noopener noreferrer"
              className="type-meta-sm"
              data-cursor=""
              style={{
                color: 'rgba(255, 255, 255, 0.55)',
                textDecoration: 'none',
                letterSpacing: '0.1em',
                textTransform: 'uppercase',
                fontSize: '0.75rem',
                transition: 'color 0.3s ease',
              }}
              onMouseEnter={(e) => (e.currentTarget.style.color = '#ffffff')}
              onMouseLeave={(e) => (e.currentTarget.style.color = 'rgba(255, 255, 255, 0.55)')}
            >
              {link.label}
            </a>
          ))}
        </div>

        <span
          className="type-meta-sm"
          style={{
            color: 'rgba(255, 255, 255, 0.35)',
            fontSize: '0.75rem',
            letterSpacing: '0.08em',
          }}
        >
          {settings.copyrightText || `© ${new Date().getFullYear()} ${settings.artistName}. All rights reserved.`}
        </span>
      </footer>

      {/* Responsive adjustments for mobile screens */}
      <style>{`
        @media (max-width: 768px) {
          .menu-item-meta {
            display: none !important;
          }
        }
      `}</style>
    </motion.div>
  );
}
