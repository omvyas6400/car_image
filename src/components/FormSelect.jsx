import React from 'react';
import PropTypes from 'prop-types';

const FormSelect = ({
  label,
  name,
  value,
  onChange,
  options,
  placeholder = 'Select an option',
  error,
  className = '',
  labelClassName = '',
  required = false,
  ...props
}) => {
  return (
    <div className={`w-full ${className}`}>
      {label && (
        <label 
          htmlFor={name}
          className={`block text-xs font-semibold uppercase tracking-wider text-[#E8EAED] mb-2 ${labelClassName}`}
        >
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}
      <div className="relative">
        <select
          id={name}
          name={name}
          value={value}
          onChange={onChange}
          className={`
            w-full px-4 py-3
            bg-[#0F1419] text-[#E8EAED]
            rounded-lg border-2
            appearance-none
            transition duration-200
            ${error ? 'border-[#EF4444]' : 'border-[#00D9FF]'}
            focus:outline-none focus:border-[#00D9FF] focus:ring-1 focus:ring-[#00D9FF]
          `}
          {...props}
        >
          <option value="" disabled>
            {placeholder}
          </option>
          {options.map((option) => (
            <option 
              key={option.value || option} 
              value={option.value || option}
              style={{ backgroundColor: '#1A212B' }}
            >
              {option.label || option}
            </option>
          ))}
        </select>
        <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
          <svg className="w-4 h-4 text-[#8A8D93]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
          </svg>
        </div>
      </div>
      {error && (
        <p className="mt-2 text-xs font-medium text-[#EF4444]">
          ✗ {error}
        </p>
      )}
    </div>
  );
};

FormSelect.propTypes = {
  label: PropTypes.string,
  name: PropTypes.string.isRequired,
  value: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
  options: PropTypes.arrayOf(
    PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.shape({
        value: PropTypes.string.isRequired,
        label: PropTypes.string.isRequired,
      }),
    ])
  ).isRequired,
  placeholder: PropTypes.string,
  error: PropTypes.string,
  className: PropTypes.string,
  labelClassName: PropTypes.string,
  required: PropTypes.bool
};

export default FormSelect;