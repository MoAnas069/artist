import { useState, FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { signIn } from '../../lib/firebase/auth';
import { isConfigured } from '../../lib/firebase/config';
import { Sparkles, ArrowRight } from 'lucide-react';

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

  const handleDemoSignIn = async () => {
    setEmail('admin@studio.com');
    setPassword('admin123');
    setError('');
    setLoading(true);
    try {
      await signIn('admin@studio.com', 'admin123');
      navigate('/admin');
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Sign in failed');
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
        backgroundColor: '#f8f9fa',
        padding: '1.5rem',
      }}
    >
      <div
        style={{
          width: '100%',
          maxWidth: 420,
          background: 'white',
          borderRadius: 16,
          padding: '2.5rem 2rem',
          border: '1px solid #e5e7eb',
          boxShadow: '0 4px 20px rgba(0, 0, 0, 0.04)',
        }}
      >
        <h1 style={{ fontSize: '1.5rem', fontWeight: 600, marginBottom: '0.25rem', textAlign: 'center', letterSpacing: '-0.02em' }}>
          Studio CMS
        </h1>
        <p style={{ fontSize: '0.875rem', color: '#6b7280', textAlign: 'center', marginBottom: '1.75rem' }}>
          Sign in to manage your portfolio
        </p>

        {/* Demo Credentials Box */}
        <div
          style={{
            backgroundColor: '#f0fdf4',
            border: '1px solid #bbf7d0',
            borderRadius: 10,
            padding: '1rem',
            marginBottom: '1.5rem',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
            <Sparkles size={16} color="#16a34a" />
            <span style={{ fontSize: '0.8125rem', fontWeight: 600, color: '#15803d' }}>
              {isConfigured ? 'Firebase Auth Mode' : 'Development Demo Mode'}
            </span>
          </div>
          <p style={{ fontSize: '0.8125rem', color: '#166534', margin: '0 0 0.5rem 0', lineHeight: 1.4 }}>
            <strong>Email:</strong> <code style={{ background: '#dcfce7', padding: '2px 6px', borderRadius: 4 }}>admin@studio.com</code><br />
            <strong>Password:</strong> <code style={{ background: '#dcfce7', padding: '2px 6px', borderRadius: 4 }}>admin123</code>
          </p>
          <button
            type="button"
            onClick={handleDemoSignIn}
            disabled={loading}
            style={{
              width: '100%',
              padding: '0.5rem',
              backgroundColor: '#16a34a',
              color: 'white',
              border: 'none',
              borderRadius: 6,
              fontSize: '0.8125rem',
              fontWeight: 500,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.5rem',
            }}
          >
            One-Click Demo Sign In <ArrowRight size={14} />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: '1rem' }}>
            <label className="admin-label">Email</label>
            <input
              className="admin-input"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="admin@studio.com"
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
              placeholder="••••••••"
            />
          </div>

          {error && (
            <p style={{ fontSize: '0.8125rem', color: '#dc2626', marginBottom: '1rem', backgroundColor: '#fef2f2', padding: '0.5rem 0.75rem', borderRadius: 6, border: '1px solid #fee2e2' }}>
              {error}
            </p>
          )}

          <button
            type="submit"
            className="admin-btn admin-btn-primary"
            disabled={loading}
            style={{ width: '100%', justifyContent: 'center', opacity: loading ? 0.7 : 1, padding: '0.75rem' }}
          >
            {loading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>
      </div>
    </div>
  );
}
