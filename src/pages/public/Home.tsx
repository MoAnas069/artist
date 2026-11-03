import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { motion, type Variants } from 'framer-motion';
import { getPublishedArtworks } from '../../services/artworkService';
import { getPublishedPosts } from '../../services/journalService';
import { getAvailableProducts } from '../../services/productService';
import { useSiteSettings } from '../../hooks/useSiteSettings';
import { usePrefersReducedMotion } from '../../hooks/useMediaQuery';
import type { Artwork, JournalPost, Product } from '../../types';
import Navbar from '../../components/layout/Navbar';
import Footer from '../../components/layout/Footer';
import { ScrollReveal, MaskReveal } from '../../components/ui/motion';
import LoadingState from '../../components/ui/LoadingState';
import { formatDate, formatPrice } from '../../utils/helpers';
import { initialArtworks } from '../../lib/mockData';

/* ─── Motion Variants ─────────────────────────────────────── */
const stagger: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.09, delayChildren: 0.1 } },
};

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.65, ease: [0.16, 1, 0.3, 1] } },
};

const fadeIn: Variants = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { duration: 0.7, ease: [0.16, 1, 0.3, 1] } },
};

export default function Home() {
  const { settings } = useSiteSettings();
  const prefersReduced = usePrefersReducedMotion();
  const [artworks, setArtworks] = useState<Artwork[]>([]);
  const [posts, setPosts] = useState<JournalPost[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const galleryRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let mounted = true;
    Promise.all([
      getPublishedArtworks(),
      getPublishedPosts(),
      getAvailableProducts(),
    ])
      .then(([fetchedArtworks, fetchedPosts, fetchedProducts]) => {
        if (!mounted) return;
        setArtworks(fetchedArtworks.length > 0 ? fetchedArtworks : initialArtworks);
        setPosts(fetchedPosts.slice(0, 3));
        setProducts(fetchedProducts.slice(0, 3));
      })
      .catch((err) => {
        console.error('Error loading home data:', err);
        if (mounted) setArtworks(initialArtworks);
      })
      .finally(() => { if (mounted) setLoading(false); });
    return () => { mounted = false; };
  }, []);

  const handleScrollLeft = () => {
    galleryRef.current?.scrollBy({ left: -340, behavior: 'smooth' });
  };

  const handleScrollRight = () => {
    galleryRef.current?.scrollBy({ left: 340, behavior: 'smooth' });
  };

  if (loading) return <LoadingState />;

  const displayArtworks = artworks.length > 0 ? artworks : initialArtworks;
  const heroArtwork = displayArtworks.find((a) => a.featured) || displayArtworks[0];
  const selectedList = displayArtworks.slice(0, 4);

  // Fallbacks if fewer than 4 artworks
  while (selectedList.length < 4 && initialArtworks[selectedList.length]) {
    selectedList.push(initialArtworks[selectedList.length]);
  }

  return (
    <div className="page-wrap">
      <Helmet>
        <title>{settings.seoTitle || 'CHINTWO — The Artist\'s Visual Universe'}</title>
        <meta name="description" content={settings.seoDescription || 'The independent creative universe, artwork archive, field notes, and editions of CHINTWO.'} />
        <meta property="og:title" content="CHINTWO — The Artist's Visual Universe" />
        <meta property="og:description" content={settings.homepageSubtitle || 'ART, IDEAS AND EVERYTHING IN BETWEEN.'} />
      </Helmet>

      <Navbar />

      <main id="main-content" className="page-content">
        {/* ═══════════════════════════════════════════════════════
            01 / HERO — THE SIGNATURE EDITORIAL COMPOSITION
            ═══════════════════════════════════════════════════════ */}
        <section className="section" style={{ paddingTop: 'clamp(1.5rem, 3vh, 3rem)', paddingBottom: 'clamp(3rem, 7vh, 6rem)' }}>
          <div className="container">
            <div className="hero-editorial-grid">
              {/* Left Column: Typography */}
              <motion.div
                variants={stagger}
                initial="hidden"
                animate="show"
                className="hero-editorial-content"
              >
                {/* 01 / 05 Stacked Index Badge */}
                <motion.div variants={fadeUp} className="hero-index-badge">
                  <div className="hero-index-badge__rule" />
                  <div className="hero-index-badge__numbers">
                    <span>01 —</span>
                    <span>05</span>
                  </div>
                </motion.div>

                {/* Main Headline: A world shaped by imagination. */}
                <h1 className="hero-editorial-title">
                  <motion.span style={{ display: 'block' }} variants={fadeUp}>
                    A world
                  </motion.span>
                  <motion.span style={{ display: 'block' }} variants={fadeUp}>
                    shaped by
                  </motion.span>
                  <motion.span className="hero-editorial-title__italic" variants={fadeUp}>
                    imagination.
                  </motion.span>
                </h1>

                {/* Thin divider */}
                <motion.div variants={fadeIn} className="hero-editorial-divider" />

                {/* Uppercase Statement */}
                <motion.p variants={fadeUp} className="hero-statement-caps">
                  ART, IDEAS AND<br />
                  EVERYTHING IN BETWEEN.
                </motion.p>

                {/* Introduction Paragraph */}
                <motion.p variants={fadeUp} className="hero-statement-desc">
                  {settings.homepageStatement ||
                    'A creative practice that explores people, places, memories and the space in between reality and imagination.'}
                </motion.p>

                {/* Action Link */}
                <motion.div variants={fadeUp}>
                  <Link to="/work" className="hero-explore-link">
                    EXPLORE THE WORK ↗
                  </Link>
                </motion.div>
              </motion.div>

              {/* Right Column: Dominant Artwork Collage */}
              {heroArtwork && (
                <motion.div
                  initial={prefersReduced ? undefined : { opacity: 0, scale: 0.98, y: 15 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  transition={{ duration: 0.85, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
                >
                  <div className="hero-collage-wrap">
                    {/* Background compass circle ring */}
                    <svg className="hero-compass-circle" viewBox="0 0 360 360" fill="none" aria-hidden="true">
                      <circle cx="180" cy="180" r="165" stroke="currentColor" strokeWidth="1" strokeDasharray="4 4" opacity="0.5" />
                      <circle cx="180" cy="180" r="115" stroke="currentColor" strokeWidth="0.75" opacity="0.35" />
                      <line x1="180" y1="10" x2="180" y2="350" stroke="currentColor" strokeWidth="0.5" strokeDasharray="3 3" opacity="0.35" />
                      <line x1="10" y1="180" x2="350" y2="180" stroke="currentColor" strokeWidth="0.5" strokeDasharray="3 3" opacity="0.25" />
                    </svg>

                    {/* Layered paper sheets */}
                    <div className="hero-paper-layer-back" />
                    <div className="hero-paper-layer-mid" />

                    {/* Artwork Container */}
                    <Link
                      to={`/work/${heroArtwork.slug}`}
                      className="hero-artwork-frame"
                      data-cursor="View"
                      style={{ display: 'block' }}
                      aria-label={`View artwork ${heroArtwork.title}`}
                    >
                      <img
                        src={heroArtwork.coverImage}
                        alt={heroArtwork.title}
                        className="hero-artwork-image"
                        loading="eager"
                      />

                      {/* Painterly crimson brushstroke overlay */}
                      <svg className="hero-crimson-overlay" viewBox="0 0 500 120" fill="none" aria-hidden="true">
                        <defs>
                          <linearGradient id="crimsonBrush" x1="0%" y1="0%" x2="100%" y2="0%">
                            <stop offset="0%" stopColor="#9E1B1B" />
                            <stop offset="35%" stopColor="#C92A2A" />
                            <stop offset="70%" stopColor="#BA2626" />
                            <stop offset="100%" stopColor="#7A1414" />
                          </linearGradient>
                        </defs>
                        <path d="M12 45 C 50 32, 110 38, 170 30 C 230 22, 290 28, 350 24 C 410 20, 460 28, 490 35 C 496 38, 488 48, 475 52 C 430 64, 380 62, 330 68 C 270 75, 210 70, 150 78 C 90 85, 40 76, 16 65 C 8 62, 6 50, 12 45 Z" fill="url(#crimsonBrush)" opacity="0.9" />
                        <path d="M40 50 C 120 40, 240 38, 360 36 C 420 35, 470 42, 482 46 C 465 54, 390 56, 320 60 C 240 64, 140 68, 55 68 C 42 68, 35 58, 40 50 Z" fill="#D32F2F" opacity="0.65" />
                        <circle cx="494" cy="46" r="2.5" fill="#A82020" opacity="0.8" />
                        <circle cx="486" cy="56" r="1.5" fill="#A82020" opacity="0.7" />
                        <circle cx="28" cy="70" r="2" fill="#A82020" opacity="0.75" />
                        <circle cx="20" cy="60" r="1.5" fill="#A82020" opacity="0.6" />
                      </svg>
                    </Link>

                    {/* Washi masking tape strips */}
                    <div className="hero-tape-top" />
                    <div className="hero-tape-bottom" />
                    <div className="hero-tape-side" />

                    {/* Handwritten Fig. tag */}
                    <div className="hero-fig-tag">
                      <span className="hero-fig-tag__text">Fig. 01</span>
                      <span className="hero-fig-tag__text" style={{ fontSize: '1rem', fontStyle: 'italic', opacity: 0.9 }}>
                        Study in Memory
                      </span>
                    </div>

                    {/* Bottom-right coordinates */}
                    <div className="hero-coords-badge">
                      <div>08.5241° N</div>
                      <div>76.9366° E</div>
                    </div>
                  </div>
                </motion.div>
              )}
            </div>
          </div>
        </section>

        {/* ═══════════════════════════════════════════════════════
            02 / SELECTED WORKS — ASYMMETRIC 4-PIECE GALLERY
            ═══════════════════════════════════════════════════════ */}
        <section className="selected-works-section">
          <div className="container">
            {/* Header: 02 Selected Works + Sub-label + Arrows */}
            <ScrollReveal>
              <div className="selected-works-header">
                <div className="selected-works-header__title-group">
                  <span className="selected-works-header__index">02</span>
                  <h2 className="selected-works-header__title">Selected Works</h2>
                </div>

                <div className="selected-works-header__label">
                  A CURATED SELECTION<br />
                  FROM THE ONGOING PRACTICE.
                </div>

                <div className="selected-works-header__arrows">
                  <button
                    className="selected-works-arrow-btn"
                    onClick={handleScrollLeft}
                    aria-label="Scroll left in gallery"
                  >
                    ←
                  </button>
                  <button
                    className="selected-works-arrow-btn"
                    onClick={handleScrollRight}
                    aria-label="Scroll right in gallery"
                  >
                    →
                  </button>
                </div>
              </div>
            </ScrollReveal>

            {/* Asymmetric 4-Artwork Row */}
            <div className="selected-works-gallery-wrap" ref={galleryRef}>
              <div className="selected-works-row">
                {/* 1. Large Landscape */}
                {selectedList[0] && (
                  <ScrollReveal delay={0.05}>
                    <Link
                      to={`/work/${selectedList[0].slug}`}
                      className="selected-work-card"
                      data-cursor="View"
                    >
                      <MaskReveal delay={0.1}>
                        <div className="selected-work-card__image-box" style={{ aspectRatio: '16 / 10' }}>
                          <img
                            src={selectedList[0].coverImage}
                            alt={selectedList[0].title}
                            className="selected-work-card__image"
                            loading="lazy"
                          />
                        </div>
                      </MaskReveal>
                      <div className="selected-work-card__meta">
                        <h3 className="selected-work-card__title">{selectedList[0].title}</h3>
                        <p className="selected-work-card__details">
                          {selectedList[0].year} · {selectedList[0].medium || selectedList[0].category}
                        </p>
                      </div>
                    </Link>
                  </ScrollReveal>
                )}

                {/* 2. Medium Square / Portrait */}
                {selectedList[1] && (
                  <ScrollReveal delay={0.12}>
                    <Link
                      to={`/work/${selectedList[1].slug}`}
                      className="selected-work-card"
                      data-cursor="View"
                    >
                      <MaskReveal delay={0.15}>
                        <div className="selected-work-card__image-box" style={{ aspectRatio: '1 / 1' }}>
                          <img
                            src={selectedList[1].coverImage}
                            alt={selectedList[1].title}
                            className="selected-work-card__image"
                            loading="lazy"
                          />
                        </div>
                      </MaskReveal>
                      <div className="selected-work-card__meta">
                        <h3 className="selected-work-card__title">{selectedList[1].title}</h3>
                        <p className="selected-work-card__details">
                          {selectedList[1].year} · {selectedList[1].medium || selectedList[1].category}
                        </p>
                      </div>
                    </Link>
                  </ScrollReveal>
                )}

                {/* 3. Tall Portrait */}
                {selectedList[2] && (
                  <ScrollReveal delay={0.18}>
                    <Link
                      to={`/work/${selectedList[2].slug}`}
                      className="selected-work-card"
                      data-cursor="View"
                    >
                      <MaskReveal delay={0.2}>
                        <div className="selected-work-card__image-box" style={{ aspectRatio: '3 / 4' }}>
                          <img
                            src={selectedList[2].coverImage}
                            alt={selectedList[2].title}
                            className="selected-work-card__image"
                            loading="lazy"
                          />
                        </div>
                      </MaskReveal>
                      <div className="selected-work-card__meta">
                        <h3 className="selected-work-card__title">{selectedList[2].title}</h3>
                        <p className="selected-work-card__details">
                          {selectedList[2].year} · {selectedList[2].medium || selectedList[2].category}
                        </p>
                      </div>
                    </Link>
                  </ScrollReveal>
                )}

                {/* 4. Narrow Vertical Strip */}
                {selectedList[3] && (
                  <ScrollReveal delay={0.24}>
                    <Link
                      to={`/work/${selectedList[3].slug}`}
                      className="selected-work-card"
                      data-cursor="View"
                    >
                      <MaskReveal delay={0.25}>
                        <div className="selected-work-card__image-box" style={{ aspectRatio: '1 / 2' }}>
                          <img
                            src={selectedList[3].coverImage}
                            alt={selectedList[3].title}
                            className="selected-work-card__image"
                            loading="lazy"
                          />
                        </div>
                      </MaskReveal>
                      <div className="selected-work-card__meta">
                        <h3 className="selected-work-card__title">{selectedList[3].title}</h3>
                        <p className="selected-work-card__details">
                          {selectedList[3].year} · {selectedList[3].medium || selectedList[3].category}
                        </p>
                      </div>
                    </Link>
                  </ScrollReveal>
                )}
              </div>
            </div>

            {/* Action Link: VIEW ALL WORK ↗ */}
            <ScrollReveal delay={0.28}>
              <div className="selected-works-view-all">
                <Link to="/work" className="hero-explore-link">
                  VIEW ALL WORK ↗
                </Link>
              </div>
            </ScrollReveal>
          </div>
        </section>

        {/* ═══════════════════════════════════════════════════════
            03 / THE PERSON — EDITORIAL BIOGRAPHY & PORTRAIT
            ═══════════════════════════════════════════════════════ */}
        <section className="person-section">
          <div className="container">
            <div className="person-editorial-grid">
              {/* Left: Mounted Artist Portrait */}
              <ScrollReveal direction="left">
                <div className="person-portrait-mount">
                  <div className="person-portrait-paper">
                    <img
                      src={settings.artistPortrait || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=1000&auto=format&fit=crop&q=80'}
                      alt={settings.artistName || 'CHINTWO'}
                      className="person-portrait-image"
                      loading="lazy"
                    />
                  </div>

                  {/* Botanical Illustration Accent */}
                  <svg className="person-botanical-accent" viewBox="0 0 100 200" fill="none" aria-hidden="true">
                    <path d="M 50 195 Q 45 140 52 85 Q 58 40 48 10" stroke="#77736B" strokeWidth="1.2" strokeLinecap="round" />
                    <path d="M 48 145 Q 35 130 25 125" stroke="#77736B" strokeWidth="1" strokeLinecap="round" />
                    <circle cx="24" cy="124" r="3" fill="#77736B" opacity="0.8" />
                    <path d="M 50 120 Q 65 105 76 100" stroke="#77736B" strokeWidth="1" strokeLinecap="round" />
                    <circle cx="77" cy="99" r="3" fill="#77736B" opacity="0.8" />
                    <path d="M 52 85 Q 38 70 30 60" stroke="#77736B" strokeWidth="1" strokeLinecap="round" />
                    <circle cx="29" cy="59" r="2.5" fill="#77736B" opacity="0.8" />
                    <path d="M 53 55 Q 68 45 74 35" stroke="#77736B" strokeWidth="1" strokeLinecap="round" />
                    <circle cx="75" cy="34" r="2.5" fill="#77736B" opacity="0.8" />
                    <circle cx="48" cy="9" r="3" fill="#77736B" opacity="0.9" />
                  </svg>

                  {/* Tape strip holding down bottom */}
                  <div className="person-tape-bottom" />
                </div>
              </ScrollReveal>

              {/* Right: Bio Information */}
              <div className="person-info">
                <ScrollReveal delay={0.08}>
                  <span className="person-info__index">03</span>
                  <h2 className="person-info__heading">The Person</h2>
                </ScrollReveal>

                <ScrollReveal delay={0.16}>
                  <p className="person-info__bio">
                    {settings.shortBio ||
                      'An artist, observer and constant collector of visual stories. My work is a reflection of curiosity, nostalgia and the things that stay with us.'}
                  </p>
                </ScrollReveal>

                <ScrollReveal delay={0.24}>
                  <Link to="/about" className="hero-explore-link">
                    READ THE STORY ↗
                  </Link>
                </ScrollReveal>
              </div>
            </div>
          </div>

          {/* Background Compass Arc in Bottom Right */}
          <svg className="person-bg-compass" viewBox="0 0 400 400" fill="none" aria-hidden="true">
            <circle cx="360" cy="360" r="290" stroke="currentColor" strokeWidth="1" strokeDasharray="4 4" />
            <circle cx="360" cy="360" r="200" stroke="currentColor" strokeWidth="0.75" />
          </svg>
        </section>

        {/* ═══════════════════════════════════════════════════════
            04 / FIELD NOTES — STUDIO WRITINGS & DISPATCHES
            ═══════════════════════════════════════════════════════ */}
        {posts.length > 0 && (
          <section className="section" style={{ borderTop: '1px solid var(--color-border)', backgroundColor: 'var(--color-bg)' }}>
            <div className="container">
              <ScrollReveal>
                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'flex-end',
                  marginBottom: 'clamp(2.5rem, 5vw, 4rem)',
                }}>
                  <div>
                    <span className="section-label" style={{ marginBottom: '0.75rem' }}>04 / WRITING</span>
                    <h2 className="type-display-xl">Field Notes</h2>
                  </div>
                  <Link to="/journal" className="link-underline" style={{ fontFamily: 'var(--font-mono)', fontSize: '0.6875rem', letterSpacing: '0.14em', textTransform: 'uppercase' }}>
                    All Entries →
                  </Link>
                </div>
              </ScrollReveal>

              <div style={{ display: 'flex', flexDirection: 'column' }}>
                {posts.map((post, i) => (
                  <ScrollReveal key={post.id} delay={i * 0.06}>
                    <article className="journal-row">
                      <div className="journal-row__meta">
                        <span className="type-meta">
                          {post.publishedAt ? formatDate(post.publishedAt) : 'Recent Entry'}
                        </span>
                        {post.tags && post.tags.length > 0 && (
                          <span className="type-meta-sm" style={{ display: 'block', marginTop: '0.25rem', color: 'var(--color-muted)' }}>
                            {post.tags[0]}
                          </span>
                        )}
                      </div>

                      <div className="journal-row__body">
                        <h3 className="type-display-md" style={{ marginBottom: '0.75rem' }}>
                          <Link to={`/journal/${post.slug}`} className="link-underline">
                            {post.title}
                          </Link>
                        </h3>
                        <p className="type-body" style={{ color: 'var(--color-stone)', maxWidth: '620px' }}>
                          {post.excerpt}
                        </p>
                      </div>

                      <div className="journal-row__action">
                        <Link to={`/journal/${post.slug}`} className="btn-editorial" style={{ padding: '0.5rem 1rem', fontSize: '0.625rem' }}>
                          Read Note →
                        </Link>
                      </div>
                    </article>
                  </ScrollReveal>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* ═══════════════════════════════════════════════════════
            05 / EDITIONS — COLLECTIBLES CATALOGUE PREVIEW
            ═══════════════════════════════════════════════════════ */}
        {products.length > 0 && (
          <section className="section" style={{ borderTop: '1px solid var(--color-border)', backgroundColor: 'var(--color-bg)' }}>
            <div className="container">
              <ScrollReveal>
                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'flex-end',
                  marginBottom: 'clamp(2.5rem, 5vw, 4rem)',
                }}>
                  <div>
                    <span className="section-label" style={{ marginBottom: '0.75rem' }}>05 / COLLECTIBLES</span>
                    <h2 className="type-display-xl">The Editions</h2>
                  </div>
                  <Link to="/editions" className="link-underline" style={{ fontFamily: 'var(--font-mono)', fontSize: '0.6875rem', letterSpacing: '0.14em', textTransform: 'uppercase' }}>
                    Browse All Editions →
                  </Link>
                </div>
              </ScrollReveal>

              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 280px), 1fr))',
                gap: 'clamp(1.5rem, 3vw, 2.5rem)',
              }}>
                {products.map((prod, i) => (
                  <ScrollReveal key={prod.id} delay={i * 0.08}>
                    <Link to={`/editions/${prod.slug}`} className="artwork-card" style={{ display: 'block' }} data-cursor="View">
                      <MaskReveal delay={i * 0.06}>
                        <div className="artwork-card__image-wrap" style={{ aspectRatio: '4 / 5' }}>
                          {prod.images && prod.images[0] && (
                            <img
                              src={prod.images[0]}
                              alt={prod.title}
                              className="artwork-card__image"
                              loading="lazy"
                              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                            />
                          )}
                        </div>
                      </MaskReveal>
                      <div className="artwork-card__meta">
                        <div>
                          <h3 className="artwork-card__title" style={{ fontSize: '1.05rem' }}>{prod.title}</h3>
                          <span className="type-meta-sm" style={{ color: 'var(--color-stone)' }}>
                            {prod.edition || prod.type || 'Limited Edition'}
                          </span>
                        </div>
                        <div style={{ textAlign: 'right' }}>
                          <span className="type-meta" style={{ color: 'var(--color-charcoal)', fontWeight: 600 }}>
                            {formatPrice(prod.price, prod.currency)}
                          </span>
                          <span className="type-meta-sm" style={{
                            display: 'block',
                            color: prod.available ? '#10b981' : 'var(--color-muted)',
                            marginTop: '0.15rem',
                          }}>
                            {prod.available ? 'Available' : 'Sold Out'}
                          </span>
                        </div>
                      </div>
                    </Link>
                  </ScrollReveal>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* ═══════════════════════════════════════════════════════
            06 / DIALOGUE — CLOSING INVITATION
            ═══════════════════════════════════════════════════════ */}
        <section
          className="section-lg"
          style={{ backgroundColor: 'var(--color-bg)', textAlign: 'center', borderTop: '1px solid var(--color-border)' }}
        >
          <div className="container-narrow">
            <ScrollReveal>
              <span className="section-label" style={{ justifyContent: 'center', marginBottom: '1.5rem' }}>
                06 / DIALOGUE
              </span>
            </ScrollReveal>

            <ScrollReveal delay={0.08}>
              <h2 className="type-display-lg" style={{ marginBottom: '1.5rem' }}>
                Something in mind?
              </h2>
            </ScrollReveal>

            <ScrollReveal delay={0.14}>
              <p className="type-editorial" style={{
                color: 'var(--color-stone)',
                marginBottom: '2.5rem',
                maxWidth: '540px',
                marginLeft: 'auto',
                marginRight: 'auto',
              }}>
                {settings.contactText || 'Available for selected editorial commissions, original artwork acquisitions, gallery exhibitions, and collaborative inquiries.'}
              </p>
            </ScrollReveal>

            <ScrollReveal delay={0.2}>
              <div style={{ display: 'flex', gap: '1.25rem', justifyContent: 'center', flexWrap: 'wrap' }}>
                <Link to="/contact" className="btn-editorial btn-editorial--filled">
                  Start a Dialogue
                </Link>
                {settings.email && (
                  <a href={`mailto:${settings.email}`} className="btn-editorial">
                    Direct Email
                  </a>
                )}
              </div>
            </ScrollReveal>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
