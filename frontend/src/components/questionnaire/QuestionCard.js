import React from 'react';
import LikertScale from './LikertScale';

/**
 * QuestionCard Component
 * Clean row layout with subtle bottom border separator.
 *
 * @param {Object} props
 * @param {number | string} props.number - question number or label
 * @param {string} props.text - question statement/prompt
 * @param {'likert' | 'text' | 'number'} [props.type='likert'] - input type
 * @param {any} props.value - current value
 * @param {Function} props.onChange - value change handler
 */
export function QuestionCard({ number, text, type = 'likert', value, onChange, isLast = false }) {
  return (
    <div className="card" style={{
      marginBottom: isLast ? '0' : '1.25rem',
      padding: '1.5rem',
      transition: 'box-shadow 0.2s ease, transform 0.2s ease',
    }}
    onMouseEnter={e => {
      e.currentTarget.style.boxShadow = 'var(--shadow-md)';
      e.currentTarget.style.transform = 'translateY(-2px)';
    }}
    onMouseLeave={e => {
      e.currentTarget.style.boxShadow = 'var(--shadow-xs)';
      e.currentTarget.style.transform = 'translateY(0)';
    }}
    >
      <div style={{ display: 'flex', alignItems: 'flex-start', gap: '1rem' }}>
        <span style={{
          fontFamily: 'var(--font-mono)',
          fontSize: 'var(--text-sm)',
          fontWeight: 600,
          color: 'var(--color-accent-muted)',
          minWidth: '1.5rem',
          paddingTop: '0.1rem',
          textAlign: 'right',
        }}>
          {String(number).padStart(2, '0')}
        </span>
        <div style={{ flex: 1 }}>
          <p style={{
            color: 'var(--color-text-primary)', fontWeight: 450,
            fontSize: 'var(--text-base)', lineHeight: 1.55, margin: 0,
          }}>
            {text}
          </p>

          {type === 'likert' && (
            <LikertScale
              name={`q_${number}`}
              value={value || 0}
              onChange={onChange}
            />
          )}

          {type === 'text' && (
            <textarea
              value={value || ''}
              onChange={(e) => onChange(e.target.value)}
              placeholder="Type your response..."
              style={{ marginTop: '0.75rem', minHeight: '80px' }}
            />
          )}

          {type === 'number' && (
            <input
              type="text"
              value={value || ''}
              onChange={(e) => {
                const val = e.target.value;
                // Keep only numbers and a single decimal point
                let cleaned = val.replace(/[^0-9.]/g, '');
                const parts = cleaned.split('.');
                if (parts.length > 2) {
                  cleaned = parts[0] + '.' + parts.slice(1).join('');
                }
                onChange(cleaned);
              }}
              placeholder="Your answer..."
              style={{ marginTop: '0.75rem', maxWidth: '180px' }}
            />
          )}
        </div>
      </div>
    </div>
  );
}

export default QuestionCard;
