import React, { useRef, useEffect } from 'react'
import { useStore } from '../store'
import Avatar from '../Avatar'
import TypingIndicator from '../TypingIndicator'

/* ── Status bar ── */
function StatusBar({ time, signal, battery, dark }) {
  const c = dark ? '#fff' : '#000'
  return (
    <div className="im-statusbar" style={{ color: c }}>
      <span className="im-sb-time">{time}</span>
      <div className="im-sb-icons">
        {/* Signal bars */}
        <svg width="17" height="12" viewBox="0 0 17 12" fill="none">
          {[2,4,6,8,10].map((h,i) => (
            <rect key={i} x={i*3} y={12-h} width="2" height={h} rx="0.5"
              fill={i < Math.round((signal/4)*5) ? c : `${c}40`} />
          ))}
        </svg>
        {/* Wifi */}
        <svg width="16" height="12" viewBox="0 0 16 12" fill={c}>
          <path d="M8 9.5a1.5 1.5 0 110 3 1.5 1.5 0 010-3z"/>
          <path d="M8 6.5A5.5 5.5 0 013.4 8.4L2 7a7.5 7.5 0 0112 0l-1.4 1.4A5.5 5.5 0 018 6.5z"/>
          <path d="M8 2.5a10 10 0 00-7 2.9L-.4 4A12 12 0 018 .5a12 12 0 018.4 4L15 5.4A10 10 0 008 2.5z"/>
        </svg>
        {/* Battery */}
        <svg width="27" height="13" viewBox="0 0 27 13" fill="none">
          <rect x="0.5" y="0.5" width="22" height="12" rx="3.5" stroke={c} strokeOpacity="0.35"/>
          <rect x="1.5" y="1.5" width={Math.round(battery * 0.2)} height="10" rx="2" fill={c}/>
          <path d="M24 4.5v4a2 2 0 000-4z" fill={c} fillOpacity="0.4"/>
        </svg>
      </div>
    </div>
  )
}

/* ── Bubble grouping ── */
function groupMessages(msgs) {
  const groups = []
  msgs.forEach(msg => {
    const last = groups[groups.length - 1]
    if (last && last.sender === msg.sender && msg.type !== 'typing') {
      last.msgs.push(msg)
    } else {
      groups.push({ sender: msg.sender, msgs: [msg] })
    }
  })
  return groups
}

function fmt(date) {
  return new Date(date).toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' })
}

/* ── Reactions badge ── */
function Reactions({ reactions, dark }) {
  const grouped = {}
  reactions.forEach(r => { grouped[r.emoji] = (grouped[r.emoji] || 0) + 1 })
  return (
    <div className="im-reactions">
      {Object.entries(grouped).map(([emoji, n]) => (
        <span key={emoji} className={`im-reaction-badge ${dark ? 'dark' : ''}`}>
          {emoji}{n > 1 && <span className="reaction-count"> {n}</span>}
        </span>
      ))}
    </div>
  )
}

