'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function SearchBar() {
  const [search, setSearch] = useState('')
  const router = useRouter()

  const handleSearch = (e) => {
    e.preventDefault()
    if (search.trim()) {
      router.push(`/search?q=${encodeURIComponent(search.trim())}`)
    }
  }

  return (
    <form onSubmit={handleSearch} className="search-bar">
      <input
        type="text"
        placeholder="🔍 Search games..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="search-input"
      />
      <button type="submit" className="search-button">
        Search
      </button>
    </form>
  )
}
