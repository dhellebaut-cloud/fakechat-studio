import { create } from 'zustand'

let idCounter = 2000
function genId() { return `cmt_${idCounter++}_${Math.random().toString(36).substr(2, 5)}` }

const COLORS = ['#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#DDA0DD', '#98D8C8', '#F0A500', '#7B68EE']
function randomColor() { return COLORS[Math.floor(Math.random() * COLORS.length)] }

function emptyReactions() {
  return { like: 0, love: 0, care: 0, haha: 0, wow: 0, sad: 0, angry: 0 }
}

function defaultTikTokPost() {
  return {
    creatorUsername: '@creator',
    creatorDisplayName: 'Creator',
    creatorAvatar: null,
    creatorAvatarColor: '#FF6B6B',
    caption: 'Check this out! 🔥 #viral #fyp',
    songName: 'Original Sound - Creator',
    thumbnail: null,
    thumbnailColor: '#1a1a2e',
    likeCount: '12.5K',
    commentCount: '234',
    shareCount: '89',
    bookmarkCount: '456',
  }
}

function defaultFacebookPost() {
  return {
    authorName: 'John Doe',
    authorAvatar: null,
    authorAvatarColor: '#4ECDC4',
    timestamp: '2 hours ago',
    postText: 'What a beautiful day! ☀️',
    postImage: null,
    reactions: { like: 24, love: 8, care: 1, haha: 3, wow: 0, sad: 0, angry: 0 },
    commentCount: 12,
    shareCount: 5,
  }
}

function defaultInstagramPost() {
  return {
    username: 'username',
    avatar: null,
    avatarColor: '#45B7D1',
    isVerified: false,
    postImage: null,
    caption: 'Caption here ✨',
    likeCount: 1234,
    timestamp: '2 HOURS AGO',
  }
}

const c1 = genId(), c2 = genId(), c3 = genId(), r1 = genId()

function defaultComments() {
  return [
    {
      id: c1, parentId: null,
      username: 'user123', avatar: null, avatarColor: '#FF6B6B',
      text: 'This is amazing! 🔥',
      timestamp: '2h', likeCount: 42,
      isPinned: false, hasCreatorHeart: false, isVerified: false,
      reactions: { like: 5, love: 2, care: 0, haha: 0, wow: 0, sad: 0, angry: 0 },
    },
    {
      id: c2, parentId: null,
      username: 'another_user', avatar: null, avatarColor: '#4ECDC4',
      text: 'Absolutely love this content 💯',
      timestamp: '1h', likeCount: 18,
      isPinned: false, hasCreatorHeart: false, isVerified: false,
      reactions: { like: 3, love: 1, care: 0, haha: 0, wow: 0, sad: 0, angry: 0 },
    },
    {
      id: r1, parentId: c2,
      username: 'fan_account', avatar: null, avatarColor: '#DDA0DD',
      text: 'Same! I watch every single video 🙌',
      timestamp: '45m', likeCount: 7,
      isPinned: false, hasCreatorHeart: false, isVerified: false,
      reactions: emptyReactions(),
    },
    {
      id: c3, parentId: null,
      username: 'verified_celeb', avatar: null, avatarColor: '#F0A500',
      text: 'Love it! Keep going 🌟',
      timestamp: '30m', likeCount: 156,
      isPinned: false, hasCreatorHeart: true, isVerified: true,
      reactions: { like: 12, love: 8, care: 1, haha: 0, wow: 2, sad: 0, angry: 0 },
    },
  ]
}

function newConvData() {
  return {
    comments: [],
    tikTokPost: defaultTikTokPost(),
    facebookPost: defaultFacebookPost(),
    instagramPost: defaultInstagramPost(),
  }
}

function snapshot(s) {
  return s.conversations.map(c =>
    c.id === s.activeConvId
      ? { ...c, comments: s.comments, tikTokPost: s.tikTokPost, facebookPost: s.facebookPost, instagramPost: s.instagramPost }
      : c
  )
}

const initialConvId = 'cconv1'
const initialConvData = {
  comments: defaultComments(),
  tikTokPost: defaultTikTokPost(),
  facebookPost: defaultFacebookPost(),
  instagramPost: defaultInstagramPost(),
}

export const useCommentsStore = create((set, get) => ({
  commentPlatform: 'tiktok',
  darkMode: false,
  conversations: [{ id: initialConvId, ...initialConvData }],
  activeConvId: initialConvId,
  ...initialConvData,

  setCommentPlatform: (p) => set({ commentPlatform: p }),
  setDarkMode: (v) => set({ darkMode: v }),

  updateTikTokPost: (u) => set((s) => ({ tikTokPost: { ...s.tikTokPost, ...u } })),
  updateFacebookPost: (u) => set((s) => ({ facebookPost: { ...s.facebookPost, ...u } })),
  updateInstagramPost: (u) => set((s) => ({ instagramPost: { ...s.instagramPost, ...u } })),
  updateFacebookPostReactions: (u) => set((s) => ({ facebookPost: { ...s.facebookPost, reactions: { ...s.facebookPost.reactions, ...u } } })),

  addComment: (comment) => {
    const s = get()
    // Unpin others if this one is pinned
    let comments = s.comments
    if (comment.isPinned) comments = comments.map(c => ({ ...c, isPinned: false }))
    set({ comments: [...comments, { ...comment, id: genId(), reactions: comment.reactions || emptyReactions() }] })
  },

  deleteComment: (id) => set((s) => ({
    comments: s.comments.filter((c) => c.id !== id && c.parentId !== id),
  })),

  updateComment: (id, updates) => set((s) => ({
    comments: s.comments.map((c) => (c.id === id ? { ...c, ...updates } : c)),
  })),

  reorderComments: (comments) => set({ comments }),

  addConversation: () => {
    const s = get()
    const newId = genId()
    const data = newConvData()
    set({ conversations: [...snapshot(s), { id: newId, ...data }], activeConvId: newId, ...data })
  },

  switchConversation: (id) => {
    const s = get()
    if (id === s.activeConvId) return
    const saved = snapshot(s)
    const target = saved.find(c => c.id === id)
    if (!target) return
    set({ conversations: saved, activeConvId: id, comments: target.comments, tikTokPost: target.tikTokPost, facebookPost: target.facebookPost, instagramPost: target.instagramPost })
  },

  deleteConversation: (id) => {
    const s = get()
    if (s.conversations.length <= 1) return
    const saved = snapshot(s).filter(c => c.id !== id)
    if (id === s.activeConvId) {
      const next = saved[0]
      set({ conversations: saved, activeConvId: next.id, comments: next.comments, tikTokPost: next.tikTokPost, facebookPost: next.facebookPost, instagramPost: next.instagramPost })
    } else {
      set({ conversations: saved })
    }
  },

  generateAvatarColor: () => randomColor(),
}))
