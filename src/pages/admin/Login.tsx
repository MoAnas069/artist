import { useState, FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { signIn } from '../../lib/firebase/auth';
import { Lock } from 'lucide-react';

export default function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await signIn(email, password);
      navigate('/admin');
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Invalid email or password.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#fafafa',
        padding: '1.5rem',
      }}
    >
      <div
        style={{
          width: '100%',
          maxWidth: 400,
          background: 'white',
          borderRadius: 14,
          padding: '2.5rem 2rem',
          border: '1px solid #e5e7eb',
          boxShadow: '0 4px 24px -2px rgba(0, 0, 0, 0.05)',
        }}
      >
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <div
            style={{
              width: 44,
              height: 44,
              borderRadius: 10,
              backgroundColor: '#f3f4f6',
              color: '#1a1a1a',
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: '1rem',
            }}
          >
            <Lock size={20} />
          </div>
          <h1
            style={{
              fontSize: '1.4rem',
              fontWeight: 600,
              marginBottom: '0.25rem',
              letterSpacing: '-0.02em',
              color: '#111827',
            }}
          >
            Studio Management
          </h1>
          <p style={{ fontSize: '0.875rem', color: '#6b7280' }}>
            Sign in to access your portfolio CMS
          </p>
        </div>

        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: '1.15rem' }}>
            <label className="admin-label">Email Address</label>
            <input
              className="admin-input"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="name@domain.com"
              autoComplete="email"
            />
          </div>

          <div style={{ marginBottom: '1.5rem' }}>
            <label className="admin-label">Password</label>
            <input
              className="admin-input"
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••••••"
              autoComplete="current-password"
            />
          </div>

          {error && (
            <p
              style={{
                fontSize: '0.8125rem',
                color: '#dc2626',
                marginBottom: '1.25rem',
                backgroundColor: '#fef2f2',
                padding: '0.625rem 0.75rem',
                borderRadius: 6,
                border: '1px solid #fee2e2',
              }}
            >
              {error}
            </p>
          )}

          <button
            type="submit"
            className="admin-btn admin-btn-primary"
            disabled={loading}
            style={{
              width: '100%',
              justifyContent: 'center',
              opacity: loading ? 0.7 : 1,
              padding: '0.75rem',
              fontSize: '0.875rem',
              fontWeight: 500,
            }}
          >
            {loading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>
      </div>
    </div>
  );
}
