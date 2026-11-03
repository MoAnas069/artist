import { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import DOMPurify from 'dompurify';
import { getPostBySlug, getPublishedPosts } from '../../services/journalService';
import type { JournalPost as JournalPostType } from '../../types';
import { formatDate } from '../../utils/helpers';
import { useSiteSettings } from '../../hooks/useSiteSettings';
import Navbar from '../../components/layout/Navbar';
import Footer from '../../components/layout/Footer';
import LoadingState from '../../components/ui/LoadingState';
import { ReadingProgress } from '../../components/ui/motion';

function getReadingTime(content: string = ''): string {
  const text = content.replace(/<[^>]*>/g, '');
  const words = text.trim().split(/\s+/).length;
  const minutes = Math.max(1, Math.ceil(words / 200));
  return `${minutes} min read`;
}

export default function JournalPost() {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const { settings } = useSiteSettings();
  const [post, setPost] = useState<JournalPostType | null>(null);
  const [allPosts, setAllPosts] = useState<JournalPostType[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!slug) return;
    setLoading(true);

    Promise.all([getPostBySlug(slug), getPublishedPosts()])
      .then(([foundPost, postsList]) => {
        if (!foundPost) {
          navigate('/journal', { replace: true });
          return;
        }
        setPost(foundPost);
        setAllPosts(postsList);
      })
      .catch((err) => {
        console.error('Error fetching journal post:', err);
        navigate('/journal', { replace: true });
      })
      .finally(() => setLoading(false));
  }, [slug, navigate]);

  if (loading || !post) return <LoadingState />;

  const currentIndex = allPosts.findIndex((p) => p.id === post.id);
  const prevPost = currentIndex > 0 ? allPosts[currentIndex - 1] : null;
  const nextPost = currentIndex < allPosts.length - 1 ? allPosts[currentIndex + 1] : null;

  const relatedPosts = allPosts
    .filter((p) => p.id !== post.id)
    .slice(0, 2);

  const sanitizedContent = DOMPurify.sanitize(post.content);

  return (
    <div className="page-wrap">
      <ReadingProgress />
      <Helmet>
        <title>{`${post.seoTitle || post.title} — ${settings.artistName || 'CHINTWO'}`}</title>
        <meta
          name="description"
          content={post.seoDescription || post.excerpt || `Read "${post.title}" on CHINTWO Field Notes.`}
        />
        <meta property="og:title" content={`${post.title} — ${settings.artistName || 'CHINTWO'}`} />
        <meta property="og:description" content={post.excerpt} />
        {post.coverImage && <meta property="og:image" content={post.coverImage} />}
      </Helmet>

      <Navbar />

      <main id="main-content" className="page-content">
        {/* Editorial Top Navigation */}
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
                to="/journal"
                className="link-underline"
                style={{
                  fontFamily: 'var(--font-mono)',
                  fontSize: '0.6875rem',
                  letterSpacing: '0.12em',
                  textTransform: 'uppercase',
                }}
              >
                ← Return to Field Notes
              </Link>

              <div style={{ display: 'flex', gap: '1.5rem', alignItems: 'center' }}>
                {prevPost && (
                  <Link
                    to={`/journal/${prevPost.slug}`}
                    className="link-underline"
                    style={{
                      fontFamily: 'var(--font-mono)',
                      fontSize: '0.6875rem',
                      letterSpacing: '0.12em',
                      textTransform: 'uppercase',
                    }}
                  >
                    ← Older
                  </Link>
                )}
                {nextPost && (
                  <Link
                    to={`/journal/${nextPost.slug}`}
                    className="link-underline"
                    style={{
                      fontFamily: 'var(--font-mono)',
                      fontSize: '0.6875rem',
                      letterSpacing: '0.12em',
                      textTransform: 'uppercase',
                    }}
                  >
                    Newer →
                  </Link>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Article Header */}
        <article className="section" style={{ paddingTop: 'clamp(2.5rem, 6vh, 4.5rem)' }}>
          <div className="container-narrow">
            {/* Meta bar */}
            <div
              style={{
                display: 'flex',
                gap: '1.5rem',
                alignItems: 'center',
                marginBottom: '1.5rem',
                flexWrap: 'wrap',
              }}
            >
              <span className="type-meta">
                {post.publishedAt ? formatDate(post.publishedAt) : 'Recent Entry'}
              </span>
              <span className="type-meta-sm">•</span>
              <span className="type-meta-sm">By {post.author || settings.artistName || 'CHINTWO'}</span>
              <span className="type-meta-sm">•</span>
              <span className="type-meta-sm">{getReadingTime(post.content)}</span>
            </div>

            {/* Title */}
            <h1
              className="type-display-xl"
              style={{
                lineHeight: 1.05,
                marginBottom: '1.5rem',
              }}
            >
              {post.title}
            </h1>

            {/* Subtitle / Excerpt */}
            {post.excerpt && (
              <p
                className="type-editorial-lg"
                style={{
                  color: 'var(--color-stone)',
                  marginBottom: 'clamp(2rem, 4vw, 3rem)',
                  lineHeight: 1.6,
                }}
              >
                {post.excerpt}
              </p>
            )}
          </div>

          {/* Hero Image (Wide) */}
          {post.coverImage && (
            <div className="container" style={{ marginBottom: 'clamp(2.5rem, 5vw, 4.5rem)' }}>
              <div
                style={{
                  maxWidth: '1000px',
                  margin: '0 auto',
                  backgroundColor: 'var(--color-bg-alt)',
                  boxShadow: '0 12px 40px rgba(0,0,0,0.06)',
                  overflow: 'hidden',
                }}
              >
                <img
                  src={post.coverImage}
                  alt={post.title}
                  style={{ width: '100%', height: 'auto', display: 'block' }}
                />
              </div>
            </div>
          )}

          {/* Article Rich Text Content */}
          <div className="container-narrow">
            <div
              className="rich-text"
              dangerouslySetInnerHTML={{ __html: sanitizedContent }}
            />

            {/* Tags Strip */}
            {post.tags && post.tags.length > 0 && (
              <div
                style={{
                  borderTop: '1px solid var(--color-border)',
                  marginTop: 'clamp(3rem, 6vw, 4.5rem)',
                  paddingTop: '1.5rem',
                  display: 'flex',
                  gap: '0.75rem',
                  alignItems: 'center',
                  flexWrap: 'wrap',
                }}
              >
                <span className="type-meta-sm" style={{ color: 'var(--color-muted)' }}>
                  Filed Under:
                </span>
                {post.tags.map((tag) => (
                  <span
                    key={tag}
                    style={{
                      fontFamily: 'var(--font-mono)',
                      fontSize: '0.625rem',
                      letterSpacing: '0.1em',
                      textTransform: 'uppercase',
                      padding: '0.25rem 0.65rem',
                      backgroundColor: 'var(--color-bg-alt)',
                      color: 'var(--color-charcoal)',
                    }}
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            )}

            {/* Colophon & Author Bio */}
            <div
              style={{
                borderTop: '1px solid var(--color-border)',
                marginTop: '2.5rem',
                paddingTop: '2rem',
                display: 'grid',
                gridTemplateColumns: '80px 1fr',
                gap: '1.5rem',
                alignItems: 'center',
              }}
            >
              <div
                style={{
                  width: '72px',
                  height: '72px',
                  borderRadius: '50%',
                  overflow: 'hidden',
                  backgroundColor: 'var(--color-bg-alt)',
                }}
              >
                <img
                  src={settings.artistPortrait || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80'}
                  alt={settings.artistName}
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                />
              </div>
              <div>
                <span className="type-meta-sm" style={{ display: 'block', marginBottom: '0.25rem' }}>
                  WRITTEN BY
                </span>
                <h2 className="type-display-sm" style={{ marginBottom: '0.25rem' }}>
                  {post.author || settings.artistName || 'CHINTWO'}
                </h2>
                <p className="type-body-sm" style={{ color: 'var(--color-stone)' }}>
                  {settings.shortBio || 'Contemporary visual artist & storyteller.'}
                </p>
              </div>
            </div>
          </div>
        </article>

        {/* Related Articles */}
        {relatedPosts.length > 0 && (
          <section
            className="section"
            style={{
              borderTop: '1px solid var(--color-border)',
              backgroundColor: 'var(--color-bg-alt)',
            }}
          >
            <div className="container">
              <span className="section-label" style={{ marginBottom: '2rem' }}>
                CONTINUE READING
              </span>
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
                  gap: 'clamp(2rem, 4vw, 3rem)',
                }}
              >
                {relatedPosts.map((related) => (
                  <article key={related.id} style={{ backgroundColor: 'var(--color-surface)', padding: '2rem', border: '1px solid var(--color-border)' }}>
                    <span className="type-meta" style={{ display: 'block', marginBottom: '0.5rem' }}>
                      {related.publishedAt ? formatDate(related.publishedAt) : 'Field Note'}
                    </span>
                    <h3 className="type-display-sm" style={{ marginBottom: '0.75rem' }}>
                      <Link to={`/journal/${related.slug}`} className="link-underline">
                        {related.title}
                      </Link>
                    </h3>
                    <p className="type-body-sm" style={{ color: 'var(--color-stone)', marginBottom: '1.25rem' }}>
                      {related.excerpt}
                    </p>
                    <Link
                      to={`/journal/${related.slug}`}
                      className="link-underline"
                      style={{ fontFamily: 'var(--font-mono)', fontSize: '0.625rem', letterSpacing: '0.12em', textTransform: 'uppercase' }}
                    >
                      Read Note →
                    </Link>
                  </article>
                ))}
              </div>
            </div>
          </section>
        )}
      </main>

      <Footer />
    </div>
  );
}
