import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { prisma } from '@/lib/prisma'
import { ApiResponse, handleApiError, authenticate, parseJsonBody } from '@/lib/api-utils'

const startMatchTrackingSchema = z.object({
  tournamentId: z.string(),
  lobbyId: z.string(),
  riotMatchId: z.string().optional(),
  participants: z.array(z.object({
    userId: z.string(),
    puuid: z.string(),
    teamSide: z.enum(['TeamA', 'TeamB'])
  }))
})

const updateMatchStatsSchema = z.object({
  matchId: z.string(),
  riotMatchId: z.string()
})

// POST /api/tournaments/matches/track - Start match tracking
export async function POST(request: NextRequest) {
  try {
    const user = await authenticate(request)
    if (!user) {
      return ApiResponse.unauthorized('Authentication required')
    }

    const body = await parseJsonBody<z.infer<typeof startMatchTrackingSchema>>(request)
    const validation = startMatchTrackingSchema.safeParse(body)
    
    if (!validation.success) {
      return ApiResponse.error('Invalid request data', 400, validation.error.errors)
    }

    const { tournamentId, lobbyId, riotMatchId, participants } = validation.data

    // Verify tournament and lobby exist
    const tournament = await prisma.tournament.findUnique({
      where: { id: tournamentId }
    })

    if (!tournament) {
      return ApiResponse.error('Tournament not found', 404)
    }

    const lobby = await prisma.customGameLobby.findUnique({
      where: { id: lobbyId }
    })

    if (!lobby) {
      return ApiResponse.error('Lobby not found', 404)
    }

    // Create match tracking record
    const match = await prisma.tournamentMatch.create({
      data: {
        tournamentId,
        lobbyId,
        riotMatchId,
        gameMode: lobby.gameMode,
        mapId: lobby.mapId,
        status: 'IN_PROGRESS',
        gameStartTime: new Date()
      }
    })

    // Create initial player stats records
    await Promise.all(
      participants.map(participant =>
        prisma.playerMatchStats.create({
          data: {
            matchId: match.id,
            userId: participant.userId,
            puuid: participant.puuid,
            teamSide: participant.teamSide
          }
        })
      )
    )

    // Update lobby status
    await prisma.customGameLobby.update({
      where: { id: lobbyId },
      data: {
        status: 'IN_PROGRESS',
        startedAt: new Date()
      }
    })

    return ApiResponse.success({
      match: {
        id: match.id,
        tournamentId: match.tournamentId,
        status: match.status,
        gameMode: match.gameMode,
        mapId: match.mapId,
        gameStartTime: match.gameStartTime
      }
    }, 'Match tracking started successfully!')

  } catch (error) {
    return handleApiError(error, 'start match tracking')
  }
}

// PUT /api/tournaments/matches/track - Update match with Riot API data
export async function PUT(request: NextRequest) {
  try {
    const user = await authenticate(request)
    if (!user) {
      return ApiResponse.unauthorized('Authentication required')
    }

    const body = await parseJsonBody<z.infer<typeof updateMatchStatsSchema>>(request)
    const validation = updateMatchStatsSchema.safeParse(body)
    
    if (!validation.success) {
      return ApiResponse.error('Invalid request data', 400, validation.error.errors)
    }

    const { matchId, riotMatchId } = validation.data

    // Get match from database
    const match = await prisma.tournamentMatch.findUnique({
      where: { id: matchId },
      include: {
        playerStats: true,
        tournament: true
      }
    })

    if (!match) {
      return ApiResponse.error('Match not found', 404)
    }

    try {
      // Check if Riot API is configured
      if (!process.env.RIOT_API_KEY) {
        return ApiResponse.error('Match tracking requires Riot API configuration', 500)
      }

      // Dynamic import to avoid build-time initialization
      const { riotAPI } = await import('@/lib/riot-api')

      // Fetch match data from Riot API
      let riotMatchData
      if (match.gameMode === 'VALORANT') {
        riotMatchData = await riotAPI.getValorantMatch(riotMatchId)
      } else {
        riotMatchData = await riotAPI.getLeagueMatch(riotMatchId)
      }

      if (match.gameMode === 'VALORANT') {
        // Process Valorant match data
        await processValorantMatch(match, riotMatchData)
      } else {
        // Process League match data
        await processLeagueMatch(match, riotMatchData)
      }

      // Update match status
      await prisma.tournamentMatch.update({
        where: { id: matchId },
        data: {
          riotMatchId,
          status: riotMatchData.isCompleted ? 'COMPLETED' : 'IN_PROGRESS',
          gameEndTime: riotMatchData.isCompleted ? new Date() : null,
          gameLengthMs: riotMatchData.gameLengthMillis
        }
      })

      return ApiResponse.success({
        message: 'Match data updated successfully',
        matchStatus: riotMatchData.isCompleted ? 'COMPLETED' : 'IN_PROGRESS'
      })

    } catch (error: any) {
      if (error.message.includes('404')) {
        return ApiResponse.error('Match not found in Riot API. The match may not be completed yet.', 404)
      }
      throw error
    }

  } catch (error) {
    return handleApiError(error, 'update match stats')
  }
}

