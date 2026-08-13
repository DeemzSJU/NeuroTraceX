import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSessionContext } from '../context/SessionContext';
import { STEPS } from '../constants/experimentFlow';
import { STRUCTURED_QUESTIONS } from '../constants/structuredQuestions';
import responseService from '../services/responseService';
import scoreService from '../services/scoreService';
import participantService from '../services/participantService';
import { useAuth } from '../context/AuthContext';


function StructuredQuestionsPage() {
  const navigate = useNavigate();
  const { sessionId, setStep, currentStep, structuredQIndex } = useSessionContext();
  const { user } = useAuth();

  const [currentQ, setCurrentQ] = useState(0);
  const [answer, setAnswer] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const questionStartRef = useRef(Date.now());

  const cacheKey = user?.id ? `neurotracex_structured_answer_${user.id}_${currentQ}` : null;

  // Restore current question index from database progress
  useEffect(() => {
    if (structuredQIndex !== undefined && structuredQIndex !== null) {
      setCurrentQ(structuredQIndex);
    }
  }, [structuredQIndex]);

  // Load draft answer for the current question
  useEffect(() => {
    if (cacheKey) {
      const cached = localStorage.getItem(cacheKey);
      setAnswer(cached || '');
    } else {
      setAnswer('');
    }
    questionStartRef.current = Date.now();
  }, [currentQ, cacheKey]);

  // Persist draft answer to cache on change
  useEffect(() => {
    if (cacheKey && answer.trim().length > 0) {
      localStorage.setItem(cacheKey, answer);
    }
  }, [answer, cacheKey]);

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

      // Clear draft cache for this question
      if (cacheKey) {
        localStorage.removeItem(cacheKey);
      }

      if (currentQ + 1 < totalQuestions) {
        setCurrentQ(currentQ + 1);
      } else {
        // All questions done
        if (sessionNumber === 1) {
          try {
            await participantService.completeSession1(sessionId);
          } catch (e) {
            console.error('Failed to mark Session 1 complete:', e);
          }
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
    if (cat === 'factual') return 'var(--color-success)';
    if (cat === 'interpretive') return 'var(--color-accent)';
    return 'var(--color-warning)';
  };

  return (
    <div className="page animate-fade-in">
      <div className="page__header">
        <h1>Memory Questions</h1>
        <p>
          Question <span style={{ color: 'var(--color-text-primary)', fontWeight: 600 }}>{currentQ + 1}</span> of {totalQuestions}
        </p>
      </div>

      <div className="page__content">
        {/* Progress bar */}
        <div style={{
          width: '100%', height: '2px',
          background: 'var(--color-bg-elevated)',
          borderRadius: 'var(--radius-full)',
          marginBottom: '2rem', overflow: 'hidden',
        }}>
          <div style={{
            height: '100%',
            width: `${((currentQ + 1) / totalQuestions) * 100}%`,
            background: 'var(--color-accent)',
            transition: 'width 0.4s ease',
          }} />
        </div>

        {/* Question card */}
        <div className="card" style={{ marginBottom: '1.5rem' }}>
          <div style={{
            display: 'flex', justifyContent: 'space-between',
            alignItems: 'center', marginBottom: '0.75rem',
          }}>
            <span style={{
              fontSize: 'var(--text-xs)', color: 'var(--color-text-disabled)',
              fontFamily: 'var(--font-mono)',
            }}>
              Q{String(currentQ + 1).padStart(2, '0')}
            </span>
            <span style={{
              fontSize: 'var(--text-xs)', fontWeight: 500,
              letterSpacing: '0.04em', textTransform: 'uppercase',
              color: getCategoryColor(question.category),
            }}>
              {question.category}
            </span>
          </div>
          <p style={{
            fontSize: 'var(--text-lg)', color: 'var(--color-text-primary)',
            fontWeight: 500, lineHeight: 1.5, margin: 0,
          }}>
            {question.text}
          </p>
        </div>

        <textarea
          value={answer}
          onChange={(e) => setAnswer(e.target.value)}
          placeholder="Type your answer..."
          style={{ minHeight: '140px', marginBottom: '1.5rem', fontSize: 'var(--text-base)' }}
          autoFocus
          key={currentQ}
        />

        <button
          className={`btn btn--primary btn--large ${submitting ? 'btn--loading' : ''}`}
          onClick={handleNext}
          disabled={!answer.trim() || submitting}
          style={{ width: '100%' }}
        >
          {currentQ + 1 < totalQuestions ? 'Next question' : 'Finish'}
        </button>
      </div>
    </div>
  );
}

export default StructuredQuestionsPage;
