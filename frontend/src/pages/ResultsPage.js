/**
 * NeuroTraceX — Results Page
 * Displays personalised results: scores, divergence chart, AI interpretation.
 */

import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import scoreService from '../services/scoreService';

function ResultsPage() {
  const { sessionId } = useParams();
  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchResults() {
      try {
        const data = await scoreService.getResults(sessionId);
        setResults(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
    fetchResults();
  }, [sessionId]);

  if (loading) {
    return (
      <div className="page">
        <div className="text-center mt-8">
          <p style={{ color: 'var(--color-text-secondary)' }}>Loading your results...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="page">
        <div className="page__header">
          <h1>Results</h1>
        </div>
        <div className="page__content">
          <div className="card text-center">
            <p className="text-error">{error}</p>
            <p className="text-sm mt-4" style={{ color: 'var(--color-text-tertiary)' }}>
              Results may not be available yet. Please check back after completing Session 2.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="page animate-fade-in">
      <div className="page__header">
        <h1>Your Results</h1>
        <p>
          {results?.first_name ? `${results.first_name}, here` : 'Here'}'s what
          your cognitive style reveals about how you construct reality.
        </p>
      </div>

      <div className="page__content">
        {/* Cognitive Style Scores */}
        <div className="card mb-6">
          <h3 style={{ marginBottom: '1rem' }}>Cognitive Style</h3>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div>
              <p className="text-sm" style={{ color: 'var(--color-text-tertiary)' }}>Experiential</p>
              <p style={{ fontSize: 'var(--text-2xl)', fontWeight: 700, color: 'var(--color-primary-400)' }}>
                {results?.scores?.rei_experiential?.toFixed(2) ?? '—'}
              </p>
            </div>
            <div>
              <p className="text-sm" style={{ color: 'var(--color-text-tertiary)' }}>Rational</p>
              <p style={{ fontSize: 'var(--text-2xl)', fontWeight: 700, color: 'var(--color-accent-400)' }}>
                {results?.scores?.rei_rational?.toFixed(2) ?? '—'}
              </p>
            </div>
          </div>
        </div>

        {/* Divergence Scores */}
        <div className="card mb-6">
          <h3 style={{ marginBottom: '1rem' }}>Memory Divergence</h3>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1rem' }}>
            <div>
              <p className="text-sm" style={{ color: 'var(--color-text-tertiary)' }}>Factual</p>
              <p style={{ fontSize: 'var(--text-xl)', fontWeight: 600 }}>
                {results?.scores?.factual_divergence?.toFixed(3) ?? '—'}
              </p>
            </div>
            <div>
              <p className="text-sm" style={{ color: 'var(--color-text-tertiary)' }}>Interpretive</p>
              <p style={{ fontSize: 'var(--text-xl)', fontWeight: 600 }}>
                {results?.scores?.interpretive_divergence?.toFixed(3) ?? '—'}
              </p>
            </div>
            <div>
              <p className="text-sm" style={{ color: 'var(--color-text-tertiary)' }}>Emotional</p>
              <p style={{ fontSize: 'var(--text-xl)', fontWeight: 600 }}>
                {results?.scores?.emotional_divergence?.toFixed(3) ?? '—'}
              </p>
            </div>
          </div>
        </div>

        {/* AI Interpretation */}
        {results?.scores?.ai_interpretation_text && (
          <div className="card mb-6">
            <h3 style={{ marginBottom: '1rem' }}>Your Personalised Interpretation</h3>
            <div style={{ color: 'var(--color-text-secondary)', lineHeight: '1.8', whiteSpace: 'pre-wrap' }}>
              {results.scores.ai_interpretation_text}
            </div>
          </div>
        )}

        {/* Participant count context */}
        <div className="card text-center" style={{ background: 'var(--color-bg-tertiary)' }}>
          <p className="text-sm" style={{ color: 'var(--color-text-tertiary)' }}>
            Based on data from {results?.total_participants ?? 0} participants.
          </p>
        </div>
      </div>
    </div>
  );
}

export default ResultsPage;
