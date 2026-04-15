import './globals.css'
import Link from 'next/link'
import SearchBar from '@/components/SearchBar'
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
        
        <div className="main-container">
          {children}
        </div>
        
        <footer>
          <div className="footer-content">
            <div className="footer-section">
              <h3 className="footer-logo">⚡ QuickPlay</h3>
              <p className="footer-tagline">Lightning fast unblocked games</p>
            </div>

            <div className="footer-section">
              <h4 className="footer-title">Quick Links</h4>
              <div className="footer-links">
                <Link href="/">All Games</Link>
                <Link href="/new">New Games</Link>
                <Link href="/popular">Popular</Link>
                <Link href="/trending">Trending</Link>
              </div>
            </div>

            <div className="footer-section">
              <h4 className="footer-title">About</h4>
              <p className="footer-text">
                Play free unblocked games at school, work, or home. 
                No downloads, no registration required.
              </p>
            </div>
          </div>

          <div className="footer-bottom">
            <p>© 2026 QuickPlay - All rights reserved</p>
          </div>
        </footer>
      </body>
    </html>
  )
}
