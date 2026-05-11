import React, { useState, useRef } from 'react'
import { useCommentsStore } from '../commentsStore'
import Avatar from '../Avatar'

const REACTION_KEYS = ['like', 'love', 'care', 'haha', 'wow', 'sad', 'angry']
const REACTION_EMOJIS = { like: '👍', love: '❤️', care: '🤗', haha: '😂', wow: '😮', sad: '😢', angry: '😡' }
const COLORS = ['#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#DDA0DD', '#98D8C8', '#F0A500', '#7B68EE']

function randomColor() { return COLORS[Math.floor(Math.random() * COLORS.length)] }

function PostConfigTab() {
  const { commentPlatform, tikTokPost, facebookPost, instagramPost, updateTikTokPost, updateFacebookPost, updateInstagramPost, updateFacebookPostReactions } = useCommentsStore()
  const thumbRef = useRef(), postImgRef = useRef(), avatarRef = useRef()

  function imgUpload(ref, onLoad) {
    ref.current?.click()
    ref.current.onchange = (e) => {
      const f = e.target.files[0]
      if (!f) return
      const reader = new FileReader()
      reader.onload = (ev) => onLoad(ev.target.result)
      reader.readAsDataURL(f)
    }
  }

  if (commentPlatform === 'tiktok') {
    const p = tikTokPost
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        <div className="section-title">Video</div>
        <div className="form-row"><label>Creator Handle</label><input type="text" value={p.creatorUsername} onChange={e => updateTikTokPost({ creatorUsername: e.target.value })} placeholder="@creator" /></div>
        <div className="form-row"><label>Display Name</label><input type="text" value={p.creatorDisplayName} onChange={e => updateTikTokPost({ creatorDisplayName: e.target.value })} /></div>
        <div className="form-row"><label>Caption</label><textarea rows={2} value={p.caption} onChange={e => updateTikTokPost({ caption: e.target.value })} /></div>
        <div className="form-row"><label>Song Name</label><input type="text" value={p.songName} onChange={e => updateTikTokPost({ songName: e.target.value })} /></div>
        <div className="form-row">
          <label>Video Thumbnail</label>
          <div style={{ display: 'flex', gap: 6 }}>
            <input type="color" value={p.thumbnailColor} onChange={e => updateTikTokPost({ thumbnailColor: e.target.value })} className="color-picker" style={{ width: 36, height: 28 }} />
            <button type="button" className="btn-secondary" onClick={() => imgUpload(thumbRef, v => updateTikTokPost({ thumbnail: v }))}>Upload</button>
            {p.thumbnail && <button type="button" className="btn-secondary" onClick={() => updateTikTokPost({ thumbnail: null })}>Remove</button>}
          </div>
          <input ref={thumbRef} type="file" accept="image/*" hidden />
        </div>
        <div className="section-title" style={{ marginTop: 6 }}>Stats</div>
        {[['likeCount', '❤️ Likes'], ['commentCount', '💬 Comments'], ['shareCount', '↗ Shares'], ['bookmarkCount', '🔖 Saves']].map(([k, label]) => (
          <div key={k} className="form-row"><label>{label}</label><input type="text" value={p[k]} onChange={e => updateTikTokPost({ [k]: e.target.value })} /></div>
        ))}
      </div>
    )
  }

  if (commentPlatform === 'facebook') {
    const p = facebookPost
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        <div className="section-title">Post</div>
        <div className="form-row"><label>Author Name</label><input type="text" value={p.authorName} onChange={e => updateFacebookPost({ authorName: e.target.value })} /></div>
        <div className="form-row"><label>Avatar</label>
          <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
            <Avatar contact={{ name: p.authorName, color: p.authorAvatarColor, avatar: p.authorAvatar }} size={28} />
            <input type="color" value={p.authorAvatarColor} onChange={e => updateFacebookPost({ authorAvatarColor: e.target.value })} className="color-picker" style={{ width: 28, height: 22 }} />
            <button type="button" className="btn-secondary" onClick={() => imgUpload(avatarRef, v => updateFacebookPost({ authorAvatar: v }))}>Upload</button>
          </div>
          <input ref={avatarRef} type="file" accept="image/*" hidden />
        </div>
        <div className="form-row"><label>Timestamp</label><input type="text" value={p.timestamp} onChange={e => updateFacebookPost({ timestamp: e.target.value })} placeholder="2 hours ago" /></div>
        <div className="form-row"><label>Post Text</label><textarea rows={3} value={p.postText} onChange={e => updateFacebookPost({ postText: e.target.value })} /></div>
        <div className="form-row"><label>Post Image</label>
          <div style={{ display: 'flex', gap: 6 }}>
            <button type="button" className="btn-secondary" onClick={() => imgUpload(postImgRef, v => updateFacebookPost({ postImage: v }))}>Upload</button>
            {p.postImage && <button type="button" className="btn-secondary" onClick={() => updateFacebookPost({ postImage: null })}>Remove</button>}
          </div>
          <input ref={postImgRef} type="file" accept="image/*" hidden />
        </div>
        <div className="section-title" style={{ marginTop: 4 }}>Post Reactions</div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 6 }}>
          {REACTION_KEYS.map(k => (
            <div key={k} className="form-row" style={{ margin: 0 }}>
              <label>{REACTION_EMOJIS[k]} {k.charAt(0).toUpperCase() + k.slice(1)}</label>
              <input type="number" min={0} value={p.reactions[k]} onChange={e => updateFacebookPostReactions({ [k]: Number(e.target.value) })} />
            </div>
          ))}
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 6 }}>
          <div className="form-row" style={{ margin: 0 }}><label>💬 Comments</label><input type="number" min={0} value={p.commentCount} onChange={e => updateFacebookPost({ commentCount: Number(e.target.value) })} /></div>
          <div className="form-row" style={{ margin: 0 }}><label>↗ Shares</label><input type="number" min={0} value={p.shareCount} onChange={e => updateFacebookPost({ shareCount: Number(e.target.value) })} /></div>
        </div>
      </div>
    )
  }

  // Instagram
  const p = instagramPost
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
      <div className="section-title">Post</div>
      <div className="form-row"><label>Username</label><input type="text" value={p.username} onChange={e => updateInstagramPost({ username: e.target.value })} /></div>
      <div className="form-row"><label>Avatar</label>
        <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
          <Avatar contact={{ name: p.username, color: p.avatarColor, avatar: p.avatar }} size={28} />
          <input type="color" value={p.avatarColor} onChange={e => updateInstagramPost({ avatarColor: e.target.value })} className="color-picker" style={{ width: 28, height: 22 }} />
          <button type="button" className="btn-secondary" onClick={() => imgUpload(avatarRef, v => updateInstagramPost({ avatar: v }))}>Upload</button>
        </div>
        <input ref={avatarRef} type="file" accept="image/*" hidden />
      </div>
      <div className="form-row">
        <label className="checkbox-label">
          <input type="checkbox" checked={p.isVerified} onChange={e => updateInstagramPost({ isVerified: e.target.checked })} />
          Verified badge
        </label>
      </div>
      <div className="form-row"><label>Post Image</label>
        <div style={{ display: 'flex', gap: 6 }}>
          <button type="button" className="btn-secondary" onClick={() => imgUpload(postImgRef, v => updateInstagramPost({ postImage: v }))}>Upload</button>
          {p.postImage && <button type="button" className="btn-secondary" onClick={() => updateInstagramPost({ postImage: null })}>Remove</button>}
        </div>
        <input ref={postImgRef} type="file" accept="image/*" hidden />
      </div>
      <div className="form-row"><label>Caption</label><textarea rows={2} value={p.caption} onChange={e => updateInstagramPost({ caption: e.target.value })} /></div>
      <div className="form-row"><label>Like Count</label><input type="number" min={0} value={p.likeCount} onChange={e => updateInstagramPost({ likeCount: Number(e.target.value) })} /></div>
      <div className="form-row"><label>Timestamp</label><input type="text" value={p.timestamp} onChange={e => updateInstagramPost({ timestamp: e.target.value })} placeholder="2 HOURS AGO" /></div>
    </div>
  )
}

