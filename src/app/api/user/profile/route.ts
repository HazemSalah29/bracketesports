import { NextRequest } from 'next/server'
import { z } from 'zod'
import { ApiResponse, authenticate, handleApiError, parseJsonBody } from '@/lib/api-utils'
import { prisma } from '@/lib/prisma'

const updateProfileSchema = z.object({
  firstName: z.string().optional(),
  lastName: z.string().optional(),
  bio: z.string().max(500).optional(),
  avatar: z.string().url().optional(),
  favoriteGames: z.array(z.string()).optional(),
})

// GET /api/user/profile - Get current user profile
export async function GET(request: NextRequest) {
  try {
    const user = await authenticate(request)
    
    if (!user) {
      return ApiResponse.unauthorized('Authentication required')
    }

    const userProfile = await prisma.user.findUnique({
      where: { id: user.id },
      include: {
        currentRank: true,
        gamingAccounts: true,
        teamMemberships: {
          include: {
            team: true
          }
        },
        achievements: {
          include: {
            achievement: true
          }
        },
        tournamentParticipations: {
          include: {
            tournament: true
          },
          take: 5,
          orderBy: {
            joinedAt: 'desc'
          }
        }
      }
    })

    if (!userProfile) {
      return ApiResponse.notFound('User not found')
    }

    // Format response
    const profileResponse = {
      id: userProfile.id,
      username: userProfile.username,
      email: userProfile.email,
      avatar: userProfile.avatar,
      firstName: userProfile.firstName,
      lastName: userProfile.lastName,
      bio: userProfile.bio,
      verified: userProfile.verified,
      rank: {
        tier: userProfile.currentRank?.tier || 'BRONZE',
        division: userProfile.currentRank?.division || 1,
        points: userProfile.rankPoints,
        pointsToNextRank: userProfile.currentRank ? userProfile.currentRank.maxPoints - userProfile.rankPoints : 1000,
        season: userProfile.currentRank?.season || 1
      },
      totalPoints: userProfile.totalPoints,
      tournamentsWon: userProfile.tournamentsWon,
      gamesPlayed: userProfile.gamesPlayed,
      winRate: userProfile.gamesPlayed > 0 ? 0 : 0, // TODO: Add gamesWon field to calculate win rate
      gamingAccounts: userProfile.gamingAccounts.map((account: any) => ({
        id: account.id,
        platform: account.platform,
        username: account.username,
        verified: account.verified
      })),
      teams: userProfile.teamMemberships.map((membership: any) => ({
        id: membership.team.id,
        name: membership.team.name,
        avatar: membership.team.avatar,
        role: membership.role
      })),
      achievements: userProfile.achievements.map((ua: any) => ({
        id: ua.achievement.id,
        name: ua.achievement.name,
        description: ua.achievement.description,
        icon: ua.achievement.icon,
        type: ua.achievement.type,
        rarity: ua.achievement.rarity,
        unlockedAt: ua.unlockedAt
      })),
      recentTournaments: userProfile.tournamentParticipations.map((tp: any) => ({
        id: tp.tournament.id,
        name: tp.tournament.name,
        game: tp.tournament.game,
        placement: tp.placement,
        pointsEarned: tp.pointsEarned
      })),
      joinedAt: userProfile.createdAt,
      lastActive: userProfile.lastActive
    }

    return ApiResponse.success(profileResponse, 'Profile retrieved successfully')

  } catch (error) {
    return handleApiError(error, 'get profile')
  }
}

// PUT /api/user/profile - Update user profile
export async function PUT(request: NextRequest) {
  try {
    const user = await authenticate(request)
    
    if (!user) {
      return ApiResponse.unauthorized('Authentication required')
    }

    const body = await parseJsonBody<z.infer<typeof updateProfileSchema>>(request)
    
    if (!body) {
      return ApiResponse.error('Invalid request body', 400)
    }

    const validation = updateProfileSchema.safeParse(body)
    if (!validation.success) {
      return ApiResponse.error('Validation failed', 400, validation.error.errors)
    }

    const updatedUser = await prisma.user.update({
      where: { id: user.id },
      data: validation.data,
      include: {
        currentRank: true,
        achievements: {
          include: {
            achievement: true
          }
        }
      }
    })

    // Format response (similar to GET)
    const profileResponse = {
      id: updatedUser.id,
      username: updatedUser.username,
      email: updatedUser.email,
      avatar: updatedUser.avatar,
      firstName: updatedUser.firstName,
      lastName: updatedUser.lastName,
      bio: updatedUser.bio,
      verified: updatedUser.verified,
      rank: {
        tier: updatedUser.currentRank?.tier || 'BRONZE',
        division: updatedUser.currentRank?.division || 1,
        points: updatedUser.rankPoints,
        season: updatedUser.currentRank?.season || 1
      },
      totalPoints: updatedUser.totalPoints,
      joinedAt: updatedUser.createdAt,
      lastActive: updatedUser.lastActive
    }

    return ApiResponse.success(profileResponse, 'Profile updated successfully')

  } catch (error) {
    return handleApiError(error, 'update profile')
  }
}
