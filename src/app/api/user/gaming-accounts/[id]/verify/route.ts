import { NextRequest } from 'next/server'
import { prisma } from '@/lib/prisma'
import { riotAPI } from '@/lib/riot-api'
import { ApiResponse, authenticate } from '@/lib/api-utils'

// POST /api/user/gaming-accounts/[id]/verify - Verify and get account details
export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const user = await authenticate(request)
    if (!user) {
      return ApiResponse.unauthorized('Authentication required')
    }

    const accountId = params.id

    // Find the gaming account
    const gamingAccount = await prisma.gamingAccount.findFirst({
      where: {
        id: accountId,
        userId: user.id
      }
    })

    if (!gamingAccount) {
      return ApiResponse.error('Gaming account not found', 404)
    }

    // Only verify Riot accounts
    if (gamingAccount.platform !== 'riot') {
      return ApiResponse.error('Only Riot accounts can be verified', 400)
    }

    const metadata = gamingAccount.metadata as any
    if (!metadata?.gameName || !metadata?.tagLine) {
      return ApiResponse.error('Invalid account metadata', 400)
    }

    console.log('🔧 Verifying Riot account on demand:', {
      accountId,
      gameName: metadata.gameName,
      tagLine: metadata.tagLine,
      game: metadata.game
    })

    try {
      // Verify account exists in Riot API
      const riotAccount = await riotAPI.getAccountByRiotId(metadata.gameName, metadata.tagLine)
      console.log('🔧 Riot account verified:', riotAccount)
      
      // Check if this PUUID is already linked to another user
      const existingAccount = await prisma.gamingAccount.findFirst({
        where: {
          platformId: riotAccount.puuid,
          platform: 'riot',
          id: { not: accountId } // Exclude current account
        }
      })

      if (existingAccount) {
        return ApiResponse.error('This Riot account is already linked to another user', 409)
      }

      // Get rank information
      let rank = null
      try {
        rank = await riotAPI.getPlayerCurrentRank(riotAccount.puuid, metadata.game || 'VALORANT')
      } catch (error) {
        console.warn('🔧 Could not fetch rank:', error)
      }

      // Update the account with verification data
      const updatedAccount = await prisma.gamingAccount.update({
        where: { id: accountId },
        data: {
          platformId: riotAccount.puuid,
          verified: true,
          metadata: {
            ...metadata,
            puuid: riotAccount.puuid,
            gameName: riotAccount.gameName,
            tagLine: riotAccount.tagLine,
            currentRank: rank,
            verifiedAt: new Date(),
            pendingVerification: false
          }
        }
      })

      return ApiResponse.success({
        account: updatedAccount,
        riotData: {
          puuid: riotAccount.puuid,
          gameName: riotAccount.gameName,
          tagLine: riotAccount.tagLine,
          rank: rank
        }
      }, 'Account verified successfully!')

    } catch (riotError: any) {
      console.error('🔧 Riot API verification error:', {
        message: riotError.message,
        gameName: metadata.gameName,
        tagLine: metadata.tagLine
      })
      
      if (riotError.message.includes('404') || riotError.message.includes('not found')) {
        return ApiResponse.error(`Riot account "${metadata.gameName}#${metadata.tagLine}" not found. Please check your Riot ID.`, 404)
      } else if (riotError.message.includes('403') || riotError.message.includes('forbidden')) {
        return ApiResponse.error('Unable to verify account. Riot API access restricted.', 403)
      } else if (riotError.message.includes('429') || riotError.message.includes('rate limit')) {
        return ApiResponse.error('Rate limit exceeded. Please try again in a few seconds.', 429)
      } else if (riotError.message.includes('500') || riotError.status >= 500) {
        return ApiResponse.error('Riot servers are currently unavailable. Please try again later.', 500)
      }
      
      return ApiResponse.error(`Failed to verify account: ${riotError.message}`, 500)
    }

  } catch (error) {
    console.error('Account verification error:', error)
    return ApiResponse.serverError('An error occurred while verifying the account')
  }
}
