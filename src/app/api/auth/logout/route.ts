import { NextRequest } from 'next/server'
import { ApiResponse, authenticate } from '@/lib/api-utils'
import { prisma } from '@/lib/prisma'

export async function POST(request: NextRequest) {
  try {
    const user = await authenticate(request)
    
    if (!user) {
      return ApiResponse.unauthorized('Authentication required')
    }

    // Get token from header
    const token = request.headers.get('authorization')?.replace('Bearer ', '')
    
    if (token) {
      // Delete the session from database
      await prisma.session.deleteMany({
        where: {
          token,
          userId: user.id
        }
      })
    }

    return ApiResponse.success(null, 'Logout successful')

  } catch (error) {
    console.error('Logout error:', error)
    return ApiResponse.serverError('An error occurred during logout')
  }
}
