import React, { useRef, useState, useEffect } from 'react';

/**
 * AudioPlayer Component
 * Custom HTML5 audio player with seek bar disabled to enforce continuous listening protocol.
 *
 * @param {Object} props
 * @param {string} props.src - audio file URL/path
 * @param {Function} [props.onPlay] - playback start callback
 * @param {Function} [props.onEnded] - playback completion callback
 */
export function AudioPlayer({ src, onPlay, onEnded }) {
  const audioRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [hasEnded, setHasEnded] = useState(false);
  const [progress, setProgress] = useState(0);

  const handlePlayClick = () => {
    if (audioRef.current && !isPlaying && !hasEnded) {
      audioRef.current.play();
    }
  };

  const handleAudioPlay = () => {
    setIsPlaying(true);
    if (onPlay) onPlay();
  };

  const handleTimeUpdate = () => {
    if (audioRef.current && audioRef.current.duration) {
      const currentProgress = (audioRef.current.currentTime / audioRef.current.duration) * 100;
      setProgress(currentProgress);
    }
  };

  const handleAudioEnded = () => {
    setIsPlaying(false);
    setHasEnded(true);
    setProgress(100);
    if (onEnded) onEnded();
  };

  return (
    <div className="card text-center" style={{ padding: '2.5rem 2rem' }}>
      <audio
        ref={audioRef}
        src={src}
        onPlay={handleAudioPlay}
        onTimeUpdate={handleTimeUpdate}
        onEnded={handleAudioEnded}
        style={{ display: 'none' }}
      />

      <div style={{ marginBottom: '1.5rem' }}>
        <div
          style={{
            width: '64px',
            height: '64px',
            borderRadius: '50%',
            background: isPlaying
              ? 'radial-gradient(circle, var(--color-accent-400), var(--color-primary-600))'
              : 'var(--color-bg-elevated)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 1rem auto',
            boxShadow: isPlaying ? '0 0 24px rgba(34, 211, 238, 0.4)' : 'none',
            transition: 'all var(--transition-base)',
          }}
        >
          <span style={{ fontSize: '1.5rem' }}>
            {hasEnded ? '✓' : isPlaying ? '🔊' : '▶'}
          </span>
        </div>

        <h3 style={{ fontSize: 'var(--text-xl)', marginBottom: '0.5rem' }}>
          {hasEnded ? 'Audio Complete' : isPlaying ? 'Listening to Stimulus...' : 'Ready to Listen'}
        </h3>
        <p className="text-sm" style={{ color: 'var(--color-text-secondary)' }}>
          {hasEnded
            ? 'Thank you. You may now continue to the recall section.'
            : isPlaying
            ? 'Seek bar is disabled. Please listen to the full recording.'
            : 'Click play when you are ready in a quiet room.'}
        </p>
      </div>

      {/* Disabled progress bar indicator */}
      {(isPlaying || hasEnded) && (
        <div
          style={{
            width: '100%',
            height: '6px',
            background: 'var(--color-bg-tertiary)',
            borderRadius: 'var(--radius-full)',
            overflow: 'hidden',
            marginBottom: '1.5rem',
          }}
        >
          <div
            style={{
              height: '100%',
              width: `${progress}%`,
              background: 'linear-gradient(90deg, var(--color-primary-500), var(--color-accent-400))',
              transition: 'width 0.2s linear',
            }}
          />
        </div>
      )}

      {!isPlaying && !hasEnded && (
        <button className="btn btn--primary btn--large" onClick={handlePlayClick}>
          ▶ Play Audio Stimulus
        </button>
      )}
    </div>
  );
}

export default AudioPlayer;
