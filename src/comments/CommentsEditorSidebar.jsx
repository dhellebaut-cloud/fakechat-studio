import React from 'react'
import { useCommentsStore } from '../commentsStore'
import CommentEditorPanel from './CommentEditorPanel'
import { BubbleEditorContent } from './FloatingBubbleEditor'

export default function CommentsEditorSidebar() {
  const { commentPlatform } = useCommentsStore()
  const isTikTok = commentPlatform === 'tiktok'

  return (
    <aside className="editor-sidebar">
      {/* Standard comment editor (post + comments tabs) */}
      <CommentEditorPanel />

      {/* Bubble editor — only on TikTok */}
      {isTikTok && (
        <>
          <div className="sidebar-divider" />
          <div className="panel-content" style={{ flex: 'none' }}>
            <BubbleEditorContent />
          </div>
        </>
      )}
    </aside>
  )
}
