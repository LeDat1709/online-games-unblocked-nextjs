'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'

export default function FavoritesPage() {
  const [favorites, setFavorites] = useState([])
  const [games, setGames] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Load favorites from localStorage
    const favIds = JSON.parse(localStorage.getItem('favorites') || '[]')
    
    // Load games data
    fetch('/games.json')
      .then(res => res.json())
      .then(data => {
        const favGames = data.filter(game => favIds.includes(game.id))
        setGames(data)
        setFavorites(favGames)
        setLoading(false)
      })
  }, [])

  if (loading) {
    return (
      <div className="page-header">
        <h1 className="page-title">❤️ My Favorites</h1>
        <p className="page-subtitle">Loading...</p>
      </div>
    )
  }

  return (
    <>
      <div className="page-header">
        <h1 className="page-title">❤️ My Favorites</h1>
        <p className="page-subtitle">
          {favorites.length > 0 
            ? `You have ${favorites.length} favorite game${favorites.length !== 1 ? 's' : ''}`
            : 'No favorites yet. Start adding games you love!'}
        </p>
      </div>

      {favorites.length > 0 ? (
        <div className="games-grid">
          {favorites.map((game) => (
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
      ) : (
        <div className="page-header" style={{ marginTop: '2rem' }}>
          <p style={{ fontSize: '1.1rem', color: '#636e72' }}>
            💡 Click the ❤️ button on any game to add it to your favorites!
          </p>
        </div>
      )}
    </>
  )
}
