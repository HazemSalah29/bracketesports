import { NextRequest } from 'next/server'
import { ApiResponse, authenticate, handleApiError } from '@/lib/api-utils'
import { prisma } from '@/lib/prisma'
import { z } from 'zod'

const requestSchema = z.object({
  game: z.string().min(1),
  gameName: z.string().min(1),
  tagLine: z.string().min(1)
})

// POST /api/user/gaming-accounts/verify - Verify gaming account
export async function POST(request: NextRequest) {
  try {
    const user = await authenticate(request)
    if (!user) {
      return ApiResponse.unauthorized()
    }

    const body = await request.json()
    const { game, gameName, tagLine } = requestSchema.parse(body)

    console.log('Verification request:', {
      userId: user.id,
      game,
      gameName,
      tagLine
    })

    const username = `${gameName}#${tagLine}`

    // Check if account already exists
    const existingAccount = await prisma.gamingAccount.findFirst({
      where: {
        userId: user.id,
        platform: 'riot',
        username: username
      }
    })

    if (existingAccount) {
      if (existingAccount.verified) {
        return ApiResponse.error('Account is already verified', 400)
      }
    }

    // Create or update the gaming account as verified
    const gamingAccount = existingAccount 
      ? await prisma.gamingAccount.update({
          where: { id: existingAccount.id },
          data: { verified: true }
        })
      : await prisma.gamingAccount.create({
          data: {
            userId: user.id,
            platform: 'riot',
            platformId: `riot_${gameName}_${tagLine}`,
            username: username,
            verified: true
          }
        })

    return ApiResponse.success(
      {
        id: gamingAccount.id,
        platform: gamingAccount.platform,
        username: gamingAccount.username,
        verified: gamingAccount.verified
      },
      'Account verified successfully'
    )

  } catch (error) {
    return handleApiError(error, 'verify gaming account')
  }
}
