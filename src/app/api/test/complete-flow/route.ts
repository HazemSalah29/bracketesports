import { NextRequest } from 'next/server'
import { ApiResponse } from '@/lib/api-utils'
import { apiClient } from '@/lib/api-client'

export async function POST(request: NextRequest) {
  try {
    console.log('🔧 Complete authentication flow test started')
    
    const body = await request.json()
    const { email, password } = body
    
    if (!email || !password) {
      return ApiResponse.error('Email and password required for test', 400)
    }
    
    // Step 1: Login via direct API call
    console.log('🔧 Step 1: Attempting login')
    const loginResponse = await fetch(`${request.nextUrl.origin}/api/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    })
    
    if (!loginResponse.ok) {
      console.log('🔧 Login failed:', loginResponse.status)
      return ApiResponse.error('Login failed', 401)
    }
    
    const loginData = await loginResponse.json()
    console.log('🔧 Login successful, token received')
    
    // Step 2: Test authenticated request
    console.log('🔧 Step 2: Testing authenticated gaming account request')
    const testAccountResponse = await fetch(`${request.nextUrl.origin}/api/user/gaming-accounts`, {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${loginData.data.token}`
      },
      body: JSON.stringify({
        platform: 'valorant',
        gameName: 'TestUser',
        tagLine: '123',
        username: 'TestUser#123',
        game: 'VALORANT'
      })
    })
    
    console.log('🔧 Gaming account request status:', testAccountResponse.status)
    
    let accountResult: any
    try {
      accountResult = await testAccountResponse.json()
      console.log('🔧 Gaming account response:', accountResult)
    } catch (error) {
      console.log('🔧 Failed to parse gaming account response')
      accountResult = { error: 'Failed to parse response' }
    }
    
    return ApiResponse.success({
      step1_login: {
        success: true,
        hasToken: !!loginData.data.token,
        tokenPreview: loginData.data.token.substring(0, 20) + '...'
      },
      step2_gamingAccount: {
        status: testAccountResponse.status,
        success: testAccountResponse.ok,
        response: accountResult
      },
      conclusion: testAccountResponse.ok ? 'Authentication flow works correctly!' : 'Authentication issue detected'
    })
    
  } catch (error: any) {
    console.error('🔧 Complete flow test error:', error)
    return ApiResponse.error(`Test failed: ${error.message}`, 500)
  }
}
