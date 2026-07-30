/**
 * NeuroTraceX — Consent Page (Step 1)
 * Informed consent form with checkbox confirmation,
 * first name and email collection.
 */

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSessionContext } from '../context/SessionContext';
import { STEPS } from '../constants/experimentFlow';
import participantService from '../services/participantService';

function ConsentPage() {
  const navigate = useNavigate();
  const { setSession, setStep, setLoading, isLoading } = useSessionContext();

  const [firstName, setFirstName] = useState('');
  const [email, setEmail] = useState('');
  const [agreed, setAgreed] = useState(false);
  const [error, setError] = useState(null);

  const canSubmit = firstName.trim() && email.trim() && agreed && !isLoading;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!canSubmit) return;

    setLoading(true);
    setError(null);

    try {
      const response = await participantService.submitConsent(firstName.trim(), email.trim());
      setSession(response.session_id);
      setStep(STEPS.REI.id);
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
        <div className="card" style={{ marginBottom: '2rem' }}>
          <h3 style={{ marginBottom: '1rem' }}>Study Information</h3>
          <div style={{ color: 'var(--color-text-secondary)', fontSize: 'var(--text-sm)', lineHeight: '1.8' }}>
            <p style={{ marginBottom: '0.75rem' }}>
              This study investigates how different people remember and interpret shared experiences.
              Your participation involves two sessions over 48 hours.
            </p>
            <p style={{ marginBottom: '0.75rem' }}>
              • All data is collected anonymously — no identifying information is stored with your responses.<br />
              • Your email is used solely to send your Session 2 link and is stored separately from your data.<br />
              • You may withdraw at any point without consequence.<br />
              • The study involves watching a short video recording and answering questions about it.<br />
              • There is no risk of psychological harm.
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: '1.5rem' }}>
            <label htmlFor="firstName">First Name</label>
            <input
              id="firstName"
              type="text"
              placeholder="Your first name"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              required
            />
          </div>

          <div style={{ marginBottom: '1.5rem' }}>
            <label htmlFor="email">Email Address</label>
            <input
              id="email"
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <p className="text-sm mt-2" style={{ color: 'var(--color-text-tertiary)' }}>
              Used only to send your Session 2 link in 48 hours.
            </p>
          </div>

          <div style={{ marginBottom: '2rem' }}>
            <label style={{ display: 'flex', alignItems: 'flex-start', gap: '0.75rem', cursor: 'pointer' }}>
              <input
                type="checkbox"
                checked={agreed}
                onChange={(e) => setAgreed(e.target.checked)}
                style={{ width: 'auto', marginTop: '3px' }}
              />
              <span style={{ color: 'var(--color-text-secondary)' }}>
                I have read and understood the study information above. I confirm that I am
                18 years or older and consent to participate voluntarily.
              </span>
            </label>
          </div>

          {error && (
            <p className="text-error text-sm mb-4">{error}</p>
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
