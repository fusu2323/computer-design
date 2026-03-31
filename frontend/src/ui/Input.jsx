/**
 * Input Component
 * Eastern aesthetic styled input with focus and error states
 */

import React from 'react';

const Input = ({
  label,
  error,
  required = false,
  className = '',
  ...inputProps
}) => {
  const inputClasses = [
    'w-full px-4 py-3',
    'font-serif text-ink-black',
    'border rounded-sm bg-white',
    'transition-all duration-200',
    'outline-none',
    error
      ? 'border-red-500 ring-2 ring-red-500/20'
      : 'border-ink-black/20 focus:border-vermilion focus:ring-2 focus:ring-vermilion/20',
  ].join(' ');

  return (
    <div className={`flex flex-col ${className}`}>
      {label && (
        <label className="font-xiaowei text-sm text-charcoal mb-1">
          {label}
          {required && <span className="text-vermilion ml-1">*</span>}
        </label>
      )}
      <input
        className={inputClasses}
        {...inputProps}
      />
      {error && (
        <span className="text-red-500 text-sm mt-1 font-serif">{error}</span>
      )}
    </div>
  );
};

export default Input;
