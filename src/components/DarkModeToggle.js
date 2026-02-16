'use client'

import { useState, useEffect } from 'react'

export default function DarkModeToggle() {
  const [darkMode, setDarkMode] = useState(true) // Default dark
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    const saved = localStorage.getItem('darkMode')
    if (saved !== null) {
      setDarkMode(saved === 'true')
    }
  }, [])

  useEffect(() => {
    if (mounted) {
      document.body.classList.toggle('light-mode', !darkMode)
      localStorage.setItem('darkMode', darkMode)
    }
  }, [darkMode, mounted])

  if (!mounted) {
    return <div className="dark-mode-toggle">🌙</div>
  }

  return (
    <button 
      onClick={() => setDarkMode(!darkMode)}
      className="dark-mode-toggle"
      title={darkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
    >
      {darkMode ? '☀️' : '🌙'}
    </button>
  )
}
