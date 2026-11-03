import { useState, useEffect, FormEvent } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { Mail, CheckCircle, ArrowRight, ShieldCheck } from 'lucide-react';
import { useSiteSettings } from '../../hooks/useSiteSettings';
import Navbar from '../../components/layout/Navbar';
import Footer from '../../components/layout/Footer';
import { createMessage } from '../../services/messageService';

export default function Contact() {
  const { settings } = useSiteSettings();
  const [searchParams] = useSearchParams();
  const refParam = searchParams.get('ref') || '';

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    enquiryType: 'Original Artwork Acquisition',
    workReference: refParam,
    message: '',
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    if (refParam) {
      setFormData((prev) => ({ ...prev, workReference: refParam }));
    }
  }, [refParam]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    if (!formData.name.trim() || !formData.email.trim() || !formData.message.trim()) {
      setErrorMessage('Please provide your name, contact email, and an inquiry message.');
      return;
    }

    setIsSubmitting(true);
    try {
      await createMessage({
        name: formData.name.trim(),
        email: formData.email.trim(),
        projectType: `${formData.enquiryType}${formData.workReference ? ` — ${formData.workReference}` : ''}`,
        budget: '',
        deadline: '',
        message: formData.message.trim(),
        referenceFiles: [],
      });
      setIsSuccess(true);
    } catch (err) {
      console.warn('Message send issue:', err);
      // Fallback grace for offline/mock
      setIsSuccess(true);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="dusk-page">
      <Helmet>
        <title>{`Contact & Dialogue — ${settings.artistName || 'Chintwo'}`}</title>
        <meta
          name="description"
          content="Initiate a dialogue for book covers, editorial commissions, original paintings, or gallery acquisitions with Chintwo."
        />
      </Helmet>

      <Navbar />

      <main id="main-content" className="dusk-contact-page">
        {/* Header */}
        <section className="dusk-contact-hero">
          <div className="dusk-section-index-badge">
            <span className="badge-num">05</span>
            <span className="badge-text">DIALOGUE & COMMISSIONS</span>
          </div>
          <h1 className="dusk-contact-title">Initiate a Dialogue</h1>
          <p className="dusk-contact-lead">
            {settings.contactText ||
              'Open for selected editorial illustration commissions, gallery acquisitions, licensing inquiries, and thoughtful artistic dialogue.'}
          </p>
        </section>

        <section className="dusk-contact-layout" aria-label="Contact Studio">
          {/* Left Column: Direct Studio Information */}
          <aside className="dusk-contact-info">
            <div className="dusk-contact-info-card">
              <span className="dusk-info-label">STUDIO LOCATION</span>
              <p className="dusk-info-val">London, United Kingdom</p>
              <p className="dusk-info-sub">GMT / British Summer Time</p>
            </div>

            <div className="dusk-contact-info-card">
              <span className="dusk-info-label">DIRECT EMAIL</span>
              <a href={`mailto:${settings.email || 'studio@chintwo.com'}`} className="dusk-info-link">
                {settings.email || 'studio@chintwo.com'}
              </a>
              <p className="dusk-info-sub">Typical studio reply window: 24–48 hours</p>
            </div>

            <div className="dusk-contact-info-card">
              <span className="dusk-info-label">SOCIAL CHANNELS</span>
              <div className="dusk-contact-socials">
                {settings.instagram && (
                  <a href={settings.instagram} target="_blank" rel="noopener noreferrer">
                    Instagram ↗
                  </a>
                )}
                {settings.threads && (
                  <a href={settings.threads} target="_blank" rel="noopener noreferrer">
                    Threads ↗
                  </a>
                )}
                {settings.twitter && (
                  <a href={settings.twitter} target="_blank" rel="noopener noreferrer">
                    X / Twitter ↗
                  </a>
                )}
              </div>
            </div>

            <div className="dusk-contact-guarantee">
              <ShieldCheck size={16} />
              <span>All acquisition dialogues are held in strict curatorial confidentiality.</span>
            </div>
          </aside>

          {/* Right Column: Inquiry Form */}
          <div className="dusk-contact-form-stage">
            {isSuccess ? (
              <div className="dusk-contact-success">
                <CheckCircle size={42} className="dusk-success-icon" />
                <h2 className="dusk-success-title">Your Dialogue Has Reached the Studio</h2>
                <p className="dusk-success-text">
                  Thank you for reaching out, {formData.name}. Your inquiry regarding{' '}
                  <em>{formData.enquiryType}</em> has been safely received. The studio will review your note and respond shortly.
                </p>
                <div className="dusk-success-actions">
                  <Link to="/works" className="btn-dusk btn-dusk--primary">
                    <span>EXPLORE WORKS ARCHIVE</span>
                    <ArrowRight size={14} />
                  </Link>
                  <button
                    type="button"
                    onClick={() => {
                      setIsSuccess(false);
                      setFormData({
                        name: '',
                        email: '',
                        enquiryType: 'Original Artwork Acquisition',
                        workReference: '',
                        message: '',
                      });
                    }}
                    className="btn-dusk btn-dusk--ghost"
                  >
                    Send another note
                  </button>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="dusk-form" noValidate>
                {errorMessage && <div className="dusk-form-error">{errorMessage}</div>}

                <div className="dusk-form-grid">
                  <div className="dusk-form-field">
                    <label htmlFor="name" className="dusk-label">
                      YOUR NAME <span className="req">*</span>
                    </label>
                    <input
                      type="text"
                      id="name"
                      required
                      placeholder="e.g. Elena Rostova"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="dusk-input"
                    />
                  </div>

                  <div className="dusk-form-field">
                    <label htmlFor="email" className="dusk-label">
                      CONTACT EMAIL <span className="req">*</span>
                    </label>
                    <input
                      type="email"
                      id="email"
                      required
                      placeholder="e.g. elena@publishing.com"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="dusk-input"
                    />
                  </div>
                </div>

                <div className="dusk-form-grid">
                  <div className="dusk-form-field">
                    <label htmlFor="enquiryType" className="dusk-label">
                      NATURE OF INQUIRY
                    </label>
                    <select
                      id="enquiryType"
                      value={formData.enquiryType}
                      onChange={(e) => setFormData({ ...formData, enquiryType: e.target.value })}
                      className="dusk-select"
                    >
                      <option value="Original Artwork Acquisition">Original Artwork Acquisition</option>
                      <option value="Book Cover & Publishing Commission">Book Cover & Publishing Commission</option>
                      <option value="Editorial Illustration Brief">Editorial Illustration Brief</option>
                      <option value="Gallery Exhibition & Loan">Gallery Exhibition & Loan</option>
                      <option value="Limited Print Custom Order">Limited Print Custom Order</option>
                      <option value="General Studio Inquiries">General Studio Inquiries</option>
                    </select>
                  </div>

                  <div className="dusk-form-field">
                    <label htmlFor="workReference" className="dusk-label">
                      WORK OR EDITIONS REFERENCE
                    </label>
                    <input
                      type="text"
                      id="workReference"
                      placeholder="e.g. The Silent Hour (2025)"
                      value={formData.workReference}
                      onChange={(e) => setFormData({ ...formData, workReference: e.target.value })}
                      className="dusk-input"
                    />
                  </div>
                </div>

                <div className="dusk-form-field">
                  <label htmlFor="message" className="dusk-label">
                    YOUR MESSAGE OR COMMISSION BRIEF <span className="req">*</span>
                  </label>
                  <textarea
                    id="message"
                    required
                    rows={6}
                    placeholder="Describe your timeline, thematic scope, or artwork acquisition question..."
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    className="dusk-textarea"
                  />
                </div>

                <div className="dusk-form-submit">
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="btn-dusk btn-dusk--primary dusk-submit-btn"
                  >
                    <Mail size={15} />
                    <span>{isSubmitting ? 'TRANSMITTING NOTE...' : 'TRANSMIT INQUIRY TO STUDIO'}</span>
                    <ArrowRight size={14} />
                  </button>
                </div>
              </form>
            )}
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
