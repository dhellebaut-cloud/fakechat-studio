import React, { useState, useRef, useEffect } from 'react'
import { useCommentsStore } from '../commentsStore'
import Avatar from '../Avatar'

function CommentRow({ comment, replies = [], dark }) {
  const [showReplies, setShowReplies] = useState(false)
  const sub = dark ? '#8E8E93' : '#8E8E93'
  const text = dark ? '#fff' : '#262626'

  return (
    <div style={{ marginBottom: 14 }}>
      <div style={{ display: 'flex', gap: 10, alignItems: 'flex-start' }}>
        <Avatar contact={{ name: comment.username, color: comment.avatarColor, avatar: comment.avatar }} size={32} />
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontSize: 14, color: text, lineHeight: 1.5 }}>
            <span style={{ fontWeight: 700 }}>
              {comment.username}
              {comment.isVerified && <span style={{ marginLeft: 3, color: '#0095F6', fontSize: 12 }}>✓</span>}
            </span>
            {' '}{comment.text}
          </div>
          <div style={{ display: 'flex', gap: 14, marginTop: 6 }}>
            <span style={{ fontSize: 12, color: sub }}>{comment.timestamp}</span>
            {comment.likeCount > 0 && <span style={{ fontSize: 12, color: sub, fontWeight: 600 }}>{comment.likeCount} likes</span>}
            <button style={{ fontSize: 12, fontWeight: 700, color: sub, background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}>Reply</button>
          </div>
          {replies.length > 0 && (
            <button
              onClick={() => setShowReplies(v => !v)}
              style={{ marginTop: 8, fontSize: 12, fontWeight: 700, color: sub, background: 'none', border: 'none', cursor: 'pointer', padding: 0, display: 'flex', alignItems: 'center', gap: 6 }}
            >
              <div style={{ width: 20, height: 1, background: sub }} />
              {showReplies ? 'Hide replies' : `View ${replies.length} ${replies.length === 1 ? 'reply' : 'replies'}`}
            </button>
          )}
          {showReplies && (
            <div style={{ marginTop: 10 }}>
              {replies.map(r => (
                <CommentRow key={r.id} comment={r} replies={[]} dark={dark} />
              ))}
            </div>
          )}
        </div>
        <button style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '2px 0 0', flexShrink: 0 }}>
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke={sub} strokeWidth="2">
            <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
          </svg>
        </button>
      </div>
    </div>
  )
}

