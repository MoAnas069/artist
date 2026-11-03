import { useState, useEffect, FormEvent } from 'react';
import { Save } from 'lucide-react';
import { getSettings, updateSettings, defaultSettings } from '../../services/settingsService';
import type { SiteSettings } from '../../types';
import ImageUploader from '../../components/admin/ImageUploader';
import { useToast } from '../../components/ui/Toast';

export default function SettingsPage() {
  const [settings, setSettings] = useState<SiteSettings>(defaultSettings);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const { showToast } = useToast();

  useEffect(() => {
    getSettings()
      .then((s) => {
        if (s) setSettings(s);
      })
      .catch((err) => {
        console.error('Settings load error:', err);
      })
      .finally(() => setLoading(false));
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setSettings((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      await updateSettings(settings);
      showToast('Settings saved successfully');
    } catch {
      showToast('Failed to save settings', 'error');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div>
      <div style={{ marginBottom: '1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1 style={{ fontSize: '1.5rem', fontWeight: 600 }}>Settings</h1>
          <p style={{ fontSize: '0.875rem', color: '#6b7280' }}>Manage site branding, biography, homepage content, socials and SEO</p>
        </div>
        <button
          type="button"
          onClick={handleSubmit}
          disabled={saving}
          className="admin-btn admin-btn-primary"
          style={{ padding: '0.5rem 1.25rem' }}
        >
          <Save size={16} /> {saving ? 'Saving...' : 'Save Changes'}
        </button>
      </div>

      <form onSubmit={handleSubmit}>
        <div style={{ display: 'grid', gap: '1.5rem', maxWidth: 840 }}>
          {/* Identity */}
          <div className="admin-card">
            <h2 style={{ fontSize: '1rem', fontWeight: 600, marginBottom: '1rem', color: '#111827' }}>Identity & Biography</h2>
            <div style={{ display: 'grid', gap: '1rem' }}>
              <div>
                <label className="admin-label">Artist / Studio Name</label>
                <input className="admin-input" name="artistName" value={settings.artistName} onChange={handleChange} />
              </div>
              <div>
                <label className="admin-label">Short Tagline / Bio</label>
                <input className="admin-input" name="shortBio" value={settings.shortBio} onChange={handleChange} />
                <p style={{ fontSize: '0.75rem', color: '#9ca3af', marginTop: '0.25rem' }}>
                  Used in the "03 / The Person" section on the homepage and the About page header.
                </p>
              </div>
              <div>
                <label className="admin-label">Full Biography (HTML / Paragraphs supported)</label>
                <textarea className="admin-textarea" name="longBio" value={settings.longBio} onChange={handleChange} rows={6} />
              </div>
            </div>
          </div>

          {/* Portrait */}
          <div className="admin-card">
            <h2 style={{ fontSize: '1rem', fontWeight: 600, marginBottom: '0.5rem', color: '#111827' }}>Artist Portrait / Studio Image</h2>
            <p style={{ fontSize: '0.8125rem', color: '#6b7280', marginBottom: '1rem' }}>
              Shown in the "03 / The Person" section on the homepage and the About page. Upload an image or paste a URL.
            </p>
            <ImageUploader
              images={settings.artistPortrait ? [settings.artistPortrait] : []}
              onChange={(imgs) => setSettings((prev) => ({ ...prev, artistPortrait: imgs[0] || '' }))}
              folder="settings"
              maxFiles={1}
            />
          </div>

          {/* Homepage Hero Content */}
          <div className="admin-card">
            <h2 style={{ fontSize: '1rem', fontWeight: 600, marginBottom: '0.5rem', color: '#111827' }}>Homepage Hero Content</h2>
            <p style={{ fontSize: '0.8125rem', color: '#6b7280', marginBottom: '1.25rem' }}>
              Controls the editorial hero section (01). The headline "A world shaped by imagination." is fixed. These fields control the supporting text.
            </p>
            <div style={{ display: 'grid', gap: '1rem' }}>
              <div>
                <label className="admin-label">Hero Description Paragraph</label>
                <textarea
                  className="admin-textarea"
                  name="homepageStatement"
                  value={settings.homepageStatement}
                  onChange={handleChange}
                  rows={3}
                  placeholder="A creative practice that explores people, places, memories and the space in between reality and imagination."
                />
                <p style={{ fontSize: '0.75rem', color: '#9ca3af', marginTop: '0.25rem' }}>
                  Displayed below "ART, IDEAS AND EVERYTHING IN BETWEEN." in the hero section.
                </p>
              </div>
              <div>
                <label className="admin-label">Homepage Subtitle (The Person preview)</label>
                <input
                  className="admin-input"
                  name="homepageSubtitle"
                  value={settings.homepageSubtitle}
                  onChange={handleChange}
                  placeholder="Exploring solitude, memory, and myth through textured brushwork and quiet light"
                />
                <p style={{ fontSize: '0.75rem', color: '#9ca3af', marginTop: '0.25rem' }}>
                  Used as the OG meta description and as a subtitle in various contexts.
                </p>
              </div>
            </div>
          </div>

          {/* Homepage Sections */}
          <div className="admin-card">
            <h2 style={{ fontSize: '1rem', fontWeight: 600, marginBottom: '0.5rem', color: '#111827' }}>
              Homepage Sections & Page Subtitles
            </h2>
            <p style={{ fontSize: '0.8125rem', color: '#6b7280', marginBottom: '1.25rem' }}>
              Configure the subtitles for each page's header. These appear across the Work, About, Journal, Editions, and Contact pages.
            </p>

            <div style={{ display: 'grid', gap: '1.5rem' }}>
              {/* 01 Work */}
              <div style={{ padding: '1rem', backgroundColor: '#f9fafb', borderRadius: 8, border: '1px solid #e5e7eb' }}>
                <h3 style={{ fontSize: '0.875rem', fontWeight: 600, color: '#111827', marginBottom: '0.75rem' }}>
                  01 / Work
                </h3>
                <div>
                  <label className="admin-label">Page Subtitle</label>
                  <input
                    className="admin-input"
                    name="artSublabel"
                    value={settings.artSublabel || ''}
                    onChange={handleChange}
                    placeholder="Selected Paintings, Drawings & Archive"
                  />
                </div>
              </div>

              {/* 02 Person */}
              <div style={{ padding: '1rem', backgroundColor: '#f9fafb', borderRadius: 8, border: '1px solid #e5e7eb' }}>
                <h3 style={{ fontSize: '0.875rem', fontWeight: 600, color: '#111827', marginBottom: '0.75rem' }}>
                  02 / Person
                </h3>
                <div>
                  <label className="admin-label">Page Subtitle</label>
                  <input
                    className="admin-input"
                    name="meSublabel"
                    value={settings.meSublabel || ''}
                    onChange={handleChange}
                    placeholder="Biography, Philosophy & Studio Practice"
                  />
                </div>
              </div>

              {/* 03 Notes */}
              <div style={{ padding: '1rem', backgroundColor: '#f9fafb', borderRadius: 8, border: '1px solid #e5e7eb' }}>
                <h3 style={{ fontSize: '0.875rem', fontWeight: 600, color: '#111827', marginBottom: '0.75rem' }}>
                  03 / Notes
                </h3>
                <div>
                  <label className="admin-label">Page Subtitle</label>
                  <input
                    className="admin-input"
                    name="journalSublabel"
                    value={settings.journalSublabel || ''}
                    onChange={handleChange}
                    placeholder="Studio Notes, Process & Literary Essays"
                  />
                </div>
              </div>

              {/* 04 Editions */}
              <div style={{ padding: '1rem', backgroundColor: '#f9fafb', borderRadius: 8, border: '1px solid #e5e7eb' }}>
                <h3 style={{ fontSize: '0.875rem', fontWeight: 600, color: '#111827', marginBottom: '0.75rem' }}>
                  04 / Editions
                </h3>
                <div>
                  <label className="admin-label">Page Subtitle</label>
                  <input
                    className="admin-input"
                    name="shopSublabel"
                    value={settings.shopSublabel || ''}
                    onChange={handleChange}
                    placeholder="Limited Edition Archival Prints & Objects"
                  />
                </div>
              </div>

              {/* 05 Contact */}
              <div style={{ padding: '1rem', backgroundColor: '#f9fafb', borderRadius: 8, border: '1px solid #e5e7eb' }}>
                <h3 style={{ fontSize: '0.875rem', fontWeight: 600, color: '#111827', marginBottom: '0.75rem' }}>
                  05 / Contact
                </h3>
                <div style={{ display: 'grid', gap: '0.75rem' }}>
                  <div>
                    <label className="admin-label">Page Subtitle</label>
                    <input
                      className="admin-input"
                      name="contactSublabel"
                      value={settings.contactSublabel || ''}
                      onChange={handleChange}
                      placeholder="Commissions, Gallery Inquiries & Press"
                    />
                  </div>
                  <div>
                    <label className="admin-label">Contact Section Callout Text</label>
                    <textarea
                      className="admin-textarea"
                      name="contactText"
                      value={settings.contactText}
                      onChange={handleChange}
                      rows={2}
                      placeholder="Available for selected editorial commissions, original artwork acquisitions, gallery exhibitions, and collaborative inquiries."
                    />
                    <p style={{ fontSize: '0.75rem', color: '#9ca3af', marginTop: '0.25rem' }}>
                      Displayed in the "06 / Dialogue" section at the bottom of the homepage.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Social & Contact */}
          <div className="admin-card">
            <h2 style={{ fontSize: '1rem', fontWeight: 600, marginBottom: '1rem', color: '#111827' }}>Contact & Social Links</h2>
            <div style={{ display: 'grid', gap: '1rem' }}>
              <div>
                <label className="admin-label">Contact / Inquiries Email</label>
                <input className="admin-input" name="email" type="email" value={settings.email} onChange={handleChange} />
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1rem' }}>
                <div>
                  <label className="admin-label">Instagram URL</label>
                  <input className="admin-input" name="instagram" value={settings.instagram} onChange={handleChange} placeholder="https://instagram.com/..." />
                </div>
                <div>
                  <label className="admin-label">Threads URL</label>
                  <input className="admin-input" name="threads" value={settings.threads} onChange={handleChange} placeholder="https://threads.net/@..." />
                </div>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1rem' }}>
                <div>
                  <label className="admin-label">Twitter / X URL</label>
                  <input className="admin-input" name="twitter" value={settings.twitter} onChange={handleChange} placeholder="https://x.com/..." />
                </div>
                <div>
                  <label className="admin-label">Discord / Community URL</label>
                  <input className="admin-input" name="discord" value={settings.discord} onChange={handleChange} placeholder="https://discord.gg/..." />
                </div>
              </div>
            </div>
          </div>

          {/* SEO Defaults */}
          <div className="admin-card">
            <h2 style={{ fontSize: '1rem', fontWeight: 600, marginBottom: '1rem', color: '#111827' }}>SEO & Meta Defaults</h2>
            <div style={{ display: 'grid', gap: '1rem' }}>
              <div>
                <label className="admin-label">Default Page Title</label>
                <input className="admin-input" name="seoTitle" value={settings.seoTitle} onChange={handleChange} />
              </div>
              <div>
                <label className="admin-label">Default Meta Description</label>
                <textarea className="admin-textarea" name="seoDescription" value={settings.seoDescription} onChange={handleChange} rows={2} />
              </div>
              <div>
                <label className="admin-label">Copyright Footer Text</label>
                <input className="admin-input" name="copyrightText" value={settings.copyrightText} onChange={handleChange} />
              </div>
            </div>
          </div>

          {/* Action buttons */}
          <div style={{ display: 'flex', gap: '1rem', marginTop: '0.5rem' }}>
            <button
              type="submit"
              className="admin-btn admin-btn-primary"
              disabled={saving}
              style={{ justifyContent: 'center', flex: 1, padding: '0.75rem' }}
            >
              <Save size={16} /> {saving ? 'Saving...' : 'Save Settings'}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}
