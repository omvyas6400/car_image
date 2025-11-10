import { useEffect, useState } from 'react'
import './LuxuryLoader.css'

interface UploadLoaderProps {
  isVisible: boolean
  uploadProgress?: number // 0-100
}

export function UploadLoader({ isVisible, uploadProgress = 0 }: UploadLoaderProps) {
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    if (uploadProgress > 0) {
      setProgress(uploadProgress)
    }
  }, [uploadProgress])

  if (!isVisible) return null

  const needleRotation = (progress / 100) * 180 - 90

  return (
    <div className="upload-loader-overlay">
      <div className="upload-loader-content">
        {/* Smaller speedometer */}
        <div className="speedometer-container small">
          <div className="speedometer-outer-ring">
            <svg viewBox="0 0 240 240" className="ring-svg">
              <circle
                cx="120"
                cy="120"
                r="100"
                fill="none"
                stroke="rgba(255, 209, 102, 0.15)"
                strokeWidth="2"
              />
              <circle
                cx="120"
                cy="120"
                r="100"
                fill="none"
                stroke="url(#goldGradient)"
                strokeWidth="4"
                strokeLinecap="round"
                strokeDasharray={`${(progress / 100) * 628} 628`}
                className="progress-arc"
                style={{ 
                  transform: 'rotate(-90deg)',
                  transformOrigin: '120px 120px'
                }}
              />
              <defs>
                <linearGradient id="goldGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#FFD166" />
                  <stop offset="50%" stopColor="#FF7A00" />
                  <stop offset="100%" stopColor="#00E6FF" />
                </linearGradient>
              </defs>
            </svg>
          </div>

          <div className="speedometer-dial">
            <div className="speedometer-center">
              <div
                className="speedometer-needle"
                style={{ transform: `rotate(${needleRotation}deg)` }}
              >
                <div className="needle-shaft">
                  <div className="needle-tip"></div>
                </div>
              </div>
              <div className="center-rivet"></div>
            </div>

            <div className="speed-display">
              <div className="speed-number">{progress}</div>
              <div className="speed-unit">%</div>
            </div>
          </div>
        </div>

        {/* Upload text */}
        <div className="upload-loader-text">
          <h3 className="upload-title">Uploading Your Image</h3>
          <p className="upload-status">
            {progress < 50 && "Processing..."}
            {progress >= 50 && progress < 80 && "Generating AI Metadata..."}
            {progress >= 80 && progress < 100 && "Finalizing..."}
            {progress === 100 && "Complete!"}
          </p>
        </div>
      </div>
    </div>
  )
}