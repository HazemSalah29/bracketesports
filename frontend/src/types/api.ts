// API Request/Response Types
export interface CreateTournamentRequest {
  name: string
  description: string
  game: string
  gameIcon?: string
  pointsReward: number
  sponsoredBy?: string
  maxParticipants: number
  startDate: string
  endDate: string
  registrationDeadline: string
  rules: string[]
  tournamentType: 'solo' | 'team'
  teamSize?: number
  skillRequirement?: {
    minRank: RankInfo
    description: string
  }
  isPrivate?: boolean
}

export interface TournamentResponse {
  id: string
  name: string
  description: string
  game: string
  gameIcon?: string
  pointsReward: number
  sponsoredBy?: string
  maxParticipants: number
  currentParticipants: number
  startDate: Date
  endDate: Date
  registrationDeadline: Date
  status: 'registering' | 'live' | 'completed' | 'cancelled'
  rules: string[]
  tournamentType: 'solo' | 'team'
  teamSize?: number
  skillRequirement?: {
    minRank: RankInfo
    description: string
  }
  isPrivate: boolean
  rewards?: TournamentReward[]
  createdAt: Date
  updatedAt: Date
}

export interface RankInfo {
  tier: 'bronze' | 'silver' | 'gold' | 'platinum' | 'diamond' | 'master' | 'grandmaster'
  division: number
  points: number
  pointsToNextRank: number
  season: string
}

export interface TournamentReward {
  position: number
  points: number
  badges?: Badge[]
}

export interface Badge {
  id: string
  name: string
  description: string
  icon: string
  type: 'tournament' | 'milestone' | 'special'
  rarity: 'common' | 'rare' | 'epic' | 'legendary'
  unlockedAt: Date
}

export interface UserResponse {
  id: string
  username: string
  email: string
  avatar?: string
  firstName?: string
  lastName?: string
  bio?: string
  verified: boolean
  rank: RankInfo
  totalPoints: number
  tournamentsWon: number
  gamesPlayed: number
  achievements: Badge[]
  favoriteGames: string[]
  joinedAt: Date
  lastActive: Date
}

export interface TeamResponse {
  id: string
  name: string
  tag: string
  description?: string
  avatar?: string
  isPublic: boolean
  maxMembers: number
  memberCount: number
  ownerId: string
  owner: {
    id: string
    username: string
    avatar?: string
  }
  members: TeamMember[]
  createdAt: Date
  updatedAt: Date
}

export interface TeamMember {
  id: string
  user: {
    id: string
    username: string
    avatar?: string
    rank: RankInfo
  }
  role: 'member' | 'captain' | 'owner'
  joinedAt: Date
}

export interface CreateTeamRequest {
  name: string
  tag: string
  description?: string
  isPublic?: boolean
  maxMembers?: number
}

export interface NotificationResponse {
  id: string
  title: string
  message: string
  type: 'tournament' | 'team' | 'achievement' | 'system'
  data?: any
  read: boolean
  createdAt: Date
}

export interface LeaderboardEntry {
  rank: number
  user: {
    id: string
    username: string
    avatar?: string
  }
  points: number
  tier: string
  division: number
  tournamentsWon: number
  change: number // Change in rank from previous period
}

export interface AnalyticsResponse {
  totalUsers: number
  activeTournaments: number
  totalTournaments: number
  totalTeams: number
  userGrowth: {
    period: string
    count: number
  }[]
  tournamentParticipation: {
    game: string
    participants: number
  }[]
  rankDistribution: {
    rank: string
    count: number
  }[]
}

// Error Response
export interface ApiErrorResponse {
  success: false
  message: string
  errors?: any
}

// Success Response
export interface ApiSuccessResponse<T> {
  success: true
  message: string
  data: T
}

// Paginated Response
export interface PaginatedApiResponse<T> {
  success: true
  message: string
  data: {
    data: T[]
    pagination: {
      page: number
      limit: number
      total: number
      totalPages: number
      hasNext: boolean
      hasPrev: boolean
    }
  }
}

// Authentication
export interface LoginRequest {
  email: string
  password: string
}

export interface RegisterRequest {
  username: string
  email: string
  password: string
  confirmPassword: string
}

export interface AuthResponse {
  user: UserResponse
  token: string
  expiresAt: Date
}

export interface GamingAccountRequest {
  platform: 'steam' | 'riot' | 'epic' | 'psyonix'
  platformId: string
  username: string
}

export interface GamingAccountResponse {
  id: string
  platform: string
  platformId: string
  username: string
  verified: boolean
  autoVerified?: boolean
  createdAt: Date
  metadata?: any
}
