import React, { useState } from 'react'
import { useStore } from './store'
import { exportPNG } from './utils/exportUtils'

export default function RightPanel() {
  const { platform, messages } = useStore()
  const [pngStatus, setPngStatus] = useState(null)

  async function handleExportPNG() {
    setPngStatus({ type: 'loading', msg: 'Capturing…' })
    try {
      const filename = await exportPNG('phone-screen')
      setPngStatus({ type: 'success', msg: `Saved: ${filename}` })
      setTimeout(() => setPngStatus(null), 3000)
    } catch (err) {
      setPngStatus({ type: 'error', msg: err.message })
    }
  }

  return (
    <div className="right-panel">
      <div className="right-panel-section">
        <div className="section-title">📸 PNG Export</div>
        <p className="section-desc">
          Captures the phone screen at 3× resolution as a transparent PNG.
        </p>
        <button
          className="btn-export btn-png"
          onClick={handleExportPNG}
          disabled={pngStatus?.type === 'loading'}
        >
          {pngStatus?.type === 'loading' ? '⏳ Capturing…' : '⬇ Export PNG'}
        </button>
        {pngStatus && (
          <div className={`export-status status-${pngStatus.type}`}>{pngStatus.msg}</div>
        )}
      </div>

      <div className="right-panel-divider" />

      <div className="right-panel-section">
        <div className="section-title">ℹ️ Info</div>
        <div className="info-stat">
          <span>Messages</span><span>{messages.length}</span>
        </div>
        <div className="info-stat">
          <span>Platform</span>
          <span>{platform === 'imessage' ? 'iMessage' : platform === 'whatsapp' ? 'WhatsApp' : 'Instagram'}</span>
        </div>
      </div>
    </div>
  )
}
