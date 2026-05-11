import React, { useState, useRef } from 'react'
import CommentsExportPanel from './comments/CommentsExportPanel'

export default function FloatingCommentsExport({ visible, onClose }) {
  const [pos, setPos] = useState(() => ({
    x: Math.min(window.innerWidth - 340, window.innerWidth / 2 + 215),
    y: 76,
  }))
  const panelRef = useRef()

  function handleDragStart(e) {
    if (e.target.closest('input,textarea,select,button,label')) return
    const rect = panelRef.current.getBoundingClientRect()
    const ox = e.clientX - rect.left
    const oy = e.clientY - rect.top

    function onMove(e) {
      const x = Math.max(0, Math.min(window.innerWidth - rect.width, e.clientX - ox))
      const y = Math.max(56, Math.min(window.innerHeight - 80, e.clientY - oy))
      panelRef.current.style.left = x + 'px'
      panelRef.current.style.top = y + 'px'
    }

    function onUp() {
      const x = parseFloat(panelRef.current.style.left) || pos.x
      const y = parseFloat(panelRef.current.style.top) || pos.y
      setPos({ x, y })
      document.removeEventListener('mousemove', onMove)
      document.removeEventListener('mouseup', onUp)
    }

    document.addEventListener('mousemove', onMove)
    document.addEventListener('mouseup', onUp)
    e.preventDefault()
  }

  if (!visible) return null

  return (
    <div ref={panelRef} className="floating-panel" style={{ left: pos.x, top: pos.y }}>
      <div className="floating-panel-handle" onMouseDown={handleDragStart}>
        <span className="floating-panel-grip">⠿⠿</span>
        <span className="floating-panel-title">Export</span>
        <button className="floating-panel-close" onClick={onClose} title="Close panel">×</button>
      </div>
      <CommentsExportPanel />
    </div>
  )
}
