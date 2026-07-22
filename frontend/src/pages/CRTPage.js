/**
 * NeuroTraceX — CRT Page (Step 2b)
 * Cognitive Reflection Test — 3 items.
 * Content will be provided by the researcher.
 */

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSessionContext } from '../context/SessionContext';
import { STEPS } from '../constants/experimentFlow';
import responseService from '../services/responseService';

function CRTPage() {
  const navigate = useNavigate();
  const { sessionId, setCRTScore, setStep, setLoading, isLoading } = useSessionContext();

  const [answers, setAnswers] = useState(['', '', '']);
  const [error, setError] = useState(null);

  const allAnswered = answers.every((a) => a.trim().length > 0);

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
      const response = await responseService.submitCRT(sessionId, answers);
      setCRTScore(response.crt_score);
      setStep(STEPS.STIMULUS.id);
      navigate(STEPS.STIMULUS.path);
    } catch (err) {
      setError(err.message);
      setLoading(false);
    }
  };

  return (
    <div className="page animate-fade-in">
      <div className="page__header">
        <h1>Quick Thinking Questions</h1>
        <p>Answer each question with a number. Take your time.</p>
      </div>

      <div className="page__content">
        <p className="text-sm mb-6" style={{ color: 'var(--color-text-tertiary)', textAlign: 'center' }}>
          CRT items will be loaded here once provided.
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
          Continue →
        </button>
      </div>
    </div>
  );
}

export default CRTPage;
