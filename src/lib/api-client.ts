import { API_ENDPOINTS } from '@/constants/keys'
import type {
  TournamentResponse,
  CreateTournamentRequest,
  UserResponse,
  TeamResponse,
  CreateTeamRequest,
  NotificationResponse,
  LeaderboardEntry,
  AnalyticsResponse,
  LoginRequest,
  RegisterRequest,
  AuthResponse,
  GamingAccountRequest,
  GamingAccountResponse,
  PaginatedApiResponse,
  ApiSuccessResponse,
} from '@/types/api'

class ApiClient {
  private baseURL = process.env.NEXT_PUBLIC_API_URL || ''
  private token: string | null = null

  constructor() {
    // Get token from localStorage if available
    if (typeof window !== 'undefined') {
      this.token = localStorage.getItem('auth_token')
    }
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    // If baseURL is empty, use current origin for same-origin requests
    const baseUrl = this.baseURL || (typeof window !== 'undefined' ? window.location.origin : '')
    const url = `${baseUrl}${endpoint}`
    
    console.log('🔧 API Request:', { 
      baseUrl: this.baseURL, 
      resolvedBaseUrl: baseUrl,
      endpoint,
      url, 
      method: options.method || 'GET' 
    })
    console.log('🔧 Request body:', options.body)
    
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
      ...(options.headers as Record<string, string>),
    }

    if (this.token) {
      (headers as Record<string, string>).Authorization = `Bearer ${this.token}`
    }

    console.log('🔧 Request headers:', headers)

