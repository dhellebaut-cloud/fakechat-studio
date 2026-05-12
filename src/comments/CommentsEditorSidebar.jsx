import React from 'react'
import { useCommentsStore } from '../commentsStore'
import CommentEditorPanel from './CommentEditorPanel'
import { BubbleEditorContent } from './FloatingBubbleEditor'

export default function CommentsEditorSidebar() {
  const { commentPlatform } = useCommentsStore()
  const isTikTok = commentPlatform === 'tiktok'

  return (
    <aside className="editor-sidebar">
      {/* Comments section */}
      <div className="sidebar-section">
        <div className="sidebar-section-header">
          <span className="sidebar-section-title">💬 Comments</span>
        </div>
        <div className="sidebar-section-body">
          <CommentEditorPanel />
        </div>
      </div>

      {/* Bubble editor — only on TikTok */}
      {isTikTok && (
        <div className="sidebar-section">
          <div className="sidebar-section-header">
            <span className="sidebar-section-title">🗨️ Bubble</span>
          </div>
          <div className="sidebar-section-body sidebar-section-body--padded">
            <BubbleEditorContent />
          </div>
        </div>
      )}
    </aside>
  )
}
