import { useState, FormEvent, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import { createMessage } from '../../services/messageService';
import { useSiteSettings } from '../../hooks/useSiteSettings';
import Navbar from '../../components/layout/Navbar';
import Footer from '../../components/layout/Footer';

export default function Contact() {
  const { settings } = useSiteSettings();
  const [searchParams] = useSearchParams();
  const initialSubject = searchParams.get('subject') || '';

  const [formState, setFormState] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: initialSubject,
    message: '',
  });

  useEffect(() => {
    if (initialSubject) {
      setFormData((prev) => ({ ...prev, subject: initialSubject }));
    }
  }, [initialSubject]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const validateEmail = (email: string) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    if (!formData.name.trim()) {
      setErrorMessage('Please enter your name.');
      return;
    }
    if (!formData.email.trim() || !validateEmail(formData.email.trim())) {
      setErrorMessage('Please provide a valid email address.');
      return;
    }
    if (!formData.message.trim()) {
      setErrorMessage('Please enter your message.');
      return;
    }

    setErrorMessage('');
    setFormState('submitting');

    try {
      await createMessage({
        name: formData.name.trim(),
        email: formData.email.trim(),
        projectType: formData.subject || 'General Studio Inquiry',
        budget: '',
        deadline: '',
        message: formData.message.trim(),
        referenceFiles: [],
        inquiryType: 'general',
      });
      setFormState('success');
    } catch (err: any) {
      console.error('Contact submission error:', err);
      setErrorMessage('Failed to send message. Please try again or email directly.');
      setFormState('error');
    }
  };

  const socialLinks = [
    ...(settings.instagram ? [{ label: 'Instagram', url: settings.instagram }] : [{ label: 'Instagram', url: 'https://instagram.com' }]),
    ...(settings.twitter ? [{ label: 'X / Twitter', url: settings.twitter }] : [{ label: 'X / Twitter', url: 'https://x.com' }]),
    ...(settings.threads ? [{ label: 'Threads', url: settings.threads }] : []),
    ...(settings.discord ? [{ label: 'Discord', url: settings.discord }] : []),
  ];

  return (
    <div className="page-wrap">
      <Helmet>
        <title>{`Get in Touch — Studio Dialogue & Commissions | ${settings.artistName || 'CHINTWO'}`}</title>
        <meta
          name="description"
          content={`Contact the studio of ${settings.artistName || 'CHINTWO'} for editorial commissions, original artwork acquisitions, and exhibition inquiries.`}
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
              <span className="type-meta">05 / GET IN TOUCH</span>
              <span className="type-meta">DIRECT CORRESPONDENCE</span>
            </div>
          </div>
        </div>

        {/* Contact Main Section */}
        <section className="section" style={{ paddingBottom: 'clamp(5rem, 10vh, 8rem)' }}>
          <div className="container">
            <div className="editorial-split-5-7">
              {/* Left 5 Columns: Studio Details, Direct Email & Info */}
              <div className="editorial-split-5-7__side">
                <span className="type-meta" style={{ display: 'block', marginBottom: '1.25rem' }}>
                  STUDIO CORRESPONDENCE
                </span>

                <h1 className="type-display-xl" style={{ marginBottom: '1.5rem', lineHeight: 1.05 }}>
                  Let’s Start a Dialogue
                </h1>

                <p className="type-editorial" style={{ color: 'var(--color-stone)', marginBottom: '2.5rem' }}>
                  {settings.contactText ||
                    'Open for selected editorial illustration commissions, gallery acquisitions, licensing inquiries, and thoughtful artistic dialogue.'}
                </p>

                {/* Direct Contact Blocks */}
                <div style={{ borderTop: '1px solid var(--color-border)', paddingTop: '1.75rem', marginBottom: '2rem' }}>
                  <span className="type-meta-sm" style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--color-muted)' }}>
                    DIRECT EMAIL
                  </span>
                  <a
                    href={`mailto:${settings.email || 'studio@chintwo.com'}`}
                    className="type-display-sm link-underline"
                    style={{ color: 'var(--color-charcoal)' }}
                  >
                    {settings.email || 'studio@chintwo.com'}
                  </a>
                </div>

                <div style={{ borderTop: '1px solid var(--color-border)', paddingTop: '1.75rem', marginBottom: '2rem' }}>
                  <span className="type-meta-sm" style={{ display: 'block', marginBottom: '0.75rem', color: 'var(--color-muted)' }}>
                    STUDIO STATUS &amp; RESPONSE TIME
                  </span>
                  <p className="type-body-sm" style={{ color: 'var(--color-stone)', lineHeight: 1.6 }}>
                    Currently accepting projects for {new Date().getFullYear()}. Typical response time is 24 to 48 hours.
                  </p>
                </div>

                <div style={{ borderTop: '1px solid var(--color-border)', paddingTop: '1.75rem' }}>
                  <span className="type-meta-sm" style={{ display: 'block', marginBottom: '0.75rem', color: 'var(--color-muted)' }}>
                    NETWORK &amp; SOCIAL
                  </span>
                  <div style={{ display: 'flex', gap: '1.25rem', flexWrap: 'wrap' }}>
                    {socialLinks.map((s) => (
                      <a
                        key={s.label}
                        href={s.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="link-underline"
                        style={{ fontFamily: 'var(--font-mono)', fontSize: '0.6875rem', letterSpacing: '0.12em', textTransform: 'uppercase' }}
                      >
                        {s.label}
                      </a>
                    ))}
                  </div>
                </div>
              </div>

              {/* Right 7 Columns: Minimalist Editorial Contact Form */}
              <div className="editorial-split-5-7__main">
                <div
                  style={{
                    backgroundColor: 'var(--color-surface)',
                    border: '1px solid var(--color-border)',
                    padding: 'clamp(2rem, 5vw, 3.5rem)',
                    boxShadow: '0 12px 40px rgba(0,0,0,0.03)',
                  }}
                >
                  {formState === 'success' ? (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.98 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ duration: 0.4 }}
                      style={{ textAlign: 'center', padding: '2rem 1rem' }}
                    >
                      <span className="type-meta" style={{ color: '#10b981', display: 'block', marginBottom: '1rem' }}>
                        ● MESSAGE TRANSMITTED SUCCESSFULLY
                      </span>
                      <h2 className="type-display-lg" style={{ marginBottom: '1rem' }}>
                        Thank you for reaching out
                      </h2>
                      <p className="type-editorial" style={{ color: 'var(--color-stone)', marginBottom: '2rem' }}>
                        Your inquiry has been received at the studio. The artist will review your message and reply promptly.
                      </p>
                      <button
                        onClick={() => {
                          setFormState('idle');
                          setFormData({ name: '', email: '', subject: '', message: '' });
                        }}
                        className="btn-editorial"
                      >
                        Send Another Note
                      </button>
                    </motion.div>
                  ) : (
                    <form onSubmit={handleSubmit} noValidate>
                      <span className="section-label" style={{ marginBottom: '2rem' }}>
                        TRANSMIT INQUIRY
                      </span>

                      {errorMessage && (
                        <div
                          style={{
                            padding: '0.85rem 1.25rem',
                            backgroundColor: '#fef2f2',
                            border: '1px solid #fecaca',
                            color: '#b91c1c',
                            fontSize: '0.8125rem',
                            marginBottom: '1.5rem',
                          }}
                        >
                          {errorMessage}
                        </div>
                      )}

                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', marginBottom: '1.5rem' }}>
                        <div>
                          <label
                            htmlFor="name"
                            style={{
                              display: 'block',
                              fontFamily: 'var(--font-mono)',
                              fontSize: '0.625rem',
                              letterSpacing: '0.12em',
                              textTransform: 'uppercase',
                              marginBottom: '0.5rem',
                              color: 'var(--color-charcoal)',
                            }}
                          >
                            Your Name *
                          </label>
                          <input
                            id="name"
                            name="name"
                            type="text"
                            required
                            value={formData.name}
                            onChange={handleChange}
                            placeholder="e.g. Eleanor Vance"
                            style={{
                              width: '100%',
                              padding: '0.85rem',
                              border: '1px solid var(--color-border)',
                              borderRadius: 0,
                              backgroundColor: 'var(--color-bg)',
                              fontFamily: 'var(--font-body)',
                              fontSize: '0.9375rem',
                              color: 'var(--color-charcoal)',
                            }}
                          />
                        </div>

                        <div>
                          <label
                            htmlFor="email"
                            style={{
                              display: 'block',
                              fontFamily: 'var(--font-mono)',
                              fontSize: '0.625rem',
                              letterSpacing: '0.12em',
                              textTransform: 'uppercase',
                              marginBottom: '0.5rem',
                              color: 'var(--color-charcoal)',
                            }}
                          >
                            Email Address *
                          </label>
                          <input
                            id="email"
                            name="email"
                            type="email"
                            required
                            value={formData.email}
                            onChange={handleChange}
                            placeholder="eleanor@domain.com"
                            style={{
                              width: '100%',
                              padding: '0.85rem',
                              border: '1px solid var(--color-border)',
                              borderRadius: 0,
                              backgroundColor: 'var(--color-bg)',
                              fontFamily: 'var(--font-body)',
                              fontSize: '0.9375rem',
                              color: 'var(--color-charcoal)',
                            }}
                          />
                        </div>
                      </div>

                      <div style={{ marginBottom: '1.5rem' }}>
                        <label
                          htmlFor="subject"
                          style={{
                            display: 'block',
                            fontFamily: 'var(--font-mono)',
                            fontSize: '0.625rem',
                            letterSpacing: '0.12em',
                            textTransform: 'uppercase',
                            marginBottom: '0.5rem',
                            color: 'var(--color-charcoal)',
                          }}
                        >
                          Subject / Inquiry Type
                        </label>
                        <input
                          id="subject"
                          name="subject"
                          type="text"
                          value={formData.subject}
                          onChange={handleChange}
                          placeholder="e.g. Editorial Commission / Print Acquisition"
                          style={{
                            width: '100%',
                            padding: '0.85rem',
                            border: '1px solid var(--color-border)',
                            borderRadius: 0,
                            backgroundColor: 'var(--color-bg)',
                            fontFamily: 'var(--font-body)',
                            fontSize: '0.9375rem',
                            color: 'var(--color-charcoal)',
                          }}
                        />
                      </div>

                      <div style={{ marginBottom: '2rem' }}>
                        <label
                          htmlFor="message"
                          style={{
                            display: 'block',
                            fontFamily: 'var(--font-mono)',
                            fontSize: '0.625rem',
                            letterSpacing: '0.12em',
                            textTransform: 'uppercase',
                            marginBottom: '0.5rem',
                            color: 'var(--color-charcoal)',
                          }}
                        >
                          Message *
                        </label>
                        <textarea
                          id="message"
                          name="message"
                          rows={6}
                          required
                          value={formData.message}
                          onChange={handleChange}
                          placeholder="Describe your project, timeline, or artwork inquiry..."
                          style={{
                            width: '100%',
                            padding: '0.85rem',
                            border: '1px solid var(--color-border)',
                            borderRadius: 0,
                            backgroundColor: 'var(--color-bg)',
                            fontFamily: 'var(--font-body)',
                            fontSize: '0.9375rem',
                            color: 'var(--color-charcoal)',
                            resize: 'vertical',
                          }}
                        />
                      </div>

                      <button
                        type="submit"
                        disabled={formState === 'submitting'}
                        className="btn-editorial btn-editorial--filled"
                        style={{
                          width: '100%',
                          justifyContent: 'center',
                          padding: '1.1rem',
                        }}
                      >
                        {formState === 'submitting' ? 'Transmitting to Studio...' : 'Send Message →'}
                      </button>
                    </form>
                  )}
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
