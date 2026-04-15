'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useState, useEffect } from 'react'

const categoryIcons = {
  'Action': '⚔️',
  'Puzzle': '🧩',
  'Racing': '🏎️',
  'Sports': '⚽',
  'Adventure': '🗺️',
  'Arcade': '🕹️',
  'Strategy': '🎯',
  'Casual': '🎲',
  'Shooter': '🔫',
  'Fighting': '🥊',
  'Simulation': '🎮',
  'RPG': '🐉',
  'Card': '🃏',
  'Board': '♟️',
  'Clicker': '👆',
  'Idle': '⏰',
}

export default function CategoryMenu() {
  const pathname = usePathname()
  const [categories, setCategories] = useState([])

  useEffect(() => {
    fetch('/games.json')
      .then(res => res.json())
      .then(games => {
        const categoryCount = {}
        games.forEach(game => {
          const cat = game.category || 'Other'
          categoryCount[cat] = (categoryCount[cat] || 0) + 1
        })
        
        const sortedCategories = Object.entries(categoryCount)
          .sort((a, b) => b[1] - a[1])
          .slice(0, 15) // Top 15 categories
          .map(([name, count]) => ({
            name,
            slug: name.toLowerCase().replace(/\s+/g, '-'),
            icon: categoryIcons[name] || '🎮',
            count
          }))
        
        setCategories(sortedCategories)
      })
      .catch(err => console.error('Failed to load categories:', err))
  }, [])

  const isActive = (slug) => {
    return pathname === `/category/${slug}`
  }

  return (
    <div className="category-menu-wrapper">
      <div className="category-menu">
        <Link 
          href="/"
          className={`category-item ${pathname === '/' ? 'active' : ''}`}
        >
          <span className="category-icon">🏠</span>
          <span className="category-name">All Games</span>
        </Link>
        
        {categories.map((cat) => (
          <Link
            key={cat.slug}
            href={`/category/${cat.slug}`}
            className={`category-item ${isActive(cat.slug) ? 'active' : ''}`}
          >
            <span className="category-icon">{cat.icon}</span>
            <span className="category-name">{cat.name}</span>
          </Link>
        ))}
      </div>
    </div>
  )
}
