import './globals.css'
import Link from 'next/link'
import SearchBar from '@/components/SearchBar'
import Sidebar from '@/components/Sidebar'
import DarkModeToggle from '@/components/DarkModeToggle'

export const metadata = {
  title: 'Unblocked Games - Play Free Games at School & Work 🎮',
  description: 'Play the best unblocked games online! Fast, lightweight, no ads popup. Perfect for school, work breaks. Action, Puzzle, 2 Player games and more!',
  keywords: 'unblocked games, games at school, free online games, no download games, quick games',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#667eea" />
        <link rel="apple-touch-icon" href="/icon-192.png" />
      </head>
      <body suppressHydrationWarning>
        <header className="header">
          <div className="header-content">
            <Link href="/" className="logo">
              ⚡ QuickPlay
            </Link>
            <SearchBar />
            <DarkModeToggle />
          </div>
        </header>
        
        {/* Top Banner Ad - Minimal, non-intrusive */}
        <div style={{ maxWidth: '1400px', margin: '0 auto', padding: '0 2rem' }}>
          <div className="ad-banner ad-minimal">
            📢 Ad (728x90)
          </div>
        </div>
        
        <div className="main-layout">
          <Sidebar />
          
          <div className="content-area">
            {children}
          </div>
        </div>
        
        <footer>
          <div className="footer-content">
            <div className="footer-section">
              <h3 className="footer-logo">⚡ QuickPlay</h3>
              <p className="footer-tagline">Lightning fast unblocked games</p>
              <div className="footer-badges">
                <span className="badge">🚫 No Popups</span>
                <span className="badge">⚡ 0.5s Load</span>
                <span className="badge">📱 Mobile Ready</span>
              </div>
            </div>

            <div className="footer-section">
              <h4 className="footer-title">Quick Links</h4>
              <div className="footer-links">
                <Link href="/">All Games</Link>
                <Link href="/favorites">My Favorites</Link>
                <Link href="/category/action">Action Games</Link>
                <Link href="/category/puzzle">Puzzle Games</Link>
              </div>
            </div>

            <div className="footer-section">
              <h4 className="footer-title">Categories</h4>
              <div className="footer-links">
                <Link href="/category/racing">Racing</Link>
                <Link href="/category/sports">Sports</Link>
                <Link href="/category/adventure">Adventure</Link>
                <Link href="/category/arcade">Arcade</Link>
              </div>
            </div>

            <div className="footer-section">
              <h4 className="footer-title">About</h4>
              <p className="footer-text">
                Play free unblocked games at school, work, or home. 
                No downloads, no registration required.
              </p>
              <div className="footer-social">
                <a href="#" className="social-link">📘 Facebook</a>
                <a href="#" className="social-link">🐦 Twitter</a>
                <a href="#" className="social-link">📺 YouTube</a>
              </div>
            </div>
          </div>

          <div className="footer-bottom">
            <p>© 2026 QuickPlay - All rights reserved</p>
            <div className="footer-bottom-links">
              <a href="#">Privacy Policy</a>
              <span>•</span>
              <a href="#">Terms of Service</a>
              <span>•</span>
              <a href="#">Contact</a>
            </div>
          </div>
        </footer>
      </body>
    </html>
  )
}
