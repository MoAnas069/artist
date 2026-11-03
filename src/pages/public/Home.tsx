import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, ArrowDown } from 'lucide-react';
import { getPublishedArtworks } from '../../services/artworkService';
import { useSiteSettings } from '../../hooks/useSiteSettings';
import Navbar from '../../components/layout/Navbar';
import Footer from '../../components/layout/Footer';
import inventoryData from '../../../content/inventory.json';
import type { Artwork } from '../../types';

export default function Home() {
  const { settings } = useSiteSettings();
  const navigate = useNavigate();
  const [artworks, setArtworks] = useState<Artwork[]>([]);
  const [hoveredSeriesId, setHoveredSeriesId] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;
    getPublishedArtworks()
      .then((data) => {
        if (!mounted) return;
        setArtworks(data.length >= 6 ? data : (inventoryData.artworks as any));
      })
      .catch(() => {
        if (mounted) setArtworks(inventoryData.artworks as any);
      });
    return () => {
      mounted = false;
    };
  }, []);

  const heroArtwork = artworks[0] || (inventoryData.artworks[0] as any);
  const selectedWorks = artworks.slice(0, 8);
  const seriesList = inventoryData.series;

  return (
    <div className="dusk-page">
      <Helmet>
        <title>Chintwo — Visual Artist & Illustrator</title>
        <meta
          name="description"
          content={
            settings.seoDescription ||
            'Chintwo — Visual artist exploring atmospheric worlds, memory, and myth through textured brushwork and quiet light.'
          }
        />
        <meta property="og:title" content="Chintwo — Visual Artist" />
        <meta
          property="og:description"
          content="Atmospheric worlds, memory, and myth through textured brushwork and quiet light."
        />
        {heroArtwork?.coverImage && (
          <meta property="og:image" content={heroArtwork.coverImage} />
        )}
      </Helmet>

      <Navbar />

      <main id="main-content">
        {/* ═══════════════════════════════════════════════════════════
            1. HERO: FULL-VIEWPORT HERO ARTWORK (TEXTURE CROP)
            Refined Large Name, One-Line Descriptor, Slow Scale-In
            ═══════════════════════════════════════════════════════════ */}
        <section className="dusk-brief-hero" aria-label="Hero Introduction">
          <div className="dusk-brief-hero-bg">
            <motion.img
              src={heroArtwork.coverImage}
              alt={heroArtwork.title || 'Hero Artwork'}
              className="dusk-brief-hero-texture"
              initial={{ opacity: 0, scale: 1.04 }}
              animate={{ opacity: 0.65, scale: 1 }}
              transition={{ duration: 1.4, ease: [0.16, 1, 0.3, 1] }}
            />
            <div className="dusk-brief-hero-vignette" />
          </div>

          <div className="dusk-brief-hero-content">
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1.0, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
              className="dusk-brief-hero-header"
            >
              <span className="dusk-brief-hero-kicker">VISUAL ARTIST & ILLUSTRATOR</span>
              <h1 className="dusk-brief-hero-name">Chintwo</h1>
              <p className="dusk-brief-hero-descriptor">
                {inventoryData.artist.descriptor ||
                  'Visual artist exploring atmospheric worlds, memory, and myth through textured brushwork and quiet light.'}
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.6 }}
              className="dusk-brief-hero-scroll"
            >
              <a href="#statement" className="dusk-scroll-indicator" aria-label="Scroll to statement">
                <span>EXPLORE</span>
                <ArrowDown size={14} className="dusk-scroll-arrow" />
              </a>
            </motion.div>
          </div>
        </section>

        {/* ═══════════════════════════════════════════════════════════
            2. STATEMENT: 2 TO 3 LINES BESIDE WHITESPACE
            Real Artist Description in Refined Large Serif
            ═══════════════════════════════════════════════════════════ */}
        <section id="statement" className="dusk-brief-statement" aria-label="Artist Statement">
          <div className="dusk-brief-statement-grid">
            <div className="dusk-brief-statement-label">
              <span className="dusk-statement-dot" />
              <span>ARTIST STATEMENT</span>
            </div>

            <div className="dusk-brief-statement-content">
              <blockquote className="dusk-brief-statement-text">
                “Working across traditional inks, graphite, and expressive digital refinement, building evocative imagery centered on quiet reflection, chiaroscuro lighting, and poetic human narratives.”
              </blockquote>
              <div className="dusk-brief-statement-meta">
                <span className="author">Chintwo</span>
                <span className="role">Studio Practice • London</span>
              </div>
            </div>
          </div>
        </section>

        {/* ═══════════════════════════════════════════════════════════
            3. SELECTED WORKS: ASYMMETRICAL 6–8 FEATURED WORKS
            Hover reveals Title, Year, and Medium
            ═══════════════════════════════════════════════════════════ */}
        <section className="dusk-brief-selected" aria-label="Selected Works">
          <div className="dusk-brief-section-head">
            <div>
              <span className="dusk-section-subhead">01 / CURATED PORTFOLIO</span>
              <h2 className="dusk-brief-section-title">Selected Works</h2>
            </div>
            <Link to="/works" className="dusk-view-all-link">
              <span>View complete archive</span>
              <ArrowRight size={14} />
            </Link>
          </div>

          <div className="dusk-brief-asym-grid">
            {selectedWorks.map((work, idx) => {
              const spanClass = `dusk-work-card--pattern-${(idx % 4) + 1}`;
              return (
                <article
                  key={work.id}
                  className={`dusk-brief-work-card ${spanClass}`}
                  onClick={() => navigate(`/work/${work.slug}`)}
                >
                  <div className="dusk-work-media-container breathing-artwork">
                    <img
                      src={work.coverImage || (work.images && work.images[0])}
                      alt={work.title}
                      loading="lazy"
                      className="dusk-work-img"
                    />
                    {/* Hover Reveal Card */}
                    <div className="dusk-work-hover-reveal">
                      <div className="dusk-work-reveal-content">
                        <span className="dusk-work-reveal-year">{work.year}</span>
                        <h3 className="dusk-work-reveal-title">{work.title}</h3>
                        <p className="dusk-work-reveal-medium">{work.medium}</p>
                        <span className="dusk-work-reveal-cta">
                          <span>VIEW DETAILS</span>
                          <ArrowRight size={12} />
                        </span>
                      </div>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        </section>

        {/* ═══════════════════════════════════════════════════════════
            4. SERIES INDEX: NUMBERED ROWS (01, 02, 03, 04)
            Title, One-Line Theme & Desktop Hover Image Preview
            ═══════════════════════════════════════════════════════════ */}
        <section className="dusk-brief-series-index" aria-label="Series Index">
          <div className="dusk-brief-section-head">
            <div>
              <span className="dusk-section-subhead">02 / SERIES INDEX</span>
              <h2 className="dusk-brief-section-title">Thematic Cycles</h2>
            </div>
            <p className="dusk-series-index-lead">
              Distinct narrative bodies of work exploring cartography, interior solitudes, and winter stillness.
            </p>
          </div>

          <div className="dusk-series-rows-table">
            {seriesList.map((series) => {
              const isHovered = hoveredSeriesId === series.id;
              return (
                <div
                  key={series.id}
                  className="dusk-series-row"
                  onMouseEnter={() => setHoveredSeriesId(series.id)}
                  onMouseLeave={() => setHoveredSeriesId(null)}
                >
                  <Link to={`/works/${series.id}`} className="dusk-series-row-link">
                    <span className="dusk-series-row-num">{series.number}</span>
                    <div className="dusk-series-row-main">
                      <h3 className="dusk-series-row-title">{series.title}</h3>
                      <p className="dusk-series-row-theme">{series.theme}</p>
                    </div>
                    <div className="dusk-series-row-arrow">
                      <span>ENTER SERIES</span>
                      <ArrowRight size={15} />
                    </div>
                  </Link>

                  {/* Desktop Hover Floating Preview Image */}
                  <AnimatePresence>
                    {isHovered && series.previewImage && (
                      <motion.div
                        className="dusk-series-hover-float"
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        transition={{ duration: 0.25, ease: 'easeOut' }}
                      >
                        <img src={series.previewImage} alt={series.title} />
                      </motion.div>
                    )}
                  </AnimatePresence>

                  {/* Mobile Stacked Preview */}
                  <div className="dusk-series-mobile-thumb">
                    <img src={series.previewImage} alt={series.title} loading="lazy" />
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* ═══════════════════════════════════════════════════════════
            5. PROCESS OR TEXTURE MOMENT: FULL-BLEED MACRO CROP
            Materiality Emphasis with Short Curatorial Caption
            ═══════════════════════════════════════════════════════════ */}
        <section className="dusk-brief-texture-moment" aria-label="Texture & Materiality">
          <div className="dusk-texture-viewport">
            <img
              src="https://images.unsplash.com/photo-1579783902614-a3fb3927b675?w=1600&auto=format&fit=crop&q=85"
              alt="Full-bleed macro crop of dry-brush gouache and charcoal wash on cotton rag"
              className="dusk-texture-img breathing-artwork"
              loading="lazy"
            />
            <div className="dusk-texture-overlay-caption">
              <span className="dusk-texture-badge">03 / MATERIALITY</span>
              <p className="dusk-texture-caption">
                Layered charcoal wash and dry-brush gouache grain on 300gsm cold-pressed cotton rag.
              </p>
              <span className="dusk-texture-sub">
                Raw umber washes & Japanese hake brush textures.
              </span>
            </div>
          </div>
        </section>

        {/* ═══════════════════════════════════════════════════════════
            6. INQUIRY CTA: CALM INVITATION TO INQUIRE
            Linking to /contact & Direct Communication
            ═══════════════════════════════════════════════════════════ */}
        <section className="dusk-brief-inquiry" aria-label="Inquiries and Dialogue">
          <div className="dusk-inquiry-box">
            <span className="dusk-section-subhead">04 / DIALOGUE</span>
            <h2 className="dusk-inquiry-title">Initiate an Inquiry</h2>
            <p className="dusk-inquiry-text">
              The studio welcomes inquiries for original artwork acquisitions, publishing commissions, and exhibition loans.
            </p>
            <div className="dusk-inquiry-button-row">
              <Link to="/contact" className="btn-dusk btn-dusk--primary">
                <span>COMMISSION OR ACQUIRE</span>
                <ArrowRight size={15} />
              </Link>
              {settings.email && (
                <a href={`mailto:${settings.email}`} className="btn-dusk btn-dusk--outline">
                  <span>{settings.email}</span>
                </a>
              )}
            </div>

            <div className="dusk-client-marquee">
              <span className="dusk-client-marquee-label">SELECTED CLIENTS</span>
              <p className="dusk-client-marquee-list">
                Penguin Random House • The New Yorker • The Folio Society • Faber & Faber • The Atlantic • Granta
              </p>
            </div>
          </div>
        </section>
      </main>

      {/* ═══════════════════════════════════════════════════════════
          7. FOOTER: CONTACT, INSTAGRAM, COPYRIGHT
          ═══════════════════════════════════════════════════════════ */}
      <Footer />
    </div>
  );
}
