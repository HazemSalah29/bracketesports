import { NextRequest } from 'next/server'
import { z } from 'zod'
import { ApiResponse, authenticate, handleApiError, parseJsonBody, parsePaginationParams, createPaginatedResponse } from '@/lib/api-utils'
import { prisma } from '@/lib/prisma'

const createTeamSchema = z.object({
  name: z.string().min(1).max(50),
  description: z.string().max(500).optional(),
  logo: z.string().url().optional(),
  game: z.string(),
  isPrivate: z.boolean().optional().default(false),
  maxMembers: z.number().int().min(2).max(10).optional().default(5),
})

// GET /api/teams - Get teams with pagination and filtering
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const pagination = parsePaginationParams(searchParams)
    
    // Filters
    const game = searchParams.get('game')
    const search = searchParams.get('search')
    const myTeams = searchParams.get('myTeams') === 'true'

    const where: any = {}

    // Filter by game
    if (game) {
      where.game = game
    }

    // Search by name or description
    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } }
      ]
    }

    const user = await authenticate(request)

    // Filter by user's teams
    if (myTeams && user) {
      where.members = {
        some: {
          userId: user.id,
          status: 'ACTIVE'
        }
      }
    } else {
      // Only show public teams unless user is authenticated
      if (!user) {
        where.isPrivate = false
      }
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
          _count: {
            select: {
              members: true
            }
          }
        },
        orderBy: { [pagination.sortBy || 'createdAt']: pagination.sortOrder },
        skip: ((pagination.page || 1) - 1) * (pagination.limit || 10),
        take: pagination.limit || 10,
      }),
      prisma.team.count({ where })
    ])

    const formattedTeams = teams.map((team: any) => ({
      id: team.id,
      name: team.name,
      description: team.description,
      avatar: team.avatar,
      isPrivate: !team.isPublic,
      maxMembers: team.maxMembers,
      memberCount: team._count.members,
      owner: team.owner,
      members: team.members.map((m: any) => ({
        id: m.id,
        userId: m.userId,
        role: m.role,
        user: m.user,
        joinedAt: m.joinedAt
      })),
      createdAt: team.createdAt
    }))

    const response = createPaginatedResponse(formattedTeams, total, pagination)
    return ApiResponse.success(response, 'Teams retrieved successfully')

  } catch (error) {
    return handleApiError(error, 'get teams')
  }
}

// POST /api/teams - Create a new team
export async function POST(request: NextRequest) {
  try {
    const user = await authenticate(request)
    
    if (!user) {
      return ApiResponse.unauthorized('Authentication required')
    }

    const body = await parseJsonBody<z.infer<typeof createTeamSchema>>(request)
    
    if (!body) {
      return ApiResponse.error('Invalid request body', 400)
    }

    const validation = createTeamSchema.safeParse(body)
    if (!validation.success) {
      return ApiResponse.error('Validation failed', 400, validation.error.errors)
    }

    const data = validation.data

    // Check if team name already exists
    const existingTeam = await prisma.team.findFirst({
      where: { name: data.name }
    })

    if (existingTeam) {
      return ApiResponse.error('Team name already exists', 409)
    }

    // Create team with user as owner
    const team = await prisma.team.create({
      data: {
        name: data.name,
        tag: data.name.substring(0, 4).toUpperCase(), // Generate a simple tag from name
        description: data.description,
        ownerId: user.id,
        maxMembers: data.maxMembers || 5,
        isPublic: !data.isPrivate
      },
      include: {
        owner: {
          select: {
            id: true,
            username: true,
            avatar: true
          }
        }
      }
    })

    // Add user as team member with captain role
    await prisma.teamMember.create({
      data: {
        teamId: team.id,
        userId: user.id,
        role: 'captain'
      }
    })

    const formattedTeam = {
      id: team.id,
      name: team.name,
      description: team.description,
      avatar: team.avatar,
      isPrivate: !team.isPublic,
      maxMembers: team.maxMembers,
      memberCount: 1,
      owner: team.owner,
      members: [{
        id: 'temp',
        userId: user.id,
        role: 'captain',
        user: {
          id: user.id,
          username: user.username,
          avatar: null
        },
        joinedAt: new Date()
      }],
      createdAt: team.createdAt
    }

    return ApiResponse.success(formattedTeam, 'Team created successfully')

  } catch (error) {
    return handleApiError(error, 'create team')
  }
}
