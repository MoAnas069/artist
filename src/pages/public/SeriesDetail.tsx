import { useState, useMemo } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { ArrowLeft, ArrowRight, Maximize2 } from 'lucide-react';
import { useSiteSettings } from '../../hooks/useSiteSettings';
import Navbar from '../../components/layout/Navbar';
import Footer from '../../components/layout/Footer';
import ArtworkLightbox from '../../components/lightbox/ArtworkLightbox';
import inventoryData from '../../../content/inventory.json';
import type { Artwork } from '../../types';

export default function SeriesDetail() {
  const { series: seriesId } = useParams<{ series: string }>();
  const navigate = useNavigate();
  const { settings } = useSiteSettings();
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  const seriesList = inventoryData.series;
  const currentSeriesIndex = seriesList.findIndex((s) => s.id === seriesId);
  const currentSeries = seriesList[currentSeriesIndex] || seriesList[0];

  const seriesArtworks = useMemo(() => {
    return (inventoryData.artworks as any[]).filter(
      (a) => a.seriesId === currentSeries.id
    );
  }, [currentSeries.id]);

  const prevSeries = currentSeriesIndex > 0 ? seriesList[currentSeriesIndex - 1] : null;
  const nextSeries = currentSeriesIndex < seriesList.length - 1 ? seriesList[currentSeriesIndex + 1] : null;

  return (
    <div className="dusk-page">
      <Helmet>
        <title>{`${currentSeries.title} — Series ${currentSeries.number} | ${settings.artistName || 'Chintwo'}`}</title>
        <meta name="description" content={currentSeries.theme} />
      </Helmet>

      <Navbar />

      <main id="main-content" className="dusk-series-detail-page">
        {/* Navigation Breadcrumb */}
        <div className="dusk-detail-breadcrumb">
          <Link to="/works" className="dusk-back-link">
            <ArrowLeft size={14} />
            <span>BACK TO ALL SERIES</span>
          </Link>

          <div className="dusk-detail-paging">
            {prevSeries ? (
              <Link to={`/works/${prevSeries.id}`} className="dusk-page-btn" title={prevSeries.title}>
                ← PREV SERIES
              </Link>
            ) : (
              <span className="dusk-page-btn disabled">← PREV SERIES</span>
            )}
            <span className="dusk-paging-sep">/</span>
            {nextSeries ? (
              <Link to={`/works/${nextSeries.id}`} className="dusk-page-btn" title={nextSeries.title}>
                NEXT SERIES →
              </Link>
            ) : (
              <span className="dusk-page-btn disabled">NEXT SERIES →</span>
            )}
          </div>
        </div>

        {/* Series Header */}
        <section className="dusk-series-header">
          <div className="dusk-section-index-badge">
            <span className="badge-num">{currentSeries.number}</span>
            <span className="badge-text">SERIES CYCLE</span>
          </div>
          <h1 className="dusk-series-title">{currentSeries.title}</h1>
          <p className="dusk-series-theme">{currentSeries.theme}</p>
        </section>

        {/* Masonry / Editorial Gallery */}
        <section className="dusk-series-artworks" aria-label={`Artworks in ${currentSeries.title}`}>
          <div className="dusk-series-grid">
            {seriesArtworks.map((artwork, idx) => (
              <article key={artwork.id} className="dusk-series-art-card">
                <div className="dusk-series-art-frame breathing-artwork">
                  <Link to={`/work/${artwork.slug}`}>
                    <img
                      src={artwork.coverImage}
                      alt={artwork.title}
                      loading="lazy"
                      className="dusk-series-art-img"
                    />
                  </Link>
                  <button
                    type="button"
                    onClick={() => setLightboxIndex(idx)}
                    className="dusk-salon-zoom-btn"
                    title="Open deep zoom"
                    aria-label={`Zoom view of ${artwork.title}`}
                  >
                    <Maximize2 size={14} />
                  </button>
                </div>

                <div className="dusk-series-art-info">
                  <div className="dusk-series-art-meta">
                    <span className="dusk-art-year">{artwork.year}</span>
                    <span className="dusk-art-medium">{artwork.medium}</span>
                  </div>
                  <h2 className="dusk-art-title">
                    <Link to={`/work/${artwork.slug}`}>{artwork.title}</Link>
                  </h2>
                  <p className="dusk-art-dims">{artwork.dimensions}</p>
                  <div className="dusk-art-foot">
                    <span className="dusk-art-status">{artwork.availability || 'Studio Archive'}</span>
                    <Link to={`/work/${artwork.slug}`} className="dusk-art-link">
                      <span>EXPLORE</span>
                      <ArrowRight size={12} />
                    </Link>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </section>
      </main>

      {/* Accessible Lightbox Modal */}
      {lightboxIndex !== null && (
        <ArtworkLightbox
          artworks={seriesArtworks as any}
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
