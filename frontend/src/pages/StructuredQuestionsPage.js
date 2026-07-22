/**
 * NeuroTraceX — Structured Questions Page (Step 5)
 * 20 questions presented one at a time.
 * Used for both Session 1 (immediate) and Session 2 (delayed) recall.
 */

import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSessionContext } from '../context/SessionContext';
import { STEPS } from '../constants/experimentFlow';
import responseService from '../services/responseService';

function StructuredQuestionsPage() {
  const navigate = useNavigate();
  const { sessionId, setStep, currentStep } = useSessionContext();

  const [currentQ, setCurrentQ] = useState(0);
  const [answer, setAnswer] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const questionStartRef = useRef(Date.now());

  // Determine session number from context
  const sessionNumber = currentStep === STEPS.SESSION2.id ? 2 : 1;

  // Placeholder — will be populated from structuredQuestions.js
  const totalQuestions = 20;

  const handleNext = async () => {
    if (!answer.trim() || submitting) return;
    setSubmitting(true);

    const responseTimeMs = Date.now() - questionStartRef.current;

    try {
      await responseService.submitStructuredAnswer(
        sessionId,
        `q_${currentQ + 1}`,
        'interpretive', // placeholder — will use real question types
        answer.trim(),
        responseTimeMs,
        sessionNumber
      );

      if (currentQ + 1 < totalQuestions) {
        setCurrentQ(currentQ + 1);
        setAnswer('');
        questionStartRef.current = Date.now();
      } else {
        // All questions done
        if (sessionNumber === 1) {
          setStep(STEPS.THANK_YOU.id);
          navigate(STEPS.THANK_YOU.path);
        } else {
          navigate(`/results/${sessionId}`);
        }
      }
    } catch (err) {
      console.error('Failed to submit answer:', err);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="page animate-fade-in">
      <div className="page__header">
        <h1>Memory Questions</h1>
        <p>
          Question <span className="text-accent">{currentQ + 1}</span> of {totalQuestions}
        </p>
      </div>

      <div className="page__content">
        <div className="card mb-6">
          <p style={{ color: 'var(--color-text-secondary)', marginBottom: '0.5rem', fontSize: 'var(--text-sm)' }}>
            Question {currentQ + 1}
          </p>
          <p style={{ fontSize: 'var(--text-lg)', color: 'var(--color-text-primary)' }}>
            Structured question content will be loaded here once provided.
          </p>
        </div>

        <textarea
          value={answer}
          onChange={(e) => setAnswer(e.target.value)}
          placeholder="Type your answer here..."
          style={{ minHeight: '150px', marginBottom: '1.5rem' }}
          autoFocus
          key={currentQ} // Reset focus on question change
        />

        <button
          className={`btn btn--primary btn--large ${submitting ? 'btn--loading' : ''}`}
          onClick={handleNext}
          disabled={!answer.trim() || submitting}
          style={{ width: '100%' }}
        >
          {currentQ + 1 < totalQuestions ? 'Next Question →' : 'Finish →'}
        </button>
      </div>
    </div>
  );
}

export default StructuredQuestionsPage;
