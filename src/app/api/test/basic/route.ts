import { NextRequest } from 'next/server'
import { ApiResponse } from '@/lib/api-utils'

export async function GET(request: NextRequest) {
  console.log('🔧 Basic test endpoint hit')
  return ApiResponse.success({ message: 'Server is working', timestamp: new Date().toISOString() })
}

export async function POST(request: NextRequest) {
  try {
    console.log('🔧 Basic POST test endpoint hit')
    const body = await request.json()
    console.log('🔧 Body received:', body)
    return ApiResponse.success({ 
      message: 'POST endpoint working', 
      receivedData: body,
      timestamp: new Date().toISOString() 
    })
  } catch (error) {
    console.error('🔧 Basic POST test error:', error)
    return ApiResponse.error('Failed to process POST request', 500)
  }
}
