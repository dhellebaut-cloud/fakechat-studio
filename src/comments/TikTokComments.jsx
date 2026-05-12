import React, { useState, useRef, useEffect } from 'react'
import { useCommentsStore } from '../commentsStore'
import Avatar from '../Avatar'

const SHEET_HEIGHT = 510

function CommentRow({ comment, replies = [], level = 0 }) {
  const [showReplies, setShowReplies] = useState(false)
  const isReply = level > 0

  return (
    <div style={{ marginLeft: isReply ? 44 : 0 }}>
      <div style={{ display: 'flex', gap: 10, padding: isReply ? '6px 0' : '8px 0' }}>
        <div style={{ position: 'relative', flexShrink: 0 }}>
          <Avatar contact={{ name: comment.username, color: comment.avatarColor, avatar: comment.avatar }} size={isReply ? 28 : 36} />
          {comment.hasCreatorHeart && (
            <div style={{
              position: 'absolute', bottom: -2, right: -2,
              width: 16, height: 16, borderRadius: '50%',
              background: 'linear-gradient(135deg, #ff0050, #ff4081)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 8, border: '1.5px solid #1a1a1a',
            }}>❤</div>
          )}
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 2 }}>
            {comment.isPinned && (
              <span style={{ fontSize: 9, color: '#fe2c55', fontWeight: 600, background: 'rgba(254,44,85,0.15)', padding: '1px 5px', borderRadius: 3 }}>Pinned</span>
            )}
            <span style={{ fontSize: 13, fontWeight: 600, color: '#fff' }}>
              {comment.username}
              {comment.isVerified && <span style={{ marginLeft: 3, color: '#20D5EC', fontSize: 11 }}>✓</span>}
            </span>
          </div>
          <p style={{ fontSize: 14, color: '#e0e0e0', margin: 0, lineHeight: 1.4, wordBreak: 'break-word' }}>{comment.text}</p>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginTop: 5 }}>
            <span style={{ fontSize: 11, color: '#888' }}>{comment.timestamp}</span>
            <button style={{ fontSize: 11, color: '#888', background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}>Reply</button>
          </div>
          {!isReply && replies.length > 0 && (
            <button
              onClick={() => setShowReplies(v => !v)}
              style={{ marginTop: 6, fontSize: 12, color: '#aaa', background: 'none', border: 'none', cursor: 'pointer', padding: 0, display: 'flex', alignItems: 'center', gap: 4 }}
            >
              <span style={{ display: 'inline-block', transform: showReplies ? 'rotate(90deg)' : 'none', transition: 'transform 0.15s' }}>▸</span>
              {showReplies ? 'Hide' : `View ${replies.length}`} {replies.length === 1 ? 'reply' : 'replies'}
            </button>
          )}
        </div>
        <div style={{ flexShrink: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2 }}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
            <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" fill="none" stroke="#888" strokeWidth="1.5"/>
          </svg>
          <span style={{ fontSize: 11, color: '#888' }}>{comment.likeCount || 0}</span>
        </div>
      </div>
      {showReplies && replies.map(r => (
        <CommentRow key={r.id} comment={r} replies={[]} level={1} />
      ))}
    </div>
  )
}

