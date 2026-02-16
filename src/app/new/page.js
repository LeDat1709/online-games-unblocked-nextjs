import Link from 'next/link'
import { promises as fs } from 'fs'
import path from 'path'

async function getGames() {
  const filePath = path.join(process.cwd(), 'public', 'games.json')
  const fileContents = await fs.readFile(filePath, 'utf8')
  return JSON.parse(fileContents)
}

export const metadata = {
  title: 'New Games - QuickPlay',
  description: 'Play the newest unblocked games added to our collection',
}

export default async function NewGamesPage() {
  const games = await getGames()
  const newGames = games.slice(0, 12) // Show latest 12 games

  return (
    <>
      <div className="section-header">
        <h2>✨ New Games</h2>
        <p style={{ color: 'var(--text-light)', fontSize: '0.9rem' }}>
          Fresh games added to our collection
        </p>
      </div>

      <div className="games-grid">
        {newGames.map((game) => (
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
