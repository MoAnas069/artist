import { useState, useEffect } from 'react';
import { NavLink, useNavigate, useLocation } from 'react-router-dom';
import { signOut } from '../../lib/firebase/auth';
import {
  LayoutDashboard,
  Image,
  BookOpen,
  ShoppingBag,
  MessageCircle,
  Settings,
  LogOut,
  Menu,
  X,
} from 'lucide-react';

const navItems = [
  { label: 'Dashboard', path: '/admin', icon: LayoutDashboard },
  { label: 'Artworks', path: '/admin/artworks', icon: Image },
  { label: 'Journal', path: '/admin/journal', icon: BookOpen },
  { label: 'Shop', path: '/admin/shop', icon: ShoppingBag },
  { label: 'Messages', path: '/admin/messages', icon: MessageCircle },
  { label: 'Settings', path: '/admin/settings', icon: Settings },
];

export default function AdminSidebar() {
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);

  // Close mobile drawer on route change
  useEffect(() => {
    setMobileOpen(false);
  }, [location.pathname]);

  const handleSignOut = async () => {
    await signOut();
    navigate('/admin/login');
  };

  const linkStyle = (isActive: boolean): React.CSSProperties => ({
    display: 'flex',
    alignItems: 'center',
    gap: '0.75rem',
    padding: '0.625rem 1rem',
    borderRadius: 8,
    fontSize: '0.875rem',
    fontWeight: isActive ? 500 : 400,
    color: isActive ? '#1a1a1a' : '#6b7280',
    backgroundColor: isActive ? '#f3f4f6' : 'transparent',
    textDecoration: 'none',
    transition: 'all 150ms ease',
  });

  return (
    <>
      {/* Mobile Header (Screens < 1024px) */}
      <div
        className="admin-mobile-header"
        style={{
          display: 'none',
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          height: 60,
          backgroundColor: 'white',
          borderBottom: '1px solid #e5e7eb',
          padding: '0 1rem',
          alignItems: 'center',
          justifyContent: 'space-between',
          zIndex: 150,
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            style={{
              padding: '0.5rem',
              borderRadius: 6,
              border: '1px solid #e5e7eb',
              backgroundColor: '#f9fafb',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
            }}
            aria-label="Toggle menu"
          >
            {mobileOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
          <span style={{ fontSize: '0.875rem', fontWeight: 600, color: '#1a1a1a' }}>
            STUDIO CMS
          </span>
        </div>

        <button
          onClick={handleSignOut}
          style={{
            padding: '0.4rem 0.75rem',
            fontSize: '0.75rem',
            color: '#ef4444',
            backgroundColor: '#fef2f2',
            border: '1px solid #fecaca',
            borderRadius: 6,
            cursor: 'pointer',
          }}
        >
          Sign Out
        </button>
      </div>

      {/* Backdrop for Mobile Drawer */}
      {mobileOpen && (
        <div
          onClick={() => setMobileOpen(false)}
          style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.4)',
            zIndex: 180,
            backdropFilter: 'blur(2px)',
          }}
        />
      )}

      {/* Sidebar / Drawer */}
      <aside
        className={`admin-sidebar ${mobileOpen ? 'admin-sidebar-open' : ''}`}
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: 260,
          height: '100vh',
          backgroundColor: 'white',
          borderRight: '1px solid #e5e7eb',
          padding: '1.5rem 1rem',
          display: 'flex',
          flexDirection: 'column',
          zIndex: 200,
          overflowY: 'auto',
          transition: 'transform 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
        }}
      >
        {/* Logo & Close on mobile */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 1rem 1.5rem', borderBottom: '1px solid #e5e7eb', marginBottom: '1rem' }}>
          <span style={{ fontSize: '0.875rem', fontWeight: 600, color: '#1a1a1a' }}>
            STUDIO CMS
          </span>
          <button
            onClick={() => setMobileOpen(false)}
            className="admin-drawer-close"
            style={{ display: 'none', background: 'none', border: 'none', cursor: 'pointer', padding: 4 }}
          >
            <X size={18} />
          </button>
        </div>

        {/* Nav */}
        <nav style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
          {navItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              end={item.path === '/admin'}
              style={({ isActive }) => linkStyle(isActive)}
            >
              <item.icon size={18} />
              {item.label}
            </NavLink>
          ))}
        </nav>

        {/* Sign Out */}
        <button
          onClick={handleSignOut}
          style={{
            ...linkStyle(false),
            border: 'none',
            cursor: 'pointer',
            width: '100%',
            marginTop: '0.5rem',
            borderTop: '1px solid #e5e7eb',
            borderRadius: 0,
            paddingTop: '1rem',
          }}
        >
          <LogOut size={18} />
          Sign Out
        </button>
      </aside>
    </>
  );
}
