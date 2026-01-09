import React, { useState } from 'react';
import { Eye, EyeOff, Church, User, Mail, Lock, CheckCircle, AlertCircle } from 'lucide-react';
import { setupInitialAdmin } from './service.js';

export default function SetupWizard({ onSetupComplete }) {
  const [formData, setFormData] = useState({
    fullName: '',
    username: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    setError(''); // Clear error on input change
  };

  const validateForm = () => {
    if (!formData.fullName.trim()) {
      return 'Full name is required';
    }
    if (!formData.username.trim() || formData.username.length < 3) {
      return 'Username must be at least 3 characters';
    }
    if (!formData.password || formData.password.length < 8) {
      return 'Password must be at least 8 characters';
    }
    if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(formData.password)) {
      return 'Password must contain uppercase, lowercase, and numbers';
    }
    if (formData.password !== formData.confirmPassword) {
      return 'Passwords do not match';
    }
    return null;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const validationError = validateForm();
    if (validationError) {
      setError(validationError);
      return;
    }

    setLoading(true);
    setError('');

    try {
      const result = await setupInitialAdmin({
        username: formData.username,
        password: formData.password,
        fullName: formData.fullName,
        email: formData.email
      });

      if (result.success) {
        onSetupComplete();
      } else {
        setError(result.error || 'Setup failed. Please try again.');
      }
    } catch (err) {
      console.error('Setup error:', err);
      setError('An unexpected error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const passwordStrength = () => {
    const password = formData.password;
    if (!password) return null;

    let strength = 0;
    if (password.length >= 8) strength++;
    if (password.length >= 12) strength++;
    if (/[a-z]/.test(password)) strength++;
    if (/[A-Z]/.test(password)) strength++;
    if (/\d/.test(password)) strength++;
    if (/[^a-zA-Z0-9]/.test(password)) strength++;

    if (strength <= 2) return { label: 'Weak', color: 'var(--danger)' };
    if (strength <= 4) return { label: 'Medium', color: 'var(--warning)' };
    return { label: 'Strong', color: 'var(--success)' };
  };

  const strength = passwordStrength();

  return (
    <div className="auth-shell">
      <div className="auth-card" style={{ maxWidth: '600px' }}>
        <div className="auth-header">
          <div className="auth-logo">
            <Church size={28} />
          </div>
          <div>
            <h1>Welcome to Youth Ministry System</h1>
            <p>Let's set up your administrator account</p>
          </div>
        </div>

        <form className="auth-form" onSubmit={handleSubmit}>
          {error && (
            <div className="auth-error">
              <AlertCircle size={16} style={{ flexShrink: 0, marginTop: 2 }} />
              <span>{error}</span>
            </div>
          )}

          <div className="form-group">
            <label htmlFor="fullName">
              <User size={16} style={{ display: 'inline', marginRight: 6 }} />
              Full Name *
            </label>
            <input
              type="text"
              id="fullName"
              name="fullName"
              value={formData.fullName}
              onChange={handleChange}
              required
              autoFocus
              disabled={loading}
              placeholder="Enter your full name"
            />
          </div>

          <div className="form-group">
            <label htmlFor="username">
              <User size={16} style={{ display: 'inline', marginRight: 6 }} />
              Username *
            </label>
            <input
              type="text"
              id="username"
              name="username"
              value={formData.username}
              onChange={handleChange}
              required
              disabled={loading}
              placeholder="Choose a username (min 3 characters)"
              autoComplete="username"
            />
          </div>

          <div className="form-group">
            <label htmlFor="email">
              <Mail size={16} style={{ display: 'inline', marginRight: 6 }} />
              Email (Optional)
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              disabled={loading}
              placeholder="your.email@example.com"
              autoComplete="email"
            />
          </div>

          <div className="form-group auth-password">
            <label htmlFor="password">
              <Lock size={16} style={{ display: 'inline', marginRight: 6 }} />
              Password *
            </label>
            <input
              type={showPassword ? 'text' : 'password'}
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
              disabled={loading}
              placeholder="Min 8 characters with uppercase, lowercase, numbers"
              autoComplete="new-password"
            />
            <button
              type="button"
              className="password-toggle"
              onClick={() => setShowPassword(!showPassword)}
              tabIndex={-1}
            >
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
            {strength && (
              <div style={{
                marginTop: 6,
                fontSize: '0.85rem',
                color: strength.color,
                fontWeight: 600
              }}>
                Password strength: {strength.label}
              </div>
            )}
          </div>

          <div className="form-group auth-password">
            <label htmlFor="confirmPassword">
              <Lock size={16} style={{ display: 'inline', marginRight: 6 }} />
              Confirm Password *
            </label>
            <input
              type={showConfirmPassword ? 'text' : 'password'}
              id="confirmPassword"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              required
              disabled={loading}
              placeholder="Re-enter your password"
              autoComplete="new-password"
            />
            <button
              type="button"
              className="password-toggle"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              tabIndex={-1}
            >
              {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
            {formData.confirmPassword && formData.password === formData.confirmPassword && (
              <div style={{
                marginTop: 6,
                fontSize: '0.85rem',
                color: 'var(--success)',
                fontWeight: 600,
                display: 'flex',
                alignItems: 'center',
                gap: 4
              }}>
                <CheckCircle size={14} />
                Passwords match
              </div>
            )}
          </div>

          <div style={{
            padding: '1rem',
            background: '#E3F2FD',
            borderRadius: '10px',
            borderLeft: '3px solid #2196F3',
            fontSize: '0.9rem',
            color: 'var(--text-secondary)'
          }}>
            <strong style={{ color: 'var(--text-primary)', display: 'block', marginBottom: 6 }}>
              Password Requirements:
            </strong>
            <ul style={{ margin: 0, paddingLeft: '1.5rem' }}>
              <li>At least 8 characters</li>
              <li>Contains uppercase letters (A-Z)</li>
              <li>Contains lowercase letters (a-z)</li>
              <li>Contains numbers (0-9)</li>
            </ul>
          </div>

          <button
            type="submit"
            className="btn-primary auth-submit"
            disabled={loading}
          >
            {loading ? (
              <>
                <div className="spinner" style={{ width: 16, height: 16, borderWidth: 2 }} />
                Creating Account...
              </>
            ) : (
              <>
                <CheckCircle size={18} />
                Complete Setup
              </>
            )}
          </button>
        </form>

        <div className="auth-footer">
          <p style={{ margin: 0, color: 'var(--text-secondary)' }}>
            This administrator account will have full access to all features.
            <br />
            You can create additional user accounts after setup.
          </p>
        </div>
      </div>
    </div>
  );
}
