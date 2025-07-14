import { NextRequest } from 'next/server'
import { ApiResponse, authenticate, handleApiError } from '@/lib/api-utils'
import { prisma } from '@/lib/prisma'

// GET /api/analytics - Get platform analytics
export async function GET(request: NextRequest) {
  try {
    const user = await authenticate(request)
    
    if (!user) {
      return ApiResponse.unauthorized('Authentication required')
    }

    const { searchParams } = new URL(request.url)
    const timeframe = searchParams.get('timeframe') || '30d' // 7d, 30d, 90d, 1y

    // Calculate date range
    const now = new Date()
    const startDate = new Date()
    
    switch (timeframe) {
      case '7d':
        startDate.setDate(now.getDate() - 7)
        break
      case '30d':
        startDate.setDate(now.getDate() - 30)
        break
      case '90d':
        startDate.setDate(now.getDate() - 90)
        break
      case '1y':
        startDate.setFullYear(now.getFullYear() - 1)
        break
      default:
        startDate.setDate(now.getDate() - 30)
    }

    // Get overall platform stats
    const [
      totalUsers,
      totalTournaments,
      totalTeams,
      activeTournaments,
      recentUsers,
      recentTournaments,
      gameStats,
      userGrowth,
      tournamentGrowth
    ] = await Promise.all([
      // Total users
      prisma.user.count(),
      
      // Total tournaments
      prisma.tournament.count(),
      
      // Total teams
      prisma.team.count(),
      
      // Active tournaments
      prisma.tournament.count({
        where: {
          startDate: { lte: now },
          OR: [
            { endDate: null },
            { endDate: { gt: now } }
          ]
        }
      }),
      
      // Recent users (within timeframe)
      prisma.user.count({
        where: {
          createdAt: { gte: startDate }
        }
      }),
      
      // Recent tournaments
      prisma.tournament.count({
        where: {
          createdAt: { gte: startDate }
        }
      }),
      
      // Game statistics
      prisma.tournament.groupBy({
        by: ['game'],
        _count: {
          id: true
        },
        orderBy: {
          _count: {
            id: 'desc'
          }
        },
        take: 10
      }),
      
      // User growth over time (daily for last 30 days)
      prisma.$queryRaw`
        SELECT 
          DATE(created_at) as date,
          COUNT(*) as count
        FROM "User"
        WHERE created_at >= ${startDate}
        GROUP BY DATE(created_at)
        ORDER BY date ASC
      `,
      
      // Tournament growth over time
      prisma.$queryRaw`
        SELECT 
          DATE(created_at) as date,
          COUNT(*) as count
        FROM "Tournament"
        WHERE created_at >= ${startDate}
        GROUP BY DATE(created_at)
        ORDER BY date ASC
      `
    ])

    // Get user-specific analytics if needed
    const userAnalytics = await getUserAnalytics(user.id, startDate)

    // Format response
    const analytics = {
      overview: {
        totalUsers,
        totalTournaments,
        totalTeams,
        activeTournaments,
        growth: {
          users: recentUsers,
          tournaments: recentTournaments,
          timeframe
        }
      },
      gameStats: gameStats.map((stat: any) => ({
        game: stat.game,
        tournaments: stat._count.id
      })),
      trends: {
        userGrowth: userGrowth,
        tournamentGrowth: tournamentGrowth
      },
      userAnalytics
    }

    return ApiResponse.success(analytics, 'Analytics retrieved successfully')

  } catch (error) {
    return handleApiError(error, 'get analytics')
  }
}

async function getUserAnalytics(userId: string, startDate: Date) {
  const [
    userTournaments,
    userTeams,
    userAchievements,
    recentMatches,
    pointsHistory
  ] = await Promise.all([
    // User's tournaments
    prisma.tournamentParticipant.findMany({
      where: {
        userId,
        joinedAt: { gte: startDate }
      },
      include: {
        tournament: {
          select: {
            name: true,
            game: true,
            pointsReward: true
          }
        }
      }
    }),
    
    // User's teams
    prisma.teamMember.count({
      where: {
        userId
      }
    }),
    
    // User's achievements
    prisma.userAchievement.count({
      where: {
        userId,
        unlockedAt: { gte: startDate }
      }
    }),
    
    // Recent matches/games
    prisma.playerMatchStats.findMany({
      where: {
        userId,
        match: {
          createdAt: { gte: startDate }
        }
      },
      take: 10,
      orderBy: { 
        match: {
          createdAt: 'desc'
        }
      },
      include: {
        match: {
          select: {
            id: true,
            gameMode: true,
            status: true,
            createdAt: true
          }
        }
      }
    }),
    
    // Points history (simplified)
    prisma.tournamentParticipant.findMany({
      where: {
        userId,
        tournament: {
          endDate: { gte: startDate }
        }
      },
      select: {
        pointsEarned: true,
        tournament: {
          select: {
            endDate: true,
            name: true
          }
        }
      },
      orderBy: {
        tournament: {
          endDate: 'asc'
        }
      }
    })
  ])

  return {
    tournaments: {
      participated: userTournaments.length,
      totalPoints: userTournaments.reduce((sum: number, t: any) => sum + (t.pointsEarned || 0), 0)
    },
    teams: userTeams,
    achievements: userAchievements,
    recentActivity: {
      matches: recentMatches.length,
      tournaments: userTournaments.length
    },
    pointsHistory: pointsHistory.map((p: any) => ({
      date: p.tournament.endDate,
      points: p.pointsEarned,
      tournament: p.tournament.name
    }))
  }
}
