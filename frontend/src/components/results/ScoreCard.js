import React from 'react';

/**
 * ScoreCard Component
 * Displays a single score metric with label, value, description, and optional progress ring or scale.
 *
 * @param {Object} props
 * @param {string} props.title - Metric title
 * @param {string | number} props.value - Score value
 * @param {string} [props.subtitle] - Subtitle or scale description (e.g., 'Scale 1-5' or '0.00 to 1.00')
 * @param {string} [props.color='var(--color-primary-400)'] - Accent color
 */
export function ScoreCard({ title, value, subtitle, color = 'var(--color-primary-400)' }) {
  return (
    <div
      className="card"
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justify: 'center',
        padding: '1.5rem',
        textAlign: 'center',
        borderTop: `3px solid ${color}`,
      }}
    >
      <span className="text-sm" style={{ color: 'var(--color-text-tertiary)', marginBottom: '0.5rem' }}>
        {title}
      </span>
      <span
        style={{
          fontSize: 'var(--text-3xl)',
          fontWeight: 800,
          color: color,
          lineHeight: 1,
          marginBottom: '0.5rem',
        }}
      >
        {typeof value === 'number' ? value.toFixed(2) : value ?? '—'}
      </span>
      {subtitle && (
        <span className="text-xs" style={{ color: 'var(--color-text-secondary)', fontSize: '0.75rem' }}>
          {subtitle}
        </span>
      )}
    </div>
  );
}

export default ScoreCard;
