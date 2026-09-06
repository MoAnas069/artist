import { NavLink, useNavigate } from 'react-router-dom';
import { signOut } from '../../lib/firebase/auth';
import {
  LayoutDashboard,
  Image,
  BookOpen,
  ShoppingBag,
  MessageCircle,
  Settings,
  LogOut,
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
    <aside
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
        zIndex: 100,
        overflowY: 'auto',
      }}
    >
      {/* Logo */}
      <div style={{ padding: '0 1rem 1.5rem', borderBottom: '1px solid #e5e7eb', marginBottom: '1rem' }}>
        <span style={{ fontSize: '0.875rem', fontWeight: 600, color: '#1a1a1a' }}>
          STUDIO CMS
        </span>
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
  );
}
