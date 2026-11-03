import { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { ShoppingBag, ShieldCheck, Truck, Sparkles, Check, ArrowRight } from 'lucide-react';
import { getAvailableProducts } from '../../services/productService';
import type { Product } from '../../types';
import { useSiteSettings } from '../../hooks/useSiteSettings';
import { useCart } from '../../context/CartContext';
import Navbar from '../../components/layout/Navbar';
import Footer from '../../components/layout/Footer';
import LoadingState from '../../components/ui/LoadingState';
import inventoryData from '../../../content/inventory.json';

const DEFAULT_FRAMES = [
  { id: 'unframed', name: 'Unframed (Rolled in archival paper)', priceDelta: 0 },
  { id: 'walnut', name: 'Solid American Walnut & Museum UV Glass', priceDelta: 110 },
  { id: 'black-oak', name: 'Stained Black Oak & Anti-Reflective Glass', priceDelta: 95 },
  { id: 'natural-ash', name: 'Natural White Ash Deep Float Frame', priceDelta: 105 },
];

export default function Editions() {
  const { settings } = useSiteSettings();
  const { addItem, openCart } = useCart();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedFrames, setSelectedFrames] = useState<Record<string, string>>({});

  useEffect(() => {
    let mounted = true;
    getAvailableProducts()
      .then((data) => {
        if (!mounted) return;
        const list = data.length > 0 ? data : (inventoryData.prints as any);
        setProducts(list);
        const initialFrames: Record<string, string> = {};
        list.forEach((p: any) => {
          initialFrames[p.id] = 'unframed';
        });
        setSelectedFrames(initialFrames);
      })
      .catch(() => {
        if (mounted) {
          const list = inventoryData.prints as any;
          setProducts(list);
          const initialFrames: Record<string, string> = {};
          list.forEach((p: any) => {
            initialFrames[p.id] = 'unframed';
          });
          setSelectedFrames(initialFrames);
        }
      })
      .finally(() => {
        if (mounted) setLoading(false);
      });
    return () => {
      mounted = false;
    };
  }, []);

  if (loading) return <LoadingState />;

  const handleFrameChange = (productId: string, frameId: string) => {
    setSelectedFrames((prev) => ({ ...prev, [productId]: frameId }));
  };

  const handleAddToCart = (product: Product) => {
    const frameId = selectedFrames[product.id] || 'unframed';
    addItem(product, frameId);
  };

  return (
    <div className="dusk-page">
      <Helmet>
        <title>{`Archival Prints & Limited Editions — ${settings.artistName || 'Chintwo'}`}</title>
        <meta
          name="description"
          content="Museum-grade archival Giclée prints and hand-pulled screenprints on 310gsm German Etching cotton rag. Signed and numbered by Chintwo."
        />
      </Helmet>

      <Navbar />

      <main id="main-content" className="dusk-editions-page">
        {/* Header */}
        <section className="dusk-editions-header">
          <div className="dusk-section-index-badge">
            <span className="badge-num">02</span>
            <span className="badge-text">LIMITED EDITIONS</span>
          </div>

          <div className="dusk-editions-title-row">
            <h1 className="dusk-editions-title">The Print Archive</h1>
            <p className="dusk-editions-lead">
              Strictly limited fine art impressions on 310gsm Hahnemühle German Etching paper and Somerset Satin. Each edition is embossed with the studio seal, numbered, and hand-signed in pencil.
            </p>
          </div>

          {/* Standards & Guarantees */}
          <div className="dusk-editions-features">
            <div className="dusk-feature-item">
              <ShieldCheck size={16} className="dusk-feature-icon" />
              <div>
                <h4>Archival Longevity</h4>
                <p>100% cotton rag, acid-free pigment inks rated for 100+ years lightfastness.</p>
              </div>
            </div>
            <div className="dusk-feature-item">
              <Sparkles size={16} className="dusk-feature-icon" />
              <div>
                <h4>Signed & Numbered</h4>
                <p>Strictly capped editions with blind-embossed studio seal of authenticity.</p>
              </div>
            </div>
            <div className="dusk-feature-item">
              <Truck size={16} className="dusk-feature-icon" />
              <div>
                <h4>Global Courier Delivery</h4>
                <p>Insured courier dispatch in reinforced custom timber or telescopic tubes.</p>
              </div>
            </div>
          </div>
        </section>

        {/* Editions Catalog */}
        <section className="dusk-editions-grid-section" aria-label="Available Editions">
          <div className="dusk-editions-catalog">
            {products.map((product) => {
              const frames = (product as any).framingOptions || DEFAULT_FRAMES;
              const currentFrameId = selectedFrames[product.id] || 'unframed';
              const chosenFrame = frames.find((f: any) => f.id === currentFrameId) || frames[0];
              const calculatedPrice = (product.price || 95) + chosenFrame.priceDelta;

              return (
                <article key={product.id} className="dusk-edition-full-card">
                  <div className="dusk-edition-visual breathing-artwork">
                    <img
                      src={(product.images && product.images[0]) || (product as any).coverImage || ''}
                      alt={product.title}
                      loading="lazy"
                    />
                    <div className="dusk-edition-badge">
                      {(product as any).editionSize
                        ? `Edition of ${(product as any).editionSize}`
                        : product.edition || 'Limited Edition'}
                    </div>
                  </div>

                  <div className="dusk-edition-content">
                    <div className="dusk-edition-top">
                      <span className="dusk-edition-type">
                        {(product as any).editionType || 'ARCHIVAL GICLÉE'}
                      </span>
                      <h2 className="dusk-edition-title">{product.title}</h2>
                      <div className="dusk-edition-calc-price">
                        £{calculatedPrice} <span className="currency-label">GBP</span>
                      </div>
                    </div>

                    <p className="dusk-edition-desc">{product.description}</p>

                    {/* Framing Selector */}
                    <div className="dusk-framing-selector">
                      <label className="dusk-framing-label">
                        <span>SELECT PRESENTATION & FRAMING</span>
                      </label>
                      <div className="dusk-frame-radios" role="radiogroup">
                        {frames.map((frame: any) => {
                          const isSelected = currentFrameId === frame.id;
                          return (
                            <button
                              key={frame.id}
                              type="button"
                              role="radio"
                              aria-checked={isSelected}
                              onClick={() => handleFrameChange(product.id, frame.id)}
                              className={`dusk-frame-option ${isSelected ? 'selected' : ''}`}
                            >
                              <div className="dusk-frame-radio-circle">
                                {isSelected && <Check size={11} />}
                              </div>
                              <span className="dusk-frame-name">{frame.name}</span>
                              <span className="dusk-frame-delta">
                                {frame.priceDelta === 0 ? 'Included' : `+£${frame.priceDelta}`}
                              </span>
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="dusk-edition-buttons">
                      <button
                        type="button"
                        onClick={() => handleAddToCart(product)}
                        className="btn-dusk btn-dusk--primary dusk-reserve-btn"
                      >
                        <ShoppingBag size={15} />
                        <span>RESERVE EDITION (£{calculatedPrice})</span>
                      </button>

                      <a
                        href={`mailto:${settings.email || 'studio@chintwo.com'}?subject=Inquiry: ${encodeURIComponent(product.title)}`}
                        className="btn-dusk btn-dusk--ghost"
                      >
                        <span>ENQUIRE VIA STUDIO</span>
                      </a>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
