import React from 'react';

/**
 * Timer Component
 * Clean text-only time display.
 *
 * @param {Object} props
 * @param {number} props.seconds - total elapsed seconds
 * @param {number} [props.minSeconds] - minimum required seconds
 * @param {boolean} [props.isCountDown=false]
 */
export function Timer({ seconds, minSeconds, isCountDown = false }) {
  const formatTime = (totalSec) => {
    const m = Math.floor(Math.max(0, totalSec) / 60);
    const s = Math.max(0, totalSec) % 60;
    return `${m}:${s.toString().padStart(2, '0')}`;
  };

  const isLocked = minSeconds !== undefined && seconds < minSeconds;

  return (
    <div style={{
      display: 'inline-flex', alignItems: 'center', gap: '0.5rem',
      fontFamily: 'var(--font-mono)',
      fontSize: 'var(--text-sm)',
      color: isLocked ? 'var(--color-warning)' : 'var(--color-success)',
    }}>
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10"/>
        <polyline points="12 6 12 12 16 14"/>
      </svg>
      <span>
        {formatTime(seconds)} {isCountDown ? 'remaining' : 'elapsed'}
      </span>
      {isLocked && (
        <span style={{ color: 'var(--color-text-disabled)', fontSize: 'var(--text-xs)' }}>
          ({formatTime(minSeconds - seconds)} required)
        </span>
      )}
    </div>
  );
}

export default Timer;
