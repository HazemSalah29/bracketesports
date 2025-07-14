import { ApiResponse } from './api-utils'

// Riot Games API Interfaces
export interface RiotAccount {
  puuid: string
  gameName: string
  tagLine: string
}

export interface ValorantPlayerStats {
  puuid: string
  kills: number
  deaths: number
  assists: number
  score: number
  roundsPlayed: number
  roundsWon: number
  headshots: number
  bodyshots: number
  legshots: number
  damageDealt: number
  damageReceived: number
}

export interface ValorantMatch {
  matchId: string
  gameMode: string
  mapId: string
  mapName: string
  gameLengthMillis: number
  gameStartMillis: number
  isCompleted: boolean
  teams: ValorantTeam[]
  rounds: ValorantRound[]
  players: ValorantPlayerStats[]
}

export interface ValorantTeam {
  teamId: string
  won: boolean
  roundsPlayed: number
  roundsWon: number
  numPoints: number
}

export interface ValorantRound {
  roundNum: number
  roundResult: string
  roundCeremony: string
  winningTeam: string
  bombPlanter?: string
  bombDefuser?: string
  plantSite?: string
  defusedInTime?: boolean
  playerStats: ValorantRoundPlayerStats[]
}

export interface ValorantRoundPlayerStats {
  puuid: string
  kills: number
  damage: number
  stayed: boolean
  economy: {
    spent: number
    weapon: string
    armor: string
  }
}

export interface LeagueAccount {
  id: string
  accountId: string
  puuid: string
  name: string
  profileIconId: number
  revisionDate: number
  summonerLevel: number
}

export interface CustomGameLobby {
  lobbyId: string
  gameMode: 'VALORANT' | 'LEAGUE_OF_LEGENDS'
  password: string
  tournamentId: string
  participants: string[]
  status: 'CREATED' | 'IN_PROGRESS' | 'COMPLETED'
  createdAt: Date
  mapId?: string
  gameSettings?: Record<string, any>
}

class RiotGamesAPI {
  private apiKey: string
  private baseUrls: {
    americas: string
    valorant: string
    lol: string
  }
  private requestCounts: Map<string, { count: number; resetTime: number }> = new Map()

  constructor() {
    this.apiKey = process.env.RIOT_API_KEY || ''
    this.baseUrls = {
      americas: process.env.RIOT_API_BASE_URL || 'https://americas.api.riotgames.com',
      valorant: process.env.RIOT_VALORANT_API_BASE_URL || 'https://na.api.riotgames.com',
      lol: process.env.RIOT_LOL_API_BASE_URL || 'https://na1.api.riotgames.com'
    }

    console.log('🔧 Riot API initialized with:', {
      hasApiKey: !!this.apiKey,
      apiKeyLength: this.apiKey.length,
      baseUrls: this.baseUrls
    })

    if (!this.apiKey) {
      throw new Error('RIOT_API_KEY environment variable is required')
    }
  }

  private async rateLimitCheck(region: string): Promise<void> {
    const now = Date.now()
    const key = region
    
    if (!this.requestCounts.has(key)) {
      this.requestCounts.set(key, { count: 0, resetTime: now + 1000 })
    }
    
    const rateLimitData = this.requestCounts.get(key)!
    
    if (now > rateLimitData.resetTime) {
      rateLimitData.count = 0
      rateLimitData.resetTime = now + 1000
    }
    
    if (rateLimitData.count >= 15) { // Stay under the 20/second limit
      const waitTime = rateLimitData.resetTime - now
      if (waitTime > 0) {
        console.log(`🔧 Rate limit hit for ${region}, waiting ${waitTime}ms`)
        await new Promise(resolve => setTimeout(resolve, waitTime))
        rateLimitData.count = 0
        rateLimitData.resetTime = Date.now() + 1000
      }
    }
    
    rateLimitData.count++
  }

  private async makeRequest<T>(url: string, options: RequestInit = {}): Promise<T> {
    console.log('🔧 Riot API Request:', url)
    console.log('🔧 API Key (first 8 chars):', this.apiKey.substring(0, 8) + '...')
    
    // Extract region for rate limiting
    const region = url.includes('americas') ? 'americas' : 
                   url.includes('na.api') ? 'na' : 
                   url.includes('na1.api') ? 'na1' : 'default'
    
    await this.rateLimitCheck(region)
    
    const response = await fetch(url, {
      ...options,
      headers: {
        'X-Riot-Token': this.apiKey,
        'Content-Type': 'application/json',
        ...options.headers,
      },
    })

    console.log('🔧 Riot API Response status:', response.status, response.statusText)
    console.log('🔧 Response headers:', Object.fromEntries(response.headers.entries()))

    if (!response.ok) {
      const error = await response.text()
      console.log('🔧 Riot API Error response:', error)
      
      // Handle specific error cases
      if (response.status === 403) {
        throw new Error(`Riot API access forbidden. Please check your API key. Status: ${response.status}`)
      } else if (response.status === 404) {
        throw new Error(`Riot account not found. Please check the Riot ID and tag. Status: ${response.status}`)
      } else if (response.status === 429) {
        throw new Error(`Rate limit exceeded. Please wait a moment and try again. Status: ${response.status}`)
      } else if (response.status >= 500) {
        throw new Error(`Riot servers are currently unavailable. Please try again later. Status: ${response.status}`)
      } else {
        throw new Error(`Riot API Error: ${response.status} - ${error}`)
      }
    }

    const data = await response.json()
    console.log('🔧 Riot API Success response:', data)
    return data
  }

