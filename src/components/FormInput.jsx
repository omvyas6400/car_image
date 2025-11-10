import React from 'react';
import PropTypes from 'prop-types';

const FormInput = ({
  label,
  name,
  value,
  onChange,
  type = 'text',
  placeholder,
  error,
  helperText,
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
      <input
        type={type}
        id={name}
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className={`
          w-full px-4 py-3
          bg-[#0F1419] text-[#E8EAED]
          rounded-lg border-2
          transition duration-200
          ${error ? 'border-[#EF4444]' : 'border-[#00D9FF]'}
          focus:outline-none focus:border-[#00D9FF] focus:ring-1 focus:ring-[#00D9FF]
        `}
        {...props}
      />
      {error && (
        <p className="mt-2 text-xs font-medium text-[#EF4444]">
          ✗ {error}
        </p>
      )}
      {helperText && !error && (
        <p className="mt-2 text-xs text-gray-400">
          {helperText}
        </p>
      )}
    </div>
  );
};

FormInput.propTypes = {
  label: PropTypes.string,
  name: PropTypes.string.isRequired,
  value: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
  type: PropTypes.string,
  placeholder: PropTypes.string,
  error: PropTypes.string,
  className: PropTypes.string,
  labelClassName: PropTypes.string,
  required: PropTypes.bool
};

export default FormInput;