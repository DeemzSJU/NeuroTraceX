/**
 * NeuroTraceX — Session 2 Entry Page
 * Accessed via unique emailed link 48 hours after Session 1.
 * Validates session ID and redirects to delayed recall questions.
 */

import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useSessionContext } from '../context/SessionContext';
import { STEPS } from '../constants/experimentFlow';
import participantService from '../services/participantService';

function Session2Page() {
  const { sessionId } = useParams();
  const navigate = useNavigate();
  const { setSession, setStep } = useSessionContext();

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [participant, setParticipant] = useState(null);

  useEffect(() => {
    async function validateSession() {
      try {
        const data = await participantService.getParticipant(sessionId);
        setParticipant(data);
        setSession(sessionId);
        setStep(STEPS.SESSION2.id);
      } catch (err) {
        setError('Invalid or expired session link. Please check your email for the correct link.');
      } finally {
        setLoading(false);
      }
    }
    validateSession();
  }, [sessionId, setSession, setStep]);

  const handleBegin = () => {
    // Pass sessionNumber=2 via router state so StructuredQuestionsPage knows
    navigate(STEPS.STRUCTURED.path, { state: { sessionNumber: 2, sessionId } });
  };

  if (loading) {
    return (
      <div className="page" style={{ justifyContent: 'center', minHeight: '60vh' }}>
        <p style={{ color: 'var(--color-text-tertiary)', fontSize: 'var(--text-sm)' }}>Validating your session...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="page">
        <div className="page__header">
          <h1>Session Not Found</h1>
        </div>
        <div className="page__content">
          <div className="card" style={{ textAlign: 'center' }}>
            <p style={{ color: 'var(--color-error)', fontSize: 'var(--text-sm)' }}>{error}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="page animate-fade-in" style={{ justifyContent: 'center', minHeight: '70vh' }}>
      <div style={{ maxWidth: '480px', width: '100%', margin: '0 auto', textAlign: 'center' }}>
        <h1 style={{ fontSize: 'var(--text-2xl)', marginBottom: '0.5rem' }}>
          Welcome back{participant?.first_name ? `, ${participant.first_name}` : ''}
        </h1>
        <p style={{
          color: 'var(--color-text-tertiary)', fontSize: 'var(--text-sm)',
          marginBottom: '2rem',
        }}>
          Session 2 — Delayed Recall
        </p>

        <div style={{
          textAlign: 'left', borderLeft: '2px solid var(--color-border)',
          paddingLeft: '1.25rem', marginBottom: '2.5rem',
        }}>
          <p style={{
            fontSize: 'var(--text-sm)', color: 'var(--color-text-secondary)',
            lineHeight: 1.7, margin: 0,
          }}>
            You will answer the same 20 questions about the video recording
            you watched 48 hours ago — this time entirely from memory.
            This should take about 10 minutes.
          </p>
        </div>

        <button
          className="btn btn--primary btn--large"
          onClick={handleBegin}
          style={{ minWidth: '200px' }}
        >
          Begin Session 2
        </button>
      </div>
    </div>
  );
}

export default Session2Page;
