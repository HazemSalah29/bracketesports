export interface User {
  id: string
  username: string
  email: string
  avatar?: string
  rank: UserRank
  totalPoints: number
  gamesPlayed: number
  tournamentsWon: number
  achievements: Achievement[]
  teamId?: string
  sponsorshipStatus?: 'sponsored' | 'available' | 'not_available'
  createdAt: Date
  updatedAt: Date
}

export interface UserRank {
  tier: 'bronze' | 'silver' | 'gold' | 'platinum' | 'diamond' | 'master' | 'grandmaster'
  division: 1 | 2 | 3 | 4 | 5
  points: number
  pointsToNextRank: number
  season: string
}

export interface Team {
  id: string
  name: string
  description: string
  logo?: string
  captainId: string
  members: TeamMember[]
  maxMembers: number
  isPrivate: boolean
  teamRank: TeamRank
  achievements: Achievement[]
  sponsorshipStatus?: 'sponsored' | 'available' | 'not_available'
  createdAt: Date
  updatedAt: Date
}

export interface TeamMember {
  userId: string
  user: User
  role: 'captain' | 'player' | 'substitute'
  joinedAt: Date
  isActive: boolean
}

export interface TeamRank {
  tier: 'bronze' | 'silver' | 'gold' | 'platinum' | 'diamond' | 'master' | 'grandmaster'
  division: 1 | 2 | 3 | 4 | 5
  points: number
  pointsToNextRank: number
  season: string
}

export interface Achievement {
  id: string
  name: string
  description: string
  icon: string
  type: 'tournament' | 'streak' | 'milestone' | 'seasonal' | 'special'
  rarity: 'common' | 'rare' | 'epic' | 'legendary'
  unlockedAt: Date
}

export interface Tournament {
  id: string
  name: string
  description: string
  game: string
  gameIcon: string
  pointsReward: number
  sponsoredBy?: string
  sponsorLogo?: string
  maxParticipants: number
  currentParticipants: number
  startDate: Date
  endDate: Date
  registrationDeadline: Date
  status: 'upcoming' | 'registering' | 'live' | 'completed' | 'cancelled'
  bracket?: TournamentBracket
  rules: string[]
  skillRequirement: SkillRequirement
  tournamentType: 'solo' | 'team' | 'mixed'
  teamSize?: number
  rewards: TournamentReward[]
  createdAt: Date
  updatedAt: Date
}

export interface SkillRequirement {
  minRank: UserRank
  maxRank?: UserRank
  description: string
}

export interface TournamentReward {
  position: number
  points: number
  badges: Achievement[]
  physicalRewards?: PhysicalReward[]
}

export interface PhysicalReward {
  id: string
  name: string
  description: string
  image: string
  type: 'trophy' | 'medal' | 'merchandise' | 'gift_card' | 'hardware'
  value?: number
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
  participant1: Participant
  participant2: Participant
  winner?: Participant
  participant1Score: number
  participant2Score: number
  status: 'pending' | 'live' | 'completed' | 'disputed'
  scheduledTime: Date
  completedTime?: Date
}

export interface Participant {
  id: string
  type: 'user' | 'team'
  user?: User
  team?: Team
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

export interface Leaderboard {
  id: string
  userId?: string
  teamId?: string
  user?: User
  team?: Team
  gamesPlayed: number
  gamesWon: number
  tournamentsWon: number
  totalPoints: number
  ranking: number
  winRate: number
  season: string
  type: 'user' | 'team'
  updatedAt: Date
}

export interface Sponsorship {
  id: string
  sponsorName: string
  sponsorLogo: string
  description: string
  type: 'tournament' | 'team' | 'player'
  value: number
  duration: string
  benefits: string[]
  isActive: boolean
  createdAt: Date
  expiresAt: Date
}

export interface PremiumFeature {
  id: string
  name: string
  description: string
  type: 'analytics' | 'coaching' | 'team_management' | 'custom_tournaments'
  pricePerMonth: number
  features: string[]
  isActive: boolean
}

export interface CoachingSession {
  id: string
  coachId: string
  studentId: string
  game: string
  duration: number
  pricePerHour: number
  status: 'scheduled' | 'in_progress' | 'completed' | 'cancelled'
  scheduledTime: Date
  completedTime?: Date
  feedback?: string
  rating?: number
}

export interface TipTransaction {
  id: string
  fromUserId: string
  toUserId: string
  amount: number
  message?: string
  createdAt: Date
}

export interface MerchItem {
  id: string
  name: string
  description: string
  price: number
  images: string[]
  category: 'apparel' | 'accessories' | 'gaming_gear' | 'collectibles'
  stock: number
  isActive: boolean
}

export interface Season {
  id: string
  name: string
  startDate: Date
  endDate: Date
  isActive: boolean
  rewards: SeasonReward[]
}

export interface SeasonReward {
  rankTier: string
  points: number
  achievements: Achievement[]
  physicalRewards?: PhysicalReward[]
}
