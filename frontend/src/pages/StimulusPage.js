/**
 * NeuroTraceX — Audio Stimulus Page (Step 3)
 * HTML5 audio player with seek bar disabled.
 * Continue button appears only after audio finishes.
 */

import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSessionContext } from '../context/SessionContext';
import { STEPS } from '../constants/experimentFlow';
import responseService from '../services/responseService';

function StimulusPage() {
  const navigate = useNavigate();
  const { sessionId, setStep } = useSessionContext();
  const audioRef = useRef(null);

  const [isPlaying, setIsPlaying] = useState(false);
  const [hasEnded, setHasEnded] = useState(false);

  const handlePlay = async () => {
    setIsPlaying(true);
    await responseService.submitAudioEvent(sessionId, 'playback_start', new Date());
  };

  const handleEnded = async () => {
    setHasEnded(true);
    setIsPlaying(false);
    await responseService.submitAudioEvent(sessionId, 'playback_end', new Date());
  };

  const handleContinue = () => {
    setStep(STEPS.FREE_RECALL.id);
    navigate(STEPS.FREE_RECALL.path);
  };

  return (
    <div className="page animate-fade-in">
      <div className="page__header">
        <h1>Listen Carefully</h1>
        <p>
          You will hear a short audio recording. Please listen attentively
          in a quiet environment. You cannot pause or rewind.
        </p>
      </div>

      <div className="page__content">
        <div className="card text-center" style={{ padding: '3rem 2rem' }}>
          {/* Audio element — controls are custom to prevent seeking */}
          <audio
            ref={audioRef}
            onPlay={handlePlay}
            onEnded={handleEnded}
            style={{ display: 'none' }}
          >
            {/* Audio source will be added when stimulus is provided */}
            <source src="/audio/stimulus.mp3" type="audio/mpeg" />
            Your browser does not support the audio element.
          </audio>

          {!isPlaying && !hasEnded && (
            <button
              className="btn btn--primary btn--large"
              onClick={() => audioRef.current?.play()}
            >
              ▶ Play Audio
            </button>
          )}

          {isPlaying && (
            <div>
              <div className="text-accent" style={{ fontSize: 'var(--text-2xl)', marginBottom: '1rem' }}>
                ♪ Playing...
              </div>
              <p className="text-sm" style={{ color: 'var(--color-text-tertiary)' }}>
                Please listen carefully. Do not close this tab.
              </p>
            </div>
          )}

          {hasEnded && (
            <div className="animate-fade-in">
              <p className="text-success" style={{ fontSize: 'var(--text-lg)', marginBottom: '1.5rem' }}>
                ✓ Audio complete
              </p>
              <button
                className="btn btn--primary btn--large"
                onClick={handleContinue}
              >
                Continue to Recall →
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default StimulusPage;
