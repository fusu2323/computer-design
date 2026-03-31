/**
 * Textarea Component
 * Eastern aesthetic styled textarea with focus and error states
 */

import React from 'react';

const Textarea = ({
  label,
  error,
  required = false,
  className = '',
  ...textareaProps
}) => {
  const textareaClasses = [
    'w-full px-4 py-3',
    'font-serif text-ink-black',
    'border rounded-sm bg-white',
    'transition-all duration-200',
    'outline-none',
    'min-h-32 resize-vertical',
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
      <textarea
        className={textareaClasses}
        {...textareaProps}
      />
      {error && (
        <span className="text-red-500 text-sm mt-1 font-serif">{error}</span>
      )}
    </div>
  );
};

export default Textarea;
