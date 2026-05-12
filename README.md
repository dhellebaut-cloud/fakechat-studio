# FakeChat Studio

A visual conversation builder that renders pixel-accurate chat interfaces for **iMessage**, **WhatsApp**, and **Instagram DMs** — entirely in the browser. No data ever leaves localhost.

---

## Deployment

The live version is hosted on GitHub Pages:

**https://dhellebaut-cloud.github.io/task-app/index.html**

After every change, always build and push to keep the live site up to date:

```bash
npm run build
git add -A
git commit -m "your message"
git push origin main
```

GitHub Pages serves the `docs/` folder. The build output goes there automatically via `vite.config.js`.

---

## Quick start

```bash
npm install
npm run dev
```

Open **http://localhost:5173**

---

## Layout

| Zone | Description |
|---|---|
| **Header** | Logo + Editor toggle button |
| **Center** | Platform switcher + Light/Dark toggle, then the live phone preview |
| **Right panel** | PNG / MP4 export controls |
| **Floating Editor** | Draggable panel — drag by its title bar, close with the red dot, reopen with the Editor button |

---

## Features

### Platform switcher
Centered above the phone. Switches between **iMessage**, **WhatsApp**, and **Instagram DMs** instantly.

### Light / Dark toggle
Pill control above the phone, right side. Affects **only the phone UI** — the app shell stays light.

- iMessage dark: black bg, dark-gray received bubbles, iOS-blue sent
- WhatsApp dark: `#111B21` bg, `#1F2C34` header, `#202C33` / `#005C4B` bubbles
- Instagram: always dark (`#000`), purple-gradient sent bubbles

### Floating Editor panel
- **Drag** by the "EDITOR" title bar to reposition anywhere on screen
- **Close** with the red macOS-style button; **reopen** with the ✏️ Editor button in the header
- Three tabs: **Messages**, **Contacts**, **Status**

### Messages tab
- Add **text**, **image** (upload), or **typing indicator** messages
- Set **sender** (Me or any contact), **timestamp** (auto +1 min or manual), **read receipt**, and **emoji reactions**
- **Drag handles** (⠿) to reorder messages
- **× button** to delete individual messages

### Contacts tab
- Edit contact **name** and **avatar color** inline
- Upload a custom **avatar image**
- **🎲 Generate** a random fake name + color
- Toggle **Group Chat** mode; set the **chat name**

### Status tab
- Set the phone **status bar** time, signal strength (0–4 bars), and battery percentage

---

## Platform UI details

### iMessage
- `-apple-system` / SF Pro font
- Blue `#007AFF` sent bubbles, `#E5E5EA` received (light) / `#3A3A3C` (dark)
- Tail corner (4 px) on last bubble in each consecutive group
- Delivered / Read receipt below last sent message
- Video-call icon in header; avatar stacked above name

### WhatsApp
- Roboto / Helvetica font
- Light mode: `#EFEAE2` bg with subtle dot wallpaper, `#DCF8C6` sent, white received
- Dark mode: `#111B21` bg (no wallpaper), `#005C4B` sent, `#202C33` received
- Timestamps + single/double checkmarks inside bubbles
- Bubble tail via CSS triangle

### Instagram DMs
- Always dark (`#000` bg, `#262626` received)
- Sent bubbles: `linear-gradient(135deg, #8B5CF6, #EC4899)` purple → pink
- Story ring around contact avatar in header
- Tap any bubble to reveal its timestamp

---

## Export

### PNG
Captures the phone screen at **3× resolution** using `html2canvas`. Downloads as `chat-[platform]-[timestamp].png`.

### MP4 (1080 × 1920)
Animates the conversation frame-by-frame:
1. Messages appear one by one with a configurable delay (default 0.8 s)
2. A typing indicator plays before each incoming message
3. Frames are encoded to H.264 MP4 by **ffmpeg.wasm** — fully in-browser, no upload

Configurable: **bubble delay** slider, **background colour** picker (presets + custom).

> First MP4 export downloads ~30 MB of WebAssembly. Subsequent runs reuse the cached binary.

---

## Tech stack

| Library | Purpose |
|---|---|
| Vite + React 18 | Build tooling + UI |
| Zustand | Global state |
| @dnd-kit | Drag-and-drop message reordering |
| html2canvas | PNG capture |
| @ffmpeg/ffmpeg | In-browser MP4 encoding |

### COOP / COEP headers
`vite.config.js` sets `Cross-Origin-Opener-Policy: same-origin` and `Cross-Origin-Embedder-Policy: require-corp` so `SharedArrayBuffer` (required by ffmpeg.wasm) is available in development.
