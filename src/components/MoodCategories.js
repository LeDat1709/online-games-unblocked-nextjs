import Link from 'next/link'

const moods = [
  { 
    name: 'Quick Break', 
    icon: '⚡', 
    slug: 'quick-break',
    description: '5-minute games for your break',
    color: '#ff6b6b'
  },
  { 
    name: 'Stress Relief', 
    icon: '😌', 
    slug: 'stress-relief',
    description: 'Relax and unwind',
    color: '#48dbfb'
  },
  { 
    name: 'Late Night Chill', 
    icon: '🌙', 
    slug: 'late-night',
    description: 'Calm games for night owls',
    color: '#764ba2'
  },
  { 
    name: 'Brain Teaser', 
    icon: '🧠', 
    slug: 'brain-teaser',
    description: 'Challenge your mind',
    color: '#feca57'
  },
  { 
    name: 'Adrenaline Rush', 
    icon: '🔥', 
    slug: 'adrenaline',
    description: 'Fast-paced action',
    color: '#ee5a6f'
  },
  { 
    name: 'With Friends', 
    icon: '👥', 
    slug: 'multiplayer',
    description: '2 player games',
    color: '#0abde3'
  },
]

export default function MoodCategories() {
  return (
    <div className="mood-section">
      <h2 className="section-title">🎭 Play by Mood</h2>
      <div className="mood-grid">
        {moods.map((mood) => (
          <Link 
            key={mood.slug} 
            href={`/mood/${mood.slug}`}
            className="mood-card"
            style={{ '--mood-color': mood.color }}
          >
            <div className="mood-icon">{mood.icon}</div>
            <h3 className="mood-name">{mood.name}</h3>
            <p className="mood-description">{mood.description}</p>
          </Link>
        ))}
      </div>
    </div>
  )
}