export default function TikTokComments() {
  const { comments, tikTokPost: p } = useCommentsStore()
  const scrollRef = useRef()

  useEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight
  }, [comments])

  const threads = comments
    .filter(c => !c.parentId)
    .map(c => ({ ...c, replies: comments.filter(r => r.parentId === c.id) }))

  const bg = p.thumbnail
    ? { backgroundImage: `url(${p.thumbnail})`, backgroundSize: 'cover', backgroundPosition: 'center' }
    : { background: `linear-gradient(180deg, ${p.thumbnailColor} 0%, #0a0a18 100%)` }

  return (
    <div data-platform="tiktok" style={{ width: '100%', height: '100%', position: 'relative', ...bg, fontFamily: 'system-ui, -apple-system, sans-serif' }}>

      {/* Status bar */}
      <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 50, display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0 20px', zIndex: 10, color: '#fff', fontSize: 15, fontWeight: 600 }}>
        <span>{/* time from outside context not needed here */}9:41</span>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <svg width="17" height="13" viewBox="0 0 122.26 93.66" fill="#fff"><path d="M119.26,93.62l-15.29-.02c-2.04,0-4.6-2.09-4.6-4.51l.02-84.81C99.39,1.74,101.97,0,104.01,0h13.54c2,0,4.67,1.74,4.67,4.27l.04,84.87c0,1.38-1.87,3.74-2.99,4.49Z"/><path d="M84.59,93.63h-13.58c-2.09-.02-4.71-2.12-4.71-4.45V29.06c0-2.31,2.64-4.43,4.7-4.43h13.59c2.08.02,4.31,2.24,4.57,4.59l-.03,59.78c0,2.36-2.56,4.63-4.54,4.63Z"/><path d="M52.25,93.54l-14.25.1c-2.04.01-4.87-2.12-4.87-4.4l-.03-40.22c0-2.06,2.27-4.59,4.08-4.58l15.09.04c1.69,0,3.69,2.98,3.69,4.67v39.93c0,1.63-2,4.44-3.71,4.45Z"/><path d="M19.33,93.57l-14.27.09c-2.46.02-5.03-1.75-5.03-4.43L0,61.9c0-1.45,2.62-3.9,4.05-3.9h14.53c1.45.01,3.79,2.33,4.25,3.9l-.02,27.45c0,1.36-2.16,4.2-3.47,4.21Z"/></svg>
          <svg width="16" height="13" viewBox="0 0 119.85 91.04" fill="#fff"><path d="M109.97,33.77c-29.1-24.93-70.79-25.14-100.02-.13L0,22.39c34.61-30.03,85.79-29.73,119.85.14l-9.88,11.24Z"/><path d="M90.44,56.39c-17.8-15.07-43.19-15.35-60.92,0l-9.77-11.38c23-19.98,57.03-20.08,80.29-.02l-9.6,11.4Z"/><path d="M59.9,91.04l-20.43-23.27c11.61-10.38,28.47-10.45,40.89-.25l-20.45,23.52Z"/></svg>
          <svg width="25" height="13" viewBox="0 0 144.85 66.52" fill="#fff"><path d="M119.14,66.52l-106.81-.02C5.12,66.5-.04,60.83,0,53.86L.24,9.71C.26,5.62,6.06.05,10.37.05L120.09,0c7.08,0,11.9,6.15,11.88,12.91l-.1,41.6c-.02,7.17-5.96,12.01-12.72,12.01ZM117.65,61.68c4.71,0,9.08-2.67,9.08-7.06V12.02c0-4.59-4.29-7.2-8.57-7.2l-105.82.05c-4.46,0-7.24,3.95-7.24,7.88v41.07c0,4.7,3.35,7.85,8.19,7.85h104.36Z"/><path d="M144.85,39.91c0,1.69-1.07,4.31-2.26,5.15-1.28.91-4.76,1.23-6.29.84v-25.31c1.35-.29,4.05-.26,5.26.21,1.37.53,3.27,3.47,3.27,5.01l.02,14.11Z"/><path d="M114.34,56.65H17.44c-4.32-.37-7.47-3.51-7.47-7.82l-.02-31.11c0-3.86,3.11-7.86,7.33-7.86h96.8c4.61,0,7.77,3.9,7.77,8.08v30.67c0,4.18-2.71,7.44-7.51,8.04Z"/></svg>
        </div>
      </div>

      {/* Right-side action buttons */}
      <div style={{ position: 'absolute', right: 10, bottom: SHEET_HEIGHT + 16, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 20, zIndex: 10 }}>
        {/* Creator avatar */}
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

      {/* Comment sheet */}
      <div style={{
        position: 'absolute', bottom: 0, left: 0, right: 0,
        height: SHEET_HEIGHT,
        background: 'rgba(22, 24, 28, 0.97)',
        borderRadius: '16px 16px 0 0',
        display: 'flex', flexDirection: 'column',
        zIndex: 20,
      }}>
        {/* Drag handle */}
        <div style={{ display: 'flex', justifyContent: 'center', padding: '10px 0 4px' }}>
          <div style={{ width: 36, height: 4, borderRadius: 2, background: '#555' }} />
        </div>

        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', padding: '0 16px 10px', position: 'relative' }}>
          <span style={{ fontSize: 15, fontWeight: 700, color: '#fff' }}>{comments.length} Comments</span>
          <button style={{ position: 'absolute', right: 16, background: 'none', border: 'none', color: '#888', fontSize: 20, cursor: 'pointer', padding: 4 }}>✕</button>
        </div>

        {/* Comment list */}
        <div ref={scrollRef} style={{ flex: 1, overflowY: 'auto', padding: '0 12px' }}>
          {threads.length === 0 && (
            <div style={{ textAlign: 'center', color: '#666', fontSize: 13, paddingTop: 32 }}>No comments yet</div>
          )}
          {threads.map(thread => (
            <CommentRow key={thread.id} comment={thread} replies={thread.replies} level={0} />
          ))}
        </div>

        {/* Input bar */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '10px 12px 20px', borderTop: '0.5px solid #333' }}>
          <div style={{ width: 32, height: 32, borderRadius: '50%', background: '#333', flexShrink: 0 }} />
          <div style={{ flex: 1, background: '#2a2a2a', borderRadius: 20, padding: '8px 14px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <span style={{ color: '#666', fontSize: 14 }}>Add comment…</span>
            <div style={{ display: 'flex', gap: 10 }}>
              <span style={{ fontSize: 18 }}>😊</span>
              <span style={{ fontSize: 18 }}>@</span>
              <span style={{ fontSize: 18 }}>#</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
