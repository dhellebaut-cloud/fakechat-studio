import React, { useState } from 'react'
import { useCommentsStore } from '../commentsStore'
import { exportPNG } from '../utils/exportUtils'

const PLATFORM_LABELS = { tiktok: 'TikTok', facebook: 'Facebook', instagram: 'Instagram' }

export default function CommentsExportPanel() {
  const { commentPlatform, comments } = useCommentsStore()
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
          Captures the phone screen at 3× resolution as a PNG.
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
          <span>Comments</span><span>{comments.length}</span>
        </div>
        <div className="info-stat">
          <span>Platform</span><span>{PLATFORM_LABELS[commentPlatform]}</span>
        </div>
      </div>
    </div>
  )
}
