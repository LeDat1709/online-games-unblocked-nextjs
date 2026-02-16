import Link from 'next/link'
import { promises as fs } from 'fs'
import path from 'path'

async function getGames() {
  const filePath = path.join(process.cwd(), 'public', 'games.json')
  const fileContents = await fs.readFile(filePath, 'utf8')
  return JSON.parse(fileContents)
}

const categoryInfo = {
  action: { name: 'Action', icon: '⚔️', description: 'Fast-paced action games' },
  puzzle: { name: 'Puzzle', icon: '🧩', description: 'Brain-teasing puzzle games' },
  racing: { name: 'Racing', icon: '🏎️', description: 'High-speed racing games' },
  sports: { name: 'Sports', icon: '⚽', description: 'Sports and athletics games' },
  adventure: { name: 'Adventure', icon: '🗺️', description: 'Exciting adventure games' },
  arcade: { name: 'Arcade', icon: '🕹️', description: 'Classic arcade games' },
  strategy: { name: 'Strategy', icon: '🎯', description: 'Strategic thinking games' },
  casual: { name: 'Casual', icon: '🎲', description: 'Casual and relaxing games' },
  multiplayer: { name: 'Multiplayer', icon: '👥', description: 'Multiplayer games' },
  '2player': { name: '2 Player', icon: '🎮', description: '2 player games' },
}

export async function generateStaticParams() {
  return Object.keys(categoryInfo).map((slug) => ({ slug }))
}

export async function generateMetadata({ params }) {
  const cat = categoryInfo[params.slug]
  if (!cat) {
    return {
      title: 'Category Not Found',
      description: 'This category does not exist.',
    }
  }
  return {
    title: `${cat.name} Games - Play Free ${cat.name} Games Online 🎮`,
    description: `Play the best free ${cat.name.toLowerCase()} games online. ${cat.description}. No download required!`,
  }
}

export default async function CategoryPage({ params }) {
  const allGames = await getGames()
  const cat = categoryInfo[params.slug]
  
  if (!cat) {
    return (
      <div className="page-header">
        <h1 className="page-title">Category Not Found</h1>
        <p className="page-subtitle">This category does not exist.</p>
      </div>
    )
  }
  
  const games = allGames.filter(
    (game) => game.category.toLowerCase() === params.slug.toLowerCase()
  )

  return (
    <>
      <div className="page-header">
        <h1 className="page-title">
          {cat.icon} {cat.name} Games
        </h1>
        <p className="page-subtitle">
          {games.length} {cat.description} to play for free
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
      ) : (
        <div className="page-header">
          <p>No games found in this category yet. Check back soon!</p>
        </div>
      )}
    </>
  )
}
