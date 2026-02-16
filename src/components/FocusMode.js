'use client'

import { useState } from 'react'

export default function FocusMode({ children, gameTitle }) {
  const [focusMode, setFocusMode] = useState(false)

  const enterFocus = () => {
    setFocusMode(true)
    document.body.style.overflow = 'hidden'
  }

  const exitFocus = () => {
    setFocusMode(false)
    document.body.style.overflow = 'auto'
  }

  return (
    <>
      <button 
        onClick={enterFocus}
        className="focus-mode-toggle"
        title="Enter Focus Mode (Fullscreen)"
      >
        🎯 Focus Mode
      </button>

      {focusMode && (
        <div className="focus-mode-fullscreen">
          <div className="focus-header">
            <span className="focus-title">{gameTitle}</span>
            <button onClick={exitFocus} className="focus-exit">
              ✕ Exit Focus Mode (ESC)
            </button>
          </div>
          <div className="focus-game-container">
            {children}
          </div>
        </div>
      )}

      {!focusMode && children}
    </>
  )
}
