import { useEffect, useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { ArrowRight, BookOpen } from 'lucide-react';
import { getPublishedPosts } from '../../services/journalService';
import type { JournalPost } from '../../types';
import { formatDate } from '../../utils/helpers';
import { useSiteSettings } from '../../hooks/useSiteSettings';
import Navbar from '../../components/layout/Navbar';
import Footer from '../../components/layout/Footer';
import LoadingState from '../../components/ui/LoadingState';
import inventoryData from '../../../content/inventory.json';

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
    let mounted = true;
    getPublishedPosts()
      .then((data) => {
        if (!mounted) return;
        setPosts(data.length > 0 ? data : (inventoryData.journal as any));
      })
      .catch(() => {
        if (mounted) setPosts(inventoryData.journal as any);
      })
      .finally(() => {
        if (mounted) setLoading(false);
      });
    return () => {
      mounted = false;
    };
  }, []);

  const tags = useMemo(() => {
    const allTags = posts.flatMap((p) => p.tags || []).filter(Boolean);
    return ['All', ...Array.from(new Set(allTags))];
  }, [posts]);

  const filteredPosts = useMemo(() => {
    if (selectedTag === 'All') return posts;
    return posts.filter((p) => (p.tags || []).includes(selectedTag));
  }, [posts, selectedTag]);

  if (loading) return <LoadingState />;

  const featuredPost = filteredPosts[0];
  const regularPosts = filteredPosts.slice(1);

  return (
    <div className="dusk-page">
      <Helmet>
        <title>{`Studio Notes & Essays — ${settings.artistName || 'Chintwo'}`}</title>
        <meta
          name="description"
          content="Essays on chiaroscuro, negative space, and traditional printmaking techniques by visual artist Chintwo."
        />
      </Helmet>

      <Navbar />

      <main id="main-content" className="dusk-journal-page">
        {/* Header */}
        <section className="dusk-journal-header">
          <div className="dusk-section-index-badge">
            <span className="badge-num">04</span>
            <span className="badge-text">STUDIO ESSAYS & PROCESS</span>
          </div>

          <div className="dusk-journal-title-row">
            <h1 className="dusk-journal-title">Studio Reflections</h1>
            <p className="dusk-journal-lead">
              Observations on chiaroscuro lighting, the weight of quiet images, and physical monoprint synthesis.
            </p>
          </div>

          {/* Tags */}
          {tags.length > 1 && (
            <div className="dusk-filter-pills" role="tablist">
              {tags.map((tag) => (
                <button
                  key={tag}
                  type="button"
                  onClick={() => setSelectedTag(tag)}
                  className={`dusk-filter-pill ${selectedTag === tag ? 'active' : ''}`}
                >
                  {tag.toUpperCase()}
                </button>
              ))}
            </div>
          )}
        </section>

        {/* Featured Post */}
        {featuredPost && (
          <section className="dusk-journal-featured" aria-label="Featured Essay">
            <article className="dusk-journal-featured-card">
              <div className="dusk-featured-media breathing-artwork">
                <Link to={`/journal/${featuredPost.slug}`}>
                  <img
                    src={featuredPost.coverImage}
                    alt={featuredPost.title}
                    className="dusk-featured-img"
                  />
                </Link>
              </div>

              <div className="dusk-featured-content">
                <div className="dusk-post-meta-row">
                  <span className="dusk-post-badge">FEATURED ESSAY</span>
                  <span className="dusk-post-time">
                    <BookOpen size={12} style={{ display: 'inline', marginRight: 4 }} />
                    {getReadingTime(featuredPost.content)}
                  </span>
                </div>

                <h2 className="dusk-featured-title">
                  <Link to={`/journal/${featuredPost.slug}`}>{featuredPost.title}</Link>
                </h2>

                <p className="dusk-featured-excerpt">{featuredPost.excerpt}</p>

                <div className="dusk-featured-footer">
                  <Link to={`/journal/${featuredPost.slug}`} className="btn-dusk btn-dusk--primary">
                    <span>READ COMPLETE ESSAY</span>
                    <ArrowRight size={14} />
                  </Link>
                </div>
              </div>
            </article>
          </section>
        )}

        {/* Regular Posts Grid */}
        {regularPosts.length > 0 && (
          <section className="dusk-journal-grid-section" aria-label="Recent Studio Notes">
            <div className="dusk-journal-grid">
              {regularPosts.map((post) => (
                <article key={post.id} className="dusk-journal-grid-card">
                  {post.coverImage && (
                    <div className="dusk-grid-card-media breathing-artwork">
                      <Link to={`/journal/${post.slug}`}>
                        <img src={post.coverImage} alt={post.title} loading="lazy" />
                      </Link>
                    </div>
                  )}

                  <div className="dusk-grid-card-content">
                    <div className="dusk-post-meta-row">
                      <span className="dusk-post-date">{formatDate(post.publishedAt || post.createdAt)}</span>
                      <span className="dusk-post-time">{getReadingTime(post.content)}</span>
                    </div>

                    <h3 className="dusk-grid-card-title">
                      <Link to={`/journal/${post.slug}`}>{post.title}</Link>
                    </h3>

                    <p className="dusk-grid-card-excerpt">{post.excerpt}</p>

                    <Link to={`/journal/${post.slug}`} className="dusk-grid-card-link">
                      <span>READ NOTE</span>
                      <ArrowRight size={12} />
                    </Link>
                  </div>
                </article>
              ))}
            </div>
          </section>
        )}
      </main>

      <Footer />
    </div>
  );
}
