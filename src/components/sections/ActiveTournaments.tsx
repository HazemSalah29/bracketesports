import Link from 'next/link'
import { GameIcon } from '@/components/ui/GameIcons'

const tournaments = [
  {
    id: 1,
    name: 'CS:GO Winter Championship',
    game: 'Counter-Strike: Global Offensive',
    gameId: 'cs2',
    pointsReward: 500,
    participants: 64,
    maxParticipants: 64,
    startDate: '2025-01-15T18:00:00Z',
    status: 'registering',
  },
  {
    id: 2,
    name: 'Valorant Weekly Showdown',
    game: 'Valorant',
    gameId: 'valorant',
    pointsReward: 250,
    participants: 28,
    maxParticipants: 32,
    startDate: '2025-01-12T20:00:00Z',
    status: 'registering',
  },
  {
    id: 3,
    name: 'Rocket League Boost Cup',
    game: 'Rocket League',
    gameId: 'rocket-league',
    pointsReward: 150,
    participants: 16,
    maxParticipants: 16,
    startDate: '2025-01-10T19:00:00Z',
    status: 'full',
  },
]

export default function ActiveTournaments() {
  return (
    <div className="py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto max-w-2xl lg:text-center">
          <h2 className="text-base font-semibold leading-7 text-gaming-500">Live Tournaments</h2>
          <p className="mt-2 text-3xl font-bold tracking-tight text-white sm:text-4xl font-gaming">
            Join Active Competitions
          </p>
          <p className="mt-6 text-lg leading-8 text-slate-300">
            Choose from our selection of active tournaments and start competing today.
          </p>
        </div>
        <div className="mx-auto mt-16 grid max-w-2xl grid-cols-1 gap-8 lg:mx-0 lg:max-w-none lg:grid-cols-3">
          {tournaments.map((tournament) => (
            <article
              key={tournament.id}
              className="gaming-card rounded-xl p-6 hover:bg-slate-800/70 transition-all duration-200"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <div className="h-3 w-3 rounded-full bg-gaming-500"></div>
                  <span className="text-sm font-medium text-gaming-500">
                    {tournament.status === 'registering' ? 'Open' : 'Full'}
                  </span>
                </div>
                <div className="text-right">
                  <div className="text-sm text-slate-400">Points Reward</div>
                  <div className="text-lg font-bold text-gaming-400">
                    {tournament.pointsReward} pts
                  </div>
                </div>
              </div>
              <div className="mt-4">
                <h3 className="text-lg font-semibold text-white">{tournament.name}</h3>
                <div className="flex items-center space-x-2 mt-1">
                  <GameIcon gameId={tournament.gameId} size={20} />
                  <p className="text-sm text-slate-400">{tournament.game}</p>
                </div>
              </div>
              <div className="mt-6 flex items-center justify-between">
                <div className="text-sm text-slate-300">
                  <div>Free Entry</div>
                  <div>Players: {tournament.participants}/{tournament.maxParticipants}</div>
                </div>
                <div className="text-right">
                  <div className="text-sm text-slate-400">Starts</div>
                  <div className="text-sm font-medium text-white">
                    {new Date(tournament.startDate).toLocaleDateString()}
                  </div>
                </div>
              </div>
              <div className="mt-6">
                <Link
                  href={`/tournaments/${tournament.id}`}
                  className={`block w-full rounded-md px-3 py-2 text-center text-sm font-semibold transition-colors ${
                    tournament.status === 'registering'
                      ? 'bg-gaming-600 text-white hover:bg-gaming-700'
                      : 'bg-slate-700 text-slate-400 cursor-not-allowed'
                  }`}
                >
                  {tournament.status === 'registering' ? 'Join Tournament' : 'Tournament Full'}
                </Link>
              </div>
            </article>
          ))}
        </div>
        <div className="mt-12 text-center">
          <Link
            href="/tournaments"
            className="inline-flex items-center px-6 py-3 border border-gaming-500 text-gaming-500 font-medium rounded-md hover:bg-gaming-500 hover:text-white transition-colors"
          >
            View All Tournaments
          </Link>
        </div>
      </div>
    </div>
  )
}
