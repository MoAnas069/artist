import { useState, useEffect, FormEvent } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Save, ArrowLeft } from 'lucide-react';
import { createArtwork, getArtworkById, updateArtwork } from '../../services/artworkService';
import type { ArtworkFormData } from '../../types';
import ImageUploader from '../../components/admin/ImageUploader';
import { useToast } from '../../components/ui/Toast';
import { slugify } from '../../utils/helpers';

const emptyForm: ArtworkFormData = {
  title: '',
  slug: '',
  year: new Date().getFullYear(),
  category: '',
  medium: '',
  description: '',
  coverImage: '',
  images: [],
  processImages: [],
  artistNotes: '',
  dimensions: '',
  credits: '',
  featured: false,
  published: true,
  sortOrder: 0,
};

export default function ArtworkForm() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { showToast } = useToast();
  const [form, setForm] = useState<ArtworkFormData>(emptyForm);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const isEditing = !!id && id !== 'new';

  useEffect(() => {
    if (isEditing) {
      setLoading(true);
      getArtworkById(id)
        .then((a) => {
          if (a) {
            const { id: _id, createdAt: _c, updatedAt: _u, ...rest } = a;
            setForm(rest as ArtworkFormData);
          }
        })
        .catch(console.error)
        .finally(() => setLoading(false));
    }
  }, [id, isEditing]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === 'number' ? Number(value) : value,
    }));
    if (name === 'title' && !isEditing) {
      setForm((prev) => ({ ...prev, slug: slugify(value) }));
    }
  };

  const handleCheckbox = (name: string) => {
    setForm((prev) => ({ ...prev, [name]: !(prev as any)[name] }));
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      if (isEditing) {
        await updateArtwork(id, form);
        showToast('Artwork updated');
      } else {
        await createArtwork(form);
        showToast('Artwork created');
      }
      navigate('/admin/artworks');
    } catch {
      showToast('Failed to save artwork', 'error');
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <p>Loading...</p>;

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.5rem' }}>
        <button onClick={() => navigate('/admin/artworks')} className="admin-btn admin-btn-secondary">
          <ArrowLeft size={16} />
        </button>
        <div>
          <h1 style={{ fontSize: '1.5rem', fontWeight: 600 }}>
            {isEditing ? 'Edit Artwork' : 'New Artwork'}
          </h1>
        </div>
      </div>

      <form onSubmit={handleSubmit}>
        <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '1.5rem', alignItems: 'start' }}>
          {/* Main Column */}
          <div style={{ display: 'grid', gap: '1.5rem' }}>
            {/* Title & Slug */}
            <div className="admin-card">
              <h2 style={{ fontSize: '0.9375rem', fontWeight: 600, marginBottom: '1rem' }}>Details</h2>
              <div style={{ display: 'grid', gap: '1rem' }}>
                <div>
                  <label className="admin-label">Title *</label>
                  <input className="admin-input" name="title" required value={form.title} onChange={handleChange} />
                </div>
                <div>
                  <label className="admin-label">Slug</label>
                  <input className="admin-input" name="slug" value={form.slug} onChange={handleChange} />
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1rem' }}>
                  <div>
                    <label className="admin-label">Year</label>
                    <input className="admin-input" type="number" name="year" value={form.year} onChange={handleChange} />
                  </div>
                  <div>
                    <label className="admin-label">Category</label>
                    <input className="admin-input" name="category" value={form.category} onChange={handleChange} placeholder="e.g., Editorial" />
                  </div>
                  <div>
                    <label className="admin-label">Medium</label>
                    <input className="admin-input" name="medium" value={form.medium} onChange={handleChange} placeholder="e.g., Digital illustration" />
                  </div>
                </div>
                <div>
                  <label className="admin-label">Description</label>
                  <textarea className="admin-textarea" name="description" value={form.description} onChange={handleChange} rows={4} />
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                  <div>
                    <label className="admin-label">Dimensions</label>
                    <input className="admin-input" name="dimensions" value={form.dimensions} onChange={handleChange} />
                  </div>
                  <div>
                    <label className="admin-label">Credits</label>
                    <input className="admin-input" name="credits" value={form.credits} onChange={handleChange} />
                  </div>
                </div>
                <div>
                  <label className="admin-label">Artist Notes</label>
                  <textarea className="admin-textarea" name="artistNotes" value={form.artistNotes} onChange={handleChange} rows={3} />
                </div>
              </div>
            </div>

            {/* Cover Image */}
            <div className="admin-card">
              <h2 style={{ fontSize: '0.9375rem', fontWeight: 600, marginBottom: '1rem' }}>Cover Image</h2>
              <ImageUploader
                images={form.coverImage ? [form.coverImage] : []}
                onChange={(imgs) => setForm((prev) => ({ ...prev, coverImage: imgs[0] || '' }))}
                folder="artworks/covers"
                maxFiles={1}
              />
            </div>

            {/* Gallery Images */}
            <div className="admin-card">
              <h2 style={{ fontSize: '0.9375rem', fontWeight: 600, marginBottom: '1rem' }}>Gallery Images</h2>
              <ImageUploader
                images={form.images}
                onChange={(imgs) => setForm((prev) => ({ ...prev, images: imgs }))}
                folder="artworks/gallery"
              />
            </div>

            {/* Process Images */}
            <div className="admin-card">
              <h2 style={{ fontSize: '0.9375rem', fontWeight: 600, marginBottom: '1rem' }}>Process Images</h2>
              <ImageUploader
                images={form.processImages}
                onChange={(imgs) => setForm((prev) => ({ ...prev, processImages: imgs }))}
                folder="artworks/process"
              />
            </div>
          </div>

          {/* Side Column */}
          <div style={{ display: 'grid', gap: '1.5rem', position: 'sticky', top: '1rem' }}>
            {/* Publish */}
            <div className="admin-card">
              <h2 style={{ fontSize: '0.9375rem', fontWeight: 600, marginBottom: '1rem' }}>Publish</h2>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.875rem', cursor: 'pointer' }}>
                  <input type="checkbox" checked={form.published} onChange={() => handleCheckbox('published')} />
                  Published
                </label>
                <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.875rem', cursor: 'pointer' }}>
                  <input type="checkbox" checked={form.featured} onChange={() => handleCheckbox('featured')} />
                  Featured
                </label>
                <div>
                  <label className="admin-label">Sort Order</label>
                  <input className="admin-input" type="number" name="sortOrder" value={form.sortOrder} onChange={handleChange} />
                </div>
              </div>
            </div>

            {/* Save */}
            <button type="submit" className="admin-btn admin-btn-primary" disabled={saving} style={{ width: '100%', justifyContent: 'center' }}>
              <Save size={16} />
              {saving ? 'Saving...' : isEditing ? 'Update Artwork' : 'Create Artwork'}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}
