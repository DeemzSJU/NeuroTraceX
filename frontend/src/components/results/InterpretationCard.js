import React from 'react';

/**
 * InterpretationCard Component
 * Displays the personalized AI interpretation.
 *
 * @param {Object} props
 * @param {string} props.text - Multi-paragraph text
 */
export function InterpretationCard({ text }) {
  if (!text) return null;

  const paragraphs = text.split('\n\n').filter(Boolean);

  return (
    <div className="card" style={{
      borderLeft: '3px solid var(--color-accent)',
      marginBottom: '1rem',
    }}>
      <h3 style={{
        fontSize: 'var(--text-sm)', fontWeight: 600,
        color: 'var(--color-text-primary)', marginBottom: '1rem',
      }}>
        Personalised Cognitive Profile
      </h3>

      <div style={{ color: 'var(--color-text-secondary)', lineHeight: 1.8, fontSize: 'var(--text-sm)' }}>
        {paragraphs.map((p, idx) => (
          <p key={idx} style={{ marginBottom: idx < paragraphs.length - 1 ? '1rem' : 0 }}>
            {p}
          </p>
        ))}
      </div>
    </div>
  );
}

export default InterpretationCard;
