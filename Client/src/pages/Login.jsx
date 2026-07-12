import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { BookOpen, LogIn, Mail, Lock } from 'lucide-react';

const Login = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Redirect path after successful login
  const from = location.state?.from?.pathname || '/';

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      setError('Please fill in all fields');
      return;
    }

    setLoading(true);
    setError('');

    try {
      await login(email, password);
      navigate(from, { replace: true });
    } catch (err) {
      setError(err.message || 'Failed to sign in. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container flex align-center justify-center animate-fade-in" style={{ minHeight: 'calc(100vh - var(--header-height) - 150px)', padding: '40px 20px' }}>
      <div className="card" style={{ width: '100%', maxWidth: '440px', padding: '40px 32px' }}>
        
        {/* Header Logo */}
        <div className="flex flex-col align-center gap-sm" style={{ textAlign: 'center', marginBottom: '32px' }}>
          <div style={{
            width: '48px',
            height: '48px',
            borderRadius: '12px',
            backgroundColor: 'var(--accent-light)',
            color: 'var(--accent)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            marginBottom: '8px'
          }}>
            <BookOpen size={24} />
          </div>
          <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '1.75rem', fontWeight: 800 }}>Welcome Back</h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>Sign in to manage your library and place orders</p>
        </div>

        {/* Demo Credentials Alert */}
        <div style={{
          backgroundColor: 'var(--accent-light)',
          border: '1px solid rgba(79, 70, 229, 0.3)',
          borderRadius: 'var(--radius-md)',
          padding: '12px 16px',
          fontSize: '0.8rem',
          color: 'var(--text-secondary)',
          lineHeight: '1.4',
          marginBottom: '24px'
        }}>
          <strong>Demo Logins:</strong><br />
          • Customer: <code>customer@bookstore.com</code> / <code>password123</code><br />
          • Admin: <code>admin@bookstore.com</code> / <code>admin123</code>
        </div>

        {/* Error Message */}
        {error && (
          <div className="badge badge-danger" style={{
            display: 'block',
            padding: '12px 16px',
            borderRadius: 'var(--radius-md)',
            fontSize: '0.85rem',
            lineHeight: '1.4',
            marginBottom: '20px',
            textAlign: 'center',
            textTransform: 'none',
            letterSpacing: 'none'
          }}>
            {error}
          </div>
        )}

        {/* Login Form */}
        <form onSubmit={handleSubmit}>
          {/* Email */}
          <div className="form-group">
            <label className="form-label" htmlFor="email-input">Email Address</label>
            <div style={{ position: 'relative' }}>
              <input
                id="email-input"
                type="email"
                placeholder="email@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={loading}
                className="form-input"
                style={{ width: '100%', paddingLeft: '44px', boxSizing: 'border-box' }}
              />
              <Mail size={18} style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
            </div>
          </div>

          {/* Password */}
          <div className="form-group" style={{ marginBottom: '28px' }}>
            <div className="flex justify-between align-center">
              <label className="form-label" htmlFor="password-input">Password</label>
              <a href="#" style={{ fontSize: '0.8rem', color: 'var(--accent-hover)' }} onClick={(e) => e.preventDefault()}>Forgot?</a>
            </div>
            <div style={{ position: 'relative' }}>
              <input
                id="password-input"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={loading}
                className="form-input"
                style={{ width: '100%', paddingLeft: '44px', boxSizing: 'border-box' }}
              />
              <Lock size={18} style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="btn btn-primary"
            style={{ width: '100%', padding: '12px', gap: '8px', fontSize: '1rem', opacity: loading ? 0.7 : 1 }}
          >
            <LogIn size={18} />
            <span>{loading ? 'Signing in...' : 'Sign In'}</span>
          </button>
        </form>

        {/* Footer Link */}
        <p style={{
          textAlign: 'center',
          marginTop: '24px',
          fontSize: '0.9rem',
          color: 'var(--text-secondary)'
        }}>
          Don't have an account?{' '}
          <Link to="/register" style={{ color: 'var(--accent-hover)', fontWeight: 600 }}>
            Register Now
          </Link>
        </p>

      </div>
    </div>
  );
};

export default Login;
