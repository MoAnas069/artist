import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { getAvailableProducts } from '../../services/productService';
import type { Product } from '../../types';
import { formatPrice } from '../../utils/helpers';
import { usePrefersReducedMotion } from '../../hooks/useMediaQuery';
import LoadingState from '../../components/ui/LoadingState';
import EmptyState from '../../components/ui/EmptyState';
import Footer from '../../components/layout/Footer';
import BackToHome from '../../components/layout/BackToHome';

function ScrollReveal({ children }: { children: React.ReactNode; delay?: number }) {
  return <>{children}</>;
}

export default function Shop() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  const loadData = () => {
    getAvailableProducts()
      .then(setProducts)
      .catch(console.error)
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    loadData();
    window.addEventListener('studio_products_updated', loadData);
    return () => window.removeEventListener('studio_products_updated', loadData);
  }, []);

  if (loading) return <LoadingState />;

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
          <motion.span
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="type-meta"
            style={{ color: 'var(--color-muted)', marginBottom: 'var(--space-md)', display: 'block' }}
          >
            EDITIONS & PRINTS
          </motion.span>
          <h1
            className="type-display-xl"
            style={{ margin: 0 }}
          >
            Shop
          </h1>
        </div>
      </section>

      {/* Products */}
      <section style={{ padding: '0 var(--space-lg) var(--space-3xl)' }}>
        <div style={{ maxWidth: 'var(--max-width)', margin: '0 auto' }}>
          {products.length === 0 ? (
            <EmptyState title="No products yet" message="Products and editions will appear here when available." />
          ) : (
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
              gap: 'clamp(2rem, 4vw, 4rem)',
            }}>
              {products.map((product, i) => (
                <ScrollReveal key={product.id} delay={i * 0.05}>
                  <Link
                    to={`/shop/${product.slug}`}
                    data-cursor="View"
                    style={{ textDecoration: 'none', display: 'block' }}
                  >
                    <div
                      className="artwork-image-container"
                      style={{ aspectRatio: '4/5', marginBottom: 'var(--space-md)', backgroundColor: 'var(--color-cream)' }}
                    >
                      {product.images?.[0] ? (
                        <img
                          src={product.images[0]}
                          alt={product.title}
                          className="artwork-image"
                          loading="lazy"
                          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                        />
                      ) : (
                        <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                          <span className="type-meta" style={{ color: 'var(--color-muted)' }}>No image</span>
                        </div>
                      )}
                    </div>

                    <h2 className="type-body" style={{ fontWeight: 500, marginBottom: 'var(--space-xs)' }}>
                      {product.title}
                    </h2>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                      <span className="type-meta-sm" style={{ color: 'var(--color-muted)' }}>
                        {product.type} {product.edition && `— ${product.edition}`}
                      </span>
                      <span className="type-meta" style={{ color: 'var(--color-charcoal)' }}>
                        {formatPrice(product.price, product.currency)}
                      </span>
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
