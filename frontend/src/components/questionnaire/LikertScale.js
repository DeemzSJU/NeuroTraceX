import React from 'react';

/**
 * LikertScale Component
 * 1-5 radio button group for REI-20 items.
 *
 * @param {Object} props
 * @param {string} props.name - unique input name / question identifier
 * @param {number} [props.value=0] - currently selected value (1-5, or 0 if unselected)
 * @param {Function} props.onChange - callback (value: number) => void
 * @param {boolean} [props.disabled=false]
 */
export function LikertScale({ name, value = 0, onChange, disabled = false }) {
  const options = [
    { num: 1, label: 'Definitely Not True' },
    { num: 2, label: 'Mostly Not True' },
    { num: 3, label: 'Neutral' },
    { num: 4, label: 'Mostly True' },
    { num: 5, label: 'Definitely True' },
  ];

  return (
    <div
      style={{
        display: 'flex',
        justify: 'space-between',
        gap: '0.5rem',
        marginTop: '0.75rem',
      }}
    >
      {options.map((opt) => {
        const isSelected = value === opt.num;
        return (
          <button
            key={opt.num}
            type="button"
            disabled={disabled}
            onClick={() => onChange(opt.num)}
            style={{
              flex: 1,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justify: 'center',
              padding: '0.5rem 0.25rem',
              borderRadius: 'var(--radius-md)',
              border: `1px solid ${
                isSelected ? 'var(--color-primary-500)' : 'var(--color-border)'
              }`,
              background: isSelected
                ? 'rgba(99, 102, 241, 0.15)'
                : 'var(--color-bg-tertiary)',
              color: isSelected
                ? 'var(--color-primary-300)'
                : 'var(--color-text-secondary)',
              cursor: disabled ? 'not-allowed' : 'pointer',
              transition: 'all var(--transition-fast)',
              userSelect: 'none',
            }}
          >
            <span
              style={{
                fontWeight: 700,
                fontSize: 'var(--text-lg)',
                lineHeight: 1,
              }}
            >
              {opt.num}
            </span>
            <span
              style={{
                fontSize: '0.65rem',
                marginTop: '0.25rem',
                textAlign: 'center',
                opacity: isSelected ? 1 : 0.7,
              }}
            >
              {opt.label}
            </span>
          </button>
        );
      })}
    </div>
  );
}

export default LikertScale;
