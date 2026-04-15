'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Pagination from './Pagination'

const GAMES_PER_PAGE = 48

export default function GamesGrid({ allGames }) {
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [currentPage, setCurrentPage] = useState(1)
  const [categories, setCategories] = useState([])

  useEffect(() => {
    // Lấy unique categories
    const categoryCount = {}
    allGames.forEach(game => {
      const cat = game.category || 'Other'
      categoryCount[cat] = (categoryCount[cat] || 0) + 1
    })
    
    // Tạo category "2 Player" động từ games có multiplayer/2 player/sports
    const twoPlayerGames = allGames.filter(game => {
      const title = game.title?.toLowerCase() || ''
      const content = game.content?.toLowerCase() || ''
      const category = game.category?.toLowerCase() || ''
      const categories = game.categories || []
      
      // Check nếu là sports game hoặc có từ khóa 2 player/multiplayer
      const isSportsGame = category === 'sports'
      const hasMultiplayerKeyword = title.includes('2 player') || 
                                     title.includes('two player') || 
                                     title.includes('multiplayer') ||
                                     title.includes('vs') ||
                                     content.includes('2 player') ||
                                     content.includes('two player') ||
                                     content.includes('play with friend') ||
                                     content.includes('play together') ||
                                     categories.some(c => c.toLowerCase().includes('2 player') || c.toLowerCase().includes('multiplayer'))
      
      return isSportsGame || hasMultiplayerKeyword
    })
    
    if (twoPlayerGames.length > 0) {
      categoryCount['2 Player'] = twoPlayerGames.length
    }
    
    const sortedCategories = Object.entries(categoryCount)
      .sort((a, b) => b[1] - a[1])
      .map(([name, count]) => ({
        name,
        slug: name.toLowerCase().replace(/\s+/g, '-'),
        count
      }))
    
    setCategories(sortedCategories)
  }, [allGames])

  // Filter games theo category
  const filteredGames = selectedCategory === 'all' 
    ? allGames 
    : selectedCategory === '2-player'
    ? allGames.filter(game => {
        const title = game.title?.toLowerCase() || ''
        const content = game.content?.toLowerCase() || ''
        const category = game.category?.toLowerCase() || ''
        const categories = game.categories || []
        
        // Check nếu là sports game hoặc có từ khóa 2 player/multiplayer
        const isSportsGame = category === 'sports'
        const hasMultiplayerKeyword = title.includes('2 player') || 
                                       title.includes('two player') || 
                                       title.includes('multiplayer') ||
                                       title.includes('vs') ||
                                       content.includes('2 player') ||
                                       content.includes('two player') ||
                                       content.includes('play with friend') ||
                                       content.includes('play together') ||
                                       categories.some(c => c.toLowerCase().includes('2 player') || c.toLowerCase().includes('multiplayer'))
        
        return isSportsGame || hasMultiplayerKeyword
      })
    : allGames.filter(game => {
        const gameSlug = game.category?.toLowerCase().replace(/\s+/g, '-')
        return gameSlug === selectedCategory
      })

  // Pagination
  const totalPages = Math.ceil(filteredGames.length / GAMES_PER_PAGE)
  const startIndex = (currentPage - 1) * GAMES_PER_PAGE
  const endIndex = startIndex + GAMES_PER_PAGE
  const currentGames = filteredGames.slice(startIndex, endIndex)

  const handleCategoryChange = (slug) => {
    setSelectedCategory(slug)
    setCurrentPage(1) // Reset về trang 1 khi đổi category
  }

  const handlePageChange = (page) => {
    setCurrentPage(page)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

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
    '2 Player': '👥',
  }

  return (
    <>
      {/* Category Filter Menu */}
      <div className="category-filter-wrapper">
        <div className="category-filter">
          <button
            onClick={() => handleCategoryChange('all')}
            className={`category-filter-item ${selectedCategory === 'all' ? 'active' : ''}`}
          >
            <span className="category-icon">🏠</span>
            <span className="category-name">All Games</span>
            <span className="category-count">{allGames.length}</span>
          </button>
          
          {categories.slice(0, 15).map((cat) => (
            <button
              key={cat.slug}
              onClick={() => handleCategoryChange(cat.slug)}
              className={`category-filter-item ${selectedCategory === cat.slug ? 'active' : ''}`}
            >
              <span className="category-icon">{categoryIcons[cat.name] || '🎮'}</span>
              <span className="category-name">{cat.name}</span>
              <span className="category-count">{cat.count}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Games Count */}
      <div className="games-header">
        <h2>
          {selectedCategory === 'all' 
            ? `🎮 All Games (${filteredGames.length})` 
            : `${categoryIcons[categories.find(c => c.slug === selectedCategory)?.name] || '🎮'} ${categories.find(c => c.slug === selectedCategory)?.name} Games (${filteredGames.length})`
          }
        </h2>
        {totalPages > 1 && (
          <p className="games-subtitle">
            Showing {startIndex + 1}-{Math.min(endIndex, filteredGames.length)} of {filteredGames.length} games
          </p>
        )}
      </div>

      {/* Games Grid */}
      <div className="games-grid">
        {currentGames.map((game) => (
          <Link 
            key={game.id} 
            href={`/game/${game.id}`}
            className="game-card"
          >
            <img 
              src={game.thumbnail} 
              alt={game.title}
              className="game-thumbnail"
              loading="lazy"
            />
            <div className="game-info">
              <h3 className="game-title">{game.title}</h3>
              <span className="game-category">{game.category}</span>
            </div>
          </Link>
        ))}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="client-pagination">
          {currentPage > 1 && (
            <button 
              onClick={() => handlePageChange(currentPage - 1)}
              className="pagination-btn"
            >
              ← Previous
            </button>
          )}
          
          <div className="pagination-numbers">
            {Array.from({ length: Math.min(totalPages, 10) }, (_, i) => i + 1).map(page => (
              <button
                key={page}
                onClick={() => handlePageChange(page)}
                className={`pagination-number ${page === currentPage ? 'active' : ''}`}
              >
                {page}
              </button>
            ))}
            {totalPages > 10 && <span className="pagination-dots">...</span>}
          </div>
          
          {currentPage < totalPages && (
            <button 
              onClick={() => handlePageChange(currentPage + 1)}
              className="pagination-btn"
            >
              Next →
            </button>
          )}
        </div>
      )}
    </>
  )
}
