import { useEffect } from 'react';
import { X, Plus, Minus, Trash2, ArrowRight, ShieldCheck } from 'lucide-react';
import { useCart } from '../../context/CartContext';
import { Link, useNavigate } from 'react-router-dom';

export default function CartDrawer() {
  const { items, isOpen, closeCart, updateQuantity, removeItem, clearCart, subtotal, totalCount } =
    useCart();
  const navigate = useNavigate();

  // Close on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        closeCart();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, closeCart]);

  // Lock body scroll when cart is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  const handleDirectEnquiry = () => {
    closeCart();
    const itemsDescription = items
      .map((i) => `${i.quantity}x ${i.title} (${i.frameOption.name})`)
      .join(', ');
    navigate(`/contact?ref=${encodeURIComponent(`Print Order: ${itemsDescription}`)}`);
  };

  return (
    <>
      {/* Backdrop */}
      <div
        className={`dusk-cart-backdrop ${isOpen ? 'active' : ''}`}
        onClick={closeCart}
        aria-hidden="true"
      />

      {/* Slideout Panel */}
      <aside
        className={`dusk-cart-drawer ${isOpen ? 'open' : ''}`}
        aria-label="Collector Cart"
        aria-modal="true"
        role="dialog"
      >
        <div className="dusk-cart-header">
          <div className="dusk-cart-header-title">
            <span className="dusk-cart-num">05</span>
            <h2>COLLECTOR FOLIO</h2>
            <span className="dusk-cart-badge">{totalCount} {totalCount === 1 ? 'PRINT' : 'PRINTS'}</span>
          </div>
          <button
            type="button"
            className="dusk-cart-close"
            onClick={closeCart}
            aria-label="Close cart drawer"
          >
            <X size={18} />
          </button>
        </div>

        {items.length === 0 ? (
          <div className="dusk-cart-empty">
            <p className="dusk-cart-empty-text">Your collection folio is currently quiet.</p>
            <p className="dusk-cart-empty-sub">
              Browse archival editions and fine art screenprints in the studio shop.
            </p>
            <Link to="/prints" onClick={closeCart} className="btn-dusk btn-dusk--primary">
              EXPLORE EDITIONS
            </Link>
          </div>
        ) : (
          <>
            <div className="dusk-cart-items">
              {items.map((item) => (
                <article key={item.id} className="dusk-cart-item">
                  <div className="dusk-cart-item-thumb">
                    <img src={item.image} alt={item.title} loading="lazy" />
                  </div>
                  <div className="dusk-cart-item-details">
                    <div className="dusk-cart-item-head">
                      <h3 className="dusk-cart-item-title">{item.title}</h3>
                      <button
                        type="button"
                        onClick={() => removeItem(item.id)}
                        className="dusk-cart-item-remove"
                        aria-label={`Remove ${item.title}`}
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                    <div className="dusk-cart-item-frame">
                      <span>Framing:</span> {item.frameOption.name}
                    </div>
                    <div className="dusk-cart-item-foot">
                      <div className="dusk-cart-qty">
                        <button
                          type="button"
                          onClick={() => updateQuantity(item.id, -1)}
                          aria-label="Decrease quantity"
                        >
                          <Minus size={12} />
                        </button>
                        <span>{item.quantity}</span>
                        <button
                          type="button"
                          onClick={() => updateQuantity(item.id, 1)}
                          aria-label="Increase quantity"
                        >
                          <Plus size={12} />
                        </button>
                      </div>
                      <div className="dusk-cart-item-price">
                        {item.currencySymbol}
                        {item.price * item.quantity}
                      </div>
                    </div>
                  </div>
                </article>
              ))}
            </div>

            <div className="dusk-cart-footer">
              <div className="dusk-cart-subtotal">
                <span className="dusk-cart-subtotal-label">SUBTOTAL</span>
                <span className="dusk-cart-subtotal-val">£{subtotal.toLocaleString()}</span>
              </div>
              <p className="dusk-cart-shipping-note">
                <ShieldCheck size={14} style={{ display: 'inline', marginRight: 6, verticalAlign: -2 }} />
                Museum-grade archival packaging. Worldwide insured courier delivery calculated at dispatch.
              </p>

              <button
                type="button"
                onClick={handleDirectEnquiry}
                className="btn-dusk btn-dusk--primary dusk-cart-checkout-btn"
              >
                <span>RESERVE EDITIONS VIA STUDIO</span>
                <ArrowRight size={15} />
              </button>

              <div className="dusk-cart-clear-wrap">
                <button
                  type="button"
                  onClick={clearCart}
                  className="dusk-cart-clear-btn"
                >
                  Empty Folio
                </button>
              </div>
            </div>
          </>
        )}
      </aside>
    </>
  );
}
