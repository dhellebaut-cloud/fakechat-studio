import { toPng } from 'html-to-image'

export async function exportPNG(elementId = 'phone-screen') {
  const el = document.getElementById(elementId)
  if (!el) throw new Error('Phone screen element not found')

  // ── Messages workspace: scroll container is the message list ──
  const messagesEl = el.querySelector('.im-messages, .wa-messages, .ig-messages')

  // ── Comments workspace: Facebook / Instagram scroll on outer platform div ──
  const commentsPlatformEl = el.querySelector('[data-platform="facebook"], [data-platform="instagram"]')

  // ── Comments workspace: TikTok has an inner scroll area inside a fixed sheet ──
  const tikTokScrollEl  = el.querySelector('[data-tiktok-scroll]')
  const tikTokSheetEl   = el.querySelector('[data-tiktok-sheet]')

  let extraHeight = 0

  if (messagesEl) {
    // How many pixels are hidden below the visible message area
    extraHeight = Math.max(0, messagesEl.scrollHeight - messagesEl.clientHeight)
  } else if (commentsPlatformEl) {
    // Facebook / Instagram: the outer platform div carries the scroll
    extraHeight = Math.max(0, commentsPlatformEl.scrollHeight - commentsPlatformEl.clientHeight)
  } else if (tikTokScrollEl) {
    // TikTok: scroll lives inside the comment sheet
    extraHeight = Math.max(0, tikTokScrollEl.scrollHeight - tikTokScrollEl.clientHeight)
  }

  // Temporarily expand phone-screen (and the TikTok sheet if applicable)
  if (extraHeight > 0) {
    el.style.height = (el.offsetHeight + extraHeight) + 'px'
    if (tikTokSheetEl) {
      // Grow the comment sheet so its flex child (the scroll area) can expand
      tikTokSheetEl.style.height = (tikTokSheetEl.offsetHeight + extraHeight) + 'px'
    }
    // Two rAF cycles let the browser reflow the flex chain before we capture
    await new Promise(r => requestAnimationFrame(() => requestAnimationFrame(r)))
  }

  let dataUrl
  try {
    dataUrl = await toPng(el, { pixelRatio: 3, skipAutoScale: true })
  } finally {
    if (extraHeight > 0) {
      el.style.height = ''
      if (tikTokSheetEl) tikTokSheetEl.style.height = ''
    }
  }

  // Scale to exactly 1080 px wide
  const img = new Image()
  img.src = dataUrl
  await new Promise(r => { img.onload = r })

  const canvas = document.createElement('canvas')
  canvas.width = 1080
  canvas.height = Math.round(img.naturalHeight * (1080 / img.naturalWidth))
  canvas.getContext('2d').drawImage(img, 0, 0, canvas.width, canvas.height)

  const timestamp = new Date().toISOString().replace(/[:.]/g, '-').slice(0, 19)
  const platform = document.querySelector('[data-platform]')?.dataset.platform || 'chat'
  const filename = `chat-${platform}-${timestamp}.png`

  const link = document.createElement('a')
  link.download = filename
  link.href = canvas.toDataURL('image/png')
  link.click()
  return filename
}

/** Export the speech bubble (#bubble-preview) as a transparent-background PNG at 3×. */
export async function exportBubblePNG() {
  const el = document.getElementById('bubble-preview')
  if (!el) throw new Error('Bubble preview not found — switch to Text Bubble mode first')

  const dataUrl = await toPng(el, {
    pixelRatio: 3,
    skipAutoScale: true,
    backgroundColor: null, // transparent
  })

  const timestamp = new Date().toISOString().replace(/[:.]/g, '-').slice(0, 19)
  const filename = `bubble-${timestamp}.png`

  const link = document.createElement('a')
  link.download = filename
  link.href = dataUrl
  link.click()
  return filename
}
