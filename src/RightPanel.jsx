import React, { useState } from 'react'
import { useStore } from './store'
import { exportPNG, exportMP4 } from './utils/exportUtils'

export default function RightPanel() {
  const { platform, messages } = useStore()
  const [delay, setDelay] = useState(800)
  const [bgColor, setBgColor] = useState('#000000')
  const [pngStatus, setPngStatus] = useState(null)
  const [mp4Status, setMp4Status] = useState(null)
  const [mp4Progress, setMp4Progress] = useState(null)
  const [isExporting, setIsExporting] = useState(false)

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

  async function handleExportMP4() {
    if (messages.length === 0) {
      setMp4Status({ type: 'error', msg: 'Add messages first.' })
      return
    }
    setIsExporting(true)
    setMp4Status(null)
    setMp4Progress({ stage: 'starting', pct: 0 })

    try {
      const filename = await exportMP4({
        messages,
        contacts: useStore.getState().contacts,
        platform,
        darkMode: useStore.getState().darkMode,
        delay,
        bgColor,
        onProgress: (p) => setMp4Progress(p),
      })
      setMp4Status({ type: 'success', msg: `Saved: ${filename}` })
      setTimeout(() => setMp4Status(null), 5000)
    } catch (err) {
      setMp4Status({ type: 'error', msg: err.message })
    } finally {
      setIsExporting(false)
      setMp4Progress(null)
    }
  }

  const stageLabel = {
    loading: 'Loading ffmpeg…',
    capturing: 'Capturing frames…',
    encoding: 'Encoding MP4…',
    done: 'Done!',
    starting: 'Starting…',
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
        <div className="section-title">🎬 MP4 Export</div>
        <p className="section-desc">
          Animates messages one by one with typing indicators, rendered at 1080×1920.
        </p>

        <div className="export-setting">
          <label>Bubble delay</label>
          <div className="slider-row">
            <input
              type="range" min={200} max={3000} step={100}
              value={delay} onChange={(e) => setDelay(Number(e.target.value))}
              disabled={isExporting}
            />
            <span>{(delay / 1000).toFixed(1)}s</span>
          </div>
        </div>

        <div className="export-setting">
          <label>Background color</label>
          <div className="color-row">
            <input type="color" value={bgColor} onChange={(e) => setBgColor(e.target.value)} disabled={isExporting} />
            <div className="color-presets">
              {['#000000', '#ffffff', '#1a1a2e', '#16213e', '#f5f5f5'].map((c) => (
                <button
                  key={c}
                  className={`color-preset ${bgColor === c ? 'active' : ''}`}
                  style={{ background: c, border: bgColor === c ? '2px solid #007AFF' : '2px solid transparent' }}
                  onClick={() => setBgColor(c)}
                  disabled={isExporting}
                />
              ))}
            </div>
          </div>
        </div>

        {mp4Progress && (
          <div className="progress-wrap">
            <div className="progress-label">
              {stageLabel[mp4Progress.stage] || mp4Progress.stage} — {Math.round(mp4Progress.pct)}%
            </div>
            <div className="progress-bar">
              <div className="progress-fill" style={{ width: `${mp4Progress.pct}%` }} />
            </div>
          </div>
        )}

        <button
          className="btn-export btn-mp4"
          onClick={handleExportMP4}
          disabled={isExporting}
        >
          {isExporting ? '⏳ Exporting…' : '⬇ Export MP4'}
        </button>
        {mp4Status && (
          <div className={`export-status status-${mp4Status.type}`}>{mp4Status.msg}</div>
        )}

        <p className="export-note">
          MP4 export uses ffmpeg.wasm — first run downloads ~30 MB. No data leaves your browser.
        </p>
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
