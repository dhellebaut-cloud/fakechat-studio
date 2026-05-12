import React, { useEffect, useRef, useState } from 'react'
import { useCommentsStore } from './commentsStore'
import PhoneFrame from './PhoneFrame'
import TikTokComments from './comments/TikTokComments'
import FacebookComments from './comments/FacebookComments'
import InstagramComments from './comments/InstagramComments'
import TextBubbleDisplay from './comments/TextBubbleDisplay'

const PLATFORM_MAP = { tiktok: TikTokComments, facebook: FacebookComments, instagram: InstagramComments }
const PHONE_W = 393
const PHONE_H = 852

const PLATFORM_LABELS = {
  tiktok: '🎵 TikTok',
  facebook: '👥 Facebook',
  instagram: '📸 Instagram',
}

export default function CommentsWorkspace() {
  const { commentPlatform, setCommentPlatform, darkMode, setDarkMode } = useCommentsStore()
  const PlatformView = PLATFORM_MAP[commentPlatform]
  const containerRef = useRef()
  const [scale, setScale] = useState(1)

  const isTikTok = commentPlatform === 'tiktok'

  useEffect(() => {
    function updateScale() {
      if (!containerRef.current) return
      const { width, height } = containerRef.current.getBoundingClientRect()
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
      <div className="controls-row">
        {/* Platform switcher */}
        <div className="platform-switcher-inline">
          {Object.entries(PLATFORM_LABELS).map(([key, label]) => (
            <button
              key={key}
              className={`platform-btn ${key}-btn ${commentPlatform === key ? 'active' : ''}`}
              onClick={() => setCommentPlatform(key)}
            >
              {label}
            </button>
          ))}
        </div>

        {/* Dark/light toggle (TikTok always dark) */}
        {commentPlatform !== 'tiktok' && (
          <div
            className={`phone-mode-toggle ${darkMode ? 'is-dark' : 'is-light'}`}
            onClick={() => setDarkMode(!darkMode)}
            role="button" tabIndex={0}
            onKeyDown={e => e.key === 'Enter' && setDarkMode(!darkMode)}
          >
            <span className={`pmt-pill ${!darkMode ? 'selected' : ''}`}>☀ Light</span>
            <span className={`pmt-pill ${darkMode ? 'selected' : ''}`}>☽ Dark</span>
          </div>
        )}
      </div>

      <div className="center-phone-wrap">
        <PhoneFrame scale={scale}>
          <PlatformView />
        </PhoneFrame>
      </div>

      {/* Bubble preview — always shown on TikTok */}
      {isTikTok && <TextBubbleDisplay />}
    </main>
  )
}
