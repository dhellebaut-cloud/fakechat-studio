import React from 'react'

export default function TypingIndicator({ dark }) {
  return (
    <div className="typing-indicator">
      <span className="typing-dot" style={{ animationDelay: '0ms' }} />
      <span className="typing-dot" style={{ animationDelay: '180ms' }} />
      <span className="typing-dot" style={{ animationDelay: '360ms' }} />
    </div>
  )
}
