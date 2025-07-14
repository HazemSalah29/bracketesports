import { NextRequest } from 'next/server'
import { z } from 'zod'
import { ApiResponse, authenticate, handleApiError, parseJsonBody } from '@/lib/api-utils'
import { prisma } from '@/lib/prisma'

const addGamingAccountSchema = z.object({
  platform: z.string(),
  username: z.string().min(1),
  // For Riot accounts, expect gameName and tagLine separately
  gameName: z.string().optional(),
  tagLine: z.string().optional(),
  game: z.enum(['VALORANT', 'LEAGUE_OF_LEGENDS']).optional(),
})

const updateGamingAccountSchema = z.object({
  username: z.string().min(1),
})

// GET /api/user/gaming-accounts - Get user's gaming accounts
export async function GET(request: NextRequest) {
  try {
    const user = await authenticate(request)
    
    if (!user) {
      return ApiResponse.unauthorized('Authentication required')
    }

    const gamingAccounts = await prisma.gamingAccount.findMany({
      where: { userId: user.id },
      orderBy: { createdAt: 'desc' }
    })

    return ApiResponse.success(gamingAccounts, 'Gaming accounts retrieved successfully')

  } catch (error) {
    return handleApiError(error, 'get gaming accounts')
  }
}

// POST /api/user/gaming-accounts - Add a new gaming account
export async function POST(request: NextRequest) {
  try {
    console.log('🔧 Starting POST /api/user/gaming-accounts')
    
    const user = await authenticate(request)
    console.log('🔧 User authenticated:', user ? `Yes (ID: ${user.id})` : 'No')
    
    if (!user) {
      return ApiResponse.unauthorized('Authentication required')
    }

    const body = await parseJsonBody<z.infer<typeof addGamingAccountSchema>>(request)
    console.log('🔧 Parsed body:', JSON.stringify(body, null, 2))
    
    if (!body) {
      console.log('🔧 Error: Invalid request body')
      return ApiResponse.error('Invalid request body', 400)
    }

    const validation = addGamingAccountSchema.safeParse(body)
    console.log('🔧 Validation result:', validation.success ? 'Success' : 'Failed')
    if (!validation.success) {
      console.log('🔧 Validation errors:', validation.error.errors)
      return ApiResponse.error('Validation failed', 400, validation.error.errors)
    }

    const { platform, username, gameName, tagLine, game } = validation.data
    console.log('🔧 Extracted data:', { platform, username, gameName, tagLine, game })

    // Check if user already has this platform account
    const existingAccount = await prisma.gamingAccount.findFirst({
      where: {
        userId: user.id,
        platform
      }
    })

    if (existingAccount) {
      return ApiResponse.error('You already have a gaming account linked for this platform', 409)
    }

    let accountData: any = {
      userId: user.id,
      platform,
      username,
      platformId: '',
      verified: false
    }

    // For Riot accounts (Valorant/League), attempt automatic verification
    if ((platform === 'valorant' || platform === 'league') && gameName && tagLine) {
      console.log('🔧 Attempting Riot API verification for:', { gameName, tagLine, game })
      
      try {
        // Check if Riot API is available
        if (!process.env.RIOT_API_KEY) {
          console.warn('🔧 RIOT_API_KEY not configured, skipping automatic verification')
          // Still create the account, but unverified
          accountData = {
            userId: user.id,
            platform: 'riot',
            username: `${gameName}#${tagLine}`,
            platformId: `riot_${gameName}_${tagLine}`,
            verified: false
          }
        } else {
          // Dynamic import to avoid build-time initialization
          const { riotAPI } = await import('@/lib/riot-api')
          
          // Check if account exists in Riot API
          const riotAccount = await riotAPI.getAccountByRiotId(gameName, tagLine)
          console.log('🔧 Riot account found:', riotAccount)
          
          // Check if this Riot account is already linked to another user
          const existingRiotAccount = await prisma.gamingAccount.findFirst({
            where: {
              platform: 'riot',
              platformId: riotAccount.puuid
            }
          })

          if (existingRiotAccount && existingRiotAccount.userId !== user.id) {
            console.log('🔧 Account already linked to another user')
            return ApiResponse.error('This Riot account is already linked to another user', 409)
          }

          // Get additional account data
          let rank = null
          
          try {
            console.log('🔧 Fetching rank data...')
            rank = await riotAPI.getPlayerCurrentRank(riotAccount.puuid, game || 'VALORANT')
            console.log('🔧 Rank data:', rank)
          } catch (error) {
            console.warn('🔧 Could not fetch rank:', error)
          }

          // Account exists and is not linked to someone else - auto-verify
          accountData = {
            userId: user.id,
            platform: 'riot', // Use 'riot' as the unified platform
            username: `${gameName}#${tagLine}`,
            platformId: riotAccount.puuid,
            verified: true
          }
        }

      } catch (error: any) {
        console.error('🔧 Riot API error details:', {
          message: error.message,
          stack: error.stack,
          gameName,
          tagLine
        })
        
        // Handle specific API errors with user-friendly messages
        if (error.message.includes('404') || error.message.includes('not found')) {
          return ApiResponse.error(`Riot account "${gameName}#${tagLine}" not found. Please check your Riot ID and try again.`, 404)
        } else if (error.message.includes('403') || error.message.includes('forbidden')) {
          return ApiResponse.error('Unable to verify Riot account due to API restrictions. Please try again later.', 403)
        } else if (error.message.includes('429') || error.message.includes('rate limit')) {
          return ApiResponse.error('Too many requests. Please wait a moment and try again.', 429)
        } else if (error.message.includes('500') || error.message.includes('unavailable')) {
          return ApiResponse.error('Riot servers are currently unavailable. Please try again later.', 503)
        } else {
          console.error('🔧 Unexpected Riot API error:', error)
          return ApiResponse.error('Unable to verify Riot account at this time. Please try again later.', 500)
        }
      }
    } else {
      // For non-Riot platforms, check if username is already taken
      const usernameExists = await prisma.gamingAccount.findFirst({
        where: {
          platform,
          username
        }
      })

      if (usernameExists) {
        return ApiResponse.error('This username is already linked to another account', 409)
      }

      // Non-Riot accounts are automatically considered "verified" since we can't check them
      accountData.verified = true
    }

    const gamingAccount = await prisma.gamingAccount.create({
      data: accountData
    })
    
    console.log('🔧 Gaming account created successfully:', gamingAccount.id)

    // Determine if this was auto-verified (for Riot accounts)
    const wasAutoVerified = (platform === 'valorant' || platform === 'league') && gamingAccount.verified

    return ApiResponse.success({
      ...gamingAccount,
      autoVerified: wasAutoVerified
    }, wasAutoVerified ? 'Gaming account linked and verified successfully!' : 'Gaming account added successfully.')

  } catch (error: any) {
    console.error('🔧 POST /api/user/gaming-accounts error:', {
      message: error?.message,
      stack: error?.stack,
      name: error?.name
    })
    return handleApiError(error, 'add gaming account')
  }
}
