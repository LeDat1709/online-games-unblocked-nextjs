import { promises as fs } from 'fs'
import path from 'path'
import Link from 'next/link'

async function getGames() {
  const filePath = path.join(process.cwd(), 'public', 'games.json')
  const fileContents = await fs.readFile(filePath, 'utf8')
  return JSON.parse(fileContents)
}

export async function generateStaticParams() {
  const games = await getGames()
  return games.map((game) => ({
    id: game.id,
  }))
}

export async function generateMetadata({ params }) {
  const games = await getGames()
  const game = games.find((g) => g.id === params.id)
  
  if (!game) {
    return {
      title: 'Game Not Found',
    }
  }
  
  return {
    title: `${game.title} - Play Free Online 🎮`,
    description: `Play ${game.title} online for free. ${game.content.substring(0, 140)}`,
  }
}

export default async function GamePage({ params }) {
  const games = await getGames()
  const game = games.find((g) => g.id === params.id)

  if (!game) {
    return (
      <div className="game-page">
        <h1>Game not found</h1>
        <Link href="/" className="back-button">
          ← Back to Games
        </Link>
      </div>
    )
  }

  // Lấy related games cùng category
  const relatedGames = games
    .filter(g => g.category === game.category && g.id !== game.id)
    .slice(0, 6)

  return (
    <div className="game-detail-page">
      <div className="game-detail-header">
        <Link href="/" className="back-button">
          ← Back
        </Link>
        <div className="game-meta">
          <h1>{game.title}</h1>
          <span className="game-category">{game.category}</span>
        </div>
      </div>

      {/* Game Player - Full Width */}
      <div className="game-player">
        <iframe
          src={game.embedUrl}
          allowFullScreen
          allow="autoplay; fullscreen; payment"
          sandbox="allow-scripts allow-same-origin allow-popups allow-forms"
          title={game.title}
          loading="lazy"
        />
      </div>

      {/* Game Info */}
      <div className="game-info-section">
        <div className="game-description-card">
          <h2>About {game.title}</h2>
          <p>{game.content}</p>
        </div>

        {/* Related Games */}
        {relatedGames.length > 0 && (
          <div className="related-games-section">
            <h2>More {game.category} Games</h2>
            <div className="related-games-grid">
              {relatedGames.map((relatedGame) => (
                <Link
                  key={relatedGame.id}
                  href={`/game/${relatedGame.id}`}
                  className="related-game-card"
                >
                  <img
                    src={relatedGame.thumbnail}
                    alt={relatedGame.title}
                    loading="lazy"
                  />
                  <div className="related-game-info">
                    <h3>{relatedGame.title}</h3>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
