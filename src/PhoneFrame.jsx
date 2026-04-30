import React from 'react'

const FRAME_W = 393
const FRAME_H = 852

export default function PhoneFrame({ children, scale = 1 }) {
  return (
    // Outer wrapper: takes up only the scaled layout space
    <div style={{
      width: FRAME_W * scale,
      height: FRAME_H * scale,
      position: 'relative',
      flexShrink: 0,
    }}>
      {/* Inner scaler: full-size but scaled from top-left, visually fits the wrapper */}
      <div style={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: FRAME_W,
        height: FRAME_H,
        transformOrigin: 'top left',
        transform: `scale(${scale})`,
      }}>
        {/* Side buttons */}
        <div className="phone-btn phone-btn-power" />
        <div className="phone-btn phone-btn-vol-up" />
        <div className="phone-btn phone-btn-vol-down" />
        <div className="phone-btn phone-btn-mute" />

        {/* Frame body */}
        <div className="phone-frame">
          <div className="phone-screen" id="phone-screen">
            <div className="dynamic-island">
              <div className="di-inner" />
            </div>
            <div className="phone-content">
              {children}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
