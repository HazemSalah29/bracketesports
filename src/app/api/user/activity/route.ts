import { NextRequest } from 'next/server'
import { ApiResponse, authenticate, handleApiError } from '@/lib/api-utils'
import { prisma } from '@/lib/prisma'

// GET /api/user/activity - Get user's recent activity
export async function GET(request: NextRequest) {
  try {
    const user = await authenticate(request)
    
    if (!user) {
      return ApiResponse.unauthorized('Authentication required')
    }

    const { searchParams } = new URL(request.url)
    const limit = parseInt(searchParams.get('limit') || '10')

    // Get recent activities from various sources
    const [
      recentTournaments,
      recentAchievements,
      recentMatches,
      recentTeamJoins
    ] = await Promise.all([
      // Recent tournament participations
      prisma.tournamentParticipant.findMany({
        where: { userId: user.id },
        include: {
          tournament: true
        },
        orderBy: { joinedAt: 'desc' },
        take: limit
      }),

      // Recent achievements
      prisma.userAchievement.findMany({
        where: { userId: user.id },
        include: {
          achievement: true
        },
        orderBy: { unlockedAt: 'desc' },
        take: limit
      }),

      // Recent matches
      prisma.playerMatchStats.findMany({
        where: { userId: user.id },
        include: {
          match: {
            include: {
              tournament: true,
              winnerTeam: true
            }
          }
        },
        orderBy: { match: { gameEndTime: 'desc' } },
        take: limit
      }),

      // Recent team joins
      prisma.teamMember.findMany({
        where: { userId: user.id },
        include: {
          team: true
        },
        orderBy: { joinedAt: 'desc' },
        take: limit
      })
    ])

    // Combine and format activities
    const activities: any[] = []

    // Add tournament activities
    recentTournaments.forEach((tp: any) => {
      const points = tp.pointsEarned || 0
      let type = 'tournament_participate'
      let title = `Joined ${tp.tournament.name}`
      let description = `Participated in ${tp.tournament.game} tournament`

      if (tp.position === 1) {
        type = 'tournament_win'
        title = `Won ${tp.tournament.name}`
        description = `Claimed victory in ${tp.tournament.game} tournament`
      } else if (tp.position && tp.position <= 3) {
        type = 'tournament_place'
        title = `Placed ${tp.position === 2 ? '2nd' : '3rd'} in ${tp.tournament.name}`
        description = `Finished in top 3 of ${tp.tournament.game} tournament`
      }

      activities.push({
        id: `tournament_${tp.id}`,
        type,
        title,
        description,
        points,
        date: tp.joinedAt,
        metadata: {
          tournamentId: tp.tournament.id,
          game: tp.tournament.game,
          placement: tp.position
        }
      })
    })

    // Add achievement activities
    recentAchievements.forEach((ua: any) => {
      activities.push({
        id: `achievement_${ua.id}`,
        type: 'achievement',
        title: `Unlocked "${ua.achievement.name}" achievement`,
        description: ua.achievement.description,
        points: 0, // Achievements don't give direct points in our current system
        date: ua.unlockedAt,
        metadata: {
          achievementId: ua.achievement.id,
          rarity: ua.achievement.rarity,
          achievementType: ua.achievement.type
        }
      })
    })

    // Add match activities
    recentMatches.forEach((stats: any) => {
      if (stats.match.gameEndTime) {
        const isWinner = stats.match.winnerTeamId && stats.teamSide === 'TeamA' 
          ? stats.match.teamAScore > stats.match.teamBScore
          : stats.match.teamBScore > stats.match.teamAScore

        activities.push({
          id: `match_${stats.id}`,
          type: isWinner ? 'match_win' : 'match_loss',
          title: isWinner ? 'Victory' : 'Defeat',
          description: `${stats.kills}/${stats.deaths}/${stats.assists} in ${stats.match.tournament.game}`,
          points: 0, // Match points are calculated elsewhere
          date: stats.match.gameEndTime,
          metadata: {
            matchId: stats.match.id,
            tournamentId: stats.match.tournament.id,
            game: stats.match.gameMode,
            kda: `${stats.kills}/${stats.deaths}/${stats.assists}`,
            score: stats.score
          }
        })
      }
    })

    // Add team join activities
    recentTeamJoins.forEach((tm: any) => {
      activities.push({
        id: `team_join_${tm.id}`,
        type: 'team_join',
        title: `Joined team ${tm.team.name}`,
        description: `Became a ${tm.role} of ${tm.team.name}`,
        points: 0,
        date: tm.joinedAt,
        metadata: {
          teamId: tm.team.id,
          role: tm.role
        }
      })
    })

    // Sort all activities by date and limit
    const sortedActivities = activities
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
      .slice(0, limit)

    return ApiResponse.success({
      activities: sortedActivities,
      total: activities.length
    }, 'Recent activity retrieved successfully')

  } catch (error) {
    return handleApiError(error, 'get user activity')
  }
}
