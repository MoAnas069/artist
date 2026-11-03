import { useEffect, useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { motion, AnimatePresence } from 'framer-motion';
import { Maximize2, ArrowRight } from 'lucide-react';
import { getPublishedArtworks } from '../../services/artworkService';
import type { Artwork } from '../../types';
import { useSiteSettings } from '../../hooks/useSiteSettings';
import Navbar from '../../components/layout/Navbar';
import Footer from '../../components/layout/Footer';
import LoadingState from '../../components/ui/LoadingState';
import ArtworkLightbox from '../../components/lightbox/ArtworkLightbox';
import ConstellationThreads from '../../components/threads/ConstellationThreads';
import inventoryData from '../../../content/inventory.json';

export default function Work() {
  const { settings } = useSiteSettings();
  const [artworks, setArtworks] = useState<Artwork[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedFilter, setSelectedFilter] = useState<string>('All');
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  useEffect(() => {
    let mounted = true;
    getPublishedArtworks()
      .then((data) => {
        if (!mounted) return;
        setArtworks(data.length > 0 ? data : (inventoryData.artworks as any));
      })
      .catch(() => {
        if (mounted) setArtworks(inventoryData.artworks as any);
      })
      .finally(() => {
        if (mounted) setLoading(false);
      });
    return () => {
      mounted = false;
    };
  }, []);

  const filters = useMemo(() => {
    const cats = Array.from(new Set(artworks.map((a) => a.category).filter(Boolean)));
    return ['All', ...cats];
  }, [artworks]);

  const filteredArtworks = useMemo(() => {
    if (selectedFilter === 'All') return artworks;
    return artworks.filter((a) => a.category === selectedFilter);
  }, [artworks, selectedFilter]);

  if (loading) return <LoadingState />;

  return (
    <div className="dusk-page">
      <Helmet>
        <title>{`Works & Series Archive — ${settings.artistName || 'Chintwo'}`}</title>
        <meta
          name="description"
          content="The salon archive of Chintwo. Atmospheric paintings, gouache monoprints, and chiaroscuro narrative illustrations."
        />
      </Helmet>

      <Navbar />

      <main id="main-content" className="dusk-salon-page">
        {/* Header Strip */}
        <section className="dusk-salon-header">
          <div className="dusk-section-index-badge">
            <span className="badge-num">01</span>
            <span className="badge-text">SERIES INDEX</span>
          </div>

          <div className="dusk-salon-title-row">
            <h1 className="dusk-salon-title">The Salon Archive</h1>
            <p className="dusk-salon-lead">
              A chronological hang of paintings and studies exploring quiet rooms, desolate coastlines, and ancestral cartography.
            </p>
          </div>

          {/* Filter Pills */}
          <div className="dusk-salon-filter-bar">
            <div className="dusk-filter-pills" role="tablist" aria-label="Artwork categories">
              {filters.map((filter) => (
                <button
                  key={filter}
                  type="button"
                  role="tab"
                  aria-selected={selectedFilter === filter}
                  onClick={() => setSelectedFilter(filter)}
                  className={`dusk-filter-pill ${selectedFilter === filter ? 'active' : ''}`}
                >
                  {filter.toUpperCase()}
                </button>
              ))}
            </div>

            <span className="dusk-salon-count">
              {filteredArtworks.length} {filteredArtworks.length === 1 ? 'WORK' : 'WORKS'}
            </span>
          </div>

          {/* Interactive Constellation Network */}
          <ConstellationThreads />
        </section>

        {/* Asymmetrical Salon Hang */}
        <section className="dusk-salon-hang" aria-label="Artwork Gallery">
          <div className="dusk-salon-grid">
            <AnimatePresence mode="popLayout">
              {filteredArtworks.map((artwork, index) => {
                // Varied rhythm pattern for intentional salon cadence
                const rhythmClass = `dusk-salon-tile--${(index % 4) + 1}`;

                return (
                  <motion.article
                    key={artwork.id}
                    layout
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.96 }}
                    transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                    className={`dusk-salon-tile ${rhythmClass}`}
                  >
                    <div className="dusk-salon-frame breathing-artwork">
                      <Link to={`/work/${artwork.slug}`} className="dusk-salon-img-link">
                        <img
                          src={artwork.coverImage || (artwork.images && artwork.images[0])}
                          alt={artwork.title}
                          loading="lazy"
                          className="dusk-salon-img"
                        />
                      </Link>

                      {/* Zoom Lightbox Trigger */}
                      <button
                        type="button"
                        onClick={() => setLightboxIndex(index)}
                        className="dusk-salon-zoom-btn"
                        title="Open deep zoom"
                        aria-label={`Zoom view of ${artwork.title}`}
                      >
                        <Maximize2 size={14} />
                      </button>
                    </div>

                    <div className="dusk-salon-meta">
                      <div className="dusk-salon-meta-top">
                        <span className="dusk-salon-year">{artwork.year}</span>
                        <span className="dusk-salon-category">{artwork.category}</span>
                      </div>

                      <h2 className="dusk-salon-item-title">
                        <Link to={`/work/${artwork.slug}`}>{artwork.title}</Link>
                      </h2>

                      <p className="dusk-salon-medium">{artwork.medium}</p>
                      {artwork.dimensions && (
                        <p className="dusk-salon-dims">{artwork.dimensions}</p>
                      )}

                      <div className="dusk-salon-tile-footer">
                        <span className="dusk-salon-status">
                          {artwork.credits || 'Studio Archive'}
                        </span>
                        <Link
                          to={`/work/${artwork.slug}`}
                          className="dusk-salon-detail-link"
                          aria-label={`View details of ${artwork.title}`}
                        >
                          <span>DETAILS</span>
                          <ArrowRight size={12} />
                        </Link>
                      </div>
                    </div>
                  </motion.article>
                );
              })}
            </AnimatePresence>
          </div>
        </section>
      </main>

      {/* Accessible Full-Screen Zoom Lightbox */}
      {lightboxIndex !== null && (
        <ArtworkLightbox
          artworks={filteredArtworks}
          currentIndex={lightboxIndex}
          isOpen={lightboxIndex !== null}
          onClose={() => setLightboxIndex(null)}
          onSelectIndex={setLightboxIndex}
        />
      )}

      <Footer />
    </div>
  );
}
