import React from 'react';

/**
 * ScoreCard Component
 * Clean, minimal score display.
 *
 * @param {Object} props
 * @param {string} props.title - Metric title
 * @param {string | number} props.value - Score value
 * @param {string} [props.subtitle] - Scale description
 * @param {string} [props.color='var(--color-accent)'] - Accent color
 */
export function ScoreCard({ title, value, subtitle, color = 'var(--color-accent)' }) {
  return (
    <div className="card" style={{
      display: 'flex', flexDirection: 'column',
      padding: '1.25rem',
      borderLeft: `3px solid ${color}`,
    }}>
      <span style={{
        fontSize: 'var(--text-xs)', color: 'var(--color-text-secondary)',
        fontWeight: 500, textTransform: 'uppercase', letterSpacing: '0.04em',
        marginBottom: '0.5rem',
      }}>
        {title}
      </span>
      <span style={{
        fontSize: 'var(--text-2xl)', fontWeight: 700,
        color: color,
        lineHeight: 1, marginBottom: '0.375rem',
        fontFamily: 'var(--font-mono)',
      }}>
        {typeof value === 'number' ? value.toFixed(2) : value ?? '—'}
      </span>
      {subtitle && (
        <span style={{
          fontSize: 'var(--text-xs)', color: 'var(--color-text-tertiary)',
        }}>
          {subtitle}
        </span>
      )}
    </div>
  );
}

export default ScoreCard;
