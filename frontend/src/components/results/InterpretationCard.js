import React from 'react';

/**
 * InterpretationCard Component
 * Displays the 3-paragraph personalized AI interpretation with sleek formatting.
 *
 * @param {Object} props
 * @param {string} props.text - Markdown or multi-paragraph text
 */
export function InterpretationCard({ text }) {
  if (!text) return null;

  const paragraphs = text.split('\n\n').filter(Boolean);

  return (
    <div className="card mb-6" style={{ background: 'var(--color-bg-card)', borderLeft: '4px solid var(--color-accent-400)' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
        <span style={{ fontSize: '1.25rem' }}>🧠</span>
        <h3 style={{ fontSize: 'var(--text-xl)', color: 'var(--color-text-primary)' }}>
          Personalized Cognitive Profile
        </h3>
      </div>

      <div style={{ color: 'var(--color-text-secondary)', lineHeight: '1.8' }}>
        {paragraphs.map((p, idx) => (
          <p key={idx} style={{ marginBottom: idx < paragraphs.length - 1 ? '1.25rem' : 0 }}>
            {p}
          </p>
        ))}
      </div>
    </div>
  );
}

export default InterpretationCard;
