import React from 'react'
import { useCommentsStore } from '../commentsStore'
import Avatar from '../Avatar'

function segmentStyle(style) {
  if (style === 'highlight') return { background: '#FFE600', borderRadius: 3, padding: '0 2px' }
  if (style === 'blur') return { filter: 'blur(6px)', userSelect: 'none' }
  return {}
}

export function BubbleContent({ b }) {
  return (
    <div style={{
      background: '#ffffff',
      borderRadius: 18,
      padding: '16px 18px 20px',
      position: 'relative',
      boxShadow: '0 4px 28px rgba(0,0,0,0.18)',
      display: 'inline-block',
      minWidth: 220,
      maxWidth: '100%',
    }}>
      {/* Reply-to label */}
      <div style={{ fontSize: 13, color: '#999', marginBottom: 12, fontWeight: 400 }}>
        Reply to <span style={{ fontWeight: 600, color: '#555' }}>{b.replyToUsername}</span>'s comment
      </div>

      {/* Avatar + text */}
      <div style={{ display: 'flex', gap: 12, alignItems: 'flex-start' }}>
        <div style={{ flexShrink: 0 }}>
          <Avatar contact={{ name: b.username, color: b.avatarColor, avatar: b.avatar }} size={40} />
        </div>
        <div style={{ flex: 1 }}>
          {b.isVerified && (
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4, fontSize: 12, color: '#20D5EC', fontWeight: 600, marginBottom: 4 }}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="#20D5EC"><path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17z"/></svg>
              {b.username}
            </span>
          )}
          <p style={{
            margin: 0,
            fontSize: 22,
            fontWeight: 700,
            color: '#111',
            lineHeight: 1.35,
            wordBreak: 'break-word',
          }}>
            {(b.segments || []).map((seg, i) => (
              <span key={i} style={segmentStyle(seg.style)}>{seg.text}</span>
            ))}
          </p>
        </div>
      </div>

      {/* Bubble tail — bottom left */}
      <div style={{
        position: 'absolute',
        bottom: -13,
        left: 26,
        width: 0,
        height: 0,
        borderLeft: '13px solid transparent',
        borderRight: '0px solid transparent',
        borderTop: '13px solid #ffffff',
        filter: 'drop-shadow(0 4px 4px rgba(0,0,0,0.08))',
      }} />
    </div>
  )
}

export default function TextBubbleDisplay() {
  const { tikTokTextBubble: b } = useCommentsStore()

  return (
    <div style={{
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'flex-start',
      padding: '28px 24px 16px',
    }}>
      {/* Transparent wrapper — this is what gets exported */}
      <div id="bubble-preview" style={{ display: 'inline-block' }}>
        <BubbleContent b={b} />
      </div>
    </div>
  )
}
