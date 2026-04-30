import React from 'react'

export default function Avatar({ contact, size = 36 }) {
  if (!contact) return null

  if (contact.avatar) {
    return (
      <img
        src={contact.avatar}
        alt={contact.name}
        style={{
          width: size, height: size,
          borderRadius: '50%',
          objectFit: 'cover',
          flexShrink: 0,
        }}
      />
    )
  }

  const initial = (contact.name || '?')[0].toUpperCase()
  const bg = contact.color || '#888'

  return (
    <div
      style={{
        width: size, height: size,
        borderRadius: '50%',
        background: bg,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        color: '#fff',
        fontSize: size * 0.42,
        fontWeight: 600,
        flexShrink: 0,
        userSelect: 'none',
      }}
    >
      {initial}
    </div>
  )
}
