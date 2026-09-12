import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { getPublishedPosts } from '../../services/journalService';
import type { JournalPost } from '../../types';
import { formatEditorialDate } from '../../utils/helpers';
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

export default function Journal() {
  const [posts, setPosts] = useState<JournalPost[]>([]);
  const [loading, setLoading] = useState(true);
  const isMobile = useIsMobile();
  const { settings } = useSiteSettings();

  const loadData = () => {
    getPublishedPosts()
      .then(setPosts)
      .catch(console.error)
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    loadData();
    window.addEventListener('studio_journal_updated', loadData);
    return () => window.removeEventListener('studio_journal_updated', loadData);
  }, []);

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
          {posts.length === 0 ? (
            <EmptyState
              title="No entries yet"
              message="Studio notes and literary writings will appear here."
            />
          ) : (
            posts.map((post) => (
              <div
                key={post.id}
                className="gallery-section-unit"
                style={{ width: '100%' }}
              >
                <Link
                  to={`/journal/${post.slug}`}
                  style={{
                    textDecoration: 'none',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    width: '100%',
                  }}
                >
                  {/* Contained in Rectangle */}
                  {post.coverImage ? (
                    <div
                      className="gallery-art-rectangle"
                      style={{ aspectRatio: '16 / 10' }}
                    >
                      <img
                        src={post.coverImage}
                        alt={post.title}
                        loading="lazy"
                      />
                    </div>
                  ) : (
                    <div
                      className="gallery-art-rectangle"
                      style={{
                        aspectRatio: '16 / 10',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        padding: '1.5rem',
                        textAlign: 'center',
                      }}
                    >
                      <span className="type-meta" style={{ color: 'var(--color-muted)' }}>
                        Studio Dispatch
                      </span>
                    </div>
                  )}

                  {/* Title: Uppercase with Underline */}
                  <span className="gallery-category-title">
                    {post.title}
                  </span>

                  {/* Date & Excerpt */}
                  <span
                    style={{
                      fontFamily: 'var(--font-body)',
                      fontSize: '0.8rem',
                      color: 'var(--color-stone)',
                      marginTop: '0.4rem',
                      letterSpacing: '0.04em',
                    }}
                  >
                    {formatEditorialDate(post.publishedAt)}
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
            ENTRIES
          </span>
          <h1
            className="type-display-xl"
            style={{ margin: 0 }}
          >
            Journal
          </h1>
        </div>
      </section>

      {/* Archive */}
      <section style={{ padding: '0 var(--space-lg) var(--space-3xl)' }}>
        <div style={{ maxWidth: 'var(--max-width)', margin: '0 auto' }}>
          {posts.length === 0 ? (
            <EmptyState title="No entries yet" message="Journal entries will appear here once published." />
          ) : (
            <div>
              {posts.map((post, i) => (
                <ScrollReveal key={post.id} delay={i * 0.03}>
                  <Link
                    to={`/journal/${post.slug}`}
                    data-cursor="Read"
                    style={{
                      display: 'grid',
                      gridTemplateColumns: 'minmax(80px, 120px) 1fr',
                      gap: 'var(--space-lg)',
                      alignItems: 'baseline',
                      padding: 'var(--space-xl) 0',
                      borderBottom: '1px solid var(--color-border)',
                      textDecoration: 'none',
                      transition: 'padding-left 0.4s cubic-bezier(0.16, 1, 0.3, 1)',
                    }}
                    onMouseEnter={(e) => (e.currentTarget.style.paddingLeft = '16px')}
                    onMouseLeave={(e) => (e.currentTarget.style.paddingLeft = '0')}
                  >
                    <span className="type-meta-sm" style={{ color: 'var(--color-muted)', whiteSpace: 'nowrap' }}>
                      {formatEditorialDate(post.publishedAt)}
                    </span>
                    <div>
                      <h2 className="type-display-sm" style={{ marginBottom: 'var(--space-sm)' }}>
                        {post.title}
                      </h2>
                      {post.excerpt && (
                        <p className="type-body-sm" style={{ color: 'var(--color-stone)', maxWidth: 500 }}>
                          {post.excerpt}
                        </p>
                      )}
                      {post.tags.length > 0 && (
                        <div style={{ display: 'flex', gap: 'var(--space-sm)', marginTop: 'var(--space-sm)', flexWrap: 'wrap' }}>
                          {post.tags.map((tag) => (
                            <span key={tag} className="type-meta-sm" style={{ color: 'var(--color-muted)' }}>
                              {tag}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  </Link>
                </ScrollReveal>
              ))}
            </div>
          )}
        </div>
      </section>

      <Footer />
    </main>
  );
}
