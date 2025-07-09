import { NextRequest } from 'next/server'
import { ApiResponse, authenticate } from '@/lib/api-utils'

export async function GET(request: NextRequest) {
  try {
    console.log('🔧 Auth debug endpoint hit')
    console.log('🔧 Request headers:', Object.fromEntries(request.headers.entries()))
    
    const authHeader = request.headers.get('authorization')
    console.log('🔧 Auth header:', authHeader ? `${authHeader.substring(0, 20)}...` : 'null')
    
    const user = await authenticate(request)
    console.log('🔧 Authenticated user:', user)
    
    return ApiResponse.success({
      hasAuthHeader: !!authHeader,
      authHeaderPreview: authHeader ? `${authHeader.substring(0, 20)}...` : null,
      user: user,
      isAuthenticated: !!user,
      timestamp: new Date().toISOString()
    })
  } catch (error: any) {
    console.error('🔧 Auth debug error:', error)
    return ApiResponse.error(error.message, 500)
  }
}
