import { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { motion, AnimatePresence } from 'framer-motion';
import { getProductBySlug, getAvailableProducts } from '../../services/productService';
import type { Product } from '../../types';
import { formatPrice } from '../../utils/helpers';
import { useSiteSettings } from '../../hooks/useSiteSettings';
import Navbar from '../../components/layout/Navbar';
import Footer from '../../components/layout/Footer';
import LoadingState from '../../components/ui/LoadingState';
import ShopInquiryModal from '../../components/shop/ShopInquiryModal';

export default function EditionDetail() {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const { settings } = useSiteSettings();
  const [product, setProduct] = useState<Product | null>(null);
  const [allProducts, setAllProducts] = useState<Product[]>([]);
  const [selectedImage, setSelectedImage] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);

  useEffect(() => {
    if (!slug) return;
    setLoading(true);

    Promise.all([getProductBySlug(slug), getAvailableProducts()])
      .then(([foundProduct, productsList]) => {
        if (!foundProduct) {
          navigate('/editions', { replace: true });
          return;
        }
        setProduct(foundProduct);
        setSelectedImage(foundProduct.images?.[0] || '');
        setAllProducts(productsList);
      })
      .catch((err) => {
        console.error('Error fetching edition detail:', err);
        navigate('/editions', { replace: true });
      })
      .finally(() => setLoading(false));
  }, [slug, navigate]);

  if (loading || !product) return <LoadingState />;

  const relatedProducts = allProducts
    .filter((p) => p.id !== product.id)
    .slice(0, 3);

  const images = product.images && product.images.length > 0 ? product.images : [];

  return (
    <div className="page-wrap">
      <Helmet>
        <title>{`${product.title} — ${settings.artistName || 'CHINTWO'} Editions`}</title>
        <meta
          name="description"
          content={`${product.title}. ${product.edition || product.type}. ${product.description || ''}`}
        />
        <meta property="og:title" content={`${product.title} — ${settings.artistName || 'CHINTWO'}`} />
        {images[0] && <meta property="og:image" content={images[0]} />}
      </Helmet>

      <Navbar />

      <main id="main-content" className="page-content">
        {/* Top Breadcrumb */}
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
                to="/editions"
                className="link-underline"
                style={{
                  fontFamily: 'var(--font-mono)',
                  fontSize: '0.6875rem',
                  letterSpacing: '0.12em',
                  textTransform: 'uppercase',
                }}
              >
                ← Return to All Editions
              </Link>

              <span className="type-meta-sm">
                EDITION CAT. #{product.id.slice(0, 6).toUpperCase()}
              </span>
            </div>
          </div>
        </div>

        {/* Product Details Section */}
        <section className="section" style={{ paddingTop: 'clamp(2rem, 5vh, 4rem)' }}>
          <div className="container">
            <div className="editorial-split-7-5">
              {/* Left 7 Columns: Product Photography & Gallery */}
              <div className="editorial-split-7-5__main">
                <div
                  style={{
                    backgroundColor: 'var(--color-bg-alt)',
                    position: 'relative',
                    cursor: 'zoom-in',
                    overflow: 'hidden',
                    boxShadow: '0 8px 30px rgba(0,0,0,0.05)',
                  }}
                  onClick={() => setIsLightboxOpen(true)}
                  title="Click to zoom image"
                >
                  <img
                    src={selectedImage || images[0]}
                    alt={product.title}
                    style={{
                      width: '100%',
                      maxHeight: '75vh',
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
                    Zoom Image ⤢
                  </div>
                </div>

                {/* Thumbnails */}
                {images.length > 1 && (
                  <div style={{ display: 'flex', gap: '0.75rem', marginTop: '1.25rem', overflowX: 'auto', paddingBottom: '0.5rem' }}>
                    {images.map((img, i) => (
                      <button
                        key={i}
                        onClick={() => setSelectedImage(img)}
                        style={{
                          width: '80px',
                          height: '80px',
                          flexShrink: 0,
                          border: selectedImage === img ? '2px solid var(--color-charcoal)' : '1px solid var(--color-border)',
                          padding: 0,
                          overflow: 'hidden',
                          backgroundColor: 'var(--color-bg-alt)',
                          cursor: 'pointer',
                        }}
                      >
                        <img
                          src={img}
                          alt={`${product.title} view ${i + 1}`}
                          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                        />
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Right 5 Columns: Edition Specifications & Acquisition */}
              <div className="editorial-split-7-5__side">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: '0.5rem' }}>
                  <span className="type-meta">{product.type || 'Archival Edition'}</span>
                  <span
                    className="type-meta-sm"
                    style={{
                      color: product.available ? '#10b981' : 'var(--color-muted)',
                      fontWeight: 600,
                    }}
                  >
                    {product.available ? '● Available in Studio' : '○ Sold Out'}
                  </span>
                </div>

                <h1 className="type-display-xl" style={{ marginBottom: '0.75rem', lineHeight: 1.1 }}>
                  {product.title}
                </h1>

                <p
                  className="type-display-md"
                  style={{
                    color: 'var(--color-charcoal)',
                    marginBottom: '2rem',
                  }}
                >
                  {formatPrice(product.price, product.currency)}
                </p>

                {/* Specification Table */}
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
                    {product.edition && (
                      <>
                        <dt className="type-meta-sm" style={{ color: 'var(--color-muted)' }}>
                          Edition
                        </dt>
                        <dd style={{ color: 'var(--color-charcoal)' }}>{product.edition}</dd>
                      </>
                    )}

                    {product.dimensions && (
                      <>
                        <dt className="type-meta-sm" style={{ color: 'var(--color-muted)' }}>
                          Dimensions
                        </dt>
                        <dd style={{ color: 'var(--color-charcoal)' }}>{product.dimensions}</dd>
                      </>
                    )}

                    {product.materials && (
                      <>
                        <dt className="type-meta-sm" style={{ color: 'var(--color-muted)' }}>
                          Materials
                        </dt>
                        <dd style={{ color: 'var(--color-charcoal)' }}>{product.materials}</dd>
                      </>
                    )}

                    <dt className="type-meta-sm" style={{ color: 'var(--color-muted)' }}>
                      Authentication
                    </dt>
                    <dd style={{ color: 'var(--color-charcoal)' }}>Hand-signed &amp; numbered by artist</dd>
                  </dl>
                </div>

                {/* Description */}
                {product.description && (
                  <div style={{ marginBottom: '2.5rem' }}>
                    <h2 className="type-meta-sm" style={{ marginBottom: '0.75rem', color: 'var(--color-charcoal)' }}>
                      Edition Description
                    </h2>
                    <p className="type-reading" style={{ color: 'var(--color-ink)', lineHeight: 1.75 }}>
                      {product.description}
                    </p>
                  </div>
                )}

                {/* Acquisition Button */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                  <button
                    onClick={() => setIsModalOpen(true)}
                    disabled={!product.available}
                    className="btn-editorial btn-editorial--filled"
                    style={{
                      justifyContent: 'center',
                      opacity: product.available ? 1 : 0.6,
                      cursor: product.available ? 'pointer' : 'not-allowed',
                    }}
                  >
                    {product.available ? 'Inquire About Acquisition' : 'Currently Unavailable'}
                  </button>
                  <p className="type-meta-sm" style={{ textAlign: 'center', color: 'var(--color-muted)' }}>
                    No payment is collected on this page. Studio manages orders directly with clients.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Related Editions */}
        {relatedProducts.length > 0 && (
          <section
            className="section"
            style={{
              borderTop: '1px solid var(--color-border)',
              backgroundColor: 'var(--color-bg-alt)',
            }}
          >
            <div className="container">
              <span className="section-label" style={{ marginBottom: '2rem' }}>
                MORE EDITIONS
              </span>
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
                  gap: 'clamp(1.5rem, 3vw, 2.5rem)',
                }}
              >
                {relatedProducts.map((rel) => (
                  <Link key={rel.id} to={`/editions/${rel.slug}`} className="artwork-card" style={{ display: 'block' }}>
                    <div className="artwork-card__image-wrap" style={{ aspectRatio: '4 / 5' }}>
                      {rel.images && rel.images[0] && (
                        <img
                          src={rel.images[0]}
                          alt={rel.title}
                          className="artwork-card__image"
                          loading="lazy"
                          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                        />
                      )}
                    </div>
                    <div className="artwork-card__meta">
                      <div>
                        <h3 className="artwork-card__title" style={{ fontSize: '1.05rem' }}>
                          {rel.title}
                        </h3>
                        <span className="type-meta-sm" style={{ color: 'var(--color-stone)' }}>
                          {rel.edition || rel.type}
                        </span>
                      </div>
                      <span className="type-meta" style={{ color: 'var(--color-charcoal)' }}>
                        {formatPrice(rel.price, rel.currency)}
                      </span>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </section>
        )}
      </main>

      {/* Inquiry Modal */}
      <ShopInquiryModal
        product={product}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />

      {/* Full-screen Lightbox */}
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
              aria-label="Close"
            >
              ✕
            </button>
            <img
              src={selectedImage || images[0]}
              alt={product.title}
              style={{
                maxWidth: '92vw',
                maxHeight: '92vh',
                objectFit: 'contain',
              }}
            />
          </motion.div>
        )}
      </AnimatePresence>

      <Footer />
    </div>
  );
}
