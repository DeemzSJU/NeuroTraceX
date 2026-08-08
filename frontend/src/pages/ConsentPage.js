/**
 * NeuroTraceX — Consent Page (Step 1)
 * Informed consent form — collects first name only.
 * Email removed; user is identified by their login account.
 */

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSessionContext } from '../context/SessionContext';
import { STEPS } from '../constants/experimentFlow';
import participantService from '../services/participantService';
import { useAuth } from '../context/AuthContext';
import Loader from '../components/common/Loader';

function ConsentPage() {
  const navigate = useNavigate();
  const { setSession, setStep, setLoading, isLoading } = useSessionContext();
  const { user, isAuthenticated, loading: authLoading } = useAuth();

  const [firstName, setFirstName] = useState('');
  const [agreed, setAgreed]       = useState(false);
  const [error, setError]         = useState(null);

  // Guard: must be logged in
  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      navigate('/login');
    }
  }, [isAuthenticated, authLoading, navigate]);

  // Pre-fill first name from user account if available
  useEffect(() => {
    if (user?.name && !firstName) {
      setFirstName(user.name.split(' ')[0]);
    }
  }, [user, firstName]);

  if (authLoading) {
    return (
      <div className="page" style={{ justifyContent: 'center', minHeight: '60vh' }}>
        <Loader text="Loading your profile…" />
      </div>
    );
  }

  const canSubmit = firstName.trim() && agreed && !isLoading;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!canSubmit) return;

    setLoading(true);
    setError(null);

    try {
      const response = await participantService.submitConsent(
        firstName.trim(),
        null,       // email no longer required on consent form
        user?.id,   // link participant to login account
      );
      setSession(response.session_id);
      setStep(STEPS.REI.id);
      setLoading(false);
      navigate(STEPS.REI.path);
    } catch (err) {
      setError(err.message);
      setLoading(false);
    }
  };

  return (
    <div className="page animate-fade-in">
      <div className="page__header">
        <h1>Informed Consent</h1>
        <p>Please read the following and provide your consent to participate.</p>
      </div>

      <div className="page__content">
        {/* Study Information */}
        <div style={{
          marginBottom: '2rem', padding: '0 0.25rem',
          borderLeft: '2px solid var(--color-border)',
          paddingLeft: '1.25rem',
        }}>
          <p style={{ color: 'var(--color-text-secondary)', fontSize: 'var(--text-sm)', lineHeight: 1.8, marginBottom: '0.75rem' }}>
            This study investigates how different people remember and interpret shared experiences.
            Your participation involves two sessions over 48 hours.
          </p>
          <ul style={{
            listStyle: 'none', padding: 0, margin: 0,
            display: 'flex', flexDirection: 'column', gap: '0.4rem',
          }}>
            {[
              'All data is collected anonymously — no identifying information is stored with your responses.',
              'Your login account is used solely to save your progress and send your Session 2 reminder.',
              'You may withdraw at any point without consequence.',
              'The study involves watching a short video recording and answering questions about it.',
              'There is no risk of psychological harm.',
            ].map((text, i) => (
              <li key={i} style={{
                fontSize: 'var(--text-sm)', color: 'var(--color-text-tertiary)',
                lineHeight: 1.65, display: 'flex', gap: '0.5rem',
              }}>
                <span style={{ color: 'var(--color-text-disabled)', flexShrink: 0 }}>—</span>
                {text}
              </li>
            ))}
          </ul>
        </div>

        {/* Divider */}
        <div style={{ height: '1px', background: 'var(--color-border)', margin: '1.5rem 0 2rem' }} />

        {/* Form */}
        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: '1.5rem' }}>
            <label htmlFor="firstName">First name</label>
            <input
              id="firstName"
              type="text"
              placeholder="Jane"
              value={firstName}
              onChange={e => setFirstName(e.target.value)}
              required
            />
          </div>

          {/* Consent checkbox */}
          <label
            htmlFor="consent-check"
            style={{
              display: 'flex', alignItems: 'flex-start', gap: '0.75rem',
              cursor: 'pointer', marginBottom: '2rem',
              textTransform: 'none', fontSize: 'var(--text-sm)',
              color: 'var(--color-text-secondary)', lineHeight: 1.6,
              fontWeight: 400,
            }}
          >
            <input
              id="consent-check"
              type="checkbox"
              checked={agreed}
              onChange={e => setAgreed(e.target.checked)}
              style={{
                width: '18px', height: '18px', flexShrink: 0,
                marginTop: '2px', accentColor: 'var(--color-accent)',
                cursor: 'pointer',
              }}
            />
            <span>
              I have read and understood the study information above. I confirm that I am
              18 years or older and consent to participate voluntarily.
            </span>
          </label>

          {error && (
            <p style={{ color: 'var(--color-error)', fontSize: 'var(--text-xs)', marginBottom: '1rem' }}>{error}</p>
          )}

          <button
            type="submit"
            className={`btn btn--primary btn--large ${isLoading ? 'btn--loading' : ''}`}
            disabled={!canSubmit}
            style={{ width: '100%' }}
          >
            I Consent — Continue
          </button>
        </form>
      </div>
    </div>
  );
}

export default ConsentPage;
