/**
 * NeuroTraceX — Free Recall Page (Step 4)
 * Large text input with 3-minute lock and timer.
 */

import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSessionContext } from '../context/SessionContext';
import { STEPS } from '../constants/experimentFlow';
import responseService from '../services/responseService';

import Timer from '../components/common/Timer';

function FreeRecallPage() {
  const navigate = useNavigate();
  const { sessionId, setStep, setLoading, isLoading } = useSessionContext();

  const [text, setText] = useState('');
  const [elapsed, setElapsed] = useState(0);
  const [error, setError] = useState(null);
  const startTimeRef = useRef(Date.now());

  const MIN_SECONDS = 180; // 3 minutes
  const canSubmit = elapsed >= MIN_SECONDS && text.trim().length > 0 && !isLoading;

  // Timer
  useEffect(() => {
    const interval = setInterval(() => {
      setElapsed(Math.floor((Date.now() - startTimeRef.current) / 1000));
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const formatTime = (seconds) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s.toString().padStart(2, '0')}`;
  };

  const handleSubmit = async () => {
    if (!canSubmit) return;

    setLoading(true);
    setError(null);

    try {
      await responseService.submitFreeRecall(sessionId, text, elapsed);
      setStep(STEPS.STRUCTURED.id);
      navigate(STEPS.STRUCTURED.path);
    } catch (err) {
      setError(err.message);
      setLoading(false);
    }
  };

  return (
    <div className="page animate-fade-in">
      <div className="page__header">
        <h1>Free Recall</h1>
        <p>Describe everything you remember about what you just watched.</p>
      </div>

      <div className="page__content">
        <div className="card mb-6">
          <p className="text-sm" style={{ color: 'var(--color-text-secondary)', marginBottom: '1rem' }}>
            In as much detail as possible, describe everything you remember about what
            you just watched. Include what happened, what was said, how the characters
            seemed to feel, and anything else that stands out to you.
          </p>
          <p className="text-sm" style={{ color: 'var(--color-text-accent)' }}>
            Please take at least 3 minutes.
          </p>
        </div>

        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Start writing your recollection here..."
          style={{ minHeight: '250px', marginBottom: '1rem' }}
          autoFocus
        />

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
          <Timer seconds={elapsed} minSeconds={MIN_SECONDS} />
          <span className="text-sm" style={{ color: 'var(--color-text-tertiary)' }}>
            {text.split(/\s+/).filter(Boolean).length} words
          </span>
        </div>

        {error && (
          <p className="text-error text-sm mb-4">{error}</p>
        )}

        <button
          className={`btn btn--primary btn--large ${isLoading ? 'btn--loading' : ''}`}
          onClick={handleSubmit}
          disabled={!canSubmit}
          style={{ width: '100%' }}
        >
          {elapsed < MIN_SECONDS ? `Wait ${formatTime(MIN_SECONDS - elapsed)}` : 'Submit Recall →'}
        </button>
      </div>
    </div>
  );
}

export default FreeRecallPage;
