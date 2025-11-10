import { useEffect, useState } from 'react'
import { useLoading } from '../../contexts/LoadingContext'
import './LuxuryLoader.css'

export function LuxuryLoader() {
  const { stopLoading } = useLoading()
  const [progress, setProgress] = useState(0)
  const [isComplete, setIsComplete] = useState(false)

  useEffect(() => {
    // Faster initial jump for better UX
    setProgress(10)
    
    // Realistic loading simulation
    const stages = [
      { target: 30, delay: 300 },   // Quick start
      { target: 50, delay: 500 },   // Loading assets
      { target: 75, delay: 700 },   // Processing
      { target: 90, delay: 400 },   // Almost done
      { target: 100, delay: 300 },  // Complete
    ]

    let currentStage = 0
    let currentProgress = 10

    const advanceStage = () => {
      if (currentStage >= stages.length) return

      const stage = stages[currentStage]
      const increment = (stage.target - currentProgress) / 20

      const interval = setInterval(() => {
        currentProgress += increment
        setProgress(Math.min(Math.round(currentProgress), stage.target))

        if (currentProgress >= stage.target) {
          clearInterval(interval)
          currentStage++
          
          if (currentStage < stages.length) {
            setTimeout(advanceStage, stage.delay)
          } else {
            // Loading complete
            setIsComplete(true)
            setTimeout(() => {
              stopLoading() // Hide the loader
            }, 1000) // Wait 1 second before fade out
          }
        }
      }, 50)
    }

    const initialDelay = setTimeout(advanceStage, 200)

    return () => {
      clearTimeout(initialDelay)
    }
  }, [stopLoading])

  // Calculate needle rotation (0° to 180°)
  // 0% = -90° (left), 100% = 90° (right)
  const needleRotation = (progress / 100) * 180 - 90

  return (
    <div className={`luxury-loader ${isComplete ? 'fade-out' : ''}`}>
      {/* Background (unchanged from Phase 1) */}
      <div className="luxury-bg">
        <div className="gradient-orb orb-gold"></div>
        <div className="gradient-orb orb-orange"></div>
        <div className="gradient-orb orb-cyan"></div>
        <div className="metallic-grid"></div>
      </div>

      {/* Main content */}
      <div className="luxury-content">
        {/* ==========================================
            SPEEDOMETER - NEW IN PHASE 2
            ========================================== */}
        <div className="speedometer-container">
          
          {/* Outer glowing ring */}
          <div className="speedometer-outer-ring">
            <svg viewBox="0 0 240 240" className="ring-svg">
              {/* Background circle */}
              <circle
                cx="120"
                cy="120"
                r="100"
                fill="none"
                stroke="rgba(255, 209, 102, 0.15)"
                strokeWidth="2"
              />
              
              {/* Progress arc (golden glow) */}
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

              {/* Gradient definition */}
              <defs>
                <linearGradient id="goldGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#FFD166" stopOpacity="1" />
                  <stop offset="50%" stopColor="#FF7A00" stopOpacity="1" />
                  <stop offset="100%" stopColor="#00E6FF" stopOpacity="0.8" />
                </linearGradient>
              </defs>
            </svg>
          </div>

          {/* Main speedometer dial */}
          <div className="speedometer-dial">
            
            {/* Tick marks around the dial */}
            <div className="tick-marks">
              {[0, 20, 40, 60, 80, 100].map((value, i) => {
                const angle = (i * 36) - 90 // -90° to 90° (180° total)
                const isActive = progress >= value
                
                return (
                  <div
                    key={value}
                    className={`tick-mark ${isActive ? 'active' : ''}`}
                    style={{
                      transform: `rotate(${angle}deg) translateY(-85px)`
                    }}
                  >
                    <div className="tick-line"></div>
                    <div className="tick-label">{value}</div>
                  </div>
                )
              })}
            </div>

            {/* Center hub with needle */}
            <div className="speedometer-center">
              
              {/* Pulsing glow behind needle */}
              <div className="center-glow"></div>
              
              {/* Rotating needle */}
              <div
                className="speedometer-needle"
                style={{
                  transform: `rotate(${needleRotation}deg)`
                }}
              >
                <div className="needle-shaft">
                  <div className="needle-tip"></div>
                </div>
              </div>

              {/* Center rivet */}
              <div className="center-rivet"></div>
            </div>

            {/* Digital speed reading */}
            <div className="speed-display">
              <div className="speed-number">{progress}</div>
              <div className="speed-unit">%</div>
            </div>
          </div>

          {/* Glow effects */}
          <div className="speedometer-glow"></div>
        </div>

        {/* ==========================================
            LUXURY TYPOGRAPHY - NEW IN PHASE 3
            ========================================== */}
        <div className="luxury-text-container">
          
          {/* Main title with animated ellipsis */}
          <h1 className="luxury-title">
            Revving Up Your Ride
            <span className="ellipsis">
              <span className="dot">.</span>
              <span className="dot">.</span>
              <span className="dot">.</span>
            </span>
          </h1>

          {/* Subtitle */}
          <p className="luxury-subtitle">
            Preparing Your Premium Experience
          </p>

          {/* Progress bar */}
          <div className="progress-bar-container">
            <div 
              className="progress-bar-fill"
              style={{ width: `${progress}%` }}
            ></div>
          </div>

          {/* Loading status text */}
          <div className="loading-status">
            {progress < 30 && "Initializing Systems..."}
            {progress >= 30 && progress < 60 && "Loading Luxury Assets..."}
            {progress >= 60 && progress < 90 && "Polishing Details..."}
            {progress >= 90 && progress < 100 && "Almost Ready..."}
            {progress === 100 && "Complete!"}
          </div>
        </div>

        {/* ==========================================
            GEOMETRIC ACCENTS - NEW IN PHASE 4
            ========================================== */}
        <div className="geometric-accents">
          {/* Top Left Corner */}
          <div className="accent-corner top-left">
            <svg viewBox="0 0 100 100" className="corner-svg">
              <path
                d="M 0,40 L 0,0 L 40,0"
                stroke="url(#cornerGradient)"
                strokeWidth="2"
                fill="none"
                strokeLinecap="round"
              />
              <path
                d="M 0,30 L 0,10 L 30,10"
                stroke="url(#cornerGradient)"
                strokeWidth="1"
                fill="none"
                strokeLinecap="round"
                opacity="0.5"
              />
            </svg>
          </div>

          {/* Top Right Corner */}
          <div className="accent-corner top-right">
            <svg viewBox="0 0 100 100" className="corner-svg">
              <path
                d="M 100,40 L 100,0 L 60,0"
                stroke="url(#cornerGradient)"
                strokeWidth="2"
                fill="none"
                strokeLinecap="round"
              />
              <path
                d="M 100,30 L 100,10 L 70,10"
                stroke="url(#cornerGradient)"
                strokeWidth="1"
                fill="none"
                strokeLinecap="round"
                opacity="0.5"
              />
            </svg>
          </div>

          {/* Bottom Left Corner */}
          <div className="accent-corner bottom-left">
            <svg viewBox="0 0 100 100" className="corner-svg">
              <path
                d="M 0,60 L 0,100 L 40,100"
                stroke="url(#cornerGradient)"
                strokeWidth="2"
                fill="none"
                strokeLinecap="round"
              />
              <path
                d="M 0,70 L 0,90 L 30,90"
                stroke="url(#cornerGradient)"
                strokeWidth="1"
                fill="none"
                strokeLinecap="round"
                opacity="0.5"
              />
            </svg>
          </div>

          {/* Bottom Right Corner */}
          <div className="accent-corner bottom-right">
            <svg viewBox="0 0 100 100" className="corner-svg">
              <path
                d="M 100,60 L 100,100 L 60,100"
                stroke="url(#cornerGradient)"
                strokeWidth="2"
                fill="none"
                strokeLinecap="round"
              />
              <path
                d="M 100,70 L 100,90 L 70,90"
                stroke="url(#cornerGradient)"
                strokeWidth="1"
                fill="none"
                strokeLinecap="round"
                opacity="0.5"
              />
            </svg>
          </div>

          {/* SVG Gradient Definition */}
          <svg width="0" height="0">
            <defs>
              <linearGradient id="cornerGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#FFD166" stopOpacity="0.6" />
                <stop offset="50%" stopColor="#FF7A00" stopOpacity="0.4" />
                <stop offset="100%" stopColor="#00E6FF" stopOpacity="0.3" />
              </linearGradient>
            </defs>
          </svg>
        </div>

      </div> {/* End of luxury-content */}

      {/* ==========================================
          BRUSHED METAL REFLECTIONS
          ========================================== */}
      <div className="metallic-reflections">
        {/* Horizontal sweep reflection */}
        <div className="reflection horizontal-sweep"></div>
        
        {/* Vertical sweep reflection */}
        <div className="reflection vertical-sweep"></div>
        
        {/* Diagonal reflection 1 */}
        <div className="reflection diagonal-sweep-1"></div>
        
        {/* Diagonal reflection 2 */}
        <div className="reflection diagonal-sweep-2"></div>
      </div>

      {/* ==========================================
          MOTION BLUR ELEMENTS
          ========================================== */}
      <div className="motion-blur-container">
        {/* Speed lines */}
        <div className="speed-line speed-line-1"></div>
        <div className="speed-line speed-line-2"></div>
        <div className="speed-line speed-line-3"></div>
        <div className="speed-line speed-line-4"></div>
        <div className="speed-line speed-line-5"></div>
      </div>

      {/* ==========================================
          PREMIUM VIGNETTE OVERLAY
          ========================================== */}
      <div className="vignette-overlay"></div>

    </div>
  )
}