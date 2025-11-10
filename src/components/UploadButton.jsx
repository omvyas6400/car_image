import React from 'react';
import PropTypes from 'prop-types';
import LoadingSpinner from './common/LoadingSpinner';

const UploadButton = ({
  text = 'Upload',
  isLoading = false,
  disabled = false,
  onClick,
  className = '',
  ...props
}) => {
  return (
    <button
      onClick={onClick}
      disabled={isLoading || disabled}
      className={`
        w-full py-3 px-4
        rounded-lg
        font-semibold
        flex items-center justify-center gap-2
        transition-all duration-300
        ${isLoading || disabled
          ? 'bg-opacity-50 cursor-not-allowed'
          : 'hover:bg-opacity-90'
        }
        ${className}
      `}
      style={{
        backgroundColor: disabled ? 'rgba(0, 217, 255, 0.2)' : '#00D9FF',
        color: disabled ? '#8A8D93' : '#0F1419'
      }}
      {...props}
    >
      {isLoading ? (
        <>
          <LoadingSpinner size="small" />
          <span>Uploading...</span>
        </>
      ) : (
        <>
          <svg
            className="w-5 h-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12"
            />
          </svg>
          <span>{text}</span>
        </>
      )}
    </button>
  );
};

UploadButton.propTypes = {
  text: PropTypes.string,
  isLoading: PropTypes.bool,
  disabled: PropTypes.bool,
  onClick: PropTypes.func.isRequired,
  className: PropTypes.string
};

export default UploadButton;