'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useState, useEffect } from 'react'

const navigation = {
  quick: [
    { name: 'Home', icon: '🏠', slug: 'all' },
    { name: 'Favorites', icon: '❤️', slug: 'favorites' },
    { name: 'Recently Played', icon: '🕐', slug: 'recent' },
  ],
  featured: [
    { name: 'New Games', icon: '✨', slug: 'new' },
    { name: 'Popular', icon: '🔥', slug: 'popular' },
    { name: 'Trending', icon: '📈', slug: 'trending' },
  ],
  categories: [
    { name: 'Action', icon: '⚔️', slug: 'action' },
    { name: 'Puzzle', icon: '🧩', slug: 'puzzle' },
    { name: 'Racing', icon: '🏎️', slug: 'racing' },
    { name: 'Sports', icon: '⚽', slug: 'sports' },
    { name: 'Adventure', icon: '🗺️', slug: 'adventure' },
    { name: 'Arcade', icon: '🕹️', slug: 'arcade' },
    { name: 'Strategy', icon: '🎯', slug: 'strategy' },
    { name: 'Casual', icon: '🎲', slug: 'casual' },
    { name: 'Multiplayer', icon: '👥', slug: 'multiplayer' },
    { name: '2 Player', icon: '🎮', slug: '2player' },
  ],
}

export default function Sidebar() {
  const pathname = usePathname()
  const [isOpen, setIsOpen] = useState(false)
  const [isMobile, setIsMobile] = useState(false)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    const checkMobile = () => {
      const mobile = window.innerWidth < 768
      setIsMobile(mobile)
      setIsOpen(!mobile) // Desktop: mở, Mobile: đóng
    }
    
    checkMobile()
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [])
  
  const getHref = (slug) => {
    if (slug === 'all') return '/'
    if (slug === 'favorites') return '/favorites'
    if (slug === 'recent') return '/recent'
    if (slug === 'new') return '/new'
    if (slug === 'popular') return '/popular'
    if (slug === 'trending') return '/trending'
    return `/category/${slug}`
  }

  const isActive = (slug) => {
    if (slug === 'all') return pathname === '/'
    if (slug === 'favorites') return pathname === '/favorites'
    if (slug === 'recent') return pathname === '/recent'
    if (slug === 'new') return pathname === '/new'
    if (slug === 'popular') return pathname === '/popular'
    if (slug === 'trending') return pathname === '/trending'
    return pathname === `/category/${slug}`
  }

  // Prevent hydration mismatch
  if (!mounted) {
    return (
      <>
        <button className="sidebar-toggle" aria-label="Toggle menu">
          <span className="toggle-icon">☰</span>
          <span className="toggle-text">Menu</span>
        </button>
        <aside className="sidebar sidebar-open">
          <div className="sidebar-scroll">
            <div className="sidebar-section">
              <nav className="nav-list">
                {navigation.quick.map((item) => (
                  <Link
                    key={item.slug}
                    href={getHref(item.slug)}
                    className="nav-item"
                  >
                    <span className="nav-icon">{item.icon}</span>
                    <span className="nav-name">{item.name}</span>
                  </Link>
                ))}
              </nav>
            </div>
            <div className="sidebar-section">
              <h4 className="section-label">Featured</h4>
              <nav className="nav-list">
                {navigation.featured.map((item) => (
                  <Link
                    key={item.slug}
                    href={getHref(item.slug)}
                    className="nav-item"
                  >
                    <span className="nav-icon">{item.icon}</span>
                    <span className="nav-name">{item.name}</span>
                  </Link>
                ))}
              </nav>
            </div>
            <div className="sidebar-section">
              <h4 className="section-label">Categories</h4>
              <nav className="nav-list">
                {navigation.categories.map((item) => (
                  <Link
                    key={item.slug}
                    href={getHref(item.slug)}
                    className="nav-item"
                  >
                    <span className="nav-icon">{item.icon}</span>
                    <span className="nav-name">{item.name}</span>
                  </Link>
                ))}
              </nav>
            </div>
            <div className="sidebar-ad">
              <div className="ad-box">
                📢 Ad<br/>(300x250)
              </div>
            </div>
          </div>
        </aside>
      </>
    )
  }

  return (
    <>
      {/* Toggle Button - Always visible */}
      <button 
        className="sidebar-toggle"
        onClick={() => setIsOpen(!isOpen)}
        aria-label="Toggle menu"
      >
        <span className="toggle-icon">{isOpen ? '✕' : '☰'}</span>
        <span className="toggle-text">{isOpen ? 'Close' : 'Menu'}</span>
      </button>

      {/* Sidebar */}
      <aside className={`sidebar ${isOpen ? 'sidebar-open' : 'sidebar-closed'}`}>
        <div className="sidebar-scroll">
          {/* Quick Access */}
          <div className="sidebar-section">
            <nav className="nav-list">
              {navigation.quick.map((item) => (
                <Link
                  key={item.slug}
                  href={getHref(item.slug)}
                  className={`nav-item ${isActive(item.slug) ? 'active' : ''}`}
                  onClick={() => isMobile && setIsOpen(false)}
                >
                  <span className="nav-icon">{item.icon}</span>
                  <span className="nav-name">{item.name}</span>
                </Link>
              ))}
            </nav>
          </div>

          {/* Featured */}
          <div className="sidebar-section">
            <h4 className="section-label">Featured</h4>
            <nav className="nav-list">
              {navigation.featured.map((item) => (
                <Link
                  key={item.slug}
                  href={getHref(item.slug)}
                  className={`nav-item ${isActive(item.slug) ? 'active' : ''}`}
                  onClick={() => isMobile && setIsOpen(false)}
                >
                  <span className="nav-icon">{item.icon}</span>
                  <span className="nav-name">{item.name}</span>
                </Link>
              ))}
            </nav>
          </div>

          {/* Categories */}
          <div className="sidebar-section">
            <h4 className="section-label">Categories</h4>
            <nav className="nav-list">
              {navigation.categories.map((item) => (
                <Link
                  key={item.slug}
                  href={getHref(item.slug)}
                  className={`nav-item ${isActive(item.slug) ? 'active' : ''}`}
                  onClick={() => isMobile && setIsOpen(false)}
                >
                  <span className="nav-icon">{item.icon}</span>
                  <span className="nav-name">{item.name}</span>
                </Link>
              ))}
            </nav>
          </div>

          {/* Ad Space */}
          <div className="sidebar-ad">
            <div className="ad-box">
              📢 Ad<br/>(300x250)
            </div>
          </div>
        </div>
      </aside>

      {/* Overlay - Only on mobile */}
      {isMobile && isOpen && (
        <div 
          className="sidebar-overlay"
          onClick={() => setIsOpen(false)}
        />
      )}
    </>
  )
}
