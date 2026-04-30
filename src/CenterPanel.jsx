import React, { useEffect, useRef, useState } from 'react'
import { useStore } from './store'
import PhoneFrame from './PhoneFrame'
import IMessage from './platforms/IMessage'
import WhatsApp from './platforms/WhatsApp'
import Instagram from './platforms/Instagram'

const PLATFORM_MAP = { imessage: IMessage, whatsapp: WhatsApp, instagram: Instagram }
const PHONE_W = 413
const PHONE_H = 852

export default function CenterPanel() {
  const { platform, darkMode, setDarkMode } = useStore()
  const PlatformChat = PLATFORM_MAP[platform]
  const containerRef = useRef()
  const [scale, setScale] = useState(1)

  useEffect(() => {
    function updateScale() {
      if (!containerRef.current) return
      const { width, height } = containerRef.current.getBoundingClientRect()
      // Reserve 60px for controls row above phone, 24px padding bottom
      const s = Math.min(1, (height - 84) / PHONE_H, (width - 32) / PHONE_W)
      setScale(Math.max(0.3, s))
    }
    updateScale()
    const ro = new ResizeObserver(updateScale)
    if (containerRef.current) ro.observe(containerRef.current)
    return () => ro.disconnect()
  }, [])

  return (
    <main className="center-panel" ref={containerRef}>
      {/* Dark/light toggle above the phone */}
      <div className="controls-row">
        <div
          className={`phone-mode-toggle ${darkMode ? 'is-dark' : 'is-light'}`}
          onClick={() => setDarkMode(!darkMode)}
          role="button" tabIndex={0}
          onKeyDown={e => e.key === 'Enter' && setDarkMode(!darkMode)}
        >
          <span className={`pmt-pill ${!darkMode ? 'selected' : ''}`}>☀ Light</span>
          <span className={`pmt-pill ${darkMode ? 'selected' : ''}`}>☽ Dark</span>
        </div>
      </div>

      {/* Phone */}
      <div className="center-phone-wrap">
        <PhoneFrame scale={scale}>
          <PlatformChat />
        </PhoneFrame>
      </div>
    </main>
  )
}
