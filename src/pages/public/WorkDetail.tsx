import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { getArtworkBySlug, getAdjacentArtworks } from '../../services/artworkService';
import type { Artwork } from '../../types';
import { usePrefersReducedMotion } from '../../hooks/useMediaQuery';
import LoadingState from '../../components/ui/LoadingState';
import Footer from '../../components/layout/Footer';
import BackToHome from '../../components/layout/BackToHome';

function ScrollReveal({ children, delay = 0 }: { children: React.ReactNode; delay?: number }) {
  const prefersReducedMotion = usePrefersReducedMotion();
  if (prefersReducedMotion) return <>{children}</>;
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ duration: 0.7, delay, ease: [0.16, 1, 0.3, 1] }}
    >
      {children}
    </motion.div>
  );
}

export default function WorkDetail() {
  const { slug } = useParams<{ slug: string }>();
  const [artwork, setArtwork] = useState<Artwork | null>(null);
  const [adjacent, setAdjacent] = useState<{ prev: Artwork | null; next: Artwork | null }>({ prev: null, next: null });
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    if (!slug) return;
    setLoading(true);
    getArtworkBySlug(slug)
      .then((a) => {
        if (!a) { setNotFound(true); return; }
        setArtwork(a);
        return getAdjacentArtworks(a.sortOrder).then(setAdjacent);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [slug]);

  if (loading) return <LoadingState />;
  if (notFound || !artwork) {
    return (
      <main style={{ minHeight: '80vh', display: 'flex', alignItems: 'center', justifyContent: 'center', textAlign: 'center', padding: 'var(--space-xl)' }}>
        <div>
          <h1 className="type-display-lg" style={{ marginBottom: 'var(--space-lg)' }}>Work not found</h1>
          <Link to="/work" className="type-meta link-underline" style={{ color: 'var(--color-stone)' }}>← BACK TO ARCHIVE</Link>
        </div>
      </main>
    );
  }

  return (
    <main>
      <BackToHome />
      {/* Hero / Cover Image */}
      <section
        style={{
          minHeight: '90vh',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'flex-end',
          padding: 'var(--nav-height) var(--space-lg) var(--space-2xl)',
          position: 'relative',
        }}
      >
        {artwork.coverImage && (
          <motion.div
            initial={{ opacity: 0, scale: 1.02 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
            style={{
              position: 'absolute',
              inset: 0,
              zIndex: 0,
            }}
          >
            <img
              src={artwork.coverImage}
              alt={artwork.title}
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'cover',
              }}
            />
            <div style={{
              position: 'absolute',
              inset: 0,
              background: 'linear-gradient(to top, rgba(245,240,235,0.95) 0%, rgba(245,240,235,0.3) 50%, transparent 100%)',
            }} />
          </motion.div>
        )}

        <div style={{ maxWidth: 'var(--max-width)', margin: '0 auto', width: '100%', position: 'relative', zIndex: 1 }}>
          <motion.span
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="type-meta"
            style={{ color: 'var(--color-stone)', marginBottom: 'var(--space-md)', display: 'block' }}
          >
            {artwork.category} — {artwork.year}
          </motion.span>
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.5, ease: [0.16, 1, 0.3, 1] }}
            className="type-display-xl"
          >
            {artwork.title}
          </motion.h1>
          {artwork.medium && (
            <motion.span
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.7 }}
              className="type-meta-sm"
              style={{ color: 'var(--color-muted)', marginTop: 'var(--space-md)', display: 'block' }}
            >
              {artwork.medium} {artwork.dimensions && `— ${artwork.dimensions}`}
            </motion.span>
          )}
        </div>
      </section>

      {/* Description */}
      {artwork.description && (
        <section style={{ padding: 'var(--space-2xl) var(--space-lg)' }}>
          <div className="content-container" style={{ padding: 0, maxWidth: 'var(--content-width)', margin: '0 auto' }}>
            <ScrollReveal>
              <p className="type-body-lg" style={{ color: 'var(--color-stone)' }}>
                {artwork.description}
              </p>
            </ScrollReveal>
          </div>
        </section>
      )}

      {/* Additional Images */}
      {artwork.images.length > 0 && (
        <section style={{ padding: '0 var(--space-lg) var(--space-2xl)' }}>
          <div style={{ maxWidth: 'var(--max-width)', margin: '0 auto', display: 'grid', gap: 'var(--space-lg)' }}>
            {artwork.images.map((img, i) => (
              <ScrollReveal key={i}>
                <img
                  src={img}
                  alt={`${artwork.title} — detail ${i + 1}`}
                  loading="lazy"
                  style={{
                    width: i % 2 === 0 ? '100%' : '80%',
                    margin: i % 2 === 0 ? '0' : '0 auto',
                    display: 'block',
                  }}
                />
              </ScrollReveal>
            ))}
          </div>
        </section>
      )}

      {/* Process Images */}
      {artwork.processImages.length > 0 && (
        <section style={{ padding: 'var(--space-2xl) var(--space-lg)', backgroundColor: 'var(--color-cream)' }}>
          <div style={{ maxWidth: 'var(--max-width)', margin: '0 auto' }}>
            <ScrollReveal>
              <span className="type-meta" style={{ color: 'var(--color-muted)', marginBottom: 'var(--space-xl)', display: 'block' }}>
                PROCESS
              </span>
            </ScrollReveal>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 'var(--space-lg)' }}>
              {artwork.processImages.map((img, i) => (
                <ScrollReveal key={i} delay={i * 0.05}>
                  <img src={img} alt={`Process ${i + 1}`} loading="lazy" style={{ width: '100%' }} />
                </ScrollReveal>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Artist Notes */}
      {artwork.artistNotes && (
        <section style={{ padding: 'var(--space-2xl) var(--space-lg)' }}>
          <div style={{ maxWidth: 'var(--content-width)', margin: '0 auto' }}>
            <ScrollReveal>
              <span className="type-meta" style={{ color: 'var(--color-muted)', marginBottom: 'var(--space-lg)', display: 'block' }}>
                ARTIST NOTES
              </span>
              <p className="type-body" style={{ color: 'var(--color-stone)', fontStyle: 'italic' }}>
                {artwork.artistNotes}
              </p>
            </ScrollReveal>
          </div>
        </section>
      )}

      {/* Credits */}
      {artwork.credits && (
        <section style={{ padding: '0 var(--space-lg) var(--space-2xl)' }}>
          <div style={{ maxWidth: 'var(--content-width)', margin: '0 auto' }}>
            <hr className="editorial-rule" />
            <span className="type-meta-sm" style={{ color: 'var(--color-muted)' }}>
              Credits: {artwork.credits}
            </span>
          </div>
        </section>
      )}

      {/* Navigation */}
      <section style={{ padding: 'var(--space-2xl) var(--space-lg)', borderTop: '1px solid var(--color-border)' }}>
        <div style={{
          maxWidth: 'var(--max-width)',
          margin: '0 auto',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}>
          {adjacent.prev ? (
            <Link to={`/work/${adjacent.prev.slug}`} className="type-meta link-underline" data-cursor="Prev" style={{ color: 'var(--color-stone)' }}>
              ← {adjacent.prev.title}
            </Link>
          ) : <span />}
          {adjacent.next ? (
            <Link to={`/work/${adjacent.next.slug}`} className="type-meta link-underline" data-cursor="Next" style={{ color: 'var(--color-stone)' }}>
              {adjacent.next.title} →
            </Link>
          ) : <span />}
        </div>
      </section>

      <Footer />
    </main>
  );
}
