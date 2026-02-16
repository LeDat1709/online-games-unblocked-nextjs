import Link from 'next/link'

export const metadata = {
  title: 'Recently Played Games - QuickPlay',
  description: 'Continue playing your recently played games',
}

export default function RecentPage() {
  return (
    <>
      <div className="section-header">
        <h2>🕐 Recently Played</h2>
        <p style={{ color: 'var(--text-light)', fontSize: '0.9rem' }}>
          Your recently played games will appear here
        </p>
      </div>

      <div className="empty-state" style={{ 
        textAlign: 'center', 
        padding: '3rem 1rem',
        color: 'var(--text-light)'
      }}>
        <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>🎮</div>
        <h3>No Recent Games</h3>
        <p>Start playing games to see them here!</p>
        <Link 
          href="/" 
          style={{
            display: 'inline-block',
            marginTop: '1rem',
            padding: '0.8rem 1.5rem',
            background: 'var(--primary)',
            color: 'white',
            borderRadius: '20px',
            textDecoration: 'none',
            fontWeight: '600'
          }}
        >
          Browse All Games
        </Link>
      </div>
    </>
  )
}
