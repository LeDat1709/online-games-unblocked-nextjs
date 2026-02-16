import { promises as fs } from 'fs'
import path from 'path'
import Link from 'next/link'
import FocusMode from '@/components/FocusMode'
import GameActions from '@/components/GameActions'

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
  
  return {
    title: `${game.title} - Play Unblocked at School 🎮`,
    description: `Play ${game.title} unblocked. ${game.content.substring(0, 140)}`,
  }
}

export default async function GamePage({ params }) {
  const games = await getGames()
  const game = games.find((g) => g.id === params.id)

  if (!game) {
    return <div>Game not found</div>
  }

  return (
    <div className="game-page">
      <Link href="/" className="back-button">
        ← Back to Games
      </Link>
      
      <h1 style={{ color: '#2d3436', fontSize: '2.5rem', marginBottom: '0.5rem' }}>
        {game.title}
      </h1>

      {/* Game Actions: Favorite, Share, Rating */}
      <GameActions gameId={game.id} gameTitle={game.title} />
      
      <div className="game-container">
        <div className="game-main">
          {/* Game Iframe with Focus Mode */}
          <FocusMode gameTitle={game.title}>
            <div className="game-iframe-wrapper">
              <iframe
                src={game.embedUrl}
                allowFullScreen
                title={game.title}
              />
            </div>
          </FocusMode>

          {/* Game Description */}
          <div className="game-description">
            <h2>📖 About {game.title}</h2>
            <p>{game.content}</p>
            <p style={{ marginTop: '1rem' }}>
              <strong>Category:</strong> <span className="game-category">{game.category}</span>
            </p>
            <div style={{ marginTop: '1rem', padding: '1rem', background: 'rgba(102, 126, 234, 0.1)', borderRadius: '10px' }}>
              <p style={{ fontSize: '0.9rem', color: '#667eea', margin: 0 }}>
                💡 <strong>Pro Tips:</strong> Click "🎯 Focus Mode" for fullscreen gaming experience. 
                Press ESC to exit. Add to favorites to play later!
              </p>
            </div>
          </div>

          {/* Comments Section - Disqus */}
          <div className="comments-section">
            <h2>💬 Comments & High Scores</h2>
            <div className="ad-placeholder" style={{ padding: '2rem', textAlign: 'center', background: '#f8f9fa', borderRadius: '12px', marginTop: '1rem' }}>
              <p style={{ fontSize: '1.1rem', marginBottom: '0.5rem' }}>💬 Share your experience!</p>
              <p style={{ fontSize: '0.9rem', color: '#666' }}>
                Comments section coming soon. Share your high scores, tips, and tricks with other players!
              </p>
              <p style={{ fontSize: '0.85rem', color: '#999', marginTop: '1rem' }}>
                For now, use the Share button above to tell your friends about this game!
              </p>
            </div>
          </div>
        </div>

        {/* Sidebar Ad - Minimal */}
        <aside>
          <div className="ad-sidebar ad-minimal">
            📢 Ad<br/>
            (300x600)
          </div>
        </aside>
      </div>

      {/* Bottom Ad */}
      <div className="ad-banner ad-minimal" style={{ marginTop: '2rem' }}>
        📢 Ad (728x90)
      </div>
    </div>
  )
}
