'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { CheckIcon } from '@heroicons/react/24/outline'
import { useAuth } from '@/contexts/AuthContext'
import toast from 'react-hot-toast'

const games = [
  {
    id: 'cs2',
    name: 'Counter-Strike 2',
    image: '/images/games/cs2.jpg',
    description: 'Tactical FPS with competitive tournaments',
    category: 'FPS',
    popularity: 'High',
  },
  {
    id: 'valorant',
    name: 'Valorant',
    image: '/images/Valorant-LogoWithText.png',
    description: 'Character-based tactical shooter',
    category: 'FPS',
    popularity: 'High',
  },
  {
    id: 'rocket-league',
    name: 'Rocket League',
    image: '/images/games/rocket-league.jpg',
    description: 'Soccer with rocket-powered cars',
    category: 'Sports',
    popularity: 'Medium',
  },
  {
    id: 'lol',
    name: 'League of Legends',
    image: '/images/League-of-Legends-LogoWithText.png',
    description: 'Multiplayer online battle arena',
    category: 'MOBA',
    popularity: 'High',
  },
  {
    id: 'dota2',
    name: 'Dota 2',
    image: '/images/games/dota2.jpg',
    description: 'Complex strategy battle arena',
    category: 'MOBA',
    popularity: 'Medium',
  },
  {
    id: 'fortnite',
    name: 'Fortnite',
    image: '/images/games/fortnite.jpg',
    description: 'Battle royale with building mechanics',
    category: 'Battle Royale',
    popularity: 'High',
  },
  {
    id: 'apex',
    name: 'Apex Legends',
    image: '/images/games/apex.jpg',
    description: 'Hero-based battle royale',
    category: 'Battle Royale',
    popularity: 'Medium',
  },
  {
    id: 'overwatch2',
    name: 'Overwatch 2',
    image: '/images/games/overwatch2.jpg',
    description: 'Team-based hero shooter',
    category: 'FPS',
    popularity: 'Medium',
  },
]

export default function GameSelectionPage() {
  const [selectedGames, setSelectedGames] = useState<string[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()
  const { user } = useAuth()

  const handleGameToggle = (gameId: string) => {
    setSelectedGames(prev => 
      prev.includes(gameId) 
        ? prev.filter(id => id !== gameId)
        : [...prev, gameId]
    )
  }

  const handleContinue = async () => {
    if (selectedGames.length === 0) {
      toast.error('Please select at least one game you play!')
      return
    }

    setIsLoading(true)
    
    try {
      // Save game preferences (this could be saved to user profile)
      // For now, we'll store them in localStorage and continue
      localStorage.setItem('selectedGames', JSON.stringify(selectedGames))
      toast.success('Game preferences saved!')
      
      // Redirect to dashboard
      router.push('/dashboard')
    } catch (error) {
      toast.error('Failed to save preferences')
    } finally {
      setIsLoading(false)
    }
  }

  const handleSkip = () => {
    router.push('/dashboard')
  }

  return (
    <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-white font-gaming mb-4">
            What games do you play?
          </h1>
          <p className="text-lg text-slate-300 max-w-2xl mx-auto">
            Select the games you&apos;re interested in competing in. This will help us 
            show you the most relevant tournaments and matches.
          </p>
          <p className="text-sm text-accent-400 mt-2">
            💡 You can link your gaming accounts later in your profile settings to verify your rank and stats.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {games.map((game) => (
            <div
              key={game.id}
              className={`gaming-card rounded-xl p-6 cursor-pointer transition-all duration-200 ${
                selectedGames.includes(game.id)
                  ? 'ring-2 ring-gaming-500 bg-gaming-900/20'
                  : 'hover:bg-slate-800/70'
              }`}
              onClick={() => handleGameToggle(game.id)}
            >
              <div className="relative">
                <div className="aspect-video bg-slate-700 rounded-lg mb-4 flex items-center justify-center">
                  <span className="text-slate-400 text-sm">{game.name}</span>
                </div>
                {selectedGames.includes(game.id) && (
                  <div className="absolute -top-2 -right-2 w-8 h-8 bg-gaming-500 rounded-full flex items-center justify-center">
                    <CheckIcon className="w-5 h-5 text-white" />
                  </div>
                )}
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">{game.name}</h3>
              <p className="text-sm text-slate-400 mb-3">{game.description}</p>
              <div className="flex items-center justify-between">
                <span className="text-xs px-2 py-1 bg-slate-700 text-slate-300 rounded">
                  {game.category}
                </span>
                <span className={`text-xs px-2 py-1 rounded ${
                  game.popularity === 'High' 
                    ? 'bg-gaming-500/20 text-gaming-400'
                    : 'bg-accent-500/20 text-accent-400'
                }`}>
                  {game.popularity}
                </span>
              </div>
            </div>
          ))}
        </div>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button
            onClick={handleContinue}
            disabled={isLoading}
            className={`px-8 py-3 rounded-lg font-semibold transition-all duration-200 ${
              selectedGames.length > 0
                ? 'bg-gaming-600 hover:bg-gaming-700 text-white neon-glow'
                : 'bg-slate-700 text-slate-400 cursor-not-allowed'
            }`}
          >
            {isLoading ? 'Setting up...' : `Continue (${selectedGames.length} selected)`}
          </button>
          <button
            onClick={handleSkip}
            className="px-8 py-3 rounded-lg font-semibold text-slate-300 border border-slate-600 hover:bg-slate-800 transition-colors"
          >
            Skip for now
          </button>
        </div>
      </div>
    </div>
  )
}
