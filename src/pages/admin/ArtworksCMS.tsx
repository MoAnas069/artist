import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Plus, Edit, Trash2, Eye, EyeOff, Star } from 'lucide-react';
import { getAllArtworks, deleteArtwork, updateArtwork } from '../../services/artworkService';
import type { Artwork } from '../../types';
import ConfirmDialog from '../../components/ui/ConfirmDialog';
import { useToast } from '../../components/ui/Toast';

export default function ArtworksCMS() {
  const [artworks, setArtworks] = useState<Artwork[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleteTarget, setDeleteTarget] = useState<Artwork | null>(null);
  const navigate = useNavigate();
  const { showToast } = useToast();

  const loadArtworks = () => {
    setLoading(true);
    getAllArtworks()
      .then(setArtworks)
      .catch(console.error)
      .finally(() => setLoading(false));
  };

  useEffect(loadArtworks, []);

  const handleDelete = async () => {
    if (!deleteTarget) return;
    try {
      await deleteArtwork(deleteTarget.id);
      showToast('Artwork deleted');
      loadArtworks();
    } catch {
      showToast('Failed to delete artwork', 'error');
    }
    setDeleteTarget(null);
  };

  const togglePublish = async (artwork: Artwork) => {
    try {
      await updateArtwork(artwork.id, { published: !artwork.published });
      showToast(artwork.published ? 'Artwork unpublished' : 'Artwork published');
      loadArtworks();
    } catch {
      showToast('Failed to update artwork', 'error');
    }
  };

  const toggleFeatured = async (artwork: Artwork) => {
    try {
      await updateArtwork(artwork.id, { featured: !artwork.featured });
      showToast(artwork.featured ? 'Removed from featured' : 'Added to featured');
      loadArtworks();
    } catch {
      showToast('Failed to update artwork', 'error');
    }
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
        <div>
          <h1 style={{ fontSize: '1.5rem', fontWeight: 600 }}>Artworks</h1>
          <p style={{ fontSize: '0.875rem', color: '#6b7280' }}>{artworks.length} total</p>
        </div>
        <Link to="/admin/artworks/new" className="admin-btn admin-btn-primary" style={{ textDecoration: 'none' }}>
          <Plus size={16} /> Add Artwork
        </Link>
      </div>

      <div className="admin-card" style={{ padding: 0, overflow: 'hidden' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.875rem' }}>
          <thead>
            <tr style={{ borderBottom: '1px solid #e5e7eb' }}>
              <th style={thStyle}>Image</th>
              <th style={thStyle}>Title</th>
              <th style={thStyle}>Year</th>
              <th style={thStyle}>Category</th>
              <th style={thStyle}>Status</th>
              <th style={thStyle}>Order</th>
              <th style={{ ...thStyle, textAlign: 'right' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {artworks.map((artwork) => (
              <tr key={artwork.id} style={{ borderBottom: '1px solid #f3f4f6' }}>
                <td style={tdStyle}>
                  {artwork.coverImage ? (
                    <img src={artwork.coverImage} alt="" style={{ width: 48, height: 48, objectFit: 'cover', borderRadius: 6 }} />
                  ) : (
                    <div style={{ width: 48, height: 48, backgroundColor: '#f3f4f6', borderRadius: 6 }} />
                  )}
                </td>
                <td style={tdStyle}>
                  <span style={{ fontWeight: 500 }}>{artwork.title}</span>
                  {artwork.featured && <Star size={12} fill="#f59e0b" color="#f59e0b" style={{ marginLeft: 6 }} />}
                </td>
                <td style={tdStyle}>{artwork.year}</td>
                <td style={tdStyle}>{artwork.category}</td>
                <td style={tdStyle}>
                  <span style={{
                    display: 'inline-flex',
                    padding: '0.125rem 0.5rem',
                    borderRadius: 20,
                    fontSize: '0.75rem',
                    fontWeight: 500,
                    backgroundColor: artwork.published ? '#dcfce7' : '#f3f4f6',
                    color: artwork.published ? '#166534' : '#6b7280',
                  }}>
                    {artwork.published ? 'Published' : 'Draft'}
                  </span>
                </td>
                <td style={tdStyle}>{artwork.sortOrder}</td>
                <td style={{ ...tdStyle, textAlign: 'right' }}>
                  <div style={{ display: 'flex', gap: '0.25rem', justifyContent: 'flex-end' }}>
                    <button
                      onClick={() => togglePublish(artwork)}
                      title={artwork.published ? 'Unpublish' : 'Publish'}
                      style={iconBtnStyle}
                    >
                      {artwork.published ? <EyeOff size={15} /> : <Eye size={15} />}
                    </button>
                    <button
                      onClick={() => toggleFeatured(artwork)}
                      title={artwork.featured ? 'Unfeature' : 'Feature'}
                      style={iconBtnStyle}
                    >
                      <Star size={15} fill={artwork.featured ? '#f59e0b' : 'none'} color={artwork.featured ? '#f59e0b' : '#9ca3af'} />
                    </button>
                    <button
                      onClick={() => navigate(`/admin/artworks/${artwork.id}`)}
                      title="Edit"
                      style={iconBtnStyle}
                    >
                      <Edit size={15} />
                    </button>
                    <button
                      onClick={() => setDeleteTarget(artwork)}
                      title="Delete"
                      style={{ ...iconBtnStyle, color: '#ef4444' }}
                    >
                      <Trash2 size={15} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
            {artworks.length === 0 && !loading && (
              <tr>
                <td colSpan={7} style={{ textAlign: 'center', padding: '3rem', color: '#9ca3af' }}>
                  No artworks yet. Click "Add Artwork" to create your first one.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <ConfirmDialog
        isOpen={!!deleteTarget}
        title="Delete artwork"
        message={`Are you sure you want to delete "${deleteTarget?.title}"? This cannot be undone.`}
        confirmLabel="Delete"
        danger
        onConfirm={handleDelete}
        onCancel={() => setDeleteTarget(null)}
      />
    </div>
  );
}

const thStyle: React.CSSProperties = {
  textAlign: 'left',
  padding: '0.75rem 1rem',
  fontWeight: 500,
  fontSize: '0.75rem',
  textTransform: 'uppercase',
  letterSpacing: '0.05em',
  color: '#6b7280',
};

const tdStyle: React.CSSProperties = {
  padding: '0.75rem 1rem',
  verticalAlign: 'middle',
};

const iconBtnStyle: React.CSSProperties = {
  padding: '0.375rem',
  borderRadius: 6,
  color: '#6b7280',
  transition: 'background-color 150ms',
  display: 'flex',
  alignItems: 'center',
};
