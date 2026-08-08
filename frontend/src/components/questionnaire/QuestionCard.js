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
    <div style={{
      padding: '1.125rem 0',
      borderBottom: isLast ? 'none' : '1px solid var(--color-border-subtle)',
    }}>
      <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.875rem' }}>
        <span style={{
          fontFamily: 'var(--font-mono)',
          fontSize: 'var(--text-xs)',
          color: 'var(--color-text-disabled)',
          minWidth: '1.5rem',
          paddingTop: '0.15rem',
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
