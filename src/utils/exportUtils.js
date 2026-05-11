import { toPng } from 'html-to-image'

export async function exportPNG(elementId = 'phone-screen') {
  const el = document.getElementById(elementId)
  if (!el) throw new Error('Phone screen element not found')

  const dataUrl = await toPng(el, {
    pixelRatio: 3,
    skipAutoScale: true,
  })

  const timestamp = new Date().toISOString().replace(/[:.]/g, '-').slice(0, 19)
  const platform = document.querySelector('[data-platform]')?.dataset.platform || 'chat'
  const filename = `chat-${platform}-${timestamp}.png`

  const link = document.createElement('a')
  link.download = filename
  link.href = dataUrl
  link.click()
  return filename
}
