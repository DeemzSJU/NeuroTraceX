/**
 * NeuroTraceX — Landing Page
 * Welcome screen with study overview and "Begin" CTA.
 */

import React from 'react';
import { useNavigate } from 'react-router-dom';
import { STEPS } from '../constants/experimentFlow';
import { useAuth } from '../context/AuthContext';

function LandingPage() {
  const navigate = useNavigate();
  const { user, isAuthenticated, signOut } = useAuth();

  React.useEffect(() => {
    if (isAuthenticated) {
      navigate(STEPS.CONSENT.path);
    }
  }, [isAuthenticated, navigate]);

  const handleBegin = () => {
    if (isAuthenticated) {
      navigate(STEPS.CONSENT.path);
    } else {
      navigate('/login');
    }
  };

  return (
    <div className="page" style={{ justifyContent: 'center', minHeight: '100vh', paddingTop: '0' }}>

      {/* Auth pill */}
      {isAuthenticated && user && (
        <div style={{
          position: 'fixed', top: '1rem', right: '1.5rem',
          display: 'flex', alignItems: 'center', gap: '0.625rem',
          background: 'var(--color-bg-surface)', border: '1px solid var(--color-border)',
          borderRadius: 'var(--radius-full)', padding: '0.375rem 0.875rem',
          zIndex: 50,
        }}>
          <span style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-tertiary)' }}>{user.email}</span>
          <button
            onClick={signOut}
            style={{
              background: 'none', border: 'none', color: 'var(--color-text-disabled)',
              cursor: 'pointer', fontSize: 'var(--text-xs)', textDecoration: 'underline',
              padding: 0, fontFamily: 'var(--font-sans)',
            }}
          >
            Sign out
          </button>
        </div>
      )}

      <div style={{ textAlign: 'center', maxWidth: '520px', margin: '0 auto' }}>
        {/* Wordmark */}
        <div style={{ marginBottom: '0.75rem' }}>
          <span style={{
            fontSize: 'var(--text-xs)', fontWeight: 600, letterSpacing: '0.12em',
            color: 'var(--color-accent)', textTransform: 'uppercase',
          }}>
            Research Study
          </span>
        </div>
        <h1 style={{ fontSize: '2.75rem', fontWeight: 600, letterSpacing: '-0.03em', marginBottom: '0.75rem' }}>
          NeuroTraceX
        </h1>
        <p style={{
          fontSize: 'var(--text-lg)', color: 'var(--color-text-tertiary)',
          fontWeight: 400, marginBottom: '2.5rem', letterSpacing: '-0.01em',
        }}>
          The Architecture of Subjective Reality
        </p>
        <p style={{
          fontSize: 'var(--text-base)', color: 'var(--color-text-secondary)',
          lineHeight: 1.75, marginBottom: '3rem', maxWidth: '440px', margin: '0 auto 3rem',
        }}>
          A research study exploring how your unique cognitive style shapes
          the way you remember and interpret shared experiences.
        </p>

        {/* What to expect — clean list */}
        <div style={{
          textAlign: 'left', maxWidth: '400px', margin: '0 auto 3rem',
          display: 'flex', flexDirection: 'column', gap: '1rem',
        }}>
          {[
            { label: 'Session 1', time: '~15 min', desc: 'A brief questionnaire, a video experience, and memory questions.' },
            { label: 'Session 2', time: '~10 min', desc: 'A follow-up 48 hours later via a link sent to your email.' },
            { label: 'Your Results', time: '', desc: 'A personalised analysis of your cognitive style and memory patterns.' },
          ].map((item, i) => (
            <div key={i} style={{
              display: 'flex', gap: '1rem', alignItems: 'flex-start',
              paddingLeft: '1rem', borderLeft: '2px solid var(--color-border)',
            }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.2rem' }}>
                  <span style={{ fontSize: 'var(--text-sm)', fontWeight: 600, color: 'var(--color-text-primary)' }}>
                    {item.label}
                  </span>
                  {item.time && (
                    <span style={{
                      fontSize: 'var(--text-xs)', color: 'var(--color-text-disabled)',
                      fontWeight: 500,
                    }}>
                      {item.time}
                    </span>
                  )}
                </div>
                <p style={{ fontSize: 'var(--text-sm)', color: 'var(--color-text-tertiary)', lineHeight: 1.55, margin: 0 }}>
                  {item.desc}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* CTA */}
        <button
          className="btn btn--primary btn--large"
          onClick={handleBegin}
          style={{ minWidth: '260px' }}
        >
          {isAuthenticated ? 'Begin the Study' : 'Sign In to Begin'}
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" style={{ marginLeft: '0.25rem' }}>
            <path d="M6 3l5 5-5 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>

        <p style={{
          fontSize: 'var(--text-xs)', color: 'var(--color-text-disabled)',
          marginTop: '1.5rem',
        }}>
          You must be 18 or older to participate. Participation is voluntary.
        </p>
      </div>
    </div>
  );
}

export default LandingPage;
