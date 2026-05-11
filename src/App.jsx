import React, { useRef, useState } from 'react'
import FloatingPanel from './FloatingPanel'
import FloatingExport from './FloatingExport'
import FloatingCommentEditor from './FloatingCommentEditor'
import FloatingCommentsExport from './FloatingCommentsExport'
import CenterPanel from './CenterPanel'
import CommentsWorkspace from './CommentsWorkspace'
import { useStore } from './store'

export default function App() {
  const [workspace, setWorkspace] = useState('messages') // 'messages' | 'comments'
  const [dropdownOpen, setDropdownOpen] = useState(false)
  const [panelOpen, setPanelOpen] = useState(true)
  const [exportOpen, setExportOpen] = useState(true)
  const [commentEditorOpen, setCommentEditorOpen] = useState(true)
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
          <div onClick={() => setDropdownOpen(v => !v)} style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <span className="logo-icon">💬</span>
            <span className="logo-text">FakeChat Studio</span>
            <span style={{ fontSize: 10, opacity: 0.6, marginLeft: 2 }}>▾</span>
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
                  💬 Messages
                </button>
                <button
                  className={`workspace-option ${workspace === 'comments' ? 'active' : ''}`}
                  onClick={() => selectWorkspace('comments')}
                >
                  🗨 Comments
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
          {workspace === 'messages' && (
            <>
              <button
                className={`editor-toggle-btn ${panelOpen ? 'active' : ''}`}
                onClick={() => setPanelOpen(v => !v)}
                title="Toggle editor panel"
              >
                ✏️ Editor
              </button>
              <button
                className={`editor-toggle-btn ${exportOpen ? 'active' : ''}`}
                onClick={() => setExportOpen(v => !v)}
                title="Toggle export panel"
              >
                ⬇ Export
              </button>
            </>
          )}
          {workspace === 'comments' && (
            <>
              <button
                className={`editor-toggle-btn ${commentEditorOpen ? 'active' : ''}`}
                onClick={() => setCommentEditorOpen(v => !v)}
                title="Toggle comment editor"
              >
                ✏️ Editor
              </button>
              <button
                className={`editor-toggle-btn ${commentExportOpen ? 'active' : ''}`}
                onClick={() => setCommentExportOpen(v => !v)}
                title="Toggle export panel"
              >
                ⬇ Export
              </button>
            </>
          )}
        </div>
      </header>

      <div className="app-body">
        {workspace === 'messages' && <CenterPanel />}
        {workspace === 'comments' && <CommentsWorkspace />}
      </div>

      {/* Messages workspace floating panels */}
      <FloatingPanel visible={workspace === 'messages' && panelOpen} onClose={() => setPanelOpen(false)} />
      <FloatingExport visible={workspace === 'messages' && exportOpen} onClose={() => setExportOpen(false)} />

      {/* Comments workspace floating panels */}
      <FloatingCommentEditor visible={workspace === 'comments' && commentEditorOpen} onClose={() => setCommentEditorOpen(false)} />
      <FloatingCommentsExport visible={workspace === 'comments' && commentExportOpen} onClose={() => setCommentExportOpen(false)} />
    </div>
  )
}
