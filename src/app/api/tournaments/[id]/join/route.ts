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
        participants: true,
        creator: true
      }
    })

    if (!tournament) {
      return ApiResponse.notFound('Tournament not found')
    }

    // Check if tournament is private (inviteCode feature not implemented yet)
    if (tournament.isPrivate) {
      return ApiResponse.forbidden('Private tournaments not yet supported')
    }

    // Check if registration is open
    const now = new Date()
    if (tournament.status !== 'registering') {
      return ApiResponse.error('Registration is closed for this tournament', 400)
    }

    // For creator tournaments, check if user has enough coins
    if (tournament.isCreatorTournament && tournament.entryFeeCoin) {
      const userWithBalance = await prisma.user.findUnique({
        where: { id: user.id },
        select: { coinBalance: true }
      })

      if (!userWithBalance || userWithBalance.coinBalance < tournament.entryFeeCoin) {
        return ApiResponse.error(
          `Insufficient coins. Required: ${tournament.entryFeeCoin}, Available: ${userWithBalance?.coinBalance || 0}`,
          400
        )
      }
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

    // Create participation record with coin transaction for creator tournaments
    const participation = await prisma.$transaction(async (tx: any) => {
      // Handle coin payment for creator tournaments
      if (tournament.isCreatorTournament && tournament.entryFeeCoin) {
        // Deduct coins from user
        await tx.user.update({
          where: { id: user.id },
          data: {
            coinBalance: {
              decrement: tournament.entryFeeCoin
            }
          }
        })

        // Record coin transaction
        await tx.bracketCoin.create({
          data: {
            userId: user.id,
            amount: -tournament.entryFeeCoin,
            type: 'TOURNAMENT_ENTRY',
            status: 'COMPLETED',
            tournamentId: params.id,
            description: `Entry fee for ${tournament.name}`
          }
        })
      }

      // Create participation record
      const newParticipation = await tx.tournamentParticipant.create({
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

      // Update tournament participant count
      await tx.tournament.update({
        where: { id: params.id },
        data: {
          currentParticipants: {
            increment: 1
          }
        }
      })

      return newParticipation
    })

    return ApiResponse.success({
      ...participation,
      coinsDeducted: tournament.entryFeeCoin || 0
    }, 'Successfully joined tournament')

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
      where: { id: params.id },
      include: {
        creator: true
      }
    })

    if (!tournament) {
      return ApiResponse.notFound('Tournament not found')
    }

    // Check if tournament has started or is too close to start
    const now = new Date()
    const tournamentStart = new Date(tournament.startDate)
    const hoursUntilStart = (tournamentStart.getTime() - now.getTime()) / (1000 * 60 * 60)

    if (tournament.startDate <= now) {
      return ApiResponse.error('Cannot leave tournament that has already started', 400)
    }

    // For creator tournaments, allow cancellation only if at least 1 hour before start
    if (tournament.isCreatorTournament && hoursUntilStart < 1) {
      return ApiResponse.error('Cannot cancel registration less than 1 hour before tournament starts', 400)
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

    // Handle refund and participation removal in transaction
    await prisma.$transaction(async (tx: any) => {
      // Remove participation
      await tx.tournamentParticipant.delete({
        where: { id: participation.id }
      })

      // Handle coin refund for creator tournaments
      if (tournament.isCreatorTournament && tournament.entryFeeCoin) {
        // Refund coins to user
        await tx.user.update({
          where: { id: user.id },
          data: {
            coinBalance: {
              increment: tournament.entryFeeCoin
            }
          }
        })

        // Record refund transaction
        await tx.bracketCoin.create({
          data: {
            userId: user.id,
            amount: tournament.entryFeeCoin,
            type: 'TOURNAMENT_REFUND',
            status: 'COMPLETED',
            tournamentId: params.id,
            description: `Refund for ${tournament.name}`
          }
        })
      }

      // Update tournament participant count
      await tx.tournament.update({
        where: { id: params.id },
        data: {
          currentParticipants: {
            decrement: 1
          }
        }
      })
    })

    return ApiResponse.success({
      coinsRefunded: tournament.entryFeeCoin || 0
    }, 'Successfully left tournament')

  } catch (error) {
    return handleApiError(error, 'leave tournament')
  }
}
