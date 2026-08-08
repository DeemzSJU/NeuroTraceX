/**
 * NeuroTraceX — REI-20 Questionnaire Page (Step 2a)
 * Displays all 20 REI items on a single scrollable page.
 * All items must be answered before proceeding.
 */

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSessionContext } from '../context/SessionContext';
import { STEPS } from '../constants/experimentFlow';
import responseService from '../services/responseService';

import QuestionCard from '../components/questionnaire/QuestionCard';
import { REI_QUESTIONS } from '../constants/reiQuestions';

function REIPage() {
  const navigate = useNavigate();
  const { sessionId, setREIScores, setStep, setLoading, isLoading } = useSessionContext();

  const [answers, setAnswers] = useState(new Array(REI_QUESTIONS.length).fill(0));
  const [error, setError] = useState(null);

  const allAnswered = answers.every((a) => a >= 1 && a <= 5);
  const answeredCount = answers.filter((a) => a >= 1).length;

  const handleAnswer = (index, value) => {
    const updated = [...answers];
    updated[index] = value;
    setAnswers(updated);
  };

  const handleSubmit = async () => {
    if (!allAnswered || isLoading) return;

    setLoading(true);
    setError(null);

    try {
      const response = await responseService.submitREI(sessionId, answers);
      setLoading(false);

      setREIScores({
        experiential: response.experiential_score,
        rational: response.rational_score,
      });

      setStep(STEPS.CRT.id);
      navigate(STEPS.CRT.path);
    } catch (err) {
      console.error("[REIPage] handleSubmit error:", err);
      setError(err.message);
      setLoading(false);
    }
  };

  return (
    <div className="page animate-fade-in">
      <div className="page__header">
        <h1>Cognitive Style Assessment</h1>
        <p>
          Rate how well each statement describes you on a scale of 1 to 5.
        </p>
      </div>

      <div className="page__content">
        {/* Progress pill */}
        <div style={{
          display: 'inline-flex', alignItems: 'center', gap: '0.5rem',
          background: allAnswered ? 'var(--color-success-subtle)' : 'var(--color-bg-elevated)',
          border: '1px solid var(--color-border)',
          borderRadius: 'var(--radius-full)',
          padding: '0.375rem 0.875rem',
          marginBottom: '1.5rem',
          transition: 'all 200ms ease',
        }}>
          <span style={{
            fontSize: 'var(--text-xs)', fontWeight: 500,
            color: allAnswered ? 'var(--color-success)' : 'var(--color-text-secondary)',
          }}>
            {answeredCount} / {REI_QUESTIONS.length} answered
          </span>
        </div>

        {/* Questions */}
        <div className="card--glass" style={{
          padding: '0.5rem 1.5rem',
          borderRadius: 'var(--radius-xl)',
          marginBottom: '1.5rem',
        }}>
          {REI_QUESTIONS.map((item, idx) => (
            <QuestionCard
              key={item.id}
              number={idx + 1}
              text={item.text}
              type="likert"
              value={answers[idx]}
              onChange={(val) => handleAnswer(idx, val)}
              isLast={idx === REI_QUESTIONS.length - 1}
            />
          ))}
        </div>

        {error && (
          <p style={{ color: 'var(--color-error)', fontSize: 'var(--text-xs)', marginTop: '1rem', textAlign: 'center' }}>{error}</p>
        )}

        <button
          className={`btn btn--gold-shimmer btn--large ${isLoading ? 'btn--loading' : ''}`}
          onClick={handleSubmit}
          disabled={!allAnswered}
          style={{ width: '100%', marginTop: '2rem' }}
        >
          {allAnswered ? 'Continue' : `${REI_QUESTIONS.length - answeredCount} remaining`}
        </button>
      </div>
    </div>
  );
}

export default REIPage;
