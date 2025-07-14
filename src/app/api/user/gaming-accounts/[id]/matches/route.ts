import { NextRequest } from 'next/server'
import { ApiResponse, authenticate, handleApiError } from '@/lib/api-utils'
import { prisma } from '@/lib/prisma'

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const user = await authenticate(request)
    if (!user) {
      return ApiResponse.unauthorized()
    }

    const accountId = params.id
    const gamingAccount = await prisma.gamingAccount.findUnique({
      where: { 
        id: accountId,
        userId: user.id
      }
    })

    if (!gamingAccount) {
      return ApiResponse.notFound('Gaming account not found')
    }

    if (gamingAccount.platform !== 'riot') {
      return ApiResponse.success([], 'Match history not available for this platform')
    }

    if (!gamingAccount.verified) {
      return ApiResponse.error('Account must be verified to fetch match history', 400)
    }

    const mockMatches = [
      {
        id: 'match1',
        gameMode: 'RANKED',
        gameType: 'VALORANT',
        matchDate: new Date().toISOString(),
        result: 'WIN',
        score: '13-10',
        duration: 1800000,
        map: 'Bind',
        agent: 'Jett',
        kills: 24,
        deaths: 15,
        assists: 8
      }
    ]
    
    return ApiResponse.success(mockMatches, 'Match history retrieved successfully')

  } catch (error) {
    return handleApiError(error, 'fetch match history')
  }
}
