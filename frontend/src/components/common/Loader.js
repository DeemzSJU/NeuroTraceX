import React from 'react';

/**
 * Loader Component
 *
 * @param {Object} props
 * @param {string} [props.text='Loading...']
 * @param {'sm' | 'md' | 'lg'} [props.size='md']
 */
export function Loader({ text = 'Loading...', size = 'md' }) {
  const sizePixels = size === 'lg' ? 40 : size === 'sm' ? 20 : 30;

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '2rem',
        gap: '1rem',
      }}
    >
      <div
        style={{
          width: `${sizePixels}px`,
          height: `${sizePixels}px`,
          border: '3px solid rgba(99, 102, 241, 0.2)',
          borderTopColor: 'var(--color-primary-500)',
          borderRadius: '50%',
          animation: 'spin 0.8s linear infinite',
        }}
      />
      {text && (
        <span style={{ fontSize: 'var(--text-sm)', color: 'var(--color-text-secondary)' }}>
          {text}
        </span>
      )}
    </div>
  );
}

export default Loader;
