import { NextRequest } from 'next/server'
import { ApiResponse, handleApiError, parsePaginationParams, createPaginatedResponse } from '@/lib/api-utils'
import { prisma } from '@/lib/prisma'

// GET /api/leaderboard - Get leaderboard rankings
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const pagination = parsePaginationParams(searchParams)
    
    // Filters
    const game = searchParams.get('game')
    const timeframe = searchParams.get('timeframe') || 'all-time' // all-time, monthly, weekly
    const type = searchParams.get('type') || 'individual' // individual, team

    if (type === 'team') {
      // Team leaderboard
      const where: any = {}
      
      if (game) {
        where.game = game
      }

      const [teams, total] = await Promise.all([
        prisma.team.findMany({
          where,
          include: {
            owner: {
              select: {
                id: true,
                username: true,
                avatar: true
              }
            },
            members: {
              include: {
                user: {
                  select: {
                    id: true,
                    username: true,
                    avatar: true
                  }
                }
              }
            },
            tournamentParticipations: {
              include: {
                tournament: {
                  select: {
                    name: true,
                    pointsReward: true
                  }
                }
              }
            }
          },
          orderBy: { createdAt: 'desc' },
          skip: ((pagination.page || 1) - 1) * (pagination.limit || 10),
          take: pagination.limit || 10,
        }),
        prisma.team.count({ where })
      ])

      const formattedTeams = teams.map((team: any, index: number) => ({
        rank: ((pagination.page || 1) - 1) * (pagination.limit || 10) + index + 1,
        id: team.id,
        name: team.name,
        avatar: team.avatar,
        totalPoints: 0, // TODO: Calculate team points
        tournamentsWon: 0, // TODO: Calculate tournaments won
        tournamentsPlayed: team.tournamentParticipations.length,
        winRate: 0, // TODO: Calculate win rate
        owner: team.owner,
        memberCount: team.members.length,
        recentActivity: team.updatedAt
      }))

      const response = createPaginatedResponse(formattedTeams, total, pagination)
      return ApiResponse.success(response, 'Team leaderboard retrieved successfully')

    } else {
      // Individual leaderboard
      const where: any = {}
      let dateFilter = undefined

      // Apply timeframe filter
      if (timeframe === 'monthly') {
        const oneMonthAgo = new Date()
        oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1)
        dateFilter = { gte: oneMonthAgo }
      } else if (timeframe === 'weekly') {
        const oneWeekAgo = new Date()
        oneWeekAgo.setDate(oneWeekAgo.getDate() - 7)
        dateFilter = { gte: oneWeekAgo }
      }

      // For time-based filters, we need to calculate points from tournament participations
      let orderBy: any = { totalPoints: 'desc' }
      
      if (dateFilter) {
        // This is a simplified approach - in a real app you might want to cache these calculations
        where.tournamentParticipations = {
          some: {
            tournament: {
              endDate: dateFilter
            }
          }
        }
      }

      const [users, total] = await Promise.all([
        prisma.user.findMany({
          where,
          include: {
            currentRank: true,
            achievements: {
              include: {
                achievement: true
              }
            },
            tournamentParticipations: {
              include: {
                tournament: {
                  select: {
                    name: true,
                    game: true,
                    endDate: true
                  }
                }
              },
              where: dateFilter ? {
                tournament: {
                  endDate: dateFilter
                }
              } : undefined,
              orderBy: {
                joinedAt: 'desc'
              },
              take: 5
            }
          },
          orderBy,
          skip: ((pagination.page || 1) - 1) * (pagination.limit || 10),
          take: pagination.limit || 10,
        }),
        prisma.user.count({ where })
      ])

      const formattedUsers = users.map((user: any, index: number) => {
        // Calculate points for the timeframe if needed
        let points = user.totalPoints
        if (dateFilter) {
          points = user.tournamentParticipations.reduce((sum: number, tp: any) => 
            sum + (tp.pointsEarned || 0), 0
          )
        }

        return {
          rank: ((pagination.page || 1) - 1) * (pagination.limit || 10) + index + 1,
          id: user.id,
          username: user.username,
          avatar: user.avatar,
          totalPoints: points,
          rankTier: user.currentRank?.tier || 'BRONZE',
          rankDivision: user.currentRank?.division || 1,
          tournamentsWon: user.tournamentsWon,
          tournamentsPlayed: user.gamesPlayed,
          winRate: user.gamesPlayed > 0 ? (user.gamesWon / user.gamesPlayed * 100) : 0,
          achievements: user.achievements.length,
          recentTournaments: user.tournamentParticipations.map((tp: any) => ({
            name: tp.tournament.name,
            game: tp.tournament.game,
            placement: tp.placement,
            pointsEarned: tp.pointsEarned
          })),
          lastActive: user.lastActive
        }
      })

      const response = createPaginatedResponse(formattedUsers, total, pagination)
      return ApiResponse.success(response, 'Individual leaderboard retrieved successfully')
    }

  } catch (error) {
    return handleApiError(error, 'get leaderboard')
  }
}