function AddCommentForm() {
  const { commentPlatform, comments, addComment } = useCommentsStore()
  const [username, setUsername] = useState('')
  const [text, setText] = useState('')
  const [timestamp, setTimestamp] = useState('2h')
  const [likeCount, setLikeCount] = useState(0)
  const [avatarColor, setAvatarColor] = useState(() => randomColor())
  const [avatar, setAvatar] = useState(null)
  const [isPinned, setIsPinned] = useState(false)
  const [hasCreatorHeart, setHasCreatorHeart] = useState(false)
  const [isVerified, setIsVerified] = useState(false)
  const [parentId, setParentId] = useState('')
  const [reactions, setReactions] = useState({ like: 0, love: 0, care: 0, haha: 0, wow: 0, sad: 0, angry: 0 })
  const fileRef = useRef()

  const topLevelComments = comments.filter(c => !c.parentId)

  function handleSubmit(e) {
    e.preventDefault()
    if (!username.trim() || !text.trim()) return
    addComment({
      parentId: parentId || null,
      username: username.trim(),
      text: text.trim(),
      timestamp,
      likeCount: Number(likeCount),
      avatarColor,
      avatar,
      isPinned,
      hasCreatorHeart,
      isVerified,
      reactions: { ...reactions },
    })
    setText('')
    setIsPinned(false)
    setHasCreatorHeart(false)
    setParentId('')
    setAvatarColor(randomColor())
    setAvatar(null)
  }

  return (
    <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
      <div className="section-title">Add Comment</div>
      <div className="form-row">
        <label>Profile</label>
        <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
          <Avatar contact={{ name: username || '?', color: avatarColor, avatar }} size={28} />
          <input type="color" value={avatarColor} onChange={e => setAvatarColor(e.target.value)} className="color-picker" style={{ width: 28, height: 22 }} title="Avatar color" />
          <button type="button" className="btn-secondary" onClick={() => fileRef.current?.click()}>Upload</button>
          {avatar && <button type="button" className="btn-secondary" onClick={() => setAvatar(null)}>×</button>}
        </div>
        <input ref={fileRef} type="file" accept="image/*" hidden onChange={e => {
          const f = e.target.files[0]; if (!f) return
          const r = new FileReader(); r.onload = ev => setAvatar(ev.target.result); r.readAsDataURL(f)
        }} />
      </div>
      <div className="form-row"><label>Username</label><input type="text" value={username} onChange={e => setUsername(e.target.value)} placeholder="username" required /></div>
      <div className="form-row"><label>Comment</label><textarea rows={2} value={text} onChange={e => setText(e.target.value)} placeholder="Comment text…" required /></div>
      <div className="form-row"><label>Timestamp</label><input type="text" value={timestamp} onChange={e => setTimestamp(e.target.value)} placeholder="2h" /></div>

      {topLevelComments.length > 0 && (
        <div className="form-row">
          <label>Reply to</label>
          <select value={parentId} onChange={e => setParentId(e.target.value)}>
            <option value="">— Top-level comment —</option>
            {topLevelComments.map(c => (
              <option key={c.id} value={c.id}>@{c.username}: {c.text.slice(0, 30)}{c.text.length > 30 ? '…' : ''}</option>
            ))}
          </select>
        </div>
      )}

      {commentPlatform === 'tiktok' && (
        <>
          <div className="form-row"><label>❤️ Likes</label><input type="number" min={0} value={likeCount} onChange={e => setLikeCount(e.target.value)} /></div>
          <div style={{ display: 'flex', gap: 12 }}>
            <label className="checkbox-label"><input type="checkbox" checked={isPinned} onChange={e => setIsPinned(e.target.checked)} /> Pinned</label>
            <label className="checkbox-label"><input type="checkbox" checked={hasCreatorHeart} onChange={e => setHasCreatorHeart(e.target.checked)} /> Creator ❤️</label>
          </div>
        </>
      )}

      {commentPlatform === 'facebook' && (
        <>
          <div className="section-title" style={{ marginTop: 2 }}>Comment Reactions</div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 6 }}>
            {REACTION_KEYS.map(k => (
              <div key={k} className="form-row" style={{ margin: 0 }}>
                <label>{REACTION_EMOJIS[k]} {k.charAt(0).toUpperCase() + k.slice(1)}</label>
                <input type="number" min={0} value={reactions[k]} onChange={e => setReactions(r => ({ ...r, [k]: Number(e.target.value) }))} />
              </div>
            ))}
          </div>
        </>
      )}

      {commentPlatform === 'instagram' && (
        <>
          <div className="form-row"><label>❤️ Likes</label><input type="number" min={0} value={likeCount} onChange={e => setLikeCount(e.target.value)} /></div>
          <label className="checkbox-label"><input type="checkbox" checked={isVerified} onChange={e => setIsVerified(e.target.checked)} /> Verified ✓</label>
        </>
      )}

      <button type="submit" className="btn-primary add-msg-btn">+ Add Comment</button>
    </form>
  )
}

