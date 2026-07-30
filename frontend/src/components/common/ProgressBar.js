import React from 'react';

/**
 * ProgressBar Component
 *
 * @param {Object} props
 * @param {number} props.currentStep - 1-based current step number
 * @param {number} props.totalSteps - total step count
 * @param {string} [props.label] - optional label to display
 */
export function ProgressBar({ currentStep, totalSteps, label }) {
  const percentage = Math.min(100, Math.max(0, (currentStep / totalSteps) * 100));

  return (
    <div style={{ width: '100%' }}>
      {label && (
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.25rem', fontSize: 'var(--text-xs)', color: 'var(--color-text-tertiary)' }}>
          <span>{label}</span>
          <span>{Math.round(percentage)}%</span>
        </div>
      )}
      <div className="progress-bar">
        <div
          className="progress-bar__fill"
          style={{ width: `${percentage}%` }}
          role="progressbar"
          aria-valuenow={percentage}
          aria-valuemin={0}
          aria-valuemax={100}
        />
      </div>
    </div>
  );
}

export default ProgressBar;
