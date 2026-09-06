import { Link } from 'react-router-dom';

export default function BackToHome() {
  return (
    <nav
      style={{
        position: 'fixed',
        top: 'clamp(1rem, 3vw, 1.75rem)',
        left: 'clamp(1rem, 3vw, 2rem)',
        zIndex: 100,
        pointerEvents: 'auto',
      }}
    >
      <Link
        to="/"
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '0.5rem',
          padding: '0.45rem 1.1rem',
          borderRadius: 999,
          backgroundColor: 'rgba(245, 240, 235, 0.88)',
          backdropFilter: 'blur(10px)',
          WebkitBackdropFilter: 'blur(10px)',
          border: '1px solid rgba(26, 26, 26, 0.12)',
          color: 'var(--color-charcoal)',
          fontFamily: 'var(--font-mono, monospace)',
          fontSize: '0.72rem',
          fontWeight: 500,
          letterSpacing: '0.12em',
          textTransform: 'uppercase',
          boxShadow: '0 2px 12px rgba(0, 0, 0, 0.05)',
          transition: 'all 0.2s ease',
          textDecoration: 'none',
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.backgroundColor = 'var(--color-charcoal)';
          e.currentTarget.style.color = 'var(--color-ivory)';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.backgroundColor = 'rgba(245, 240, 235, 0.88)';
          e.currentTarget.style.color = 'var(--color-charcoal)';
        }}
      >
        <span style={{ fontSize: '0.85rem', lineHeight: 1 }}>←</span>
        <span>Directory</span>
      </Link>
    </nav>
  );
}
