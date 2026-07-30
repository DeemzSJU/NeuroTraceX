import React from 'react';

/**
 * Reusable Button Component
 *
 * @param {Object} props
 * @param {'primary' | 'secondary' | 'outline' | 'danger'} [props.variant='primary']
 * @param {'sm' | 'md' | 'lg'} [props.size='md']
 * @param {boolean} [props.isLoading=false]
 * @param {boolean} [props.disabled=false]
 * @param {React.ReactNode} props.children
 * @param {Function} [props.onClick]
 * @param {string} [props.type='button']
 * @param {string} [props.className='']
 */
export function Button({
  variant = 'primary',
  size = 'md',
  isLoading = false,
  disabled = false,
  children,
  onClick,
  type = 'button',
  className = '',
  ...rest
}) {
  const baseClass = 'btn';
  const variantClass = `btn--${variant}`;
  const sizeClass = size === 'lg' ? 'btn--large' : size === 'sm' ? 'btn--small' : '';
  const loadingClass = isLoading ? 'btn--loading' : '';

  const combinedClasses = [baseClass, variantClass, sizeClass, loadingClass, className]
    .filter(Boolean)
    .join(' ');

  return (
    <button
      type={type}
      className={combinedClasses}
      disabled={disabled || isLoading}
      onClick={onClick}
      {...rest}
    >
      {children}
    </button>
  );
}

export default Button;
