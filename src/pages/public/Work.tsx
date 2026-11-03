import { useEffect, useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { motion, AnimatePresence } from 'framer-motion';
import { getPublishedArtworks } from '../../services/artworkService';
import type { Artwork } from '../../types';
import { useSiteSettings } from '../../hooks/useSiteSettings';
import Navbar from '../../components/layout/Navbar';
import Footer from '../../components/layout/Footer';
import LoadingState from '../../components/ui/LoadingState';
import EmptyState from '../../components/ui/EmptyState';

export default function Work() {
  const { settings } = useSiteSettings();
  const [artworks, setArtworks] = useState<Artwork[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<string>('All');

  useEffect(() => {
    getPublishedArtworks()
      .then(setArtworks)
      .catch((err) => console.error('Error fetching artworks:', err))
      .finally(() => setLoading(false));
  }, []);

  // Compute unique categories
  const categories = useMemo(() => {
    const cats = Array.from(new Set(artworks.map((a) => a.category).filter(Boolean)));
    return ['All', ...cats];
  }, [artworks]);

  // Filter artworks
  const filteredArtworks = useMemo(() => {
    if (selectedCategory === 'All') return artworks;
    return artworks.filter((a) => a.category === selectedCategory);
  }, [artworks, selectedCategory]);

  if (loading) return <LoadingState />;

  return (
    <div className="page-wrap">
      <Helmet>
        <title>{`The Work — Artwork Archive | ${settings.artistName || 'CHINTWO'}`}</title>
        <meta
          name="description"
          content={`Explore the curated artwork archive and portfolio of ${settings.artistName || 'CHINTWO'}. Narrative illustrations, original paintings, and experimental visual studies.`}
        />
      </Helmet>

      <Navbar />

      <main id="main-content" className="page-content">
        {/* Header Section */}
        <section className="section" style={{ paddingBottom: 'clamp(2rem, 4vw, 3rem)' }}>
          <div className="container">
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'baseline',
                borderBottom: '1px solid var(--color-border)',
                paddingBottom: '0.75rem',
                marginBottom: 'clamp(2rem, 4vw, 3.5rem)',
              }}
            >
              <span className="type-meta">01 / ARCHIVE &amp; MONOGRAPHS</span>
              <span className="type-meta">{artworks.length} CATALOGUED WORKS</span>
            </div>

            <div className="page-header-grid">
              <div className="page-header-grid__title">
                <h1 className="type-display-hero">The Work</h1>
              </div>
              <div className="page-header-grid__desc">
                <p className="type-editorial" style={{ color: 'var(--color-stone)' }}>
                  A visual archive of narrative compositions, ink experiments, and atmospheric studies created between 2021 and present.
                </p>
              </div>
            </div>

            {/* Category Filter Pills */}
            {categories.length > 2 && (
              <div className="filter-bar">
                {categories.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setSelectedCategory(cat)}
                    className={`filter-btn ${selectedCategory === cat ? 'filter-btn--active' : 'filter-btn--inactive'}`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            )}
          </div>
        </section>

        {/* Artwork Archive Grid */}
        <section style={{ paddingBottom: 'clamp(5rem, 10vh, 8rem)' }}>
          <div className="container">
            {filteredArtworks.length === 0 ? (
              <EmptyState
                title="No works found"
                description={`There are currently no published works under "${selectedCategory}".`}
              />
            ) : (
              <motion.div
                layout
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(12, 1fr)',
                  gap: 'clamp(1.5rem, 3.5vw, 3.5rem)',
                  rowGap: 'clamp(3.5rem, 7vw, 6rem)',
                }}
              >
                <AnimatePresence>
                  {filteredArtworks.map((art, idx) => {
                    // Asymmetric grid layout assignment
                    // Repeats in varied rhythms of 7+5, 4+4+4, 6+6, 5+7
                    const patternIndex = idx % 6;
                    let colSpan = 'span 6';
                    let aspectRatio = '4 / 3';
                    let marginTop = '0';

                    if (patternIndex === 0) {
                      colSpan = 'span 7';
                      aspectRatio = '16 / 11';
                    } else if (patternIndex === 1) {
                      colSpan = 'span 5';
                      aspectRatio = '3 / 4';
                      marginTop = 'clamp(0rem, 4vw, 3.5rem)';
                    } else if (patternIndex === 2) {
                      colSpan = 'span 4';
                      aspectRatio = '1 / 1';
                    } else if (patternIndex === 3) {
                      colSpan = 'span 4';
                      aspectRatio = '4 / 5';
                      marginTop = 'clamp(0rem, 3vw, 2.5rem)';
                    } else if (patternIndex === 4) {
                      colSpan = 'span 4';
                      aspectRatio = '4 / 3';
                    } else if (patternIndex === 5) {
                      colSpan = 'span 8';
                      aspectRatio = '16 / 9';
                    }

                    return (
                      <motion.div
                        key={art.id}
                        layout
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                        style={{
                          gridColumn: colSpan,
                          marginTop: marginTop,
                        }}
                      >
                        <Link to={`/work/${art.slug}`} className="artwork-card" style={{ display: 'block' }} data-cursor="View">
                          <div
                            className="artwork-card__image-wrap"
                            style={{
                              aspectRatio: aspectRatio,
                            }}
                          >
                            <img
                              src={art.coverImage}
                              alt={art.title}
                              className="artwork-card__image"
                              loading="lazy"
                              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                            />
                          </div>
                          <div className="artwork-card__meta">
                            <div>
                              <h2 className="artwork-card__title" style={{ fontSize: '1.2rem' }}>
                                {art.title}
                              </h2>
                              <span className="type-meta-sm" style={{ color: 'var(--color-stone)' }}>
                                {art.category} • {art.medium}
                              </span>
                            </div>
                            <span className="artwork-card__year">{art.year}</span>
                          </div>
                        </Link>
                      </motion.div>
                    );
                  })}
                </AnimatePresence>
              </motion.div>
            )}
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
