'use client'

import { useState, useEffect, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'

function SearchContent() {
  const searchParams = useSearchParams()
  const [games, setGames] = useState([])
  const [allGames, setAllGames] = useState([])
  const [query, setQuery] = useState('')
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    // Load games from JSON
    fetch('/games.json')
      .then(res => res.json())
      .then(data => {
        setAllGames(data)
        const q = searchParams.get('q') || ''
        setQuery(q)
        if (q) {
          const filtered = data.filter((game) =>
            game.title.toLowerCase().includes(q.toLowerCase()) ||
            game.category.toLowerCase().includes(q.toLowerCase())
          )
          setGames(filtered)
        }
      })
  }, [searchParams])

  if (!mounted) {
    return (
      <div className="page-header">
        <h1 className="page-title">🔍 Search Games</h1>
        <p className="page-subtitle">Loading...</p>
      </div>
    )
  }

  return (
    <>
      <div className="page-header">
        <h1 className="page-title">🔍 Search Results</h1>
        <p className="page-subtitle">
          {query ? (
            <>
              Found {games.length} game{games.length !== 1 ? 's' : ''} for "{query}"
            </>
          ) : (
            'Enter a search term to find games'
          )}
        </p>
      </div>

      {games.length > 0 ? (
        <>
          <div className="games-grid">
            {games.map((game) => (
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

          {/* Bottom Ad */}
          <div className="ad-banner ad-minimal" style={{ marginTop: '2rem' }}>
            📢 Ad (728x90)
          </div>
        </>
      ) : query ? (
        <div className="empty-state" style={{ 
          textAlign: 'center', 
          padding: '3rem 1rem',
          color: 'var(--text-light)'
        }}>
          <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>🔍</div>
          <h3>No games found</h3>
          <p>Try a different search term!</p>
          <Link 
            href="/" 
            style={{
              display: 'inline-block',
              marginTop: '1rem',
              padding: '0.8rem 1.5rem',
              background: 'var(--primary)',
              color: 'white',
              borderRadius: '20px',
              textDecoration: 'none',
              fontWeight: '600'
            }}
          >
            Browse All Games
          </Link>
        </div>
      ) : (
        <div className="empty-state" style={{ 
          textAlign: 'center', 
          padding: '3rem 1rem',
          color: 'var(--text-light)'
        }}>
          <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>🎮</div>
          <h3>Start Searching</h3>
          <p>Use the search bar above to find your favorite games!</p>
        </div>
      )}
    </>
  )
}

export default function SearchPage() {
  return (
    <Suspense fallback={
      <div className="page-header">
        <h1 className="page-title">🔍 Search Games</h1>
        <p className="page-subtitle">Loading...</p>
      </div>
    }>
      <SearchContent />
    </Suspense>
  )
}
