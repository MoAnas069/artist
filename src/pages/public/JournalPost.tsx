import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import DOMPurify from 'dompurify';
import { getPostBySlug } from '../../services/journalService';
import type { JournalPost } from '../../types';
import { formatEditorialDate } from '../../utils/helpers';
import { usePrefersReducedMotion } from '../../hooks/useMediaQuery';
import LoadingState from '../../components/ui/LoadingState';
import Footer from '../../components/layout/Footer';
import BackToHome from '../../components/layout/BackToHome';

function ScrollReveal({ children }: { children: React.ReactNode }) {
  const prefersReducedMotion = usePrefersReducedMotion();
  if (prefersReducedMotion) return <>{children}</>;
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
    >
      {children}
    </motion.div>
  );
}

export default function JournalPost() {
  const { slug } = useParams<{ slug: string }>();
  const [post, setPost] = useState<JournalPost | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    if (!slug) return;
    setLoading(true);
    getPostBySlug(slug)
      .then((p) => {
        if (!p) { setNotFound(true); return; }
        setPost(p);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [slug]);

  if (loading) return <LoadingState />;
  if (notFound || !post) {
    return (
      <main style={{ minHeight: '80vh', display: 'flex', alignItems: 'center', justifyContent: 'center', textAlign: 'center', padding: 'var(--space-xl)' }}>
        <div>
          <h1 className="type-display-lg" style={{ marginBottom: 'var(--space-lg)' }}>Entry not found</h1>
          <Link to="/journal" className="type-meta link-underline" style={{ color: 'var(--color-stone)' }}>← BACK TO JOURNAL</Link>
        </div>
      </main>
    );
  }

  const sanitizedContent = DOMPurify.sanitize(post.content);

  return (
    <main>
      <BackToHome />
      {/* Header */}
      <section
        style={{
          minHeight: '60vh',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'flex-end',
          padding: 'var(--space-xl) var(--space-lg) var(--space-2xl)',
          textAlign: 'center',
        }}
      >
        <div style={{ maxWidth: 'var(--content-width)', margin: '0 auto', width: '100%' }}>
          <motion.span
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="type-meta"
            style={{ color: 'var(--color-muted)', marginBottom: 'var(--space-lg)', display: 'block' }}
          >
            {formatEditorialDate(post.publishedAt)} {post.author && `— ${post.author}`}
          </motion.span>
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
            className="type-display-lg"
          >
            {post.title}
          </motion.h1>
        </div>
      </section>

      {/* Cover Image */}
      {post.coverImage && (
        <section style={{ padding: '0 var(--space-lg) var(--space-2xl)' }}>
          <div style={{ maxWidth: 'var(--max-width)', margin: '0 auto' }}>
            <motion.img
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.5 }}
              src={post.coverImage}
              alt={post.title}
              style={{ width: '100%', aspectRatio: '16/9', objectFit: 'cover' }}
            />
          </div>
        </section>
      )}

      {/* Content */}
      <article style={{ padding: '0 var(--space-lg) var(--space-3xl)' }}>
        <div style={{ maxWidth: 'var(--content-width)', margin: '0 auto' }}>
          <ScrollReveal>
            <div
              className="rich-text"
              dangerouslySetInnerHTML={{ __html: sanitizedContent }}
            />
          </ScrollReveal>

          {/* Tags */}
          {post.tags.length > 0 && (
            <div style={{ marginTop: 'var(--space-2xl)', paddingTop: 'var(--space-lg)', borderTop: '1px solid var(--color-border)' }}>
              <div style={{ display: 'flex', gap: 'var(--space-md)', flexWrap: 'wrap' }}>
                {post.tags.map((tag) => (
                  <span key={tag} className="type-meta-sm" style={{ color: 'var(--color-muted)', padding: '0.25rem 0.75rem', border: '1px solid var(--color-border)' }}>
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      </article>

      {/* Back */}
      <section style={{ padding: 'var(--space-xl) var(--space-lg) var(--space-2xl)', textAlign: 'center' }}>
        <Link to="/journal" className="type-meta link-underline" data-cursor="Back" style={{ color: 'var(--color-stone)' }}>
          ← BACK TO JOURNAL
        </Link>
      </section>

      <Footer />
    </main>
  );
}
