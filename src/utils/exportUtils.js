import { toPng } from 'html-to-image'

export async function exportPNG(elementId = 'phone-screen') {
  const el = document.getElementById(elementId)
  if (!el) throw new Error('Phone screen element not found')

  // Measure how much content is hidden below the scroll in the messages area
  const messagesEl = el.querySelector('.im-messages, .wa-messages, .ig-messages')
  const extraHeight = messagesEl
    ? Math.max(0, messagesEl.scrollHeight - messagesEl.clientHeight)
    : 0

  // Temporarily expand phone-screen so every message is visible
  if (extraHeight > 0) {
    el.style.height = (el.offsetHeight + extraHeight) + 'px'
    // Two rAF cycles let the browser reflow the flex chain before we capture
    await new Promise(r => requestAnimationFrame(() => requestAnimationFrame(r)))
  }

  let dataUrl
  try {
    dataUrl = await toPng(el, { pixelRatio: 3, skipAutoScale: true })
  } finally {
    if (extraHeight > 0) el.style.height = ''
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
