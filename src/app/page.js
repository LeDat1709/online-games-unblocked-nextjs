import { promises as fs } from 'fs'
import path from 'path'
import FeaturedGames from '@/components/FeaturedGames'
import GamesGrid from '@/components/GamesGrid'

async function getGames() {
  const filePath = path.join(process.cwd(), 'public', 'games.json')
  const fileContents = await fs.readFile(filePath, 'utf8')
  return JSON.parse(fileContents)
}

export default async function HomePage() {
  const allGames = await getGames()

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
          <span>🎮 {allGames.length}+ Games</span>
        </div>
      </div>

      {/* Featured/Trending Section */}
      <FeaturedGames games={allGames.slice(0, 12)} />

      {/* Games Grid with Category Filter */}
      <GamesGrid allGames={allGames} />
    </>
  )
}
