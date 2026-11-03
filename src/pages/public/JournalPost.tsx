import { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import DOMPurify from 'dompurify';
import { ArrowLeft, ArrowRight, Clock, Calendar } from 'lucide-react';
import { getPostBySlug, getPublishedPosts } from '../../services/journalService';
import type { JournalPost as JournalPostType } from '../../types';
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
        const fallbackList = inventoryData.journal as any;
        const list = postsList.length > 0 ? postsList : fallbackList;
        const target = foundPost || list.find((p: any) => p.slug === slug);

        if (!target) {
          navigate('/journal', { replace: true });
          return;
        }
        setPost(target);
        setAllPosts(list);
      })
      .catch(() => {
        const fallbackList = inventoryData.journal as any;
        const target = fallbackList.find((p: any) => p.slug === slug);
        if (target) {
          setPost(target);
          setAllPosts(fallbackList);
        } else {
          navigate('/journal', { replace: true });
        }
      })
      .finally(() => setLoading(false));
  }, [slug, navigate]);

  if (loading || !post) return <LoadingState />;

  const currentIndex = allPosts.findIndex((p) => p.id === post.id);
  const prevPost = currentIndex > 0 ? allPosts[currentIndex - 1] : null;
  const nextPost = currentIndex < allPosts.length - 1 ? allPosts[currentIndex + 1] : null;

  const sanitizedContent = DOMPurify.sanitize(post.content);

  return (
    <div className="dusk-page">
      <Helmet>
        <title>{`${post.title} — ${settings.artistName || 'Chintwo'}`}</title>
        <meta name="description" content={post.excerpt} />
        <meta property="og:title" content={post.title} />
        <meta property="og:description" content={post.excerpt} />
        {post.coverImage && <meta property="og:image" content={post.coverImage} />}
      </Helmet>

      <Navbar />

      <main id="main-content" className="dusk-post-page">
        {/* Navigation Breadcrumb */}
        <div className="dusk-detail-breadcrumb">
          <Link to="/journal" className="dusk-back-link">
            <ArrowLeft size={14} />
            <span>BACK TO ESSAYS</span>
          </Link>

          <div className="dusk-detail-paging">
            {prevPost ? (
              <Link to={`/journal/${prevPost.slug}`} className="dusk-page-btn" title={prevPost.title}>
                ← PREV
              </Link>
            ) : (
              <span className="dusk-page-btn disabled">← PREV</span>
            )}
            <span className="dusk-paging-sep">/</span>
            {nextPost ? (
              <Link to={`/journal/${nextPost.slug}`} className="dusk-page-btn" title={nextPost.title}>
                NEXT →
              </Link>
            ) : (
              <span className="dusk-page-btn disabled">NEXT →</span>
            )}
          </div>
        </div>

        {/* Article Container */}
        <article className="dusk-article">
          <header className="dusk-article-header">
            <div className="dusk-section-index-badge">
              <span className="badge-num">ESSAY</span>
              <span className="badge-text">STUDIO REFLECTION</span>
            </div>

            <h1 className="dusk-article-title">{post.title}</h1>

            <div className="dusk-article-meta">
              <span className="dusk-article-meta-item">
                <Calendar size={13} />
                <span>{formatDate(post.publishedAt || post.createdAt)}</span>
              </span>
              <span className="dot">•</span>
              <span className="dusk-article-meta-item">
                <Clock size={13} />
                <span>{getReadingTime(post.content)}</span>
              </span>
              <span className="dot">•</span>
              <span className="dusk-article-author">BY {post.author || 'CHINTWO'}</span>
            </div>

            {post.excerpt && <p className="dusk-article-lead">{post.excerpt}</p>}
          </header>

          {post.coverImage && (
            <div className="dusk-article-hero-media breathing-artwork">
              <img src={post.coverImage} alt={post.title} />
            </div>
          )}

          <div
            className="dusk-article-body"
            dangerouslySetInnerHTML={{ __html: sanitizedContent }}
          />

          <footer className="dusk-article-footer">
            <div className="dusk-article-author-card">
              <img
                src={settings.artistPortrait || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80'}
                alt="Chintwo"
                className="dusk-author-avatar"
              />
              <div>
                <h4 className="dusk-author-name">CHINTWO</h4>
                <p className="dusk-author-bio">
                  Visual artist exploring atmospheric worlds, memory, and myth through textured brushwork and quiet light.
                </p>
              </div>
            </div>

            <div className="dusk-article-share">
              <Link to="/contact" className="btn-dusk btn-dusk--primary">
                <span>RESPOND TO THIS ESSAY</span>
                <ArrowRight size={14} />
              </Link>
            </div>
          </footer>
        </article>
      </main>

      <Footer />
    </div>
  );
}
