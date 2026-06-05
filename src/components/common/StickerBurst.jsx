import { useEffect, useState } from 'react'

const STICKERS = ['🎀', '✨', '🌸', '💕', '🍓', '💫', '🌷', '🎊']

export default function StickerBurst({ trigger }) {
  const [bursts, setBursts] = useState([])

  useEffect(() => {
    if (!trigger) return
    const items = Array.from({ length: 6 }, (_, i) => ({
      id: Date.now() + i,
      sticker: STICKERS[i % STICKERS.length],
      left: 30 + Math.random() * 40,
      delay: i * 80,
    }))
    setBursts(items)
    const t = setTimeout(() => setBursts([]), 1600)
    return () => clearTimeout(t)
  }, [trigger])

  return (
    <>
      {bursts.map(b => (
        <div
          key={b.id}
          style={{
            position: 'fixed',
            bottom: '120px',
            left: `${b.left}%`,
            fontSize: '32px',
            pointerEvents: 'none',
            zIndex: 999,
            animationDelay: `${b.delay}ms`,
            animation: 'stickerPop 1.2s ease forwards',
          }}
        >
          {b.sticker}
        </div>
      ))}
      <style>{`
        @keyframes stickerPop {
          0% { transform: scale(0) rotate(-30deg); opacity: 1; }
          50% { transform: scale(1.4) rotate(10deg); opacity: 1; }
          100% { transform: scale(1) translateY(-80px) rotate(5deg); opacity: 0; }
        }
      `}</style>
    </>
  )
}
