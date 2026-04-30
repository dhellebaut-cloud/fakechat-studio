import React, { useState } from 'react'
import FloatingPanel from './FloatingPanel'
import FloatingExport from './FloatingExport'
import CenterPanel from './CenterPanel'
import { useStore } from './store'

export default function App() {
  const [panelOpen, setPanelOpen] = useState(true)
  const [exportOpen, setExportOpen] = useState(true)
  const { platform, setPlatform } = useStore()

  return (
    <div className="app">
      <header className="app-header">
        <div className="app-logo">
          <span className="logo-icon">💬</span>
          <span className="logo-text">FakeChat Studio</span>
        </div>

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

        <div className="header-actions">
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
        </div>
      </header>

      <div className="app-body">
        <CenterPanel />
      </div>

      <FloatingPanel visible={panelOpen} onClose={() => setPanelOpen(false)} />
      <FloatingExport visible={exportOpen} onClose={() => setExportOpen(false)} />
    </div>
  )
}
