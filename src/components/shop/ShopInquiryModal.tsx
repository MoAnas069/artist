import { useState } from 'react';
import { X, CheckCircle, Send, ShieldCheck, Sparkles, Package } from 'lucide-react';
import type { Product } from '../../types';
import { createMessage } from '../../services/messageService';
import { formatPrice } from '../../utils/helpers';
import { useToast } from '../ui/Toast';

interface ShopInquiryModalProps {
  product: Product;
  isOpen: boolean;
  onClose: () => void;
}

export default function ShopInquiryModal({ product, isOpen, onClose }: ShopInquiryModalProps) {
  const { showToast } = useToast();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [country, setCountry] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [framing, setFraming] = useState('Unframed (Archival Tube)');
  const [notes, setNotes] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [inquiryId, setInquiryId] = useState('');

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !email.trim() || !country.trim()) {
      showToast('Please fill in your name, email, and shipping destination.', 'error');
      return;
    }

    setSubmitting(true);

    try {
      const fullMessage = [
        `Acquisition Inquiry for "${product.title}"`,
        `Quantity: ${quantity}`,
        `Framing: ${framing}`,
        `Destination: ${country}`,
        phone ? `Phone / WhatsApp: ${phone}` : null,
        notes.trim() ? `Client Notes: ${notes.trim()}` : null,
      ]
        .filter(Boolean)
        .join('\n');

      const id = await createMessage({
        name: name.trim(),
        email: email.trim(),
        projectType: `Shop Inquiry: ${product.title}`,
        budget: formatPrice(product.price * quantity, product.currency),
        deadline: 'Standard Delivery',
        message: fullMessage,
        referenceFiles: product.images && product.images.length > 0 ? [product.images[0]] : [],
        // Rich shop acquisition metadata
        inquiryType: 'shop',
        productId: product.id,
        productTitle: product.title,
        productPrice: product.price,
        productCurrency: product.currency,
        productImage: product.images && product.images.length > 0 ? product.images[0] : undefined,
        quantity,
        framing,
        phone: phone.trim() || undefined,
        country: country.trim(),
      });

      setInquiryId(id);
      setIsSuccess(true);
      showToast('Inquiry submitted successfully', 'success');
    } catch (err) {
      console.error(err);
      showToast('Failed to submit inquiry. Please try again.', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  const handleReset = () => {
    setName('');
    setEmail('');
    setPhone('');
    setCountry('');
    setQuantity(1);
    setFraming('Unframed (Archival Tube)');
    setNotes('');
    setIsSuccess(false);
    setInquiryId('');
    onClose();
  };

  const coverImg = product.images && product.images.length > 0 ? product.images[0] : null;

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 2000,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '1.5rem',
        backgroundColor: 'rgba(12, 12, 14, 0.82)',
        backdropFilter: 'blur(8px)',
        WebkitBackdropFilter: 'blur(8px)',
        overflowY: 'auto',
      }}
      onClick={handleReset}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="inquiry-modal-title"
        style={{
          position: 'relative',
          width: '100%',
          maxWidth: 620,
          backgroundColor: '#ffffff',
          color: 'var(--color-charcoal)',
          borderRadius: 16,
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.35)',
          overflow: 'hidden',
          animation: 'modalSlideIn 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <style>{`
          @keyframes modalSlideIn {
            from {
              opacity: 0;
              transform: translateY(16px) scale(0.98);
            }
            to {
              opacity: 1;
              transform: translateY(0) scale(1);
            }
          }
        `}</style>

        {/* Header Bar */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '1.25rem 1.75rem',
            borderBottom: '1px solid #f0eee9',
            backgroundColor: 'var(--color-ivory)',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Sparkles size={16} style={{ color: 'var(--color-stone)' }} />
            <span
              id="inquiry-modal-title"
              className="type-meta"
              style={{ letterSpacing: '0.15em', fontWeight: 600, fontSize: '0.75rem', color: 'var(--color-charcoal)' }}
            >
              PURCHASE & ACQUISITION INQUIRY
            </span>
          </div>

          <button
            onClick={handleReset}
            aria-label="Close inquiry modal"
            style={{
              background: 'none',
              border: 'none',
              padding: 6,
              cursor: 'pointer',
              color: 'var(--color-stone)',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              transition: 'all 0.2s ease',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = 'rgba(0, 0, 0, 0.06)';
              e.currentTarget.style.color = 'var(--color-charcoal)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = 'transparent';
              e.currentTarget.style.color = 'var(--color-stone)';
            }}
          >
            <X size={18} />
          </button>
        </div>

        {isSuccess ? (
          /* ─── SUCCESS CONFIRMATION STATE ─── */
          <div style={{ padding: '3rem 2rem', textAlign: 'center' }}>
            <div
              style={{
                width: 64,
                height: 64,
                borderRadius: '50%',
                backgroundColor: 'rgba(34, 197, 94, 0.1)',
                color: '#16a34a',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 1.5rem',
              }}
            >
              <CheckCircle size={36} strokeWidth={2.2} />
            </div>

            <span className="type-meta" style={{ color: '#16a34a', letterSpacing: '0.15em', marginBottom: '0.5rem', display: 'block' }}>
              INQUIRY RECORDED AT THE STUDIO
            </span>

            <h2 className="type-display-md" style={{ marginBottom: '1rem', color: 'var(--color-charcoal)' }}>
              Thank you, {name}
            </h2>

            <p className="type-body" style={{ color: 'var(--color-stone)', maxWidth: 460, margin: '0 auto 1.5rem', lineHeight: 1.7 }}>
              Your acquisition request for <strong>{product.title}</strong> has been logged directly into the studio dashboard. The artist will review edition numbers, calculate insured shipping to <strong>{country}</strong>, and email you at <strong>{email}</strong> within 24 hours.
            </p>

            <div
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.5rem',
                padding: '6px 14px',
                borderRadius: 8,
                backgroundColor: 'var(--color-cream)',
                border: '1px solid var(--color-border)',
                marginBottom: '2rem',
                fontFamily: 'var(--font-mono, monospace)',
                fontSize: '0.75rem',
                color: 'var(--color-stone)',
              }}
            >
              <Package size={14} />
              <span>REFERENCE: {inquiryId}</span>
            </div>

            <div>
              <button
                onClick={handleReset}
                style={{
                  padding: '0.875rem 2.25rem',
                  borderRadius: 999,
                  border: 'none',
                  backgroundColor: 'var(--color-charcoal)',
                  color: 'var(--color-ivory)',
                  fontFamily: 'var(--font-body)',
                  fontSize: '0.75rem',
                  fontWeight: 600,
                  letterSpacing: '0.15em',
                  textTransform: 'uppercase',
                  cursor: 'pointer',
                  transition: 'opacity 0.2s ease',
                }}
                onMouseEnter={(e) => (e.currentTarget.style.opacity = '0.85')}
                onMouseLeave={(e) => (e.currentTarget.style.opacity = '1')}
              >
                RETURN TO SHOP
              </button>
            </div>
          </div>
        ) : (
          /* ─── INQUIRY FORM ─── */
          <form onSubmit={handleSubmit} style={{ padding: '1.75rem 2rem' }}>
            {/* Product Summary Card */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '1.25rem',
                padding: '1rem',
                borderRadius: 12,
                backgroundColor: 'var(--color-cream)',
                marginBottom: '1.75rem',
                border: '1px solid var(--color-border)',
              }}
            >
              {coverImg ? (
                <img
                  src={coverImg}
                  alt={product.title}
                  style={{
                    width: 64,
                    height: 64,
                    objectFit: 'cover',
                    borderRadius: 8,
                    border: '1px solid rgba(0,0,0,0.08)',
                  }}
                />
              ) : (
                <div
                  style={{
                    width: 64,
                    height: 64,
                    borderRadius: 8,
                    backgroundColor: '#e5e7eb',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <Package size={24} style={{ color: '#9ca3af' }} />
                </div>
              )}

              <div style={{ flex: 1, minWidth: 0 }}>
                <span className="type-meta-sm" style={{ color: 'var(--color-muted)', display: 'block', fontSize: '0.6875rem' }}>
                  {product.type.toUpperCase()} · {product.edition || 'LIMITED EDITION'}
                </span>
                <h3
                  style={{
                    fontFamily: 'var(--font-display)',
                    fontSize: '1.15rem',
                    fontWeight: 500,
                    margin: '0.15rem 0',
                    color: 'var(--color-charcoal)',
                    whiteSpace: 'nowrap',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                  }}
                >
                  {product.title}
                </h3>
                <span
                  style={{
                    fontFamily: 'var(--font-body)',
                    fontSize: '0.875rem',
                    fontWeight: 600,
                    color: 'var(--color-stone)',
                  }}
                >
                  {formatPrice(product.price, product.currency)}
                </span>
              </div>
            </div>

            {/* Two-Column Form Layout */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1.25rem', marginBottom: '1.25rem' }}>
              {/* Full Name */}
              <div>
                <label
                  style={{
                    display: 'block',
                    fontSize: '0.75rem',
                    fontWeight: 600,
                    letterSpacing: '0.08em',
                    textTransform: 'uppercase',
                    color: 'var(--color-stone)',
                    marginBottom: '0.4rem',
                  }}
                >
                  Full Name *
                </label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Helena Vance"
                  style={inputStyle}
                />
              </div>

              {/* Email Address */}
              <div>
                <label
                  style={{
                    display: 'block',
                    fontSize: '0.75rem',
                    fontWeight: 600,
                    letterSpacing: '0.08em',
                    textTransform: 'uppercase',
                    color: 'var(--color-stone)',
                    marginBottom: '0.4rem',
                  }}
                >
                  Email Address *
                </label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="helena@example.com"
                  style={inputStyle}
                />
              </div>

              {/* Phone / WhatsApp */}
              <div>
                <label
                  style={{
                    display: 'block',
                    fontSize: '0.75rem',
                    fontWeight: 600,
                    letterSpacing: '0.08em',
                    textTransform: 'uppercase',
                    color: 'var(--color-stone)',
                    marginBottom: '0.4rem',
                  }}
                >
                  Phone / WhatsApp <span style={{ opacity: 0.6, fontWeight: 400 }}>(optional)</span>
                </label>
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+44 7700 900077"
                  style={inputStyle}
                />
              </div>

              {/* Shipping Destination / Country */}
              <div>
                <label
                  style={{
                    display: 'block',
                    fontSize: '0.75rem',
                    fontWeight: 600,
                    letterSpacing: '0.08em',
                    textTransform: 'uppercase',
                    color: 'var(--color-stone)',
                    marginBottom: '0.4rem',
                  }}
                >
                  Shipping Destination / Country *
                </label>
                <input
                  type="text"
                  required
                  value={country}
                  onChange={(e) => setCountry(e.target.value)}
                  placeholder="e.g. London, United Kingdom"
                  style={inputStyle}
                />
              </div>

              {/* Quantity */}
              <div>
                <label
                  style={{
                    display: 'block',
                    fontSize: '0.75rem',
                    fontWeight: 600,
                    letterSpacing: '0.08em',
                    textTransform: 'uppercase',
                    color: 'var(--color-stone)',
                    marginBottom: '0.4rem',
                  }}
                >
                  Quantity
                </label>
                <input
                  type="number"
                  min={1}
                  max={product.stock > 0 ? product.stock : 10}
                  value={quantity}
                  onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                  style={inputStyle}
                />
              </div>

              {/* Framing Preference */}
              <div>
                <label
                  style={{
                    display: 'block',
                    fontSize: '0.75rem',
                    fontWeight: 600,
                    letterSpacing: '0.08em',
                    textTransform: 'uppercase',
                    color: 'var(--color-stone)',
                    marginBottom: '0.4rem',
                  }}
                >
                  Framing & Presentation
                </label>
                <select
                  value={framing}
                  onChange={(e) => setFraming(e.target.value)}
                  style={{ ...inputStyle, cursor: 'pointer' }}
                >
                  <option value="Unframed (Archival Tube)">Unframed (Archival Reinforced Tube)</option>
                  <option value="Museum Float Frame (Natural Oak)">Museum Float Frame (Natural Oak)</option>
                  <option value="Museum Float Frame (Matte Black Ash)">Museum Float Frame (Matte Black Ash)</option>
                  <option value="Museum Float Frame (Warm White)">Museum Float Frame (Warm White)</option>
                  <option value="Custom Framing Request">Custom Framing / Inquire for Options</option>
                </select>
              </div>
            </div>

            {/* Notes / Special Requests */}
            <div style={{ marginBottom: '1.5rem' }}>
              <label
                style={{
                  display: 'block',
                  fontSize: '0.75rem',
                  fontWeight: 600,
                  letterSpacing: '0.08em',
                  textTransform: 'uppercase',
                  color: 'var(--color-stone)',
                  marginBottom: '0.4rem',
                }}
              >
                Special Requests or Questions <span style={{ opacity: 0.6, fontWeight: 400 }}>(optional)</span>
              </label>
              <textarea
                rows={3}
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Inquire about specific edition numbers, expedited courier delivery, or custom dedication..."
                style={{ ...inputStyle, resize: 'vertical' }}
              />
            </div>

            {/* Trust badge */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                marginBottom: '1.5rem',
                color: 'var(--color-stone)',
                fontSize: '0.75rem',
              }}
            >
              <ShieldCheck size={16} style={{ color: '#16a34a', flexShrink: 0 }} />
              <span>
                All inquiries are received directly at the artist's studio. Invoicing and insured certificate of authenticity handled personally.
              </span>
            </div>

            {/* Footer Buttons */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: '0.875rem' }}>
              <button
                type="button"
                onClick={handleReset}
                disabled={submitting}
                style={{
                  padding: '0.75rem 1.5rem',
                  borderRadius: 999,
                  border: '1px solid var(--color-border)',
                  backgroundColor: 'transparent',
                  color: 'var(--color-stone)',
                  fontFamily: 'var(--font-body)',
                  fontSize: '0.75rem',
                  fontWeight: 500,
                  letterSpacing: '0.1em',
                  textTransform: 'uppercase',
                  cursor: 'pointer',
                  transition: 'background-color 0.2s',
                }}
                onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = 'var(--color-cream)')}
                onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
              >
                CANCEL
              </button>

              <button
                type="submit"
                disabled={submitting}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  padding: '0.75rem 1.75rem',
                  borderRadius: 999,
                  border: 'none',
                  backgroundColor: 'var(--color-charcoal)',
                  color: 'var(--color-ivory)',
                  fontFamily: 'var(--font-body)',
                  fontSize: '0.75rem',
                  fontWeight: 600,
                  letterSpacing: '0.15em',
                  textTransform: 'uppercase',
                  cursor: submitting ? 'wait' : 'pointer',
                  opacity: submitting ? 0.7 : 1,
                  boxShadow: '0 4px 14px rgba(0, 0, 0, 0.15)',
                  transition: 'all 0.2s ease',
                }}
                onMouseEnter={(e) => {
                  if (!submitting) e.currentTarget.style.opacity = '0.88';
                }}
                onMouseLeave={(e) => {
                  if (!submitting) e.currentTarget.style.opacity = '1';
                }}
              >
                <Send size={13} />
                <span>{submitting ? 'TRANSMITTING...' : 'SUBMIT INQUIRY'}</span>
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}

const inputStyle: React.CSSProperties = {
  width: '100%',
  padding: '0.75rem 0.875rem',
  borderRadius: 8,
  border: '1px solid var(--color-border)',
  backgroundColor: '#fafafa',
  color: 'var(--color-charcoal)',
  fontFamily: 'var(--font-body)',
  fontSize: '0.875rem',
  outline: 'none',
  boxSizing: 'border-box',
  transition: 'border-color 0.2s ease, background-color 0.2s ease',
};