  // Account Linking & Verification
  async getAccountByRiotId(gameName: string, tagLine: string): Promise<RiotAccount> {
    const url = `${this.baseUrls.americas}/riot/account/v1/accounts/by-riot-id/${gameName}/${tagLine}`
    return this.makeRequest<RiotAccount>(url)
  }

  async getAccountByPuuid(puuid: string): Promise<RiotAccount> {
    const url = `${this.baseUrls.americas}/riot/account/v1/accounts/by-puuid/${puuid}`
    return this.makeRequest<RiotAccount>(url)
  }

  // Valorant Specific APIs
  async getValorantAccountByPuuid(puuid: string): Promise<any> {
    const url = `${this.baseUrls.valorant}/val/content/v1/contents`
    return this.makeRequest(url)
  }

  async getValorantMatchHistory(puuid: string): Promise<{ history: { matchId: string; gameStartTimeMillis: number }[] }> {
    const url = `${this.baseUrls.valorant}/val/match/v1/matchlists/by-puuid/${puuid}`
    return this.makeRequest(url)
  }

  async getValorantMatch(matchId: string): Promise<ValorantMatch> {
    const url = `${this.baseUrls.valorant}/val/match/v1/matches/${matchId}`
    return this.makeRequest(url)
  }

  async getValorantRankedStats(puuid: string): Promise<any> {
    const url = `${this.baseUrls.valorant}/val/ranked/v1/leaderboards/by-act/97b6e739-44cc-ffa7-49ad-398ba502ceb0?size=1&startIndex=0&puuid=${puuid}`
    return this.makeRequest(url)
  }

  // League of Legends Specific APIs
  async getLeagueAccountByName(summonerName: string): Promise<LeagueAccount> {
    const url = `${this.baseUrls.lol}/lol/summoner/v4/summoners/by-name/${encodeURIComponent(summonerName)}`
    return this.makeRequest<LeagueAccount>(url)
  }

  async getLeagueAccountByPuuid(puuid: string): Promise<LeagueAccount> {
    const url = `${this.baseUrls.lol}/lol/summoner/v4/summoners/by-puuid/${puuid}`
    return this.makeRequest<LeagueAccount>(url)
  }

  async getLeagueMatchHistory(puuid: string): Promise<string[]> {
    const url = `${this.baseUrls.americas}/lol/match/v5/matches/by-puuid/${puuid}/ids?start=0&count=20`
    return this.makeRequest<string[]>(url)
  }

  async getLeagueMatch(matchId: string): Promise<any> {
    const url = `${this.baseUrls.americas}/lol/match/v5/matches/${matchId}`
    return this.makeRequest(url)
  }

  // Custom Game Lobby Creation (Note: These APIs are limited and may require special access)
  async createValorantCustomGame(settings: {
    gameMode: string
    mapId: string
    teamSize: number
    allowCheats?: boolean
    tournamentCode?: string
  }): Promise<{ lobbyId: string; password: string }> {
    // Note: This is a placeholder implementation
    // Real custom game creation requires tournament API access from Riot
    const password = this.generateCustomGamePassword()
    const lobbyId = `VCG_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
    
    // In a real implementation, this would make a request to Riot's Tournament API
    // For now, we'll simulate the lobby creation
    return {
      lobbyId,
      password
    }
  }

  async createLeagueCustomGame(settings: {
    gameMode: string
    mapId: string
    teamSize: number
    pickType: string
    tournamentCode?: string
  }): Promise<{ lobbyId: string; password: string }> {
    // Note: This is a placeholder implementation
    // Real custom game creation requires tournament API access from Riot
    const password = this.generateCustomGamePassword()
    const lobbyId = `LCG_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
    
    return {
      lobbyId,
      password
    }
  }

  private generateCustomGamePassword(): string {
    const length = parseInt(process.env.VALORANT_CUSTOM_GAME_PASSWORD_LENGTH || '8')
    const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789' // Avoid confusing characters
    let password = ''
    for (let i = 0; i < length; i++) {
      password += chars.charAt(Math.floor(Math.random() * chars.length))
    }
    return password
  }

  // Tournament Integration Methods
  async verifyPlayerOwnership(puuid: string, verificationCode: string): Promise<boolean> {
    // This would require the player to set their Riot ID to a verification code temporarily
    // Then we check if their current Riot ID matches the code
    try {
      const account = await this.getAccountByPuuid(puuid)
      return account.gameName.includes(verificationCode) || account.tagLine.includes(verificationCode)
    } catch (error) {
      return false
    }
  }

  async getPlayerCurrentRank(puuid: string, game: 'VALORANT' | 'LEAGUE_OF_LEGENDS'): Promise<{ tier: string; division: number; lp: number }> {
    try {
      if (game === 'VALORANT') {
        const stats = await this.getValorantRankedStats(puuid)
        // Parse Valorant rank data
        return {
          tier: 'Iron', // Placeholder - parse from actual response
          division: 1,
          lp: 0
        }
      } else if (game === 'LEAGUE_OF_LEGENDS') {
        // League rank fetching would go here
        return {
          tier: 'Iron',
          division: 4,
          lp: 0
        }
      } else {
        throw new Error(`Unsupported game: ${game}`)
      }
    } catch (error) {
      throw new Error(`Failed to fetch rank for ${game}: ${error}`)
    }
  }
}

export const riotAPI = new RiotGamesAPI()
export default riotAPI
