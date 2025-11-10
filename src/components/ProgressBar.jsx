import React from 'react';
import PropTypes from 'prop-types';

const ProgressBar = ({ progress, className = '' }) => {
  return (
    <div className={`w-full mt-4 ${className}`}>
      <div className="relative pt-1">
        <div className="flex mb-2 items-center justify-between">
          <div>
            <span className="text-xs font-semibold inline-block py-1 px-2 uppercase rounded-full text-[#00D9FF] bg-[#0F1419]">
              {progress < 100 ? 'Uploading' : 'Complete'}
            </span>
          </div>
          <div className="text-right">
            <span className="text-xs font-semibold inline-block text-[#00D9FF]">
              {Math.round(progress)}%
            </span>
          </div>
        </div>
        <div className="overflow-hidden h-2 mb-4 text-xs flex rounded-full bg-[#0F1419]">
          <div
            style={{ width: `${progress}%` }}
            className="
              shadow-none
              flex flex-col
              text-center
              whitespace-nowrap
              text-white
              justify-center
              transition-all
              duration-500
              bg-gradient-to-r from-[#00D9FF] to-[#00D9FF]/80
            "
          />
        </div>
      </div>
    </div>
  );
};

ProgressBar.propTypes = {
  progress: PropTypes.number.isRequired,
  className: PropTypes.string
};

export default ProgressBar;