import React, { useRef, useState } from 'react'
import FloatingExport from './FloatingExport'
import FloatingCommentsExport from './FloatingCommentsExport'
import CenterPanel from './CenterPanel'
import CommentsWorkspace from './CommentsWorkspace'
import LeftPanel from './LeftPanel'
import CommentsEditorSidebar from './comments/CommentsEditorSidebar'
import { useStore } from './store'

export default function App() {
  const [workspace, setWorkspace] = useState('messages') // 'messages' | 'comments'
  const [dropdownOpen, setDropdownOpen] = useState(false)
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [exportOpen, setExportOpen] = useState(true)
  const [commentExportOpen, setCommentExportOpen] = useState(true)
  const { platform, setPlatform } = useStore()
  const dropdownRef = useRef()

  function selectWorkspace(ws) {
    setWorkspace(ws)
    setDropdownOpen(false)
  }

  return (
    <div className="app">
      <header className="app-header">
        {/* Logo with dropdown */}
        <div className="app-logo" style={{ position: 'relative', cursor: 'pointer', userSelect: 'none' }} ref={dropdownRef}>
          <div onClick={() => setDropdownOpen(v => !v)} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <div style={{ width: 28, height: 28, borderRadius: 8, background: 'linear-gradient(135deg,#7c3aed,#a78bfa)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 15 }}>💬</div>
            <span className="logo-text">FakeChat Studio</span>
            <svg width="10" height="6" viewBox="0 0 10 6" fill="none" style={{ opacity: 0.4, marginLeft: -2 }}>
              <path d="M1 1l4 4 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
          {dropdownOpen && (
            <>
              {/* Click-away overlay */}
              <div style={{ position: 'fixed', inset: 0, zIndex: 99 }} onClick={() => setDropdownOpen(false)} />
              <div className="workspace-dropdown">
                <button
                  className={`workspace-option ${workspace === 'messages' ? 'active' : ''}`}
                  onClick={() => selectWorkspace('messages')}
                >
                  ✉️ Messages
                </button>
                <button
                  className={`workspace-option ${workspace === 'comments' ? 'active' : ''}`}
                  onClick={() => selectWorkspace('comments')}
                >
                  🗨️ Comments
                </button>
              </div>
            </>
          )}
        </div>

        {/* Platform switcher — messages workspace only */}
        {workspace === 'messages' && (
          <div className="platform-switcher">
            <button
              className={`platform-btn imessage-btn ${platform === 'imessage' ? 'active' : ''}`}
              onClick={() => setPlatform('imessage')}
            >🍎 iMessage</button>
            <button
              className={`platform-btn whatsapp-btn ${platform === 'whatsapp' ? 'active' : ''}`}
              onClick={() => setPlatform('whatsapp')}
            >📱 WhatsApp</button>
            <button
              className={`platform-btn instagram-btn ${platform === 'instagram' ? 'active' : ''}`}
              onClick={() => setPlatform('instagram')}
            >📸 Instagram</button>
          </div>
        )}

        {workspace === 'comments' && <div style={{ flex: 1 }} />}

        <div className="header-actions">
          <button
            className={`editor-toggle-btn ${sidebarOpen ? 'active' : ''}`}
            onClick={() => setSidebarOpen(v => !v)}
            title="Toggle editor sidebar"
          >
            ✏️ Editor
          </button>
          {workspace === 'messages' && (
            <button
              className={`editor-toggle-btn ${exportOpen ? 'active' : ''}`}
              onClick={() => setExportOpen(v => !v)}
              title="Toggle export panel"
            >
              ⬇ Export
            </button>
          )}
          {workspace === 'comments' && (
            <button
              className={`editor-toggle-btn ${commentExportOpen ? 'active' : ''}`}
              onClick={() => setCommentExportOpen(v => !v)}
              title="Toggle export panel"
            >
              ⬇ Export
            </button>
          )}
        </div>
      </header>

      <div className="app-body">
        {/* Fixed editor sidebar */}
        {sidebarOpen && (
          <aside className="editor-sidebar">
            {workspace === 'messages' && <LeftPanel />}
            {workspace === 'comments' && <CommentsEditorSidebar />}
          </aside>
        )}

        {/* Main workspace */}
        <div style={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
          {workspace === 'messages' && <CenterPanel />}
          {workspace === 'comments' && <CommentsWorkspace />}
        </div>
      </div>

      {/* Export panels — still floating */}
      <FloatingExport visible={workspace === 'messages' && exportOpen} onClose={() => setExportOpen(false)} />
      <FloatingCommentsExport visible={workspace === 'comments' && commentExportOpen} onClose={() => setCommentExportOpen(false)} />
    </div>
  )
}
