import Link from 'next/link'
import { promises as fs } from 'fs'
import path from 'path'

async function getGames() {
  const filePath = path.join(process.cwd(), 'public', 'games.json')
  const fileContents = await fs.readFile(filePath, 'utf8')
  return JSON.parse(fileContents)
}

export const metadata = {
  title: 'Search Games - Free Online Games 🎮',
  description: 'Search and find your favorite free online games',
}

export default async function SearchPage({ searchParams }) {
  const allGames = await getGames()
  const query = searchParams.q || ''
  
  const games = query
    ? allGames.filter((game) =>
        game.title.toLowerCase().includes(query.toLowerCase()) ||
        game.category.toLowerCase().includes(query.toLowerCase())
      )
    : []

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
                />
                <div className="game-info">
                  <h3 className="game-title">{game.title}</h3>
                  <span className="game-category">{game.category}</span>
                </div>
              </Link>
            ))}
          </div>

          {/* Bottom Ad */}
          <div className="ad-banner" style={{ marginTop: '2rem' }}>
            📢 Advertisement Space (728x90) - Google AdSense
          </div>
        </>
      ) : query ? (
        <div className="page-header">
          <p>No games found. Try a different search term!</p>
        </div>
      ) : null}
    </>
  )
}
