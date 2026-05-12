import React, { useRef, useState } from 'react'
import { useCommentsStore } from '../commentsStore'
import Avatar from '../Avatar'

// ─── helpers ─────────────────────────────────────────────────────────────────

function segmentsToText(segments) {
  return (segments || []).map(s => s.text).join('')
}

/** Apply style to the character range [start, end) inside a segments array. */
function applyStyleToRange(segments, start, end, style) {
  const result = []
  let pos = 0

  for (const seg of segments) {
    const segEnd = pos + seg.text.length
    if (segEnd <= start || pos >= end) {
      result.push(seg)
    } else {
      if (pos < start) {
        result.push({ text: seg.text.slice(0, start - pos), style: seg.style })
      }
      const oStart = Math.max(pos, start) - pos
      const oEnd = Math.min(segEnd, end) - pos
      result.push({ text: seg.text.slice(oStart, oEnd), style })
      if (segEnd > end) {
        result.push({ text: seg.text.slice(end - pos), style: seg.style })
      }
    }
    pos = segEnd
  }

  // Filter empty + merge adjacent same-style
  return result.filter(s => s.text.length > 0).reduce((acc, seg) => {
    if (acc.length && acc[acc.length - 1].style === seg.style) {
      acc[acc.length - 1] = { ...acc[acc.length - 1], text: acc[acc.length - 1].text + seg.text }
    } else {
      acc.push(seg)
    }
    return acc
  }, [])
}

// ─── component ───────────────────────────────────────────────────────────────

