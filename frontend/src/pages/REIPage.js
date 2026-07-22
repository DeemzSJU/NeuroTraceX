/**
 * NeuroTraceX — REI-40 Questionnaire Page (Step 2a)
 * Displays all 40 REI items on a single scrollable page.
 * All items must be answered before proceeding.
 * Questionnaire content will be provided by the researcher.
 */

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSessionContext } from '../context/SessionContext';
import { STEPS } from '../constants/experimentFlow';
import responseService from '../services/responseService';

function REIPage() {
  const navigate = useNavigate();
  const { sessionId, setREIScores, setStep, setLoading, isLoading } = useSessionContext();

  // Placeholder: 40 empty answers (will use real questions from reiQuestions.js)
  const [answers, setAnswers] = useState(new Array(40).fill(0));
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
      setREIScores({
        experiential: response.experiential_score,
        rational: response.rational_score,
      });
      setStep(STEPS.CRT.id);
      navigate(STEPS.CRT.path);
    } catch (err) {
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
          <br />
          <span className="text-accent">{answeredCount}/40</span> answered
        </p>
      </div>

      <div className="page__content">
        <div className="card mb-6">
          <p className="text-sm" style={{ color: 'var(--color-text-tertiary)' }}>
            1 = Definitely not true of myself &nbsp;→&nbsp; 5 = Definitely true of myself
          </p>
        </div>

        <p className="text-sm mb-6" style={{ color: 'var(--color-text-tertiary)', textAlign: 'center' }}>
          Questionnaire items will be loaded here once provided.
        </p>

        {error && (
          <p className="text-error text-sm mb-4 text-center">{error}</p>
        )}

        <button
          className={`btn btn--primary btn--large ${isLoading ? 'btn--loading' : ''}`}
          onClick={handleSubmit}
          disabled={!allAnswered}
          style={{ width: '100%' }}
        >
          Submit REI-40 →
        </button>
      </div>
    </div>
  );
}

export default REIPage;
