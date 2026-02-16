import Link from 'next/link'

export default function FeaturedGames({ games }) {
  // Lấy 6 games đầu tiên làm featured
  const featured = games.slice(0, 6)

  return (
    <div className="featured-section">
      <h2 className="section-title">🔥 Trending Games</h2>
      <div className="featured-grid">
        {featured.map((game) => (
          <Link 
            key={game.id} 
            href={`/game/${game.id}`}
            className="featured-card"
          >
            <img 
              src={game.thumbnail} 
              alt={game.title}
              className="featured-thumbnail"
            />
            <div className="featured-overlay">
              <h3 className="featured-title">{game.title}</h3>
              <span className="play-button">▶ Play Now</span>
            </div>
          </Link>
        ))}
      </div>
    </div>
  )
}
