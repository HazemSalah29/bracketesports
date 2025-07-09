import { NextRequest } from 'next/server'
import { z } from 'zod'
import { ApiResponse, authenticate, handleApiError, parseJsonBody } from '@/lib/api-utils'
import { prisma } from '@/lib/prisma'

const joinTournamentSchema = z.object({
  teamId: z.string().optional(),
  inviteCode: z.string().optional(),
})

// POST /api/tournaments/[id]/join - Join a tournament
export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const user = await authenticate(request)
    
    if (!user) {
      return ApiResponse.unauthorized('Authentication required')
    }

    const body = await parseJsonBody<z.infer<typeof joinTournamentSchema>>(request)
    
    if (!body) {
      return ApiResponse.error('Invalid request body', 400)
    }

    const { teamId, inviteCode } = body

    const tournament = await prisma.tournament.findUnique({
      where: { id: params.id },
      include: {
        participants: true
      }
    })

    if (!tournament) {
      return ApiResponse.notFound('Tournament not found')
    }

    // Check if tournament is private (inviteCode feature not implemented yet)
    if (tournament.isPrivate) {
      return ApiResponse.forbidden('Private tournaments not yet supported')
    }

    // Check if registration is open (registration dates not implemented yet)
    const now = new Date()
    if (now < tournament.startDate) {
      return ApiResponse.error('Tournament has not started yet', 400)
    }

    if (now > tournament.endDate) {
      return ApiResponse.error('Tournament has ended', 400)
    }

    // Check if tournament is full
    if (tournament.participants.length >= tournament.maxParticipants) {
      return ApiResponse.error('Tournament is full', 400)
    }

    // Check if user is already participating
    const existingParticipation = tournament.participants.find((p: any) => p.userId === user.id)
    if (existingParticipation) {
      return ApiResponse.error('You are already participating in this tournament', 409)
    }

    // For team tournaments, validate team
    if (tournament.teamSize && tournament.teamSize > 1) {
      if (!teamId) {
        return ApiResponse.error('Team ID is required for team tournaments', 400)
      }

      const team = await prisma.team.findUnique({
        where: { id: teamId },
        include: {
          members: true
        }
      })

      if (!team) {
        return ApiResponse.error('Team not found', 404)
      }

      // Check if user is member of the team
      const isMember = team.members.some((m: any) => m.userId === user.id)
      if (!isMember) {
        return ApiResponse.error('You are not a member of this team', 403)
      }

      // Check if team size matches tournament requirements (if teamSize is required)
      if (tournament.teamSize && team.members.length !== tournament.teamSize) {
        return ApiResponse.error(`Team must have exactly ${tournament.teamSize} members`, 400)
      }

      // Check if team is already participating
      const teamParticipation = tournament.participants.find((p: any) => p.teamId === teamId)
      if (teamParticipation) {
        return ApiResponse.error('Team is already participating in this tournament', 409)
      }
    }

    // Create participation record
    const participation = await prisma.tournamentParticipant.create({
      data: {
        tournamentId: params.id,
        userId: user.id,
        teamId: teamId || null
      },
      include: {
        user: {
          select: {
            id: true,
            username: true,
            avatar: true
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
    })

    return ApiResponse.success(participation, 'Successfully joined tournament')

  } catch (error) {
    return handleApiError(error, 'join tournament')
  }
}

// DELETE /api/tournaments/[id]/join - Leave a tournament
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

    // Check if tournament has started
    const now = new Date()
    if (tournament.startDate <= now) {
      return ApiResponse.error('Cannot leave tournament that has already started', 400)
    }

    const participation = await prisma.tournamentParticipant.findFirst({
      where: {
        tournamentId: params.id,
        userId: user.id
      }
    })

    if (!participation) {
      return ApiResponse.error('You are not participating in this tournament', 404)
    }

    await prisma.tournamentParticipant.delete({
      where: { id: participation.id }
    })

    return ApiResponse.success(null, 'Successfully left tournament')

  } catch (error) {
    return handleApiError(error, 'leave tournament')
  }
}
