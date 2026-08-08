import React from 'react';

/**
 * Loader Component
 * Clean pulse-dot loader.
 *
 * @param {Object} props
 * @param {string} [props.text='Loading...']
 * @param {'sm' | 'md' | 'lg'} [props.size='md']
 */
export function Loader({ text = 'Loading...', size = 'md' }) {
  const dotSize = size === 'lg' ? 8 : size === 'sm' ? 4 : 6;
  const gap = size === 'lg' ? 6 : 4;

  return (
    <div style={{
      display: 'flex', flexDirection: 'column',
      alignItems: 'center', justifyContent: 'center',
      padding: '2rem', gap: '1.25rem',
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: `${gap}px` }}>
        {[0, 1, 2].map((i) => (
          <div
            key={i}
            style={{
              width: `${dotSize}px`, height: `${dotSize}px`,
              borderRadius: '50%',
              background: 'var(--color-accent)',
              animation: `pulse 1.2s ease-in-out ${i * 0.15}s infinite`,
            }}
          />
        ))}
      </div>
      {text && (
        <span style={{
          fontSize: 'var(--text-xs)', color: 'var(--color-text-disabled)',
          letterSpacing: '0.01em',
        }}>
          {text}
        </span>
      )}
    </div>
  );
}

export default Loader;
