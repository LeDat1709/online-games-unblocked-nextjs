import Link from 'next/link'
import { promises as fs } from 'fs'
import path from 'path'
import Pagination from '@/components/Pagination'

const GAMES_PER_PAGE = 48

async function getGames() {
  const filePath = path.join(process.cwd(), 'public', 'games.json')
  const fileContents = await fs.readFile(filePath, 'utf8')
  return JSON.parse(fileContents)
}

export async function generateStaticParams() {
  const games = await getGames()
  const totalPages = Math.ceil(games.length / GAMES_PER_PAGE)
  
  return Array.from({ length: totalPages - 1 }, (_, i) => ({
    page: String(i + 2) // Page 2, 3, 4, ...
  }))
}

export async function generateMetadata({ params }) {
  const pageNum = parseInt(params.page)
  return {
    title: `Free Online Games - Page ${pageNum} 🎮`,
    description: `Browse page ${pageNum} of our collection of free unblocked games.`,
  }
}

export default async function PaginatedPage({ params }) {
  const allGames = await getGames()
  const currentPage = parseInt(params.page)
  const totalPages = Math.ceil(allGames.length / GAMES_PER_PAGE)
  
  if (currentPage < 1 || currentPage > totalPages) {
    return (
      <div>
        <h1>Page not found</h1>
        <Link href="/" className="back-button">
          ← Back to Home
        </Link>
      </div>
    )
  }
  
  const startIndex = (currentPage - 1) * GAMES_PER_PAGE
  const endIndex = startIndex + GAMES_PER_PAGE
  const games = allGames.slice(startIndex, endIndex)

  return (
    <>
      <div className="section-header">
        <h2>🎮 All Games - Page {currentPage}</h2>
        <p className="page-subtitle">
          Showing {startIndex + 1}-{Math.min(endIndex, allGames.length)} of {allGames.length} games
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

      <Pagination currentPage={currentPage} totalPages={totalPages} basePath="/" />
    </>
  )
}
