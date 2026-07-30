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
        <Loader text="Analyzing your cognitive style & memory divergence..." size="lg" />
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

      <div className="page__content">
        {/* Cognitive Style Summary Cards */}
        <h3 className="mb-4" style={{ fontSize: 'var(--text-lg)' }}>Cognitive Style (REI-20)</h3>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem', marginBottom: '1.5rem' }}>
          <ScoreCard
            title="Experiential (Intuitive)"
            value={scores.rei_experiential}
            subtitle="Scale 1.0 to 5.0"
            color="var(--color-primary-400)"
          />
          <ScoreCard
            title="Rational (Analytical)"
            value={scores.rei_rational}
            subtitle="Scale 1.0 to 5.0"
            color="var(--color-accent-400)"
          />
          <ScoreCard
            title="Cognitive Reflection (CRT)"
            value={scores.crt_score !== null && scores.crt_score !== undefined ? `${scores.crt_score} / 3` : '—'}
            subtitle="Analytical Suppression"
            color="var(--color-text-success)"
          />
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

        {/* Participant count context */}
        <div className="card text-center" style={{ background: 'var(--color-bg-tertiary)', padding: '1rem' }}>
          <p className="text-sm" style={{ color: 'var(--color-text-tertiary)' }}>
            Based on data from {results?.total_participants ?? 0} study participants.
          </p>
        </div>
      </div>
    </div>
  );
}

export default ResultsPage;
