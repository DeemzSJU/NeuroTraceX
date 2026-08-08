/**
 * NeuroTraceX — Video Stimulus Page (Step 3)
 * HTML5 video player with seeking disabled.
 * Continue button appears only after the video finishes playing.
 */

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSessionContext } from '../context/SessionContext';
import { STEPS } from '../constants/experimentFlow';
import responseService from '../services/responseService';

import VideoPlayer from '../components/stimulus/VideoPlayer';

function StimulusPage() {
  const navigate = useNavigate();
  const { sessionId, setStep } = useSessionContext();
  const [hasEnded, setHasEnded] = useState(false);

  const handlePlay = async () => {
    await responseService.submitVideoEvent(sessionId, 'playback_start', new Date());
  };

  const handleEnded = async () => {
    setHasEnded(true);
    await responseService.submitVideoEvent(sessionId, 'playback_end', new Date());
  };

  const handleContinue = () => {
    setStep(STEPS.FREE_RECALL.id);
    navigate(STEPS.FREE_RECALL.path);
  };

  return (
    <div className="page animate-fade-in">
      <div className="page__header">
        <h1>Watch Carefully</h1>
        <p>
          Pay close attention to the characters, dialogue, actions, and overall dynamics. Seeking is disabled.
        </p>
      </div>

      <div className="page__content">
        <VideoPlayer
          src="/video/NeuroVideo.mp4"
          onPlay={handlePlay}
          onEnded={handleEnded}
        />

        {hasEnded && (
          <button
            className="btn btn--primary btn--large"
            onClick={handleContinue}
            style={{ width: '100%', marginTop: '1.5rem' }}
          >
            Continue to recall
          </button>
        )}
      </div>
    </div>
  );
}

export default StimulusPage;
