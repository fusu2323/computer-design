/**
 * Select Component
 * Eastern aesthetic styled select with custom arrow
 */

import React from 'react';

const Select = ({
  label,
  required = false,
  className = '',
  children,
  ...selectProps
}) => {
  const selectWrapperClasses = 'relative';

  const selectClasses = [
    'w-full px-4 py-3 pr-10',
    'font-serif text-ink-black',
    'border rounded-sm bg-white',
    'transition-all duration-200',
    'outline-none appearance-none',
    'border-ink-black/20 focus:border-vermilion focus:ring-2 focus:ring-vermilion/20',
  ].join(' ');

  return (
    <div className={`flex flex-col ${className}`}>
      {label && (
        <label className="font-xiaowei text-sm text-charcoal mb-1">
          {label}
          {required && <span className="text-vermilion ml-1">*</span>}
        </label>
      )}
      <div className={selectWrapperClasses}>
        <select
          className={selectClasses}
          {...selectProps}
        >
          {children}
        </select>
        {/* Custom chevron arrow */}
        <span className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-charcoal">
          ▼
        </span>
      </div>
    </div>
  );
};

export default Select;
