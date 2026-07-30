import React from 'react';
import LikertScale from './LikertScale';

/**
 * QuestionCard Component
 * Displays a single questionnaire item with prompt text and response input.
 *
 * @param {Object} props
 * @param {number | string} props.number - question number or label
 * @param {string} props.text - question statement/prompt
 * @param {'likert' | 'text' | 'number'} [props.type='likert'] - input type
 * @param {any} props.value - current value
 * @param {Function} props.onChange - value change handler
 */
export function QuestionCard({ number, text, type = 'likert', value, onChange }) {
  return (
    <div className="card mb-4" style={{ padding: '1.25rem 1.5rem' }}>
      <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.75rem' }}>
        <span
          style={{
            fontWeight: 700,
            fontSize: 'var(--text-sm)',
            color: 'var(--color-primary-400)',
            minWidth: '1.75rem',
            paddingTop: '0.1rem',
          }}
        >
          {number}.
        </span>
        <div style={{ flex: 1 }}>
          <p style={{ color: 'var(--color-text-primary)', fontWeight: 500, fontSize: 'var(--text-base)' }}>
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
              style={{ marginTop: '0.75rem', minHeight: '90px' }}
            />
          )}

          {type === 'number' && (
            <input
              type="text"
              value={value || ''}
              onChange={(e) => onChange(e.target.value)}
              placeholder="Enter numerical answer..."
              style={{ marginTop: '0.75rem', maxWidth: '200px' }}
            />
          )}
        </div>
      </div>
    </div>
  );
}

export default QuestionCard;