// Helper function to process Valorant match data
async function processValorantMatch(match: any, riotMatchData: any) {
  const { rounds, players } = riotMatchData

  // Update player match stats
  for (const player of players) {
    const existingPlayerStats = match.playerStats.find((ps: any) => ps.puuid === player.puuid)
    
    if (existingPlayerStats) {
      await prisma.playerMatchStats.update({
        where: { id: existingPlayerStats.id },
        data: {
          kills: player.kills,
          deaths: player.deaths,
          assists: player.assists,
          score: player.score,
          damageDealt: player.damageDealt,
          damageReceived: player.damageReceived,
          headshotPct: player.headshots / (player.headshots + player.bodyshots + player.legshots) * 100,
          firstBloods: 0, // Would need to calculate from round data
          clutches: 0, // Would need to calculate from round data
          aces: 0 // Would need to calculate from round data
        }
      })
    }
  }

  // Process rounds
  for (const round of rounds) {
    // Check if round already exists
    const existingRound = await prisma.matchRound.findFirst({
      where: {
        matchId: match.id,
        roundNumber: round.roundNum
      }
    })

    if (!existingRound) {
      const roundRecord = await prisma.matchRound.create({
        data: {
          matchId: match.id,
          roundNumber: round.roundNum,
          winningTeam: round.winningTeam,
          roundResult: round.roundResult,
          roundCeremony: round.roundCeremony,
          bombPlanter: round.bombPlanter,
          bombDefuser: round.bombDefuser,
          plantSite: round.plantSite,
          defusedInTime: round.defusedInTime
        }
      })

      // Process player round stats
      for (const playerStat of round.playerStats) {
        const playerMatchStats = match.playerStats.find((ps: any) => ps.puuid === playerStat.puuid)
        
        if (playerMatchStats) {
          await prisma.playerRoundStats.create({
            data: {
              roundId: roundRecord.id,
              matchStatsId: playerMatchStats.id,
              userId: playerMatchStats.userId,
              kills: playerStat.kills,
              damage: playerStat.damage,
              stayed: playerStat.stayed,
              economySpent: playerStat.economy?.spent || 0,
              weapon: playerStat.economy?.weapon,
              armor: playerStat.economy?.armor
            }
          })
        }
      }
    }
  }
}

// Helper function to process League match data
async function processLeagueMatch(match: any, riotMatchData: any) {
  // League match processing would go here
  // This is more complex and would involve processing team stats, player stats, etc.
  console.log('League match processing not yet implemented')
}

// GET /api/tournaments/matches/track?tournamentId=xxx - Get match tracking data
export async function GET(request: NextRequest) {
  try {
    const user = await authenticate(request)
    if (!user) {
      return ApiResponse.unauthorized('Authentication required')
    }

    const { searchParams } = new URL(request.url)
    const tournamentId = searchParams.get('tournamentId')

    if (!tournamentId) {
      return ApiResponse.error('Tournament ID is required', 400)
    }

    // Get matches for tournament
    const matches = await prisma.tournamentMatch.findMany({
      where: { tournamentId },
      include: {
        playerStats: {
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
        rounds: {
          include: {
            playerStats: true
          },
          orderBy: { roundNumber: 'asc' }
        },
        lobby: true
      },
      orderBy: { createdAt: 'desc' }
    })

    return ApiResponse.success({
      matches: matches.map((match: any) => ({
        id: match.id,
        tournamentId: match.tournamentId,
        riotMatchId: match.riotMatchId,
        gameMode: match.gameMode,
        mapId: match.mapId,
        mapName: match.mapName,
        status: match.status,
        teamAScore: match.teamAScore,
        teamBScore: match.teamBScore,
        gameStartTime: match.gameStartTime,
        gameEndTime: match.gameEndTime,
        gameLengthMs: match.gameLengthMs,
        playerStats: match.playerStats,
        rounds: match.rounds,
        lobby: match.lobby
      }))
    })

  } catch (error) {
    return handleApiError(error, 'get match tracking data')
  }
}
