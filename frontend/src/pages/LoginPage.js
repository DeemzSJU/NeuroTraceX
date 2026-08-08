/**
 * NeuroTraceX — Login Page
 *
 * Simple email + password auth. Tabs toggle between
 * "Sign In" (existing user) and "Create Account" (new user).
 * No OTP, no Google OAuth.
 */

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { STEPS } from '../constants/experimentFlow';

const TAB = { SIGN_IN: 'signin', REGISTER: 'register' };

function LoginPage() {
  const navigate = useNavigate();
  const { login, register, isAuthenticated, loading } = useAuth();

  const [tab, setTab]           = useState(TAB.SIGN_IN);
  const [name, setName]         = useState('');
  const [email, setEmail]       = useState('');
  const [password, setPassword] = useState('');
  const [error, setError]       = useState(null);

  // If already logged in, skip to consent
  useEffect(() => {
    if (isAuthenticated) navigate(STEPS.CONSENT.path);
  }, [isAuthenticated, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    try {
      if (tab === TAB.REGISTER) {
        if (!name.trim()) { setError('Please enter your name.'); return; }
        await register(name.trim(), email.trim(), password);
      } else {
        await login(email.trim(), password);
      }
      navigate(STEPS.CONSENT.path);
    } catch (err) {
      setError(err.message || 'Something went wrong. Please try again.');
    }
  };

  return (
    <div className="page animate-fade-in" style={{ justifyContent: 'center', minHeight: '80vh' }}>
      <div style={{ maxWidth: '420px', width: '100%', margin: '0 auto' }}>

        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <h1 style={{ fontSize: 'var(--text-2xl)', marginBottom: '0.5rem' }}>Welcome to NeuroTraceX</h1>
          <p style={{ fontSize: 'var(--text-sm)', color: 'var(--color-text-tertiary)' }}>
            Sign in to save your progress across sessions.
          </p>
        </div>

        <div className="card" style={{ padding: '0' }}>

          {/* Tab Toggle */}
          <div style={{
            display: 'grid', gridTemplateColumns: '1fr 1fr',
            borderBottom: '1px solid var(--color-border)',
          }}>
            {[
              { id: TAB.SIGN_IN, label: 'Sign In' },
              { id: TAB.REGISTER, label: 'Create Account' },
            ].map(t => (
              <button
                key={t.id}
                type="button"
                onClick={() => { setTab(t.id); setError(null); }}
                style={{
                  padding: '1rem',
                  background: 'none',
                  border: 'none',
                  borderBottom: tab === t.id
                    ? '2px solid var(--color-accent)'
                    : '2px solid transparent',
                  color: tab === t.id
                    ? 'var(--color-accent)'
                    : 'var(--color-text-tertiary)',
                  fontWeight: tab === t.id ? 600 : 400,
                  fontSize: 'var(--text-sm)',
                  cursor: 'pointer',
                  fontFamily: 'var(--font-sans)',
                  transition: 'all 0.15s ease',
                  marginBottom: '-1px',
                }}
              >
                {t.label}
              </button>
            ))}
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} style={{ padding: '1.75rem' }}>

            {/* Name — only for Register */}
            {tab === TAB.REGISTER && (
              <div style={{ marginBottom: '1rem' }}>
                <label htmlFor="auth-name">Full name</label>
                <input
                  id="auth-name"
                  type="text"
                  placeholder="Jane Smith"
                  value={name}
                  onChange={e => setName(e.target.value)}
                  autoComplete="name"
                  required
                />
              </div>
            )}

            <div style={{ marginBottom: '1rem' }}>
              <label htmlFor="auth-email">Email address</label>
              <input
                id="auth-email"
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={e => setEmail(e.target.value)}
                autoComplete="email"
                required
              />
            </div>

            <div style={{ marginBottom: '1.5rem' }}>
              <label htmlFor="auth-password">Password</label>
              <input
                id="auth-password"
                type="password"
                placeholder={tab === TAB.REGISTER ? 'At least 6 characters' : '••••••••'}
                value={password}
                onChange={e => setPassword(e.target.value)}
                autoComplete={tab === TAB.REGISTER ? 'new-password' : 'current-password'}
                minLength={tab === TAB.REGISTER ? 6 : undefined}
                required
              />
            </div>

            {error && (
              <p style={{
                color: 'var(--color-error)', fontSize: 'var(--text-xs)',
                marginBottom: '1rem', padding: '0.6rem 0.75rem',
                background: 'rgba(var(--color-error-rgb, 220,53,69),0.08)',
                borderRadius: '6px',
              }}>
                {error}
              </p>
            )}

            <button
              type="submit"
              className={`btn btn--primary btn--large${loading ? ' btn--loading' : ''}`}
              disabled={loading || !email.trim() || !password.trim()}
              style={{ width: '100%' }}
            >
              {loading
                ? 'Please wait…'
                : tab === TAB.SIGN_IN ? 'Sign In' : 'Create Account'}
            </button>

            {/* Swap hint */}
            <p style={{
              textAlign: 'center', marginTop: '1rem',
              fontSize: 'var(--text-xs)', color: 'var(--color-text-disabled)',
            }}>
              {tab === TAB.SIGN_IN
                ? <>New here? <button type="button" onClick={() => setTab(TAB.REGISTER)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--color-accent)', fontFamily: 'var(--font-sans)', fontSize: 'var(--text-xs)', padding: 0 }}>Create an account</button></>
                : <>Already have an account? <button type="button" onClick={() => setTab(TAB.SIGN_IN)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--color-accent)', fontFamily: 'var(--font-sans)', fontSize: 'var(--text-xs)', padding: 0 }}>Sign in</button></>
              }
            </p>
          </form>
        </div>

        <p style={{
          textAlign: 'center', marginTop: '1.5rem',
          fontSize: 'var(--text-xs)', color: 'var(--color-text-disabled)',
        }}>
          Your login is used only to save study progress and track your 48-hour session window.
        </p>
      </div>
    </div>
  );
}

export default LoginPage;
