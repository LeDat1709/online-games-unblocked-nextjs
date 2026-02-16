'use client'

import { useState, useEffect } from 'react'

export default function GameActions({ gameId, gameTitle }) {
  const [isFavorite, setIsFavorite] = useState(false)
  const [rating, setRating] = useState(0)
  const [userRating, setUserRating] = useState(0)
  const [totalRatings, setTotalRatings] = useState(0)

  useEffect(() => {
    // Load favorites
    const favorites = JSON.parse(localStorage.getItem('favorites') || '[]')
    setIsFavorite(favorites.includes(gameId))

    // Load ratings
    const ratings = JSON.parse(localStorage.getItem('ratings') || '{}')
    if (ratings[gameId]) {
      setRating(ratings[gameId].average)
      setTotalRatings(ratings[gameId].count)
      setUserRating(ratings[gameId].userRating || 0)
    }

    // Track recently played
    const recent = JSON.parse(localStorage.getItem('recentlyPlayed') || '[]')
    const updated = [
      { id: gameId, title: gameTitle, timestamp: Date.now() },
      ...recent.filter(g => g.id !== gameId)
    ].slice(0, 10)
    localStorage.setItem('recentlyPlayed', JSON.stringify(updated))
  }, [gameId, gameTitle])

  const toggleFavorite = () => {
    const favorites = JSON.parse(localStorage.getItem('favorites') || '[]')
    let updated
    if (isFavorite) {
      updated = favorites.filter(id => id !== gameId)
    } else {
      updated = [...favorites, gameId]
    }
    localStorage.setItem('favorites', JSON.stringify(updated))
    setIsFavorite(!isFavorite)
  }

  const handleRating = (stars) => {
    const ratings = JSON.parse(localStorage.getItem('ratings') || '{}')
    
    if (!ratings[gameId]) {
      ratings[gameId] = { total: 0, count: 0, average: 0 }
    }

    // Remove old rating if exists
    if (userRating > 0) {
      ratings[gameId].total -= userRating
      ratings[gameId].count -= 1
    }

    // Add new rating
    ratings[gameId].total += stars
    ratings[gameId].count += 1
    ratings[gameId].average = (ratings[gameId].total / ratings[gameId].count).toFixed(1)
    ratings[gameId].userRating = stars

    localStorage.setItem('ratings', JSON.stringify(ratings))
    setRating(ratings[gameId].average)
    setTotalRatings(ratings[gameId].count)
    setUserRating(stars)
  }

  const shareGame = () => {
    if (navigator.share) {
      navigator.share({
        title: gameTitle,
        text: `Check out ${gameTitle} - Play free online!`,
        url: window.location.href
      })
    } else {
      navigator.clipboard.writeText(window.location.href)
      alert('Link copied to clipboard!')
    }
  }

  return (
    <div className="game-actions">
      {/* Favorite Button */}
      <button 
        onClick={toggleFavorite}
        className={`action-btn ${isFavorite ? 'active' : ''}`}
        title={isFavorite ? 'Remove from Favorites' : 'Add to Favorites'}
      >
        {isFavorite ? '❤️' : '🤍'} {isFavorite ? 'Favorited' : 'Favorite'}
      </button>

      {/* Share Button */}
      <button 
        onClick={shareGame}
        className="action-btn"
        title="Share this game"
      >
        🔗 Share
      </button>

      {/* Rating */}
      <div className="rating-section">
        <div className="rating-display">
          ⭐ {rating > 0 ? rating : 'No ratings'} 
          {totalRatings > 0 && <span className="rating-count">({totalRatings})</span>}
        </div>
        <div className="rating-stars">
          {[1, 2, 3, 4, 5].map((star) => (
            <button
              key={star}
              onClick={() => handleRating(star)}
              className={`star-btn ${star <= userRating ? 'active' : ''}`}
              title={`Rate ${star} stars`}
            >
              {star <= userRating ? '⭐' : '☆'}
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}