export default function InstagramComments() {
  const { comments, instagramPost: p, darkMode: dark } = useCommentsStore()
  const scrollRef = useRef()

  useEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight
  }, [comments])

  const bg = dark ? '#000' : '#fff'
  const text = dark ? '#fff' : '#262626'
  const sub = dark ? '#8E8E93' : '#8E8E93'
  const border = dark ? '#262626' : '#EFEFEF'
  const inputBg = dark ? '#000' : '#fff'

  const threads = comments
    .filter(c => !c.parentId)
    .map(c => ({ ...c, replies: comments.filter(r => r.parentId === c.id) }))

  return (
    <div data-platform="instagram" style={{ width: '100%', height: '100%', display: 'flex', flexDirection: 'column', background: bg, fontFamily: 'system-ui, -apple-system, sans-serif', overflowY: 'auto' }}>

      {/* Status bar */}
      <div style={{ background: bg, display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0 20px', height: 50, flexShrink: 0, color: text, fontSize: 15, fontWeight: 600 }}>
        <span>9:41</span>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <svg width="17" height="13" viewBox="0 0 122.26 93.66" fill={text}><path d="M119.26,93.62l-15.29-.02c-2.04,0-4.6-2.09-4.6-4.51l.02-84.81C99.39,1.74,101.97,0,104.01,0h13.54c2,0,4.67,1.74,4.67,4.27l.04,84.87c0,1.38-1.87,3.74-2.99,4.49Z"/><path d="M84.59,93.63h-13.58c-2.09-.02-4.71-2.12-4.71-4.45V29.06c0-2.31,2.64-4.43,4.7-4.43h13.59c2.08.02,4.31,2.24,4.57,4.59l-.03,59.78c0,2.36-2.56,4.63-4.54,4.63Z"/><path d="M52.25,93.54l-14.25.1c-2.04.01-4.87-2.12-4.87-4.4l-.03-40.22c0-2.06,2.27-4.59,4.08-4.58l15.09.04c1.69,0,3.69,2.98,3.69,4.67v39.93c0,1.63-2,4.44-3.71,4.45Z"/><path d="M19.33,93.57l-14.27.09c-2.46.02-5.03-1.75-5.03-4.43L0,61.9c0-1.45,2.62-3.9,4.05-3.9h14.53c1.45.01,3.79,2.33,4.25,3.9l-.02,27.45c0,1.36-2.16,4.2-3.47,4.21Z"/></svg>
          <svg width="16" height="13" viewBox="0 0 119.85 91.04" fill={text}><path d="M109.97,33.77c-29.1-24.93-70.79-25.14-100.02-.13L0,22.39c34.61-30.03,85.79-29.73,119.85.14l-9.88,11.24Z"/><path d="M90.44,56.39c-17.8-15.07-43.19-15.35-60.92,0l-9.77-11.38c23-19.98,57.03-20.08,80.29-.02l-9.6,11.4Z"/><path d="M59.9,91.04l-20.43-23.27c11.61-10.38,28.47-10.45,40.89-.25l-20.45,23.52Z"/></svg>
          <svg width="25" height="13" viewBox="0 0 144.85 66.52" fill={text}><path d="M119.14,66.52l-106.81-.02C5.12,66.5-.04,60.83,0,53.86L.24,9.71C.26,5.62,6.06.05,10.37.05L120.09,0c7.08,0,11.9,6.15,11.88,12.91l-.1,41.6c-.02,7.17-5.96,12.01-12.72,12.01ZM117.65,61.68c4.71,0,9.08-2.67,9.08-7.06V12.02c0-4.59-4.29-7.2-8.57-7.2l-105.82.05c-4.46,0-7.24,3.95-7.24,7.88v41.07c0,4.7,3.35,7.85,8.19,7.85h104.36Z"/><path d="M144.85,39.91c0,1.69-1.07,4.31-2.26,5.15-1.28.91-4.76,1.23-6.29.84v-25.31c1.35-.29,4.05-.26,5.26.21,1.37.53,3.27,3.47,3.27,5.01l.02,14.11Z"/><path d="M114.34,56.65H17.44c-4.32-.37-7.47-3.51-7.47-7.82l-.02-31.11c0-3.86,3.11-7.86,7.33-7.86h96.8c4.61,0,7.77,3.9,7.77,8.08v30.67c0,4.18-2.71,7.44-7.51,8.04Z"/></svg>
        </div>
      </div>

      {/* Post header */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '8px 12px', borderBottom: `0.5px solid ${border}`, flexShrink: 0 }}>
        <button style={{ background: 'none', border: 'none', cursor: 'pointer', color: text, fontSize: 20, padding: 0 }}>←</button>
        <Avatar contact={{ name: p.username, color: p.avatarColor, avatar: p.avatar }} size={32} />
        <div style={{ flex: 1 }}>
          <span style={{ fontSize: 14, fontWeight: 700, color: text }}>{p.username}</span>
          {p.isVerified && <span style={{ marginLeft: 4, color: '#0095F6', fontSize: 12 }}>✓</span>}
        </div>
        <button style={{ background: 'none', border: 'none', cursor: 'pointer', color: text, fontSize: 20, padding: 0 }}>···</button>
      </div>

      {/* Post image */}
      {p.postImage ? (
        <img src={p.postImage} alt="" style={{ width: '100%', aspectRatio: '1', objectFit: 'cover', flexShrink: 0 }} />
      ) : (
        <div style={{ width: '100%', aspectRatio: '1', background: dark ? '#1c1c1c' : '#F5F5F5', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
          <span style={{ fontSize: 36, opacity: 0.3 }}>🖼</span>
        </div>
      )}

      {/* Action bar */}
      <div style={{ display: 'flex', alignItems: 'center', padding: '10px 12px 6px', gap: 14, flexShrink: 0 }}>
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke={text} strokeWidth="1.5"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke={text} strokeWidth="1.5"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke={text} strokeWidth="1.5"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg>
        <div style={{ flex: 1 }} />
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke={text} strokeWidth="1.5"><path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"/></svg>
      </div>

      {/* Like count + caption */}
      <div style={{ padding: '0 12px 8px', flexShrink: 0 }}>
        <div style={{ fontSize: 14, fontWeight: 700, color: text, marginBottom: 6 }}>{p.likeCount.toLocaleString()} likes</div>
        {p.caption && (
          <div style={{ fontSize: 14, color: text }}>
            <span style={{ fontWeight: 700 }}>{p.username}</span>
            {p.isVerified && <span style={{ marginLeft: 4, color: '#0095F6', fontSize: 12 }}>✓</span>}
            {' '}{p.caption}
          </div>
        )}
      </div>

      {/* Comments */}
      <div ref={scrollRef} style={{ flex: 1, padding: '0 12px', borderTop: `0.5px solid ${border}`, paddingTop: 12 }}>
        {threads.length === 0 && (
          <div style={{ textAlign: 'center', color: sub, fontSize: 13, paddingTop: 16 }}>No comments yet</div>
        )}
        {threads.map(thread => (
          <CommentRow key={thread.id} comment={thread} replies={thread.replies} dark={dark} />
        ))}
      </div>

      {/* Comment input */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '10px 12px 28px', borderTop: `0.5px solid ${border}`, background: inputBg, flexShrink: 0 }}>
        <div style={{ width: 32, height: 32, borderRadius: '50%', background: dark ? '#333' : '#E5E5E5', flexShrink: 0 }} />
        <span style={{ flex: 1, fontSize: 14, color: sub }}>Add a comment…</span>
        <span style={{ fontSize: 18 }}>😊</span>
      </div>
    </div>
  )
}
