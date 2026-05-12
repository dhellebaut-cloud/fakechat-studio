import React from 'react'
import { useCommentsStore } from '../commentsStore'
import Avatar from '../Avatar'

const BUBBLE_WIDTH = 420

function segmentStyle(style) {
  if (style === 'highlight') return { background: '#FFE600', borderRadius: 3, padding: '0 2px' }
  if (style === 'blur') return { filter: 'blur(6px)', userSelect: 'none' }
  return {}
}

function VerifiedBadge() {
  return (
    <svg
      width="17" height="17"
      viewBox="0 0 24 24"
      style={{ verticalAlign: 'middle', marginLeft: 4, marginRight: 1, flexShrink: 0 }}
    >
      <circle cx="12" cy="12" r="12" fill="#20D5EC" />
      <path
        d="M7.5 12.4L10.4 15.5L16.5 8.5"
        stroke="white" strokeWidth="2.4"
        strokeLinecap="round" strokeLinejoin="round"
        fill="none"
      />
    </svg>
  )
}

export function BubbleContent({ b }) {
  return (
    /**
     * #bubble-preview wraps the white box + the tail.
     * paddingBottom creates space so the tail sits INSIDE the bounding box,
     * which means html-to-image will capture the full tail on export.
     */
    <div
      id="bubble-preview"
      style={{
        position: 'relative',
        width: BUBBLE_WIDTH,
        paddingBottom: 16,   // room for the tail
        boxSizing: 'border-box',
      }}
    >
      {/* White bubble */}
      <div style={{
        background: '#ffffff',
        borderRadius: 18,
        padding: '16px 18px 20px',
        boxShadow: '0 4px 28px rgba(0,0,0,0.15)',
        width: '100%',
        boxSizing: 'border-box',
      }}>
        {/* Reply-to label */}
        <div style={{
          fontSize: 13,
          color: '#999',
          marginBottom: 12,
          display: 'flex',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: 0,
          lineHeight: 1.4,
        }}>
          <span>Reply to&nbsp;</span>
          <span style={{ fontWeight: 600, color: '#555' }}>{b.replyToUsername}</span>
          {b.isVerified && <VerifiedBadge />}
          <span>'s comment</span>
        </div>

        {/* Avatar + comment text */}
        <div style={{ display: 'flex', gap: 12, alignItems: 'flex-start' }}>
          <div style={{ flexShrink: 0 }}>
            <Avatar contact={{ name: b.username, color: b.avatarColor, avatar: b.avatar }} size={40} />
          </div>
          <p style={{
            margin: 0,
            fontSize: 22,
            fontWeight: 700,
            color: '#111',
            lineHeight: 1.35,
            wordBreak: 'break-word',
            flex: 1,
            minWidth: 0,
          }}>
            {(b.segments || []).map((seg, i) => (
              <span key={i} style={segmentStyle(seg.style)}>{seg.text}</span>
            ))}
          </p>
        </div>
      </div>

      {/* Tail — sits in the paddingBottom area, fully inside #bubble-preview bounds */}
      <div style={{
        position: 'absolute',
        bottom: 2,
        left: 26,
        width: 0,
        height: 0,
        borderLeft: '14px solid transparent',
        borderTop: '14px solid #ffffff',
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
      padding: '28px 24px 24px',
    }}>
      <BubbleContent b={b} />
    </div>
  )
}
