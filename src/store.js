import { create } from 'zustand'

const FAKE_FIRST = ['Alex', 'Jordan', 'Sam', 'Riley', 'Morgan', 'Taylor', 'Casey', 'Drew', 'Jamie', 'Avery']
const FAKE_LAST = ['Smith', 'Johnson', 'Williams', 'Brown', 'Jones', 'Garcia', 'Miller', 'Davis']
const FAKE_COLORS = ['#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#DDA0DD', '#98D8C8', '#F0A500', '#7B68EE']

let idCounter = 1
function genId() { return `id_${idCounter++}_${Math.random().toString(36).substr(2, 5)}` }

function generateFakeContact() {
  const first = FAKE_FIRST[Math.floor(Math.random() * FAKE_FIRST.length)]
  const last = FAKE_LAST[Math.floor(Math.random() * FAKE_LAST.length)]
  const color = FAKE_COLORS[Math.floor(Math.random() * FAKE_COLORS.length)]
  return { id: genId(), name: `${first} ${last}`, avatar: null, color }
}

const defaultContact = { id: 'c1', name: 'Sarah Johnson', avatar: null, color: '#4ECDC4' }

const now = Date.now()
const defaultMessages = [
  {
    id: genId(), sender: 'c1', type: 'text',
    content: 'Hey! How are you doing? 👋',
    timestamp: new Date(now - 5 * 60000), readReceipt: null, reactions: []
  },
  {
    id: genId(), sender: 'me', type: 'text',
    content: "I'm doing great, thanks! Just trying out this new chat app 😊",
    timestamp: new Date(now - 4 * 60000), readReceipt: 'read', reactions: [{ emoji: '❤️', sender: 'c1' }]
  },
  {
    id: genId(), sender: 'c1', type: 'text',
    content: 'Oh cool! Does it look realistic?',
    timestamp: new Date(now - 3 * 60000), readReceipt: null, reactions: []
  },
  {
    id: genId(), sender: 'me', type: 'text',
    content: 'Pretty pixel-perfect if you ask me 😄',
    timestamp: new Date(now - 2 * 60000), readReceipt: 'delivered', reactions: []
  },
]

function newConvData() {
  const contactId = genId()
  return {
    messages: [],
    contacts: [{ id: contactId, name: 'Contact', avatar: null, color: '#4ECDC4' }],
    statusBar: { time: '9:41', signal: 4, battery: 87 },
    chatName: 'New Chat',
    isGroupChat: false,
  }
}

// Snapshot active flat state back into conversations array
function snapshot(s) {
  return s.conversations.map(c =>
    c.id === s.activeConvId
      ? { ...c, messages: s.messages, contacts: s.contacts, statusBar: s.statusBar, chatName: s.chatName, isGroupChat: s.isGroupChat }
      : c
  )
}

const initialConvId = 'conv1'
const initialConvData = {
  messages: defaultMessages,
  contacts: [defaultContact],
  statusBar: { time: '9:41', signal: 4, battery: 87 },
  chatName: 'Sarah Johnson',
  isGroupChat: false,
}

export const useStore = create((set, get) => ({
  // ── Conversations ──
  conversations: [{ id: initialConvId, ...initialConvData }],
  activeConvId: initialConvId,

  // ── Global state ──
  platform: 'imessage',
  darkMode: false,
  showTypingIndicator: false,

  // ── Active conversation flat state ──
  ...initialConvData,

  // ── Global actions ──
  setPlatform: (platform) => set({ platform }),
  setDarkMode: (darkMode) => set({ darkMode }),
  setShowTypingIndicator: (show) => set({ showTypingIndicator: show }),

  // ── Per-conversation actions ──
  setChatName: (chatName) => set({ chatName }),
  setIsGroupChat: (isGroupChat) => set({ isGroupChat }),
  setStatusBar: (updates) => set((s) => ({ statusBar: { ...s.statusBar, ...updates } })),

  addMessage: (msg) => set((s) => ({
    messages: [...s.messages, { ...msg, id: genId(), reactions: msg.reactions || [] }]
  })),

  updateMessage: (id, updates) => set((s) => ({
    messages: s.messages.map((m) => (m.id === id ? { ...m, ...updates } : m))
  })),

  deleteMessage: (id) => set((s) => ({
    messages: s.messages.filter((m) => m.id !== id)
  })),

  reorderMessages: (messages) => set({ messages }),

  addReaction: (msgId, emoji, sender) => set((s) => ({
    messages: s.messages.map((m) => {
      if (m.id !== msgId) return m
      const existing = m.reactions.findIndex((r) => r.emoji === emoji && r.sender === sender)
      if (existing >= 0) return { ...m, reactions: m.reactions.filter((_, i) => i !== existing) }
      return { ...m, reactions: [...m.reactions, { emoji, sender }] }
    })
  })),

  addContact: (contact) => set((s) => ({
    contacts: [...s.contacts, { ...contact, id: genId() }]
  })),

  updateContact: (id, updates) => set((s) => ({
    contacts: s.contacts.map((c) => (c.id === id ? { ...c, ...updates } : c))
  })),

  deleteContact: (id) => set((s) => ({
    contacts: s.contacts.filter((c) => c.id !== id),
    messages: s.messages.filter((m) => m.sender !== id),
  })),

  generateFakeContact: () => {
    const contact = generateFakeContact()
    set((s) => ({ contacts: [...s.contacts, contact] }))
    return contact
  },

  clearMessages: () => set({ messages: [] }),

  getContact: (id) => get().contacts.find((c) => c.id === id),

  getLastTimestamp: () => {
    const msgs = get().messages
    if (msgs.length === 0) return new Date()
    return new Date(msgs[msgs.length - 1].timestamp)
  },

  // ── Conversation management ──
  addConversation: () => {
    const s = get()
    const newId = genId()
    const data = newConvData()
    set({
      conversations: [...snapshot(s), { id: newId, ...data }],
      activeConvId: newId,
      ...data,
    })
  },

  switchConversation: (id) => {
    const s = get()
    if (id === s.activeConvId) return
    const saved = snapshot(s)
    const target = saved.find(c => c.id === id)
    if (!target) return
    set({
      conversations: saved,
      activeConvId: id,
      messages: target.messages,
      contacts: target.contacts,
      statusBar: target.statusBar,
      chatName: target.chatName,
      isGroupChat: target.isGroupChat,
    })
  },

  deleteConversation: (id) => {
    const s = get()
    if (s.conversations.length <= 1) return
    const saved = snapshot(s).filter(c => c.id !== id)
    if (id === s.activeConvId) {
      const next = saved[0]
      set({
        conversations: saved,
        activeConvId: next.id,
        messages: next.messages,
        contacts: next.contacts,
        statusBar: next.statusBar,
        chatName: next.chatName,
        isGroupChat: next.isGroupChat,
      })
    } else {
      set({ conversations: saved })
    }
  },
}))
