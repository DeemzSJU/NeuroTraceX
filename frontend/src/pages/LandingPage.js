/**
 * NeuroTraceX — Landing Page
 * Welcome screen with study overview and "Begin" CTA.
 */

import React from 'react';
import { useNavigate } from 'react-router-dom';
import { STEPS } from '../constants/experimentFlow';

function LandingPage() {
  const navigate = useNavigate();

  return (
    <div className="page">
      <div className="page__header" style={{ marginTop: '4rem' }}>
        <h1>NeuroTraceX</h1>
        <p style={{ fontSize: '1.25rem', marginBottom: '1rem' }}>
          The Architecture of Subjective Reality
        </p>
        <p>
          A research study exploring how your unique cognitive style shapes
          the way you remember and interpret shared experiences.
        </p>
      </div>

      <div className="page__content" style={{ textAlign: 'center' }}>
        <div className="card" style={{ marginBottom: '2rem' }}>
          <h3 style={{ marginBottom: '1rem' }}>What to Expect</h3>
          <div style={{ textAlign: 'left', color: 'var(--color-text-secondary)' }}>
            <p style={{ marginBottom: '0.75rem' }}>
              <strong style={{ color: 'var(--color-text-primary)' }}>Session 1</strong> (~22 minutes):
              A brief questionnaire, a video experience, and memory questions.
            </p>
            <p style={{ marginBottom: '0.75rem' }}>
              <strong style={{ color: 'var(--color-text-primary)' }}>Session 2</strong> (~10 minutes):
              A follow-up 48 hours later via a link sent to your email.
            </p>
            <p>
              <strong style={{ color: 'var(--color-text-primary)' }}>Your Results</strong>:
              A personalised analysis of your cognitive style and memory patterns.
            </p>
          </div>
        </div>

        <button
          className="btn btn--primary btn--large"
          onClick={() => navigate(STEPS.CONSENT.path)}
        >
          Begin the Study →
        </button>

        <p className="text-sm mt-4" style={{ color: 'var(--color-text-tertiary)' }}>
          You must be 18 or older to participate. Participation is voluntary.
        </p>
      </div>
    </div>
  );
}

export default LandingPage;
