import React, { useState, useRef } from 'react'
import {
  DndContext, closestCenter, PointerSensor, useSensor, useSensors
} from '@dnd-kit/core'
import {
  SortableContext, verticalListSortingStrategy, useSortable, arrayMove
} from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { useStore } from './store'
import Avatar from './Avatar'

const REACTION_EMOJIS = ['❤️', '👍', '😂', '😮', '😢', '🔥']
const RECEIPT_OPTIONS = [
  { value: '', label: 'None' },
  { value: 'sent', label: 'Sent' },
  { value: 'delivered', label: 'Delivered' },
  { value: 'read', label: 'Read' },
]

function formatTime(date) {
  return new Date(date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
}

function SortableMessage({ msg, contacts, onDelete, onToggleReaction, platform }) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: msg.id })
  const style = { transform: CSS.Transform.toString(transform), transition, opacity: isDragging ? 0.5 : 1 }
  const contact = contacts.find((c) => c.id === msg.sender)
  const senderName = msg.sender === 'me' ? 'Me' : contact?.name || 'Unknown'

  return (
    <div ref={setNodeRef} style={style} className={`msg-item ${msg.sender === 'me' ? 'msg-item-me' : 'msg-item-them'}`}>
      <div className="msg-item-drag" {...attributes} {...listeners}>⠿</div>
      <div className="msg-item-body">
        <div className="msg-item-header">
          <Avatar contact={msg.sender === 'me' ? { name: 'Me', color: '#007AFF' } : contact} size={20} />
          <span className="msg-item-sender">{senderName}</span>
          <span className="msg-item-time">{formatTime(msg.timestamp)}</span>
          <button className="msg-item-delete" onClick={() => onDelete(msg.id)} title="Delete">×</button>
        </div>
        <div className="msg-item-content">
          {msg.type === 'typing' ? (
            <em className="msg-item-typing-label">Typing indicator</em>
          ) : msg.type === 'image' ? (
            <span className="msg-item-img-label">📷 Image</span>
          ) : (
            <span>{msg.content}</span>
          )}
        </div>
        {msg.reactions.length > 0 && (
          <div className="msg-item-reactions">
            {msg.reactions.map((r, i) => <span key={i}>{r.emoji}</span>)}
          </div>
        )}
        {msg.readReceipt && (
          <div className="msg-item-receipt">{msg.readReceipt}</div>
        )}
      </div>
    </div>
  )
}