export default function IMessage() {
  const { messages, contacts, statusBar, chatName, isGroupChat, darkMode, showTypingIndicator } = useStore()
  const dark = darkMode
  const scrollRef = useRef()
  const contact = contacts[0]

  useEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight
  }, [messages, showTypingIndicator])

  const groups = groupMessages(messages)

  // colours matching iOS 17
  const bg       = dark ? '#000000' : '#FFFFFF'
  const headerBg = dark ? '#1C1C1E' : '#F9F9F9'
  const sepColor = dark ? 'rgba(255,255,255,0.10)' : 'rgba(0,0,0,0.10)'
  const sentBg   = dark ? '#0A84FF' : '#007AFF'
  const recvBg   = dark ? '#3A3A3C' : '#E5E5EA'
  const nameFg   = dark ? '#FFFFFF' : '#000000'

  return (
    <div className="im-chat" style={{ background: bg, fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Text", sans-serif' }}>
      <StatusBar {...statusBar} dark={dark} />

      {/* ── Header ── */}
      <div className="im-header" style={{ background: headerBg, borderBottom: `0.5px solid ${sepColor}` }}>
        {/* Back */}
        <button className="im-back" style={{ color: dark ? '#0A84FF' : '#007AFF' }}>
          <svg width="10" height="17" viewBox="0 0 10 17" fill="none">
            <path d="M8.5 1.5L1.5 8.5L8.5 15.5" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>

        {/* Centre — avatar stacked above name */}
        <div className="im-header-center">
          <Avatar contact={contact} size={36} />
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 1 }}>
            <span style={{ fontSize: 13, fontWeight: 600, color: nameFg, lineHeight: 1.2 }}>{chatName}</span>
            {isGroupChat && (
              <span style={{ fontSize: 11, color: dark ? '#8E8E93' : '#8E8E93' }}>group</span>
            )}
          </div>
        </div>

        {/* Actions — video only (matches iOS 17 default) */}
        <div className="im-header-actions">
          <button className="im-header-btn" style={{ color: dark ? '#0A84FF' : '#007AFF' }}>
            <svg width="26" height="18" viewBox="0 0 26 18" fill="none">
              <rect x="1" y="1" width="16" height="16" rx="3" stroke="currentColor" strokeWidth="1.8"/>
              <path d="M17 6l7-4v14l-7-4V6z" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round"/>
            </svg>
          </button>
        </div>
      </div>

      {/* ── Messages ── */}
      <div className="im-messages" ref={scrollRef}>
        {groups.map((group, gi) => {
          const isMe = group.sender === 'me'
          const groupContact = contacts.find(c => c.id === group.sender)
          const isLastGroup = gi === groups.length - 1

          return (
            <div key={gi} className={`im-group ${isMe ? 'im-group-me' : 'im-group-them'}`}>
              {!isMe && isGroupChat && (
                <div style={{ fontSize: 11, color: dark ? '#8E8E93' : '#636366', paddingLeft: 38, marginBottom: 2 }}>
                  {groupContact?.name}
                </div>
              )}
              <div className="im-group-bubbles">
                {!isMe && <Avatar contact={groupContact} size={28} />}
                <div className="im-bubble-stack" style={{ alignItems: isMe ? 'flex-end' : 'flex-start' }}>
                  {group.msgs.map((msg, mi) => {
                    const total = group.msgs.length
                    const isOnly = total === 1
                    const isFirst = mi === 0
                    const isLast = mi === total - 1

                    if (msg.type === 'typing') {
                      return (
                        <div key={msg.id} className="im-bubble" style={{
                          background: recvBg, borderRadius: '18px 18px 18px 4px', padding: '10px 14px'
                        }}>
                          <TypingIndicator />
                        </div>
                      )
                    }

                    // Border radius: tail corner is bottom-right (me) or bottom-left (them)
                    // and only appears on the LAST bubble in a group
                    let br
                    if (isMe) {
                      if (isOnly)       br = '18px 18px 4px 18px'   // TL TR BR BL — tail at BR
                      else if (isFirst) br = '18px 18px 18px 18px'
                      else if (isLast)  br = '18px 18px 4px 18px'
                      else              br = '18px 18px 18px 18px'
                    } else {
                      if (isOnly)       br = '18px 18px 18px 4px'   // tail at BL
                      else if (isFirst) br = '18px 18px 18px 18px'
                      else if (isLast)  br = '18px 18px 18px 4px'
                      else              br = '18px 18px 18px 18px'
                    }

                    const showTs = isLast && isLastGroup

                    return (
                      <div key={msg.id} style={{ display: 'flex', flexDirection: 'column', alignItems: isMe ? 'flex-end' : 'flex-start' }}>
                        <div
                          className="im-bubble"
                          style={{ background: isMe ? sentBg : recvBg, borderRadius: br, color: isMe ? '#fff' : (dark ? '#fff' : '#000') }}
                        >
                          {msg.type === 'image'
                            ? <img src={msg.content} alt="" className="im-img-bubble" />
                            : <span className="im-bubble-text">{msg.content}</span>}
                        </div>
                        {msg.reactions.length > 0 && <Reactions reactions={msg.reactions} dark={dark} />}
                        {showTs && (
                          <div style={{ fontSize: 11, color: dark ? '#8E8E93' : '#8E8E93', marginTop: 4, paddingRight: isMe ? 4 : 0, paddingLeft: isMe ? 0 : 4 }}>
                            {msg.readReceipt === 'read' ? `Read ${fmt(msg.timestamp)}` : msg.readReceipt === 'delivered' ? 'Delivered' : msg.readReceipt === 'sent' ? 'Sent' : fmt(msg.timestamp)}
                          </div>
                        )}
                      </div>
                    )
                  })}
                </div>
              </div>
            </div>
          )
        })}

        {showTypingIndicator && (
          <div className="im-group im-group-them">
            <div className="im-group-bubbles">
              <Avatar contact={contact} size={28} />
              <div className="im-bubble-stack">
                <div className="im-bubble" style={{ background: recvBg, borderRadius: '18px 18px 18px 4px', padding: '10px 14px' }}>
                  <TypingIndicator />
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* ── Input bar ── */}
      <div className="im-input-bar" style={{ background: bg, borderTop: `0.5px solid ${sepColor}` }}>
        <button className="im-input-icon">
          <svg width="30" height="30" viewBox="0 0 30 30" fill="none">
            <circle cx="15" cy="15" r="14" stroke={dark ? '#636366' : '#C7C7CC'} strokeWidth="1.5"/>
            <path d="M10 15h10M15 10v10" stroke={dark ? '#636366' : '#C7C7CC'} strokeWidth="2" strokeLinecap="round"/>
          </svg>
        </button>
        <div className="im-input-field" style={{ background: dark ? '#1C1C1E' : '#fff', border: `1px solid ${dark ? '#3A3A3C' : '#C7C7CC'}` }}>
          <span className="im-input-placeholder" style={{ color: dark ? '#636366' : '#C7C7CC' }}>iMessage</span>
        </div>
        <button className="im-input-icon">
          <svg width="30" height="30" viewBox="0 0 30 30" fill="none">
            <circle cx="15" cy="15" r="14" fill={dark ? '#0A84FF' : '#007AFF'}/>
            <path d="M15 21V9m-5 6l5-6 5 6" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>
      </div>
    </div>
  )
}
