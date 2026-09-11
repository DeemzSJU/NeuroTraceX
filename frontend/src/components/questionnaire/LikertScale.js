import React from 'react';

/**
 * LikertScale Component
 * Circular 1-5 selector with endpoint labels.
 *
 * @param {Object} props
 * @param {string} props.name - unique input name / question identifier
 * @param {number} [props.value=0] - currently selected value (1-5, or 0 if unselected)
 * @param {Function} props.onChange - callback (value: number) => void
 * @param {boolean} [props.disabled=false]
 */
export function LikertScale({ name, value = 0, onChange, disabled = false }) {
  const points = [1, 2, 3, 4, 5];

  return (
    <div style={{ marginTop: '0.875rem' }}>
      <div style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        gap: '0.375rem',
      }}>
        {/* Left label */}
        <span style={{
          fontSize: '0.6875rem', color: 'var(--color-text-secondary)',
          minWidth: '52px', textAlign: 'left', lineHeight: 1.2, fontWeight: 500,
        }}>
          Not true
        </span>

        {/* Circles */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.625rem' }}>
          {points.map((num) => {
            const isSelected = value === num;
            return (
              <button
                key={num}
                type="button"
                disabled={disabled}
                onClick={() => onChange(num)}
                aria-label={`${num} out of 5`}
                className={`likert-bubble ${isSelected ? 'selected' : ''}`}
              >
                {num}
              </button>
            );
          })}
        </div>

        {/* Right label */}
        <span style={{
          fontSize: '0.6875rem', color: 'var(--color-text-secondary)',
          minWidth: '52px', textAlign: 'right', lineHeight: 1.2, fontWeight: 500,
        }}>
          Very true
        </span>
      </div>
    </div>
  );
}

export default LikertScale;
