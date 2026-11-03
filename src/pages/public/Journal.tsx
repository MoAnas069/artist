import { useEffect, useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { getPublishedPosts } from '../../services/journalService';
import type { JournalPost } from '../../types';
import { formatDate } from '../../utils/helpers';
import { useSiteSettings } from '../../hooks/useSiteSettings';
import Navbar from '../../components/layout/Navbar';
import Footer from '../../components/layout/Footer';
import LoadingState from '../../components/ui/LoadingState';
import EmptyState from '../../components/ui/EmptyState';

// Helper to compute reading time
function getReadingTime(content: string = ''): string {
  const text = content.replace(/<[^>]*>/g, '');
  const words = text.trim().split(/\s+/).length;
  const minutes = Math.max(1, Math.ceil(words / 200));
  return `${minutes} min read`;
}

export default function Journal() {
  const { settings } = useSiteSettings();
  const [posts, setPosts] = useState<JournalPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedTag, setSelectedTag] = useState<string>('All');

  useEffect(() => {
    getPublishedPosts()
      .then(setPosts)
      .catch((err) => console.error('Error fetching journal posts:', err))
      .finally(() => setLoading(false));
  }, []);

  // Compute all available tags
  const tags = useMemo(() => {
    const allTags = posts.flatMap((p) => p.tags || []).filter(Boolean);
    return ['All', ...Array.from(new Set(allTags))];
  }, [posts]);

  // Filter posts by tag
  const filteredPosts = useMemo(() => {
    if (selectedTag === 'All') return posts;
    return posts.filter((p) => (p.tags || []).includes(selectedTag));
  }, [posts, selectedTag]);

  if (loading) return <LoadingState />;

  const featuredPost = filteredPosts[0];
  const regularPosts = filteredPosts.slice(1);

  return (
    <div className="page-wrap">
      <Helmet>
        <title>{`Field Notes — Journal & Essays | ${settings.artistName || 'CHINTWO'}`}</title>
        <meta
          name="description"
          content={`Field Notes by ${settings.artistName || 'CHINTWO'}. Essays on art, narrative illustration, studio observations, and creative practice.`}
        />
      </Helmet>

      <Navbar />

      <main id="main-content" className="page-content">
        {/* Editorial Top Index Bar */}
        <div style={{ borderBottom: '1px solid var(--color-border)', backgroundColor: 'var(--color-bg)' }}>
          <div className="container">
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'baseline',
                padding: '1rem 0',
              }}
            >
              <span className="type-meta">03 / FIELD NOTES</span>
              <span className="type-meta">DISPATCHES &amp; STUDIO WRITINGS</span>
            </div>
          </div>
        </div>

        {/* Header Section */}
        <section className="section" style={{ paddingBottom: 'clamp(2.5rem, 5vh, 4rem)' }}>
          <div className="container">
            <div className="page-header-grid">
              <div className="page-header-grid__title">
                <h1 className="type-display-hero">Field Notes</h1>
              </div>
              <div className="page-header-grid__desc">
                <p className="type-editorial" style={{ color: 'var(--color-stone)' }}>
                  Thoughts, observations, studio experiments, and things worth remembering.
                </p>
              </div>
            </div>

            {/* Tag Filter Pills */}
            {tags.length > 2 && (
              <div className="filter-bar">
                {tags.map((tag) => (
                  <button
                    key={tag}
                    onClick={() => setSelectedTag(tag)}
                    className={`filter-btn ${selectedTag === tag ? 'filter-btn--active' : 'filter-btn--inactive'}`}
                  >
                    {tag}
                  </button>
                ))}
              </div>
            )}
          </div>
        </section>

        {/* Articles List */}
        <section style={{ paddingBottom: 'clamp(5rem, 10vh, 8rem)' }}>
          <div className="container">
            {filteredPosts.length === 0 ? (
              <EmptyState
                title="No articles found"
                description={`There are currently no notes published under "${selectedTag}".`}
              />
            ) : (
              <div>
                {/* Featured Post (Hero Prominence) */}
                {featuredPost && (
                  <article
                    className="editorial-split-5-7"
                    style={{
                      borderTop: '2px solid var(--color-charcoal)',
                      paddingTop: 'clamp(2rem, 4vw, 3.5rem)',
                      paddingBottom: 'clamp(3rem, 6vw, 4.5rem)',
                      alignItems: 'center',
                    }}
                  >
                    {featuredPost.coverImage && (
                      <div className="editorial-split-5-7__side">
                        <Link to={`/journal/${featuredPost.slug}`} style={{ display: 'block' }}>
                          <div
                            style={{
                              aspectRatio: '16 / 10',
                              backgroundColor: 'var(--color-bg-alt)',
                              overflow: 'hidden',
                              boxShadow: '0 8px 30px rgba(0,0,0,0.06)',
                            }}
                          >
                            <img
                              src={featuredPost.coverImage}
                              alt={featuredPost.title}
                              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                            />
                          </div>
                        </Link>
                      </div>
                    )}

                    <div className={featuredPost.coverImage ? 'editorial-split-5-7__main' : ''} style={{ gridColumn: featuredPost.coverImage ? undefined : '1 / -1' }}>
                      <div style={{ display: 'flex', gap: '1rem', alignItems: 'center', marginBottom: '1rem', flexWrap: 'wrap' }}>
                        <span className="type-meta" style={{ color: 'var(--color-charcoal)', fontWeight: 600 }}>
                          FEATURED ENTRY
                        </span>
                        <span className="type-meta">
                          {featuredPost.publishedAt ? formatDate(featuredPost.publishedAt) : 'Recent'}
                        </span>
                        <span className="type-meta-sm">{getReadingTime(featuredPost.content)}</span>
                      </div>

                      <h2 className="type-display-lg" style={{ marginBottom: '1rem', lineHeight: 1.1 }}>
                        <Link to={`/journal/${featuredPost.slug}`} className="link-underline">
                          {featuredPost.title}
                        </Link>
                      </h2>

                      <p
                        className="type-editorial"
                        style={{
                          color: 'var(--color-stone)',
                          marginBottom: '1.75rem',
                          maxWidth: '680px',
                        }}
                      >
                        {featuredPost.excerpt}
                      </p>

                      <div style={{ display: 'flex', gap: '1.25rem', alignItems: 'center', flexWrap: 'wrap' }}>
                        <Link to={`/journal/${featuredPost.slug}`} className="btn-editorial btn-editorial--filled">
                          Read Full Essay
                        </Link>
                        {featuredPost.tags && featuredPost.tags.length > 0 && (
                          <span className="type-meta-sm">
                            Tags: {featuredPost.tags.join(', ')}
                          </span>
                        )}
                      </div>
                    </div>
                  </article>
                )}

                {/* Regular Articles List */}
                {regularPosts.map((post) => (
                  <article key={post.id} className="journal-row">
                    <div className="journal-row__meta">
                      <span className="type-meta" style={{ display: 'block', marginBottom: '0.35rem' }}>
                        {post.publishedAt ? formatDate(post.publishedAt) : 'Recent'}
                      </span>
                      <span className="type-meta-sm" style={{ color: 'var(--color-muted)' }}>
                        {getReadingTime(post.content)}
                      </span>
                    </div>

                    <div className="journal-row__body">
                      <h3 className="type-display-md" style={{ marginBottom: '0.75rem', lineHeight: 1.2 }}>
                        <Link to={`/journal/${post.slug}`} className="link-underline">
                          {post.title}
                        </Link>
                      </h3>
                      <p className="type-body" style={{ color: 'var(--color-stone)', maxWidth: '640px' }}>
                        {post.excerpt}
                      </p>
                    </div>

                    <div className="journal-row__action">
                      <Link
                        to={`/journal/${post.slug}`}
                        className="btn-editorial"
                        style={{ padding: '0.5rem 1rem', fontSize: '0.625rem' }}
                      >
                        Read Note →
                      </Link>
                    </div>
                  </article>
                ))}
              </div>
            )}
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
