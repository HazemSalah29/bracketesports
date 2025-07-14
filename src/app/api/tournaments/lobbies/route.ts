import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { prisma } from '@/lib/prisma'
import { ApiResponse, handleApiError, authenticate, parseJsonBody } from '@/lib/api-utils'

const createLobbySchema = z.object({
  tournamentId: z.string(),
  gameMode: z.enum(['VALORANT', 'LEAGUE_OF_LEGENDS']),
  mapId: z.string().optional(),
  teamSize: z.number().min(1).max(5).default(5),
  gameSettings: z.record(z.any()).optional()
})

// POST /api/tournaments/lobbies - Create custom game lobby
export async function POST(request: NextRequest) {
  try {
    const user = await authenticate(request)
    if (!user) {
      return ApiResponse.unauthorized('Authentication required')
    }

    const body = await parseJsonBody<z.infer<typeof createLobbySchema>>(request)
    const validation = createLobbySchema.safeParse(body)
    
    if (!validation.success) {
      return ApiResponse.error('Invalid request data', 400, validation.error.errors)
    }

    const { tournamentId, gameMode, mapId, teamSize, gameSettings } = validation.data

    // Verify user can create lobby for this tournament
    const tournament = await prisma.tournament.findUnique({
      where: { id: tournamentId },
      include: {
        participants: {
          where: { userId: user.id }
        }
      }
    })

    if (!tournament) {
      return ApiResponse.error('Tournament not found', 404)
    }

    // Check if user is participant in tournament (for now, any participant can create lobby)
    if (tournament.participants.length === 0) {
      return ApiResponse.error('You must be a participant in this tournament to create a lobby', 403)
    }

    // Check if lobby already exists for this tournament
    const existingLobby = await prisma.customGameLobby.findFirst({
      where: {
        tournamentId,
        status: { in: ['CREATED', 'IN_PROGRESS'] }
      }
    })

    if (existingLobby) {
      return ApiResponse.error('An active lobby already exists for this tournament', 409)
    }

    try {
      // Check if Riot API is configured
      if (!process.env.RIOT_API_KEY) {
        return ApiResponse.error('Custom game lobby creation requires Riot API configuration', 500)
      }

      // Dynamic import to avoid build-time initialization
      const { riotAPI } = await import('@/lib/riot-api')

      // Create custom game lobby via Riot API
      let lobbyData
      if (gameMode === 'VALORANT') {
        lobbyData = await riotAPI.createValorantCustomGame({
          gameMode: 'Custom',
          mapId: mapId || 'Haven',
          teamSize,
          allowCheats: false,
          tournamentCode: `BRACKET_${tournamentId.slice(-8)}`
        })
      } else {
        lobbyData = await riotAPI.createLeagueCustomGame({
          gameMode: 'CLASSIC',
          mapId: mapId || 'SR',
          teamSize,
          pickType: 'TOURNAMENT_DRAFT',
          tournamentCode: `BRACKET_${tournamentId.slice(-8)}`
        })
      }

      // Save lobby to database
      const lobby = await prisma.customGameLobby.create({
        data: {
          tournamentId,
          gameMode,
          lobbyId: lobbyData.lobbyId,
          password: lobbyData.password,
          mapId: mapId || (gameMode === 'VALORANT' ? 'Haven' : 'SR'),
          teamSize,
          maxPlayers: teamSize * 2,
          gameSettings: gameSettings || {},
          status: 'CREATED'
        }
      })

      return ApiResponse.success({
        lobby: {
          id: lobby.id,
          lobbyId: lobby.lobbyId,
          password: lobby.password,
          gameMode: lobby.gameMode,
          mapId: lobby.mapId,
          teamSize: lobby.teamSize,
          maxPlayers: lobby.maxPlayers,
          status: lobby.status,
          createdAt: lobby.createdAt
        },
        instructions: gameMode === 'VALORANT' 
          ? `Custom game created! In Valorant, go to Play > Custom Game > Enter Code and use: ${lobby.password}`
          : `Custom game created! In League of Legends, create a custom lobby and set password to: ${lobby.password}`
      }, 'Custom game lobby created successfully!')

    } catch (error: any) {
      console.error('Failed to create custom game:', error)
      return ApiResponse.error('Failed to create custom game lobby. Please try again.', 500)
    }

  } catch (error) {
    return handleApiError(error, 'create custom game lobby')
  }
}

// GET /api/tournaments/lobbies?tournamentId=xxx - Get lobby for tournament
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

    // Verify user can access this tournament
    const tournament = await prisma.tournament.findUnique({
      where: { id: tournamentId },
      include: {
        participants: {
          where: { userId: user.id }
        },
        customLobbies: {
          where: {
            status: { in: ['CREATED', 'IN_PROGRESS'] }
          },
          orderBy: { createdAt: 'desc' },
          take: 1
        }
      }
    })

    if (!tournament) {
      return ApiResponse.error('Tournament not found', 404)
    }

    if (tournament.participants.length === 0) {
      return ApiResponse.error('You must be a participant in this tournament to view lobbies', 403)
    }

    const lobby = tournament.customLobbies[0]

    if (!lobby) {
      return ApiResponse.success({
        lobby: null,
        message: 'No active lobby found for this tournament'
      })
    }

    return ApiResponse.success({
      lobby: {
        id: lobby.id,
        lobbyId: lobby.lobbyId,
        password: lobby.password,
        gameMode: lobby.gameMode,
        mapId: lobby.mapId,
        teamSize: lobby.teamSize,
        maxPlayers: lobby.maxPlayers,
        status: lobby.status,
        createdAt: lobby.createdAt,
        startedAt: lobby.startedAt
      }
    })

  } catch (error) {
    return handleApiError(error, 'get tournament lobby')
  }
}
