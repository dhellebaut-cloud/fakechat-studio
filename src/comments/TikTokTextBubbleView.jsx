import React from 'react'
import { useCommentsStore } from '../commentsStore'
import Avatar from '../Avatar'

const SHEET_HEIGHT = 510

export default function TikTokTextBubbleView() {
  const { tikTokTextBubble: b, tikTokPost: p } = useCommentsStore()

  const bg = p.thumbnail
    ? { backgroundImage: `url(${p.thumbnail})`, backgroundSize: 'cover', backgroundPosition: 'center' }
    : { background: `linear-gradient(180deg, ${p.thumbnailColor} 0%, #0a0a18 100%)` }

  return (
    <div data-platform="tiktok" style={{ width: '100%', height: '100%', position: 'relative', ...bg, fontFamily: 'system-ui, -apple-system, sans-serif' }}>

      {/* Status bar */}
      <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 50, display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0 20px', zIndex: 10, color: '#fff', fontSize: 15, fontWeight: 600 }}>
        <span>9:41</span>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <svg width="17" height="13" viewBox="0 0 122.26 93.66" fill="#fff"><path d="M119.26,93.62l-15.29-.02c-2.04,0-4.6-2.09-4.6-4.51l.02-84.81C99.39,1.74,101.97,0,104.01,0h13.54c2,0,4.67,1.74,4.67,4.27l.04,84.87c0,1.38-1.87,3.74-2.99,4.49Z"/><path d="M84.59,93.63h-13.58c-2.09-.02-4.71-2.12-4.71-4.45V29.06c0-2.31,2.64-4.43,4.7-4.43h13.59c2.08.02,4.31,2.24,4.57,4.59l-.03,59.78c0,2.36-2.56,4.63-4.54,4.63Z"/><path d="M52.25,93.54l-14.25.1c-2.04.01-4.87-2.12-4.87-4.4l-.03-40.22c0-2.06,2.27-4.59,4.08-4.58l15.09.04c1.69,0,3.69,2.98,3.69,4.67v39.93c0,1.63-2,4.44-3.71,4.45Z"/><path d="M19.33,93.57l-14.27.09c-2.46.02-5.03-1.75-5.03-4.43L0,61.9c0-1.45,2.62-3.9,4.05-3.9h14.53c1.45.01,3.79,2.33,4.25,3.9l-.02,27.45c0,1.36-2.16,4.2-3.47,4.21Z"/></svg>
          <svg width="16" height="13" viewBox="0 0 119.85 91.04" fill="#fff"><path d="M109.97,33.77c-29.1-24.93-70.79-25.14-100.02-.13L0,22.39c34.61-30.03,85.79-29.73,119.85.14l-9.88,11.24Z"/><path d="M90.44,56.39c-17.8-15.07-43.19-15.35-60.92,0l-9.77-11.38c23-19.98,57.03-20.08,80.29-.02l-9.6,11.4Z"/><path d="M59.9,91.04l-20.43-23.27c11.61-10.38,28.47-10.45,40.89-.25l-20.45,23.52Z"/></svg>
          <svg width="25" height="13" viewBox="0 0 144.85 66.52" fill="#fff"><path d="M119.14,66.52l-106.81-.02C5.12,66.5-.04,60.83,0,53.86L.24,9.71C.26,5.62,6.06.05,10.37.05L120.09,0c7.08,0,11.9,6.15,11.88,12.91l-.1,41.6c-.02,7.17-5.96,12.01-12.72,12.01ZM117.65,61.68c4.71,0,9.08-2.67,9.08-7.06V12.02c0-4.59-4.29-7.2-8.57-7.2l-105.82.05c-4.46,0-7.24,3.95-7.24,7.88v41.07c0,4.7,3.35,7.85,8.19,7.85h104.36Z"/><path d="M144.85,39.91c0,1.69-1.07,4.31-2.26,5.15-1.28.91-4.76,1.23-6.29.84v-25.31c1.35-.29,4.05-.26,5.26.21,1.37.53,3.27,3.47,3.27,5.01l.02,14.11Z"/><path d="M114.34,56.65H17.44c-4.32-.37-7.47-3.51-7.47-7.82l-.02-31.11c0-3.86,3.11-7.86,7.33-7.86h96.8c4.61,0,7.77,3.9,7.77,8.08v30.67c0,4.18-2.71,7.44-7.51,8.04Z"/></svg>
        </div>
      </div>

      {/* Right-side action buttons */}
      <div style={{ position: 'absolute', right: 10, bottom: SHEET_HEIGHT + 16, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 20, zIndex: 10 }}>
        <div style={{ position: 'relative' }}>
          <Avatar contact={{ name: p.creatorDisplayName, color: p.creatorAvatarColor, avatar: p.creatorAvatar }} size={44} />
          <div style={{ position: 'absolute', bottom: -8, left: '50%', transform: 'translateX(-50%)', width: 20, height: 20, borderRadius: '50%', background: '#fe2c55', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 14, color: '#fff', fontWeight: 700, border: '2px solid #000' }}>+</div>
        </div>
        {[
          { icon: '♥', label: p.likeCount },
          { icon: '💬', label: p.commentCount },
          { icon: '↗', label: p.shareCount },
          { icon: '🔖', label: p.bookmarkCount },
        ].map(({ icon, label }) => (
          <div key={icon} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2 }}>
            <span style={{ fontSize: 28, color: '#fff', lineHeight: 1 }}>{icon}</span>
            <span style={{ fontSize: 11, color: '#fff', fontWeight: 600 }}>{label}</span>
          </div>
        ))}
      </div>

      {/* Creator info — bottom left */}
      <div style={{ position: 'absolute', left: 12, bottom: SHEET_HEIGHT + 16, right: 60, zIndex: 10 }}>
        <p style={{ margin: 0, fontWeight: 700, fontSize: 15, color: '#fff' }}>{p.creatorUsername}</p>
        <p style={{ margin: '4px 0', fontSize: 13, color: '#fff', lineHeight: 1.3 }}>{p.caption}</p>
        <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
          <span style={{ fontSize: 13 }}>🎵</span>
          <span style={{ fontSize: 12, color: '#fff' }}>{p.songName}</span>
        </div>
      </div>

      {/* Text bubble positioned where comment sheet would be */}
      <div style={{
        position: 'absolute', bottom: 0, left: 0, right: 0,
        height: SHEET_HEIGHT,
        background: 'rgba(22, 24, 28, 0.97)',
        borderRadius: '16px 16px 0 0',
        display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
        zIndex: 20,
        padding: '0 20px',
      }}>
        <TextBubble b={b} />
      </div>
    </div>
  )
}

function TextBubble({ b }) {
  return (
    <div style={{ position: 'relative', width: '100%' }}>
      {/* Speech bubble */}
      <div style={{
        background: '#ffffff',
        borderRadius: 18,
        padding: '16px 18px',
        position: 'relative',
        boxShadow: '0 4px 24px rgba(0,0,0,0.35)',
      }}>
        {/* Reply-to label */}
        <div style={{ fontSize: 13, color: '#888', marginBottom: 10, fontWeight: 400 }}>
          Reply to <span style={{ fontWeight: 600, color: '#555' }}>{b.replyToUsername}</span>'s comment
        </div>

        {/* Comment row: avatar + text */}
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
          }}>
            {b.text}
          </p>
        </div>

        {/* Bubble tail — bottom left */}
        <div style={{
          position: 'absolute',
          bottom: -14,
          left: 24,
          width: 0,
          height: 0,
          borderLeft: '14px solid transparent',
          borderRight: '0px solid transparent',
          borderTop: '14px solid #ffffff',
        }} />
      </div>
    </div>
  )
}
