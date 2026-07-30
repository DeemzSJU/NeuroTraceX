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

import QuestionCard from '../components/questionnaire/QuestionCard';
import { CRT_QUESTIONS } from '../constants/crtQuestions';

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
        <div>
          {CRT_QUESTIONS.map((item, idx) => (
            <QuestionCard
              key={item.id}
              number={idx + 1}
              text={item.text}
              type="number"
              value={answers[idx]}
              onChange={(val) => handleAnswer(idx, val)}
            />
          ))}
        </div>

        {error && (
          <p className="text-error text-sm mb-4 text-center">{error}</p>
        )}

        <button
          className={`btn btn--primary btn--large ${isLoading ? 'btn--loading' : ''}`}
          onClick={handleSubmit}
          disabled={!allAnswered}
          style={{ width: '100%', marginTop: '1rem' }}
        >
          Continue to Audio Stimulus →
        </button>
      </div>
    </div>
  );
}

export default CRTPage;
