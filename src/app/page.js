import Link from 'next/link'
import { promises as fs } from 'fs'
import path from 'path'
import FeaturedGames from '@/components/FeaturedGames'

async function getGames() {
  const filePath = path.join(process.cwd(), 'public', 'games.json')
  const fileContents = await fs.readFile(filePath, 'utf8')
  return JSON.parse(fileContents)
}

export default async function HomePage() {
  const games = await getGames()
  const midPoint = Math.floor(games.length / 2)

  return (
    <>
      {/* Hero Section - Compact */}
      <div className="hero-compact">
        <h1>⚡ Fast Unblocked Games</h1>
        <p>No download • No signup • No popups</p>
        <div className="hero-badges">
          <span>⚡ 0.5s Load</span>
          <span>🚫 Zero Popups</span>
          <span>📱 Mobile</span>
          <span>🎯 Focus Mode</span>
        </div>
      </div>

      {/* Featured/Trending Section */}
      <FeaturedGames games={games} />

      <div className="section-header">
        <h2>🎮 All Games ({games.length})</h2>
      </div>

      <div className="games-grid">
        {games.slice(0, midPoint).map((game) => (
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

      {/* Mid-Content Ad - Natural placement */}
      <div className="ad-banner ad-minimal" style={{ margin: '2rem 0' }}>
        📢 Ad (728x90)
      </div>

      <div className="games-grid">
        {games.slice(midPoint).map((game) => (
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
  )
}
