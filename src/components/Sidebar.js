'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useState, useEffect } from 'react'

// Icon mapping cho categories
const categoryIcons = {
  'Action': '⚔️',
  'Puzzle': '🧩',
  'Racing': '🏎️',
  'Sports': '⚽',
  'Adventure': '🗺️',
  'Arcade': '🕹️',
  'Strategy': '🎯',
  'Casual': '🎲',
  'Multiplayer': '👥',
  'Shooter': '🔫',
  'Fighting': '🥊',
  'Platform': '🪜',
  'Simulation': '🎮',
  'RPG': '🐉',
  'Card': '🃏',
  'Board': '♟️',
  'Music': '🎵',
  'Educational': '📚',
  'Clicker': '👆',
  'Idle': '⏰',
  'Tower Defense': '🗼',
  'Match 3': '💎',
  'Cooking': '👨‍🍳',
  'Dress Up': '👗',
  'Baby': '👶',
  'Girls': '👧',
  'Boys': '👦',
  'Kids': '🧒',
  'Junior': '🎈',
  'Classic': '🎰',
  'Retro': '👾',
  'Skill': '🎪',
  'Trivia': '❓',
  'Word': '📝',
  'Math': '🔢',
  'Memory': '🧠',
  'Hidden Object': '🔍',
  'Escape': '🚪',
  'Defense': '🛡️',
  'War': '⚔️',
  'Zombie': '🧟',
  'Car': '🚗',
  'Bike': '🏍️',
  'Truck': '🚚',
  'Parking': '🅿️',
  'Flying': '✈️',
  'Space': '🚀',
  'Soccer': '⚽',
  'Basketball': '🏀',
  'Football': '🏈',
  'Tennis': '🎾',
  'Golf': '⛳',
  'Baseball': '⚾',
  'Hockey': '🏒',
  'Boxing': '🥊',
  'Wrestling': '🤼',
  'Stickman': '🚶',
  'Animal': '🐾',
  'Dragon': '🐉',
  'Princess': '👸',
  'Knight': '🤺',
  'Ninja': '🥷',
  'Pirate': '🏴‍☠️',
  'Robot': '🤖',
  'Alien': '👽',
  'Monster': '👹',
  'Halloween': '🎃',
  'Christmas': '🎄',
  'Easter': '🐰',
  'Valentine': '💝',
  'Winter': '❄️',
  'Summer': '☀️',
  'Spring': '🌸',
  'Fall': '🍂',
}

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
}

export default function Sidebar() {
  const pathname = usePathname()
  const [isOpen, setIsOpen] = useState(false)
  const [isMobile, setIsMobile] = useState(false)
  const [mounted, setMounted] = useState(false)
  const [categories, setCategories] = useState([])

  useEffect(() => {
    setMounted(true)
    
    // Fetch categories từ games.json
    fetch('/games.json')
      .then(res => res.json())
      .then(games => {
        // Lấy unique categories và đếm số games
        const categoryCount = {}
        games.forEach(game => {
          const cat = game.category || 'Other'
          categoryCount[cat] = (categoryCount[cat] || 0) + 1
        })
        
        // Sort theo số lượng games (nhiều nhất trước)
        const sortedCategories = Object.entries(categoryCount)
          .sort((a, b) => b[1] - a[1])
          .map(([name, count]) => ({
            name,
            slug: name.toLowerCase().replace(/\s+/g, '-'),
            icon: categoryIcons[name] || '🎮',
            count
          }))
        
        setCategories(sortedCategories)
      })
      .catch(err => console.error('Failed to load categories:', err))
    
    const checkMobile = () => {
      const mobile = window.innerWidth < 768
      setIsMobile(mobile)
      setIsOpen(!mobile)
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
          </div>
        </aside>
      </>
    )
  }

  return (
    <>
      <button 
        className="sidebar-toggle"
        onClick={() => setIsOpen(!isOpen)}
        aria-label="Toggle menu"
      >
        <span className="toggle-icon">{isOpen ? '✕' : '☰'}</span>
        <span className="toggle-text">{isOpen ? 'Close' : 'Menu'}</span>
      </button>

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

          {/* Categories - Dynamic từ games.json */}
          <div className="sidebar-section">
            <h4 className="section-label">Categories</h4>
            <nav className="nav-list">
              {categories.map((item) => (
                <Link
                  key={item.slug}
                  href={getHref(item.slug)}
                  className={`nav-item ${isActive(item.slug) ? 'active' : ''}`}
                  onClick={() => isMobile && setIsOpen(false)}
                >
                  <span className="nav-icon">{item.icon}</span>
                  <span className="nav-name">{item.name}</span>
                  <span className="category-count">{item.count}</span>
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

      {isMobile && isOpen && (
        <div 
          className="sidebar-overlay"
          onClick={() => setIsOpen(false)}
        />
      )}
    </>
  )
}
