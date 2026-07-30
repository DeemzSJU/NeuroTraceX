/**
 * NeuroTraceX — Thank You Page (Step 6)
 * Post-Session 1 debrief and Session 2 reminder notification.
 */

import React from 'react';

function ThankYouPage() {
  return (
    <div className="page animate-fade-in">
      <div className="page__header" style={{ marginTop: '2rem' }}>
        <h1>Session 1 Complete!</h1>
        <p>Thank you for your participation so far.</p>
      </div>

      <div className="page__content">
        <div className="card mb-6">
          <h3 style={{ marginBottom: '1rem', color: 'var(--color-text-success)' }}>
            ✓ Your responses have been recorded
          </h3>
          <div style={{ color: 'var(--color-text-secondary)', lineHeight: '1.8' }}>
            <p style={{ marginBottom: '1rem' }}>
              This study explores how different people remember and interpret shared
              experiences differently. Your responses will help us understand the
              relationship between cognitive style and memory reconstruction.
            </p>
            <p style={{ marginBottom: '1rem' }}>
              <strong style={{ color: 'var(--color-text-primary)' }}>What happens next:</strong>
            </p>
            <p style={{ marginBottom: '0.75rem' }}>
              📧 You will receive an email in <strong style={{ color: 'var(--color-text-accent)' }}>48 hours</strong> with
              a unique link to complete Session 2 (~10 minutes).
            </p>
            <p style={{ marginBottom: '0.75rem' }}>
              🔒 Please <strong style={{ color: 'var(--color-text-warning)' }}>do not discuss</strong> the video
              recording or this study with anyone until you receive your final results.
            </p>
            <p>
              📊 After completing Session 2, you will receive a personalised
              analysis of your cognitive style and memory patterns.
            </p>
          </div>
        </div>

        <div className="card text-center" style={{ background: 'var(--color-bg-tertiary)' }}>
          <p className="text-sm" style={{ color: 'var(--color-text-tertiary)' }}>
            You can safely close this tab now. See you in 48 hours!
          </p>
        </div>
      </div>
    </div>
  );
}

export default ThankYouPage;
