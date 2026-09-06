import { useState, useEffect, FormEvent } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Save, ArrowLeft } from 'lucide-react';
import { createProduct, getProductById, updateProduct } from '../../services/productService';
import type { ProductFormData } from '../../types';
import ImageUploader from '../../components/admin/ImageUploader';
import { useToast } from '../../components/ui/Toast';
import { slugify } from '../../utils/helpers';

const emptyForm: ProductFormData = {
  title: '', slug: '', description: '', images: [], price: 0, currency: 'GBP',
  type: '', materials: '', dimensions: '', edition: '', stock: 10, available: true, featured: false,
};

export default function ProductForm() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { showToast } = useToast();
  const [form, setForm] = useState<ProductFormData>(emptyForm);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const isEditing = !!id && id !== 'new';

  useEffect(() => {
    if (isEditing) {
      setLoading(true);
      getProductById(id)
        .then((p) => {
          if (p) { const { id: _id, createdAt: _c, updatedAt: _u, ...rest } = p; setForm(rest as ProductFormData); }
        })
        .catch(console.error)
        .finally(() => setLoading(false));
    }
  }, [id, isEditing]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    setForm((prev) => ({ ...prev, [name]: type === 'number' ? Number(value) : value }));
    if (name === 'title' && !isEditing) setForm((prev) => ({ ...prev, slug: slugify(value) }));
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      if (isEditing) { await updateProduct(id, form); showToast('Product updated'); }
      else { await createProduct(form); showToast('Product created'); }
      navigate('/admin/shop');
    } catch { showToast('Failed to save product', 'error'); }
    finally { setSaving(false); }
  };

  if (loading) return <p>Loading...</p>;

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.5rem' }}>
        <button onClick={() => navigate('/admin/shop')} className="admin-btn admin-btn-secondary"><ArrowLeft size={16} /></button>
        <h1 style={{ fontSize: '1.5rem', fontWeight: 600 }}>{isEditing ? 'Edit Product' : 'New Product'}</h1>
      </div>

      <form onSubmit={handleSubmit}>
        <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '1.5rem', alignItems: 'start' }}>
          <div style={{ display: 'grid', gap: '1.5rem' }}>
            <div className="admin-card">
              <h2 style={{ fontSize: '0.9375rem', fontWeight: 600, marginBottom: '1rem' }}>Details</h2>
              <div style={{ display: 'grid', gap: '1rem' }}>
                <div><label className="admin-label">Title *</label><input className="admin-input" name="title" required value={form.title} onChange={handleChange} /></div>
                <div><label className="admin-label">Slug</label><input className="admin-input" name="slug" value={form.slug} onChange={handleChange} /></div>
                <div><label className="admin-label">Description</label><textarea className="admin-textarea" name="description" value={form.description} onChange={handleChange} rows={4} /></div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1rem' }}>
                  <div><label className="admin-label">Price *</label><input className="admin-input" type="number" name="price" required value={form.price} onChange={handleChange} min="0" step="0.01" /></div>
                  <div><label className="admin-label">Currency</label><select className="admin-input" name="currency" value={form.currency} onChange={handleChange}><option value="GBP">GBP</option><option value="USD">USD</option><option value="EUR">EUR</option><option value="INR">INR</option></select></div>
                  <div><label className="admin-label">Stock</label><input className="admin-input" type="number" name="stock" value={form.stock} onChange={handleChange} min="0" /></div>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                  <div><label className="admin-label">Type</label><input className="admin-input" name="type" value={form.type} onChange={handleChange} placeholder="e.g., Print, Original" /></div>
                  <div><label className="admin-label">Edition</label><input className="admin-input" name="edition" value={form.edition} onChange={handleChange} placeholder="e.g., Limited Edition of 50" /></div>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                  <div><label className="admin-label">Materials</label><input className="admin-input" name="materials" value={form.materials} onChange={handleChange} placeholder="e.g., Giclée on cotton paper" /></div>
                  <div><label className="admin-label">Dimensions</label><input className="admin-input" name="dimensions" value={form.dimensions} onChange={handleChange} placeholder="e.g., 420 × 297mm" /></div>
                </div>
              </div>
            </div>
            <div className="admin-card">
              <h2 style={{ fontSize: '0.9375rem', fontWeight: 600, marginBottom: '1rem' }}>Images</h2>
              <ImageUploader images={form.images} onChange={(imgs) => setForm((prev) => ({ ...prev, images: imgs }))} folder="products" />
            </div>
          </div>

          <div style={{ display: 'grid', gap: '1.5rem', position: 'sticky', top: '1rem' }}>
            <div className="admin-card">
              <h2 style={{ fontSize: '0.9375rem', fontWeight: 600, marginBottom: '1rem' }}>Visibility</h2>
              <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.875rem', cursor: 'pointer', marginBottom: '0.5rem' }}>
                <input type="checkbox" checked={form.available} onChange={() => setForm((prev) => ({ ...prev, available: !prev.available }))} /> Available
              </label>
              <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.875rem', cursor: 'pointer' }}>
                <input type="checkbox" checked={form.featured} onChange={() => setForm((prev) => ({ ...prev, featured: !prev.featured }))} /> Featured
              </label>
            </div>
            <button type="submit" className="admin-btn admin-btn-primary" disabled={saving} style={{ width: '100%', justifyContent: 'center' }}>
              <Save size={16} /> {saving ? 'Saving...' : isEditing ? 'Update Product' : 'Create Product'}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}
