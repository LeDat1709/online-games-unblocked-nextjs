import Link from 'next/link'
import { promises as fs } from 'fs'
import path from 'path'

async function getGames() {
  const filePath = path.join(process.cwd(), 'public', 'games.json')
  const fileContents = await fs.readFile(filePath, 'utf8')
  return JSON.parse(fileContents)
}

// Icon mapping
const categoryIcons = {
  'Action': '⚔️',
  'Puzzle': '🧩',
  'Racing': '🏎️',
  'Sports': '⚽',
  'Adventure': '🗺️',
  'Arcade': '🕹️',
  'Strategy': '🎯',
  'Casual': '🎲',
  'Multiplayer': '👥',
  'Shooter': '🔫',
  'Fighting': '🥊',
  'Platform': '🪜',
  'Simulation': '🎮',
  'RPG': '🐉',
  'Card': '🃏',
  'Board': '♟️',
  'Music': '🎵',
  'Educational': '📚',
  'Clicker': '👆',
  'Idle': '⏰',
  'Tower Defense': '🗼',
  'Match 3': '💎',
  'Cooking': '👨‍🍳',
  'Dress Up': '👗',
  'Baby': '👶',
  'Girls': '👧',
  'Boys': '👦',
  'Kids': '🧒',
  'Junior': '🎈',
  'Classic': '🎰',
  'Retro': '👾',
  'Skill': '🎪',
  'Trivia': '❓',
  'Word': '📝',
  'Math': '🔢',
  'Memory': '🧠',
}

export async function generateStaticParams() {
  const games = await getGames()
  const categories = new Set()
  
  games.forEach(game => {
    if (game.category) {
      const slug = game.category.toLowerCase().replace(/\s+/g, '-')
      categories.add(slug)
    }
  })
  
  return Array.from(categories).map((slug) => ({ slug }))
}

export async function generateMetadata({ params }) {
  const allGames = await getGames()
  const slug = params.slug
  
  // Tìm category name từ games
  const game = allGames.find(g => 
    g.category && g.category.toLowerCase().replace(/\s+/g, '-') === slug
  )
  
  if (!game) {
    return {
      title: 'Category Not Found',
      description: 'This category does not exist.',
    }
  }
  
  const categoryName = game.category
  
  return {
    title: `${categoryName} Games - Play Free ${categoryName} Games Online 🎮`,
    description: `Play the best free ${categoryName.toLowerCase()} games online. No download required!`,
  }
}

export default async function CategoryPage({ params }) {
  const allGames = await getGames()
  const slug = params.slug
  
  // Filter games theo category slug
  const games = allGames.filter(game => {
    if (!game.category) return false
    const gameSlug = game.category.toLowerCase().replace(/\s+/g, '-')
    return gameSlug === slug
  })
  
  if (games.length === 0) {
    return (
      <div className="page-header">
        <h1 className="page-title">Category Not Found</h1>
        <p className="page-subtitle">This category does not exist or has no games yet.</p>
        <Link href="/" className="back-button" style={{ marginTop: '1rem', display: 'inline-flex' }}>
          ← Back to Home
        </Link>
      </div>
    )
  }
  
  const categoryName = games[0].category
  const icon = categoryIcons[categoryName] || '🎮'

  return (
    <>
      <div className="page-header">
        <h1 className="page-title">
          {icon} {categoryName} Games
        </h1>
        <p className="page-subtitle">
          {games.length} amazing {categoryName.toLowerCase()} games to play for free
        </p>
      </div>

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
  )
}
