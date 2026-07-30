import React from 'react';

/**
 * Timer Component
 * Displays formatted time (mm:ss) with warning state when time remains below threshold.
 *
 * @param {Object} props
 * @param {number} props.seconds - total elapsed seconds or remaining seconds
 * @param {number} [props.minSeconds] - minimum required seconds for lock/unlock state
 * @param {boolean} [props.isCountDown=false] - whether timer counts down
 */
export function Timer({ seconds, minSeconds, isCountDown = false }) {
  const formatTime = (totalSec) => {
    const m = Math.floor(Math.max(0, totalSec) / 60);
    const s = Math.max(0, totalSec) % 60;
    return `${m}:${s.toString().padStart(2, '0')}`;
  };

  const isLocked = minSeconds !== undefined && seconds < minSeconds;

  return (
    <div
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: '0.5rem',
        fontFamily: 'var(--font-mono)',
        fontSize: 'var(--text-sm)',
        color: isLocked ? 'var(--color-text-warning)' : 'var(--color-text-success)',
      }}
    >
      <span>⏱</span>
      <span>
        {formatTime(seconds)} {isCountDown ? 'remaining' : 'elapsed'}
      </span>
      {isLocked && (
        <span style={{ color: 'var(--color-text-tertiary)', fontSize: 'var(--text-xs)' }}>
          ({formatTime(minSeconds - seconds)} required remaining)
        </span>
      )}
    </div>
  );
}

export default Timer;
