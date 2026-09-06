import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Plus, Edit, Trash2, Eye, EyeOff } from 'lucide-react';
import { getAllPosts, deletePost, updatePost } from '../../services/journalService';
import type { JournalPost } from '../../types';
import { formatEditorialDate } from '../../utils/helpers';
import ConfirmDialog from '../../components/ui/ConfirmDialog';
import { useToast } from '../../components/ui/Toast';

export default function JournalCMS() {
  const [posts, setPosts] = useState<JournalPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleteTarget, setDeleteTarget] = useState<JournalPost | null>(null);
  const navigate = useNavigate();
  const { showToast } = useToast();

  const loadPosts = () => {
    setLoading(true);
    getAllPosts().then(setPosts).catch(console.error).finally(() => setLoading(false));
  };

  useEffect(loadPosts, []);

  const handleDelete = async () => {
    if (!deleteTarget) return;
    try {
      await deletePost(deleteTarget.id);
      showToast('Post deleted');
      loadPosts();
    } catch {
      showToast('Failed to delete post', 'error');
    }
    setDeleteTarget(null);
  };

  const togglePublish = async (post: JournalPost) => {
    try {
      await updatePost(post.id, {
        published: !post.published,
        ...((!post.published && !post.publishedAt) ? { publishedAt: new Date() as any } : {}),
      });
      showToast(post.published ? 'Post unpublished' : 'Post published');
      loadPosts();
    } catch {
      showToast('Failed to update post', 'error');
    }
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
        <div>
          <h1 style={{ fontSize: '1.5rem', fontWeight: 600 }}>Journal</h1>
          <p style={{ fontSize: '0.875rem', color: '#6b7280' }}>{posts.length} entries</p>
        </div>
        <Link to="/admin/journal/new" className="admin-btn admin-btn-primary" style={{ textDecoration: 'none' }}>
          <Plus size={16} /> Write Entry
        </Link>
      </div>

      <div className="admin-card" style={{ padding: 0, overflow: 'hidden' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.875rem' }}>
          <thead>
            <tr style={{ borderBottom: '1px solid #e5e7eb' }}>
              <th style={thStyle}>Title</th>
              <th style={thStyle}>Date</th>
              <th style={thStyle}>Tags</th>
              <th style={thStyle}>Status</th>
              <th style={{ ...thStyle, textAlign: 'right' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {posts.map((post) => (
              <tr key={post.id} style={{ borderBottom: '1px solid #f3f4f6' }}>
                <td style={tdStyle}>
                  <span style={{ fontWeight: 500 }}>{post.title}</span>
                  {post.excerpt && <p style={{ fontSize: '0.75rem', color: '#9ca3af', marginTop: 2 }}>{post.excerpt.substring(0, 60)}...</p>}
                </td>
                <td style={tdStyle}>{formatEditorialDate(post.publishedAt || post.createdAt)}</td>
                <td style={tdStyle}>
                  <div style={{ display: 'flex', gap: '0.25rem', flexWrap: 'wrap' }}>
                    {post.tags.slice(0, 2).map((tag) => (
                      <span key={tag} style={{ fontSize: '0.6875rem', padding: '0.125rem 0.375rem', backgroundColor: '#f3f4f6', borderRadius: 4 }}>
                        {tag}
                      </span>
                    ))}
                  </div>
                </td>
                <td style={tdStyle}>
                  <span style={{
                    padding: '0.125rem 0.5rem',
                    borderRadius: 20,
                    fontSize: '0.75rem',
                    fontWeight: 500,
                    backgroundColor: post.published ? '#dcfce7' : '#f3f4f6',
                    color: post.published ? '#166534' : '#6b7280',
                  }}>
                    {post.published ? 'Published' : 'Draft'}
                  </span>
                </td>
                <td style={{ ...tdStyle, textAlign: 'right' }}>
                  <div style={{ display: 'flex', gap: '0.25rem', justifyContent: 'flex-end' }}>
                    <button onClick={() => togglePublish(post)} title={post.published ? 'Unpublish' : 'Publish'} style={iconBtnStyle}>
                      {post.published ? <EyeOff size={15} /> : <Eye size={15} />}
                    </button>
                    <button onClick={() => navigate(`/admin/journal/${post.id}`)} title="Edit" style={iconBtnStyle}>
                      <Edit size={15} />
                    </button>
                    <button onClick={() => setDeleteTarget(post)} title="Delete" style={{ ...iconBtnStyle, color: '#ef4444' }}>
                      <Trash2 size={15} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
            {posts.length === 0 && !loading && (
              <tr><td colSpan={5} style={{ textAlign: 'center', padding: '3rem', color: '#9ca3af' }}>No journal entries yet.</td></tr>
            )}
          </tbody>
        </table>
      </div>

      <ConfirmDialog
        isOpen={!!deleteTarget}
        title="Delete entry"
        message={`Are you sure you want to delete "${deleteTarget?.title}"?`}
        confirmLabel="Delete"
        danger
        onConfirm={handleDelete}
        onCancel={() => setDeleteTarget(null)}
      />
    </div>
  );
}

const thStyle: React.CSSProperties = { textAlign: 'left', padding: '0.75rem 1rem', fontWeight: 500, fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.05em', color: '#6b7280' };
const tdStyle: React.CSSProperties = { padding: '0.75rem 1rem', verticalAlign: 'middle' };
const iconBtnStyle: React.CSSProperties = { padding: '0.375rem', borderRadius: 6, color: '#6b7280', display: 'flex', alignItems: 'center' };