function CommentListItem({ comment, parentUsername }) {
  const { deleteComment } = useCommentsStore()
  return (
    <div className={`msg-item ${comment.parentId ? '' : 'msg-item-them'}`} style={comment.parentId ? { borderLeft: '3px solid #DDA0DD', marginLeft: 12 } : {}}>
      <div className="msg-item-body">
        <div className="msg-item-header">
          <Avatar contact={{ name: comment.username, color: comment.avatarColor, avatar: comment.avatar }} size={20} />
          <span className="msg-item-sender">
            {comment.parentId ? `↳ ` : ''}{comment.username}
            {comment.isVerified && ' ✓'}
            {comment.isPinned && ' 📌'}
            {comment.hasCreatorHeart && ' ❤️'}
          </span>
          <span className="msg-item-time">{comment.timestamp}</span>
          <button className="msg-item-delete" onClick={() => deleteComment(comment.id)}>×</button>
        </div>
        <div className="msg-item-content">{comment.text}</div>
      </div>
    </div>
  )
}

export default function CommentEditorPanel() {
  const { comments, conversations, activeConvId, addConversation, switchConversation, deleteConversation, tikTokPost } = useCommentsStore()
  const [tab, setTab] = useState('comments')

  const threads = comments.filter(c => !c.parentId).flatMap(c => [
    c,
    ...comments.filter(r => r.parentId === c.id),
  ])

  return (
    <aside className="left-panel">
      {/* Conversation tabs */}
      <div className="conv-tabs">
        {conversations.map(conv => (
          <div key={conv.id} className={`conv-tab ${conv.id === activeConvId ? 'active' : ''}`} onClick={() => switchConversation(conv.id)} title={conv.tikTokPost?.creatorUsername || 'Chat'}>
            <span className="conv-tab-name">{conv.id === activeConvId ? tikTokPost.creatorUsername : (conv.tikTokPost?.creatorUsername || 'Chat')}</span>
            {conversations.length > 1 && (
              <button className="conv-tab-close" onClick={e => { e.stopPropagation(); deleteConversation(conv.id) }}>×</button>
            )}
          </div>
        ))}
        <button className="conv-tab-add" onClick={addConversation} title="New conversation">+</button>
      </div>

      <div className="panel-tabs">
        <button className={`panel-tab ${tab === 'post' ? 'active' : ''}`} onClick={() => setTab('post')}>📝 Post</button>
        <button className={`panel-tab ${tab === 'comments' ? 'active' : ''}`} onClick={() => setTab('comments')}>💬 Comments</button>
      </div>

      {tab === 'post' && (
        <div className="panel-content"><PostConfigTab /></div>
      )}

      {tab === 'comments' && (
        <div className="panel-content">
          <div className="msg-list-wrap">
            {threads.length === 0 && <div className="empty-msg-list">No comments yet.</div>}
            {threads.map(c => <CommentListItem key={c.id} comment={c} />)}
          </div>
          <div className="add-msg-section">
            <AddCommentForm />
          </div>
        </div>
      )}
    </aside>
  )
}
