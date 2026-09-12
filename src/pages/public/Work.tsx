import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { getPublishedArtworks } from '../../services/artworkService';
import type { Artwork } from '../../types';
import { padNumber } from '../../utils/helpers';
import { usePrefersReducedMotion, useIsMobile } from '../../hooks/useMediaQuery';
import { useSiteSettings } from '../../hooks/useSiteSettings';
import LoadingState from '../../components/ui/LoadingState';
import EmptyState from '../../components/ui/EmptyState';
import Footer from '../../components/layout/Footer';
import BackToHome from '../../components/layout/BackToHome';
import MobileHeader from '../../components/layout/MobileHeader';

function ScrollReveal({ children }: { children: React.ReactNode; delay?: number }) {
  return <>{children}</>;
}

export default function Work() {
  const [artworks, setArtworks] = useState<Artwork[]>([]);
  const [loading, setLoading] = useState(true);

  const loadData = () => {
    getPublishedArtworks()
      .then(setArtworks)
      .catch(console.error)
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    loadData();
    window.addEventListener('studio_artworks_updated', loadData);
    return () => window.removeEventListener('studio_artworks_updated', loadData);
  }, []);

  const isMobile = useIsMobile();
  const { settings } = useSiteSettings();

  if (loading) return <LoadingState />;

  if (isMobile) {
    return (
      <div
        style={{
          minHeight: '100vh',
          backgroundColor: 'var(--color-ivory)',
          color: 'var(--color-charcoal)',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          width: '100%',
        }}
      >
        <MobileHeader />

        <main
          style={{
            width: '100%',
            maxWidth: '460px',
            padding: '1rem clamp(1.25rem, 5vw, 2.5rem) 4rem',
            boxSizing: 'border-box',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}
        >
          {artworks.length === 0 ? (
            <EmptyState
              title="No artwork yet"
              message="Published artwork will appear here."
            />
          ) : (
            artworks.map((artwork) => (
              <div
                key={artwork.id}
                className="gallery-section-unit"
                style={{ width: '100%' }}
              >
                <Link
                  to={`/work/${artwork.slug}`}
                  style={{
                    textDecoration: 'none',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    width: '100%',
                  }}
                >
                  {/* Contained in Rectangle: Crisp Art Gallery Frame */}
                  <div
                    className="gallery-art-rectangle"
                    style={{ aspectRatio: '4/5' }}
                  >
                    {artwork.coverImage ? (
                      <img
                        src={artwork.coverImage}
                        alt={artwork.title}
                        loading="lazy"
                      />
                    ) : (
                      <div
                        style={{
                          width: '100%',
                          height: '100%',
                          backgroundColor: 'var(--color-cream)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                        }}
                      >
                        <span className="type-meta" style={{ color: 'var(--color-muted)' }}>No image</span>
                      </div>
                    )}
                  </div>

                  {/* Artwork Title: Uppercase with Underline */}
                  <span className="gallery-category-title">
                    {artwork.title}
                  </span>

                  {/* Subtle Metadata */}
                  <span
                    style={{
                      fontFamily: 'var(--font-body)',
                      fontSize: '0.8rem',
                      color: 'var(--color-stone)',
                      marginTop: '0.4rem',
                      letterSpacing: '0.04em',
                    }}
                  >
                    {artwork.category} — {artwork.year}
                  </span>
                </Link>
              </div>
            ))
          )}
        </main>

        <footer
          style={{
            textAlign: 'center',
            padding: '1.5rem 1.5rem 4rem',
            fontFamily: 'var(--font-body)',
            fontSize: '0.8rem',
            color: 'var(--color-stone)',
            letterSpacing: '0.05em',
            marginTop: 'auto',
          }}
        >
          All artwork © {settings.artistName}
        </footer>
      </div>
    );
  }

  return (
    <main>
      <BackToHome />
      {/* Header */}
      <section
        style={{
          minHeight: '50vh',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'flex-end',
          padding: 'var(--space-xl) var(--space-lg) var(--space-2xl)',
        }}
      >
        <div style={{ maxWidth: 'var(--max-width)', margin: '0 auto', width: '100%' }}>
          <span
            className="type-meta"
            style={{ color: 'var(--color-muted)', marginBottom: 'var(--space-md)', display: 'block' }}
          >
            ARCHIVE
          </span>
          <h1
            className="type-display-xl"
            style={{ margin: 0 }}
          >
            Work
          </h1>
        </div>
      </section>

      {/* Gallery */}
      <section style={{ padding: '0 var(--space-lg) var(--space-3xl)' }}>
        <div style={{ maxWidth: 'var(--max-width)', margin: '0 auto' }}>
          {artworks.length === 0 ? (
            <EmptyState
              title="No artwork yet"
              message="Published artwork will appear here."
            />
          ) : (
            <div style={{ display: 'grid', gap: 'clamp(4rem, 10vw, 8rem)' }}>
              {artworks.map((artwork, i) => {
                // Create varied editorial layout
                const layoutType = i % 5;
                const isFullWidth = layoutType === 0 || layoutType === 3;
                const isPortrait = layoutType === 2 || layoutType === 4;
                const aspectRatio = isFullWidth ? '16/9' : isPortrait ? '3/4' : '4/3';
                const maxWidthPct = isFullWidth ? '100%' : layoutType === 1 ? '75%' : layoutType === 4 ? '60%' : '80%';
                const alignment = layoutType === 1 ? 'flex-end' : layoutType === 4 ? 'flex-start' : 'center';

                return (
                  <ScrollReveal key={artwork.id} delay={0}>
                    <Link
                      to={`/work/${artwork.slug}`}
                      className="work-item-link"
                      data-cursor="Open"
                      style={{
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: alignment,
                        textDecoration: 'none',
                      }}
                    >
                      {/* Number + Meta (above image for some layouts) */}
                      <div style={{
                        display: 'flex',
                        alignItems: 'baseline',
                        gap: 'var(--space-lg)',
                        marginBottom: 'var(--space-md)',
                        width: maxWidthPct,
                      }}>
                        <span className="type-meta-sm" style={{ color: 'var(--color-muted)', whiteSpace: 'nowrap' }}>
                          {padNumber(i + 1)}
                        </span>
                        <span className="type-meta-sm" style={{ color: 'var(--color-muted)' }}>
                          {artwork.category} — {artwork.year}
                        </span>
                      </div>

                      {/* Image */}
                      <div
                        className="artwork-image-container"
                        style={{
                          width: maxWidthPct,
                          aspectRatio,
                        }}
                      >
                        {artwork.coverImage ? (
                          <img
                            src={artwork.coverImage}
                            alt={artwork.title}
                            className="artwork-image"
                            loading="lazy"
                            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                          />
                        ) : (
                          <div style={{
                            width: '100%', height: '100%',
                            backgroundColor: 'var(--color-cream)',
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                          }}>
                            <span className="type-display-md" style={{ color: 'var(--color-muted)', opacity: 0.3 }}>
                              {padNumber(i + 1)}
                            </span>
                          </div>
                        )}
                      </div>

                      {/* Title (below image) */}
                      <h2
                        className="type-display-sm"
                        style={{
                          marginTop: 'var(--space-md)',
                          width: maxWidthPct,
                          transition: 'transform 0.4s cubic-bezier(0.16, 1, 0.3, 1)',
                        }}
                      >
                        {artwork.title}
                      </h2>
                    </Link>
                  </ScrollReveal>
                );
              })}
            </div>
          )}
        </div>
      </section>

      <Footer />
    </main>
  );
}