function AddMessageForm({ contacts, onAdd, lastTimestamp }) {
  const [sender, setSender] = useState('me')
  const [type, setType] = useState('text')
  const [content, setContent] = useState('')
  const [readReceipt, setReadReceipt] = useState('')
  const [reactions, setReactions] = useState([])
  const [autoTime, setAutoTime] = useState(true)
  const [manualTime, setManualTime] = useState('')
  const [imagePreview, setImagePreview] = useState(null)
  const fileRef = useRef()

  function toggleReaction(emoji) {
    setReactions((prev) =>
      prev.includes(emoji) ? prev.filter((e) => e !== emoji) : [...prev, emoji]
    )
  }

  function handleImageUpload(e) {
    const file = e.target.files[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = (ev) => setImagePreview(ev.target.result)
    reader.readAsDataURL(file)
  }

  function handleSubmit(e) {
    e.preventDefault()
    if (type === 'text' && !content.trim()) return

    let timestamp
    if (autoTime) {
      timestamp = new Date(lastTimestamp.getTime() + 60000)
    } else {
      timestamp = manualTime ? new Date(manualTime) : new Date()
    }

    onAdd({
      sender,
      type,
      content: type === 'image' ? (imagePreview || '') : content.trim(),
      timestamp,
      readReceipt: readReceipt || null,
      reactions: reactions.map((emoji) => ({ emoji, sender: sender === 'me' ? 'c1' : 'me' })),
    })

    setContent('')
    setReactions([])
    setImagePreview(null)
    if (fileRef.current) fileRef.current.value = ''
  }

  return (
    <form className="add-msg-form" onSubmit={handleSubmit}>
      <div className="form-row">
        <label>Sender</label>
        <select value={sender} onChange={(e) => setSender(e.target.value)}>
          <option value="me">Me</option>
          {contacts.map((c) => (
            <option key={c.id} value={c.id}>{c.name}</option>
          ))}
        </select>
      </div>

      <div className="form-row">
        <label>Type</label>
        <div className="type-btns">
          {['text', 'image', 'typing'].map((t) => (
            <button
              key={t} type="button"
              className={`type-btn ${type === t ? 'active' : ''}`}
              onClick={() => setType(t)}
            >
              {t === 'text' ? '💬 Text' : t === 'image' ? '📷 Image' : '⋯ Typing'}
            </button>
          ))}
        </div>
      </div>

      {type === 'text' && (
        <div className="form-row">
          <label>Message</label>
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Type your message…"
            rows={3}
          />
        </div>
      )}

      {type === 'image' && (
        <div className="form-row">
          <label>Image</label>
          {imagePreview ? (
            <div className="img-preview-wrap">
              <img src={imagePreview} alt="preview" className="img-preview" />
              <button type="button" onClick={() => setImagePreview(null)} className="img-remove">✕</button>
            </div>
          ) : (
            <input ref={fileRef} type="file" accept="image/*" onChange={handleImageUpload} />
          )}
        </div>
      )}

      <div className="form-row">
        <label>Timestamp</label>
        <div className="time-row">
          <label className="checkbox-label">
            <input type="checkbox" checked={autoTime} onChange={(e) => setAutoTime(e.target.checked)} />
            Auto (+1 min)
          </label>
          {!autoTime && (
            <input
              type="datetime-local"
              value={manualTime}
              onChange={(e) => setManualTime(e.target.value)}
            />
          )}
        </div>
      </div>

      <div className="form-row">
        <label>Read Receipt</label>
        <select value={readReceipt} onChange={(e) => setReadReceipt(e.target.value)}>
          {RECEIPT_OPTIONS.map((o) => (
            <option key={o.value} value={o.value}>{o.label}</option>
          ))}
        </select>
      </div>

      <div className="form-row">
        <label>Reactions</label>
        <div className="reaction-picker">
          {REACTION_EMOJIS.map((emoji) => (
            <button
              key={emoji} type="button"
              className={`reaction-pick-btn ${reactions.includes(emoji) ? 'active' : ''}`}
              onClick={() => toggleReaction(emoji)}
            >
              {emoji}
            </button>
          ))}
        </div>
      </div>

      <button type="submit" className="btn-primary add-msg-btn">
        + Add Message
      </button>
    </form>
  )
}

function ContactEditor({ contacts, addContact, updateContact, deleteContact, generateFake, chatName, setChatName, isGroupChat, setIsGroupChat }) {
  const [newName, setNewName] = useState('')

  function handleAdd(e) {
    e.preventDefault()
    if (!newName.trim()) return
    addContact({ name: newName.trim(), avatar: null, color: '#' + Math.floor(Math.random() * 0xFFFFFF).toString(16).padStart(6, '0') })
    setNewName('')
  }

  function handleAvatarUpload(id, e) {
    const file = e.target.files[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = (ev) => updateContact(id, { avatar: ev.target.result })
    reader.readAsDataURL(file)
  }

  return (
    <div className="contact-editor">
      <div className="form-row">
        <label>Chat Name</label>
        <input
          type="text" value={chatName}
          onChange={(e) => setChatName(e.target.value)}
          placeholder="Contact or group name"
        />
      </div>
      <div className="form-row">
        <label className="checkbox-label">
          <input type="checkbox" checked={isGroupChat} onChange={(e) => setIsGroupChat(e.target.checked)} />
          Group Chat
        </label>
      </div>

      <div className="contacts-list">
        {contacts.map((c) => (
          <div key={c.id} className="contact-item">
            <Avatar contact={c} size={32} />
            <div className="contact-item-info">
              <input
                type="text" value={c.name}
                onChange={(e) => updateContact(c.id, { name: e.target.value })}
                className="contact-name-input"
              />
              <div className="contact-item-actions">
                <label className="avatar-upload-label" title="Upload avatar">
                  📷
                  <input type="file" accept="image/*" onChange={(e) => handleAvatarUpload(c.id, e)} hidden />
                </label>
                <input
                  type="color" value={c.color || '#4ECDC4'}
                  onChange={(e) => updateContact(c.id, { color: e.target.value })}
                  title="Avatar color"
                  className="color-picker"
                />
                {contacts.length > 1 && (
                  <button onClick={() => deleteContact(c.id)} className="btn-danger-sm" title="Remove contact">×</button>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="contact-add-row">
        <form onSubmit={handleAdd} style={{ display: 'flex', gap: 6, flex: 1 }}>
          <input
            type="text" value={newName}
            onChange={(e) => setNewName(e.target.value)}
            placeholder="New contact name…"
            className="contact-name-field"
          />
          <button type="submit" className="btn-secondary">Add</button>
        </form>
        <button onClick={generateFake} className="btn-secondary" title="Generate random contact">🎲</button>
      </div>
    </div>
  )
}

function StatusBarEditor({ statusBar, setStatusBar }) {
  return (
    <div className="statusbar-editor">
      <div className="form-row">
        <label>Time</label>
        <input
          type="text" value={statusBar.time} maxLength={5}
          onChange={(e) => setStatusBar({ time: e.target.value })}
          placeholder="9:41"
        />
      </div>
      <div className="form-row">
        <label>Signal</label>
        <input
          type="range" min={0} max={4} value={statusBar.signal}
          onChange={(e) => setStatusBar({ signal: Number(e.target.value) })}
        />
        <span>{statusBar.signal}/4</span>
      </div>
      <div className="form-row">
        <label>Battery %</label>
        <input
          type="number" min={0} max={100} value={statusBar.battery}
          onChange={(e) => setStatusBar({ battery: Number(e.target.value) })}
        />
      </div>
    </div>
  )
}

export default function LeftPanel() {
  const {
    messages, contacts, statusBar, chatName, isGroupChat,
    addMessage, deleteMessage, reorderMessages,
    addContact, updateContact, deleteContact, generateFakeContact,
    setChatName, setIsGroupChat, setStatusBar,
    getLastTimestamp,
    conversations, activeConvId, addConversation, switchConversation, deleteConversation,
  } = useStore()

  const [tab, setTab] = useState('messages')
  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 5 } }))

  function handleDragEnd(event) {
    const { active, over } = event
    if (over && active.id !== over.id) {
      const oldIndex = messages.findIndex((m) => m.id === active.id)
      const newIndex = messages.findIndex((m) => m.id === over.id)
      reorderMessages(arrayMove(messages, oldIndex, newIndex))
    }
  }

  return (
    <aside className="left-panel">
      <div className="conv-tabs">
        {conversations.map(conv => (
          <div
            key={conv.id}
            className={`conv-tab ${conv.id === activeConvId ? 'active' : ''}`}
            onClick={() => switchConversation(conv.id)}
            title={conv.id === activeConvId ? chatName : conv.chatName}
          >
            <span className="conv-tab-name">
              {conv.id === activeConvId ? chatName : conv.chatName}
            </span>
            {conversations.length > 1 && (
              <button
                className="conv-tab-close"
                onClick={(e) => { e.stopPropagation(); deleteConversation(conv.id) }}
                title="Remove conversation"
              >×</button>
            )}
          </div>
        ))}
        <button className="conv-tab-add" onClick={addConversation} title="New conversation">+</button>
      </div>

      <div className="panel-tabs">
        <button className={`panel-tab ${tab === 'messages' ? 'active' : ''}`} onClick={() => setTab('messages')}>
          💬 Messages
        </button>
        <button className={`panel-tab ${tab === 'contacts' ? 'active' : ''}`} onClick={() => setTab('contacts')}>
          👤 Contacts
        </button>
        <button className={`panel-tab ${tab === 'statusbar' ? 'active' : ''}`} onClick={() => setTab('statusbar')}>
          📶 Status
        </button>
      </div>

      {tab === 'messages' && (
        <div className="panel-content">
          <div className="msg-list-wrap">
            <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
              <SortableContext items={messages.map((m) => m.id)} strategy={verticalListSortingStrategy}>
                {messages.map((msg) => (
                  <SortableMessage
                    key={msg.id} msg={msg} contacts={contacts}
                    onDelete={deleteMessage}
                  />
                ))}
              </SortableContext>
            </DndContext>
            {messages.length === 0 && (
              <div className="empty-msg-list">No messages yet. Add one below.</div>
            )}
          </div>
          <div className="add-msg-section">
            <div className="section-title">Add Message</div>
            <AddMessageForm contacts={contacts} onAdd={addMessage} lastTimestamp={getLastTimestamp()} />
          </div>
        </div>
      )}

      {tab === 'contacts' && (
        <div className="panel-content">
          <ContactEditor
            contacts={contacts}
            addContact={addContact}
            updateContact={updateContact}
            deleteContact={deleteContact}
            generateFake={generateFakeContact}
            chatName={chatName}
            setChatName={setChatName}
            isGroupChat={isGroupChat}
            setIsGroupChat={setIsGroupChat}
          />
        </div>
      )}

      {tab === 'statusbar' && (
        <div className="panel-content">
          <StatusBarEditor statusBar={statusBar} setStatusBar={setStatusBar} />
        </div>
      )}
    </aside>
  )
}
