/**
 * NeuroTraceX — CRT Page (Step 2b)
 * Cognitive Reflection Test — 3 items.
 */

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSessionContext } from '../context/SessionContext';
import { STEPS } from '../constants/experimentFlow';
import responseService from '../services/responseService';
import { useAuth } from '../context/AuthContext';

import QuestionCard from '../components/questionnaire/QuestionCard';
import { CRT_QUESTIONS } from '../constants/crtQuestions';

function CRTPage() {
  const navigate = useNavigate();
  const { sessionId, setCRTScore, setStep, setLoading, isLoading } = useSessionContext();
  const { user } = useAuth();

  const cacheKey = user?.id ? `neurotracex_crt_answers_${user.id}` : null;

  const [answers, setAnswers] = useState(['', '', '']);
  const [error, setError] = useState(null);

  // Restore answers from cache once user details are loaded
  useEffect(() => {
    if (cacheKey) {
      const cached = localStorage.getItem(cacheKey);
      if (cached) {
        try {
          setAnswers(JSON.parse(cached));
        } catch (e) {
          console.error("Failed to parse cached CRT answers:", e);
        }
      }
    }
  }, [cacheKey]);

  // Persist answers to cache on change
  useEffect(() => {
    if (cacheKey && answers.some((a) => a.trim().length > 0)) {
      localStorage.setItem(cacheKey, JSON.stringify(answers));
    }
  }, [answers, cacheKey]);

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
      
      // Clear cache on successful submission
      if (cacheKey) {
        localStorage.removeItem(cacheKey);
      }
      
      setCRTScore(response.crt_score);
      setStep(STEPS.STIMULUS.id);
      setLoading(false);
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
        <div className="card--glass" style={{
          padding: '0.5rem 1.5rem',
          borderRadius: 'var(--radius-xl)',
          marginBottom: '1.5rem',
        }}>
          {CRT_QUESTIONS.map((item, idx) => (
            <QuestionCard
              key={item.id}
              number={idx + 1}
              text={item.text}
              type="number"
              value={answers[idx]}
              onChange={(val) => handleAnswer(idx, val)}
              isLast={idx === CRT_QUESTIONS.length - 1}
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
          Continue to video
        </button>
      </div>
    </div>
  );
}

export default CRTPage;