    try {
      const response = await fetch(url, {
        ...options,
        headers,
      })

      console.log('🔧 Response status:', response.status, response.statusText)

      if (!response.ok) {
        let errorData: any = { message: 'Request failed' }
        try {
          errorData = await response.json()
        } catch (parseError) {
          console.log('🔧 Failed to parse error response as JSON:', parseError)
          errorData = { message: `HTTP ${response.status}: ${response.statusText}` }
        }
        console.log('🔧 Error response:', errorData)
        
        // Handle specific status codes
        let errorMessage = errorData.message || 'Request failed'
        
        if (response.status === 401) {
          errorMessage = 'Authentication required. Please log in to continue.'
          // Clear invalid token
          this.clearToken()
        } else if (response.status === 403) {
          errorMessage = 'Access denied. You do not have permission to perform this action.'
        } else if (response.status === 404) {
          errorMessage = errorData.message || 'Resource not found.'
        } else if (response.status === 409) {
          errorMessage = errorData.message || 'Conflict: Resource already exists.'
        } else if (response.status === 429) {
          errorMessage = 'Too many requests. Please wait a moment and try again.'
        } else if (response.status >= 500) {
          errorMessage = 'Server error. Please try again later.'
        }
        
        const error = new Error(errorMessage)
        ;(error as any).response = errorData
        ;(error as any).status = response.status
        throw error
      }

      const responseData = await response.json()
      console.log('🔧 Success response:', responseData)
      return responseData
    } catch (fetchError: any) {
      console.error('🔧 Fetch error:', fetchError)
      
      // If it's a network error (no response), enhance the error message
      if (fetchError.name === 'TypeError' || !fetchError.response) {
        const networkError = new Error('Network error: Unable to connect to the server. Please check your connection.')
        ;(networkError as any).originalError = fetchError
        throw networkError
      }
      
      // Re-throw other errors as-is
      throw fetchError
    }
  }

  // Authentication methods
  setToken(token: string) {
    this.token = token
    if (typeof window !== 'undefined') {
      localStorage.setItem('auth_token', token)
    }
  }

  clearToken() {
    this.token = null
    if (typeof window !== 'undefined') {
      localStorage.removeItem('auth_token')
    }
  }

  async login(data: LoginRequest): Promise<AuthResponse> {
    const response = await this.request<ApiSuccessResponse<AuthResponse>>(
      API_ENDPOINTS.AUTH.LOGIN,
      {
        method: 'POST',
        body: JSON.stringify(data),
      }
    )
    
    this.setToken(response.data.token)
    return response.data
  }

  async register(data: RegisterRequest): Promise<AuthResponse> {
    const response = await this.request<ApiSuccessResponse<AuthResponse>>(
      API_ENDPOINTS.AUTH.REGISTER,
      {
        method: 'POST',
        body: JSON.stringify(data),
      }
    )
    
    this.setToken(response.data.token)
    return response.data
  }

  async logout(): Promise<void> {
    await this.request(API_ENDPOINTS.AUTH.LOGOUT, { method: 'POST' })
    this.clearToken()
  }

  // User methods
  async getProfile(): Promise<UserResponse> {
    const response = await this.request<ApiSuccessResponse<UserResponse>>(
      API_ENDPOINTS.USERS.PROFILE
    )
    return response.data
  }

  async updateProfile(data: Partial<UserResponse>): Promise<UserResponse> {
    const response = await this.request<ApiSuccessResponse<UserResponse>>(
      API_ENDPOINTS.USERS.UPDATE_PROFILE,
      {
        method: 'PUT',
        body: JSON.stringify(data),
      }
    )
    return response.data
  }

  async linkGamingAccount(data: GamingAccountRequest): Promise<GamingAccountResponse> {
    const response = await this.request<ApiSuccessResponse<GamingAccountResponse>>(
      API_ENDPOINTS.USERS.LINK_GAMING_ACCOUNT,
      {
        method: 'POST',
        body: JSON.stringify(data),
      }
    )
    return response.data
  }

  async getGamingAccounts(): Promise<GamingAccountResponse[]> {
    const response = await this.request<ApiSuccessResponse<GamingAccountResponse[]>>(
      API_ENDPOINTS.USERS.GET_GAMING_ACCOUNTS
    )
    return response.data
  }

  async addGamingAccount(data: any): Promise<ApiSuccessResponse<GamingAccountResponse>> {
    try {
      console.log('🔧 addGamingAccount called with:', data)
      console.log('🔧 Current token:', this.token ? `${this.token.substring(0, 20)}...` : 'null')
      
      const result = await this.request<ApiSuccessResponse<GamingAccountResponse>>(
        API_ENDPOINTS.USERS.ADD_GAMING_ACCOUNT,
        {
          method: 'POST',
          body: JSON.stringify(data),
        }
      )
      
      console.log('🔧 addGamingAccount success:', result)
      return result
    } catch (error: any) {
      console.error('🔧 addGamingAccount error in API client:', error)
      // Re-throw with additional context
      const enhancedError = new Error(error?.message || 'An unexpected error occurred')
      ;(enhancedError as any).response = error?.response
      ;(enhancedError as any).status = error?.status
      ;(enhancedError as any).originalError = error
      throw enhancedError
    }
  }

  async updateGamingAccount(accountId: string, data: any): Promise<ApiSuccessResponse<GamingAccountResponse>> {
    return await this.request<ApiSuccessResponse<GamingAccountResponse>>(
      `/api/user/gaming-accounts/${accountId}`,
      {
        method: 'PUT',
        body: JSON.stringify(data),
      }
    )
  }

  async deleteGamingAccount(accountId: string): Promise<ApiSuccessResponse<void>> {
    return await this.request<ApiSuccessResponse<void>>(
      `/api/user/gaming-accounts/${accountId}`,
      {
        method: 'DELETE',
      }
    )
  }

  async startRiotAccountVerification(data: {
    platform: 'riot'
    gameName: string
    tagLine: string
    game: 'VALORANT' | 'LEAGUE_OF_LEGENDS'
  }): Promise<ApiSuccessResponse<{ verificationCode: string; instructions: string }>> {
    return await this.request<ApiSuccessResponse<{ verificationCode: string; instructions: string }>>(
      API_ENDPOINTS.USERS.VERIFY_GAMING_ACCOUNT,
      {
        method: 'POST',
        body: JSON.stringify(data),
      }
    )
  }

  async completeRiotAccountVerification(data: {
    platform: 'riot'
    gameName: string
    tagLine: string
    game: 'VALORANT' | 'LEAGUE_OF_LEGENDS'
    verificationCode: string
  }): Promise<ApiSuccessResponse<{ account: GamingAccountResponse }>> {
    return await this.request<ApiSuccessResponse<{ account: GamingAccountResponse }>>(
      API_ENDPOINTS.USERS.VERIFY_GAMING_ACCOUNT,
      {
        method: 'PUT',
        body: JSON.stringify(data),
      }
    )
  }

  // Tournament methods
  async getTournaments(params?: {
    page?: number
    limit?: number
    game?: string
    status?: string
    type?: string
    search?: string
  }): Promise<PaginatedApiResponse<TournamentResponse>['data']> {
    const searchParams = new URLSearchParams()
    
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined) {
          searchParams.append(key, String(value))
        }
      })
    }

    const response = await this.request<PaginatedApiResponse<TournamentResponse>>(
      `${API_ENDPOINTS.TOURNAMENTS.LIST}?${searchParams}`
    )
    return response.data
  }

  async getTournament(id: string): Promise<TournamentResponse> {
    const response = await this.request<ApiSuccessResponse<TournamentResponse>>(
      API_ENDPOINTS.TOURNAMENTS.GET_BY_ID(id)
    )
    return response.data
  }

  async createTournament(data: CreateTournamentRequest): Promise<TournamentResponse> {
    const response = await this.request<ApiSuccessResponse<TournamentResponse>>(
      API_ENDPOINTS.TOURNAMENTS.CREATE,
      {
        method: 'POST',
        body: JSON.stringify(data),
      }
    )
    return response.data
  }

  async joinTournament(id: string): Promise<void> {
    await this.request(API_ENDPOINTS.TOURNAMENTS.JOIN(id), { method: 'POST' })
  }

  async leaveTournament(id: string): Promise<void> {
    await this.request(API_ENDPOINTS.TOURNAMENTS.LEAVE(id), { method: 'DELETE' })
  }

  // Team methods
  async getTeams(params?: {
    page?: number
    limit?: number
    search?: string
  }): Promise<PaginatedApiResponse<TeamResponse>['data']> {
    const searchParams = new URLSearchParams()
    
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined) {
          searchParams.append(key, String(value))
        }
      })
    }

    const response = await this.request<PaginatedApiResponse<TeamResponse>>(
      `${API_ENDPOINTS.TEAMS.LIST}?${searchParams}`
    )
    return response.data
  }

  async getTeam(id: string): Promise<TeamResponse> {
    const response = await this.request<ApiSuccessResponse<TeamResponse>>(
      API_ENDPOINTS.TEAMS.GET_BY_ID(id)
    )
    return response.data
  }

  async createTeam(data: CreateTeamRequest): Promise<TeamResponse> {
    const response = await this.request<ApiSuccessResponse<TeamResponse>>(
      API_ENDPOINTS.TEAMS.CREATE,
      {
        method: 'POST',
        body: JSON.stringify(data),
      }
    )
    return response.data
  }

  async joinTeam(id: string): Promise<void> {
    await this.request(API_ENDPOINTS.TEAMS.JOIN(id), { method: 'POST' })
  }

  async leaveTeam(id: string): Promise<void> {
    await this.request(API_ENDPOINTS.TEAMS.LEAVE(id), { method: 'DELETE' })
  }

  // Leaderboard methods
  async getGlobalLeaderboard(params?: {
    page?: number
    limit?: number
  }): Promise<PaginatedApiResponse<LeaderboardEntry>['data']> {
    const searchParams = new URLSearchParams()
    
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined) {
          searchParams.append(key, String(value))
        }
      })
    }

    const response = await this.request<PaginatedApiResponse<LeaderboardEntry>>(
      `${API_ENDPOINTS.LEADERBOARD.GLOBAL}?${searchParams}`
    )
    return response.data
  }

  async getGameLeaderboard(game: string, params?: {
    page?: number
    limit?: number
  }): Promise<PaginatedApiResponse<LeaderboardEntry>['data']> {
    const searchParams = new URLSearchParams()
    
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined) {
          searchParams.append(key, String(value))
        }
      })
    }

    const response = await this.request<PaginatedApiResponse<LeaderboardEntry>>(
      `${API_ENDPOINTS.LEADERBOARD.BY_GAME(game)}?${searchParams}`
    )
    return response.data
  }

  // Analytics methods
  async getUserStats(): Promise<AnalyticsResponse> {
    const response = await this.request<ApiSuccessResponse<AnalyticsResponse>>(
      API_ENDPOINTS.ANALYTICS.USER_STATS
    )
    return response.data
  }

  // Notifications methods
  async getNotifications(params?: {
    page?: number
    limit?: number
  }): Promise<PaginatedApiResponse<NotificationResponse>['data']> {
    const searchParams = new URLSearchParams()
    
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined) {
          searchParams.append(key, String(value))
        }
      })
    }

    const response = await this.request<PaginatedApiResponse<NotificationResponse>>(
      `${API_ENDPOINTS.NOTIFICATIONS.LIST}?${searchParams}`
    )
    return response.data
  }

  async markNotificationRead(id: string): Promise<void> {
    await this.request(API_ENDPOINTS.NOTIFICATIONS.MARK_READ(id), { method: 'PUT' })
  }

  async markAllNotificationsRead(): Promise<void> {
    await this.request(API_ENDPOINTS.NOTIFICATIONS.MARK_ALL_READ, { method: 'PUT' })
  }

  async getUserActivity(limit?: number): Promise<any> {
    const searchParams = new URLSearchParams()
    if (limit) {
      searchParams.append('limit', String(limit))
    }
    
    const response = await this.request<ApiSuccessResponse<any>>(
      `${API_ENDPOINTS.USERS.ACTIVITY}?${searchParams}`
    )
    return response.data
  }
}

// Export singleton instance
export const apiClient = new ApiClient()

// Export individual methods for easier importing
export const {
  login,
  register,
  logout,
  getProfile,
  updateProfile,
  linkGamingAccount,
  getGamingAccounts,
  getTournaments,
  getTournament,
  createTournament,
  joinTournament,
  leaveTournament,
  getTeams,
  getTeam,
  createTeam,
  joinTeam,
  leaveTeam,
  getGlobalLeaderboard,
  getGameLeaderboard,
  getUserStats,
  getNotifications,
  markNotificationRead,
  markAllNotificationsRead,
  getUserActivity,
} = apiClient
