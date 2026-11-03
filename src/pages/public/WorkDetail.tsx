import { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { motion, AnimatePresence } from 'framer-motion';
import { getArtworkBySlug, getPublishedArtworks } from '../../services/artworkService';
import type { Artwork } from '../../types';
import { useSiteSettings } from '../../hooks/useSiteSettings';
import Navbar from '../../components/layout/Navbar';
import Footer from '../../components/layout/Footer';
import LoadingState from '../../components/ui/LoadingState';

export default function WorkDetail() {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const { settings } = useSiteSettings();
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
        if (!foundArtwork) {
          navigate('/work', { replace: true });
          return;
        }
        setArtwork(foundArtwork);
        setActiveImage(foundArtwork.coverImage);
        setAllArtworks(artworksList);
      })
      .catch((err) => {
        console.error('Error fetching artwork detail:', err);
        navigate('/work', { replace: true });
      })
      .finally(() => setLoading(false));
  }, [slug, navigate]);

  if (loading || !artwork) return <LoadingState />;

  // Prev / Next navigation
  const currentIndex = allArtworks.findIndex((a) => a.id === artwork.id);
  const prevArtwork = currentIndex > 0 ? allArtworks[currentIndex - 1] : null;
  const nextArtwork = currentIndex < allArtworks.length - 1 ? allArtworks[currentIndex + 1] : null;

  // Related artworks
  const relatedArtworks = allArtworks
    .filter((a) => a.id !== artwork.id && (a.category === artwork.category || Math.abs(a.year - artwork.year) <= 1))
    .slice(0, 3);

  const allDisplayImages = [
    artwork.coverImage,
    ...(artwork.images || []).filter((img) => img !== artwork.coverImage),
    ...(artwork.processImages || []),
  ];

  return (
    <div className="page-wrap">
      <Helmet>
        <title>{`${artwork.title} (${artwork.year}) — ${settings.artistName || 'CHINTWO'}`}</title>
        <meta
          name="description"
          content={`${artwork.title}, ${artwork.year}. ${artwork.medium}. ${artwork.description || ''}`}
        />
        <meta property="og:title" content={`${artwork.title} — ${settings.artistName || 'CHINTWO'}`} />
        <meta property="og:image" content={artwork.coverImage} />
      </Helmet>

      <Navbar />

      <main id="main-content" className="page-content">
        {/* Monograph Top Navigation Bar */}
        <div style={{ borderBottom: '1px solid var(--color-border)', backgroundColor: 'var(--color-bg)' }}>
          <div className="container">
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                padding: '1rem 0',
              }}
            >
              <Link
                to="/work"
                className="link-underline"
                style={{
                  fontFamily: 'var(--font-mono)',
                  fontSize: '0.6875rem',
                  letterSpacing: '0.12em',
                  textTransform: 'uppercase',
                }}
              >
                ← Return to Archive
              </Link>

              <div style={{ display: 'flex', gap: '1.5rem', alignItems: 'center' }}>
                {prevArtwork && (
                  <Link
                    to={`/work/${prevArtwork.slug}`}
                    className="link-underline"
                    style={{
                      fontFamily: 'var(--font-mono)',
                      fontSize: '0.6875rem',
                      letterSpacing: '0.12em',
                      textTransform: 'uppercase',
                    }}
                  >
                    ← Previous
                  </Link>
                )}
                <span className="type-meta-sm">
                  {currentIndex + 1} / {allArtworks.length}
                </span>
                {nextArtwork && (
                  <Link
                    to={`/work/${nextArtwork.slug}`}
                    className="link-underline"
                    style={{
                      fontFamily: 'var(--font-mono)',
                      fontSize: '0.6875rem',
                      letterSpacing: '0.12em',
                      textTransform: 'uppercase',
                    }}
                  >
                    Next →
                  </Link>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Monograph Main Section */}
        <section className="section" style={{ paddingTop: 'clamp(2rem, 5vh, 4rem)' }}>
          <div className="container">
            <div className="editorial-split-7-5">
              {/* Left 7 Cols: Large Artwork Viewer */}
              <div className="editorial-split-7-5__main">
                <div
                  style={{
                    backgroundColor: 'var(--color-bg-alt)',
                    position: 'relative',
                    cursor: 'zoom-in',
                    overflow: 'hidden',
                    boxShadow: '0 8px 30px rgba(0,0,0,0.04)',
                  }}
                  onClick={() => setIsLightboxOpen(true)}
                  title="Click to view full screen"
                >
                  <img
                    src={activeImage || artwork.coverImage}
                    alt={artwork.title}
                    style={{
                      width: '100%',
                      maxHeight: '80vh',
                      objectFit: 'contain',
                      display: 'block',
                      margin: '0 auto',
                    }}
                  />
                  <div
                    style={{
                      position: 'absolute',
                      bottom: '1rem',
                      right: '1rem',
                      backgroundColor: 'rgba(255,255,255,0.85)',
                      backdropFilter: 'blur(4px)',
                      padding: '0.35rem 0.65rem',
                      borderRadius: '4px',
                      fontFamily: 'var(--font-mono)',
                      fontSize: '0.625rem',
                      letterSpacing: '0.1em',
                      textTransform: 'uppercase',
                    }}
                  >
                    Click to Zoom ⤢
                  </div>
                </div>

                {/* Additional Images / Process Studies Strip */}
                {allDisplayImages.length > 1 && (
                  <div style={{ marginTop: '1.5rem' }}>
                    <span className="type-meta-sm" style={{ display: 'block', marginBottom: '0.75rem' }}>
                      Additional Views &amp; Studies ({allDisplayImages.length})
                    </span>
                    <div style={{ display: 'flex', gap: '0.75rem', overflowX: 'auto', paddingBottom: '0.5rem' }}>
                      {allDisplayImages.map((img, i) => (
                        <button
                          key={i}
                          onClick={() => setActiveImage(img)}
                          style={{
                            width: '80px',
                            height: '80px',
                            flexShrink: 0,
                            border: activeImage === img ? '2px solid var(--color-charcoal)' : '1px solid var(--color-border)',
                            padding: 0,
                            overflow: 'hidden',
                            backgroundColor: 'var(--color-bg-alt)',
                            cursor: 'pointer',
                          }}
                        >
                          <img
                            src={img}
                            alt={`${artwork.title} study ${i + 1}`}
                            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                          />
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Right 5 Cols: Monograph Documentation & Specs */}
              <div className="editorial-split-7-5__side">
                <span className="type-meta" style={{ display: 'block', marginBottom: '0.5rem' }}>
                  CATALOGUE NO. #{artwork.id.slice(0, 8).toUpperCase()} • {artwork.category}
                </span>

                <h1 className="type-display-xl" style={{ marginBottom: '0.5rem', lineHeight: 1.05 }}>
                  {artwork.title}
                </h1>
                <p className="type-meta" style={{ color: 'var(--color-stone)', marginBottom: '2rem' }}>
                  {artwork.year}
                </p>

                {/* Spec Sheet Table */}
                <div
                  style={{
                    borderTop: '1px solid var(--color-border)',
                    borderBottom: '1px solid var(--color-border)',
                    padding: '1.5rem 0',
                    marginBottom: '2rem',
                  }}
                >
                  <dl
                    style={{
                      display: 'grid',
                      gridTemplateColumns: '120px 1fr',
                      rowGap: '0.85rem',
                      fontSize: '0.875rem',
                    }}
                  >
                    <dt className="type-meta-sm" style={{ color: 'var(--color-muted)' }}>
                      Medium
                    </dt>
                    <dd style={{ color: 'var(--color-charcoal)' }}>{artwork.medium || 'Mixed Media'}</dd>

                    {artwork.dimensions && (
                      <>
                        <dt className="type-meta-sm" style={{ color: 'var(--color-muted)' }}>
                          Dimensions
                        </dt>
                        <dd style={{ color: 'var(--color-charcoal)' }}>{artwork.dimensions}</dd>
                      </>
                    )}

                    <dt className="type-meta-sm" style={{ color: 'var(--color-muted)' }}>
                      Category
                    </dt>
                    <dd style={{ color: 'var(--color-charcoal)' }}>{artwork.category}</dd>

                    {artwork.credits && (
                      <>
                        <dt className="type-meta-sm" style={{ color: 'var(--color-muted)' }}>
                          Provenance
                        </dt>
                        <dd style={{ color: 'var(--color-charcoal)' }}>{artwork.credits}</dd>
                      </>
                    )}
                  </dl>
                </div>

                {/* Artist Description */}
                {artwork.description && (
                  <div style={{ marginBottom: '2rem' }}>
                    <h2 className="type-meta-sm" style={{ marginBottom: '0.75rem', color: 'var(--color-charcoal)' }}>
                      Artwork Overview
                    </h2>
                    <p className="type-reading" style={{ color: 'var(--color-ink)', lineHeight: 1.8 }}>
                      {artwork.description}
                    </p>
                  </div>
                )}

                {/* Artist Notes / Process */}
                {artwork.artistNotes && (
                  <div
                    style={{
                      backgroundColor: 'var(--color-surface)',
                      border: '1px solid var(--color-border)',
                      padding: '1.5rem',
                      marginBottom: '2.5rem',
                    }}
                  >
                    <span className="type-meta-sm" style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--color-stone)' }}>
                      Studio Process &amp; Technique Notes
                    </span>
                    <p className="type-editorial" style={{ fontStyle: 'italic', color: 'var(--color-charcoal)' }}>
                      “{artwork.artistNotes}”
                    </p>
                  </div>
                )}

                {/* Acquisition / Dialogue CTA */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                  <Link
                    to={`/contact?subject=${encodeURIComponent(`Inquiry regarding artwork: ${artwork.title}`)}`}
                    className="btn-editorial btn-editorial--filled"
                    style={{ justifyContent: 'center' }}
                  >
                    Inquire About This Work
                  </Link>
                  <p className="type-meta-sm" style={{ textAlign: 'center', color: 'var(--color-muted)' }}>
                    Original artwork &amp; exhibition loans subject to availability
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Related Artworks */}
        {relatedArtworks.length > 0 && (
          <section
            className="section"
            style={{
              borderTop: '1px solid var(--color-border)',
              backgroundColor: 'var(--color-bg-alt)',
            }}
          >
            <div className="container">
              <span className="section-label" style={{ marginBottom: '1.5rem' }}>
                RELATED ARCHIVE WORKS
              </span>
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
                  gap: 'clamp(1.5rem, 3vw, 2.5rem)',
                }}
              >
                {relatedArtworks.map((related) => (
                  <Link key={related.id} to={`/work/${related.slug}`} className="artwork-card" style={{ display: 'block' }}>
                    <div className="artwork-card__image-wrap" style={{ aspectRatio: '4 / 3' }}>
                      <img
                        src={related.coverImage}
                        alt={related.title}
                        className="artwork-card__image"
                        loading="lazy"
                        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                      />
                    </div>
                    <div className="artwork-card__meta">
                      <div>
                        <h3 className="artwork-card__title" style={{ fontSize: '1.05rem' }}>
                          {related.title}
                        </h3>
                        <span className="type-meta-sm" style={{ color: 'var(--color-stone)' }}>
                          {related.category}
                        </span>
                      </div>
                      <span className="artwork-card__year">{related.year}</span>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </section>
        )}
      </main>

      {/* Lightbox Modal */}
      <AnimatePresence>
        {isLightboxOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsLightboxOpen(false)}
            style={{
              position: 'fixed',
              inset: 0,
              backgroundColor: 'rgba(26, 26, 26, 0.95)',
              zIndex: 1000,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '2rem',
              cursor: 'zoom-out',
            }}
          >
            <button
              onClick={() => setIsLightboxOpen(false)}
              style={{
                position: 'absolute',
                top: '1rem',
                right: '1rem',
                width: '44px',
                height: '44px',
                borderRadius: '50%',
                backgroundColor: 'rgba(255, 255, 255, 0.15)',
                backdropFilter: 'blur(8px)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'white',
                fontSize: '1.25rem',
                border: 'none',
                cursor: 'pointer',
                zIndex: 10,
              }}
              aria-label="Close full view"
            >
              ✕
            </button>
            <img
              src={activeImage || artwork.coverImage}
              alt={artwork.title}
              style={{
                maxWidth: '92vw',
                maxHeight: '92vh',
                objectFit: 'contain',
                boxShadow: '0 20px 60px rgba(0,0,0,0.5)',
              }}
            />
          </motion.div>
        )}
      </AnimatePresence>

      <Footer />
    </div>
  );
}
