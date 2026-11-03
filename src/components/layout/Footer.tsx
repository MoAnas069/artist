import { Link } from 'react-router-dom';
import { useSiteSettings } from '../../hooks/useSiteSettings';

export default function Footer() {
  const { settings } = useSiteSettings();
  const currentYear = new Date().getFullYear();

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const navLinks = [
    { label: 'The Work', path: '/work', index: '01' },
    { label: 'The Person', path: '/about', index: '02' },
    { label: 'Field Notes', path: '/journal', index: '03' },
    { label: 'The Editions', path: '/editions', index: '04' },
    { label: 'Get in Touch', path: '/contact', index: '05' },
  ];

  const socialLinks = [
    ...(settings.instagram ? [{ label: 'Instagram', url: settings.instagram }] : [{ label: 'Instagram', url: 'https://instagram.com' }]),
    ...(settings.twitter ? [{ label: 'X / Twitter', url: settings.twitter }] : [{ label: 'X / Twitter', url: 'https://x.com' }]),
    ...(settings.threads ? [{ label: 'Threads', url: settings.threads }] : []),
    ...(settings.discord ? [{ label: 'Discord', url: settings.discord }] : []),
  ];

  return (
    <footer className="footer" role="contentinfo" aria-label="Site footer">
      <div className="container">
        {/* Main Footer Grid */}
        <div className="footer__grid">
          {/* Col 1: Identity & Statement */}
          <div className="footer__col footer__col--identity">
            <Link to="/" className="footer__wordmark" aria-label="CHINTWO Home">
              CHINTWO
            </Link>
            <p className="footer__statement">
              {settings.homepageStatement || 'Contemporary visual artist & storyteller.'}
            </p>
            <p className="footer__substatement">
              {settings.shortBio || 'An independent creative universe exploring atmospheric narratives, memory, and myth.'}
            </p>
            <div className="footer__location">
              <span className="footer__status-dot" />
              <span className="type-meta-sm">Studio Active • Open for Commissions</span>
            </div>
          </div>

          {/* Col 2: Navigation Index */}
          <div className="footer__col">
            <span className="footer__col-title">Index</span>
            <ul className="footer__links">
              {navLinks.map((item) => (
                <li key={item.path}>
                  <Link to={item.path} className="footer__link">
                    <span className="footer__link-index">{item.index}</span>
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Col 3: Direct Dialogue */}
          <div className="footer__col">
            <span className="footer__col-title">Dialogue</span>
            <ul className="footer__links">
              {settings.email && (
                <li>
                  <a href={`mailto:${settings.email}`} className="footer__link">
                    {settings.email}
                  </a>
                </li>
              )}
              {socialLinks.map((social) => (
                <li key={social.label}>
                  <a
                    href={social.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="footer__link"
                  >
                    {social.label}
                  </a>
                </li>
              ))}
              <li>
                <Link to="/contact" className="footer__link">
                  Studio Inquiries →
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 4: Colophon */}
          <div className="footer__col footer__col--colophon">
            <span className="footer__col-title">Colophon</span>
            <p className="type-meta-sm" style={{ color: 'var(--color-stone)', lineHeight: 1.6, marginBottom: '0.75rem' }}>
              Set in Instrument Serif, Inter, and Space Mono. Art-directed for CHINTWO.
            </p>
            <p className="type-meta-sm" style={{ color: 'var(--color-muted)', lineHeight: 1.6 }}>
              All original artworks, writings, and editions are protected under copyright.
            </p>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="footer__bottom">
          <span className="type-meta-sm" style={{ color: 'var(--color-muted)' }}>
            {settings.copyrightText || `© ${currentYear} CHINTWO. All rights reserved.`}
          </span>

          <div style={{ display: 'flex', alignItems: 'center', gap: '2rem' }}>
            <span className="type-meta-sm" style={{ color: 'var(--color-muted)' }}>
              THE ARTIST'S VISUAL UNIVERSE
            </span>
            <button
              onClick={scrollToTop}
              className="footer__back-to-top"
              aria-label="Back to top"
            >
              Back to top ↑
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
}
