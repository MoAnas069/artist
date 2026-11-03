import { useEffect, useState, useMemo } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import { ArrowLeft, ArrowRight, Maximize2, Mail, Sparkles, ShoppingBag } from 'lucide-react';
import { getArtworkBySlug, getPublishedArtworks } from '../../services/artworkService';
import type { Artwork } from '../../types';
import { useSiteSettings } from '../../hooks/useSiteSettings';
import { useCart } from '../../context/CartContext';
import Navbar from '../../components/layout/Navbar';
import Footer from '../../components/layout/Footer';
import LoadingState from '../../components/ui/LoadingState';
import ArtworkLightbox from '../../components/lightbox/ArtworkLightbox';
import inventoryData from '../../../content/inventory.json';
import threadsData from '../../../content/threads.json';

export default function WorkDetail() {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const { settings } = useSiteSettings();
  const { addItem } = useCart();
  const [artwork, setArtwork] = useState<Artwork | null>(null);
  const [allArtworks, setAllArtworks] = useState<Artwork[]>([]);
  const [activeImage, setActiveImage] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);

  useEffect(() => {
    if (!slug) return;
    setLoading(true);

    Promise.all([getArtworkBySlug(slug), getPublishedArtworks()])
      .then(([foundArtwork, artworksList]) => {
        const fallbackList = inventoryData.artworks as any;
        const list = artworksList.length > 0 ? artworksList : fallbackList;
        const target = foundArtwork || list.find((a: any) => a.slug === slug);

        if (!target) {
          navigate('/works', { replace: true });
          return;
        }

        setArtwork(target);
        setActiveImage(target.coverImage || (target.images && target.images[0]));
        setAllArtworks(list);
      })
      .catch(() => {
        const fallbackList = inventoryData.artworks as any;
        const target = fallbackList.find((a: any) => a.slug === slug);
        if (target) {
          setArtwork(target);
          setActiveImage(target.coverImage);
          setAllArtworks(fallbackList);
        } else {
          navigate('/works', { replace: true });
        }
      })
      .finally(() => setLoading(false));
  }, [slug, navigate]);

  // Find related memory threads
  const relatedThreads = useMemo(() => {
    if (!artwork) return [];
    return threadsData.threads.filter((t) => t.artworkIds.includes(artwork.id));
  }, [artwork]);

  // Related artworks driven by shared threads
  const relatedArtworks = useMemo(() => {
    if (!artwork) return [];
    const relatedIds = new Set<string>();
    relatedThreads.forEach((t) => {
      t.artworkIds.forEach((id) => {
        if (id !== artwork.id) relatedIds.add(id);
      });
    });

    return allArtworks.filter((a) => relatedIds.has(a.id)).slice(0, 3);
  }, [artwork, relatedThreads, allArtworks]);

  if (loading || !artwork) return <LoadingState />;

  const currentIndex = allArtworks.findIndex((a) => a.id === artwork.id);
  const prevArtwork = currentIndex > 0 ? allArtworks[currentIndex - 1] : null;
  const nextArtwork = currentIndex < allArtworks.length - 1 ? allArtworks[currentIndex + 1] : null;

  const galleryImages = [
    artwork.coverImage,
    ...(artwork.images || []).filter((img) => img !== artwork.coverImage),
    ...(artwork.processImages || []),
  ].filter(Boolean);

  const matchedPrint = (inventoryData.prints as any[]).find(
    (p) => p.artworkId === artwork.id || p.title.toLowerCase().includes(artwork.title.toLowerCase())
  );

  return (
    <div className="dusk-page">
      <Helmet>
        <title>{`${artwork.title} (${artwork.year}) — ${settings.artistName || 'Chintwo'}`}</title>
        <meta name="description" content={artwork.description || artwork.medium} />
        <meta property="og:title" content={`${artwork.title} — Chintwo`} />
        <meta property="og:description" content={artwork.description || artwork.medium} />
        {artwork.coverImage && <meta property="og:image" content={artwork.coverImage} />}
      </Helmet>

      <Navbar />

      <main id="main-content" className="dusk-detail-page">
        {/* Editorial Top Navigation */}
        <div className="dusk-detail-breadcrumb">
          <Link to="/works" className="dusk-back-link">
            <ArrowLeft size={14} />
            <span>BACK TO SALON INDEX</span>
          </Link>

          <div className="dusk-detail-paging">
            {prevArtwork ? (
              <Link to={`/work/${prevArtwork.slug}`} className="dusk-page-btn" title={prevArtwork.title}>
                ← PREV
              </Link>
            ) : (
              <span className="dusk-page-btn disabled">← PREV</span>
            )}
            <span className="dusk-paging-sep">/</span>
            {nextArtwork ? (
              <Link to={`/work/${nextArtwork.slug}`} className="dusk-page-btn" title={nextArtwork.title}>
                NEXT →
              </Link>
            ) : (
              <span className="dusk-page-btn disabled">NEXT →</span>
            )}
          </div>
        </div>

        {/* 2-Column Split: Image Canvas & Curatorial Provenance */}
        <div className="dusk-detail-layout">
          {/* Main Artwork Stage */}
          <section className="dusk-detail-stage" aria-label="Artwork View">
            <div className="dusk-detail-frame breathing-artwork">
              <img
                src={activeImage}
                alt={artwork.title}
                className="dusk-detail-img"
                onClick={() => setIsLightboxOpen(true)}
              />

              <button
                type="button"
                onClick={() => setIsLightboxOpen(true)}
                className="dusk-detail-zoom-trigger"
                title="Deep zoom"
                aria-label="Open detailed zoom"
              >
                <Maximize2 size={16} />
                <span>EXPAND FULL VIEW</span>
              </button>
            </div>

            {/* Thumbnail switcher if multiple images */}
            {galleryImages.length > 1 && (
              <div className="dusk-detail-thumbs">
                {galleryImages.map((img, i) => (
                  <button
                    key={i}
                    type="button"
                    onClick={() => setActiveImage(img)}
                    className={`dusk-thumb-btn ${activeImage === img ? 'active' : ''}`}
                    aria-label={`View image study ${i + 1}`}
                  >
                    <img src={img} alt="" />
                  </button>
                ))}
              </div>
            )}
          </section>

          {/* Curatorial Provenance Sidebar */}
          <aside className="dusk-detail-sidebar" aria-label="Artwork Provenance">
            <div className="dusk-provenance-head">
              <div className="dusk-section-index-badge">
                <span className="badge-num">{artwork.year}</span>
                <span className="badge-text">{artwork.category || 'ORIGINAL'}</span>
              </div>
              <h1 className="dusk-detail-title">{artwork.title}</h1>
            </div>

            {/* Specifications Matrix */}
            <dl className="dusk-spec-matrix">
              <div className="dusk-spec-row">
                <dt>MEDIUM</dt>
                <dd>{artwork.medium || 'Gouache & Monoprint on archival paper'}</dd>
              </div>

              {artwork.dimensions && (
                <div className="dusk-spec-row">
                  <dt>DIMENSIONS</dt>
                  <dd>{artwork.dimensions}</dd>
                </div>
              )}

              <div className="dusk-spec-row">
                <dt>STATUS / PROVENANCE</dt>
                <dd className="dusk-provenance-status">
                  <span className="status-indicator-dot" />
                  {artwork.credits || 'Studio Archive — Available for Acquisition'}
                </dd>
              </div>
            </dl>

            {/* Description & Artist Notes */}
            {artwork.description && (
              <div className="dusk-provenance-desc">
                <h3 className="dusk-desc-title">CURATORIAL NOTE</h3>
                <p>{artwork.description}</p>
              </div>
            )}

            {artwork.artistNotes && (
              <div className="dusk-provenance-notes">
                <h3 className="dusk-desc-title">ARTIST TECHNIQUE</h3>
                <p>“{artwork.artistNotes}”</p>
              </div>
            )}

            {/* Memory / Myth Threads Linked */}
            {relatedThreads.length > 0 && (
              <div className="dusk-detail-threads">
                <div className="dusk-threads-label">
                  <Sparkles size={13} />
                  <span>CONSTELLATION THREADS</span>
                </div>
                <div className="dusk-threads-tags">
                  {relatedThreads.map((thread) => (
                    <span key={thread.id} className="dusk-thread-tag">
                      <span className="thread-tag-dot" style={{ backgroundColor: thread.color }} />
                      {thread.name}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Acquisition & Inquiry Actions */}
            <div className="dusk-detail-actions">
              <Link
                to={`/contact?ref=${encodeURIComponent(`Artwork Acquisition: ${artwork.title} (${artwork.year})`)}`}
                className="btn-dusk btn-dusk--primary dusk-inquire-btn"
              >
                <Mail size={15} />
                <span>ENQUIRE ABOUT THIS WORK</span>
              </Link>

              {matchedPrint && (
                <button
                  type="button"
                  onClick={() => addItem(matchedPrint)}
                  className="btn-dusk btn-dusk--outline"
                >
                  <ShoppingBag size={14} />
                  <span>RESERVE LIMITED PRINT (£{matchedPrint.price})</span>
                </button>
              )}
            </div>
          </aside>
        </div>

        {/* Related Works Row (Driven by Memory / Myth Threads) */}
        {relatedArtworks.length > 0 && (
          <section className="dusk-related-section" aria-label="Thematically Related Works">
            <div className="dusk-related-header">
              <div className="dusk-section-index-badge">
                <span className="badge-num">RELATED</span>
                <span className="badge-text">MEMORY THREADS</span>
              </div>
              <h2 className="dusk-related-title">Kinship in Pigment & Motif</h2>
            </div>

            <div className="dusk-related-grid">
              {relatedArtworks.map((item) => (
                <article key={item.id} className="dusk-related-card">
                  <Link to={`/work/${item.slug}`} className="dusk-related-link">
                    <div className="dusk-related-thumb breathing-artwork">
                      <img src={item.coverImage} alt={item.title} loading="lazy" />
                    </div>
                    <div className="dusk-related-meta">
                      <span className="dusk-related-year">{item.year}</span>
                      <h3 className="dusk-related-item-title">{item.title}</h3>
                      <p className="dusk-related-medium">{item.medium}</p>
                    </div>
                  </Link>
                </article>
              ))}
            </div>
          </section>
        )}
      </main>

      {/* Zoom Lightbox */}
      {isLightboxOpen && (
        <ArtworkLightbox
          artworks={allArtworks}
          currentIndex={currentIndex >= 0 ? currentIndex : 0}
          isOpen={isLightboxOpen}
          onClose={() => setIsLightboxOpen(false)}
          onSelectIndex={(idx) => {
            const next = allArtworks[idx];
            if (next) navigate(`/work/${next.slug}`);
          }}
        />
      )}

      <Footer />
    </div>
  );
}
