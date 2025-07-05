export interface User {
  id: string
  username: string
  email: string
  avatar?: string
  createdAt: Date
  updatedAt: Date
}

export interface Tournament {
  id: string
  name: string
  description: string
  game: string
  entryFee: number
  prizePool: number
  maxParticipants: number
  currentParticipants: number
  startDate: Date
  endDate: Date
  status: 'upcoming' | 'registering' | 'live' | 'completed' | 'cancelled'
  bracket?: TournamentBracket
  rules: string[]
  createdAt: Date
  updatedAt: Date
}

export interface TournamentBracket {
  id: string
  tournamentId: string
  rounds: Round[]
  currentRound: number
  createdAt: Date
  updatedAt: Date
}

export interface Round {
  id: string
  roundNumber: number
  matches: Match[]
  isCompleted: boolean
}

export interface Match {
  id: string
  roundId: string
  player1: User
  player2: User
  winner?: User
  player1Score: number
  player2Score: number
  status: 'pending' | 'live' | 'completed' | 'disputed'
  scheduledTime: Date
  completedTime?: Date
}

export interface GameAccount {
  id: string
  userId: string
  platform: 'steam' | 'epic' | 'origin' | 'battle.net' | 'xbox' | 'playstation'
  accountId: string
  username: string
  isVerified: boolean
  verifiedAt?: Date
  createdAt: Date
}

export interface Payment {
  id: string
  userId: string
  tournamentId: string
  amount: number
  type: 'entry_fee' | 'prize_payout' | 'refund'
  status: 'pending' | 'completed' | 'failed' | 'refunded'
  paymentMethod: string
  transactionId?: string
  createdAt: Date
  completedAt?: Date
}

export interface Leaderboard {
  id: string
  userId: string
  user: User
  gamesPlayed: number
  gamesWon: number
  tournamentsWon: number
  totalEarnings: number
  ranking: number
  winRate: number
  updatedAt: Date
}
