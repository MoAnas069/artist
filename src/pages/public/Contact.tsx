import { useState, FormEvent } from 'react';
import { motion } from 'framer-motion';
import { createMessage } from '../../services/messageService';
import { uploadFiles } from '../../services/storageService';
import { useSiteSettings } from '../../hooks/useSiteSettings';
import type { ContactMessageFormData } from '../../types';
import Footer from '../../components/layout/Footer';

export default function Contact() {
  const { settings } = useSiteSettings();
  const [formState, setFormState] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');
  const [form, setForm] = useState<ContactMessageFormData>({
    name: '',
    email: '',
    projectType: '',
    budget: '',
    deadline: '',
    message: '',
    referenceFiles: [],
  });
  const [files, setFiles] = useState<File[]>([]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFiles(Array.from(e.target.files));
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setFormState('submitting');
    try {
      let referenceFiles: string[] = [];
      if (files.length > 0) {
        referenceFiles = await uploadFiles(files, 'references');
      }
      await createMessage({ ...form, referenceFiles });
      setFormState('success');
    } catch (error) {
      console.error('Form submission error:', error);
      setFormState('error');
    }
  };

  if (formState === 'success') {
    return (
      <main>
        <section
          style={{
            minHeight: '80vh',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            textAlign: 'center',
            padding: 'var(--space-xl)',
          }}
        >
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          >
            <h1 className="type-display-lg" style={{ marginBottom: 'var(--space-lg)' }}>
              Thank you.
            </h1>
            <p className="type-body-lg" style={{ color: 'var(--color-stone)', maxWidth: 400, margin: '0 auto' }}>
              Your message has been received. I'll respond as soon as I can.
            </p>
          </motion.div>
        </section>
        <Footer />
      </main>
    );
  }

  const inputStyle: React.CSSProperties = {
    width: '100%',
    padding: '0.875rem 0',
    border: 'none',
    borderBottom: '1px solid var(--color-border)',
    background: 'transparent',
    fontFamily: 'var(--font-body)',
    fontSize: '1rem',
    color: 'var(--color-charcoal)',
    outline: 'none',
    transition: 'border-color 0.3s ease',
  };

  const labelStyle: React.CSSProperties = {
    display: 'block',
    fontFamily: 'var(--font-body)',
    fontSize: '0.6875rem',
    fontWeight: 500,
    textTransform: 'uppercase',
    letterSpacing: '0.15em',
    color: 'var(--color-muted)',
    marginBottom: '0.5rem',
  };

  return (
    <main>
      {/* Header */}
      <section
        style={{
          minHeight: '50vh',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'flex-end',
          padding: 'var(--space-xl) var(--space-lg) var(--space-2xl)',
          textAlign: 'center',
        }}
      >
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
          className="type-display-xl"
          style={{ maxWidth: 700, margin: '0 auto var(--space-lg)' }}
        >
          Let's Make<br />Something.
        </motion.h1>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="type-body-lg"
          style={{ color: 'var(--color-stone)', maxWidth: 420, margin: '0 auto' }}
        >
          {settings.contactText}
        </motion.p>
      </section>

      {/* Form */}
      <section style={{ padding: '0 var(--space-lg) var(--space-3xl)' }}>
        <form
          onSubmit={handleSubmit}
          style={{ maxWidth: 600, margin: '0 auto' }}
        >
          <div style={{ display: 'grid', gap: 'var(--space-xl)' }}>
            {/* Name */}
            <div>
              <label style={labelStyle}>Name</label>
              <input
                name="name"
                type="text"
                required
                value={form.name}
                onChange={handleChange}
                placeholder="Your name"
                style={inputStyle}
                onFocus={(e) => (e.target.style.borderBottomColor = 'var(--color-charcoal)')}
                onBlur={(e) => (e.target.style.borderBottomColor = 'var(--color-border)')}
              />
            </div>

            {/* Email */}
            <div>
              <label style={labelStyle}>Email</label>
              <input
                name="email"
                type="email"
                required
                value={form.email}
                onChange={handleChange}
                placeholder="your@email.com"
                style={inputStyle}
                onFocus={(e) => (e.target.style.borderBottomColor = 'var(--color-charcoal)')}
                onBlur={(e) => (e.target.style.borderBottomColor = 'var(--color-border)')}
              />
            </div>

            {/* Project Type */}
            <div>
              <label style={labelStyle}>Project Type</label>
              <select
                name="projectType"
                value={form.projectType}
                onChange={handleChange}
                style={{ ...inputStyle, cursor: 'pointer', appearance: 'none' }}
              >
                <option value="">Select a type</option>
                <option value="commission">Commission</option>
                <option value="editorial">Editorial</option>
                <option value="collaboration">Collaboration</option>
                <option value="exhibition">Exhibition</option>
                <option value="licensing">Licensing</option>
                <option value="other">Other</option>
              </select>
            </div>

            {/* Budget & Deadline */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-lg)' }}>
              <div>
                <label style={labelStyle}>Budget</label>
                <input
                  name="budget"
                  type="text"
                  value={form.budget}
                  onChange={handleChange}
                  placeholder="Approximate budget"
                  style={inputStyle}
                  onFocus={(e) => (e.target.style.borderBottomColor = 'var(--color-charcoal)')}
                  onBlur={(e) => (e.target.style.borderBottomColor = 'var(--color-border)')}
                />
              </div>
              <div>
                <label style={labelStyle}>Deadline</label>
                <input
                  name="deadline"
                  type="text"
                  value={form.deadline}
                  onChange={handleChange}
                  placeholder="Expected timeline"
                  style={inputStyle}
                  onFocus={(e) => (e.target.style.borderBottomColor = 'var(--color-charcoal)')}
                  onBlur={(e) => (e.target.style.borderBottomColor = 'var(--color-border)')}
                />
              </div>
            </div>

            {/* Message */}
            <div>
              <label style={labelStyle}>Message</label>
              <textarea
                name="message"
                required
                value={form.message}
                onChange={handleChange}
                placeholder="Tell me about your project..."
                rows={6}
                style={{ ...inputStyle, resize: 'vertical', minHeight: 150, lineHeight: 1.7 }}
                onFocus={(e) => (e.target.style.borderBottomColor = 'var(--color-charcoal)')}
                onBlur={(e) => (e.target.style.borderBottomColor = 'var(--color-border)')}
              />
            </div>

            {/* File Upload */}
            <div>
              <label style={labelStyle}>Reference Images (optional)</label>
              <input
                type="file"
                multiple
                accept="image/*"
                onChange={handleFileChange}
                style={{
                  ...inputStyle,
                  padding: '0.875rem 0',
                  fontSize: '0.875rem',
                  color: 'var(--color-stone)',
                }}
              />
              {files.length > 0 && (
                <span className="type-meta-sm" style={{ color: 'var(--color-muted)', marginTop: 'var(--space-sm)', display: 'block' }}>
                  {files.length} file{files.length !== 1 ? 's' : ''} selected
                </span>
              )}
            </div>

            {/* Error */}
            {formState === 'error' && (
              <p className="type-body-sm" style={{ color: '#dc2626' }}>
                Something went wrong. Please try again or email directly.
              </p>
            )}

            {/* Submit */}
            <button
              type="submit"
              disabled={formState === 'submitting'}
              data-cursor=""
              style={{
                width: '100%',
                padding: '1.125rem',
                backgroundColor: 'var(--color-charcoal)',
                color: 'var(--color-ivory)',
                fontFamily: 'var(--font-body)',
                fontSize: '0.75rem',
                fontWeight: 500,
                textTransform: 'uppercase',
                letterSpacing: '0.15em',
                border: 'none',
                transition: 'opacity 0.3s ease',
                cursor: formState === 'submitting' ? 'wait' : 'pointer',
                opacity: formState === 'submitting' ? 0.7 : 1,
              }}
              onMouseEnter={(e) => (e.currentTarget.style.opacity = '0.85')}
              onMouseLeave={(e) => (e.currentTarget.style.opacity = formState === 'submitting' ? '0.7' : '1')}
            >
              {formState === 'submitting' ? 'SENDING...' : 'SEND MESSAGE'}
            </button>
          </div>
        </form>
      </section>

      <Footer />
    </main>
  );
}