export default function FloatingBubbleEditor({ onClose }) {
  const { tikTokTextBubble: b, updateTikTokTextBubble } = useCommentsStore()
  const fileRef = useRef()
  const textareaRef = useRef()
  const panelRef = useRef()
  const [pos, setPos] = useState(() => ({
    x: Math.max(8, window.innerWidth / 2 - 215 - 320),
    y: Math.min(560, window.innerHeight - 320),
  }))

  // ── drag ──────────────────────────────────────────────────────────────────
  function handleDragStart(e) {
    if (e.target.closest('input,textarea,select,button,label')) return
    const rect = panelRef.current.getBoundingClientRect()
    const ox = e.clientX - rect.left
    const oy = e.clientY - rect.top

    function onMove(e) {
      const x = Math.max(0, Math.min(window.innerWidth - rect.width, e.clientX - ox))
      const y = Math.max(56, Math.min(window.innerHeight - 80, e.clientY - oy))
      panelRef.current.style.left = x + 'px'
      panelRef.current.style.top = y + 'px'
    }
    function onUp() {
      setPos({
        x: parseFloat(panelRef.current.style.left) || pos.x,
        y: parseFloat(panelRef.current.style.top) || pos.y,
      })
      document.removeEventListener('mousemove', onMove)
      document.removeEventListener('mouseup', onUp)
    }
    document.addEventListener('mousemove', onMove)
    document.addEventListener('mouseup', onUp)
    e.preventDefault()
  }

  // ── text changes ──────────────────────────────────────────────────────────
  function handleTextChange(e) {
    const newText = e.target.value
    const oldText = segmentsToText(b.segments)

    // Simple merge: try to preserve styles if text only changed at one point
    if (newText.length === oldText.length) {
      // Same length → likely a single char replacement; reset styles on changed chars
      updateTikTokTextBubble({ segments: [{ text: newText, style: null }] })
      return
    }

    // Otherwise rebuild as single plain segment
    updateTikTokTextBubble({ segments: [{ text: newText, style: null }] })
  }

  // ── format selection ──────────────────────────────────────────────────────
  function applyFormat(style) {
    const ta = textareaRef.current
    if (!ta) return
    const { selectionStart: s, selectionEnd: e } = ta
    if (s === e) return
    const newSegments = applyStyleToRange(b.segments, s, e, style)
    updateTikTokTextBubble({ segments: newSegments })
    // Restore focus + selection
    requestAnimationFrame(() => {
      ta.focus()
      ta.setSelectionRange(s, e)
    })
  }

  function resetFormat() {
    updateTikTokTextBubble({ segments: [{ text: segmentsToText(b.segments), style: null }] })
  }

  const plainText = segmentsToText(b.segments)

  return (
    <div
      ref={panelRef}
      className="floating-panel"
      style={{ left: pos.x, top: pos.y, width: 300 }}
    >
      {/* Handle */}
      <div className="floating-panel-handle" onMouseDown={handleDragStart}>
        <span className="floating-panel-grip">⠿⠿</span>
        <span className="floating-panel-title">Bubble Editor</span>
        <button className="floating-panel-close" onClick={onClose} title="Close">×</button>
      </div>

      <div style={{ padding: '12px 14px', display: 'flex', flexDirection: 'column', gap: 10, maxHeight: 'calc(100vh - 140px)', overflowY: 'auto' }}>

        {/* Reply To */}
        <div className="section-title">Bubble</div>
        <div className="form-row">
          <label>Reply To Username</label>
          <input
            type="text"
            value={b.replyToUsername}
            onChange={e => updateTikTokTextBubble({ replyToUsername: e.target.value })}
            placeholder="username"
          />
        </div>
        <label className="checkbox-label" style={{ fontSize: 12, color: '#ccc', gap: 6 }}>
          <input
            type="checkbox"
            checked={b.isVerified}
            onChange={e => updateTikTokTextBubble({ isVerified: e.target.checked })}
          />
          Verified (shows badge next to username)
        </label>

        {/* Commenter */}
        <div className="section-title" style={{ marginTop: 4 }}>Commenter</div>
        <div className="form-row">
          <label>Avatar</label>
          <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
            <Avatar contact={{ name: b.username, color: b.avatarColor, avatar: b.avatar }} size={28} />
            <input
              type="color"
              value={b.avatarColor}
              onChange={e => updateTikTokTextBubble({ avatarColor: e.target.value })}
              className="color-picker"
              style={{ width: 28, height: 22 }}
            />
            <button type="button" className="btn-secondary" onClick={() => fileRef.current?.click()}>Upload</button>
            {b.avatar && <button type="button" className="btn-secondary" onClick={() => updateTikTokTextBubble({ avatar: null })}>×</button>}
          </div>
          <input ref={fileRef} type="file" accept="image/*" hidden onChange={e => {
            const f = e.target.files[0]; if (!f) return
            const r = new FileReader(); r.onload = ev => updateTikTokTextBubble({ avatar: ev.target.result }); r.readAsDataURL(f)
          }} />
        </div>

        <div className="form-row">
          <label>Username</label>
          <input
            type="text"
            value={b.username}
            onChange={e => updateTikTokTextBubble({ username: e.target.value })}
            placeholder="commenter"
          />
        </div>

        {/* Comment text + formatting */}
        <div className="section-title" style={{ marginTop: 4 }}>Comment Text</div>
        <div className="form-row" style={{ position: 'relative' }}>
          <textarea
            ref={textareaRef}
            rows={4}
            value={plainText}
            onChange={handleTextChange}
            placeholder="Write a comment…"
            style={{ resize: 'vertical' }}
          />
          <span style={{ fontSize: 11, color: '#555', textAlign: 'right', display: 'block' }}>{plainText.length} chars</span>
        </div>

        {/* Format buttons */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
          <span style={{ fontSize: 11, color: '#666' }}>Select text above, then apply:</span>
          <div style={{ display: 'flex', gap: 6 }}>
            <button
              type="button"
              className="btn-secondary"
              style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 4 }}
              onClick={() => applyFormat('highlight')}
              title="Highlight selected text"
            >
              <span style={{ background: '#FFE600', borderRadius: 2, padding: '0 4px', fontSize: 13, fontWeight: 700, color: '#111' }}>A</span>
              Highlight
            </button>
            <button
              type="button"
              className="btn-secondary"
              style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 4 }}
              onClick={() => applyFormat('blur')}
              title="Blur selected text"
            >
              <span style={{ filter: 'blur(2px)', fontSize: 13, fontWeight: 700, color: '#aaa' }}>A</span>
              Blur
            </button>
            <button
              type="button"
              className="btn-secondary"
              style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 4 }}
              onClick={resetFormat}
              title="Reset all formatting"
            >
              ↺
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
