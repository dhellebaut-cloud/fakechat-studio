import React, { useRef, useEffect } from 'react'
import { useStore } from '../store'
import Avatar from '../Avatar'
import TypingIndicator from '../TypingIndicator'
import { SignalIcon, WifiIcon, BatteryIcon } from '../StatusBarIcons'

function fmt(date) {
  return new Date(date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
}

function Ticks({ receipt, dark }) {
  // single tick = sent, double = delivered, blue double = read
  const color = receipt === 'read' ? '#53BDEB' : (dark ? '#8696A0' : '#667781')
  if (!receipt || receipt === 'sent') {
    return (
      <svg width="12" height="10" viewBox="0 0 12 10" fill="none" style={{ marginLeft: 3 }}>
        <path d="M1 5l3 3 7-7" stroke={color} strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    )
  }
  return (
    <svg width="18" height="10" viewBox="0 0 18 10" fill="none" style={{ marginLeft: 3 }}>
      <path d="M1 5l3 3 7-7" stroke={color} strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M7 5l3 3 7-7" stroke={color} strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  )
}

function Reactions({ reactions, isMe, dark }) {
  const grouped = {}
  reactions.forEach(r => { grouped[r.emoji] = (grouped[r.emoji] || 0) + 1 })
  return (
    <div style={{ display: 'flex', gap: 3, marginTop: 3, justifyContent: isMe ? 'flex-end' : 'flex-start' }}>
      {Object.entries(grouped).map(([emoji, n]) => (
        <span key={emoji} style={{
          background: dark ? '#2A3942' : '#fff',
          border: `1px solid ${dark ? '#3A4D5C' : '#E5E5EA'}`,
          borderRadius: 12, padding: '2px 6px', fontSize: 12,
          boxShadow: '0 1px 3px rgba(0,0,0,0.15)'
        }}>{emoji} {n > 1 ? n : ''}</span>
      ))}
    </div>
  )
}

export default function WhatsApp() {
  const { messages, contacts, statusBar, chatName, isGroupChat, darkMode, showTypingIndicator } = useStore()
  const dark = darkMode
  const scrollRef = useRef()
  const contact = contacts[0]

  useEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight
  }, [messages, showTypingIndicator])

  // Official WhatsApp colour tokens
  const bg       = dark ? '#111B21' : '#EFEAE2'
  const headerBg = dark ? '#1F2C34' : '#075E54'
  const sentBg   = dark ? '#005C4B' : '#DCF8C6'
  const recvBg   = dark ? '#202C33' : '#FFFFFF'
  const sentFg   = dark ? '#E9EDEF' : '#111B21'
  const recvFg   = dark ? '#E9EDEF' : '#111B21'
  const metaFg   = dark ? '#8696A0' : '#667781'

  // Light mode wallpaper (subtle dots); dark mode = solid bg
  const chatBg = dark ? bg : `radial-gradient(circle, #ccc 1px, transparent 1px) 0 0 / 20px 20px, ${bg}`

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', fontFamily: '"Roboto", "Segoe UI", Helvetica, Arial, sans-serif' }}>

      {/* Status bar */}
      <div style={{ background: headerBg, color: '#fff', display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0 16px', height: 50, fontSize: 11, fontWeight: 600, flexShrink: 0 }}>
        <span>{statusBar.time}</span>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <SignalIcon color="#fff" size={17} />
          <WifiIcon color="#fff" size={16} />
          <BatteryIcon color="#fff" size={25} />
        </div>
      </div>

      {/* Header */}
      <div style={{ background: headerBg, display: 'flex', alignItems: 'center', gap: 10, padding: '8px 12px', flexShrink: 0 }}>
        <button style={{ background: 'none', border: 'none', color: '#fff', fontSize: 22, cursor: 'pointer', padding: '0 4px', lineHeight: 1 }}>‹</button>
        <Avatar contact={contact} size={38} />
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ color: '#fff', fontWeight: 600, fontSize: 16, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{chatName}</div>
          <div style={{ color: 'rgba(255,255,255,0.75)', fontSize: 12 }}>
            {showTypingIndicator ? 'typing…' : isGroupChat ? `${contacts.length} participants` : 'tap for contact info'}
          </div>
        </div>
        <button style={{ background: 'none', border: 'none', color: '#fff', cursor: 'pointer', padding: 6 }}>
          <svg width="22" height="16" viewBox="0 0 22 16" fill="none">
            <rect x="1" y="1" width="14" height="14" rx="2.5" stroke="white" strokeWidth="1.7"/>
            <path d="M15 5.5l6-4v13l-6-4V5.5z" stroke="white" strokeWidth="1.7" strokeLinejoin="round"/>
          </svg>
        </button>
        <button style={{ background: 'none', border: 'none', color: '#fff', cursor: 'pointer', padding: 6 }}>
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
            <path d="M3 3h4l2 5-2.5 1.5a11 11 0 005 5L13 12l5 2v4a2 2 0 01-2 2C7.3 20 2 14.7 2 8a2 2 0 011-1.73z" stroke="white" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>
      </div>

      {/* Messages */}
      <div ref={scrollRef} style={{ flex: 1, overflowY: 'auto', padding: '8px 10px', display: 'flex', flexDirection: 'column', gap: 3, background: chatBg }}>
        {messages.map((msg, i) => {
          if (msg.type === 'typing') {
            return (
              <div key={msg.id} style={{ display: 'flex', justifyContent: 'flex-start' }}>
                <div style={{ background: recvBg, borderRadius: '0 8px 8px 8px', padding: '10px 14px', position: 'relative' }}>
                  <div className="wa-tail-them" style={{ borderRightColor: recvBg }} />
                  <TypingIndicator />
                </div>
              </div>
            )
          }

          const isMe = msg.sender === 'me'
          const msgContact = contacts.find(c => c.id === msg.sender)
          const showName = isGroupChat && !isMe && (i === 0 || messages[i - 1].sender !== msg.sender)
          const bubbleBg = isMe ? sentBg : recvBg
          const br = isMe ? '8px 8px 0 8px' : '0 8px 8px 8px'

          return (
            <div key={msg.id} style={{ display: 'flex', flexDirection: isMe ? 'row-reverse' : 'row', alignItems: 'flex-end', gap: 6 }}>
              {!isMe && isGroupChat && <Avatar contact={msgContact} size={26} />}
              <div style={{ display: 'flex', flexDirection: 'column', maxWidth: '76%', alignItems: isMe ? 'flex-end' : 'flex-start' }}>
                {showName && (
                  <div style={{ fontSize: 12, fontWeight: 700, color: msgContact?.color || '#06CF9C', paddingLeft: 10, marginBottom: 1 }}>
                    {msgContact?.name}
                  </div>
                )}
                <div style={{ background: bubbleBg, borderRadius: br, padding: '7px 10px 6px', position: 'relative', boxShadow: '0 1px 2px rgba(0,0,0,0.13)' }}>
                  {/* Tail */}
                  {isMe
                    ? <div className="wa-tail-me" style={{ borderLeftColor: bubbleBg }} />
                    : <div className="wa-tail-them" style={{ borderRightColor: bubbleBg }} />
                  }
                  {msg.type === 'image'
                    ? <img src={msg.content} alt="" style={{ maxWidth: 180, maxHeight: 180, borderRadius: 6, display: 'block' }} />
                    : <span style={{ fontSize: 14.5, lineHeight: 1.4, color: isMe ? sentFg : recvFg, wordBreak: 'break-word' }}>{msg.content}</span>
                  }
                  {/* Meta: time + ticks */}
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: 2, marginTop: 3 }}>
                    <span style={{ fontSize: 11, color: metaFg }}>{fmt(msg.timestamp)}</span>
                    {isMe && msg.readReceipt && <Ticks receipt={msg.readReceipt} dark={dark} />}
                  </div>
                </div>
                {msg.reactions.length > 0 && <Reactions reactions={msg.reactions} isMe={isMe} dark={dark} />}
              </div>
            </div>
          )
        })}

        {showTypingIndicator && (
          <div style={{ display: 'flex' }}>
            <div style={{ background: recvBg, borderRadius: '0 8px 8px 8px', padding: '10px 14px', position: 'relative', boxShadow: '0 1px 2px rgba(0,0,0,0.13)' }}>
              <div className="wa-tail-them" style={{ borderRightColor: recvBg }} />
              <TypingIndicator />
            </div>
          </div>
        )}
      </div>

      {/* Input bar */}
      <div style={{ background: dark ? '#1F2C34' : '#F0F2F5', display: 'flex', alignItems: 'center', gap: 8, padding: '8px 10px 22px', flexShrink: 0 }}>
        <button style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: 22, lineHeight: 1 }}>😊</button>
        <div style={{ flex: 1, background: dark ? '#2A3942' : '#fff', borderRadius: 22, padding: '10px 14px', fontSize: 15, color: dark ? '#8696A0' : '#8696A0' }}>
          Message
        </div>
        <button style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: 22, lineHeight: 1 }}>📎</button>
        <button style={{ background: 'none', border: 'none', cursor: 'pointer' }}>
          <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
            <rect x="7" y="1" width="8" height="12" rx="4" stroke={dark ? '#8696A0' : '#54656F'} strokeWidth="1.8"/>
            <path d="M3 11a8 8 0 0016 0" stroke={dark ? '#8696A0' : '#54656F'} strokeWidth="1.8" strokeLinecap="round"/>
            <path d="M11 19v2" stroke={dark ? '#8696A0' : '#54656F'} strokeWidth="1.8" strokeLinecap="round"/>
          </svg>
        </button>
      </div>
    </div>
  )
}
