/**
 * NeuroTraceX — Results Page
 * Displays personalised results: scores, divergence chart, AI interpretation.
 */

import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import scoreService from '../services/scoreService';
import Loader from '../components/common/Loader';
import ScoreCard from '../components/results/ScoreCard';
import DivergenceChart from '../components/results/DivergenceChart';
import InterpretationCard from '../components/results/InterpretationCard';

function ResultsPage() {
  const { sessionId } = useParams();
  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let cancelled = false;

    async function fetchResults(attempt = 0) {
      try {
        const data = await scoreService.getResults(sessionId);
        if (cancelled) return;

        // If scores aren't ready yet (all null), retry up to 5 times
        const scores = data?.scores || {};
        const hasData = scores.rei_experiential != null || scores.factual_divergence != null;
        if (!hasData && attempt < 5) {
          setTimeout(() => fetchResults(attempt + 1), 2000);
          return;
        }

        setResults(data);
      } catch (err) {
        if (!cancelled) setError(err.message);
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    fetchResults();
    return () => { cancelled = true; };
  }, [sessionId]);

  if (loading) {
    return (
      <div className="page" style={{ justifyContent: 'center', minHeight: '60vh' }}>
        <Loader text="Analysing your cognitive profile..." size="lg" />
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
          <div className="card" style={{ textAlign: 'center' }}>
            <p style={{ color: 'var(--color-error)', fontSize: 'var(--text-sm)' }}>{error}</p>
            <p style={{ color: 'var(--color-text-disabled)', fontSize: 'var(--text-xs)', marginTop: '0.75rem' }}>
              Results may not be available yet. Please check back after completing Session 2.
            </p>
          </div>
        </div>
      </div>
    );
  }

  const scores = results?.scores || {};

  return (
    <div className="page animate-fade-in">
      <div className="page__header">
        <h1>Your Results</h1>
        <p>
          {results?.first_name ? `${results.first_name}, here` : 'Here'}'s what
          your cognitive style reveals about how you construct reality.
        </p>
      </div>

      <div className="page__content stagger-children">
        {/* Cognitive Style Scores */}
        <div>
          <h4 style={{
            fontSize: 'var(--text-xs)', fontWeight: 500,
            color: 'var(--color-text-secondary)', textTransform: 'uppercase',
            letterSpacing: '0.06em', marginBottom: '0.75rem',
          }}>
            Cognitive Style (REI-20)
          </h4>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
            gap: '0.75rem', marginBottom: '1.5rem',
          }}>
            <ScoreCard
              title="Experiential"
              value={scores.rei_experiential}
              subtitle="Scale 1.0 to 5.0"
              color="var(--color-accent)"
            />
            <ScoreCard
              title="Rational"
              value={scores.rei_rational}
              subtitle="Scale 1.0 to 5.0"
              color="var(--color-primary)"
            />
            <ScoreCard
              title="CRT Score"
              value={scores.crt_score !== null && scores.crt_score !== undefined ? `${scores.crt_score} / 3` : '—'}
              subtitle="Analytical Suppression"
              color="var(--color-success)"
            />
          </div>
        </div>

        {/* Divergence Chart */}
        <DivergenceChart
          factual={scores.factual_divergence || 0}
          interpretive={scores.interpretive_divergence || 0}
          emotional={scores.emotional_divergence || 0}
        />

        {/* AI Interpretation */}
        {scores.ai_interpretation_text && (
          <InterpretationCard text={scores.ai_interpretation_text} />
        )}

        {/* Footer context */}
        <div style={{
          textAlign: 'center', padding: '1rem 0',
          borderTop: '1px solid var(--color-border-subtle)',
          marginTop: '0.5rem',
        }}>
          <p style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-disabled)', margin: 0 }}>
            Based on data from {results?.total_participants ?? 0} study participants.
          </p>
        </div>
      </div>
    </div>
  );
}

export default ResultsPage;
