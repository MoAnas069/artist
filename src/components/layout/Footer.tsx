import { Link } from 'react-router-dom';
import { useSiteSettings } from '../../hooks/useSiteSettings';
import { ArrowUp } from 'lucide-react';

export default function Footer() {
  const { settings } = useSiteSettings();
  const currentYear = new Date().getFullYear();

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="dusk-footer" role="contentinfo" aria-label="Gallery footer">
      <div className="dusk-footer-inner">
        {/* Top Minimal Strip */}
        <div className="dusk-footer-top">
          <div className="dusk-footer-brand">
            <Link to="/" className="dusk-footer-title">
              CHINTWO
            </Link>
            <p className="dusk-footer-statement">
              {settings.homepageSubtitle ||
                'Exploring atmospheric worlds, memory, and myth through textured brushwork and quiet light.'}
            </p>
          </div>

          <nav className="dusk-footer-nav" aria-label="Footer links">
            <div className="dusk-footer-group">
              <span className="dusk-footer-group-title">GALLERY</span>
              <Link to="/works" className="dusk-footer-link">Works & Series</Link>
              <Link to="/prints" className="dusk-footer-link">Limited Editions</Link>
              <Link to="/journal" className="dusk-footer-link">Studio Notes</Link>
            </div>

            <div className="dusk-footer-group">
              <span className="dusk-footer-group-title">STUDIO</span>
              <Link to="/about" className="dusk-footer-link">Biography & CV</Link>
              <Link to="/contact" className="dusk-footer-link">Acquisitions & Press</Link>
              {settings.email && (
                <a href={`mailto:${settings.email}`} className="dusk-footer-link">
                  {settings.email}
                </a>
              )}
            </div>

            <div className="dusk-footer-group">
              <span className="dusk-footer-group-title">DIALOGUE</span>
              {settings.instagram && (
                <a
                  href={settings.instagram}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="dusk-footer-link"
                >
                  Instagram ↗
                </a>
              )}
              {settings.threads && (
                <a
                  href={settings.threads}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="dusk-footer-link"
                >
                  Threads ↗
                </a>
              )}
              {settings.twitter && (
                <a
                  href={settings.twitter}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="dusk-footer-link"
                >
                  X / Twitter ↗
                </a>
              )}
            </div>
          </nav>
        </div>

        {/* Bottom Quiet Line */}
        <div className="dusk-footer-bottom">
          <p className="dusk-footer-copy">
            All artwork © {currentYear} {settings.artistName || 'Chintwo'}. All rights reserved.
          </p>

          <div className="dusk-footer-credits">
            <span className="dusk-footer-colophon">The Dusk Gallery • London</span>
            <button
              type="button"
              onClick={scrollToTop}
              className="dusk-footer-totop"
              aria-label="Scroll back to top"
            >
              <span>Back to surface</span>
              <ArrowUp size={12} />
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
}
