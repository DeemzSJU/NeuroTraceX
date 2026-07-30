/**
 * NeuroTraceX — Structured Questions Page (Step 5)
 * 20 questions presented one at a time.
 * Used for both Session 1 (immediate) and Session 2 (delayed) recall.
 */

import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSessionContext } from '../context/SessionContext';
import { STEPS } from '../constants/experimentFlow';
import { STRUCTURED_QUESTIONS } from '../constants/structuredQuestions';
import responseService from '../services/responseService';
import scoreService from '../services/scoreService';

function StructuredQuestionsPage() {
  const navigate = useNavigate();
  const { sessionId, setStep, currentStep } = useSessionContext();

  const [currentQ, setCurrentQ] = useState(0);
  const [answer, setAnswer] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const questionStartRef = useRef(Date.now());

  // Determine session number from context
  const sessionNumber = currentStep === STEPS.SESSION2.id ? 2 : 1;
  const totalQuestions = STRUCTURED_QUESTIONS.length;
  const question = STRUCTURED_QUESTIONS[currentQ];

  const handleNext = async () => {
    if (!answer.trim() || submitting) return;
    setSubmitting(true);

    const responseTimeMs = Date.now() - questionStartRef.current;

    try {
      await responseService.submitStructuredAnswer(
        sessionId,
        question.id,
        question.category,
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
          // Trigger computation before results page navigation
          try {
            await scoreService.computeScores(sessionId);
          } catch (e) {
            console.error('Computation error:', e);
          }
          navigate(`/results/${sessionId}`);
        }
      }
    } catch (err) {
      console.error('Failed to submit answer:', err);
    } finally {
      setSubmitting(false);
    }
  };

  const getCategoryColor = (cat) => {
    if (cat === 'factual') return 'var(--color-primary-400)';
    if (cat === 'interpretive') return 'var(--color-accent-400)';
    return 'var(--color-text-warning)';
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
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
            <span style={{ color: 'var(--color-text-tertiary)', fontSize: 'var(--text-sm)', fontWeight: 600 }}>
              Question {currentQ + 1}
            </span>
            <span
              style={{
                fontSize: '0.75rem',
                textTransform: 'uppercase',
                fontWeight: 700,
                letterSpacing: '0.05em',
                padding: '0.2rem 0.6rem',
                borderRadius: 'var(--radius-full)',
                background: 'rgba(255, 255, 255, 0.05)',
                color: getCategoryColor(question.category),
                border: `1px solid ${getCategoryColor(question.category)}`,
              }}
            >
              {question.category}
            </span>
          </div>
          <p style={{ fontSize: 'var(--text-lg)', color: 'var(--color-text-primary)', fontWeight: 500 }}>
            {question.text}
          </p>
        </div>

        <textarea
          value={answer}
          onChange={(e) => setAnswer(e.target.value)}
          placeholder="Type your answer here..."
          style={{ minHeight: '150px', marginBottom: '1.5rem' }}
          autoFocus
          key={currentQ}
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
