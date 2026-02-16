import Link from 'next/link'
import { promises as fs } from 'fs'
import path from 'path'

async function getGames() {
  const filePath = path.join(process.cwd(), 'public', 'games.json')
  const fileContents = await fs.readFile(filePath, 'utf8')
  return JSON.parse(fileContents)
}

export const metadata = {
  title: 'Trending Games - QuickPlay',
  description: 'Play trending unblocked games right now',
}

export default async function TrendingGamesPage() {
  const games = await getGames()
  const trendingGames = games.slice(0, 12) // Show trending 12 games

  return (
    <>
      <div className="section-header">
        <h2>📈 Trending Games</h2>
        <p style={{ color: 'var(--text-light)', fontSize: '0.9rem' }}>
          Hot games trending right now
        </p>
      </div>

      <div className="games-grid">
        {trendingGames.map((game) => (
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
    </>
  )
}
