import Link from 'next/link'
import { promises as fs } from 'fs'
import path from 'path'

async function getGames() {
  const filePath = path.join(process.cwd(), 'public', 'games.json')
  const fileContents = await fs.readFile(filePath, 'utf8')
  return JSON.parse(fileContents)
}

export const metadata = {
  title: 'Popular Games - QuickPlay',
  description: 'Play the most popular unblocked games',
}

export default async function PopularGamesPage() {
  const games = await getGames()
  const popularGames = games.slice(0, 12) // Show top 12 games

  return (
    <>
      <div className="section-header">
        <h2>🔥 Popular Games</h2>
        <p style={{ color: 'var(--text-light)', fontSize: '0.9rem' }}>
          Most played games by our community
        </p>
      </div>

      <div className="games-grid">
        {popularGames.map((game) => (
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
