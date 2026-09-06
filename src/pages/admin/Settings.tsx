import { useState, useEffect, FormEvent } from 'react';
import { Save, CheckCircle2 } from 'lucide-react';
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
          <p style={{ fontSize: '0.875rem', color: '#6b7280' }}>Manage site branding, biography, socials and SEO</p>
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
              Shown on the &ldquo;Me / About&rdquo; page. Upload an image or paste a link.
            </p>
            <ImageUploader
              images={settings.artistPortrait ? [settings.artistPortrait] : []}
              onChange={(imgs) => setSettings((prev) => ({ ...prev, artistPortrait: imgs[0] || '' }))}
              folder="settings"
              maxFiles={1}
            />
          </div>

          {/* Homepage Hero */}
          <div className="admin-card">
            <h2 style={{ fontSize: '1rem', fontWeight: 600, marginBottom: '1rem', color: '#111827' }}>Homepage Hero Content</h2>
            <div style={{ display: 'grid', gap: '1rem' }}>
              <div>
                <label className="admin-label">Hero Statement (Revealed in X-Ray behind name)</label>
                <input className="admin-input" name="homepageStatement" value={settings.homepageStatement} onChange={handleChange} />
              </div>
              <div>
                <label className="admin-label">Hero Short Bio (Revealed in X-Ray behind name)</label>
                <input className="admin-input" name="shortBio" value={settings.shortBio} onChange={handleChange} />
              </div>
              <div>
                <label className="admin-label">Contact Callout Text</label>
                <input className="admin-input" name="contactText" value={settings.contactText} onChange={handleChange} />
              </div>
            </div>
          </div>

          {/* Homepage Sections & Hidden X-Ray Artworks */}
          <div className="admin-card">
            <h2 style={{ fontSize: '1rem', fontWeight: 600, marginBottom: '0.5rem', color: '#111827' }}>
              Homepage Sections & Hidden X-Ray Artworks
            </h2>
            <p style={{ fontSize: '0.8125rem', color: '#6b7280', marginBottom: '1.25rem' }}>
              Configure the subtitles and the hidden artworks revealed through the circular cursor lens on the homepage.
            </p>

            <div style={{ display: 'grid', gap: '1.5rem' }}>
              {/* 01 Art */}
              <div style={{ padding: '1rem', backgroundColor: '#f9fafb', borderRadius: 8, border: '1px solid #e5e7eb' }}>
                <h3 style={{ fontSize: '0.875rem', fontWeight: 600, color: '#111827', marginBottom: '0.75rem' }}>
                  Art Section
                </h3>
                <div style={{ display: 'grid', gap: '0.75rem' }}>
                  <div>
                    <label className="admin-label">Subtitle</label>
                    <input
                      className="admin-input"
                      name="artSublabel"
                      value={settings.artSublabel || ''}
                      onChange={handleChange}
                      placeholder="Selected Paintings, Drawings & Archive"
                    />
                  </div>
                  <div>
                    <label className="admin-label">Hidden X-Ray Artwork Image</label>
                    <ImageUploader
                      images={settings.artXrayImage ? [settings.artXrayImage] : []}
                      onChange={(imgs) => setSettings((prev) => ({ ...prev, artXrayImage: imgs[0] || '' }))}
                      folder="settings/sections"
                      maxFiles={1}
                    />
                  </div>
                </div>
              </div>

              {/* 02 Me */}
              <div style={{ padding: '1rem', backgroundColor: '#f9fafb', borderRadius: 8, border: '1px solid #e5e7eb' }}>
                <h3 style={{ fontSize: '0.875rem', fontWeight: 600, color: '#111827', marginBottom: '0.75rem' }}>
                  Me Section
                </h3>
                <div style={{ display: 'grid', gap: '0.75rem' }}>
                  <div>
                    <label className="admin-label">Subtitle</label>
                    <input
                      className="admin-input"
                      name="meSublabel"
                      value={settings.meSublabel || ''}
                      onChange={handleChange}
                      placeholder="Biography, Philosophy & Studio Practice"
                    />
                  </div>
                  <div>
                    <label className="admin-label">Hidden X-Ray Atelier / Portrait Image</label>
                    <ImageUploader
                      images={settings.meXrayImage ? [settings.meXrayImage] : []}
                      onChange={(imgs) => setSettings((prev) => ({ ...prev, meXrayImage: imgs[0] || '' }))}
                      folder="settings/sections"
                      maxFiles={1}
                    />
                  </div>
                </div>
              </div>

              {/* 03 Journal */}
              <div style={{ padding: '1rem', backgroundColor: '#f9fafb', borderRadius: 8, border: '1px solid #e5e7eb' }}>
                <h3 style={{ fontSize: '0.875rem', fontWeight: 600, color: '#111827', marginBottom: '0.75rem' }}>
                  Journal Section
                </h3>
                <div style={{ display: 'grid', gap: '0.75rem' }}>
                  <div>
                    <label className="admin-label">Subtitle</label>
                    <input
                      className="admin-input"
                      name="journalSublabel"
                      value={settings.journalSublabel || ''}
                      onChange={handleChange}
                      placeholder="Studio Notes, Process & Literary Essays"
                    />
                  </div>
                  <div>
                    <label className="admin-label">Hidden X-Ray Manuscript / Ink Wash Image</label>
                    <ImageUploader
                      images={settings.journalXrayImage ? [settings.journalXrayImage] : []}
                      onChange={(imgs) => setSettings((prev) => ({ ...prev, journalXrayImage: imgs[0] || '' }))}
                      folder="settings/sections"
                      maxFiles={1}
                    />
                  </div>
                </div>
              </div>

              {/* 04 Shop */}
              <div style={{ padding: '1rem', backgroundColor: '#f9fafb', borderRadius: 8, border: '1px solid #e5e7eb' }}>
                <h3 style={{ fontSize: '0.875rem', fontWeight: 600, color: '#111827', marginBottom: '0.75rem' }}>
                  Shop Section
                </h3>
                <div style={{ display: 'grid', gap: '0.75rem' }}>
                  <div>
                    <label className="admin-label">Subtitle</label>
                    <input
                      className="admin-input"
                      name="shopSublabel"
                      value={settings.shopSublabel || ''}
                      onChange={handleChange}
                      placeholder="Limited Edition Archival Prints & Objects"
                    />
                  </div>
                  <div>
                    <label className="admin-label">Hidden X-Ray Printmaking / Editions Image</label>
                    <ImageUploader
                      images={settings.shopXrayImage ? [settings.shopXrayImage] : []}
                      onChange={(imgs) => setSettings((prev) => ({ ...prev, shopXrayImage: imgs[0] || '' }))}
                      folder="settings/sections"
                      maxFiles={1}
                    />
                  </div>
                </div>
              </div>

              {/* 05 Contact */}
              <div style={{ padding: '1rem', backgroundColor: '#f9fafb', borderRadius: 8, border: '1px solid #e5e7eb' }}>
                <h3 style={{ fontSize: '0.875rem', fontWeight: 600, color: '#111827', marginBottom: '0.75rem' }}>
                  Contact Section
                </h3>
                <div style={{ display: 'grid', gap: '0.75rem' }}>
                  <div>
                    <label className="admin-label">Subtitle</label>
                    <input
                      className="admin-input"
                      name="contactSublabel"
                      value={settings.contactSublabel || ''}
                      onChange={handleChange}
                      placeholder="Commissions, Gallery Inquiries & Press"
                    />
                  </div>
                  <div>
                    <label className="admin-label">Hidden X-Ray Letterpress / Stationery Image</label>
                    <ImageUploader
                      images={settings.contactXrayImage ? [settings.contactXrayImage] : []}
                      onChange={(imgs) => setSettings((prev) => ({ ...prev, contactXrayImage: imgs[0] || '' }))}
                      folder="settings/sections"
                      maxFiles={1}
                    />
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
