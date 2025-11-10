import React from 'react';
import PropTypes from 'prop-types';

const RegenerateButton = ({
  onClick,
  isLoading = false,
  className = '',
  fieldName,
}) => {
  return (
    <button
      onClick={onClick}
      disabled={isLoading}
      title={fieldName ? `Regenerate ${fieldName}` : 'Regenerate'}
      className={`
        inline-flex items-center gap-2
        px-4 py-2
        bg-blue-600
        text-white
        rounded
        font-medium
        transition-all duration-200
        ${isLoading ? 'opacity-50 cursor-not-allowed' : 'hover:bg-blue-700'}
        ${className}
      `}
    >
      {/* Regenerate Icon */}
      {isLoading ? (
        <svg
          className="w-4 h-4 mr-2 -ml-1 animate-spin"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
        >
          <circle
            className="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="4"
          />
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
          />
        </svg>
      ) : (
        <svg
          className="w-4 h-4"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M21 12a9 9 0 1 1-9-9c2.52 0 4.93 1 6.74 2.74L21 8" />
          <path d="M21 3v5h-5" />
        </svg>
      )}

      {/* Button Text */}
      <span>{isLoading ? 'Regenerating...' : 'Regenerate'}</span>
    </button>
  );
};

RegenerateButton.propTypes = {
  onClick: PropTypes.func.isRequired,
  isLoading: PropTypes.bool,
  className: PropTypes.string,
  fieldName: PropTypes.string,
};

export default RegenerateButton;
