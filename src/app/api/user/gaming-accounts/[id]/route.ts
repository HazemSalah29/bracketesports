import { NextRequest } from 'next/server'
import { z } from 'zod'
import { ApiResponse, authenticate, handleApiError, parseJsonBody } from '@/lib/api-utils'
import { prisma } from '@/lib/prisma'

const updateGamingAccountSchema = z.object({
  username: z.string().min(1),
})

// PUT /api/user/gaming-accounts/[id] - Update a gaming account
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const user = await authenticate(request)
    
    if (!user) {
      return ApiResponse.unauthorized('Authentication required')
    }

    const body = await parseJsonBody<z.infer<typeof updateGamingAccountSchema>>(request)
    
    if (!body) {
      return ApiResponse.error('Invalid request body', 400)
    }

    const validation = updateGamingAccountSchema.safeParse(body)
    if (!validation.success) {
      return ApiResponse.error('Validation failed', 400, validation.error.errors)
    }

    const { username } = validation.data

    // Check if account exists and belongs to user
    const existingAccount = await prisma.gamingAccount.findFirst({
      where: {
        id: params.id,
        userId: user.id
      }
    })

    if (!existingAccount) {
      return ApiResponse.notFound('Gaming account not found')
    }

    // Check if new username is already taken for this platform
    const usernameExists = await prisma.gamingAccount.findFirst({
      where: {
        platform: existingAccount.platform,
        username,
        id: { not: params.id }
      }
    })

    if (usernameExists) {
      return ApiResponse.error('Username is already taken for this platform', 409)
    }

    const updatedAccount = await prisma.gamingAccount.update({
      where: { id: params.id },
      data: {
        username,
        verified: false // Reset verification when username changes
      }
    })

    return ApiResponse.success(updatedAccount, 'Gaming account updated successfully')

  } catch (error) {
    return handleApiError(error, 'update gaming account')
  }
}

// DELETE /api/user/gaming-accounts/[id] - Delete a gaming account
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const user = await authenticate(request)
    
    if (!user) {
      return ApiResponse.unauthorized('Authentication required')
    }

    // Check if account exists and belongs to user
    const existingAccount = await prisma.gamingAccount.findFirst({
      where: {
        id: params.id,
        userId: user.id
      }
    })

    if (!existingAccount) {
      return ApiResponse.notFound('Gaming account not found')
    }

    await prisma.gamingAccount.delete({
      where: { id: params.id }
    })

    return ApiResponse.success(null, 'Gaming account deleted successfully')

  } catch (error) {
    return handleApiError(error, 'delete gaming account')
  }
}
