import React, { useRef, useEffect, useState } from 'react'
import { useStore } from '../store'
import Avatar from '../Avatar'
import TypingIndicator from '../TypingIndicator'
import { SignalIcon, WifiIcon, BatteryIcon } from '../StatusBarIcons'

function fmt(date) {
  return new Date(date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
}

// Instagram DM colours (always dark)
const BG       = '#000000'
const RECV_BG  = '#262626'
// Instagram DM sent bubble — purple gradient matching the 2024 app
const SENT_BG  = 'linear-gradient(135deg, #8B5CF6 0%, #EC4899 100%)'

function Reactions({ reactions }) {
  const grouped = {}
  reactions.forEach(r => { grouped[r.emoji] = (grouped[r.emoji] || 0) + 1 })
  return (
    <div style={{ display: 'flex', gap: 3, marginTop: 3 }}>
      {Object.entries(grouped).map(([emoji, n]) => (
        <span key={emoji} style={{
          background: '#1C1C1E', border: '1px solid #2C2C2E',
          borderRadius: 14, padding: '2px 6px', fontSize: 13,
          boxShadow: '0 1px 4px rgba(0,0,0,0.4)', display: 'flex', alignItems: 'center', gap: 2
        }}>
          {emoji}{n > 1 && <span style={{ fontSize: 10, color: '#8E8E93', fontWeight: 600 }}> {n}</span>}
        </span>
      ))}
    </div>
  )
}

export default function Instagram() {
  const { messages, contacts, statusBar, chatName, isGroupChat, showTypingIndicator } = useStore()
  const [tappedId, setTappedId] = useState(null)
  const scrollRef = useRef()
  const contact = contacts[0]

  useEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight
  }, [messages, showTypingIndicator])

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', background: BG, color: '#fff', fontFamily: 'system-ui, -apple-system, sans-serif' }}>

      {/* Status bar */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0 20px', height: 50, flexShrink: 0, fontSize: 13, fontWeight: 600 }}>
        <span>{statusBar.time}</span>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <SignalIcon color="#fff" size={17} />
          <WifiIcon color="#fff" size={16} />
          <BatteryIcon color="#fff" size={25} />
        </div>
      </div>

      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '6px 12px 10px', borderBottom: '0.5px solid rgba(255,255,255,0.1)', flexShrink: 0 }}>
        {/* Back */}
        <button style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 4, color: '#fff' }}>
          <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
            <path d="M14 4L7 11L14 18" stroke="white" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>

        {/* Avatar + name */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, flex: 1, minWidth: 0 }}>
          {/* Story ring — explicit 42×42 wrapper keeps the ring circular with any avatar type */}
          <div style={{ position: 'relative', flexShrink: 0, width: 42, height: 42 }}>
            <div style={{
              position: 'absolute', inset: 0, borderRadius: '50%',
              background: 'linear-gradient(45deg, #f09433, #e6683c, #dc2743, #cc2366, #bc1888)',
            }} />
            <div style={{
              position: 'absolute', inset: 2, background: BG, borderRadius: '50%',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              <Avatar contact={contact} size={34} />
            </div>
          </div>
          <div style={{ minWidth: 0 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 3 }}>
              <span style={{ fontSize: 14, fontWeight: 600, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{chatName}</span>
              <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                <path d="M3 5l3 3 3-3" stroke="#8E8E93" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
            {contact && (
              <div style={{ fontSize: 11, color: '#8E8E93', marginTop: 1 }}>
                {isGroupChat ? `${contacts.length} members` : `@${chatName.toLowerCase().replace(/\s+/g, '_').substring(0, 16)}`}
              </div>
            )}
          </div>
        </div>

        {/* Right icons */}
        <button style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 6, color: '#fff' }}>
          <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
            <path d="M3 3h4l2 5-2.5 1.5a11 11 0 005 5L13 12l5 2v4a2 2 0 01-2 2C7.3 20 2 14.7 2 8a2 2 0 011-1.73z" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>
        <button style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 6, color: '#fff' }}>
          <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
            <rect x="2" y="2" width="18" height="18" rx="5" stroke="white" strokeWidth="1.8"/>
            <circle cx="11" cy="11" r="4" stroke="white" strokeWidth="1.8"/>
            <circle cx="16.5" cy="5.5" r="1" fill="white"/>
          </svg>
        </button>
      </div>

      {/* Messages */}
      <div ref={scrollRef} style={{ flex: 1, overflowY: 'auto', padding: '10px 12px', display: 'flex', flexDirection: 'column', gap: 4 }}>
        {messages.map((msg, i) => {
          if (msg.type === 'typing') {
            return (
              <div key={msg.id} style={{ display: 'flex', alignItems: 'flex-end', gap: 6 }}>
                <Avatar contact={contact} size={24} />
                <div style={{ background: RECV_BG, borderRadius: 22, padding: '10px 14px' }}>
                  <TypingIndicator />
                </div>
              </div>
            )
          }

          const isMe = msg.sender === 'me'
          const msgContact = contacts.find(c => c.id === msg.sender)
          const isLastFromSender = i === messages.length - 1 || messages[i + 1]?.sender !== msg.sender
          const showTs = tappedId === msg.id

          return (
            <div key={msg.id} style={{ display: 'flex', flexDirection: isMe ? 'row-reverse' : 'row', alignItems: 'flex-end', gap: 6 }}>
              {/* Avatar — only for last consecutive received */}
              {!isMe && (
                <div style={{ width: 28, flexShrink: 0 }}>
                  {isLastFromSender && <Avatar contact={msgContact} size={24} />}
                </div>
              )}

              <div style={{ display: 'flex', flexDirection: 'column', alignItems: isMe ? 'flex-end' : 'flex-start', maxWidth: '70%' }}>
                <div
                  style={{
                    background: isMe ? SENT_BG : RECV_BG,
                    borderRadius: 22,
                    padding: msg.type === 'image' ? 4 : '10px 14px',
                    cursor: 'pointer',
                  }}
                  onClick={() => setTappedId(tappedId === msg.id ? null : msg.id)}
                >
                  {msg.type === 'image'
                    ? <img src={msg.content} alt="" style={{ maxWidth: 180, maxHeight: 180, borderRadius: 18, display: 'block' }} />
                    : <span style={{ fontSize: 14, lineHeight: 1.4, color: '#fff', wordBreak: 'break-word' }}>{msg.content}</span>
                  }
                </div>
                {msg.reactions.length > 0 && <Reactions reactions={msg.reactions} />}
                {showTs && (
                  <div style={{ fontSize: 11, color: '#8E8E93', marginTop: 4, padding: '0 4px' }}>
                    {fmt(msg.timestamp)}
                  </div>
                )}
              </div>

              {/* Read indicator — small avatar for last sent */}
              {isMe && i === messages.length - 1 && msg.readReceipt === 'read' && (
                <div style={{ width: 16, alignSelf: 'flex-end', marginBottom: 2 }}>
                  <Avatar contact={contact} size={16} />
                </div>
              )}
            </div>
          )
        })}

        {showTypingIndicator && (
          <div style={{ display: 'flex', alignItems: 'flex-end', gap: 6 }}>
            <Avatar contact={contact} size={24} />
            <div style={{ background: RECV_BG, borderRadius: 22, padding: '10px 14px' }}>
              <TypingIndicator />
            </div>
          </div>
        )}
      </div>

      {/* Input bar */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '10px 12px 28px', borderTop: '0.5px solid rgba(255,255,255,0.1)', flexShrink: 0 }}>
        <button style={{ background: 'none', border: 'none', cursor: 'pointer', flexShrink: 0 }}>
          <svg width="26" height="26" viewBox="0 0 26 26" fill="none">
            <circle cx="13" cy="13" r="12" stroke="#8E8E93" strokeWidth="1.5"/>
            <path d="M9 13h8M13 9v8" stroke="#8E8E93" strokeWidth="1.8" strokeLinecap="round"/>
          </svg>
        </button>
        <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'space-between', border: '1px solid rgba(255,255,255,0.2)', borderRadius: 24, padding: '9px 14px' }}>
          <span style={{ color: '#8E8E93', fontSize: 14 }}>Message…</span>
          <div style={{ display: 'flex', gap: 8 }}>
            <button style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: 18, lineHeight: 1 }}>🎤</button>
            <button style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: 18, lineHeight: 1 }}>🖼</button>
            <button style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: 18, lineHeight: 1 }}>❤️</button>
          </div>
        </div>
      </div>
    </div>
  )
}
