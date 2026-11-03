import { useEffect, useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { motion, AnimatePresence } from 'framer-motion';
import { getAvailableProducts } from '../../services/productService';
import type { Product } from '../../types';
import { formatPrice } from '../../utils/helpers';
import { useSiteSettings } from '../../hooks/useSiteSettings';
import Navbar from '../../components/layout/Navbar';
import Footer from '../../components/layout/Footer';
import LoadingState from '../../components/ui/LoadingState';
import EmptyState from '../../components/ui/EmptyState';

export default function Editions() {
  const { settings } = useSiteSettings();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedType, setSelectedType] = useState<string>('All');

  useEffect(() => {
    getAvailableProducts()
      .then(setProducts)
      .catch((err) => console.error('Error fetching editions:', err))
      .finally(() => setLoading(false));
  }, []);

  const types = useMemo(() => {
    const allTypes = products.map((p) => p.type).filter(Boolean);
    return ['All', ...Array.from(new Set(allTypes))];
  }, [products]);

  const filteredProducts = useMemo(() => {
    if (selectedType === 'All') return products;
    return products.filter((p) => p.type === selectedType);
  }, [products, selectedType]);

  if (loading) return <LoadingState />;

  return (
    <div className="page-wrap">
      <Helmet>
        <title>{`The Editions — Collectible Prints & Artifacts | ${settings.artistName || 'CHINTWO'}`}</title>
        <meta
          name="description"
          content={`Limited edition archival prints, publications, and studio artifacts by ${settings.artistName || 'CHINTWO'}. Each piece is individually inspected and signed.`}
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
              <span className="type-meta">04 / THE EDITIONS</span>
              <span className="type-meta">ARCHIVAL PRINTS &amp; ARTIFACTS</span>
            </div>
          </div>
        </div>

        {/* Header Section */}
        <section className="section" style={{ paddingBottom: 'clamp(2.5rem, 5vh, 4rem)' }}>
          <div className="container">
            <div className="page-header-grid">
              <div className="page-header-grid__title">
                <h1 className="type-display-hero">The Editions</h1>
              </div>
              <div className="page-header-grid__desc">
                <p className="type-editorial" style={{ color: 'var(--color-stone)' }}>
                  Archival museum-grade prints, limited edition folios, and studio collectibles. Hand-numbered and signed with a certificate of authenticity.
                </p>
              </div>
            </div>

            {/* Filter Pills */}
            {types.length > 2 && (
              <div className="filter-bar">
                {types.map((type) => (
                  <button
                    key={type}
                    onClick={() => setSelectedType(type)}
                    className={`filter-btn ${selectedType === type ? 'filter-btn--active' : 'filter-btn--inactive'}`}
                  >
                    {type}
                  </button>
                ))}
              </div>
            )}
          </div>
        </section>

        {/* Editions Catalogue Grid */}
        <section style={{ paddingBottom: 'clamp(5rem, 10vh, 8rem)' }}>
          <div className="container">
            {filteredProducts.length === 0 ? (
              <EmptyState
                title="No editions available"
                description={`There are currently no items under "${selectedType}".`}
              />
            ) : (
              <motion.div
                layout
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fill, minmax(min(100%, 280px), 1fr))',
                  gap: 'clamp(1.5rem, 3.5vw, 3rem)',
                }}
              >
                <AnimatePresence>
                  {filteredProducts.map((prod) => (
                    <motion.div
                      key={prod.id}
                      layout
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                    >
                      <Link to={`/editions/${prod.slug}`} className="artwork-card" style={{ display: 'block' }} data-cursor="View">
                        <div
                          className="artwork-card__image-wrap"
                          style={{
                            aspectRatio: '4 / 5',
                            backgroundColor: 'var(--color-bg-alt)',
                          }}
                        >
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

                        <div className="artwork-card__meta">
                          <div>
                            <h2 className="artwork-card__title" style={{ fontSize: '1.15rem' }}>
                              {prod.title}
                            </h2>
                            <span className="type-meta-sm" style={{ color: 'var(--color-stone)' }}>
                              {prod.edition || prod.type || 'Limited Edition'}
                            </span>
                          </div>

                          <div style={{ textAlign: 'right' }}>
                            <span className="type-meta" style={{ color: 'var(--color-charcoal)', fontWeight: 600 }}>
                              {formatPrice(prod.price, prod.currency)}
                            </span>
                            <span
                              className="type-meta-sm"
                              style={{
                                display: 'block',
                                color: prod.available ? '#10b981' : 'var(--color-muted)',
                                marginTop: '0.15rem',
                              }}
                            >
                              {prod.available ? 'Available' : 'Sold Out'}
                            </span>
                          </div>
                        </div>
                      </Link>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </motion.div>
            )}

            {/* Quality Statement / Guarantee */}
            <div
              style={{
                borderTop: '1px solid var(--color-border)',
                marginTop: 'clamp(4rem, 8vh, 6rem)',
                paddingTop: '2.5rem',
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
                gap: '2rem',
              }}
            >
              <div>
                <span className="type-meta-sm" style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--color-charcoal)' }}>
                  ARCHIVAL PIGMENT
                </span>
                <p className="type-body-sm">
                  Printed using 11-color UltraChrome HDR archival pigment inks on 310gsm 100% cotton rag paper. Rated lightfast for 100+ years.
                </p>
              </div>

              <div>
                <span className="type-meta-sm" style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--color-charcoal)' }}>
                  SIGNED &amp; NUMBERED
                </span>
                <p className="type-body-sm">
                  Every print is individually inspected, hand-numbered in graphite, and embossed with the official CHINTWO studio seal.
                </p>
              </div>

              <div>
                <span className="type-meta-sm" style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--color-charcoal)' }}>
                  GLOBAL PACKAGING
                </span>
                <p className="type-body-sm">
                  Shipped worldwide in reinforced, acid-free archival tubes or museum-grade flat packaging with tracked courier dispatch.
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
