import { NextRequest } from 'next/server'
import { z } from 'zod'
import { ApiResponse, authenticate, handleApiError, parseJsonBody } from '@/lib/api-utils'
import { prisma } from '@/lib/prisma'

// GET /api/tournaments/[id] - Get tournament details
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const tournament = await prisma.tournament.findUnique({
      where: { id: params.id },
      include: {
        participants: {
          include: {
            user: {
              select: {
                id: true,
                username: true,
                avatar: true,
                currentRank: true
              }
            },
            team: {
              select: {
                id: true,
                name: true,
                avatar: true
              }
            }
          }
        },
        matches: {
          include: {
            winnerTeam: {
              select: {
                id: true,
                name: true,
                avatar: true
              }
            }
          },
          orderBy: {
            createdAt: 'asc'
          }
        }
      }
    })

    if (!tournament) {
      return ApiResponse.notFound('Tournament not found')
    }

    // Check if user can view private tournament
    const user = await authenticate(request)
    if (tournament.isPrivate) {
      if (!user) {
        return ApiResponse.forbidden('This tournament is private')
      }
      // Check if user is a participant
      const isParticipant = tournament.participants.some((p: any) => p.userId === user.id)
      if (!isParticipant) {
        return ApiResponse.forbidden('This tournament is private')
      }
    }

    const formattedTournament = {
      id: tournament.id,
      name: tournament.name,
      description: tournament.description,
      game: tournament.game,
      maxParticipants: tournament.maxParticipants,
      teamSize: tournament.teamSize,
      currentParticipants: tournament.participants.length,
      startDate: tournament.startDate,
      endDate: tournament.endDate,
      status: getTournamentStatus(tournament),
      pointsReward: tournament.pointsReward,
      rules: tournament.rules,
      isPrivate: tournament.isPrivate,
      participants: tournament.participants.map((p: any) => ({
        id: p.id,
        userId: p.userId,
        teamId: p.teamId,
        user: p.user,
        team: p.team,
        joinedAt: p.createdAt,
        placement: p.placement,
        pointsEarned: p.pointsEarned
      })),
      matches: tournament.matches.map((m: any) => ({
        id: m.id,
        round: m.round,
        matchNumber: m.matchNumber,
        player1: m.player1,
        player2: m.player2,
        team1: m.team1,
        team2: m.team2,
        winner: m.winner,
        score: m.score,
        scheduledTime: m.scheduledTime,
        completedAt: m.completedAt,
        status: m.status
      })),
      createdAt: tournament.createdAt
    }

    return ApiResponse.success(formattedTournament, 'Tournament retrieved successfully')

  } catch (error) {
    return handleApiError(error, 'get tournament')
  }
}

// PUT /api/tournaments/[id] - Update tournament (organizer only)
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const user = await authenticate(request)
    
    if (!user) {
      return ApiResponse.unauthorized('Authentication required')
    }

    const tournament = await prisma.tournament.findUnique({
      where: { id: params.id }
    })

    if (!tournament) {
      return ApiResponse.notFound('Tournament not found')
    }

    if (tournament.organizerId !== user.id) {
      return ApiResponse.forbidden('Only organizer can update tournament')
    }

    const updateSchema = z.object({
      name: z.string().min(1).max(100).optional(),
      description: z.string().optional(),
      rules: z.string().optional(),
      pointsReward: z.number().int().min(0).optional(),
      bannerImage: z.string().url().optional(),
      registrationEnd: z.string().datetime().optional(),
      startDate: z.string().datetime().optional(),
      endDate: z.string().datetime().optional(),
    })

    const body = await parseJsonBody<z.infer<typeof updateSchema>>(request)
    
    if (!body) {
      return ApiResponse.error('Invalid request body', 400)
    }

    const validation = updateSchema.safeParse(body)
    if (!validation.success) {
      return ApiResponse.error('Validation failed', 400, validation.error.errors)
    }

    const data = validation.data

    // Convert date strings to Date objects if provided
    const updateData: any = { ...data }
    if (data.registrationEnd) updateData.registrationEnd = new Date(data.registrationEnd)
    if (data.startDate) updateData.startDate = new Date(data.startDate)
    if (data.endDate) updateData.endDate = new Date(data.endDate)

    const updatedTournament = await prisma.tournament.update({
      where: { id: params.id },
      data: updateData,
      include: {
        organizer: {
          select: {
            id: true,
            username: true,
            avatar: true
          }
        }
      }
    })

    return ApiResponse.success(updatedTournament, 'Tournament updated successfully')

  } catch (error) {
    return handleApiError(error, 'update tournament')
  }
}

// DELETE /api/tournaments/[id] - Delete tournament (organizer only)
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const user = await authenticate(request)
    
    if (!user) {
      return ApiResponse.unauthorized('Authentication required')
    }

    const tournament = await prisma.tournament.findUnique({
      where: { id: params.id }
    })

    if (!tournament) {
      return ApiResponse.notFound('Tournament not found')
    }

    if (tournament.organizerId !== user.id) {
      return ApiResponse.forbidden('Only organizer can delete tournament')
    }

    // Check if tournament has started
    const now = new Date()
    if (tournament.startDate <= now) {
      return ApiResponse.error('Cannot delete tournament that has already started', 400)
    }

    await prisma.tournament.delete({
      where: { id: params.id }
    })

    return ApiResponse.success(null, 'Tournament deleted successfully')

  } catch (error) {
    return handleApiError(error, 'delete tournament')
  }
}

// Helper function to determine tournament status
function getTournamentStatus(tournament: any): string {
  const now = new Date()
  
  if (tournament.registrationStart > now) {
    return 'upcoming'
  } else if (tournament.registrationEnd > now) {
    return 'registration'
  } else if (tournament.startDate > now) {
    return 'waiting'
  } else if (!tournament.endDate || tournament.endDate > now) {
    return 'active'
  } else {
    return 'completed'
  }
}
