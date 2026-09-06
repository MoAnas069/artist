import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Plus, Edit, Trash2, Eye, EyeOff } from 'lucide-react';
import { getAllProducts, deleteProduct, updateProduct } from '../../services/productService';
import type { Product } from '../../types';
import { formatPrice } from '../../utils/helpers';
import ConfirmDialog from '../../components/ui/ConfirmDialog';
import { useToast } from '../../components/ui/Toast';

export default function ShopCMS() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleteTarget, setDeleteTarget] = useState<Product | null>(null);
  const navigate = useNavigate();
  const { showToast } = useToast();

  const loadProducts = () => {
    setLoading(true);
    getAllProducts().then(setProducts).catch(console.error).finally(() => setLoading(false));
  };

  useEffect(loadProducts, []);

  const handleDelete = async () => {
    if (!deleteTarget) return;
    try {
      await deleteProduct(deleteTarget.id);
      showToast('Product deleted');
      loadProducts();
    } catch {
      showToast('Failed to delete product', 'error');
    }
    setDeleteTarget(null);
  };

  const toggleAvailable = async (product: Product) => {
    try {
      await updateProduct(product.id, { available: !product.available });
      showToast(product.available ? 'Product hidden' : 'Product available');
      loadProducts();
    } catch {
      showToast('Failed to update product', 'error');
    }
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
        <div>
          <h1 style={{ fontSize: '1.5rem', fontWeight: 600 }}>Shop</h1>
          <p style={{ fontSize: '0.875rem', color: '#6b7280' }}>{products.length} products</p>
        </div>
        <Link to="/admin/shop/new" className="admin-btn admin-btn-primary" style={{ textDecoration: 'none' }}>
          <Plus size={16} /> Add Product
        </Link>
      </div>

      <div className="admin-card" style={{ padding: 0, overflow: 'hidden' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.875rem' }}>
          <thead>
            <tr style={{ borderBottom: '1px solid #e5e7eb' }}>
              <th style={thStyle}>Image</th>
              <th style={thStyle}>Title</th>
              <th style={thStyle}>Type</th>
              <th style={thStyle}>Price</th>
              <th style={thStyle}>Stock</th>
              <th style={thStyle}>Status</th>
              <th style={{ ...thStyle, textAlign: 'right' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {products.map((product) => (
              <tr key={product.id} style={{ borderBottom: '1px solid #f3f4f6' }}>
                <td style={tdStyle}>
                  {product.images?.[0] ? (
                    <img src={product.images[0]} alt="" style={{ width: 48, height: 48, objectFit: 'cover', borderRadius: 6 }} />
                  ) : (
                    <div style={{ width: 48, height: 48, backgroundColor: '#f3f4f6', borderRadius: 6 }} />
                  )}
                </td>
                <td style={tdStyle}><span style={{ fontWeight: 500 }}>{product.title}</span></td>
                <td style={tdStyle}>{product.type}</td>
                <td style={tdStyle}>{formatPrice(product.price, product.currency)}</td>
                <td style={tdStyle}>{product.stock}</td>
                <td style={tdStyle}>
                  <span style={{
                    padding: '0.125rem 0.5rem', borderRadius: 20, fontSize: '0.75rem', fontWeight: 500,
                    backgroundColor: product.available ? '#dcfce7' : '#f3f4f6',
                    color: product.available ? '#166534' : '#6b7280',
                  }}>
                    {product.available ? 'Available' : 'Hidden'}
                  </span>
                </td>
                <td style={{ ...tdStyle, textAlign: 'right' }}>
                  <div style={{ display: 'flex', gap: '0.25rem', justifyContent: 'flex-end' }}>
                    <button onClick={() => toggleAvailable(product)} style={iconBtnStyle}>
                      {product.available ? <EyeOff size={15} /> : <Eye size={15} />}
                    </button>
                    <button onClick={() => navigate(`/admin/shop/${product.id}`)} style={iconBtnStyle}>
                      <Edit size={15} />
                    </button>
                    <button onClick={() => setDeleteTarget(product)} style={{ ...iconBtnStyle, color: '#ef4444' }}>
                      <Trash2 size={15} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
            {products.length === 0 && !loading && (
              <tr><td colSpan={7} style={{ textAlign: 'center', padding: '3rem', color: '#9ca3af' }}>No products yet.</td></tr>
            )}
          </tbody>
        </table>
      </div>

      <ConfirmDialog isOpen={!!deleteTarget} title="Delete product" message={`Delete "${deleteTarget?.title}"?`} confirmLabel="Delete" danger onConfirm={handleDelete} onCancel={() => setDeleteTarget(null)} />
    </div>
  );
}

const thStyle: React.CSSProperties = { textAlign: 'left', padding: '0.75rem 1rem', fontWeight: 500, fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.05em', color: '#6b7280' };
const tdStyle: React.CSSProperties = { padding: '0.75rem 1rem', verticalAlign: 'middle' };
const iconBtnStyle: React.CSSProperties = { padding: '0.375rem', borderRadius: 6, color: '#6b7280', display: 'flex', alignItems: 'center' };
