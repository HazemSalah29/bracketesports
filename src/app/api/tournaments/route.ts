import { NextRequest } from 'next/server'
import { z } from 'zod'
import { ApiResponse, authenticate, parsePaginationParams, createPaginatedResponse, handleApiError, parseJsonBody } from '@/lib/api-utils'
import { prisma } from '@/lib/prisma'

const createTournamentSchema = z.object({
  name: z.string().min(1).max(100),
  description: z.string().optional(),
  game: z.string(),
  format: z.enum(['SINGLE_ELIMINATION', 'DOUBLE_ELIMINATION', 'ROUND_ROBIN', 'SWISS']),
  maxParticipants: z.number().int().min(2).max(1000),
  teamSize: z.number().int().min(1).max(10),
  registrationStart: z.string().datetime(),
  registrationEnd: z.string().datetime(),
  startDate: z.string().datetime(),
  endDate: z.string().datetime().optional(),
  rules: z.string().optional(),
  pointsReward: z.number().int().min(0),
  bannerImage: z.string().url().optional(),
  isPrivate: z.boolean().optional().default(false),
  inviteCode: z.string().optional(),
})

// GET /api/tournaments - List tournaments with filtering and pagination
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const pagination = parsePaginationParams(searchParams)
    
    // Filters
    const game = searchParams.get('game')
    const status = searchParams.get('status')
    const search = searchParams.get('search')

    const where: any = {}

    // Filter by game
    if (game && game !== 'all') {
      where.game = game
    }

    // Filter by status
    if (status && status !== 'all') {
      const now = new Date()
      switch (status) {
        case 'upcoming':
          where.registrationStart = { gt: now }
          break
        case 'registration':
          where.AND = [
            { registrationStart: { lte: now } },
            { registrationEnd: { gt: now } }
          ]
          break
        case 'active':
          where.AND = [
            { startDate: { lte: now } },
            { OR: [{ endDate: null }, { endDate: { gt: now } }] }
          ]
          break
        case 'completed':
          where.endDate = { lt: now }
          break
      }
    }

    // Search by name or description
    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } }
      ]
    }

    // Only show public tournaments unless user is authenticated
    const user = await authenticate(request)
    if (!user) {
      where.isPrivate = false
    }

    const [tournaments, total] = await Promise.all([
      prisma.tournament.findMany({
        where,
        include: {
          _count: {
            select: {
              participants: true
            }
          },
          creator: {
            include: {
              user: {
                select: {
                  id: true,
                  username: true,
                  avatar: true
                }
              }
            }
          }
        },
        orderBy: { [pagination.sortBy || 'createdAt']: pagination.sortOrder },
        skip: ((pagination.page || 1) - 1) * (pagination.limit || 10),
        take: pagination.limit || 10,
      }),
      prisma.tournament.count({ where })
    ])

    const formattedTournaments = tournaments.map((tournament: any) => ({
      id: tournament.id,
      name: tournament.name,
      description: tournament.description,
      game: tournament.game,
      gameIcon: tournament.gameIcon,
      tournamentType: tournament.tournamentType,
      skillRequirement: tournament.skillRequirement,
      maxParticipants: tournament.maxParticipants,
      teamSize: tournament.teamSize,
      currentParticipants: tournament._count.participants,
      registrationDeadline: tournament.registrationDeadline,
      startDate: tournament.startDate,
      endDate: tournament.endDate,
      status: getTournamentStatus(tournament),
      pointsReward: tournament.pointsReward,
      isPrivate: tournament.isPrivate,
      isCreatorTournament: tournament.isCreatorTournament,
      entryFeeCoin: tournament.entryFeeCoin,
      prizeType: tournament.prizeType,
      prizeDescription: tournament.prizeDescription,
      creator: tournament.creator ? {
        id: tournament.creator.id,
        handle: tournament.creator.handle,
        tier: tournament.creator.tier,
        followerCount: tournament.creator.followerCount,
        user: tournament.creator.user
      } : null,
      createdAt: tournament.createdAt
    }))

    const response = createPaginatedResponse(formattedTournaments, total, pagination)
    return ApiResponse.success(response, 'Tournaments retrieved successfully')

  } catch (error) {
    return handleApiError(error, 'get tournaments')
  }
}

// POST /api/tournaments - Create new tournament
export async function POST(request: NextRequest) {
  try {
    const user = await authenticate(request)
    
    if (!user) {
      return ApiResponse.unauthorized('Authentication required')
    }

    const body = await parseJsonBody<z.infer<typeof createTournamentSchema>>(request)
    
    if (!body) {
      return ApiResponse.error('Invalid request body', 400)
    }

    const validation = createTournamentSchema.safeParse(body)
    if (!validation.success) {
      return ApiResponse.error('Validation failed', 400, validation.error.errors)
    }

    const data = validation.data

    // Validate dates
    const registrationStart = new Date(data.registrationStart)
    const registrationEnd = new Date(data.registrationEnd)
    const startDate = new Date(data.startDate)
    const endDate = data.endDate ? new Date(data.endDate) : null

    if (registrationEnd <= registrationStart) {
      return ApiResponse.error('Registration end must be after registration start', 400)
    }

    if (startDate <= registrationEnd) {
      return ApiResponse.error('Tournament start must be after registration end', 400)
    }

    if (endDate && endDate <= startDate) {
      return ApiResponse.error('Tournament end must be after tournament start', 400)
    }

    const tournament = await prisma.tournament.create({
      data: {
        ...data,
        organizerId: user.id,
        registrationStart,
        registrationEnd,
        startDate,
        endDate: endDate || undefined,
      },
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

    const formattedTournament = {
      id: tournament.id,
      name: tournament.name,
      description: tournament.description,
      game: tournament.game,
      format: tournament.format,
      maxParticipants: tournament.maxParticipants,
      teamSize: tournament.teamSize,
      currentParticipants: 0,
      registrationStart: tournament.registrationStart,
      registrationEnd: tournament.registrationEnd,
      startDate: tournament.startDate,
      endDate: tournament.endDate,
      status: getTournamentStatus(tournament),
      pointsReward: tournament.pointsReward,
      bannerImage: tournament.bannerImage,
      isPrivate: tournament.isPrivate,
      organizer: tournament.organizer,
      createdAt: tournament.createdAt
    }

    return ApiResponse.success(formattedTournament, 'Tournament created successfully')

  } catch (error) {
    return handleApiError(error, 'create tournament')
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
