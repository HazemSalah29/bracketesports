import { NextRequest } from 'next/server'
import { ApiResponse } from '@/lib/api-utils'

// GET /api/test/riot - Test Riot API connection
export async function GET(request: NextRequest) {
  try {
    // Check if RIOT_API_KEY is available
    if (!process.env.RIOT_API_KEY) {
      return ApiResponse.error('RIOT_API_KEY environment variable is not configured', 500)
    }

    // Dynamically import riot API to avoid initialization during build
    const { riotAPI } = await import('@/lib/riot-api')
    
    // Get test parameters from URL
    const { searchParams } = new URL(request.url)
    const gameName = searchParams.get('gameName') || 'TTV RyanCentral'
    const tagLine = searchParams.get('tagLine') || 'uwu'

    console.log('🧪 Testing Riot API with:', { gameName, tagLine })

    // Test the API connection
    const testResult = await riotAPI.getAccountByRiotId(gameName, tagLine)
    
    console.log('✅ Riot API test successful:', testResult)

    return ApiResponse.success({
      success: true,
      account: testResult,
      message: 'Riot API is working correctly'
    }, 'API test successful')

  } catch (error: any) {
    console.error('❌ Riot API test failed:', error)
    
    const errorInfo = {
      success: false,
      error: error.message,
      possibleCauses: [
        'Missing RIOT_API_KEY environment variable',
        'Invalid API key',
        'Rate limit exceeded',
        'Riot API service down',
        'Network connectivity issue'
      ],
      suggestions: [
        'Check environment variables are set',
        'Verify API key is valid and active',
        'Wait a few minutes if rate limited',
        'Check Riot API status page'
      ]
    }

    return ApiResponse.error('Riot API test failed', 500, errorInfo)
  }
}
