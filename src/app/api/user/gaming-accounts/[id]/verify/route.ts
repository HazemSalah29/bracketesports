import { NextRequest } from 'next/server'
import { ApiResponse, authenticate, handleApiError } from '@/lib/api-utils'
import { prisma } from '@/lib/prisma'

// POST /api/user/gaming-accounts/[id]/verify - Verify a gaming account
export async function POST(
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

    if (gamingAccount.verified) {
      return ApiResponse.error('Account is already verified', 400)
    }

    if (gamingAccount.platform !== 'riot') {
      return ApiResponse.error('Only Riot accounts can be verified', 400)
    }

    const gameName = gamingAccount.username.split('#')[0] || gamingAccount.username
    const tagLine = gamingAccount.username.split('#')[1] || '000'
    
    console.log('Verifying Riot account:', {
      accountId,
      gameName,
      tagLine,
      platform: gamingAccount.platform
    })

    const updatedAccount = await prisma.gamingAccount.update({
      where: { id: accountId },
      data: { 
        verified: true 
      }
    })

    return ApiResponse.success(
      {
        id: updatedAccount.id,
        platform: updatedAccount.platform,
        username: updatedAccount.username,
        verified: updatedAccount.verified
      },
      'Account verified successfully'
    )

  } catch (error) {
    return handleApiError(error, 'verify gaming account')
  }
}
