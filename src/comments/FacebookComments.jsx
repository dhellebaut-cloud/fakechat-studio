import React, { useState, useRef, useEffect } from 'react'
import { useCommentsStore } from '../commentsStore'
import Avatar from '../Avatar'

const REACTION_EMOJIS = { like: '👍', love: '❤️', care: '🤗', haha: '😂', wow: '😮', sad: '😢', angry: '😡' }

function reactionSummary(reactions) {
  const total = Object.values(reactions).reduce((a, b) => a + b, 0)
  if (total === 0) return null
  const top = Object.entries(reactions)
    .filter(([, v]) => v > 0)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 3)
    .map(([k]) => REACTION_EMOJIS[k])
  return { emojis: top, total }
}

function CommentRow({ comment, replies = [], dark }) {
  const [showReplies, setShowReplies] = useState(false)
  const bg = dark ? '#3A3B3C' : '#F0F2F5'
  const text = dark ? '#E4E6EB' : '#050505'
  const sub = dark ? '#B0B3B8' : '#65676B'
  const reactionSummaryData = reactionSummary(comment.reactions)

  return (
    <div style={{ marginBottom: 12 }}>
      <div style={{ display: 'flex', gap: 8, alignItems: 'flex-start' }}>
        <Avatar contact={{ name: comment.username, color: comment.avatarColor, avatar: comment.avatar }} size={32} />
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ background: bg, borderRadius: 16, padding: '8px 12px', display: 'inline-block', maxWidth: '100%' }}>
            <span style={{ fontSize: 13, fontWeight: 700, color: text }}>{comment.username} </span>
            <span style={{ fontSize: 13, color: text }}>{comment.text}</span>
          </div>
          {reactionSummaryData && (
            <div style={{ display: 'flex', alignItems: 'center', gap: 3, marginTop: 2, marginLeft: 8 }}>
              {reactionSummaryData.emojis.map((e, i) => (
                <span key={i} style={{ fontSize: 13 }}>{e}</span>
              ))}
              <span style={{ fontSize: 11, color: sub }}>{reactionSummaryData.total}</span>
            </div>
          )}
          <div style={{ display: 'flex', gap: 12, marginTop: 4, paddingLeft: 4 }}>
            <span style={{ fontSize: 11, color: sub }}>{comment.timestamp}</span>
            <button style={{ fontSize: 11, fontWeight: 700, color: sub, background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}>Like</button>
            <button style={{ fontSize: 11, fontWeight: 700, color: sub, background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}>Reply</button>
          </div>
          {replies.length > 0 && (
            <button
              onClick={() => setShowReplies(v => !v)}
              style={{ marginTop: 6, fontSize: 12, fontWeight: 700, color: sub, background: 'none', border: 'none', cursor: 'pointer', padding: '0 0 0 4px', display: 'flex', alignItems: 'center', gap: 4 }}
            >
              <div style={{ width: 24, height: 1, background: sub }} />
              {showReplies ? 'Hide' : `View ${replies.length}`} {replies.length === 1 ? 'reply' : 'replies'}
            </button>
          )}
          {showReplies && (
            <div style={{ marginTop: 8, paddingLeft: 8, borderLeft: `2px solid ${dark ? '#444' : '#e0e0e0'}` }}>
              {replies.map(r => (
                <CommentRow key={r.id} comment={r} replies={[]} dark={dark} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default function FacebookComments() {
  const { comments, facebookPost: p, darkMode: dark } = useCommentsStore()
  const scrollRef = useRef()

  useEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight
  }, [comments])

  const appBg = dark ? '#18191A' : '#F0F2F5'
  const cardBg = dark ? '#242526' : '#fff'
  const headerBg = dark ? '#242526' : '#fff'
  const text = dark ? '#E4E6EB' : '#050505'
  const sub = dark ? '#B0B3B8' : '#65676B'
  const border = dark ? '#3E4042' : '#E4E6EB'
  const iconColor = dark ? '#B0B3B8' : '#65676B'
  const fbBlue = '#1877F2'

  const threads = comments
    .filter(c => !c.parentId)
    .map(c => ({ ...c, replies: comments.filter(r => r.parentId === c.id) }))

  const totalReactions = Object.values(p.reactions).reduce((a, b) => a + b, 0)
  const topReactions = Object.entries(p.reactions)
    .filter(([, v]) => v > 0)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 3)
    .map(([k]) => REACTION_EMOJIS[k])

  return (
    <div data-platform="facebook" style={{ width: '100%', height: '100%', display: 'flex', flexDirection: 'column', background: appBg, fontFamily: '"Roboto", "Segoe UI", Helvetica, Arial, sans-serif', overflowY: 'auto' }}>

      {/* Status bar */}
      <div style={{ background: headerBg, display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0 20px', height: 50, flexShrink: 0, color: text, fontSize: 15, fontWeight: 600 }}>
        <span>9:41</span>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <svg width="17" height="13" viewBox="0 0 122.26 93.66" fill={dark ? '#E4E6EB' : '#050505'}><path d="M119.26,93.62l-15.29-.02c-2.04,0-4.6-2.09-4.6-4.51l.02-84.81C99.39,1.74,101.97,0,104.01,0h13.54c2,0,4.67,1.74,4.67,4.27l.04,84.87c0,1.38-1.87,3.74-2.99,4.49Z"/><path d="M84.59,93.63h-13.58c-2.09-.02-4.71-2.12-4.71-4.45V29.06c0-2.31,2.64-4.43,4.7-4.43h13.59c2.08.02,4.31,2.24,4.57,4.59l-.03,59.78c0,2.36-2.56,4.63-4.54,4.63Z"/><path d="M52.25,93.54l-14.25.1c-2.04.01-4.87-2.12-4.87-4.4l-.03-40.22c0-2.06,2.27-4.59,4.08-4.58l15.09.04c1.69,0,3.69,2.98,3.69,4.67v39.93c0,1.63-2,4.44-3.71,4.45Z"/><path d="M19.33,93.57l-14.27.09c-2.46.02-5.03-1.75-5.03-4.43L0,61.9c0-1.45,2.62-3.9,4.05-3.9h14.53c1.45.01,3.79,2.33,4.25,3.9l-.02,27.45c0,1.36-2.16,4.2-3.47,4.21Z"/></svg>
          <svg width="16" height="13" viewBox="0 0 119.85 91.04" fill={dark ? '#E4E6EB' : '#050505'}><path d="M109.97,33.77c-29.1-24.93-70.79-25.14-100.02-.13L0,22.39c34.61-30.03,85.79-29.73,119.85.14l-9.88,11.24Z"/><path d="M90.44,56.39c-17.8-15.07-43.19-15.35-60.92,0l-9.77-11.38c23-19.98,57.03-20.08,80.29-.02l-9.6,11.4Z"/><path d="M59.9,91.04l-20.43-23.27c11.61-10.38,28.47-10.45,40.89-.25l-20.45,23.52Z"/></svg>
          <svg width="25" height="13" viewBox="0 0 144.85 66.52" fill={dark ? '#E4E6EB' : '#050505'}><path d="M119.14,66.52l-106.81-.02C5.12,66.5-.04,60.83,0,53.86L.24,9.71C.26,5.62,6.06.05,10.37.05L120.09,0c7.08,0,11.9,6.15,11.88,12.91l-.1,41.6c-.02,7.17-5.96,12.01-12.72,12.01ZM117.65,61.68c4.71,0,9.08-2.67,9.08-7.06V12.02c0-4.59-4.29-7.2-8.57-7.2l-105.82.05c-4.46,0-7.24,3.95-7.24,7.88v41.07c0,4.7,3.35,7.85,8.19,7.85h104.36Z"/><path d="M144.85,39.91c0,1.69-1.07,4.31-2.26,5.15-1.28.91-4.76,1.23-6.29.84v-25.31c1.35-.29,4.05-.26,5.26.21,1.37.53,3.27,3.47,3.27,5.01l.02,14.11Z"/><path d="M114.34,56.65H17.44c-4.32-.37-7.47-3.51-7.47-7.82l-.02-31.11c0-3.86,3.11-7.86,7.33-7.86h96.8c4.61,0,7.77,3.9,7.77,8.08v30.67c0,4.18-2.71,7.44-7.51,8.04Z"/></svg>
        </div>
      </div>

      {/* Facebook top bar */}
      <div style={{ background: headerBg, padding: '0 12px 8px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: `1px solid ${border}`, flexShrink: 0 }}>
        <svg width="28" height="28" viewBox="0 0 24 24" fill={fbBlue}><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
        <div style={{ display: 'flex', gap: 8 }}>
          {['🔍', '👤', '☰'].map(icon => (
            <div key={icon} style={{ width: 36, height: 36, borderRadius: '50%', background: dark ? '#3A3B3C' : '#E4E6EB', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18 }}>{icon}</div>
          ))}
        </div>
      </div>

      {/* Post card */}
      <div style={{ background: cardBg, marginBottom: 8, flexShrink: 0 }}>
        {/* Author */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '12px 12px 8px' }}>
          <Avatar contact={{ name: p.authorName, color: p.authorAvatarColor, avatar: p.authorAvatar }} size={40} />
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 14, fontWeight: 700, color: text }}>{p.authorName}</div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 4, marginTop: 2 }}>
              <span style={{ fontSize: 12, color: sub }}>{p.timestamp}</span>
              <span style={{ fontSize: 12, color: sub }}>·</span>
              <span style={{ fontSize: 14, color: sub }}>🌍</span>
            </div>
          </div>
          <span style={{ fontSize: 20, color: sub, cursor: 'pointer' }}>···</span>
        </div>

        {/* Post text */}
        {p.postText && <p style={{ margin: '0 12px 8px', fontSize: 15, color: text, lineHeight: 1.4 }}>{p.postText}</p>}

        {/* Post image */}
        {p.postImage && <img src={p.postImage} alt="" style={{ width: '100%', display: 'block', maxHeight: 220, objectFit: 'cover' }} />}

        {/* Reaction counts */}
        {totalReactions > 0 && (
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '8px 12px', borderBottom: `1px solid ${border}` }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
              {topReactions.map((e, i) => (
                <span key={i} style={{ fontSize: 16, filter: 'drop-shadow(0 0 1px rgba(0,0,0,0.2))' }}>{e}</span>
              ))}
              <span style={{ fontSize: 13, color: sub, marginLeft: 2 }}>{totalReactions}</span>
            </div>
            <div style={{ display: 'flex', gap: 8 }}>
              <span style={{ fontSize: 13, color: sub }}>{p.commentCount} comments</span>
              <span style={{ fontSize: 13, color: sub }}>{p.shareCount} shares</span>
            </div>
          </div>
        )}

        {/* Action buttons */}
        <div style={{ display: 'flex', borderBottom: `1px solid ${border}` }}>
          {['👍 Like', '💬 Comment', '↗ Share'].map(label => (
            <button key={label} style={{ flex: 1, padding: '8px 4px', background: 'none', border: 'none', cursor: 'pointer', fontSize: 14, fontWeight: 600, color: iconColor, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 4 }}>
              {label}
            </button>
          ))}
        </div>

        {/* Comment input row */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '8px 12px' }}>
          <div style={{ width: 32, height: 32, borderRadius: '50%', background: dark ? '#3A3B3C' : '#E4E6EB', flexShrink: 0 }} />
          <div style={{ flex: 1, background: dark ? '#3A3B3C' : '#F0F2F5', borderRadius: 20, padding: '8px 14px', fontSize: 14, color: sub }}>Write a comment…</div>
        </div>
      </div>

      {/* Comments section */}
      <div ref={scrollRef} style={{ flex: 1, background: cardBg, padding: '8px 12px' }}>
        {threads.length === 0 && (
          <div style={{ textAlign: 'center', color: sub, fontSize: 13, paddingTop: 24 }}>No comments yet</div>
        )}
        {threads.map(thread => (
          <CommentRow key={thread.id} comment={thread} replies={thread.replies} dark={dark} />
        ))}
      </div>
    </div>
  )
}
