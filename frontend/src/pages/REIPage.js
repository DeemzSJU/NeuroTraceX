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
          <span className="text-accent">{answeredCount}/{REI_QUESTIONS.length}</span> answered
        </p>
      </div>

      <div className="page__content">
        <div className="card mb-6" style={{ position: 'sticky', top: '70px', zIndex: 90, backdropFilter: 'blur(8px)', background: 'rgba(22, 22, 31, 0.95)' }}>
          <p className="text-sm" style={{ color: 'var(--color-text-tertiary)', textAlign: 'center' }}>
            1 = Definitely Not True &nbsp;|&nbsp; 3 = Neutral &nbsp;|&nbsp; 5 = Definitely True
          </p>
        </div>

        <div>
          {REI_QUESTIONS.map((item, idx) => (
            <QuestionCard
              key={item.id}
              number={idx + 1}
              text={item.text}
              type="likert"
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
          style={{ width: '100%', marginTop: '1.5rem' }}
        >
          {allAnswered ? 'Submit REI-20 →' : `Answer All Questions (${REI_QUESTIONS.length - answeredCount} remaining)`}
        </button>
      </div>
    </div>
  );
}

export default REIPage;
