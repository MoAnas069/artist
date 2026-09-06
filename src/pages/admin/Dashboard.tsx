import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Image, BookOpen, ShoppingBag, MessageCircle, Plus } from 'lucide-react';
import { getAllArtworks } from '../../services/artworkService';
import { getAllPosts } from '../../services/journalService';
import { getAllProducts } from '../../services/productService';
import { getMessages } from '../../services/messageService';
import type { DashboardStats } from '../../types';

export default function Dashboard() {
  const [stats, setStats] = useState<DashboardStats>({
    totalArtworks: 0,
    publishedArtworks: 0,
    draftArtworks: 0,
    journalPosts: 0,
    products: 0,
    unreadMessages: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadStats = () => {
      Promise.all([getAllArtworks(), getAllPosts(), getAllProducts(), getMessages()])
        .then(([artworks, posts, products, messages]) => {
          setStats({
            totalArtworks: artworks.length,
            publishedArtworks: artworks.filter((a) => a.published).length,
            draftArtworks: artworks.filter((a) => !a.published).length,
            journalPosts: posts.length,
            products: products.length,
            unreadMessages: messages.filter((m) => m.status === 'unread').length,
          });
        })
        .catch(console.error)
        .finally(() => setLoading(false));
    };

    loadStats();
    window.addEventListener('studio_messages_updated', loadStats);
    window.addEventListener('storage', loadStats);
    return () => {
      window.removeEventListener('studio_messages_updated', loadStats);
      window.removeEventListener('storage', loadStats);
    };
  }, []);

  const statCards = [
    { label: 'Artworks', value: stats.totalArtworks, sub: `${stats.publishedArtworks} published, ${stats.draftArtworks} drafts`, icon: Image, color: '#6366f1' },
    { label: 'Journal Posts', value: stats.journalPosts, icon: BookOpen, color: '#10b981' },
    { label: 'Products', value: stats.products, icon: ShoppingBag, color: '#f59e0b' },
    { label: 'Unread Messages', value: stats.unreadMessages, icon: MessageCircle, color: '#ef4444' },
  ];

  const quickActions = [
    { label: 'Add Artwork', path: '/admin/artworks/new', icon: Image },
    { label: 'Write Entry', path: '/admin/journal/new', icon: BookOpen },
    { label: 'Add Product', path: '/admin/shop/new', icon: ShoppingBag },
    { label: 'View Messages', path: '/admin/messages', icon: MessageCircle },
    { label: 'Homepage X-Ray & Sections', path: '/admin/settings', icon: Plus },
  ];

  return (
    <div>
      <div style={{ marginBottom: '2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1 style={{ fontSize: '1.5rem', fontWeight: 600, marginBottom: '0.25rem' }}>Dashboard</h1>
          <p style={{ fontSize: '0.875rem', color: '#6b7280' }}>Overview of your portfolio & studio archive</p>
        </div>
        <Link
          to="/"
          target="_blank"
          className="admin-btn admin-btn-secondary"
          style={{ textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '0.5rem' }}
        >
          <span>View Live Portfolio</span>
        </Link>
      </div>

      {/* Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1rem', marginBottom: '2rem' }}>
        {statCards.map((card) => (
          <div key={card.label} className="admin-card" style={{ opacity: loading ? 0.5 : 1 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '1rem' }}>
              <div
                style={{
                  width: 40,
                  height: 40,
                  borderRadius: 10,
                  backgroundColor: card.color + '10',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <card.icon size={20} color={card.color} />
              </div>
            </div>
            <p style={{ fontSize: '2rem', fontWeight: 600, lineHeight: 1 }}>{card.value}</p>
            <p style={{ fontSize: '0.8125rem', color: '#6b7280', marginTop: '0.25rem' }}>{card.label}</p>
            {card.sub && <p style={{ fontSize: '0.75rem', color: '#9ca3af', marginTop: '0.25rem' }}>{card.sub}</p>}
          </div>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="admin-card">
        <h2 style={{ fontSize: '1rem', fontWeight: 600, marginBottom: '1rem' }}>Quick Actions</h2>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.75rem' }}>
          {quickActions.map((action) => (
            <Link
              key={action.path}
              to={action.path}
              className="admin-btn admin-btn-secondary"
              style={{ textDecoration: 'none' }}
            >
              <Plus size={16} />
              {action.label}
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
