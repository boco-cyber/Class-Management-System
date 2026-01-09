import React, { useState } from 'react';
import { Eye, EyeOff, Church, LogIn, AlertCircle } from 'lucide-react';
import { login } from './service.js';

export default function LoginScreen({ onLoginSuccess }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const result = await login({ username, password, rememberMe });

      if (result.success) {
        // Store session token in localStorage
        localStorage.setItem('yms_session_token', result.sessionToken);
        onLoginSuccess(result.user, result.sessionToken);
      } else {
        setError(result.error || 'Login failed. Please try again.');
      }
    } catch (err) {
      console.error('Login error:', err);
      setError('An unexpected error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !loading) {
      handleSubmit(e);
    }
  };

  return (
    <div className="auth-shell">
      <div className="auth-card">
        <div className="auth-header">
          <div className="auth-logo">
            <Church size={28} />
          </div>
          <div>
            <h1>Youth Ministry System</h1>
            <p>HS 2025-2026</p>
          </div>
        </div>

        <form className="auth-form" onSubmit={handleSubmit}>
          {error && (
            <div className="auth-error" style={{ display: 'flex', gap: '0.75rem', alignItems: 'flex-start' }}>
              <AlertCircle size={18} style={{ flexShrink: 0, marginTop: 2 }} />
              <span>{error}</span>
            </div>
          )}

          <div className="form-group">
            <label htmlFor="username">Username</label>
            <input
              type="text"
              id="username"
              value={username}
              onChange={(e) => {
                setUsername(e.target.value);
                setError('');
              }}
              onKeyPress={handleKeyPress}
              required
              autoFocus
              disabled={loading}
              placeholder="Enter your username"
              autoComplete="username"
            />
          </div>

          <div className="form-group auth-password">
            <label htmlFor="password">Password</label>
            <input
              type={showPassword ? 'text' : 'password'}
              id="password"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                setError('');
              }}
              onKeyPress={handleKeyPress}
              required
              disabled={loading}
              placeholder="Enter your password"
              autoComplete="current-password"
            />
            <button
              type="button"
              className="password-toggle"
              onClick={() => setShowPassword(!showPassword)}
              aria-label={showPassword ? 'Hide password' : 'Show password'}
              tabIndex={-1}
            >
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>

          <div className="auth-checkbox">
            <input
              type="checkbox"
              id="rememberMe"
              checked={rememberMe}
              onChange={(e) => setRememberMe(e.target.checked)}
              disabled={loading}
            />
            <label htmlFor="rememberMe">Remember me for 7 days</label>
          </div>

          <button
            type="submit"
            className="btn-primary auth-submit"
            disabled={loading || !username || !password}
          >
            {loading ? (
              <div className="auth-loading">
                <div className="spinner" style={{ width: 20, height: 20, borderWidth: 3 }} />
                <span>Logging in...</span>
              </div>
            ) : (
              <>
                <LogIn size={18} />
                Login
              </>
            )}
          </button>
        </form>

        <div className="auth-footer">
          <p style={{ margin: 0, fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
            Forgot your password? Contact an administrator for assistance.
          </p>
        </div>
      </div>
    </div>
  );
}
