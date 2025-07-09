import { NextRequest } from 'next/server'
import { ApiResponse } from '@/lib/api-utils'

// GET /api/test/env - Check environment variables
export async function GET(request: NextRequest) {
  try {
    const envCheck = {
      RIOT_API_KEY: process.env.RIOT_API_KEY ? 
        `Set (${process.env.RIOT_API_KEY.substring(0, 10)}...)` : 
        'NOT SET',
      RIOT_API_BASE_URL: process.env.RIOT_API_BASE_URL || 'NOT SET',
      RIOT_VALORANT_API_BASE_URL: process.env.RIOT_VALORANT_API_BASE_URL || 'NOT SET',
      RIOT_LOL_API_BASE_URL: process.env.RIOT_LOL_API_BASE_URL || 'NOT SET',
      NODE_ENV: process.env.NODE_ENV || 'NOT SET'
    }

    console.log('🔧 Environment Variables Check:', envCheck)

    return ApiResponse.success(envCheck, 'Environment check complete')

  } catch (error: any) {
    console.error('❌ Environment check failed:', error)
    return ApiResponse.error('Environment check failed', 500)
  }
}
