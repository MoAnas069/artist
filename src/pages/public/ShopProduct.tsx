import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { getProductBySlug } from '../../services/productService';
import type { Product } from '../../types';
import { formatPrice } from '../../utils/helpers';
import { usePrefersReducedMotion } from '../../hooks/useMediaQuery';
import LoadingState from '../../components/ui/LoadingState';
import Footer from '../../components/layout/Footer';
import ShopInquiryModal from '../../components/shop/ShopInquiryModal';
import BackToHome from '../../components/layout/BackToHome';

function ScrollReveal({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}

export default function ShopProduct() {
  const { slug } = useParams<{ slug: string }>();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [activeImage, setActiveImage] = useState(0);
  const [isInquiryOpen, setIsInquiryOpen] = useState(false);

  useEffect(() => {
    if (!slug) return;
    setLoading(true);
    getProductBySlug(slug)
      .then((p) => {
        if (!p) setNotFound(true);
        else setProduct(p);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [slug]);

  if (loading) return <LoadingState />;
  if (notFound || !product) {
    return (
      <main style={{ minHeight: '80vh', display: 'flex', alignItems: 'center', justifyContent: 'center', textAlign: 'center', padding: 'var(--space-xl)' }}>
        <div>
          <h1 className="type-display-lg" style={{ marginBottom: 'var(--space-lg)' }}>Product not found</h1>
          <Link to="/shop" className="type-meta link-underline" style={{ color: 'var(--color-stone)' }}>← BACK TO SHOP</Link>
        </div>
      </main>
    );
  }

  const images = product.images?.length > 0 ? product.images : [];

  return (
    <main>
      <BackToHome />
      {/* Product */}
      <section style={{
        minHeight: '100vh',
        padding: 'calc(var(--nav-height) + var(--space-2xl)) var(--space-lg) var(--space-2xl)',
      }}>
        <div style={{
          maxWidth: 'var(--max-width)',
          margin: '0 auto',
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(min(400px, 100%), 1fr))',
          gap: 'clamp(2rem, 5vw, 4rem)',
          alignItems: 'start',
        }}>
          {/* Images */}
          <div>
            {images.length > 0 ? (
              <>
                <motion.img
                  key={activeImage}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.4 }}
                  src={images[activeImage]}
                  alt={product.title}
                  style={{ width: '100%', aspectRatio: '4/5', objectFit: 'cover', marginBottom: 'var(--space-md)' }}
                />
                {images.length > 1 && (
                  <div style={{ display: 'flex', gap: 'var(--space-sm)' }}>
                    {images.map((img, i) => (
                      <button
                        key={i}
                        onClick={() => setActiveImage(i)}
                        style={{
                          width: 60,
                          height: 60,
                          padding: 0,
                          border: i === activeImage ? '2px solid var(--color-charcoal)' : '1px solid var(--color-border)',
                          overflow: 'hidden',
                          opacity: i === activeImage ? 1 : 0.6,
                          transition: 'opacity 0.3s ease',
                        }}
                      >
                        <img src={img} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                      </button>
                    ))}
                  </div>
                )}
              </>
            ) : (
              <div style={{ aspectRatio: '4/5', backgroundColor: 'var(--color-cream)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <span className="type-meta" style={{ color: 'var(--color-muted)' }}>No image</span>
              </div>
            )}
          </div>

          {/* Details */}
          <div style={{ position: 'sticky', top: 'calc(var(--nav-height) + var(--space-xl))' }}>
            <span className="type-meta" style={{ color: 'var(--color-muted)', marginBottom: 'var(--space-md)', display: 'block' }}>
              {product.type}
            </span>
            <h1 className="type-display-md" style={{ marginBottom: 'var(--space-lg)' }}>
              {product.title}
            </h1>
            <p className="type-display-sm" style={{ marginBottom: 'var(--space-xl)', fontFamily: 'var(--font-body)', fontWeight: 400 }}>
              {formatPrice(product.price, product.currency)}
            </p>

            {product.description && (
              <p className="type-body" style={{ color: 'var(--color-stone)', marginBottom: 'var(--space-xl)', lineHeight: 1.8 }}>
                {product.description}
              </p>
            )}

            {/* Specifications */}
            <div style={{ borderTop: '1px solid var(--color-border)', paddingTop: 'var(--space-lg)' }}>
              {[
                { label: 'Edition', value: product.edition },
                { label: 'Materials', value: product.materials },
                { label: 'Dimensions', value: product.dimensions },
                { label: 'Availability', value: product.stock > 0 ? `${product.stock} remaining` : 'Sold out' },
              ]
                .filter((spec) => spec.value)
                .map((spec) => (
                  <div
                    key={spec.label}
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      padding: 'var(--space-sm) 0',
                      borderBottom: '1px solid var(--color-border)',
                    }}
                  >
                    <span className="type-meta-sm" style={{ color: 'var(--color-muted)' }}>{spec.label}</span>
                    <span className="type-body-sm" style={{ color: 'var(--color-charcoal)' }}>{spec.value}</span>
                  </div>
                ))}
            </div>

            {/* CTA */}
            <button
              data-cursor="Inquire"
              onClick={() => setIsInquiryOpen(true)}
              style={{
                width: '100%',
                marginTop: 'var(--space-xl)',
                padding: '1.1rem',
                backgroundColor: 'var(--color-charcoal)',
                color: 'var(--color-ivory)',
                fontFamily: 'var(--font-body)',
                fontSize: '0.75rem',
                fontWeight: 600,
                textTransform: 'uppercase',
                letterSpacing: '0.15em',
                transition: 'all 0.3s ease',
                cursor: 'pointer',
                borderRadius: 4,
                boxShadow: '0 4px 15px rgba(0, 0, 0, 0.12)',
              }}
              onMouseEnter={(e) => (e.currentTarget.style.opacity = '0.88')}
              onMouseLeave={(e) => (e.currentTarget.style.opacity = '1')}
            >
              {product.stock > 0 ? 'INQUIRE TO PURCHASE' : 'INQUIRE / WAITLIST FOR NEXT EDITION'}
            </button>
          </div>
        </div>
      </section>

      <section style={{ padding: 'var(--space-xl) var(--space-lg) var(--space-2xl)', textAlign: 'center' }}>
        <Link to="/shop" className="type-meta link-underline" data-cursor="Back" style={{ color: 'var(--color-stone)' }}>
          ← BACK TO SHOP
        </Link>
      </section>

      {/* Inquiry Form Modal */}
      <ShopInquiryModal
        product={product}
        isOpen={isInquiryOpen}
        onClose={() => setIsInquiryOpen(false)}
      />

      <Footer />
    </main>
  );
}
