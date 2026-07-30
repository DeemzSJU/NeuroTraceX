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
    navigate(STEPS.STRUCTURED.path);
  };

  if (loading) {
    return (
      <div className="page">
        <div className="text-center mt-8">
          <p className="text-secondary">Validating your session...</p>
        </div>
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
          <div className="card text-center">
            <p className="text-error">{error}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="page animate-fade-in">
      <div className="page__header">
        <h1>Welcome Back{participant?.first_name ? `, ${participant.first_name}` : ''}!</h1>
        <p>Session 2 — Delayed Recall</p>
      </div>

      <div className="page__content">
        <div className="card mb-6">
          <h3 style={{ marginBottom: '1rem' }}>What to expect</h3>
          <p style={{ color: 'var(--color-text-secondary)' }}>
            You will answer the same 20 questions about the video recording
            you watched 48 hours ago — this time entirely from memory.
            This should take about 10 minutes.
          </p>
        </div>

        <button
          className="btn btn--primary btn--large"
          onClick={handleBegin}
          style={{ width: '100%' }}
        >
          Begin Session 2 →
        </button>
      </div>
    </div>
  );
}

export default Session2Page;
