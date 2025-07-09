import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { prisma } from '@/lib/prisma'
import { riotAPI } from '@/lib/riot-api'
import { ApiResponse, handleApiError, authenticate, parseJsonBody } from '@/lib/api-utils'

const verifyAccountSchema = z.object({
  platform: z.enum(['riot']),
  gameName: z.string().min(1).max(16),
  tagLine: z.string().min(1).max(5),
  game: z.enum(['VALORANT', 'LEAGUE_OF_LEGENDS'])
})

const linkAccountSchema = z.object({
  platform: z.enum(['riot']),
  gameName: z.string().min(1).max(16),
  tagLine: z.string().min(1).max(5),
  game: z.enum(['VALORANT', 'LEAGUE_OF_LEGENDS']),
  verificationCode: z.string().min(6).max(8)
})

// POST /api/user/gaming-accounts/verify - Verify Riot account ownership
export async function POST(request: NextRequest) {
  try {
    const user = await authenticate(request)
    if (!user) {
      return ApiResponse.unauthorized('Authentication required')
    }

    const body = await parseJsonBody<z.infer<typeof verifyAccountSchema>>(request)
    const validation = verifyAccountSchema.safeParse(body)
    
    if (!validation.success) {
      return ApiResponse.error('Invalid request data', 400, validation.error.errors)
    }

    const { gameName, tagLine, game } = validation.data

    console.log('🔍 Starting verification for:', { gameName, tagLine, game, userId: user.id })

    try {
      // Get account from Riot API
      console.log('📡 Calling Riot API for account:', `${gameName}#${tagLine}`)
      const riotAccount = await riotAPI.getAccountByRiotId(gameName, tagLine)
      console.log('✅ Riot account found:', { puuid: riotAccount.puuid, gameName: riotAccount.gameName })
      
      // Check if account is already linked to another user
      const existingAccount = await prisma.gamingAccount.findFirst({
        where: {
          platform: 'riot',
          platformId: riotAccount.puuid
        }
      })

      if (existingAccount && existingAccount.userId !== user.id) {
        return ApiResponse.error('This Riot account is already linked to another user', 409)
      }

      // Generate verification code
      const verificationCode = Math.random().toString(36).substr(2, 8).toUpperCase()

      // Store verification attempt (temporary)
      await prisma.gamingAccount.upsert({
        where: {
          userId_platform: {
            userId: user.id,
            platform: 'riot'
          }
        },
        create: {
          userId: user.id,
          platform: 'riot',
          platformId: riotAccount.puuid,
          username: `${gameName}#${tagLine}`,
          verified: false,
          metadata: {
            verificationCode,
            expiresAt: new Date(Date.now() + 10 * 60 * 1000), // 10 minutes
            game,
            gameName,
            tagLine
          }
        },
        update: {
          platformId: riotAccount.puuid,
          username: `${gameName}#${tagLine}`,
          verified: false,
          metadata: {
            verificationCode,
            expiresAt: new Date(Date.now() + 10 * 60 * 1000),
            game,
            gameName,
            tagLine
          }
        }
      })

      return ApiResponse.success({
        verificationCode,
        instructions: game === 'VALORANT' 
          ? `Please change your Riot ID to include "${verificationCode}" (e.g., ${gameName}${verificationCode}#${tagLine}) and then click verify. You can change it back after verification.`
          : `Please change your Riot ID to include "${verificationCode}" (e.g., ${gameName}${verificationCode}#${tagLine}) and then click verify. You can change it back after verification.`
      }, 'Verification code generated. Please update your Riot ID.')

    } catch (error: any) {
      console.error('❌ Riot API Error:', error)
      
      let errorMessage = 'Failed to verify account'
      
      if (error.message.includes('404')) {
        errorMessage = `Riot account "${gameName}#${tagLine}" not found. Please check your Riot ID and tag are correct.`
      } else if (error.message.includes('403')) {
        errorMessage = 'API access denied. The service may be temporarily unavailable.'
      } else if (error.message.includes('429')) {
        errorMessage = 'Too many requests. Please wait a moment and try again.'
      } else if (error.message.includes('RIOT_API_KEY')) {
        errorMessage = 'Service configuration error. Please contact support.'
      } else {
        errorMessage = `Verification failed: ${error.message}`
      }
      
      return ApiResponse.error(errorMessage, 400)
    }

  } catch (error) {
    return handleApiError(error, 'verify riot account')
  }
}

// PUT /api/user/gaming-accounts/verify - Complete account verification
export async function PUT(request: NextRequest) {
  try {
    const user = await authenticate(request)
    if (!user) {
      return ApiResponse.unauthorized('Authentication required')
    }

    const body = await parseJsonBody<z.infer<typeof linkAccountSchema>>(request)
    const validation = linkAccountSchema.safeParse(body)
    
    if (!validation.success) {
      return ApiResponse.error('Invalid request data', 400, validation.error.errors)
    }

    const { gameName, tagLine, game, verificationCode } = validation.data

    // Get the pending verification
    const pendingAccount = await prisma.gamingAccount.findFirst({
      where: {
        userId: user.id,
        platform: 'riot',
        verified: false
      }
    })

    if (!pendingAccount || !pendingAccount.metadata) {
      return ApiResponse.error('No pending verification found. Please start verification process again.', 404)
    }

    const metadata = pendingAccount.metadata as any
    
    // Check if verification code matches and hasn't expired
    if (metadata.verificationCode !== verificationCode) {
      return ApiResponse.error('Invalid verification code', 400)
    }

    if (new Date() > new Date(metadata.expiresAt)) {
      return ApiResponse.error('Verification code has expired. Please start again.', 400)
    }

    try {
      // Verify the account still exists and contains verification code
      const riotAccount = await riotAPI.getAccountByRiotId(gameName, tagLine)
      
      // Check if the current Riot ID contains the verification code
      const currentGameName = riotAccount.gameName
      const currentTagLine = riotAccount.tagLine
      
      if (!currentGameName.includes(verificationCode) && !currentTagLine.includes(verificationCode)) {
        return ApiResponse.error('Verification code not found in your current Riot ID. Please make sure your Riot ID contains the verification code.', 400)
      }

      // Get player rank
      let rank = null
      try {
        rank = await riotAPI.getPlayerCurrentRank(riotAccount.puuid, game)
      } catch (error) {
        console.warn('Could not fetch player rank:', error)
      }

      // Update the gaming account as verified
      const verifiedAccount = await prisma.gamingAccount.update({
        where: { id: pendingAccount.id },
        data: {
          username: `${metadata.gameName}#${metadata.tagLine}`, // Use original name
          verified: true,
          metadata: {
            game,
            puuid: riotAccount.puuid,
            originalGameName: metadata.gameName,
            originalTagLine: metadata.tagLine,
            currentRank: rank,
            verifiedAt: new Date()
          }
        }
      })

      return ApiResponse.success({
        account: {
          id: verifiedAccount.id,
          platform: verifiedAccount.platform,
          username: verifiedAccount.username,
          verified: verifiedAccount.verified,
          game,
          rank
        }
      }, 'Riot account verified successfully!')

    } catch (error: any) {
      if (error.message.includes('404')) {
        return ApiResponse.error('Riot account not found with current name. Verification failed.', 404)
      }
      throw error
    }

  } catch (error) {
    return handleApiError(error, 'complete riot account verification')
  }
}
