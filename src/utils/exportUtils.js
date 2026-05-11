import html2canvas from 'html2canvas'
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

async function sleep(ms) {
  return new Promise((r) => setTimeout(r, ms))
}

export async function exportMP4({ messages, contacts, platform, darkMode, delay = 800, bgColor = '#000000', onProgress }) {
  const { FFmpeg } = await import('@ffmpeg/ffmpeg')
  const { fetchFile, toBlobURL } = await import('@ffmpeg/util')

  const ffmpeg = new FFmpeg()

  onProgress?.({ stage: 'loading', pct: 0 })

  const baseURL = 'https://unpkg.com/@ffmpeg/core@0.12.6/dist/umd'
  await ffmpeg.load({
    coreURL: await toBlobURL(`${baseURL}/ffmpeg-core.js`, 'text/javascript'),
    wasmURL: await toBlobURL(`${baseURL}/ffmpeg-core.wasm`, 'application/wasm'),
  })

  onProgress?.({ stage: 'capturing', pct: 10 })

  const el = document.getElementById('phone-screen')
  if (!el) throw new Error('Phone screen element not found')

  const frames = []
  let frameIndex = 0

  async function captureFrame() {
    const canvas = await html2canvas(el, {
      useCORS: true,
      allowTaint: true,
      scale: 2,
      backgroundColor: null,
      logging: false,
    })

    // Composite onto 1080x1920 canvas with bg color
    const out = document.createElement('canvas')
    out.width = 1080
    out.height = 1920
    const ctx = out.getContext('2d')
    ctx.fillStyle = bgColor
    ctx.fillRect(0, 0, 1080, 1920)
    const scale = Math.min(1080 / canvas.width, 1920 / canvas.height) * 0.85
    const x = (1080 - canvas.width * scale) / 2
    const y = (1920 - canvas.height * scale) / 2
    ctx.drawImage(canvas, x, y, canvas.width * scale, canvas.height * scale)

    const blob = await new Promise((r) => out.toBlob(r, 'image/png'))
    const arrBuf = await blob.arrayBuffer()
    return new Uint8Array(arrBuf)
  }

  // Store original messages, animate from empty
  const store = await import('../store')
  const { useStore } = store
  const state = useStore.getState()
  const originalMessages = [...state.messages]
  const originalTyping = state.showTypingIndicator

  state.clearMessages()
  state.setShowTypingIndicator(false)

  await sleep(200)

  // Capture empty state (10 frames = 1s at 10fps)
  for (let f = 0; f < 10; f++) {
    frames.push(await captureFrame())
    frameIndex++
  }

  for (let i = 0; i < originalMessages.length; i++) {
    const msg = originalMessages[i]
    const pct = 10 + (i / originalMessages.length) * 80

    onProgress?.({ stage: 'capturing', pct })

    if (msg.sender !== 'me') {
      // Show typing indicator
      state.setShowTypingIndicator(true)
      await sleep(100)
      const typingFrames = Math.round(15 * (delay / 800))
      for (let f = 0; f < typingFrames; f++) {
        frames.push(await captureFrame())
      }
      state.setShowTypingIndicator(false)
      await sleep(50)
    }

    // Add the message
    state.addMessage(msg)
    await sleep(100)

    const holdFrames = Math.round(8 * (delay / 800))
    for (let f = 0; f < holdFrames; f++) {
      frames.push(await captureFrame())
    }
  }

  // Hold on final state for 2s
  for (let f = 0; f < 20; f++) {
    frames.push(await captureFrame())
  }

  // Restore state
  useStore.setState({ messages: originalMessages, showTypingIndicator: originalTyping })

  onProgress?.({ stage: 'encoding', pct: 90 })

  // Write frames to ffmpeg FS
  for (let i = 0; i < frames.length; i++) {
    const name = `frame${String(i).padStart(5, '0')}.png`
    await ffmpeg.writeFile(name, frames[i])
  }

  await ffmpeg.exec([
    '-framerate', '10',
    '-i', 'frame%05d.png',
    '-c:v', 'libx264',
    '-pix_fmt', 'yuv420p',
    '-preset', 'fast',
    '-crf', '23',
    'output.mp4',
  ])

  const data = await ffmpeg.readFile('output.mp4')
  const blob = new Blob([data.buffer], { type: 'video/mp4' })
  const url = URL.createObjectURL(blob)

  const timestamp = new Date().toISOString().replace(/[:.]/g, '-').slice(0, 19)
  const filename = `chat-${platform}-${timestamp}.mp4`
  const link = document.createElement('a')
  link.download = filename
  link.href = url
  link.click()
  URL.revokeObjectURL(url)

  onProgress?.({ stage: 'done', pct: 100 })
  return filename
}
